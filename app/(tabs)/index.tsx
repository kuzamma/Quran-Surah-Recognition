import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Header from '@/components/Header';
import RecordButton from '@/components/RecordButton';
import AudioWaveform from '@/components/AudioWaveform';
import RecordingTimer from '@/components/RecordingTimer';
import RecognitionResult from '@/components/RecognitionResult';
import EmptyState from '@/components/EmptyState';
import ProcessingIndicator from '@/components/ProcessingIndicator';
import { useAudioRecording } from '@/hooks/useAudioRecording';
import { useAudioPlayback } from '@/hooks/useAudioPlayback';
import { useRecordingStore } from '@/store/recordingStore';
import Colors from '@/constants/colors';

export default function RecordScreen() {
  const { 
    isRecording, 
    isRecordingSupported,
    startRecording, 
    stopRecording 
  } = useAudioRecording();
  
  const { playAudio } = useAudioPlayback();
  
  const { 
    recordingUri, 
    recognitionResult,
    recognizeSurah,
    setRecordingUri,
    isProcessing,
    loadModel
  } = useRecordingStore();
  
  const [showResult, setShowResult] = useState(false);
  
  // Load SVM model when the app starts
  useEffect(() => {
    loadModel();
  }, []);
  
  // Reset state when navigating to this screen
  useEffect(() => {
    setShowResult(false);
    setRecordingUri(null);
  }, []);
  
  const handleRecordPress = async () => {
    if (isRecording) {
      const uri = await stopRecording();
      if (uri) {
        setRecordingUri(uri);
        
        // Process the recording
        await recognizeSurah();
        setShowResult(true);
      }
    } else {
      setShowResult(false);
      startRecording();
    }
  };
  
  const handleTryAgain = () => {
    setShowResult(false);
    setRecordingUri(null);
  };
  
  const handlePlaySurah = () => {
    if (recognitionResult?.surah) {
      playAudio(recognitionResult.surah.audioUrl);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Quran Surah Recognition" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {!isRecordingSupported && Platform.OS === 'web' ? (
          <EmptyState
            title="Recording Not Supported"
            message="Audio recording is not supported in web browsers. Please use a mobile device."
          />
        ) : showResult ? (
          <RecognitionResult
            recognized={recognitionResult?.recognized || false}
            surah={recognitionResult?.surah}
            confidence={recognitionResult?.confidence}
            onPlaySurah={handlePlaySurah}
            onTryAgain={handleTryAgain}
          />
        ) : isProcessing ? (
          <ProcessingIndicator />
        ) : (
          <View style={styles.recordingContainer}>
            <Text style={styles.instructions}>
              {isRecording 
                ? "Recording... Recite a Surah clearly"
                : recordingUri 
                  ? "Processing your recitation..."
                  : "Tap the microphone to start recording"}
            </Text>
            
            <AudioWaveform isRecording={isRecording} />
            
            <RecordingTimer isRecording={isRecording} />
            
            <View style={styles.buttonContainer}>
              <RecordButton 
                isRecording={isRecording} 
                onPress={handleRecordPress}
              />
            </View>
            
            <Text style={styles.supportedSurahs}>
              Supported Surahs: Al-Fatiha, Al-Nas, Al-Falaq, Al-Ikhlas, Al-Kausar, Al-As'r
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  recordingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  instructions: {
    fontSize: 18,
    textAlign: 'center',
    color: Colors.text,
    marginBottom: 20,
    maxWidth: '80%',
  },
  buttonContainer: {
    marginVertical: 30,
  },
  supportedSurahs: {
    fontSize: 14,
    color: Colors.lightText,
    textAlign: 'center',
    marginTop: 20,
    maxWidth: '90%',
  }
});