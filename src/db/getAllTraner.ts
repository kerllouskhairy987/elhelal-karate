import { prisma } from "@/utils/prisma";
import { cache } from "./Cache";

export const getAllTraner = cache(
  () => {
    const users = prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return users;
  },
  ["getAllTraner"],
  { revalidate: 3600 }
);

export const getPlayerById = (id: number) => {
  const player = prisma.player.findUnique({
    where: {
      id: id,
    },
    include: {
      attendances: true,
      images: true,
    },
  });
  return player;
};
