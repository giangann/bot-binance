import { Column } from "typeorm";

export class BaseEntity {
  @Column("datetime")
  createdAt: string;

  @Column("datetime")
  updatedAt: string;
}
