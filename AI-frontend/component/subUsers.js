
import { FlatList, Text,View,SafeAreaView,Image, Pressable } from "react-native"
import React, { useState,useEffect } from 'react'
import { styles } from "../Loginstyle"
import HeaderTag from "./header"
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"

function SubUsers () {
    const navigation = useNavigation()
    const [excer,setExcer] = useState()
     function handleAgentNavigate(id) {
        navigation.navigate('Agent',{
          agentId:id
        }) 
    }
    function handleExcerciseNavigate(ex){
      navigation.navigate('SubUser',{
        item:ex
      })
    }
    const IP_Address = '192.168.1.17'
    async function fetchExcersice(){
      console.log('excersice fetch')
      let res = await fetch(`http://${IP_Address}:5000/getExcercise`,{
        method:"POST",
        headers: { 'Content-Type': 'application/json' },

      })

      const data = await res.json()
      console.log(data)
      setExcer(data.excercise)

    }


    useEffect(()=>{
      console.log('useeffect fetch')
      fetchExcersice()
      const unsubscribe = navigation.addListener('tabPress', (e) => {
        console.log('Profile Screen Focused');
        fetchExcersice()
      });
  
      return unsubscribe;

    },[navigation])

    const agents_sub = [{Name:'Draft an Email',description:'Write professional email &messages with AI ',agentId:3,color:["#FFA500","#e76d2c"],img:require('../assets/young-woman.png')},
    {Name:"Translate",description:"Translate from any language to english",agentId:1,color:['#7cfc00','#0bda51'],img:require('../assets/english.png')}]
  return (
    <SafeAreaView style={styles.container}>
             
             <HeaderTag></HeaderTag>
              <View style={{height:310}}>
             <FlatList  showsHorizontalScrollIndicator={false}  data={agents_sub}   
             contentContainerStyle={{ paddingHorizontal: 20, marginTop: 50 }}
        keyExtractor={(item, index) => index.toString()} horizontal renderItem={({item})=>(
               <LinearGradient style={{height: 200,width: 300,borderRadius: 20, padding: 20,marginRight: 15,justifyContent: "space-between",overflow: "hidden",}} colors={item.color}>
              <Pressable onPress={()=>handleAgentNavigate(item.agentId)} style={{ flex: 1 }}>
                <Text  style={{color: "Black",fontSize: 18,fontWeight: "bold",marginBottom: 10,}}>{item.Name}</Text>
                <Text numberOfLines={3}  style={{color: "Black",fontSize: 14,lineHeight: 20,width: "70%",}} >{item.description}</Text>
                <Image source={item.img} style={{height:100,width:100,position:'absolute',bottom:10,resizeMode:'contain',right:10}} ></Image>
               
              </Pressable>
              </LinearGradient>
              
             )}/>  
             </View>
             
             
             <View style={{marginTop:10,height:5,width:'100%',backgroundColor:'gray'}}/>
             <Text style={{color:'white', fontSize: 16, fontWeight: "500" }}>English at Office</Text>
             <FlatList  style={{gap:20}} data={excer} keyExtractor={(item,index)=>index.toString()}
             renderItem={({item})=>{
              if(item.Category ==='Office'){
                return(
                  <Pressable onPress={()=>handleExcerciseNavigate(item)}>
              
                  <View style={{backgroundColor:'#2A2A3A',marginTop:10,padding:20,flexDirection:'row',alignItems:'center'}}>
                   <Text style={{color:'white'}}>{item.Name}</Text>
                   <Ionicons color={'gray'} size={25} name={'arrow-forward-outline'}></Ionicons>
                   </View>
                   </Pressable>
                )
              }}}
             
              
             
             
             
             />
             

              
    <View style={{marginTop:10,height:3,width:'100%',backgroundColor:'gray'}}/>
              <Text style={{color:'white', fontSize: 16, fontWeight: "500" }}>Basic english at restaurant</Text>
              <FlatList  style={{gap:20}} data={excer} keyExtractor={(item,index)=>index.toString()}
             renderItem={({item})=>{
              if(item.Category ==='restaurant'){
                return(
                  <Pressable onPress={()=>handleExcerciseNavigate(item)}>
              
                  <View style={{backgroundColor:'#2A2A3A',padding:20,marginTop:10,flexDirection:'row',alignItems:'center'}}>
                   <Text style={{color:'white'}}>{item.Name}</Text>
                   <Ionicons color={'gray'} size={25} name={'arrow-forward-outline'}></Ionicons>
                   </View>
                   </Pressable>
                )
              }}}
             />
              <View style={{marginTop:10,height:3,width:'100%',backgroundColor:'gray'}}/>
  
  <Text style={{color:'white', fontSize: 16, fontWeight: "500" }}>Basic english while Travelling</Text>
  <FlatList   data={excer} keyExtractor={(item,index)=>index.toString()}
             renderItem={({item})=>{
              if(item.Category ==='Travel'){
                return(
                  <Pressable onPress={()=>handleExcerciseNavigate(item)} style={{gap:20}} >
              
                  <View style={{backgroundColor:'#2A2A3A',marginTop:10,padding:20,flexDirection:'row',alignItems:'center'}}>
                   <Text style={{color:'white'}}>{item.Name}</Text>
                   <Ionicons color={'gray'} size={25} name={'arrow-forward-outline'}></Ionicons>
                   </View>
                   </Pressable>
                )
              }}}
             />
  <View style={{marginTop:10,height:3,width:'100%',backgroundColor:'gray'}}/>
  <Text style={{color:'white', fontSize: 16, fontWeight: "500" }}>Talk about your interest and Hobbies</Text>
  
</SafeAreaView> 
  )
}

export default SubUsers