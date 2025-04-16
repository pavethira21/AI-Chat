import AsyncStorage from '@react-native-async-storage/async-storage';
import { View,Text,Image, TextInput, TouchableOpacity, KeyboardAvoidingView, FlatList, ScrollView, Pressable,Share,ToastAndroid } from 'react-native';
import { styles } from '../Loginstyle';
import {Audio} from 'expo-av';
import { SafeAreaView } from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as clipboard from 'expo-clipboard';
import * as sharing from 'expo-sharing';
import { ActivityIndicator } from 'react-native';


export default function Agent({route}){
    const [responses , setResponses] = useState([])
    const [PhoneNumber,setPhoneNumber] =useState()
    const [loading,setLoading] = useState(false)
    const [message,setMessage] = useState()
    const navigation = useNavigation()
    const [agent,setItem] = useState()
    const [recording,setRecording] = useState()
    
    const chat = route?.params?.chat
    const agentId = route?.params?.agentId
    useEffect(() => {
        console.log('useffect',chat)
        if (chat) {  
            console.log('insideif')
            chat.forEach((item) => {
                console.log("Inside if", item);
                setResponses(prev =>[...prev,item]);

            });
        } 


    }, [chat]);
    

    useEffect(() => {
        handleStore()
            
          const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            console.log('hello in effect',responses)
            handleNavigate()
            console.log('printed before navigate')
         
          }); 
      
          return unsubscribe;
        }, []);


    async function handleStore(){
        const item = await  AsyncStorage.getItem('agent')
        const phoneNumber = await  AsyncStorage.getItem('PhoneNumber')
        setPhoneNumber(phoneNumber)
        setItem(item)
        console.log("item selected",phoneNumber)
        if(item==11){
            setModal(true)
        }
    }

   
     const IP_Address ='192.168.1.17'

   

    async function handleRecording(){
        stopRecording()
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
        const input = {PhoneNumber:PhoneNumber,agentId:agent}
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
            setMessage()
           
        console.log('ho')
        

        }catch(e){
            console.log(e)
        }
        
    }

    async function handleNavigate(){
        try{
            console.log(responses)
        const phoneNumber = await  AsyncStorage.getItem('PhoneNumber')
        console.log('hit')
        if(responses.length<1){
            console.log('no convo')
            navigation.navigate('BtNv') 
        }
        else{
            console.log('convos available')
            const input = {agentId:agent,message:responses,PhoneNumber:phoneNumber}
        const addDb = await fetch(`http://${IP_Address}:5000/addChathHistory`,{
            method:"POST",
            headers:{'content-type':'application/json'},
            body:JSON.stringify(input)
        })

        if (addDb.status ==200){
            navigation.navigate('BtNv')
        }
    } 
        }catch(e){
            console.log(e)
        }
        
    
        
    }


    async function handleChat(){
        setLoading(true)
        console.log('inside chat')
        console.log("mes",message)
        
        if(message?.length >=3){
            const input = {agentId:agentId || agent,type:'text',message:message,PhoneNumber:PhoneNumber}
            
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

    async function handleCopy(i){
        console.log('inside copy')
        try{
            console.log('inside try')
            await clipboard.setStringAsync(i)
            console.log('after copy')
            ToastAndroid.showWithGravity("Copied to clipboard",ToastAndroid.SHORT,
                                        ToastAndroid.BOTTOM)

        }
        catch(e){
            console.log(e)
        }
        
    }

    async function handleShare(i){
        console.log('inside share')
        try{
            console.log('inside try')
            const shared =  Share.share({message:i})
        }catch(e){
            console.log(e)
        }
        

    }
    const copy = (agent === "7" || agent === "3") 
    console.log(copy)
    return(
        <>
        {responses && console.log("responses",responses)}
        <SafeAreaView style={styles.container}>
            <View style={{backgroundColor:'#121526',flexDirection:'row',width:'100%',margin:20}}>
                 
                <TouchableOpacity  onPress={handleNavigate}  style={{height:50,width:50,position:'absolute',left:0,backgroundColor:'orange',alignItems:'center',justifyContent:'center',borderRadius:20}}>
                 <Text style={{color:'white'}}>
                    <Ionicons name={'arrow-back-outline'} color={'black'} size={25}/>
                </Text>
                </TouchableOpacity> 
                  
                </View> 
           
                
                <View style={{flex:1,padding:10,marginTop:25}}>
                    
                    {responses.length>=1?
                    <FlatList data={responses}  renderItem={({item,index})=>(

                       
                        <View key={index} style={{padding:10,marginBottom:15}}>
                            
                             
                       
                        <View style={{backgroundColor:'#A357EF',padding:10,elevation:10,marginBottom:5,borderRadius:20}}>
                        <Text style={{color:'white',padding:10}}>{item.user }</Text>
                        </View>
                        <View style={{flexDirection:'row',marginTop:10,marginRight:10}}>
                            <Image source={require('../assets/character.png') } style={{height:40,width:40,marginRight:10,borderRadius:20}}></Image>
                        <View  style={{backgroundColor:'#3B3E45',borderBottomLeftRadius:20,borderBottomRightRadius:20,borderTopRightRadius:20,elevation:9,marginRight:30
                        }}>
                        
                        <Text numberOfLines={10} style={{color:"white" , padding:10,marginBottom:10}}>{item.message}</Text>
                        { copy &&( <View style={{flexDirection:'row'}}>
                             <Pressable style={{backgroundColor:'gray',padding:5,alignItems:'center',marginLeft:20,borderRadius:10,marginBottom:10,right:10}}
                              onPress={()=>handleCopy(item.message)}>
                                <Ionicons name='copy' size={18} color={'white'}></Ionicons>
                            
                            </Pressable> 
                            <Pressable style={{backgroundColor:'gray',padding:5,alignItems:'center',marginLeft:20,borderRadius:10,marginBottom:10}} onPress={()=>handleShare(item.message)}>
                                <Ionicons name='share' size={18} color={'white'}></Ionicons>
                                </Pressable>
                            </View>)}
                        </View>
                        
                        </View>
                        
                        
                        
                        </View> 
                         
                    )}/>
                    : 
                    <>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Image source={require("../assets/chat-image.png")} style={{width:"150",height:'150' }}></Image>
                    <Text style={{color:'white'}}>Hello I will Help You With {agentId || agent} </Text>
                    </View> 
                    </>}
                    
               
               </View>
               {(loading && <ActivityIndicator size='large'>loading...</ActivityIndicator>)} 
                <KeyboardAvoidingView style={{flexDirection:'row',gap:10,padding:20,backgroundColor:'#121526'}} >
                    
                    <TextInput multiline={true} style={{backgroundColor:'white',width:'320',borderStartStartRadius:10,borderEndStartRadius:10}} value={message} onChangeText={(e)=>{setMessage(e) }}  ></TextInput>
                    
                     
               
                    {(message&&message.length>=1)?<TouchableOpacity onPress={handleChat} style={{backgroundColor:'#9400D3',borderRadius:40,width:50 ,justifyContent:'center',alignItems:'center'}} ><Ionicons style={{color:'white',position:'absolute'}}  name={"send"} size={25} /></TouchableOpacity>:
                    <TouchableOpacity onPressIn={handleRecording}  onPressOut={stopRecording} style={{backgroundColor:'#9400D3',borderRadius:40,width:50 ,justifyContent:'center',alignItems:'center'}} ><Ionicons style={{color:'white',position:'absolute'}}  name={"mic"} size={25}/></TouchableOpacity>}
                </KeyboardAvoidingView>
                
        </SafeAreaView>
        </>
        
    )
}