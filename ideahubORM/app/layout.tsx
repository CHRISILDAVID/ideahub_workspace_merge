import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import "./idea-hub.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/app/contexts/ThemeContext";
import { AuthProvider } from "@/app/contexts/AuthContext";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IdeaHub - Share Your Ideas",
  description: "A collaborative platform for sharing and developing ideas with workspaces",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans")}> 
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
