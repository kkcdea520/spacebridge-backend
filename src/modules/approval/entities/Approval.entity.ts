import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../../common/entities/Base.entity";
import { User } from "../../system/entities/User.entity";
import { Project } from "../../project/entities/Project.entity";
import { ApprovalRecord } from "./ApprovalRecord.entity";

export enum ApprovalStatus {
  DRAFT = "draft",
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  WITHDRAWN = "withdrawn"
}

export enum ApprovalType {
  LEAVE = "leave",
  EXPENSE = "expense",
  PURCHASE = "purchase",
  CONTRACT = "contract",
  ATTENDANCE_EXCEPTION = "attendance_exception",
  QUALITY_ISSUE = "quality_issue",
  SAFETY_ISSUE = "safety_issue",
  OTHER = "other"
}

@Entity("approvals")
export class Approval extends BaseEntity {
  @Column({ type: "varchar", length: 200 })
  title!: string;

  @Column({ type: "enum", enum: ApprovalType })
  type!: ApprovalType;

  @Column({ type: "enum", enum: ApprovalStatus, default: ApprovalStatus.DRAFT })
  status!: ApprovalStatus;

  @Column({ type: "uuid", name: "project_id", nullable: true })
  projectId?: string;

  @Column({ type: "uuid", name: "applicant_id" })
  applicantId!: string;

  @Column({ type: "uuid", name: "template_id", nullable: true })
  templateId?: string;

  @Column({ type: "text", nullable: true })
  content?: string;

  @Column({ type: "jsonb", default: {} })
  formData!: Record<string, any>;

  @Column({ type: "jsonb", default: [] })
  attachments!: string[];

  @Column({ type: "int", name: "current_step", default: 0 })
  currentStep!: number;

  @Column({ type: "timestamp", name: "submitted_at", nullable: true })
  submittedAt?: Date;

  @Column({ type: "timestamp", name: "completed_at", nullable: true })
  completedAt?: Date;

  @ManyToOne(() => Project)
  project?: Project;

  @ManyToOne(() => User)
  applicant?: User;

  @OneToMany(() => ApprovalRecord, (record) => record.approval, { cascade: true })
  records?: ApprovalRecord[];
}
