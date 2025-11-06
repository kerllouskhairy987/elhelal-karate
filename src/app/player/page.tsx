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
import { Button } from "@/components/ui/button";
import { Eye, Edit, PlusCircle, Files } from "lucide-react";
import { prisma } from "@/utils/prisma";
import Link from "@/components/Link";
import DeletePlayer from "./_components/DeletePlayer";

export default async function PlayersPage() {
  const players = await prisma.player.findMany({
    include: { user: true }, // ✅ يجيب بيانات المدرب
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">قائمة اللاعبين</h1>
        <Link href="/player/add">
          <Button className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            إضافة لاعب
          </Button>
        </Link>
      </div>

      <Table className="w-full overflow-hidden">
        <TableCaption>قائمة اللاعبين المسجلين.</TableCaption>
        <TableHeader>
          <TableRow className="font-semibold text-red-800">
            <TableHead className="w-[150px] text-start">الاسم</TableHead>
            <TableHead className="text-center">رقم الهاتف</TableHead>
            <TableHead className="text-center">النوع</TableHead>
            <TableHead className="text-center">تاريخ الميلاد</TableHead>
            <TableHead className="text-center">المدرب المسؤول</TableHead>{" "}
            {/* ✅ */}
            <TableHead className="text-end">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {players.map((player) => (
            <TableRow key={player.id}>
              <TableCell className="font-medium">{player.name}</TableCell>
              <TableCell className="text-center">{player.phone}</TableCell>
              <TableCell className="text-center">{player.gender}</TableCell>
              <TableCell className="text-center">
                {player.birthday.toLocaleDateString("ar-sa")}
              </TableCell>
              <TableCell className="text-center">
                {player.user?.name || "—"} {/* ✅ عرض اسم المدرب */}
              </TableCell>

              <TableCell className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" title="عرض التفاصيل">
                  <Link href={`/player/${player.id}/adddocument`}>
                    <Files className="w-4 h-4 text-blue-600" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" title="عرض التفاصيل">
                  <Link href={`/player/${player.id}/view`}>
                    <Eye className="w-4 h-4 text-blue-600" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" title="تعديل اللاعب">
                  <Link href={`/player/${player.id}/edit`}>
                    <Edit className="w-4 h-4 text-green-600" />
                  </Link>
                </Button>
                <DeletePlayer id={player.id} publicId={player.publicId} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>عدد اللاعبين</TableCell>
            <TableCell className="text-end">({players.length}) لاعب</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </main>
  );
}
