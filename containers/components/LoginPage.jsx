import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import cm from '../commonStyles';
import axios from 'axios';
import {resources} from '../resources';

const LoginPage = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false)

  const labelAnim = useRef(new Animated.Value(email ? 1 : 0)).current;

  const handleRequest = async () => {

    const getCurrentDate = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = `${date.getMonth() + 1}`.padStart(2, '0');
      const day = `${date.getDate()}`.padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

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

    const OTPVerification = {
      uniqueKey: '',
      authOtp: '',
      authRequestEmail: email,
      authRequestDate: getCurrentDate(),
      currentUserEmail: email,
      currentUploadDateTime: getFullDateTime(),
    };

    console.log("OTP Veri OBJ", OTPVerification)

    if (!email.trim()) {
      setEmailError('please enter email!');
    } else {
      setEmailError('');
      console.log('emaillllll', email);
      setLoading(true)
      try {
        const res = await axios.post(
          resources.APPLICATION_URL + `otp/validationcheck`, OTPVerification
        );
        console.log('OTP Responseeee', res);
        navigation.navigate('OTP', {email});
        setLoading(false)
      } catch (error) {
        console.log('Email OTP call', error);
        setLoading(false)
      }
    }
  };

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || email ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, email]);

  const labelStyle = {
    position: 'absolute',
    left: 50,
    top: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -10],
    }),
    fontSize: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#b8b7b4', '#007BFF'],
    }),
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    zIndex: 1,
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.loginContainer}>
          <View>
            <Image
              source={require('../assets/Alumni_image.jpg')}
              style={styles.loginImg}
            />
          </View>

          <View>
            <Text style={styles.loginText}>MY</Text>
            <Text style={[styles.loginText, {fontWeight: '800'}]}>ALUMNI</Text>
            <Text style={styles.netWorkText}>NETWORK</Text>
          </View>

          <Text style={styles.startedText}>Let's get started</Text>

          <View style={{position: 'relative', marginTop: 15}}>
            <Animated.Text style={labelStyle}>Enter your email*</Animated.Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={[
                cm.textInput,
                {
                  alignSelf: 'center',
                  color: '#000',
                  paddingTop: 18,
                  borderColor: isFocused ? '#007BFF' : 'gray',
                },
              ]}
            />
            {emailError && <Text style={styles.errorMsg}>{emailError}</Text>}
          </View>

          <View style={styles.btnContainer}>
            {
              loading ? (
                <ActivityIndicator size="large" color="#007BFF"/>
              ) : (
                <TouchableOpacity style={styles.btnOTP} onPress={handleRequest}>
                  <Text style={styles.reqText}>Request OTP</Text>
            </TouchableOpacity>
              )
            }
          </View>
          <TouchableOpacity
            onPress={() => {
              if(!email.trim()){
                setEmailError('please enter email!')
              }else {
                navigation.navigate('PasswordLogin', {email: email})
              }
            }
            }>
            <Text style={styles.passwordText}>Login with Password</Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '80%',
              alignSelf: 'center',
            }}>
            <Text style={styles.line}></Text>
            <Text style={styles.OR_text}>OR</Text>
            <Text style={styles.line}></Text>
          </View>
          <View style={styles.googleContainer}>
            <Image
              source={require('../assets/Google-logo.png')}
              style={styles.googleLogo}
            />
            <Text style={styles.googleText}>Continue with Google</Text>
          </View>
          <Text
            style={{
              color: '#888',
              position: 'absolute',
              bottom: -50,
              left: 0,
              right: 0,
              textAlign: 'center',
            }}>
            ©2025 Aspiron.ai
          </Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  loginImg: {
    width: 150,
    height: 140,
    alignSelf: 'flex-end',
  },
  loginContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  loginText: {
    fontSize: 36,
  },
  netWorkText: {
    fontSize: 16,
    letterSpacing: 9,
  },
  startedText: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    paddingTop: 20,
    marginTop: 30,
    paddingBottom: 20,
    letterSpacing: 1,
  },
  btnContainer: {
    padding: 6,
    marginTop: 20,
  },
  btnOTP: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 24,
    width: '80%',
    alignSelf: 'center',
    marginTop: 10,
  },
  reqText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  passwordText: {
    fontWeight: 700,
    color: '#007BFF',
    textAlign: 'center',
    padding: 20,
  },
  line: {
    height: 1,
    backgroundColor: '#DCDCDC',
    flex: 1,
  },
  OR_text: {
    color: '#b3b2af',
    paddingLeft: 10,
    paddingRight: 10,
  },
  googleLogo: {
    width: 20,
    height: 20,
  },
  googleContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#DCDCDC',
    paddingTop: 17,
    paddingBottom: 17,
    borderRadius: 30,
    justifyContent: 'center',
    gap: 10,
    width: '80%',
    alignSelf: 'center',
    marginTop: 20,
  },
  errorMsg: {
    position: 'absolute',
    bottom: -25,
    left: 45,
    color: 'red',
  },
});

export default LoginPage;
