import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './home';
import {Ionicons} from '@expo/vector-icons';
import Chat from './chat';
import Subcription from './subcription';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SubUsers from './subUsers';
import { ActivityIndicator, SafeAreaView } from 'react-native';
import { styles } from '../Loginstyle';



export default function BottomNavigate() {
  const [sub,setSub] = useState()
  const [user,setUser] = useState({})
  const [loading,setLoading] = useState(true)
    useEffect(()=>{
      console.log('useEffect')
      getUserStatus()
    },[])
    const IP_Address = process.env.EXPO_PUBLIC_IP_ADDRESS

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
        setLoading(false)
    }
     console.log('bottom nav')
    const Tab = createBottomTabNavigator();
    if(loading){
      return(
          <SafeAreaView style={{...styles.container,justifyContent:'center',alignItems:'center'}}>
              <ActivityIndicator color='purple' size='large'/>
          </SafeAreaView>
      )
  }
    
    if( sub){
      return (
        <Tab.Navigator screenOptions={{headerShown:false,tabBarActiveTintColor:'#A357EF',tabBarInactiveTintColor:'gray',tabBarActiveBackgroundColor:'#121526',tabBarInactiveBackgroundColor:'#121526'}} >
          <Tab.Screen
        name="Home"
        component={SubUsers}
        initialParams={{user:user}}
        options={{
          unmountOnBlur:true,   
          tabBarIcon: ({size,focused}) => focused?<Ionicons name="home" color={'#A357EF'} size={size} />:<Ionicons name="home-outline" color={'gray'} size={size} />
             
        }}
      />
          <Tab.Screen name={"Ask AI"} component={Home}
          options={{tabBarIcon :({size,focused}) => focused?<Ionicons name="chatbubbles" color={'#A357EF'} size={size} />:<Ionicons name="chatbubbles-outline" color={'gray'} size={size} />}}
          />
          <Tab.Screen name={"Chat History"} component={Chat} 
          options={{tabBarIcon :({size,focused}) => focused? <Ionicons name={"chatbubbles"} color={'#A357EF'}  size={size} />:<Ionicons name={"star-outline"} color={'gray'} size={size} />}}
          />
        </Tab.Navigator>
      )
    }else{
      return (
        <Tab.Navigator screenOptions={{headerShown:false,tabBarActiveTintColor:'#A357EF',tabBarInactiveTintColor:'gray',tabBarActiveBackgroundColor:'#121526',tabBarInactiveBackgroundColor:'#121526'}} >
          <Tab.Screen
        name="Home"
        component={ Home }
        initialParams={{user:user}}
        options={{
          unmountOnBlur:true,   
          tabBarIcon: ({size,focused}) => focused?<Ionicons name="home" color={'#A357EF'} size={size} />:<Ionicons name="home-outline" color={'gray'} size={size} />
             
        }}
      />
          <Tab.Screen name={"Chat History"} component={Chat}
          options={{tabBarIcon :({size,focused}) => focused?<Ionicons name="chatbubbles" color={'#A357EF'} size={size} />:<Ionicons name="chatbubbles-outline" color={'gray'} size={size} />}}
          />
          <Tab.Screen name={"Premium"} component={Subcription} 
          options={{tabBarIcon :({size,focused}) => focused? <Ionicons name={"star"} color={'#A357EF'}  size={size} />:<Ionicons name={"star-outline"} color={'gray'} size={size} />}}
          />
        </Tab.Navigator>
      )
    }
  
}