import { prisma } from "@/utils/prisma"
import RegisterForm from "./RegisterForm"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DeleteUserBtn from "./DeleteUserBtn";
import UpdateUserBtn from "./UpdateUserBtn";

const TrainerPage = async () => {

    // Get All Users
    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <main>
            <div className="flex flex-col items-center justify-center gap-5">
                <h1 className="text-center text-xl font-bold my-5">إنشاء حساب لمدرب جديد</h1>
                <RegisterForm />
            </div>

            <div className="w-full h-0.5 bg-green-500 my-10"></div>

            {/* trainer table */}
            <h2 className="text-center text-xl font-bold my-5">قائمة المدربين</h2>
            {
                users && users.length > 0
                    ? (
                        <Table className="w-full">
                            <TableCaption>قائمة المدربين.</TableCaption>
                            <TableHeader>
                                <TableRow className="font-semibold text-red-800">
                                    <TableHead className="font-semibold w-[100px] text-start">اسم المدرب</TableHead>
                                    <TableHead className="font-semibold text-center">البريد الالكتروني</TableHead>
                                    <TableHead className="font-semibold text-center">الصلاحيات</TableHead>
                                    <TableHead className="font-semibold text-end">الاحداث</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell className="text-center">{user.email}</TableCell>
                                        <TableCell className={`text-center `}>
                                            {user.role === "TRAINER"
                                                ? <span className="bg-accent-foreground px-2 py-1 rounded-md w-fit text-black">مدرب</span>
                                                : <span className="bg-green-600 px-2 py-1 rounded-md w-fit text-black">مدير</span>
                                            }
                                        </TableCell>
                                        <TableCell className="flex justify-end items-center gap-2">
                                            <DeleteUserBtn id={user.id} />
                                            <UpdateUserBtn id={user.id} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={3}>عدد المدربين</TableCell>
                                    <TableCell className="text-end">({users.length}) مدرب</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    )
                    : <h3>لا يوجد مدربين قم بانشاء حساب لمدرب جديد</h3>
            }

        </main>
    )
}

export default TrainerPage
