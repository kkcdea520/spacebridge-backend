import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../common/entities/Base.entity";
import { Project } from "../../project/entities/Project.entity";

export enum EquipmentStatus {
  IDLE = "idle",
  IN_USE = "in_use",
  MAINTENANCE = "maintenance",
  REPAIRING = "repairing",
  SCRAPPED = "scrapped"
}

@Entity("equipment")
export class Equipment extends BaseEntity {
  @Column({ type: "varchar", length: 200 })
  name!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  code?: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  model?: string;

  @Column({ type: "varchar", length: 200, name: "manufacturer", nullable: true })
  manufacturer?: string;

  @Column({ type: "date", name: "purchase_date", nullable: true })
  purchaseDate?: Date;

  @Column({ type: "decimal", precision: 15, scale: 2, name: "purchase_price", nullable: true })
  purchasePrice?: number;

  @Column({ type: "uuid", name: "project_id", nullable: true })
  projectId?: string;

  @Column({ type: "enum", enum: EquipmentStatus, default: EquipmentStatus.IDLE })
  status!: EquipmentStatus;

  @Column({ type: "date", name: "last_maintenance_date", nullable: true })
  lastMaintenanceDate?: Date;

  @Column({ type: "date", name: "next_maintenance_date", nullable: true })
  nextMaintenanceDate?: Date;

  @Column({ type: "varchar", length: 100, name: "operator_name", nullable: true })
  operatorName?: string;

  @Column({ type: "text", nullable: true })
  remark?: string;

  @ManyToOne(() => Project)
  project?: Project;
}
