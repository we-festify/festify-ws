import { AuthEventsPublisher } from './auth';
import { rootEmailQueue } from '@/queues/root-emails';

export class EventsPublisher {
  public readonly auth: AuthEventsPublisher;

  constructor() {
    this.auth = new AuthEventsPublisher(rootEmailQueue);
  }
}

// Only one instance of EventsPublisher is created and exported
export const publisher = new EventsPublisher();
