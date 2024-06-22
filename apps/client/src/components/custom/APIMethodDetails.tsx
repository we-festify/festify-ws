import Table from './Table';

interface APIMethodDetailsProps {
  method: {
    description: string;
    headers: {
      name: string;
      format: string;
      description: string;
    }[];
    params: {
      name: string;
      type: string;
      required: boolean;
      description: string;
    }[];
    responses: {
      status: string;
      description: string;
    }[];
  };
}

const APIMethodDetails = ({ method }: APIMethodDetailsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground">{method.description}</p>
      {method.headers && (
        <Table
          cols={[
            { key: 'name', title: 'Name' },
            { key: 'format', title: 'Format' },
            { key: 'description', title: 'Description' },
          ]}
          data={method.headers}
          title="Headers"
        />
      )}
      {method.params && (
        <Table
          cols={[
            { key: 'name', title: 'Name' },
            { key: 'type', title: 'Type' },
            { key: 'required', title: 'Required' },
            { key: 'description', title: 'Description' },
          ]}
          data={method.params}
          title="Body"
        />
      )}
      {method.responses && (
        <Table
          cols={[
            { key: 'status', title: 'Status' },
            { key: 'description', title: 'Description' },
          ]}
          data={method.responses}
          title="Responses"
        />
      )}
    </div>
  );
};

export default APIMethodDetails;
