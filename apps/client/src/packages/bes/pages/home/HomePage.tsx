const HomePage = () => {
  return (
    <div className="bg-background">
      <div className="container max-w-[1024px] flex flex-col gap-10 p-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-semibold">Festify BES</h1>
          <p>
            Festify Basic Email Service (BES) is a cloud based email service
            that provides scalable, flexible and cost-effective email solutions
            for businesses. It is designed to make it easy for you to send
            emails to your users without having to worry about the underlying
            infrastructure.
          </p>
        </div>
        <h2 className="text-2xl font-semibold">How it works?</h2>
      </div>
    </div>
  );
};

export default HomePage;
