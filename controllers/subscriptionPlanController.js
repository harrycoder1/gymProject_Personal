// import { SubscriptionPlan } from '../models/SubscriptionPlan.js';

import { ERROR_MSG } from "../content/index.js";
import { SubscriptionPlan } from "../models/GymsSubscriptionPlans.js";
import { responseSender } from "../utils/index.js";

// Create a subscription plan
export const createSubscriptionPlan = async (req, res) => {
// add access  by admin only 

const {name} = req.body
  try {

    const isExists = await SubscriptionPlan.findOne({name:name})
    if(isExists){
        return responseSender("This name of SubScription Plan Already Exist !" , false , 400 , res)
    }
console.log(req.body.adminId)
    const subscriptionPlan = new SubscriptionPlan({...req.body, lastUpdatedBy: req.body.adminId , lastUpdatedDate:Date.now()});
    await subscriptionPlan.save();
    
   return responseSender("Subscription plan created successfully !", true ,201 , res , {data:subscriptionPlan})
   
  } catch (error) {
    return responseSender(ERROR_MSG , false , 500 , res)
  }
};

// Get all subscription plans
export const getAllSubscriptionPlans = async (req, res) => {

  try {
    const subscriptionPlans = await SubscriptionPlan.find();

    return responseSender("All Subscription Plan has Fetch SuccessFully !" , true , 200 , res , {data:subscriptionPlans})

    // res.status(200).json(subscriptionPlans);
  } catch (error) {
    return responseSender(ERROR_MSG , false , 500 , res)
  }
};

// Get a subscription plan by ID
export const getSubscriptionPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const subscriptionPlan = await SubscriptionPlan.findById(id);

    if (!subscriptionPlan) {
      return responseSender('Subscription plan not found' , false , 404 , res)
    }

    return responseSender('Subscription Fetch SuccessFully !' , false ,200 , res ,{data:subscriptionPlan} )
  } catch (error) {
    return responseSender(ERROR_MSG , false , 500 , res)
  }
};

// Update a subscription plan
export const updateSubscriptionPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(id, {...req.body, lastUpdatedBy: req.body.adminId , lastUpdatedDate:Date.now()}, {
      new: true,
      runValidators: true,
    });

    if (!updatedPlan) {
      return responseSender("Subscription Plan Not Found !" , false , 404 , res);
    }

    return responseSender(`${updatedPlan.name} Plan Updated SuccessFully !` , true , 200 , res , {data:updatedPlan})

  } catch (error) {
    return responseSender(ERROR_MSG , false , 500 , res)
  }
};

// Delete a subscription plan
export const deleteSubscriptionPlan = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedPlan = await SubscriptionPlan.findByIdAndDelete(id);

    if (!deletedPlan) {
      return responseSender("Subscription Plan Not Found !" , false , 404 , res);
    }

   return  responseSender("Subscription Plan is Deleted SuccessFully !" , true , 200 , res );
  } catch (error) {
    return responseSender(ERROR_MSG , false , 500 , res)
  }
};
