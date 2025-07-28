import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';

const PostType = ({navigation, onFilterSelect}) => {
  const [selectedFilter, setSelectedFilter] = useState('All Posts');
  const [searchText, setSearchText] = useState('');

  const filterOptions = [
    'All Posts',
    'Events',
    'News',
    'Jobs',
    'Internships',
    'Discussions',
    // 'Albums',
  ];

  const filteredOptions = filterOptions.filter(option =>
    option.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleFilterSelect = filter => {
    setSelectedFilter(filter);
    if (onFilterSelect) {
      onFilterSelect(filter);
    }
    if (navigation) {
      navigation.goBack();
    }
  };
  const Handlenavigate = (item) => {
    console.log("itemmmmm", item)
    switch (item) {
      case 'Events':
        navigation.navigate('Events');
        break;
      case 'Jobs':
        navigation.navigate('JobHome');
        break;
      case 'Internships':
        navigation.navigate('InternshipHome');
        break;
      case 'News':
        navigation.navigate('NewsComponent');
        break;
      case 'Discussions':
        navigation.navigate('PostDisscussionHome')
      default:
        break;
    }
  };

  const renderFilterItem = ({item}) => (
    <TouchableOpacity
      style={styles.filterItem}
      onPress={() => {
        handleFilterSelect(item)
        Handlenavigate(item)
        }}>
      <Text
        style={[
          styles.filterText,
          selectedFilter === item && styles.selectedFilterText,
        ]}>
        {item}
      </Text>
      {selectedFilter === item && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation && navigation.goBack()}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filter Post Type</Text>
        <View style={styles.placeholder} />
      </View> */}

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Type post type to filter results"
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <FlatList
        data={filteredOptions}
        renderItem={renderFilterItem}
        keyExtractor={item => item}
        style={styles.filterList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 32,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    color: '#999',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
  },
  filterList: {
    flex: 1,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  selectedFilterText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  checkmark: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default PostType;
