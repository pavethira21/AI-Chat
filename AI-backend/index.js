const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const Groq = require('groq-sdk')
const jwt = require('jsonwebtoken')
const path = require('path')
const Joi = require('joi');
const multer = require('multer')
const moment = require('moment')
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
const excer = 'exercise'
const excerHstory = 'excerciseHistory'
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

app.post('/subscription',async(req,res)=>{
  const {Phno,days} = req.body 
  
  const todayDate = date.getDate()
  const todayMonth = (date.getMonth()) + 1
  const todayYear = date.getFullYear()
  const d = new Date();
  d.setDate(d.getDate() + days);
 
  endDate= d.getDate() +"/"+(d.getMonth()+1 )+"/"+d.getFullYear()
  console.log(endDate)
  const createdDate = todayDate+'/'+todayMonth +"/"+todayYear
  try{
    await main()

    const result = await client.db(dbName).collection(user_collection).updateOne({Phno:Phno},{$set:{subcription:{Status:'Active',startDate:createdDate,nextRenew:endDate}}})
    if(result){

      return res.status(200).json({message:"Subscribed"})
    }
    else{
      return res.status(400).json({message:"error subscribing"})
    }
  }catch(e){
    console.log('error',e)
  }
})


app.post('/login',async(req,res)=>{
  const schema = Joi.object({
    PhoneNumber: Joi.string()
      .pattern(/^[6-9]\d{9}$/).required()
      .messages({
        'string.pattern.base': 'Enter alid phone Number',
        'string.empty': 'Phone number is required',
      }),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { PhoneNumber } = value;
    try{
      if (PhoneNumber?.length==10){
     
          var token = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32'
          }); 
          console.log(token)
         return res.status(200).json({message:"Verification code Generated",token:token})
        }  
    }catch(e){
      console.log(e)
    }finally{
      client.close()
    }
   
})

app.post('/register',async(req,res)=>{
  try{
  const {PhoneNumber,Lang,age,Interest,Name,ocuupation}= req.body
  const todayDate = date.getDate()
  const todayMonth = (date.getMonth()) + 1
  const todayYear = date.getFullYear()
 
  const created_date = todayDate+'/'+todayMonth +"/"+todayYear
  const schema = Joi.object({
    PhoneNumber: Joi.string().pattern(/^[6-9]\d{9}$/).required().messages({
      'string.pattern.base': 'Enter Valid Phone Number',
      'any.required': 'Phone number is required',
    }),
    Lang: Joi.string().min(2).required().messages({
      'string.empty': 'Language is required',
    }),
    age: Joi.string().min(2).required().messages({
      'string.empty': 'Age is required',
    }),
    Interest: Joi.string().min(2).required().messages({
      'string.empty': 'Interest is required',
    }),
    Name: Joi.string().min(2).required().messages({
      'string.empty': 'Name is required',
    }),
    ocuupation: Joi.string().min(2).required().messages({
      'string.empty': 'Occupation is required',
    }),
  });

  console.log(created_date)
  
      main()
      if(!PhoneNumber,!Lang,!age,!Interest,!Name,!ocuupation){
        res.json({message:"Fill all the Details"})
      }
      console.log('here')
      const response = await client.db(dbName).collection(user_collection).insertOne({Phno:PhoneNumber,lang:Lang,age:age,Area_of_interest:Interest,userName:Name,occupation:ocuupation,credits:25,subcription:{},created_date:created_date,status:'active'})
      console.log('after update')
      if (response.acknowledged){
        console.log('here if')
        return res.status(200).json({message:"Registered successfully"})
    }else{
        return res.status(400).json({msg:"Not Updated"})
    }

  }catch(e){
    console.log(e)
  }finally{
    client.close()
  }
})

app.post('/verifyToken', async(req,res)=>{
    const {verifyToken,PhoneNumber} = req.body
    await main()
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
       return res.status(400).json({message:"Verification code Incorrect"})
      }
    }catch(e){
      console.log("error",e)
    }finally{
      client.close()
    }
    
})

app.post('/getAgent',async(req,res)=>{
  await main()
  try {
      const agents = await client.db(dbName).collection(agent).find({Agent_type:'Text'},{projection:{Agent_id:1,Name:1,Category:1,Description:1,icon:1}}).toArray()
      if(agents){
        res.json({agents:agents})
      }
  }catch(e){
    console.log(e)
  }finally{
    client.close()
  }
})

