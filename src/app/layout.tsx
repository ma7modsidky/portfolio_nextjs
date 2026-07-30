import type { Metadata } from "next";
import "./globals.css";
import SettingsProvider from "@/components/SettingsProvider";

export const metadata: Metadata = {
  title: {
    template: "%s | Portfolio",
    default: "Portfolio | Full-Stack Developer",
  },
  description:
    "A showcase of projects, skills, and experience in web development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-surface">
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}
