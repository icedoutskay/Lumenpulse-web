import { View, Text, Button, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function Portfolio() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 18, marginBottom: 20 }}>
          Please login to view your portfolio.
        </Text>
        <Button title="Go to Login" onPress={() => router.push('/login')} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
        Portfolio coming soon 🚀
      </Text>
    </View>
  );
}