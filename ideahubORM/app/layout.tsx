import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./idea-hub.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IdeaHub - Collaborative Workspace",
  description: "Share and collaborate on ideas with workspaces",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className)}> 
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
