import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { DatasetItem } from "./dataset-item.entity";
import { MarketOrderChainTest } from "./market-order-chain-test.entity";
@Entity("datasets", { orderBy: { createdAt: "DESC" } })
export class Dataset extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  /**
   * Sets cascades options for the given relation.
   * If set to true then it means that related object can be allowed to be inserted or updated in the database.
   * You can separately restrict cascades to insertion or updation using following syntax:
   *
   * cascade: ["insert", "update", "remove", "soft-remove", "recover"] // include or exclude one of them
   */
  @OneToMany(() => DatasetItem, (item) => item.dataset, { cascade: ["insert", "update", "remove"] })
  @JoinColumn({ name: "id", referencedColumnName: "datasets_id" })
  dataset_items: DatasetItem[];

  @OneToMany(() => MarketOrderChainTest, (item) => item.dataset, { cascade: ["insert", "update", "remove"] })
  @JoinColumn({ name: "id", referencedColumnName: "datasets_id" })
  order_chains_test: MarketOrderChainTest[];
}
