import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './ProductDetail.module.css';

type ProductPage = {
    slug: string;
    name: string;
    metaTitle: string;
    metaDescription: string;
    highlights: { label: string; value: string }[];
    whatWeSupply: string[];
    whoItsFor: string[];
    whyChoose: string[];
    body: string[];
    ctaLabel: string;
};

const PRODUCTS: ProductPage[] = [
    {
        slug: 'turnkey-plant-engineering',
        name: 'Turnkey Plant & Machineries',
        metaTitle: 'Turnkey',
        metaDescription:
            'End-to-end design, manufacture, and supply of cold rolling mills, hot rolling mills, tube mills, strip galvanizing lines, and PEB structures on a turnkey basis.',
        highlights: [
            { label: 'Delivery model', value: 'End-to-end turnkey supply' },
            { label: 'Best for', value: 'New lines & upgrades' },
            { label: 'Coverage', value: 'India • Africa • GCC' },
            { label: 'Focus', value: 'Commissioning-ready dispatch' },
        ],
        whatWeSupply: [
            'Cold rolling mills (CRM), hot rolling mills (HRM), tube mills, and slitting/coil processing lines',
            'Strip galvanizing lines and supporting utilities',
            'PEB structures and fabrication-aligned project supply',
            'Engineering-led coordination: technical scope, sourcing, manufacturing, dispatch, and documentation',
        ],
        whoItsFor: [
            'Steel and metal processing companies planning new capacity, modernization, or line upgrades',
            'Industrial buyers who need a single partner to reduce vendor fragmentation and execution risk',
            'Global buyers in Africa and GCC markets looking for export-ready supply and documentation discipline',
        ],
        whyChoose: [
            'Execution focus: practical scope control, clear timelines, and procurement aligned to commissioning needs',
            'Engineering-first buying: fitment, performance, and lifecycle value are prioritized over short-term cost',
            'Export-import readiness for cross-border delivery, packaging, and documentation-heavy shipments',
        ],
        body: [
            'Turnkey projects succeed when technical scope, procurement, manufacturing, and dispatch move together. Gujarat Nippon International supports industrial buyers with a structured, engineering-led approach to end-to-end plant machinery supply—so your team spends less time coordinating vendors and more time preparing for installation and ramp-up.',
            'We work with customers who value predictable execution: a clear bill of supply, documented specifications, and disciplined timelines. Whether you are commissioning a new line or modernizing an existing mill, we help translate production targets into an equipment and spares plan that reduces commissioning surprises and protects throughput from day one.',
            'Our turnkey capability is especially relevant where downtime is expensive and schedules are tight. Buyers typically come to us for rolling mill lines, coil processing, galvanizing support, and PEB structures. Beyond supply, we keep procurement aligned with what commissioning teams actually need: correct grades, correct interfaces, and the right supporting components delivered in the right sequence.',
            'If your requirement includes export delivery, we support packaging and documentation discipline so shipments arrive ready for site acceptance. Share your target capacity, layout constraints, power/utility details, and destination—we will respond with a practical supply plan, lead-time expectations, and the next actions needed to move from concept to dispatch.',
        ],
        ctaLabel: 'Talk to our Turnkey specialists',
    },
    {
        slug: 'industrial-spares-consumables',
        name: 'Industrial Spares & Consumables',
        metaTitle: 'Spares',
        metaDescription:
            'Comprehensive supply of electrical, mechanical, hydraulic, and pneumatic spares and consumables for steel plants, manufacturing facilities, and process industries.',
        highlights: [
            { label: 'Category', value: 'Electrical • Mechanical • Hydraulic • Pneumatic' },
            { label: 'Outcome', value: 'Lower downtime risk' },
            { label: 'Ideal for', value: 'MRO & shutdown windows' },
            { label: 'Approach', value: 'Spec discipline & repeatability' },
        ],
        whatWeSupply: [
            'Electrical spares: switches, panels/components, sensors, cables and industrial essentials',
            'Mechanical spares and consumables for routine maintenance and breakdown prevention',
            'Hydraulic and pneumatic components aligned to plant uptime requirements',
            'Spares standardization support for repeat procurement and faster replenishment cycles',
        ],
        whoItsFor: [
            'Maintenance and purchase teams responsible for uptime in steel plants and manufacturing facilities',
            'Factories that want to reduce downtime caused by delayed or mismatched spares',
            'Buyers who need consistent specifications across repeat orders and multiple sites',
        ],
        whyChoose: [
            'Specification discipline: reduce mismatch risk with clear technical alignment and repeatability',
            'Procurement efficiency: consolidate sourcing to cut vendor count and purchasing overhead',
            'Operational impact: better spares availability protects throughput and lowers downtime cost',
        ],
        body: [
            'Spares procurement looks simple until a line stops. The real cost is not the part—it is the downtime, the rework, and the lost dispatch window. Gujarat Nippon International supplies industrial spares and consumables with an uptime-first mindset: right specification, predictable lead times, and repeatable procurement that plant teams can rely on.',
            'We support buyers who need a dependable supply stream of electrical, mechanical, hydraulic, and pneumatic spares for steel plants, manufacturing facilities, and process industries. Instead of one-off buying, we help customers build consistency: standardizing commonly used items, aligning alternates, and reducing the risk of “almost correct” replacements that fail early or do not fit.',
            'Our approach is designed for maintenance reality. Plants operate under pressure: breakdowns happen, shutdown windows are short, and procurement must act fast. We help shorten the cycle from requirement to dispatch by keeping specifications clear, documentation organized, and sourcing coordinated—so teams can restore operations quickly and reduce repeat failures.',
            'If you are managing multiple lines, multiple sites, or export shipments, we can also support packaging and documentation discipline to keep deliveries acceptance-ready. Share your spares list, equipment make/model, criticality ranking, and target timelines. We will respond with availability guidance, recommended standardization options, and a clean RFQ path to move quickly.',
        ],
        ctaLabel: 'Talk to our Spares specialists',
    },
    {
        slug: 'industrial-chemicals-lubricants',
        name: 'Chemicals, Grease & Lubricants',
        metaTitle: 'Chemicals',
        metaDescription:
            'Industrial chemicals, greases, and lubricants supplied for plant maintenance, equipment health, and process reliability across heavy industry.',
        highlights: [
            { label: 'Use case', value: 'Maintenance & reliability' },
            { label: 'Benefit', value: 'Reduced wear & failures' },
            { label: 'Fit for', value: 'Preventive maintenance programs' },
            { label: 'Consistency', value: 'Grades • batches • documentation' },
        ],
        whatWeSupply: [
            'Industrial-grade chemicals for plant operations and maintenance programs',
            'Greases and lubricants selected to protect equipment health and reduce wear',
            'Preventive maintenance supplies to stabilize performance and reduce breakdown frequency',
            'Repeat procurement support: consistent grades, batch discipline, and documentation readiness',
        ],
        whoItsFor: [
            'Steel, automotive, plastics, and process industry plants aiming to improve reliability and reduce wear',
            'Maintenance teams looking to standardize lubricants and reduce premature component failure',
            'Buyers who require consistent grades and documentation for compliance and repeat ordering',
        ],
        whyChoose: [
            'Reliability outcomes: the right chemistry reduces wear, improves consistency, and protects uptime',
            'Consistency and documentation: keep grades and replenishment predictable across repeat cycles',
            'Single-partner convenience: combine maintenance inputs with spares and equipment sourcing when needed',
        ],
        body: [
            'In heavy industry, lubrication and maintenance chemistry are not “consumables”—they are reliability tools. Incorrect selection or inconsistent quality can quietly increase wear, drive overheating, accelerate failure, and create quality drift in output. Gujarat Nippon International supplies industrial chemicals, greases, and lubricants with an operational focus: protect equipment health, stabilize performance, and reduce the frequency and severity of breakdowns.',
            'We work with plants across steel and metal processing, automotive manufacturing, plastics and moulding, and other process industries where uptime matters. Buyers typically approach us to improve maintenance consistency, reduce unplanned stoppages, and simplify procurement by standardizing commonly used products across lines or sites.',
            'Our supply approach supports predictable purchasing. For teams that run preventive maintenance programs, the key is consistency: the same grade, the same documented specification, and replenishment that arrives on time. That is what enables maintenance planners to control outcomes rather than react to failures. When required, we also align packaging and documentation to buyer compliance needs—especially for export-import programs or multi-location orders.',
            'To get started, share your equipment list (bearings, gearboxes, hydraulics, rotating equipment), operating conditions, and current consumption patterns. We will help structure a practical supply plan with options that fit your reliability targets, budget, and lead-time constraints—along with a fast path to quotation and dispatch.',
        ],
        ctaLabel: 'Talk to our Chemicals & Lubricants specialists',
    },
    {
        slug: 'equipment',
        name: 'Capital Equipment',
        metaTitle: 'Capital Equipment',
        metaDescription:
            'Capital equipment sourcing and supply support from Gujarat Nippon International, including export-import coordination for industrial buyers.',
        highlights: [
            { label: 'Scope', value: 'Sourcing + delivery coordination' },
            { label: 'Best for', value: 'Modernization & expansions' },
            { label: 'Exports', value: 'Documentation-ready shipments' },
            { label: 'Goal', value: 'On-time, acceptance-ready supply' },
        ],
        whatWeSupply: [
            'Sourcing and supply of capital equipment aligned to project scope and plant upgrades',
            'Supplier coordination for documentation, packaging, and dispatch readiness',
            'Support for modernization and expansion programs where delivery sequencing matters',
            'Export-import aligned delivery for Africa and GCC markets as required',
        ],
        whoItsFor: [
            'Industrial buyers planning expansion, modernization, or replacement of critical equipment',
            'Procurement teams that need a reliable partner to consolidate sourcing and reduce vendor risk',
            'Global buyers who require export-ready documentation and shipment discipline',
        ],
        whyChoose: [
            'Practical sourcing: align equipment selection to scope, interfaces, and commissioning needs',
            'Vendor coordination: reduce fragmentation and keep documentation and dispatch under control',
            'Global readiness: export-import capability for cross-border programs and compliant shipments',
        ],
        body: [
            'Capital equipment purchasing is high-stakes: long lead times, tight project schedules, and costly delays when documentation or dispatch readiness slips. Gujarat Nippon International supports industrial buyers with capital equipment sourcing and supply coordination that is built for execution. Our goal is simple—help you receive the right equipment, on time, with the documentation and packaging needed for smooth acceptance and installation.',
            'We work with buyers across steel, plastics, automotive, energy, and process industries where upgrades and expansions must be delivered without derailing operations. Buyers typically come to us when they want to reduce vendor fragmentation, clarify technical scope, and keep procurement aligned with real-world installation sequencing.',
            'Our advantage is coordination discipline. In many projects, the biggest risk is not the equipment itself—it is the gap between selection, procurement, fabrication, and dispatch. We help close that gap by keeping specifications aligned, tracking readiness, and ensuring shipments are packaged and documented in a way that supports site acceptance. For export programs, we also support export-import aligned coordination to reduce cross-border friction.',
            'Share your project scope, target capacity, interfaces, destination, and timeline constraints. We will respond with a practical sourcing path and a clear set of next steps to move quickly from RFQ to dispatch.',
        ],
        ctaLabel: 'Talk to our Capital Equipment specialists',
    },
    {
        slug: 'plastic-moulding-systems',
        name: 'Plastic Moulding Systems',
        metaTitle: 'Plastic Moulding Systems',
        metaDescription:
            'Plastic moulding systems and manufacturing support from Gujarat Nippon International for high-volume, quality-sensitive production environments.',
        highlights: [
            { label: 'Focus', value: 'Cycle-time stability' },
            { label: 'Outcome', value: 'Lower scrap & stoppages' },
            { label: 'Fit for', value: 'High-volume moulding lines' },
            { label: 'Support', value: 'Spares + maintenance inputs' },
        ],
        whatWeSupply: [
            'Plastic moulding systems aligned to high-volume manufacturing requirements',
            'Support items, spares, and consumables that protect cycle-time stability and output quality',
            'Maintenance inputs (chemicals, greases, lubricants) to reduce wear and unplanned stops',
            'Procurement coordination for scale-ups and multi-line production environments',
        ],
        whoItsFor: [
            'Manufacturers using injection moulding and plastic processing who prioritize repeatability and uptime',
            'Plants facing scrap, cycle-time drift, or frequent stoppages due to spares and maintenance gaps',
            'Buyers expanding capacity and needing coordinated supply rather than fragmented purchasing',
        ],
        whyChoose: [
            'Production-first approach: protect cycle time, reduce scrap, and keep quality predictable',
            'Faster procurement cycles: clear specifications, repeat ordering discipline, and reliable dispatch',
            'One-point supply: integrate moulding support with spares and maintenance supplies when needed',
        ],
        body: [
            'Plastic moulding operations are won or lost on stability: consistent cycle time, predictable output quality, and minimal downtime. Gujarat Nippon International supports plastics and moulding manufacturers with plastic moulding systems and production-aligned supply programs that help plants run cleaner and more reliably.',
            'Buyers typically reach out to us when they face common high-volume issues—scrap increases, cycle time slowly drifts, or machines stop more often than planned. In most cases, these problems trace back to procurement gaps: delayed spares, mismatched replacements, or inconsistent maintenance inputs. Our role is to help you structure supply so production teams are not forced into reactive buying.',
            'We support moulding environments by combining the right systems with the practical support items that keep them operating. That includes spares and consumables, plus maintenance chemistry and lubrication supplies designed to protect tooling and machine components. For plants running multiple lines or scaling output, we also help consolidate sourcing to reduce vendor noise and improve replenishment predictability.',
            'If you share your product type, target output, operating conditions, and the current pain points (scrap %, cycle time variance, downtime causes), we can shape a practical supply plan and a clear RFQ path. The goal is not just supply—it is operational reliability you can measure.',
        ],
        ctaLabel: 'Talk to our Plastics & Moulding specialists',
    },
    {
        slug: 'logic-plastics',
        name: 'Logic Plastics Manufacturing',
        metaTitle: 'Logic Plastics Manufacturing',
        metaDescription:
            'High-volume plastics manufacturing support from Gujarat Nippon International for consumer goods and industrial buyers, built around repeatability and uptime.',
        highlights: [
            { label: 'Fit for', value: 'FMCG & consumer goods' },
            { label: 'Priority', value: 'Repeatability & uptime' },
            { label: 'Support', value: 'Procurement + production discipline' },
            { label: 'Global', value: 'Export-ready programs' },
        ],
        whatWeSupply: [
            'High-volume manufacturing capability support aligned to consistent quality requirements',
            'Production-aligned spares, consumables, and maintenance inputs for stable operations',
            'Supply coordination for repeat procurement and predictable replenishment cycles',
            'Export-ready support for buyers who ship across geographies',
        ],
        whoItsFor: [
            'Consumer goods and FMCG buyers who require repeatability, batch discipline, and predictable delivery',
            'Manufacturing teams scaling volume and needing procurement to match production speed',
            'Global buyers who require documentation, packaging discipline, and export-import alignment',
        ],
        whyChoose: [
            'Repeatability mindset: consistency across batches, inputs, and procurement cycles',
            'Operational discipline: protect uptime so output stays on target during scale-ups',
            'Buyer readiness: export-import support where documentation and shipment readiness matter',
        ],
        body: [
            'High-volume manufacturing is unforgiving. Small inconsistencies—material inputs, tooling condition, maintenance discipline, or spares availability—quickly show up as scrap, rework, missed dispatches, and customer complaints. Gujarat Nippon International supports high-volume plastics manufacturing requirements through our Logic Plastics manufacturing-aligned supply approach, focused on repeatability, uptime, and predictable delivery.',
            'This offering is designed for buyers and production teams who need consistency at scale. Whether you are producing consumer goods components or plastics products that must meet tight quality tolerances, the core requirement is the same: stable production, controlled variability, and procurement that does not introduce surprises.',
            'We support manufacturing programs by keeping production-aligned inputs reliable—spares, consumables, and maintenance materials that protect machine stability. For many plants, the biggest improvement comes from reducing the “unknowns”: standardizing what is ordered, keeping documentation aligned, and ensuring replenishment cycles stay predictable. That is how teams protect cycle time and avoid disruption during peak demand.',
            'If you are planning a scale-up, onboarding a new product, or stabilizing quality issues, share your target volumes, quality constraints, and current failure patterns (downtime causes, scrap triggers, lead-time gaps). We will propose a practical supply plan and a fast quotation path, and we will guide the next steps to engage specialists and move your RFQ forward.',
        ],
        ctaLabel: 'Talk to our High-Volume Manufacturing specialists',
    },
];

