import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native";
import HeaderText from "@/components/HeaderText";

export default function Credentials() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <HeaderText title="Credentials" subtitle="coming soon..." />
        </SafeAreaView>
    )
}