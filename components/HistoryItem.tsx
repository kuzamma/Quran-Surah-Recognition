import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, CheckCircle, XCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { RecordingHistoryItem } from '@/store/recordingStore';

interface HistoryItemProps {
  item: RecordingHistoryItem;
  onPress: () => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item, onPress }) => {
  const formattedDate = new Date(item.timestamp).toLocaleString();
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        {item.recognized ? (
          <CheckCircle size={20} color={Colors.success} />
        ) : (
          <XCircle size={20} color={Colors.error} />
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>
          {item.recognized ? item.surahName : 'Not Recognized'}
        </Text>
        <View style={styles.timeContainer}>
          <Clock size={14} color={Colors.lightText} />
          <Text style={styles.time}>{formattedDate}</Text>
        </View>
      </View>
      
      {item.recognized && (
        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceText}>{Math.round(item.confidence)}%</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    color: Colors.lightText,
    marginLeft: 4,
  },
  confidenceContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 12,
  },
});

export default HistoryItem;