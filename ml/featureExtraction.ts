import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

// API endpoint for audio processing
const PROCESSING_API_URL = 'https://your-model-api-endpoint.com/process';

/**
 * Extracts MFCC features from audio by sending the audio file to the cloud API
 */
export const extractMFCCFeatures = async (audioUri: string | null): Promise<number[] | null> => {
  if (!audioUri) return null;
  
  console.log('Sending audio to cloud API for feature extraction:', audioUri);
  
  try {
    // Create form data for the audio file
    const formData = new FormData();
    
    // Add the audio file to form data
    formData.append('audio', {
      uri: audioUri,
      name: 'recording.wav',
      type: 'audio/wav',
    } as any);
    
    // Send the audio to the API
    const response = await fetch(PROCESSING_API_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    // Parse the API response to get the extracted features
    const result = await response.json();
    
    if (result.features && Array.isArray(result.features)) {
      console.log('Received features from API:', result.features);
      return result.features;
    } else {
      throw new Error('Invalid feature data received from API');
    }
  } catch (error) {
    console.error('Error extracting features via API:', error);
    
    // Fallback to local mock implementation for testing or when API fails
    return fallbackFeatureExtraction();
  }
};

/**
 * Fallback function that generates mock MFCC features when the API is unavailable
 */
const fallbackFeatureExtraction = (): number[] => {
  console.warn('Using fallback feature extraction due to API error');
  
  // Generate 13 random MFCC coefficients (common number used in speech recognition)
  const features: number[] = Array(13).fill(0).map(() => Math.random() * 2 - 1);
  
  return features;
};

/**
 * Preprocesses audio by sending it to the cloud API
 * In a real implementation, this would be handled by the same API call as feature extraction
 */
export const preprocessAudio = async (audioUri: string | null): Promise<string | null> => {
  if (!audioUri) return null;
  
  console.log('Audio preprocessing handled by cloud API');
  
  // In this implementation, preprocessing is handled by the same API call
  // that extracts features, so we just return the original URI
  return audioUri;
};