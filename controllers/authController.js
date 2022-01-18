const User = require('../models/User')
const{StatusCodes} =require('http-status-codes')
const ErrorResponse =require('../utils/errorResponse')


const register =async(req,res, next)=>{
    //  User.findOne({email: req.body.email})
    // .exec((err, user)=>{
    //     if(user)
    // res.status(StatusCodes.BAD_REQUEST).json({message: 'User Already Exist in the database'})
    // });
    const {userName, email, password} =req.body
    try{
        const user = await User.create({
        userName, email, password,
     });
    sendToken(user, StatusCodes.CREATED, res);
    }catch(error){
    next(error)
    }  
};
const login = async (req, res, next)=>{
const {email, password} = req.body;
if(!email || !password){
return next( new ErrorResponse(" Please provide an Email and Password",StatusCodes.BAD_REQUEST))
}
try{
const user = await User.findOne({email}).select("+password");
if(!user){
return next( new ErrorResponse("Invalid Credentials", StatusCodes.UNAUTHORIZED))
}
 const isMatch =await user.matchPasswords(password)
 if(!isMatch){
return next( new ErrorResponse("Invalid Credentials", StatusCodes.UNAUTHORIZED));
 }
sendToken(user, StatusCodes.OK, res);
}catch(error){
res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message})

}

};

const forgetPassword = async(req, res, next)=>{
    res.send({message: 'This is  forgetpassword Route'})

}

const resetPassword = async(req, res, next)=>{

res.send({message: 'This is resetpassword Route'})

}

const  sendToken =(user, statusCode, res)=>{
const token = user.getSignedToken();
res.status(statusCode).json({success: true, token})
 }
   

module.exports ={
    register,
    login,
    forgetPassword,
    resetPassword
}

   