import { View, Text, SafeAreaView, Pressable,Image, FlatList,TouchableOpacity,Modal,ToastAndroid,ImageBackground, Dimensions } from 'react-native'
import React, { useState } from 'react'
import {Ionicons} from '@expo/vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { styles } from '../Loginstyle'
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

function Subcription ({route})  { 
  const [visible,setVisible] = useState()
  const [item,setItem] = useState()
  const [showSubList,setSub] = useState(true)
  const IP_Address = process.env.EXPO_PUBLIC_IP_ADDRESS
 const user = route?.params?.user
 console.log('user',user)
 const status = user?.subcription.Status ==='Active'
 console.log(status)
  const subscribe = [{'title':"Basic Plan",period:90,color:['#4286f4', '#4364F7'],Description:[" Practice English with AI 24/7","200 credits on purchase","Access Translate, Grammar,Basic Language Support"],Price:'$6.99'},
    {"title":"Standard Plan",period:183,color:['#ED213A', '#93291E'],Description:["Practice English with AI 24/7","Multilingual support use any language to get desired output","Access to All the agents"],Price:'$10.00'},
    {"title":" Premium Plan",color:['#ad5389', '#3c1053'],period:365,Description:["Practice English with AI 24/7",'Multilingual support use any language to get desired output','Unlimited access to all the agents',"Practice english with day to day senarios ",'English Excersice '],Price:'$4.99'}]

    const credit =[{id:1,title:"Buy 25 Credits",price:"100",credit:25},{id:2,title:"Buy 50 Credits",price:"100",credit:50},{id:3,title:"Buy 100 Credits",price:"250",credit:100},
      {id:4,title:"Buy 500 Credits",price:"1000",credit:500}
    ]
 // const navigation = useNavigation()
 async function handleSubscribe(i){ 
  console.log('inside subscribe')
  const PhoneNumber = await AsyncStorage.getItem("PhoneNumber")
   const input = {Phno:PhoneNumber,days:i}

   const result = await fetch(`http://${IP_Address}:5000/subscription`,{
    method:"POST",
    headers:{'content-type':'application/json'},
    body:JSON.stringify(input)
   })

   if(result.status == 200){
    ToastAndroid.showWithGravity(" Subscribed successfully",ToastAndroid.SHORT,
                            ToastAndroid.BOTTOM)
  }

   
  else{
    ToastAndroid.showWithGravity(`Could Not add subscription  `,ToastAndroid.SHORT,
      ToastAndroid.BOTTOM)
  }} 
 
  async function handlePress(){
    setVisible(false) 
    console.log(IP_Address)
    const PhoneNumber = await AsyncStorage.getItem("PhoneNumber")
    const input = {creditIncrease:item.credit,PhoneNumber:PhoneNumber}
    let res = await fetch(`http://${IP_Address}:5000/creditUpdate`,{
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify(input)
 
      
  })
  if(res.status == 200){
    ToastAndroid.showWithGravity("Credits Added successfully",ToastAndroid.SHORT,
                            ToastAndroid.BOTTOM)
  }

   
  else{
    ToastAndroid.showWithGravity(`Could Not Add Credits`,ToastAndroid.SHORT,
      ToastAndroid.BOTTOM)
  }}
//   function handleNavigate(){
//     navigation.navigate('BtNv')
// }

const {width,height} = Dimensions.get('window')
  
  return (
    <SafeAreaView style={styles.container}>
      {visible ==true &&
            <Modal transparent={true} >
            <View style={{height: 'auto',
            padding:20,
            width: width * 0.8,
            backgroundColor: 'white',
            alignItems:'center',
            
            position: 'absolute',
            left:30,bottom:height * 0.5}}>
              <Text  >Do you want to Purchase Credit?</Text>
              <View style={{flexDirection:'row',gap:20,margin:20}}>
                <TouchableOpacity onPress={()=>(setVisible(!visible))}>
                  <Text >cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handlePress}>
                    <Text>Confirm</Text>
                    </TouchableOpacity>
              </View>
            </View>
            </Modal>
          }
      <View style={{flexDirection:'column'}}>
        
        <View style={{alignItems:"center"}}>
        <Image  source={require('../assets/loading.png')} style={{width:width * 0.4,height:height * 0.25,borderRadius:20, marginTop:20}}/>
        </View>
        <View style={{display:"flex",padding:20,flexDirection:"row",width:width * 0.95,borderRadius:20,justifyContent:'center'}} >
        <Pressable onPress={()=>(setSub(true))}
        style={{backgroundColor:"#3B3E45",padding:10,width:width * 0.5,alignItems:'center',borderBottomWidth:2,borderColor:(showSubList ? '#A357EF':'gray')}}
         ><Text style={{color:'white'}}>Subcriptions</Text></Pressable> 
        {status && <Pressable onPress={()=>(setSub(false))}
        style={{backgroundColor:"#3B3E45",padding:10,width:width * 0.5,alignItems:'center',borderBottomWidth:2,borderColor:(!showSubList ? '#A357EF':'gray')}} 
        ><Text style={{color:'white'}}>Purchase Credit</Text></Pressable>}
        </View>
        
        {showSubList ?
       <FlatList data={subscribe}  renderItem={({item,index})=>
        (
        <View  style={{backgroundColor:'white',flex: 1,margin:20,alignItems:'center',borderRadius:20}}>
          
             <LinearGradient colors={item.color} style={{borderBottomLeftRadius:300,borderTopLeftRadius:20,borderTopRightRadius:20,borderBottomRightRadius:300,width:'100%',height:'35%'}}>
              <View style={{padding:20,alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:'#F3B27A',fontSize:25,fontWeight:700,alignSelf:'center'}} >{item.title}</Text>
            </View> 
            </LinearGradient> 
            
           <View style={{margin:20}}>
            
           
           <Text style={{fontSize:15,fontWeight:900}}><Ionicons name='checkmark-done-sharp' size={20}/> {item.Description[0]}</Text>
            <Text style={{fontSize:15}}><Ionicons name='checkmark-done-sharp' size={20}/> {item.Description[1]}</Text>
            <Text style={{fontSize:15}}><Ionicons name='checkmark-done-sharp' size={20}/> {item.Description[2]}</Text>
            
           </View>
           <Pressable style={{borderRadius:20,backgroundColor:'black',padding:10,marginBottom:30}} onPress={()=>handleSubscribe(item.period)}>
            <Text style={{color:'white',padding:10}}>Select Plan</Text>
           </Pressable>
           <View style={{height:50}}>
              </View>
           
    </View>
      
          
        )
      
       
      }/>:
      
      <FlatList data={credit} renderItem={({item}) =>
        (
        <LinearGradient colors={['#4286f4', '#4364F7']}
        style={{ flex: 1,maxHeight:300,margin:20,borderRadius:20,padding:10 }}>
          
          
        <Pressable onPress={()=>(setVisible(true),setItem(item))} 
        style={{alignItems:'center' ,flexDirection:'row'}} >
          <Image source={require('../assets/coins.png')} style={{height:100,width:100}}></Image>
          <View>
      <Text style={{fontSize:25,fontWeight:700,color:'white'}} >{item.title}</Text>
      <Text style={{fontSize:25,fontWeight:500,color:'white'}}><FontAwesome5 name="rupee-sign" size={20} color={'gold'} />{item.price}</Text>
      </View>
      </Pressable>
      </LinearGradient> 
          
        )
      
       
      }/>
       }
        
        

        

        
        
      
      </View>
      
    </SafeAreaView>
  )
}

export default Subcription