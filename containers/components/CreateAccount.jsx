import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import cm from '../commonStyles';
import {useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { resources } from '../resources';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const CreateAccount = ({route, navigation}) => {
  const getEmail = route?.params?.email;
  console.log("create Account Screen email", getEmail)

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: '+1 USA', value: '+1'},
    {label: '+91 India', value: '+91'},
    {label: '+44 UK', value: '+44'},
    // Add more country codes here
  ]);
  const [isLoading, setIsLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState('Yes');
  const [checked, setChecked] = useState(false);
  const [passwordSecure, setPasswordSecure] = useState(true);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    countryCode: '',
    mobile: '',
    jobTitle: '',
    companyName: '',
    currentCity: '',
    passWord: '',
  })

  const toggleCheckbox = () => setChecked(!checked);

  const handleCreate = async () => {
    setIsLoading(true)
    const user = {
  firstName: userInfo.firstName,
  lastName: userInfo.lastName,
  countryCode: value,
  mobileNumber: userInfo.mobile,
  working: selectedOption,
  jobTitle: userInfo.jobTitle,
  companyName: userInfo.companyName,
  currentCity: userInfo.currentCity.toUpperCase(),
  email: getEmail,
  passWord: userInfo.passWord
};

console.log("userrrrrrrrr", user)
console.log(`${resources.APPLICATION_URL}saveAlumniMobileRegister`, user)

  await AsyncStorage.setItem('userInfo', JSON.stringify(user))
  await AsyncStorage.setItem('email', getEmail)

  const config = {
  headers: {
    'Content-Type': 'application/json'
  }
};

    try {
      const res = await axios.post(resources.APPLICATION_URL + `saveAlumniMobileRegister`, user, config)
      console.log("Response", res)
      if(res.data.includes('Login Created')){
        navigation.navigate('Home', {userInfo: {...userInfo, countryCode: value}})
        Toast.show({
        type: 'success',
        text1: 'Account Created!'
      })
      navigation.navigate('Login')
      setIsLoading(false)
        // await AsyncStorage.setItem('userInfo', JSON.stringify(user))
      }
    } catch (error) {
      console.log("create account call error", error)
      Toast.show({
        type: 'success',
        text1: 'Account Created!'
      })
      navigation.navigate('Login')
      setIsLoading(false)
    }
  }

  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.topHeader}>
        <Text style={styles.headerText}>Create Account</Text>
      </View>
      <Text style={styles.instructionText}>
        Please fill in your Personal Details & Create Account. Your login ID
        will be
        <Text style={styles.email}>
          {' '}
          {getEmail || 'manojsri2002@gmail.com'}
        </Text>
      </Text>
      <View style={styles.inputsContainer}>
        <TextInput
          style={[cm.textInput, {width: '48%'}]}
          placeholder="First Name*"
          placeholderTextColor={'#b3b2af'}
          value={userInfo.firstName}
          onChangeText={(value) => (
            setUserInfo({...userInfo, firstName: value})
  )}
        />
        <TextInput
          style={[cm.textInput, {width: '48%'}]}
          placeholder="Last Name*"
          placeholderTextColor={'#b3b2af'}
          value={userInfo.lastName}
          onChangeText={ value => (
            setUserInfo({...userInfo, lastName: value})
          )}
        />
        <View style={{width: '48%'}}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            searchable={true}
            placeholder="Country Code*"
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
              borderColor: '#DCDCDC',
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
        <TextInput
          style={[cm.textInput, {width: '48%'}]}
          placeholder="Mobile Number*"
          placeholderTextColor={'#b3b2af'}
          keyboardType='numeric'
          value={userInfo.mobile}
          onChangeText={ value => (
            setUserInfo({...userInfo, mobile: value})
          )}
        />
      </View>
      <View style={styles.radioInputs}>
        <Text style={styles.radioHeading}>Are you currently working?* </Text>
        {['Yes', 'No'].map(option => (
          <RadioButton
            key={option}
            label={option}
            selected={selectedOption === option}
            onPress={() => setSelectedOption(option)}
          />
        ))}
      </View>
      <View style={styles.infoContainer}>
        {selectedOption === 'Yes' && (
          <View style={{gap: 20}}>
            <TextInput
              style={[cm.textInput, styles.textInputs]}
              placeholder="Job Title*"
              placeholderTextColor={'#b3b2af'}
              onChangeText={(value) => setUserInfo({...userInfo, jobTitle: value})}
            />
            <TextInput
              style={[cm.textInput, styles.textInputs]}
              placeholder="Company Name*"
              placeholderTextColor={'#b3b2af'}
              onChangeText={(value) => setUserInfo({...userInfo, companyName: value})}
            />
          </View>
        )}
        <TextInput
          style={[cm.textInput, styles.textInputs]}
          placeholder="Current City*"
          placeholderTextColor={'#b3b2af'}
          onChangeText={(value) => setUserInfo({...userInfo, currentCity: value})}
        />
        <View style={{position: 'relative'}}>
            <TextInput
          style={[cm.textInput, styles.textInputs]}
          placeholder="Password*"
          placeholderTextColor={'#b3b2af'}
          secureTextEntry={passwordSecure ? true: false}
          onChangeText={(value) => setUserInfo({...userInfo, passWord: value})}
        />
         <TouchableOpacity style={styles.eyeIcon} onPress={() => setPasswordSecure(!passwordSecure)}>
            <Icon name={passwordSecure? 'eye' : 'eye-off'} size={18} color="#000"/>
         </TouchableOpacity>
        </View>
        
      </View>
      <View style={styles.checkBoxContainer}>
        <TouchableOpacity style={styles.checkboxRow} onPress={toggleCheckbox}>
          <View
            style={[
              styles.checkbox,
              {backgroundColor: checked ? '#007BFF' : '#fff'},
            ]}>
            {checked && <Icon name="check" size={16} color="#fff" />}
          </View>
          <Text style={styles.label}>
            I agree to the <Text style={styles.links}>Terms of Use</Text> &{' '}
            <Text style={styles.links}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.btnContainer}>
        {
          isLoading ? (
            <ActivityIndicator size="large"/>
          ) : (
            <TouchableOpacity style={[styles.createBtn, {backgroundColor: checked? '#007BFF': '#b3b1b1'}]} onPress={handleCreate}
        disabled={checked? false: true}
        >
          <Text style={styles.btnText}>Create Account</Text>
        </TouchableOpacity>
          )
        }
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fcfcfc'
  },
  topHeader: {
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: 10,
    padding: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 700,
  },
  email: {
    textDecorationLine: 'underline',
    color: '#007BFF',
    letterSpacing: 2,
    lineHeight: 20,
  },
  instructionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 23,
    marginBottom: 20,
    padding: 15,
  },
  inputsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    padding: 15,
    paddingTop: 0,
  },
  radioInputs: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    paddingTop: 20,
  },
  radioHeading: {
    letterSpacing: 0.5,
  },
  textInputs: {
    alignSelf: 'center',
  },
  infoContainer: {
    marginTop: 20,
    gap: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    flexWrap: 'wrap',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    flexWrap: 'wrap',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#007BFF',
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
  },
  link: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  checkBoxContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  createBtn: {
    // backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 22,
    width: '80%',
    alignSelf: 'center',
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 700,
  },
  // btnContainer: {
  //   position: 'absolute',
  //   bottom: 0,
  //   left: 0,
  //   justifyContent: 'center',
  //   width: '100%',
  // },
  eyeIcon: {
    position: 'absolute',
    right: 60,
    top: 0,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnContainer: {
    marginBottom: 30
  }
});

export default CreateAccount;

const RadioButton = ({label, selected, onPress}) => {
  console.log('selecteddd', selected);

  const styles = StyleSheet.create({
    radioContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    outerCircle: {
      height: 22,
      width: 22,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#007BFF',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    innerCircle: {
      height: 12,
      width: 12,
      borderRadius: 6,
      backgroundColor: '#007BFF',
    },
    radioLabel: {
      fontSize: 16,
      color: '#333',
    },
  });

  return (
    <TouchableOpacity style={styles.radioContainer} onPress={onPress}>
      <View style={styles.outerCircle}>
        {selected && <View style={styles.innerCircle} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );
};
