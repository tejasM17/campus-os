import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionHydration } from "@/src/components/auth/session-hydration";
import { QueryProvider } from "@/src/components/providers/query-provider";
import { Toaster } from "@/components/ui/toast";
import { ThemeProvider } from "@/src/components/providers/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CampusOS — FindIt",
  description:
    "A clear, thoughtful campus lost and found for browsing found items, making claims, and reporting lost belongings.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <SessionHydration />
        <ThemeProvider>
          <QueryProvider>
            <Toaster>{children}</Toaster>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
