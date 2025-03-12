import { FemailsEventsManager } from '@/utils/events';
import { IFemailsEvent, IFemailsEventHandler } from '@/types/events';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('FemailsEventsManager', () => {
  let eventsManager: FemailsEventsManager;

  beforeEach(() => {
    eventsManager = new FemailsEventsManager();
  });

  it('should register an event handler and invoke it when the event is emitted', () => {
    const handler = jest.fn() as IFemailsEventHandler;
    const event: IFemailsEvent = {
      type: 'TEST_EVENT',
      payload: { message: 'Hello' },
    };

    eventsManager.on(event.type, handler);
    eventsManager.emit(event);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(event);
  });

  it('should not call an event handler after it is unregistered', () => {
    const handler = jest.fn() as IFemailsEventHandler;
    const event: IFemailsEvent = {
      type: 'TEST_EVENT',
      payload: { message: 'Hello' },
    };

    eventsManager.on(event.type, handler);
    eventsManager.off(event.type, handler);
    eventsManager.emit(event);

    expect(handler).not.toHaveBeenCalled();
  });

  it('should handle multiple handlers for the same event type', () => {
    const handler1 = jest.fn() as IFemailsEventHandler;
    const handler2 = jest.fn() as IFemailsEventHandler;
    const event: IFemailsEvent = {
      type: 'TEST_EVENT',
      payload: { message: 'Hello' },
    };

    eventsManager.on(event.type, handler1);
    eventsManager.on(event.type, handler2);
    eventsManager.emit(event);

    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler1).toHaveBeenCalledWith(event);
    expect(handler2).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledWith(event);
  });

  it('should not invoke handlers of different event types', () => {
    const handler = jest.fn() as IFemailsEventHandler;
    const event: IFemailsEvent = {
      type: 'TEST_EVENT',
      payload: { message: 'Hello' },
    };
    const unrelatedEvent: IFemailsEvent = {
      type: 'OTHER_EVENT',
      payload: { message: 'World' },
    };

    eventsManager.on(event.type, handler);
    eventsManager.emit(unrelatedEvent);

    expect(handler).not.toHaveBeenCalled();
  });

  it('should emit events with the correct payload', () => {
    const handler = jest.fn() as IFemailsEventHandler;
    const event: IFemailsEvent = {
      type: 'PAYLOAD_EVENT',
      payload: { id: 123, status: 'active' },
    };

    eventsManager.on(event.type, handler);
    eventsManager.emit(event);

    expect(handler).toHaveBeenCalledWith(event);
  });
});
