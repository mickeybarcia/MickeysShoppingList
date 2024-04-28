import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import AppContextProvider from 'src/providers/AppContextProvider';
import MyBoardsScreen from 'src/screens/MyBoardsScreen';
import { addPath } from 'src/services/FirebaseService';

const testBoardId = 'abc';
const testBoardName = 'groceries';

jest.mock('src/hooks/useAppContext', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    user: { email: 'email' },
    addBoardToUser: jest.fn(),
    setAlert: jest.fn(),
    setBoard: jest.fn()
  })
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn(),
  setItem: jest.fn()
}));

jest.mock('src/services/FirebaseService', () => ({
  __esModule: true,
  subscribeToAuthChanges: jest.fn().mockImplementation((onSuccess) => {
    onSuccess({ email: 'email' });
  }),
  encodeEmail: jest.fn().mockReturnValue('email'),
  addPath: jest.fn(),
  subscribeToDataChanges: jest.fn().mockImplementation((path, onDataChange, onError) => {
    if (path === 'users/email/boards') {
      onDataChange({
        exists: jest.fn().mockReturnValue(true),
        val: jest.fn().mockReturnValue({ [testBoardId]: true })
      });
    } else if (path === `boards/${testBoardId}/name`) {
      onDataChange({
        exists: jest.fn().mockReturnValue(true),
        val: jest.fn().mockReturnValue(testBoardName)
      });
    }
    return jest.fn();
  })
}));

describe('My Boards page', () => {
  it('loads board names', async () => {
    render(
      <AppContextProvider>
        <MyBoardsScreen />
      </AppContextProvider>
    );
    await waitFor(() => {
      const name = screen.queryByText(testBoardName);
      expect(name).toBeTruthy();
    });
  });
  it('lets you create boards', async () => {
    render(
      <AppContextProvider>
        <MyBoardsScreen />
      </AppContextProvider>
    );
    const plusButton = screen.getByRole('create');
    fireEvent.press(plusButton);
    await waitFor(() => {
      const texts = screen.getAllByText('create new board');
      expect(texts.length).toBeGreaterThan(0);
    });
    const input = screen.getByPlaceholderText('my board');
    fireEvent.changeText(input, 'my new board');
    const createButton = screen.getByText('create new board');
    fireEvent.press(createButton);
    await waitFor(() => {
      const texts = screen.queryByText('create new board');
      expect(texts).not.toBeTruthy();
      expect(addPath).toHaveBeenCalled();
    });
  });
});
