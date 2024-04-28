import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Modal, Pressable } from 'react-native';
import AppStyles from 'src/AppStyles';
import Form from 'src/components/shared/Form';
import { ICON_SIZE_LARGE } from 'src/constants';

const FormModal = ({ title, showModal, setShowModal, onComplete, buttonText, placeholder }) => {
  const close = () => setShowModal(false);
  const complete = async (name) => {
    await onComplete(name);
    close();
  };
  return (
    <Modal animationType="slide" transparent visible={showModal} coverScreen onRequestClose={close}>
      <View style={AppStyles.modalContainer}>
        <View style={AppStyles.modal}>
          <Pressable onPress={close} style={{ alignSelf: 'flex-end' }}>
            <MaterialIcons name="close" size={ICON_SIZE_LARGE} color="white" />
          </Pressable>
          <View style={{ padding: 30 }}>
            <Form
              title={title}
              onComplete={complete}
              buttonText={buttonText}
              placeholder={placeholder}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FormModal;
