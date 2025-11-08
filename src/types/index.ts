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


export type TUserWithPlayers = ({
  players: {
    name: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    image: string | null;
    phone: string;
    birthday: Date;
    gender: string;
    nationalNumber: string;
    contractstartdate: Date;
    contractenddate: Date;
    playerclass: string;
    publicId: string;
    userId: string;
  }[];
} & {
  name: string;
  id: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}) | null