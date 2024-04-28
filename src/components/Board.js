import { MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  View,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  Animated
} from 'react-native';
import AppStyles from 'src/AppStyles';
import ListComponent from 'src/components/List';
import NewList from 'src/components/shared/NewList';
import Spacer from 'src/components/shared/Spacer';
import { ICON_SIZE_LARGE } from 'src/constants';
import useAppContext from 'src/hooks/useAppContext';
import useFirebaseQuery from 'src/hooks/useFirebaseQuery';
import { List, Item, BoardLists } from 'src/models';
import * as fbService from 'src/services/FirebaseService';
import { logError } from 'src/utils/logging';

const Board = ({
  showLowOnly,
  onUpdateLists,
  setShowShareBoardModal,
  setShowRenameBoardModal,
  setShowDeleteBoardModal
}) => {
  const { setAlert, setBoardName, boardId } = useAppContext();
  const [lists, setLists] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [searchBarAnimation] = useState(new Animated.Value(0));

  const animateSearchBar = () => {
    searchBarAnimation.setValue(0);
    Animated.timing(searchBarAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false
    }).start();
  };

  const searchBarWidth = searchBarAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '80%']
  });

  const { data, isLoading, error } = useFirebaseQuery(`boards/${boardId}`);

  useEffect(() => {
    if (data) {
      setLists(BoardLists.decode(data.lists));
      setBoardName(data.name);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      setAlert('unable to load board');
      logError(error);
    }
  }, [error]);

  const dismissKeyboard = () => Platform.OS !== 'web' && Keyboard.dismiss();

  const updateLists = async (newLists) => {
    try {
      await fbService.updateData(`boards/${boardId}/lists`, BoardLists.encode(newLists));
    } catch (error) {
      setAlert('error updating lists');
      logError(error);
    } finally {
      onUpdateLists();
    }
  };

  const addList = (listName, listIndex) => {
    if (listName === '') return;
    const newLists = [...lists]
      .slice(0, listIndex + 1)
      .concat([new List(listName)])
      .concat(lists.slice(listIndex + 1, lists.length));
    dismissKeyboard();
    updateLists(newLists);
  };

  const deleteList = (listIndex) => {
    const newLists = lists.filter((_, index) => index !== listIndex);
    updateLists(newLists);
  };

  const addItem = (listIndex, rowItemName) => {
    if (rowItemName === '') return;
    const newLists = [...lists];
    newLists[listIndex].items = [...newLists[listIndex].items, new Item(rowItemName)];
    updateLists(newLists);
  };

  const deleteItem = (listIndex, itemIndex) => {
    const newLists = [...lists];
    newLists[listIndex].items = newLists[listIndex].items.filter((_, index) => index !== itemIndex);
    updateLists(newLists);
  };

  const switchItemStatus = (listIndex, itemIndex) => {
    const newLists = [...lists];
    newLists[listIndex].items[itemIndex].isLow = !newLists[listIndex].items[itemIndex].isLow;
    updateLists(newLists);
  };

  const renameList = (listIndex, newName) => {
    const newLists = [...lists];
    newLists[listIndex].name = newName;
    updateLists(newLists);
  };

  const moveListUp = (listIndex) => {
    if (listIndex === 0) {
      const newLists = [...lists].slice(1, lists.length).concat(lists[0]);
      updateLists(newLists);
    } else {
      const newLists = [...lists]
        .slice(0, listIndex - 1)
        .concat(lists[listIndex])
        .concat([...lists][listIndex - 1])
        .concat(lists.slice(listIndex + 1, lists.length));
      updateLists(newLists);
    }
  };

  const moveListDown = (listIndex) => {
    if (listIndex === lists.length - 1) {
      const newLists = lists
        .slice(lists.length - 1, lists.length)
        .concat(lists.slice(0, lists.length - 1));
      updateLists(newLists);
    } else {
      moveListUp(listIndex + 1);
    }
  };

  const onSearchPress = () => {
    if (!showSearchBar) animateSearchBar();
    setShowSearchBar(!showSearchBar);
  };

  return (
    <View style={[{ paddingBottom: 150 }, AppStyles.columnContainer]}>
      {!showLowOnly && (
        <View style={styles.actions}>
          <Pressable onPress={onSearchPress}>
            <MaterialIcons name="search" size={ICON_SIZE_LARGE} color="white" />
          </Pressable>
          {!showSearchBar && !showLowOnly && (
            <View style={styles.actions}>
              <Pressable onPress={() => setShowRenameBoardModal(true)}>
                <MaterialIcons name="edit" size={ICON_SIZE_LARGE} color="white" />
              </Pressable>
              <Pressable onPress={() => setShowShareBoardModal(true)}>
                <MaterialIcons name="person-add" size={ICON_SIZE_LARGE} color="white" />
              </Pressable>
              <Pressable onPress={() => setShowDeleteBoardModal(true)}>
                <MaterialIcons name="delete" size={ICON_SIZE_LARGE} color="white" />
              </Pressable>
            </View>
          )}
          {showSearchBar && (
            <Animated.View style={{ width: searchBarWidth }}>
              <TextInput
                style={[
                  AppStyles.listTitle,
                  styles.search
                ]}
                value={searchFilter}
                autoFocus
                onChangeText={(text) => setSearchFilter(text)}
                placeholder=""
                placeholderTextColor="white"
                returnKeyType="done"
                onBlur={() => setShowSearchBar(false)}
              />
            </Animated.View>
          )}
        </View>
      )}
      <Spacer />
      {isLoading && <ActivityIndicator animating={isLoading} />}
      {lists && (
        <View style={{ gap: 20 }}>
          {lists.map(({ name, items }, index) => {
            const cleanFilter = searchFilter.toLowerCase().trim();
            const filteredItems = items.filter((item) => {
              if (cleanFilter.length > 0 && showLowOnly) {
                return item.name.toLowerCase().startsWith(cleanFilter) && item.isLow;
              } else if (cleanFilter.length > 0) {
                return item.name.toLowerCase().startsWith(cleanFilter);
              } else if (showLowOnly) {
                return item.isLow;
              } else {
                return true;
              }
            });
            if (filteredItems.length === 0 && (showLowOnly || cleanFilter.length > 0)) return null;
            return (
              <View key={index}>
                <ListComponent
                  name={name}
                  items={filteredItems}
                  showLowOnly={showLowOnly}
                  onDeleteList={() => deleteList(index)}
                  onAddItem={(rowItemName) => addItem(index, rowItemName)}
                  onDeleteItem={(itemIndex) => deleteItem(index, itemIndex)}
                  onSwitchItemStatus={(itemIndex) => switchItemStatus(index, itemIndex)}
                  onRenameList={(name) => renameList(index, name)}
                  onMoveListUp={() => moveListUp(index)}
                  onMoveListDown={() => moveListDown(index)}
                  onAddList={(name) => addList(name, index)}
                />
              </View>
            );
          })}
        </View>
      )}
      {lists && lists.length === 0 && !showLowOnly && (
        <NewList onAddList={(name) => addList(name, 0)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 15
  },
  search: {
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    width: '100%'
  }
});

Board.propTypes = {
  showLowOnly: PropTypes.bool.isRequired,
  onUpdateLists: PropTypes.func.isRequired,
  setShowShareBoardModal: PropTypes.func.isRequired,
  setShowRenameBoardModal: PropTypes.func.isRequired
};

export default Board;
