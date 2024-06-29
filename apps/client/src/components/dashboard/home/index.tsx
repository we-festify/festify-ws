import { selectUser } from '../../../store/slices/auth';
import { useSelector } from 'react-redux';
import { Separator } from '../../../packages/shared/ui/separator';

const Home = () => {
  const user = useSelector(selectUser);

  return (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-lg font-medium">Home</h3>
        <p className="text-sm text-muted-foreground">
          Welcome back, {user?.name}.
        </p>
      </div>
      <Separator />
    </div>
  );
};

export default Home;
