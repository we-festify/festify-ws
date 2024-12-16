import { SendEmailDTO } from '@/types/services/mailer';
import { Queue } from 'bullmq';

export class BesEmailsPublisher {
  private readonly besEmailsQueue: Queue;

  constructor(besEmailsQueue: Queue) {
    this.besEmailsQueue = besEmailsQueue;
  }

  public async publishSendEmailEvent(data: SendEmailDTO) {
    const response = await this.besEmailsQueue.add('send-email', data);
    return response.id;
  }
}
