import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AddEditEventScreen() {
  return (
    <View style={styles.container}>
      <Text>Add / Edit Event</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
