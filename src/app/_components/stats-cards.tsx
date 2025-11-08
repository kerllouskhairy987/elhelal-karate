import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player, User, Attendance } from "@prisma/client";

interface StatsCardsProps {
  players: Player[];
  trainers: User[];
  attendance: Attendance[];
}

export function StatsCards({ players, trainers, attendance }: StatsCardsProps) {
  // الحسابات الأساسية
  const totalPlayers = players.length;
  const totalTrainers = trainers.length;
  
  const presentRecords = attendance.filter(record => record.status === "PRESENT").length;
  const absentRecords = attendance.filter(record => record.status === "ABSENT").length;
  const lateRecords = attendance.filter(record => record.status === "LATE").length;
  const attendanceRate = attendance.length > 0 ? (presentRecords / attendance.length) * 100 : 0;

  // العقود النشطة
  const activeContracts = players.filter(player => 
    new Date(player.contractenddate) >= new Date()
  ).length;

  // الحضور في آخر 7 أيام
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentAttendance = attendance.filter(
    record => record.date && new Date(record.date) >= oneWeekAgo
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-right">
            إجمالي اللاعبين
          </CardTitle>
          <UsersIcon />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-right">{totalPlayers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-right">
            المدربين
          </CardTitle>
          <TrainerIcon />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-right">{totalTrainers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-right">
            معدل الحضور
          </CardTitle>
          <TrendingUpIcon />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-right">
            {attendanceRate.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground text-right">
            {presentRecords} حاضر / {absentRecords} غائب
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-right">
            النشاط الأخير
          </CardTitle>
          <ActivityIcon />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-right">{recentAttendance}</div>
          <p className="text-xs text-muted-foreground text-right">
            سجل هذا الأسبوع
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// أيقونات مخصصة
function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4-4V7a4 4 0 0 1 4-4h4" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function TrainerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4-4V7a4 4 0 0 1 4-4h4" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  );
}

function TrendingUpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}