import {
  createDrawerNavigator,
  DrawerItem,
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer';
import React from 'react';
import { DARK_BLUE, LIGHT_BLUE } from 'src/constants';
import useAppContext from 'src/hooks/useAppContext';
import BoardScreen from 'src/screens/BoardScreen';
import MyBoardsScreen from 'src/screens/MyBoardsScreen';
import { logError } from 'src/utils/logging';

const Drawer = createDrawerNavigator();

const AuthenticatedDrawer = () => {
  const { boardId, boardName, logout: logoutCtx, switchBoard, setAlert } = useAppContext();

  const logout = () => {
    try {
      logoutCtx();
    } catch (error) {
      logError(error);
      setAlert('unable to logout, try again later');
    }
  };

  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        {boardId && (
          <DrawerItem
            label="switch boards"
            onPress={() => switchBoard() && props.navigation.closeDrawer()}
          />
        )}
        <DrawerItem label="logout" onPress={logout} />
      </DrawerContentScrollView>
    );
  }

  // TODO - about page, etc
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { backgroundColor: DARK_BLUE },
        drawerActiveTintColor: 'white',
        drawerActiveBackgroundColor: LIGHT_BLUE
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      {boardName ? (
        <>
          <Drawer.Screen
            name={boardName}
            component={BoardScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <Drawer.Screen
            name="my boards"
            component={MyBoardsScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
      {/* <Drawer.Group navigationKey={boardId ? 'board' : 'boards'}>
        <Drawer.Screen name="" component={} options={{ headerShown: false }} />
      </Drawer.Group> */}
    </Drawer.Navigator>
  );
};

export default AuthenticatedDrawer;
