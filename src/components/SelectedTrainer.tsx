"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@prisma/client";
import { UserIcon } from "lucide-react";
import { Label } from "./ui/label";

export function SelectedTrainer({
  Trainers,
  setSelectedSectionId: setSelectedBranchId,
}: {
  Trainers: User[];
  setSelectedSectionId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  return (
    <div dir="rtl" className="w-full flex justify-center my-1">
      <div className="w-full max-w-2xl space-y-3">
        {/* Label */}
        <div className="flex items-center gap-2 justify-end text-right">
          <UserIcon className="w-5 h-5 text-primary" />
          <Label >
            اختيار المدرب
          </Label>
        </div>
        
        {/* Select Component */}
        <Select onValueChange={(value) => setSelectedBranchId(value)}>
          <SelectTrigger className="
            w-full 
            h-14 
            rounded-xl 
            border 
            border-gray-300 
            bg-white 
            shadow-sm 
            hover:border-primary 
            transition-colors 
            duration-200 
            text-right 
            pr-4 
            text-lg 
            font-medium
            focus:ring-1 
            focus:ring-primary
            focus:border-primary
          ">
            <SelectValue placeholder="اختر المدرب من القائمة" />
          </SelectTrigger>
          <SelectContent 
            className="
              w-full 
              bg-white 
              rounded-xl 
              shadow-lg 
              border 
              border-gray-200
              text-right
            "
            position="popper"
            align="end"
          >
            <SelectGroup>
              {Trainers?.map((section: User) => (
                <SelectItem
                  key={section.id}
                  value={section.id}
                  className="
                    py-3 
                    px-4 
                    hover:bg-gray-50 
                    cursor-pointer 
                    transition-colors 
                    duration-200 
                    text-md
                    border-b 
                    border-gray-100 
                    last:border-b-0
                    text-gray-700
                    hover:text-gray-900
                  "
                >
                  <div className="flex items-center gap-3 justify-end">
                    <span className="font-medium">{section.name}</span>
                    <div className="w-2 h-2 bg-primary rounded-full shrink-0"></div>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Helper Text */}
        <p >
          اختر المدرب المسؤول عن هذا اللاعب
        </p>
      </div>
    </div>
  );
}