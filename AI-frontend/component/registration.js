import { useState } from "react";
import { Pressable, SafeAreaView,Text,TouchableOpacity,View } from "react-native";
import { styles } from "../Loginstyle";
import { FlatList } from "react-native-gesture-handler";

export default function Register(){

    const languages =['Tamil','Hindi','Kannada','Telugu','Marathi','Malayalam']
    const [age,setAge] = useState('adult')
    const [name,setName] = useState()
    const [lang,setLang] =useState()
    
    return(
        <SafeAreaView style={styles.container}>
            <View>
            <Text style={styles.cardText}>Your Language</Text>
            <FlatList data={languages} renderItem={({item,index})=>(
                <View key={index}>
                    <TouchableOpacity Sty onPress={setLang(item)} ><Text style={{color:'white'}}>{item}</Text></TouchableOpacity>
                </View>
            )}/>
            <Text style={styles.cardText}>Fill User Detail</Text>
            <View style={{display:"flex",padding:20,flexDirection:"row",width:'100%',borderRadius:20}} >
            <Pressable 
            style={{backgroundColor:(age =='adult'?'#A357EF':"#3B3E45"),padding:10,width:'50%',alignItems:'center',borderStartStartRadius:20,borderStartEndRadius:20}}
             onPress={()=>setAge('adult')}><Text style={{color:'white'}}>Adult</Text></Pressable> 
            <Pressable 
            style={{backgroundColor:(age =='kid'?'#A357EF':"#3B3E45"),padding:10,width:'50%',alignItems:'center',borderEndStartRadius:20,borderEndEndRadius:20}} 
            onPress={()=>setAge('kid')}><Text style={{color:'white'}}>Kid</Text></Pressable></View>
            </View>
            

        </SafeAreaView>
    )
}