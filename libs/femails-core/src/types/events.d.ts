export type EventType = string;

export interface IFemailsEvent {
  /** The type of the event */
  type: EventType;
  /** The payload of the event */
  payload: Record<string, unknown>;
}

export interface IFemailsEventHandler {
  (
    /** The event that was emitted */
    event: IFemailsEvent,
  ): Promise<void> | void;
}

export interface IFemailsEventsManager {
  /** Subscribe to an event
   * @param type The type of the event
   * @param handler The handler to call when the event is emitted
   */
  on(type: EventType, handler: IFemailsEventHandler): void;
  /** Unsubscribe from an event
   * @param type The type of the event
   * @param handler The handler to remove
   */
  off(type: EventType, handler: IFemailsEventHandler): void;
  /** Emit an event
   * @param event The event to emit
   */
  emit(event: IFemailsEvent): void;
}
