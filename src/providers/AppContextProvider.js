import AsyncStorage from '@react-native-async-storage/async-storage';
import crashlytics from '@react-native-firebase/crashlytics';
import React, { useState, useEffect } from 'react';
import { Platform, Linking } from 'react-native';
import AppContext from 'src/context/AppContext';
import * as fbService from 'src/services/FirebaseService';
import { logError } from 'src/utils/logging';

const BOARD_KEY = 'boardId';
const EMAIL_KEY = 'emailForSignIn';

const AppContextProvider = ({ children }) => {
  const [alert, setAlert] = useState('');
  const [user, setUser] = useState(undefined);
  const [boardId, setBoardId] = useState(undefined);
  const [boardName, setBoardName] = useState(undefined);
  const [userChecked, setUserChecked] = useState(false);
  const [urlChecked, setUrlChecked] = useState(false);

  const loading = !(userChecked && urlChecked && boardId !== undefined && boardName !== undefined);
  const isAuthenticated = !!user && !loading;

  const handleUrl = async (url) => {
    if (fbService.checkIfSignInLink(url)) {
      const email = await AsyncStorage.getItem(EMAIL_KEY);
      if (!email) {
        crashlytics().log('no email saved in storage');
        setAlert('unable to verify email, try resending login email');
      }
      try {
        await fbService.signInWithLink(email, url);
        if (Platform.OS === 'web') window.location.href = '/';
      } catch (error) {
        logError(error);
        setAlert('unable to sign in, try resending login email');
        setUrlChecked(true);
      }
    } else {
      setUrlChecked(true);
    }
  };

  useEffect(() => {
    fbService.subscribeToAuthChanges(
      async (user) => {
        setUser(user);
        if (user) {
          await getCurrentBoard();
        } else {
          setBoard({ name: null, id: null });
        }
        setUserChecked(true);
      },
      (error) => {
        setAlert('unable to authenticate, try again later');
        setBoard({ name: null, id: null });
        setUser(null);
        setUserChecked(true);
        logError(error);
      }
    );
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleUrl(url);
      } else {
        setUrlChecked(true);
      }
    });
    const linkingListener = Linking.addEventListener('url', (link) => {
      handleUrl(link.url);
    });
    return () => {
      linkingListener.remove();
    };
  }, []);

  useEffect(() => {
    if (boardId) {
      AsyncStorage.setItem(BOARD_KEY, boardId);
    } else if (boardId === null) {
      AsyncStorage.removeItem(BOARD_KEY);
      setBoardName(null);
    }
  }, [boardId]);

  const logout = async () => {
    await fbService.logout();
    switchBoard();
  };

  const getCurrentBoard = async () => {
    const id = await AsyncStorage.getItem(BOARD_KEY);
    if (id) {
      try {
        const name = await fbService.loadOnce(`boards/${id}/name`);
        setBoard({ id, name });
      } catch (error) {
        logError(error);
        setBoard({ name: null, id: null });
      }
    } else {
      setBoard({ name: null, id: null });
    }
  };

  const emailSignInLink = async (email) => {
    await AsyncStorage.setItem(EMAIL_KEY, email);
    await fbService.emailSignInLink(email);
  };

  const addBoardToUser = async (email, boardId) => {
    await fbService.updateData(`boards/${boardId}/users/${fbService.encodeEmail(email)}`, true);
    await fbService.updateData(`users/${fbService.encodeEmail(email)}/boards/${boardId}`, true);
  };

  const switchBoard = async () => {
    setBoard({ name: null, id: null });
    setAlert('');
  };

  const setBoard = ({ name, id }) => {
    setBoardId(id);
    setBoardName(name);
  };

  const value = {
    user,
    setBoardId,
    boardId,
    alert,
    setAlert,
    setBoardName,
    boardName,
    logout,
    isAuthenticated,
    loading,
    setUrlChecked,
    emailSignInLink,
    addBoardToUser,
    switchBoard,
    setBoard
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
