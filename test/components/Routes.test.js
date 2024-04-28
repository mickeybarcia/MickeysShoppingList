import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import Routes from 'src/components/Routes';
import AppContextProvider from 'src/providers/AppContextProvider';
import { subscribeToAuthChanges } from 'src/services/FirebaseService';

const testBoardName = 'groceries';
const testUser = { email: 'email '}

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn(),
  setItem: jest.fn()
}));

jest.mock('src/services/FirebaseService', () => ({
  __esModule: true,
  subscribeToAuthChanges: jest.fn().mockImplementation((onSuccess) => {
    onSuccess(null);
  }),
  encodeEmail: jest.fn().mockReturnValue('email'),
  subscribeToDataChanges: jest.fn().mockImplementation((path, onDataChange, onError) => {
    onDataChange({
      exists: jest.fn().mockReturnValue(true),
      val: jest.fn().mockReturnValue([])
    });
    return jest.fn();
  }),
  loadOnce: jest.fn().mockResolvedValue(testBoardName)
}));

describe('Welcome page', () => {
  it('shows sign in by default', async () => {
    render(
      <AppContextProvider>
        <Routes />
      </AppContextProvider>
    );
    await waitFor(() => {
      const texts = screen.getAllByText('email sign in link');
      expect(texts.length).toBeGreaterThan(0);
    });
  });
});

describe('My boards', () => {
  it('shows my boards for users if no previously selected board', async () => {
    subscribeToAuthChanges.mockImplementation((onSuccess) => {
      onSuccess(testUser);
    });
    render(
      <AppContextProvider>
        <Routes />
      </AppContextProvider>
    );
    await waitFor(() => {
      const texts = screen.getAllByText('my boards');
      expect(texts.length).toBeGreaterThan(0);
    });
  });
  it('has a menu nav', async () => {
    subscribeToAuthChanges.mockImplementation((onSuccess) => {
      onSuccess(testUser);
    });
    render(
      <AppContextProvider>
        <Routes />
      </AppContextProvider>
    );
    await waitFor(() => {
      const menu = screen.getByRole('menu');
      expect(menu).toBeTruthy();
    });
    const menu = screen.getByRole('menu');
    fireEvent.press(menu);
    await waitFor(() => {
      const logoutText = screen.queryByText('logout');
      expect(logoutText).toBeTruthy();
      const boardNameText = screen.queryByText(testBoardName);
      expect(boardNameText).not.toBeTruthy();
    });
  });
});

describe('Current board', () => {
  it('shows current board if one was last used', async () => {
    subscribeToAuthChanges.mockImplementation((onSuccess) => {
      onSuccess(testUser);
    });
    AsyncStorage.getItem.mockResolvedValue('123');
    render(
      <AppContextProvider>
        <Routes />
      </AppContextProvider>
    );
    await waitFor(() => {
      const texts = screen.getAllByText(testBoardName);
      expect(texts.length).toBeGreaterThan(0);
    });
  });
  it('has a menu nav', async () => {
    subscribeToAuthChanges.mockImplementation((onSuccess) => {
      onSuccess(testUser);
    });
    render(
      <AppContextProvider>
        <Routes />
      </AppContextProvider>
    );
    await waitFor(() => {
      const menu = screen.getByRole('menu');
      expect(menu).toBeTruthy();
    });
    const menu = screen.getByRole('menu');
    fireEvent.press(menu);
    await waitFor(() => {
      const logoutText = screen.queryByText('logout');
      expect(logoutText).toBeTruthy();
      const boardNameText = screen.queryByText(testBoardName);
      expect(boardNameText).toBeTruthy();
    });
  });
});
