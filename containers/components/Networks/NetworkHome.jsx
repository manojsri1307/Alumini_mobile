import {
    View,
    Text,
    StyleSheet
} from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Networks from './Networks'
import ProfileHome from './ProfileHome/ProfileHome'


const Stack = createNativeStackNavigator()

const NetworkHome = ({route}) => {

    const networkHomeParams = route?.params

    return (
        <Stack.Navigator initialRouteName='Networks' screenOptions={{headerShown: false, animation:'slide_from_bottom'}}>
            <Stack.Screen name='Networks' component={Networks} initialParams={networkHomeParams}/>
            <Stack.Screen name='ProfileHome' component={ProfileHome} options={{headerShown: true}}/>
        </Stack.Navigator>
    )
}

export default NetworkHome