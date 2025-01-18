export const processUPIPayment = async (upiId, amount) => {
    if (!upiId || amount <= 0) {
      throw new Error("Invalid UPI payment request");
    }
  
    // Simulate UPI success (replace with actual payment gateway integration)
    return {
      status: "success",
      transactionId: `UPI-${Date.now()}`,
      message: "Payment successful",
    };
  };
  