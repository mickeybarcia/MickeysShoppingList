import { MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AppStyles from 'src/AppStyles';
import { DARK_BLUE, ICON_SIZE, LIGHT_BLUE, RADIUS, ROW_HEIGHT } from 'src/constants';

const ListItem = ({ item, onSwitchItemStatus, onDeleteItem }) => {
  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <TouchableOpacity onPress={onSwitchItemStatus}>
          {item.isLow && <MaterialIcons name="warning" size={ICON_SIZE} color="white" />}
          {!item.isLow && <MaterialIcons name="check" size={ICON_SIZE} color="white" />}
        </TouchableOpacity>
      </View>
      <View style={[styles.itemContainer, AppStyles.rowContainer]}>
        <Text style={AppStyles.rowItemName}>{item.name}</Text>
        <TouchableOpacity onPress={onDeleteItem}>
          <MaterialIcons name="close" size={ICON_SIZE} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ListItem;

ListItem.propTypes = {
  item: PropTypes.object.isRequired,
  onSwitchItemStatus: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  showLowOnly: PropTypes.bool
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: DARK_BLUE,
    gap: 10
  },
  statusContainer: {
    backgroundColor: LIGHT_BLUE,
    borderRadius: RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    width: ROW_HEIGHT,
    height: ROW_HEIGHT
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1
  }
});
