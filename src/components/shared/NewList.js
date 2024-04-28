import PropTypes from 'prop-types';
import React from 'react';
import { View, Text } from 'react-native';
import AppStyles from 'src/AppStyles';
import ItemInputField from 'src/components/shared/ItemInputField';

const NewList = ({ onAddList }) => {
  return (
    <View style={{ gap: 10 }}>
      <Text style={AppStyles.listTitle}>new list</Text>
      <ItemInputField onAddItem={(listName) => onAddList(listName)} placeholder="my list" />
    </View>
  );
};

NewList.propTypes = {
  onAddList: PropTypes.func.isRequired
};

export default NewList;
