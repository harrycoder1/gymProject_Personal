import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { logPath, responseSender } from '../utils/index.js';

const router = express.Router();

// Initiate Google OAuth login
router.get(
  '/google',logPath , 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Handle Google OAuth callback
router.get(
  '/google/callback',logPath , 
  passport.authenticate('google', 
    { 
      failureRedirect: '/'  //here we will add if auth fail then redirect where 

    }),
  (req, res) => {
    // Generate a JWT for the authenticated user
    const token = jwt.sign({ id: req.user._id, email: req.user.email }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });

return responseSender('Login successful !' , true , 200 , res , {token, user: req.user})
    // res.status(200).json({ message: ,  });
  }
);

export default router;
