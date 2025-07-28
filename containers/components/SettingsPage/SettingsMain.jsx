import {StyleSheet, Text, TouchableOpacity, View, Modal, FlatList, Pressable} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import PrifileIcon from 'react-native-vector-icons/FontAwesome';
import { useLayoutEffect, useState } from 'react';
import Share from 'react-native-share'
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';


const apps = [
   { name: 'WhatsApp', icon: 'whatsapp', color: '#25D366', social: Share.Social.WHATSAPP },
  { name: 'Facebook', icon: 'facebook', color: '#3b5998', social: Share.Social.FACEBOOK },
  { name: 'Gmail', icon: 'envelope', color: '#D44638', social: Share.Social.EMAIL },
];

const MainSettings = ({navigation}) => {

  const [modalVisible, setModalVisible] = useState(false);

  const handleShare = async (social) => {
    const options = {
      message: 'Check out this cool app! 👉 https://yourapp.link',
      social,
      failOnCancel: false,
    };

    try {
      await Share.shareSingle(options);
    } catch (error) {
      console.log('Sharing error:', error);
    }

    setModalVisible(false);
  };

  const handleLogOut = async () => {
    await AsyncStorage.clear()
    Toast.show({
      type:'success',
      text1: 'Logout Successfully'
    })
    navigation.navigate('Login')
  }


  return (
    <>
      <View style={styles.Content}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.UserTab}>
          <View style={styles.Usericon}>
            <PrifileIcon name="user-circle" size={70} color="gray" />

            <Text style={styles.tabNames}>User Profile</Text>
          </View>
          <FontAwesome name="angle-right" size={24} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('HelpView')}
          style={styles.tabs}>
          <View style={styles.icons}>
            <MaterialCommunityIcons
              name="help-circle-outline"
              size={24}
              color="gray"
            />
            <Text style={styles.tabNames}>Help</Text>
          </View>
          <FontAwesome name="angle-right" size={24} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.tabs}>
          <View style={styles.icons}>
            <Feather name="share" size={23} color="gray" />
            <Text style={styles.tabNames}>Tell a Friend</Text>
          </View>
          <FontAwesome name="angle-right" size={24} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('DeleteAccount')}
          style={styles.tabs}>
          <View style={styles.icons}>
            <Feather name="trash" size={24} color="gray" />
            <Text style={styles.tabNames}>Delete Account</Text>
          </View>
          <FontAwesome name="angle-right" size={24} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity
          // onPress={() => navigation.navigate('HelpView')}
          onPress={handleLogOut}
          style={styles.tabs}>
          <View style={styles.icons}>
            <MaterialCommunityIcons name="logout" size={28} color="gray" />
            <Text style={styles.tabNames}>Logout</Text>
          </View>
          <FontAwesome name="angle-right" size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <Text
        style={{
          color: '#888',
          position: 'absolute',
          bottom: 10,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}>
        ©2025 Aspiron.ai
      </Text>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Share Via</Text>
            <FlatList
              data={apps}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.appItem} onPress={() => handleShare(item.social)}>
                  <Icon name={item.icon} size={24} color={item.color}/>
                  <Text style={styles.appText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({
  Content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 20,
    gap: 15
  },
  UserTab:{
    height:100,
     display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  Usericon:{
      display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  tabs: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tabNames: {
    fontSize: 16,
    fontWeight: 500,
    color: '#424242'
  },
  icons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    alignSelf: 'center',
    position: 'relative',
    top: 30,
    fontSize: 20,
    fontWeight: 600,
    color: 'navyblue',
  },
  container: {
    marginTop: 100,
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  shareText: {
    color: '#fff',
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  appText: {
    fontSize: 16,
    marginLeft: 15,
  },
});

export default MainSettings;
