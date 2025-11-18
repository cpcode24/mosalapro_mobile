import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Dimensions, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, shadows } from '../../theme/theme';

const { width } = Dimensions.get('window');

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

const IntroScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('Permissions')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.pagerContainer}>
        {onboardingData.map((item) => (
          <View key={item.id} style={styles.page}>
            <View style={styles.content}>
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}> 
                <Text style={styles.icon}>{item.icon}</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.nextButton, styles.nextButtonFullWidth]}
          onPress={() => navigation.navigate('Permissions')}
        >
          <Text style={styles.nextButtonText}>Get Started</Text>
        </TouchableOpacity>
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
  nextButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    borderRadius: 12,
    flex: 1,
    ...shadows.base,
  },
  nextButtonFullWidth: {
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
