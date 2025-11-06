"use client";
import { SelectedTrainer } from "@/components/SelectedTrainer";
import { validationErrors } from "@/types";
import { Player, User } from "@prisma/client";
import { CameraIcon } from "lucide-react";
import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { addPlayer, updatePlayer } from "../_action/player";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type InitialStateType = {
  message?: string;
  error?: validationErrors;
  status?: number | null;
  formData?: FormData;
};

const initialState: InitialStateType = {
  message: "",
  error: {},
  status: null,
  formData: new FormData(),
};

// Options for select fields
const GENDER_OPTIONS = [
  { value: "ذكر", label: "ذكر" },
  { value: "أنثى", label: "أنثى" },
];

const PLAYER_CLASS_OPTIONS = [
  { value: "professional", label: "محترف" },
  { value: "amateur", label: "هواة" },
  { value: "junior", label: "ناشئ" },
  { value: "senior", label: "كبار" },
];

const Form = ({ trainers, player }: { trainers: User[]; player?: Player }) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    player ? player.userId : null
  );

  const [selectedImage, setSelectedImage] = useState(
    player ? player.image : ""
  );
  const [selectedGender, setSelectedGender] = useState(player?.gender || "");
  const [selectedPlayerClass, setSelectedPlayerClass] = useState(
    player?.playerclass || ""
  );

  const [state, action, pending] = useActionState(
    player
      ? updatePlayer.bind(null, {
          playerId: player.id,
          publicId: player.publicId,
        })
      : addPlayer.bind(null, {
          userId: selectedSectionId ?? "",
        }),
    initialState
  );

  useEffect(() => {
    if (state?.message) {
      toast(state?.message, {
        className:
          state?.status === 200 || state.status === 201
            ? "text-green-400"
            : "text-destructive",
      });
    }
  }, [state]);

  return (
    <div className="space-y-6">
      {/* Trainer Selection */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-3">
          <CardTitle> اختيار المدرب</CardTitle>
        </CardHeader>
        <CardContent>
          <SelectedTrainer
            Trainers={trainers ?? []}
            setSelectedSectionId={setSelectedSectionId}
          />
        </CardContent>
      </Card>

      <form action={action} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Image Upload Section */}
          <Card className="lg:col-span-1 border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardTitle>صورة اللاعب</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="group relative w-[200px] h-[200px] overflow-hidden mx-auto">
                {selectedImage && (
                  <Image
                    src={selectedImage}
                    alt={"profile"}
                    fill
                    className=" object-cover"
                  />
                )}
                <div
                  className={`${
                    selectedImage
                      ? "group-hover:opacity-[1] opacity-0  transition-opacity duration-200"
                      : ""
                  } absolute top-0 left-0 w-full h-full bg-gray-50/40`}
                >
                  <UploadImage setSelectedImage={setSelectedImage} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Fields Section */}
          <Card className="lg:col-span-3 border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardTitle>
                {player ? "✏️ تحديث بيانات اللاعب" : "➕ إضافة لاعب جديد"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل *</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    required
                    defaultValue={
                      (player?.name ?? "") ||
                      String(state.formData?.get("name") ?? "")
                    }
                    placeholder="أدخل الاسم الكامل للاعب"
                  />
                  {state?.error?.name && (
                    <p className="text-destructive text-sm text-right">
                      {state?.error?.name}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    type="tel"
                    name="phone"
                    defaultValue={
                      (player?.phone ?? "") ||
                      String(state.formData?.get("phone") ?? "")
                    }
                    className="w-full text-right border-gray-300 focus:border-primary transition-colors"
                    placeholder="أدخل رقم الهاتف"
                  />
                </div>

                {/* Gender Field */}
                <div className="space-y-2">
                  <Label htmlFor="gender">النوع *</Label>
                  <Select
                    name="gender"
                    value={selectedGender}
                    onValueChange={setSelectedGender}
                    required
                  >
                    <SelectTrigger className="w-full text-right border-gray-300 focus:border-primary transition-colors">
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDER_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Player Class Field */}
                <div className="space-y-2">
                  <Label htmlFor="playerclass">فئة اللاعب *</Label>
                  <Select
                    name="playerclass"
                    value={selectedPlayerClass}
                    onValueChange={setSelectedPlayerClass}
                    required
                  >
                    <SelectTrigger className="w-full text-right border-gray-300 focus:border-primary transition-colors">
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLAYER_CLASS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* National Number Field */}
                <div className="space-y-2">
                  <Label htmlFor="nationalNumber">الرقم الوطني</Label>
                  <Input
                    id="nationalNumber"
                    type="text"
                    name="nationalNumber"
                    defaultValue={
                      (player?.nationalNumber ?? "") ||
                      String(state.formData?.get("nationalNumber") ?? "")
                    }
                    className="w-full text-right border-gray-300 focus:border-primary transition-colors"
                    placeholder="أدخل الرقم الوطني"
                  />
                </div>

                {/* Birthday Field */}
                <div className="space-y-2">
                  <Label htmlFor="birthday">تاريخ الميلاد</Label>
                  <Input
                    id="birthday"
                    type="date"
                    name="birthday"
                    defaultValue={
                      player?.birthday
                        ? new Date(player.birthday).toISOString().split("T")[0]
                        : typeof state.formData?.get("birthday") === "string"
                        ? (state.formData.get("birthday") as string)
                        : ""
                    }
                    className="w-full text-right border-gray-300 focus:border-primary transition-colors"
                  />
                </div>

                {/* Contract Start Date Field */}
                <div className="space-y-2">
                  <Label htmlFor="contractstartdate">تاريخ بداية العقد</Label>
                  <Input
                    id="contractstartdate"
                    type="date"
                    name="contractstartdate"
                    defaultValue={
                      player?.contractstartdate
                        ? new Date(player.contractstartdate)
                            .toISOString()
                            .split("T")[0]
                        : typeof state.formData?.get("contractstartdate") ===
                          "string"
                        ? (state.formData.get("contractstartdate") as string)
                        : ""
                    }
                    className="w-full text-right border-gray-300 focus:border-primary transition-colors"
                  />
                </div>

                {/* Contract End Date Field */}
                <div className="space-y-2">
                  <Label htmlFor="contractenddate">تاريخ نهاية العقد</Label>
                  <Input
                    id="contractenddate"
                    type="date"
                    name="contractenddate"
                    defaultValue={
                      player?.contractenddate
                        ? new Date(player.contractenddate)
                            .toISOString()
                            .split("T")[0]
                        : typeof state.formData?.get("contractenddate") ===
                          "string"
                        ? (state.formData.get("contractenddate") as string)
                        : ""
                    }
                    className="w-full text-right border-gray-300 focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            disabled={pending || !selectedSectionId}
            className="w-full md:w-1/3 min-h-12 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            {pending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {player ? "جاري التحديث..." : "جاري الإضافة..."}
              </div>
            ) : player ? (
              "💾 تحديث البيانات"
            ) : (
              "➕ إضافة اللاعب"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Form;

const UploadImage = ({
  setSelectedImage,
}: {
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };
  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="image-upload"
        onChange={handleImageChange}
        name="image"
      />
      <label
        htmlFor="image-upload"
        className="border h-full w-full flex items-center justify-center element-center cursor-pointer"
      >
        <CameraIcon className="w-8! h-8! text-accent text-center" />
      </label>
    </>
  );
};
