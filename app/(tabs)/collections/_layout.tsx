import { persistor, store } from "@/store";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function CollectionsLayout() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Stack>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="[id]" options={{ title: 'Collections' }} />
                </Stack>
            </PersistGate>
        </Provider>
    );
}