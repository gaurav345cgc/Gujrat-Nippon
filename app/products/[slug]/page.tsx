import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './ProductDetail.module.css';

type ProductPage = {
    slug: string;
    name: string;
    pageTitleAbsolute: string;
    breadcrumbLabel: string;
    h1: string;
    metaDescription: string;
    supplyHeading: string;
    industriesHeading: string;
    whyHeading: string;
    overviewHeading: string;
    supplyIntro: string;
    industriesIntro: string;
    whyIntro: string;
    highlights: { label: string; value: string }[];
    whatWeSupply: string[];
    whoItsFor: string[];
    whyChoose: string[];
    body: string[];
    ctaLabel: string;
};

const RELATED: Record<string, { href: string; anchor: string }[]> = {
    'turnkey-plant-engineering': [
        { href: '/industries/steel-metal-processing', anchor: 'steel and metal processing industry' },
        { href: '/brochures', anchor: 'download our turnkey plant brochure' },
    ],
    'industrial-spares-consumables': [
        { href: '/brochures', anchor: 'industrial spares and components catalogue' },
        { href: '/industries', anchor: 'industries we supply spares to' },
    ],
    'industrial-chemicals-lubricants': [
        { href: '/products/turnkey-plant-engineering', anchor: 'rolling mills and metal processing plants' },
        { href: '/brochures', anchor: 'technical catalogues for greases and rolling oils' },
    ],
    'capital-equipment': [
        { href: '/contact', anchor: 'contact us for a capital equipment quote' },
        { href: '/brochures', anchor: 'capital equipment and machinery catalogues' },
    ],
    'plastic-moulding-systems': [
        { href: '/industries/plastics-moulding', anchor: 'plastics and moulding industry solutions' },
        { href: '/contact', anchor: 'send us your project requirement' },
    ],
    'logic-plastics-manufacturing': [
        { href: '/brochures', anchor: 'download our product catalogues' },
        { href: '/industries/consumer-goods', anchor: 'consumer goods manufacturing supply' },
    ],
};

