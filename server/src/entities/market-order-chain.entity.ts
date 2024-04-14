import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { MarketOrderPiece } from "./market-order-piece.entity";

// Entities

@Entity("market_order_chains", { orderBy: { createdAt: "DESC" } })
export class MarketOrderChain extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column()
  total_balance_start: string;

  @Column()
  total_balance_end: string;

  @Column()
  percent_change: string;

  @OneToMany(() => MarketOrderPiece, (piece) => piece.order_chain)
  @JoinColumn({ name: "id", referencedColumnName: "market_order_chains_id" })
  order_pieces: MarketOrderPiece[];
}
