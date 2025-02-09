import { StyleSheet, View } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

// Definiamo il tipo per i metodi HTTP
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Definiamo l'interfaccia per le props
interface MethodPickerProps {
  selectedValue: HttpMethod;
  onValueChange: (itemValue: HttpMethod) => void;
}

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export const getMethodColor = (method: string) => {
  const colors: Record<string, string> = {
    GET: '#2196F3',    // Blu
    POST: '#4CAF50',   // Verde
    PUT: '#FF9800',    // Arancione
    PATCH: '#9C27B0',  // Viola
    DELETE: '#F44336', // Rosso
  };
  return colors[method] || '#000000';
};

export default function MethodPicker({ selectedValue, onValueChange }: MethodPickerProps) {
  return (
    <View style={styles.container}>
      <SegmentedControl
        values={HTTP_METHODS}
        selectedIndex={HTTP_METHODS.indexOf(selectedValue)}
        onChange={(event) => {
          const index = event.nativeEvent.selectedSegmentIndex;
          onValueChange(HTTP_METHODS[index] as HttpMethod);
        }}
        style={styles.segmentedControl}
        tabStyle={styles.tabStyle}
        tintColor={getMethodColor(selectedValue)}
        fontStyle={{ color: '#000000' }}
        activeFontStyle={{ color: '#FFFFFF' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  segmentedControl: {},
  tabStyle: {}
});