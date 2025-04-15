
import { FlatList, FlatListComponent, Text,TouchableOpacity,View,SafeAreaView,Image, Pressable } from "react-native"
import React from 'react'
import { styles } from "../Loginstyle"
import HeaderTag from "./header"
import { useNavigation } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"

function SubUsers () {
    const navigation = useNavigation()
     function handleNavigate() {
        navigation.navigate('SubUser')
    }

    const agents_sub = [{Name:'Draft an Email',description:'Write professional email &messages with AI ',color:["#FFA500","#e76d2c"],img:require('../assets/young-woman.png')},
    {Name:"Translate",description:"Translate from any language to english",color:['#7cfc00','#0bda51'],img:require('../assets/english.png')}]
  return (
    <SafeAreaView style={styles.container}>
             
             <HeaderTag></HeaderTag>
              <View style={{height:310}}>
             <FlatList  showsHorizontalScrollIndicator={false}  data={agents_sub}   
             contentContainerStyle={{ paddingHorizontal: 20, marginTop: 50 }}
        keyExtractor={(item, index) => index.toString()} horizontal renderItem={({item})=>(
               <LinearGradient style={{height: 200,width: 300,borderRadius: 20, padding: 20,marginRight: 15,justifyContent: "space-between",overflow: "hidden",}} colors={item.color}>
              <Pressable style={{ flex: 1 }}>
                <Text  style={{color: "Black",fontSize: 18,fontWeight: "bold",marginBottom: 10,}}>{item.Name}</Text>
                <Text numberOfLines={3}  style={{color: "Black",fontSize: 14,lineHeight: 20,width: "70%",}} >{item.description}</Text>
                <Image source={item.img} style={{height:100,width:100,position:'absolute',bottom:10,resizeMode:'contain',right:10}} ></Image>
               
              </Pressable>
              </LinearGradient>
              
             )}/>
             </View>
             
             
             <View style={{marginTop:10,height:5,width:'100%',backgroundColor:'gray'}}/>
             <Text style={{color:'white', fontSize: 16, fontWeight: "500" }}>English at Office</Text>
             <View>
             <View style={{color:'#2A2A3A'}}>
              <Text style={{color:'white'}}>Discuss about the upcoming launch of your product</Text>
              
              </View>
              </View>
             <View style={{marginTop:10,height:3,width:'100%',backgroundColor:'gray'}}/>
  
              <Text style={{color:'white', fontSize: 16, fontWeight: "500" }}>Basic english at restaurant</Text>
              <View style={{marginTop:10,height:3,width:'100%',backgroundColor:'gray'}}/>
  
  <Text style={{color:'white', fontSize: 16, fontWeight: "500" }}>Basic english while shopping</Text>
  <View style={{marginTop:10,height:3,width:'100%',backgroundColor:'gray'}}/>
</SafeAreaView> 
  )
}

export default SubUsers