import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import { useRecordingStore } from '@/store/recordingStore';

export const useAudioRecording = () => {
  const { isRecording, setIsRecording, setRecordingUri } = useRecordingStore();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Request permissions
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        console.error('Audio recording permissions not granted');
        return;
      }

      // Configure audio
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create and start recording with high quality settings
      // CRITICAL: The API expects 22050 Hz sample rate
      const { recording: newRecording } = await Audio.Recording.createAsync({
        android: {
          extension: '.wav', // Changed to WAV for better compatibility
          outputFormat: Audio.AndroidOutputFormat.DEFAULT,
          audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
          sampleRate: 22050, // Match the API's expected sample rate
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav', // Changed to WAV for better compatibility
          outputFormat: Audio.IOSOutputFormat.LINEARPCM,
          audioQuality: Audio.IOSAudioQuality.MAX,
          sampleRate: 22050, // Match the API's expected sample rate
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/wav', // Changed to WAV
          bitsPerSecond: 128000,
        },
      });
      
      setRecording(newRecording);
      setIsRecording(true);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      
      if (uri) {
        setRecordingUri(uri);
        console.log('Recording stopped and stored at', uri);
        return uri;
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
    
    return null;
  };

  const playRecording = async (uri: string) => {
    try {
      // Unload any existing sound
      if (sound) {
        await sound.unloadAsync();
      }

      // Load and play the recording
      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      setSound(newSound);
      setIsPlaying(true);
      
      await newSound.playAsync();
      
      // Handle playback finished
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && 'didJustFinish' in status && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (err) {
      console.error('Failed to play recording', err);
      setIsPlaying(false);
    }
  };

  const stopPlayback = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  // For web compatibility
  const isRecordingSupported = Platform.OS !== 'web';

  return {
    isRecording,
    isPlaying,
    isRecordingSupported,
    startRecording,
    stopRecording,
    playRecording,
    stopPlayback,
  };
};