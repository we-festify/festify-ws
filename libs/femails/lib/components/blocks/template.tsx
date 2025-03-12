import { IFemailsNodeInstance } from 'femails-core';
import { Blocks } from '.';

const TemplateBlock = ({ instance }: { instance: IFemailsNodeInstance }) => {
  return (
    <div>
      {instance.children.map((child) => (
        <Blocks key={child} id={child} />
      ))}
    </div>
  );
};

export default TemplateBlock;
