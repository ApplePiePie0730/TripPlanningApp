import { Alert } from 'react-native';

export const showError = (message) =>
  Alert.alert('Error', message || 'Something went wrong. Please try again.');
