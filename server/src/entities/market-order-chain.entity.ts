import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { MarketOrderPiece } from "./market-order-piece.entity";
import { TOrderChainStatus } from "market-order-chain.interface";
import { Log } from "./log.entity";

// Entities

@Entity("market_order_chains", { orderBy: { createdAt: "DESC" } })
export class MarketOrderChain extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  status: TOrderChainStatus;

  @Column({ nullable: false })
  total_balance_start: string;

  @Column({ nullable: false })
  transaction_size_start: number;

  @Column({ nullable: false })
  percent_to_buy: string;

  @Column({ nullable: false })
  percent_to_sell: string;

  @Column({ nullable: true })
  total_balance_end: string;

  @Column({ nullable: false })
  price_start: string;

  @Column({ nullable: true })
  price_end: string;

  @Column({ nullable: true })
  percent_change: string;

  @OneToMany(() => MarketOrderPiece, (piece) => piece.order_chain)
  @JoinColumn({ name: "id", referencedColumnName: "market_order_chains_id" })
  order_pieces: MarketOrderPiece[];

  @OneToMany(() => Log, (log) => log.order_chain)
  @JoinColumn({ name: "id", referencedColumnName: "market_order_chains_id" })
  logs: Log[];
}
