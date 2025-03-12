import { useListApiEndpointsQuery } from '@bridge-ui/api/apis';
import { ApiEndpointDetails } from '@bridge-ui/components/api-endpoint-details';
import { useAuth } from '@rootui/providers/auth-provider';
import {
  BridgeApiEndpointMethod,
  IBridgeApiEndpoint,
} from '@sharedtypes/bridge';
import useSearchParamState from '@sharedui/hooks/useSearchParamState';
import { buttonVariants } from '@sharedui/primitives/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@sharedui/primitives/collapsible';
import { generateFRN } from '@sharedui/utils/frn';
import { cn } from '@sharedui/utils/tw';
import { MinusSquare, Plus, PlusSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

interface TreeNode {
  name: string;
  children: Record<string, TreeNode>;
  endpoints: Pick<IBridgeApiEndpoint, 'method' | 'path' | '_id'>[];
}

const ApiEndpoint = ({
  endpoint,
  active,
}: {
  endpoint: Pick<IBridgeApiEndpoint, 'method' | 'path' | '_id'>;
  active?: boolean;
}) => {
  return (
    <div className="flex gap-4 cursor-pointer hover:bg-muted">
      <span
        className={cn(
          'text-xs font-medium rounded-md px-1 py-0.5',
          endpoint.method === BridgeApiEndpointMethod.GET && 'bg-green-200',
          endpoint.method === BridgeApiEndpointMethod.POST && 'bg-blue-200',
          endpoint.method === BridgeApiEndpointMethod.PUT && 'bg-yellow-200',
          endpoint.method === BridgeApiEndpointMethod.PATCH && 'bg-purple-200',
          endpoint.method === BridgeApiEndpointMethod.DELETE && 'bg-red-200',
          endpoint.method === BridgeApiEndpointMethod.HEAD && 'bg-gray-200',
          endpoint.method === BridgeApiEndpointMethod.OPTIONS && 'bg-gray-200',
        )}
      >
        {endpoint.method}
      </span>
      <Link
        to={`?endpoint=${endpoint._id}`}
        className={cn(
          'text-sm hover:underline w-full',
          active && 'underline font-semibold',
        )}
      >
        {endpoint.path}
      </Link>
    </div>
  );
};

const generateTreeFromEndpoints = (
  endpoints: Pick<IBridgeApiEndpoint, 'method' | 'path' | '_id'>[],
): TreeNode => {
  const root: TreeNode = {
    name: '',
    children: {},
    endpoints: [],
  };

  endpoints.forEach((endpoint) => {
    const parts = endpoint.path.split('/').filter((part) => part !== '');
    let currentNode = root;

    for (const part of parts) {
      if (!currentNode.children[part]) {
        currentNode.children[part] = {
          name: `/${part}`,
          children: {},
          endpoints: [],
        };
      }
      currentNode = currentNode.children[part];
    }

    currentNode.endpoints.push(endpoint);
  });

  if (root.name === '') {
    root.name = '/';
  }

  return root;
};

const TreeNodeComponent = ({
  node,
  level = 0,
  openDepth = 1,
}: {
  node: TreeNode;
  level?: number;
  openDepth?: number;
}) => {
  const hasChildren = Object.keys(node.children).length > 0;
  const paddingLeft = level * 8;
  const [open, setOpen] = useState(level < openDepth);

  return (
    <div style={{ paddingLeft }}>
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="space-y-2">
          {hasChildren && (
            <CollapsibleTrigger className="flex gap-2 items-center cursor-pointer">
              {!open ? (
                <PlusSquare size={16} className="text-muted-foreground" />
              ) : (
                <MinusSquare size={16} className="text-secondary" />
              )}
              <span className="text-sm">{node.name}</span>
            </CollapsibleTrigger>
          )}
          {node.endpoints.map((endpoint) => (
            <ApiEndpoint
              key={endpoint._id}
              endpoint={{
                method: endpoint.method,
                path: node.name,
                _id: endpoint._id,
              }}
              active={endpoint._id === '1'}
            />
          ))}
          <CollapsibleContent className="space-y-2">
            {hasChildren &&
              Object.values(node.children).map((childNode) => (
                <TreeNodeComponent
                  key={childNode.name}
                  node={childNode}
                  level={level + 1}
                  openDepth={openDepth}
                />
              ))}
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
};

const EndpointTree = ({ rootNode }: { rootNode: TreeNode }) => {
  return <TreeNodeComponent node={rootNode} openDepth={3} />;
};

export const ApiDetailsPage = () => {
  const { apiId } = useParams<{ apiId: string }>();
  const { user } = useAuth();
  const apiFrn = generateFRN(
    'bridge',
    user?.accountId ?? '',
    'api',
    apiId ?? '',
  );
  const { data: { endpoints } = {} } = useListApiEndpointsQuery(apiFrn ?? '', {
    skip: !apiId,
  });
  const tree = generateTreeFromEndpoints(endpoints ?? []);
  const [endpoint, setEndpoint] = useSearchParamState('endpoint');

  useEffect(() => {
    if (endpoints && !endpoint) {
      setEndpoint(endpoints[0]?._id);
    }
  }, [endpoints, endpoint, setEndpoint]);

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col w-64 bg-background h-[calc(100dvh-76px)]">
        <div className="w-full py-3 px-4 border-b-2 border-b-muted dark:border-slate-800">
          <h3 className="text-lg font-semibold flex items-center justify-between gap-4">
            <span>Endpoints</span>
            <Link
              to="endpoints/create"
              className={cn(
                buttonVariants({
                  variant: 'outline',
                  size: 'icon',
                }),
                'text-sm size-7 p-1',
              )}
            >
              <Plus size={16} className="" />
            </Link>
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <EndpointTree rootNode={tree} />
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <ApiEndpointDetails />
      </div>
    </div>
  );
};
