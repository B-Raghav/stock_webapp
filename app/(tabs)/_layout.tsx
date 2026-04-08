import { Tabs } from 'expo-router';
import { ShoppingBag, Lock } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#FF2A54', tabBarShowLabel: true, headerShown: true }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Gallery',
          tabBarIcon: ({ color }) => <ShoppingBag color={color} size={24} />,
          headerTitle: 'Riva Silks Collection',
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
          tabBarIcon: ({ color }) => <Lock color={color} size={24} />,
          headerTitle: 'Riva Silks Admin',
        }}
      />
    </Tabs>
  );
}
