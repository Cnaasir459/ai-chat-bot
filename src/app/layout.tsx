import type { Metadata } from "next";
import { Libre_Baskerville, Lora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ai-chat-app.vercel.app'),
  title: "AI CHAT BOT - Made by Abdi Naasir",
  description: "Mobile-first AI chat application with resizable sidebar, voice recording, file uploads, and multi-language support. Built by Abdi Naasir.",
  keywords: ["AI chat", "mobile app", "Abdi Naasir", "voice recording", "file upload", "multi-language", "responsive design"],
  authors: [{ name: "Abdi Naasir" }],
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "AI CHAT BOT - Made by Abdi Naasir",
    description: "Mobile-first AI chat application with voice recording and file uploads",
    url: "https://ai-chat-app.vercel.app",
    siteName: "AI CHAT BOT",
    type: "website",
    images: [
      {
        url: "/logo.svg",
        width: 512,
        height: 512,
        alt: "AI Chat Bot Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI CHAT BOT - Made by Abdi Naasir",
    description: "Mobile-first AI chat application with voice recording and file uploads",
    creator: "@AbdiNaasir",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${libreBaskerville.variable} ${lora.variable} ${ibmPlexMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
