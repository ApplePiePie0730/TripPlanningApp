import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import TimetableScreen from '../screens/TimetableScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import AddEditEventScreen from '../screens/AddEditEventScreen';
import TicketsScreen from '../screens/TicketsScreen';

const Tab = createBottomTabNavigator();
const TimetableStack = createNativeStackNavigator();
const TicketsStack = createNativeStackNavigator();

function TimetableStackScreen() {
  return (
    <TimetableStack.Navigator>
      <TimetableStack.Screen name="Timetable" component={TimetableScreen} />
      <TimetableStack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{ title: 'Event Details' }}
      />
      <TimetableStack.Screen
        name="AddEditEvent"
        component={AddEditEventScreen}
        options={({ route }) => ({ title: route.params?.event ? 'Edit Event' : 'Add Event' })}
      />
    </TimetableStack.Navigator>
  );
}

function TicketsStackScreen() {
  return (
    <TicketsStack.Navigator>
      <TicketsStack.Screen name="Tickets" component={TicketsScreen} />
    </TicketsStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const icon = route.name === 'TimetableTab' ? 'calendar-outline' : 'ticket-outline';
          return <Ionicons name={icon} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#94a3b8',
      })}
    >
      <Tab.Screen name="TimetableTab" component={TimetableStackScreen} options={{ title: 'Timetable' }} />
      <Tab.Screen name="TicketsTab" component={TicketsStackScreen} options={{ title: 'Tickets' }} />
    </Tab.Navigator>
  );
}
