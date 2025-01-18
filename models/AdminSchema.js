import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "temp-admin"],
    },
    access: {
      type: [String],
      validate: {
        validator: function (v) {
          const validAccess = ["add", "update", "view", "delete"];
          return v.every((action) => validAccess.includes(action));
        },
        message: "Invalid access action specified!",
      },
    },
    password: {
      type: String,
    },
    accessTill: {
      type: Date,
      required: function () {
        return this.role === "temp-admin";
      },
      validate: {
        validator: function (v) {
          return v > Date.now();
        },
        message: "accessTill must be a future date!",
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false, // Email verification flag
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpires :{
      type:Date
    } , 

    resetToken: {
      type: String,
    },
    resetTokenExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

AdminSchema.index({ email: 1, role: 1 });

const Admin = mongoose.models.admin || mongoose.model("admin", AdminSchema);

export default Admin;
