import { FlatList, FlatListComponent, Text,TouchableOpacity,View } from "react-native"
import { styles } from "../Loginstyle"
import { Image } from "react-native"
import { useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import Config from 'react-native-config';
import {Ionicons} from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native"
import * as SecureStore from 'expo-secure-store';





export default function Home(){
    const navigation = useNavigation()
    const [agents ,setAgents] = useState([])
    const IP_Address ='192.168.1.32'
    console.log(IP_Address)
     function handleAgent(item){
        console.log("hello")
      SecureStore.setItemAsync("agentName",item.Name)
      navigation.navigate('Agent')
    }
    async function getAgents(){
        let res = await fetch(`http://${IP_Address}:5000/getAgent`,{
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
           
           <SafeAreaView style={styles.container}>
            <Image source={require("../assets/character.png")} style={{width:"200",height:'200',borderRadius:20 }}></Image>
            <Text style={{...styles.cardText,marginBottom:20}}>Hi Im your english Tutor!</Text>
            <FlatList data={agents} contentContainerStyle={styles.grid} renderItem={({item,index}) =>(
                (item.Agent_id%2!=0)&&<TouchableOpacity onPress={()=>{handleAgent(item)}} key={index} style={styles.card}>
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

  