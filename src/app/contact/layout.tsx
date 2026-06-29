import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Sivakasi Office & Wholesale Booking | Jegajothi Crackers',
  description: 'Connect with Jegajothi Crackers wholesale support: Call +91 70923 00252. Visit our Sivakasi-Vembakottai Main Road showroom or enquire online for custom wedding orders.',
  keywords: [
    'Sivakasi crackers wholesale contact number',
    'buy crackers directly from Sivakasi factory',
    'Jegajothi crackers support address',
    'bulk order fireworks Sivakasi'
  ],
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Wholesale Office | Jegajothi Crackers',
    description: 'Get in touch for bulk orders, corporate gifting, and local distribution bookings.',
    url: 'https://jjcrackersworld.com/contact',
  }
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
