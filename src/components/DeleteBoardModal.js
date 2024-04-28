import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Modal, Pressable, StyleSheet, Text } from 'react-native';
import AppStyles from 'src/AppStyles';
import Button from 'src/components/shared/Button';
import { ICON_SIZE_LARGE } from 'src/constants';
import useAppContext from 'src/hooks/useAppContext';
import * as fbService from 'src/services/FirebaseService';
import { logError } from 'src/utils/logging';

import Spacer from './shared/Spacer';

const DeleteBoardModal = ({ showModal, setShowModal }) => {
  const { setAlert, switchBoard, boardId, user } = useAppContext();
  const close = () => setShowModal(false);
  const complete = async () => {
    try {
      await fbService.updateData(
        `users/${fbService.encodeEmail(user.email)}/boards/${boardId}`,
        false
      );
      switchBoard();
    } catch (error) {
      setAlert('unable to delete board');
      logError(error);
    } finally {
      close();
    }
  };
  return (
    <Modal animationType="slide" transparent visible={showModal} coverScreen onRequestClose={close}>
      <View style={AppStyles.modalContainer}>
        <View style={AppStyles.modal}>
          <Pressable onPress={close} style={{ alignSelf: 'flex-end' }}>
            <MaterialIcons name="close" size={ICON_SIZE_LARGE} color="white" />
          </Pressable>
          <View style={styles.container}>
            <Text style={AppStyles.title}>remove board from my boards?</Text>
            <Text style={AppStyles.subHeading}>other board members will still have access</Text>
            <Spacer />
            <Button onPress={complete} text="yes" />
            <Button onPress={close} text="no" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    gap: 10
  }
});

export default DeleteBoardModal;
