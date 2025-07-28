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

const EventDetailScreen = ({ visible, onClose, eventData }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  if (!eventData) return null;

  // Function to format date and time
  const formatDateTime = (date, timings) => {
    if (!date || !timings) return 'Date & Time TBA';
    
    try {
      const [day, month, year] = date.split('-').map(Number);
      const [hours, minutes] = timings.split(':').map(Number);
      
      const eventDate = new Date(year, month - 1, day, hours, minutes);
      
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      
      return eventDate.toLocaleDateString('en-US', options);
    } catch (error) {
      return `${date} at ${timings}`;
    }
  };

  // Function to calculate time ago
  const getTimeAgo = (date, timings) => {
    if (!date || !timings) return 'Recently posted';
    
    try {
      const [day, month, year] = date.split('-').map(Number);
      const [hours, minutes, seconds] = timings.split(':').map(Number);
      
      const postedDate = new Date(year, month - 1, day, hours, minutes, seconds);
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
      } else if (diffInSeconds > 10) {
        return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
      } else {
        return 'Just now';
      }
    } catch (error) {
      return 'Recently posted';
    }
  };

  // Function to get image URL
  const getImageUrl = (filename, filetype) => {
    if (filename && filetype) {
      return `https://via.placeholder.com/400x300/8B4513/FFFFFF?text=${encodeURIComponent(filename)}`;
    }
    return 'https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Event+Image';
  };

  // Function to get initials
  const getInitials = (name) => {
    if (!name) return 'UN';
    return name.substring(0, 2).toUpperCase();
  };

  // Handle like button
  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
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
    Alert.alert('Share Event', 'Sharing functionality would be implemented here.');
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
          <Text style={styles.headerTitle}>Event Details</Text>
          <View style={styles.headerSpace} />
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Event Image */}
          <Image 
            source={{ uri: getImageUrl(eventData.filename, eventData.filetype) }} 
            style={styles.eventImage} 
          />

          {/* Event Type Badge */}
          <View style={styles.eventTypeBadge}>
            <Text style={styles.eventTypeText}>{eventData.type?.toUpperCase() || 'EVENT'}</Text>
          </View>

          {/* Main Content */}
          <View style={styles.contentContainer}>
            {/* Event Title */}
            <Text style={styles.eventTitle}>{eventData.eventName || 'Untitled Event'}</Text>

            {/* Academic Info */}
            <View style={styles.academicInfoContainer}>
              <View style={styles.academicBadge}>
                <Text style={styles.academicText}>
                  {eventData.degree} • {eventData.branch} • {eventData.batch}
                </Text>
              </View>
            </View>

            {/* Posted By Info */}
            <View style={styles.postedBySection}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitials(eventData.postedBy)}</Text>
                </View>
                <View style={styles.posterInfo}>
                  <Text style={styles.postedByName}>{eventData.postedBy || 'Unknown'}</Text>
                  <Text style={styles.postedTime}>Posted {getTimeAgo(eventData.date, eventData.timings)}</Text>
                </View>
              </View>
            </View>

            {/* Event Details */}
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Event Details</Text>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>📅 Date & Time</Text>
                <Text style={styles.detailValue}>{formatDateTime(eventData.date, eventData.timings)}</Text>
              </View>

              {eventData.location && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>📍 Location</Text>
                  <Text style={styles.detailValue}>{eventData.location}</Text>
                </View>
              )}

              {eventData.contactEmail && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>📧 Contact Email</Text>
                  <Text style={styles.detailValue}>{eventData.contactEmail}</Text>
                </View>
              )}

              {eventData.phoneNo && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>📞 Phone</Text>
                  <Text style={styles.detailValue}>{eventData.phoneNo}</Text>
                </View>
              )}
            </View>

            {/* Description */}
            {eventData.discussion && (
              <View style={styles.descriptionSection}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.descriptionText}>{eventData.discussion}</Text>
              </View>
            )}

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
                  💬 Comments ({eventData.alumniComments?.length || 0})
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Text style={styles.actionButtonText}>↗ Share</Text>
              </TouchableOpacity>
            </View>

            {/* Comments Section */}
            {showComments && (
              <View style={styles.commentsSection}>
                <Text style={styles.sectionTitle}>Comments</Text>
                
                {/* Add Comment */}
                <View style={styles.addCommentContainer}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChangeText={setNewComment}
                    multiline
                  />
                  <TouchableOpacity style={styles.addCommentButton} onPress={handleAddComment}>
                    <Text style={styles.addCommentButtonText}>Post</Text>
                  </TouchableOpacity>
                </View>

                {/* Existing Comments */}
                {eventData.alumniComments && eventData.alumniComments.length > 0 ? (
                  eventData.alumniComments.map((comment, index) => (
                    <View key={index} style={styles.commentItem}>
                      <View style={styles.commentAvatar}>
                        <Text style={styles.commentAvatarText}>AC</Text>
                      </View>
                      <View style={styles.commentContent}>
                        <Text style={styles.commentAuthor}>Alumni Comment {index + 1}</Text>
                        <Text style={styles.commentText}>{comment}</Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
                )}
              </View>
            )}

            {/* Additional Info */}
            {/* <View style={styles.additionalInfoSection}>
              <Text style={styles.sectionTitle}>Additional Information</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Event ID</Text>
                  <Text style={styles.infoValue}>{eventData.uniqueKey}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Status</Text>
                  <Text style={styles.infoValue}>{eventData.verifyStatus || 'Active'}</Text>
                </View>
              </View>
            </View> */}
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
  eventImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  eventTypeBadge: {
    position: 'absolute',
    top: 270,
    right: 20,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  eventTypeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 20,
  },
  eventTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
    lineHeight: 34,
  },
  academicInfoContainer: {
    marginBottom: 20,
  },
  academicBadge: {
    alignSelf: 'flex-start',
  },
  academicText: {
    fontSize: 14,
    color: '#8B5CF6',
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
    backgroundColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
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
    backgroundColor: '#8B5CF6',
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
    backgroundColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  commentAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
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
  additionalInfoSection: {
    marginBottom: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
});

export default EventDetailScreen;