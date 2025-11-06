"use server";

import { prisma } from "@/utils/prisma";
import { loginSchema, registerSchema, updateUserSchema } from "@/validation";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { JWTPayload } from "@/types";
import { generateJwt } from "@/utils/generateToken";
import { cookies } from "next/headers";

// Login Server Action
type LoginValidationErrors = {
    email?: string[];
    password?: string[];
};
export type LoginActionState = {
    message?: string;
    error: LoginValidationErrors;
    status: number;
    formData: FormData;
}
export async function loginAction(
    prevState: LoginActionState | undefined,
    formData: FormData
): Promise<LoginActionState | undefined> {

    // Validation
    const result = loginSchema.safeParse(Object.fromEntries(formData.entries()));
    if (result.success === false) {
        return {
            message: "كل الحقول مطلوبه",
            error: result.error.flatten().fieldErrors as LoginValidationErrors,
            status: 400,
            formData: new FormData(),
        };
    }

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: {
                email
            },
        })
        if (!user) {
            return {
                message: "المستخدم غير موجود قم بانشاء حساب اولا",
                error: {},
                status: 400,
                formData,
            }
        }

        // decrypt password 
        const hash = user.password;
        const isMatch = await bcrypt.compare(password, hash);

        // Check if password OR email are correct
        if (!isMatch) {
            return {
                message: "البريد الالكتروني او الرقم السري غير صحيح",
                error: {},
                status: 401,
                formData,
            }
        }

        // Get Jwt Payload
        const jwtPayload: JWTPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
        // Create token
        const token = generateJwt(jwtPayload);
        // set cookie
        const cookieStore = await cookies()
        cookieStore.set({
            name: 'JwtToken',
            value: token,
            httpOnly: true,
            path: '/',
        })

        revalidatePath("/")
        revalidatePath("/trainer")
        return {
            message: "تم تسجيل الدخول بنجاح",
            error: {},
            status: 200,
            formData,
        }
    } catch (error) {
        console.log(error)
        return {
            message: "حدث خطأ",
            error: {},
            status: 500,
            formData,
        }
    }
}


// Create Account ---------------------------------------------------------
type SignUpValidationErrors = {
    name?: string[];
    email?: string[];
    password?: string[];
};

export type SignUpActionState = {
    message?: string;
    error: SignUpValidationErrors;
    status: number;
    formData: FormData;
};

export const signupAction = async (
    prevState: SignUpActionState | undefined,
    formData: FormData
): Promise<SignUpActionState | undefined> => {
    console.log(prevState)

    // validation
    const result = registerSchema.safeParse(Object.fromEntries(formData.entries()));
    if (result.success === false) {
        return {
            message: "كل الحقول مطلوبه",
            error: result.error.flatten().fieldErrors as SignUpValidationErrors,
            status: 400,
            formData,
        };
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as UserRole;

    try {
        // check if this email exists 
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        })
        if (user) {
            return {
                message: "هذا البريد الالكتروني مستخدم بالفعل",
                error: {
                    email: ["هذا البريد الالكتروني مستخدم بالفعل"],
                },
                status: 403,
                formData,
            };
        }

        // encrypt password 
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // create user With Hash Password
        await prisma.user.create({
            data: {
                name,
                email,
                password: hash,
                role,
            },
        })
        revalidatePath("/");
        revalidatePath("/trainer");
        return {
            message: "تم إنشاء الحساب بنجاح",
            error: {},
            status: 201,
            formData: new FormData(),
        }
    } catch (error) {
        console.log(error)
        return {
            message: "حدث خطأ",
            error: {},
            status: 500,
            formData,
        }
    }
};

// Update User ---------------------------------------
type UpdateUserValidationErrors = {
    name?: string[];
    role?: UserRole;
    password?: string[];
}

export type UpdateUserActionState = {
    message?: string;
    error: UpdateUserValidationErrors;
    status: number;
    formData: FormData;
};

export const updateUserAction = async (
    prevState: UpdateUserActionState | undefined,
    formData: FormData
): Promise<UpdateUserActionState | undefined> => {
    console.log(prevState)

    // validation
    const result = updateUserSchema.safeParse(Object.fromEntries(formData.entries()));
    if (result.success === false) {
        return {
            message: "Validation failed",
            error: result.error.flatten().fieldErrors as UpdateUserValidationErrors,
            status: 400,
            formData,
        };
    }

    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as UserRole;

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        // Update User
        await prisma.user.update({
            where: {
                email
            },
            data: {
                name,
                password: hash,
                role,
            },
        })

        revalidatePath("/");
        revalidatePath("/trainer");

        return {
            message: "تم التحديث بنجاح",
            error: {},
            status: 200,
            formData: new FormData(),
        }

    } catch (error) {
        console.log(error)
        return {
            message: "حدث خطأ",
            error: {},
            status: 500,
            formData,
        }
    }
}

// Get User Info By Id -----------------------------------
export async function getUserInfoById(id: string) {
    try {
        const userInfo = await prisma.user.findUnique({
            where: { id },
        });
        return userInfo;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Delete User ----------------------------------------
export async function deleteUserAction(id: string) {
    try {
        const deletedUser = await prisma.user.delete({
            where: { id },
        });
        console.log("Deleted User:", deletedUser);
        revalidatePath("/");
        revalidatePath("/trainer");
        return { success: true, error: "تم حذف المستخدم بنجاح" };
    } catch (error) {
        console.error("Error deleting user:", error);
        return { success: false, error: "حدث خطأ أثناء الحذف" };
    }
}

