import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Layout from "@/components/ui/Layout";
import { ThemeProvider } from "@/components/theme-provider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
