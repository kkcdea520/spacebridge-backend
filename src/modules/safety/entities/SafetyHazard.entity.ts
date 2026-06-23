import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../common/entities/Base.entity";
import { User } from "../../system/entities/User.entity";
import { Project } from "../../project/entities/Project.entity";

export enum SafetyStatus {
  FOUND = "found",
  RECTIFYING = "rectifying",
  RECTIFIED = "rectified",
  VERIFIED = "verified",
  CLOSED = "closed",
  ESCALATED = "escalated"
}

export enum SafetyLevel {
  GENERAL = "general",
  IMPORTANT = "important",
  SEVERE = "severe"
}

@Entity("safety_hazards")
export class SafetyHazard extends BaseEntity {
  @Column({ type: "uuid", name: "project_id" })
  projectId!: string;

  @Column({ type: "varchar", length: 200 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "enum", enum: SafetyLevel, default: SafetyLevel.GENERAL })
  level!: SafetyLevel;

  @Column({ type: "enum", enum: SafetyStatus, default: SafetyStatus.FOUND })
  status!: SafetyStatus;

  @Column({ type: "uuid", name: "checker_id" })
  checkerId!: string;

  @Column({ type: "uuid", name: "responsible_id", nullable: true })
  responsibleId?: string;

  @Column({ type: "uuid", name: "verifier_id", nullable: true })
  verifierId?: string;

  @Column({ type: "timestamp", name: "found_date" })
  foundDate!: Date;

  @Column({ type: "timestamp", name: "deadline_date", nullable: true })
  deadlineDate?: Date;

  @Column({ type: "varchar", length: 200, name: "checkpoint", nullable: true })
  checkpoint?: string;

  @Column({ type: "varchar", length: 500, name: "location", nullable: true })
  location?: string;

  @Column({ type: "jsonb", default: [] })
  photos!: string[];

  @Column({ type: "text", name: "rectify_requirement", nullable: true })
  rectifyRequirement?: string;

  @Column({ type: "text", name: "rectify_result", nullable: true })
  rectifyResult?: string;

  @Column({ type: "timestamp", name: "rectified_at", nullable: true })
  rectifiedAt?: Date;

  @Column({ type: "text", name: "verify_comment", nullable: true })
  verifyComment?: string;

  @Column({ type: "timestamp", name: "verified_at", nullable: true })
  verifiedAt?: Date;

  @Column({ type: "boolean", name: "is_escalated", default: false })
  isEscalated!: boolean;

  @Column({ type: "timestamp", name: "escalated_at", nullable: true })
  escalatedAt?: Date;

  @ManyToOne(() => Project)
  project?: Project;

  @ManyToOne(() => User)
  checker?: User;

  @ManyToOne(() => User)
  responsible?: User;

  @ManyToOne(() => User)
  verifier?: User;
}
