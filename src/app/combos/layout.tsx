import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Diwali Combos & Cracker Gift Boxes | Sivakasi wholesale',
  description: 'Order curated family cracker boxes, kid-safe combo packages, and wedding celebration hampers directly from Sivakasi. Flat 60% discount on MRP with direct delivery.',
  keywords: [
    'Diwali combos online booking',
    'premium cracker gift boxes',
    'Sivakasi wholesale family packs',
    'kids safe crackers combo',
    'cheap fireworks boxes India',
    'wedding crackers package'
  ],
  alternates: {
    canonical: '/combos',
  },
  openGraph: {
    title: 'Diwali Combos & Cracker Gift Boxes | Jegajothi Crackers',
    description: 'Get the best value family combo boxes and festive gift packs delivered from Sivakasi factory.',
    url: 'https://jjcrackersworld.com/combos',
  }
};

export default function CombosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
