import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, Volume2 } from 'lucide-react-native';
import { Surah } from '@/constants/surahs';
import Colors from '@/constants/colors';

interface SurahCardProps {
  surah: Surah;
  confidence?: number;
  onPlay?: () => void;
}

const SurahCard: React.FC<SurahCardProps> = ({ surah, confidence, onPlay }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <Text style={styles.arabicName}>{surah.nameArabic}</Text>
          <Text style={styles.englishName}>{surah.nameEnglish}</Text>
        </View>
        {confidence !== undefined && (
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceText}>
              {Math.round(confidence)}%
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.details}>
        <Text style={styles.detailText}>
          <Text style={styles.detailLabel}>Meaning: </Text>
          {surah.meaning}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.detailLabel}>Verses: </Text>
          {surah.verses}
        </Text>
      </View>
      
      {onPlay && (
        <TouchableOpacity style={styles.playButton} onPress={onPlay}>
          <Volume2 size={18} color={Colors.primary} />
          <Text style={styles.playText}>Listen to Surah</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nameContainer: {
    flex: 1,
  },
  arabicName: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
    textAlign: 'left',
  },
  englishName: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  confidenceContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  confidenceText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  details: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: Colors.lightText,
    marginBottom: 4,
  },
  detailLabel: {
    fontWeight: '600',
    color: Colors.text,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: 'rgba(30, 132, 73, 0.1)',
    borderRadius: 8,
    marginTop: 8,
  },
  playText: {
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default SurahCard;