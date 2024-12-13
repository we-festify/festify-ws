import PageSection from '@sharedui/components/page-section';
import AccountInformationCard from '../../../../../sharedui/src/components/account-information-card';
import ResourcesSummary from './resources-summary';

const Dashboard = () => {
  return (
    <div className="bg-background p-8 pb-20">
      <PageSection
        title="AIM Dashboard"
        description="The AIM dashboard shows a summary of the security recommendations and AIM resources in your account. You can find other account information along with links to other tools and resources to help you manage your account."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResourcesSummary />
          <AccountInformationCard />
        </div>
      </PageSection>
    </div>
  );
};

export default Dashboard;
