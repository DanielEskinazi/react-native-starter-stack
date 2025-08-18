import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function Gradients() {
  const router = useRouter();
  
  console.log('🌈 Gradients screen rendered');
  
  const handleBackPress = () => {
    console.log('📱 Back button pressed');
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🌈 Linear Gradient Demo</Text>
      
      <LinearGradient
        colors={['#FF6B6B', '#4ECDC4']}
        style={styles.gradientBox}
      >
        <Text style={styles.gradientText}>Red to Teal</Text>
      </LinearGradient>

      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradientBox}
      >
        <Text style={styles.gradientText}>Blue to Purple</Text>
      </LinearGradient>

      <LinearGradient
        colors={['#f093fb', '#f5576c']}
        style={styles.gradientBox}
      >
        <Text style={styles.gradientText}>Pink Gradient</Text>
      </LinearGradient>

      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  gradientBox: {
    width: 300,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradientText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  backButton: {
    marginTop: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});