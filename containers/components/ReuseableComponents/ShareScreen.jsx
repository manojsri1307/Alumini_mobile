import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/FontAwesome';

const apps = [
  { name: 'WhatsApp', icon: 'whatsapp', social: Share.Social.WHATSAPP },
  { name: 'Instagram', icon: 'instagram', social: Share.Social.INSTAGRAM },
  { name: 'Facebook', icon: 'facebook', social: Share.Social.FACEBOOK },
  { name: 'Gmail', icon: 'envelope', social: Share.Social.EMAIL },
];

const ShareScreen = () => {
  const handleShare = async (social) => {
    const shareOptions = {
      title: 'Check out my awesome app!',
      message: 'Download it from the Play Store: https://play.google.com/store/apps/details?id=com.yourapp',
      social,
      failOnCancel: false,
    };

    try {
      await Share.shareSingle(shareOptions);
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Share Via</Text>
      <FlatList
        data={apps}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.appItem} onPress={() => handleShare(item.social)}>
            <Icon name={item.icon} size={28} color="#333" />
            <Text style={styles.appName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  appName: {
    marginLeft: 15,
    fontSize: 16,
  },
});

export default ShareScreen;
