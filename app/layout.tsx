import type { Metadata } from "next";
import { Geist, Geist_Mono, Bowlby_One_SC, Shadows_Into_Light } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bowlbyOneSC = Bowlby_One_SC({
  variable: "--font-bowlby-one-sc",
  subsets: ["latin"],
  weight: "400",
});

const shadowsIntoLight = Shadows_Into_Light({
  variable: "--font-shadows-into-light",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Invitation Saint Valentin",
  description: "Une invitation spéciale pour la Saint Valentin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bowlbyOneSC.variable} ${shadowsIntoLight.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