app.post('/getCredit',async(req,res)=>{
  await main()
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
    if(user.credits == 0 ){
      return res.json({user:user,message:'Please Upgrade your plan or add credit'})
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
    await main()
    const response = await client.db(dbName).collection(user_collection)
    .updateOne({Phno:PhoneNumber},{$inc:{credits:creditIncrease}})
    res.status(200).json(response)
  }catch(e){
    console.log(e)
  }finally{
    client.close()
  }
})

app.post ('/agentSpeech',upload.single('audio'),async(req,res)=>{
  const inputData =  req.body.input ? JSON.parse(req.body.input) : null;
  if (!inputData) {
    return res.status(400).json({ message: "Invalid input data" });
  }
  const {agentId, PhoneNumber } = inputData;
    console.log("Parsed input:", inputData);
  await main()

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




      const response = await client.db(dbName).collection(user_collection).updateOne({Phno:PhoneNumber},{$inc:{credits:-4}})
      console.log("Credit detected",response)
      
      console.log(chatCompletion.choices[0].message.content)
      
      console.log(transcription.text)
      return res.json({user:transcription.text,message:chatCompletion.choices[0].message.content})
    
    

  }catch(e){
    console.log(e)
  }finally{
    client.close()
  }

})

app.post('/getChat',async(req,res)=>{
  try{
   await main()
  let chats;
  const {PhoneNumber,agentId} =req.body
  if(!PhoneNumber){
    return res.json({message:"Details not enough"})
  }
 if(agentId){
  console.log(' agent id')
   chats = await client.db(dbName).collection(chat).find({Phno:PhoneNumber,Agent_id:agentId},
    {projection:{conversation:1,time_Stamp:1,_id:0,Agent_id:1}}).sort({time_Stamp:-1}).toArray()
 }else{
  console.log('no agent id')
  chats = await client.db(dbName).collection(chat).find({Phno:PhoneNumber},
    {projection:{conversation:1,time_Stamp:1,_id:0,Agent_id:1}}).sort({time_Stamp:-1}).limit(10).toArray()
 }
 
  //const agent_name = await client.db(dbName).collection(agent).findOne({Agent_id:chats[0].Agent_id},{projection:{_id:0,Name:1}})
 // console.log(chats[0].Agent_id)
  console.log("chats",chats)
  
  if(!chats){
    return res.json({message:"chats not found"})
  }
  console.log(chats) 
  return res.status(200).json({chat:chats})
  }catch(e){
    console.log(e)
  }finally{
    client.close()
  }
  
})

app.post('/agent',async(req,res)=>{
  console.log('api hit')
  const inputData = req.body

  
    const { message, responses,agentId, PhoneNumber } = inputData;
    console.log("Parsed input:", inputData);
  if(!agentId || !PhoneNumber){
    return res.json({"message":"Fill Details"})
  }
  await main()
  try{
    console.log('hello inside agent')
    const agentSelected = await client.db(dbName).collection(agent).findOne({Agent_id:agentId})
    console.log('agent selected')
    console.log(agentSelected)
    const user = await client.db(dbName).collection(user_collection).findOne({Phno:PhoneNumber})
    console.log(user)
    console.log(agentSelected.Prompt,user.lang)
    if(!agentSelected){
     return res.json({message:"Agent not found"})
    }
    if(!user){
      return res.json({message:"user not found"})
    }
    
      if(user.credits<1){
        return res.json({message:"Not enough credits , Purchase credits/ Add subcription"})
      }

      aiPromt = `translate the given message from ${user.lang} to english` + agentSelected.Prompt
      console.log('Has Credit',aiPromt)
      const chatCompletion = await groq.chat.completions.create({
        "messages":[
            {  
                "role":"system",
                "content": aiPromt,
            },
            {
                "role":"user",
                "content":message
            },
            
            

        ],
        "model":"llama-3.1-8b-instant",
        "temperature":agentSelected.Temperature,
        "max_tokens":agentSelected.Max_token,
        "stream":false,
        "stop":null
    });
    console.log('API fetch Completed')
    if(!chatCompletion){
      console.log('4')
     return res.json({message:"AI could not understand what you need could you be more specific"})
    }
    const response = await client.db(dbName).collection(user_collection).updateOne({Phno:PhoneNumber},{$inc:{credits:-1}})
    console.log("Credit detected")
    console.log(chatCompletion.choices[0].message.content)
    
    console.log('inserted')
   return res.json({user:message,message:chatCompletion.choices[0].message.content})
    


  }catch(e){
    console.log(e)
  }finally{
    client.close()
  }
})

