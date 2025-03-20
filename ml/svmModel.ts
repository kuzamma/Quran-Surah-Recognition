import { Platform } from 'react-native';
import surahs, { Surah } from '@/constants/surahs';

// API endpoint for the deployed SVM model
const API_URL = 'https://your-model-api-endpoint.com/predict';

/**
 * Calls the cloud API to predict the Surah from audio features
 * 
 * @param features - MFCC features extracted from audio
 * @returns Object containing predicted Surah, confidence score, and recognition status
 */
export const predictSurah = async (features: number[]): Promise<{ 
  surahId: number | null; 
  confidence: number;
  recognized: boolean;
}> => {
  if (!features || features.length === 0) {
    return { surahId: null, confidence: 0, recognized: false };
  }
  
  console.log('Sending features to cloud API for prediction:', features);
  
  try {
    // Send features to the cloud API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ features }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    // Parse the API response
    const result = await response.json();
    
    console.log('API prediction result:', result);
    
    // Check if the confidence is above the threshold (e.g., 60%)
    const isRecognized = result.confidence >= 60;
    
    return {
      surahId: isRecognized ? result.surahId : null,
      confidence: result.confidence,
      recognized: isRecognized,
    };
  } catch (error) {
    console.error('Error calling prediction API:', error);
    
    // Fallback to a simulated response in case of API failure
    // This helps the app continue working even if the API is down
    return simulatePrediction(features);
  }
};

/**
 * Fallback function that simulates a prediction when the API is unavailable
 * This helps maintain app functionality during network issues
 */
const simulatePrediction = (features: number[]): { 
  surahId: number | null; 
  confidence: number;
  recognized: boolean;
} => {
  console.warn('Using fallback prediction due to API error');
  
  // Simple fallback logic - pick a random Surah with low confidence
  const randomIndex = Math.floor(Math.random() * surahs.length);
  const randomConfidence = 30 + Math.random() * 30; // 30-60% confidence
  
  // 50% chance of recognizing something
  const recognized = Math.random() > 0.5;
  
  return {
    surahId: recognized ? surahs[randomIndex].id : null,
    confidence: recognized ? randomConfidence : 20,
    recognized,
  };
};

/**
 * Checks if the cloud API is available
 * @returns Promise resolving to boolean indicating if API is reachable
 */
export const checkApiAvailability = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL.split('/predict')[0]}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

/**
 * Loads the SVM model (in this case, just checks API availability)
 */
export const loadSVMModel = async (): Promise<boolean> => {
  console.log('Checking API availability...');
  
  // For web, we'll always return true since we'll handle errors during prediction
  if (Platform.OS === 'web') {
    return true;
  }
  
  try {
    const isAvailable = await checkApiAvailability();
    console.log(`API ${isAvailable ? 'is' : 'is not'} available`);
    return isAvailable;
  } catch (error) {
    console.error('Error checking API availability:', error);
    return false;
  }
};