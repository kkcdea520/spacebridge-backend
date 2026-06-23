import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../common/entities/Base.entity";
import { Project } from "../../project/entities/Project.entity";

export enum MaterialStatus {
  IN_STOCK = "in_stock",
  OUT_OF_STOCK = "out_of_stock",
  LOW_STOCK = "low_stock",
  RESERVED = "reserved"
}

@Entity("materials")
export class Material extends BaseEntity {
  @Column({ type: "varchar", length: 200 })
  name!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  code?: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  category?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  unit?: string;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  quantity!: number;

  @Column({ type: "decimal", precision: 15, scale: 2, name: "unit_price", nullable: true })
  unitPrice?: number;

  @Column({ type: "uuid", name: "project_id", nullable: true })
  projectId?: string;

  @Column({ type: "enum", enum: MaterialStatus, default: MaterialStatus.IN_STOCK })
  status!: MaterialStatus;

  @Column({ type: "decimal", precision: 15, scale: 2, name: "min_stock", default: 0 })
  minStock!: number;

  @Column({ type: "text", nullable: true })
  specification?: string;

  @Column({ type: "varchar", length: 200, name: "supplier_name", nullable: true })
  supplierName?: string;

  @ManyToOne(() => Project)
  project?: Project;
}
