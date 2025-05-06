import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Trash2, Moon, Volume2, Info, History } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import { useRecordingStore } from '@/store/recordingStore';
import Colors from '@/constants/colors';

export default function SettingsScreen() {
  const router = useRouter();
  const { clearHistory } = useRecordingStore();
  const [darkMode, setDarkMode] = React.useState(false);
  const [highQualityAudio, setHighQualityAudio] = React.useState(true);
  
  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all recording history?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearHistory();
          },
        },
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Settings" />
      
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
           
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/history')}
          >
            <View style={styles.settingInfo}>
              <History size={20} color={Colors.text} />
              <Text style={styles.settingText}>View History</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleClearHistory}
          >
            <View style={styles.settingInfo}>
              <Trash2 size={20} color={Colors.error} />
              <Text style={[styles.settingText, { color: Colors.error }]}>
                Clear History
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/about')}
          >
            <View style={styles.settingInfo}>
              <Info size={20} color={Colors.text} />
              <Text style={styles.settingText}>About This App</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 12,
    marginTop: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  version: {
    fontSize: 14,
    color: Colors.lightText,
  },
});