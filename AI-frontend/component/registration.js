import { useEffect, useState } from "react";
import { Pressable, SafeAreaView,Text,TextInput,TouchableOpacity,View } from "react-native";
import { styles } from "../Loginstyle";
import { FlatList } from "react-native-gesture-handler";
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";

export default function Register(){
    const navigation = useNavigation()
    const [PhoneNumber,setPhoneNumber] = useState()
    useEffect(()=>{
        async function phCall() {
            
        
            try{
                const PhoneNumber = await AsyncStorage.getItem('PhoneNumber')
                setPhoneNumber(PhoneNumber)
            }catch(e){
                console.log(e)
            }
        }
        phCall()
    },[])
    
     
   const IP_Address ='192.168.1.8'
    const languages =['Tamil','Hindi','Kannada','Telugu','Marathi','Malayalam']
    const Occupation = ['College','Work','Home Maker','Teacher','Other']
    const [age,setAge] = useState('adult')
    const [name,setName] = useState()
    const [lang,setLang] =useState()
    const [Ocpt,setOcpt] = useState()
    const [inte,setInt] = useState()
    const [interest,setInterest] = useState([])
    function removeItem(i){
        setInterest((prev) => prev.filter((item) => item !== i));
    }

    async function handleRegister(){
        const input = {PhoneNumber:PhoneNumber,Lang:lang,age:age,Interest:interest,Name:name,ocuupation:Ocpt}
        console.log(PhoneNumber)
       let res= await fetch(`http://${IP_Address}:5000/register`,{
            method:"POST",
            headers:{'content-type':'application/json'},
            body:JSON.stringify(input)

          })
          const data = await res.json()
          
          
        if(res.status ==200){
            
                    await AsyncStorage.setItem("PhoneNumber",PhoneNumber)
            navigation.replace('BtNv')
            ToastAndroid.showWithGravity(`${data.message}`,ToastAndroid.SHORT,
                                    ToastAndroid.BOTTOM)
            
        }
        else{
            ToastAndroid.showWithGravity(`${data.message}`,ToastAndroid.SHORT,
                ToastAndroid.BOTTOM)

        }
          
    }
    
    return(
        <SafeAreaView style={styles.container}>
        {lang ?
        <View>
        <Text style={styles.cardText}>Fill Your Details</Text>
        <View style={{display:"flex",padding:20,flexDirection:"row",width:'100%',borderRadius:20}} >
        <Pressable 
        style={{backgroundColor:(age =='adult'?'#A357EF':"#3B3E45"),padding:10,width:'50%',alignItems:'center',borderStartStartRadius:20,borderStartEndRadius:20}}
         onPress={()=>setAge('adult')}><Text style={{color:'white'}}>Adult</Text></Pressable> 
        <Pressable 
        style={{backgroundColor:(age =='kid'?'#A357EF':"#3B3E45"),padding:10,width:'50%',alignItems:'center',borderEndStartRadius:20,borderEndEndRadius:20}} 
        onPress={()=>setAge('kid')}><Text style={{color:'white'}}>Kid</Text></Pressable>
    </View>
    
        <Text style={styles.cardText}>What is your name?</Text>
        <TextInput style={{borderWidth:2,borderColor:'#3B3E45'}} onChangeText={(e)=>{setName(e)}} value={name}></TextInput>
        <Text style={styles.cardText}>Interests</Text>
        <View style={{display:'flex',flexDirection:'row'}}>
        <TextInput style={{borderWidth:2,borderColor:'#3B3E45',width:250}}  onChangeText={(e)=>{setInt(e)}} ></TextInput> 
        <TouchableOpacity style={{padding:10,alignItems:'center',justifyContent:'center'}} onPress={()=>(setInterest(inte))}><Text style={{color:'white',textAlign:"center"}}>ADD</Text></TouchableOpacity>
        </View> 
        
        <Text style={styles.cardText}>What is your Occupation</Text>
        <FlatList data={Occupation}  numColumns={3}  renderItem={({item})=>(
           <View style={{padding:10}}>
                <TouchableOpacity  style={{alignItems:'center', borderRadius:20,backgroundColor:(Ocpt==item?'#A357EF':'#121526'),borderWidth:2,borderColor:'#A357EF',borderRadius:20}} onPress={()=>{setOcpt(item)}}>
                    <Text style={{color:'white',padding:10}}>{item}</Text>
                </TouchableOpacity>
          </View>
        )} keyExtractor={(item, index) => index.toString()}/> 
        
        
        <TouchableOpacity onPress={handleRegister} style={styles.button}><Text>Continue</Text></TouchableOpacity>
        </View>

           :
        
             <View>
             <Text style={styles.cardText}>What is Your Native Language?</Text>
                <FlatList data={languages} renderItem={({item,index})=>(
                   <View key={index} style={{padding:10}}>
                        <TouchableOpacity  style={{borderWidth:2,borderColor:'#A357EF',padding:10,width:'90%',borderRadius:20,alignItems:'centre', backgroundColor:(lang==item?'#A357EF':'#121526')}} onPress={()=>{setLang(item)}}>
                            <Text style={{color:'white',padding:10}}>{item}</Text>
                        </TouchableOpacity>
                  </View>
                )}/>
            </View>
}
        
        </SafeAreaView>
    )
}