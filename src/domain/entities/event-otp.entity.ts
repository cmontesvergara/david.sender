// domain/entities/event-otp.entity.ts

export interface EventOtpProps {
  id?: number;
  phoneVinculate: string;
  otp: string;
  createdAt?: Date;
}

export class EventOtp {
  constructor(private readonly props: EventOtpProps) {
    if (!props.phoneVinculate || !props.otp) {
      throw new Error('Phone y OTP son obligatorios');
    }

    if (!/^\d{6}$/.test(props.otp)) {
      throw new Error('El OTP debe tener 6 dígitos');
    }
  }

  get id() {
    return this.props.id;
  }

  get phoneVinculate() {
    return this.props.phoneVinculate;
  }

  get otp() {
    return this.props.otp;
  }

  get createdAt() {
    return this.props.createdAt ?? new Date();
  }

  isExpired(): boolean {
    const now = new Date();
    return (now.getTime() - this.createdAt.getTime()) / 1000 > 300;
  }

  toPrisma(): any {
    return {
      phoneVinculate: this.phoneVinculate,
      otp: this.otp,
      createdAt: this.createdAt,
    };
  }

  static fromPrisma(data: any): EventOtp {
    return new EventOtp({
      id: data.id,
      phoneVinculate: data.phoneVinculate,
      otp: data.otp,
      createdAt: data.createdAt,
    });
  }
}
