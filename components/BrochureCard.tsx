import { Brochure } from "../lib/types";

interface BrochureCardProps {
    brochure: Brochure;
}

export default function BrochureCard({ brochure }: BrochureCardProps) {
    // Format bytes to megabytes
    const fileSizeInMB = (brochure.fileSize / (1024 * 1024)).toFixed(2);

    // Format date natively
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
    }).format(brochure.lastUpdated);

    return (
        <article id={`brochure-${brochure.id}`}>
            <header>
                <h3>{brochure.title}</h3>
                <p>{brochure.description}</p>
            </header>

            <section>
                <dl>
                    <dt>File Size</dt>
                    <dd>{fileSizeInMB} MB</dd>

                    <dt>Last Updated</dt>
                    <dd>
                        <time dateTime={brochure.lastUpdated.toISOString()}>
                            {formattedDate}
                        </time>
                    </dd>
                </dl>
            </section>

            <footer>
                <a href={brochure.downloadUrl} download>
                    Download Brochure
                </a>
                <p>Downloaded {brochure.downloadCount} times</p>
            </footer>
        </article>
    );
}
