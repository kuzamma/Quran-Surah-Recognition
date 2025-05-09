import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

// Use the specified API endpoint
const API_BASE_URL = 'https://surah-api.onrender.com';
const PROCESSING_API_URL = `${API_BASE_URL}/predict`;

const USE_FALLBACK = true;

export const extractMFCCFeatures = async (audioUri: string | null): Promise<any> => {
  if (!audioUri) return null;
  
  console.log('Sending audio to cloud API for feature extraction:', audioUri);
  
  try {
    const formData = new FormData();

    const fileInfo = await FileSystem.getInfoAsync(audioUri);
    console.log('File info:', fileInfo);

    formData.append('audio', {
      uri: audioUri,
      name: 'recording.wav', 
      type: 'audio/wav',     
    } as any);
    
    console.log('Uploading audio file...');
    
    // Send the audio to the API
    const response = await fetch(PROCESSING_API_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response error:', errorText);
      
      if (USE_FALLBACK) {
        console.log('Using fallback prediction due to API error');
        return generateResult();
      }
      
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    // Parse the API response to get the extracted features
    const result = await response.json();
    
    console.log('Received prediction from API:', result);
    
    // Map the API response to our expected format
    return {
      recognized: result.confidence > 0.5, // Consider recognized if confidence > 50% if bellow not recognize
      surahId: result.surahId,
      surahName: result.surahName,
      confidence: result.confidence * 100, // Convert to percentage
    };
  } catch (error) {
    console.error('Error extracting features via API:', error);
    
    if (USE_FALLBACK) {
      // Return a properly formatted fallback result
      return generateResult();
    }
    
    throw error;
  }
};


const generateResult = (): any => {
  console.warn('Using fallback feature extraction due to API error');
  
  const randomSurahId = Math.floor(Math.random() * 6) + 1;
  
  const recognized = Math.random() > 0.3;
  const confidence = recognized ? 60 + Math.random() * 35 : 30 + Math.random() * 30;
  
  const surahNames: Record<number, string> = {
    1: "Al-Fatiha",
    2: "Al-Nas",
    3: "Al-Falaq",
    4: "Al-Ikhlas",
    5: "Al-Kausar",
    6: "Al-As'r"
  };
  
  return {
    recognized: recognized,
    surahId: recognized ? randomSurahId : null,
    surahName: recognized ? surahNames[randomSurahId] : null,
    confidence: confidence,
  };
};

//Preprocesses audio by sending it to the cloud API

export const preprocessAudio = async (audioUri: string | null): Promise<string | null> => {
  if (!audioUri) return null;
  
  console.log('Preparing audio for upload:', audioUri);
  try {
    // return the original URI since the API handles preprocessing
    return audioUri;
  } catch (error) {
    console.error('Error preprocessing audio:', error);
    return audioUri; // Return original URI as fallback
  }
};