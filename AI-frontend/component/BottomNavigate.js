import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './home';
import {Ionicons} from '@expo/vector-icons';
import Chat from './chat';
import Subcription from './subcription';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './login';
import ChatCards from './chatCards';
import SubUsers from './subUsers';



export default function BottomNavigate() {
  const [sub,setSub] = useState(true)
  const [user,setUser] = useState({})
    useEffect(()=>{
      console.log('useEffect')
      getUserStatus()
    },[])
    const IP_Address ='192.168.1.17'

    async function getUserStatus(){
      console.log('hello')
        const phno = await AsyncStorage.getItem("PhoneNumber")
       
        const user = await fetch(`http://${IP_Address}:5000/getUser`,{
          method:"POST",
          headers:{'content-type':'application/json'},
          body:JSON.stringify({PhoneNumber:phno})

        })
        const userData = await user.json()
        console.log(userData)
        setUser(userData.user)
        const status = userData.user.subcription.Status
        status == 'Active'? setSub(true):setSub(false)
        console.log('status',status)
    }
     console.log('bottom nav')
    const Tab = createBottomTabNavigator();
    
  return (
    <Tab.Navigator screenOptions={{headerShown:false,tabBarActiveTintColor:'#A357EF',tabBarInactiveTintColor:'gray',tabBarActiveBackgroundColor:'#121526',tabBarInactiveBackgroundColor:'#121526'}} >
      <Tab.Screen
    name="Home"
    component={sub?SubUsers:Home}
    initialParams={{user:user}}
    options={{
      unmountOnBlur:true,   
      tabBarIcon: ({size,focused}) => focused?<Ionicons name="home" color={'#A357EF'} size={size} />:<Ionicons name="home-outline" color={'gray'} size={size} />
      
    }}
  />
      <Tab.Screen name={sub?"Ask AI":"Chat History"} component={sub?Home:Chat}
      options={{tabBarIcon :({size,focused}) => focused?<Ionicons name="chatbubbles" color={'#A357EF'} size={size} />:<Ionicons name="chatbubbles-outline" color={'gray'} size={size} />}}
      />
      <Tab.Screen name={sub?"Premium":"Chat History"} component={sub?Chat:Subcription} 
      options={{tabBarIcon :({size,focused}) => focused? <Ionicons name={sub?"chatbubbles":"star"} color={'#A357EF'}  size={size} />:<Ionicons name={sub?"chatbubbles-outline":"star-outline"} color={'gray'} size={size} />}}
      />
    </Tab.Navigator>
  )
}