import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { MarketOrderChain } from "./market-order-chain.entity";

// Entities

@Entity("market_order_pieces", { orderBy: { createdAt: "DESC" } })
export class MarketOrderPiece extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: false })
  total_balance: string;

  @Column({ nullable: false })
  percent_change: string;

  @Column({ nullable: false })
  symbol: string;

  @Column({ nullable: false })
  direction: string;

  @Column({ nullable: false })
  price: string;

  @Column({ nullable: false })
  quantity: string;

  @Column({ nullable: false })
  transaction_size: string;

  @Column({ nullable: true })
  timestamp: string;

  @Column({ type: "int", nullable: false })
  market_order_chains_id: number;

  @ManyToOne(() => MarketOrderChain, (chain) => chain.order_pieces)
  @JoinColumn({ name: "market_order_chains_id", referencedColumnName: "id" })
  order_chain: MarketOrderChain;
}
