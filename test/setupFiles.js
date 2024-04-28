jest.mock('react-native-keyboard-aware-scroll-view');

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('@react-native-firebase/crashlytics', () =>
  jest.fn().mockImplementation(() => ({
    log: jest.fn(),
    recordError: jest.fn()
  }))
);

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  addEventListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  getInitialURL: jest.fn().mockResolvedValue(null)
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);