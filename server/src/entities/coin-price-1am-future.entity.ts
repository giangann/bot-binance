import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";

// Entities

@Entity("coin_price_1am_future")
export class CoinPrice1AMFuture extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  symbol: string;

  @Column()
  price: string;

  @Column()
  mark_price: string;
}
