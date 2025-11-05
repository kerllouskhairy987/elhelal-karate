import { UserRole } from "@prisma/client";

export interface JWTPayload {
    id: number,
    name: string,
    email: string,
    role: UserRole,
}