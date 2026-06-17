import type { Metadata } from "next";
import { Inter, Playfair_Display } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ToastContainer } from '@/components/ui/Toast';
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
    default: "Jegajothi Crackers | Premium Sivakasi Fireworks Since 2015",
    template: "%s | Jegajothi Crackers",
  },
  icons: {
    icon: [
      { url: '/logo/logo.png', type: 'image/png' },
      { url: '/logo/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/logo/logo.png',
    apple: '/logo/logo.png',
  },
  description: "Sivakasi's most trusted fireworks manufacturer since 2015. Premium quality, safety-certified, eco-friendly crackers with direct factory prices. Over a decade lighting up Indian celebrations.",
  keywords: ["crackers", "fireworks", "Sivakasi", "Diwali", "premium crackers", "Jegajothi", "JJ Crackers", "eco-friendly fireworks", "green crackers", "pyrotechnics", "Tamil Nadu crackers"],
  authors: [{ name: "Jegajothi Crackers" }],
  creator: "Jegajothi Crackers",
  publisher: "Jegajothi Crackers",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  alternates: { canonical: '/' },
  openGraph: {
    title: "Jegajothi Crackers | Premium Sivakasi Fireworks",
    description: "Over a decade of brilliance. Premium, safety-certified fireworks delivered from Sivakasi at direct factory prices.",
    type: "website",
    locale: "en_IN",
    siteName: "Jegajothi Crackers",
    images: [{ url: "/family-festive.png", width: 1200, height: 630, alt: "Jegajothi Crackers — Premium Sivakasi Fireworks" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jegajothi Crackers | Premium Sivakasi Fireworks",
    description: "Over a decade of brilliance. Premium, safety-certified fireworks delivered from Sivakasi.",
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
                logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://jegajothi-crackers.vercel.app'}/logo/logo.png`,
                foundingDate: '2015',
                description: "Sivakasi's most trusted fireworks manufacturer since 2015.",
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
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
