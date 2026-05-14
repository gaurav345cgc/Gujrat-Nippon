import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '../Industries.module.css';

type IndustryPage = {
    slug: string;
    name: string;
    whatWeSupply: string[];
    challenges: string[];
    trackRecord: string[];
    relatedProducts: { slug: string; label: string }[];
    seo: {
        title: string;
        description: string;
    };
};

const INDUSTRIES: IndustryPage[] = [
    {
        slug: 'steel-metal-processing',
        name: 'Steel & Metal Processing',
        whatWeSupply: [
            'Turnkey rolling mill lines (cold rolling, hot rolling, tube mills, slitting and coil handling)',
            'Plant spares and consumables (electrical, mechanical, hydraulic and pneumatic)',
            'Process and maintenance chemicals, greases and lubricants',
            'Capital equipment sourcing and project supply coordination for upgrades and expansions',
        ],
        challenges: [
            'Unplanned downtime from hard-to-source spares and inconsistent replacement quality',
            'Throughput and surface-finish variability due to worn components, poor lubrication, or mismatched specifications',
            'Tight project schedules where procurement, fabrication, and dispatch must stay synchronized',
        ],
        trackRecord: [
            'Experience across multi-stage metal processing setups with cross-functional execution (design → supply → commissioning support).',
            'Global buyer readiness with export-import execution capability for Africa and GCC supply lanes.',
            'Repeat procurement patterns: buyers return for spares standardization, reliability, and faster lead times.',
        ],
        relatedProducts: [
            { slug: 'turnkey-plant-engineering', label: 'Turnkey Plant & Machineries' },
            { slug: 'industrial-spares-consumables', label: 'Industrial Spares & Consumables' },
            { slug: 'industrial-chemicals-lubricants', label: 'Chemicals, Grease & Lubricants' },
            { slug: 'equipment', label: 'Capital Equipment' },
        ],
        seo: {
            title: 'Steel & Metal Processing Solutions — Gujarat Nippon International',
            description:
                'Steel & metal processing solutions from Gujarat Nippon International: turnkey rolling mill lines, plant spares, maintenance chemicals, and capital equipment supply for Indian and global buyers.',
        },
    },
    {
        slug: 'automotive',
        name: 'Automotive',
        whatWeSupply: [
            'Production spares and MRO items for plants, utilities, and maintenance teams',
            'Industrial chemicals, greases, and lubricants for equipment health and line reliability',
            'Capital equipment and sourced components for expansion, modernization, and plant support functions',
            'Packaging and logistics-aligned sourcing when parts must ship on a strict production calendar',
        ],
        challenges: [
            'Line stoppages caused by delayed MRO procurement and non-standardized part quality',
            'High rejection and wear from incorrect lubricant selection or inconsistent chemical grades',
            'Short procurement windows where vendors must meet documentation, compliance, and dispatch discipline',
        ],
        trackRecord: [
            'Procurement support designed for repeat orders: consistent specifications, batch discipline, and predictable replenishment.',
            'Export-import capability for multi-country supply programs and documentation-heavy shipments.',
            'Operational focus: minimize downtime, compress lead times, and reduce total procurement overhead.',
        ],
        relatedProducts: [
            { slug: 'industrial-spares-consumables', label: 'Industrial Spares & Consumables' },
            { slug: 'industrial-chemicals-lubricants', label: 'Chemicals, Grease & Lubricants' },
            { slug: 'equipment', label: 'Capital Equipment' },
        ],
        seo: {
            title: 'Automotive Solutions — Gujarat Nippon International',
            description:
                'Automotive industry supply from Gujarat Nippon International: MRO spares, industrial greases and lubricants, and capital equipment sourcing with export-import support from Mumbai.',
        },
    },
    {
        slug: 'plastics-moulding',
        name: 'Plastics & Moulding',
        whatWeSupply: [
            'Plastic moulding systems and injection moulding-aligned supply support',
            'Auxiliaries, spares, and consumables for steady production and reduced scrap',
            'Maintenance chemicals and lubricants for tooling health and machine uptime',
            'Sourcing support for expansion and multi-site rollouts',
        ],
        challenges: [
            'Cycle-time drift, higher scrap, and inconsistent output quality caused by worn parts or poor maintenance inputs',
            'Tooling and machine downtime due to delayed spares procurement and non-matching specifications',
            'Scale-up pressure where production targets increase faster than procurement and maintenance capacity',
        ],
        trackRecord: [
            'Support for high-volume manufacturing setups where uptime and repeatability matter more than one-off procurement.',
            'Buyer-friendly coordination across engineering, sourcing, and dispatch so plants keep running.',
            'Export readiness for global shipments with documentation and packaging discipline.',
        ],
        relatedProducts: [
            { slug: 'plastic-moulding-systems', label: 'Plastic Moulding Systems' },
            { slug: 'industrial-spares-consumables', label: 'Industrial Spares & Consumables' },
            { slug: 'industrial-chemicals-lubricants', label: 'Chemicals, Grease & Lubricants' },
            { slug: 'logic-plastics', label: 'Logic Plastics Manufacturing' },
        ],
        seo: {
            title: 'Plastics & Moulding Solutions — Gujarat Nippon International',
            description:
                'Plastics and injection moulding solutions from Gujarat Nippon International: plastic moulding systems, spares, consumables, and maintenance supplies for Indian and global manufacturers.',
        },
    },
    {
        slug: 'chemical-manufacturing',
        name: 'Chemical Manufacturing',
        whatWeSupply: [
            'Industrial-grade chemicals and lubrication products aligned to plant operations',
            'Maintenance spares for utilities, pumps, hydraulics, pneumatics, and electrical systems',
            'Capital equipment sourcing support for upgrades, modernization, and capacity additions',
            'Export-import coordination for compliant documentation and shipment readiness',
        ],
        challenges: [
            'Compliance and consistency issues when chemical grades or documentation do not match buyer standards',
            'Unplanned stoppages from failures in pumps, valves, electrical components, and plant utilities',
            'Vendor fragmentation that increases risk, lead times, and procurement workload',
        ],
        trackRecord: [
            'Reliability-led supply: consistent inputs, predictable replenishment, and quality discipline.',
            'Global delivery capability for Africa/GCC lanes and documentation-driven buying processes.',
            'One-stop approach to reduce vendor count while keeping technical requirements intact.',
        ],
        relatedProducts: [
            { slug: 'industrial-chemicals-lubricants', label: 'Chemicals, Grease & Lubricants' },
            { slug: 'industrial-spares-consumables', label: 'Industrial Spares & Consumables' },
            { slug: 'equipment', label: 'Capital Equipment' },
        ],
        seo: {
            title: 'Chemical Manufacturing Solutions — Gujarat Nippon International',
            description:
                'Chemical manufacturing supply from Gujarat Nippon International: industrial chemicals, plant spares, and capital equipment sourcing with export-import support for global buyers.',
        },
    },
    {
        slug: 'global-logistics',
        name: 'Global Logistics',
        whatWeSupply: [
            'Export-oriented sourcing of machinery, spares, and capital equipment',
            'Packaging and dispatch coordination for heavy and sensitive industrial goods',
            'Documentation support aligned to export-import requirements and buyer compliance',
            'Supplier consolidation so buyers can ship mixed loads efficiently',
        ],
        challenges: [
            'Missed sailing/air timelines due to fragmented procurement and inconsistent readiness',
            'Damage risk from inadequate packaging and handling for capital equipment shipments',
            'Complex documentation and compliance requirements for cross-border trade',
        ],
        trackRecord: [
            'Structured export-import execution built for repeat shipments and multi-destination programs.',
            'Coordination across suppliers so mixed procurement can move as a single on-time dispatch.',
            'Experience supporting Africa and GCC trade lanes for industrial buyers.',
        ],
        relatedProducts: [
            { slug: 'equipment', label: 'Capital Equipment' },
            { slug: 'turnkey-plant-engineering', label: 'Turnkey Plant & Machineries' },
            { slug: 'industrial-spares-consumables', label: 'Industrial Spares & Consumables' },
        ],
        seo: {
            title: 'Global Logistics Solutions — Gujarat Nippon International',
            description:
                'Global logistics-aligned industrial sourcing from Gujarat Nippon International: export-ready machinery, spares and capital equipment with packaging and documentation support for Africa and GCC.',
        },
    },
    {
        slug: 'energy-power',
        name: 'Energy & Power',
        whatWeSupply: [
            'Electrical and hydraulic spares for reliable power infrastructure operations',
            'Maintenance chemicals and lubrication supplies for rotating equipment and utilities',
            'Capital equipment sourcing for upgrades, refurbishment and plant reliability programs',
            'Procurement coordination for multi-site operations with tight uptime requirements',
        ],
        challenges: [
            'High cost of downtime where spares lead time directly impacts supply continuity',
            'Component failures driven by harsh operating conditions and inconsistent maintenance inputs',
            'Procurement complexity across multiple plants or sites with differing specifications',
        ],
        trackRecord: [
            'Support patterns built around uptime: standardize spares, improve replenishment speed, reduce procurement noise.',
            'Export-import capability for overseas buyers and projects in Africa and GCC regions.',
            'Engineering-first sourcing that prioritizes fit, performance, and lifecycle value.',
        ],
        relatedProducts: [
            { slug: 'industrial-spares-consumables', label: 'Industrial Spares & Consumables' },
            { slug: 'industrial-chemicals-lubricants', label: 'Chemicals, Grease & Lubricants' },
            { slug: 'equipment', label: 'Capital Equipment' },
        ],
        seo: {
            title: 'Energy & Power Solutions — Gujarat Nippon International',
            description:
                'Energy and power industry supply from Gujarat Nippon International: electrical, hydraulic and pneumatic spares, maintenance chemicals, and capital equipment sourcing for reliable uptime.',
        },
    },
    {
        slug: 'construction-materials',
        name: 'Construction Materials',
        whatWeSupply: [
            'Sourced equipment and plant support items for construction materials manufacturing',
            'Structural and heavy-duty spares for maintenance and process reliability',
            'Pneumatic, hydraulic and electrical consumables aligned to plant operations',
            'Project-oriented supply coordination for expansions and modernization',
        ],
        challenges: [
            'Wear-heavy environments that accelerate failure of spares and consumables',
            'Schedule pressure where delayed parts can stall production and dispatch commitments',
            'Quality mismatch risks when specifications are not controlled end-to-end',
        ],
        trackRecord: [
            'Procurement discipline focused on durability, fitment accuracy, and repeatability.',
            'Supply capability for domestic and export-driven programs with documentation readiness.',
            'One-stop sourcing to reduce vendor fragmentation in maintenance-heavy plants.',
        ],
        relatedProducts: [
            { slug: 'industrial-spares-consumables', label: 'Industrial Spares & Consumables' },
            { slug: 'equipment', label: 'Capital Equipment' },
            { slug: 'industrial-chemicals-lubricants', label: 'Chemicals, Grease & Lubricants' },
        ],
        seo: {
            title: 'Construction Materials Solutions — Gujarat Nippon International',
            description:
                'Construction materials industry supply from Gujarat Nippon International: heavy-duty plant spares, pneumatics/hydraulics, maintenance chemicals and capital equipment sourcing for reliable production.',
        },
    },
    {
        slug: 'consumer-goods',
        name: 'Consumer Goods',
        whatWeSupply: [
            'Production-aligned spares, consumables, and maintenance supplies for high-volume lines',
            'Plastic moulding-related systems and support items for FMCG manufacturing',
            'Industrial chemicals, greases, and lubricants to keep machines stable and predictable',
            'Sourcing support for scaling production and multi-location rollouts',
        ],
        challenges: [
            'Output consistency issues when spares, tooling inputs, or maintenance materials vary by batch',
            'Uptime pressure where small failures can cascade into large production losses',
            'Scaling challenges when procurement must keep pace with rapidly increasing volumes',
        ],
        trackRecord: [
            'Experience supporting high-volume production environments where repeatability and lead time matter most.',
            'Export-import capability for international buyers and programs that require compliance-ready documentation.',
            'Vendor consolidation approach to reduce procurement complexity for plant teams.',
        ],
        relatedProducts: [
            { slug: 'logic-plastics', label: 'Logic Plastics Manufacturing' },
            { slug: 'plastic-moulding-systems', label: 'Plastic Moulding Systems' },
            { slug: 'industrial-spares-consumables', label: 'Industrial Spares & Consumables' },
            { slug: 'industrial-chemicals-lubricants', label: 'Chemicals, Grease & Lubricants' },
        ],
        seo: {
            title: 'Consumer Goods Solutions — Gujarat Nippon International',
            description:
                'Consumer goods and FMCG manufacturing support from Gujarat Nippon International: moulding systems, production spares, and maintenance chemicals to protect uptime and output consistency.',
        },
    },
];

