import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Dataset } from "./dataset.entity";

// Entities

@Entity("dataset_items", { orderBy: { order: "ASC" } })
export class DatasetItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  symbol: string;

  @Column({ nullable: true })
  ticker_price: string;

  @Column({ nullable: true })
  market_price: string;

  @Column({ nullable: false })
  order: number;

  @Column({ type: "int", nullable: false })
  datasets_id: number;

  @ManyToOne(() => Dataset, (chain) => chain.dataset_items)
  @JoinColumn({ name: "datasets_id", referencedColumnName: "id" })
  dataset: Dataset;
}
