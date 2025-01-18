import { GymLicenceIDVerification, pandCardVefication } from "./gymhelper.js"
import { response } from "express"
export const logPath=(req,res , next)=>{
    console.log(`${req.method} - ${req.path} -  ${req.originalUrl}`)

    next()
}



 const responseSender = (message, success, statusCode, res, data = {}) => {
    res.status(statusCode).json({
      success,
      message,
      ...data,
    });
  };
  

export {
    pandCardVefication  , 
GymLicenceIDVerification ,
responseSender
 }