import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity} from 'react-native';
import {resources} from '../../resources';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileIcon from 'react-native-vector-icons/FontAwesome';

const {width} = Dimensions.get('window');

const NearMeComp = ({navigation, route}) => {
  const [NearPeople, setNearPeople] = useState([]);
  const [userInfo, setuserInfo] = useState({});
  console.log("Near me Route Location", route?.params)
  const selectedLocation = route?.params?.location

  const getUserInfo = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');
    const userData = JSON.parse(userInfo);
    if (userData) {
      setuserInfo(userData);
      GetNearPeoples(userData);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  console.log('-----------------near me---', NearPeople);

  const GetNearPeoples = async userData => {
    console.log('==========', userData.currentCity);
    if (!userData?.currentCity) return;

    try {
      if(selectedLocation) {
        const res = await axios.get(
        `${resources.APPLICATION_URL}getAlumniMobileRegisterDetailsByCity?city=${selectedLocation.toUpperCase()}`,
      );
      console.log('Selected location Res', res);
      setNearPeople(res.data);
      }else {
         const res = await axios.get(
        `${resources.APPLICATION_URL}getAlumniMobileRegisterDetailsByCity?city=${userData.currentCity}`,
      );
      console.log('000000000', res?.data);
      setNearPeople(res.data);
      }
    } catch (error) {
      console.error('Error fetching near people:', error);
    }
  };

  const handleOpenProfile = (people) => {
    console.log("peoplee", people)
    if(people){
      navigation.navigate('CommonProfile', {people})
    }
  }

  // Static blue color theme
  const staticColor = '#4285f4'; // Blue color

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>People Near You</Text>
        {selectedLocation ? (
          <Text style={styles.subHeading}>
          {userInfo.currentCity && `in ${selectedLocation}`}
        </Text>
        ) : (
          <Text style={styles.subHeading}>
          {userInfo.currentCity && `in ${userInfo.currentCity}`}
        </Text>
        )}
      </View>
 
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {NearPeople.length > 0 ? (
          <View>
            {NearPeople?.map((people, index) => {
          return (
            <TouchableOpacity key={index} style={[styles.peopleCard,]} onPress={() => handleOpenProfile(people)}>
              <View style={styles.cardInner}>
                <View style={styles.profileSection}>
                  <View style={styles.avatarContainer}>
                    <ProfileIcon 
                      name="user-circle" 
                      size={45} 
                      color={staticColor} 
                    />
                  </View>
                  <View style={styles.nameSection}>
                    <Text style={styles.fullName}>
                      {people.firstName} {people.lastName}
                    </Text>
                    <View style={styles.nameBadge}>
                      <Text style={styles.badgeText}>
                        Alumni
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.contentSection}>
                  <View style={styles.detailsContainer}>
                    {people.jobTitle && (
                      <View style={styles.detailRow}>
                        <ProfileIcon name="briefcase" size={14} color="#666" />
                        <Text style={styles.detailText}>{people.jobTitle}</Text>
                      </View>
                    )}
                    
                    {people.companyName && (
                      <View style={styles.detailRow}>
                        <ProfileIcon name="building" size={14} color="#666" />
                        <Text style={styles.detailText}>{people.companyName}</Text>
                      </View>
                    )}
                    
                    <View style={styles.detailRow}>
                      <ProfileIcon name="map-marker" size={14} color="#666" />
                      <Text style={styles.detailText}>{people.currentCity}</Text>
                    </View>
                    
                    {people.mobileNumber && (
                      <View style={styles.detailRow}>
                        <ProfileIcon name="phone" size={14} color="#666" />
                        <Text style={styles.detailText}>{people.mobileNumber}</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.decorativeCircle1} />
                <View style={styles.decorativeCircle2} />
              </View>
            </TouchableOpacity>
          );
        })}
          </View>
        ) : (
          <Text style={styles.noUsersText}>No User Found</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  
  headerContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderBottomLeftRadius:30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  
  subHeading: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 5,
    fontWeight: '500',
  },

  scrollContainer: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },

  peopleCard: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },

  cardInner: {
    padding: 20,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },

  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4285f420',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  nameSection: {
    flex: 1,
    marginLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  fullName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: -0.3,
    flex: 1,
  },

  nameBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#4285f415',
  },

  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#4285f4',
  },

  contentSection: {
    flex: 1,
  },

  detailsContainer: {
    gap: 10,
    display:"flex",
    flexDirection:"row",
    flexWrap:"wrap",
  },

  detailRow: {
    display:"flex",
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    // paddingVertical: 2,
  },

  detailText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },

  decorativeCircle1: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    top: -30,
    right: -30,
    backgroundColor: '#4285f410',
    opacity: 0.15,
  },

  decorativeCircle2: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    bottom: -20,
    left: -20,
    backgroundColor: '#4285f410',
    opacity: 0.1,
  },
  noUsersText: {
    textAlign: 'center',
    fontWeight: 700,
    marginTop: 20,
    color: '#64748b'
  }
});

export default NearMeComp;