import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  TextInput,
  RefreshControl,
} from 'react-native';
import { resources } from '../../../resources';
import EventDetailScreen from './EventDetail';
import JobDetailScreen from './JobDetail';
import InternshipDetailView from './InternShipDetails';

const { width } = Dimensions.get('window');

const InternshipHome = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedNews, setSelectedNews] = useState(null);
  const [showDetailNews, setShowNews] = useState(false);
  const [newsData, setNewsData] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'internship':
        return '#8B5CF6'; // Purple for internships
      case 'event':
        return '#10B981';
      case 'post discussion':
        return '#3B82F6';
      case 'job':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'internship':
        return '🎓'; // Graduation cap for internships
      case 'event':
        return '🎉';
      case 'post discussion':
        return '💬';
      case 'job':
        return '💼';
      default:
        return '📢';
    }
  };

  // Filter data to show only internship-related posts
  const filteredData = newsData.filter(item => {
    const isInternshipRelated = 
      (item.type && item.type.toLowerCase().includes('internship')) ||
      (item.postdiscussionCategory && item.postdiscussionCategory.toLowerCase().includes('internship')) ||
      (item.title && item.title.toLowerCase().includes('internship')) ||
      (item.jobTitle && item.jobTitle.toLowerCase().includes('internship')) ||
      (item.discussion && item.discussion.toLowerCase().includes('internship'));

    const matchesSearch = !searchQuery || 
      (item.eventName && item.eventName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.type && item.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.branch && item.branch.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.companyName && item.companyName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'internship' && isInternshipRelated) ||
      item.type === selectedFilter;
    
    return isInternshipRelated && matchesSearch && matchesFilter;
  });

  const onRefresh = () => {
    setRefreshing(true);
    getNews();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  useEffect(() => {
    const getNews = async () => {
      try {
        // Modified to get internship-related discussions
        const res = await axios.get(resources.APPLICATION_URL + `getDataBasedOnType?type=${encodeURIComponent('internship')}`)
        console.log("Internship res Data", res);
        setNewsData(res.data);
      } catch (error) {
        console.log("Internship Call error", error);
      }
    }
    getNews();
  }, []);

  const handleCloseEventDetail = () => {
    setShowNews(false);
  };

  const renderInternshipCard = (item) => (
    <TouchableOpacity key={item.uniqueKey} style={styles.newsCard}
      onPress={() => {
        console.log("Clicked", item);
        setSelectedNews(item);
        setShowNews(true)
      }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={[styles.typeIcon, { backgroundColor: getTypeColor(item.type || 'internship') }]}>
            <Text style={styles.typeIconText}>{getTypeIcon(item.type || 'internship')}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.postedBy}>Posted by {item.postedBy}</Text>
            <Text style={styles.dateTime}>
              {formatDate(item.date)} • {formatTime(item.timings)}
            </Text>
          </View>
        </View>
        <View>
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type || 'internship') }]}>
            <Text style={styles.typeBadgeText}>
              {item.postdiscussionCategory?.toUpperCase() || 'INTERNSHIP'}
            </Text>
          </View>
          {item.postdiscussionCategory && (
            <View>
              <Text style={[styles.dateTime, { fontSize: 10, textAlign: 'center', marginTop: 6 }]}>
                {item.postdiscussionCategory}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.cardContent}>
        {/* Internship Title */}
        {item.title && (
          <Text style={styles.internshipTitle}>{item.title}</Text>
        )}
        
        {/* Company Name */}
        {item.companyName && (
          <View style={styles.companyContainer}>
            <Text style={styles.companyIcon}>🏢</Text>
            <Text style={styles.companyName}>{item.companyName}</Text>
          </View>
        )}

        {/* Event Name (if it's an internship event) */}
        {item.eventName && (
          <Text style={styles.eventTitle}>{item.eventName}</Text>
        )}
        
        {/* Location */}
        {item.location && (
          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
        )}

        {/* Discussion Content */}
        {item.discussion && (
          <Text style={styles.discussionText}>{item.discussion}</Text>
        )}

        {/* Academic Information */}
        {(item.degree || item.branch || item.batch) && (
          <View style={styles.academicInfo}>
            {item.degree && (
              <View style={styles.infoTag}>
                <Text style={styles.infoTagText}>{item.degree}</Text>
              </View>
            )}
            {item.branch && (
              <View style={styles.infoTag}>
                <Text style={styles.infoTagText}>{item.branch}</Text>
              </View>
            )}
            {item.batch && (
              <View style={styles.infoTag}>
                <Text style={styles.infoTagText}>Batch {item.batch}</Text>
              </View>
            )}
          </View>
        )}

        {/* Job/Internship Title */}
        {item.jobTitle && (
          <Text style={styles.jobTitle}>{item.jobTitle}</Text>
        )}

        {/* Job/Internship Description */}
        {item.jobDescription && (
          <Text style={styles.description}>{item.jobDescription}</Text>
        )}

        {/* Stipend/Salary */}
        {item.salary && (
          <View style={styles.salaryContainer}>
            <Text style={styles.salaryLabel}>Stipend:</Text>
            <Text style={styles.salaryText}>{item.salary}</Text>
          </View>
        )}

        {/* Internship Duration (if available) */}
        {item.duration && (
          <View style={styles.durationContainer}>
            <Text style={styles.durationIcon}>⏱️</Text>
            <Text style={styles.durationText}>Duration: {item.duration}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>📧 Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>
            💬 Comments ({item.alumniComments ? item.alumniComments.length : 0})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>🔗 Share</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const filters = ['all', 'internship', 'event', 'post discussion'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Internship Discussions</Text>
        <Text style={styles.headerSubtitle}>Connect with alumni about internship opportunities</Text>
      </View> */}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search internships, companies..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Filter Tabs */}
      {/* <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterTab,
              selectedFilter === filter && styles.activeFilterTab
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[
              styles.filterTabText,
              selectedFilter === filter && styles.activeFilterTabText
            ]}>
              {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView> */}

      {/* Internship Feed */}
      <ScrollView
        style={styles.feedContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredData.length > 0 ? (
          filteredData.map(renderInternshipCard)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🎓</Text>
            <Text style={styles.emptyStateTitle}>No internships found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your search criteria or check back later for new internship posts
            </Text>
          </View>
        )}
      </ScrollView>
      
      <InternshipDetailView
        visible={showDetailNews}
        onClose={handleCloseEventDetail}
        jobData={selectedNews}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterTab: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeFilterTabText: {
    color: '#FFFFFF',
  },
  feedContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  newsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  typeIconText: {
    fontSize: 16,
  },
  headerInfo: {
    flex: 1,
  },
  postedBy: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  dateTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardContent: {
    padding: 16,
  },
  internshipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  companyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  companyIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  discussionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  academicInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  infoTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  infoTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  salaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginRight: 6,
  },
  salaryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  durationText: {
    fontSize: 14,
    color: '#6B7280',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default InternshipHome;