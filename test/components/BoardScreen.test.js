import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import React, { useRef } from 'react';
import AppContextProvider from 'src/providers/AppContextProvider';
import BoardScreen from 'src/screens/BoardScreen';

const testBoardId = 'abc';
const testBoardName = 'groceries';

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const React = require('react');
  const KeyboardAwareScrollView = React.forwardRef(({ children }, ref) => {
    return <div ref={ref}>{children}</div>;
  });
  return { KeyboardAwareScrollView };
});

jest.mock('src/hooks/useAppContext', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    user: { email: 'email' },
    addBoardToUser: jest.fn(),
    setAlert: jest.fn(),
    setBoard: jest.fn(),
    boardId: testBoardId,
    boardName: testBoardName,
    setBoardName: jest.fn()
  })
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(testBoardId),
  removeItem: jest.fn(),
  setItem: jest.fn()
}));

jest.mock('src/services/FirebaseService', () => ({
  __esModule: true,
  subscribeToAuthChanges: jest.fn().mockImplementation((onSuccess) => {
    onSuccess({ email: 'email' });
  }),
  encodeEmail: jest.fn().mockReturnValue('email'),
  subscribeToDataChanges: jest.fn().mockImplementation((_, onDataChange, _) => {
    onDataChange({
      exists: jest.fn().mockReturnValue(true),
      val: jest.fn().mockReturnValue({
        name: testBoardName,
        lists:
          '[{"name": "dairy", "items": [{"name": "milk", "isLow":false}, {"name": "eggs", "isLow":false}]}]'
      })
    });
    return jest.fn();
  })
}));

describe('Boards page', () => {
  it('loads board', async () => {
    render(
      <AppContextProvider>
        <BoardScreen />
      </AppContextProvider>
    );
    await waitFor(() => {
      const name = screen.queryByText(testBoardName);
      expect(name).toBeTruthy();
      const listName = screen.queryByText('dairy');
      expect(listName).toBeTruthy();
      const itemName = screen.queryByText('milk');
      expect(itemName).toBeTruthy();
    });
  });
  it('lets you add list', async () => {
    render(
      <AppContextProvider>
        <BoardScreen />
      </AppContextProvider>
    );
    await waitFor(() => {
      const createButton = screen.getByText('new list');
      fireEvent.press(createButton);
      const input = screen.getByPlaceholderText('my list');
      fireEvent.changeText(input, 'fruit');
      const addButtons = screen.getAllByRole('add-item');
      const addButton = addButtons[addButtons.length - 1];
      fireEvent.press(addButton);
      const newInput = screen.queryByPlaceholderText('my list');
      expect(newInput).not.toBeTruthy()
    });
  });
});
