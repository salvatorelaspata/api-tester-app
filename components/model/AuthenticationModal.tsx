import React from 'react';
import {
  BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView
} from '@gorhom/bottom-sheet';
import { StyleSheet, Text, View } from 'react-native';
import RequestAuthentication, { AuthType } from '../RequestAuthentication';

interface AuthConfig {
  type: AuthType;
  username?: string;
  password?: string;
  apiKey?: string;
  apiKeyName?: string;
}

interface AuthenticationModalProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  authConfig: AuthConfig;
  onAuthConfigChange: (config: AuthConfig) => void;
}

export default function AuthenticationModal({ 
  bottomSheetModalRef, 
  authConfig, 
  onAuthConfigChange 
}: AuthenticationModalProps) {
  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={['30%', '50%', '85%']}
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} enableTouchThrough={true} />
      )}
    >
      <BottomSheetView style={styles.contentContainer}>
        <RequestAuthentication 
          authConfig={authConfig}
          onAuthConfigChange={onAuthConfigChange}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
}); 