import { Metadata } from 'next';
import Hero from '../components/Hero';
import HomeAbout from '../components/HomeAbout';

import HomeProducts from '../components/HomeProducts';

export const metadata: Metadata = {
  title: 'Home',
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
