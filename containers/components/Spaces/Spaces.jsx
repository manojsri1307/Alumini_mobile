import {View, Text, StyleSheet, ImageBackground} from 'react-native';

const Spaces = () => {
  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        source={require('../../assets/Space-bg.jpg')}
        resizeMode="cover"
        style={styles.imagastyles}>
        <View style={styles.heroContainer}>
          <Text style={styles.joinText}>Join</Text>
          <Text style={[styles.joinText, {marginBottom: 35}]}>#Spaces </Text>
          <Text style={styles.description}>
            #Spaces is an all new way to connect with your community in real
            time.
          </Text>
          <Text style={styles.description}>
            Oops! Looks like you are not part of any network yet! You have to be
            an approved user in network where spaces is enabled to get started
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  imagastyles: {
    flex: 1,
  },
  joinText: {
    fontSize: 46,
    color: '#fff',
    fontWeight: 700,
    padding: 0,
    margin: 0
  },
  heroContainer: {
    flex: 1,
    paddingHorizontal: 60,
    justifyContent: 'center'
  },
  description: {
    fontSize: 14,
    color: '#fff',
    marginVertical: 10,
    letterSpacing: .3
  }
});

export default Spaces;
