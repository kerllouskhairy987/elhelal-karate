import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/utils/prisma";
import { AttendanceStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/verifyToken";

const AttendancePage = async () => {
  const storeCookie = await cookies();
  const token = storeCookie.get("JwtToken")?.value || "";
  const user = verifyToken(token);
  if (!token || !user) {
    return redirect("/login");
  }
  const attendances = await prisma.attendance.findMany({
    include: {
      player: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  // ✅ دالة تجيب اسم اليوم بالعربي من تاريخ بصيغة dd/MM/yyyy
  const getDayName = (dateString: string) => {
    const [day, month, year] = dateString.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("ar-EG", { weekday: "long" }); // مثال: الجمعة، السبت...
  };

  // ✅ تجميع الحضور حسب التاريخ (اليوم فقط)
  const groupedByDate = attendances.reduce(
    (acc: Record<string, typeof attendances>, record) => {
      const date = new Date(record.date).toLocaleDateString("en-GB"); // 07/11/2025
      if (!acc[date]) acc[date] = [];
      acc[date].push(record);
      return acc;
    },
    {}
  );

  const groupedArray = Object.entries(groupedByDate);

  return (
    <main>
      <h1 className="my-5 text-center text-xl font-bold">الحضور</h1>

      <div className="flex w-full justify-end">
        <Link href="/attendance/add" className={buttonVariants()}>
          تسجيل حضور اليوم
        </Link>
      </div>

      <Table className="mt-5 w-full overflow-hidden">
        <TableCaption>قائمة الحضور حسب الأيام.</TableCaption>
        <TableHeader>
          <TableRow className="text-center font-semibold text-red-800">
            <TableHead className="w-[150px] text-center font-semibold">
              اليوم
            </TableHead>
            <TableHead className="text-center font-semibold">
              الحاضرون
            </TableHead>
            <TableHead className="text-center font-semibold">الغياب</TableHead>
            <TableHead className="text-center font-semibold">
              المتأخرون
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {groupedArray.map(([date, records]) => {
            const present = records.filter(
              (r) => r.status === AttendanceStatus.PRESENT
            );
            const absent = records.filter(
              (r) => r.status === AttendanceStatus.ABSENT
            );
            const late = records.filter(
              (r) => r.status === AttendanceStatus.LATE
            );
            const dayName = getDayName(date);

            return (
              <TableRow key={date}>
                {/* اليوم + التاريخ */}
                <TableCell className="text-center font-bold">
                  <div className="flex flex-col items-center">
                    <span>{date}</span>
                    <span className="mt-1 text-sm text-gray-500">
                      {dayName}
                    </span>
                  </div>
                </TableCell>

                {/* ✅ عدد الحاضرين فقط */}
                <TableCell className="text-center">
                  {present.length > 0 ? (
                    <span className="rounded-md bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                      {present.length} لاعب
                    </span>
                  ) : (
                    <span className="text-gray-400">0</span>
                  )}
                </TableCell>

                {/* ✅ عدد الغياب فقط */}
                <TableCell className="text-center">
                  {absent.length > 0 ? (
                    <span className="rounded-md bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                      {absent.length} لاعب
                    </span>
                  ) : (
                    <span className="text-gray-400">0</span>
                  )}
                </TableCell>

                {/* ✅ عدد المتأخرين فقط */}
                <TableCell className="text-center">
                  {late.length > 0 ? (
                    <span className="rounded-md bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                      {late.length} لاعب
                    </span>
                  ) : (
                    <span className="text-gray-400">0</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-center font-semibold">
              إجمالي الأيام ({groupedArray.length})
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </main>
  );
};

export default AttendancePage;
