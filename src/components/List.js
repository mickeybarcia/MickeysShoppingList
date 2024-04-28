import { MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import AppStyles from 'src/AppStyles';
import { ICON_SIZE_LARGE, LIGHT_BLUE, ICON_SIZE } from 'src/constants';

import ListItem from './ListItem';
import ItemInputField from './shared/ItemInputField';
import NewList from './shared/NewList';

const List = ({
  name,
  items,
  showLowOnly,
  onRenameList,
  onAddItem,
  onDeleteList,
  onDeleteItem,
  onSwitchItemStatus,
  onMoveListDown,
  onMoveListUp,
  onAddList
}) => {
  const [newListName, setNewListName] = useState(name);
  const [showRenameList, setShowRenameList] = useState(false);
  const [showNewList, setShowNewList] = useState(null);

  const addList = (name) => {
    setShowNewList(false);
    onAddList(name);
  };

  const renameList = (newListName) => {
    setShowRenameList(false);
    newListName !== name && onRenameList(newListName);
  };

  const cancelRenameList = () => {
    setNewListName(name);
    setShowRenameList(false);
  };

  return (
    <View style={{ gap: 10 }}>
      <View style={styles.titleContainer}>
        {!showRenameList && (
          <View style={styles.rightTitleContainer}>
            <Pressable onPress={() => setShowRenameList(true)}>
              <Text style={AppStyles.listTitle}>{name}</Text>
            </Pressable>
            {!showLowOnly && (
              <Pressable onPress={onMoveListUp}>
                <MaterialIcons name="arrow-upward" size={ICON_SIZE_LARGE} color={LIGHT_BLUE} />
              </Pressable>
            )}
            {!showLowOnly && (
              <Pressable onPress={onMoveListDown}>
                <MaterialIcons name="arrow-downward" size={ICON_SIZE_LARGE} color={LIGHT_BLUE} />
              </Pressable>
            )}
          </View>
        )}
        {!showLowOnly && !showRenameList && (
          <Pressable onPress={onDeleteList}>
            <MaterialIcons name="close" size={ICON_SIZE} color="white" />
          </Pressable>
        )}
        {showRenameList && (
          <View style={{ gap: 5 }}>
            <TextInput
              style={AppStyles.listTitle}
              value={newListName}
              autoFocus
              onChangeText={(text) => setNewListName(text)}
              placeholder="list name"
              placeholderTextColor="white"
              returnKeyType="done"
              onBlur={() => setShowRenameList(false)}
            />
            <View style={styles.listNameButtons}>
              <Pressable onPress={() => renameList(newListName)}>
                <Text style={AppStyles.subHeading}>save</Text>
              </Pressable>
              <Pressable onPress={cancelRenameList}>
                <Text style={AppStyles.subHeading}>cancel</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      <View style={{ gap: 8 }}>
        {items.map((item, index) => {
          return (
            <View key={index}>
              <ListItem
                item={item}
                onDeleteItem={() => onDeleteItem(index)}
                onSwitchItemStatus={() => onSwitchItemStatus(index)}
              />
            </View>
          );
        })}
        {!showLowOnly && <ItemInputField onAddItem={onAddItem} placeholder="new item" />}
        {!showLowOnly && (
          <Pressable onPress={() => setShowNewList(!showNewList)} style={styles.newListButton}>
            <MaterialIcons name={showNewList ? 'remove' : 'add'} size={ICON_SIZE} color="white" />
            <Text style={AppStyles.subHeading}>new list</Text>
          </Pressable>
        )}
        {showNewList && <NewList onAddList={addList} />}
      </View>
    </View>
  );
};

export default List;

List.propTypes = {
  name: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  showLowOnly: PropTypes.bool.isRequired,
  onDeleteList: PropTypes.func.isRequired,
  onAddItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onRenameList: PropTypes.func.isRequired,
  onMoveListDown: PropTypes.func.isRequired,
  onMoveListUp: PropTypes.func.isRequired,
  onSwitchItemStatus: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  rightTitleContainer: {
    gap: 5,
    flexDirection: 'row'
  },
  newListButton: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center'
  },
  listNameButtons: {
    gap: 20,
    flexDirection: 'row'
  }
});
