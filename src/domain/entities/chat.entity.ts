// domain/entities/chat.entity.ts

export interface ChatProps {
  id: bigint;
  type: string;
  phone: string;
  title?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

export class Chat {
  constructor(private readonly props: ChatProps) {
    if (!props.phone || !props.type) {
      throw new Error('Phone y type son obligatorios');
    }
  }

  get id() {
    return this.props.id;
  }

  get phone() {
    return this.props.phone;
  }

  get type() {
    return this.props.type;
  }

  get title() {
    return this.props.title;
  }

  get username() {
    return this.props.username;
  }

  get firstName() {
    return this.props.firstName;
  }

  get lastName() {
    return this.props.lastName;
  }

  toPrisma(): any {
    return {
      id: this.id,
      phone: this.phone,
      type: this.type,
      title: this.title,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
    };
  }

  static fromPrisma(data: any): Chat {
    return new Chat({
      id: data.id,
      phone: data.phone,
      type: data.type,
      title: data.title,
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
    });
  }
}
