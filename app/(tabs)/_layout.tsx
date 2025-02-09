import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { Provider } from "react-redux";
import { persistor, store } from "@/store";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Tabs screenOptions={{
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
          },
          tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: '#666666',
          headerShown: false,
        }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="request"
            options={{
              title: 'Request',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="code-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="collections"
            options={{
              title: 'Collections',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="folder-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="history"
            options={{
              title: 'History',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="time-outline" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </PersistGate>
    </Provider>
  );
}
