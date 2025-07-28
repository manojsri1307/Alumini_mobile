import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Keyboard,
  TextInput,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { resources } from '../../resources';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PostInternship = () => {
  const [JobForm, setJobForm] = useState({
    companyName: '',
    jobTitle: '',
    location: '',
    email: '',
    jobDescription: '',
  });

  const [companyItems, setCompanyItems] = useState([
    {label: 'MIET', value: 'MIET'},
    {label: 'Aditya', value: 'Aditya'},
  ]);

  const [isLoading, setIsLoading] = useState(false)
  const [authUser, SetAuthUSer] = useState({})
  const [open, setOpen] = useState(false);
  const jobFormLabels = {
    companyName: useRef(new Animated.Value(0)).current,
    jobTitle: useRef(new Animated.Value(0)).current,
    minExperience: useRef(new Animated.Value(0)).current,
    maxExperience: useRef(new Animated.Value(0)).current,
    location: useRef(new Animated.Value(0)).current,
    email: useRef(new Animated.Value(0)).current,
    jobDescription: useRef(new Animated.Value(0)).current,
  };

  const [labelFocus, setLabelFocus] = useState({
    companyName: false,
    jobTitle: false,
    location: false,
    email: false,
    jobDescription: false,
  });

  const animateLabel = (field, toValue) => {
    Animated.timing(jobFormLabels[field], {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleFocus = field => {
    setLabelFocus(prev => ({...prev, [field]: true}));
    animateLabel(field, 1);
  };

  const handleBlur = field => {
    if (!JobForm[field]) {
      setLabelFocus(prev => ({...prev, [field]: false}));
      animateLabel(field, 0);
    }
  };

  const handleTextChange = (field, value) => {
    setJobForm(prev => ({...prev, [field]: value}));
    if (value && !labelFocus[field]) {
      animateLabel(field, 1);
      setLabelFocus(prev => ({...prev, [field]: true}));
    }
  };

  const handleSubmitJobPost = async () => {
    setIsLoading(true)
    const {
      companyName,
      jobTitle,
      location,
      email,
      jobDescription,
    } = JobForm;

     const postInternship = {
      uniqueKey: '',
      postdiscussionCategory: '',
      degree: '',
      batch: '',
      branch: '',
      postedBy: authUser.firstName,
      type: 'internship',
      date: new Date().toISOString().split('T')[0],
      timings: '',
      eventName: '',
      contactEmail: email,
      location: location,
      jobTitle: '',
      salary: '',
      companyName: companyName,
      filepath: '',
      verifyStatus: '',
      phoneNo: '',
      minExperience: '',
      maxExperience: '',
      title: jobTitle,
      discussion: '',
      jobDescription: jobDescription,
      filename: '',
      filetype: '',
    };

    if (
      !companyName ||
      !jobTitle.trim() ||
    
      !location.trim() ||
      !email.trim() ||
      !jobDescription.trim()
    ) {
      Alert.alert('Validation Error', 'Please fill all the fields.');
    } else {

      console.log("Sendingg Post Internship", postInternship)
      const jsonPostInternship = JSON.stringify(postInternship)
      const formData = new FormData()
      formData.append('PublishingEventsAndJobPosts', jsonPostInternship)
      formData.append('file', "")

      try {
        const res = await axios.post(resources.APPLICATION_URL + 'saveDataBasedOnType?role=ROLE_ALUMNI', formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        console.log("Post Internshipp ress", res)
        setIsLoading(false)
      } catch (error) {
        console.log("Post Internship Error", error)
        setIsLoading(false)
      }
      Alert.alert('Success', 'Job posted successfully!');
      setJobForm({
        companyName: '',
        jobTitle: '',
    
        location: '',
        email: '',
        jobDescription: '',
      });
      setLabelFocus({
        companyName: false,
        jobTitle: false,
        location: false,
        email: false,
        jobDescription: false,
      });
      Object.keys(jobFormLabels).forEach(field => {
        animateLabel(field, 0);
      });
      if (open) {
        setOpen(false);
      }
    }
  };

  const getLabelStyle = anim => ({
    position: 'absolute',
    left: 15,
    top: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [20, -8],
    }),
    fontSize: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#b8b7b4', '#007BFF'],
    }),
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    zIndex: 1000,
  });

  const handleOutsideClick = () => {
    if (open) {
      setOpen(false);
    }
    Keyboard.dismiss();
  };

  const getAuthUSer = async () => {
    const userData = await AsyncStorage.getItem('userInfo')
    const authUser = JSON.parse(userData)
    SetAuthUSer(authUser)
  }

  useEffect(() => {
    getAuthUSer()
  }, [])

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TouchableWithoutFeedback onPress={handleOutsideClick}>
        <View style={styles.wrapper}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
              {/* <Text style={styles.title}>POST INTERNSHIP</Text> */}

              {/* <View style={styles.inputContainer}>
                <DropDownPicker
                  open={open}
                  value={JobForm.companyName}
                  items={companyItems}
                  setOpen={setOpen}
                  setValue={callback => {
                    const value = callback();
                    setJobForm(prev => ({...prev, companyName: value}));
                    if (value) {
                      animateLabel('companyName', 1);
                      setLabelFocus(prev => ({...prev, companyName: true}));
                    }
                  }}
                  setItems={setCompanyItems}
                  searchable={true}
                  placeholder="Select Company"
                  searchPlaceholder="Type to search..."
                  autoScroll={true}
                  showArrowIcon={true}
                  closeAfterSelecting={true}
                  onOpen={() => handleFocus('companyName')}
                  onClose={() => handleBlur('companyName')}
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                  searchContainerStyle={styles.searchContainer}
                  searchTextInputStyle={styles.searchInput}
                  listItemContainerStyle={styles.listItem}
                  textStyle={styles.dropdownText}
                  placeholderStyle={styles.placeholder}
                />
              </View> */}

              <View style={styles.inputContainer}>
                <Animated.Text style={getLabelStyle(jobFormLabels.companyName)}>
                 Company *
                </Animated.Text>
                <TextInput
                  value={JobForm.companyName}
                  onChangeText={text => handleTextChange('companyName', text)}
                  onFocus={() => handleFocus('companyName')}
                  onBlur={() => handleBlur('companyName')}
                  style={[
                    styles.textInput,
                    {borderColor: labelFocus.companyName ? '#007BFF' : '#DCDCDC'},
                  ]}
                />
              </View>
              <View style={styles.inputContainer}>
                <Animated.Text style={getLabelStyle(jobFormLabels.jobTitle)}>
                 Title *
                </Animated.Text>
                <TextInput
                  value={JobForm.jobTitle}
                  onChangeText={text => handleTextChange('jobTitle', text)}
                  onFocus={() => handleFocus('jobTitle')}
                  onBlur={() => handleBlur('jobTitle')}
                  style={[
                    styles.textInput,
                    {borderColor: labelFocus.jobTitle ? '#007BFF' : '#DCDCDC'},
                  ]}
                />
              </View>
              <View style={styles.inputContainer}>
                <Animated.Text style={getLabelStyle(jobFormLabels.location)}>
                  Location *
                </Animated.Text>
                <TextInput
                  value={JobForm.location}
                  onChangeText={text => handleTextChange('location', text)}
                  onFocus={() => handleFocus('location')}
                  onBlur={() => handleBlur('location')}
                  style={[
                    styles.textInput,
                    {borderColor: labelFocus.location ? '#007BFF' : '#DCDCDC'},
                  ]}
                />
              </View>

              <View style={styles.inputContainer}>
                <Animated.Text style={getLabelStyle(jobFormLabels.email)}>
                  Email *
                </Animated.Text>
                <TextInput
                  value={JobForm.email}
                  onChangeText={text => handleTextChange('email', text)}
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                  keyboardType="email-address"
                  style={[
                    styles.textInput,
                    {borderColor: labelFocus.email ? '#007BFF' : '#DCDCDC'},
                  ]}
                />
              </View>

              <View style={styles.inputContainer}>
                <Animated.Text
                  style={getLabelStyle(jobFormLabels.jobDescription)}>
                  Job Description *
                </Animated.Text>
                <TextInput
                  value={JobForm.jobDescription}
                  onChangeText={text =>
                    handleTextChange('jobDescription', text)
                  }
                  onFocus={() => handleFocus('jobDescription')}
                  onBlur={() => handleBlur('jobDescription')}
                  multiline={true}
                  numberOfLines={4}
                  style={[
                    styles.textInput,
                    styles.textArea,
                    {
                      borderColor: labelFocus.jobDescription
                        ? '#007BFF'
                        : '#DCDCDC',
                    },
                  ]}
                />
              </View>
              <View style={styles.ViewJobPost}>
               {
                isLoading ? (
                  <ActivityIndicator size='large'/>
                ) : (
                   <TouchableOpacity
                  style={styles.submitJP}
                  onPress={handleSubmitJobPost}>
                  <Text style={styles.sumbitText}> <Icon name="file-plus" size={18} color="#fff" /> Post Internship</Text>
                </TouchableOpacity>
                )
               }
              </View>
            </View>
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
    marginBottom: 25,
    position: 'relative',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    color: '#000',
    backgroundColor: 'transparent',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    borderRadius: 10,
    borderColor: '#DCDCDC',
    backgroundColor: 'transparent',
    paddingHorizontal: 15,
    zIndex: 1000,
  },
  dropdownContainer: {
    borderColor: '#DCDCDC',
    borderRadius: 10,
    elevation: 8,
    zIndex: 1001,
  },
  searchContainer: {
    margin: 0,
    padding: 0,
    borderBottomWidth: 0,
  },
  searchInput: {
    margin: 0,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontWeight: '600',
    borderWidth: 0,
  },
  listItem: {
    borderBottomWidth: 0,
  },
  dropdownText: {
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    color: '#b3b2af',
  },

  ViewJobPost: {
    position:"absolute",
    bottom:0,
    width:"100%",
    left:20,
    padding: 6,
    marginBottom: 20,
  },
  submitJP: {
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
});

export default PostInternship;
