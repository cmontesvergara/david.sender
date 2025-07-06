import { Body, Controller, Post } from '@nestjs/common';
import { SubscribeToEventUseCase } from 'src/application/use-cases/subscribe-to-event.use-case';
import { CreateEventUseCase } from '../../../application/use-cases/create-event.use-case';
import { CreateEventDto } from './dto/create-event.dto';
import { SuscribeToEventDto } from './dto/suscribe-to-event.dto';

@Controller('api/v1/events')
export class EventsController {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly subscribeToEventUseCase: SubscribeToEventUseCase,
  ) {}

  @Post('create')
  async create(@Body() dto: CreateEventDto): Promise<{ message: string }> {
    await this.createEventUseCase.execute(dto);
    return { message: 'Evento creado exitosamente' };
  }
  @Post('subscribe')
  async subscribe(
    @Body() dto: SuscribeToEventDto,
  ): Promise<{ message: string }> {
    const result = await this.subscribeToEventUseCase.execute(
      dto.phone,
      Number(dto.eventId), // Convert eventId to number
    );
    if (result instanceof Error) {
      return { message: result.message };
    }
    return { message: 'Suscripción creada exitosamente' };
  }
}
