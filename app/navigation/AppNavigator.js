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

const stackScreenOptions = {
    headerStyle: { backgroundColor: '#F8F8E1' },
    headerTintColor: '#FF90BB',
    headerShadowVisible: false,
    headerTitleStyle: { fontWeight: '700', color: '#1e293b' },
    contentStyle: { backgroundColor: '#F8F8E1' },
};

function TimetableStackScreen() {
    return (
        <TimetableStack.Navigator screenOptions={stackScreenOptions}>
            <TimetableStack.Screen name="Timetable" component={TimetableScreen} />
            <TimetableStack.Screen
                name="EventDetail"
                component={EventDetailScreen}
                options={{ title: 'Event Details' }}
            />
            <TimetableStack.Screen
                name="AddEditEvent"
                component={AddEditEventScreen}
                options={({ route }) => ({
                    title: route.params?.event ? 'Edit Event' : 'Add Event',
                })}
            />
        </TimetableStack.Navigator>
    );
}

function TicketsStackScreen() {
    return (
        <TicketsStack.Navigator screenOptions={stackScreenOptions}>
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
                    const icon =
                        route.name === 'TimetableTab' ? 'calendar-outline' : 'ticket-outline';
                    return <Ionicons name={icon} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#FF90BB',
                tabBarInactiveTintColor: '#C4A8B8',
                tabBarStyle: {
                    backgroundColor: '#F8F8E1',
                    borderTopColor: '#FFC1DA',
                    borderTopWidth: 1.5,
                },
                tabBarLabelStyle: { fontWeight: '600', fontSize: 11 },
            })}
        >
            <Tab.Screen
                name="TimetableTab"
                component={TimetableStackScreen}
                options={{ title: 'Timetable' }}
            />
            <Tab.Screen
                name="TicketsTab"
                component={TicketsStackScreen}
                options={{ title: 'Tickets' }}
            />
        </Tab.Navigator>
    );
}
