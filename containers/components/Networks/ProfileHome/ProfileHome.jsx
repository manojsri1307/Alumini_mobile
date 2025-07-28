import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import {useEffect, useLayoutEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Swiper from 'react-native-swiper';
import banner1 from '../../../assets/Banner1.jpg';
import banner2 from '../../../assets/Banner2.jpg';
import banner3 from '../../../assets/Banner3.jpg';
import NewsScreen from './News';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');

const ProfileHome = ({navigation, route}) => {

  const [refreshing, setRefreshing] = useState(false)
  const [authUser, setAuthUser] = useState({})
  const banners = [banner1, banner2, banner3];
  const {collegeName} = route?.params?.auth

  console.log(banners);
  console.log("userrr Authhh", authUser)

  const handleNavigate = getType => {
    switch (getType) {
      case 'Post Disscussion':
        navigation.navigate('PostDiscussion');
        break;
      case 'Post Job':
        navigation.navigate('PostJob');
        break;
      case 'Post Internship':
        navigation.navigate('PostInternship');
        break;
      case 'Near me':
        navigation.navigate('Near me');
        break;
      case 'Members':
        navigation.navigate('Members');
      default:
        break;
    }
  };

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <Icon name="university" size={30} color="#007BFF" />
          <Text style={{fontSize: 16, fontWeight: 700}}>
            {collegeName} Alumni Network
          </Text>
        </View>
      ),
    });
  }, [navigation]);

  const getAuthUser = async () => {
    const userData = await AsyncStorage.getItem('userInfo')
    const userInfo = JSON.parse(userData)
    setAuthUser(userInfo)
  }

  useEffect(() => {
    getAuthUser()
  }, [])

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
      }
      >
      <View style={styles.menusContainer}>
        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => handleNavigate('Post Disscussion')}>
          <Image
            source={require('../../../assets/discuss.png')}
            style={styles.menuCardImg}
            resizeMode="cover"
          />
          <Text style={styles.menuCardText}>Post Disscussion</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => handleNavigate('Post Job')}>
          <Image
            source={require('../../../assets/suitcase.png')}
            style={styles.menuCardImg}
            resizeMode="cover"
          />
          <Text style={styles.menuCardText}>Post Job</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => handleNavigate('Post Internship')}>
          <Image
            source={require('../../../assets/badge-icon.png')}
            style={styles.menuCardImg}
            resizeMode="cover"
          />
          <Text style={styles.menuCardText}>Post Internship</Text>
        </TouchableOpacity>
        {/* <View style={styles.menuCard}>
          <Image
            source={require('../../../assets/member-card.png')}
            style={styles.menuCardImg}
            resizeMode="cover"
          />
          <Text style={styles.menuCardText}>Membership Card</Text>
        </View> */}
        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => handleNavigate('Members')}>
          <Image
            source={require('../../../assets/members-group.png')}
            style={styles.menuCardImg}
            resizeMode="cover"
          />
          <Text style={styles.menuCardText}>Members</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => handleNavigate('Near me')}>
          <Image
            source={require('../../../assets/map.png')}
            style={styles.menuCardImg}
            resizeMode="cover"
          />
          <Text style={styles.menuCardText}>Near me</Text>
        </TouchableOpacity>
        {/* <View style={styles.menuCard}>
          <Image
            source={require('../../../assets/ticket.png')}
            style={styles.menuCardImg}
            resizeMode="cover"
          />
          <Text style={styles.menuCardText}>Event tickets</Text>
        </View>
        <View style={styles.menuCard}>
          <Image
            source={require('../../../assets/postbox.png')}
            style={styles.menuCardImg}
            resizeMode="cover"
          />
          <Text style={styles.menuCardText}>Mailbox</Text>
        </View> */}
      </View>
      <View style={styles.carousel}>
        <Swiper
          height={180}
          autoplay
          showsPagination
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}>
          {banners.map((each, index) => (
            <View key={index} style={styles.slide}>
              <Image source={each} style={styles.image} resizeMode="cover" />
            </View>
          ))}
        </Swiper>
      </View>
      <View style={styles.heroContainer}>
        {/* <Text style={styles.topText}>What would you like to do?</Text> */}
        {/* <View style={styles.menusContainer}>
            <View style={styles.menuCard}>
                <Image source={require('../../../assets/discuss.png')}
                style={styles.menuCardImg}
                resizeMode='cover'
                />
                <Text style={styles.menuCardText}>Post Disscussion</Text>
            </View>
            <View style={styles.menuCard}>
                <Image source={require('../../../assets/suitcase.png')}
                style={styles.menuCardImg}
                resizeMode='cover'
                />
                <Text style={styles.menuCardText}>Post Job</Text>
            </View>
            <View style={styles.menuCard}>
                <Image source={require('../../../assets/badge-icon.png')}
                style={styles.menuCardImg}
                resizeMode='cover'
                />
                <Text style={styles.menuCardText}>Post Internship</Text>
            </View>
            <View style={styles.menuCard}>
                <Image source={require('../../../assets/member-card.png')}
                style={styles.menuCardImg}
                resizeMode='cover'
                />
                <Text style={styles.menuCardText}>Membership Card</Text>
            </View>
            <View style={styles.menuCard}>
                <Image source={require('../../../assets/members-group.png')}
                style={styles.menuCardImg}
                resizeMode='cover'
                />
                <Text style={styles.menuCardText}>Members</Text>
            </View>
            <View style={styles.menuCard}>
                <Image source={require('../../../assets/map.png')}
                style={styles.menuCardImg}
                resizeMode='cover'
                />
                <Text style={styles.menuCardText}>Near me</Text>
            </View>
            <View style={styles.menuCard}>
                <Image source={require('../../../assets/ticket.png')}
                style={styles.menuCardImg}
                resizeMode='cover'
                />
                <Text style={styles.menuCardText}>Event tickets</Text>
            </View>
            <View style={styles.menuCard}>
                <Image source={require('../../../assets/postbox.png')}
                style={styles.menuCardImg}
                resizeMode='cover'
                />
                <Text style={styles.menuCardText}>Mailbox</Text>
            </View>
        </View> */}
        <View>
          <ScrollView
            horizontal
            style={styles.categoriesContainer}
            showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.categoriType}
              onPress={() => navigation.navigate('NewsComponent')}>
              <Text style={styles.categoryText}>News</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.categoriType}
              onPress={() => navigation.navigate('Events')}>
              <Text style={styles.categoryText}>Events</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.categoriType}
              onPress={() => navigation.navigate('JobHome')}>
              <Text style={styles.categoryText}>Jobs</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.categoriType}>
              <Text style={styles.categoryText}>Introductions</Text>
            </TouchableOpacity> */}
            {/* <TouchableOpacity style={styles.categoriType}>
              <Text style={styles.categoryText}>Group</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.categoriType}
              onPress={() => navigation.navigate('PostType')}>
              <Text style={styles.categoryText}>Post Type</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoriType}>
              <Text style={styles.categoryText}>Category</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <View style={styles.SubContainer}>
          <NewsScreen refreshing={refreshing}/>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  SubContainer: {
    marginTop: 13,
  },
  image: {
    width: width,
    height: 180,
    borderRadius: 10,
  },
  dot: {
    backgroundColor: 'rgb(152, 149, 149)',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 4,
  },
  slide: {
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
  },
  activeDot: {
    backgroundColor: '#007BFF',
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 4,
  },
  carousel: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 600,
    color: '#615f5f',
    marginTop: 20,
  },
  menuCard: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 6,
    borderRadius: 12,
    elevation: 2,
    width: '23%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroContainer: {
    padding: 10,
  },
  menusContainer: {
    marginVertical: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 10,
    padding: 15,
  },
  menuCardText: {
    fontSize: 10,
    fontWeight: 600,
    textAlign: 'center',
  },
  menuCardIcon: {
    flex: 1,
  },
  menuCardImg: {
    width: 30,
    height: 30,
  },
  categoriType: {
    backgroundColor: '#d1d1d1',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    marginRight: 15,
  },
  categoriesContainer: {
    paddingHorizontal: 10,
  },
  categoryText: {
    fontSize: 12,
  },
});

export default ProfileHome;
