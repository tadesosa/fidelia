import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Asumimos que tendrás un archivo de estilos globales

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fidelia MKT",
  description: "Plataforma de lealtad para negocios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
