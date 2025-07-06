import { Event } from '../../domain/entities/event.entity';
import { EventRepository } from '../../domain/interfaces/event-repository.interface';

export class CreateEventUseCase {
  constructor(private readonly eventRepo: EventRepository) {}

  async execute(data: {
    title: string;
    description: string;
    type: string;
    ownerId: string;
    ownerDomain: string;
  }): Promise<void> {
    const event = new Event(data);
    await this.eventRepo.create(event);
  }
}
