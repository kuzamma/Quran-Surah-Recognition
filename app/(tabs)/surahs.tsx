import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Header from '@/components/Header';
import SurahCard from '@/components/SurahCard';
import { useAudioPlayback } from '@/hooks/useAudioPlayback';
import surahs from '@/constants/surahs';

export default function SurahsScreen() {
  const { playAudio } = useAudioPlayback();
  
  const handlePlaySurah = (audioUrl: string) => {
    playAudio(audioUrl);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Supported Surahs" />
      
      <FlatList
        data={surahs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SurahCard 
            surah={item} 
            onPlay={() => handlePlaySurah(item.audioUrl)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingVertical: 16,
  },
});