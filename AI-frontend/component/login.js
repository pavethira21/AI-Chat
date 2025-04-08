import { SafeAreaView,View, Text, TextInput, Touchable, TouchableOpacity,ToastAndroid } from "react-native"
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import {styles} from '../Loginstyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";
import {Ionicons} from '@expo/vector-icons';
import Register from "./registration";

export default function Login(){
    const IP_Address ='192.168.1.5'
    const [phoneNumber,setPhNo] = useState()
    const [isValid,setValid] = useState(false)
    const [Otp,setOtp]= useState()
    const [user,setUser]=useState()
    const [token,setToken] = useState()
    const [message,setMessage] = useState()
    let pattern = /^[6-9]\d{9}$/
    const navigation = useNavigation()

   
    function isValidPhoneNumber(num){
        
        if(num && pattern.test(num) ){
            setValid(true)
        }
        else(
            setValid(false)
        )
    }


   async function handleVerify(){
     if(Otp){
        console.log(phoneNumber)
        const inputValue = {verifyToken:Otp,PhoneNumber:phoneNumber}
        let res= await fetch(`http://${IP_Address}:5000/verifyToken`,{
            method:"POST",
                headers:{'content-type':'application/json'},
                body:JSON.stringify(inputValue)
              })
              console.log('after login')
              console.log("status",res.status)
              const data = await res.json()
              console.log(data)
              setMessage(data.message)
              console.log(data.message)
             
              console.log(data.token)
              
              setUser(data.user)
              console.log(data.user)
             try{
                await AsyncStorage.setItem("token",`${data.token}`)
                await AsyncStorage.setItem("PhoneNumber",phoneNumber)
                if(res.status==200){
                   
                    ToastAndroid.showWithGravity(`${data.message}`,ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM)
                    navigation.replace('BtNv') 
                  }
                  else{
                    ToastAndroid.showWithGravity(`${data.message}`,ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM)

                  }
             }catch(e){
                console.log(e)
             }
             
              
              
              
     }

   }
    async function  handleSubmit(){
        
        if(phoneNumber?.length ==10 && pattern.test(phoneNumber) ){
            const inputValue = {PhoneNumber:phoneNumber}
            console.log(inputValue)
            let res= await fetch(`http://${IP_Address}:5000/login`,{
                method:"POST",
                headers:{'content-type':'application/json'},
                body:JSON.stringify(inputValue)
              }).then(response => response.json())
              .then(data=>{ setMessage(data.message)})
            if(res.status==200){
                ToastAndroid.showWithGravity(message,ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM)
                console.log('hello')
            }

        }
        else{
            console.log('phoneNumber not valid')
        }


    }
    
    return(
        <SafeAreaView style={styles.container} >
        
            {message&& console.log(message)}
            <View style={{marginBottom:10,flexDirection:"row",padding:10,margin:20,alignItems:"center"}}>
                <Image source={require("../assets/character.png")} style={{width:150,height:150,borderRadius:20,marginLeft:20}}></Image>
                <Text style={{...styles.cardText,width:200,marginRight:20}}>Hi, I'm your 24/7 AI english Tutor</Text>
            </View>
            
            {user&& <Text style={{color:'white'}}>{token}</Text>}
            {message=="Verification code Generated" ?
            
            <>
            
            <View>
            <Text style={{...styles.cardText,marginBottom:20}} >OTP</Text>
            <View style={{display:"flex",flexWrap:"wrap",flexDirection:'row',marginBottom:20,borderWidth:2,borderColor:'#A357EF',borderRadius:20,backgroundColor:'#121526'}}>
            <TextInput placeholderTextColor={'gray'} 
            style={{borderRadius:10,width:'100%',color:'white',borderWidth:1,borderColor:'#A357EF',borderRadius:20,backgroundColor:'#121526'}} placeholder="Enter Generated  Otp" 
            value={Otp}  
            keyboardType="numeric"
            onChangeText={(e)=>{setOtp(e) }}></TextInput>
            </View>
            
            
        </View>
        <TouchableOpacity style={{...styles.button,marginTop:20}} onPress={handleVerify} ><Text>verify OTP</Text></TouchableOpacity>
        </>:
        // message=="user not found"?<>
        // <Register/>
        // </>:
        <>
        <View >
            <Text style={{...styles.cardText,marginBottom:20}}>What's Your PhoneNumber?</Text>
            <View style={{display:"flex",flexWrap:"wrap",flexDirection:'row',marginBottom:20,borderWidth:2,borderColor:'#A357EF',borderRadius:20,backgroundColor:'#121526'}}>
                
                <TextInput
                style={{borderRadius:10,width:'85%',color:'white',}}
                placeholderTextColor={'gray'}
                keyboardType="numeric"
                
                placeholder="Enter PhoneNumber" 
                value={phoneNumber} 
                maxLength={10}
                onChangeText={(e)=>{setPhNo(e) ,isValidPhoneNumber(e)}}></TextInput>
                <Ionicons style={{margin:10}} name={isValid?"checkmark-circle-outline":"close-circle-outline"} size={25} color={isValid?"green":"red"}/>
       
                    
                
                
            </View>
            </View>
            
            <TouchableOpacity style={styles.button} onPress={handleSubmit}><Text style={{color:"white"}}>Generate OTP </Text></TouchableOpacity>
        </>
            } 
                   
        </SafeAreaView>
       
        
    )
}

