import type { Metadata } from "next";
import { Inter, Playfair_Display } from 'next/font/google';
import dynamic from 'next/dynamic';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ToastContainer } from '@/components/ui/Toast';
import { WhatsAppFAB } from '@/components/ui/WhatsAppFAB';
import { AIChatbot } from '@/components/ui/AIChatbot';
import "./globals.css";

import { ClientEffects } from '@/components/effects/ClientEffects';

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://jegajothi-crackers.vercel.app'),
  title: {
    default: "Jegajothi Crackers | Premium Sivakasi Fireworks Since 1984",
    template: "%s | Jegajothi Crackers",
  },
  description: "Sivakasi's most trusted fireworks manufacturer since 1984. Premium quality, safety-certified, eco-friendly crackers with direct factory prices. Four decades lighting up Indian celebrations.",
  keywords: ["crackers", "fireworks", "Sivakasi", "Diwali", "premium crackers", "Jegajothi", "JJ Crackers", "eco-friendly fireworks", "green crackers", "pyrotechnics", "Tamil Nadu crackers"],
  authors: [{ name: "Jegajothi Crackers" }],
  creator: "Jegajothi Crackers",
  publisher: "Jegajothi Crackers",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  alternates: { canonical: '/' },
  openGraph: {
    title: "Jegajothi Crackers | Premium Sivakasi Fireworks",
    description: "Four decades of brilliance. Premium, safety-certified fireworks delivered from Sivakasi at direct factory prices.",
    type: "website",
    locale: "en_IN",
    siteName: "Jegajothi Crackers",
    images: [{ url: "/family-festive.png", width: 1200, height: 630, alt: "Jegajothi Crackers — Premium Sivakasi Fireworks" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jegajothi Crackers | Premium Sivakasi Fireworks",
    description: "Four decades of brilliance. Premium, safety-certified fireworks delivered from Sivakasi.",
    images: ["/family-festive.png"],
  },
  verification: { google: "", yandex: "" },
  category: "E-commerce",
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
        {/* JSON-LD: Organization + LocalBusiness for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Jegajothi Crackers',
                alternateName: 'JJ Crackers',
                url: process.env.NEXT_PUBLIC_SITE_URL || 'https://jegajothi-crackers.vercel.app',
                logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://jegajothi-crackers.vercel.app'}/jj-crackers-logo.png`,
                foundingDate: '1984',
                description: "Sivakasi's most trusted fireworks manufacturer since 1984.",
                telephone: '+91-70923-00252',
                email: 'jjcrackersworld@gmail.com',
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: '1/406, Sivakasi-Vembakottai Main Road, Opp. EB Office',
                  addressLocality: 'Vembakottai',
                  addressRegion: 'Tamil Nadu',
                  addressCountry: 'IN',
                },
                sameAs: [
                  'https://wa.me/917092300252',
                ],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'LocalBusiness',
                '@id': '#localbusiness',
                name: 'Jegajothi Crackers',
                image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://jegajothi-crackers.vercel.app'}/family-festive.png`,
                priceRange: '₹₹',
                telephone: '+91-70923-00252',
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: '1/406, Sivakasi-Vembakottai Main Road, Opp. EB Office',
                  addressLocality: 'Vembakottai',
                  addressRegion: 'Tamil Nadu',
                  postalCode: '626131',
                  addressCountry: 'IN',
                },
                openingHoursSpecification: [
                  {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                    opens: '09:00',
                    closes: '20:00',
                  },
                ],
              },
            ]),
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ClientEffects />
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
