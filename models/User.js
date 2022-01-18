const  mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt =require('jsonwebtoken')
require('dotenv').config();


const userSchema = new mongoose.Schema({
                userName:{
                    type: String,
                    required:[true, 'Please provide your username'],
                    trim: true,
                    unique: true,   
                },
                email:{
                    type: String,
                    required:[true,'Please provide your email address'],
                    match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                     'Please provide a valid email address'
                    ],
                    unique: true,
                    
                },
                password:{
                    type: String,
                    required: [true, 'Please provide your password'],
                    minlength:6,
                    maxlength: 16,
                    select:false,
                },
                resetPasswordToken: String,
                resetPasswordExpire: Date,
    

},{timestamps: true})

userSchema.pre("save", async function(next){
 if(!this.isModified("password")){
 next();
 }
 const salt  =await bcrypt.genSalt(10);
 this.password = await bcrypt.hash(this.password, salt)
next();
});

userSchema.methods.matchPasswords = async function(password) {
return  await bcrypt.compare(password,  this.password);
};
userSchema.methods.getSignedToken  = function () {
    return jwt.sign({ id: this._id },process.env.JWT_SECRET, { expiresIn: process.env.LIFE_TIME });
};

module.exports =mongoose.model('User', userSchema)