import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { AttendanceStatus } from "@prisma/client"
import { updateDailyAttendance } from "./actions"
import { useState } from "react"
import { toast } from "react-toastify"
import Loader from "@/components/ui/Loader"

interface IProps {
    playerId: number
}

const UpdateAttendanceBtn = ({ playerId }: IProps) => {
    console.log(playerId)
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<AttendanceStatus>(AttendanceStatus.PRESENT);

    const handleUpdateAttendance = async () => {
        console.log(status)
        try {
            setIsLoading(true);
            const res = await updateDailyAttendance(playerId, status);
            setIsLoading(false);
            toast.success(res.message, { autoClose: 5000 });
        } catch (error) {
            console.log(error)
            toast.error("حدث خطاء في السرفر", { autoClose: 5000 });
        } finally {
            setIsLoading(false);
            setIsOpen(false)
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setIsOpen(true)}>تحديث الحضور</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>تحديث حضور اللاعب</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="status">حالة الحضور</Label>
                        <select name="status" id="status" className="w-full border rounded-md"
                            value={status} onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
                        >
                            <option className="text-black" value={AttendanceStatus.PRESENT}>حاضر</option>
                            <option className="text-black" value={AttendanceStatus.ABSENT}>غياب</option>
                            <option className="text-black" value={AttendanceStatus.LATE}>متأخر</option>
                        </select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">الغاء</Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        onClick={handleUpdateAttendance}
                    >
                        {isLoading ? <Loader /> : "حفظ"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateAttendanceBtn