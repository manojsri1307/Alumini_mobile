import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MembersScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Company');

  const membersData = [
    {
      id: '1',
      name: 'Chandni Sinha',
      degree: 'MBA 2021',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      id: '2',
      name: 'Anamika Singh',
      degree: 'MBA 2024',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    {
      id: '3',
      name: 'Kunal Raman',
      degree: 'Exe MBA 2025',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      id: '4',
      name: 'Subham Shankar',
      degree: 'MBA 2023',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
      id: '5',
      name: 'Arna Mondal',
      degree: 'MBA 2024',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
  ];

  const filterOptions = [
    { key: 'Company', icon: 'business', color: '#FFD700' },
    { key: 'Location', icon: 'location-on', color: '#FF6B6B' },
    { key: 'Near Me', icon: 'my-location', color: '#4ECDC4' },
    // { key: 'My Groups', icon: 'group', color: '#45B7D1' },
    // { key: 'Institute', icon: 'school', color: '#45B7D1' },
    // { key: 'Skills', icon: 'psychology', color: '#45B7D1' },
    { key: 'Roles', icon: 'badge', color: '#45B7D1' },
    // { key: 'Industry', icon: 'business', color: '#45B7D1' },
  ];

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return membersData;
    
    return membersData.filter(member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.degree.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, membersData]);

  const renderFilterButton = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === item.key && styles.selectedFilterButton,
      ]}
      onPress={() => {setSelectedFilter(item.key),HandleNavigate(item.key)}}
      
    >
      <View style={[styles.filterIconContainer, { backgroundColor: item.color }]}>
        <Icon name={item.icon} size={24} color="white" />
      </View>
      <Text style={[
        styles.filterText,
        selectedFilter === item.key && styles.selectedFilterText,
      ]}>
        {item.key}
      </Text>
    </TouchableOpacity>
  );

  const HandleNavigate = (items) => {
    console.log("Itemsss", items)
    switch (items) {
        case "Location":
          navigation.navigate('Location')
        break;
        case "Near Me":
          navigation.navigate('Near me')
    }
  }

  const renderMemberItem = ({ item }) => (
    <View style={styles.memberItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberDegree}>{item.degree}</Text>
      </View>
      <TouchableOpacity style={styles.inviteButton}>
        <Icon name="add" size={16} color="#007AFF" />
        <Text style={styles.inviteText}>Invite</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Name"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          data={filterOptions}
          renderItem={renderFilterButton}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        />
      </View>

      <View style={styles.pageIndicator}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
      </View>

      <FlatList
        data={filteredMembers}
        renderItem={renderMemberItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.membersList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    marginBottom: 8,
  },
  filterList: {
    paddingHorizontal: 16,
  },
  filterButton: {
    alignItems: 'center',
    marginRight: 32,
  },
  selectedFilterButton: {
    // Add any selected state styling if needed
  },
  filterIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  selectedFilterText: {
    color: '#000',
    fontWeight: '600',
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDD',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#666',
  },
  membersList: {
    paddingHorizontal: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  memberDegree: {
    fontSize: 14,
    color: '#666',
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  inviteText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default MembersScreen;