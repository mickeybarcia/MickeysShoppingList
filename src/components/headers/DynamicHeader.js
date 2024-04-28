import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import AppTitle from 'src/components/headers/AppTitle';
import MenuButton from 'src/components/shared/MenuButton';
import { SCROLL_DISTANCE } from 'src/constants';

const DynamicHeader = ({ animatedValue, navigation }) => {
  const animatedHeaderHeight = animatedValue.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [SCROLL_DISTANCE, 0],
    extrapolate: 'clamp'
  });
  return (
    <Animated.View style={styles.header}>
      <Animated.View
        style={[
          styles.center,
          {
            height: animatedHeaderHeight
          }
        ]}>
        <AppTitle />
      </Animated.View>
      <Animated.View>
        <MenuButton navigation={navigation} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    left: 0,
    right: 0
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default DynamicHeader;
