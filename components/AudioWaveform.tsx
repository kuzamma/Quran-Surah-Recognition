import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Colors from '@/constants/colors';

interface AudioWaveformProps {
  isRecording: boolean;
}

const BAR_COUNT = 7;

const AudioWaveform: React.FC<AudioWaveformProps> = ({ isRecording }) => {
  const barAnimations = useRef<Animated.Value[]>(
    Array(BAR_COUNT).fill(0).map(() => new Animated.Value(0))
  ).current;

  const animationInstances = useRef<Animated.CompositeAnimation[]>([]).current;

  useEffect(() => {
    if (isRecording) {
      // Start animations for each bar
      animationInstances.length = 0; // Clear previous instances
      barAnimations.forEach((anim, index) => {
        const animation = createAnimation(anim, index);
        animationInstances.push(animation);
        animation.start();
      });
    } else {
      // Reset all animations
      barAnimations.forEach((anim) => {
        anim.setValue(0);
      });
      animationInstances.forEach((animation) => animation.stop());
    }
  }, [isRecording]);

  const createAnimation = (animatedValue: Animated.Value, index: number) => {
    // Random height between 0.3 and 1
    const randomHeight = Math.random() * 0.7 + 0.3;
    
    return Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: randomHeight,
          duration: 700 + index * 100, // Slightly different timing for each bar
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.1,
          duration: 700 + index * 100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
  };

  return (
    <View style={styles.container}>
      {barAnimations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              transform: [
                {
                  scaleY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.1, 1],
                  }),
                },
              ],
              opacity: isRecording ? 1 : 0.3,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: '80%',
    marginVertical: 20,
  },
  bar: {
    width: 4,
    height: 40,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginHorizontal: 4,
  },
});

export default AudioWaveform;