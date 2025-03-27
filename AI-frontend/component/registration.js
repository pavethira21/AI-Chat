import { useState } from "react";
import { Pressable, SafeAreaView,Text,View } from "react-native";
import { styles } from "../Loginstyle";

export default function Register(){
    const [age,setAge] = useState()
    const [name,setName] = useState()

    return(
        <SafeAreaView style={styles.container}>
            <Text style={{color:'white'}}>{age && age}</Text>
            <Text style={styles.cardText}>Your Language</Text>
            <Text style={styles.cardText}>Fill User Detail</Text>
            <View style={{display:"flex",padding:20,flexDirection:"row",width:'100%'}} ><Pressable style={{backgroundColor:(age =='adult'?'purple':"red"),padding:10,color:'white'}} onPress={()=>setAge('adult')}><Text>Adult</Text></Pressable> 
            <Pressable style={{backgroundColor:(age =='kid'?'purple':"red"),padding:10}} onPress={()=>setAge('kid')}><Text>Kid</Text></Pressable></View>

        </SafeAreaView>
    )
}