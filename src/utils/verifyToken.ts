import { JWTPayload } from "@/types";
import jwt from "jsonwebtoken";

export const verifyToken = (token: string): JWTPayload | null => {
    if (!token) return null;
    const privateKey = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, privateKey) as JWTPayload;

    return decoded;
}