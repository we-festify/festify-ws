import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmailTemplate {
  _id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

interface EmailTemplatesSidebarProps {
  selectedTemplate: EmailTemplate | null;
  templates: EmailTemplate[];
  onSelectTemplate: (template: EmailTemplate | null) => void;
}

const EmailTemplatesSidebar = ({
  selectedTemplate,
  templates,
  onSelectTemplate,
}: EmailTemplatesSidebarProps) => {
  return (
    <div className="flex flex-col space-y-1 w-52">
      <div
        className={cn(
          buttonVariants({ variant: "ghost" }),
          !selectedTemplate ? "bg-muted hover:bg-muted" : "hover:bg-muted/70",
          "justify-start cursor-pointer"
        )}
        onClick={() => onSelectTemplate(null)}
      >
        New Template
      </div>
      {templates.map((item) => (
        <div
          key={item._id}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            selectedTemplate?._id === item._id
              ? "bg-muted hover:bg-muted"
              : "hover:bg-muted/70",
            "justify-start cursor-pointer text-ellipses"
          )}
          onClick={() => onSelectTemplate(item)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default EmailTemplatesSidebar;
