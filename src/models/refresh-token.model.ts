import { Schema, model, Types } from "mongoose";

const refreshTokenSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    jti: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  { timestamps: true }
);

// TTL index for automatic deletion
// refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index for efficient queries
refreshTokenSchema.index({ user: 1, jti: 1 });

export const RefreshToken = model("RefreshToken", refreshTokenSchema);
