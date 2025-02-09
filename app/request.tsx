import { useState, useCallback, useRef } from 'react';
import { View, TextInput, Button, ScrollView, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import React from 'react';
import { useRequestHistory } from '@/hooks/useRequestHistory';
import MethodPicker, { HttpMethod } from '@/components/MethodPicker';
import KeyValueTable from '@/components/KeyValueTable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import ResponseModal from '@/components/ResponseModal';


interface Header {
  key: string;
  value: string;
}

interface ResponseData {
  status?: number;
  data?: any;
  headers?: Record<string, string | string[] | undefined>;
  time?: number;
  error?: string;
}


interface RequestItem {
  method: HttpMethod;
  url: string;
  timestamp: number;
  status: number;
}

export default function RequestScreen() {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [headers, setHeaders] = useState<Header[]>([{ key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<ResponseData | null>(null);
  const { saveRequest } = useRequestHistory();

  const handleSendRequest = async () => {
    try {
      const headersObj = headers.reduce<Record<string, string>>((acc, { key, value }) => {
        if (key) acc[key] = value;
        return acc;
      }, {});

      const startTime = Date.now();

      const res = await fetch(url, {
        method,
        headers: headersObj,
        body: body ? body : undefined
      });

      const endTime = Date.now();
      const responseData = await res.json();

      setResponse({
        status: res.status,
        data: responseData,
        headers: Object.fromEntries(res.headers.entries()),
        time: endTime - startTime
      });

      saveRequest({
        method,
        url,
        timestamp: Date.now(),
        status: res.status
      });

    } catch (error) {
      if (error instanceof Error) {
        setResponse({
          error: error.message
        });
      }
    }
  };

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleSheetChanges = (index: number) => {
    console.log('handleSheetChanges', index);
  };

  const handlePresentModalPress = () => {
    bottomSheetModalRef.current?.present();
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <GestureHandlerRootView style={styles.container} >
        <BottomSheetModalProvider>
          <View style={styles.header}>
            <Text style={styles.title}>HTTP Client Request</Text>
          </View>
          <ScrollView style={styles.scrollContainer}>
            <View style={styles.inputContainer}>
              <MethodPicker selectedValue={method} onValueChange={setMethod} />
              <TextInput
                style={styles.urlInput}
                placeholder="Enter URL"
                value={url}
                onChangeText={setUrl}
              />
            </View>

            <Text style={styles.sectionTitle}>Headers</Text>
            <KeyValueTable data={headers} onChange={setHeaders} />

            {(method === 'POST' || method === 'PUT') && (
              <>
                <Text style={styles.sectionTitle}>Body</Text>
                <TextInput
                  style={styles.bodyInput}
                  multiline
                  numberOfLines={10}
                  placeholder="Raw JSON body"
                  value={body}
                  onChangeText={setBody}
                />
              </>
            )}

            {/* {response && (
              <View style={styles.responseContainer}>
                <Text style={styles.sectionTitle}>Response</Text>
                {response.error ? (
                  <Text style={styles.errorText}>Error: {response.error}</Text>
                ) : (
                  <>
                    <Text>Status: {response.status}</Text>
                    <Text>Time: {response.time}ms</Text>
                    <Text>Headers:</Text>
                    <Text>{JSON.stringify(response.headers, null, 2)}</Text>
                    <Text>Body:</Text>
                    <Text>{JSON.stringify(response.data, null, 2)}</Text>
                  </>
                )}
              </View>
            )} */}

            <View style={styles.bottomPadding} />
          </ScrollView>

          <View style={styles.sendButtonContainer}>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendRequest}
            >
              <Text style={styles.sendButtonText}>Send Request</Text>
            </TouchableOpacity>

          <Button
            onPress={handlePresentModalPress}
            title="Present Modal"
            color="black"
          />
          </View>
            <ResponseModal 
                bottomSheetModalRef={bottomSheetModalRef} 
                handleSheetChanges={handleSheetChanges} 
                response={response} 
            />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  header: {
    marginHorizontal: 20,

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  urlInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 12,
    color: '#333333',
  },
  bodyInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    height: 150,
    textAlignVertical: 'top',
    marginBottom: 24,
    backgroundColor: '#f8f8f8',
    fontSize: 16,
  },
  responseContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
    marginTop: 8,
  },
  bottomPadding: {
    height: 80,
  },
  sendButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});