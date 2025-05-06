import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
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
  const [recordingDuration, setRecordingDuration] = useState(0);
  
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
        
        // IMPORTANT: The API needs at least 13 seconds of audio
        // (8 second offset + 5 second segment)
        if (recordingDuration < 13) {
          Alert.alert(
            "Recording Too Short",
            "Please record for at least 13 seconds to allow for proper recognition. The API needs enough audio data to analyze.",
            [{ text: "OK" }]
          );
          return;
        }
        
        // Process the recording
        try {
          await recognizeSurah();
          setShowResult(true);
        } catch (error) {
          Alert.alert(
            "Recognition Failed",
            "There was an error processing your recitation. Please try again with a longer, clearer recording.",
            [{ text: "OK" }]
          );
        }
      }
    } else {
      setShowResult(false);
      setRecordingDuration(0);
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
            
            <RecordingTimer 
              isRecording={isRecording} 
              onTimerUpdate={(seconds) => setRecordingDuration(seconds)}
            />
            
            <View style={styles.buttonContainer}>
              <RecordButton 
                isRecording={isRecording} 
                onPress={handleRecordPress}
              />
            </View>
            
            <Text style={styles.supportedSurahs}>
              Supported Surahs: Al-Fatiha, Al-Nas, Al-Falaq, Al-Ikhlas, Al-Kausar, Al-As'r
            </Text>
            
            
            
            <Text style={styles.apiNote}>
              Note: Requires at least 13 seconds of audio to properly analyze your recitation
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
  },
  recordingTip: {
    fontSize: 12,
    color: Colors.lightText,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  apiNote: {
    fontSize: 12,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: '90%',
  }
});