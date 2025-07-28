import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import {resources} from '../../resources';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountDeletionScreen = ({navigation}) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [reason, setReason] = useState('');
  const [netWorkList, setNetworkList] = useState([]);
  const [selectProfile, setSelectProfile] = useState(false)
  const [netWorkSel, setNetWorkSel] = useState(null)
  const [delAccount, setDelAccount] = useState({
    email: '',
    collegeCode: '',
    type: ''
  })
  const [isDisable, setIsDisable] = useState(false)

  const deleteAccount = async () => {

    console.log("Delete account fun")
    console.log("Selectedd", selectedOption)

    if(selectedOption === 'network'){
      try {
        const res = await axios.delete(resources.APPLICATION_URL + `deleteNetWorkRegisterDetails?email=${delAccount.email}&collegeCode=${delAccount.collegeCode}`)
        console.log("Networkk Del Response", res)
        getNetworks()
      } catch (error) {
        console.log("Network Del error", error)
      }
    }

    if(selectedOption === 'account') {
      console.log("profilee triggereddd")
      try {
        const res = await axios.delete(resources.APPLICATION_URL + `deleteUserRegisterDetails?email=${delAccount.email}`)
        if(res.data.includes('Account Deleted SuccessFully')){
          navigation.navigate('Login')
        }
        console.log("Delete userrr", res)
      } catch (error) {
        console.log("Delelet user error", error)
      }
    }
  }

  const handleConfirm = () => {
    if (!selectedOption) {
      Alert.alert(
        'Selection Required',
        'Please select either Network Deletion or Account Deletion',
      );
      return;
    }
    // if (!reason.trim()) {
    //   Alert.alert('Reason Required', 'Please provide a reason for deletion');
    //   return;
    // }

    Alert.alert(
      'Confirm Request',
      `Are you sure you want to proceed with ${selectedOption}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Confirm',
          onPress: deleteAccount,
        },
      ],
    );
  };

  const getNetworks = async () => {
    const authEmail = await AsyncStorage.getItem('email');

    if (authEmail) {
      try {
        const res = await axios.get(
          resources.APPLICATION_URL +
            `getApprovalStatusByRollNo?email=${authEmail}`,
        );
        console.log('Get Networkssss', res);
        setNetworkList(res.data);
      } catch (error) {
        console.log('Get Networksss', error);
      }
    }
  };

  useEffect(() => {
    getNetworks();
  }, []);

  const SelectionItem = ({title, subtitle, isSelected}) => {

    console.log("net work Idx", netWorkSel)
    console.log("selectedd nett", delAccount)

    if (isSelected === 'network') {
      return (
        <View style={styles.selectionItem} >
          {netWorkList?.map((network, idx) => {
            console.log("Dele Networkkkkk", network)
            return (
              <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10}} 
              onPress={() => {
                console.log("idddxxxxx", idx)
                setIsDisable(true)
                setNetWorkSel(idx)
                setDelAccount({email: network?.email, collegeCode: network?.collegeCode, type: 'network'})
                }}>
                 {netWorkSel === idx ? (
                     <FontAwesome name="check-circle" size={24} color="green" />
                   ) : (
                     <Feather name="circle" size={24} color="gray" />
                   )}
                   <View style={styles.profileIcon}>
                     <Feather name="user" size={24} color="black" />
                   </View>
                 <View style={styles.selectionRight}>
                     <Text
                       style={
                         styles.selectionTitle
                       }>{`${network?.collegeName} - ${network?.collegeCode}`}</Text>
                     <Text style={styles.selectionSubtitle}>
                       {network?.purpose}
                     </Text>
                     <Text style={styles.selectionSubtitle}>
                       {network?.rollNumber}
                     </Text>
                   </View>
              </TouchableOpacity>


              // <TouchableOpacity key={idx}>
              //   <View style={styles.selectionLeft}>
              //     {isSelected ? (
              //       <FontAwesome name="check-circle" size={24} color="green" />
              //     ) : (
              //       <Feather name="circle" size={24} color="gray" />
              //     )}
              //     <View style={styles.profileIcon}>
              //       <Feather name="user" size={24} color="black" />
              //     </View>
              //     <View style={styles.selectionRight}>
              //       <Text
              //         style={
              //           styles.selectionTitle
              //         }>{"Hello"}</Text>
              //       <Text style={styles.selectionSubtitle}>
              //         {network.purpose}
              //       </Text>
              //       <Text style={styles.selectionSubtitle}>
              //         {network.rollNumber}
              //       </Text>
              //     </View>
              //   </View>
              // </TouchableOpacity>
            );
          })}
        </View>
      );
    }

    if (isSelected === 'account') {

      return (
          <View style={styles.selectionItem}>
            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10}} 
              onPress={async () => {
                const authDetails = await AsyncStorage.getItem('userInfo')
                const userInfo = JSON.parse(authDetails)
                console.log("Authhhh", userInfo)
                setIsDisable(!isDisable)
                setSelectProfile(!selectProfile)
                setDelAccount({...delAccount, type: 'profile', email: userInfo.email})
                }}>
                 {selectProfile ? (
                     <FontAwesome name="check-circle" size={24} color="green" />
                   ) : (
                     <Feather name="circle" size={24} color="gray" />
                   )}
                   <View style={styles.profileIcon}>
                     <Feather name="user" size={24} color="black" />
                   </View>
                 <View style={styles.selectionRight}>
                     <Text
                       style={
                         styles.selectionTitle
                       }>Entire Profile</Text>
                     {/* <Text style={styles.selectionSubtitle}>
                       {network?.purpose}
                     </Text>
                     <Text style={styles.selectionSubtitle}>
                       {network?.rollNumber}
                     </Text> */}
                   </View>
              </TouchableOpacity>
          </View>
      )
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.mainTitle}>
          You can submit a request for either of the following:
        </Text>

        {/* Static Network Deletion Card */}
        <View style={styles.optionCard}>
          <View style={styles.optionHeader}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="access-point-network"
                size={24}
                color="black"
              />
            </View>
            <Text style={styles.optionTitle}>NETWORK DELETION</Text>
          </View>

          <View style={styles.bulletContainer}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletText}>
                Will only remove your association with a specific network, but
                your account & personal data will not be deleted
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletText}>
                You can still login with your current credentials
              </Text>
            </View>
          </View>
        </View>

        {/* Static Account Deletion Card */}
        <View style={styles.optionCard}>
          <View style={styles.optionHeader}>
            <View style={styles.iconContainer}>
              <Feather name="user" size={24} color="black" />
            </View>
            <Text style={styles.optionTitle}>ACCOUNT DELETION</Text>
          </View>

          <View style={styles.bulletContainer}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletText}>
                Entire account will be deleted i.e. ALL personal data, login
                information & networks associated with this account
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletText}>
                You will no longer be able to login with your current
                credentials
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.infoText}>
          The request will be in the form of a pre-filled email that you will be
          directed to send from your phone's default mailing account.
        </Text>

        <Text style={styles.sectionTitle}>Please Select & Confirm:</Text>

        <View style={styles.selectionSection}>
          <TouchableOpacity
            style={[
              styles.selectionButton,
              selectedOption === 'network' && styles.selectedButton,
            ]}
            onPress={() => {
              setSelectedOption('network')
              setSelectProfile(false)
              }}>
            <Text
              style={[
                styles.selectionButtonText,
                selectedOption === 'network' && styles.selectedButtonText,
              ]}>
              Network Deletion
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.selectionButton,
              selectedOption === 'account' && styles.selectedButton,
            ]}
            onPress={() => {
              setSelectedOption('account')
              setIsDisable(false)
              setSelectProfile(false)
              }}>
            <Text
              style={[
                styles.selectionButtonText,
                selectedOption === 'account' && styles.selectedButtonText,
              ]}>
              Account Deletion
            </Text>
          </TouchableOpacity>
        </View>

        <SelectionItem
          title="Entire Profile"
          subtitle="All personal data, login information and networks associated with this account"
          isSelected={selectedOption}
          // onPress={() => setSelectedOption('account')}
        />

        <View style={styles.reasonContainer}>
          <TextInput
            style={styles.reasonInput}
            placeholder="Reason for deletion*"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={reason}
            onChangeText={setReason}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!isDisable) && styles.disabledButton,
          ]}
          onPress={handleConfirm}
          disabled={!isDisable}>
          <Text
            style={[
              styles.confirmButtonText,
              (!selectedOption) && styles.disabledButtonText,
            ]}>
            Confirm Request
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
  },
  mainTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    lineHeight: 22,
  },
  optionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    letterSpacing: 1,
  },
  bulletContainer: {
    marginLeft: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    lineHeight: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  selectionSection: {
    marginBottom: 20,
  },
  selectionButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  selectionButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  selectedButtonText: {
    color: '#FFF',
  },
  selectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 100
  },
  selectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  selectionRight: {
    flex: 1,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  selectionSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  reasonContainer: {
    marginBottom: 24,
  },
  reasonInput: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 100,
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#C7C7CC',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  disabledButtonText: {
    color: '#999',
  },
});

export default AccountDeletionScreen;
