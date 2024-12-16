import { sendEmailHandlerQueue } from '@bes/queues/send-email-handler';
import { BesHandlerEventsPublisher } from './handlers';
import { BesEmailsPublisher } from './bes-emails';
import { besEmailsQueue } from '@bes/queues/bes-emails';

export class EventsPublisher {
  public readonly handlers: BesHandlerEventsPublisher;
  public readonly emails: BesEmailsPublisher;

  constructor(
    handlersQueue: BesHandlerEventsPublisher,
    emailsQueue: BesEmailsPublisher,
  ) {
    this.handlers = handlersQueue;
    this.emails = emailsQueue;
  }
}

// Only one instance of EventsPublisher is created and exported
export const publisher = new EventsPublisher(
  new BesHandlerEventsPublisher(sendEmailHandlerQueue),
  new BesEmailsPublisher(besEmailsQueue),
);
