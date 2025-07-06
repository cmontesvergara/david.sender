import { IsString, Length } from 'class-validator';

export class SuscribeToEventDto {
  @IsString()
  @Length(10, 12)
  phone!: string;

  @IsString()
  eventId!: string;
}
