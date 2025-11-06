import { UserRole } from "@prisma/client";

export interface JWTPayload {
    id: string,
    name: string,
    email: string,
    role: UserRole,
}
export type validationErrors =
  | {
      [key: string]: string[]
    }
  | undefined
