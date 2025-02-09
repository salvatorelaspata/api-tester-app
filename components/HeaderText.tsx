import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { StyleSheet } from "react-native";

export default function HeaderText({ title, subtitle }: { title: string, subtitle?: string }) {
    return <ThemedView style={styles.headerContainer}>
        <ThemedText type="title">{title}</ThemedText>
        {subtitle && <ThemedText type="subtitle">{subtitle}</ThemedText>}
    </ThemedView>
}

const styles = StyleSheet.create({
    headerContainer: {
        padding: 16,
    },
});
