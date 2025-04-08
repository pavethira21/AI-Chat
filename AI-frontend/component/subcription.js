import { View, Text, SafeAreaView, Pressable,Image, FlatList,TouchableOpacity,Modal,ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import {Ionicons} from '@expo/vector-icons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { styles } from '../Loginstyle'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Subcription ()  { 
  const [visible,setVisible] = useState()
  const [item,setItem] = useState()
  const [showSubList,setSub] = useState('subscribe')
 const IP_Address ='192.168.1.5'
 
  const subscribe = [{'title':"Quaterly Plan",period:"3 months",Description:"Enjoy Unlimited access to AI-chat for 3 Months and Improve Your english Skills",Price:'$6.99'},
    {"title":"Half Year Plan",period:"6 months",Description:"Enjoy Unlimited access to AI-chat for 3 Months and Improve Your english Skills",Price:'$10.00'},
    {"title":"Around the Clock Plan",period:"12 months",Description:"Enjoy Unlimited access to AI-chat for 3 Months and Improve Your english Skills",Price:'$4.99'}]

    const credit =[{id:1,title:"Buy 25 Credits",price:"100",credit:25},{id:2,title:"Buy 50 Credits",price:"100",credit:50},{id:3,title:"Buy 100 Credits",price:"250",credit:100},
      {id:4,title:"Buy 500 Credits",price:"1000",credit:500}
    ]
 // const navigation = useNavigation()
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

  
  return (
    <SafeAreaView style={styles.container}>
      {visible ==true &&
            <Modal transparent={true} >
            <View style={{height: 'auto',
            padding:20,
            width: '80%',
            backgroundColor: 'white',
            alignItems:'center',
            
            position: 'absolute',
            left:30,bottom:'50%'}}>
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
        <Image  source={require('../assets/subcribe.png')} style={{width:"200",height:'200',borderRadius:20, }}/>
        </View>
        <View style={{display:"flex",padding:20,flexDirection:"row",width:'100%',borderRadius:20}} >
        <Pressable onPress={()=>(setSub('subscribe'))}
        style={{backgroundColor:"#3B3E45",padding:10,width:'50%',alignItems:'center',borderBottomWidth:2,borderColor:(showSubList=='subscribe' ? '#A357EF':'gray')}}
         ><Text style={{color:'white'}}>Subcriptions</Text></Pressable> 
        <Pressable onPress={()=>(setSub('credit'))}
        style={{backgroundColor:"#3B3E45",padding:10,width:'50%',alignItems:'center',borderBottomWidth:2,borderColor:(showSubList=='credit' ? '#A357EF':'gray')}} 
        ><Text style={{color:'white'}}>Purchase Credit</Text></Pressable>
        </View>
        
       {showSubList =='subscribe' ?
       <FlatList data={subscribe}  renderItem={({item,index})=>
        (
          
          
        <Pressable 
        style={{maxHeight:300,backgroundColor:'#A357EF',margin:20,alignItems:'center',borderRadius:20,padding:20}} >
      <Text style={{fontSize:25,fontWeight:700}} >{item.title}</Text>
      <Text>{item.Description}</Text>
      </Pressable>
          
        )
      
       
      }/>:
      <FlatList data={credit} renderItem={({item,index})=>
        (
           
        <Pressable onPress={()=>(setVisible(true),setItem(item))} 
        style={{maxHeight:300,backgroundColor:'#A357EF',margin:20,alignItems:'center',borderRadius:20,padding:20}} >
      <Text style={{fontSize:25,fontWeight:700}} >{item.title}</Text>
      <Text ><FontAwesome5 name="rupee-sign" size={10}  />{item.price}</Text>
      </Pressable>
          
        )
      
       
      }/>
       }
        
        

        

        
        
      
      </View>
      
    </SafeAreaView>
  )
}

export default Subcription