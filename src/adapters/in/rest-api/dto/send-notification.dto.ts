import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsObject,
  IsOptional,
  IsString,
  Matches,
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
export class SendWhatsappDiffusionDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @Matches(/^\d{12}$/, {
    each: true,
    message: 'Each agent must be a 10-digit number',
  })
  agents!: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @Matches(/^\d{10}$/, {
    each: true,
    message: 'Each phone must be a 10-digit number',
  })
  phones!: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => NotificationPayloadDto)
  message!: NotificationPayloadDto;

  @IsOptional()
  @IsObject()
  options?: Record<string, any> & { delay?: number };
}
