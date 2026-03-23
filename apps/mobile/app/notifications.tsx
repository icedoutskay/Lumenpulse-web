/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getNotifications, markAsRead } from '../lib/notifications'; 
import ProtectedRoute from '../components/ProtectedRoute';

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications when the screen mounts
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications('/notifications'); // API call

      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setNotifications([]);
    }
  };

  const handleMarkAsRead = async (id) => {

     setNotifications((prev) =>
    prev.map((n) =>
      n.id === id ? { ...n, read: true } : n
    )
  );
    try {
      await markAsRead(id); // API call
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const renderItem = ({ item }) => (
    <ProtectedRoute>
    <TouchableOpacity
      style={[
        styles.item,
        { backgroundColor: item.read ? colors.card : colors.accentSecondary },
      ]}
      onPress={() => handleMarkAsRead(item.id)}
    >
      <Text style={{ color: colors.text, fontWeight: 'bold' }}>{item.title}</Text>
      <Text style={{ color: colors.text }}>{item.message}</Text>
      <Text style={{ color: colors.text, fontSize: 10 }}>
        {item.read ? 'Read' : 'Unread'}
      </Text>
    </TouchableOpacity>
    </ProtectedRoute>
  );

  return (
    <ProtectedRoute>
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {notifications.length === 0 ? (
        <Text style={{ color: colors.text, textAlign: 'center', marginTop: 20 }}>
          No notifications
        </Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { padding: 16, borderRadius: 12, marginVertical: 8 },
});