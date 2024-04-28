import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppStyles from 'src/AppStyles';
import AppTitle from 'src/components/headers/AppTitle';
import Form from 'src/components/shared/Form';
import Spacer from 'src/components/shared/Spacer';
import useAppContext from 'src/hooks/useAppContext';
import { logError } from 'src/utils/logging';

export default function WelcomeScreen() {
  const { setAlert, emailSignInLink: emailSignInLinkCtx } = useAppContext();
  const emailSignInLink = async (email) => {
    try {
      await emailSignInLinkCtx(email);
      setAlert('email sent');
    } catch (error) {
      logError(error);
      setAlert('unable to send email, try again later');
    }
  };
  return (
    <View style={AppStyles.background}>
      <View style={AppStyles.screenContainer}>
        <View style={styles.center}>
          <AppTitle />
        </View>
        <Spacer />
        <View style={AppStyles.columnContainer}>
          <Form
            title="email sign in link"
            onComplete={emailSignInLink}
            buttonText="send link"
            initialValue=""
            placeholder="mickey@mickey.com"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});
