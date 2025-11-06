"use server";

import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
const UploadImage = async ({
  imageFile,
  publicId,
}: {
  imageFile: {
    size: number;
    arrayBuffer: () => Promise<ArrayBuffer>;
    type: string;
  };
  publicId?: string;
}): Promise<{ imageUrl: string; publicId: string } | undefined> => {
  try {
    if (publicId) {
      const oldImagePath = path.join(process.cwd(), "public/uploads", publicId);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const uploadsDir = path.join(process.cwd(), "public/uploads");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const uniqueName = `${Date.now()}-${randomUUID()}.jpg`;
    const filePath = path.join(uploadsDir, uniqueName);
    fs.writeFileSync(filePath, buffer);

    const imageUrl = `${process.env.NEXT_PUBLIC_URL}/uploads/${uniqueName}`;

    return {
      imageUrl,
      publicId: uniqueName,
    };
  } catch (error) {
    console.error("❌ Error saving image locally:", error);
    return undefined;
  }
};

export default UploadImage;