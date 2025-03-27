import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './home';

import Chat from './chat';
import Subcription from './subcription';



export default function BottomNavigate() {
    const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator screenOptions={{headerShown:false}} >
      <Tab.Screen name="Home" component={Home}  />
      <Tab.Screen name="Chat" component={Chat}/>
      <Tab.Screen name="Premium" component={Subcription} />
    </Tab.Navigator>
  );
}