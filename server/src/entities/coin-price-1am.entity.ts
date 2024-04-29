import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";

// Entities

@Entity("coin_price_1am")
export class CoinPrice1AM extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  symbol: string;

  @Column()
  price: string;

  @Column()
  mark_price: string;

  @Column()
  f_price: string;

  @Column()
  f_mark_price: string;
}
