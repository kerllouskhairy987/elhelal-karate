"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, UserRole } from "@prisma/client";
import { useActionState, useEffect, useState, useTransition } from "react";
import {
  getUserInfoById,
  updateUserAction,
  UpdateUserActionState,
} from "../actions/auth";
import Loader from "@/components/ui/Loader";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface IProps {
  id: string;
}
const UpdateUserBtn = ({ id }: IProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [userInfo, setUserInfo] = useState<User>();
  const [role, setRole] = useState<UserRole | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  console.log(isPending);

  const router = useRouter();

  // Get User Info
  const getUserInfo = async (id: string) => {
    const user = await getUserInfoById(id);
    console.log(user);
    if (!user) return;
    setUserInfo(user);
  };

  const initialState: UpdateUserActionState = {
    message: "",
    error: {},
    status: 0,
    formData: new FormData(),
  };

  const [state, action, pending] = useActionState(
    updateUserAction,
    initialState
  );

  // Get User Role Directly After Open Dialog
  useEffect(() => {
    if (userInfo) {
      setTimeout(() => setRole(userInfo.role), 0);
    }
  }, [userInfo]);

  // Close Dialog
  useEffect(() => {
    if (state?.status === 200 && state?.message && !pending) {
      toast.success(state.message, { autoClose: 5000 });
      startTransition(() => {
        setOpen(false);
        router.refresh();
      });
    }
    if (state?.status === 500 && state?.message && !pending) {
      toast.error(state?.message, { autoClose: 5000 });
    }
  }, [pending, state?.message, state?.status, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          onClick={() => {
            getUserInfo(id);
            setOpen(true);
          }}
        >
          تعديل
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={action} className=" flex flex-col gap-10">
          <DialogHeader>
            <DialogTitle>تعديل بيانات المستخدم </DialogTitle>
            <DialogDescription>تعديل بيانات المستخدم</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {/* make input with type hidden for sending email in formData */}
            <input
              type="hidden"
              name="email"
              id="email"
              defaultValue={userInfo?.email}
            />
            <div className="flex flex-col w-full gap-1">
              <Label htmlFor="name" className="text-lg font-semibold">
                اسم المدرب
              </Label>
              <Input
                name="name"
                id="name"
                type="text"
                placeholder="ادخل اسم المدرب"
                autoFocus
                className="text-xs"
                defaultValue={userInfo?.name}
              />
              {state?.error && state.error["name"] && (
                <p
                  className={`text-accent -mt-1 text-xs font-medium ${
                    state.error["name"] ? "text-destructive" : ""
                  }`}
                >
                  {state.error["name"]}
                </p>
              )}
            </div>

            <div className="flex flex-col w-full gap-1">
              <Label htmlFor="password" className="text-lg font-semibold">
                الرقم السري
              </Label>
              <Input
                name="password"
                id="password"
                type={showPassword ? "text" : "password"}
                // placeholder="ادخل الرقم السري للمدرب"
                className="text-xs"
                // defaultValue={userInfo?.password}
              />
              <div className="flex items-center justify-end gap-1 -mt-1 text-xs">
                <Input
                  type="checkbox"
                  className="w-fit"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs cursor-pointer text-end underline text-blue-300"
                >
                  اظهار الرقم السري
                </span>
              </div>

              {state?.error && state.error["password"] && (
                <p
                  className={`text-accent -mt-1 text-xs font-medium ${
                    state.error["password"] ? "text-destructive" : ""
                  }`}
                >
                  {state.error["password"]}
                </p>
              )}
            </div>

            <div className="flex flex-col w-full gap-1">
              <Label htmlFor="role" className="text-lg font-semibold">
                الصلاحيات
              </Label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                name="role"
                id="role"
                className="border rounded-md"
              >
                <option className="text-xs text-black" value={UserRole.TRAINER}>
                  مدرب
                </option>
                <option className="text-xs text-black" value={UserRole.ADMIN}>
                  مسؤول
                </option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"outline"}>العاء</Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? <Loader /> : "تحديث"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserBtn;
