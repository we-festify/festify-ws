import {
  SendEmailData,
  SendTemplatedEmailData,
} from '@bes/types/handlers/send-email';
import { Queue } from 'bullmq';

export class BesHandlerEventsPublisher {
  private readonly emailHandlersQueue: Queue;
  constructor(sendEmailHandlerQueue: Queue) {
    this.emailHandlersQueue = sendEmailHandlerQueue;
  }

  public async publishSendEmailEvent(data: SendEmailData) {
    const response = await this.emailHandlersQueue.add('send-email', {
      event: 'send-email',
      data,
    });
    return response.id;
  }

  public async publishSendTemplatedEmailEvent(data: SendTemplatedEmailData) {
    const response = await this.emailHandlersQueue.add('send-email', {
      event: 'send-templated-email',
      data,
    });
    return response.id;
  }
}
