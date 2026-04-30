import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { SparkCursor } from '@/components/effects/SparkCursor';
import { AnnouncementTicker } from '@/components/layout/AnnouncementTicker';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ToastContainer } from '@/components/ui/Toast';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Jegajothi Crackers - Sivakasi\'s Most Trusted Since 1984',
  description: 'Premium quality fireworks and crackers from Sivakasi. Safety-certified, eco-friendly, and delivered to your doorstep. Four decades of brilliance.',
  keywords: 'crackers, diwali, fireworks, sivakasi, jegajothi, tamil nadu, sparklers, rockets',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as 'en' | 'ta')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <SparkCursor />
      <AnnouncementTicker />
      <Navbar />
      <main className="pt-[106px]">{children}</main>
      <Footer />
      <ToastContainer />
    </NextIntlClientProvider>
  );
}
