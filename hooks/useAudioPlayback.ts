import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

export const useAudioPlayback = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const playAudio = async (uri: string) => {
    try {
      // Unload any existing sound
      if (sound) {
        await sound.unloadAsync();
      }

      setIsLoading(true);

      // Load and play the audio
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      
      setSound(newSound);
      setIsPlaying(true);
      setIsLoading(false);
      
      // Handle playback finished
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (err) {
      console.error('Failed to play audio', err);
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  // For web compatibility
  const isAudioSupported = Platform.OS !== 'web';

  return {
    isPlaying,
    isLoading,
    isAudioSupported,
    playAudio,
    stopAudio,
  };
};