const PRODUCTS: ProductPage[] = [
    {
        slug: 'turnkey-plant-engineering',
        name: 'Turnkey Plant & Machineries',
        pageTitleAbsolute: 'Turnkey Plant — Cold Rolling, Tube Mills | Gujarat Nippon',
        breadcrumbLabel: 'Turnkey plant engineering',
        h1: 'Turnkey Plant Engineering — Cold Rolling Mills, Tube Mills & Industrial Plants',
        metaDescription:
            'We undertake end-to-end design, manufacture and supply of cold rolling mills, hot rolling mills, tube mills, strip galvanizing lines and PEB structures on a complete turnkey basis.',
        supplyHeading: 'What We Supply — Our Turnkey Plant & Machineries Range',
        industriesHeading: 'Industries We Cater To',
        whyHeading: 'Why Choose Gujarat Nippon for Turnkey Plant Engineering',
        overviewHeading: 'Cold rolling mill supplier India — scope and delivery',
        supplyIntro:
            'We undertake design, manufacture and supply of plant and machineries for metal processing industries on a turnkey basis where the contract requires it, including revamping and modernization of existing lines.',
        industriesIntro:
            'This range is suited to steel and metal processing plants, coil and tube producers, and buyers in India, Africa and the GCC planning new capacity or line upgrades.',
        whyIntro:
            'Customers appoint us for agreed specifications, timely execution, transparent dealings and documentation suited to domestic programmes and export dispatch.',
        highlights: [
            { label: 'Delivery model', value: 'Turnkey supply' },
            { label: 'Best for', value: 'New lines & upgrades' },
            { label: 'Coverage', value: 'India • Africa • GCC' },
            { label: 'Focus', value: 'Agreed quality standards' },
        ],
        whatWeSupply: [
            'Cold rolling mills (CRM), hot rolling mills (HRM) and tube mills',
            'Slitting, cut-to-length, strip galvanising and colour coating lines',
            'Heat treatment furnaces, deep drawing presses and PEB structures',
            'Project coordination: scope, sourcing, manufacture, dispatch and documentation',
        ],
        whoItsFor: [
            'Steel and metal processing companies — new lines, upgrades or revamping',
            'Buyers seeking one partner for plant machinery rather than fragmented vendors',
            'Export programmes requiring packing and documentation discipline',
        ],
        whyChoose: [
            '18+ years of execution across industrial projects; 510+ industry projects completed',
            'Engineering-led supply aligned to customer drawings and quality standards',
            'Export-import capability with after sales support per contract scope',
        ],
        body: [
            'As a cold rolling mill supplier India metal processors use for coordinated line supply, Gujarat Nippon International Pvt Ltd undertakes turnkey design, manufacture and supply with emphasis on a clear bill of supply and disciplined timelines.',
            'Share target capacity, layout constraints and destination with our Mumbai office. We will respond with scope clarification, lead-time guidance and next steps for quotation and dispatch.',
        ],
        ctaLabel: 'Contact us for turnkey requirements',
    },
    {
        slug: 'industrial-spares-consumables',
        name: 'Industrial Spares & Consumables',
        pageTitleAbsolute: 'Industrial Spares — Electrical, Hydraulic | Gujarat Nippon',
        breadcrumbLabel: 'Industrial spares',
        h1: 'Industrial Spares & Consumables Supply — Electrical, Mechanical, Hydraulic & Pneumatic',
        metaDescription:
            'We supply electrical, mechanical, hydraulic and pneumatic spares and consumables to steel plants, automotive facilities and process industries across India and export markets.',
        supplyHeading: 'What We Supply — Our Industrial Spares & Consumables Range',
        industriesHeading: 'Industries We Cater To',
        whyHeading: 'Why Choose Gujarat Nippon for Industrial Spares',
        overviewHeading: 'Industrial spares supplier Mumbai — repeat orders and uptime',
        supplyIntro:
            'We supply mechanical, electrical, hydraulic and pneumatic spares and consumables as per customer specifications, with focus on correct grades and timely delivery for maintenance and production teams.',
        industriesIntro:
            'We cater to steel plants, automotive facilities, plastics and moulding lines, chemical and process plants, and other manufacturing sites in domestic and export markets.',
        whyIntro:
            'We help consolidate spares sourcing under one roof, with competitive pricing where the enquiry permits and dependable documentation on repeat orders.',
        highlights: [
            { label: 'Category', value: 'Electrical • Mechanical • Hydraulic • Pneumatic' },
            { label: 'Ideal for', value: 'MRO & shutdowns' },
            { label: 'Approach', value: 'Spec as per drawing' },
            { label: 'Support', value: 'Repeat procurement' },
        ],
        whatWeSupply: [
            'Electrical spares: switches, sensors, cables, panels and industrial essentials',
            'Mechanical spares and consumables for routine maintenance',
            'Hydraulic and pneumatic components for plant uptime',
            'Standardisation support for commonly used items across sites',
        ],
        whoItsFor: [
            'Maintenance and purchase teams in steel and manufacturing plants',
            'Plants reducing downtime from delayed or mismatched spares',
            'Multi-site buyers needing consistent specifications on repeat orders',
        ],
        whyChoose: [
            'Specification discipline on make, model and criticality',
            'Strategic alliances with manufacturers for reliable supply',
            'Packing and documentation suited to export shipments where required',
        ],
        body: [
            'Industrial spares supplier Mumbai teams contact when they need dependable replenishment for electrical, mechanical, hydraulic and pneumatic requirements across steel plants and process industries.',
            'Send your spares list, equipment details and target dates. We will confirm availability, lead times and quotation steps.',
        ],
        ctaLabel: 'Contact us for spares enquiries',
    },
    {
        slug: 'industrial-chemicals-lubricants',
        name: 'Chemicals, Grease & Lubricants',
        pageTitleAbsolute: 'Industrial Chemicals & Lubricants — Gujarat Nippon',
        breadcrumbLabel: 'Chemicals & lubricants',
        h1: 'Industrial Chemicals, Greases & Lubricants Supply',
        metaDescription:
            'Supply of industrial chemicals, rolling oils, greases, lubricants and rust preventives for steel rolling mills, automotive plants and manufacturing facilities.',
        supplyHeading: 'What We Supply — Our Chemicals, Greases & Lubricants Range',
        industriesHeading: 'Industries We Cater To',
        whyHeading: 'Why Choose Gujarat Nippon for Industrial Chemicals & Lubricants',
        overviewHeading: 'Industrial chemicals lubricants supplier India — grades and batches',
        supplyIntro:
            'We offer greases, lubricants and industrial chemicals for plant maintenance and production processes, supplied as per grade and batch requirements with consistent documentation.',
        industriesIntro:
            'We supply steel rolling mills, automotive plants, plastics and moulding facilities, and other process industries where equipment health and repeat procurement matter.',
        whyIntro:
            'Maintenance teams benefit from predictable grades, transparent dealings and the option to combine chemical supply with spares and equipment from the same office.',
        highlights: [
            { label: 'Products', value: 'Oils • greases • chemicals' },
            { label: 'Use', value: 'Maintenance & process' },
            { label: 'Supply', value: 'Per specification' },
            { label: 'Markets', value: 'India & export' },
        ],
        whatWeSupply: [
            'Rolling oils, greases and lubricants for metal processing and general plant use',
            'Rust preventives and industrial chemicals for maintenance programmes',
            'Grades supplied as per customer specification and consumption pattern',
            'Repeat orders with batch discipline and documentation for audit needs',
        ],
        whoItsFor: [
            'Steel rolling mills and metal processing plants',
            'Automotive and general manufacturing maintenance teams',
            'Buyers standardising lubricants across lines or multiple sites',
        ],
        whyChoose: [
            'Consistent grades and reliable products for preventive maintenance',
            'Competitive pricing where the enquiry permits',
            'Combined supply with spares and plant equipment when scope allows',
        ],
        body: [
            'Industrial chemicals lubricants supplier India programmes from Gujarat Nippon International cover rolling oils, greases, rust preventives and related grades for steel, automotive and process plants.',
            'Share equipment types, operating conditions and monthly consumption. We will advise suitable grades and quotation lead times.',
        ],
        ctaLabel: 'Contact us for chemicals and lubricants',
    },
    {
        slug: 'capital-equipment',
        name: 'Capital Equipment',
        pageTitleAbsolute: 'Capital Equipment — Cranes, Generators | Gujarat Nippon',
        breadcrumbLabel: 'Capital equipment',
        h1: 'Capital Equipment Supply — EOT Cranes, Generators & Refractory Materials',
        metaDescription:
            'Authorized supply of EOT cranes, industrial generators, gearboxes, refractory materials and packaging machinery from trusted international manufacturers including Zhuoshen and Maker.',
        supplyHeading: 'What We Supply — Our Capital Equipment Range',
        industriesHeading: 'Industries We Cater To',
        whyHeading: 'Why Choose Gujarat Nippon for Capital Equipment',
        overviewHeading: 'Capital equipment supplier India — sourcing and dispatch',
        supplyIntro:
            'We procure and supply capital equipment through established manufacturer associations, with technical clarification, documentation and dispatch planning aligned to project scope.',
        industriesIntro:
            'We support steel, plastics, automotive, energy, construction materials and process industries planning expansion, modernization or replacement of critical plant equipment.',
        whyIntro:
            'Buyers use our office to reduce vendor fragmentation and keep specifications, packing lists and export paperwork coordinated through one point of contact.',
        highlights: [
            { label: 'Scope', value: 'Sourced equipment' },
            { label: 'Partners', value: 'Zhuoshen • Maker & others' },
            { label: 'Best for', value: 'Expansion & upgrades' },
            { label: 'Exports', value: 'Africa • GCC' },
        ],
        whatWeSupply: [
            'EOT cranes and gantry cranes to agreed technical standards',
            'Industrial generators, gearboxes and packaging machinery',
            'Refractory materials for high-temperature plant applications',
            'Documentation, packing and export-import coordination as required',
        ],
        whoItsFor: [
            'Project teams sourcing cranes, generators or packaged machinery',
            'Plants modernizing utilities, material handling or production lines',
            'Export buyers needing compliant documentation and dispatch discipline',
        ],
        whyChoose: [
            'Authorized supply through reputed international manufacturers',
            'Technical alignment to scope, interfaces and site requirements',
            '210+ export-import deals; experience across domestic and global programmes',
        ],
        body: [
            'Capital equipment supplier India enquiries often cover EOT cranes, generators, gearboxes, refractory and packaging machinery with long lead times and strict acceptance criteria. We coordinate sourcing and delivery accordingly.',
            'Contact us with project scope, technical data and destination for quotation and lead-time guidance.',
        ],
        ctaLabel: 'Contact us for capital equipment',
    },
    {
        slug: 'plastic-moulding-systems',
        name: 'Plastic Moulding Systems',
        pageTitleAbsolute: 'Plastic Moulding — Injection Machines | Gujarat Nippon',
        breadcrumbLabel: 'Plastic moulding systems',
        h1: 'Plastic Moulding Systems — Injection Moulding Machines',
        metaDescription:
            'Plastic moulding systems and manufacturing support from Gujarat Nippon International for high-volume, quality-sensitive production environments.',
        supplyHeading: 'What We Supply — Our Plastic Moulding Systems Range',
        industriesHeading: 'Industries We Cater To',
        whyHeading: 'Why Choose Gujarat Nippon for Plastic Moulding Systems',
        overviewHeading: 'Injection moulding machine supplier India — lines and support',
        supplyIntro:
            'We supply plastic moulding systems and production-aligned spares, consumables and maintenance inputs for injection moulding and processing lines.',
        industriesIntro:
            'We cater to plastics and moulding manufacturers, consumer goods producers and plants scaling capacity or stabilising high-volume output.',
        whyIntro:
            'We coordinate moulding equipment with greases, lubricants and spares where required, so procurement stays under one roof for repeat programmes.',
        highlights: [
            { label: 'Focus', value: 'Injection moulding' },
            { label: 'Support', value: 'Spares & consumables' },
            { label: 'Supply', value: 'Per specification' },
            { label: 'Markets', value: 'Domestic & export' },
        ],
        whatWeSupply: [
            'Injection moulding systems and related plant equipment',
            'Spares and consumables for production and maintenance',
            'Greases, lubricants and chemicals for tooling and machine care',
            'Procurement coordination for multi-line or expansion projects',
        ],
        whoItsFor: [
            'Injection moulding and plastics processing plants',
            'High-volume lines needing dependable spares replenishment',
            'Buyers consolidating moulding supply with maintenance inputs',
        ],
        whyChoose: [
            'Production-oriented supply with clear specifications',
            'Repeat order discipline and timely dispatch',
            'After sales support aligned to the nature of supply',
        ],
        body: [
            'Injection moulding machine supplier India customers approach us for equipment, spares and maintenance supplies that protect cycle time and output quality on busy moulding lines.',
            'Share product type, machine details and current requirements. We will respond with scope options and quotation steps.',
        ],
        ctaLabel: 'Contact us for moulding systems',
    },
    {
        slug: 'logic-plastics-manufacturing',
        name: 'Logic Plastics Manufacturing',
        pageTitleAbsolute: 'Logic Plastics Manufacturing — Gujarat Nippon',
        breadcrumbLabel: 'Logic Plastics manufacturing',
        h1: 'Logic Plastics Manufacturing — High-Volume Production Programmes',
        metaDescription:
            'High-volume plastics manufacturing support from Gujarat Nippon International for consumer goods and industrial buyers, built around repeatability and uptime.',
        supplyHeading: 'What We Supply — Our Logic Plastics Manufacturing Range',
        industriesHeading: 'Industries We Cater To',
        whyHeading: 'Why Choose Gujarat Nippon for Logic Plastics Manufacturing',
        overviewHeading: 'High-volume plastics manufacturing — supply coordination',
        supplyIntro:
            'We support Logic Plastics manufacturing programmes with production-aligned spares, consumables and maintenance materials for steady output and repeat procurement.',
        industriesIntro:
            'We cater to consumer goods and FMCG manufacturing, high-volume plastics lines and buyers requiring batch discipline and predictable replenishment.',
        whyIntro:
            'Our office coordinates supply with documentation and packing suited to domestic schedules and export programmes where customers ship across regions.',
        highlights: [
            { label: 'Fit for', value: 'High-volume FMCG' },
            { label: 'Priority', value: 'Repeatability' },
            { label: 'Supply', value: 'Spares & consumables' },
            { label: 'Support', value: 'Export-ready docs' },
        ],
        whatWeSupply: [
            'Production-aligned spares and consumables for moulding lines',
            'Maintenance chemicals and lubricants for machine stability',
            'Repeat procurement with consistent specifications',
            'Export-import documentation and dispatch coordination',
        ],
        whoItsFor: [
            'Consumer goods and FMCG plastics manufacturers',
            'Plants scaling volume or onboarding new products',
            'Buyers needing dependable inputs during peak production',
        ],
        whyChoose: [
            'Focus on consistent grades, batches and replenishment cycles',
            'Transparent dealings and competitive pricing where permitted',
            'Single contact for spares, chemicals and related plant supply',
        ],
        body: [
            'Gujarat Nippon International supports high-volume plastics manufacturing customers with Logic Plastics-aligned supply: spares, consumables and maintenance inputs that help protect uptime and output consistency.',
            'Share target volumes, quality constraints and lead-time requirements. We will propose a practical supply plan and quotation path.',
        ],
        ctaLabel: 'Contact us for manufacturing supply',
    },
];

