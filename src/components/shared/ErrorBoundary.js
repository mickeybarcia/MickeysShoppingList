import React from 'react';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
import RNRestart from 'react-native-restart';
import AppStyles from 'src/AppStyles';
import AppTitle from 'src/components/headers/AppTitle';
import Button from 'src/components/shared/Button';
import Spacer from 'src/components/shared/Spacer';
import { logError } from 'src/utils/logging';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_) {
    return { hasError: true };
  }

  componentDidCatch(error, _) {
    logError(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={AppStyles.background}>
          <View style={AppStyles.screenContainer}>
            <View style={styles.center}>
              <AppTitle />
            </View>
            <Spacer />
            <Text style={AppStyles.title}>something went wrong idk</Text>
            <Spacer />
            <Button text="try again i guess" onPress={() => RNRestart.Restart()} />
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}
const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ErrorBoundary;
