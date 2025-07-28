import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import { useCallback, useEffect, useState } from 'react';
import NetWorkRoles from './NetworkRoles';
import { use } from 'react';
import axios from 'axios';
import { resources } from '../../resources';


const MyNetwork = ({ navigation }) => {

     const [open, setOpen] = useState(false);
      const [value, setValue] = useState(null);
      const [items, setItems] = useState([
        {label: 'Mandava Institute of engineering and technology', value: 'Mandava'},
        {label: 'BVCITC', value: 'BVCITC'},
        {label: 'Aditya University', value: 'Aditya University'},
        // Add more country codes here
      ]);
      const [collegesList, setCollegesList] = useState([])
      const [route, setRoute] = useState('Network')
      const handleJoinNetwork = () => {
        if(value) {
            setRoute('Roles')
        }
      }

      const handleNetWorkRoles = (getRole) => {
        navigation.navigate('Approval', {getRole, college: value})
        console.log("clickeeedddd")
      }
      console.log("Valueeeeeeeeeeee", value)

      const getCollegesList = async () => {
        try {
          const res = await axios.get(resources.APPLICATION_URL + `getApprovedCollegeDetails`)
          console.log("Responsiveeee", res)
          const items = res.data.map((each) => (
            {label: `${each.collegeName} - ${each.collegeCode}`, value: `${each.collegeName} - ${each.collegeCode}`}
          ))
          setItems(items)
        } catch (error) {
          console.log("Get colleges List", error)
        }
      }

      useEffect(() => {
        getCollegesList()
      }, [])


  return (
    <View style={styles.mainContainer}>
      <View style={styles.topHeader}>
       <View style={{alignItems: 'center'}}>
         <Icon
          name="arrow-back"
          size={26}
          style={{marginLeft: 15}}
          onPress={() => navigation.goBack()}
        />
       </View>
        <Text style={styles.headerText}>Almuni Network</Text>
      </View>
      {
        route === 'Network' && (
            <View style={styles.heroContainer}>
        <View style={{width: '100%'}}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            searchable={true}
            placeholder="Select Network*"
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
          <Text style={styles.searcHText}>Search for your Alumni Network and tap to join.</Text>
        </View>
        {
            !value && (
                <View style={styles.searchBanner}>
            <Image source={require('../../assets/Search-banner.png')} resizeMode='cover'
            style={{width: 350, height: 350}}
            />
        </View>
            )
        }
         <TouchableOpacity style={styles.joinBtn} onPress={handleJoinNetwork}>
            <Text style={styles.joinBtnText}>Join Network</Text>
        </TouchableOpacity>
        <Text style={styles.bottomText}>
            {
                !value ? (
                    "Can't find your Alumni Network?"
                ) : (
                    `Join to ${value}`
                )
            }
        </Text>
        {
            value && (
                <View style={styles.searchBanner}>
            <Image source={require('../../assets/connection-people.png')} resizeMode='cover'
            style={{width: 350, height: 350}}
            />
        </View>
            )
        }
      </View>
        )
      }
      {
        route === 'Roles' && (
            <View style={styles.heroContainer}>
                <NetWorkRoles handleNetWorkRoles={handleNetWorkRoles} college={value}/>
            </View>
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    gap: 40,
    alignItems: 'center',
    paddingVertical: 20,
    elevation: 5,
    backgroundColor: '#fff'
  },
  headerText: {
    fontSize: 20,
    fontWeight: 700
  },
  heroContainer: {
    padding: 20
  },
  searcHText: {
    fontSize: 12,
    padding: 8,
    marginLeft: 10,
    color: '#7f8082'
  },
  searchBanner: {
    width: 350,
    height: 350
  },
    joinBtn: {
        backgroundColor: '#007BFF',
        paddingVertical: 16,
        paddingHorizontal: 42,
        borderRadius: 26,
        marginVertical: 15
    },
    joinBtnText: {
        color: "#fff",
        fontWeight: 700,
        textAlign: 'center'
    },
    bottomText: {
        textAlign: 'center',
        marginVertical: 30,
        fontWeight: 700,
        letterSpacing: .5
    }
});

export default MyNetwork;
