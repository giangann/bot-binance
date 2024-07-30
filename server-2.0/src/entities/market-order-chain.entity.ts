import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { MarketOrderPiece } from "./market-order-piece.entity";
import { Log } from "./log.entity";
import {
  TOrderChainPriceType,
  TOrderChainStatus,
} from "../interfaces/market-order-chain.interface";

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
  percent_to_first_buy: string;

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

  @Column({ nullable: false })
  pnl_to_stop: string;

  @Column({ nullable: true })
  is_over_pnl_to_stop: boolean;

  @Column({ nullable: true })
  stop_reason: string;

  @Column({ nullable: false })
  max_pnl_start: string;

  @Column({ nullable: false })
  max_pnl_threshold_to_quit: string;

  @Column({ nullable: false, default: false })
  is_max_pnl_start_reached: boolean;

  @Column({ nullable: false })
  price_type: TOrderChainPriceType;

  @Column({ nullable: true })
  start_reason: string;

  @OneToMany(() => MarketOrderPiece, (piece) => piece.order_chain)
  @JoinColumn({ name: "id", referencedColumnName: "market_order_chains_id" })
  order_pieces: MarketOrderPiece[];

  @OneToMany(() => Log, (log) => log.order_chain)
  @JoinColumn({ name: "id", referencedColumnName: "market_order_chains_id" })
  logs: Log[];
}
