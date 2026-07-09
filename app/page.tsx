import Hero from '../components/Hero';
import HomeAbout from '../components/HomeAbout';
import HomeProducts from '../components/HomeProducts';
import CmsCta from '@/components/cms/CmsCta';
import { generateCmsMetadata } from '@/lib/cms/metadata';
import { resolvePublicPage } from '@/lib/cms/gate';
import {
  resolveHomeCapabilities,
  resolveHomeProductTeasers,
  resolveHomeServiceCards,
} from '@/lib/cms/home-page';
import type { CtaPayload, HeroPayload, TextPayload } from '@/lib/cms/types';

export const generateMetadata = () => generateCmsMetadata('home');

export default async function HomePage() {
  const page = await resolvePublicPage('home');
  const hero = page.sections.hero as HeroPayload;
  const aboutTeaser = page.sections.about_teaser as TextPayload;
  const aboutTeaserCta = page.sections.about_teaser_cta as CtaPayload | undefined;
  const servicesIntro = page.sections.services_intro as TextPayload | undefined;
  const servicesViewCta = page.sections.services_view_cta as CtaPayload | undefined;
  const advantageIntro = page.sections.advantage_intro as TextPayload | undefined;
  const productsHeading = page.sections.products_teaser_heading as TextPayload | undefined;
  const ctaBottom = page.sections.cta_bottom as CtaPayload | undefined;

  return (
    <article>
      <Hero headline={hero.headline} />
      <HomeAbout
        heading={aboutTeaser.heading}
        body={aboutTeaser.body}
        cta={aboutTeaserCta}
      />
      <HomeProducts
        sectionHeading={productsHeading?.heading ?? 'Products & Supply'}
        sectionSubheading={productsHeading?.body}
        servicesIntro={servicesIntro}
        servicesViewCta={servicesViewCta}
        serviceCards={resolveHomeServiceCards(page.sections)}
        advantageHeading={advantageIntro?.heading}
        capabilities={resolveHomeCapabilities(page.sections)}
        productTeasers={resolveHomeProductTeasers(page.sections)}
      />
      {ctaBottom?.buttonLabel ? <CmsCta cta={ctaBottom} /> : null}
    </article>
  );
}
