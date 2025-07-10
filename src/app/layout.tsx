import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fidelia MKT",
  description: "Plataforma de lealtad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
