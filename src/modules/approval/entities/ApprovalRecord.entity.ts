import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../common/entities/Base.entity";
import { User } from "../../system/entities/User.entity";
import { Approval } from "./Approval.entity";

export enum ApprovalAction {
  SUBMIT = "submit",
  APPROVE = "approve",
  REJECT = "reject",
  TRANSFER = "transfer",
  WITHDRAW = "withdraw",
  COMMENT = "comment"
}

@Entity("approval_records")
export class ApprovalRecord extends BaseEntity {
  @Column({ type: "uuid", name: "approval_id" })
  approvalId!: string;

  @Column({ type: "uuid", name: "approver_id" })
  approverId!: string;

  @Column({ type: "enum", enum: ApprovalAction })
  action!: ApprovalAction;

  @Column({ type: "text", nullable: true })
  comment?: string;

  @Column({ type: "int", name: "step_order", default: 0 })
  stepOrder!: number;

  @Column({ type: "varchar", length: 100, name: "step_name", nullable: true })
  stepName?: string;

  @Column({ type: "uuid", name: "next_approver_id", nullable: true })
  nextApproverId?: string;

  @ManyToOne(() => Approval, (approval) => approval.records)
  approval?: Approval;

  @ManyToOne(() => User)
  approver?: User;
}
