import { IFemails } from './femails';

export interface IFemailsPlugin {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly init: (femails: Readonly<IFemails>) => void;
}
