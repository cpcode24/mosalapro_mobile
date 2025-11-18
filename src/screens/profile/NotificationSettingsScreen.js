import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../theme/theme';

const NotificationSettingsScreen = () => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>
      <View style={styles.settingRow}>
        <Icon name="bell" size={24} color={theme.colors.primary} />
        <Text style={styles.settingLabel}>Push Notifications</Text>
        <Switch
          value={pushEnabled}
          onValueChange={setPushEnabled}
          thumbColor={pushEnabled ? theme.colors.primary : theme.colors.outline}
        />
      </View>
      <View style={styles.settingRow}>
        <Icon name="email-outline" size={24} color={theme.colors.primary} />
        <Text style={styles.settingLabel}>Email Notifications</Text>
        <Switch
          value={emailEnabled}
          onValueChange={setEmailEnabled}
          thumbColor={emailEnabled ? theme.colors.primary : theme.colors.outline}
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

export default NotificationSettingsScreen;
