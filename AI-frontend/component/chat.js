import React from "react";
import { useState,useEffect,useRef } from "react";
import { FlatList, SafeAreaView, TouchableOpacity,Text,View,Image, Pressable, Dimensions } from "react-native";
import { styles } from "../Loginstyle";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Chat(){
  const IP_Address = process.env.EXPO_PUBLIC_IP_ADDRESS
  let date
  const navigation = useNavigation()
  const [chats,setChats] = useState()
  const [agentId,setAgentId]= useState()

  useEffect(()=>{
    console.log('hello')
    handleGetChat()
    const unsubscribe = navigation.addListener('focus', (e) => {
      console.log('Profile Screen Focused');
      handleGetChat()
    });

    return unsubscribe; 
  },[navigation,agentId])
  async function handleGetChat(){
    try{
      const PhoneNumber = await AsyncStorage.getItem("PhoneNumber")
console.log('dunction')
    const input = {PhoneNumber:PhoneNumber,agentId:agentId}
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
    
  
 const agents =[
  {Name:'Translate To English',id:'1'},
  {Name:'Draft an email',id:'3'},
  {Name:'correct Grammar',id:'5'},
  {Name:'Write an Essay',id:'7'},
  {Name:'General Knowledge',id:'9'},
  {Name:'Chat with   AI',id:'11'},
 ]
 const {width,height} = Dimensions.get('window')
  
  return(
    <SafeAreaView style={styles.container}>
      <Image source={require("../assets/history.png")} style={{width:width* 0.8,height:height * 0.25,borderRadius:20 }}></Image>
      <View >
      <FlatList horizontal data={agents} style={{maxHeight:height * 0.06}}  renderItem={({item})=>(
        <Pressable onPress={()=>setAgentId(item.id)} style={{borderColor:(agentId==item.id?'white':'gray'),borderWidth:1,borderRadius:20,marginRight:10}} >
        <Text style={{padding:10,color:'white'}}>{item.Name}</Text>

        </Pressable> 
      )  
      }/>
      

     
      
     {chats?.length>=1?
     
     
    
     <FlatList  data={chats} renderItem={({item})=>{

     
       
       const currentDate = item.time_Stamp[0];
       const showDate = date !== currentDate;
       if (showDate) date = currentDate;
       const convo = item.conversation?.[0];
    if (!convo) return null;
      return(
      
      <View style={{padding:10,gap:10}}>


      {(showDate &&<Text style={{color:'gray'}}>{ currentDate}</Text>)}
        

        
        
      <TouchableOpacity style={{backgroundColor:'#2A2A3A',padding:20,
               borderWidth:1,borderColor:'gray',borderRadius:20}} onPress={()=>(handleNavigate(item.conversation))}>
        
        <Text numberOfLines={2} style={{color:'white'}}>{item.conversation[0].user} {item.conversation[0].message}</Text>
        <Text >{item.Agent_id}</Text>
        
        <Text style={{color:'gray',position:'absolute',bottom:10,right:10}}>{item.time_Stamp[1]}</Text>
      </TouchableOpacity>
      </View>
  )}} /> :
    <View style={{alignItems:'center'}}>
    <Text style={{color:"white",margin:20}}>No History Found</Text>
    </View>
    }
      
      </View>
    </SafeAreaView>
  )
}