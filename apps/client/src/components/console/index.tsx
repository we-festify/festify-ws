import { useGetMeQuery } from '../../api/auth';
import { Separator } from '../../packages/shared/ui/separator';

const Home = () => {
  const { data: { account = {} } = {} } = useGetMeQuery({});

  return (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-lg font-medium">Home</h3>
        <p className="text-sm text-muted-foreground">
          Welcome back, {account.alias}.
        </p>
      </div>
      <Separator />
    </div>
  );
};

export default Home;
