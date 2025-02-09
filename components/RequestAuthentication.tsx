import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export type AuthType = 'basic' | 'apiKey' | 'none';

interface AuthConfig {
  type: AuthType;
  username?: string;
  password?: string;
  apiKey?: string;
  apiKeyName?: string;
}

interface RequestAuthenticationProps {
  authConfig: AuthConfig;
  onAuthConfigChange: (config: AuthConfig) => void;
}

export default function RequestAuthentication({ authConfig, onAuthConfigChange }: RequestAuthenticationProps) {
  const handleAuthTypeChange = (type: AuthType) => {
    onAuthConfigChange({ ...authConfig, type });
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={authConfig.type}
          onValueChange={handleAuthTypeChange}
          style={styles.picker}
        >
          <Picker.Item label="Nessuna" value="none" />
          <Picker.Item label="Basic Auth" value="basic" />
          <Picker.Item label="API Key" value="apiKey" />
        </Picker>
      </View>

      {authConfig.type === 'basic' && (
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={authConfig.username}
            onChangeText={(username) => onAuthConfigChange({ ...authConfig, username })}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={authConfig.password}
            onChangeText={(password) => onAuthConfigChange({ ...authConfig, password })}
            secureTextEntry
          />
        </View>
      )}

      {authConfig.type === 'apiKey' && (
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Nome API Key"
            value={authConfig.apiKeyName}
            onChangeText={(apiKeyName) => onAuthConfigChange({ ...authConfig, apiKeyName })}
          />
          <TextInput
            style={styles.input}
            placeholder="API Key"
            value={authConfig.apiKey}
            onChangeText={(apiKey) => onAuthConfigChange({ ...authConfig, apiKey })}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 16,
  },
  picker: {
    height: 50,
  },
  inputGroup: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
}); 