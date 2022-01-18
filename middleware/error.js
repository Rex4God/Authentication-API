const ErrorResponse = require('../utils/errorResponse')
const {StatusCodes} = require('http-status-codes')

const errorHandler =(err, req,res, next)=>{
 let error ={...err};
 error.message = err.message

 if(err.code===11000){
 const message = `Duplicate Field Value Entered`;
 error = new ErrorResponse(message,StatusCodes.BAD_REQUEST);
 }
 if(err.name ==="ValidationError"){
    const message = Object.values(err.errors).map((val) =>val.message)
    error = new  ErrorResponse(message, StatusCodes.BAD_REQUEST);
 }
 res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
     success: false,
     error:error.message || "Server Error",
 });
}

module.exports=errorHandler;