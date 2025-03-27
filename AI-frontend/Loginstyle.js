import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding:16,
    flex: 1,
    backgroundColor:'#301934',
    alignItems:'center'
    
  },
  login:{
    flex:1,
    margin:'20%',
    padding:"20",
    justifyContent:'center'
    
  },
  grid:{
    flexDirection: "row",
    flexWrap: "wrap",
    padding:19,
    paddingBottom: 20,
    
  },
  button:{
    backgroundColor:'#9400D3',
    width:'90%',
    color:'white',
    borderRadius:10,
    padding:10,
    alignItems:'center'

  },
  card:{
    
    width: "150",
    height:"200",
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
    marginTop: 8,
    textAlign: "center",
  },
  description:{
    color: "#B0B0C3",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  icon:{
    color:'#BF00FF',
    position: "absolute",
    top: 10,
    left: 10,
  }

});

