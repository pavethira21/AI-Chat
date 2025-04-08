import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Ionicons} from '@expo/vector-icons';
import { Image } from "react-native"
import { styles } from '../Loginstyle'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import { Dimensions } from 'react-native';




function HeaderTag () {
   
    const [credit,setCredit] = useState()
     const IP_Address ='192.168.1.5'
    const navigation = useNavigation()

    useEffect(() => {
      handleCredit()
      const unsubscribe = navigation.addListener('tabPress', (e) => {
        console.log('Profile Screen Focused');
        handleCredit()
      });
  
      return unsubscribe;
    }, [navigation]);

    function handleNavigate(){
        navigation.navigate('Profile')
       }

   async function handleCredit(){
    
        try{
          const PhoneNumber = await AsyncStorage.getItem('PhoneNumber')
          console.log(PhoneNumber)
          let res= await fetch(`http://${IP_Address}:5000/getCredit`,{
            method:"POST",
                headers:{'content-type':'application/json'}, 
                body:JSON.stringify({PhoneNumber:PhoneNumber})
              }).then(response=>response.json())
              .then(data=>(setCredit(data.credit)))
        }catch(e){
          console.log(e)
        }
        
    }  
   
  return (
    <View style={{backgroundColor:'#121526',flexDirection:'row',width:'100%'}}>
      {credit&&console.log(credit)}
      <TouchableOpacity  onPress={handleNavigate}  style={{height:50,width:50,position:'absolute',left:0}}>
     <Text><Ionicons name={'person-circle-outline'} color={'orange'} size={25}/></Text>
      </TouchableOpacity>
      <View style={{color:'white',position:'absolute',right:0,flexDirection:'row'}}>
        <Ionicons name={'star'} color={'orange'} size={25}></Ionicons>
        <Text style={{color:'white'}}> {credit} </Text> 
      </View>
    </View>
  )
}

export default HeaderTag