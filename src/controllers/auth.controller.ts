// import type { Request, Response } from "express";
// import { asyncHandler } from "../middlewares/asyncHandler.js";
// import type { RegisterUserDTO } from "../payload/request.dto.js";
// import { registerUser } from "../services/auth.service.js";

// export const register = asyncHandler(
//   async (req: Request<{}, {}, RegisterUserDTO>, res: Response) => {
//     const data = await registerUser(req.body);

//     res.status(201).json({
//       status: "success",
//       message: "User registered successfully",
//       data,
//     });
//   }
// );
