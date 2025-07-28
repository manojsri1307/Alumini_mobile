import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  TouchableOpacity,
  Modal,
  StatusBar,
  TouchableHighlight,
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  ActivityIndicator
} from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Feather';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import {resources} from '../../resources';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dummyImage from '../../assets/Alumni_image.jpg';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';


const PostDiscussion = () => {
  const [postDis, setPostDis] = useState('');
  const labelAnim = useRef(new Animated.Value(0)).current;
  const [isFocused, setIsFocused] = useState(false);
  const [GroupOpen, setGroupOpen] = useState(false);
  const [PostDisOpen, setPostDiscOpen] = useState(true);
  const [Categoryopen, setCategoryopen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchText, setSearchText] = useState('');
  const [errorText, setErrorText] = useState(false);
  const [authUser, setAuthUser] = useState({});
  const [isLoading, setIsLoading] = useState(false)
  
  // Photo upload states
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const categories = [
    'All Categories',
    'Looking for a Job',
    'Seeking Help',
    'In News',
    'Question & Answers',
    'Knowledge Base',
    'Buy / Sell / Rent',
    'Spread the Word',
    'Technical Help',
    'Alumni Introductions',
    'Study Experience',
    'Work Experience',
    'Exam Preparation Experience',
    'Interview Experience',
  ];

  // Request camera permission for Android
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to camera to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };
  
 const requestGalleryPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const permission =
        Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      const granted = await PermissionsAndroid.request(permission, {
        title: 'Gallery Permission',
        message: 'App needs access to your gallery to select photos',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });

      return granted === PermissionsAndroid.RESULTS.GRANTED;

    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  }
  return true; // iOS auto-handles it
};

  const selectImageFromGallery = async () => {

  const hasPermission = await requestGalleryPermission();
  if (!hasPermission) {
    console.log('Permission denied');
    return;
  }

  const options = {
    mediaType: 'photo',
    includeBase64: false,
    maxHeight: 2000,
    maxWidth: 2000,
    quality: 0.8,
  };

  launchImageLibrary(options, (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.log('Image Picker Error: ', response.errorMessage);
    } else if (response.assets && response.assets.length > 0) {
      const selected = response.assets[0];
      console.log('✅ Selected Image:', selected);
      setSelectedImage(selected);
      setImageModalVisible(false);
    }
  });
};

  // Handle image capture from camera
  const captureImageFromCamera = async () => {
    const hasPermission = await requestCameraPermission();
    
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required to take photos');
      return;
    }

    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    };

    launchCamera(options, (response) => {
      if (response.didCancel || response.error) {
        console.log('User cancelled or error:', response.error);
        return;
      }

      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0]);
        setImageModalVisible(false);
      }
    });
  };

  // Show image selection modal
  const showImagePicker = () => {
    setImageModalVisible(true);
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedImage(null);
  };

  const animateLabel = toValue => {
    Animated.timing(labelAnim, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleFocus = () => {
    setIsFocused(true);
    setErrorText(false);
    animateLabel(1);
  };

  const handleBlur = () => {
    if (!postDis) {
      setIsFocused(false);
      animateLabel(0);
    }
  };

  const handleTextChange = value => {
    setPostDis(value);
    if (value && !isFocused) {
      animateLabel(1);
      setIsFocused(true);
    }
  };

  const isValid = () => {
    let valid = true;
    console.log('Post text', postDis);
    if (!postDis.trim()) {
      valid = false;
      setErrorText(true);
    }
    return valid;
  };

  const getLabelStyle = () => ({
    position: 'absolute',
    left: 15,
    top: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [20, -8],
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
    zIndex: 1000,
  });

  const handleOutsideClick = () => {
    Keyboard.dismiss();
  };

  const handleTabsOpen = type => {
    if (type === 'Category') {
      setCategoryopen(true);
      setPostDiscOpen(false);
      setGroupOpen(false);
    } else if (type === 'Group') {
      setGroupOpen(true);
      setCategoryopen(false);
      setPostDiscOpen(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleCategorySelect = category => {
    setSelectedCategory(category);
  };

  const handleSubmitPostDis = async () => {
    console.log('Auth User', authUser);
    setIsLoading(true)

    const postDiscussion = {
      uniqueKey: '',
      postdiscussionCategory: selectedCategory,
      degree: '',
      batch: '',
      branch: '',
      postedBy: authUser.firstName,
      type: 'post discussion',
      date: new Date().toISOString().split('T')[0],
      timings: '',
      eventName: '',
      contactEmail: '',
      location: '',
      jobTitle: '',
      salary: '',
      companyName: '',
      filepath: '',
      verifyStatus: '',
      phoneNo: '',
      minExperience: '',
      maxExperience: '',
      title: '',
      discussion: postDis,
      jobDescription: '',
      filename: '',
      filetype: '',
    };

    const jsonPostDis = JSON.stringify(postDiscussion);
    const dummyImagePath = Image.resolveAssetSource(dummyImage);

    const formData = new FormData();
    formData.append('PublishingEventsAndJobPosts', jsonPostDis);

    if (selectedImage) {
      formData.append('file', {
        uri: selectedImage.uri,
        type: selectedImage.type || 'image/jpeg',
        name: selectedImage.fileName || 'uploaded_image.jpg',
      });
    } else {
      formData.append('file', {
        uri: dummyImagePath.uri,
        type: 'image/jpeg',
        name: 'placeholder.jpg',
      });
    }

    console.log('✅ FormData Before Sending:');
    console.log('✅ FormData _parts:', formData._parts);

    if (isValid()) {
      try {
        const res = await axios.post(
          resources.APPLICATION_URL + `saveDataBasedOnType?role=ROLE_ALUMNI`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        console.log('✅ Post Discussion Response:', res);
        setIsLoading(false)
        // Reset form after successful submission
        setPostDis('');
        setSelectedImage(null);
        setSelectedCategory('All Categories');
        Alert.alert('Success', 'Post discussion submitted successfully!');
        
      } catch (error) {
        setIsLoading(false)
        console.log('❌ Post Discussion Axios Error:', error.message);
        Alert.alert('Error', 'Failed to submit post discussion. Please try again.');
      }
    } else {
      Alert.alert('Please enter Text');
    }
  };

  useEffect(() => {
    const getAuth = async () => {
      const user = await AsyncStorage.getItem('userInfo');
      const userInfo = JSON.parse(user);
      setAuthUser(userInfo);
    };
    getAuth();
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TouchableWithoutFeedback onPress={handleOutsideClick}>
        <View style={styles.wrapper}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
              <View style={styles.inputContainer}>
                <Animated.Text style={getLabelStyle()}>
                  Enter Discussion
                </Animated.Text>
                <TextInput
                  value={postDis}
                  onChangeText={handleTextChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  multiline={true}
                  numberOfLines={8}
                  textAlignVertical="top"
                  style={[
                    styles.textInput,
                    {
                      borderColor: isFocused ? '#007BFF' : '#DCDCDC',
                    },
                  ]}
                />
              </View>

              {/* Display selected image */}
              {selectedImage && (
                <View style={styles.selectedImageContainer}>
                  <Image source={{uri: selectedImage.uri}} style={styles.selectedImage} />
                  <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                    <Icon name="x" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.attachFeilds}>
                <View style={styles.subFields}>
                  <TouchableOpacity onPress={showImagePicker}>
                    <Icon name="image" size={25} color="#333" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={captureImageFromCamera}>
                    <Icon name="camera" size={25} color="#333" />
                  </TouchableOpacity>
                </View>
                <View style={styles.verticalLine} />

                <View style={styles.subFields}>
                  <Icon name="tag" size={25} color="#333" />
                  <TouchableOpacity onPress={() => handleTabsOpen('Category')}>
                    <Text style={styles.category}>Category</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.verticalLine} />
                <View style={styles.subFields}>
                  <Icon name="users" size={25} color="#333" />
                  <TouchableOpacity onPress={() => handleTabsOpen('Group')}>
                    <Text style={styles.category}>Group</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  padding: 10,
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    padding: 10,
                    backgroundColor: '#f8f9fa',
                    marginTop: 10,
                    width: 'auto',
                    alignSelf: 'flex-start',
                    borderRadius: 15,
                  }}>
                  {selectedCategory}
                </Text>
              </View>

              <View style={styles.ViewPostDis}>
               {
                isLoading ? (
                  <ActivityIndicator size='large' />
                ) : (
                   <TouchableOpacity
                  style={styles.submitPD}
                  onPress={handleSubmitPostDis}>
                  <Text style={styles.sumbitText}>
                    <Icon name="file-plus" size={18} color="#fff" /> Post
                    Discussion
                  </Text>
                </TouchableOpacity>
                )
               }
              </View>
            </View>

            {/* Image Selection Modal */}
            <Modal
              visible={imageModalVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setImageModalVisible(false)}>
              <View style={styles.modalOverlay}>
                <View style={styles.imageModalContainer}>
                  <Text style={styles.imageModalTitle}>Select Image</Text>
                  
                  <TouchableOpacity
                    style={styles.imageModalButton}
                    onPress={selectImageFromGallery}>
                    <Icon name="image" size={24} color="#007BFF" />
                    <Text style={styles.imageModalButtonText}>Choose from Gallery</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.imageModalButton}
                    onPress={captureImageFromCamera}>
                    <Icon name="camera" size={24} color="#007BFF" />
                    <Text style={styles.imageModalButtonText}>Take Photo</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.imageModalButton, styles.cancelButton]}
                    onPress={() => setImageModalVisible(false)}>
                    <Icon name="x" size={24} color="#666" />
                    <Text style={[styles.imageModalButtonText, {color: '#666'}]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Category Modal */}
            <Modal
              style={styles.content}
              transparent={false}
              visible={Categoryopen}
              animationType="slide"
              onRequestClose={() => {
                setCategoryopen(false);
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#f0f0f0',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: '#000000',
                  }}>
                  Category
                </Text>
                <TouchableHighlight
                  underlayColor={'white'}
                  style={styles.Backclip}
                  onPress={() => {
                    setCategoryopen(false),
                      setGroupOpen(false),
                      setPostDiscOpen(true);
                  }}>
                  <Feather name="x" size={28} color="#000" />
                </TouchableHighlight>
              </View>
              <View style={styles.content}>
                <View style={{flex: 1, backgroundColor: '#ffffff'}}>
                  <StatusBar
                    barStyle="dark-content"
                    backgroundColor="#ffffff"
                  />

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      margin: 16,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      backgroundColor: '#f8f8f8',
                      borderRadius: 8,
                    }}>
                    <Feather name="search" size={24} color="#000" />
                    <TextInput
                      style={{
                        flex: 1,
                        fontSize: 16,
                        color: '#000000',
                      }}
                      placeholder="Type category name"
                      placeholderTextColor="#999999"
                      value={searchText}
                      onChangeText={setSearchText}
                    />
                  </View>

                  <ScrollView style={{flex: 1}}>
                    {filteredCategories.map((category, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingHorizontal: 16,
                          paddingVertical: 16,
                          borderBottomWidth: 1,
                          borderBottomColor: '#f5f5f5',
                        }}
                        onPress={() => handleCategorySelect(category)}>
                        <Text
                          style={{
                            fontSize: 16,
                            color:
                              category === 'All Categories'
                                ? '#22c55e'
                                : '#374151',
                            fontWeight:
                              category === selectedCategory ? '500' : '400',
                          }}>
                          {category}
                        </Text>
                        {selectedCategory === category && (
                          <Feather name="check" size={24} color="green" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </Modal>

            {/* Group Modal */}
            <Modal
              transparent={false}
              animationType="slide"
              visible={GroupOpen}
              onRequestClose={() => {
                setGroupOpen(false);
              }}
              style={styles.content}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#f0f0f0',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: '#000000',
                  }}>
                  Group
                </Text>
                <TouchableHighlight
                  underlayColor={'white'}
                  style={styles.Backclip}
                  onPress={() => {
                    setCategoryopen(false),
                      setGroupOpen(false),
                      setPostDiscOpen(true);
                  }}>
                  <Feather name="x" size={28} color="#000" />
                </TouchableHighlight>
              </View>

              <View style={styles.content}>
                <View style={{flex: 1, backgroundColor: '#ffffff'}}>
                  <StatusBar
                    barStyle="dark-content"
                    backgroundColor="#ffffff"
                  />

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      margin: 16,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      backgroundColor: '#f8f8f8',
                      borderRadius: 8,
                    }}>
                    <Feather name="search" size={24} color="#000" />
                    <TextInput
                      style={{
                        flex: 1,
                        fontSize: 16,
                        color: '#000000',
                      }}
                      placeholder="Type Group name"
                      placeholderTextColor="#999999"
                      value={searchText}
                      onChangeText={setSearchText}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  wrapper: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    position: 'relative',
    marginTop: 20,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    color: '#000',
    backgroundColor: 'transparent',
    height: 200,
    textAlignVertical: 'top',
  },
  selectedImageContainer: {
    position: 'relative',
    marginTop: 15,
    alignItems: 'center',
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachFeilds: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 4,
    backgroundColor: 'lightgrey',
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  verticalLine: {
    width: 1,
    backgroundColor: 'grey',
    height: '100%',
    alignSelf: 'center',
  },
  subFields: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  category: {
    fontWeight: '400',
    fontSize: 15,
    marginBottom: 4,
  },
  Backclip: {
    borderRadius: 30,
    alignSelf: 'flex-end',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    marginRight: 5,
    height: 50,
  },
  ViewPostDis: {
    padding: 6,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    left: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  submitPD: {
    backgroundColor: '#007BFF',
    padding: 14,
    borderRadius: 24,
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  sumbitText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  imageModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  imageModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
    width: '100%',
    backgroundColor: '#f8f9fa',
  },
  imageModalButtonText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#007BFF',
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#f1f1f1',
  },
});

export default PostDiscussion;