function getProductOrThrow(slug: string): ProductPage {
    const product = PRODUCTS.find((p) => p.slug === slug);
    if (!product) {
        throw new Error(`Unknown product slug: ${slug}`);
    }
    return product;
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const p = PRODUCTS.find((x) => x.slug === slug);
    return {
        title: p?.metaTitle ?? 'Product Details',
        description:
            p?.metaDescription ??
            "Explore Gujarat Nippon's full range — turnkey plant machinery, industrial spares, chemicals, capital equipment, plastic moulding systems, and logistics manufacturing.",
    };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = getProductOrThrow(slug);

    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroBg} />
                <div className={styles.heroOverlay} />
                <div className={styles.heroAccentRing} />
                <div className={styles.heroAccentRing2} />

                <div className={styles.heroContent}>
                    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
                        <Link href="/" className={styles.crumbLink}>Home</Link>
                        <span className={styles.crumbSep}>/</span>
                        <Link href="/products" className={styles.crumbLink}>Products</Link>
                        <span className={styles.crumbSep}>/</span>
                        <span>{product.metaTitle}</span>
                    </nav>

                    <div className={styles.heroLabel}>
                        <span className={styles.labelDot} />
                        Product
                    </div>

                    <h1 className={styles.title}>
                        {product.name} — Gujarat Nippon International
                    </h1>
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
                            <h2 id="supply" className={styles.sectionTitle}>What We Supply</h2>
                            <p className={styles.text}>
                                Gujarat Nippon International supplies and coordinates this product line with an
                                execution-first approach—clear specifications, reliable dispatch discipline, and
                                procurement aligned to how plants actually operate. The focus is to reduce
                                procurement friction while protecting uptime, output quality, and commissioning
                                timelines.
                            </p>
                            <ul className={styles.list}>
                                {product.whatWeSupply.map((x) => (
                                    <li key={x}>{x}</li>
                                ))}
                            </ul>
                        </section>

                        <section className={styles.section}>
                            <h2 id="for" className={styles.sectionTitle}>Who It’s For</h2>
                            <p className={styles.text}>
                                This product line is built for industrial buyers who value predictable outcomes:
                                correct specifications, repeatable procurement, and lead times that do not
                                disrupt operations. If you are expanding capacity, stabilizing maintenance, or
                                consolidating vendors, this is the right starting point.
                            </p>
                            <ul className={styles.list}>
                                {product.whoItsFor.map((x) => (
                                    <li key={x}>{x}</li>
                                ))}
                            </ul>
                        </section>

                        <section className={styles.section}>
                            <h2 id="why" className={styles.sectionTitle}>Why Choose Gujarat Nippon</h2>
                            <p className={styles.text}>
                                Buyers choose us when they want more than a supplier—they want a partner that can
                                keep scope clear, move fast, and stay consistent across repeat orders. We bring
                                cross-category capability (equipment, spares, maintenance inputs) and export-import
                                readiness for global supply programs.
                            </p>
                            <ul className={styles.list}>
                                {product.whyChoose.map((x) => (
                                    <li key={x}>{x}</li>
                                ))}
                            </ul>
                        </section>

                        <section className={styles.section}>
                            <h2 id="overview" className={styles.sectionTitle}>Overview</h2>
                            {product.body.map((para) => (
                                <p key={para} className={styles.text}>
                                    {para}
                                </p>
                            ))}
                        </section>
                    </div>

                    <aside className={styles.sidebar}>
                        <div className={styles.ctaCard}>
                            <div className={styles.sectionNav} aria-label="On this page">
                                <div className={styles.sectionNavTitle}>On this page</div>
                                <a className={styles.sectionNavLink} href="#supply">What we supply</a>
                                <a className={styles.sectionNavLink} href="#for">Who it’s for</a>
                                <a className={styles.sectionNavLink} href="#why">Why choose us</a>
                                <a className={styles.sectionNavLink} href="#overview">Overview</a>
                            </div>

                            <h2 className={styles.ctaTitle}>Request a Quote</h2>
                            <p className={styles.ctaText}>
                                Share your scope (equipment list / spares list), quantities, target timelines, and destination.
                                We’ll respond with lead times, key clarifications, and next steps.
                            </p>
                            <Link href="/contact" className={styles.ctaButton}>
                                {product.ctaLabel} →
                            </Link>

                            <div className={styles.quickLinks}>
                                <div className={styles.ctaText} style={{ marginTop: 0 }}>
                                    Prefer browsing first?
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
