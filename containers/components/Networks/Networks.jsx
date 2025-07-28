import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  TouchableHighlight,
  RefreshControl,
  ScrollView,
  Modal,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PrifileIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {resources} from '../../resources';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Networks = ({navigation, route}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [networkList, setNetworkList] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [delPopup, setDelPopup] = useState(false);
  const [delParams, setDelParams] = useState({
    email: '',
    collegeCode: ''
  })

  console.log('Networkss Route', route);

  const selectedNetwork = true;

  const handleJoinNetwork = () => {
    navigation.navigate('MyNetwork');
  };

  const handleInstitute = each => {
    console.log('eaaachhhh', each);
    if (each.approval_status === 'Aproved') {
      navigation.navigate('ProfileHome', {auth: each});
    }
  };
  const handleProfile = () => {
    navigation.navigate('MainSettings');
  };

  const getNetWork = async email => {
    console.log('email ====', email);

    try {
      const res = await axios.get(
        resources.APPLICATION_URL + `getApprovalStatusByRollNo?email=${email}`,
      );
      console.log('gettt network statuss', res);
      setNetworkList(res.data);
    } catch (error) {
      console.log('gettt network', error);
    }
  };

  // const getAuthDetails = async () => {
  //     const userInfo = await AsyncStorage.getItem('userInfo')
  //     const userData = JSON.parse(userInfo)
  //     console.log("userDetailsssss", userData)

  //     const authEmail = await AsyncStorage.getItem('email')
  //     console.log("authhhhhhhhhhhhhhh emailllll", authEmail)

  //     setUserDetails(userData)
  //     const getEmail = Object.values(route?.params).join('')
  //     console.log("useEffectttt emaill", getEmail)

  //     getNetWork(authEmail)
  // }

  const getAuthDetails = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      const authEmail = await AsyncStorage.getItem('email');

      if (userInfo) {
        const userData = JSON.parse(userInfo);
        setUserDetails(userData);
        console.log('userDetailsssss', userData);
      }

      if (authEmail) {
        console.log('auth email from AsyncStorage:', authEmail);
        getNetWork(authEmail);
      } else {
        console.warn('No email found in AsyncStorage');
      }
    } catch (error) {
      console.log('Error in getAuthDetails:', error);
    }
  };

  //  const onRefresh = async () => {
  //   setRefreshing(true)
  //   setTimeout(() => setRefreshing(false), 2000)
  //   const getEmail = Object.values(route?.params).join('')
  //     console.log("useEffectttt emaill", getEmail)

  //     const authEmail = await AsyncStorage.getItem('email')
  //     console.log("authhhhhhhhhhhhhhh on refresh emailllll", authEmail)
  //     getNetWork(authEmail)
  // }

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      const authEmail = await AsyncStorage.getItem('email');
      getAuthDetails()
      if (authEmail) {
        console.log('auth email on refresh:', authEmail);
        await getNetWork(authEmail);
      } else {
        console.warn('No email found on refresh');
      }
    } catch (error) {
      console.log('Error in onRefresh:', error);
    } finally {
      setTimeout(() => setRefreshing(false), 1000);
    }
  };


  const hamdleNetworkDel = async ({email, collegeCode}) => {
    console.log("Delete params", delParams);
    const authEmail = await AsyncStorage.getItem('email');

    try {
      const res = await axios.delete(resources.APPLICATION_URL + `deleteNetWorkRegisterDetails?email=${email}&collegeCode=${collegeCode}`)
      console.log("Delete Ress", res)
      if (authEmail) {
        console.log("auth email from AsyncStorage:", authEmail);
        getNetWork(authEmail);
      }
    } catch (error) {
      console.log("Del Call error", error)
    }
  };


  // useEffect(() => {
  //   getAuthDetails()
  // }, [navigation])

  useEffect(() => {
    getAuthDetails();
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.topHeader}>
        <Text style={styles.networkText}>Networks</Text>
        <TouchableHighlight
          onPress={handleProfile}
          underlayColor="lightgray"
          style={styles.ProfileIcon}>
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={35}
            color="#007BFF"
          />
          {/* <PrifileIcon name="user-circle" size={35} color="#007BFF" /> */}
        </TouchableHighlight>
      </View>
      {selectedNetwork ? (
        <View style={styles.mainContainer}>
          {
  delPopup && (
    <Modal
      visible={delPopup}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setDelPopup(false)}
    >
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}>
        <View style={{
          width: 320,
          padding: 25,
          backgroundColor: '#fff',
          borderRadius: 20,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 600,
            color: '#333',
            marginBottom: 25,
            textAlign: 'center'
          }}>
            Are you sure you want to delete this network?
          </Text>

          <View style={{ flexDirection: 'row', gap: 15 }}>
            <TouchableOpacity
              onPress={() => setDelPopup(false)}
              style={{
                backgroundColor: '#ccc',
                paddingVertical: 12,
                paddingHorizontal: 25,
                borderRadius: 10,
              }}
            >
              <Text style={{
                color: '#000',
                fontWeight: 'bold',
                fontSize: 16
              }}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                hamdleNetworkDel(delParams); 
                setDelPopup(false);
              }}
              style={{
                backgroundColor: '#FF4D4D',
                paddingVertical: 12,
                paddingHorizontal: 25,
                borderRadius: 10,
              }}
            >
              <Text style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 16
              }}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}


          <Text style={styles.profileName}>
            Hello {userDetails?.firstName} {userDetails?.lastName} 😊
          </Text>
          {networkList.map((each, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.membershipCard}
              onPress={() => handleInstitute(each)}>
              <View style={styles.membershipCardContent}>
                <View>
                  <Icon name="university" size={30} color="#007BFF" />
                </View>
                <View>
                  <Text style={styles.instituteName}>
                    {each.collegeName} Alumni Network
                  </Text>
                  <Text style={styles.statusText}>
                    MEMBERSHIP{' '}
                    {each.approval_status === '' ? 'PENDING' : 'APPROVED'}
                  </Text>
                </View>
              </View>
              {each.approval_status === '' && (
                <TouchableOpacity
                  style={styles.membershipCardDel}
                  onPress={() => {
                    setDelParams({email: each.email, collegeCode: each.collegeCode})
                    setDelPopup(true)
                  }}>
                  <Text style={styles.delCardText}>Delete</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.joinAnotherBtn}
            onPress={handleJoinNetwork}>
            <Icon name="plus" size={10} color="#fff" />
            <Text style={styles.joinAnotherText}>Join Another Network</Text>
          </TouchableOpacity>
          <View style={styles.contactusTextContainer}>
            <Text style={styles.buildNetworkText}>
              Build your Alumni Network ?
            </Text>
            <Text style={styles.contactusDes}>
              If you wish to build & engage ypur alumni community,
              <Text
                style={styles.linkingText}
                onPress={() => Linking.openURL('https://www.aspiron.in/')}>
                {' '}
                please let us know
              </Text>
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.heroSection}>
          <Text style={styles.heroHeadingText}>Hello</Text>
          <Text style={styles.heroHeadingText}>Manoj Sri!</Text>
          <Text style={styles.heroHeadingText}>Join your Alumni Network</Text>
          <Text style={styles.description}>
            Leverage the power of your Alumni, Tap below to search for your
            network powered by Vaave.
          </Text>
          <TouchableOpacity style={styles.joinBtn} onPress={handleJoinNetwork}>
            <Text style={styles.joinBtnText}>Join Network</Text>
          </TouchableOpacity>
          <Text style={styles.reunionText}>Happy Reunion :)</Text>
          <View>
            <Image
              source={require('../../assets/Re-union-removebg-preview.png')}
              style={styles.unionImg}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  networkText: {
    fontSize: 26,
    fontWeight: 700,
  },
  heroSection: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroHeadingText: {
    fontSize: 22,
    fontWeight: 700,
    paddingVertical: 6,
  },
  description: {
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 20,
    fontSize: 14,
    marginVertical: 15,
    color: '#777778',
  },
  joinBtn: {
    backgroundColor: '#007BFF',
    paddingVertical: 16,
    paddingHorizontal: 42,
    borderRadius: 26,
    marginVertical: 15,
  },
  joinBtnText: {
    color: '#fff',
    fontWeight: 700,
  },
  reunionText: {
    color: '#777778',
    fontSize: 12,
  },
  unionImg: {
    width: 380,
    height: 250,
  },
  minipara: {
    borderWidth: 2,
    borderColor: 'red',
  },
  profileName: {
    fontSize: 16,
    fontWeight: 600,
    paddingHorizontal: 30,
  },
  membershipCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 2,
    marginVertical: 20,
  },
  membershipCardContent: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    padding: 20,
  },
  membershipCardDel: {
    backgroundColor: '#d40834',
    padding: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  delCardText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 600,
  },
  mainContainer: {
    paddingHorizontal: 20,
  },
  instituteName: {
    fontSize: 18,
    fontWeight: 600,
  },
  statusText: {
    fontSize: 10,
    letterSpacing: 0.5,
    paddingVertical: 6,
    color: '#8b8b8c',
  },
  joinAnotherBtn: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 22,
    width: '60%',
    alignSelf: 'center',
    marginVertical: 20,
  },
  joinAnotherText: {
    color: '#fff',
    fontWeight: 600,
  },
  contactusTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buildNetworkText: {
    fontWeight: 700,
    fontSize: 16,
    marginVertical: 20,
  },
  contactusDes: {
    fontSize: 12,
    textAlign: 'center',
    width: '70%',
    lineHeight: 18,
    letterSpacing: 0.5,
  },
  linkingText: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  ProfileIcon: {
    borderRadius: '50%',
    padding: 2,
  },
});

export default Networks;
