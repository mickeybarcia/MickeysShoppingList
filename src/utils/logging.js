import crashlytics from '@react-native-firebase/crashlytics';

export const logError = (error) => {
  crashlytics().recordError(error);
};
