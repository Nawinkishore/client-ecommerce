import { Role } from "@client-ecommerce/types";

export interface AuthUser {
  id: string;
  userId: string;
  email: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
