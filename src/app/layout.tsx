import type { Metadata } from "next";
import { Inter, Playfair_Display } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ToastContainer } from '@/components/ui/Toast';
import { MarketingHead } from '@/components/layout/MarketingHead';
import { SpeedInsights } from '@vercel/speed-insights/next';
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://jjcrackersworld.com'),
  title: {
    default: "Jegajothi Crackers | Premium Sivakasi Fireworks Since 2015 | Buy Crackers Online",
    template: "%s | Jegajothi Crackers — Sivakasi",
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
  description: "Sivakasi's most trusted fireworks manufacturer since 2015. Buy premium crackers online at factory direct prices — up to 60% off MRP. Safety-certified, eco-friendly green crackers for Diwali, weddings & celebrations. Free delivery across Tamil Nadu.",
  keywords: [
    "crackers", "fireworks", "Sivakasi", "Diwali", "premium crackers", "Jegajothi", "JJ Crackers",
    "eco-friendly fireworks", "green crackers", "pyrotechnics", "Tamil Nadu crackers",
    "buy crackers online", "Sivakasi crackers factory price", "Diwali crackers 2026",
    "cheapest crackers online", "crackers wholesale Sivakasi", "online crackers Tamil Nadu",
    "wedding crackers", "festival fireworks India", "crackers home delivery",
    "Vembakottai crackers", "crackers near me", "best crackers shop online",
  ],
  authors: [{ name: "Jegajothi Crackers", url: process.env.NEXT_PUBLIC_SITE_URL || 'https://jjcrackersworld.com' }],
  creator: "Jegajothi Crackers",
  publisher: "Jegajothi Crackers",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  alternates: { canonical: '/' },
  openGraph: {
    title: "Jegajothi Crackers | Premium Sivakasi Fireworks — Factory Direct Prices",
    description: "Over a decade of brilliance. Premium, safety-certified fireworks delivered from Sivakasi at direct factory prices. Up to 60% off MRP.",
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
  verification: { 
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "", 
    yandex: "" 
  },
  category: "E-commerce",
  other: {
    /* GEO Meta Tags for Local SEO / GEO Optimization */
    'geo.region': 'IN-TN',
    'geo.placename': 'Vembakottai, Sivakasi, Tamil Nadu',
    'geo.position': '9.3639;77.8014',
    'ICBM': '9.3639, 77.8014',
    /* SEM / Advertising */
    'google-site-verification': process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
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
                url: process.env.NEXT_PUBLIC_SITE_URL || 'https://jjcrackersworld.com',
                logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://jjcrackersworld.com'}/logo/logo.png`,
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
                image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://jjcrackersworld.com'}/family-festive.png`,
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
                geo: {
                  '@type': 'GeoCoordinates',
                  latitude: '9.3639',
                  longitude: '77.8014',
                },
                areaServed: {
                  '@type': 'Country',
                  name: 'India',
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

        {/* JSON-LD: FAQ for AEO (Answer Engine Optimization) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Where can I buy crackers online from Sivakasi?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'You can buy premium crackers online from Jegajothi Crackers (JJ Crackers) at jjcrackersworld.com. We are based in Sivakasi and offer direct factory prices with up to 60% discount off MRP.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What is the minimum order value for crackers?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'The minimum order value at Jegajothi Crackers is ₹2,000. We offer a wide range of crackers starting from budget-friendly single sound crackers to premium gift boxes.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Are Jegajothi Crackers safety certified?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, all our crackers are safety-certified and manufactured following strict quality control measures in our Sivakasi facility. We prioritize customer safety and use eco-friendly materials wherever possible.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Do you deliver crackers across India?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, we deliver crackers across all major cities in India including Chennai, Bangalore, Hyderabad, Mumbai, Delhi, and more. Tamil Nadu customers enjoy expedited delivery directly from our Sivakasi factory.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How much discount do I get on Diwali crackers?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Jegajothi Crackers offers up to 60% off MRP on all crackers. Since we sell directly from our factory in Sivakasi, you get the best wholesale prices without any middlemen.',
                  },
                },
              ],
            }),
          }}
        />

        {/* JSON-LD: HowTo for ordering (AEO / Voice Search) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HowTo',
              name: 'How to Order Crackers Online from Jegajothi Crackers',
              description: 'Step-by-step guide to order premium Sivakasi crackers online at factory direct prices.',
              step: [
                { '@type': 'HowToStep', name: 'Browse Products', text: 'Visit our products page and browse through our extensive catalog of safety-certified crackers.', position: 1 },
                { '@type': 'HowToStep', name: 'Add to Cart', text: 'Select your favorite crackers and add them to your enquiry cart.', position: 2 },
                { '@type': 'HowToStep', name: 'Submit Order', text: 'Fill in your delivery details and submit your order. Our team will confirm via WhatsApp.', position: 3 },
                { '@type': 'HowToStep', name: 'Receive Delivery', text: 'Your crackers will be packed safely and delivered to your doorstep.', position: 4 },
              ],
            }),
          }}
        />

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <MarketingHead />
          <ClientEffects />
          <Navbar />
          <main className="pt-20 min-h-screen">
            {children}
          </main>
           <Footer />
          <ToastContainer />
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
