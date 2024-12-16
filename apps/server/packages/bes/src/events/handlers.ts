import { BesSendEmailJobDTO } from '@bes/types/jobs/send-email-handler';
import { Queue } from 'bullmq';

export class BesHandlerEventsPublisher {
  private readonly sendEmailHandlerQueue: Queue;
  constructor(sendEmailHandlerQueue: Queue) {
    this.sendEmailHandlerQueue = sendEmailHandlerQueue;
  }

  public async publishSendEmailEvent(data: BesSendEmailJobDTO) {
    const response = await this.sendEmailHandlerQueue.add('send-email', data);
    return response.id;
  }
}
