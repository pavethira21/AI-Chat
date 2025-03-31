import { View, Text } from 'react-native'
import React from 'react'

function Chat ()  {
  
  


  return (
   <SafeAreaView style={styles.container}>
               
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
                       
                       
                  
                       {(message&&message.length>=1)?<TouchableOpacity onPress={handleChat} style={{backgroundColor:'#9400D3',borderRadius:40,width:50 ,justifyContent:'center',alignItems:'center'}} ><Ionicons style={{color:'white',position:'absolute'}}  name={"send"} size={25} /></TouchableOpacity>:
                       <TouchableOpacity onPressIn={handleRecording}  onPressOut={stopRecording} style={{backgroundColor:'#9400D3',borderRadius:40,width:50 ,justifyContent:'center',alignItems:'center'}} ><Ionicons style={{color:'white',position:'absolute'}}  name={"mic"} size={25}/></TouchableOpacity>}
                   </KeyboardAvoidingView>
                   
           </SafeAreaView>
  )
}

export default Chat