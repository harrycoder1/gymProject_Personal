import jwt from 'jsonwebtoken'
import { responseSender } from '../utils/index.js'



const adminAuthMiddleWare = (req , res , next) =>{
    const {admin_token} = req.headers 

    if(!admin_token) {
        return responseSender("You are Not Authorized !" , false , 400 , res )
    }
    // {
    //     adminId: '6783af315d09baa3c7de6720',
    //     email: '2dsdf.doe@example.com',
    //     role: 'admin',
    //     access: [ 'add', 'view' ],
    //     iat: 1736689347,
    //     exp: 1736775747
    //   }
    const admin = jwt.verify(admin_token , process.env.JWT_SECRET)
    const requestMethod = {
        POST:"add" ,
        GET:"view" ,
        DELETE:"delete" ,
        PUT:"add"
    }
    // if(requestMethod[req.method]  )
    
    if(!admin.access){
       return responseSender("You don't have the access" , false , 400 , res)
    }

    if (admin.role =="temp-admin"){
        const verifyAccess =  admin.access.includes(requestMethod[req.method])

        if(!verifyAccess){
            return responseSender("You are temperary admin and you have give Limited Access" , false , 400 , res)
        }

        req.body.adminId = admin.adminId
        console.log("MiddleWare ID -" ,  req.body.adminId)
        next()
    
    
    
    
    }
    else{
        req.body.adminId = admin.adminId
        next()
    }


    
}

export default adminAuthMiddleWare