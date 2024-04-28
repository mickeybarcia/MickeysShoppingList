import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Text, Pressable } from 'react-native';
import AppStyles from 'src/AppStyles';
import useAppContext from 'src/hooks/useAppContext';
import useFirebaseQuery from 'src/hooks/useFirebaseQuery';
import { logError } from 'src/utils/logging';

const BoardName = ({ id }) => {
  const { setBoard, setAlert } = useAppContext();
  const { data: name, error } = useFirebaseQuery(`boards/${id}/name`);
  useEffect(() => {
    if (error) {
      logError(error);
      setAlert('unable to load boards');
    }
  }, [error]);
  return (
    name && (
      <Pressable style={AppStyles.rowContainer} onPress={() => setBoard({ name, id })}>
        <Text style={AppStyles.rowItemName}>{name}</Text>
      </Pressable>
    )
  );
};

BoardName.propTypes = {
  id: PropTypes.string.isRequired
};

export default BoardName;
