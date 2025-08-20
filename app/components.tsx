import React, { useState } from 'react';
import { 
  Screen, 
  Card, 
  Text, 
  Button, 
  Input, 
  Switch, 
  Divider, 
  Alert, 
  Spinner, 
  Box,
  useTheme 
} from '../src/components';

export default function ComponentsDemo() {
  const { theme, toggleMode } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [emailError, setEmailError] = useState('');
  const [switchValue, setSwitchValue] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showAlert, setShowAlert] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alertVariant, setAlertVariant] = useState<'info' | 'success' | 'warning' | 'error'>('info');

  const handleLogin = () => {
    // Simple email validation
    if (!inputValue.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setEmailError('');
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setAlertVariant('success');
      setShowAlert(true);
    }, 2000);
  };

  const handleEmailChange = (text: string) => {
    setInputValue(text);
    if (emailError) {
      setEmailError('');
    }
  };

  const cycleAlertVariant = () => {
    const variants: Array<'info' | 'success' | 'warning' | 'error'> = ['info', 'success', 'warning', 'error'];
    const currentIndex = variants.indexOf(alertVariant);
    const nextIndex = (currentIndex + 1) % variants.length;
    setAlertVariant(variants[nextIndex]);
    setShowAlert(true);
  };

  return (
    <Screen scrollable padding="md">
      {/* Header */}
      <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="lg">
        <Text variant="heading.h1">Component Library</Text>
        <Button variant="ghost" onPress={toggleMode}>
          {theme.mode === 'dark' ? '☀️' : '🌙'}
        </Button>
      </Box>

      <Text variant="body.large" color="secondary" marginBottom="xl">
        Interactive showcase of our theme-integrated component system with animations and accessibility features.
      </Text>

      {/* Alert Showcase */}
      {showAlert && (
        <Alert
          variant={alertVariant}
          title={alertVariant === 'success' ? 'Login Successful!' : `${alertVariant.charAt(0).toUpperCase() + alertVariant.slice(1)} Alert`}
          dismissible
          onDismiss={() => setShowAlert(false)}
          action={{
            label: 'Change Type',
            onPress: cycleAlertVariant
          }}
          marginBottom="lg"
        >
          {alertVariant === 'success' 
            ? 'Welcome back! You have successfully logged in.'
            : `This is a ${alertVariant} alert demonstrating contextual messaging with themed colors and animations.`
          }
        </Alert>
      )}

      {/* Login Form Demo */}
      <Card elevation="medium" padding="lg" marginBottom="lg">
        <Text variant="heading.h3" marginBottom="md">
          Login Form Demo
        </Text>
        
        <Input
          label="Email Address"
          placeholder="Enter your email"
          value={inputValue}
          onChangeText={handleEmailChange}
          error={emailError}
          keyboardType="email-address"
          autoCapitalize="none"
          marginBottom="md"
        />
        
        <Input
          label="Password"
          placeholder="Enter your password"
          value={passwordValue}
          onChangeText={setPasswordValue}
          secureTextEntry
          marginBottom="lg"
        />

        <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom="lg">
          <Text variant="body.medium">Remember me</Text>
          <Switch
            value={switchValue}
            onValueChange={setSwitchValue}
          />
        </Box>

        <Button 
          variant="primary" 
          onPress={handleLogin}
          loading={loading}
          disabled={!inputValue || !passwordValue}
          fullWidth
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </Card>

      {/* Button Variants */}
      <Card elevation="small" padding="lg" marginBottom="lg">
        <Text variant="heading.h3" marginBottom="md">
          Button Variants & Sizes
        </Text>
        
        <Text variant="body.small" color="secondary" marginBottom="md">
          Tap any button to see the scale animation
        </Text>

        <Box marginBottom="md">
          <Text variant="label" marginBottom="xs">Variants</Text>
          <Box flexDirection="row" style={{ gap: 8 }}>
            <Button variant="primary" onPress={() => {}}>Primary</Button>
            <Button variant="secondary" onPress={() => {}}>Secondary</Button>
            <Button variant="ghost" onPress={() => {}}>Ghost</Button>
          </Box>
        </Box>

        <Box marginBottom="md">
          <Text variant="label" marginBottom="xs">Sizes</Text>
          <Box flexDirection="row" alignItems="center" style={{ gap: 8 }}>
            <Button size="small" onPress={() => {}}>Small</Button>
            <Button size="medium" onPress={() => {}}>Medium</Button>
            <Button size="large" onPress={() => {}}>Large</Button>
          </Box>
        </Box>

        <Box>
          <Text variant="label" marginBottom="xs">States</Text>
          <Box flexDirection="row" style={{ gap: 8 }}>
            <Button disabled onPress={() => {}}>Disabled</Button>
            <Button loading onPress={() => {}}>Loading</Button>
          </Box>
        </Box>
      </Card>

      {/* Form Controls */}
      <Card elevation="small" padding="lg" marginBottom="lg">
        <Text variant="heading.h3" marginBottom="md">
          Form Controls
        </Text>

        <Input
          label="Success State"
          placeholder="This field is valid"
          state="success"
          helperText="Email format is correct"
          marginBottom="md"
        />

        <Input
          label="Error State"
          placeholder="This has an error"
          state="error"
          error="This field is required"
          marginBottom="md"
        />

        <Input
          variant="filled"
          label="Filled Variant"
          placeholder="Filled background style"
          marginBottom="lg"
        />

        <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom="md">
          <Text variant="body.medium">Push Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            size="large"
          />
        </Box>

        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
          <Text variant="body.medium">Marketing Emails</Text>
          <Switch
            value={false}
            onValueChange={() => {}}
            size="small"
            disabled
          />
        </Box>
      </Card>

      {/* Typography Showcase */}
      <Card elevation="small" padding="lg" marginBottom="lg">
        <Text variant="heading.h3" marginBottom="md">
          Typography System
        </Text>
        
        <Text variant="display.large" marginBottom="xs">Display Large</Text>
        <Text variant="display.medium" marginBottom="xs">Display Medium</Text>
        <Text variant="display.small" marginBottom="md">Display Small</Text>
        
        <Text variant="heading.h1" marginBottom="xs">Heading H1</Text>
        <Text variant="heading.h2" marginBottom="xs">Heading H2</Text>
        <Text variant="heading.h3" marginBottom="xs">Heading H3</Text>
        <Text variant="heading.h4" marginBottom="md">Heading H4</Text>
        
        <Text variant="body.large" marginBottom="xs">Body Large - Perfect for important content</Text>
        <Text variant="body.medium" marginBottom="xs">Body Medium - Standard text for most content</Text>
        <Text variant="body.small" marginBottom="md">Body Small - Secondary information</Text>
        
        <Text variant="caption.large" color="secondary">Caption Large</Text>
        <Text variant="caption.small" color="secondary">Caption Small</Text>
      </Card>

      {/* Layout & Feedback */}
      <Card elevation="large" padding="lg" marginBottom="lg">
        <Text variant="heading.h3" marginBottom="md">
          Layout & Feedback Components
        </Text>
        
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom="md">
          <Text variant="body.medium">Loading States:</Text>
          <Box flexDirection="row" alignItems="center" style={{ gap: 8 }}>
            <Spinner size="small" />
            <Spinner size="medium" color="secondary" />
            <Spinner size="large" color="success" />
          </Box>
        </Box>
        
        <Divider marginVertical="md" />
        
        <Text variant="body.medium" marginBottom="sm">Horizontal Divider ↑</Text>
        
        <Box flexDirection="row" alignItems="center" style={{ gap: 16 }}>
          <Text variant="body.medium">Left</Text>
          <Divider orientation="vertical" length={40} />
          <Text variant="body.medium">Right</Text>
        </Box>
        
        <Text variant="body.small" marginTop="sm">Vertical Divider ↑</Text>
      </Card>

      {/* Card Variations */}
      <Text variant="heading.h3" marginBottom="md">
        Card Elevation & Interaction
      </Text>
      
      <Card elevation="none" borderWidth={1} borderColor="primary" marginBottom="md">
        <Text variant="body.medium">No Shadow + Border</Text>
      </Card>
      
      <Card elevation="small" backgroundColor="secondary" marginBottom="md">
        <Text variant="body.medium">Small Shadow + Background</Text>
      </Card>
      
      <Card elevation="medium" marginBottom="md">
        <Text variant="body.medium">Medium Shadow (Default)</Text>
      </Card>
      
      <Card elevation="large" marginBottom="md">
        <Text variant="body.medium">Large Shadow</Text>
      </Card>
      
      <Card 
        pressable 
        onPress={() => setShowAlert(!showAlert)} 
        elevation="small"
        marginBottom="md"
      >
        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
          <Text variant="body.medium">Pressable Card (Tap to toggle alert)</Text>
          <Text variant="body.large">👆</Text>
        </Box>
      </Card>

      {/* Theme Info */}
      <Card elevation="medium" backgroundColor="tertiary" padding="lg">
        <Text variant="heading.h4" marginBottom="sm">
          Current Theme: {theme.mode === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </Text>
        <Text variant="body.small" color="secondary">
          All components automatically adapt to theme changes with smooth transitions and proper contrast ratios.
        </Text>
      </Card>
    </Screen>
  );
}