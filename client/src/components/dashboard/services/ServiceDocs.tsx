import { useGetServiceMetaByTypeQuery } from "@/api/services";
import APIBadge from "@/components/custom/APIBadge";
import APIMethodDetails from "@/components/custom/APIMethodDetails";
import CodeBlock from "@/components/custom/CodeBlock";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ServiceOverviewProps {
  type: string;
}

const ServiceDocs = ({ type }: ServiceOverviewProps) => {
  const { data: { service = {} } = {} } = useGetServiceMetaByTypeQuery(type);

  return (
    <div className="flex">
      <div className="flex flex-col flex-1 w-full gap-6">
        <div className="flex flex-1 flex-col gap-2" id="overview">
          <h1 className="text-xl font-semibold">Overview</h1>
          <p className="text-muted-foreground">{service.description}</p>
        </div>
        <div className="flex flex-1 flex-col gap-2" id="api-base">
          <h1 className="text-xl font-semibold">API base</h1>
          <CodeBlock code={service.baseUrl} />
        </div>
        <div className="flex flex-1 flex-col gap-2" id="methods">
          <h1 className="text-xl font-semibold">Methods</h1>
          <p className="text-muted-foreground">
            Search for all the methods you need.
          </p>
          <Accordion type="single" collapsible className="w-full">
            {service.methods?.map((method: any) => (
              <AccordionItem
                key={method.name}
                value={method.name}
                className="border-none hover:bg-primary-foreground rounded-lg p-4 pt-0 pb-0"
                id={method.name}
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-4">
                    <span>{method.name}</span>
                    <APIBadge method={method.method} />
                    <span className="text-muted-foreground">{method.path}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4">
                  <APIMethodDetails method={method} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
      <aside className="flex flex-col gap-4 w-64 pl-10">
        <h2 className="font-semibold">On this page</h2>
        <ul className="flex flex-col gap-2 text-sm">
          <li>
            <a href="#overview">Overview</a>
          </li>
          <li>
            <a href="#api-base">API base</a>
          </li>
          <li>
            <a href="#methods">Methods</a>
            <ul className="flex flex-col gap-4 m-4 mt-2">
              {service.methods?.map((method: any) => (
                <li key={method.name} className="text-muted-foreground">
                  <a href={`#${method.name}`}>{method.name}</a>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default ServiceDocs;
