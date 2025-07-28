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

const { width } = Dimensions.get('window');

const NewsComponent = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedNews, setSelectedNews] = useState(null)
  const [showDetailNews, setShowNews] = useState(false)

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

  const filteredData = newsData.filter(item => {
    const matchesSearch = !searchQuery || 
      (item.eventName && item.eventName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.type && item.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.branch && item.branch.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  useEffect(() => {
    const getNews = async () => {
        try {
            const res = await axios.get(resources.APPLICATION_URL + `getDataBasedOnType?type=${encodeURIComponent('news')}`)
            console.log("Newsss Dataa", res)
            setNewsData(res.data)
        } catch (error) {
            console.log("Newss Call error", error)
        }
    }
    getNews()

  }, [])

  const handleCloseEventDetail = () => {
    setShowNews(false)
  }

  const renderNewsCard = (item) => (
    <TouchableOpacity key={item.uniqueKey} style={styles.newsCard}
    onPress={() => {
      console.log("Clickkeddd", item)
      setSelectedNews(item)
      setShowNews(true)
    }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={[styles.typeIcon, { backgroundColor: getTypeColor(item.type) }]}>
            <Text style={styles.typeIconText}>{getTypeIcon(item.type)}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.postedBy}>Posted by {item.postedBy}</Text>
            <Text style={styles.dateTime}>
              {formatDate(item.date)} • {formatTime(item.timings)}
            </Text>
          </View>
        </View>
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) }]}>
          <Text style={styles.typeBadgeText}>{item.type.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        {item.eventName && (
          <Text style={styles.eventTitle}>{item.eventName}</Text>
        )}
        {item.companyName && (
          <View>
            <Text>{item.companyName}</Text>
          </View>
        )}
        
        {item.location && (
          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
        )}

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
                <Text style={styles.infoTagText}>{item.batch}</Text>
              </View>
            )}
          </View>
        )}

        {item.jobTitle && (
          <Text style={styles.jobTitle}>{item.jobTitle}</Text>
        )}

        {item.jobDescription && (
          <Text style={styles.description}>{item.jobDescription}</Text>
        )}

        {item.salary && (
          <View style={styles.salaryContainer}>
            <Text style={styles.salaryLabel}>Salary:</Text>
            <Text style={styles.salaryText}>{item.salary}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>📧 Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>💬 Comments ({item.alumniComments ? item.alumniComments.length : 0})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>🔗 Share</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const filters = ['all', 'event', 'post discussion', 'job'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>News Feed</Text>
        <Text style={styles.headerSubtitle}>Stay updated with latest events and discussions</Text>
      </View> */}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search events, discussions..."
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

      {/* News Feed */}
      <ScrollView
        style={styles.feedContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredData.length > 0 ? (
          filteredData.map(renderNewsCard)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📰</Text>
            <Text style={styles.emptyStateTitle}>No posts found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your search or filter criteria
            </Text>
          </View>
        )}
      </ScrollView>
         <JobDetailScreen
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
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
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
    color: '#10B981',
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

export default NewsComponent;