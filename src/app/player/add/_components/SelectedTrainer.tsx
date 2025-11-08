// components/SelectedTrainer.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Trainer = {
  id: string;
  name: string;
};

type Props = {
  Trainers: Trainer[];
};

const ALL_TRAINERS_VALUE = "all";

export function SelectedTrainer({ Trainers }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentTrainerId = searchParams.get("trainerId") ?? "";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === ALL_TRAINERS_VALUE) {
      params.delete("trainerId");
    } else {
      params.set("trainerId", value);
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return (
    <Select
      value={currentTrainerId || ALL_TRAINERS_VALUE}
      onValueChange={handleChange}
    >
      <SelectTrigger className="">
        <SelectValue placeholder="كل المدربين" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value={ALL_TRAINERS_VALUE}>كل المدربين</SelectItem>
        {Trainers.map((trainer) => (
          <SelectItem key={trainer.id} value={trainer.id}>
            {trainer.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
