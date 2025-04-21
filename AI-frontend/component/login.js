import { SafeAreaView,View, Text, TextInput, Touchable, TouchableOpacity,ToastAndroid } from "react-native"
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "react-native";
import {styles} from '../Loginstyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import SendSMS from 'react-native-sms';
import {useState} from 'react'
import {Ionicons} from '@expo/vector-icons';
import { Dimensions } from "react-native";


export default function Login(){
    
        console.log("inside try")
        const IP_Address = process.env.EXPO_PUBLIC_IP_ADDRESS
        console.log("after env try")
        console.log(IP_Address)
    
    
    
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
                  }else if(res.status ==404){
                    ToastAndroid.showWithGravity(`${data.message}`,ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM)
                    navigation.replace('Register') 
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
              })
            //   .then(response => response.json())
            //   .then(data=>{ setMessage(data.message)})
              const data = await res.json()
              setToken(data.token)
            setMessage(data.message)
            if(res.status==200){
                console.log('1')
                ToastAndroid.showWithGravity(`${data.message}`,ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM)
                console.log('hello')
            }

        }
        else{
            console.log('phoneNumber not valid')
        }


    }
    const { width, height } = Dimensions.get('window');
    
    return(
        
        <SafeAreaView style={styles.container} >
        
            {message&& console.log(message)}
            <View style={{marginBottom:10,flexDirection:"row",padding:10,margin:20,alignItems:"center"}}>
                <Image source={require("../assets/character.png")} style={{width:width * 0.35,height:width * 0.35,borderRadius:20,marginLeft:20}}></Image>
                <Text style={{...styles.cardText,width:200,marginRight:20}}>Hi, I'm your 24/7 AI english Tutor</Text>
            </View>
            
            
            {message=="Verification code Generated" ?
            
            <>
            {token && <Text style={{color:'white'}}>{token}</Text>}
            <View>
            <Text style={{...styles.cardText,marginBottom:20}} >OTP</Text>
            <View style={{display:"flex",flexWrap:"wrap",width:width * 0.9,flexDirection:'row',marginBottom:20,borderWidth:1,borderColor:'gray',borderRadius:20,backgroundColor:'#121526'}}>
            <TextInput placeholderTextColor={'gray'} 
            style={{borderRadius:10,width:width * 0.9,color:'white',borderWidth:1,borderColor:'#A357EF',borderRadius:20,backgroundColor:'#121526'}} placeholder="Enter Generated  Otp" 
            value={Otp}  
            keyboardType="numeric"
            onChangeText={(e)=>{setOtp(e) }}></TextInput>
            </View>
            
            
        </View>
        <LinearGradient style={{...styles.button,marginTop:20}}
      colors={['#6A3E9F', '#9B59B6']} // Purple gradient colors
      
    >
        <TouchableOpacity style={{...styles.button}}  onPress={handleVerify} >
            <Text style={{color:"white"}}>verify OTP</Text></TouchableOpacity>
        </LinearGradient>
        </>:
        // message=="user not found"?<>
        // <Register/>
        // </>:
        <>
        <View >
            <Text style={{...styles.cardText,marginBottom:20}}>What's Your PhoneNumber?</Text>
            <View style={{display:"flex",flexWrap:"wrap",flexDirection:'row',marginBottom:20,borderWidth:1,borderColor:"gray",borderRadius:20,backgroundColor:'#121526'}}>
                
                <TextInput
                style={{borderRadius:10,width:width * 0.75,color:'white',}}
                placeholderTextColor={'gray'}
                keyboardType="numeric"
                
                placeholder="Enter PhoneNumber" 
                value={phoneNumber} 
                maxLength={10}
                onChangeText={(e)=>{setPhNo(e) ,isValidPhoneNumber(e)}}></TextInput>
                <Ionicons style={{margin:10}} name={isValid?"checkmark-circle-outline":"close-circle-outline"} size={25} color={isValid?"green":"red"}/>
       
                    
                
                
            </View>
            </View>
            <LinearGradient
      colors={['#6A3E9F', '#9B59B6']} 
      style={styles.button} 
    >
            <TouchableOpacity style={{...styles.button}}  onPress={handleSubmit}><Text style={{color:"white"}}>Generate OTP </Text></TouchableOpacity></LinearGradient>
        </>
            } 
                   
        </SafeAreaView>
      
       
        
    )
}

