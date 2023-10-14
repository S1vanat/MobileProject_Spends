import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";


import Tab1 from "../spends/screens/Tab1";
import Tab2 from "../spends/screens/Tab2";
import Tab3 from "../spends/screens/Tab3";
import Tab4 from "../spends/screens/Tab4";
import Tab5 from "../spends/screens/Tab5";


const Tab = createBottomTabNavigator();

export default function App() {
 return (
  <NavigationContainer>
  <Tab.Navigator initialRouteName="T1">
  <Tab.Screen name= "Tab_1" component={Tab1} />
  <Tab.Screen name= "Tab_2" component={Tab2} />
  <Tab.Screen name= "Tab_3" component={Tab3} />
  <Tab.Screen name= "Tab_4" component={Tab4} />
  <Tab.Screen name= "Tab_5" component={Tab5} />
  </Tab.Navigator>
  </NavigationContainer>
 ); }