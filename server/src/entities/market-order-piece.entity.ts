import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { MarketOrderChain } from "./market-order-chain.entity";

// Entities

@Entity("market_order_pieces", { orderBy: { createdAt: "DESC" } })
export class MarketOrderPiece extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  total_balance: string;

  @Column()
  timestamp: string;

  @Column({ type: "int", nullable: false })
  market_order_chains_id: number;

  @ManyToOne(() => MarketOrderChain, (chain) => chain.order_pieces)
  @JoinColumn({ name: "market_order_chains_id", referencedColumnName: "id" })
  order_chain: MarketOrderChain;
}
