import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InputTest() {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Basic Input Test</Text>
      
      <Text style={styles.label}>Raw React Native TextInput:</Text>
      <TextInput
        style={styles.input}
        value={value1}
        onChangeText={setValue1}
        placeholder="Type here..."
        autoCapitalize="none"
      />
      <Text style={styles.debug}>Value: {value1}</Text>
      
      <Text style={styles.label}>Email TextInput:</Text>
      <TextInput
        style={styles.input}
        value={value2}
        onChangeText={setValue2}
        placeholder="Enter email..."
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.debug}>Value: {value2}</Text>
      
      <Text style={styles.label}>Password TextInput:</Text>
      <TextInput
        style={styles.input}
        value={value3}
        onChangeText={setValue3}
        placeholder="Enter password..."
        secureTextEntry
      />
      <Text style={styles.debug}>Value: {value3}</Text>
      
      <View style={styles.testInfo}>
        <Text style={styles.testText}>
          • Can you tap to focus? {'\n'}
          • Can you type characters? {'\n'}
          • Do you see the values updating above? {'\n'}
          • Does the keyboard appear? {'\n'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  debug: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  testInfo: {
    marginTop: 40,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  testText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
});