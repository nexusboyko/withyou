import type { Metadata } from "next";
import "./globals.css";
import User from "@/compo/User";

export const metadata: Metadata = {
  title: "With You",
  description: "DubHacks 2024",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="absolute h-screen w-screen bg-gradient-to-t from-black via-slate-900 to-black backdrop-blur-sm">
        <header className="absolute flex justify-center items-center top-0 w-screen py-8">
          <User />
        </header>
        {children}
        <footer></footer>
      </body>
    </html>
  );
}
