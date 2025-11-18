import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../theme/theme';

const PrivacySettingsScreen = () => {
  const [profileVisible, setProfileVisible] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Privacy Settings</Text>
      <View style={styles.settingRow}>
        <Icon name="account-outline" size={24} color={theme.colors.primary} />
        <Text style={styles.settingLabel}>Show My Profile</Text>
        <Switch
          value={profileVisible}
          onValueChange={setProfileVisible}
          thumbColor={profileVisible ? theme.colors.primary : theme.colors.outline}
        />
      </View>
      <View style={styles.settingRow}>
        <Icon name="map-marker-outline" size={24} color={theme.colors.primary} />
        <Text style={styles.settingLabel}>Share My Location</Text>
        <Switch
          value={locationSharing}
          onValueChange={setLocationSharing}
          thumbColor={locationSharing ? theme.colors.primary : theme.colors.outline}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 32,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.onSurface,
    marginLeft: 16,
  },
});

export default PrivacySettingsScreen;
