import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../common/entities/Base.entity";
import { Project } from "../../project/entities/Project.entity";

export enum WorkerStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  LEAVING = "leaving"
}

@Entity("workers")
export class Worker extends BaseEntity {
  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 50, name: "id_card", unique: true, nullable: true })
  idCard?: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  team?: string;

  @Column({ type: "varchar", length: 100, name: "work_type", nullable: true })
  workType?: string;

  @Column({ type: "uuid", name: "project_id", nullable: true })
  projectId?: string;

  @Column({ type: "enum", enum: WorkerStatus, default: WorkerStatus.ACTIVE })
  status!: WorkerStatus;

  @Column({ type: "date", name: "entry_date", nullable: true })
  entryDate?: Date;

  @Column({ type: "date", name: "exit_date", nullable: true })
  exitDate?: Date;

  @Column({ type: "decimal", precision: 10, scale: 2, name: "daily_wage", nullable: true })
  dailyWage?: number;

  @Column({ type: "varchar", length: 200, name: "address", nullable: true })
  address?: string;

  @Column({ type: "varchar", length: 255, name: "id_card_front_url", nullable: true })
  idCardFrontUrl?: string;

  @Column({ type: "varchar", length: 255, name: "id_card_back_url", nullable: true })
  idCardBackUrl?: string;

  @Column({ type: "varchar", length: 255, name: "photo_url", nullable: true })
  photoUrl?: string;

  @Column({ type: "text", name: "remark", nullable: true })
  remark?: string;

  @ManyToOne(() => Project)
  project?: Project;
}
