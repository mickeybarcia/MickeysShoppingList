import { StyleSheet } from 'react-native';

import { DARK_BLUE, LIGHT_BLUE, RADIUS, ROW_HEIGHT } from './constants';

const AppStyles = StyleSheet.create({
  screenContainer: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    padding: 10,
    backgroundColor: DARK_BLUE
  },
  background: {
    backgroundColor: DARK_BLUE,
    height: '100%'
  },
  columnContainer: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center'
  },
  inputFieldText: {
    color: 'white',
    height: 40,
    fontSize: 16,
    padding: 10,
    flex: 1
  },
  inputContainer: {
    borderColor: 'white',
    backgroundColor: LIGHT_BLUE,
    borderWidth: 1,
    borderRadius: RADIUS,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  subHeading: {
    color: 'white',
    fontSize: 15,
    fontWeight: '400'
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: '600'
  },
  listTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500'
  },
  rowContainer: {
    padding: 10,
    height: ROW_HEIGHT,
    backgroundColor: LIGHT_BLUE,
    borderRadius: RADIUS
  },
  rowItemName: {
    color: 'white',
    fontSize: 16
  },
  iconButton: {
    height: 20,
    width: 20,
    borderRadius: 5,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContainer: {
    flex: 1,
    margin: 20,
    marginTop: 60,
    alignItems: 'center'
  },
  modal: {
    borderRadius: RADIUS,
    padding: 10,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    backgroundColor: DARK_BLUE
  }
});

export default AppStyles;
