import {StyleSheet, Text, View} from 'react-native';
import Accordings from '../ReuseableComponents/Accordings';

const HelpView = () => {

  const titles = [
    {
      title: 'How can I change my graduation year from the mobile app?',
      ans: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit quia enim consectetur voluptate repellendus, ad facilis sit magnam suscipit officia!'
    },
    {
      title: 'Unable to access Mobile Application?',
      ans: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit quia enim consectetur voluptate repellendus, ad facilis sit magnam suscipit officia!'
    },
    {
      title:  'Have any other question, issue or a suggestion regarding the app?',
      ans: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit quia enim consectetur voluptate repellendus, ad facilis sit magnam suscipit officia!'
    },
  ]




  return (
    <View>
        <Text style={styles.heading}> Frequently Asked Questions </Text>
        <View style={styles.accordingsContainer}>
          {
            titles?.map( each => (
              <Accordings title={each.title}>
                <Text>{each.ans}</Text>
              </Accordings>
            ))
          }
        </View>
    </View>
  );
};
const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: 700,
    paddingVertical: 30,
    paddingHorizontal: 20
  },
  accordingsContainer: {
    paddingHorizontal: 20
  }
});

export default HelpView;
