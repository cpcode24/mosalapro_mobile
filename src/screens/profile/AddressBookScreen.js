import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../theme/theme';

const INITIAL_ADDRESSES = [
  { id: '1', label: 'Home', address: '123 Main St, City' },
  { id: '2', label: 'Work', address: '456 Office Rd, City' },
];

const AddressBookScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Addresses</Text>
      <FlatList
        data={INITIAL_ADDRESSES}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.addressRow}>
            <Icon name="map-marker" size={28} color={theme.colors.primary} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.addressLabel}>{item.label}</Text>
              <Text style={styles.addressText}>{item.address}</Text>
            </View>
            <TouchableOpacity>
              <Icon name="delete-outline" size={22} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No addresses saved.</Text>}
      />
      <TouchableOpacity style={styles.addButton}>
        <Icon name="plus" size={20} color={theme.colors.onPrimary} />
        <Text style={styles.addButtonText}>Add Address</Text>
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 32,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  addressLabel: {
    fontSize: 16,
    color: theme.colors.onSurface,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  emptyText: {
    color: theme.colors.outline,
    textAlign: 'center',
    marginTop: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 32,
    alignSelf: 'center',
  },
  addButtonText: {
    color: theme.colors.onPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default AddressBookScreen;
