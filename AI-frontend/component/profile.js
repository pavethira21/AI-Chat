import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { styles } from '../Loginstyle'
import {Ionicons} from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'
import HeaderTag from './header'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal } from 'react-native';

function Profile  ()  {
    const [user,setUser] = useState()
    const [msg,setMessage] = useState()
     const IP_Address ='192.168.1.17'
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
              .then((data)=>{setUser(data.user),setMessage(data.message)})
            console.log('after recieve')
              
    }
    function handlePress(){
      navigation.navigate('Premium')
    }

  return (

    <SafeAreaView style={styles.container}>
      {msg &&
                  <Modal transparent={true} >
                  <View style={{height: 'auto',
                  padding:20,
                  width: '80%',
                  backgroundColor: 'white',
                  alignItems:'center',
                  borderRadius:20,
                  position: 'absolute',
                  left:30,bottom:'50%'}}>
                    <Text  >{msg}</Text>
                    <View style={{flexDirection:'row',gap:20,margin:20}}>
                      <TouchableOpacity onPress={()=>(setVisible(!visible))}>
                        <Text >cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handlePress}>
                          <Text>Renew Subcription</Text>
                          </TouchableOpacity>
                    </View>
                  </View>
                  </Modal>
                }
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
        <Text style={styles.profileDetails}><Ionicons name={'calendar-clear'}></Ionicons>Next Renewal Date {user.subcription.nextRenew} </Text>
        </View>}
      
      
      <TouchableOpacity style={{backgroundColor:'orange',padding:10,borderRadius:10,width:'90%',alignItems:'center'}} onPress={handleLogOut}><Text style={{color:'white'}}>LogOut</Text></TouchableOpacity>
    </SafeAreaView>
  )
}

export default Profile