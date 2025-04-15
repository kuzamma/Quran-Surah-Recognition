import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import surahs, { Surah } from '@/constants/surahs';
import { processRecording } from '@/ml/featureExtraction';
import { loadSVMModel } from '@/ml/svmModel';

interface RecordingHistoryItem {
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
      isRecording: false,
      recordingUri: null,
      recognitionResult: null,
      isProcessing: false,
      modelLoaded: false,
      history: [],
      
      setIsRecording: (isRecording) => set({ isRecording }),
      
      setRecordingUri: (uri) => set({ recordingUri: uri }),
      
      recognizeSurah: async () => {
        const { recordingUri } = get();
        if (!recordingUri) return;

        set({ isProcessing: true, recognitionResult: null });
        
        try {
          const result = await processRecording(recordingUri);
          const recognizedSurah = result.surahId 
            ? surahs.find(s => s.id === result.surahId) 
            : undefined;

          set({
            recognitionResult: {
              recognized: result.recognized,
              surah: recognizedSurah,
              confidence: result.confidence,
            }
          });

          get().addToHistory({
            timestamp: Date.now(),
            recognized: result.recognized,
            surahId: result.surahId || undefined,
            surahName: recognizedSurah?.nameEnglish,
            confidence: result.confidence,
          });
        } catch (error) {
          console.error('Recognition failed:', error);
          set({
            recognitionResult: {
              recognized: false,
              confidence: 0,
            }
          });
        } finally {
          set({ isProcessing: false });
        }
      },
      
      loadModel: async () => {
        try {
          const loaded = await loadSVMModel();
          set({ modelLoaded: loaded });
        } catch (error) {
          console.error('Model loading failed:', error);
          set({ modelLoaded: false });
        }
      },
      
      clearHistory: () => set({ history: [] }),
      
      addToHistory: (item) => set((state) => ({
        history: [{
          ...item,
          id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        }, ...state.history].slice(0, 50)
      })),
    }),
    {
      name: 'recording-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        history: state.history,
        modelLoaded: state.modelLoaded,
      }),
    }
  )
);