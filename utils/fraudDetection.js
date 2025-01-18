export const fraudDetection = async (req, res, next) => {
    const { amount } = req.body;
  
    if (amount > 10000) {
      return res.status(403).json({ message: "Transaction flagged for fraud detection" });
    }
  
    next();
  };
  