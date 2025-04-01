import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './home';
import {Ionicons} from '@expo/vector-icons';
import Chat from './chat';
import Subcription from './subcription';



export default function BottomNavigate() {
    const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator screenOptions={{headerShown:false,tabBarLabelStyle:{color:'#A357EF'}}} >
      <Tab.Screen
    name="Home"
    component={Home}
   
    options={{
      tabBarIcon: ({size}) => <Ionicons name="home" color={'#A357EF'} size={size} />,
      
    }}
  />
      <Tab.Screen name="Chat" component={Chat}
      options={{tabBarIcon :({size}) => <Ionicons name="chatbubbles" color={'#A357EF'} size={size} />}}
      />
      <Tab.Screen name="Premium" component={Subcription} 
      options={{tabBarIcon :({size}) => <Ionicons name="star" color={'#A357EF'} size={size} />}}
      />
    </Tab.Navigator>
  );
}