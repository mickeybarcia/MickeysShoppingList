import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { APP_TITLE } from 'src/constants';
import WelcomeScreen from 'src/screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

const WelcomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false, title: APP_TITLE }}
      />
    </Stack.Navigator>
  );
};

export default WelcomeStack;
