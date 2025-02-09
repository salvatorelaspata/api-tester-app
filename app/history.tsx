import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useRequestHistory } from '@/hooks/useRequestHistory';

export default function HistoryScreen() {
  const { history } = useRequestHistory();

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.historyItem}>
      <Text style={styles.method}>{item.method}</Text>
      <Text style={styles.url} numberOfLines={1}>{item.url}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Request History</Text>
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