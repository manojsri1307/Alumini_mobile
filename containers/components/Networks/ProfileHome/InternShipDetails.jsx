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
  Modal,
} from 'react-native';
import { resources } from '../../../resources';

const { width } = Dimensions.get('window');

const InternshipDetailView = ({visible, onClose, jobData}) => {

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
        return '#8B5CF6';
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
        return '🎓';
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

  const item = jobData || {};

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      transparent
    >
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <View style={[styles.typeIcon, { backgroundColor: getTypeColor(item.type || 'internship') }]}>
                <Text style={styles.typeIconText}>{getTypeIcon(item.type || 'internship')}</Text>
              </View>
              
              <View style={styles.headerInfo}>
                <Text style={styles.postedBy}>Posted by {item.postedBy || 'Unknown'}</Text>
                <Text style={styles.dateTime}>
                  {item.date ? formatDate(item.date) : ''} {item.timings ? '• ' + formatTime(item.timings) : ''}
                </Text>
              </View>
              
              <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type || 'internship') }]}>
                <Text style={styles.typeBadgeText}>
                  {item.postdiscussionCategory?.toUpperCase() || 'INTERNSHIP'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.content}>
            {item.title && (
              <Text style={styles.title}>{item.title}</Text>
            )}
            
            {item.companyName && (
              <View style={styles.companyContainer}>
                <Text style={styles.companyIcon}>🏢</Text>
                <Text style={styles.companyName}>{item.companyName}</Text>
              </View>
            )}

            {item.eventName && (
              <Text style={styles.eventTitle}>{item.eventName}</Text>
            )}
            
            {item.location && (
              <View style={styles.locationContainer}>
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={styles.locationText}>{item.location}</Text>
              </View>
            )}

            {item.discussion && (
              <View style={styles.discussionContainer}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.discussionText}>{item.discussion}</Text>
              </View>
            )}

            {(item.degree || item.branch || item.batch) && (
              <View style={styles.academicSection}>
                <Text style={styles.sectionTitle}>Academic Requirements</Text>
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
              </View>
            )}

            {item.jobTitle && (
              <View style={styles.jobSection}>
                <Text style={styles.sectionTitle}>Position</Text>
                <Text style={styles.jobTitle}>{item.jobTitle}</Text>
              </View>
            )}

            {item.jobDescription && (
              <View style={styles.descriptionSection}>
                <Text style={styles.sectionTitle}>Job Description</Text>
                <Text style={styles.description}>{item.jobDescription}</Text>
              </View>
            )}

            {item.salary && (
              <View style={styles.salarySection}>
                <Text style={styles.sectionTitle}>Compensation</Text>
                <View style={styles.salaryContainer}>
                  <Text style={styles.salaryLabel}>Stipend:</Text>
                  <Text style={styles.salaryText}>{item.salary}</Text>
                </View>
              </View>
            )}

            {item.duration && (
              <View style={styles.durationSection}>
                <Text style={styles.sectionTitle}>Duration</Text>
                <View style={styles.durationContainer}>
                  <Text style={styles.durationIcon}>⏱️</Text>
                  <Text style={styles.durationText}>{item.duration}</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Apply Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Contact Poster</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
  },
  typeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  typeIconText: {
    fontSize: 20,
  },
  headerInfo: {
    flex: 1,
  },
  postedBy: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    lineHeight: 32,
  },
  companyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  companyIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  locationText: {
    fontSize: 16,
    color: '#6B7280',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  discussionContainer: {
    marginBottom: 24,
  },
  discussionText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  academicSection: {
    marginBottom: 24,
  },
  academicInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoTag: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  infoTagText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  jobSection: {
    marginBottom: 24,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  salarySection: {
    marginBottom: 24,
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  salaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginRight: 12,
  },
  salaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  durationSection: {
    marginBottom: 24,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  durationIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  durationText: {
    fontSize: 16,
    color: '#6B7280',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
  },
});

export default InternshipDetailView