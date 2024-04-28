import React from 'react';
import { Text } from 'react-native';
import AppStyles from 'src/AppStyles';
import { APP_TITLE } from 'src/constants';

function AppTitle() {
  return <Text style={AppStyles.subHeading}>{APP_TITLE}</Text>;
}

export default AppTitle;
