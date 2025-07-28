import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Modal,
  TextInput,
  Alert,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const JobDetailScreen = ({ visible, onClose, jobData }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [applied, setApplied] = useState(false);

    console.log("Jobb Dataa", jobData)

  if (!jobData) return null;

  // Function to format date
  const formatDate = (date) => {
    if (!date) return 'Date not specified';
    
    try {
      const [day, month, year] = date.split('-').map(Number);
      const jobDate = new Date(year, month - 1, day);
      
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      
      return jobDate.toLocaleDateString('en-US', options);
    } catch (error) {
      return date;
    }
  };

  // Function to calculate time ago
  const getTimeAgo = (date) => {
    if (!date) return 'Recently posted';
    
    try {
      const [day, month, year] = date.split('-').map(Number);
      const postedDate = new Date(year, month - 1, day);
      const currentDate = new Date();
      const diffInMs = currentDate - postedDate;
      
      if (diffInMs < 0) return 'Recently posted';
      
      const diffInSeconds = Math.floor(diffInMs / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);
      const diffInWeeks = Math.floor(diffInDays / 7);
      const diffInMonths = Math.floor(diffInDays / 30);
      const diffInYears = Math.floor(diffInDays / 365);
      
      if (diffInYears > 0) {
        return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
      } else if (diffInMonths > 0) {
        return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
      } else if (diffInWeeks > 0) {
        return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
      } else if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      } else if (diffInHours > 0) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      } else if (diffInMinutes > 0) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
      } else {
        return 'Just now';
      }
    } catch (error) {
      return 'Recently posted';
    }
  };

  // Function to get company logo/image URL
  const getCompanyImageUrl = (filename, companyName) => {
    if (filename) {
      return `https://via.placeholder.com/400x300/2563EB/FFFFFF?text=${encodeURIComponent(companyName || 'Company')}`;
    }
    return `https://via.placeholder.com/400x300/2563EB/FFFFFF?text=${encodeURIComponent(companyName || 'Job+Opportunity')}`;
  };

  // Function to get company initials
  const getCompanyInitials = (companyName) => {
    if (!companyName) return 'CO';
    const words = companyName.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return companyName.substring(0, 2).toUpperCase();
  };

  // Handle like button
  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  // Handle apply button
  const handleApply = () => {
    setApplied(!applied);
    Alert.alert(
      applied ? 'Application Withdrawn' : 'Application Submitted', 
      applied ? 'Your application has been withdrawn.' : 'Your application has been submitted successfully!'
    );
  };

  // Handle add comment
  const handleAddComment = () => {
    if (newComment.trim()) {
      Alert.alert('Comment Added', 'Your comment has been posted!');
      setNewComment('');
      setShowComments(true);
    }
  };

  // Handle share
  const handleShare = () => {
    Alert.alert('Share Job', 'Sharing functionality would be implemented here.');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Details</Text>
          <View style={styles.headerSpace} />
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Company Image */}
          <Image 
            source={{ uri: getCompanyImageUrl(jobData.filename, jobData.companyName) }} 
            style={styles.companyImage} 
          />

          {/* Job Type Badge */}
          <View style={styles.jobTypeBadge}>
            <Text style={styles.jobTypeText}>JOB OPPORTUNITY</Text>
          </View>

          {/* Main Content */}
          <View style={styles.contentContainer}>
            {/* Job Title */}
            <Text style={styles.jobTitle}>{jobData.jobTitle || 'Untitled Position'}</Text>

            {/* Company Info */}
            <View style={styles.companyInfoContainer}>
              <View style={styles.companyBadge}>
                <Text style={styles.companyText}>
                  {jobData.companyName || 'Company Name'}
                </Text>
              </View>
            </View>

            {/* Posted By Info */}
            <View style={styles.postedBySection}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getCompanyInitials(jobData.companyName)}</Text>
                </View>
                <View style={styles.posterInfo}>
                  <Text style={styles.postedByName}>{jobData.companyName || 'Unknown Company'}</Text>
                  <Text style={styles.postedTime}>Posted {getTimeAgo(jobData.date)}</Text>
                </View>
              </View>
            </View>

            {/* Job Details */}
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Job Details</Text>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>📅 Posted Date</Text>
                <Text style={styles.detailValue}>{formatDate(jobData.date)}</Text>
              </View>

              {jobData.contactEmail && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>📧 Contact Email</Text>
                  <Text style={styles.detailValue}>{jobData.contactEmail}</Text>
                </View>
              )}

              {jobData.degree && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>🎓 Required Degree</Text>
                  <Text style={styles.detailValue}>{jobData.degree}</Text>
                </View>
              )}

              {jobData.branch && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>🏢 Department/Branch</Text>
                  <Text style={styles.detailValue}>{jobData.branch}</Text>
                </View>
              )}

              {jobData.batch && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>📆 Preferred Batch</Text>
                  <Text style={styles.detailValue}>{jobData.batch}</Text>
                </View>
              )}
            </View>

            {/* Job Description */}
            {jobData.jobDescription && (
              <View style={styles.descriptionSection}>
                <Text style={styles.sectionTitle}>Job Description</Text>
                <Text style={styles.descriptionText}>{jobData.jobDescription}</Text>
              </View>
            )}

            {/* Additional Discussion */}
            {jobData.discussion && (
              <View style={styles.descriptionSection}>
                <Text style={styles.sectionTitle}>Additional Information</Text>
                <Text style={styles.descriptionText}>{jobData.discussion}</Text>
              </View>
            )}

            {/* Apply Button */}
            <View style={styles.applyButtonContainer}>
              <TouchableOpacity 
                style={[styles.applyButton, applied && styles.appliedButton]} 
                onPress={handleApply}
              >
                <Text style={[styles.applyButtonText, applied && styles.appliedButtonText]}>
                  {applied ? '✓ Applied' : 'Apply Now'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, liked && styles.likedButton]} 
                onPress={handleLike}
              >
                <Text style={[styles.actionButtonText, liked && styles.likedButtonText]}>
                  {liked ? '❤️' : '♡'} Like {likeCount > 0 && `(${likeCount})`}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => setShowComments(!showComments)}
              >
                <Text style={styles.actionButtonText}>
                  💬 Comments ({jobData.alumniComments?.length || 0})
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Text style={styles.actionButtonText}>↗ Share</Text>
              </TouchableOpacity>
            </View>

            {/* Comments Section */}
            {showComments && (
              <View style={styles.commentsSection}>
                <Text style={styles.sectionTitle}>Comments & Reviews</Text>
                
                {/* Add Comment */}
                <View style={styles.addCommentContainer}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Add a comment or review..."
                    value={newComment}
                    onChangeText={setNewComment}
                    multiline
                  />
                  <TouchableOpacity style={styles.addCommentButton} onPress={handleAddComment}>
                    <Text style={styles.addCommentButtonText}>Post</Text>
                  </TouchableOpacity>
                </View>

                {/* Existing Comments */}
                {jobData.alumniComments && jobData.alumniComments.length > 0 ? (
                  jobData.alumniComments.map((comment, index) => (
                    <View key={index} style={styles.commentItem}>
                      <View style={styles.commentAvatar}>
                        <Text style={styles.commentAvatarText}>AL</Text>
                      </View>
                      <View style={styles.commentContent}>
                        <Text style={styles.commentAuthor}>Alumni Review {index + 1}</Text>
                        <Text style={styles.commentText}>{comment}</Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noCommentsText}>No comments yet. Be the first to share your thoughts!</Text>
                )}
              </View>
            )}

            {/* File Information */}
            {/* {jobData.filename && (
              <View style={styles.fileInfoSection}>
                <Text style={styles.sectionTitle}>Attached Documents</Text>
                <View style={styles.fileItem}>
                  <Text style={styles.fileIcon}>📄</Text>
                  <View style={styles.fileDetails}>
                    <Text style={styles.fileName}>{jobData.filename}</Text>
                    <Text style={styles.fileType}>{jobData.filetype?.toUpperCase() || 'Document'}</Text>
                  </View>
                </View>
              </View>
            )} */}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  closeButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  headerSpace: {
    width: 30,
  },
  scrollContainer: {
    flex: 1,
  },
  companyImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  jobTypeBadge: {
    position: 'absolute',
    top: 270,
    right: 20,
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  jobTypeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 20,
    marginTop: 40
  },
  jobTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
    lineHeight: 34,
  },
  companyInfoContainer: {
    marginBottom: 20,
  },
  companyBadge: {
    alignSelf: 'flex-start',
  },
  companyText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postedBySection: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  posterInfo: {
    flex: 1,
  },
  postedByName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  postedTime: {
    fontSize: 14,
    color: '#666666',
  },
  detailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    color: '#4a4a4a',
    lineHeight: 22,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 16,
    color: '#4a4a4a',
    lineHeight: 24,
  },
  applyButtonContainer: {
    marginBottom: 24,
  },
  applyButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appliedButton: {
    backgroundColor: '#6b7280',
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  appliedButtonText: {
    color: '#ffffff',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 24,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
  },
  likedButton: {
    backgroundColor: '#fee2e2',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  likedButtonText: {
    color: '#dc2626',
  },
  commentsSection: {
    marginBottom: 24,
  },
  addCommentContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    maxHeight: 100,
    marginRight: 10,
  },
  addCommentButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  addCommentButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  commentAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#4a4a4a',
    lineHeight: 20,
  },
  noCommentsText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  fileInfoSection: {
    marginBottom: 24,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  fileIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  fileType: {
    fontSize: 14,
    color: '#666666',
  },
});

export default JobDetailScreen;