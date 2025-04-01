import { FlatList, FlatListComponent, Text,TouchableOpacity,View } from "react-native"
import { styles } from "../Loginstyle"
import { Image } from "react-native"
import { useEffect, useState } from "react"

import { SafeAreaView } from "react-native-safe-area-context"
import Config from 'react-native-config';
import {Ionicons} from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native"
import * as SecureStore from 'expo-secure-store';
import HeaderTag from "./header"






export default function Home(){
    //const IP_Address= process.env.IP_Address
    const navigation = useNavigation()
    const [agents ,setAgents] = useState([])
    const IP_Address ='192.168.1.8'

    console.log(IP_Address)
    async  function handleAgent(item){
        console.log(item)
        try {
          await SecureStore.setItemAsync("agent", item.Agent_id);
          navigation.navigate('Agent');
      } catch (error) {
          console.error("Error storing agent:", error);
      }
      
    }
    async function getAgents(){
         await fetch(`http://${IP_Address}:5000/getAgent`,{
            method:"POST",
            headers:{'content-type':'application/json'}
           
          }).then(response => response.json())
          .then(data=>{ setAgents(data.agents)})
    }
    useEffect(()=>{
       getAgents()
        
    },[])
    console.log(agents)
    return( 
           // contentContainerStyle={styles.grid} 
           <SafeAreaView style={styles.container}>
            <HeaderTag></HeaderTag>
            <Image source={require("../assets/character.png")} style={{width:"200",height:'200',borderRadius:20 }}></Image>
            <Text style={{...styles.cardText,marginBottom:20}}>Hi Im your english Tutor!</Text>
            <FlatList data={agents} numColumns={2}  renderItem={({item,index}) =>(
                <TouchableOpacity onPress={()=>{handleAgent(item)}} key={index} style={styles.card}>
                <Ionicons style={styles.icon}  name={item.icon} size={25} />
            
            <Text style={styles.cardText}>{item.Name}</Text>
            <Text style ={styles.description} >{item.Description}</Text>
            <Ionicons style={{color:'#B0B0C3'}} size={20} name={"arrow-redo"}></Ionicons>
            </TouchableOpacity>
                
            )

            }/>
            </SafeAreaView> 
       
        
    )
       
    
}

  