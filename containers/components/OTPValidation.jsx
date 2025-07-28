import axios from 'axios';
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Linking,
  ActivityIndicator
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { resources } from '../resources';
import Toast from 'react-native-toast-message';


const OTPValidationScreen = ({ navigation ,route }) => {

  const [loading, setLoading] = useState(false)
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  console.log("Routeeeee", route)
  const getEmail = route?.params?.email

  const handleChangeText = (text, index) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Move to next input
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === 'Backspace') {
      const newOtp = [...otp];

      if (otp[index] === '' && index > 0) {
        console.log("otp index", otp)
        console.log("index", index)
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        console.log("elseeeee")
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      console.log('Entered OTP:', otpValue);
      // Add your OTP verification logic here
      // navigation.navigate('CreateAccount', {email : getEmail})
      setLoading(true)
      try {
        const res = await axios.post(resources.APPLICATION_URL + `authRequest/validateOtp?otp=${otpValue}&userName=${getEmail}`,)
        console.log("OTP Verification", res)
        if(res.data){
          navigation.navigate('Home', {email : getEmail})
          Toast.show({
            type: 'success',
            text1: 'Login Success'
          })
          setLoading(false)
        }else {
          navigation.navigate('CreateAccount', {email : getEmail})
          setLoading(false)
        }
      } catch (error) {
        console.log("OTP verification call", error)
        Toast.show({
          type: 'error',
          text1: 'Incorrect OTP'
        })
        setLoading(false)
      }
    } else {
      alert('Please enter full 6-digit OTP');
    }
  };

  const handleBackPress = () => {
    // Add your back navigation logic here
    navigation.goBack()
  };

  const hadleResendOTP = async () => {

    console.log("Triggeredd")

    const getCurrentDate = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = `${date.getMonth() + 1}`.padStart(2, '0');
      const day = `${date.getDate()}`.padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    console.log("Triggeredd 2")

    const getFullDateTime = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = `${date.getMonth() + 1}`.padStart(2, '0');
      const day = `${date.getDate()}`.padStart(2, '0');
      const hours = `${date.getHours()}`.padStart(2, '0');
      const minutes = `${date.getMinutes()}`.padStart(2, '0');
      const seconds = `${date.getSeconds()}`.padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    console.log("Triggeredd 3")

    const OTPVerification = {
      uniqueKey: '',
      authOtp: '',
      authRequestEmail: getEmail,
      authRequestDate: getCurrentDate(),
      currentUserEmail: getEmail,
      currentUploadDateTime: getFullDateTime(),
    };

    console.log("OTP Veri OBJ", OTPVerification)

      console.log('OTP Resend emaillllll', getEmail);
      try {
        const res = await axios.post(
          resources.APPLICATION_URL + `otp/validationcheck`, OTPVerification
        );
        console.log('OTP Responseeee', res);
        Toast.show({
          type: 'success',
          text1: 'OTP Sent! Please wait...'
        })
        setOtp(['', '', '', '', '', ''])
      } catch (error) {
        console.log('Email OTP call', error);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <FontAwesome5 name="arrow-left" size={20} color="#007BFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Alumni Network</Text>
      </View>

      <Text style={styles.instructionText}>
        Please enter the One Time Password(OTP) sent to
        <Text 
          onPress={() => Linking.openURL(`mailto:${getEmail}`)} 
          style={styles.email}
        >
          {getEmail}
        </Text>
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => (inputRefs.current[index] = ref)}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={text => handleChangeText(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            autoFocus={index === 0}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.resendText}
      onPress={hadleResendOTP}
      >
        <Text style={styles.resendText}>Didn't receive the code? Resend now</Text>
      </TouchableOpacity>
        {
          loading ? (
            <ActivityIndicator size="large" color="#007BFF"/>
          ) : (
            <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify}>
        <Text style={styles.verifyText}>Verify OTP</Text>
      </TouchableOpacity>
          )
        }
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    paddingTop: 50
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  instructionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: 10,
    marginTop: 40
  },
  otpInput: {
    width: 50,
    height: 55,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#007BFF',
    textAlign: 'center',
    fontSize: 20,
    color: '#000',
  },
  verifyBtn: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 50,
  },
  verifyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  email: {
    textDecorationLine: 'underline',
    color: '#007BFF',
    letterSpacing: 2,
    lineHeight: 20
  },
  resendText: {
    fontSize: 12,
    color: '#007BFF',
    marginBottom: 20,
    marginTop: 10,
    marginLeft: 10
  }
});

export default OTPValidationScreen;