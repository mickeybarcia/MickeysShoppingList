import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, SafeAreaView } from 'react-native';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import AppTitle from 'src/components/headers/AppTitle';
import Spacer from 'src/components/shared/Spacer';
import { DARK_BLUE } from 'src/constants';
import useAppContext from 'src/hooks/useAppContext';
import AuthenticatedDrawer from 'src/navigation/AuthenticatedDrawer';
import WelcomeStack from 'src/navigation/WelcomeStack';

const Routes = () => {
  const { loading, isAuthenticated, alert, setAlert } = useAppContext();

  useEffect(() => {
    if (alert !== '') {
      showMessage({
        message: alert,
        duration: 3000,
        style: styles.alert,
        hideOnPress: true,
        onHide: () => setAlert(''),
        color: DARK_BLUE
      });
    }
  }, [alert]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <AppTitle />
        <Spacer />
        <ActivityIndicator animating={loading} />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <FlashMessage />
      <NavigationContainer>
        {isAuthenticated ? <AuthenticatedDrawer /> : <WelcomeStack />}
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default Routes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BLUE
  },
  loading: {
    backgroundColor: DARK_BLUE,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  alert: {
    backgroundColor: 'white',
    opacity: 0.8
  }
});
