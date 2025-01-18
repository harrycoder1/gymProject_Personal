import jwt from 'jsonwebtoken'

const generateUserToken = (user)=> jwt.sign(
        { userId: user._id},
        process.env.JWT_SECRET,
        // { expiresIn: "1d" }
      );


export {generateUserToken}