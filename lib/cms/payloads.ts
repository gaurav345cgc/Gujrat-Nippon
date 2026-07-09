import type {
  ContactInfoPayload,
  CtaPayload,
  HeroPayload,
  PageSlug,
  PublishedPageSnapshot,
  SeoPayload,
  TextPayload,
} from '@/lib/cms/types';
import { PAGE_REGISTRY } from '@/lib/cms/constants';
import { buildAboutExtraSections } from '@/lib/cms/about-defaults';
import { buildIndustryCardSections } from '@/lib/cms/industry-defaults';
import { buildHomeListSections } from '@/lib/cms/home-defaults';
import { buildProductGridSections } from '@/lib/cms/product-grid-defaults';

export const GLOBAL_CONTACT: ContactInfoPayload = {
  heading: "Gujarat Nippon International Pvt. Ltd.",
  address: "21, Navyug Industrial Estate, M.I.D.C Cross Road, J.B. Nagar, Andheri (East), Mumbai – 400069",
  phone: "+91-22-4099 7000",
  email: "info@gujaratnippon.com",
};

type FallbackPage = {
  sections: Record<string, HeroPayload | TextPayload | CtaPayload | ContactInfoPayload>;
  seo: SeoPayload;
};

const FALLBACK_PAGES: Record<PageSlug, FallbackPage> = {
  home: {
    sections: {
      hero: {
        headline: "Engineering Design, Supply & Turnkey Solutions",
      },
      about_teaser: {
        body: "Gujarat Nippon International Pvt Ltd provides engineering solutions and a diversified range of industrial products and services: design, manufacture and supply of plant and machineries for metal processing industries, revamping, retrofitting and modernization of existing lines, industrial spares and components, greases, lubricants and industrial chemicals, and capital equipment sourcing for domestic and export customers.\n\nWe are committed to reliable products and services, timely execution, transparent dealings and long-term business relationships. Our focus remains on technical expertise, quality standards and total customer satisfaction.",
        heading: "About Us",
      },
      about_teaser_cta: {
        heading: "About Us link",
        buttonHref: "/about",
        buttonLabel: "READ MORE ABOUT THE COMPANY",
      },
      services_intro: {
        body: "We provide plant engineering, equipment refurbishment, modernization, industrial spares and consumables supply, and capital equipment sourcing in a well-defined and planned manner, with emphasis on quality, execution and after sales support for customer requirements.",
        heading: "Our Services",
      },
      services_view_cta: {
        heading: "Services link",
        buttonHref: "/products",
        buttonLabel: "View our services",
      },
      advantage_intro: {
        heading: "Engineering Capabilities",
        body: "Carousel slide link text is the line after CTA: in each Capability section below.",
      },
      products_teaser_heading: {
        body: "Browse featured industrial supply categories.",
        heading: "Products & Supply",
      },
      cta_bottom: {
        heading: "Your Trusted Partner in Precision Manufacturing",
        body: "Every successful project begins with the right manufacturing partner. Whether you're developing a new product or scaling production, we're here to provide dependable quality, technical expertise, and timely delivery. Contact our team to discuss your requirements and receive a customized solution.",
        buttonHref: "/contact",
        buttonLabel: "Contact Us",
      },
      ...buildHomeListSections(),
    },
    seo: {
      seoTitle: "Turnkey Plant Engineering & Industrial Supply — Gujarat Nippon International",
      metaDescription: "Gujarat Nippon International undertakes turnkey design, manufacture and supply of plant and machineries for metal processing in India, Africa and the GCC.",
      ogTitle: "Turnkey Plant Engineering & Industrial Supply — Gujarat Nippon International",
      ogDescription: "Gujarat Nippon International undertakes turnkey design, manufacture and supply of plant and machineries for metal processing in India, Africa and the GCC.",
    },
  },
  about: {
    sections: {
      hero: {
        body: "A globally focused engineering solutions and industrial supply company dedicated to providing industries with cutting-edge machinery, technological expertise, and dependable project execution.",
        headline: "About Gujarat Nippon",
        subheadline: "International Pvt Ltd.",
      },
      company_overview: {
        body: "Established in 2004, Gujarat Nippon International Pvt Ltd is an industrial engineering company Mumbai-based metal processors and export buyers approach for coordinated supply. We undertake design, manufacture and supply of plant and machineries for metal processing industries on a turnkey basis where the contract requires it, and we carry out revamping, retrofitting and modernization of existing lines and equipment in accordance with drawings and quality standards agreed with the customer.\n\nOur scope includes hot and cold rolling mill lines, tube mill lines, slitting and cut-to-length lines, strip galvanising and colour coating lines, deep drawing presses, heat treatment furnaces and related equipment. We maintain strategic alliances with manufacturers for industrial spares, greases, lubricants, industrial chemicals and capital equipment, with emphasis on reliable products and services, timely execution, transparent dealings, competitive pricing where the enquiry permits, total customer satisfaction and after sales support under one roof for domestic and international markets.",
        heading: "About Company",
      },
      mission: {
        body: "To provide engineering solutions and diversified industrial products in a well-defined and planned manner: design, manufacture and supply of plant and machineries, revamping and modernization, industrial spares, greases, lubricants and capital equipment, with commitment to quality standards, transparent dealings and after sales support aligned to customer requirements.",
        heading: "Our Mission",
      },
      vision: {
        body: "To be recognized as a trusted engineering and industrial supply company for metal processing and allied sectors, known for reliable products and services, technical expertise and total customer satisfaction in domestic and international markets.",
        heading: "Our Vision",
      },
      leadership_intro: {
        body: "We undertake each assignment in a well-defined and planned manner, with technical expertise, dependable quality and integrity in export-import transactions. Long-term business relationships and customer requirements remain central to how we coordinate engineering solutions, documentation and dispatch.",
        heading: "Our Philosophy",
      },
      cta: {
        heading: "Learn more about Gujarat Nippon",
        buttonHref: "/contact",
        buttonLabel: "LEARN MORE",
      },
      ...buildAboutExtraSections(),
    },
    seo: {
      seoTitle: "About Us — 18+ Years in Industrial Engineering | Gujarat Nippon International",
      metaDescription: "Established in 2004, Gujarat Nippon International is a Mumbai-based engineering and industrial supply company with 18+ years across 510+ projects.",
      ogTitle: "About Us — 18+ Years in Industrial Engineering | Gujarat Nippon International",
      ogDescription: "Established in 2004, Gujarat Nippon International is a Mumbai-based engineering and industrial supply company with 18+ years across 510+ projects.",
    },
  },
  products: {
    sections: {
      hero: {
        body: "Turnkey plant engineering, industrial spares, greases and lubricants, capital equipment and plastic moulding systems supplied with documented specifications and export-ready dispatch where required.",
        headline: "Industrial Machinery, Spares & Equipment Supply",
        subheadline: "Explore Our Solutions",
      },
      ...buildProductGridSections(),
    },
    seo: {
      seoTitle: "Industrial Machinery & Equipment Supply — Gujarat Nippon International",
      metaDescription: "Gujarat Nippon International offers turnkey plant machineries, industrial spares, chemicals, capital equipment and plastic moulding systems for industrial use.",
      ogTitle: "Industrial Machinery & Equipment Supply — Gujarat Nippon International",
      ogDescription: "Gujarat Nippon International offers turnkey plant machineries, industrial spares, chemicals, capital equipment and plastic moulding systems for industrial use.",
    },
  },
  industries: {
    sections: {
      hero: {
        body: "Industries served metal processing India and allied sectors: turnkey plant and machineries, spares, greases, lubricants, chemicals and capital equipment from our Mumbai office.",
        headline: "Industries We Serve",
        subheadline: "Industries & services",
      },
      intro: {
        body: "Gujarat Nippon International Pvt Ltd supplies engineering solutions and industrial products to the sectors below. For our products and engineering solutions or to send us your project requirement, contact our Mumbai office.",
      },
      cards_intro: {
        body: "Select an industry to view solutions and supply scope.",
      },
      ...buildIndustryCardSections(),
    },
    seo: {
      seoTitle: "Industries We Serve — Steel, Plastics, Energy & More | Gujarat Nippon",
      metaDescription: "We cater to steel and metal processing, automotive, plastics, chemicals, energy and logistics with engineering solutions and sourced capital equipment.",
      ogTitle: "Industries We Serve — Steel, Plastics, Energy & More | Gujarat Nippon",
      ogDescription: "We cater to steel and metal processing, automotive, plastics, chemicals, energy and logistics with engineering solutions and sourced capital equipment.",
    },
  },
  certifications: {
    sections: {
      hero: {
        body: "Committed to the highest global standards.",
        headline: "Our Certifications",
        subheadline: "Quality & Compliance",
      },
      intro: {
        body: "Gujarat Nippon International maintains documented quality and compliance practices aligned to customer and regulatory requirements for industrial supply and project execution.",
        heading: "Quality Management",
      },
      compliance_body: {
        body: "ISO 27001 — Information Security Management\n\nISO 9001 — Quality Management Systems",
        heading: "Certifications",
      },
      cta: {
        heading: "Questions about quality and compliance",
        buttonHref: "/contact",
        buttonLabel: "Contact Us",
      },
    },
    seo: {
      seoTitle: "Certifications & Quality Compliance — Gujarat Nippon International",
      metaDescription: "View Gujarat Nippon International quality and compliance certifications including ISO 9001 and ISO 27001 for industrial engineering and supply operations.",
      ogTitle: "Certifications & Quality Compliance — Gujarat Nippon International",
      ogDescription: "View Gujarat Nippon International quality and compliance certifications including ISO 9001 and ISO 27001 for industrial engineering and supply operations.",
    },
  },
  careers: {
    sections: {
      hero: {
        body: "Gujarat Nippon International Pvt Ltd employs engineering, commercial and operations professionals who support turnkey projects, industrial supply and export-import execution from our Mumbai office.",
        headline: "Build With Us",
        subheadline: "Careers at Gujarat Nippon",
      },
      intro: {
        body: "We value technical discipline, transparent communication and dependable execution. Roles span project coordination, technical sales, procurement, logistics and shop-floor support aligned to metal processing and industrial supply assignments.",
        heading: "Working at GNIPL",
      },
      culture: {
        body: "Relevant industry experience, attention to documentation and quality standards, and the ability to work with domestic and international customers in a professional B2B environment.",
        heading: "What we look for",
      },
      cta: {
        body: "Email your CV with role preference and brief experience summary.",
        heading: "Send your profile",
        buttonHref: "mailto:careers@gujaratnippon.com",
        buttonLabel: "Email careers@gujaratnippon.com",
      },
    },
    seo: {
      seoTitle: "Careers — Industrial Engineering & Supply | Gujarat Nippon International",
      metaDescription: "Explore careers at Gujarat Nippon International in Mumbai — engineering, coordination and supply roles supporting metal processing and export customers.",
      ogTitle: "Careers — Industrial Engineering & Supply | Gujarat Nippon International",
      ogDescription: "Explore careers at Gujarat Nippon International in Mumbai — engineering, coordination and supply roles supporting metal processing and export customers.",
    },
  },
  contact: {
    sections: {
      page_header: {
        body: "Turnkey project enquiry Mumbai teams submit through this page is routed to our engineering and supply desk at the Navyug Industrial Estate office. Please include scope, drawings or bill of material where available, quantities, required dates and destination so that we may respond with lead times, clarifications and next steps for industrial machinery, spares, chemicals or capital equipment requirements.",
        heading: "Contact Us",
      },
      contact_info: {
        email: "info@gujaratnippon.com",
        phone: "+91-22-4099 7000",
        address: "21, Navyug Industrial Estate, M.I.D.C Cross Road, J.B. Nagar, Andheri (East), Mumbai – 400069",
        heading: "Gujarat Nippon International Pvt. Ltd.",
      },
      form_intro: {
        body: "Submit your requirement below. Fields marked required must be completed for us to respond.",
        heading: "Enquiry form",
      },
    },
    seo: {
      seoTitle: "Contact Us — Mumbai MIDC Office | Gujarat Nippon International",
      metaDescription: "Contact Gujarat Nippon International at our Mumbai MIDC office for turnkey project enquiries, industrial machinery requirements and export-import consultations.",
      ogTitle: "Contact Us — Mumbai MIDC Office | Gujarat Nippon International",
      ogDescription: "Contact Gujarat Nippon International at our Mumbai MIDC office for turnkey project enquiries, industrial machinery requirements and export-import consultations.",
    },
  },
  privacy: {
    sections: {
      hero: {
        body: "Last Updated: February 22, 2026",
        heading: "Privacy Policy",
      },
      intro: {
        body: "This policy describes how Gujarat Nippon International Pvt Ltd collects and uses information when you visit our website or submit an enquiry.",
        heading: "Overview",
      },
      body_1: {
        body: "We collect information to provide better services to our global customers.",
        heading: "1. Information We Collect",
      },
      body_2: {
        body: "Your information is stored securely and used in accordance with GDPR principles.",
        heading: "2. How We Use Information",
      },
    },
    seo: {
      seoTitle: "Privacy Policy — Gujarat Nippon International",
      metaDescription: "Read how Gujarat Nippon International collects, uses and protects personal information submitted through our website and contact forms.",
      ogTitle: "Privacy Policy — Gujarat Nippon International",
      ogDescription: "Read how Gujarat Nippon International collects, uses and protects personal information submitted through our website and contact forms.",
    },
  },
  terms: {
    sections: {
      hero: {
        body: "Last Updated: February 22, 2026",
        heading: "Terms of Service",
      },
      intro: {
        body: "These terms govern use of the Gujarat Nippon International website.",
        heading: "Overview",
      },
      body_1: {
        body: "By accessing our website, you agree to be bound by these terms.",
        heading: "1. Acceptance of Terms",
      },
      body_2: {
        body: "Permission is granted to temporarily download one copy of the materials.",
        heading: "2. Use License",
      },
    },
    seo: {
      seoTitle: "Terms & Conditions — Gujarat Nippon International",
      metaDescription: "Terms and conditions for use of the Gujarat Nippon International website and online materials.",
      ogTitle: "Terms & Conditions — Gujarat Nippon International",
      ogDescription: "Terms and conditions for use of the Gujarat Nippon International website and online materials.",
    },
  },
  cookies: {
    sections: {
      hero: {
        body: "How we use cookies and similar technologies.",
        heading: "Cookie Policy",
      },
      intro: {
        body: "This policy explains cookies used on gujaratnippon.com.",
        heading: "Overview",
      },
      body_1: {
        body: "Cookies are small text files that are placed on your machine to help the site provide a better customer experience.",
        heading: "What Are Cookies?",
      },
      body_2: {
        body: "You may prefer to disable cookies on this site and on others.",
        heading: "Managing Cookies",
      },
    },
    seo: {
      seoTitle: "Cookie Policy — Gujarat Nippon International",
      metaDescription: "Learn how Gujarat Nippon International uses cookies and how you can manage cookie preferences on our website.",
      ogTitle: "Cookie Policy — Gujarat Nippon International",
      ogDescription: "Learn how Gujarat Nippon International uses cookies and how you can manage cookie preferences on our website.",
    },
  },
};

export function getFallbackPage(slug: PageSlug): PublishedPageSnapshot {
  const registry = PAGE_REGISTRY[slug];
  const fallback = FALLBACK_PAGES[slug];
  return {
    slug,
    path: registry.path,
    title: registry.title,
    template: registry.template,
    published_at: new Date(0).toISOString(),
    sections: fallback.sections,
    seo: fallback.seo,
  };
}

export function getFallbackSeo(slug: PageSlug): SeoPayload {
  return FALLBACK_PAGES[slug].seo;
}

export function getFallbackContactInfo(): ContactInfoPayload {
  return { ...GLOBAL_CONTACT };
}

/** All fallback pages for seed script. */
export function getAllFallbackPages(): Record<PageSlug, FallbackPage> {
  return FALLBACK_PAGES;
}
