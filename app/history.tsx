import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import HistoryItem from '@/components/HistoryItem';
import EmptyState from '@/components/EmptyState';
import { useRecordingStore } from '@/store/recordingStore';
import Colors from '@/constants/colors';

export default function HistoryScreen() {
  const { history } = useRecordingStore();
  
  const handleItemPress = (itemId: string) => {
    // In a real app, this would navigate to a detail view
    console.log('Pressed history item:', itemId);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen 
        options={{ 
          title: 'Recording History',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerShadowVisible: false,
        }} 
      />
      
      {history.length === 0 ? (
        <EmptyState
          title="No History Yet"
          message="Your recording history will appear here once you start recognizing Surahs."
        />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HistoryItem 
              item={item} 
              onPress={() => handleItemPress(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <Text style={styles.headerText}>
              {history.length} {history.length === 1 ? 'Recording' : 'Recordings'}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    padding: 16,
  },
  headerText: {
    fontSize: 14,
    color: Colors.lightText,
    marginBottom: 16,
  },
});