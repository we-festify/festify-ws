import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ServiceLayoutProps {
  children: React.ReactNode;
}

const ServiceLayout = ({ children }: ServiceLayoutProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-4 sticky top-0 z-10 bg-background p-4">
        <button
          onClick={handleBack}
          className="flex gap-2 items-center p-3 pt-0 pb-0 lg:pt-1 rounded-sm text-muted-foreground hover:bg-muted"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
};

export default ServiceLayout;
