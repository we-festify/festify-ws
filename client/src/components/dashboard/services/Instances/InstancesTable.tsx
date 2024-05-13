import columns from "./columns";
import DataTable from "@/components/custom/DataTable";

interface Instance {
  _id: string;
  status: string;
  apiKey: string;
  createdAt: string;
}

interface InstancesTableProps {
  type: string;
  instances: Instance[];
}

const InstancesTable = ({ type, instances }: InstancesTableProps) => {
  const cols = columns(type);
  instances = instances.map((instance) => ({
    ...instance,
    type,
  }));

  return <DataTable columns={cols} data={instances} />;
};

export default InstancesTable;
