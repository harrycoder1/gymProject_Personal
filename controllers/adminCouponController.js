import { ERROR_MSG } from "../content/index.js";
import  CouponCode from "../models/GymsCopounSchema.js" 
import { responseSender } from "../utils/index.js";

const getAllCoupons = async(req,res)=>{
try {
  
  const data = await  CouponCode.find({})
return responseSender("All Coupons Fetch SucessFully !" , true , 200 , res , data)
} catch (error) {
return responseSender(ERROR_MSG , false , 400 , res ,error )
  
}

}

// get by Coupon name :
const getByCouponCode=async(req, res)=>{
  try {
    const {code} = req.params
    const coupon  =await CouponCode.findOne({code:code})

  return responseSender("Coupon by code fetch Successfully !" , true , 200 , res , coupon)
  } catch (error) {
  return responseSender(ERROR_MSG , true , 400 , res )
  }
  

}
// Route to add a new coupon code
const addAdminCoupon =  async (req, res) => {
  try {
    const {
      code,
      discount_percentage,
      description,
      valid_from,
      valid_until,
      is_all_eligible_gyms , 

      eligible_gym_ids,
      eligible_plan_ids,
      max_usage,
    } = req.body;


    // Validate date range
    if (new Date(valid_from) >= new Date(valid_until)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid date range provided!" });
    }
    const isExists = await CouponCode.findOne({code:code})

    if(isExists ) {
     return responseSender('This Coupon Code Already Exist !'  , false , 400 , res )
    }
    const newCoupon = new CouponCode({
      code,
      discount_percentage,
      description,
      valid_from,
      valid_until,
      eligible_gym_ids,
      is_all_eligible_gyms , 
      eligible_plan_ids,
      max_usage,
    });

    await newCoupon.save();
    res
      .status(201)
      .json({ success: true, message: "Coupon code added successfully!", newCoupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add coupon code!" });
  }
};

// Route to update an existing coupon code

const  updateAdminCoupon = async (req, res) => {
  const { couponId } = req.params;
  const updates = req.body;

  try {
    // Prevent changing immutable fields
    if (updates.code) {
      delete updates.code;
    }

    const updatedCoupon = await CouponCode.findByIdAndUpdate(
      couponId,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ success: false, message: "Coupon not found!" });
    }

    res
      .status(200)
      .json({ success: true, message: "Coupon code updated successfully!", updatedCoupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update coupon code!" });
  }
};

// Route to delete a coupon code
const removeAdminCoupon =  async (req, res) => {
  const { couponId } = req.params;

  try {
    const deletedCoupon = await CouponCode.findByIdAndDelete(couponId);

    if (!deletedCoupon) {
      return res.status(404).json({ success: false, message: "Coupon not found!" });
    }

   return res
      .status(200)
      .json({ success: true, message: "Coupon code deleted successfully!" });
  } catch (error) {
    console.error(error);
   return  res.status(500).json({ success: false, message: "Failed to delete coupon code!" });
  }
};

export {
    addAdminCoupon , updateAdminCoupon , removeAdminCoupon , getAllCoupons , getByCouponCode
}