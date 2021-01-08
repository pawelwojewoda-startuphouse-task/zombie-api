import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Item } from '../item/item.entity';

@Entity()
export class Zombie extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'bigint' })
  createdTimestamp: number;

  @OneToMany(() => Item, (item) => item.zombie, { onDelete: 'CASCADE' })
  items: Item[];
}
