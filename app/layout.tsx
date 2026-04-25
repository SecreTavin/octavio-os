import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OctávioOS 2.0",
  description: "Portfólio Interativo Avançado em React",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/98.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}