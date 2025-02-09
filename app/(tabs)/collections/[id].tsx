import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import JsonViewer from '@/components/JsonViewer';
import CollapsibleSection from '@/components/CollapsibleSection';

interface Request {
  id: string;
  method: string;
  url: string;
  headers: any[];
  body?: string;
  timestamp: number;
}

interface Collection {
  id: string;
  name: string;
  requests: Request[];
}

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams();
  const collection = useSelector((state: any) => 
    state.collections.collections.find((c: Collection) => c.id === id)
  );

  if (!collection) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Collection non trovata</Text>
      </SafeAreaView>
    );
  }

  const renderRequestItem = ({ item }: { item: Request }) => (
    <View style={styles.requestItem}>
      <View style={styles.requestHeader}>
        <View style={styles.methodContainer}>
          <Text style={[
            styles.methodText,
            { color: getMethodColor(item.method) }
          ]}>
            {item.method}
          </Text>
        </View>
        <Text style={styles.urlText} numberOfLines={1}>{item.url}</Text>
        <TouchableOpacity 
          onPress={() => {
            router.push({
              pathname: '/request',
              params: {
                method: item.method,
                url: item.url,
                headers: JSON.stringify(item.headers),
                body: item.body
              }
            });
          }}
        >
          <Ionicons name="open-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <CollapsibleSection title="Headers">
        <JsonViewer data={item.headers} />
      </CollapsibleSection>

      {item.body && (
        <CollapsibleSection title="Body">
          <JsonViewer data={JSON.parse(item.body)} />
        </CollapsibleSection>
      )}

      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{collection.name}</Text>
        <Text style={styles.subtitle}>
          {collection.requests.length} requests
        </Text>
      </View>

      <FlatList
        data={collection.requests}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

function getMethodColor(method: string): string {
  switch (method.toUpperCase()) {
    case 'GET':
      return '#2196F3';
    case 'POST':
      return '#4CAF50';
    case 'PUT':
      return '#FF9800';
    case 'DELETE':
      return '#F44336';
    default:
      return '#757575';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  requestItem: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  methodText: {
    fontSize: 14,
    fontWeight: '600',
  },
  urlText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 24,
  },
}); 