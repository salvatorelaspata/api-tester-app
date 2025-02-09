import { getMethodColor } from '@/components/MethodPicker';
// import { NavigationProp } from '@react-navigation/native';
// import { useNavigation, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

export default function CollectionScreen() {
    // const router = useRouter();
    // const navigation = useNavigation();
    // const { collectionId } = router.params;
    const collection = useSelector((state: any) =>
        state.collections.collections//.find((c: any) => c.id === collectionId)
  );

//   React.useLayoutEffect(() => {
//     navigation.setOptions({
//       title: collection?.name || 'Collection',
//       headerRight: () => (
//         <TouchableOpacity
//           onPress={() => router.push({
//             pathname: '/request',
//             params: { collectionId, mode: 'new' }
//           })}
//         >
//           <Text style={styles.headerButton}>New Request</Text>
//         </TouchableOpacity>
//       ),
//     });
//   }, [navigation, collection]);

  return (
    <View style={styles.container}>
      <FlatList
        data={collection?.requests || []}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.requestItem}
            // onPress={() =>
            //   navigation.navigate('Request', {
            //     collectionId,
            //     requestId: item.id,
            //     mode: 'edit',
            //   })
            // }
          >
            <View style={styles.requestHeader}>
              <Text style={[styles.method, { color: getMethodColor(item.method) }]}>
                {item.method}
              </Text>
              <Text style={styles.url} numberOfLines={1}>
                {item.url}
              </Text>
            </View>
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  headerButton: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  requestItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  method: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  url: {
    fontSize: 14,
    color: '#666666',
  },
  name: {
    fontSize: 14,
    color: '#666666',
  },
})