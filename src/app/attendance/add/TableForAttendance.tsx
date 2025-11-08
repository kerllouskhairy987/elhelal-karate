"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TUserWithPlayers } from "@/types";
import { AttendanceStatus } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import { createDailyAttendance } from "./actions";
import Loader from "@/components/ui/Loader";
import UpdateAttendanceBtn from "./UpdateAttendanceBtn";

interface IProps {
    userWithPlayers: TUserWithPlayers
}

export interface IInitialAttendanceState {
    playerId: number;
    status: AttendanceStatus;
    note: string;
}

const TableForAttendance = ({ userWithPlayers }: IProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const players = userWithPlayers?.players

    const [attendance, setAttendance] = useState<IInitialAttendanceState[] | undefined>(
        players?.map((p) => ({ playerId: p.id, status: AttendanceStatus.PRESENT, note: "" }))
    );

    // Handle status change
    const handleChangeStatus = (playerId: number, newStatus: AttendanceStatus) => {
        setAttendance((prev) =>
            prev?.map((a) =>
                a.playerId === playerId ? { ...a, status: newStatus } : a
            )
        );
    };

    // Handle note change
    const handleChangeNote = (playerId: number, newNote: string) => {
        setAttendance((prev) =>
            prev?.map((a) =>
                a.playerId === playerId ? { ...a, note: newNote } : a
            )
        );
    };

    // Handle Add Attendance
    const handleAddAttendance = async () => {
        if (!attendance) {
            toast.error("يجب اختيار حضور للاعبين", { autoClose: 5000 });
            return;
        }
        try {
            setIsLoading(true);
            const res = await createDailyAttendance(attendance);
            setIsLoading(false);
            toast.success(res.message, { autoClose: 5000 });
        } catch (error) {
            setIsLoading(false);
            console.log(error)
            toast.error("حدث خطاء في السرفر", { autoClose: 5000 });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <Table className="w-full overflow-hidden">
                <TableCaption>قائمة اللاعبين.</TableCaption>
                <TableHeader>
                    <TableRow className="font-semibold text-red-800">
                        <TableHead className="font-semibold w-[100px] text-start">
                            اسم اللاعب - صورته
                        </TableHead>
                        <TableHead className="font-semibold text-center">
                            حاله الحضور
                        </TableHead>
                        <TableHead className="font-semibold text-center">
                            كتابة ملاحظات
                        </TableHead>
                        <TableHead className="font-semibold text-end">الاحداث</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {userWithPlayers?.players.map((player) => (
                        <TableRow key={player.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-1">
                                    {player.image
                                        ? <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                            <Image
                                                alt={player.name}
                                                src={player.image}
                                                fill
                                                className="rounded-full object-center"
                                            />
                                        </div>
                                        : <div className="w-8 h-8 rounded-full bg-gray-400"></div>
                                    }
                                    {player.id + " - " + player.name}
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <select name="status" id="status" className="w-full border rounded-md"
                                    onChange={(e) => handleChangeStatus(player.id, e.target.value as AttendanceStatus)}
                                >
                                    <option className="text-black" value={AttendanceStatus.PRESENT}>حاضر</option>
                                    <option className="text-black" value={AttendanceStatus.ABSENT}>غياب</option>
                                    <option className="text-black" value={AttendanceStatus.LATE}>متأخر</option>
                                </select>
                            </TableCell>
                            <TableCell className="text-center">
                                <textarea
                                    name="notes"
                                    id="notes"
                                    className="border w-full resize-none rounded-md py-1 px-2"
                                    onChange={(e) =>
                                        handleChangeNote(player.id, e.target.value)
                                    }
                                ></textarea>
                            </TableCell>
                            <TableCell className="flex h-full justify-end items-end gap-2">
                                <UpdateAttendanceBtn playerId={player.id} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>عدد اللاعبين</TableCell>
                        <TableCell className="text-end">({players?.length}) مدرب</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            <Button
                disabled={isLoading}
                className="w-full mt-5"
                onClick={handleAddAttendance}
            >
                {isLoading ? <Loader /> : "حفظ الحضور"}
            </Button>
        </div>
    )
}

export default TableForAttendance