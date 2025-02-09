import { Link } from 'expo-router';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="cloud-outline" size={64} color="#333333" />
        <Text style={styles.title}>Welcome to HTTP Client</Text>
        <Text style={styles.subtitle}>Test, debug e documenta le tue API requests in modo semplice</Text>
        
        <Link href="/request" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Inizia una Nuova Richiesta</Text>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
          </Pressable>
        </Link>

        <View style={styles.quickLinks}>
          <Link href="/collections" >
            <View style={styles.linkContainer}>
            <Ionicons name="folder-outline" size={24} color="#007AFF" />
            <Text style={styles.linkText}>Collections</Text>
            </View>
          </Link>
          <Link href="/history" >
            <View style={styles.linkContainer}>
            <Ionicons name="time-outline" size={24} color="#007AFF" />
            <Text style={styles.linkText}>Cronologia</Text>
            </View>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#333333',
  },
  subtitle: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 32,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  quickLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
  },
  linkContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 100,
    height: 100,
  },
  linkText: {
    color: '#007AFF',
    marginTop: 4,
    fontSize: 14,
  },
});