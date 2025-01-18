import jwt from 'jsonwebtoken'
import { responseSender } from '../utils/index.js'



const trainerAuthMiddleWare = (req , res , next) =>{
    const {tr_token} = req.headers 

    if(!tr_token) {
        return responseSender("You are Not Authorized !" , false , 400 , res )
    }

    // console.log(tr_token)

    const trainer = jwt.verify(tr_token , process.env.JWT_SECRET)
  
   
    req.trainerId  = trainer.trainerId

next()


    
}

export default trainerAuthMiddleWare