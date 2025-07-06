// adapters/out/prisma-event-repository.adapter.ts

import { Injectable } from '@nestjs/common';
import { Event } from '../../domain/entities/event.entity';
import { EventRepository } from '../../domain/interfaces/event-repository.interface';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaEventRepository implements EventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(event: Event): Promise<void> {
    await this.prisma.event.create({
      data: event.toPrisma(),
    });
  }

  async findById(id: number): Promise<Event | null> {
    const data = await this.prisma.event.findUnique({ where: { id } });
    return data ? Event.fromPrisma(data) : null;
  }
}
