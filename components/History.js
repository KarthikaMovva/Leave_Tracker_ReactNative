
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from '@react-navigation/native';

export default function History() {
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchLeaveApplications = async () => {
      try {
        const data = await AsyncStorage.getItem('leaveApplications');
        if (data) {
          setLeaveApplications(JSON.parse(data));
        }
      } catch (error) {
        console.error('Error fetching leave applications:', error);
      } finally {
        setLoading(false);
      }
      if (isFocused) {
        fetchLeaveApplications(); 
      }
    };

    fetchLeaveApplications();
  }, [isFocused]);

  const renderLeaveIcon = (type) => {
    switch (type) {
      case 'Sick':
        return <MaterialIcons name="medical-services" size={36} color="#e11d48" />;
      case 'Casual':
        return <MaterialCommunityIcons name="umbrella-beach" size={36} color="#facc15" />;
      case 'Earned':
        return <FontAwesome5 name="briefcase" size={32} color="#10b981" />;
      default:
        return null;
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <LinearGradient
    colors={['#f0f4f8', '#d9e2ec']}
    style={{ flex: 1 }}
  >
    <View className="flex-1 p-4">
      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" />
      ) : leaveApplications.length === 0 ? (
        <Text className="text-center text-gray-600 mt-10">
          No leave applications found.
        </Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {leaveApplications.map((application, index) => (
            <View
              key={index}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-300 mb-3 flex-row space-x-4 items-start"
            >
              <View className="mt-1">
                {renderLeaveIcon(application.leaveType)}
              </View>
  
              <View className="flex-1 pl-3 space-y-2.5">
                <View className="flex-row justify-between mb-1 space-x-2">
                  {/* <MaterialIcons name="person-outline" size={18} color="#6b7280" style={{}}/> */}
                  <Text className="text-gray-800 font-semibold text-2xl">
                    {application.name}
                  </Text>
                </View>
                <Text className='font-semibold text-xl text-blue-500'>{application.leaveType} Leave</Text>
                <Text className="text-orange-600 mb-1 font-semibold text-xl">
                  {application.startDate === application.endDate
                    ? formatDate(application.startDate)
                    : `${formatDate(application.startDate)} - ${formatDate(application.endDate)}`}
                </Text>
  
                <Text className="text-gray-500 text-xl">{application.reason}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  </LinearGradient>
  
  );
}
