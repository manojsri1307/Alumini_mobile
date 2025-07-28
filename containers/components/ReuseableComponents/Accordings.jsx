import {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Accordings = ({title, children}) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity
        onPress={() => setCollapsed(!collapsed)}
        style={styles.header}>
        <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
        </View>
        <View>
                    <Icon
          name={collapsed ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
        />
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={collapsed}>
        <View style={styles.content}>
          <Text style={styles.contentText}>{children}</Text>
        </View>
      </Collapsible>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    padding: 10,
  },
  accordionItem: {
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    color: '#666665',
  },
  content: {
    paddingTop: 10,
  },
  contentText: {
    color: '#666665',
    letterSpacing: 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10
  },
  titleContainer: {
    flex: 1
  }
});

export default Accordings;
