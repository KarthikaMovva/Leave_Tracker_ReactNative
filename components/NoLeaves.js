import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import {MaterialCommunityIcons} from "@expo/vector-icons"
const NoLeaves=()=>{
    const navigation = useNavigation();

    return(
        <View className="flex-1 items-center justify-center mt-32">
        <MaterialCommunityIcons
          name="calendar-remove-outline"
          size={40}
          color="#9ca3af"
          style={{ alignSelf: 'center' }}
        />
        <Text className="text-lg text-gray-500 text-center mt-4 font-semibold">
          No leaves found 👌
        </Text>
        <TouchableOpacity
          className="w-30 h-15 bg-red-400 p-3 mt-4 rounded-full"
          onPress={() => navigation.navigate('Apply Leave')}
        >
          <Text className="text-white font-semibold text-xl text-center">Apply Leave</Text>
        </TouchableOpacity>
      </View>
    )
}

export default NoLeaves;