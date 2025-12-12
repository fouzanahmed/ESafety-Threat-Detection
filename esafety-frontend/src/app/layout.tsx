import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Guardian.Social | Empowering Parents Against Online Radicalization",
  description: "AI-powered platform helping parents and educators understand manosphere content and have empathetic conversations with young people. Built by #BANDITS for the eSafety Commissioner Grand Challenge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans`}
      >
        <Navigation />
        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
