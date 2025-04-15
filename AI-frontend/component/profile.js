import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { styles } from '../Loginstyle'
import {Ionicons} from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'
import HeaderTag from './header'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';

function Profile  ()  {
    const [user,setUser] = useState()
     const IP_Address ='192.168.1.11'
    const navigation = useNavigation()
    useEffect(()=>{
        handleGetUser()
        
    },[])
    async function handleLogOut(){
        await AsyncStorage.removeItem("PhoneNumber")
        navigation.replace('Login')
    }
    function handleClose(){
      navigation.navigate('BtNv')
    }
    
    async function handleGetUser(){
        console.log('get user')
        const PhoneNumber = await AsyncStorage.getItem("PhoneNumber")
        console.log('get input')
        let res = await fetch(`http://${IP_Address}:5000/getUser`,{
            method:"POST",
                headers:{'content-type':'application/json'},
                body:JSON.stringify({PhoneNumber:PhoneNumber})
              }).then(response=>response.json()) 
              .then((data)=>{setUser(data.user)})
            console.log('after recieve')
              
    }

  return (
    <SafeAreaView style={styles.container}>
        <View style={{backgroundColor:'#121526',flexDirection:'row',width:'100%'}}>
      
      <TouchableOpacity  onPress={handleClose}  style={{height:50,width:50,position:'absolute',right:0}}>
     <Text style={{color:'white'}}><Ionicons name={'close'} color={'white'} size={25}/></Text>
      </TouchableOpacity>
      
    </View>
        {user &&
        
        <View>
        <Text style={{...styles.cardText,fontSize:25}}><Ionicons name={'person'} size={20}></Ionicons>profile</Text>
        <Text style={styles.profileDetails}><Ionicons name={'phone-portrait-outline'}></Ionicons>{user.Phno}</Text>
        <Text style={styles.profileDetails}><Ionicons name={'person-circle-outline'}></Ionicons>{user.userName}</Text>
        <Text style={styles.profileDetails}><Ionicons name={'heart'}></Ionicons>{user.Area_of_interest}</Text>
        </View>}
      
      
      <TouchableOpacity style={{backgroundColor:'orange',padding:10,borderRadius:10,width:'90%',alignItems:'center'}} onPress={handleLogOut}><Text style={{color:'white'}}>LogOut</Text></TouchableOpacity>
    </SafeAreaView>
  )
}

export default Profile