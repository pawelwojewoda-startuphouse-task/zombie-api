import { Zombie } from '../zombie/zombie.entity';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  externalId: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @ManyToOne(() => Zombie, (zombie) => zombie.items, { onDelete: 'CASCADE' })
  zombie: Zombie;
}
