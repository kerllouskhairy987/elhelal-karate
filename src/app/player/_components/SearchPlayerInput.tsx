"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

type Props = {
  trainerId?: string;
  defaultValue?: string;
};

export function SearchPlayerInput({ trainerId, defaultValue }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const params = new URLSearchParams(searchParams.toString());

    // حدّث قيمة q
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    // نرجّع trainerId لو كان موجود
    if (trainerId) {
      params.set("trainerId", trainerId);
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return (
    <Input
      name="q"
      placeholder="ابحث عن لاعب بالاسم أو رقم الهاتف..."
      defaultValue={defaultValue ?? ""}
      className="w-full"
      onChange={handleChange}
    />
  );
}
