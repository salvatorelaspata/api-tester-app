import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRequestHistory } from '@/hooks/useRequestHistory';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import HeaderText from '@/components/HeaderText';

const colorStatus = (status: number) => {
  if (status >= 200 && status < 300) {
    return '#4CAF50'; // Green
  } else if (status >= 300 && status < 400) {
    return '#2196F3'; // Blue
  } else if (status >= 400 && status < 500) {
    return '#FFC107'; // Yellow
  } else {
    return '#F44336'; // Red
  }
};

export default function HistoryScreen() {
  const { history, reloadHistory } = useRequestHistory();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      reloadHistory();
    }, [])
  );

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.historyItem}
      onPress={() => router.push({
        pathname: '/request',
        params: {
          method: item.method,
          url: item.url,
          headers: JSON.stringify(item.headers || []),
          body: item.body || ''
        }
      })}
    >
      <Text style={styles.method}>{item.method}</Text>
      <Text style={styles.url} numberOfLines={1}>{item.url}</Text>
      <Text style={{...styles.status, color: colorStatus(item.status)}}>Status: {item.status}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderText title="Request History" />
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.timestamp?.toString() ?? ''}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    color: '#333333',
  },
  listContent: {
    padding: 16,
  },
  historyItem: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  method: {
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  url: {
    color: '#666666',
    marginBottom: 4,
  },
  status: {
    color: '#4CAF50',
  },
  timestamp: {
    color: '#999999',
    fontSize: 12,
    marginTop: 4,
  },
});