interface FormSectionProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const FormSection = ({ title, description, children }: FormSectionProps) => {
  return (
    <div>
      <div className="flex flex-col">
        <h2 className="text-lg font-medium">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children && <div className="space-y-4 py-8">{children}</div>}
    </div>
  );
};

export default FormSection;
