import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen 
        options={{ 
          title: 'About',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerShadowVisible: false,
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=200&auto=format&fit=crop' }}
            style={styles.logo}
          />
        </View>
        
        <Text style={styles.appName}>Quran Surah Recognition</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This App</Text>
          <Text style={styles.sectionText}>
            This application uses voice recognition technology to identify and classify six specific Surahs from the Quran. The app is designed to help users practice their recitation and learn the correct pronunciation of these important Surahs.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Supported Surahs</Text>
          <Text style={styles.sectionText}>
            The application currently supports the following six Surahs:
          </Text>
          
          <View style={styles.surahList}>
            <View style={styles.surahItem}>
              <Text style={styles.surahArabic}>الفاتحة</Text>
              <Text style={styles.surahEnglish}>Al-Fatiha (The Opening)</Text>
            </View>
            
            <View style={styles.surahItem}>
              <Text style={styles.surahArabic}>الناس</Text>
              <Text style={styles.surahEnglish}>Al-Nas (Mankind)</Text>
            </View>
            
            <View style={styles.surahItem}>
              <Text style={styles.surahArabic}>الفلق</Text>
              <Text style={styles.surahEnglish}>Al-Falaq (The Daybreak)</Text>
            </View>
            
            <View style={styles.surahItem}>
              <Text style={styles.surahArabic}>الإخلاص</Text>
              <Text style={styles.surahEnglish}>Al-Ikhlas (Sincerity)</Text>
            </View>
            
            <View style={styles.surahItem}>
              <Text style={styles.surahArabic}>الكوثر</Text>
              <Text style={styles.surahEnglish}>Al-Kausar (Abundance)</Text>
            </View>
            
            <View style={styles.surahItem}>
              <Text style={styles.surahArabic}>العصر</Text>
              <Text style={styles.surahEnglish}>Al-As'r (The Time)</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.sectionText}>
            The app uses a Support Vector Machine (SVM) model trained on Mel-frequency cepstral coefficients (MFCC) extracted from audio recordings of the Surahs. When you recite a Surah, the app processes your voice, extracts the relevant features, and uses the SVM model to classify which Surah you recited.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Details</Text>
          <Text style={styles.sectionText}>
            1. <Text style={styles.bold}>Audio Preprocessing:</Text> Your recording is first normalized and filtered to remove background noise.
          </Text>
          <Text style={styles.sectionText}>
            2. <Text style={styles.bold}>Feature Extraction:</Text> We extract MFCC features from your audio, which capture the tonal and phonetic characteristics of your recitation.
          </Text>
          <Text style={styles.sectionText}>
            3. <Text style={styles.bold}>Classification:</Text> Our SVM model analyzes these features and compares them against trained patterns for each Surah.
          </Text>
          <Text style={styles.sectionText}>
            4. <Text style={styles.bold}>Confidence Score:</Text> The model provides a confidence percentage indicating how closely your recitation matches the expected patterns.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <Text style={styles.sectionText}>
            Your recordings are processed locally on your device and are not sent to any external servers. Your privacy is important to us.
          </Text>
        </View>
        
        <Text style={styles.footer}>
          © 2023 Quran Surah Recognition App
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  version: {
    fontSize: 16,
    color: Colors.lightText,
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 8,
  },
  bold: {
    fontWeight: '600',
  },
  surahList: {
    marginTop: 12,
  },
  surahItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  surahArabic: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '500',
  },
  surahEnglish: {
    fontSize: 14,
    color: Colors.lightText,
  },
  footer: {
    fontSize: 14,
    color: Colors.lightText,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
});