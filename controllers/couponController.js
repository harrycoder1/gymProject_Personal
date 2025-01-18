// import { Coupon } from '../models/couponModel.js';
import { Coupon } from '../models/CouponSchema.js';
// import { validationResult } from 'express-validator';
import { responseSender } from '../utils/index.js';
// import User from '../models/UserSchema.js';
import { ERROR_MSG } from '../content/index.js';

// Create a new coupon
export const createCoupon = async (req, res) => {
  const {code , gymId} = req.body
  try {
    const exists = await Coupon.findOne({code:code , gymId:gymId})

    if(exists){
       return responseSender("This Coupon Code Already Exists on Your Gym  ,  try to Use Another code" , false , 400 , res )
    }

    const coupon = new Coupon({...req.body });
    await coupon.save();

    // res.status(201).json(coupon);

   return responseSender("New Coupon is Created SuccessFully !" , true , 201 , res , {data:coupon})

  } catch (error) {
    console.log(error)
    return responseSender(ERROR_MSG , false , 500 , res , {error:error})

  }
};

// Get a coupon by ID
export const getCouponById = async (req, res) => {
  try {

    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) return responseSender('Coupon not found'  , false , 404 , res)
    
       return responseSender("Coupon fetch by Id SucceessFully !" , true , 200 , res , {data:coupon})

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a coupon by ID
export const updateCoupon = async (req, res) => {

  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json(coupon);

  return responseSender()


  } catch (error) {
  return responseSender(ERROR_MSG , false , 500 , res , {error:error})
  }
};

// Delete a coupon by ID
export const deleteCoupon = async (req, res) => {
  try {

    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return responseSender("Coupon not Found !" , false , 404 , res);

  return responseSender('Coupon deleted successfully !'  , true , 200 , res );


  } catch (error) {
  return responseSender(ERROR_MSG , false , 500 , res , {error:error})
  }
};

// Get all coupons
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();

 return responseSender("All Coupons Fetch SuccesFully !" , true , 200 , res , {data:coupons})
  } catch (error) {
  return responseSender(ERROR_MSG , false , 500 , res , {error:error})
  }
};

// get the Coupon by gymId
export const getCouponsBygymId = async (req, res) => {
    const {gymId} = req.body
    try {

      const coupons = await Coupon.find({gymId:gymId});

  
   return responseSender("Gym Coupons Fetch SuccesFully  !" , true , 200 , res , {data:coupons})
    } catch (error) {
    return responseSender(ERROR_MSG , false , 500 , res , {error:error})
    }
  };

// get the Coupon by  Code :
export const getCouponsByCode = async (req, res) => {
    const {code} = req.params
    try {

      const coupons = await Coupon.find({code:code});

  
   return responseSender("Coupons Code Fetch SuccesFully  !" , true , 200 , res , {data:coupons})
    } catch (error) {
    return responseSender(ERROR_MSG , false , 500 , res , {error:error})
    }
  };