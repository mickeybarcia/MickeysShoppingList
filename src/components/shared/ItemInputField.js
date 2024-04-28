import { MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import AppStyles from 'src/AppStyles';
import { ICON_SIZE } from 'src/constants';

const ItemInputField = ({ onAddItem, placeholder }) => {
  const [item, setItem] = useState('');
  const textInput = useRef(null);

  const handleAddItem = (value) => {
    onAddItem(value);
    setItem('');
  };

  return (
    <View style={AppStyles.inputContainer}>
      <TextInput
        style={AppStyles.inputFieldText}
        value={item}
        onChangeText={(text) => setItem(text)}
        placeholder={placeholder}
        placeholderTextColor="white"
        ref={textInput}
        returnKeyType="done"
        onSubmitEditing={() => {
          handleAddItem(item);
          // TODO - textInput.current.focus(); - do we even want to refocus
        }}
        blurOnSubmit={false}
      />
      <Pressable accessibilityRole="add-item" onPress={() => handleAddItem(item)}>
        <View style={[AppStyles.iconButton, { marginRight: 10 }]}>
          <MaterialIcons name="keyboard-arrow-up" size={ICON_SIZE} color="black" />
        </View>
      </Pressable>
    </View>
  );
};

ItemInputField.propTypes = {
  placeholder: PropTypes.string,
  onAddItem: PropTypes.func.isRequired
};

export default ItemInputField;
