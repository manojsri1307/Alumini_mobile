import {Text, View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginPage from './containers/components/LoginPage';
import OTPValidationScreen from './containers/components/OTPValidation';
import CreateAccount from './containers/components/CreateAccount';
import Home from './containers/components/Home/Home';
import MyNetwork from './containers/components/MyNetwork/MyNetwork';
import Approval from './containers/components/MyNetwork/Approval';
import PostJob from './containers/components/Home/PostJob';
import PostDiscussion from './containers/components/Home/PostDiscussion';
import PostInternship from './containers/components/Home/PostInternship';
import DisableScreen from './containers/components/ReuseableComponents/NotFound';
import MainSettings from './containers/components/SettingsPage/SettingsMain';
import HelpView from './containers/components/SettingsPage/Help';
import SharePage from './containers/components/SettingsPage/SharePage';
import UserProfile from './containers/components/SettingsPage/UserProfile';
import AccountDeletionScreen from './containers/components/SettingsPage/Delete';
import Profile from './containers/components/Home/ProfileScreens/Profile';
import NewsScreen from './containers/components/Networks/ProfileHome/News';
import EventsScreen from './containers/components/Networks/ProfileHome/Events';
import MembersScreen from './containers/components/Home/Members';
import PostType from './containers/components/Networks/ProfileHome/PostType';
import LocationScreen from './containers/components/Home/Location';
import PasswordLogin from './containers/components/PasswordLogin';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthLoadingScreen from './containers/components/AuthLoding';
import NearMeComp from './containers/components/Home/NearMe';
import Toast from 'react-native-toast-message';
import CommonProfile from './containers/components/commonProfile';
import NewsComponent from './containers/components/Networks/ProfileHome/NewsComponent';
import JobHome from './containers/components/Networks/ProfileHome/JobHome';
import PostDisscussionHome from './containers/components/Networks/ProfileHome/PostDisscussionHome';
import InternshipHome from './containers/components/Networks/ProfileHome/InternshipHome';


const Stack = createNativeStackNavigator();

const App = () => {

  const getUserInfo = async () => {
    const userEmail = await AsyncStorage.getItem('email')
    console.log("UserEmailll", userEmail)
  }


  useEffect(() => {
    getUserInfo()
  }, [])

  return (
    <>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AuthLoading"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 200,
        }}>
        <Stack.Screen name='AuthLoading' component={AuthLoadingScreen}/>
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: true,
            title: 'Profile',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="MainSettings"
          component={MainSettings}
          options={{
            headerShown: true,
            title: 'Settings',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen name="DisableScreen" component={DisableScreen} />
        <Stack.Screen name='CommonProfile' component={CommonProfile}/>
        <Stack.Screen name='NewsComponent' component={NewsComponent} options={{headerShown: true, title: 'News Feed'}}/>
        <Stack.Screen name='JobHome' component={JobHome} options={{headerShown: true, title: 'Jobs'}}/>
        <Stack.Screen name='PostDisscussionHome' component={PostDisscussionHome} options={{headerShown: true, title: 'Post Disscussion'}}/>
        <Stack.Screen name='InternshipHome' component={InternshipHome} options={{headerShown: true, title: 'Internships'}}/>
        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{
            headerShown: true,
            title: 'User Profile',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="HelpView"
          component={HelpView}
          options={{
            headerShown: true,
            title: 'Help',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="ShareAccount"
          component={SharePage}
          options={{
            headerShown: true,
            title: 'Share Account',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="DeleteAccount"
          component={AccountDeletionScreen}
          options={{
            headerShown: true,
            title: 'Delete my account',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="PostJob"
          component={PostJob}
          options={{headerShown: true, title: 'POST JOB'}}
        />
        <Stack.Screen
          name="PostInternship"
          component={PostInternship}
          options={{headerShown: true, title: 'POST INTERNSHIP'}}
        />
        <Stack.Screen
          name="PostDiscussion"
          component={PostDiscussion}
          options={{headerShown: true, title: 'POST DISCUSSION'}}
        />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="OTP" component={OTPValidationScreen} />
        <Stack.Screen name='PasswordLogin' component={PasswordLogin} options={{headerShown: true, title: 'Alumni Network'}}/>
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="MyNetwork" component={MyNetwork} options={{animation: 'slide_from_left'}}/>


        <Stack.Screen
          name="News"
          component={NewsScreen}
          options={{
            headerShown: true,
            title: 'News',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="PostType"
          component={PostType}
          options={{
            headerShown: true,
            title: 'Post Type',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="Near me"
          component={NearMeComp}
          options={{
            headerShown: true,
            title: 'Near Me',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="Location"
          component={LocationScreen}
          options={{
            headerShown: true,
            title: 'Location',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="Members"
          component={MembersScreen}
          options={{
            headerShown: true,
            title: 'Members',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="Events"
          component={EventsScreen}
          options={{
            headerShown: true,
            title: 'Events',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="Approval"
          component={Approval}
          options={{headerShown: true}}
        />

      </Stack.Navigator>
    </NavigationContainer>
    <Toast/>
    </>
  );
};

export default App;
