import NoSearchResult from '../../../assets/images/NoSearchResult.svg';

const ServiceOverview = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <img src={NoSearchResult} alt="No Search Result" className="h-1/2" />
      <p className="text-lg font-semibold text-center">
        Nothing here for now. Feature coming soon.
      </p>
    </div>
  );
};

export default ServiceOverview;
