import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import JobBoard from './JobBoard'
import InternshipBoard from './Intership'


const Stack = createNativeStackNavigator()

const JobBoardMain = ({navigation}) => {
    return (
        <View style={styles.jobBoardMainContainer}>
       <View style={styles.jobsTypesContainer}>
         <ScrollView
                horizontal
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}>
                <TouchableOpacity style={styles.jobTypes}>
                  <Text>Showing All Jobs</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.jobTypes} onPress={() => navigation.navigate('Internship')}>
                  <Text>Show Internships</Text>
                </TouchableOpacity>
              </ScrollView>
       </View>
        <Stack.Navigator initialRouteName='JobBoard' screenOptions={{headerShown: false, animation:'slide_from_bottom'}}>
            <Stack.Screen name='JobBoard' component={JobBoard}/>
            <Stack.Screen name='Internship' component={InternshipBoard}/>
        </Stack.Navigator>
        </View>
    )
}

const styles = StyleSheet.create({
     jobTypes: {
        backgroundColor: '#e1e2e3',
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderRadius: 22,
        marginRight: 10
    },
    jobsTypesContainer: {
        paddingVertical: 15
    },
    jobBoardMainContainer: {
        flex: 1,
        paddingHorizontal: 25
    }
})

export default JobBoardMain