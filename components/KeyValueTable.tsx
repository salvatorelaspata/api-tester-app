import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';

interface FileData {
  uri: string;
  type: string;
  name: string;
  size: number;
}

interface KeyValuePair {
  key: string;
  value: string;
  isFile: boolean;
  file?: FileData;
}

interface KeyValueTableProps {
  data: KeyValuePair[];
  onChange: (data: KeyValuePair[]) => void;
  showFileOption?: boolean;
  onFilePick?: (index: number) => void;
}

export default function KeyValueTable({ data, onChange, showFileOption, onFilePick }: KeyValueTableProps) {
  const handleAdd = () => {
    onChange([...data, { key: '', value: '', isFile: false }]);
  };

  const handleChange = (index: number, field: 'key' | 'value' | 'isFile', value: string | boolean) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  const handleRemove = (index: number) => {
    const newData = data.filter((_: KeyValuePair, i: number) => i !== index);
    onChange(newData);
  };

  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View key={index} style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Key"
            value={item.key}
            onChangeText={(value) => handleChange(index, 'key', value)}
          />
          {showFileOption && (
            <TouchableOpacity
              style={[styles.fileButton, item.isFile && styles.fileButtonActive]}
              onPress={() => handleChange(index, 'isFile', !item.isFile)}
            >
              <Text style={[styles.fileButtonText, item.isFile && styles.fileButtonTextActive]}>
                {item.isFile ? 'File' : 'Text'}
              </Text>
            </TouchableOpacity>
          )}
          {showFileOption && item.isFile && (
            <TouchableOpacity
              style={styles.filePickButton}
              onPress={() => onFilePick?.(index)}
            >
              <Text style={styles.filePickButtonText}>
                {item.file ? 'Change File' : 'Pick File'}
              </Text>
            </TouchableOpacity>
          )}
          <TextInput
            style={styles.input}
            placeholder="Value"
            value={item.value}
            onChangeText={(value) => handleChange(index, 'value', value)}
          />
          <Button title="-" onPress={() => handleRemove(index)} />
        </View>
      ))}
      <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8
  },
  fileButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  fileButtonActive: {
    backgroundColor: '#2196F3',
  },
  fileButtonText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
  fileButtonTextActive: {
    color: '#ffffff',
  },
  addButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  addButtonText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
  filePickButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  filePickButtonText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
});