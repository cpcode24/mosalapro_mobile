/**
 * Intro Screen
 * Welcome onboarding screen with app features overview
 */
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';
import { useDispatch } from 'react-redux';
import { colors, typography, spacing, shadows } from '../../theme/theme';
import { setHasSeenOnboarding } from '../../store/slices/appSlice';
import PagerViewWrapper from '../../components/PagerViewWrapper';

const { width, height } = Dimensions.get('window');

const IntroScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const pagerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const onboardingData = [
    {
      id: 1,
      title: 'Find Professional Services',
      description: 'Discover trusted service providers in your area for all your home and business needs.',
      icon: '🔍',
      color: colors.primary,
    },
    {
      id: 2,
      title: 'Book with Confidence',
      description: 'Read reviews, compare prices, and book services from verified professionals.',
      icon: '⭐',
      color: colors.secondary || colors.accent,
    },
    {
      id: 3,
      title: 'Manage Everything',
      description: 'Track your bookings, communicate with providers, and manage payments in one place.',
      icon: '📱',
      color: colors.success || '#4CAF50',
    },
    {
      id: 4,
      title: 'Join as a Provider',
      description: 'Are you a service provider? Join our platform and grow your business.',
      icon: '💼',
      color: colors.warning || '#FF9800',
    },
  ];

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      const nextPage = currentPage + 1;
      pagerRef.current?.setPage(nextPage);
      setCurrentPage(nextPage);
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = () => {
    // Continue to permissions screen
    navigation.navigate('Permissions');
  };

  const handlePageChange = (event) => {
    setCurrentPage(event.nativeEvent.position);
  };

  const renderPage = ({ item, index }) => (
    <View key={item.id} style={styles.page}>
      <View style={styles.content}>
        {/* Icon/Image */}
        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
          <Text style={styles.icon}>{item.icon}</Text>
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {onboardingData.map((_, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.dot,
            currentPage === index && styles.activeDot
          ]}
          onPress={() => {
            pagerRef.current?.setPage(index);
            setCurrentPage(index);
          }}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Skip Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Pager Content */}
      <View style={styles.pagerContainer}>
        <PagerViewWrapper
          ref={pagerRef}
          style={styles.pager}
          initialPage={0}
          onPageSelected={handlePageChange}
        >
          {onboardingData.map((item, index) => (
            <View key={item.id} style={styles.page}>
              <View style={styles.content}>
                {/* Icon/Image */}
                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                  <Text style={styles.icon}>{item.icon}</Text>
                </View>

                {/* Text Content */}
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>
              </View>
            </View>
          ))}
        </PagerViewWrapper>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Page Indicators */}
        {renderDots()}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {currentPage > 0 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                const prevPage = currentPage - 1;
                pagerRef.current?.setPage(prevPage);
                setCurrentPage(prevPage);
              }}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.nextButton,
              currentPage === 0 && styles.nextButtonFullWidth
            ]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentPage === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  skipButton: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  skipText: {
    fontSize: typography.fontSize.base,
    color: colors.gray600,
    fontWeight: typography.fontWeight.medium,
  },
  pagerContainer: {
    flex: 1,
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  content: {
    alignItems: 'center',
    maxWidth: width * 0.8,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing['3xl'],
    ...shadows.lg,
  },
  icon: {
    fontSize: 48,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.onBackground,
    textAlign: 'center',
    marginBottom: spacing.base,
  },
  description: {
    fontSize: typography.fontSize.base,
    color: colors.gray600,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.base,
  },
  bottomSection: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray300,
    marginHorizontal: spacing.xs,
  },
  activeDot: {
    backgroundColor: colors.primary,
    width: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.gray200,
    flex: 1,
    marginRight: spacing.base,
  },
  backButtonText: {
    color: colors.gray700,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    borderRadius: 12,
    flex: 2,
    ...shadows.base,
  },
  nextButtonFullWidth: {
    flex: 1,
    marginRight: 0,
  },
  nextButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
});

export default IntroScreen;