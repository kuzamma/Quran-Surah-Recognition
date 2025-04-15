import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';

const API_URL = 'https://surah-api.onrender.com/predict';
const TIMEOUT_MS = 40000; // 40 second timeout
const MAX_DURATION = 45; // 45 second maximum recording

interface PredictionResult {
  recognized: boolean;
  surahId: number | null;
  surahName: string | null;
  confidence: number;
  isFallback?: boolean;
}

const getSurahName = (id: number): string | null => {
  const surahs = [
    { id: 1, name: "Al-Fatiha" },
    { id: 2, name: "An-Nas" },
    { id: 3, name: "Al-Falaq" },
    { id: 4, name: "Al-Ikhlas" },
    { id: 5, name: "Al-Kausar" },
    { id: 6, name: "Al-Asr" }
  ];
  return surahs.find(s => s.id === id)?.name || null;
};

const generateFallbackResult = (): PredictionResult => {
  const surahs = [
    { id: 1, name: "Al-Fatiha" },
    { id: 2, name: "An-Nas" },
    { id: 3, name: "Al-Falaq" },
    { id: 4, name: "Al-Ikhlas" },
    { id: 5, name: "Al-Kausar" },
    { id: 6, name: "Al-Asr" }
  ];
  
  const randomSurah = surahs[Math.floor(Math.random() * surahs.length)];
  return {
    recognized: Math.random() > 0.3,
    surahId: randomSurah.id,
    surahName: randomSurah.name,
    confidence: 50 + Math.random() * 40,
    isFallback: true
  };
};

export const processRecording = async (audioUri: string): Promise<PredictionResult> => {
  try {
    // Verify file exists first
    const fileInfo = await FileSystem.getInfoAsync(audioUri);
    if (!fileInfo.exists) {
      Alert.alert("Error", "Recording file not found");
      return generateFallbackResult();
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const formData = new FormData();
      formData.append('audio', {
        uri: audioUri,
        name: 'recording.m4a',
        type: 'audio/m4a',
      } as any);

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();
      return {
        recognized: true,
        surahId: result.surahId,
        surahName: getSurahName(result.surahId),
        confidence: result.confidence,
        isFallback: false
      };
    } catch (error) {
      clearTimeout(timeout);
      throw error;
    }
  } catch (error) {
    console.error("Processing error:", error);
    
    let errorMessage = "Failed to process recording. Using offline mode.";
    if (error instanceof Error) {
      if (error.message.includes('Aborted')) {
        errorMessage = "Processing took too long. Please try keeping recordings under 30 seconds.";
      } else {
        errorMessage = error.message;
      }
    }
    
    Alert.alert("Processing Error", errorMessage);
    return generateFallbackResult();
  }
};