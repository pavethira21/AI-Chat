import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Ionicons} from '@expo/vector-icons';
import { Image } from "react-native"
import { styles } from '../Loginstyle'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import { Dimensions } from 'react-native';




function HeaderTag () {
   const [visible,setVisible] = useState()
    const [credit,setCredit] = useState()
     const IP_Address ='192.168.1.17'
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
              })

              const data = await res.json()
              setCredit(data.credit)

              if(data.credit==0){
                setVisible(true)
              }

        }catch(e){
          console.log(e)
        }
        
    }  

    function handlePress(){
      navigation.navigate('subcription')
    }
   
  return (
    <View style={{backgroundColor:'#121526',flexDirection:'row',marginTop:20,width:'100%'}}>
      {visible ==true &&
                  <Modal transparent={true} >
                  <View style={{height: 'auto',
                  padding:20,
                  width: '80%',
                  backgroundColor: 'white',
                  alignItems:'center',
                  
                  position: 'absolute',
                  left:30,bottom:'50%'}}>
                    <Text  >Do you want to Purchase Credit?</Text>
                    <View style={{flexDirection:'row',gap:20,margin:20}}>
                      <TouchableOpacity onPress={()=>(setVisible(!visible))}>
                        <Text >cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handlePress}>
                          <Text>Confirm</Text>
                          </TouchableOpacity>
                    </View>
                  </View>
                  </Modal>
                }
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