import React from "react";
import { Text, View, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";


const recentLeaves = [
  {
    id: 1,
    type: "Sick Leave",
    date: "Jun 15, 2023",
    icon: <FontAwesome5 name="briefcase-medical" size={20} color="#e11d48" />,
  },
  {
    id: 2,
    type: "Casual Leave",
    date: "Jun 10, 2023",
    icon: <MaterialCommunityIcons name="umbrella-beach" size={20} color="#fbbf24" />,
  },
  {
    id: 3,
    type: "Earned Leave",
    date: "May 25, 2023",
    icon: <FontAwesome5 name="money-bill-wave" size={20} color="#10b981" />,
  },
];

const Home = () => {
  return (
    <LinearGradient
      colors={["skyblue","lightblue","white"
      ]}
      className="flex-1 px-5 pt-10"
    >
      <Text className="text-2xl font-bold mb-2">Welcome back</Text>
      <Text className="text-base text-gray-600 mb-6">
        Here’s a quick look at leave activity.
      </Text>

      <View className="bg-white p-4 rounded-xl mb-6 shadow shadow-gray-300">
        <Text className="font-semibold text-base">Total leaves applied</Text>
        <Text className="text-xl font-bold text-blue-500 mt-1">17</Text>
      </View>

      <Text className="text-base font-semibold mb-3">Recently Applied Leaves</Text>

      <FlatList
        data={recentLeaves}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="bg-white flex-row items-center p-3 rounded-xl mb-3 shadow shadow-gray-200">
            <View className="w-9 h-9 justify-center items-center mr-3">
              {item.icon}
            </View>
            <View>
              <Text className="font-semibold text-sm">{item.type}</Text>
              <Text className="text-gray-500 text-sm">{item.date}</Text>
            </View>
          </View>
        )}
      />
    </LinearGradient>
  );
};

export default Home;
