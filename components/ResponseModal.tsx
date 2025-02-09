import React from 'react';
import {
    BottomSheetModal,
    BottomSheetView
  } from '@gorhom/bottom-sheet';
import { Text, StyleSheet, Button, ScrollView } from 'react-native';

interface ResponseData {
    error?: string;
    status?: number;
    time?: number;
    headers?: Record<string, string | string[] | undefined>;
    data?: any;
}

interface ResponseModalProps {
    bottomSheetModalRef: React.RefObject<BottomSheetModal>;
    handleSheetChanges: (index: number) => void;
    response: ResponseData | null;
}

export default function ResponseModal({ bottomSheetModalRef, handleSheetChanges, response }: ResponseModalProps) {
    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            onChange={handleSheetChanges}
            snapPoints={['50%', '90%']}
            enableDynamicSizing={true}
            enablePanDownToClose={true}
        >
            <BottomSheetView style={styles.contentContainer}>
                {response ? (
                    response.error ? (
                        <Text style={styles.errorText}>Errore: {response.error}</Text>
                    ) : (
                        <ScrollView style={styles.scrollView}>
                            <Text style={styles.statusText}>Stato: {response.status}</Text>
                            <Text style={styles.timeText}>Tempo: {response.time}ms</Text>
                            <Text style={styles.headerTitle}>Headers:</Text>
                            <Text style={styles.codeBlock}>
                                {JSON.stringify(response.headers, null, 2)}
                            </Text>
                            <Text style={styles.headerTitle}>Body:</Text>
                            <Text style={styles.codeBlock}>
                                {JSON.stringify(response.data, null, 2)}
                            </Text>
                        </ScrollView>
                    )
                ) : (
                    <Text style={styles.emptyText}>Nessuna risposta disponibile</Text>
                )}
            </BottomSheetView>
        </BottomSheetModal>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    scrollView: {
        flex: 1,
    },
    statusText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    timeText: {
        fontSize: 16,
        marginBottom: 16,
        color: '#666',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 8,
    },
    codeBlock: {
        fontFamily: 'monospace',
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        fontSize: 14,
    },
    errorText: {
        color: '#d32f2f',
        fontSize: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});