// src/types/index.ts
import mongoose from "mongoose";

export enum UserRole {
  CUSTOMER = "customer",
  VENDOR = "vendor",
  ADMIN = "admin",
}

export interface IAddress {
  _id?: string;
  label: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface ICartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
}

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  addresses: IAddress[];
  wishlist: mongoose.Types.ObjectId[];
  cart: ICartItem[];
  stripeCustomerId?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Remove UserDocument from here - it's in user.model.ts
