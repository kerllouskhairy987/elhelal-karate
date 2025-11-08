"use client";

import { AttendanceChart } from "./attendance-chart";
import { PlayerStatsChart } from "./player-stats-chart";
import { ContractStatusChart } from "./contract-status-chart";
import { Player, Attendance } from "@prisma/client";

interface ChartsSectionProps {
  players: Player[];
  attendance: (Attendance & { player: Player })[];
}

export function ChartsSection({ players, attendance }: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="space-y-6">
        <AttendanceChart attendance={attendance} />
        <ContractStatusChart players={players} />
      </div>
      <div className="space-y-6">
        <PlayerStatsChart attendance={attendance} />
      </div>
    </div>
  );
}