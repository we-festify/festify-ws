import BESSandbox from "./bes";

type SandboxMappingType = {
  [key: string]: React.ComponentType;
};

const SandboxMapping: SandboxMappingType = {
  bes: BESSandbox,
};

const ServiceAPISandboxIndex = ({ type }: { type: string }) => {
  const Component = SandboxMapping[type];

  if (!Component) return null;

  return <Component />;
};

export default ServiceAPISandboxIndex;
