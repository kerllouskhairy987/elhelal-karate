import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from '@/utils/prisma';
import { AttendanceStatus } from '@prisma/client';

const AttendancePage = async () => {

    const attendances = await prisma.attendance.findMany({
        include: {
            player: true,
        },
        orderBy: {
            date: "desc",
        },
    });

    // ✅ دالة تجيب اسم اليوم بالعربي
    const getDayName = (dateString: string) => {
        const [day, month, year] = dateString.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString("ar-EG", { weekday: "long" }); // مثال: الجمعة، السبت...
    };

    // ✅ تجميع الحضور حسب التاريخ (اليوم فقط)
    const groupedByDate = attendances.reduce((acc: Record<string, typeof attendances>, record) => {
        const date = new Date(record.date).toLocaleDateString("en-GB"); // 07/11/2025
        if (!acc[date]) acc[date] = [];
        acc[date].push(record);
        return acc;
    }, {});

    const groupedArray = Object.entries(groupedByDate);

    return (
        <main>
            <h1 className="text-center text-xl font-bold my-5">الحضور</h1>

            <div className='flex justify-end w-full'>
                <Link
                    href="/attendance/add"
                    className={`${buttonVariants()}`}
                >
                    تسجيل حضور اليوم
                </Link>
            </div>

            <Table className="w-full overflow-hidden mt-5">
                <TableCaption>قائمة الحضور حسب الأيام.</TableCaption>
                <TableHeader>
                    <TableRow className="font-semibold text-red-800 text-center">
                        <TableHead className="font-semibold w-[150px] text-center">اليوم</TableHead>
                        <TableHead className="font-semibold text-center">الحاضرون</TableHead>
                        <TableHead className="font-semibold text-center">الغياب</TableHead>
                        <TableHead className="font-semibold text-center">المتأخرون</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {groupedArray.map(([date, records]) => {
                        const present = records.filter(r => r.status === AttendanceStatus.PRESENT);
                        const absent = records.filter(r => r.status === AttendanceStatus.ABSENT);
                        const late = records.filter(r => r.status === AttendanceStatus.LATE);
                        const dayName = getDayName(date);

                        return (
                            <TableRow key={date}>
                                <TableCell className="font-bold text-center">
                                    <div className="flex flex-col items-center">
                                        <span>{date}</span>
                                        <span className="text-gray-500 text-sm mt-1">{dayName}</span>
                                    </div>
                                </TableCell>

                                <TableCell className="text-center">
                                    {present.length > 0 ? present.map(p => (
                                        <div key={p.id} className="flex flex-col items-center mb-2">
                                            <span className='border-b py-1 px-2 w-fit rounded-md'>{p.player.name}</span>
                                        </div>
                                    )) : <span className="text-gray-400">—</span>}
                                </TableCell>

                                <TableCell className="text-center">
                                    {absent.length > 0 ? absent.map(p => (
                                        <div key={p.id} className="flex flex-col items-center mb-2">
                                            <span className='border-b py-1 px-2 w-fit rounded-md'>{p.player.name}</span>
                                        </div>
                                    )) : <span className="text-gray-400">—</span>}
                                </TableCell>

                                <TableCell className="text-center">
                                    {late.length > 0 ? late.map(p => (
                                        <div key={p.id} className="flex flex-col items-center mb-2">
                                            <span className='border-b py-1 px-2 w-fit rounded-md'>{p.player.name}</span>
                                        </div>
                                    )) : <span className="text-gray-400">—</span>}
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
