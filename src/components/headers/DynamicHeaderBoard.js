import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Animated, Switch, StyleSheet } from 'react-native';
import AppStyles from 'src/AppStyles';
import { LIGHT_BLUE, SCROLL_DISTANCE } from 'src/constants';

const DynamicHeaderBoard = ({ animatedValue, onSwitchLowOnly, showLowOnly, boardName }) => {
  const animatedTitleSize = animatedValue.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [35, 25],
    extrapolate: 'clamp'
  });
  return (
    <Animated.View style={[{ paddingBottom: 8 }, AppStyles.columnContainer]}>
      <Animated.View style={styles.container}>
        <Animated.Text style={[AppStyles.title, { fontSize: animatedTitleSize }]}>
          {boardName}
        </Animated.Text>
        <Animated.View style={styles.switch}>
          <MaterialIcons name="warning" size={24} color="white" />
          <Switch
            trackColor={{ false: 'grey', true: LIGHT_BLUE }}
            onValueChange={onSwitchLowOnly}
            value={showLowOnly}
          />
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  switch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  }
});

export default DynamicHeaderBoard;
