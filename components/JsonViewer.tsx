import React from 'react';
import { Text, StyleSheet, ScrollView, View } from 'react-native';

interface JsonViewerProps {
  data: any;
}

const syntaxColors = {
  punctuation: '#fff',
  key: '#9cdcfe',
  string: '#ce9178',
  number: '#b5cea8',
  boolean: '#569cd6',
  null: '#569cd6',
};

function formatJsonString(jsonString: string) {
  // Divide il JSON in righe mantenendo la formattazione
  const lines = jsonString.split('\n');
  
  return lines.map((line, i) => {
    // Gestisce le righe con solo parentesi o virgole
    if (/^[\s]*[{}\[\],]*[\s]*$/.test(line)) {
      return (
        <Text key={i} style={styles.line}>
          <Text style={{ color: syntaxColors.punctuation }}>{line}</Text>
        </Text>
      );
    }

    // Trova la chiave e il valore nella riga
    const matches = line.match(/^(\s*)"(.+)":\s(.+)$/);
    if (matches) {
      const [_, indent, key, value] = matches;
      let formattedValue;

      // Formatta il valore in base al tipo
      if (value.startsWith('"') && value.endsWith('"')) {
        // String
        formattedValue = <Text style={{ color: syntaxColors.string }}>{value}</Text>;
      } else if (/^-?\d+\.?\d*$/.test(value.replace(',', ''))) {
        // Number
        formattedValue = <Text style={{ color: syntaxColors.number }}>{value}</Text>;
      } else if (['true', 'false'].includes(value.replace(',', ''))) {
        // Boolean
        formattedValue = <Text style={{ color: syntaxColors.boolean }}>{value}</Text>;
      } else if (value.replace(',', '') === 'null') {
        // Null
        formattedValue = <Text style={{ color: syntaxColors.null }}>{value}</Text>;
      } else {
        // Altri valori (oggetti, array)
        formattedValue = <Text style={{ color: syntaxColors.punctuation }}>{value}</Text>;
      }

      return (
        <Text key={i} style={styles.line}>
          <Text style={{ color: syntaxColors.punctuation }}>{indent}"</Text>
          <Text style={{ color: syntaxColors.key }}>{key}</Text>
          <Text style={{ color: syntaxColors.punctuation }}>": </Text>
          {formattedValue}
        </Text>
      );
    }

    // Righe che non corrispondono al pattern chiave-valore
    return <Text key={i} style={styles.line}>{line}</Text>;
  });
}

export default function JsonViewer({ data }: JsonViewerProps) {
  // Se data è undefined o null, mostra un messaggio appropriato
  if (data === undefined || data === null) {
    return <Text style={styles.emptyText}>Nessun dato disponibile</Text>;
  }

  // Assicurati che i dati siano una stringa JSON valida
  const jsonString = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  return (
    <ScrollView style={styles.container} horizontal>
      <ScrollView>
        <View style={styles.codeBlock}>
          {formatJsonString(jsonString)}
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
  },
  codeBlock: {
    padding: 12,
  },
  line: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#fff',
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
    padding: 8,
  },
}); 