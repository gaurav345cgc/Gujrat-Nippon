import type { Metadata } from 'next';
import BrochuresClient from './BrochuresClient';

export const metadata: Metadata = {
    title: 'Brochures',
    description:
        "Download Gujarat Nippon's full product catalogues — aluminium extrusion, mining equipment, plant refurbishment, industrial spares, MDF solutions, and more.",
};

export default function BrochuresPage() {
    return <BrochuresClient />;
}
