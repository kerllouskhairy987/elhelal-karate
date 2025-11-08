import z from "zod";

// Login Schema
export const loginSchema = z.object({
  email: z.string().email({ message: "البريد الالكتروني غير صحيح" }),
  password: z.string().min(6, { message: "الرقم السري يجب الا يقل عن 6 احرف" }),
});

// Register Schema
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, { message: "الاسم مطلوب" })
    .max(255, { message: "الاسم لا يزيد عن 255 حرف" }),
  email: z.string().email({ message: "البريد الالكتروني غير صحيح" }),
  password: z.string().min(6, { message: "الرقم السري يجب الا يقل عن 6 احرف" }),
});

// Update User Schema
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, { message: "الاسم مطلوب" })
    .max(255, { message: "الاسم لا يزيد عن 255 حرف" }),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: "الرقم السري يجب ألا يقل عن 6 أحرف",
    }),
});

export const playerSchema = z.object({
  name: z
    .string()
    .min(1, { message: "الاسم مطلوب" })
    .max(255, { message: "الاسم لا يزيد عن 255 حرف" }),
  phone: z.string().min(1, { message: "رقم الهاتف مطلوب" }),
  birthday: z.string().min(1, { message: "تاريخ الميلاد مطلوب" }),
  gender: z.string().min(1, { message: "الجنس مطلوب" }),
  nationalNumber: z.string().min(1, { message: "رقم الهوية مطلوب" }),
  image: z.custom((val) => val instanceof File).optional(),
  contractstartdate: z.string().min(1, { message: "تاريخ بدء العقد مطلوب" }),
  contractenddate: z.string().min(1, { message: "تاريخ انتهاء العقد مطلوب" }),
  playerclass: z.string().min(1, { message: "الصف مطلوب" }),

});

export const imageDocument = () => {
  return z.object({ image: z.custom((val) => val instanceof File).optional() });
};

