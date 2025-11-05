import z from "zod";

// Login Schema
export const loginSchema = z.object({
    email: z.string().email({ message: "البريد الالكتروني غير صحيح" }),
    password: z.string().min(6, { message: "الرقم السري يجب الا يقل عن 6 احرف" }),
});


// Register Schema
export const registerSchema = z.object({
    name: z.string().min(1, { message: "الاسم مطلوب" }).max(255, { message: "الاسم لا يزيد عن 255 حرف" }),
    email: z.string().email({ message: "البريد الالكتروني غير صحيح" }),
    password: z.string().min(6, { message: "الرقم السري يجب الا يقل عن 6 احرف" }),
})


// Update User Schema
export const updateUserSchema = z.object({
    name: z.string().min(1, { message: "الاسم مطلوب" }).max(255, { message: "الاسم لا يزيد عن 255 حرف" }),
    password: z.string().min(6, { message: "الرقم السري يجب الا يقل عن 6 احرف" }),
})

