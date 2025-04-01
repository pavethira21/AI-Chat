const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const Groq = require('groq-sdk')
const jwt = require('jsonwebtoken')
const path = require('path')
const multer = require('multer')
const fs = require('fs')
const formData = require('form-data')
const cors = require('cors')
var speakeasy = require("speakeasy");
const {MongoClient} = require('mongodb')
app.use(cors())
app.use(bodyParser.json())
dotenv.config()

GROQ_API_KEY = process.env.GROQ_API_KEY
const jwtseccode = process.env.JWT_SECRET
const PORT = process.env.PORT || 5000;
const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)
const dbName = 'AIChat';
const user_collection ="user"
const agent= 'agents'
const chat ='chat'
const date = new Date()
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
         res.status(200).json({message:"Verification code Generated"})
        }  
    }catch(e){
      console.log(e)
    }finally{
      client.close()
    }
   
})

app.post('/register',async(req,res)=>{
  const {PhoneNumber,Lang,age,Interest,Name,ocuupation}= req.body
  const todayDate = date.getDate()
  const todayMonth = (date.getMonth()) + 1
  const todayYear = date.getFullYear()

  const created_date = todayDate+':'+todayMonth +":"+todayYear
  console.log(created_date)
  try{
      main()
      if(!PhoneNumber,!Lang,!age,!Interest,!Name,!ocuupation){
        res.json({message:"Fill all the Details"})
      }
      const response = await client.db(dbName).collection(user_collection).updateOne({Phno:PhoneNumber},{$set:{lang:Lang,age:age,Area_of_interest:Interest,userName:Name,occupation:ocuupation,credits:25,subcription:{},created_date:created_date,status:'active'}})
      client.close()
      if (response.acknowledged){
        return res.json({message:"Updated successfully"})
    }else{
        return res.json({msg:"Not Updated"})
    }

  }catch(e){
    console.log(e)
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
          const user = await client.db(dbName).collection(user_collection).findOne({Phno:PhoneNumber})
          
          if(!user){
           return res.status(404).json({message:"user not found"})
          }
          const token = jwt.sign({ PhoneNumber:user.Phno },jwtseccode , { expiresIn: "5m" });
          return res.status(200).json({message:"LogIn successfully",user:user,token:token})
        }else{
          return res.status(404).json({message:"Phone Number required"})
        }
       
      }
      else{
       return res.json({message:"Verification code Incorrect"})
      }
    }catch(e){
      console.log("error",e)
    }
    
})

app.post('/getAgent',async(req,res)=>{
  main()
  try {
      const agents = await client.db(dbName).collection(agent).find({Agent_type:'Text'},{projection:{Agent_id:1,Name:1,Category:1,Description:1,icon:1}}).toArray()
      if(agents){
        res.json({agents:agents})
      }
  }catch(e){
    console.log(e)
  }
})

app.post('/getCredit',async(req,res)=>{
  main()
  try{
    console.log('inside try')
    const {PhoneNumber} = req.body
    if(!PhoneNumber){
      return res.json({message:"Phone number needed"})
    }
    console.log('getting user try')
    const user = await client.db(dbName).collection(user_collection).findOne({Phno:PhoneNumber},{projection:{credits:1}})
    console.log(user)
    if(!user){
      return res.json({message:"user Not found"})
    }
    console.log('got user try')
    return res.json({credit:user.credits})
  }catch(e){
    console.log(e)
  }finally{
    client.close()
  }
})

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/creditUpdate',async(req,res)=>{
  const {PhoneNumber,creditIncrease} = req.body
  try{
    main()
    const response = await client.db(dbName).collection(user_collection)
    .updateOne({Phno:PhoneNumber},{$inc:{credits:creditIncrease}})
    res.json(response)
  }catch(e){
    console.log(e)
  }
})

