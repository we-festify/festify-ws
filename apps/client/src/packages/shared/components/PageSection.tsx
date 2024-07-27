interface PageSectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  header?: React.ReactNode;
}

const PageSection = ({
  children,
  title,
  description,
  header,
}: PageSectionProps) => {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {header && header}
      </div>
      <p className="text-muted-foreground mt-2 leading-6">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
};

export default PageSection;
