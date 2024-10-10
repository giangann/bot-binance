import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TOrderChainPriceType, TOrderChainStatus } from "../interfaces/market-order-chain.interface";
import { BaseEntity } from "./base.entity";
import { Dataset } from "./dataset.entity";
import { MarketOrderPieceTest } from "./market-order-piece-test.entity";

// Entities

@Entity("market_order_chains_test", { orderBy: { createdAt: "DESC" } })
export class MarketOrderChainTest extends BaseEntity {
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

  @Column({ nullable: false })
  symbol_max_pnl_start: string;

  @Column({ nullable: false })
  symbol_max_pnl_threshold: string;

  @Column({ nullable: false })
  symbol_pnl_to_cutloss: string;

  @Column({ nullable: false, default: false })
  is_max_pnl_start_reached: boolean;

  @Column({ nullable: false })
  price_type: TOrderChainPriceType;

  @Column({ nullable: true })
  start_reason: string;

  @Column({ type: "int", nullable: false })
  datasets_id: number;

  @ManyToOne(() => Dataset, (dtSet) => dtSet.order_chains_test)
  @JoinColumn({ name: "datasets_id", referencedColumnName: "id" })
  dataset: Dataset;

  @OneToMany(() => MarketOrderPieceTest, (piece) => piece.order_chain_test)
  @JoinColumn({ name: "id", referencedColumnName: "market_order_chains_test_id" })
  order_pieces_test: MarketOrderPieceTest[];
}
