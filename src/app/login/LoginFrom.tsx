"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAction, LoginActionState } from "../actions/auth";
import { useActionState, useEffect, useState } from "react";
import Loader from "@/components/ui/Loader";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { UserRole } from "@prisma/client";

const LoginFrom = ({ role }: { role: string | undefined }) => {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const initialState: LoginActionState = {
        message: "",
        error: {},
        status: 0,
        formData: new FormData(),
    }
    const [state, action, pending] = useActionState(loginAction, initialState)

    useEffect(() => {
        if (state?.status === 200 && state?.message && !pending) {
            toast.success(state?.message, { autoClose: 5000 });
            router.refresh();
            // check this user is admin or trainer

            if (role === UserRole.ADMIN) {
                router.replace("/")
            } else {
                router.replace("/player")
            }
        }
        if ((state?.status === 400 || state?.status === 401 || state?.status === 500) && state?.message && !pending) {
            toast.error(state?.message, { autoClose: 5000 });
        }
    }, [state?.status, state?.message, pending, router, role])

    return (
        <form action={action} className="flex flex-col gap-5 w-full">
            <div className="flex flex-col gap-3">
                <Label htmlFor="email">عنوان البريد الالكتروني </Label>
                <Input
                    autoFocus
                    type="email"
                    name="email"
                    id="email"
                    className="border border-gray-500"
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
            <div className="flex flex-col gap-3">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="border border-gray-500"
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
            <Button type="submit" disabled={pending}>
                {pending ? <Loader /> : "تسجيل الدخول"}
            </Button>
        </form>
    )
}

export default LoginFrom