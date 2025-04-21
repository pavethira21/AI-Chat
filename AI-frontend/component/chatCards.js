
import React, { useState } from 'react';
import { SafeAreaView, View, Text, FlatList, TextInput, TouchableOpacity, Image, ActivityIndicator, KeyboardAvoidingView, Platform, Dimensions,}from'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatCards = ({route}) => {
  const IP_Address = process.env.EXPO_PUBLIC_IP_ADDRESS
  const excercise = route?.params?.item
  console.log(excercise)
  const [message, setMessage] = useState('');
  const [convos, setConvos] = useState([
    {
      role: 'system',
      content:excercise.prompt,
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
      const PhoneNumber = await  AsyncStorage.getItem('PhoneNumber')
      console.log(PhoneNumber)
      const res = await fetch(`http://${IP_Address}:5000/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category:excercise.Category,
          type: 'text',
          convos: updatedConvos,
          PhoneNumber: PhoneNumber,
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

  function renderMessage ({ item }) {
    if (item.role === 'system') return null;

    const isUser = item.role === 'user';
    return (
      <View
        style={{flexDirection: isUser ? 'row-reverse' : 'row',marginTop:20,marginVertical: 5, alignItems: 'flex-end',
        }}
      >
        {!isUser && (
          <Image
            source={require('../assets/character.png')}style={{ height: 35, width: 35,borderRadius: 20,marginRight: 10,}}
          />
        )}

        <View
          style={{ backgroundColor: isUser ? '#A357EF' : '#3B3E45', padding: 10,borderRadius: 15,maxWidth: '75%',
          }}
        >
          <Text style={{ color: '#fff' }}>{item.content}</Text>
        </View>
      </View>
    );
  };

  async function handleNavigate(){
    try{
      
  const phoneNumber = await  AsyncStorage.getItem('PhoneNumber')
  console.log('hit')
  if(convos.length<1){
      console.log('no convo')
      navigation.navigate('BtNv') 
  }
  else{
      console.log('convos available')
      const input = {Category:excercise.Category,convos:convos,PhoneNumber:phoneNumber}
  const addDb = await fetch(`http://${IP_Address}:5000/addExcerciseHistory`,{
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

  const {width,height} = Dimensions.get('window')

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121526' }}>
      <View style={{backgroundColor:'#121526',flexDirection:'row',width:'100%',margin:20,overflow:'visible'}}>
                 
                 <TouchableOpacity  onPress={handleNavigate}  style={{height:height * 0.05,width:width*0.13,position:'absolute',left:0,backgroundColor:'orange',alignItems:'center',justifyContent:'center',marginTop:20,borderRadius:20}}>
                  <Text style={{color:'white'}}>
                     <Ionicons name={'arrow-back-outline'} color={'black'} size={25}/>
                 </Text>
                 </TouchableOpacity> 
                   
                 </View> 
                 

                 
      <FlatList data={convos.slice(1)} keyExtractor={(_, index) => index.toString()} renderItem={renderMessage} contentContainerStyle={{ padding: 16 }}
      />
      
      {loading && (
        <ActivityIndicator size="large" color="#A357EF" style={{ marginBottom: 10 }} />
      )}


                <KeyboardAvoidingView style={{flexDirection:'row',gap:10,padding:20,backgroundColor:'#121526'}} >
                    
                    <TextInput multiline={true} style={{backgroundColor:'white',width:width * 0.7,borderStartStartRadius:10,borderEndStartRadius:10}} value={message} onChangeText={(e)=>{setMessage(e) }}  ></TextInput>
                    
                     
               
                    
                    <TouchableOpacity onPress={sendMessage} style={{backgroundColor:'#9400D3',borderRadius:40,width:width * 0.12 ,justifyContent:'center',alignItems:'center'}} ><Ionicons style={{color:'white',position:'absolute'}}  name={"send"} size={25} /></TouchableOpacity>
                    
                </KeyboardAvoidingView>
      
    </SafeAreaView>
  );
};

export default ChatCards