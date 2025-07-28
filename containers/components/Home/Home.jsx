import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Networks from '../Networks/Networks';
import Spaces from '../Spaces/Spaces';
import JobBoard from '../JobBoard/JobBoard';
import NetworkHome from '../Networks/NetworkHome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import JobBoardMain from '../JobBoard/MainJob';
import { useEffect } from 'react';
import axios from 'axios';
import { resources } from '../../resources';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Tab = createBottomTabNavigator();

const Home = ({ route }) => {

    console.log("Homee Routessss ====", route)
    const homeParams = route?.params
    const getEmail = homeParams?.email
    console.log("get Emaaaailllll", getEmail)

    const getAuthDetails = async () => {
      await AsyncStorage.setItem('email', getEmail)

      try {
        const res = await axios.get(resources.APPLICATION_URL + `getAlumniMobileRegisterDetails?mail=${getEmail}`)
        console.log("Home Authh Response", res)
        await AsyncStorage.setItem('userInfo', JSON.stringify(res.data))
      } catch (error) {
        console.log("Home Auth Error", error)
      }
    }

    useEffect(() => {
      getAuthDetails()
    }, [])

    return (
        <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            console.log("routeee", route.name)
            let iconName;
            if (route.name === 'Networks') {
              iconName = focused ? 'access-point-network' : 'access-point-network';
            } else if (route.name === 'Spaces') {
              iconName = focused ? 'account-group' : 'account-group-outline';
            }else if (route.name === 'JobBoard') {
                iconName = focused ? 'text-box-search' : 'text-box-search-outline'
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007BFF',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: 75,
            paddingBottom: 10,
            paddingTop: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name='Networks' component={NetworkHome} initialParams={getEmail}/>
        {/* <Tab.Screen name='Spaces' component={Spaces}/> */}
        <Tab.Screen name='JobBoard' component={JobBoard} options={{headerShown: true}}/>
      </Tab.Navigator>
    )
}

export default Home