app.post('/conversations',async(req,res)=>{
  const {convos,category,PhoneNumber} = req.body
  try{
   await main()
    console.log('hello inside agent')
    
   
    const user = await client.db(dbName).collection(user_collection).findOne({Phno:PhoneNumber})
    console.log(user)
    
    if(!user){
      return res.json({message:"user not found"})
    }
      if(user.credits<1){
        return res.json({message:"Not enough credits , Purchase credits/ Add subcription"})
      }
      console.log('Has Credit')
      const chatCompletion = await groq.chat.completions.create({
       
        "messages":convos,
        "model":"llama-3.1-8b-instant",
        "temperature":0.2,
        "max_tokens":100,
        "stream":false,
        "stop":null
    });
    console.log('API fetch Completed')
    if(!chatCompletion){
      console.log('4')
     return res.json({message:"AI could not understand what you need could you be more specific"})
    }
    const response = await client.db(dbName).collection(user_collection).updateOne({Phno:PhoneNumber},{$inc:{credits:-1}})
    console.log("Credit detected")
    console.log(chatCompletion.choices[0].message.content)
    
    console.log('inserted')
   return res.json({message:chatCompletion.choices[0].message.content})

}catch(e){
  console.log(e)
}})

app.post('/getUser',async(req,res)=>{
  await main()
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
    const nextRenew = user.subcription?.nextRenew;
    
    if (nextRenew) {
      const today = moment();
      const expiry = moment(nextRenew, 'D/M/YYYY');

      const daysLeft = expiry.diff(today, 'days');
      if (daysLeft <= 7 && daysLeft >= 0) {
        return res.json({user:user,message:'Renew Your Subcription to enjoy all the features, Only '+daysLeft+'days left untill your subcription expire'})
      }
    }
    console.log('got user try')
    return res.json({user:user})
  }catch(e){
    console.log(e)
  }finally{
    client.close()
  }
  
})
  
app.post('/addChathHistory',async(req,res)=>{
 
  console.log('history hit')
  try{
    const {agentId,message,PhoneNumber} = req.body
    const todayDate = date.getDate()
    const todayMonth = (date.getMonth()) + 1
    const todayYear = date.getFullYear()
    const hours = date.getHours()
    const minutes = date.getMinutes() 
    const Date = todayDate+'/'+todayMonth +"/"+todayYear
    const time=hours+":"+minutes
      await main()
      console.log(PhoneNumber)
      const user = await client.db(dbName).collection(user_collection).findOne({Phno:PhoneNumber})
      console.log('got user')
      if (!user){
        console.log('no user')
        return res.status(404).json({message:"user not found"})
      }
      console.log('before add')
      const result = await client.db(dbName).collection(chat).insertOne({Phno:PhoneNumber,Agent_id:agentId,conversation:message,time_Stamp:[Date,time],creditsDebited:1})
      console.log(result) 
      return res.status(200).json({message:"Added to db"})
  }catch(e){
    console.log(e)
  }finally{
    client.close()
  }
})

app.post('/getExcercise',async(req,res)=>{
  
  try{
    const {PhoneNumber} = req.body
    await main()
    console.log('api hit')
    const user = await client.db(dbName).collection(user_collection).findOne({Phno:PhoneNumber})

    if(!user){
      return res.status(404).json({message:"User not found"})
    }
    await main()
    console.log(user.age)
    
    const excercise = await client.db(dbName).collection(excer).find({user_Category:user.age}).sort({Category:-1}).toArray()
    console.log(excercise)
    return res.status(200).json({excercise:excercise})
  }catch(e){
    console.log(e)
  }finally{
    client.close()
  }
})

app.post('/addExcerciseHistory',async(req,res)=>{
  try{
    await main()
      const {convos,category , PhoneNumber} = req.body
      const result = await client.db(dbName).collection(excerHstory).insertOne({PhoneNumber:PhoneNumber,conversation:convos,Category:category})
      if(!result){
        return res.status(404).json({message:"Could Not Insert Chat"})
      }

      return res.status(200).json({message:"inserted successfully"})
  }catch(e){
    console.log("error",e)
  }finally{
    client.close()
  }
})

app.post('/getExcerciseHistory',async(req,res)=>{ 
  try{
    await main()
    const {PhoneNumber} = req.body
    const excerciseHistory = await client.db(dbName).collection(excerHstory).find({PhoneNumber:PhoneNumber}).sort({Category:1}).toArray()
    console.log(excerciseHistory)
    if(!excerciseHistory){ 

      return res.status(404).json({message:"no history found"})
    }

    return res.status(200).json({excerHistory:excerciseHistory})
  }catch(e){
    console.log("error",e)
  }finally{
    client.close()
  }
})



app.listen(PORT ,()=>
  {
      console.log("listening on port no:",PORT)
  })



