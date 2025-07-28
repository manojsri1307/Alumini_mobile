import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Linking,
} from 'react-native';

const { width } = Dimensions.get('window');

const CommonProfile = ({ route }) => {
  const [activeTab, setActiveTab] = useState('personal');
  
  console.log("Near me Routeeee", route)
  const profile = route?.params?.people

  const formatDuration = (startMonth, startYear, endMonth, endYear) => {
    return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
  };

  const calculateDuration = (startMonth, startYear, endMonth, endYear) => {
    const start = new Date(`${startMonth} 1, ${startYear}`);
    const end = new Date(`${endMonth} 1, ${endYear}`);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.ceil(diffDays / 30);
    
    if (diffMonths < 12) {
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffMonths / 12);
      const remainingMonths = diffMonths % 12;
      return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
    }
  };

  const renderPersonalInfo = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <View style={styles.infoGrid}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Full Name</Text>
          <Text style={styles.infoValue}>{profile.firstName} {profile.lastName}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Professional Headline</Text>
          <Text style={styles.infoValue}>{profile.professionalHeadline}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Current City</Text>
          <Text style={styles.infoValue}>{profile.currentCity}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Work Status</Text>
          <Text style={styles.infoValue}>
            {profile.working === 'Yes' ? 'Currently Working' : 'Not Working'}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderExperience = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Work Experience</Text>
      {profile.alumniMobileRegistrationChild?.map((exp, index) => (
        <View key={exp.uniqueKey1} style={styles.experienceCard}>
          <View style={styles.experienceHeader}>
            <View style={styles.experienceInfo}>
              <Text style={styles.designationText}>{exp.designation}</Text>
              {exp.institutionName ? (
                <Text style={styles.institutionText}>{exp.institutionName}</Text>
              ) : null}
              <Text style={styles.durationText}>
                {formatDuration(exp.startMonth, exp.startYear, exp.endMonth, exp.endYear)}
              </Text>
              <Text style={styles.calculatedDuration}>
                ({calculateDuration(exp.startMonth, exp.startYear, exp.endMonth, exp.endYear)})
              </Text>
              {exp.degree ? (
                <Text style={styles.degreeText}>🎓 {exp.degree}</Text>
              ) : null}
            </View>
            <View style={styles.timelineDot} />
          </View>
        </View>
      ))}
    </View>
  );

  const renderContact = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Contact Information</Text>
      <View style={styles.contactGrid}>
        <View style={[styles.contactCard, styles.emailCard]}>
          <Text style={styles.contactIcon}>📧</Text>
          <Text style={styles.contactLabel}>Email</Text>
          <Text style={styles.contactValue}>{profile.email}</Text>
        </View>
        <View style={[styles.contactCard, styles.phoneCard]}>
          <Text style={styles.contactIcon}>📱</Text>
          <Text style={styles.contactLabel}>Phone</Text>
          <Text style={styles.contactValue}>{profile.countryCode} {profile.mobileNumber}</Text>
        </View>
      </View>
      <View style={styles.socialSection}>
        <Text style={styles.socialTitle}>Social Media</Text>
        <View style={styles.socialPlaceholder}>
          <Text style={styles.socialPlaceholderText}>{profile.faceBook}</Text>
        </View>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalInfo();
      case 'experience':
        return renderExperience();
      case 'contact':
        return renderContact();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerGradient}>
            <View style={styles.statusBadge}>
              {/* <Text style={[
                styles.statusText,
                profile.working === 'Yes' ? styles.workingStatus : styles.notWorkingStatus
              ]}>
                {profile.working === 'Yes' ? 'Currently Working' : 'Not Working'}
              </Text> */}
              <Text style={styles.workingStatus}>PROFILE</Text>
            </View>
          </View>
          
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </Text>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.nameText}>
                {profile.firstName} {profile.lastName}
              </Text>
              <Text style={styles.headlineText}>{profile.professionalHeadline}</Text>
              
              <View style={styles.profileDetails}>
                <Text style={styles.detailText}>🏢 {profile.companyName}</Text>
                <Text style={styles.detailText}>💼 {profile.jobTitle}</Text>
                <Text style={styles.detailText}>📍 {profile.currentCity}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          {[
            { id: 'personal', label: 'Personal', icon: '👤' },
            { id: 'experience', label: 'Experience', icon: '💼' },
            { id: 'contact', label: 'Contact', icon: '📧' }
          ]?.map(({ id, label, icon }) => (
            <TouchableOpacity
              key={id}
              style={[
                styles.tabButton,
                activeTab === id && styles.activeTabButton
              ]}
              onPress={() => setActiveTab(id)}
            >
              <Text style={styles.tabIcon}>{icon}</Text>
              <Text style={[
                styles.tabLabel,
                activeTab === id && styles.activeTabLabel
              ]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.contentCard}>
          {renderTabContent()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 16,
  },
  headerGradient: {
    height: 120,
    backgroundColor: '#4F46E5',
    paddingTop: 16,
    paddingHorizontal: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  statusBadge: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  workingStatus: {
    color: '#10B981',
  },
  notWorkingStatus: {
    color: '#6B7280',
  },
  profileSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    marginTop: -40,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  profileInfo: {
    alignItems: 'flex-start',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headlineText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  profileDetails: {
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  activeTabButton: {
    backgroundColor: '#4F46E5',
  },
  tabIcon: {
    fontSize: 16,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabLabel: {
    color: '#FFFFFF',
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 20,
  },
  tabContent: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoGrid: {
    gap: 12,
  },
  infoCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  experienceCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  experienceInfo: {
    flex: 1,
    gap: 4,
  },
  designationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  institutionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  durationText: {
    fontSize: 12,
    color: '#6B7280',
  },
  calculatedDuration: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '600',
  },
  degreeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4F46E5',
    marginLeft: 16,
    marginTop: 4,
  },
  contactGrid: {
    gap: 12,
  },
  contactCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  emailCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE',
  },
  phoneCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7',
  },
  contactIcon: {
    fontSize: 20,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  socialSection: {
    marginTop: 16,
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  socialPlaceholder: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  socialPlaceholderText: {
    color: '#007BFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default CommonProfile;