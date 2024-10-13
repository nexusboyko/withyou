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
      <body>
        <header className="flex justify-center items-center top-0 w-screen py-8">
          <User />
        </header>
        {children}
        <footer></footer>
      </body>
    </html>
  );
}
