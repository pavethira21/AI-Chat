import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './component/login'
import Home from './component/home'
import BottomNavigate from './component/BottomNavigate';
import { styles } from './Loginstyle'; 
import {StyleSheet,  Text, View } from 'react-native';
import Register from './component/registration';
import Agent from './component/agent';
const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="Agent">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name='BtNv' component={BottomNavigate}/>
        {/* <Stack.Screen name='Home' component={Home}/> */}
        <Stack.Screen name='Register' component={Register}/>
        <Stack.Screen name='Agent' component={Agent}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}



