import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendSignInLinkToEmail,
  signOut
} from 'firebase/auth';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';
import { getDatabase, push, ref, set, onValue, get } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyDhW83x6Ly2G1pAeUbZXMb4wCSWXSCJGiQ',
  authDomain: 'shoppinglist-e84b8.firebaseapp.com',
  projectId: 'shoppinglist-e84b8',
  storageBucket: 'shoppinglist-e84b8.appspot.com',
  messagingSenderId: '971048186595',
  appId: '1:971048186595:web:c86bc2d850eccea42e8bd6',
  databaseUrl: 'https://shoppinglist-e84b8-default-rtdb.firebaseio.com/'
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const actionCodeSettings = {
  url:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:19006/'
      : 'https://mickeybarcia.github.io/ShoppingList/',
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.mickey.mickeysshoppinglist'
  },
  dynamicLinkDomain: 'shoppinglisttrackerapp.page.link'
};

export const signInWithLink = async (email, url) => {
  const auth = getAuth();
  await signInWithEmailLink(auth, email, url);
};

export const checkIfSignInLink = (url) => {
  const auth = getAuth();
  return isSignInWithEmailLink(auth, url);
};

export const logout = async () => {
  const auth = getAuth();
  await signOut(auth);
};

export const subscribeToAuthChanges = (onAuthChange, onError) => {
  const auth = getAuth();
  const unsubscribe = auth.onAuthStateChanged(onAuthChange, onError);
  return unsubscribe;
};

export const subscribeToDataChanges = (path, onDataChange, onError) => {
  const dataRef = ref(db, path);
  const unsubscribe = onValue(dataRef, onDataChange, onError);
  return unsubscribe;
};

export const emailSignInLink = async (email) => {
  const auth = getAuth();
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
};

export const updateData = async (path, newData) => {
  const dataRef = ref(db, path);
  await set(dataRef, newData);
};

export const addPath = async (path, newData = null) => {
  const newRef = push(ref(db, path));
  const id = newRef.key;
  if (newData) await set(newRef, newData);
  return id;
};

export const loadOnce = async (path) => {
  const dataRef = ref(db, path);
  const snapshot = await get(dataRef);
  return snapshot.val();
};

export const encodeEmail = (email) => email.replace('.', '%2e');
