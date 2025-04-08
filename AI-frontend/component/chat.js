import React from "react";
import { useState,useEffect } from "react";
import { FlatList, SafeAreaView, TouchableOpacity,Text,View,Image } from "react-native";
import { styles } from "../Loginstyle";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Chat(){
const IP_Address ='192.168.1.5'
  const navigation = useNavigation()
  const [chats,setChats] = useState()
  useEffect(()=>{
    console.log('hello')

    const unsubscribe = navigation.addListener('focus', (e) => {
      console.log('Profile Screen Focused');
      handleGetChat()
    });

    return unsubscribe;
    

      
    
    
  },[navigation])
  async function handleGetChat(){
    try{
      const PhoneNumber = await AsyncStorage.getItem("PhoneNumber")
console.log('dunction')
    const input = {PhoneNumber:PhoneNumber}
    console.log(input)
    const res = await fetch(`http://${IP_Address}:5000/getChat`,{
      method:"POST",
      headers:{'content-type':'application/json'},
      body:JSON.stringify(input)
    })
     const data = await res.json()
     console.log(data.chat)
     setChats(data.chat)
    }catch(e){
      console.log(e)
    }
    
  }
  function handleNavigate(i){
        navigation.navigate('Agent',{chat:i})
  }
    
  

  return(
    <SafeAreaView style={styles.container}>
      <Image source={require("../assets/history.png")} style={{width:300,height:200,borderRadius:20 }}></Image>
      
      <FlatList  data={chats} renderItem={({item})=>(
        console.log('hello inside render',item.conversation[0]),
        <View style={{padding:10,gap:10}}>
        <TouchableOpacity style={{backgroundColor:'#2A2A3A',padding:20,
                 borderWidth:1,borderColor:'gray',borderRadius:20}} onPress={()=>(handleNavigate(item.conversation))}>
          
          <Text numberOfLines={2} style={{color:'white'}}>{item.conversation[0].user} {item.conversation[0].message}</Text>
          <Text style={{color:'white'}}>{item.Agent_id}</Text>
          <Text style={{color:'gray',position:'absolute',bottom:10,right:10}}>{item.time_Stamp[1]}</Text>
        </TouchableOpacity>
        </View>
      )}/>
    </SafeAreaView>
  )
}