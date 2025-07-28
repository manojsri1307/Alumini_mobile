import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { resources } from '../../../resources';

const NewsScreen = ({refreshing}) => {
  const [selectedNews, setSelectedNews] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());

  const [newsData, setNewsData] = useState([]);

  const handleLike = id => {
    setLikedPosts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(id)) {
        newLiked.delete(id);
      } else {
        newLiked.add(id);
      }
      return newLiked;
    });
  };

  const handleComment = id => {
    console.log(`Comment on post ${id}`);
  };

  const handleShare = id => {
    console.log(`Share post ${id}`);
  };

  const handleNewsClick = news => {
    console.log("clickkeddd")
    setSelectedNews(news);
  };

  const handleBackToList = () => {
    setSelectedNews(null);
  };



  const NewsDetailScreen = ({news}) => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView
        style={styles.detailScrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.detailHeader}>
          <TouchableOpacity
            style={styles.headerAction}
            onPress={handleBackToList}>
            <Text style={styles.headerActionText}>X</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.detailContent}>
          <View style={styles.detailMeta}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{news.type}</Text>
            </View>
            {
              news?.type === 'event' && (
                <Text style={styles.readTime}>{news.eventName}</Text>
              )
            }
             {
              news?.type === 'post discussion' && (
                <Text style={styles.readTime}>{news?.title || "Posted You"}</Text>
              )
            }
            {
              (news?.type === 'job' || news?.type === 'internship') && (
                <Text style={styles.readTime}>{news?.companyName}</Text>
              )
            }
          </View>

          {/* Title */}
            {
              news?.type === 'event' && (
                <Text style={styles.detailTitle}>{news.eventName}</Text>
              )
            }
             {
              news?.type === 'post discussion' && (
                <Text style={styles.detailTitle}>{news?.title || "Posted You"}</Text>
              )
            }
            {
              (news?.type === 'job' || news?.type === 'internship') && (
                <Text style={styles.detailTitle}>{news?.companyName}</Text>
              )
            }

          {/* Author info */}
          <View style={styles.detailAuthorSection}>
            <View style={styles.detailAuthorInfo}>
              <View style={styles.detailAvatar}>
                <Text style={styles.detailAvatarText}>📚</Text>
              </View>
              <View style={styles.detailAuthorDetails}>
                <Text style={styles.detailAuthorName}>{news.postedBy}</Text>
                <Text style={styles.detailTimeAgo}>
                  Published - {news.date}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>

          {/* Full content */}
          {
            news?.type === 'event' && (
              <Text style={styles.detailFullContent}>{news?.discussion}</Text>
            )
          }
          {
             news?.type === 'post discussion' && (
              <Text style={styles.detailFullContent}>{news?.discussion}</Text>
            )
          }
          {
             (news?.type === 'job' || news?.type === 'internship') && (
              <Text style={styles.detailFullContent}>{news?.jobDescription}</Text>
            )
          }

          {/* Tags */}
          <View style={styles.tagsSection}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>#Literature</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>#Stories</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>#Reading</Text>
            </View>
          </View>

          {/* Engagement stats */}
          <View style={styles.detailEngagement}>
            <Text style={styles.detailLikeCount}>
              {news.likes + (likedPosts.has(news.id) ? 1 : 0)} Like
              {news.likes + (likedPosts.has(news.id) ? 1 : 0) !== 1 ? 's' : ''}
            </Text>
            <Text style={styles.detailCommentCount}>12 Comments</Text>
          </View>

          {/* Action buttons */}
          <View style={styles.detailActionButtons}>
            <TouchableOpacity
              style={[
                styles.detailActionButton,
                likedPosts.has(news.id) && styles.likedButton,
              ]}
              onPress={() => handleLike(news.id)}>
              <Text
                style={[
                  styles.detailActionIcon,
                  likedPosts.has(news.id) && styles.likedIcon,
                ]}>
                {likedPosts.has(news.id) ? '♥' : '♡'}
              </Text>
              <Text
                style={[
                  styles.detailActionText,
                  likedPosts.has(news.id) && styles.likedText,
                ]}>
                {likedPosts.has(news.id) ? 'Liked' : 'Like'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.detailActionButton}
              onPress={() => handleComment(news.id)}>
              <Text style={styles.detailActionIcon}>💬</Text>
              <Text style={styles.detailActionText}>Comment</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.detailActionButton}
              onPress={() => handleShare(news.id)}>
              <Text style={styles.detailActionIcon}>↗</Text>
              <Text style={styles.detailActionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const getPostedData = async () => {
    try {
      const res = await axios.get(resources.APPLICATION_URL + `getDataBasedOnType?type=${''}`)
      console.log("All posted Data", res)
      setNewsData(res.data)
    } catch (error) {
      console.log("All posted Data", error)
    }
  }

  useEffect(() => {
    getPostedData()
  }, [refreshing])

  const NewsListScreen = () => (
    <SafeAreaView style={styles.container}>
      {console.log("Newss Clickedd")}
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {
          newsData?.length > 0 ? (
            <View>
              {newsData.map((news, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.newsCard}
            onPress={() => handleNewsClick(news)}
            activeOpacity={0.7}
            >
            
            <View style={styles.newsBadge}>
              <Text style={styles.newsText}>{news?.type?.toUpperCase()}</Text>
            </View>
            {
              news?.type === 'event' && (
                <Text style={styles.title}>{news?.eventName}</Text>
              )
            }
            {
              news?.type === 'post discussion' && (
                <Text style={styles.title}>{news?.title || "Posted You"}</Text>
              )
            }
            {
              (news?.type === 'job' || news?.type === 'internship') && (
                <Text style={styles.title}>{news?.companyName}</Text>
              )
            }
            {
              news?.type === 'event' && (
                <Text style={styles.content} numberOfLines={4}>
              {news?.discussion}
            </Text>
              )
            }
            {
              (news?.type === 'job' || news?.type === 'internship')  && (
                <Text style={styles.content} numberOfLines={4}>
              {news?.jobDescription} - <Text style={{color: '#10B981', fontWeight: 700}}>{news?.salary}</Text>
            </Text>
              )
            }{
              news?.type === 'post discussion' && (
                <Text style={styles.content} numberOfLines={4}>
              {news?.discussion}
            </Text>
              )
            }
            
            <View style={styles.authorSection}>
              <View style={styles.authorInfo}>
                <View style={styles.avatar}>
                  <View style={styles.avatarIcon}>
                    <Text style={styles.avatarText}>📚</Text>
                  </View>
                </View>
                <View style={styles.authorDetails}>
                  <Text style={styles.authorName}>{news?.postedBy}</Text>
                  <Text style={styles.timeAgo}>Posted - {news?.date}</Text>
                </View>
              </View>
              <View style={styles.readMoreIndicator}>
                <Text style={styles.readMoreText}>Tap to read →</Text>
              </View>
            </View>
            <Text style={styles.likeCount}>
              {news.likes + (likedPosts.has(news.id) ? 1 : 0)} Like
              {news.likes + (likedPosts.has(news.id) ? 1 : 0) !== 1 ? 's' : ''}
            </Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={e => {
                  e.stopPropagation();
                  handleLike(news?.id);
                }}>
                <Text
                  style={[
                    styles.actionIcon,
                    likedPosts.has(news?.id) && {color: '#ff5a5f'},
                  ]}>
                  {likedPosts.has(news?.id) ? '♥' : '♡'}
                </Text>
                <Text style={styles.actionText}>Like</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={e => {
                  e.stopPropagation();
                  handleComment(news?.id);
                }}>
                <Text style={styles.actionIcon}>💬</Text>
                <Text style={styles.actionText}>Comment</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={e => {
                  e.stopPropagation();
                  handleShare(news?.id);
                }}>
                <Text style={styles.actionIcon}>↗</Text>
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
            </View>
          ) : (
            <Text style={styles.noPostAvalText}>No Posts Available</Text>
          )
        }
      </ScrollView>
    </SafeAreaView>
  );

  return selectedNews ? (
    <NewsDetailScreen news={selectedNews} />
  ) : (
    <NewsListScreen />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // List Screen Styles
  listHeader: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  listHeaderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  newsCard: {
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
  newsBadge: {
    alignSelf: 'flex-end',
    backgroundColor: '#ff5a5f',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 16,
  },
  newsText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
    lineHeight: 26,
  },
  content: {
    fontSize: 15,
    color: '#555555',
    lineHeight: 22,
    marginBottom: 16,
  },
  authorSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    marginRight: 12,
  },
  avatarIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  timeAgo: {
    fontSize: 13,
    color: '#888888',
  },
  readMoreIndicator: {
    paddingVertical: 4,
  },
  readMoreText: {
    color: '#4285f4',
    fontSize: 13,
    fontWeight: '500',
  },
  likeCount: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 6,
    color: '#888888',
  },
  actionText: {
    fontSize: 13,
    color: '#888888',
    fontWeight: '500',
  },

  detailHeader: {
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerAction: {
    padding: 1,
    paddingHorizontal: 20,
    marginTop: 10
  },
  headerActionText: {
    fontSize: 20,
    color: 'red',
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
  readTime: {
    fontSize: 14,
    color: '#888888',
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    lineHeight: 36,
    marginBottom: 20,
  },
  detailAuthorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailAuthorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailAvatarText: {
    fontSize: 20,
  },
  detailAuthorDetails: {
    flex: 1,
  },
  detailAuthorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  detailTimeAgo: {
    fontSize: 14,
    color: '#888888',
  },
  followButton: {
    backgroundColor: '#4285f4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  detailFullContent: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 26,
    marginBottom: 24,
    textAlign: 'justify',
  },
  tagsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  detailEngagement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLikeCount: {
    fontSize: 14,
    color: '#666666',
    marginRight: 20,
  },
  detailCommentCount: {
    fontSize: 14,
    color: '#666666',
  },
  detailActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  detailActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#f8f8f8',
    minWidth: 80,
    justifyContent: 'center',
  },
  likedButton: {
    backgroundColor: '#ffe8e8',
  },
  detailActionIcon: {
    fontSize: 18,
    marginRight: 8,
    color: '#888888',
  },
  likedIcon: {
    color: '#ff5a5f',
  },
  detailActionText: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '500',
  },
  likedText: {
    color: '#ff5a5f',
  },
  noPostAvalText: {
    textAlign: 'center',
    paddingVertical: 20,
    fontWeight: 700,
    color: 'gray'
  }
});

export default NewsScreen;
