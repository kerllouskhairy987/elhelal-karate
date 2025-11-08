import { prisma } from "@/utils/prisma";
import { ChartsSection } from "./_components/charts-section";
import { StatsCards } from "./_components/stats-cards";

export default async function Home() {
  const [players, trainers, attendance] = await Promise.all([
    prisma.player.findMany(),
    prisma.user.findMany({ where: { role: "TRAINER" } }),
    prisma.attendance.findMany({
      include: {
        player: true
      }
    }),
  ]);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black p-6">
      <StatsCards 
        players={players}
        trainers={trainers}
        attendance={attendance}
      />
      <ChartsSection 
        players={players}
        attendance={attendance}
      />
    </div>
  );
}