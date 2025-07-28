import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Pressable,
} from 'react-native';
import EventDetailScreen from './EventDetail';
import axios from 'axios';
import { resources } from '../../../resources';

const { width } = Dimensions.get('window');

const EventsScreen = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetail, setShowEventDetail] = useState(false);

  const [eventData, setEventData] = useState([])

  // Function to handle event card press
  const handleEventPress = (eventData) => {
    setSelectedEvent(eventData);
    setShowEventDetail(true);
  };

  // Function to close event detail
  const handleCloseEventDetail = () => {
    setShowEventDetail(false);
    setSelectedEvent(null);
  };
  // Function to format date and time
  const formatDateTime = (date, timings) => {
    if (!date || !timings) return 'Date & Time TBA';
    return `${date} at ${timings}`;
  };

  // Function to generate image URL or use placeholder
  const getImageUrl = (filename, filetype) => {
    if (filename && filetype) {
      // You can modify this to use your actual image server URL
      return `https://via.placeholder.com/400x200/8B4513/FFFFFF?text=${encodeURIComponent(filename)}`;
    }
    return 'https://via.placeholder.com/400x200/8B4513/FFFFFF?text=Event+Image';
  };

  // Function to get initials from postedBy
  const getInitials = (name) => {
    if (!name) return 'UN';
    return name.substring(0, 2).toUpperCase();
  };

  // Function to calculate time ago
  const getTimeAgo = (date, timings) => {
    if (!date || !timings) return 'Recently posted';
    
    try {
      // Parse the date (format: DD-MM-YYYY) and time (format: HH:MM:SS)
      const [day, month, year] = date.split('-').map(Number);
      const [hours, minutes, seconds] = timings.split(':').map(Number);
      
      // Create the posted date
      const postedDate = new Date(year, month - 1, day, hours, minutes, seconds);
      
      // Get current date
      const currentDate = new Date();
      
      // Calculate difference in milliseconds
      const diffInMs = currentDate - postedDate;
      
      // If the date is in the future, return "Recently posted"
      if (diffInMs < 0) return 'Recently posted';
      
      // Convert to different time units
      const diffInSeconds = Math.floor(diffInMs / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);
      const diffInWeeks = Math.floor(diffInDays / 7);
      const diffInMonths = Math.floor(diffInDays / 30);
      const diffInYears = Math.floor(diffInDays / 365);
      
      // Return appropriate time ago string
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
      // If there's any error in parsing, return fallback
      console.warn('Error calculating time ago:', error);
      return 'Recently posted';
    }
  };

  const getEventData = async () => {
    try {
      const res = await axios.get(resources.APPLICATION_URL + `getDataBasedOnType?type=event`)
      console.log("Event Data resss", res)
      setEventData(res.data)
    } catch (error) {
      console.log("Event Dataaa error", error)
    }
  }

  useEffect(() => {
    getEventData()
  }, [])

  const renderEventCard = ({ item }) => (
    <Pressable onPress={() => handleEventPress(item)}>
      <View style={styles.cardContainer}>
        {/* Event Type Badge */}
        <View style={styles.eventTypeBadge}>
          <Text style={styles.eventTypeText}>{item.type?.toUpperCase() || 'EVENT'}</Text>
        </View>

        {/* Event Image */}
        <Image 
          source={{ uri: getImageUrl(item.filename, item.filetype) }} 
          style={styles.eventImage} 
        />

        {/* Event Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.eventTitle}>{item.eventName || 'Untitled Event'}</Text>
          
          {/* Academic Info */}
          <View style={styles.academicInfo}>
            <Text style={styles.academicText}>
              {item.degree} • {item.branch} • {item.batch}
            </Text>
          </View>

          {/* Venue and Date */}
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Venue</Text>
              <Text style={styles.infoValue}>{item.location || 'Venue TBA'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{formatDateTime(item.date, item.timings)}</Text>
            </View>
            {item.contactEmail && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Contact</Text>
                <Text style={styles.infoValue}>{item.contactEmail}</Text>
              </View>
            )}
            {item.phoneNo && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{item.phoneNo}</Text>
              </View>
            )}
          </View>

          {/* Description (if discussion is available) */}
          {item.discussion && (
            <Text style={styles.description} numberOfLines={4}>
              {item.discussion}
            </Text>
          )}

          {/* Posted By Section */}
          <View style={styles.postedByContainer}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(item.postedBy)}</Text>
              </View>
              <View>
                <Text style={styles.postedByName}>{item.postedBy || 'Unknown'}</Text>
                <Text style={styles.postedTime}>Posted {getTimeAgo(item.date, item.timings)}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewMoreButton} onPress={() => handleEventPress(item)}>
              <Text style={styles.viewMoreText}>View More →</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>♡ Like</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>💬 Comment ({item.alumniComments?.length || 0})</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>↗ Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Pressable>
  );

 return (
  <SafeAreaView style={styles.container}>
    <FlatList
      data={eventData || []}
      renderItem={renderEventCard}
      keyExtractor={(item) =>
        item?.uniqueKey?.toString() || Math.random().toString()
      }
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No events available</Text>
        </View>
      }
    />

    {/* Event Detail Modal */}
    <EventDetailScreen
      visible={showEventDetail}
      onClose={handleCloseEventDetail}
      eventData={selectedEvent}
    />
  </SafeAreaView>
);
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    paddingVertical: 10,
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  eventTypeBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  eventTypeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  eventImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  academicInfo: {
    marginBottom: 16,
  },
  academicText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    width: 70,
  },
  infoValue: {
    fontSize: 14,
    color: '#1a1a1a',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#4a4a4a',
    lineHeight: 20,
    marginBottom: 12,
  },
  postedByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  postedByName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  postedTime: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  viewMoreButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
  },
  viewMoreText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});

export default EventsScreen;