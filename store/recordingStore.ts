import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import surahs, { Surah } from '@/constants/surahs';
import { extractMFCCFeatures, preprocessAudio } from '@/ml/featureExtraction';
import { predictSurah, loadSVMModel } from '@/ml/svmModel';

export interface RecordingHistoryItem {
  id: string;
  timestamp: number;
  recognized: boolean;
  surahId?: number;
  surahName?: string;
  confidence: number;
}

interface RecordingState {
  isRecording: boolean;
  recordingUri: string | null;
  recognitionResult: {
    recognized: boolean;
    surah?: Surah;
    confidence?: number;
  } | null;
  isProcessing: boolean;
  modelLoaded: boolean;
  history: RecordingHistoryItem[];
  
  // Actions
  setIsRecording: (isRecording: boolean) => void;
  setRecordingUri: (uri: string | null) => void;
  recognizeSurah: () => Promise<void>;
  loadModel: () => Promise<void>;
  clearHistory: () => void;
  addToHistory: (item: Omit<RecordingHistoryItem, 'id'>) => void;
}

export const useRecordingStore = create<RecordingState>()(
  persist(
    (set, get) => ({
      // State
      isRecording: false,
      recordingUri: null,
      recognitionResult: null,
      isProcessing: false,
      modelLoaded: false,
      history: [],
      
      // Actions
      setIsRecording: (isRecording) => set({ isRecording }),
      
      setRecordingUri: (uri) => set({ recordingUri: uri }),
      
      recognizeSurah: async () => {
        const { recordingUri } = get();
        
        if (!recordingUri) {
          console.error('No recording URI available');
          return;
        }
        
        set({ isProcessing: true });
        
        try {
          // Preprocess the audio
          const processedUri = await preprocessAudio(recordingUri);
          
          if (!processedUri) {
            throw new Error('Audio preprocessing failed');
          }
          
          // Extract features and get API result
          const apiResult = await extractMFCCFeatures(processedUri);
          
          if (!apiResult) {
            throw new Error('Feature extraction failed');
          }
          
          // Predict the surah using the API result
          const prediction = await predictSurah(apiResult);
          
          // Find the surah object based on the predicted ID
          const recognizedSurah = prediction.surahId 
            ? surahs.find(s => s.id === prediction.surahId) 
            : undefined;
          
          // Set the recognition result
          set({
            recognitionResult: {
              recognized: prediction.recognized,
              surah: recognizedSurah,
              confidence: prediction.confidence,
            },
            isProcessing: false,
          });
          
          // Add to history
          get().addToHistory({
            timestamp: Date.now(),
            recognized: prediction.recognized,
            surahId: prediction.surahId || undefined,
            surahName: recognizedSurah?.nameEnglish,
            confidence: prediction.confidence,
          });
          
        } catch (error) {
          console.error('Error recognizing surah:', error);
          
          // Set a failed recognition result
          set({
            recognitionResult: {
              recognized: false,
              confidence: 0,
            },
            isProcessing: false,
          });
          
          // Add failed recognition to history
          get().addToHistory({
            timestamp: Date.now(),
            recognized: false,
            confidence: 0,
          });
        }
      },
      
      loadModel: async () => {
        try {
          const loaded = await loadSVMModel();
          set({ modelLoaded: loaded });
        } catch (error) {
          console.error('Error loading model:', error);
          set({ modelLoaded: false });
        }
      },
      
      clearHistory: () => set({ history: [] }),
      
      addToHistory: (item) => set((state) => ({
        history: [
          {
            ...item,
            id: `recording-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          },
          ...state.history,
        ].slice(0, 50), // Keep only the last 50 recordings
      })),
    }),
    {
      name: 'quran-recognition-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist these fields
        history: state.history,
        modelLoaded: state.modelLoaded,
      }),
    }
  )
);