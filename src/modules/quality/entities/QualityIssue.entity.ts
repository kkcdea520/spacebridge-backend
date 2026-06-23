import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../../common/entities/Base.entity";
import { User } from "../../system/entities/User.entity";
import { Project } from "../../project/entities/Project.entity";

export enum QualityStatus {
  FOUND = "found",
  RECTIFYING = "rectifying",
  RECTIFIED = "rectified",
  VERIFIED = "verified",
  CLOSED = "closed"
}

export enum QualityLevel {
  MINOR = "minor",
  MEDIUM = "medium",
  MAJOR = "major",
  CRITICAL = "critical"
}

@Entity("quality_issues")
export class QualityIssue extends BaseEntity {
  @Column({ type: "uuid", name: "project_id" })
  projectId!: string;

  @Column({ type: "varchar", length: 200 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "enum", enum: QualityLevel, default: QualityLevel.MINOR })
  level!: QualityLevel;

  @Column({ type: "enum", enum: QualityStatus, default: QualityStatus.FOUND })
  status!: QualityStatus;

  @Column({ type: "uuid", name: "reporter_id" })
  reporterId!: string;

  @Column({ type: "uuid", name: "responsible_id", nullable: true })
  responsibleId?: string;

  @Column({ type: "uuid", name: "verifier_id", nullable: true })
  verifierId?: string;

  @Column({ type: "timestamp", name: "found_date" })
  foundDate!: Date;

  @Column({ type: "timestamp", name: "deadline_date", nullable: true })
  deadlineDate?: Date;

  @Column({ type: "varchar", length: 200, name: "location", nullable: true })
  location?: string;

  @Column({ type: "varchar", length: 200, name: "sub_item", nullable: true })
  subItem?: string;

  @Column({ type: "jsonb", default: [] })
  photos!: string[];

  @Column({ type: "text", name: "rectify_measure", nullable: true })
  rectifyMeasure?: string;

  @Column({ type: "text", name: "rectify_result", nullable: true })
  rectifyResult?: string;

  @Column({ type: "timestamp", name: "rectified_at", nullable: true })
  rectifiedAt?: Date;

  @Column({ type: "text", name: "verify_comment", nullable: true })
  verifyComment?: string;

  @Column({ type: "timestamp", name: "verified_at", nullable: true })
  verifiedAt?: Date;

  @ManyToOne(() => Project)
  project?: Project;

  @ManyToOne(() => User)
  reporter?: User;

  @ManyToOne(() => User)
  responsible?: User;

  @ManyToOne(() => User)
  verifier?: User;
}
