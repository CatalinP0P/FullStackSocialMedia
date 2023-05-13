import { Colors } from './color';
import {Dimensions, StyleSheet} from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = new StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  round:{
    width: width * .4 ,
    aspectRatio: 1,
    borderRadius: (width * .4 ) / 2,
    margin: 16,
    borderWidth: 5,
    borderColor: Colors.primary,
  },

  btn: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: Colors.primary,
    borderRadius: 40,
    textAlign: 'center',
    margin: 8,
  },

  input: {
    width: '80%',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgb(250,250,250)',
    margin: 8,
    borderWidth: 1,
    borderColor: Colors.black25,
    borderRadius: 8,
  },   

  input2:{
    width: '80%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgb(250,250,250)',
    margin: 4,
    borderWidth: 1,
    borderColor: Colors.black25,
    borderRadius: 8,
  },

  bgGradient: {
  },

  h1: {
    fontSize: 31,
    color: Colors.black100,
    fontWeight: 500,
  },

  h2: {
    fontSize: 25,
    color: Colors.black100,
    fontWeight: 500,
  },

  text: {   
    fontSize: 20,
    color: Colors.black100,
    fontWeight: 400,
  },
});
