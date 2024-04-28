import PropTypes from 'prop-types';
import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import AppStyles from 'src/AppStyles';
import Button from 'src/components/shared/Button';
import { DARK_BLUE } from 'src/constants';

const Form = ({ title, onComplete, buttonText, initialValue = '', placeholder = '' }) => {
  const [text, setText] = useState(initialValue);
  const [pauseButton, setPauseButton] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const onPress = () => {
    setPauseButton(true);
    setTimeout(() => {
      setPauseButton(false);
    }, 1000);
    onComplete(text);
  };

  return (
    <View style={styles.form}>
      <Text style={AppStyles.title}>{title}</Text>
      <View style={AppStyles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={AppStyles.inputFieldText}
          value={text}
          onChangeText={(text) => setText(text)}
          placeholder={placeholder}
          placeholderTextColor={DARK_BLUE}
          returnKeyType="done"
        />
      </View>
      <View style={{ justifyContent: 'center' }}>
        <Button onPress={onPress} text={buttonText} disabled={text === '' || pauseButton} />
      </View>
    </View>
  );
};

Form.propTypes = {
  initialValue: PropTypes.string,
  placeholder: PropTypes.string,
  onComplete: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  form: {
    gap: 10,
    maxWidth: 400
  }
})

export default Form;
