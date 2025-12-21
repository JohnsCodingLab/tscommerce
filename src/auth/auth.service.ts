import { User } from "../models/user.model.js";
import type { RegisterUserDTO } from "../payload/request.dto.js";
import type { AuthResponseDTO } from "../payload/response.dto.js";
import { AppError } from "../utils/AppError.js";
import { generateAccessToken } from "../utils/jwt.js";

export const registerUser = async (
  request: RegisterUserDTO
): Promise<AuthResponseDTO> => {
  const existingUser = await User.findOne({ email: request.email });
  if (existingUser) {
    throw new AppError("User with this email already exist", 400);
  }

  const user = await User.create(request);

  return {
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    accessToken: generateAccessToken(user),
  };
};
