"use server";

import { prisma } from "@/utils/prisma";
import { IInitialAttendanceState } from "../TableForAttendance";
import { AttendanceStatus } from "@prisma/client";

// Create Daily Attendance
export async function createDailyAttendance(records: IInitialAttendanceState[]) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        const existing = await prisma.attendance.findFirst({
            where: {
                date: {
                    gte: today,
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                },
            },
        });

        if (existing) {
            return { message: "غياب اليوم موجود بالفعل" };
        }

        const attendanceRecords = records.map((r) => ({
            date: new Date(),
            status: r.status,
            note: r.note || null,
            playerId: r.playerId,
        }));

        await prisma.attendance.createMany({
            data: attendanceRecords,
        });

        return { message: "تم تسجيل الحضور بنجاح " };
    } catch (error) {
        console.log(error)
        return { message: "خطأ في السرفر" };
    }
}


// Update Attendance For Player
export async function updateDailyAttendance(playerId: number, status: AttendanceStatus) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        // نبحث عن السجل بتاع اللاعب لليوم ده
        const attendance = await prisma.attendance.findFirst({
            where: {
                playerId,
                date: {
                    gte: today,
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                },
            },
        });

        // لو السجل مش موجود نرجع خطأ
        if (!attendance) {
            return { message: "اللاعب غير مسجل لحضوره في اليوم" }
        }

        // نحدث السجل بالحالة الجديدة
        await prisma.attendance.update({
            where: { id: attendance.id },
            data: { status },
        });

        return { message: `الحضور تم تحديثه بنجاح.` };
    } catch (error) {
        console.log(error)
        return { message: "خطاء في السرفر" };
    }
}
