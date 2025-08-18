import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  preferences: {
    theme: string;
    notifications: boolean;
    language: string;
  };
}

export default function StorageTest() {
  // Basic operations state
  const [basicKey, setBasicKey] = useState('test-key');
  const [basicValue, setBasicValue] = useState('test-value');
  const [retrievedValue, setRetrievedValue] = useState<string | undefined>('');

  // Counter state
  const [counter, setCounter] = useState(0);

  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // All keys state for browsing
  const [allKeys, setAllKeys] = useState<string[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load counter from storage
      const savedCounter = await AsyncStorage.getItem('counter');
      setCounter(savedCounter ? parseInt(savedCounter, 10) : 0);

      // Load user profile from storage
      const savedProfile = await AsyncStorage.getItem('userProfile');
      if (savedProfile) {
        try {
          setUserProfile(JSON.parse(savedProfile));
        } catch (e) {
          console.error('Failed to parse user profile:', e);
        }
      }

      refreshAllKeys();
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const refreshAllKeys = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      setAllKeys(keys);
    } catch (error) {
      console.error('Error refreshing keys:', error);
      setAllKeys([]);
    }
  };

  // Basic Operations
  const handleSetValue = async () => {
    if (!basicKey.trim()) {
      Alert.alert('Error', 'Please enter a key');
      return;
    }
    try {
      await AsyncStorage.setItem(basicKey, basicValue);
      Alert.alert('Success', `Stored: ${basicKey} = ${basicValue}`);
      refreshAllKeys();
    } catch (error) {
      Alert.alert('Error', `Failed to store value: ${error.message}`);
    }
  };

  const handleGetValue = async () => {
    if (!basicKey.trim()) {
      Alert.alert('Error', 'Please enter a key');
      return;
    }
    try {
      const value = await AsyncStorage.getItem(basicKey);
      setRetrievedValue(value);
      if (value === null) {
        Alert.alert('Not Found', `No value found for key: ${basicKey}`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to get value: ${error.message}`);
    }
  };

  const handleDeleteValue = async () => {
    if (!basicKey.trim()) {
      Alert.alert('Error', 'Please enter a key');
      return;
    }
    try {
      await AsyncStorage.removeItem(basicKey);
      setRetrievedValue('');
      Alert.alert('Success', `Deleted key: ${basicKey}`);
      refreshAllKeys();
    } catch (error) {
      Alert.alert('Error', `Failed to delete value: ${error.message}`);
    }
  };

  // Counter Operations
  const incrementCounter = async () => {
    const newValue = counter + 1;
    setCounter(newValue);
    try {
      await AsyncStorage.setItem('counter', newValue.toString());
    } catch (error) {
      console.error('Error incrementing counter:', error);
    }
  };

  const decrementCounter = async () => {
    const newValue = Math.max(0, counter - 1);
    setCounter(newValue);
    try {
      await AsyncStorage.setItem('counter', newValue.toString());
    } catch (error) {
      console.error('Error decrementing counter:', error);
    }
  };

  const resetCounter = async () => {
    setCounter(0);
    try {
      await AsyncStorage.removeItem('counter');
      refreshAllKeys();
    } catch (error) {
      console.error('Error resetting counter:', error);
    }
  };

  // User Profile Operations
  const createSampleProfile = async () => {
    const profile: UserProfile = {
      id: Date.now().toString(),
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      preferences: {
        theme: 'dark',
        notifications: true,
        language: 'en',
      },
    };

    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      setUserProfile(profile);
      Alert.alert('Success', 'Sample user profile created and stored!');
      refreshAllKeys();
    } catch (error) {
      Alert.alert('Error', `Failed to create profile: ${error.message}`);
    }
  };

  const updateProfileAge = async () => {
    if (!userProfile) return;

    const updatedProfile = {
      ...userProfile,
      age: userProfile.age + 1,
    };

    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile age:', error);
    }
  };

  const toggleNotifications = async () => {
    if (!userProfile) return;

    const updatedProfile = {
      ...userProfile,
      preferences: {
        ...userProfile.preferences,
        notifications: !userProfile.preferences.notifications,
      },
    };

    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Error toggling notifications:', error);
    }
  };

  const deleteProfile = async () => {
    try {
      await AsyncStorage.removeItem('userProfile');
      setUserProfile(null);
      Alert.alert('Success', 'User profile deleted from storage');
      refreshAllKeys();
    } catch (error) {
      Alert.alert('Error', `Failed to delete profile: ${error.message}`);
    }
  };

  // Advanced Operations
  const storeComplexData = async () => {
    const complexData = {
      array: [1, 2, 3, 'hello', true],
      nested: {
        level1: {
          level2: {
            value: 'deep nested value',
          },
        },
      },
      timestamp: Date.now(),
      boolean: true,
      nullValue: null,
    };

    try {
      await AsyncStorage.setItem('complex-data', JSON.stringify(complexData));
      Alert.alert('Success', 'Complex data structure stored!');
      refreshAllKeys();
    } catch (error) {
      Alert.alert('Error', `Failed to store complex data: ${error.message}`);
    }
  };

  const performanceTest = async () => {
    const startTime = Date.now();
    
    try {
      // Write 100 key-value pairs
      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(AsyncStorage.setItem(`perf-test-${i}`, `value-${i}`));
      }
      await Promise.all(promises);

      const writeTime = Date.now() - startTime;

      const readStartTime = Date.now();
      
      // Read 100 key-value pairs
      const readPromises = [];
      for (let i = 0; i < 100; i++) {
        readPromises.push(AsyncStorage.getItem(`perf-test-${i}`));
      }
      await Promise.all(readPromises);

      const readTime = Date.now() - readStartTime;

      // Clean up test data
      const cleanupPromises = [];
      for (let i = 0; i < 100; i++) {
        cleanupPromises.push(AsyncStorage.removeItem(`perf-test-${i}`));
      }
      await Promise.all(cleanupPromises);

      Alert.alert(
        'Performance Test Results',
        `Write 100 items: ${writeTime}ms\nRead 100 items: ${readTime}ms\n\nAsyncStorage Performance 📱`
      );

      refreshAllKeys();
    } catch (error) {
      Alert.alert('Error', `Performance test failed: ${error.message}`);
    }
  };

  const clearAllStorage = () => {
    Alert.alert(
      'Clear All Storage',
      'Are you sure you want to clear all storage? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              
              // Reset local state
              setCounter(0);
              setUserProfile(null);
              setRetrievedValue('');
              setAllKeys([]);
              
              Alert.alert('Success', 'All storage cleared!');
            } catch (error) {
              Alert.alert('Error', `Failed to clear storage: ${error.message}`);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>📦 AsyncStorage Test</Text>
        <Text style={styles.subtitle}>Reliable key-value storage for React Native</Text>

        {/* Storage Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Storage Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Library</Text>
              <Text style={styles.infoValue}>AsyncStorage</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Keys Count</Text>
              <Text style={styles.infoValue}>{allKeys.length}</Text>
            </View>
          </View>
        </View>

        {/* Basic Operations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 Basic Operations</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter key"
              value={basicKey}
              onChangeText={setBasicKey}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter value"
              value={basicValue}
              onChangeText={setBasicValue}
            />
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleSetValue}>
              <Text style={styles.actionButtonText}>Set</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.getButton]} onPress={handleGetValue}>
              <Text style={styles.actionButtonText}>Get</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDeleteValue}>
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>

          {retrievedValue !== '' && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>Retrieved Value:</Text>
              <Text style={styles.resultValue}>{retrievedValue || 'null'}</Text>
            </View>
          )}
        </View>

        {/* Counter Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔢 Persistent Counter</Text>
          <Text style={styles.counterValue}>{counter}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.actionButton, styles.decrementButton]} onPress={decrementCounter}>
              <Text style={styles.actionButtonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.resetButton]} onPress={resetCounter}>
              <Text style={styles.actionButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.incrementButton]} onPress={incrementCounter}>
              <Text style={styles.actionButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* User Profile Demo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 User Profile Storage</Text>
          {userProfile ? (
            <View style={styles.profileContainer}>
              <Text style={styles.profileText}>Name: {userProfile.name}</Text>
              <Text style={styles.profileText}>Email: {userProfile.email}</Text>
              <Text style={styles.profileText}>Age: {userProfile.age}</Text>
              <Text style={styles.profileText}>Theme: {userProfile.preferences.theme}</Text>
              <Text style={styles.profileText}>
                Notifications: {userProfile.preferences.notifications ? 'On' : 'Off'}
              </Text>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.actionButton} onPress={updateProfileAge}>
                  <Text style={styles.actionButtonText}>Age +1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={toggleNotifications}>
                  <Text style={styles.actionButtonText}>Toggle Notify</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={deleteProfile}>
                  <Text style={styles.actionButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.createButton} onPress={createSampleProfile}>
              <Text style={styles.createButtonText}>Create Sample Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Advanced Operations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Advanced Operations</Text>
          <View style={styles.buttonColumn}>
            <TouchableOpacity style={styles.advancedButton} onPress={storeComplexData}>
              <Text style={styles.advancedButtonText}>Store Complex Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.advancedButton} onPress={performanceTest}>
              <Text style={styles.advancedButtonText}>Performance Test</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.advancedButton, styles.dangerButton]} onPress={clearAllStorage}>
              <Text style={styles.advancedButtonText}>Clear All Storage</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* All Keys Browser */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🗂️ All Stored Keys ({allKeys.length})</Text>
          <ScrollView style={styles.keysContainer} nestedScrollEnabled>
            {allKeys.length > 0 ? (
              allKeys.map((key, index) => (
                <View key={index} style={styles.keyItem}>
                  <Text style={styles.keyText}>{key}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noKeysText}>No keys stored</Text>
            )}
          </ScrollView>
        </View>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Back to Home</Text>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#343a40',
  },
  // Storage Info
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    minWidth: 120,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  // Basic Operations
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  getButton: {
    backgroundColor: '#34C759',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  resultLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#343a40',
  },
  // Counter
  counterValue: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#007AFF',
  },
  incrementButton: {
    backgroundColor: '#34C759',
  },
  decrementButton: {
    backgroundColor: '#FF9500',
  },
  resetButton: {
    backgroundColor: '#8E8E93',
  },
  // Profile
  profileContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  profileText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#343a40',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Advanced Operations
  buttonColumn: {
    gap: 12,
  },
  advancedButton: {
    backgroundColor: '#5856D6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  advancedButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Keys Browser
  keysContainer: {
    maxHeight: 200,
  },
  keyItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 5,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  keyText: {
    fontSize: 14,
    color: '#343a40',
    fontFamily: 'monospace',
  },
  noKeysText: {
    textAlign: 'center',
    color: '#8E8E93',
    fontStyle: 'italic',
    padding: 20,
  },
  // Link
  link: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#34C759',
    borderRadius: 8,
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});