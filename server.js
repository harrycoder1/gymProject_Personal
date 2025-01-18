import 'dotenv/config.js'

import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'

import passport from 'passport';
import session from 'express-session';
import './config/passport.js';
import memberRoutes from './routes/memberRoutes.js';
import authRoutes from './routes/authRoutes.js';
// authRoutes
// add the routers path :
import gymRouter from './routes/gymsRoute.js'
import { logPath, responseSender } from './utils/index.js'
import adminRouter from './routes/AdminRoute.js'
import copounRouter from './routes/adminCouponRouter.js'
import userRouter from './routes/userRoute.js'
import couponRouter from './routes/couponRoute.js'
import gymcouponRouter from './routes/couponRoute.js'
import subscriptionPlanRouter from './routes/subscriptionPlanRoutes.js'
import membershipRouter from './routes/membershipRoutes.js'
import paymentRouter from './routes/memberPaymentRoute.js';
import trainerRouter from './routes/trainerRoutes.js';
import classRouter from './routes/classRoutes.js';


import './scheduler/index.js' //for apply the schedule in the web -app
import walletRouter from './routes/walletRoutes.js';
import transactionRouter from './routes/transactionRoutes.js';
// app config:
const app = express()
// const port =8080

// middleware : 
app.use(express.json())
app.use(cors())

app.use(express.static("public")); // 

// connect the mongodb :
connectDB()
app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-default-secret', // Use a strong secret
      resave: false, // Avoid resaving session if it hasn't been modified
      saveUninitialized: false, // Avoid saving empty sessions
      cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true, // Prevent client-side JavaScript from accessing cookies
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      },
    })
  );

// app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(`/auth`, authRoutes);
app.use(`${process.env.LOG_PATH}/members`, memberRoutes);

// Add APi end points :


app.use(`${process.env.LOG_PATH}/gyms` , gymRouter)
app.use(`${process.env.LOG_PATH}/admin` , adminRouter)
app.use(`${process.env.LOG_PATH}/coupons` , copounRouter)
app.use(`${process.env.LOG_PATH}/user` , userRouter)
app.use(`${process.env.LOG_PATH}/user` , couponRouter)
app.use(`${process.env.LOG_PATH}/gym-coupons` , gymcouponRouter)
app.use(`${process.env.LOG_PATH}/gyms-admin-subscription` , subscriptionPlanRouter)
app.use(`${process.env.LOG_PATH}/membership` , membershipRouter)
app.use(`${process.env.LOG_PATH}/member-payment` , paymentRouter)

app.use(`${process.env.LOG_PATH}/trainer` , trainerRouter)
app.use(`${process.env.LOG_PATH}/class-gyms` , classRouter)

// AMount related Routes
app.use(`${process.env.LOG_PATH}/wallets` ,walletRouter )
app.use(`${process.env.LOG_PATH}/transactions` , transactionRouter)





// /add

// app.use()

app.get('/' ,logPath, (req , res)=>{
   
    
    res.status(200).send("Gym project Api in on Live !")
    
})

app.listen(process.env.SERVER_PORT  , ()=>{
    console.log(`Sever Started on http://localhost:${process.env.SERVER_PORT }`)
})

