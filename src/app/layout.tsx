import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jegajothi Crackers - Sivakasi's Most Trusted Since 1984",
  description: "Premium quality fireworks and crackers from Sivakasi. Safety-certified, eco-friendly. Four decades of brilliance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="min-h-screen bg-bg text-text antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
