import jwt from 'jsonwebtoken'
const generateAdminToken = (admin)=> jwt.sign(
        { adminId: admin._id, email: admin.email, role: admin.role   ,  access: admin.access},
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
  
export { generateAdminToken}