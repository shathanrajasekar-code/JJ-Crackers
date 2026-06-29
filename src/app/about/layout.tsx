import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Heritage & Factory Legacy | About Jegajothi Crackers Sivakasi',
  description: 'Operating in Sivakasi since 2015, Jegajothi Crackers is committed to manufacturing high-quality, safety-certified, and eco-friendly fireworks. Read our story and values.',
  keywords: [
    'Sivakasi fireworks factory owner',
    'Jegajothi crackers manufacturer Sivakasi',
    'eco friendly pyrotechnics India',
    'traditional green crackers Sivakasi'
  ],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'Our Sivakasi Heritage | Jegajothi Crackers',
    description: 'Learn about our decade-long journey of manufacturing quality and safe celebration fireworks.',
    url: 'https://jjcrackersworld.com/about',
  }
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
