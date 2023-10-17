import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';

import Tab1 from "../spends/screens/Tab1";
import Tab2 from "../spends/screens/Tab2";
import Addrecord from "../spends/screens/Addrecord";
import Tab4 from "../spends/screens/Tab4";
import Tab5 from "../spends/screens/Tab5";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{
        headerStyle: { backgroundColor: "orange" },
        headerTintColor: "black",
        tabBarActiveTintColor: "orange",
        tabBarStyle: { backgroundColor: "black" },
      }} initialRouteName="T1">
        <Tab.Screen options={{
          tabBarIcon: ({ color }) => {
            return (
                <AntDesign name="home" size={24} color={color} />
            );
          }
        }} name="หน้าหลัก" component={Tab1} />
        <Tab.Screen options={{
          tabBarIcon: ({ color }) => {
            return (
                <AntDesign name="search1" size={24} color={color} />
            );
          }
        }} name="ตรวจสอบ" component={Tab2} />
        <Tab.Screen options={{
          tabBarIcon: ({ color }) => {
            return (
                <AntDesign name="pluscircleo" size={24} color={color} />
            );
          }
        }} name="เพิ่มรายการ" component={Addrecord} />
        <Tab.Screen options={{
          tabBarIcon: ({ color }) => {
            return (
                <AntDesign name="barschart" size={24} color={color} />
            );
          }
        }} name="เปรียบเทียบ" component={Tab4} />
        <Tab.Screen options={{
          tabBarIcon: ({ color }) => {
            return (
                <AntDesign name="bells" size={20} color={color} />
            );
          }
        }} name="การแจ้งเตือน" component={Tab5} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
