import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { DefaultValues, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '../../primitives/form';
import { Button } from '../../primitives/button';
import { cn } from '../../utils/tw';
import { LoadingButton } from '../loading-button';

interface MultiStepFormContextProps {
  form: ReturnType<typeof useForm>;
  goToStep: (step: number) => void;
}

const MultiStepFormContext = createContext({} as MultiStepFormContextProps);

// eslint-disable-next-line react-refresh/only-export-components
export const useMultiStepForm = () => {
  if (!MultiStepFormContext) {
    throw new Error(
      'useMultiStepForm must be used within a MultiStepFormProvider',
    );
  }

  return useContext(MultiStepFormContext);
};

export interface MultiStepFormStep {
  title: string;
  component: React.ReactNode;
  validateNext?: (
    form: ReturnType<typeof useForm>,
  ) => Promise<boolean> | boolean;
}

interface MultiStepFormProps<TSchema extends z.ZodTypeAny> {
  title?: string;
  description?: string;
  schema: TSchema;
  defaultValues?: DefaultValues<z.infer<TSchema>>;
  steps: MultiStepFormStep[];
  onSubmit?: (data: z.infer<TSchema>) => void;
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  showSteps?: boolean;
  submitButtonText?: string;
  loading?: boolean;
}

function MultiStepForm<TSchema extends z.ZodTypeAny>({
  title,
  description,
  schema,
  defaultValues,
  steps,
  onSubmit = () => true,
  onCancel = (e) => e.preventDefault(),
  className,
  showSteps = true,
  submitButtonText = 'Submit',
  loading,
}: Readonly<MultiStepFormProps<TSchema>>) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [lastValidatedStep, setLastValidatedStep] = useState(-1);

  const hasNext = () => currentStep < steps.length - 1;
  const hasPrevious = () => currentStep > 0;

  const goToStep = useCallback(
    async (step: number) => {
      // if the step is already validated, just move to that step
      if (step <= lastValidatedStep) {
        setCurrentStep(step);
        return;
      }

      // validation check
      if (
        steps[currentStep].validateNext &&
        !(await steps[currentStep]?.validateNext?.(form))
      ) {
        return;
      }

      // bounds check
      if (step < 0 || step >= steps.length) {
        return;
      }

      // cannot skip steps if they are not validated
      if (step - lastValidatedStep > 2) {
        return;
      }

      setCurrentStep(step);
      setLastValidatedStep(step - 1); // validated till the previous step
    },
    [currentStep, form, lastValidatedStep, steps],
  );

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (hasNext()) {
      goToStep(currentStep + 1);
    }
  };

  const handlePrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (hasPrevious()) {
      goToStep(currentStep - 1);
    }
  };

  const handleChangeStep = async (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>,
    step: number,
  ) => {
    e.preventDefault();

    goToStep(step);
  };

  const value = useMemo(
    () => ({
      form,
      goToStep,
    }),
    [form, goToStep],
  );

  return (
    <MultiStepFormContext.Provider value={value}>
      <Form {...form}>
        <form
          className={cn('h-full flex-1 w-full flex gap-10', className)}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {showSteps && (
            <div className="p-6 space-y-4 w-52 hidden md:block">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="flex flex-col gap-2 border-muted border-b-2 py-2 text-xs text-muted-foreground"
                >
                  <div>Step {index + 1}</div>
                  <div
                    className={cn(
                      'text-sm',
                      index === currentStep
                        ? 'text-secondary font-semibold'
                        : 'text-muted-foreground',
                    )}
                  >
                    {step.title}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex-1 max-w-[1024px]">
            <div className="flex justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-medium">{title}</h1>
                <p className="text-muted-foreground">{description}</p>
              </div>
              <div className="flex gap-4">
                {steps.map((step, index) => (
                  <button
                    key={step.title}
                    className={cn(
                      'size-8 rounded-full flex items-center justify-center',
                      index === currentStep
                        ? 'bg-secondary text-white'
                        : 'ring-1 ring-muted text-muted-foreground bg-background hover:bg-muted hover:ring-muted-foreground/10 cursor-pointer',
                    )}
                    onClick={(e) => handleChangeStep(e, index)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleChangeStep(e, index);
                      }
                    }}
                  >
                    <span className="m-auto">{index + 1}</span>
                    <span className="sr-only">{step.title}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-8">{steps[currentStep].component}</div>
            <div className="">
              <div className="flex justify-between p-2 mt-4 max-w-[1024px] mx-auto bg-inherit">
                <div></div>
                <div className="flex items-center gap-4">
                  <Button size="sm" variant="ghost" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={!hasPrevious()}
                    onClick={handlePrevious}
                  >
                    Previous
                  </Button>
                  {hasNext() ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleNext}
                      className="w-20"
                    >
                      Next
                    </Button>
                  ) : (
                    <LoadingButton
                      size="sm"
                      variant="secondary"
                      type="submit"
                      loading={loading || form.formState.isSubmitting}
                    >
                      {submitButtonText}
                    </LoadingButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </MultiStepFormContext.Provider>
  );
}

export default MultiStepForm;
