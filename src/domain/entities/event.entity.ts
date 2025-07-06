// domain/entities/event.entity.ts

export interface EventProps {
  title: string;
  description: string;
  type: string;
  ownerId: string;
  ownerDomain: string;
  createdAt?: Date;
}

export class Event {
  constructor(private readonly props: EventProps) {
    if (!props.title || !props.description || !props.type) {
      throw new Error('Campos requeridos faltantes');
    }
  }

  // Getters públicos
  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get type() {
    return this.props.type;
  }

  get ownerId() {
    return this.props.ownerId;
  }

  get ownerDomain() {
    return this.props.ownerDomain;
  }

  get createdAt() {
    return this.props.createdAt ?? new Date();
  }

  // Método de instancia → Event → Prisma
  toPrisma(): any {
    return {
      title: this.title,
      description: this.description,
      type: this.type,
      ownerId: this.ownerId,
      ownerDomain: this.ownerDomain,
      createdAt: this.createdAt,
    };
  }

  // Método estático → Prisma → Event
  static fromPrisma(prismaData: any): Event {
    return new Event({
      title: prismaData.title,
      description: prismaData.description,
      type: prismaData.type,
      ownerId: prismaData.ownerId,
      ownerDomain: prismaData.ownerDomain,
      createdAt: prismaData.createdAt,
    });
  }
}
