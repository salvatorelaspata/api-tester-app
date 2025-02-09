import { persistor, store } from "@/store";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function CredentialsLayout() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Stack>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                </Stack>
            </PersistGate>
        </Provider>
    );
}