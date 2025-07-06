import { Event } from '../entities/event.entity';

export interface EventRepository {
  create(event: Event): Promise<void>;
}
