import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TAutoActiveStatus } from "../interfaces/auto-active-config.interface";
import { TOrderChainPriceType } from "../interfaces/market-order-chain.interface";
import { BaseEntity } from "./base.entity";

// Entities

@Entity("auto_active_config")
export class AutoActiveConfig extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  auto_active: TAutoActiveStatus;

  @Column({ nullable: false })
  auto_active_decrease_price: string;

  @Column({ nullable: false })
  max_pnl_start: string;

  @Column({ nullable: false })
  max_pnl_threshold_to_quit: string;

  @Column({ nullable: false })
  percent_to_buy: string;

  @Column({ nullable: false })
  percent_to_first_buy: string;

  @Column({ nullable: false })
  percent_to_sell: string;

  @Column({ nullable: false })
  pnl_to_stop: string;

  @Column({ nullable: false })
  price_type: TOrderChainPriceType;

  @Column({ nullable: false })
  transaction_size_start: number;
}
