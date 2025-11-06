import { prisma } from "@/utils/prisma";
import bcrypt from "bcryptjs";

async function createFirstUser() {
  const name = "Admin User"; // الاسم الافتراضي
  const email = "montasergohar@gmail.com"; // الايميل الافتراضي
  const password = "123456"; // الباسورد الافتراضي
  const role = "ADMIN"; // أو "USER" حسب الـ Prisma schema بتاعتك

  try {
    // Check if exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      console.log("❌ User already exists!");
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
        role,
      },
    });

    console.log("✅ User created successfully:");
    console.log(user);
    console.log(`\nLogin using:\nEmail: ${email}\nPassword: ${password}`);
  } catch (error) {
    console.error("❌ Error creating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createFirstUser();
