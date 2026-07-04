import { Metadata } from 'next';
import Hero from '../components/Hero';
import HomeAbout from '../components/HomeAbout';
import HomeProducts from '../components/HomeProducts';

export const metadata: Metadata = {
  title: {
    absolute: 'Turnkey Plant Engineering — Gujarat Nippon International',
  },
  description:
    'Gujarat Nippon International undertakes turnkey design, manufacture and supply of plant and machineries for metal processing industries across India, Africa and the GCC.',
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