app.post ('/agentSpeech',upload.single('audio'),async(req,res)=>{
  const inputData =  req.body.input ? JSON.parse(req.body.input) : null;
  if (!inputData) {
    return res.status(400).json({ message: "Invalid input data" });
  }
  const {agentId, PhoneNumber } = inputData;
    console.log("Parsed input:", inputData);
  main()

  try{
    console.log('hello inside agent')
    const agentSelected = await client.db(dbName).collection(agent).findOne({Agent_id:agentId})
    console.log('agent selected')
    console.log(agentSelected)
    const user = await client.db(dbName).collection(user_collection).findOne({Phno:PhoneNumber})
    console.log(user.credits)
    if(!agentSelected){
     return res.json({message:"Agent not found"})
    }
    if(!user){
      return res.json({message:"user not found"})
    }
    if(user.credits<5){
      return res.json({message:"Not enough credits , Purchase credits/ Add subcription"})
    }
    console.log('has credit')
    const audioBuffer = req.file.buffer;
    const tempAudioFile = path.join(__dirname,'audio.wav')
    fs.writeFileSync(tempAudioFile,audioBuffer)
    const audio = fs.createReadStream(tempAudioFile)
    
      const transcription = await groq.audio.translations.create({
        file: audio,
        model: "whisper-large-v3",
        language:"en",
        response_format: "verbose_json",
        
      });
      if(!transcription.text){
        return res.json({message:"AI could not understand what you need could you be more specific"})
      }
      if(user.credits<1){
        return res.json({message:"Not enough credits , Purchase credits/ Add subcription"})
      }
      console.log('Has Credit')
      const chatCompletion = await groq.chat.completions.create({
        "messages":[
            {
                "role":"system",
                "content": agentSelected.Prompt,
            },
            {
                "role":"user",
                "content":transcription.text
            },
            

        ],
        "model":"llama-3.1-8b-instant",
        "temperature":agentSelected.Temperature,
        "max_tokens":1024,
        "stream":false,
        "stop":null
       

    });
    
    console.log('API fetch Completed')




      // const response = await client.db(dbName).collection(user_collection).updateOne({Phno:PhoneNumber},{$inc:{credits:-4}})
      // console.log("Credit detected",response)
      
      console.log(chatCompletion.choices[0].message.content)
      
      console.log(transcription.text)
      return res.json({user:transcription.text,message:chatCompletion.choices[0].message.content})
    
    

  }catch(e){
    console.log(e)
  }

})

app.post('/getChat',async(req,res)=>{
  const {PhoneNumber,Agent_id} =req.body
  if(!PhoneNumber|| Agent_id){
    return res.json({message:"Details not enough"})
  }

  const chats = await client.db(dbName).collection(chat).find({Phno:PhoneNumber}).toArray()
  if(!chats){
    return res.json({message:"chats not found"})
  }
  return res.json({chat:chats})
})

app.post('/agent',async(req,res)=>{
  console.log('api hit')
  const inputData = req.body
  const todayDate = date.getDate()
  const todayMonth = (date.getMonth()) + 1
  const todayYear = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const Date = todayDate+':'+todayMonth +":"+todayYear
  const time=hours+":"+minutes
    const { message, agentId, PhoneNumber } = inputData;
    console.log("Parsed input:", inputData);
  if(!agentId || !PhoneNumber){
    return res.json({"message":"Fill Details"})
  }
  main()
  try{
    console.log('hello inside agent')
    const agentSelected = await client.db(dbName).collection(agent).findOne({Agent_id:agentId})
    console.log('agent selected')
    console.log(agentSelected)
    const user = await client.db(dbName).collection(user_collection).findOne({Phno:PhoneNumber})
    console.log(user.credits)
    if(!agentSelected){
     return res.json({message:"Agent not found"})
    }
    if(!user){
      return res.json({message:"user not found"})
    }
    
      if(user.credits<1){
        return res.json({message:"Not enough credits , Purchase credits/ Add subcription"})
      }
      console.log('Has Credit')
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
    
    console.log('API fetch Completed')


    if(!chatCompletion){
      console.log('4')
     return res.json({message:"AI could not understand what you need could you be more specific"})
    }
    // const response = await client.db(dbName).collection(user_collection).updateOne({Phno:PhoneNumber},{$inc:{credits:-1}})
    // console.log("Credit detected")
    console.log(chatCompletion.choices[0].message.content)
    const chatInsert = await client.db(dbName).collection(chat).insertOne({Phno:user.Phno,Agent_id:agentSelected.Agent_id,Agent_type:agentSelected.Agent_type,Input:message,Output:chatCompletion.choices[0].message.content,time_Stamp:[Date,time],creditsDebited:1,agent_category:agentSelected.agent_category})
    console.log(chatInsert)
   return res.json({user:message,message:chatCompletion.choices[0].message.content})
    


  }catch(e){
    console.log(e)
  }
})

app.post('/getUser',async(req,res)=>{
  main()
  try{
    console.log('inside try')
    const {PhoneNumber} = req.body
    if(!PhoneNumber){
      return res.json({message:"Phone number needed"})
    }
    console.log('getting user try')
    const user = await client.db(dbName).collection(user_collection).findOne({Phno:PhoneNumber})
    console.log(user)
    if(!user){
      return res.json({message:"user Not found"})
    }
    console.log('got user try')
    return res.json({user:user})
  }catch(e){
    console.log(e)
  }finally{
    client.close()
  }
  
})



app.listen(PORT ,()=>
  {
      console.log("listening on port no:",PORT)
  })



