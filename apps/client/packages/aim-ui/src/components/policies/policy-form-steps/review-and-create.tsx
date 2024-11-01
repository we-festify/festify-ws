import { Card, CardContent, CardHeader } from '@sharedui/primitives/card';
import PageSection from '@sharedui/components/page-section';
import FormSection from '@sharedui/components/form-section';
import { Button } from '@sharedui/primitives/button';
import { useMultiStepForm } from '@sharedui/components/multi-step-form';
import KeyValueGrid from '@sharedui/components/key-value-grid';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@sharedui/primitives/table';

type RuleRow = {
  service: string;
  effect: string;
  actions: number;
  resources: number;
};

const ReviewAndCreate = () => {
  const { form, goToStep } = useMultiStepForm();
  const rules = form.getValues('rules');
  const rows: RuleRow[] = rules.map(
    (rule: {
      service: string;
      effect: string;
      actions: string[];
      resources: string[];
    }) => ({
      service: rule.service,
      effect: rule.effect,
      actions: rule.actions.length,
      resouces: rule.resources.length,
    }),
  );

  return (
    <PageSection>
      <FormSection
        title="Review and create policy"
        description="Review the information you have provided and create policy."
      >
        <div className="flex flex-col gap-8">
          {steps.map((step) => (
            <Card key={step.title}>
              <CardHeader variant="muted">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">{step.title}</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-20"
                    onClick={() => goToStep(step.index)}
                  >
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <KeyValueGrid data={form.getValues()} keys={step.keys} />
              </CardContent>
            </Card>
          ))}
          <Card>
            <CardHeader variant="muted">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Rules</h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-20"
                  onClick={() => goToStep(1)}
                >
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Effect</TableHead>
                    <TableHead>Actions</TableHead>
                    <TableHead>Resources</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow key={`${row.service}-${index}`}>
                      <TableCell>{row.service}</TableCell>
                      <TableCell>
                        {row.effect == 'allow' ? (
                          <span className="text-green-700 text-sm font-medium">
                            Allow
                          </span>
                        ) : (
                          <span className="text-destructive text-sm font-medium">
                            Deny
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{row.actions}</TableCell>
                      <TableCell>{row.resources || 'All resources'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </FormSection>
    </PageSection>
  );
};

const steps = [
  {
    index: 0,
    title: 'Policy details',
    keys: [
      { key: 'alias', label: 'Alias' },
      { key: 'description', label: 'Description' },
    ],
  },
];

export default ReviewAndCreate;
