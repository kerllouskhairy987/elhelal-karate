// app/player/page.tsx
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
import { Eye, Edit, PlusCircle, Files, Search } from "lucide-react";
import { prisma } from "@/utils/prisma";
import Link from "@/components/Link";
import DeletePlayer from "./_components/DeletePlayer";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/verifyToken";
import { UserRole } from "@prisma/client";
import { getAllTraner } from "@/db/getAllTraner";
import { SelectedTrainer } from "./add/_components/SelectedTrainer";
import { SearchPlayerInput } from "./_components/SearchPlayerInput";
import Image from "next/image";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const storeCookie = await cookies();
  const token = storeCookie.get("JwtToken")?.value || "";
  const user = verifyToken(token);
  const role = user?.role;
  const userIdFromToken = user?.id;
  if (!token || !user) {
    return redirect("/login");
  }
  const resolvedSearchParams = await searchParams;

  const rawTrainerId = resolvedSearchParams.trainerId;
  const rawQuery = resolvedSearchParams.q;

  const trainerIdParam: string | undefined = Array.isArray(rawTrainerId)
    ? rawTrainerId[0]
    : rawTrainerId;

  const searchQuery: string | undefined = Array.isArray(rawQuery)
    ? rawQuery[0]
    : rawQuery;
  const effectiveTrainerId =
    role === UserRole.TRAINER ? userIdFromToken : trainerIdParam;

  const players = await prisma.player.findMany({
    where: {
      ...(effectiveTrainerId ? { userId: effectiveTrainerId } : {}),
      ...(searchQuery
        ? {
            OR: [
              {
                name: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              },
              {
                phone: {
                  contains: searchQuery,
                },
              },
            ],
          }
        : {}),
    },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  const traners = await getAllTraner();

  console.log("SERVER trainerIdParam:", trainerIdParam);
  console.log("SERVER searchQuery:", searchQuery);

  return (
    <main className="p-6">
      {/* الهيدر */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <h1 className="text-xl font-bold">قائمة اللاعبين</h1>

        {role === UserRole.ADMIN && (
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/player/add">
              <Button className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                إضافة لاعب
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* فورم البحث */}
      {/* البحث + اختيار المدرب */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <SearchPlayerInput
            trainerId={trainerIdParam}
            defaultValue={searchQuery}
          />
        </div>

        {role === UserRole.ADMIN && (
          <SelectedTrainer Trainers={traners ?? []} />
        )}
      </div>

      {/* الجدول */}
      <Table className="w-full overflow-hidden">
        <TableCaption>قائمة اللاعبين المسجلين.</TableCaption>
        <TableHeader>
          <TableRow className="font-semibold text-red-800">
            {/* 🖼️ عمود الصورة الجديد */}
            <TableHead className="w-[80px] text-center">الصورة</TableHead>
            <TableHead className="w-[150px] text-start">الاسم</TableHead>
            <TableHead className="text-center">رقم الهاتف</TableHead>
            <TableHead className="text-center">النوع</TableHead>
            <TableHead className="text-center">تاريخ الميلاد</TableHead>
            <TableHead
              className={role === UserRole.ADMIN ? "text-center" : "text-end"}
            >
              المدرب المسؤول
            </TableHead>
            {role === UserRole.ADMIN && (
              <TableHead className="text-end">الإجراءات</TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {players.map((player) => (
            <TableRow key={player.id}>
              {/* 🖼️ خلية صورة اللاعب */}
              <TableCell className="text-center">
                {player.image ? (
                  <Image
                    src={player.image}
                    alt={player.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover mx-auto"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-6 h-6 text-gray-400"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}
              </TableCell>

              <TableCell className="font-medium">{player.name}</TableCell>
              <TableCell className="text-center">{player.phone}</TableCell>
              <TableCell className="text-center">{player.gender}</TableCell>
              <TableCell className="text-center">
                {player.birthday.toLocaleDateString("ar-sa")}
              </TableCell>
              <TableCell
                className={role === UserRole.ADMIN ? "text-center" : "text-end"}
              >
                {player.user?.name || "—"}
              </TableCell>

              {role === UserRole.ADMIN && (
                <TableCell className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" title="ملفات اللاعب">
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
              )}
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            {/* زوّدنا عمود جديد → نزود colSpan */}
            <TableCell colSpan={role === UserRole.ADMIN ? 6 : 5}>
              عدد اللاعبين
            </TableCell>
            <TableCell className="text-end">({players.length}) لاعب</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </main>
  );
}
