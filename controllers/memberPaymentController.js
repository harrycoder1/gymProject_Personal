// import { Payment } from "../models/PaymentSchema.js";
import { Payment } from "../models/PaymentsSchema.js";
import { responseSender } from "../utils/index.js";
// import { responseSender } from "../utils/index.js";

// Create Payment
export const createPayment = async (req, res) => {
  const { amount, transaction_id, payment_method , receiver } = req.body;

  const member_id = req.user.id
  console.log("Member Id",member_id)
  try {
    const newPayment = new Payment({
      member_id,
      amount,
      transaction_id,
      payment_method,
      receiver
    });

    const savedPayment = await newPayment.save();
    responseSender(
      "Payment created successfully!",
      true,
      201,
      res,
      {data:savedPayment}
    );
  } catch (error) {
    responseSender("Failed to create payment", false, 500, res, error);
  }
};


export const createPaymentOffline = async (req, res) => {
    const { member_id , amount,  } = req.body;
    const payment_method = "Cash"
//   gym authentication Required 
    // const member_id = req.user.id
    const receiver = req.body.gymId
    console.log("Member Id",member_id)
    try {
      const newPayment = new Payment({
        member_id,
        amount,
        transaction_id:null,
        payment_method,
        receiver
      });
  
      const savedPayment = await newPayment.save();
      responseSender(
        "Payment created successfully!",
        true,
        201,
        res,
        savedPayment
      );
    } catch (error) {
      responseSender("Failed to create payment", false, 500, res, error);
    }
  };
// 

// Get All Payments
export const getAllPayments = async (req, res) => {
  try {
    // admin auth requried
    const payments = await Payment.find({}).populate("member_id", "name email").populate("receiver" , "gymName ownerName ownerEmail");
    responseSender("Payments fetched successfully!", true, 200, res, {data: payments});
  } catch (error) {
    responseSender("Failed to fetch payments", false, 500, res, error);
  }
};

// Update Payment Verification Status
export const updatePaymentVerification = async (req, res) => {
  const { id } = req.params;
  const { verificationStatus  } = req.body;
const verifyBy = req.body.adminId
  try {
    const payment = await Payment.findByIdAndUpdate(
      id,
      { verificationStatus , verificationStatus ,verifyBy:verifyBy ,  verifyDate: verificationStatus ? new Date() : null   },
      { new: true }
    );

    if (!payment) {
      return responseSender("Payment not found", false, 404, res);
    }

    responseSender(
      "Payment verification status updated successfully!",
      true,
      200,
      res,
      {data:payment}
    );
  } catch (error) {
    responseSender("Failed to update payment verification", false, 500, res, error);
  }
};


// make the get request to control the payemetn fetching :
export const getAllByGym =async (req, res) => {
    const gymId = req.body.gymId
    try {
      // admin auth requried
      const payments = await Payment.find({receiver:gymId}).populate("member_id", "name email profileImg contact_number");
      responseSender("Payments fetched successfully!", true, 200, res, {data: payments});
    } catch (error) {
      responseSender("Failed to fetch payments", false, 500, res, error);
    }
  };

export const getAllByPaymentByMember = async (req, res) => {
    const id = req.user.id
    try {
      // admin auth requried
      const payments = await Payment.find({member_id:id}).populate("receiver", "gymName gLocation  ownerEmail contact_number");
      responseSender("Payments fetched successfully!", true, 200, res, {data: payments});
    } catch (error) {
      responseSender("Failed to fetch payments", false, 500, res, error);
    }
  };