
import { prisma } from "@/utils/prisma";
import { verifyToken } from "@/utils/verifyToken";
import { cookies } from "next/headers";
import TableForAttendance from "./TableForAttendance";

const AddAttendancePage = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("JwtToken")?.value || "";
    const user = verifyToken(token);

    const userWithPlayers = await prisma.user.findUnique({
        where: {
            id: user?.id,
        },
        include: {
            players: true,
        },
    })

    return (
        <main>
            <h1 className="text-center text-xl font-bold my-5">الحضور</h1>
            {
                !user
                    ? <p className="text-center text-xl font-bold my-5">يجب تسجيل الدخول اولا</p>
                    : userWithPlayers && userWithPlayers.players.length > 0 ? (
                        <TableForAttendance userWithPlayers={userWithPlayers} />
                    )
                        : <p className="text-center text-xl font-bold my-5">لا يوجد لديك لاعبين</p>
            }
        </main>
    )
}

export default AddAttendancePage