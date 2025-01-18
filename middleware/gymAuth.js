import jwt from 'jsonwebtoken'
import { responseSender } from '../utils/index.js'



const gymAuthMiddleWare = (req , res , next) =>{
    const {gym_token} = req.headers 

    if(!gym_token) {
        return responseSender("You are Not Authorized !" , false , 400 , res )
    }

    const gym = jwt.verify(gym_token , process.env.JWT_SECRET)
  
    // gym.gymId , gym.gymName
    req.body.gymId  = gym.gymId
    req.body.gymName = gym.gymName
    // if(requestMethod[req.method]  )
    
    
next()


    
}

export default gymAuthMiddleWare