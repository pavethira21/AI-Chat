import { FlatList, FlatListComponent, Text,TouchableOpacity,View,SafeAreaView } from "react-native"
import { styles } from "../Loginstyle"
import { Image } from "react-native"
import { useEffect, useState } from "react"


import Config from 'react-native-config';
import {Ionicons} from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderTag from "./header"






export default function Home(){
    const [PhoneNumber,setPhoneNumber] = useState()
    useEffect(()=>{
        getStored()
        
    },[])

    async function getStored(){
        const phoneNumber = await AsyncStorage.getItem("PhoneNumber")
        setPhoneNumber(phoneNumber)
        console.log(PhoneNumber)
         const token = await AsyncStorage.getItem('token')
        console.log(token)
    }
    
    //const IP_Address= process.env.IP_Address
    const navigation = useNavigation()

   

    const [agents ,setAgents] = useState([])
   const IP_Address ='192.168.1.17'

    console.log(IP_Address)
    async  function handleAgent(item){
        console.log(item)
        try {
          await AsyncStorage.setItem("agent", item.Agent_id);
          navigation.navigate('Agent');
      } catch (error) {
          console.error("Error storing agent:", error);
      }
      
    }
    async function getAgents(){
        console.log('inside Get Agent')
        try{
            await fetch(`http://${IP_Address}:5000/getAgent`,{
                method:"POST",
                headers:{'content-type':'application/json'}
               
              }).then(response => response.json())
              .then(data=>{ setAgents(data.agents)})
        }catch(e){
            console.log(e)
        }
         
    }
    useEffect(()=>{
       getAgents()
        
    },[])
    console.log(agents)
    
        return( 
           
           
            <SafeAreaView style={styles.container}>
             
             <HeaderTag></HeaderTag>
             <Text>{PhoneNumber ? `Phone Number: ${PhoneNumber}` : 'No phone number stored'}</Text>

             <Image source={require("../assets/Home.png")} style={{width:300,height:200,borderRadius:20 }}></Image>
             
             <FlatList data={agents} numColumns={2}  renderItem={({item,index}) =>(
                 <TouchableOpacity onPress={()=>{handleAgent(item)}} key={index} style={styles.card}>
                 <Ionicons style={styles.icon}  name={item.icon} size={25} />
             
             <Text style={styles.cardText}>{item.Name}</Text>
             <Text numberOfLines={2} style ={styles.description} >{item.Description}</Text>
             <Ionicons style={{color:'#A357EF',position:"absolute",bottom:5,right:5}} size={20} name={"arrow-forward-circle-outline"}></Ionicons>
             </TouchableOpacity>
                 
             )
 
             }/>
             </SafeAreaView> 
        
         
     )
    
    
       
    
}

  