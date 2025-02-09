import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useSelector, useDispatch } from 'react-redux';
import { addCollection } from '@/store/collectionsSlice';

interface Collection {
  id: string;
  name: string;
  requests: any[];
}

interface SaveToCollectionModalProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  onSave: (collectionId: string) => void;
}

export default function SaveToCollectionModal({ bottomSheetModalRef, onSave }: SaveToCollectionModalProps) {
  const [newCollectionName, setNewCollectionName] = useState('');
  const collections = useSelector((state: any) => state.collections.collections) as Collection[];
  const dispatch = useDispatch();

  const handleAddCollection = () => {
    if (newCollectionName.trim()) {
      dispatch(addCollection(newCollectionName.trim()));
      setNewCollectionName('');
    }
  };

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} pressBehavior="close" />,
    []
  );

  const renderItem = ({ item }: { item: Collection }) => (
    <TouchableOpacity 
      style={styles.collectionItem}
      onPress={() => onSave(item.id)}
    >
      <Text style={styles.collectionName}>{item.name}</Text>
      <Text style={styles.requestCount}>{item.requests.length} requests</Text>
    </TouchableOpacity>
  );

  const ListHeaderComponent = () => (
    <>
      <Text style={styles.title}>Salva nella Collection</Text>
      <View style={styles.addContainer}>
        <TextInput
          style={styles.input}
          value={newCollectionName}
          onChangeText={setNewCollectionName}
          placeholder="Nome nuova collection"
          placeholderTextColor="#999"
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddCollection}
        >
          <Text style={styles.addButtonText}>Crea</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const ListEmptyComponent = () => (
    <Text style={styles.emptyText}>Nessuna collection disponibile. Creane una nuova!</Text>
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={['50%', '75%']}
      index={0}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
    >
      <BottomSheetFlatList
        data={collections}
        renderItem={renderItem}
        keyExtractor={(item: Collection) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
      />
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addContainer: {
    flexDirection: 'row',
    marginBottom: 16,
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
  emptyText: {
    textAlign: 'center',
    color: '#666666',
    marginTop: 20,
  },
}); 