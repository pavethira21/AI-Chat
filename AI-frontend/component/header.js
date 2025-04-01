import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Ionicons} from '@expo/vector-icons';
import { Image } from "react-native"
import { styles } from '../Loginstyle'
import { useNavigation } from '@react-navigation/native'
import { Dimensions } from 'react-native';




function HeaderTag () {
    
    const [credit,setCredit] = useState()
    const IP_Address='192.168.1.8'
    const navigation = useNavigation()
    useEffect(()=>{
        handleCredit()
    },[])
    function handleNavigate(){
        navigation.navigate('Profile')
       }

   async function handleCredit(){
        // const PhoneNumber = await SecureStore.getItemAsync('PhoneNumber')
        let res= await fetch(`http://${IP_Address}:5000/getCredit`,{
          method:"POST",
              headers:{'content-type':'application/json'}, 
              body:JSON.stringify({PhoneNumber:'6958251478'})
            }).then(response=>response.json())
            .then(data=>(setCredit(data.credit)))
    }  
   
  return (
    <View style={{backgroundColor:'#121526',flexDirection:'row',width:'100%'}}>
      {credit&&console.log(credit)}
      <TouchableOpacity  onPress={handleNavigate}  style={{height:50,width:50,position:'absolute',left:0}}>
     <Text style={{color:'white'}}><Ionicons name={'person'} color={'orange'} size={25}/></Text>
      </TouchableOpacity>
      <View style={{color:'white',position:'absolute',right:0,flexDirection:'row'}}><Ionicons name={'star'} color={'orange'} size={25}></Ionicons>
      <Text style={{color:'white'}}>{credit}</Text> </View>
    </View>
  )
}

export default HeaderTag