import type { Metadata } from "next";
import { Inter, Playfair_Display } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ToastContainer } from '@/components/ui/Toast';
import { WhatsAppFAB } from '@/components/ui/WhatsAppFAB';
import { AIChatbot } from '@/components/ui/AIChatbot';
import { SparkCursor } from '@/components/effects/SparkCursor';
import { GlobalAtmosphere } from '@/components/effects/GlobalAtmosphere';
import "./globals.css";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Jegajothi Crackers | Premium Sivakasi Fireworks Since 1984",
  description: "Sivakasi's most trusted fireworks manufacturer. Premium quality, safety-certified, eco-friendly crackers. Four decades of lighting up celebrations across India. Direct factory prices.",
  keywords: ["crackers", "fireworks", "Sivakasi", "Diwali", "premium crackers", "Jegajothi", "JJ Crackers", "eco-friendly fireworks"],
  openGraph: {
    title: "Jegajothi Crackers | Premium Sivakasi Fireworks",
    description: "Four decades of brilliance. Premium, safety-certified fireworks delivered from Sivakasi.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body 
        suppressHydrationWarning
        className={`${inter.variable} ${playfair.variable} font-sans min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased overflow-x-hidden transition-colors duration-400`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <GlobalAtmosphere />
          <SparkCursor />
          <Navbar />
          <main className="pt-20 min-h-screen">
            {children}
          </main>
          <Footer />
          <WhatsAppFAB />
          <AIChatbot />
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
