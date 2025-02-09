import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'requestHistory';

// Definizione dell'interfaccia per la richiesta
interface RequestItem {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: string;
  timestamp?: number;
  status: number;
}

export function useRequestHistory() {
  // Specifichiamo il tipo dello stato
  const [history, setHistory] = useState<RequestItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem(HISTORY_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory) as RequestItem[]);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  // Aggiungiamo il tipo al parametro request
  const saveRequest = async (request: RequestItem) => {
    try {
      const newHistory = [request, ...history.slice(0, 49)];
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  return {
    history,
    saveRequest
  };
}