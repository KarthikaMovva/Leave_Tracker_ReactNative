import React, { useEffect, useState } from "react";
import { Text, View, FlatList, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons, Entypo } from "@expo/vector-icons";
import { useIsFocused } from '@react-navigation/native';

export default function Home({navigation}) {
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log("Home mounted");
    return () => {
      console.log("Home unmounted");
    };
  }, []);
  

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const data = await AsyncStorage.getItem("leaveApplications");
        if (data) {
          const parsed = JSON.parse(data);
          const sorted = [...parsed].reverse();
          setTotalLeaves(parsed.length);
          setRecentLeaves(sorted.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching leave data:", error);
      } finally {
        setLoading(false);
      }
      if (isFocused) {
        fetchLeaveData();
      }
    };

    fetchLeaveData();
  }, [isFocused]);

  
  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const renderIcon = (type) => {
    switch (type) {
      case "Sick":
        return <MaterialIcons name="medical-services" size={35} color="#e11d48" />;
      case "Casual":
        return <MaterialCommunityIcons name="umbrella-beach" size={35} color="#fbbf24" />;
      case "Earned":
        return <FontAwesome5 name="briefcase" size={35} color="#10b981" />;
      default:
        return <FontAwesome5 name="calendar-alt" size={22} color="#6b7280" />;
    }
  };

  return (
    <LinearGradient colors={['#f0f4f8', '#d9e2ec']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-5 pt-10">
        <View className="flex-1 justify-center">
          <Text className="text-2xl font-bold mb-2 text-3xl">Welcome back🎉</Text>
          <Text className="text-base text-gray-600 mb-6 font-semibold text-xl">
            Here’s a quick look at leave activity.
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#2563eb" />
          ) : (
            <>
             <TouchableOpacity onPress={()=>navigation.navigate('History')}>
              <View className="bg-white p-5 rounded-xl mb-6">
                <Text className="font-semibold text-base text-xl text-gray-700">Total leaves applied</Text>
                <Text className="text-5xl font-bold text-blue-500 mt-1">
                  {totalLeaves}
                </Text>
              </View>
              </TouchableOpacity>

              <Text className="text-base font-semibold mb-3 text-xl">Recently Applied Leaves</Text>

              {recentLeaves.length === 0 ? (
                <Text className="text-sm text-gray-500">No recent leaves found👌</Text>
              ) : (
                <FlatList
                  data={recentLeaves}
                  keyExtractor={(item, index) => index.toString()}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={()=>navigation.navigate('History')}>
                      <View
                                  key={item.index}
                                  className="bg-white p-5 rounded-xl shadow-md border border-gray-300 mb-3 flex-row space-x-4 items-start"
                                >
                                  <View className="mt-1 justify-center items-center h-12 w-12">
                                    {renderIcon(item.leaveType)}
                                  </View>
                      
                                  <View className="flex-1 pl-5 space-y-1.5">
                                    <View className="flex-row justify-between mb-1 space-x-2">
                                      {/* <MaterialIcons name="person-outline" size={18} color="#6b7280" style={{}}/> */}
                                      <Text className="text-gray-800 font-semibold text-xl">
                                        {item.name}
                                      </Text>
                                    </View>
                                    <Text className="text-orange-600 mb-1 font-semibold text-lg">
                                      {item.startDate === item.endDate
                                        ? formatDate(item.startDate)
                                        : `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`}
                                    </Text>
                      
                                    {/* <Text className="text-gray-500 text-xl">{item.reason}</Text> */}
                                  </View>
                                </View>
                                </TouchableOpacity>
                  )}
                />
              )}
            </>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
