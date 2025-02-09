import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addCollection } from '@/store/collectionsSlice';
import { useState } from 'react';
import { router } from 'expo-router';

export default function CollectionsScreen() {
  const collections = useSelector((state: any) => state.collections.collections);
  const dispatch = useDispatch();
  const [newCollectionName, setNewCollectionName] = useState('');

  const handleAddCollection = () => {
    if (newCollectionName.trim()) {
      dispatch(addCollection(newCollectionName.trim()));
      setNewCollectionName('');
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.collectionItem}
      onPress={() => router.push(`/collections/${item.id}`)}
    >
      <Text style={styles.collectionName}>{item.name}</Text>
      <Text style={styles.requestCount}>{item.requests.length} requests</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Collections</Text>
      
      <View style={styles.addContainer}>
        <TextInput
          style={styles.input}
          value={newCollectionName}
          onChangeText={setNewCollectionName}
          placeholder="Collection name"
          placeholderTextColor="#999"
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddCollection}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={collections}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
  },
  addContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  addButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  collectionItem: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  collectionName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  requestCount: {
    color: '#666666',
  },
});