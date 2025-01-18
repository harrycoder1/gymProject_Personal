import { responseSender } from "../utils/index.js"
import jwt from 'jsonwebtoken'
const userAuthMiddleWare =(req, res , next)=>{
const {usertoken} = req.headers 
const {token} = req.headers 
if(!usertoken){
    return responseSender("UnAuthorized User !" , false  , 400 , res)
}
// 

const user = jwt.verify(usertoken , process.env.JWT_SECRET)

if(!user){
    return responseSender("UnAuthorized User !" , false ,400 , res)
}

req.body.userId = user.userId


    next()
}

export default userAuthMiddleWare