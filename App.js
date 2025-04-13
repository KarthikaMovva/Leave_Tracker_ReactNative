import React from "react";
import './global.css';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "components/Home";
import History from "components/History";
import ApplyLeave from "components/ApplyLeave";

const App=()=>{
    const Tab=createBottomTabNavigator();
    return(
        <NavigationContainer>
            <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Apply Leave" component={ApplyLeave} />
            <Tab.Screen name="History" component={History} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default App;