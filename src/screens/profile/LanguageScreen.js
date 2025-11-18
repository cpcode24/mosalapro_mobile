import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../theme/theme';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' },
  { code: 'pt', label: 'Portuguese' },
];

const LanguageScreen = () => {
  const [selected, setSelected] = useState('en');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Language</Text>
      <FlatList
        data={LANGUAGES}
        keyExtractor={item => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.languageRow, selected === item.code && styles.selectedRow]}
            onPress={() => setSelected(item.code)}
          >
            <Text style={[styles.languageLabel, selected === item.code && styles.selectedLabel]}>
              {item.label}
            </Text>
            {selected === item.code && (
              <Icon name="check" size={22} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        )}
      />
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
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  selectedRow: {
    backgroundColor: theme.colors.primaryContainer,
  },
  languageLabel: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  selectedLabel: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default LanguageScreen;
