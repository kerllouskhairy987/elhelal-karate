"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupAction, SignUpActionState } from "../actions/auth";
import { UserRole } from "@prisma/client";
import Loader from "@/components/ui/Loader";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


const RegisterForm = () => {
    const [role, setRole] = useState<UserRole>("TRAINER");
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);
    console.log(isPending)
    const router = useRouter();

    const initialState: SignUpActionState = {
        message: "",
        error: {},
        status: 0,
        formData: new FormData(),
    };

    const [state, action, pending] = useActionState(signupAction, initialState);

    // Handle Submit
    useEffect(() => {
        if (state?.status === 201 && state?.message && !pending) {
            toast.success(state.message, { autoClose: 5000 });
            startTransition(() => {
                router.refresh();
                setRole(UserRole.TRAINER);
            });
        }
        if ((state?.status === 500 || state?.status === 400 || state?.status === 401 || state?.status === 403) && state?.message && !pending) {
            toast.error(state?.message, { autoClose: 5000 });
            startTransition(() => {
                setRole(state?.formData.get("role") as UserRole);
            });
        }
    }, [pending, state?.message, state?.status, router, state?.formData]);

    console.log(role)

    return (
        <form
            action={action}
            className="flex flex-col gap-5 justify-center items-center w-full border rounded-md p-10 md:w-[500px]"
        >
            <div className="flex flex-col w-full gap-1">
                <Label htmlFor="name" className="text-lg font-semibold">اسم المدرب</Label>
                <Input
                    name="name"
                    id="name"
                    type="text"
                    placeholder="ادخل اسم المدرب"
                    autoFocus
                    className="text-xs"
                    defaultValue={state?.formData.get("name") as string}
                />
                {state?.error && state.error["name"] && (
                    <p
                        className={`text-accent -mt-1 text-xs font-medium ${state.error["name"] ? "text-destructive" : ""
                            }`}
                    >
                        {state.error["name"]}
                    </p>
                )}
            </div>

            <div className="flex flex-col w-full gap-1">
                <Label htmlFor="email" className="text-lg font-semibold">البريد الالكتروني للمدرب</Label>
                <Input
                    name="email"
                    id="email"
                    type="email"
                    placeholder="ادخل البريد الالكتروني للمدرب"
                    className="text-xs"
                    defaultValue={state?.formData.get("email") as string}
                />
                {state?.error && state.error["email"] && (
                    <p
                        className={`text-accent -mt-1 text-xs font-medium ${state.error["email"] ? "text-destructive" : ""
                            }`}
                    >
                        {state.error["email"]}
                    </p>
                )}
            </div>

            <div className="flex flex-col w-full gap-1">
                <Label htmlFor="password" className="text-lg font-semibold">الرقم السري</Label>
                <Input
                    name="password"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="ادخل الرقم السري للمدرب"
                    className="text-xs"
                    defaultValue={state?.formData.get("password") as string}
                />
                <div className="flex items-center justify-end gap-1 -mt-1 text-xs">
                    <Input type="checkbox" className="w-fit" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                    <span onClick={() => setShowPassword(!showPassword)} className="text-xs cursor-pointer text-end underline text-blue-300">اظهار الرقم السري</span>
                </div>
                {state?.error && state.error["password"] && (
                    <p
                        className={`text-accent -mt-1 text-xs font-medium ${state.error["password"] ? "text-destructive" : ""
                            }`}
                    >
                        {state.error["password"]}
                    </p>
                )}
            </div>

            <div className="flex flex-col w-full gap-1">
                <Label htmlFor="role" className="text-lg font-semibold">الصلاحيات</Label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    name="role"
                    id="role"
                    className="border rounded-md"
                >
                    <option className="text-xs text-black" value={UserRole.TRAINER}>مدرب</option>
                    <option className="text-xs text-black" value={UserRole.ADMIN}>مسؤول</option>
                </select>
            </div>

            <Button type="submit" className="w-full" disabled={pending}>
                {pending ? <Loader /> : "حفظ"}
            </Button>
        </form>
    );
};

export default RegisterForm;