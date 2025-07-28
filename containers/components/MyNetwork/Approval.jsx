import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DropDownPicker from 'react-native-dropdown-picker';
import {useEffect, useLayoutEffect, useState} from 'react';
import axios from 'axios';
import {resources} from '../../resources';
import cm from '../../commonStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const Approval = ({navigation, route}) => {
  const {college} = route?.params;
  console.log('Routeeeee', route);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Bachelor of Commerce', value: 'Bachelor of Commerce'},
    {label: 'B.Tech', value: 'Bachelor of Technology'},
    {label: 'M.Tech', value: 'Masters of Technology'},
    // Add more country codes here
  ]);

  const [openYear, setOpenYear] = useState(false);
  const [endYear, setEndYear] = useState(null);
  const [endYearList, setEndYearList] = useState([
    {label: '2025', value: '2025'},
    {label: '2024', value: '2024'},
    {label: '2023', value: '2023'},
    {label: '2022', value: '2022'},
    {label: '2021', value: '2021'},
    {label: '2020', value: '2020'},
    {label: '2019', value: '2019'},
    {label: '2018', value: '2018'},
    {label: '2017', value: '2017'},
    {label: '2016', value: '2016'},
    {label: '2015', value: '2015'},
  ]);

  const [openMemberShip, setOpenMemberShip] = useState(false);
  const [membership, setMembership] = useState(null);
  const [menbershipList, setmenbershipList] = useState([
    {
      label: 'Be a member of the Core Committe',
      value: 'Be a member of the Core Committe',
    },
    {
      label: 'Assist student inFinding Placements',
      value: 'Assist student inFinding Placements',
    },
    {label: 'Attend Functions / events of the association', value: '2025'},
  ]);

  const [rollnumber, setRollnumber] = useState('');
  const [openRollnumber, setOpenRollnumber] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState('');
  const [userInfo, setUserInfo] = useState({})

  const handleNext = async () => {
    // console.log('Roll Numberr', rollnumber);
    // const userInfoo = await AsyncStorage.getItem('userInfo');
    // const userData = JSON.parse(userInfoo);
    // console.log('usersss Data', userData);
    // setUserInfo(userData)
    // await AsyncStorage.setItem('userInfo', JSON.stringify(userData))
    
    const [collegeName, code] = college.split('-')

    try {
      const res = await axios.post(
        resources.APPLICATION_URL + `saveCollegeUserRegister`,
        {
          id: '',
          degree: value,
          passedOutYear: endYear,
          rollNumber: rollnumber,
          collegeName: collegeName.trim(),
          purpose: membership,
          approval_status: '',
          email: userInfo.email,
          collegeCode: code.trim(),
          name: `${userInfo.firstName} ${userInfo.lastName}`
        },
      );
      if (res.data.includes('awaiting')) {
        setApprovalStatus('Waiting for Approval...');
        Toast.show({
          type: 'success',
          text1: 'Approval Submitted!'
        })
      }
      console.log('Responseee', res);
    } catch (error) {
      console.log('Approval call', error);
    }
    
  };

  const getDegree = async () => {

    console.log('Roll Numberr', rollnumber);
    const userInfoo = await AsyncStorage.getItem('userInfo');
    const userData = JSON.parse(userInfoo);
    console.log('usersss Data', userData);
    setUserInfo(userData)

    const [collegeName, code] = college.split('-')
    console.log("codeee", code.trim())

    try {
      const res = await axios.get(
        resources.APPLICATION_URL +
          `getDegrees?collegeCode=${code.trim()}`,
      );
      console.log('Responseee', res);
      const items = res.data.map(each => ({label: each, value: each}));
      setItems(items);
    } catch (error) {
      console.log('Get Degreee call', error);
    }
  };


  useEffect(() => {
    getDegree();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Home', {
              endYear: endYear,
              degree: value,
              rollNumber: rollnumber,
              email: userInfo.email
            });
          }}
          style={{marginHorizontal: 15}}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, endYear, value, rollnumber, userInfo]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('Home', {
          endYear: endYear,
          degree: value,
          rollNumber: rollnumber,
          email: userInfo.email
        });
        return true; // 👈 prevent default back behavior
      },
    );

    return () => backHandler.remove(); // clean up
  }, [endYear, value, rollnumber, userInfo]);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.mainContainer}>
          <View style={styles.instituteContainer}>
            <Icon name="university" size={30} color="#007BFF" />
            <Text style={styles.instituteName}>{college}</Text>
          </View>
          <View style={styles.heroContainer}>
            <View style={{width: '90%'}}>
              <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                searchable={true}
                placeholder="Course / Degree*"
                placeholderTextColor="#b3b2af"
                searchPlaceholder="Type to search..."
                autoScroll={true}
                showArrowIcon={true}
                closeAfterSelecting={true}
                searchTextInputProps={{
                  autoFocus: true,
                }}
                style={{
                  width: '100%',
                  borderRadius: 10,
                  borderColor: open || value ? '#007BFF' : '#DCDCDC',
                  backgroundColor: 'transparent',
                  // elevation: 6,
                  paddingHorizontal: 10,
                  zIndex: 1000,
                }}
                dropDownContainerStyle={{
                  borderColor: '#DCDCDC',
                  borderRadius: 10,
                  // backgroundColor: '#fff',
                  elevation: 8,
                  zIndex: 1000,
                  width: '100%',
                }}
                searchContainerStyle={{
                  margin: 0,
                  padding: 0,
                  borderBottomWidth: 0,
                }}
                searchTextInputStyle={{
                  margin: 0,
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  backgroundColor: '#fff',
                  fontWeight: '600',
                  borderWidth: 0,
                }}
                listItemContainerStyle={{
                  borderBottomWidth: 0,
                }}
                textStyle={{
                  fontWeight: '600',
                  color: '#000',
                }}
                placeholderStyle={{
                  color: '#b3b2af',
                }}
              />
            </View>
            {value && (
              <View style={{width: '40%', marginTop: 20}}>
                <DropDownPicker
                  open={openYear}
                  value={endYear}
                  items={endYearList}
                  setOpen={setOpenYear}
                  setValue={setEndYear}
                  setItems={setEndYearList}
                  searchable={true}
                  placeholder="End of Year*"
                  placeholderTextColor="#b3b2af"
                  searchPlaceholder="Type to search..."
                  autoScroll={true}
                  showArrowIcon={true}
                  closeAfterSelecting={true}
                  searchTextInputProps={{
                    autoFocus: true,
                  }}
                  style={{
                    width: '100%',
                    borderRadius: 10,
                    borderColor: openYear || endYear ? '#007BFF' : '#DCDCDC',
                    backgroundColor: 'transparent',
                    // elevation: 6,
                    paddingHorizontal: 10,
                    zIndex: 999,
                  }}
                  dropDownContainerStyle={{
                    borderColor: '#DCDCDC',
                    borderRadius: 10,
                    // backgroundColor: '#fff',
                    elevation: 8,
                    zIndex: 999,
                    width: '100%',
                  }}
                  searchContainerStyle={{
                    margin: 0,
                    padding: 0,
                    borderBottomWidth: 0,
                  }}
                  searchTextInputStyle={{
                    margin: 0,
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    backgroundColor: '#fff',
                    fontWeight: '600',
                    borderWidth: 0,
                  }}
                  listItemContainerStyle={{
                    borderBottomWidth: 0,
                  }}
                  textStyle={{
                    fontWeight: '600',
                    color: '#000',
                  }}
                  placeholderStyle={{
                    color: '#b3b2af',
                  }}
                />
              </View>
            )}
            {value && endYear && (
              <View style={{width: '90%', marginTop: 20}}>
                <DropDownPicker
                  open={openMemberShip}
                  value={membership}
                  items={menbershipList}
                  setOpen={setOpenMemberShip}
                  setValue={setMembership}
                  setItems={setmenbershipList}
                  searchable={true}
                  placeholder="How would you like to associate with us*"
                  placeholderTextColor="#b3b2af"
                  searchPlaceholder="Type to search..."
                  autoScroll={true}
                  showArrowIcon={true}
                  closeAfterSelecting={true}
                  searchTextInputProps={{
                    autoFocus: true,
                  }}
                  style={{
                    width: '100%',
                    borderRadius: 10,
                    borderColor: openYear || endYear ? '#007BFF' : '#DCDCDC',
                    backgroundColor: 'transparent',
                    // elevation: 6,
                    paddingHorizontal: 10,
                    zIndex: 998,
                  }}
                  dropDownContainerStyle={{
                    borderColor: '#DCDCDC',
                    borderRadius: 10,
                    // backgroundColor: '#fff',
                    elevation: 8,
                    zIndex: 999,
                    width: '100%',
                  }}
                  searchContainerStyle={{
                    margin: 0,
                    padding: 0,
                    borderBottomWidth: 0,
                  }}
                  searchTextInputStyle={{
                    margin: 0,
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    backgroundColor: '#fff',
                    fontWeight: '600',
                    borderWidth: 0,
                  }}
                  listItemContainerStyle={{
                    borderBottomWidth: 0,
                  }}
                  textStyle={{
                    fontWeight: '600',
                    color: '#000',
                  }}
                  placeholderStyle={{
                    color: '#b3b2af',
                  }}
                />
              </View>
            )}
            {value && endYear && membership && (
              <TextInput
                placeholder="Roll Number"
                placeholderTextColor="#b3b2af"
                style={[
                  cm.textInput,
                  styles.textInput,
                  {
                    borderColor: openRollnumber ? '#007BFF' : '#DCDCDC',
                    backgroundColor: 'transparent',
                  },
                ]}
                value={rollnumber}
                onChangeText={value => setRollnumber(value)}
                onFocus={() => setOpenRollnumber(true)}
                onBlur={() => setOpenRollnumber(false)}
                autoCapitalize="characters"
                maxLength={10}
              />
            )}
          </View>
          <View style={styles.bannerContainer}>
            {!open && !openYear && !openMemberShip && !openRollnumber && (
              <Image
                source={require('../../assets/Approval-banner.png')}
                resizeMode="cover"
                style={{width: 300, height: 300}}
              />
            )}
          </View>
          <View style={styles.btnContainer}>
            <TouchableHighlight
              style={styles.nextBtn}
              underlayColor="lightblue"
              onPress={handleNext}>
              <Text style={styles.nxtBtnText}>
                {approvalStatus ? approvalStatus : 'Submit Approval'}
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  instituteContainer: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    padding: 20,
  },
  instituteName: {
    fontSize: 16,
    fontWeight: 600,
    color: '#007BFF',
  },
  heroContainer: {
    padding: 20,
  },
  btnContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    width: '100%',
    alignItems: 'center',
  },
  nextBtn: {
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 26,
    marginVertical: 10,
    width: '60%',
    backgroundColor: '#007BFF',
  },
  nxtBtnText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 0.5,
    color: '#fff',
  },
  bannerContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 100,
    left: 0,
    width: '100%',
    zIndex: 899,
  },
  textInput: {
    marginVertical: 20,
    width: '90%',
  },
});

export default Approval;
