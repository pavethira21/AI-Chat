const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const Groq = require('groq-sdk')
const cors = require('cors')
var speakeasy = require("speakeasy");
const {MongoClient} = require('mongodb')
app.use(cors())
app.use(bodyParser.json())
dotenv.config()
GROQ_API_KEY = process.env.GROQ_API_KEY
const PORT = process.env.PORT || 5000;
const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)
const dbName = 'AIChat';
const user_collection ="user"
const agent= 'agents'
const chat ='chat'
var secret = speakeasy.generateSecret({length: 20});
const groq = new Groq({
  apiKey: GROQ_API_KEY
});
async function main(){
    try{
        await client.connect();
        console.log("connected to mongodb")   
    }catch(e){console.error(e)}
}  


app.post('/login',async(req,res)=>{
    const {PhoneNumber} = req.body
    try{
      if (PhoneNumber?.length==10){
     
          var token = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32'
          });
          console.log(token)
         res.json({message:"Verification code Generated"})
        }  
    }catch(e){
      console.log(e)
    }finally{
      client.close()
    }
   
})

app.post('/verifyToken', async(req,res)=>{
    const {verifyToken,PhoneNumber} = req.body
    main()
    try{
      var tokenValidates = speakeasy.totp.verify({
        secret: secret.base32,
        encoding: 'base32',
        token: verifyToken,
        window: 6
      });
      
      
      if(tokenValidates === true){
        if(PhoneNumber){
          var user = await client.db(dbName).collection(user_collection).findOne({Phno:PhoneNumber})
          if(!user){
            res.json({message:"user not found"})
          }
          res.json({message:"LogIn successfully",user:user})
        }
       
      }
      else{
        res.json({message:"Verification code Incorrect"})
      }
    }catch(e){
      console.log("error",e)
    }
    
})

app.post('/getAgent',async(req,res)=>{
  main()
  try {
      const agents = await client.db(dbName).collection(agent).find({},{projection:{Agent_id:1,Name:1,Category:1,Description:1,icon:1}}).toArray()
      if(agents){
        res.json({agents:agents})
      }
  }catch(e){
    console.log(e)
  }
})


app.post('/agent',async(req,res)=>{
  const {message,type,agentId} = req.body
  if(!message || !type || !agentId){
    res.json({"message":"Fill Details"})
  }
  main()
  try{
    console.log('hello inside agent')
    const agentSelected = await client.db(dbName).collection(agent).findOne({Agent_id:agentId})
    console.log('agent selected')
    console.log(agentSelected)
    if(!agentSelected){
      res.json({message:"Agent not found"})
    }
    if(type ==='Text'){
      console.log('1')
      const chatCompletion = await groq.chat.completions.create({
        "messages":[
            {
                "role":"system",
                "content": agentSelected.Prompt,
            },
            {
                "role":"user",
                "content":message
            },
            

        ],

        "model":"llama-3.1-8b-instant",
        "temperature":agentSelected.Temperature,
        "max_tokens":1024,
        "stream":false,
        "stop":null
       

    });
    
    console.log('2')


    if(!chatCompletion){
      console.log('4')
      res.json({message:"AI could not understand what you need could you be more specific"})
    }
    console.log(chatCompletion.choices[0].message.content)
    res.json({message:chatCompletion.choices[0].message.content})
    


    }


  }catch(e){
    console.log(e)
  }
})

app.listen(PORT ,()=>
  {
      console.log("listening on port no:",PORT)
  })



