import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle, XCircle, Brain } from 'lucide-react-native';
import Colors from '@/constants/colors';
import SurahCard from './SurahCard';
import { Surah } from '@/constants/surahs';

interface RecognitionResultProps {
  recognized: boolean;
  surah?: Surah;
  confidence?: number;
  onPlaySurah?: () => void;
  onTryAgain: () => void;
}

const RecognitionResult: React.FC<RecognitionResultProps> = ({
  recognized,
  surah,
  confidence,
  onPlaySurah,
  onTryAgain,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.resultHeader}>
        {recognized ? (
          <View style={styles.iconContainer}>
            <CheckCircle size={32} color={Colors.success} />
          </View>
        ) : (
          <View style={styles.iconContainer}>
            <XCircle size={32} color={Colors.error} />
          </View>
        )}
        
        <Text style={styles.resultTitle}>
          {recognized ? 'Surah Recognized!' : 'Not Recognized'}
        </Text>
        
        <Text style={styles.resultDescription}>
          {recognized
            ? 'The recitation has been successfully identified.'
            : 'We could not identify the Surah from your recitation.'}
        </Text>
      </View>

      {recognized && surah && (
        <SurahCard 
          surah={surah} 
          confidence={confidence} 
          //onPlay={onPlaySurah}
        />
      )}

      <View style={styles.modelInfo}>
        <Brain size={16} color={Colors.lightText} />
        <Text style={styles.modelText}>
          Analyzed using SVM model with MFCC features
        </Text>
      </View>

      <TouchableOpacity style={styles.tryAgainButton} onPress={onTryAgain}>
        <Text style={styles.tryAgainText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  resultDescription: {
    fontSize: 16,
    color: Colors.lightText,
    textAlign: 'center',
    marginBottom: 16,
    maxWidth: '80%',
  },
  modelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 8,
    padding: 8,
    backgroundColor: 'rgba(30, 132, 73, 0.05)',
    borderRadius: 8,
  },
  modelText: {
    fontSize: 12,
    color: Colors.lightText,
    marginLeft: 8,
  },
  tryAgainButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  tryAgainText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RecognitionResult;