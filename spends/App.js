import React from "react";
import { StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

import Home from "../spends/screens/Home";
import Checklist from "./screens/Checklist";
import Addrecord from "../spends/screens/Addrecord";
import Tab4 from "../spends/screens/Tab4";
import Tab5 from "../spends/screens/Tab5";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: "orange" },
            headerTintColor: "black",
            tabBarActiveTintColor: "orange",
            tabBarStyle: { backgroundColor: "black", flexDirection: 'row', justifyContent: 'space-between', height:90 },
            headerTitleAlign: 'center',
          }}
          
          initialRouteName="T1"
        >
          <Tab.Screen
            options={{
              tabBarIcon: ({ color }) => (
                <AntDesign name="home" size={24} color={color} />
              ),
            }}
            name="หน้าหลัก"
            component={Home}
          />
          <Tab.Screen
            options={{
              tabBarIcon: ({ color }) => (
                <AntDesign name="search1" size={24} color={color} />
              ),
            }}
            name="ตรวจสอบ"
            component={Checklist}
          />
          <Tab.Screen
            name="เพิ่มรายการ"
            component={Addrecord}
            options={{

              tabBarIcon: ({ color }) => (
                <View style={styles.iconContainer}>
                  <AntDesign name="pluscircleo" size={50} color={color} />
                </View>
              ),
            }}
          />
          <Tab.Screen
            options={{
              tabBarIcon: ({ color }) => (
                <AntDesign name="barschart" size={24} color={color} />
              ),
            }}
            name="เปรียบเทียบ"
            component={Tab4}
          />
          <Tab.Screen
            options={{
              tabBarIcon: ({ color }) => (
                <AntDesign name="bells" size={20} color={color} />
              ),
            }}
            name="การแจ้งเตือน"
            component={Tab5}
          />
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: "black",
    borderRadius: 80,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    bottom: 0,
    zIndex: 1,
    width: 70,
    height: 70,
  },
});
