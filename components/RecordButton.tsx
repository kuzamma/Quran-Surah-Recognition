import React from 'react';
import { StyleSheet, TouchableOpacity, View, Animated, Easing } from 'react-native';
import { Mic } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface RecordButtonProps {
  isRecording: boolean;
  onPress: () => void;
  disabled?: boolean;
}

const RecordButton: React.FC<RecordButtonProps> = ({ isRecording, onPress, disabled = false }) => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    let pulseAnimation: Animated.CompositeAnimation;

    if (isRecording) {
      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      if (pulseAnimation) {
        pulseAnimation.stop();
      }
    };
  }, [isRecording, pulseAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.pulseCircle,
          {
            transform: [{ scale: pulseAnim }],
            opacity: isRecording ? 0.5 : 0,
          },
        ]}
      />
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.button,
          isRecording ? styles.recording : null,
          disabled && !isRecording ? styles.disabled : null,
        ]}
        activeOpacity={0.7}
        disabled={disabled && !isRecording}
      >
        <Mic size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 2,
  },
  recording: {
    backgroundColor: Colors.recording,
  },
  disabled: {
    backgroundColor: Colors.lightText,
    opacity: 0.7,
  },
  pulseCircle: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.recording,
    zIndex: 1,
  },
});

export default RecordButton;