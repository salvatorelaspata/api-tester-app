import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

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
  const authTypes = ['Nessuna', 'Basic Auth', 'API Key'];
  const authValues: AuthType[] = ['none', 'basic', 'apiKey'];

  const handleAuthTypeChange = (index: number) => {
    const type = authValues[index];
    const newConfig = {
      type,
      username: undefined,
      password: undefined,
      apiKey: undefined,
      apiKeyName: undefined
    };
    onAuthConfigChange(newConfig);
  };

  const selectedIndex = authValues.indexOf(authConfig.type);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tipo di Autenticazione</Text>
      <SegmentedControl
        values={authTypes}
        selectedIndex={selectedIndex}
        onChange={(event) => {
          handleAuthTypeChange(event.nativeEvent.selectedSegmentIndex);
        }}
        style={styles.segmentedControl}
      />

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
    color: '#333',
  },
  segmentedControl: {
    marginBottom: 16,
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