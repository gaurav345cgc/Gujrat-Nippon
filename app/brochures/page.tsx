import type { Metadata } from 'next';
import BrochuresClient from './BrochuresClient';

export const metadata: Metadata = {
    title: { absolute: 'Product Brochures & Catalogues — Gujarat Nippon International' },
    description:
        "Download Gujarat Nippon's product catalogues covering aluminium extrusion, mining equipment, plant refurbishment, industrial spares, MDF solutions and more.",
};

export default function BrochuresPage() {
    return <BrochuresClient />;
}
