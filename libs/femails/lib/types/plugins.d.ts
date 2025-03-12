import { IFemailsPlugin as CorePlugin } from 'femails-core';
import { IFemails } from './femails';

export interface IFemailsPlugin extends CorePlugin {
  init: (femails: Readonly<IFemails>) => void;
}
