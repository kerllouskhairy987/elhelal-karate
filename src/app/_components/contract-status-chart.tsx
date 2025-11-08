"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { Player } from "@prisma/client";

interface ContractStatusChartProps {
  players: Player[];
}

export function ContractStatusChart({ players }: ContractStatusChartProps) {
  const currentDate = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const activeContracts = players.filter(
    (player) => new Date(player.contractenddate) >= currentDate
  ).length;

  const expiredContracts = players.filter(
    (player) => new Date(player.contractenddate) < currentDate
  ).length;

  const expiringSoon = players.filter((player) => {
    const contractEnd = new Date(player.contractenddate);
    return contractEnd >= currentDate && contractEnd <= thirtyDaysFromNow;
  }).length;

  const data = [
    { name: "نشط", value: activeContracts, fill: "#10b981" },
    { name: "منتهي", value: expiredContracts, fill: "#ef4444" },
    { name: "قريب الانتهاء", value: expiringSoon, fill: "#f59e0b" },
  ].filter((item) => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">حالة العقود</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="20%"
              outerRadius="80%"
              data={data}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                dataKey="value"
                background
                cornerRadius={10}
                label={{ fill: "#666", position: "insideStart" }}
              />
              <Legend
                iconSize={10}
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
