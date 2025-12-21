export enum UserRole {
  CUSTOMER = "customer",
  VENDOR = "vendor",
  ADMIN = "admin",
}

export interface IAddress {
  _id?: string;
  label: string; // e.g., "Home", "Office"
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
  productId: string; // Reference to Product Entity
  quantity: number;
  addedAt: Date;
}

export interface IUser {
  // Identification
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional so we don't send it to the frontend
  phoneNumber?: string;
  avatar?: string;

  // Permissions & Status
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;

  // E-commerce Specific Data
  addresses: IAddress[];
  wishlist: string[]; // Array of Product IDs
  cart: ICartItem[];

  // Payment Integration (e.g., Stripe)
  stripeCustomerId?: string;

  refreshToken?: String;

  // Metadata
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
