"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Attendance } from "@prisma/client";

interface PlayerStatsChartProps {
  attendance: Attendance[];
}

export function PlayerStatsChart({ attendance }: PlayerStatsChartProps) {
  // تجميع البيانات الشهرية من سجلات الحضور
  const monthlyData = attendance.reduce((acc, record) => {
    if (!record.date) return acc;
    
    const date = new Date(record.date);
    const monthKey = date.toLocaleString('ar-EG', { month: 'long' });
    const year = date.getFullYear();
    const key = `${monthKey} ${year}`;
    
    if (!acc[key]) {
      acc[key] = { حضور: 0, غياب: 0, تأخر: 0 };
    }
    
    if (record.status === "PRESENT") acc[key].حضور++;
    else if (record.status === "ABSENT") acc[key].غياب++;
    else if (record.status === "LATE") acc[key].تأخر++;
    
    return acc;
  }, {} as Record<string, { حضور: number; غياب: number; تأخر: number }>);

  // تحويل البيانات إلى مصفوفة للرسم البياني
  const chartData = Object.entries(monthlyData)
    .map(([name, data]) => ({
      name,
      حضور: data.حضور,
      غياب: data.غياب,
      تأخر: data.تأخر
    }))
    .slice(-6); // آخر 6 أشهر

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">إحصائيات الحضور الشهرية</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="حضور" fill="#10b981" />
              <Bar dataKey="غياب" fill="#ef4444" />
              <Bar dataKey="تأخر" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}