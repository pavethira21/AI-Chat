import { View, Text, SafeAreaView, Pressable,Image, FlatList,TouchableOpacity } from 'react-native'
import React from 'react'
import {Ionicons} from '@expo/vector-icons';
import { styles } from '../Loginstyle'
import { useNavigation } from '@react-navigation/native';

function Subcription ()  { 
 
  const subscribe = [{'title':"Quaterly Plan",period:"3 months",Description:"Enjoy Unlimited access to AI-chat for 3 Months and Improve Your english Skills",Price:'$6.99'},
    {"title":"Half Year Plan",period:"6 months",Description:"Enjoy Unlimited access to AI-chat for 3 Months and Improve Your english Skills",Price:'$10.00'},
    {"title":"Around the Clock Plan",period:"12 months",Description:"Enjoy Unlimited access to AI-chat for 3 Months and Improve Your english Skills",Price:'$4.99'}]

  const navigation = useNavigation()
  function handlePress(){
    console.log('hello pressed')
  } 
  function handleNavigate(){
    navigation.navigate('BtNv')
}

  
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection:'column'}}>
        <TouchableOpacity  onPress={handleNavigate}  style={{height:50,width:50,position:'absolute',left:0,backgroundColor:'orange',alignItems:'center',justifyContent:'center',borderRadius:20}}>
                         <Text style={{color:'white'}}><Ionicons name={'arrow-back-outline'} color={'black'} size={25}/></Text>
          </TouchableOpacity>
        <View style={{alignItems:"center"}}>
        <Image  source={require('../assets/subcribe.png')} style={{width:"200",height:'200',borderRadius:20, }}/>
        </View>
       
        <FlatList data={subscribe} renderItem={({item,index})=>
          (
            <>
            {console.log(item)}
          <Pressable onPress={handlePress} 
          style={{maxHeight:300,backgroundColor:'orange',margin:20,alignItems:'center',borderRadius:20,padding:20}} >
        <Text style={{fontSize:25,fontWeight:700}} >{item.title}</Text>
        <Text>{item.Description}</Text>
        </Pressable>
            </>
          )
        
         
        }/>
        
      
      </View>
      
    </SafeAreaView>
  )
}

export default Subcription