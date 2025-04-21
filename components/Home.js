import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import RecentLeaveCard from "./RecentLeaveCard";
import { LinearGradient } from "expo-linear-gradient";
import NoLeaves from "./NoLeaves";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from '@react-navigation/native';



export default function Home({ navigation }) {
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchLeaveData();
  }, [isFocused]);

  const fetchLeaveData = async () => {
    setLoading(true);
    try {
      const data = await AsyncStorage.getItem("leaveApplications");
      if (data) {
        const parsed = JSON.parse(data);
        const sorted = [...parsed].reverse();
        setTotalLeaves(parsed.length);
        setRecentLeaves(sorted.slice(0, 3));
      } else {
        setTotalLeaves(0);
        setRecentLeaves([]);
      }
    } catch (error) {
      console.error("Error fetching leave data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#f0f4f8", "#d9e2ec"]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-5 pt-10"
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchLeaveData} />}
        >
          <View className="justify-center">
            <Text className="text-3xl font-bold mb-2">Welcome back 🎉</Text>
            <Text className="text-xl text-gray-600 mb-6 font-semibold">
              Here’s a quick look at leave activity.
            </Text>

            {loading ? (
              <ActivityIndicator size="large" color="#2563eb" />
            ) : (
              <>
                <TouchableOpacity onPress={() => navigation.navigate("History")} activeOpacity={0.8}>
                  <View className="bg-white p-5 rounded-xl mb-6 shadow shadow-lg">
                    <Text className="font-semibold text-xl text-gray-700">Total leaves applied</Text>
                    <Text className="text-5xl font-bold text-blue-500 mt-1">{totalLeaves}</Text>
                  </View>
                </TouchableOpacity>

                <Text className="text-xl font-semibold mb-3">Recently Applied Leaves</Text>

                {recentLeaves.length === 0 ? (
                   <NoLeaves/>
                ) : (
                  <FlatList
                    data={recentLeaves}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                    renderItem={({ item, index }) => (
                      <RecentLeaveCard item={item} index={index} navigation={navigation} />
                    )}
                  />
                )}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
