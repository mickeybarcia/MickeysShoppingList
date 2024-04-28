import React, { useState, useRef } from 'react';
import { View, Animated } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppStyles from 'src/AppStyles';
import Board from 'src/components/Board';
import DeleteBoardModal from 'src/components/DeleteBoardModal';
import DynamicHeader from 'src/components/headers/DynamicHeader';
import DynamicHeaderBoard from 'src/components/headers/DynamicHeaderBoard';
import FormModal from 'src/components/shared/FormModal';
import { DARK_BLUE } from 'src/constants';
import useAppContext from 'src/hooks/useAppContext';
import * as fbService from 'src/services/FirebaseService';
import { logError } from 'src/utils/logging';

const BoardScreen = ({ navigation }) => {
  const { boardId, boardName, addBoardToUser, setAlert } = useAppContext();
  const keyboardScrollView = useRef(null);
  const scrollOffsetY = useRef(new Animated.Value(0)).current;

  const [showLowOnly, setShowLowOnly] = useState(false);
  const [showShareBoardModal, setShowShareBoardModal] = useState(false);
  const [showRenameBoardModal, setShowRenameBoardModal] = useState(false);
  const [showDeleteBoardModal, setShowDeleteBoardModal] = useState(false);

  const shareBoard = async (email) => {
    try {
      await addBoardToUser(email, boardId);
      setAlert('user added');
    } catch (error) {
      logError(error);
      setAlert('unable to add user');
    }
  };

  const renameBoard = async (newName) => {
    try {
      await fbService.updateData(`boards/${boardId}/name`, newName);
    } catch (error) {
      logError(error);
      setAlert('unable to rename board');
    }
  };

  return (
    <View style={AppStyles.background}>
      <View style={AppStyles.screenContainer}>
        <FormModal
          title="select new board name"
          showModal={showRenameBoardModal}
          setShowModal={setShowRenameBoardModal}
          onComplete={renameBoard}
          buttonText="rename board"
          placeholder={boardName}
        />
        <FormModal
          title="add user by email"
          showModal={showShareBoardModal}
          setShowModal={setShowShareBoardModal}
          onComplete={shareBoard}
          buttonText="add user to board"
          placeholder="email"
        />
        <DeleteBoardModal showModal={showDeleteBoardModal} setShowModal={setShowDeleteBoardModal} />
        <DynamicHeader animatedValue={scrollOffsetY} navigation={navigation} />
        {boardName && (
          <DynamicHeaderBoard
            animatedValue={scrollOffsetY}
            onSwitchLowOnly={setShowLowOnly}
            showLowOnly={showLowOnly}
            boardName={boardName}
          />
        )}
        <KeyboardAwareScrollView
          ref={keyboardScrollView}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          keyboardOpeningTime={Number.MAX_SAFE_INTEGER}
          style={{ backgroundColor: DARK_BLUE }}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }], {
            useNativeDriver: false
          })}
          >
          {boardId && (
            <Board
              showLowOnly={showLowOnly}
              onUpdateLists={() => {}}  // TODO - do i still need this
              setShowShareBoardModal={setShowShareBoardModal}
              setShowRenameBoardModal={setShowRenameBoardModal}
              setShowDeleteBoardModal={setShowDeleteBoardModal}
            />
          )}
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

BoardScreen.propTypes = {};

export default BoardScreen;
