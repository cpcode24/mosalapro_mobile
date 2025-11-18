import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../theme/theme';

const AboutScreen = () => {
  return (
    <View style={styles.container}>
      <Icon name="information-outline" size={60} color={theme.colors.primary} style={styles.icon} />
      <Text style={styles.title}>About MosalaPro</Text>
      <Text style={styles.text}>
        MosalaPro is a professional service finder app designed to connect you with trusted providers for all your needs. Version 1.0.0
      </Text>
      <Text style={styles.text}>
        © {new Date().getFullYear()} MosalaPro. All rights reserved.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 12,
  },
});

export default AboutScreen;
