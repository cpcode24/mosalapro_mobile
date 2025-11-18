import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../theme/theme';

const INITIAL_FAVORITES = [
  { id: '1', name: 'John Doe', service: 'Plumber' },
  { id: '2', name: 'Jane Smith', service: 'Electrician' },
];

const FavoritesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      <FlatList
        data={INITIAL_FAVORITES}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.favoriteRow}>
            <Icon name="star" size={28} color={theme.colors.primary} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.favoriteName}>{item.name}</Text>
              <Text style={styles.favoriteService}>{item.service}</Text>
            </View>
            <TouchableOpacity>
              <Icon name="delete-outline" size={22} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No favorites yet.</Text>}
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
  favoriteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  favoriteName: {
    fontSize: 16,
    color: theme.colors.onSurface,
    fontWeight: '600',
  },
  favoriteService: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  emptyText: {
    color: theme.colors.outline,
    textAlign: 'center',
    marginTop: 24,
  },
});

export default FavoritesScreen;
