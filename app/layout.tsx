import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "./components/ToastProvider";

export const metadata: Metadata = {
  title: "Coverxity",
  description: "Find the perfect cover image with AI",
  openGraph: {
    title: "Coverxity",
    description: "Find the perfect cover image with AI",
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
