// import { View, Text, SafeAreaView ,Image, TouchableOpacity,FlatList,Pressable,KeyboardAvoidingView,TextInput} from 'react-native'
// import React, { useEffect,useState } from 'react'
// import {Ionicons} from 'react-native-vector-icons'
// import { styles } from '../Loginstyle'
// import HeaderTag from './header'

// function ChatCards () {
//      IP_Address='192.168.1.11'


//      const [convos,setConvos] = useState([
//       {
//         "role":"system",
//          "content":"greet the user and ask question let the user answer and  have conversation that take place at work. "
//      }
//     ])
//      const [message,setMessage] = useState()

//      useEffect(()=>{
      
      
       
//      },[])
//      async function handleConvo(){
//       message && setConvos((prev)=>[...prev,{
//         "role":"user", 
//         "content":message
//       }])
       
//       console.log('inside handleConvo')
      
//       console.log(convos)

//       const input = {agentId:'1',type:'text',convos:convos,PhoneNumber:"8939221348"}

//       let res = await fetch(`http://${IP_Address}:5000/conversations`,{
//         method:"POST",
//         headers:{'content-type':'application/json'},
//         body:JSON.stringify(input)
//       })
//       const data = await res.json()
//       console.log(data.message)
//       setConvos((prev)=>[...prev,{
//         "role":"assistant",
//         "content":data.message
//       }])
      
      
    

//      }
//   return (
    
  
    
//     <SafeAreaView style={styles.container}>
//     <View style={{backgroundColor:'#121526',flexDirection:'row',width:'100%',margin:20}}>
         
        
          
//         </View> 
   
        
//         <View style={{flex:1,padding:10,marginTop:25}}>
            
//             {convos.length>=1?
//             <FlatList data={convos}  renderItem={({item,index})=>(

                
//                 <View key={index} style={{padding:10,marginBottom:15}}>
                    
                     
                    {/* {(item.role == "user" && 
                <View style={{backgroundColor:'#A357EF',padding:10,elevation:10,marginBottom:5,borderRadius:20}}>
                  <Text style={{color:'white',padding:10}}>{item.content}</Text>
                
                </View>
                )}
                <View style={{flexDirection:'row',marginTop:10,marginRight:10}}>
                  ({item.role == 'assistant' &&
                  <>
                    <Image source={require('../assets/character.png') } style={{height:40,width:40,marginRight:10,borderRadius:20}}></Image>
                <View  style={{backgroundColor:'#3B3E45'
                    ,borderBottomLeftRadius:20,borderBottomRightRadius:20,borderTopRightRadius:20,elevation:9,marginRight:30
                }}>
                
                <Text style={{color:"white" , padding:10,marginBottom:10}}>{item.content}</Text>
               
              
                </View>
                </> 
                }) 
                </View>*/}
                
                
                
//                 </View> 
                 
//             )}/>
//             : 
//             <>
//             <View style={{flexDirection:'row',alignItems:'center'}}>
//             <Image source={require("../assets/chat-image.png")} style={{width:"150",height:'150' }}></Image>
//             <Text style={{color:'white'}}>Hello I will Help You With {agent} </Text>
//             </View>  
//             </>}
            
       
//        </View>
//        {/* {(loading&&<ActivityIndicator size='large'>loading...</ActivityIndicator>)}  */}
//         <KeyboardAvoidingView style={{flexDirection:'row',gap:10,padding:20,backgroundColor:'#121526'}} >
            
//             <TextInput multiline={true} style={{backgroundColor:'white',width:'320',borderStartStartRadius:10,borderEndStartRadius:10}} value={message} onChangeText={(e)=>setMessage(e) }  ></TextInput>
            
             
       
//             <TouchableOpacity onPress={handleConvo} style={{backgroundColor:'#9400D3',borderRadius:40,width:50 ,justifyContent:'center',alignItems:'center'}} ><Ionicons style={{color:'white',position:'absolute'}}  name={"send"} size={25} /></TouchableOpacity>
           
//         </KeyboardAvoidingView>
        
// </SafeAreaView>
   
//   )
// }

// export default ChatCards

import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatCards = () => {
  const IP_Address = '192.168.1.11'; 

  const [message, setMessage] = useState('');
  const [convos, setConvos] = useState([
    {
      role: 'system',
      content:
        'Greet the user and ask a question. Let the user answer and have a conversation that takes place at work.',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const updatedConvos = [
      ...convos,
      { role: 'user', content: message.trim() },
    ];

    setConvos(updatedConvos);
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch(`http://${IP_Address}:5000/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: '1',
          type: 'text',
          convos: updatedConvos,
          PhoneNumber: '8939221348',
        }),
      });

      const data = await res.json();

      setConvos((prev) => [
        ...prev,
        { role: 'assistant', content: data.message },
      ]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => {
    if (item.role === 'system') return null;

    const isUser = item.role === 'user';
    return (
      <View
        style={{
          flexDirection: isUser ? 'row-reverse' : 'row',
          marginVertical: 5,
          alignItems: 'flex-end',
        }}
      >
        {!isUser && (
          <Image
            source={require('../assets/character.png')}
            style={{
              height: 35,
              width: 35,
              borderRadius: 20,
              marginRight: 10,
            }}
          />
        )}

        <View
          style={{
            backgroundColor: isUser ? '#A357EF' : '#3B3E45',
            padding: 10,
            borderRadius: 15,
            maxWidth: '75%',
          }}
        >
          <Text style={{ color: '#fff' }}>{item.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121526' }}>
      <FlatList
        data={convos.slice(1)} // skip system prompt
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 16 }}
      />

      {loading && (
        <ActivityIndicator size="large" color="#A357EF" style={{ marginBottom: 10 }} />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{
          flexDirection: 'row',
          padding: 10,
          alignItems: 'center',
          backgroundColor: '#1c1f2e',
        }}
      >
        <TextInput
          style={{
            flex: 1,
            backgroundColor: '#fff',
            borderRadius: 20,
            paddingHorizontal: 15,
            paddingVertical: 10,
            fontSize: 16,
          }}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={{
            marginLeft: 10,
            backgroundColor: '#9400D3',
            borderRadius: 25,
            padding: 12,
          }}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatCards;
