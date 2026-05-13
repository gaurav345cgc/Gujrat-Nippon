import { Metadata } from 'next';
import Hero from '../components/Hero';
import HomeAbout from '../components/HomeAbout';

import HomeProducts from '../components/HomeProducts';

export const metadata: Metadata = {
  title: 'Home',
  description:
    "Gujarat Nippon International supplies turnkey plant machinery, industrial spares, and capital equipment to steel, plastics, and energy industries across India, Africa, and GCC. Enquire today.",
};

export default function HomePage() {
  return (
    <article>
      <Hero />
      <HomeAbout />

      <HomeProducts />
    </article>
  );
}
