"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Attendance } from "@prisma/client";

interface AttendanceChartProps {
  attendance: Attendance[];
}

interface CustomLabelProps {
  name: string;
  percent?: number;
}

export function AttendanceChart({ attendance }: AttendanceChartProps) {
  const presentCount = attendance.filter((a) => a.status === "PRESENT").length;
  const absentCount = attendance.filter((a) => a.status === "ABSENT").length;
  const lateCount = attendance.filter((a) => a.status === "LATE").length;

  const data = [
    { name: "حاضر", value: presentCount, color: "#10b981" },
    { name: "غائب", value: absentCount, color: "#ef4444" },
    { name: "متأخر", value: lateCount, color: "#f59e0b" },
  ].filter((item) => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">توزيع الحضور</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
