import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './home';
import {Ionicons} from '@expo/vector-icons';
import Chat from './chat';
import Subcription from './subcription';



export default function BottomNavigate() {
    const Tab = createBottomTabNavigator();
    
  return (
    <Tab.Navigator screenOptions={{headerShown:false,tabBarActiveTintColor:'#A357EF',tabBarInactiveTintColor:'gray',tabBarActiveBackgroundColor:'#121526',tabBarInactiveBackgroundColor:'#121526'}} >
      <Tab.Screen
    name="Home"
    component={Home}
   
    options={{
      unmountOnBlur:true,
      tabBarIcon: ({size,focused}) => focused?<Ionicons name="home" color={'#A357EF'} size={size} />:<Ionicons name="home-outline" color={'gray'} size={size} />
      
    }}
  />
      <Tab.Screen name="Chat History" component={Chat}
      options={{tabBarIcon :({size,focused}) => focused?<Ionicons name="chatbubbles" color={'#A357EF'} size={size} />:<Ionicons name="chatbubbles-outline" color={'gray'} size={size} />}}
      />
      <Tab.Screen name="Premium" component={Subcription} 
      options={{tabBarIcon :({size,focused}) => focused? <Ionicons name="star" color={'#A357EF'}  size={size} />:<Ionicons name="star-outline" color={'gray'} size={size} />}}
      />
    </Tab.Navigator>
  )
}