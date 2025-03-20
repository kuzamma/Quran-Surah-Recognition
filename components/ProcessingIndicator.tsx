import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Brain } from 'lucide-react-native';
import Colors from '@/constants/colors';

const ProcessingIndicator: React.FC = () => {
  const spinValue = React.useRef(new Animated.Value(0)).current;
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    // Rotation animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
    
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    return () => {
      // Cleanup animations
      spinValue.stopAnimation();
      scaleValue.stopAnimation();
    };
  }, []);
  
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  const steps = [
    'Preprocessing audio...',
    'Extracting MFCC features...',
    'Analyzing recitation patterns...',
    'Comparing with trained data...',
    'Finalizing results...',
  ];
  
  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.iconContainer,
          { 
            transform: [
              { rotate: spin },
              { scale: scaleValue }
            ] 
          }
        ]}
      >
        <Brain size={40} color={Colors.primary} />
      </Animated.View>
      
      <Text style={styles.title}>Processing Your Recitation</Text>
      
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <Text 
            key={index} 
            style={[
              styles.stepText,
              { opacity: 0.4 + (index * 0.1) }
            ]}
          >
            {step}
          </Text>
        ))}
      </View>
      
      <Text style={styles.note}>
        Using SVM model with MFCC feature extraction
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(30, 132, 73, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  stepsContainer: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  stepText: {
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  note: {
    fontSize: 12,
    color: Colors.lightText,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default ProcessingIndicator;