export function generateStaticParams() {
    return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const industry = INDUSTRIES.find((i) => i.slug === slug);
    return {
        title: industry?.seo.title ?? 'Industry Solutions — Gujarat Nippon International',
        description: industry?.seo.description,
    };
}

function getIndustryOrThrow(slug: string): IndustryPage {
    const industry = INDUSTRIES.find((i) => i.slug === slug);
    if (!industry) throw new Error(`Unknown industry slug: ${slug}`);
    return industry;
}

export default async function IndustryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const industry = getIndustryOrThrow(slug);

    return (
        <main className={styles.pageWrapper}>
            <div className={styles.container}>
                <h1 className={styles.pageTitle}>
                    {industry.name} Solutions — Gujarat Nippon International
                </h1>

                <section>
                    <h2>What We Supply to This Industry</h2>
                    <ul>
                        {industry.whatWeSupply.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2>Key Challenges We Solve</h2>
                    <ul>
                        {industry.challenges.map((c) => (
                            <li key={c}>{c}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2>Our Track Record in This Industry</h2>
                    <ul>
                        {industry.trackRecord.map((t) => (
                            <li key={t}>{t}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2>Related Products</h2>
                    <ul>
                        {industry.relatedProducts.map((p) => (
                            <li key={p.slug}>
                                <Link href={`/products/${p.slug}`}>{p.label}</Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2>Talk to Our {industry.name} Specialists</h2>
                    <Link href="/contact" className={styles.learnMore}>
                        Talk to Our {industry.name} Specialists
                    </Link>
                </section>
            </div>
        </main>
    );
}

