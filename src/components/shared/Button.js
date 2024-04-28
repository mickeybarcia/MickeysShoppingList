import PropTypes from 'prop-types';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { DARK_BLUE, RADIUS } from 'src/constants';

const Button = ({ onPress, text, disabled = false }) => {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <View style={[styles.container, disabled && styles.disabled]}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </Pressable>
  );
};

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  disabled: PropTypes.bool
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    minWidth: 100
  },
  text: {
    color: DARK_BLUE,
    fontSize: 18,
    fontWeight: '400'
  },
  disabled: {
    opacity: 0.5
  }
});

export default Button;
