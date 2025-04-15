import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import './global.css'
import Home from "components/Home";
import History from "components/History";
import ApplyLeave from "components/ApplyLeave";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({route})=>({
        tabBarActiveTintColor: "#1d4ed8", 
        tabBarInactiveTintColor: "#6b7280", 
        tabBarStyle: {
          backgroundColor: "#f9fafb", 
          height: 60,
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb", 
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Home") {
            return <FontAwesome5 name="home" size={size} color={color} />;
          } else if (route.name === "Apply Leave") {
            return <MaterialIcons name="assignment" size={size} color={color} />;
          } else if (route.name === "History") {
            return <FontAwesome5 name="history" size={size} color={color} />;
          }
        }
      })}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Apply Leave" component={ApplyLeave} />
        <Tab.Screen name="History" component={History} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
