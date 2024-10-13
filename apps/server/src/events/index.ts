import EventEmitter from 'events';
import { AuthEventsPublisher } from './auth';

// Create a new instance of EventEmitter
export const emitter = new EventEmitter();

export class EventsPublisher {
  private readonly eventEmitter: EventEmitter;
  public readonly auth: AuthEventsPublisher;

  constructor() {
    this.eventEmitter = emitter;

    this.auth = new AuthEventsPublisher(this.eventEmitter);
  }
}

// Only one instance of EventsPublisher is created and exported
export const publisher = new EventsPublisher();
