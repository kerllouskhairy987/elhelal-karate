"use server";

import UploadImage from "@/components/UploadImage";
import { prisma } from "@/utils/prisma";
import { imageDocument, playerSchema } from "@/validation";
import path from "path";
import fs from "fs";
import { revalidatePath } from "next/cache";

export const addPlayer = async (
  args: { userId: string },
  prevState: unknown,
  formData: FormData
) => {
  if (!args.userId)
    return { status: 400, message: "الرجاء تحديد الفرع", formData };
  const result = playerSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return {
      error: result.error.flatten().fieldErrors,
      status: 400,
      formData,
    };
  }
  const data = result.data;

  const isExsistsPhone = await prisma.player.findFirst({
    where: {
      phone: data.phone,
    },
  });
  if (isExsistsPhone) {
    return {
      status: 400,
      message: "رقم الموبايل موجود بالفعل",
      formData,
    };
  }

  const isExsistsNationalNumber = await prisma.player.findFirst({
    where: {
      nationalNumber: data.nationalNumber,
    },
  });
  if (isExsistsNationalNumber) {
    return {
      status: 400,
      message: "رقم الهوية موجود بالفعل",
      formData,
    };
  }

  const imageFile = data?.image as unknown as {
    size: number;
    arrayBuffer: () => Promise<ArrayBuffer>;
    type: string;
  };
  let returnValue;
  if (imageFile.size > 0) {
    returnValue = await UploadImage({ imageFile });
  }
  const { imageUrl, publicId: uniqueName } = returnValue || {};


  try {
    await prisma.player.create({
      data: {
        name: data.name,
        phone: data.phone,
        birthday: new Date(data.birthday),
        gender: data.gender,
        nationalNumber: data.nationalNumber,
        image: imageUrl || null,
        userId: args.userId,
        publicId: uniqueName || args.userId,
        contractstartdate: new Date(data.contractstartdate),
        contractenddate: new Date(data.contractenddate),
        playerclass: data.playerclass,
      },
    });
    revalidatePath("/player");

    return {
      status: 200,
      message: "تم الحفظ بنجاح",
    };
  } catch (error) {
    console.error("Error saving image locally:", error);
    return {
      status: 500,
      message: "خطا في السيرفر",
      formData,
    };
  }
};

export const updatePlayer = async (
  args: { playerId: number; publicId: string },
  prevState: unknown,
  formData: FormData
) => {
  const result = playerSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return {
      error: result.error.flatten().fieldErrors,
      status: 400,
      formData,
    };
  }
  const data = result.data;
  const imageFile = data?.image as unknown as {
    size: number;
    arrayBuffer: () => Promise<ArrayBuffer>;
    type: string;
  };

  const hasNewImage = Boolean(imageFile?.size);
  let imageUrl: string | undefined;
  let newPublicId;
  if (hasNewImage) {
    const returnValue = await UploadImage({
      imageFile,
      publicId: args.publicId,
    });
    imageUrl = returnValue?.imageUrl;
    newPublicId = returnValue?.publicId;
  }
  try {
    await prisma.player.update({
      where: {
        id: args.playerId,
      },
      data: {
        name: data.name,
        phone: data.phone,
        birthday: new Date(data.birthday),
        gender: data.gender,
        nationalNumber: data.nationalNumber,
        image: imageUrl,
        publicId: newPublicId || args.publicId,
        contractstartdate: new Date(data.contractstartdate),
        contractenddate: new Date(data.contractenddate),
        playerclass: data.playerclass,
      },
    });
    revalidatePath("/player");
    revalidatePath(`/player/${args.playerId}/view`);
    revalidatePath(`/player/${args.playerId}/adddocument`);

    return {
      status: 200,
      message: "تم الحفظ بنجاح",
      formData,
    };
  } catch (error) {
    console.error("Error saving image locally:", error);
    return {
      status: 500,
      message: "خطا في السيرفر",
      formData,
    };
  }
};

export const deletePlayer = async (args: { id: number; publicId: string }) => {
  try {
    const images = await prisma.image.findMany({
      where: { playerId: args.id },
    });

    for (const img of images) {
      const oldImagePath = path.join(
        process.cwd(),
        "public/uploads",
        img.publicId
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      await prisma.image.delete({ where: { id: img.id } });
    }

    if (args.publicId) {
      const playerImagePath = path.join(
        process.cwd(),
        "public/uploads",
        args.publicId
      );
      if (fs.existsSync(playerImagePath)) {
        fs.unlinkSync(playerImagePath);
      }
    }

    await prisma.player.delete({
      where: { id: args.id },
    });

    revalidatePath("/player");

    return { status: 200, message: "تم الحذف بنجاح" };
  } catch (error) {
    console.error("خطأ أثناء الحذف:", error);
    return { status: 500, message: "خطأ في السيرفر" };
  }
};

export const UploadImageDocument = async (
  playerId: string,
  prevState: unknown,
  formData: FormData
) => {
  const result = imageDocument().safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return {
      error: result.error.flatten().fieldErrors,
      status: 400,
      formData,
    };
  }

  if (!playerId) {
    return {
      status: 400,
      message: "Please select a valid Our Work item",
    };
  }

  const data = result.data;
  const imageFile = data?.image as unknown as {
    size: number;
    arrayBuffer: () => Promise<ArrayBuffer>;
    type: string;
  };
  const returnValue = await UploadImage({ imageFile });
  const { imageUrl, publicId: uniqueName } = returnValue || {};

  if (typeof imageUrl !== "string") {
    return {
      status: 500,
      message: "فشل رفع الصورة",
      formData,
    };
  }

  try {
    // رفع الصورة مباشرة إلى Cloudinary

    await prisma.image.create({
      data: {
        publicId: uniqueName || playerId.toString(),
        url: imageUrl,
        playerId: Number(playerId),
      },
    });
    revalidatePath("/player");
    revalidatePath(`/player/${playerId}/view`);
    revalidatePath(`/player/${playerId}/adddocument`);

    return {
      status: 200,
      message: "Image added successfully",
    };
  } catch (error) {
    console.error("Error adding work image:", error);
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};

export const deleteImage = async ({
  id,
  publicId,
  playerId,
}: {
  id: string;
  publicId: string;
  playerId: string;
}) => {
  try {
    if (publicId) {
      const oldImagePath = path.join(process.cwd(), "public/uploads", publicId);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
  } catch (error) {
    console.error("Failed to delete from Cloudinary", error);
  }
  try {
    await prisma.image.delete({
      where: {
        id: Number(id),
      },
    });

    revalidatePath("/player");
    revalidatePath(`/player/${playerId}/view`);

    return {
      status: 200,
      message: "Image deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};
