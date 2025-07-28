import { useLayoutEffect } from 'react';
import {StyleSheet, Text, View} from 'react-native';

const SharePage = ({navigation}) => {

  return (
    <View>
        <Text> Share my Account</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  text: {
    alignSelf: 'center',
    position: 'relative',
    top: 30,
    fontSize: 20,
    fontWeight: 600,
    color: 'navyblue',
  },
});

export default SharePage;
