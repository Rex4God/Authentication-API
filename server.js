const express = require('express')
const app =express()
const morgan =require('morgan')
require('dotenv').config()
const connectDB = require('./config/connect')
const authRoute = require('./routes/authRoute')
const errorHandler = require('./middleware/error')




//Middleware Declaration
app.use(express.json())
app.use(express.urlencoded({extended:false}))


//Third Party Middleware Declaration
app.use(morgan('dev'))


//Routing Declaration
app.use('/api/v1',authRoute)

//ERRORHANDLER MIDDLEWARE
 app.use(errorHandler)





//SERVER STATEMENT DECLARATION
const port =process.env.PORT||7000

const start =async()=>{
   try{
   await connectDB(process.env.MONGO_URL)
   console.log('CONNECTED TO DATABASE @LOCALHOST 27017')
   const server = app.listen(port,()=>{
   console.log(`Server is listening @ port ${port}.....`)
   })
   }catch(err){
   console.log('DATABASE FAILED TO CONNECT!!')
   }

}
start();

process.on("unhandledRejection", (err,promise)=>{
   console.log(`Logged Error ${err}`);
   server.close(()=>process.exit(1))
});


