import React from "react";
import { StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

import Home from "../spends/screens/Home";
import Checklist from "./screens/Checklist";
import Addrecord from "../spends/screens/Addrecord";
import Tab4 from "../spends/screens/Tab4";
import Notification from "./screens/Notification";
import ChecklistDetail from "./Details/Checklistdetail";
import SetNotification from "./Details/SetNotification";

const Tab = createBottomTabNavigator();
const ChecklistNavigator = createNativeStackNavigator();
const SetNotiNavigator = createNativeStackNavigator();

function ChecklistStack() {
  return (
    <ChecklistNavigator.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#EC8032" },
        headerTintColor: "black",
        headerTitleAlign: "center",
      }}
    >
      <ChecklistNavigator.Screen
        name="ตรวจสอบ"
        component={Checklist}
      />
      <ChecklistNavigator.Screen
        name="แก้ไขรายการ"
        component={ChecklistDetail}
      />
    </ChecklistNavigator.Navigator>
  );
}

function SetNotiStack() {
  return (
    <SetNotiNavigator.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#EC8032" },
        headerTintColor: "black",
        headerTitleAlign: "center",
      }}
    >
      <SetNotiNavigator.Screen
        name="การแจ้งเตือน"
        component={Notification}
      />
      <SetNotiNavigator.Screen
        name="แก้ไขการแจ้งเตือน"
        component={SetNotification}
      />
    </SetNotiNavigator.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: "#EC8032" },
            headerTintColor: "black",
            tabBarActiveTintColor: "#EC8032",
            tabBarStyle: {
              backgroundColor: "black",
              flexDirection: "row",
              justifyContent: "space-between",
              height: 80,
            },
            headerTitleAlign: "center",
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
              headerShown: false,
            }}
            name="ตรวจสอบ"
            component={ChecklistStack}
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
              headerShown: false,
            }}
            name="การแจ้งเตือน"
            component={SetNotiStack}
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
    height: 80,
  },
});
