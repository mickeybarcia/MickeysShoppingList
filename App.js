import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Routes from 'src/components/Routes';
import ErrorBoundary from 'src/components/shared/ErrorBoundary';
import AppContextProvider from 'src/providers/AppContextProvider';

export default function App() {
  return (
    <ErrorBoundary>
      <AppContextProvider>
        <Routes />
      </AppContextProvider>
      <StatusBar style="auto" />
    </ErrorBoundary>
  );
}
