import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  Dimensions,
  Platform,
  PermissionsAndroid,
  Image,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import DropDownPicker from 'react-native-dropdown-picker';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {resources} from '../../../resources';
import Toast from 'react-native-toast-message';
import {launchImageLibrary} from 'react-native-image-picker';
import dummyImage from '../../../assets/Alumni_image.jpg';

const {width, height} = Dimensions.get('window');

const Profile = () => {
  const [modals, setModals] = useState({
    profile: false,
    work: false,
    education: false,
    deleteConfirm: false,
  });

  const [editingIndex, setEditingIndex] = useState(-1);
  const [imageDetails, setImageDetails] = useState({});
  console.log('Imagee uriiiiiii', imageDetails);
  const dummyImagePath = Image.resolveAssetSource(dummyImage);

  // Dropdown states for work form
  const [startMonthOpen, setStartMonthOpen] = useState(false);
  const [startYearOpen, setStartYearOpen] = useState(false);
  const [endMonthOpen, setEndMonthOpen] = useState(false);
  const [endYearOpen, setEndYearOpen] = useState(false);
  const [isWorkUpdate, setIsWorkUpdate] = useState(false);

  // Dropdown states for education form
  const [eduStartYearOpen, setEduStartYearOpen] = useState(false);
  const [eduEndYearOpen, setEduEndYearOpen] = useState(false);

  // const [profile, setProfile] = useState({
  //   companyName: '',
  //   countryCode: '',
  //   currentCity: '',
  //   degree: null,
  //   degreeEndYear: null,
  //   degreeStartYear: null,
  //   designation: null,
  //   email: '',
  //   endMonth: null,
  //   endYear: null,
  //   faceBook: null,
  //   firstName: '',
  //   institutionName: null,
  //   jobTitle: '',
  //   lastName: '',
  //   linkedIn: null,
  //   location: null,
  //   mobileNumber: '',
  //   passWord: '',
  //   professionalHeadline: null,
  //   startMonth: null,
  //   startYear: null,
  //   twitter: null,
  //   website: null,
  //   working: '',
  //   professionalDetails: [],
  //   educationalDetails: []
  // });

  const [profile, setProfile] = useState({
    email: '',
    firstName: '',
    lastName: '',
    countryCode: '',
    mobileNumber: '',
    working: '',
    jobTitle: '',
    currentCity: '',
    passWord: '',
    filenName: '',
    filePath: '',
    professionalHeadline: '',
    location: '',
    faceBook: '',
    linkedIn: '',
    twitter: '',
    website: '',
    alumniMobileRegistrationEducationDetails: [
      {
        degree: '',
        institutionName: '',
        degreeStartYear: '',
        degreeEndYear: '',
        uniqueKey1: '',
      },
      {
        degree: '',
        institutionName: '',
        degreeStartYear: '',
        degreeEndYear: '',
        uniqueKey1: '',
      },
    ],
    alumniMobileRegistrationProfessionalDetails: [
      {
        companyName: '',
        designation: '',
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        uniqueKey1: '',
      },
      {
        companyName: '',
        designation: '',
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        uniqueKey1: '',
      },
    ],
  });

  console.log('profileeeessssss', profile);

  const [workForm, setWorkForm] = useState({
    designation: '',
    companyName: '',
    currentlyWorking: '',
    startMonth: '',
    startYear: '',
    endMonth: '',
    endYear: '',
  });

  const [educationForm, setEducationForm] = useState({
    degree: '',
    degreeEndYear: '',
    degreeStartYear: '',
    institutionName: '',
  });

  const [workExperiences, setWorkExperiences] = useState([]);
  const [educationDetails, setEducationDetails] = useState([]);
  const [errors, setErrors] = useState({});

  // Dynamic data for dropdowns
  const monthItems = [
    {label: 'January', value: 'January'},
    {label: 'February', value: 'February'},
    {label: 'March', value: 'March'},
    {label: 'April', value: 'April'},
    {label: 'May', value: 'May'},
    {label: 'June', value: 'June'},
    {label: 'July', value: 'July'},
    {label: 'August', value: 'August'},
    {label: 'September', value: 'September'},
    {label: 'October', value: 'October'},
    {label: 'November', value: 'November'},
    {label: 'December', value: 'December'},
  ];

  const generateYearItems = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1990; year--) {
      years.push({label: year.toString(), value: year.toString()});
    }
    return years;
  };

  const yearItems = generateYearItems();

  const cameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const permission =
          Platform.Version >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

        const granted = await PermissionsAndroid.request(permission, {
          title: 'Gallery Permission',
          message: 'App needs access to your gallery to select photos',
          buttonNeutral: 'Ask me later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        console.warn('Permission error:', err);
        return false;
      }
    }
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

  const openCamera = async () => {
    const handlePermission = await requestGalleryPermission();

    if (!handlePermission) {
      console.log('Permission Denied');
      return;
    }

    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    };

    //  launchImageLibrary(options, (response) => {
    //   console.log("Gallaeryyy Responseee", response)
    //   if(response?.assets[0]){
    //     setImageDetails(response.assets[0])
    //   }
    //  })

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image Picker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selected = response.assets[0];
        console.log('✅ Selected Image:', selected);
        setImageDetails(selected);
      }
    });
  };

  const userInfo = {
    name: `${profile?.firstName} ${profile?.lastName}`,
    // batch: 'Batch of 2018',
    location: profile?.currentCity,
    mobile: `+91-${profile?.mobileNumber}`,
    email: profile?.email,
    initials: profile?.firstName[0] + profile?.lastName[0],
  };

  const closeAllDropdowns = () => {
    setStartMonthOpen(false);
    setStartYearOpen(false);
    setEndMonthOpen(false);
    setEndYearOpen(false);
    setEduStartYearOpen(false);
    setEduEndYearOpen(false);
  };

  const openModal = (type, index = -1) => {
    setModals({
      profile: false,
      work: false,
      education: false,
      deleteConfirm: false,
      [type]: true,
    });
    setEditingIndex(index);
    setErrors({});
    closeAllDropdowns();

    if (type === 'work' && index >= 0) {
      console.log('Workkk Opennnn');
      // setWorkForm(workExperiences[index]);
    } else if (type === 'work') {
      setWorkForm({
        designation: '',
        companyName: '',
        currentlyWorking: false,
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
      });
    } else if (type === 'education') {
      setEducationForm({
        degree: '',
        institutionName: '',
        isCurrentlyPursuing: false,
        degreeStartYear: '',
        degreeEndYear: '',
      });
    }
  };

  const closeModals = async () => {
    setModals({
      profile: false,
      work: false,
      education: false,
      deleteConfirm: false,
    });
    setEditingIndex(-1);
    setErrors({});
    closeAllDropdowns();
    await getAuthDetails();
  };

  const validate = (type, data) => {
    const newErrors = {};

    if (type === 'profile') {
      if (!data.firstName?.trim()) newErrors.firstName = 'Required';
      if (!data.lastName?.trim()) newErrors.lastName = 'Required';
      if (!data.mobileNumber?.trim()) newErrors.mobile = 'Required';
    } else if (type === 'work') {
      if (!data.designation?.trim()) newErrors.designation = 'Required';
      if (!data.companyName?.trim()) newErrors.companyName = 'Required';
      if (!data.startMonth) newErrors.startMonth = 'Required';
      if (!data.startYear) newErrors.startYear = 'Required';
      if (data.isCurrentlyWorking && !data.endMonth)
        newErrors.endMonth = 'Required';
      if (data.isCurrentlyWorking && !data.endYear)
        newErrors.endYear = 'Required';
    } else if (type === 'education') {
      if (!data.degree?.trim()) newErrors.degree = 'Required';
      if (!data.institutionName?.trim()) newErrors.instituteName = 'Required';
      if (!data.degreeStartYear) newErrors.startYear = 'Required';
      if (!data.isCurrentlyPursuing && !data.degreeEndYear)
        newErrors.endYear = 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleUpdation = async () => {
  //    try {
  //         const res = await axios.put(resources.APPLICATION_URL + `updateAlumniMobileRegister`, profile)
  //         await getAuthDetails()
  //         await getUserInfo()
  //         console.log("Profile Update call", res)
  //       } catch (error) {
  //         console.log("Profile update error", error)
  //         await getAuthDetails()
  //         await getUserInfo()
  //       }
  // }

  // const handleUpdation = async (updateWork) => {
  //   console.log('Entereddd');

  //   console.log('AlumniiChildddd', updateWork);

  //   const updatedData = {
  //     ...updateWork,
  //     alumniMobileRegistrationEducationDetails:
  //       updateWork?.alumniMobileRegistrationEducationDetails || [],
  //     alumniMobileRegistrationProfessionalDetails:
  //       updateWork?.alumniMobileRegistrationProfessionalDetails || [],
  //   };

  //   console.log('Beforeee sendingg Data', updatedData);

  //   const safeUpdatedData =
  //     typeof updatedData === 'object' && updatedData !== null
  //       ? updatedData
  //       : {};
  //   const dataToSend =
  //     Object.keys(safeUpdatedData).length > 2 ? safeUpdatedData : profile;
  //   console.log('Senddd Data', dataToSend);

  //   const jsonSendData = JSON.stringify(dataToSend);

  //   const formData = new FormData();
  //   formData.append('AlumniMobileRegistration', jsonSendData);

  //   if (imageDetails) {
  //     console.log('Enteredddddd');
  //     formData.append('file', {
  //       uri: imageDetails.uri,
  //       type: imageDetails.type,
  //       name: imageDetails.fileName,
  //     });
  //   }
  //   // else {
  //   //   formData.append('file', '');
  //   // }

  //   console.log(
  //     'Triggereddddd',
  //     `${resources.APPLICATION_URL}updateAlumniMobileRegister`,
  //   );
  //   console.log('Formmm Dataaa', formData);
  //   try {
  //     Alert.alert('updateAlumniMobileRegister');
  //     const res = await axios.post(
  //       `${resources.APPLICATION_URL}updateAlumniMobileRegister`,
  //       formData
  //     );
  //     console.log('Profile Update call updateAlumniMobileRegister', res);
  //     if (res.status) {
  //       await getAuthDetails();
  //       Toast.show({
  //         type: 'success',
  //         text1: 'Updated',
  //       });
  //     }
  //   } catch (error) {
  //     console.log('Profile update error', error);
  //     Toast.show({
  //       type: 'success',
  //       text1: 'Updated',
  //     });
  //     await getAuthDetails();
  //   }
  // };

  const handleUpdation = async updateWork => {
    console.log('Entereddd');
    console.log('AlumniiChildddd', updateWork);

    const updatedData = {
      ...updateWork,
      alumniMobileRegistrationEducationDetails:
        updateWork?.alumniMobileRegistrationEducationDetails || [],
      alumniMobileRegistrationProfessionalDetails:
        updateWork?.alumniMobileRegistrationProfessionalDetails || [],
    };

    const safeUpdatedData =
      typeof updatedData === 'object' && updatedData !== null
        ? updatedData
        : {};

    const dataToSend =
      Object.keys(safeUpdatedData).length > 2 ? safeUpdatedData : profile;

    const jsonSendData = JSON.stringify(dataToSend);

    const formData = new FormData();
    formData.append('AlumniMobileRegistration', jsonSendData);

    if (imageDetails?.uri) {
      formData.append('file', {
        uri: imageDetails.uri,
        type: imageDetails.type || 'image/jpeg',
        name: imageDetails.fileName || 'profile.jpg',
      });
    } 

    console.log("Formmm Dataaa====", formData)

    try {
      Alert.alert('Updating Profile...');
      const res = await axios.post(
        `${resources.APPLICATION_URL}updateAlumniMobileRegister`,
        formData,
         {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
      );

      console.log('Profile Update call success', res);

      if (res.status === 200) {
        await getAuthDetails();
        Toast.show({
          type: 'success',
          text1: 'Profile Updated',
        });
      }
    } catch (error) {
      console.log('Profile update error', error?.response || error?.message);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
      });
    }

//     try {
//   Alert.alert('Updating Profile...');

//   const response = await fetch(
//     `${resources.APPLICATION_URL}updateAlumniMobileRegister`,
//     {
//       method: 'POST',
//       body: formData, // <-- multipart formData
//       // ❌ Don't set Content-Type manually. Let fetch set it with correct boundary
//     }
//   );

//   if (response.ok) {
//     const resJson = await response.json();
//     console.log('Profile Update call success', resJson);

//     await getAuthDetails();

//     Toast.show({
//       type: 'success',
//       text1: 'Profile Updated',
//     });
//   } else {
//     const errorText = await response.text();
//     console.log('Profile update failed with status', response.status, errorText);

//     Toast.show({
//       type: 'error',
//       text1: 'Update Failed',
//     });
//   }
// } catch (error) {
//   console.log('Profile update error (fetch)', error);

//   Toast.show({
//     type: 'error',
//     text1: 'Update Failed',
//   });
// }


  };

  const handleSave = async type => {
    let isValid = false;

    if (type === 'profile') {
      isValid = validate('profile', profile);
      if (isValid) {
        console.log('Profileee', profile);
        await handleUpdation();
        Alert.alert('Success', 'Profile updated successfully!');
      }
    } else if (type === 'work') {
      isValid = validate('work', workForm);
      if (isValid) {
        const profileCopy = {...profile};
        let updatedExperiences = [];

        if (editingIndex >= 0) {
          console.log('Ifff entereddddd');
          updatedExperiences = [{...workForm}];
          console.log('Workkk Edittt', updatedExperiences);
          Alert.alert('Success', 'Work experience updated!');
        } else {
          updatedExperiences = [...workExperiences, {...workForm}];
          setWorkExperiences(updatedExperiences);
          Alert.alert('Success', 'Work experience added!');
        }

        console.log(
          'Updateddd workExperienceeee ----========?>>',
          updatedExperiences,
        );

        const workExpArr = updatedExperiences.map(each => ({
          ...each,
        }));
        console.log('workExpeArrrrrr', workExpArr);

        const latestExperience =
          updatedExperiences.length > 0
            ? updatedExperiences[updatedExperiences.length - 1]
            : {
                ...workForm,
              };

        const updatedUniqKey = [
          ...profile.alumniMobileRegistrationProfessionalDetails,
          {
            ...latestExperience,
            uniqueKey1: isWorkUpdate ? latestExperience.uniqueKey1 : '',
          },
        ];

        console.log('Updateddd Keyyy', updatedUniqKey);

        const updateWork = {
          ...profile,
          alumniMobileRegistrationProfessionalDetails: [...updatedUniqKey],
        };

        // setProfile(updateWork);
        handleUpdation(updateWork);
      }
    } else if (type === 'education') {
      console.log('Educationn clickeddd');
      isValid = validate('education', educationForm);
      if (isValid) {
        console.log('Educationnnn', educationForm);
        const educationArr = [...educationDetails, {...educationForm}];
        console.log('Educationn Array ====>>>>>> ', educationArr);

        const educationUpdate = educationArr.map(each => ({
          degree: each.degree,
          degreeEndYear: each.degreeEndYear,
          degreeStartYear: each.degreeStartYear,
          institutionName: each.institutionName,
        }));

        console.log('updatedddd education details', educationUpdate);
        setEducationDetails([...educationDetails, {...educationForm}]);

        const latestEducation =
          educationArr.length > 0
            ? educationArr[educationArr.length - 1]
            : {...educationForm};

        const updatedEducationKey = [
          ...profile.alumniMobileRegistrationEducationDetails,
          {
            ...latestEducation,
            uniqueKey1: '',
          },
        ];

        const updateWork = {
          ...profile,
          alumniMobileRegistrationEducationDetails: [...updatedEducationKey],
        };
        console.log('new education update keyyyy', updatedEducationKey);

        handleUpdation(updateWork);
        Alert.alert('Success', 'Education added!');
      }
    }
    if (isValid) closeModals();
  };

  const handleDelete = () => {
    const updated = workExperiences.filter((_, i) => i !== editingIndex);
    setWorkExperiences(updated);
    closeModals();
    Alert.alert('Success', 'Work experience deleted!');
  };

  const getUserInfo = async () => {
    try {
      const userData = await AsyncStorage.getItem('userInfo');
      const userInfo = userData ? JSON.parse(userData) : null;

      console.log('userInfooooo', userInfo);
      setProfile(
        {...userInfo, professionalDetails: [], educationalDetails: []} ||
          profile,
      );
    } catch (error) {
      console.log('getUserInfo Error', error);
    }
  };

  const getAuthDetails = async () => {
    try {
      const getEmail = await AsyncStorage.getItem('email');
      console.log('gettt Emaiiiillll', getEmail);

      const res = await axios.get(
        `${resources.APPLICATION_URL}getAlumniMobileRegisterDetails?mail=${getEmail}`,
      );

      console.log('Profile Auth Response', res);
      await AsyncStorage.setItem('userInfo', JSON.stringify(res.data));
      const profileObj = res.data;
      setProfile(profileObj);
    } catch (error) {
      console.log('Profile Auth Error', error);
    }
  };

  console.log('workExperiences =========', workExperiences);

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#070F2B', '#1B1A55', '#535C91', '#9290C3']}
        style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{userInfo.name}'s Profile</Text>
          </View>

          <View style={styles.profileSection}>
            {Object.entries(imageDetails).length > 0 ? (
              <View style={styles.avatar}>
                <Image
                  source={{uri: imageDetails?.uri}}
                  resizeMode="cover"
                  style={{width: '100%', height: '100%', borderRadius: 50}}
                />
              </View>
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{userInfo.initials}</Text>
              </View>
            )}
            <Text style={styles.profileName}>{userInfo.name}</Text>
            <Text style={styles.profileBatch}>{userInfo.batch}</Text>
            <Text style={styles.profileLocation}>{userInfo.location}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => openModal('profile')}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Mobile Number</Text>
              <Text style={styles.infoValue}>{userInfo.mobile}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email ID</Text>
              <Text style={styles.infoValueLink}>{userInfo.email}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Professional Details</Text>
              <TouchableOpacity onPress={() => openModal('work')}>
                <Feather name="plus" size={20} color="#535C91" />
              </TouchableOpacity>
            </View>
            {profile?.alumniMobileRegistrationProfessionalDetails?.length ===
            0 ? (
              <Text style={styles.noData}>No work experience added yet</Text>
            ) : (
              profile?.alumniMobileRegistrationProfessionalDetails?.map(
                (work, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.item}
                    onPress={() => {
                      openModal('work', index);
                      setWorkForm(work);
                      setIsWorkUpdate(true);
                    }}>
                    <Text style={styles.itemTitle}>{work.designation}</Text>
                    <Text style={styles.itemSubtitle}>{work.companyName}</Text>
                    <Text style={styles.itemDuration}>
                      {work.startMonth} {work.startYear} -{' '}
                      {/* {work.isCurrentlyWorking
                        ? 'Present'
                        : `${work.endMonth} ${work.endYear}`} */}
                      {work.endMonth === ''
                        ? 'Present'
                        : `${work.endMonth} ${work.endYear}`}
                    </Text>
                  </TouchableOpacity>
                ),
              )
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Education</Text>
              <TouchableOpacity onPress={() => openModal('education')}>
                <Feather name="plus" size={20} color="#535C91" />
              </TouchableOpacity>
            </View>
            {profile?.alumniMobileRegistrationEducationDetails?.length === 0 ? (
              <Text style={styles.noData}>No education details added yet</Text>
            ) : (
              profile?.alumniMobileRegistrationEducationDetails?.map(
                (education, index) => {
                  return (
                    <View key={index} style={styles.item}>
                      <Text style={styles.itemTitle}>{education.degree}</Text>
                      <Text style={styles.itemSubtitle}>
                        {education.institutionName}
                      </Text>
                      <Text style={styles.itemDuration}>
                        {education.degreeStartYear} -{' '}
                        {education.isCurrentlyPursuing
                          ? 'Present'
                          : education.degreeEndYear}
                      </Text>
                    </View>
                  );
                },
              )
            )}
          </View>
        </ScrollView>

        <Modal
          visible={modals.profile}
          animationType="slide"
          onRequestClose={closeModals}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closeModals}>
                <Feather name="arrow-left" size={24} color="#070F2B" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <View style={{width: 24}} />
            </View>

            <ScrollView
              style={styles.form}
              showsVerticalScrollIndicator={false}>
              <View style={styles.avatarSection}>
                <View style={styles.avatarContainer}>
                  {Object.entries(imageDetails).length > 0 ? (
                    <View style={styles.avatar}>
                      <Image
                        source={{uri: imageDetails?.uri}}
                        resizeMode="cover"
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 50,
                        }}
                      />
                    </View>
                  ) : (
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{userInfo.initials}</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.cameraButton}
                    onPress={openCamera}>
                    <Feather name="camera" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>First Name*</Text>
                <TextInput
                  style={[styles.input, errors?.firstName && styles.inputError]}
                  value={profile?.firstName}
                  onChangeText={text =>
                    setProfile({...profile, firstName: text})
                  }
                  placeholder="First Name*"
                  placeholderTextColor="#999"
                />
                {errors.firstName && (
                  <Text style={styles.error}>{errors.firstName}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Last Name*</Text>
                <TextInput
                  style={[styles.input, errors.lastName && styles.inputError]}
                  value={profile?.lastName}
                  onChangeText={text =>
                    setProfile({...profile, lastName: text})
                  }
                  placeholder="Last Name*"
                  placeholderTextColor="#999"
                />
                {errors.lastName && (
                  <Text style={styles.error}>{errors.lastName}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Professional Headline</Text>
                <TextInput
                  style={styles.input}
                  value={profile?.professionalHeadline}
                  onChangeText={text =>
                    setProfile({...profile, professionalHeadline: text})
                  }
                  placeholder="Professional Headline"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={profile?.currentCity}
                  onChangeText={text =>
                    setProfile({...profile, currentCity: text})
                  }
                  placeholder="Location"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Mobile*</Text>
                <TextInput
                  style={[styles.input, errors.mobile && styles.inputError]}
                  value={profile?.mobileNumber}
                  onChangeText={text =>
                    setProfile({...profile, mobileNumber: text})
                  }
                  placeholder="Mobile*"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
                {errors.mobile && (
                  <Text style={styles.error}>{errors.mobile}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Facebook</Text>
                <TextInput
                  style={styles.input}
                  value={profile?.faceBook}
                  onChangeText={text =>
                    setProfile({...profile, faceBook: text})
                  }
                  placeholder="Facebook"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>LinkedIn</Text>
                <TextInput
                  style={styles.input}
                  value={profile?.linkedIn}
                  onChangeText={text =>
                    setProfile({...profile, linkedIn: text})
                  }
                  placeholder="LinkedIn"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Twitter</Text>
                <TextInput
                  style={styles.input}
                  value={profile?.twitter}
                  onChangeText={text => setProfile({...profile, twitter: text})}
                  placeholder="Twitter"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Website</Text>
                <TextInput
                  style={styles.input}
                  value={profile?.website}
                  onChangeText={text => setProfile({...profile, website: text})}
                  placeholder="Website"
                  placeholderTextColor="#999"
                />
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => handleSave('profile')}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModals}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>

        <Modal
          visible={modals.work}
          animationType="slide"
          onRequestClose={closeModals}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closeModals}>
                <Feather name="x" size={24} color="#070F2B" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {editingIndex >= 0 ? 'Update Work' : 'Add Work'}
              </Text>
              <View style={{width: 24}} />
            </View>

            <ScrollView
              style={styles.form}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Designation*</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.designation && styles.inputError,
                  ]}
                  value={workForm.designation}
                  onChangeText={text =>
                    setWorkForm({...workForm, designation: text})
                  }
                  placeholder="Designation*"
                  placeholderTextColor="#999"
                />
                {errors.designation && (
                  <Text style={styles.error}>{errors.designation}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Company Name*</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.companyName && styles.inputError,
                  ]}
                  value={workForm.companyName}
                  onChangeText={text =>
                    setWorkForm({...workForm, companyName: text})
                  }
                  placeholder="Company Name*"
                  placeholderTextColor="#999"
                />
                {errors.companyName && (
                  <Text style={styles.error}>{errors.companyName}</Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() =>
                  setWorkForm({
                    ...workForm,
                    currentlyWorking: !workForm.currentlyWorking,
                  })
                }>
                <View
                  style={[
                    styles.checkbox,
                    workForm.currentlyWorking && styles.checkboxChecked,
                  ]}>
                  {workForm.currentlyWorking && (
                    <Feather name="check" size={16} color="white" />
                  )}
                </View>
                <Text style={styles.checkboxText}>
                  I am currently working under this role
                </Text>
              </TouchableOpacity>

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Start Month*</Text>
                  <DropDownPicker
                    open={startMonthOpen}
                    value={workForm.startMonth}
                    items={monthItems}
                    setOpen={setStartMonthOpen}
                    setValue={callback => {
                      const value =
                        typeof callback === 'function'
                          ? callback(workForm.startMonth)
                          : callback;
                      setWorkForm({...workForm, startMonth: value});
                    }}
                    placeholder="Start Month"
                    style={[
                      styles.dropdown,
                      errors.startMonth && styles.inputError,
                    ]}
                    dropDownContainerStyle={styles.dropdownContainer}
                    textStyle={styles.dropdownText}
                    placeholderStyle={styles.placeholderStyle}
                    onOpen={() => {
                      setStartYearOpen(false);
                      setEndMonthOpen(false);
                      setEndYearOpen(false);
                    }}
                    zIndex={4000}
                    zIndexInverse={1000}
                  />
                  {errors.startMonth && (
                    <Text style={styles.error}>{errors.startMonth}</Text>
                  )}
                </View>

                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Start Year*</Text>
                  <DropDownPicker
                    open={startYearOpen}
                    value={workForm.startYear}
                    items={yearItems}
                    setOpen={setStartYearOpen}
                    setValue={callback => {
                      const value =
                        typeof callback === 'function'
                          ? callback(workForm.startYear)
                          : callback;
                      setWorkForm({...workForm, startYear: value});
                    }}
                    placeholder="Start Year"
                    style={[
                      styles.dropdown,
                      errors.startYear && styles.inputError,
                    ]}
                    dropDownContainerStyle={styles.dropdownContainer}
                    textStyle={styles.dropdownText}
                    placeholderStyle={styles.placeholderStyle}
                    searchable={true}
                    searchPlaceholder="Search year..."
                    onOpen={() => {
                      setStartMonthOpen(false);
                      setEndMonthOpen(false);
                      setEndYearOpen(false);
                    }}
                    zIndex={3000}
                    zIndexInverse={2000}
                  />
                  {errors.startYear && (
                    <Text style={styles.error}>{errors.startYear}</Text>
                  )}
                </View>
              </View>

              {!workForm.currentlyWorking && (
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>End Month*</Text>
                    <DropDownPicker
                      open={endMonthOpen}
                      value={workForm.endMonth}
                      items={monthItems}
                      setOpen={setEndMonthOpen}
                      setValue={callback => {
                        const value =
                          typeof callback === 'function'
                            ? callback(workForm.endMonth)
                            : callback;
                        setWorkForm({...workForm, endMonth: value});
                      }}
                      placeholder="End Month"
                      style={[
                        styles.dropdown,
                        errors.endMonth && styles.inputError,
                      ]}
                      dropDownContainerStyle={styles.dropdownContainer}
                      textStyle={styles.dropdownText}
                      placeholderStyle={styles.placeholderStyle}
                      onOpen={() => {
                        setStartMonthOpen(false);
                        setStartYearOpen(false);
                        setEndYearOpen(false);
                      }}
                      zIndex={2000}
                      zIndexInverse={3000}
                    />
                    {errors.endMonth && (
                      <Text style={styles.error}>{errors.endMonth}</Text>
                    )}
                  </View>

                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>End Year*</Text>
                    <DropDownPicker
                      open={endYearOpen}
                      value={workForm.endYear}
                      items={yearItems}
                      setOpen={setEndYearOpen}
                      setValue={callback => {
                        const value =
                          typeof callback === 'function'
                            ? callback(workForm.endYear)
                            : callback;
                        setWorkForm({...workForm, endYear: value});
                      }}
                      placeholder="End Year"
                      style={[
                        styles.dropdown,
                        errors.endYear && styles.inputError,
                      ]}
                      dropDownContainerStyle={styles.dropdownContainer}
                      textStyle={styles.dropdownText}
                      placeholderStyle={styles.placeholderStyle}
                      searchable={true}
                      searchPlaceholder="Search year..."
                      onOpen={() => {
                        setStartMonthOpen(false);
                        setStartYearOpen(false);
                        setEndMonthOpen(false);
                      }}
                      zIndex={1000}
                      zIndexInverse={4000}
                    />
                    {errors.endYear && (
                      <Text style={styles.error}>{errors.endYear}</Text>
                    )}
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => handleSave('work')}>
                <Text style={styles.saveButtonText}>
                  {editingIndex >= 0 ? 'Update Work' : 'Add Work'}
                </Text>
              </TouchableOpacity>

              {editingIndex >= 0 && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => setModals({...modals, deleteConfirm: true})}>
                  <Text style={styles.deleteButtonText}>Delete Experience</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModals}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>

        <Modal
          visible={modals.education}
          animationType="slide"
          onRequestClose={closeModals}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closeModals}>
                <Feather name="x" size={24} color="#070F2B" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add Course</Text>
              <View style={{width: 24}} />
            </View>

            <ScrollView
              style={styles.form}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Degree*</Text>
                <TextInput
                  style={[styles.input, errors.degree && styles.inputError]}
                  value={educationForm.degree}
                  onChangeText={text =>
                    setEducationForm({...educationForm, degree: text})
                  }
                  placeholder="Degree*"
                  placeholderTextColor="#999"
                />
                {errors.degree && (
                  <Text style={styles.error}>{errors.degree}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Institute Name*</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.instituteName && styles.inputError,
                  ]}
                  value={educationForm.institutionName}
                  onChangeText={text =>
                    setEducationForm({...educationForm, institutionName: text})
                  }
                  placeholder="Institute Name*"
                  placeholderTextColor="#999"
                />
                {errors.instituteName && (
                  <Text style={styles.error}>{errors.instituteName}</Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() =>
                  setEducationForm({
                    ...educationForm,
                    isCurrentlyPursuing: !educationForm.isCurrentlyPursuing,
                  })
                }>
                <View
                  style={[
                    styles.checkbox,
                    educationForm.isCurrentlyPursuing && styles.checkboxChecked,
                  ]}>
                  {educationForm.isCurrentlyPursuing && (
                    <Feather name="check" size={16} color="white" />
                  )}
                </View>
                <Text style={styles.checkboxText}>
                  I am currently pursuing this degree
                </Text>
              </TouchableOpacity>

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Start Year*</Text>
                  <DropDownPicker
                    open={eduStartYearOpen}
                    value={educationForm.degreeStartYear}
                    items={yearItems}
                    setOpen={setEduStartYearOpen}
                    setValue={callback => {
                      const value =
                        typeof callback === 'function'
                          ? callback(educationForm.degreeStartYear)
                          : callback;
                      setEducationForm({
                        ...educationForm,
                        degreeStartYear: value,
                      });
                    }}
                    placeholder="Start Year*"
                    style={[
                      styles.dropdown,
                      errors.startYear && styles.inputError,
                    ]}
                    dropDownContainerStyle={styles.dropdownContainer}
                    textStyle={styles.dropdownText}
                    placeholderStyle={styles.placeholderStyle}
                    searchable={true}
                    searchPlaceholder="Search year..."
                    onOpen={() => {
                      setEduEndYearOpen(false);
                    }}
                    zIndex={2000}
                    zIndexInverse={1000}
                  />
                  {errors.startYear && (
                    <Text style={styles.error}>{errors.startYear}</Text>
                  )}
                </View>

                {!educationForm.isCurrentlyPursuing && (
                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>End Year*</Text>
                    <DropDownPicker
                      open={eduEndYearOpen}
                      value={educationForm.degreeEndYear}
                      items={yearItems}
                      setOpen={setEduEndYearOpen}
                      setValue={callback => {
                        const value =
                          typeof callback === 'function'
                            ? callback(educationForm.degreeEndYear)
                            : callback;
                        setEducationForm({
                          ...educationForm,
                          degreeEndYear: value,
                        });
                      }}
                      placeholder="End Year*"
                      style={[
                        styles.dropdown,
                        errors.endYear && styles.inputError,
                      ]}
                      dropDownContainerStyle={styles.dropdownContainer}
                      textStyle={styles.dropdownText}
                      placeholderStyle={styles.placeholderStyle}
                      searchable={true}
                      searchPlaceholder="Search year..."
                      onOpen={() => {
                        setEduStartYearOpen(false);
                      }}
                      zIndex={1000}
                      zIndexInverse={2000}
                    />
                    {errors.endYear && (
                      <Text style={styles.error}>{errors.endYear}</Text>
                    )}
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => handleSave('education')}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModals}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>

        <Modal
          visible={modals.deleteConfirm}
          animationType="fade"
          transparent
          onRequestClose={closeModals}>
          <View style={styles.deleteOverlay}>
            <View style={styles.deleteContainer}>
              <Text style={styles.deleteTitle}>Delete Work Experience</Text>
              <Text style={styles.deleteMessage}>
                Are you sure you want to delete this work experience? This
                action cannot be undone.
              </Text>
              <View style={styles.deleteActions}>
                <TouchableOpacity
                  style={styles.deleteConfirmButton}
                  onPress={handleDelete}>
                  <Text style={styles.deleteConfirmText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteCancelButton}
                  onPress={closeModals}>
                  <Text style={styles.deleteCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {color: 'white', fontSize: 20, fontWeight: '600'},
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarText: {fontSize: 28, fontWeight: 'bold', color: '#535C91'},
  profileName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  profileBatch: {color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 4},
  profileLocation: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  editButtonText: {color: 'white', fontSize: 16, fontWeight: '600'},
  section: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {fontSize: 18, fontWeight: 'bold', color: '#070F2B'},
  infoItem: {marginBottom: 15},
  infoLabel: {fontSize: 14, color: '#666', marginBottom: 4, fontWeight: '500'},
  infoValue: {fontSize: 16, color: '#070F2B', fontWeight: '500'},
  infoValueLink: {fontSize: 16, color: '#535C91', fontWeight: '500'},
  noData: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 10,
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#070F2B',
    marginBottom: 4,
  },
  itemSubtitle: {fontSize: 14, color: '#666', marginBottom: 2},
  itemDuration: {fontSize: 12, color: '#999'},
  modalContainer: {flex: 1, backgroundColor: '#F5F5F5'},
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingTop: 50,
  },
  modalTitle: {fontSize: 20, fontWeight: 'bold', color: '#070F2B'},
  form: {flex: 1, padding: 20},
  avatarSection: {alignItems: 'center', marginBottom: 20},
  avatarContainer: {position: 'relative'},
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#535C91',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {marginBottom: 20},
  label: {fontSize: 14, color: '#666', marginBottom: 8, fontWeight: '500'},
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  inputError: {borderColor: '#E74C3C'},
  error: {color: '#E74C3C', fontSize: 12, marginTop: 4},
  dropdown: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {fontSize: 16, color: '#333'},
  placeholder: {color: '#999'},
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#DDD',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {backgroundColor: '#535C91', borderColor: '#535C91'},
  checkboxText: {fontSize: 14, color: '#666', flex: 1},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  halfWidth: {width: '48%'},
  saveButton: {
    backgroundColor: '#535C91',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {color: 'white', fontSize: 16, fontWeight: '600'},
  deleteButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButtonText: {color: 'white', fontSize: 16, fontWeight: '600'},
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  cancelButtonText: {color: '#666', fontSize: 16, fontWeight: '600'},
  deleteOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    width: 300,
  },
  deleteTitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  deleteConfirmButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteConfirmText: {color: 'white', fontSize: 16, fontWeight: '600'},
  deleteCancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  deleteCancelText: {color: '#666', fontSize: 16, fontWeight: '600'},
});

export default Profile;
