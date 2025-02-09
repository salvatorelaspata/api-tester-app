import { View, TextInput, Button, StyleSheet } from 'react-native';

interface KeyValuePair {
  key: string;
  value: string;
}

interface KeyValueTableProps {
  data: KeyValuePair[];
  onChange: (data: KeyValuePair[]) => void;
}

export default function KeyValueTable({ data, onChange }: KeyValueTableProps) {
  const handleAddRow = () => {
    onChange([...data, { key: '', value: '' }]);
  };

  const handleChange = (index: number, field: 'key' | 'value', value: string) => {
    const newData = [...data];
    newData[index][field] = value;
    onChange(newData);
  };

  const handleRemove = (index: number) => {
    const newData = data.filter((_: KeyValuePair, i: number) => i !== index);
    onChange(newData);
  };

  return (
    <View style={styles.container}>
      {data.map((row: KeyValuePair, index: number) => (
        <View key={index} style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Key"
            value={row.key}
            onChangeText={(text) => handleChange(index, 'key', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Value"
            value={row.value}
            onChangeText={(text) => handleChange(index, 'value', text)}
          />
          <Button title="-" onPress={() => handleRemove(index)} />
        </View>
      ))}
      <Button title="Add Header" onPress={handleAddRow} />
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
  }
});