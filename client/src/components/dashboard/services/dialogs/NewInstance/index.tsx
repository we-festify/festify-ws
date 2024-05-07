import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewBESInstanceDialogContent from "./bes";

interface NewInstanceProps {
  type: string;
  buttonText?: string;
}

interface ComponentsMap {
  [key: string]: () => JSX.Element;
}

const componentsMap: ComponentsMap = {
  bes: NewBESInstanceDialogContent,
};

export function NewInstance({ type, buttonText }: NewInstanceProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{buttonText || "Create new instance"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Instance</DialogTitle>
          <DialogDescription>
            Create a new instance of the <strong>{type.toUpperCase()}</strong>{" "}
            service.
          </DialogDescription>
        </DialogHeader>
        {componentsMap[type] ? componentsMap[type]() : null}
      </DialogContent>
    </Dialog>
  );
}
