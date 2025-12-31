import { IUser } from "./index.js";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<IUser, "_id" | "role">;
    }
  }
}
