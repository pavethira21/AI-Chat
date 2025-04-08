// import { View, Text, TouchableOpacity } from 'react-native'
// import React, { useEffect,useState } from 'react'
// import { useNavigation } from '@react-navigation/native'
// import { styles } from '../Loginstyle'

// const ChatCards = ({agentId,children,phno}) => {
//   const navigation = useNavigation()
//   const IP_Address ='192.168.1.5'
//   const [log,setlog] = useState([])
//     useEffect(()=>{
//        handleGetChat()
//     },[])
//     async function handleGetChat(){
//         console.log('helo',agentId,phno)
       
//         console.log('hello')
//         const input = {agentId:agentId,type:'text',PhoneNumber:phno}
//         console.log('blah')
//         try{
//           const res = await fetch(`http://${IP_Address}:5000/getChat`,{
//             method:"POST",
//             headers:{'content-type':'application/json'},
//             body:JSON.stringify(input)
//           })
          
//           console.log('hi')
//           const data = await res.json()
//           console.log('hello')
//           setlog(prev =>[...prev,data.chat])
//           console.log("retrived chat",data.chat)
//           console.log('hellooo')

          
//           // if(res.status == 200){
//           //   console.log('200')
//           //   navigation.navigate('Agent',{
//           //     chat:data.chat.conversation,
//           //  } )
//           // }
          
//         }catch(e){
//           console.log(e)
//         }
        
          
   
         
          
           
//         }

//   return (
//     <View style={{padding:20,gap:10}}>

//     <TouchableOpacity onPress={handleGetChat} style={{backgroundColor:'#2A2A3A',padding:20,
//       borderWidth:1,borderColor:'white',alignItems:'center',borderRadius:20}}>
        
//         <Text style={{fontSize:20,fontWeight:500,color:'white'}}>{children}</Text>
//       <Text style ={styles.description} >Click Here for {children} History</Text>
    
//     </TouchableOpacity>
//     </View>
//   )
// }

// export default ChatCards