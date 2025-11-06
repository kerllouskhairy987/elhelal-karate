import { getPlayerById } from "@/db/getAllTraner";
import {
  Calendar,
  Phone,
  User,
  IdCard,
  Cake,
  Clock,
  Edit,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Shield,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import InfoCard from "./_components/InfoCard";
import ImageGallery from "./_components/ImageGallery";
import DocumentCard from "./_components/DocumentCard";
import {
  calculateAge,
  getContractStatus,
  getPlayerClassText,
} from "@/utils/viewPlayer";

export default async function PlayerDetailsPage({
  params,
}: {
  params: Promise<{ idplayer: string }>;
}) {
  const { idplayer } = await params;
  const player = await getPlayerById(Number(idplayer));
  if (!player) {
    return (
      <main className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">
            اللاعب غير موجود
          </h1>
          <p className="text-muted-foreground mt-2">
            تعذر العثور على بيانات اللاعب
          </p>
        </div>
      </main>
    );
  }

  const age = calculateAge(player.birthday);
  const contractStatus = getContractStatus(player.contractenddate);
  const daysUntilEnd = Math.ceil(
    (new Date(player.contractenddate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // فصل الصور عن المستندات
  const documents =
    player.images?.filter(
      (img) =>
        img.url.includes(".pdf") ||
        img.url.includes(".doc") ||
        img.url.includes(".docx")
    ) || [];

  const otherImages =
    player.images?.filter(
      (img) =>
        !img.url.includes(".pdf") &&
        !img.url.includes(".doc") &&
        !img.url.includes(".docx")
    ) || [];

  return (
    <main className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          {player.image && (
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-4 border-primary/20">
              <Image
                src={player.image}
                alt={player.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              {player.name}
              <BadgeCheck className="w-6 h-6 text-blue-500" />
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-1">
              <Shield className="w-4 h-4" />
              {getPlayerClassText(player.playerclass)}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button asChild variant="outline" className="gap-2">
            <Link href={`/player/${player.id}/edit`}>
              <Edit className="w-4 h-4" />
              تعديل البيانات
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href="/player">
              <ArrowRight className="w-4 h-4" />
              العودة للقائمة
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* العمود الأيسر - الصورة والمعلومات الأساسية */}
        <div className="lg:col-span-1 space-y-6">
          {/* بطاقة الصورة */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {player.image ? (
                <div className="aspect-square relative">
                  <Image
                    src={player.image}
                    alt={player.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <User className="w-20 h-20 text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* بطاقة حالة العقد */}
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                حالة العقد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">الحالة:</span>
                  <Badge variant={"secondary"}>{contractStatus.status}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">تاريخ البداية:</span>
                  <span className="font-medium">
                    {new Date(player.contractstartdate).toLocaleDateString(
                      "ar-sa"
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">تاريخ النهاية:</span>
                  <span className="font-medium">
                    {new Date(player.contractenddate).toLocaleDateString(
                      "ar-sa"
                    )}
                  </span>
                </div>
                {contractStatus.status !== "منتهي" && (
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-muted-foreground">متبقي:</span>
                    <span className="font-medium text-primary">
                      {daysUntilEnd} يوم
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* بطاقة المستندات */}
          {documents.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  المستندات ({documents.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {documents.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* العمود الأيمن - المعلومات التفصيلية */}
        <div className="lg:col-span-2 space-y-6">
          {/* شبكة المعلومات الأساسية */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard icon={User} title="النوع" value={player.gender} />
            <InfoCard
              icon={Cake}
              title="العمر"
              value={`${age} سنة`}
              subtitle={new Date(player.birthday).toLocaleDateString("ar-EG")}
            />
            <InfoCard icon={Phone} title="رقم الهاتف" value={player.phone} />
            <InfoCard
              icon={IdCard}
              title="الرقم الوطني"
              value={player.nationalNumber}
            />
            <InfoCard
              icon={Shield}
              title="الفئة"
              value={getPlayerClassText(player.playerclass)}
            />
            <InfoCard
              icon={Clock}
              title="تاريخ التسجيل"
              value={new Date(player.createdAt).toLocaleDateString("ar-EG")}
            />
          </div>

          {/* قسم الصور الإضافية */}
          {otherImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  معرض الصور ({otherImages.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageGallery images={otherImages} />
              </CardContent>
            </Card>
          )}

          {/* بطاقة الحضور والانصراف */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                سجل الحضور
              </CardTitle>
            </CardHeader>
            <CardContent>
              {player.attendances && player.attendances.length > 0 ? (
                <div className="space-y-3">
                  {player.attendances.slice(0, 5).map((attendance) => (
                    <div
                      key={attendance.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            attendance.status === "PRESENT"
                              ? "destructive"
                              : attendance.status === "ABSENT"
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {attendance.status === "PRESENT"
                            ? "حاضر"
                            : attendance.status === "ABSENT"
                            ? "غائب"
                            : "متأخر"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(attendance.date).toLocaleDateString(
                            "ar-EG"
                          )}
                        </span>
                      </div>
                      {attendance.note && (
                        <p className="text-sm text-muted-foreground">
                          {attendance.note}
                        </p>
                      )}
                    </div>
                  ))}
                  {player.attendances.length > 5 && (
                    <div className="text-center pt-2">
                      <Button variant="ghost" size="sm">
                        عرض المزيد ({player.attendances.length - 5})
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>لا توجد سجلات حضور حتى الآن</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* معلومات إضافية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">الإحصائيات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">إجمالي الحضور:</span>
                  <span className="font-medium text-success">
                    {player.attendances?.filter((a) => a.status === "PRESENT")
                      .length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">إجمالي الغياب:</span>
                  <span className="font-medium text-destructive">
                    {player.attendances?.filter((a) => a.status === "ABSENT")
                      .length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">معدل الحضور:</span>
                  <span className="font-medium text-primary">
                    {player.attendances && player.attendances.length > 0
                      ? `${Math.round(
                          (player.attendances.filter(
                            (a) => a.status === "PRESENT"
                          ).length /
                            player.attendances.length) *
                            100
                        )}%`
                      : "0%"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
