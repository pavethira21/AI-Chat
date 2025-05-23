import {StyleSheet} from 'react-native';
import { Dimensions } from 'react-native';

const {width,height} = Dimensions.get('window')
export const styles = StyleSheet.create({
  container: {
    padding:16,
    flex: 1,
    backgroundColor:'#121526',
    alignItems:'center'
    
  },
  login:{
    flex:1,
    margin:'20%',
    padding:"20",
    justifyContent:'center'
    
  },
  grid:{
    
    padding:19,
    paddingBottom: 20,
    
  },
  button:{
    //backgroundColor:'#A357EF',
    width:width * 0.9,
    color:'white',
    borderRadius:10,
    padding:10,
    alignItems:'center'

  },
  card:{
    
    width: width * 0.37,
    height:height * 0.2,
    backgroundColor: "#2A2A3A",
    marginLeft:10,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cardText:{
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  description:{
    color: "#B0B0C3",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  icon:{
    color:'#A357EF',
    position: "absolute",
    top: 10,
    left: 10,
  },
  profileDetails:
  {color:'white',
    padding:10,
    borderColor:'gray',
    borderWidth:2,
    margin:10,
    fontSize:20,
    borderRadius:20
    },
    modalStyle:{
      backgroundColor:'#5a189a'
    }

});

