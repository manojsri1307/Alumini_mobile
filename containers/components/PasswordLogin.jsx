import {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  TouchableOpacity,
} from 'react-native';
import cm from '../commonStyles';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import {resources} from '../resources';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const PasswordLogin = ({navigation, route}) => {
  const getEmail = route?.params?.email;
  console.log("emaiiii", getEmail)
  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [passwordSecure, setPasswordSecure] = useState(true);
  const [error, setError] = useState('');

  const labelAnim = useRef(new Animated.Value(password ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || password ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, password]);

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

  const handleSubmit = async () => {
    // const LoginRequest = {
    //     username: getEmail,
    //     password: password
    // }

    if (!password.trim()) {
      setError('Please Enter Password');
    } else {
      setError('');
      try {
        const res = await axios.post(resources.AUTHORIZE_URL + `signin`, {
          username: getEmail,
          password: password,
        });
        console.log('Responseeee password', res);
        if(res.status === 200) {
            navigation.navigate('Home', {email: getEmail})
            await AsyncStorage.setItem('email', getEmail)
            Toast.show({
              type: 'success',
              text1: 'Login Successfull'
            })
        }
      } catch (error) {
        console.log('password login call', error);
        if(error.message.includes('401')){
          setError('User not available! please check credentials');
          await AsyncStorage.clear()
        }
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: '#fff'}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <Text style={styles.text}>
            Please enter the password for Login ID{' '}
            <Text style={{color: '#007BFF', textDecorationLine: 'underline'}}>
              {getEmail}
            </Text>
          </Text>
          <View style={{position: 'relative', marginTop: 15}}>
            <Animated.Text style={labelStyle}>Password*</Animated.Text>
            <View>
              <TextInput
                value={password}
                onChangeText={setPassword}
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
                secureTextEntry={passwordSecure ? true : false}
              />
              <TouchableOpacity
                onPress={() => setPasswordSecure(!passwordSecure)}
                style={styles.eyeIcon}>
                <Icon
                  name={passwordSecure ? 'eye' : 'eye-off'}
                  size={18}
                  color="#000"
                />
              </TouchableOpacity>
            </View>
          </View>
          {error && <Text style={styles.errorMsg}>{error}</Text>}
          <TouchableOpacity
            style={{alignSelf: 'flex-end'}}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.OTPText}>Continue with OTP ?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.btnText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    padding: 20,
    letterSpacing: 0.7,
    lineHeight: 25,
  },
  eyeIcon: {
    position: 'absolute',
    right: 60,
    top: 0,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  OTPText: {
    textAlign: 'right',
    paddingHorizontal: 40,
    paddingVertical: 20,
    fontSize: 12,
    color: '#007BFF',
  },
  submitBtn: {
    width: '80%',
    padding: 15,
    backgroundColor: '#007BFF',
    marginHorizontal: 'auto',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 700,
  },
  errorMsg: {
    color: 'red',
    paddingHorizontal: 50,
    paddingVertical: 10,
  },
});

export default PasswordLogin;
