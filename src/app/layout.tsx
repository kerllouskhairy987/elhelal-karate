import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Layout from "@/components/ui/Layout";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastContainer } from 'react-toastify';
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/verifyToken";

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  icons: "/favicon.jpgى",
  title: "elhelhelal-karate",
  description: "نظام حضور وانصراف اللاعبين للكاراتي",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieStore = await cookies();
  const token = cookieStore.get("JwtToken")?.value || "";
  const user = verifyToken(token);

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head />
      <body className={`${cairo.className}  font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastContainer position="bottom-center" />
          <Layout user={user}>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
