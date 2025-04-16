import Animated, { FadeInLeft } from 'react-native-reanimated';
import {
    Text,
    View,
    TouchableOpacity
  } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
  
  const RecentLeaveCard = ({ item, index }) => {

    const navigation = useNavigation();

    const LEAVE_TYPES = {
        Sick: {
          icon: <MaterialIcons name="medical-services" size={35} color="#e11d48" />,
          bg: "#fff5f5",
        },
        Casual: {
          icon: <MaterialCommunityIcons name="umbrella-beach" size={35} color="#fbbf24" />,
          bg: "#fffdea",
        },
        Earned: {
          icon: <FontAwesome5 name="briefcase" size={35} color="#10b981" />,
          bg: "#f0fdf4",
        },
        Default: {
          icon: <FontAwesome5 name="calendar-alt" size={22} color="#6b7280" />,
          bg: "#f9fafb",
        },
      };
      
      const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

    const type = LEAVE_TYPES[item.leaveType] || LEAVE_TYPES.Default;
    return (
      <Animated.View entering={FadeInLeft.delay(index * 100)}>
        <TouchableOpacity onPress={() => navigation.navigate("History")} activeOpacity={0.8}>
          <View
            style={{ backgroundColor: type.bg }}
            className="p-5 rounded-xl shadow-lg border border-gray-300 mb-3 flex-row space-x-4 items-start"
          >
            <View className="mt-1 justify-center items-center h-12 w-12">
              {type.icon}
            </View>
  
            <View className="flex-1 pl-5 space-y-1.5">
              <View className="flex-row justify-between mb-1 space-x-2">
                <Text className="text-gray-800 font-semibold text-xl" numberOfLines={1}>
                  {item.name}
                </Text>
              </View>
              <Text className="text-orange-600 mb-1 font-semibold text-lg">
                {item.startDate === item.endDate
                  ? formatDate(item.startDate)
                  : `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

export default RecentLeaveCard