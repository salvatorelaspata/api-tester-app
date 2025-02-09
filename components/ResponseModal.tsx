import React from 'react';
import {
    BottomSheetModal,
    BottomSheetView
} from '@gorhom/bottom-sheet';
import { Text, StyleSheet, ScrollView, View } from 'react-native';
import CollapsibleSection from './CollapsibleSection';
import JsonViewer from './JsonViewer';

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
                            <View style={styles.statusContainer}>
                                <Text style={[
                                    styles.statusText,
                                    response.status && response.status >= 400 ? styles.errorStatus : styles.successStatus
                                ]}>
                                    {response.status}
                                </Text>
                                <Text style={styles.timeText}>{response.time}ms</Text>
                            </View>

                            <CollapsibleSection title="Headers">
                                <JsonViewer data={response.headers || {}} />
                            </CollapsibleSection>

                            <CollapsibleSection title="Body" initiallyExpanded={true}>
                                <JsonViewer data={response.data || null} />
                            </CollapsibleSection>
                        </ScrollView>
                    )
                ) : (
                    <Text style={styles.emptyText}>Nessuna risposta disponibile</Text>
                )}
            </BottomSheetView>
        </BottomSheetModal>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    scrollView: {
        flex: 1,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    statusText: {
        fontSize: 24,
        fontWeight: 'bold',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    successStatus: {
        backgroundColor: '#e8f5e9',
        color: '#2e7d32',
    },
    errorStatus: {
        backgroundColor: '#ffebee',
        color: '#c62828',
    },
    timeText: {
        fontSize: 16,
        color: '#666',
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