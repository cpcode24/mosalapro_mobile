import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../theme/theme';

const INITIAL_METHODS = [
  { id: '1', type: 'Visa', last4: '1234', icon: 'credit-card' },
  { id: '2', type: 'Mastercard', last4: '5678', icon: 'credit-card' },
];

const PaymentMethodsScreen = () => {
  const [methods, setMethods] = useState(INITIAL_METHODS);

  const handleAddMethod = () => {
    // TODO: Implement add payment method logic
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Methods</Text>
      <FlatList
        data={methods}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.methodRow}>
            <Icon name={item.icon} size={28} color={theme.colors.primary} />
            <Text style={styles.methodLabel}>{item.type} •••• {item.last4}</Text>
            <TouchableOpacity>
              <Icon name="delete-outline" size={22} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No payment methods added.</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddMethod}>
        <Icon name="plus" size={20} color={theme.colors.onPrimary} />
        <Text style={styles.addButtonText}>Add Payment Method</Text>
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
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  methodLabel: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.onSurface,
    marginLeft: 16,
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

export default PaymentMethodsScreen;
