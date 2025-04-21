import { View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { styles } from '../Loginstyle'
import {Ionicons} from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'
import HeaderTag from './header'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal } from 'react-native';

function Profile  ()  {
    const [msg,setMessage] = useState()
    const [user,setUser] = useState()
    const [visible,setVisible] = useState()
    const [loading,setLoading] = useState()
    const IP_Address = process.env.EXPO_PUBLIC_IP_ADDRESS
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
              })

              const data = await res.json()
              setUser(data.user)
              if(data.message){
                setVisible(true)
                setMessage(data.message)
              }
            console.log('after recieve')
              
    }
    function handlePress(){
      console.log(user)
      navigation.navigate('Premium',{
        user:user
      })
    }

    const {width,height} = Dimensions.get('window')

  return (

    <SafeAreaView style={styles.container}>
      {visible &&
                  <Modal transparent={true} >
                  <View style={{height: 'auto',
                  padding:20,
                  width: width* 0.8,
                  backgroundColor: 'white',
                  alignItems:'center',
                  borderRadius:20,
                  position: 'absolute',
                  left:30,bottom:'50%'}}>
                    <Text  >{msg}</Text>
                    <View style={{flexDirection:'row',gap:20,margin:20}}>
                      <TouchableOpacity onPress={()=>(setVisible(false))}>
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
        
        <>
        
        <Text style={{...styles.cardText,fontSize:25}}><Ionicons name={'person'} size={20}></Ionicons>profile</Text>
        <View style={{margin:20}}>
        <Text style={styles.profileDetails}><Ionicons name={'phone-portrait-outline'} size={15}></Ionicons>  {user.Phno}</Text>
        <Text style={styles.profileDetails}><Ionicons name={'person-circle-outline'} size={15}></Ionicons>  {user.userName}</Text>
        
        {user.subcription.nextRenew && <Text style={styles.profileDetails}><Ionicons name={'calendar-clear'}></Ionicons>Next Renewal Date {user.subcription.nextRenew} </Text>}
        </View></>}
       
      
      <View style={{backgroundColor:'#ffb700',padding:10,borderRadius:10,width:'90%',alignItems:'center',position:'absolute',bottom:10}}>
      <TouchableOpacity  onPress={handleLogOut}><Text style={{color:'white',fontWeight:400,fontSize:20}}>LogOut</Text></TouchableOpacity>
      </View>
     
    </SafeAreaView>
     
  )
}

export default Profile