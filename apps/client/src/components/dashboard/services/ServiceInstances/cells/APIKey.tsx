import CopyIcon from '@client/components/custom/CopyIcon';

const APIKeyCell = ({ row }: { row: any }) => {
  const apiKey = row.original.apiKey;

  return (
    <span className="text-muted-foreground flex items-center justify-between">
      <span>
        {apiKey.slice(0, 5)}
        **********
        {apiKey.slice(-4)}
      </span>
      <CopyIcon value={apiKey} />
    </span>
  );
};

export default APIKeyCell;
