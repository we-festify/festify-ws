import Header from '@sharedui/components/header';

const NotFound = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-[8rem] font-medium text-primary/70">404</h1>
        <p className="mt-4 text-lg text-primary">
          The page you are looking for does not exist. Please check the URL or
          go back to the homepage.
        </p>
      </div>
    </>
  );
};

export default NotFound;
