import { Type } from 'class-transformer';
import {
  IsDefined,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class NotificationMetaDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  title?: string;
}

class NotificationPayloadDto {
  @IsDefined()
  @IsObject()
  body!: Record<string, any>; // Puedes reemplazar con una clase si sabes su estructura

  @IsOptional()
  @ValidateNested()
  @Type(() => NotificationMetaDto)
  meta?: NotificationMetaDto;

  @IsOptional()
  @IsString()
  footer?: string;
}

export class SendTelegramNotificationDto {
  @IsString()
  phone!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => NotificationPayloadDto)
  payload!: NotificationPayloadDto;
}
export class SendWhatsappNotificationDto {
  @IsString()
  agent!: string;
  @IsString()
  phone!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => NotificationPayloadDto)
  payload!: NotificationPayloadDto;
}
