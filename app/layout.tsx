import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "./components/ToastProvider";

export const metadata: Metadata = {
  title: "Coverxity",
  description:
    "AI-powered tool to find the perfect cover images for your content",
  openGraph: {
    title: "Coverxity",
    description:
      "AI-powered tool to find the perfect cover images for your content",
    images: [
      {
        url: "/icon.png",
        width: 64,
        height: 64,
        alt: "Coverxity Icon",
      },
    ],
  },
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
