import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Product Details',
};

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
    // In a real app, you would fetch data based on params.slug
    return (
        <article>
            <header>
                <h1>Product: {params.slug}</h1>
                <p>Detailed overview of this product line.</p>
            </header>

            <section>
                <h2>Technical Specifications</h2>
                <dl>
                    <dt>Deployment Option</dt>
                    <dd>Cloud, On-Premise, Hybrid</dd>
                    <dt>Support Level</dt>
                    <dd>24/7 Enterprise Tier</dd>
                </dl>
            </section>

            <footer>
                <a href="/contact">Request a Demo</a>
            </footer>
        </article>
    );
}
