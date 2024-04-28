import { MaterialIcons } from '@expo/vector-icons';
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Animated, ScrollView, StyleSheet, Pressable } from 'react-native';
import AppStyles from 'src/AppStyles';
import BoardName from 'src/components/BoardName';
import DynamicHeader from 'src/components/headers/DynamicHeader';
import FormModal from 'src/components/shared/FormModal';
import Spacer from 'src/components/shared/Spacer';
import { ICON_SIZE_LARGE, ROW_GAP } from 'src/constants';
import useAppContext from 'src/hooks/useAppContext';
import useFirebaseQuery from 'src/hooks/useFirebaseQuery';
import { Board } from 'src/models';
import { encodeEmail } from 'src/services/FirebaseService';
import * as fbService from 'src/services/FirebaseService';
import { logError } from 'src/utils/logging';

const MyBoardsScreen = ({ navigation }) => {
  const { user, addBoardToUser, setAlert, setBoard } = useAppContext();
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const { data, error } = useFirebaseQuery(`users/${encodeEmail(user.email)}/boards`);
  useEffect(() => {
    if (error) {
      logError(error);
      setAlert('unable to load all boards');
    }
  }, [error]);
  const createBoard = async (name) => {
    try {
      const id = await fbService.addPath('boards', new Board(name).encode());
      await addBoardToUser(user.email, id);
      setBoard({ id, name });
    } catch (error) {
      logError(error);
      setAlert('unable to create board');
    }
  };
  const boardIds = data
    ? Object.entries(data)
        .filter(([, isActive]) => isActive)
        .map(([id]) => id)
    : null;
  return (
    <View style={AppStyles.background}>
      <View style={AppStyles.screenContainer}>
        <DynamicHeader animatedValue={scrollOffsetY} navigation={navigation} />
        <FormModal
          title="name the board"
          showModal={showCreateBoardModal}
          setShowModal={setShowCreateBoardModal}
          onComplete={createBoard}
          buttonText="create new board"
          placeholder="my board"
        />
        <View style={[styles.titleContainer, AppStyles.columnContainer]}>
          <Text style={AppStyles.title}>my boards</Text>
          <Pressable accessibilityRole="create" onPress={() => setShowCreateBoardModal(true)}>
            <MaterialIcons name="add" size={ICON_SIZE_LARGE} color="white" />
          </Pressable>
        </View>
        <Spacer />
        {boardIds && boardIds.length > 0 && (
          <ScrollView style={{ height: '100%' }}>
            <View style={[{ gap: ROW_GAP }, AppStyles.columnContainer]}>
              {boardIds.map((id, index) => {
                return (
                  <View key={index}>
                    <BoardName id={id} />
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )}
        {boardIds && boardIds.length === 0 && (
          <View style={{ alignItems: 'center' }}>
            <Text style={AppStyles.subHeading}>click + to create your first board</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

MyBoardsScreen.propTypes = {};

export default MyBoardsScreen;
