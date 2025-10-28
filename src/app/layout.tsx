
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppNav } from "@/components/AppNav";

export const metadata: Metadata = {
  title: "Ultrathink - Tables de multiplication",
  description:
    "Plateforme moderne et intuitive pour maîtriser vos tables de multiplication de 0 à 35",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider defaultTheme="system" storageKey="ultrathink-ui-theme">
          <AppNav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
