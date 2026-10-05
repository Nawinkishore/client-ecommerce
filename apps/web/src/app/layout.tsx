import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "../components/providers/ReactQueryProvider";
import { AuthProvider } from "../context/auth-context";
import { ThemeProvider } from "../context/theme-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sreesoap | Handcrafted Organic Soaps & Botanical Skincare",
  description: "Pure organic handcrafted soaps, essential oil blends, and sustainable skincare delivered with eco-friendly efficiency.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.className} min-h-screen selection:bg-emerald-500 selection:text-white`}>
        <ThemeProvider>
          <ReactQueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
