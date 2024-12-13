import AccountInformationCard from '@sharedui/components/account-information-card';
import Header from '@sharedui/components/header';
import PageSection from '@sharedui/components/page-section';

const Dashboard = () => {
  return (
    <>
      <Header />
      <div className="container p-8">
        <PageSection
          title="Console home"
          description="Welcome to the FWS console. Here you can manage your services and resources."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AccountInformationCard />
          </div>
        </PageSection>
      </div>
    </>
  );
};

export default Dashboard;
