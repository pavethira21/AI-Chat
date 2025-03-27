import * as SecureStore from 'expo-secure-store';
import { View,Text,Image, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { styles } from '../Loginstyle';
import { SafeAreaView } from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import { useEffect, useState } from 'react';

export default function Agent(){
    const [responses , setResponses] = useState([])
    const [message,setMessage] = useState()
    const [Type,setType] = useState()
    const Name = SecureStore.getItemAsync('agentName')
    const IP_Address ='192.168.1.32'
    async function handleChat(){
        const inputMsg ={user:message}
        if(message?.length >5){
            const input = {agentId:'3',type:Type,message:inputMsg}
            setResponses(prev =>[...prev,message])
        let res = await fetch(`http://${IP_Address}:5000/agent`,{
            method:"POST",
            headers:{'content-type':'application/json'},
            body:JSON.stringify(input)
          }).then(response => response.json())
          .then(data=>{setResponses(prev =>[...prev,data])})
          
        }
        
    }
    


    
    
    return(
        <>
        {responses && console.log(responses)}
        <SafeAreaView style={styles.container}>
            
            <Image source={require("../assets/character.png")} style={{width:"200",height:'200',borderRadius:20 }}></Image>
                <Text style={{color:'white'}}>Hello! How Can I Help You Today? </Text>
               
                <KeyboardAvoidingView style={{flexDirection:'row',position:'absolute',bottom:20,}} >
                    
                    <TextInput multiline={true} style={{backgroundColor:'white',width:'320',borderStartStartRadius:10,borderEndStartRadius:10}} value={message} onChangeText={(e)=>{setMessage(e) ,setType('Text')}}  ></TextInput>
                    
                    
               
                <TouchableOpacity onPress={handleChat} style={{backgroundColor:'#9400D3',borderRadius:40,width:50 ,justifyContent:'center',alignItems:'center'}} ><Ionicons style={{color:'white',position:'absolute'}}  name={(message&&message.length>1?"send":"mic")} size={25} /></TouchableOpacity>
                </KeyboardAvoidingView>
        </SafeAreaView>
        </>
        
    )
}