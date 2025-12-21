import mongoose, { Schema, type HydratedDocument } from "mongoose";
import bcrypt from "bcrypt";
import { UserRole, type IUser } from "../types/user.js";

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
      required: true,
      trim: true,
      minLength: 1,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    phoneNumber: String,
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
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
);

/* ------------------ Hooks ------------------ */

userSchema.pre("save", async function (this: HydratedDocument<IUser>) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password!, 12);
});

/* ------------------ Methods ------------------ */

userSchema.methods.comparePassword = async function (
  this: HydratedDocument<IUser>,
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password!);
};

export const User = mongoose.model<IUser>("User", userSchema);
