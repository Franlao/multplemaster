
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ultrathink - Tables de multiplication",
  description:
    "Plateforme moderne et intuitive pour maîtriser vos tables de multiplication de 0 à 35",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
