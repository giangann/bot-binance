import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

// Entities

@Entity("noti", { orderBy: { createdAt: "DESC" } })
export class Noti extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number | string;

  @Column()
  from_user_id: number;

  @Column()
  to_user_id: number;

  @Column()
  content: string;

  @Column({ default: false })
  isRead: boolean;

  @JoinColumn({ name: "from_user_id", referencedColumnName: "id" })
  @OneToOne(() => User)
  from_user: User;

  @JoinColumn({ name: "to_user_id", referencedColumnName: "id" })
  @OneToOne(() => User)
  to_user: User;
}
