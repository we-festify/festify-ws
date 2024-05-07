import { useGetInstancesQuery } from "@/api/instances";
import EmptyInbox from "@/assets/images/EmptyInbox.svg";
import { NewInstance } from "./dialogs/NewInstance";

interface ServiceInstancesProps {
  type: string;
}

interface Instance {
  _id: string;
  status: string;
}

const ServiceInstances = ({ type }: ServiceInstancesProps) => {
  const { data: { instances = [] } = {} } = useGetInstancesQuery(type);

  return (
    <div>
      {instances.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <img src={EmptyInbox} alt="Empty Inbox" className="h-1/2" />
          <p className="text-lg font-semibold text-center">
            No instances created yet
          </p>
          <NewInstance type={type} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {instances.map((instance: Instance) => (
            <div
              key={instance._id}
              className="bg-background p-4 rounded-md shadow-md"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Instance</h2>
                <span
                  className={`px-2 py-1 rounded-md text-xs font-semibold ${
                    instance.status === "active"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {instance.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">{instance._id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceInstances;
