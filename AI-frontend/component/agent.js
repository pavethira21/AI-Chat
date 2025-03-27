import * as SecureStore from 'expo-secure-store';
import { View,Text,Image, TextInput, TouchableOpacity, KeyboardAvoidingView, FlatList, ScrollView } from 'react-native';
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
            const input = {agentId:'3',type:Type,message:message,PhoneNumber:'9565361425'}
            setResponses(prev =>[...prev,inputMsg])
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
                <Text style={{color:'white'}}>Hello! I can help you? </Text>
                <View style={{marginBottom:'20'}}>
                    {responses?<FlatList data={responses} renderItem={({item,index})=>(
                        <View key={index} style={{padding:10}}>
                        {item.user?
                        <View style={{position:'absolute',right:0,backgroundColor:'#A357EF',padding:10,elevation:10,marginBottom:30,borderRadius:20}}>
                        <Text style={{color:'white',padding:10}}>{item.user}</Text>
                        </View>:
                        <View style={{flexDirection:'row',marginBottom:10,marginTop:50}}>
                            <Image source={require('../assets/character.png') } style={{height:'15%',width:'15%',}}></Image>
                        <ScrollView style={{backgroundColor:'#3B3E45',height:250
                            ,borderBottomLeftRadius:20,borderBottomRightRadius:20,borderTopRightRadius:20,elevation:9
                        }}>

                        <Text style={{color:"white" , padding:10,marginBottom:10}}>{item.message}</Text>
                        </ScrollView>
                        </View>
                        }
                        
                        
                        </View>
                        
                    )}/>:<Text style={{color:'white'}}>ask me anything</Text>}
               
               </View>
                <KeyboardAvoidingView style={{flexDirection:'row',position:'absolute',bottom:0,gap:10,padding:20,backgroundColor:'#121526'}} >
                    
                    <TextInput multiline={true} style={{backgroundColor:'white',width:'320',borderStartStartRadius:10,borderEndStartRadius:10}} value={message} onChangeText={(e)=>{setMessage(e) ,setType('Text')}}  ></TextInput>
                    
                    
               
                    {(message&&message.length>1)?<TouchableOpacity onPress={handleChat} style={{backgroundColor:'#9400D3',borderRadius:40,width:50 ,justifyContent:'center',alignItems:'center'}} ><Ionicons style={{color:'white',position:'absolute'}}  name={"send"} size={25} /></TouchableOpacity>:
                    <TouchableOpacity style={{backgroundColor:'#9400D3',borderRadius:40,width:50 ,justifyContent:'center',alignItems:'center'}} ><Ionicons style={{color:'white',position:'absolute'}}  name={"mic"} size={25}/></TouchableOpacity>}
                </KeyboardAvoidingView>
                
        </SafeAreaView>
        </>
        
    )
}