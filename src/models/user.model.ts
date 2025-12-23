import mongoose, { Schema, type HydratedDocument } from "mongoose";
import bcrypt from "bcrypt";
import { UserRole, type IUser } from "../types/index.js";

/* ------------------ Sub Schemas ------------------ */

const addressSchema = new Schema(
  {
    label: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const cartItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

/* ------------------ User Schema ------------------ */

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minLength: [2, "First name must be at least 2 characters"],
      maxLength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minLength: [2, "Last name must be at least 2 characters"],
      maxLength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: { type: Boolean, default: false },
    addresses: [addressSchema],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    cart: [cartItemSchema],
    stripeCustomerId: String,
    lastLogin: Date,
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

/* ------------------ Hooks ------------------ */

userSchema.pre("save", async function (this: HydratedDocument<IUser>) {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password!, salt);
});

/* ------------------ Methods ------------------ */

userSchema.methods.comparePassword = async function (
  this: HydratedDocument<IUser>,
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password!);
};

export const User = mongoose.model<IUser>("User", userSchema);
