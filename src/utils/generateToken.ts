export const runtime = "nodejs";  // for vercel

import { JWTPayload } from "@/types";
import jwt from "jsonwebtoken";

// Generate JWT Token
export function generateJwt(payload: JWTPayload): string {
    const privateKey = process.env.JWT_SECRET as string;
    if (!privateKey) throw new Error("JWT_SECRET is not defined");

    const token = jwt.sign(payload, privateKey, {
        expiresIn: "30d",
    });
    return token;
}
