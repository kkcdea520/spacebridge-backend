import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { BaseEntity } from "../../../common/entities/Base.entity";
import { User } from "../../system/entities/User.entity";
import { Project } from "../../project/entities/Project.entity";

export enum LogStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  REVIEWED = "reviewed"
}

export enum WeatherType {
  SUNNY = "sunny",
  CLOUDY = "cloudy",
  RAINY = "rainy",
  SNOWY = "snowy",
  WINDY = "windy"
}

@Entity("construction_logs")
export class ConstructionLog extends BaseEntity {
  @Column({ type: "uuid", name: "project_id" })
  projectId!: string;

  @Column({ type: "uuid", name: "creator_id" })
  creatorId!: string;

  @Column({ type: "uuid", name: "reviewer_id", nullable: true })
  reviewerId?: string;

  @Column({ type: "date" })
  logDate!: Date;

  @Column({ type: "enum", enum: WeatherType, default: WeatherType.SUNNY })
  weather!: WeatherType;

  @Column({ type: "varchar", length: 50, nullable: true })
  temperature?: string;

  @Column({ type: "text", name: "work_content", nullable: true })
  workContent?: string;

  @Column({ type: "text", name: "quality_status", nullable: true })
  qualityStatus?: string;

  @Column({ type: "text", name: "safety_status", nullable: true })
  safetyStatus?: string;

  @Column({ type: "text", name: "material_usage", nullable: true })
  materialUsage?: string;

  @Column({ type: "text", name: "equipment_usage", nullable: true })
  equipmentUsage?: string;

  @Column({ type: "text", name: "labor_info", nullable: true })
  laborInfo?: string;

  @Column({ type: "text", name: "problems", nullable: true })
  problems?: string;

  @Column({ type: "text", name: "solutions", nullable: true })
  solutions?: string;

  @Column({ type: "text", name: "tomorrow_plan", nullable: true })
  tomorrowPlan?: string;

  @Column({ type: "jsonb", default: [] })
  photos!: string[];

  @Column({ type: "enum", enum: LogStatus, default: LogStatus.DRAFT })
  status!: LogStatus;

  @Column({ type: "text", name: "review_comment", nullable: true })
  reviewComment?: string;

  @Column({ type: "timestamp", name: "reviewed_at", nullable: true })
  reviewedAt?: Date;

  @ManyToOne(() => Project)
  project?: Project;

  @ManyToOne(() => User)
  creator?: User;

  @ManyToOne(() => User)
  reviewer?: User;

  @ManyToMany(() => User)
  @JoinTable({
    name: "log_collaborators",
    joinColumn: { name: "log_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "user_id", referencedColumnName: "id" }
  })
  collaborators?: User[];
}
