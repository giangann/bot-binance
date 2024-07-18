import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { MarketOrderChain } from "./market-order-chain.entity";

// Entities

@Entity("logs", { orderBy: { createdAt: "DESC" } })
export class Log extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  message: string;

  @Column({ nullable: false })
  type: string;

  @Column({ type: "int", nullable: false })
  market_order_chains_id: number;

  @ManyToOne(() => MarketOrderChain, (chain) => chain.logs)
  @JoinColumn({ name: "market_order_chains_id", referencedColumnName: "id" })
  order_chain: MarketOrderChain;
}
