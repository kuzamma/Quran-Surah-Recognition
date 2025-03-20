import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface RecordingTimerProps {
  isRecording: boolean;
}

const RecordingTimer: React.FC<RecordingTimerProps> = ({ isRecording }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRecording) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    } else {
      setSeconds(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Text style={[
      styles.timer,
      isRecording ? styles.recording : null
    ]}>
      {formatTime(seconds)}
    </Text>
  );
};

const styles = StyleSheet.create({
  timer: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.lightText,
    marginVertical: 10,
  },
  recording: {
    color: Colors.recording,
  },
});

export default RecordingTimer;