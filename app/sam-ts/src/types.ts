export type EventType = 'noop' | 'tg';

export interface BaseEvent {
  type: EventType;
}

export interface NoopEvent extends BaseEvent {
  type: 'noop';
}

export interface TelegramEvent extends BaseEvent {
  type: 'tg';
  bot_token: string;
  chat_id: string;
  message: string;
}

export type Event = NoopEvent | TelegramEvent;

export function isTelegramEvent(event: BaseEvent): event is TelegramEvent {
  return event.type === 'tg';
}

export function isNoopEvent(event: BaseEvent): event is NoopEvent {
  return event.type === 'noop';
}