import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const {token} = req.headers;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded data (e.g., `id`) to the request
    console.log(decoded)
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
