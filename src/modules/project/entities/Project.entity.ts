import { Entity, Column, OneToMany, ManyToMany } from "typeorm";
import { BaseEntity } from "../../../common/entities/Base.entity";
import { User } from "../../system/entities/User.entity";

export enum ProjectStatus {
  PREPARING = "preparing",
  IN_PROGRESS = "in_progress",
  PAUSED = "paused",
  COMPLETED = "completed",
  CLOSED = "closed"
}

@Entity("projects")
export class Project extends BaseEntity {
  @Column({ type: "varchar", length: 200 })
  name!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  code!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "enum", enum: ProjectStatus, default: ProjectStatus.PREPARING })
  status!: ProjectStatus;

  @Column({ type: "timestamp", name: "start_date", nullable: true })
  startDate?: Date;

  @Column({ type: "timestamp", name: "end_date", nullable: true })
  endDate?: Date;

  @Column({ type: "varchar", length: 500, nullable: true })
  address?: string;

  @Column({ type: "decimal", precision: 15, scale: 2, name: "budget_amount", nullable: true })
  budgetAmount?: number;

  @Column({ type: "varchar", length: 200, nullable: true })
  clientName?: string;

  @Column({ type: "varchar", length: 20, name: "client_phone", nullable: true })
  clientPhone?: string;

  @Column({ type: "uuid", name: "project_manager_id", nullable: true })
  projectManagerId?: string;

  @ManyToMany(() => User, (user) => user.projects)
  members?: User[];
}
