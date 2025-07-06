export interface EventSubscriptionRepository {
  exists(eventId: number, chatId: bigint): Promise<boolean>;
}
