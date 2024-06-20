import Table from "./Table";

const APIMethodDetails = ({ method }: any) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground">{method.description}</p>
      {method.headers && (
        <Table
          cols={[
            { key: "name", title: "Name" },
            { key: "format", title: "Format" },
            { key: "description", title: "Description" },
          ]}
          data={method.headers}
          title="Headers"
        />
      )}
      {method.params && (
        <Table
          cols={[
            { key: "name", title: "Name" },
            { key: "type", title: "Type" },
            { key: "required", title: "Required" },
            { key: "description", title: "Description" },
          ]}
          data={method.params}
          title="Body"
        />
      )}
      {method.responses && (
        <Table
          cols={[
            { key: "status", title: "Status" },
            { key: "description", title: "Description" },
          ]}
          data={method.responses}
          title="Responses"
        />
      )}
    </div>
  );
};

export default APIMethodDetails;
