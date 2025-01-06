import {
  EventType,
  IFemailsEvent,
  IFemailsEventHandler,
  IFemailsEventsManager,
} from '@/types/events';
import mitt, { Emitter, Handler } from 'mitt';

export class FemailsEventsManager implements IFemailsEventsManager {
  private emitter: Emitter<Record<EventType, IFemailsEvent>>;

  constructor() {
    this.emitter = mitt();
  }

  on(type: EventType, handler: IFemailsEventHandler): void {
    this.emitter.on(type, handler as Handler<IFemailsEvent>);
  }

  off(type: EventType, handler: IFemailsEventHandler): void {
    this.emitter.off(type, handler as Handler<IFemailsEvent>);
  }

  emit(event: IFemailsEvent): void {
    this.emitter.emit(event.type, event);
  }
}
