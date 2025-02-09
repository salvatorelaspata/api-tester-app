import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import RequestAuthentication, { AuthType } from './RequestAuthentication';

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
  const renderBackdrop = React.useCallback(
    (props: any) => <BottomSheetBackdrop {...props} pressBehavior="close" />,
    []
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={['50%']}
      index={0}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
    >
      <View style={styles.container}>
        <RequestAuthentication 
          authConfig={authConfig}
          onAuthConfigChange={onAuthConfigChange}
        />
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
}); 