
import { FlatList, Text,View,SafeAreaView,Image, Pressable, Dimensions } from "react-native"
import React, { useState,useEffect } from 'react'
import { styles } from "../Loginstyle"
import HeaderTag from "./header"
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import AsyncStorage from "@react-native-async-storage/async-storage";

function SubUsers () {
    const navigation = useNavigation()
    const [showEx,setShow] = useState(false)
    const [excerHistory,sethistory] = useState([])
    const [excer,setExcer] = useState()


    async  function handleAgentNavigate(id) {
      await AsyncStorage.setItem("agent", id.toString());
        navigation.navigate('Agent') 
    }
    function handleExcerciseNavigate(ex){
      navigation.navigate('SubUser',{
        item:ex
      })
    }


    const IP_Address = process.env.EXPO_PUBLIC_IP_ADDRESS

    async function fetchExcersice(){
      try{
        const PhoneNumber = await AsyncStorage.getItem('PhoneNumber')
      console.log(PhoneNumber)
      console.log('excersice fetch')
      let res = await fetch(`http://${IP_Address}:5000/getExcercise`,{
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify({PhoneNumber:PhoneNumber})
      }) 

      const data = await res.json()
      console.log(data)
      setExcer(data.excercise)
      }catch(e){
        console.log(e)
      }
      

    }


    useEffect(()=>{
      console.log('useeffect fetch')
      fetchExcersice()
      const unsubscribe = navigation.addListener('tabPress', (e) => {
        console.log('Profile Screen Focused');
        fetchExcersice()
      });
  
      return unsubscribe;

    },[navigation])

    async function handleHistory(){
      setShow(true)

      try{
        const PhoneNumber = await AsyncStorage.getItem("PhoneNumber")
        console.log('Function')
      const input = {PhoneNumber:PhoneNumber}
      console.log(input)
      const res = await fetch(`http://${IP_Address}:5000/getExcerciseHistory`,{
        method:"POST",
        headers:{'content-type':'application/json'},
        body:JSON.stringify(input)
      }) 
       const data = await res.json()
       console.log(data)
       sethistory(data.excerHistory) 
      }catch(e){
        console.log(e)
      }
      

    }
    let cat 
    console.log(cat)
    const {width,height} = Dimensions.get('window')
    const agents_sub = [{Name:'Draft an Email',description:'Write professional email &messages with AI ',agentId:3,color:["#FFA500","#e76d2c"],img:require('../assets/young-woman.png')},
    {Name:"Translate",description:"Translate from any language to english",agentId:1,color:['#7cfc00','#0bda51'],img:require('../assets/english.png')}]
  return (
    <SafeAreaView style={styles.container}>
             
             <HeaderTag></HeaderTag>
              <View style={{height:height * 0.33,marginTop:10}}>
             <FlatList  showsHorizontalScrollIndicator={false}  data={agents_sub}   
             contentContainerStyle={{ paddingHorizontal: 20, marginTop: 50 }}
        keyExtractor={(item, index) => index.toString()} horizontal renderItem={({item})=>(
               <LinearGradient style={{height: height * 0.25,width: width * 0.8,borderRadius: 20, padding: 20,marginRight: 15,justifyContent: "space-between",overflow: "hidden",}} colors={item.color}>
              <Pressable onPress={()=>handleAgentNavigate(item.agentId)} style={{ flex: 1 }}>
                <Text  style={{color: "Black",fontSize: 18,fontWeight: "bold",marginBottom: 10,}}>{item.Name}</Text>
                <Text numberOfLines={3}  style={{color: "Black",fontSize: 14,lineHeight: 20,width:width * 0.7}} >{item.description}</Text>
                <Image source={item.img} style={{height:height * 0.1,width:width * 0.28,position:'absolute',bottom:10,resizeMode:'contain',right:10}} ></Image>
               
              </Pressable>
              </LinearGradient>
              
             )}/>  
             </View>
             
             
             
             <View style={{display:"flex",padding:20,flexDirection:"row",borderRadius:20}} >
                     <Pressable onPress={()=>(setShow(false))}
                     style={{backgroundColor:"#3B3E45",padding:10,width:width * 0.45,alignItems:'center',borderBottomWidth:2,borderColor:(!showEx ? '#A357EF':'gray')}}
                      ><Text style={{color:'white'}}>For You</Text></Pressable> 
                     <Pressable onPress={handleHistory}
                     style={{backgroundColor:"#3B3E45",padding:10,width:width * 0.45,alignItems:'center',borderBottomWidth:2,borderColor:(showEx ? '#A357EF':'gray')}} 
                     ><Text style={{color:'white'}}> Completed</Text></Pressable>
                     </View>
                     <View style={{width:width * 0.9}}>
            {!showEx ?
             <FlatList  data={excer} keyExtractor={(item,index)=>index.toString()}
             renderItem={({item})=>{  
              
              const showCategory = item.Category !==cat
              if(item.Category !== cat){
                cat = item.Category 
                
              }
                return(
                  <>
                 
                  {showCategory && 
                  <>
                 < View style={{height:2,marginTop:10,width:'100%',backgroundColor:'gray'}}/>
                  <Text style={{color:'white', fontSize: 16, fontWeight: "500",marginTop:20 }}>Basic english at {cat}</Text></>
                  }
                  <Pressable onPress={()=>handleExcerciseNavigate(item)}>
              
                  <View style={{backgroundColor:'#2A2A3A',marginTop:10,padding:20,flexDirection:'row',alignItems:'center'}}>
                   <Text style={{color:'white'}}>{item.Name}</Text>
                   <Ionicons color={'gray'} size={25} name={'arrow-forward-outline'}></Ionicons>
                   </View>
                   </Pressable> 
                     
                   </>
                   
                )
              }}
             
             />:
             
             <FlatList  style={{gap:20}} data={excerHistory} keyExtractor={(item,index)=>index.toString()}
             renderItem={({item})=>{  
              
              const showCategory = item.Category !==cat
              if(item.Category !== cat){
                cat = item.Category 
                
              }
                return(
                  <>
                 
                  {showCategory && 
                  <>
                 
                  <Text style={{color:'white', fontSize: 16, fontWeight: "500" }}>Basic english at {cat}</Text></>
                  }
                  <Pressable onPress={()=>handleExcerciseNavigate(item)}>
              
                  <View style={{backgroundColor:'#2A2A3A',marginTop:10,padding:20,flexDirection:'row',alignItems:'center'}}>
                   <Text style={{color:'white'}}>{item.Name}</Text>
                   <Ionicons color={'gray'} size={25} name={'arrow-forward-outline'}></Ionicons>
                   </View>
                   </Pressable> 
                     
                   </>
                   
                )
              }}
             
             />
             
             }</View>
             

              
    
</SafeAreaView> 
  )
}

export default SubUsers