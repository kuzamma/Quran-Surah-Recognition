import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { History, Info } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';

interface HeaderProps {
  title: string;
  showIcons?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showIcons = true }) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      
      {showIcons && (
        <View style={styles.iconContainer}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/history')}
          >
            <History size={22} color={Colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/about')}
          >
            <Info size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default Header;