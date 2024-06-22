import { Button } from '../../../components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
      <div className="md:hidden lg:flex items-center gap-4 sticky top-0 z-10 bg-background px-4">
        <Button variant="ghost" onClick={handleBack}>
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
      </div>
      <div className="p-8 pt-0 pb-0">{children}</div>
    </div>
  );
};

export default ServiceLayout;