function getProductOrThrow(slug: string): ProductPage {
    const product = PRODUCTS.find((p) => p.slug === slug);
    if (!product) {
        throw new Error(`Unknown product slug: ${slug}`);
    }
    return product;
}

export function generateStaticParams() {
    return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const p = PRODUCTS.find((x) => x.slug === slug);
    return {
        title: p ? { absolute: p.pageTitleAbsolute } : { absolute: 'Product | Gujarat Nippon' },
        description:
            p?.metaDescription ??
            "Gujarat Nippon International offers turnkey plant machineries, industrial spares, chemicals, capital equipment and plastic moulding systems for industrial processing requirements.",
    };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = getProductOrThrow(slug);
    const related = RELATED[product.slug] ?? [];

    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroBg} />
                <div className={styles.heroOverlay} />
                <div className={styles.heroAccentRing} />
                <div className={styles.heroAccentRing2} />

                <div className={styles.heroContent}>
                    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
                        <Link href="/" className={styles.crumbLink}>
                            Home
                        </Link>
                        <span className={styles.crumbSep}>/</span>
                        <Link href="/products" className={styles.crumbLink}>
                            Products
                        </Link>
                        <span className={styles.crumbSep}>/</span>
                        <span>{product.breadcrumbLabel}</span>
                    </nav>

                    <div className={styles.heroLabel}>
                        <span className={styles.labelDot} />
                        Product
                    </div>

                    <h1 className={styles.title}>{product.h1}</h1>
                    <p className={styles.subtitle}>{product.metaDescription}</p>
                </div>

                <div className={styles.heroShapeBar}>
                    <div className={styles.heroShapeTeal} />
                    <div className={styles.heroShapeWhite} />
                </div>
            </section>

            <div className={styles.container}>
                <div className={styles.layout}>
                    <div>
                        <section className={styles.highlights}>
                            {product.highlights.map((h) => (
                                <div key={`${h.label}-${h.value}`} className={styles.highlightCard}>
                                    <div className={styles.highlightLabel}>{h.label}</div>
                                    <div className={styles.highlightValue}>{h.value}</div>
                                </div>
                            ))}
                        </section>

                        <section className={styles.section}>
                            <h2 id="supply" className={styles.sectionTitle}>
                                {product.supplyHeading}
                            </h2>
                            <p className={styles.text}>{product.supplyIntro}</p>
                            <ul className={styles.list}>
                                {product.whatWeSupply.map((x) => (
                                    <li key={x}>{x}</li>
                                ))}
                            </ul>
                        </section>

                        <section className={styles.section}>
                            <h2 id="for" className={styles.sectionTitle}>
                                {product.industriesHeading}
                            </h2>
                            <p className={styles.text}>{product.industriesIntro}</p>
                            <ul className={styles.list}>
                                {product.whoItsFor.map((x) => (
                                    <li key={x}>{x}</li>
                                ))}
                            </ul>
                        </section>

                        <section className={styles.section}>
                            <h2 id="why" className={styles.sectionTitle}>
                                {product.whyHeading}
                            </h2>
                            <p className={styles.text}>{product.whyIntro}</p>
                            <ul className={styles.list}>
                                {product.whyChoose.map((x) => (
                                    <li key={x}>{x}</li>
                                ))}
                            </ul>
                        </section>

                        <section className={styles.section}>
                            <h2 id="overview" className={styles.sectionTitle}>
                                {product.overviewHeading}
                            </h2>
                            {product.body.map((para) => (
                                <p key={para} className={styles.text}>
                                    {para}
                                </p>
                            ))}
                        </section>

                        <section className={styles.section} aria-label="Related pages">
                            <h2 id="related" className={styles.sectionTitle}>
                                Related pages
                            </h2>
                            <p className={styles.text}>
                                {related.map((l, i) => (
                                    <span key={l.href}>
                                        {i > 0 ? ' · ' : null}
                                        <Link href={l.href}>{l.anchor}</Link>
                                    </span>
                                ))}
                                {related.length > 0 ? ' · ' : null}
                                <Link href="/contact">send us your project requirement</Link>
                            </p>
                        </section>
                    </div>

                    <aside className={styles.sidebar}>
                        <div className={styles.ctaCard}>
                            <div className={styles.sectionNav} aria-label="On this page">
                                <div className={styles.sectionNavTitle}>On this page</div>
                                <a className={styles.sectionNavLink} href="#supply">
                                    What we supply
                                </a>
                                <a className={styles.sectionNavLink} href="#for">
                                    Industries we cater to
                                </a>
                                <a className={styles.sectionNavLink} href="#why">
                                    Why choose Gujarat Nippon
                                </a>
                                <a className={styles.sectionNavLink} href="#overview">
                                    Overview
                                </a>
                                <a className={styles.sectionNavLink} href="#related">
                                    Related pages
                                </a>
                            </div>

                            <h2 className={styles.ctaTitle}>Request a quotation</h2>
                            <p className={styles.ctaText}>
                                Share scope, quantities, target timelines and destination. We will respond with lead
                                times and next steps.
                            </p>
                            <Link href="/contact" className={styles.ctaButton}>
                                {product.ctaLabel} →
                            </Link>

                            <div className={styles.quickLinks}>
                                <div className={styles.ctaText} style={{ marginTop: 0 }}>
                                    Further reading
                                </div>
                                <Link href="/industries" className={styles.quickLink}>
                                    Explore industries →
                                </Link>
                                <br />
                                <Link href="/brochures" className={styles.quickLink}>
                                    Download brochures →
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
