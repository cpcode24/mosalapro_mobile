import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../theme/theme';

const EditProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Missing Information', 'Name and email are required.');
      return;
    }
    setLoading(true);
    // TODO: Replace with actual API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Profile Updated', 'Your profile has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Icon name="account-circle" size={80} color={theme.colors.primary} />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor={theme.colors.outline}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor={theme.colors.outline}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter your phone number"
          placeholderTextColor={theme.colors.outline}
          keyboardType="phone-pad"
        />
      </View>
      <TouchableOpacity
        style={[styles.saveButton, (!name.trim() || !email.trim()) && styles.disabledButton]}
        onPress={handleSave}
        disabled={loading || !name.trim() || !email.trim()}
      >
        <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save Changes'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: theme.colors.onSurface,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: theme.colors.outline,
  },
  saveButtonText: {
    color: theme.colors.onPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default EditProfileScreen;
