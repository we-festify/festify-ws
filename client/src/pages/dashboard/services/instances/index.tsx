import InstanceLayout from "./layout";
import InstanceHeader from "@/components/dashboard/services/instances/InstanceHeader";
import InstanceDetails from "@/components/dashboard/services/instances/InstanceDetails";

const Instances = () => {
  return (
    <InstanceLayout>
      <InstanceHeader />
      <InstanceDetails />
    </InstanceLayout>
  );
};

export default Instances;
