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
  RefreshControl
} from 'react-native';
import PrifileIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import InternshipBoard from './Intership';
import axios from 'axios';
import { resources } from '../../resources';

const JobBoard = ({navigation}) => {
  const handleProfile = () => {
    navigation.navigate('MainSettings');
  };

  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [activeTab, setActiveTab] = useState('jobs')
  const [refreshing, setRefreshing] = useState(false)

  const [jobData, setJobData] = useState([]);


  const handleSave = id => {
    setSavedJobs(prev => {
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
    console.log(`Apply to job ${id}`);
    // Navigate to application form or external link
  };

  const handleShare = id => {
    console.log(`Share job ${id}`);
  };

  const handleJobClick = job => {
    setSelectedJob(job);
  };

  const handleBackToList = () => {
    setSelectedJob(null);
  };

  const getJobsData = async () => {
    try {
      const res = await axios.get(resources.APPLICATION_URL + `getDataBasedOnType?type=job`)
      console.log("Jobb Res Dataa", res)
      setJobData(res.data)
    } catch (error) {
      console.log("Jobb call error", error)
    }
  }

    const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)

    getJobsData() 
  }

  useEffect(() => {
    getJobsData()
  }, [])


  const JobDetailScreen = ({job}) => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
       {/* <View style={styles.topHeader}>
              <Text style={styles.networkText}>Networks</Text>
              <TouchableHighlight
                onPress={handleProfile}
                underlayColor="lightgray"
                style={styles.ProfileIcon}>
                <MaterialCommunityIcons
                  name="account-circle-outline"
                  size={35}
                  color="#007BFF"
                />
                <PrifileIcon name="user-circle" size={35} color="#007BFF" />
              </TouchableHighlight>
            </View> */}
      <ScrollView
        style={styles.detailScrollView}
        showsVerticalScrollIndicator={false}
        >
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
              <Text style={styles.categoryText}>{job.type}</Text>
            </View>
            <Text style={styles.employmentType}>{job.employmentType}</Text>
          </View>

          <Text style={styles.detailTitle}>{job.jobTitle}</Text>
          <View style={styles.detailCompanySection}>
            <View style={styles.detailCompanyInfo}>
              <View style={styles.detailCompanyLogo}>
                <Text style={styles.detailCompanyLogoText}>🏢</Text>
              </View>
              <View style={styles.detailCompanyDetails}>
                <Text style={styles.detailCompanyName}>{job.companyName}</Text>
                <Text style={styles.detailLocation}>{job.location}</Text>
                <Text style={styles.detailPostedTime}>
                  Posted {job.date}
                </Text>
              </View>
            </View>
            {/* <TouchableOpacity
              style={[
                styles.saveButton,
                savedJobs.has(job.id) && styles.savedButton,
              ]}
              onPress={() => handleSave(job.id)}>
              <Text
                style={[
                  styles.saveButtonText,
                  savedJobs.has(job.id) && styles.savedButtonText,
                ]}>
                {savedJobs.has(job.id) ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity> */}
          </View>

          <View style={styles.jobSummary}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Salary</Text>
              <Text style={styles.summaryValue}>{job.salary}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Experience</Text>
              <Text style={styles.summaryValue}>{job.minExperience}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Type</Text>
              <Text style={styles.summaryValue}>{job.type}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.detailFullContent}>{job.jobDescription}</Text>

          {/* <Text style={styles.sectionTitle}>Required Skills</Text>
          <View style={styles.skillsSection}>
            {job.skills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View> */}

          <View style={styles.detailStats}>
            <Text style={styles.detailApplicantCount}>
              {job.postedBy} applicant{job.applicants !== 1 ? 's' : ''}
            </Text>
          </View>

          {/* Action buttons */}
          <View style={styles.detailActionButtons}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => handleApply(job.id)}>
              <Text style={styles.applyButtonText}>Apply Now</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={[
                styles.detailActionButton,
                savedJobs.has(job.id) && styles.savedActionButton,
              ]}
              onPress={() => handleSave(job.id)}>
              <Text
                style={[
                  styles.detailActionIcon,
                  savedJobs.has(job.id) && styles.savedIcon,
                ]}>
                {savedJobs.has(job.id) ? '💾' : '🔖'}
              </Text>
              <Text
                style={[
                  styles.detailActionText,
                  savedJobs.has(job.id) && styles.savedText,
                ]}>
                {savedJobs.has(job.id) ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.detailActionButton}
              onPress={() => handleShare(job.id)}>
              <Text style={styles.detailActionIcon}>📤</Text>
              <Text style={styles.detailActionText}>Share</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const JobListScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
     
      <ScrollView
          refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }
        showsVerticalScrollIndicator={false}>
             <ScrollView
        horizontal
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <TouchableOpacity style={styles.jobTypes} onPress={() => setActiveTab('jobs')}>
          <Text>Showing All Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.jobTypes} onPress={() => setActiveTab('internships')}>
          <Text>Show Internships</Text>
        </TouchableOpacity>
      </ScrollView>
       {
        activeTab === 'jobs' && (
            <View style={{marginTop: 10}}>
                 {
                  jobData.length > 0 ? (
                    <View>
                      {jobData.map(job => (
          <TouchableOpacity
            key={job.id}
            style={styles.jobCard}
            onPress={() => handleJobClick(job)}
            activeOpacity={0.7}>
            <View style={styles.jobBadge}>
              <Text style={styles.jobText}>JOB</Text>
            </View>

            <Text style={styles.title}>{job.jobTitle}</Text>
            <Text style={styles.company}>{job.companyName}</Text>
            <Text style={styles.location}>{job.location}</Text>

            <View style={styles.jobMeta}>
              <Text style={styles.salary}>{job.salary}</Text>
              <Text style={styles.experience}>Min Experience {job.minExperience}</Text>
            </View>

            <Text style={styles.content} numberOfLines={3}>
              {job.jobDescription}
            </Text>

            <View style={styles.skillsPreview}>
              {/* {job.skills.slice(0, 3).map((skill, index) => (
                <View key={index} style={styles.skillPreviewTag}>
                  <Text style={styles.skillPreviewText}>{skill}</Text>
                </View>
              ))} */}
              {/* {job.skills.length > 3 && (
                <Text style={styles.moreSkills}>
                  +{job.skills.length - 3} more
                </Text>
              )} */}
            </View>

            <View style={styles.jobFooter}>
              <View style={styles.jobInfo}>
                <Text style={styles.postedTime}>Posted {job.date}</Text>
                <Text style={styles.applicantCount}>
                  {job.postedBy} applicant{job.applicants !== 1 ? 's' : ''}
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
                  handleApply(job.uniqueKey);
                }}>
                <Text style={styles.applyButtonSmallText}>Apply</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={styles.actionButton}
                onPress={e => {
                  e.stopPropagation();
                  handleSave(job.id);
                }}>
                <Text
                  style={[
                    styles.actionIcon,
                    savedJobs.has(job.id) && {color: '#4285f4'},
                  ]}>
                  {savedJobs.has(job.id) ? '💾' : '🔖'}
                </Text>
                <Text style={styles.actionText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={e => {
                  e.stopPropagation();
                  handleShare(job.id);
                }}>
                <Text style={styles.actionIcon}>📤</Text>
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity> */}
            </View>
          </TouchableOpacity>
        ))}
                    </View>
                  ) : (
                    <Text style={styles.noJobsAvailable}>No Jobs Available</Text>
                  )
                 }
            </View>
        )
       }
       {
        activeTab === 'internships' && (
            <View>
                <InternshipBoard/>
            </View>
        )
       }
      </ScrollView>
    </SafeAreaView>
  );

  return selectedJob ? (
    <JobDetailScreen job={selectedJob} />
  ) : (
    <JobListScreen />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
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
  jobBadge: {
    alignSelf: 'flex-end',
    backgroundColor: '#4285f4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 16,
  },
  noJobsAvailable: {
    textAlign: 'center',
    fontWeight: 700,
    marginTop: 10,
    color: '#64748b'
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
   topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  networkText: {
    fontSize: 26,
    fontWeight: 700,
  },
});

export default JobBoard;
