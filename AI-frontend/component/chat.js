
import React from 'react'
import { View,Text,Image, TextInput, TouchableOpacity, KeyboardAvoidingView, FlatList, ScrollView,Modal } from 'react-native';
import { styles } from '../Loginstyle';
import {Audio} from 'expo-av';
import { SafeAreaView } from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import { useEffect, useState } from 'react';

function Chat ()  {
  const [responses , setResponses] = useState([])
      const [loading,setLoading] = useState()
      const [message,setMessage] = useState()
      const [log,setlog] = useState([])
      const [Type,setType] = useState()
      const [isVisible,setVisible] = useState(true)
      const [recording,setRecording] = useState()
      const IP_Address = '192.168.1.8'

      

      // useEffect(()=>{
      //   handleGetChat()
      //   console.log(log)
      // },[responses])

      async function handleGetChat(){
        const input = {agentId:'11',type:'text',message:message,PhoneNumber:'9565361425'}
        let res = await fetch(`http://${IP_Address}:5000/getChat`,{
            method:"POST",
            headers:{'content-type':'application/json'},
            body:JSON.stringify(input)
          }).then(response => response.json())
          .then(data=>{setlog(prev =>[...prev,data.chat])})
          setMessage()
          setLoading(false)
          
          
        }
      

       
      
      async function handleChat(){
        setLoading(true)
        console.log('inside chat')
        console.log("mes",message)
        
        if(message?.length >5){
            console.log('inside if')
            const input = {agentId:'11',type:'text',message:message,PhoneNumber:'9565361425'}
            
        let res = await fetch(`http://${IP_Address}:5000/agent`,{
            method:"POST",
            headers:{'content-type':'application/json'},
            body:JSON.stringify(input)
          }).then(response => response.json())
          .then(data=>{setResponses(prev =>[...prev,data])})
          setMessage()
          setLoading(false)
          
          
        }
       
        
    }

      async function handleRecording(){


        
        try {
            
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
              alert('Permission to access microphone is required!');
              return;
            }
      
            const { recording } = await Audio.Recording.createAsync(
              Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            
            setRecording(recording);
            setType('speech')
            
      
          } catch (err) {
            console.error('Failed to start recording', err);
          }
    }

    async function stopRecording(){
        
       console.log('inside stop')
        try{
            console.log(recording)
            
                if (!recording){ 
                    console.log("could Not record Audio")
                    return
                };
          
                await recording.stopAndUnloadAsync();
                const uri = recording.getURI();
                const formData = new FormData();
                formData.append('audio', {
                  uri,
                  name: 'audio.wav',
                  type: 'audio/wav',
                });
          
  
        
        console.log('Recording stopped and stored at', uri)
        const input = {PhoneNumber:'6958251478',agentId:'11'}
        formData.append('input', JSON.stringify(input));
            const res = await fetch(`http://${IP_Address}:5000/agentSpeech`,
                {
                    method:"POST",
                    headers:{ 'Content-Type': 'multipart/form-data' },
                    body:formData
                }
                  
            ).then(response => response.json()) 
            .then(data=>{setResponses(prev =>[...prev,data])})
            setLoading()
            
           
        console.log('ho')
        

        }catch(e){
            console.log(e)
        }
        
    }


  return (
    
   <SafeAreaView style={styles.container}>
    {log && console.log(isVisible)}
    {isVisible ==true &&
      <Modal transparent={true} >
      <View style={{height: 'auto',
      padding:20,
      width: '80%',
      backgroundColor: 'white',
      alignItems:'center',
      
      position: 'absolute',
      left:30,bottom:'50%'}}>
        <Text  >Do you want to continue the previous chat or Have new conversation?</Text>
        <View style={{flexDirection:'row',gap:20,margin:20}}>
          <TouchableOpacity onPress={()=>(setVisible(!isVisible))}>
            <Text >New Conversation</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleGetChat}>
              <Text>Continue</Text>
              </TouchableOpacity>
        </View>
      </View>
      </Modal>
    }
    
  
               
               <Image source={require("../assets/character.png")} style={{width:"200",height:'200',borderRadius:20 }}></Image>
                   <Text style={{color:'white'}}>Hello! I can help you? </Text>
                   <View style={{flex:1,padding:10}}>
                       {responses.length>=1?
                       <FlatList data={responses} renderItem={({item,index})=>(
                          
                           <View key={index} style={{padding:10,marginBottom:15}}>
                                {(console.log('user',item.user,"messAGE",item.message))}
                          
                           <View style={{backgroundColor:'#A357EF',padding:10,elevation:10,marginBottom:5,borderRadius:20}}>
                           <Text style={{color:'white',padding:10}}>{item.user }</Text>
                           </View>
                           <View style={{flexDirection:'row',marginTop:10}}>
                               <Image source={require('../assets/character.png') } style={{height:40,width:40,marginRight:10,borderRadius:20}}></Image>
                           <ScrollView  style={{backgroundColor:'#3B3E45',maxHeight:250
                               ,borderBottomLeftRadius:20,borderBottomRightRadius:20,borderTopRightRadius:20,elevation:9
                           }}>
   
                           <Text style={{color:"white" , padding:10,marginBottom:10}}>{item.message}</Text>
                           </ScrollView>
                           </View>
                           
                           
                           
                           </View>
                           
                       )}/>:<Text style={{color:'white'}}>ask me anything</Text>}
                  
                  </View>
                   <KeyboardAvoidingView style={{flexDirection:'row',gap:10,padding:20,backgroundColor:'#121526'}} >
                       
                       <TextInput multiline={true} style={{backgroundColor:'white',width:'320',borderStartStartRadius:10,borderEndStartRadius:10}} value={message} onChangeText={(e)=>{setMessage(e) ,setType('Text')}}  ></TextInput>
                       
                       
                  
                       {(message&&message.length>=1)?<TouchableOpacity  onPress={handleChat} style={{backgroundColor:'#9400D3',borderRadius:40,width:50 ,justifyContent:'center',alignItems:'center'}} ><Ionicons style={{color:'white',position:'absolute'}}  name={"send"} size={25} /></TouchableOpacity>:
                       <TouchableOpacity onPressIn={handleRecording} onPressOut={stopRecording}   style={{backgroundColor:'#9400D3',borderRadius:40,width:50 ,justifyContent:'center',alignItems:'center'}} ><Ionicons style={{color:'white',position:'absolute'}}  name={"mic"} size={25}/></TouchableOpacity>}
                   </KeyboardAvoidingView>
                   
           </SafeAreaView>
  )
}

export default Chat