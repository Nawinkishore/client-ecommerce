import React from "react";
import "./globals.css";

export const metadata = {
  title: "Client E-Commerce Platform",
  description: "Production-Grade E-Commerce Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
