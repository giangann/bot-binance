import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { MarketOrderChainTest } from "./market-order-chain-test.entity";

// Entities

@Entity("market_order_pieces_test", { orderBy: { createdAt: "DESC" } })
export class MarketOrderPieceTest extends BaseEntity {
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
  reason: string;

  @Column({ nullable: true })
  timestamp: string;

  @Column({ type: "int", nullable: false })
  market_order_chains_test_id: number;

  @ManyToOne(() => MarketOrderChainTest, (chain) => chain.order_pieces_test)
  @JoinColumn({ name: "market_order_chains_test_id", referencedColumnName: "id" })
  order_chain_test: MarketOrderChainTest;
}
