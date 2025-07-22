import { Injectable } from '@nestjs/common';
import { ChatRepository } from 'domain/interfaces/chat-repository.interface';
import { EventSubscriptionRepository } from 'domain/interfaces/event-subscription-repository.interface';

@Injectable()
export class SubscribeToEventUseCase {
  constructor(
    private readonly chatRepo: ChatRepository,
    private readonly eventSubRepo: EventSubscriptionRepository,
  ) {}

  async execute(phone: string, eventId: number) {
    if (phone.length <= 10) {
      phone = `57${phone}`; // Ensure phone number is in international format
    }
    const chatId = await this.chatRepo.getId(phone);
    if (!chatId) {
      return new Error('Not exist chat with this phone number');
    }
    const isSubscribed = await this.eventSubRepo.exists(eventId, chatId);
    if (isSubscribed) {
      return new Error('Already subscribed to this event');
    }
    await this.chatRepo.linkToEvent(chatId, eventId);
  }
}
