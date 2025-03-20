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
    confidence: number;
  } | null;
  history: RecordingHistoryItem[];
  modelLoaded: boolean;
  isProcessing: boolean;
  setIsRecording: (isRecording: boolean) => void;
  setRecordingUri: (uri: string | null) => void;
  recognizeSurah: () => Promise<void>;
  addToHistory: (item: Omit<RecordingHistoryItem, 'id'>) => void;
  clearHistory: () => void;
  loadModel: () => Promise<void>;
}

export const useRecordingStore = create<RecordingState>()(
  persist(
    (set, get) => ({
      isRecording: false,
      recordingUri: null,
      recognitionResult: null,
      history: [],
      modelLoaded: false,
      isProcessing: false,
      
      setIsRecording: (isRecording) => set({ isRecording }),
      
      setRecordingUri: (uri) => set({ recordingUri: uri }),
      
      loadModel: async () => {
        if (!get().modelLoaded) {
          const loaded = await loadSVMModel();
          set({ modelLoaded: loaded });
        }
      },
      
      recognizeSurah: async () => {
        const { recordingUri } = get();
        
        set({ isProcessing: true });
        
        try {
          // Ensure model is loaded
          if (!get().modelLoaded) {
            await get().loadModel();
          }
          
          // Preprocess the audio
          const processedAudio = await preprocessAudio(recordingUri);
          
          // Extract MFCC features
          const features = await extractMFCCFeatures(processedAudio);
          
          // Use model to predict Surah
          let result;
          
          if (features) {
            result = await predictSurah(features);
          } else {
            result = { recognized: false, confidence: 0, surahId: null };
          }
          
          if (result.recognized && result.surahId) {
            const recognizedSurah = surahs.find(s => s.id === result.surahId);
            
            if (recognizedSurah) {
              set({ 
                recognitionResult: {
                  recognized: true,
                  surah: recognizedSurah,
                  confidence: result.confidence,
                },
                isProcessing: false
              });
              
              // Add to history
              get().addToHistory({
                timestamp: Date.now(),
                recognized: true,
                surahId: recognizedSurah.id,
                surahName: recognizedSurah.nameEnglish,
                confidence: result.confidence,
              });
              
              return;
            }
          }
          
          set({ 
            recognitionResult: {
              recognized: false,
              confidence: result.confidence || 0,
            },
            isProcessing: false
          });
          
          // Add to history
          get().addToHistory({
            timestamp: Date.now(),
            recognized: false,
            confidence: result.confidence || 0,
          });
        } catch (error) {
          console.error('Error in recognizeSurah:', error);
          
          set({ 
            recognitionResult: {
              recognized: false,
              confidence: 0,
            },
            isProcessing: false
          });
          
          // Add to history with error
          get().addToHistory({
            timestamp: Date.now(),
            recognized: false,
            confidence: 0,
          });
        }
      },
      
      addToHistory: (item) => {
        const newItem: RecordingHistoryItem = {
          ...item,
          id: Date.now().toString(),
        };
        
        set((state) => ({
          history: [newItem, ...state.history].slice(0, 50), // Keep only the last 50 items
        }));
      },
      
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'recording-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ history: state.history }),
    }
  )
);