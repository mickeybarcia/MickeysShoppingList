import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable } from 'react-native';

const MenuButton = ({ navigation }) => {
  return (
    <Pressable accessibilityRole="menu" onPress={() => navigation.openDrawer()}>
      <MaterialIcons name="menu" size={40} color="white" />
    </Pressable>
  );
};

export default MenuButton;
