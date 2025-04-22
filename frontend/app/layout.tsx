'use client';
import { usePathname } from 'next/navigation';

import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "../src/styles/globals.css";
import LeftSideBar from "@/src/components/LeftSideBar";
import { Providers, AuthWrapper } from "@/src/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const authPaths = ['/login', '/signup'];

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <AuthWrapper>
            {!authPaths.includes(pathname) && <LeftSideBar />}
            {children}
          </AuthWrapper>
          <Toaster position="top-center" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
