import axios from 'axios';
import {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import PrifileIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { resources } from '../../resources';

const InternshipBoard = ({navigation}) => {
  const handleProfile = () => {
    navigation.navigate('MainSettings');
  };

  const [selectedInternship, setSelectedInternship] = useState(null);
  const [savedInternships, setSavedInternships] = useState(new Set());

  const [internshipData, setInternshipData] = useState([]);

  const handleSave = id => {
    setSavedInternships(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(id)) {
        newSaved.delete(id);
      } else {
        newSaved.add(id);
      }
      return newSaved;
    });
  };

  const handleApply = id => {
    console.log(`Apply to internship ${id}`);
    // Navigate to application form or external link
  };

  const handleShare = id => {
    console.log(`Share internship ${id}`);
  };

  const handleInternshipClick = internship => {
    setSelectedInternship(internship);
  };

  const handleBackToList = () => {
    setSelectedInternship(null);
  };

  const InternshipDetailScreen = ({internship}) => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        style={styles.detailScrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.detailHeader}>
          <TouchableOpacity
            style={styles.headerAction}
            onPress={handleBackToList}>
            <Text style={styles.headerActionText}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.detailContent}>
          <View style={styles.detailMeta}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{internship.type}</Text>
            </View>
            <Text style={styles.employmentType}>{internship.internshipType}</Text>
          </View>

          <Text style={styles.detailTitle}>{internship.title}</Text>
          <View style={styles.detailCompanySection}>
            <View style={styles.detailCompanyInfo}>
              <View style={styles.detailCompanyLogo}>
                <Text style={styles.detailCompanyLogoText}>🏢</Text>
              </View>
              <View style={styles.detailCompanyDetails}>
                <Text style={styles.detailCompanyName}>{internship.companyName}</Text>
                <Text style={styles.detailLocation}>{internship.location}</Text>
                <Text style={styles.detailPostedTime}>
                  Posted {internship.date}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.jobSummary}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Stipend</Text>
              <Text style={styles.summaryValue}>{internship.salary}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Duration</Text>
              <Text style={styles.summaryValue}>{internship.duration}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Type</Text>
              <Text style={styles.summaryValue}>{internship.type}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Internship Description</Text>
          <Text style={styles.detailFullContent}>{internship.jobDescription}</Text>

          {/* <Text style={styles.sectionTitle}>Required Skills</Text>
          <View style={styles.skillsSection}>
            {internship.skills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View> */}

          <View style={styles.detailStats}>
            <Text style={styles.detailApplicantCount}>
              {internship.postedBy} applicant{internship.postedBy !== 1 ? 's' : ''}
            </Text>
          </View>

          {/* Action buttons */}
          <View style={styles.detailActionButtons}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => handleApply(internship.uniqueKey)}>
              <Text style={styles.applyButtonText}>Apply Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const getInternshipData = async () => {
    try {
      const res = await axios.get(resources.APPLICATION_URL + `getDataBasedOnType?type=internship`)
      console.log("Internship resss", res)
      setInternshipData(res.data)
    } catch (error) {
      console.log("Internship call error", error)
    }
  }

  useEffect(() => {
    getInternshipData()
  }, [])

  const InternshipListScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
     
      <ScrollView
        showsVerticalScrollIndicator={false}>
        {/* <ScrollView
          horizontal
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={styles.jobTypes}>
            <Text>Showing All Internships</Text>
          </View>
          <View style={styles.jobTypes}>
            <Text>Show Summer Only</Text>
          </View>
          <View style={styles.jobTypes}>
            <Text>Show Remote</Text>
          </View>
        </ScrollView> */}
        {internshipData.length > 0 ? (
          <View>
            {internshipData.map(internship => (
          <TouchableOpacity
            key={internship.id}
            style={styles.jobCard}
            onPress={() => handleInternshipClick(internship)}
            activeOpacity={0.7}>
            <View style={styles.internshipBadge}>
              <Text style={styles.jobText}>INTERNSHIP</Text>
            </View>

            <Text style={styles.title}>{internship.title}</Text>
            <Text style={styles.company}>{internship.companyName}</Text>
            <Text style={styles.location}>{internship.location}</Text>

            <View style={styles.jobMeta}>
              <Text style={styles.salary}>{internship.salary}</Text>
              <Text style={styles.experience}>{internship.duration}</Text>
            </View>

            <Text style={styles.content} numberOfLines={3}>
              {internship.jobDescription}
            </Text>

            {/* <View style={styles.skillsPreview}>
              {internship.skills.slice(0, 3).map((skill, index) => (
                <View key={index} style={styles.skillPreviewTag}>
                  <Text style={styles.skillPreviewText}>{skill}</Text>
                </View>
              ))}
              {internship.skills.length > 3 && (
                <Text style={styles.moreSkills}>
                  +{internship.skills.length - 3} more
                </Text>
              )}
            </View> */}

            <View style={styles.jobFooter}>
              <View style={styles.jobInfo}>
                <Text style={styles.postedTime}>Posted {internship.date}</Text>
                <Text style={styles.applicantCount}>
                  {internship.postedBy} applicant{internship.postedBy !== 1 ? 's' : ''}
                </Text>
              </View>
              <View style={styles.readMoreIndicator}>
                <Text style={styles.readMoreText}>View Details →</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.applyButtonSmall}
                onPress={e => {
                  e.stopPropagation();
                  handleApply(internship.id);
                }}>
                <Text style={styles.applyButtonSmallText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
          </View>
        ) : (
          <Text style={styles.noInternshipText}>No Internships Found</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );

  return selectedInternship ? (
    <InternshipDetailScreen internship={selectedInternship} />
  ) : (
    <InternshipListScreen />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop: 10
  },
  // List Screen Styles
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  jobCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  internshipBadge: {
    alignSelf: 'flex-end',
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 16,
  },
  jobText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
    lineHeight: 26,
  },
  company: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4285f4',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  jobTypes: {
    backgroundColor: '#e1e2e3',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 22,
    marginRight: 10
  },
  jobMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  salary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#28a745',
  },
  experience: {
    fontSize: 14,
    color: '#666666',
  },
  content: {
    fontSize: 15,
    color: '#555555',
    lineHeight: 22,
    marginBottom: 16,
  },
  skillsPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 16,
  },
  skillPreviewTag: {
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  skillPreviewText: {
    fontSize: 11,
    color: '#4285f4',
    fontWeight: '500',
  },
  moreSkills: {
    fontSize: 12,
    color: '#888888',
    fontStyle: 'italic',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  jobInfo: {
    flex: 1,
  },
  postedTime: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 2,
  },
  applicantCount: {
    fontSize: 13,
    color: '#666666',
  },
  readMoreIndicator: {
    paddingVertical: 4,
  },
  readMoreText: {
    color: '#4285f4',
    fontSize: 13,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 16,
  },
  applyButtonSmall: {
    backgroundColor: '#4285f4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 12,
  },
  applyButtonSmallText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 4,
    color: '#888888',
  },
  actionText: {
    fontSize: 13,
    color: '#888888',
    fontWeight: '500',
  },

  // Detail Screen Styles
  detailHeader: {
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  headerAction: {
    padding: 8,
  },
  headerActionText: {
    fontSize: 20,
    color: '#666666',
    fontWeight: '600',
  },
  detailScrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  detailContent: {
    padding: 20,
  },
  detailMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: '#2e7d2e',
    fontSize: 12,
    fontWeight: '600',
  },
  employmentType: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '500',
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    lineHeight: 36,
    marginBottom: 20,
  },
  detailCompanySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailCompanyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailCompanyLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailCompanyLogoText: {
    fontSize: 20,
  },
  detailCompanyDetails: {
    flex: 1,
  },
  detailCompanyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4285f4',
    marginBottom: 2,
  },
  detailLocation: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  detailPostedTime: {
    fontSize: 13,
    color: '#888888',
  },
  saveButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  savedButton: {
    backgroundColor: '#4285f4',
    borderColor: '#4285f4',
  },
  saveButtonText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '600',
  },
  savedButtonText: {
    color: '#ffffff',
  },
  jobSummary: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
  },
  detailFullContent: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 26,
    marginBottom: 24,
  },
  noInternshipText: {
    textAlign: 'center',
    fontWeight: 700,
    marginTop: 20,
    color: '#64748b'
  },
  skillsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  skillTag: {
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 12,
    color: '#4285f4',
    fontWeight: '500',
  },
  detailStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailApplicantCount: {
    fontSize: 14,
    color: '#666666',
    marginRight: 20,
  },
  detailSaveCount: {
    fontSize: 14,
    color: '#666666',
  },
  detailActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  applyButton: {
    backgroundColor: '#4285f4',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    flex: 1,
    marginRight: 12,
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  detailActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    backgroundColor: '#f8f8f8',
    marginRight: 8,
  },
  savedActionButton: {
    backgroundColor: '#e8f4fd',
  },
  detailActionIcon: {
    fontSize: 16,
    marginRight: 6,
    color: '#888888',
  },
  savedIcon: {
    color: '#4285f4',
  },
  detailActionText: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '500',
  },
  savedText: {
    color: '#4285f4',
  },
});

export default InternshipBoard;