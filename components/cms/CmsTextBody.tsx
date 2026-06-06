type Props = {
  body: string;
  className?: string;
};

export default function CmsTextBody({ body, className }: Props) {
  const paragraphs = body.split(/\n\n+/).filter(Boolean);

  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={className}>
          {paragraph}
        </p>
      ))}
    </>
  );
}
