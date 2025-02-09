import { useState, useCallback, useRef, useEffect } from 'react';
import { View, TextInput, Button, ScrollView, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import React from 'react';
import { useRequestHistory } from '@/hooks/useRequestHistory';
import MethodPicker, { HttpMethod } from '@/components/MethodPicker';
import KeyValueTable from '@/components/KeyValueTable';
import SaveToCollectionModal from '@/components/SaveToCollectionModal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import ResponseModal from '@/components/ResponseModal';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams } from 'expo-router';
import { useDispatch } from 'react-redux';
import { addRequestToCollection } from '@/store/collectionsSlice';
import { Ionicons } from '@expo/vector-icons';
import HeaderText from '@/components/HeaderText';

interface FileData {
  uri: string;
  type: string;
  name: string;
  size: number;
}

interface Header {
  key: string;
  value: string;
  isFile: boolean;
  file?: FileData;
}

interface ResponseData {
  status?: number;
  data?: any;
  headers?: Record<string, string | string[] | undefined>;
  time?: number;
  error?: string;
}

type BodyType = 'raw' | 'form-data';

interface RequestItem {
  method: HttpMethod;
  url: string;
  timestamp: number;
  status: number;
}

interface FormDataItem {
  key: string;
  type: 'text' | 'file';
  value?: string;
  file?: FileData;
}

interface KeyValuePair {
  key: string;
  value: string;
  isFile: boolean;
  file?: FileData;
}

export default function RequestScreen() {
  const params = useLocalSearchParams();
  
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [headers, setHeaders] = useState<Header[]>([{ key: '', value: '', isFile: false }]);
  const [body, setBody] = useState('');
  const [bodyType, setBodyType] = useState<BodyType>('raw');
  const [formData, setFormData] = useState<FormDataItem[]>([
    { key: '', type: 'text', value: '' }
  ]);
  const [response, setResponse] = useState<ResponseData | null>(null);
  const { saveRequest } = useRequestHistory();

  const saveToCollectionRef = useRef<BottomSheetModal>(null);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (params.url) {
      setUrl(params.url.toString());
    }
    if (params.method) {
      setMethod(params.method as HttpMethod);
    }
    if (params.headers) {
      setHeaders(JSON.parse(params.headers.toString()));
    }
    if (params.body) {
      setBody(params.body.toString());
    }
  }, [params.url, params.method, params.headers, params.body]);

  const handleSendRequest = async () => {
    try {
      setIsLoading(true);
      const headersObj = headers.reduce<Record<string, string>>((acc, { key, value }) => {
        if (key) acc[key] = value;
        return acc;
      }, {});

      const startTime = Date.now();
      
      let requestBody: string | FormData | undefined;
      
      if (method === 'POST' || method === 'PUT') {
        if (bodyType === 'raw') {
          requestBody = body;
        } else {
          const formDataObj = new FormData();
          formData.forEach(({ key, type, value, file }) => {
            if (key) {
              if (type === 'file' && file) {
                formDataObj.append(key, {
                  uri: file.uri,
                  type: file.type,
                  name: file.name,
                  size: file.size
                } as any);
              } else if (value) {
                formDataObj.append(key, value);
              }
            }
          });
          requestBody = formDataObj;
        }
      }
      
      const res = await fetch(url, {
        method,
        headers: bodyType === 'raw' ? headersObj : {
          ...Object.fromEntries(
            Object.entries(headersObj).filter(([key]) => key.toLowerCase() !== 'content-type')
          ),
          'Accept': 'application/json',
        },
        body: requestBody
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
        status: res.status,
        headers: headers,
        body: bodyType === 'raw' ? body : undefined
      });

      bottomSheetModalRef.current?.present();

    } catch (error) {
      if (error instanceof Error) {
        setResponse({
          error: error.message
        });
        
        bottomSheetModalRef.current?.present();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleSheetChanges = (index: number) => {
    console.log('handleSheetChanges', index);
  };

  const handleFilePick = async (index: number, type: 'formData') => {
    try {
      Alert.alert(
        'Seleziona file',
        'Scegli da dove selezionare il file',
        [
          {
            text: 'Foto',
            onPress: async () => {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 1,
              });

              if (!result.canceled && result.assets[0]) {
                const fileData = {
                  uri: result.assets[0].uri,
                  type: 'image/jpeg',
                  name: 'image.jpg',
                  size: result.assets[0].fileSize || 0,
                };

                updateFileData(fileData, index);
              }
            },
          },
          {
            text: 'Documento',
            onPress: async () => {
              const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
              });

              if (!result.canceled && result.assets[0]) {
                const fileData = {
                  uri: result.assets[0].uri,
                  type: result.assets[0].mimeType || 'application/octet-stream',
                  name: result.assets[0].name,
                  size: result.assets[0].size || 0,
                };

                updateFileData(fileData, index);
              }
            },
          },
          {
            text: 'Annulla',
            style: 'cancel',
          },
        ],
      );
    } catch (err) {
      console.error('Errore nella selezione del file:', err);
    }
  };

  const updateFileData = (fileData: FileData, index: number) => {
    const newFormData = [...formData];
    newFormData[index] = { 
      ...newFormData[index], 
      type: 'file',
      value: undefined,
      file: fileData 
    };
    setFormData(newFormData);
  };

  const handleSaveToCollection = (collectionId: string) => {
    const requestData = {
      method,
      url,
      headers: headers.filter(h => h.key && h.value),
      body: bodyType === 'raw' ? body : undefined,
      timestamp: Date.now()
    };
    
    dispatch(addRequestToCollection({ collectionId, request: requestData }));
    Alert.alert('Successo', 'Request salvata nella collection');
    saveToCollectionRef.current?.dismiss();
  };

  const handleFormDataChange = (data: KeyValuePair[]) => {
    setFormData(data.map(item => ({
      ...item,
      type: item.isFile ? 'file' : 'text'
    })) as FormDataItem[]);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <HeaderText title="HTTP Client Request" />
      <GestureHandlerRootView style={styles.container} >
        <BottomSheetModalProvider>
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
            <KeyValueTable 
              data={headers} 
              onChange={setHeaders}
              showFileOption={false}
            />

            {(method === 'POST' || method === 'PUT') && (
              <>
                <Text style={styles.sectionTitle}>Body</Text>
                <View style={styles.segmentedButtonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.segmentedButton,
                      bodyType === 'raw' && styles.segmentedButtonActive
                    ]}
                    onPress={() => setBodyType('raw')}
                  >
                    <Text style={[
                      styles.segmentedButtonText,
                      bodyType === 'raw' && styles.segmentedButtonTextActive
                    ]}>Raw</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.segmentedButton,
                      bodyType === 'form-data' && styles.segmentedButtonActive
                    ]}
                    onPress={() => setBodyType('form-data')}
                  >
                    <Text style={[
                      styles.segmentedButtonText,
                      bodyType === 'form-data' && styles.segmentedButtonTextActive
                    ]}>Form Data</Text>
                  </TouchableOpacity>
                </View>

                {bodyType === 'raw' ? (
                  <TextInput
                    style={styles.bodyInput}
                    multiline
                    numberOfLines={10}
                    placeholder="Raw JSON body"
                    value={body}
                    onChangeText={setBody}
                  />
                ) : (
                  <KeyValueTable
                    data={formData.map(item => ({
                      key: item.key,
                      value: item.value || '',
                      isFile: item.type === 'file',
                      file: item.file
                    }))}
                    onChange={handleFormDataChange}
                    showFileOption={true}
                    onFilePick={(index) => handleFilePick(index, 'formData')}
                  />
                )}
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
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.sendButton]}
                onPress={handleSendRequest}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Invia</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonIcon, styles.saveButton]}
                onPress={() => saveToCollectionRef.current?.present()}
                disabled={isLoading}
              >
                <Ionicons name="save-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
            <ResponseModal 
                bottomSheetModalRef={bottomSheetModalRef} 
                handleSheetChanges={handleSheetChanges} 
                response={response} 
            />
            
            <SaveToCollectionModal
              bottomSheetModalRef={saveToCollectionRef}
              onSave={handleSaveToCollection}
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
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonIcon: {
    width: 60,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    backgroundColor: '#2196F3',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  segmentedButtonContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
    overflow: 'hidden',
  },
  segmentedButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  segmentedButtonActive: {
    backgroundColor: '#2196F3',
  },
  segmentedButtonText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
  segmentedButtonTextActive: {
    color: '#ffffff',
  },
});