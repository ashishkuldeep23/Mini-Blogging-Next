import { JWT_SECRET } from "@/constant";
import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  email: string;
  username: string;
  name: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}

export function getTokenFromRequest(authHeader?: string): string | null {
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.replace("Bearer ", "");
}
