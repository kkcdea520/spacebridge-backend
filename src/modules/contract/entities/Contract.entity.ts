import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../common/entities/Base.entity";
import { Project } from "../../project/entities/Project.entity";

export enum ContractType {
  MAIN_CONTRACT = "main_contract",
  SUB_CONTRACT = "sub_contract",
  MATERIAL_CONTRACT = "material_contract",
  EQUIPMENT_CONTRACT = "equipment_contract",
  LABOR_CONTRACT = "labor_contract",
  OTHER = "other"
}

export enum ContractStatus {
  DRAFT = "draft",
  PENDING_APPROVAL = "pending_approval",
  ACTIVE = "active",
  PERFORMING = "performing",
  COMPLETED = "completed",
  TERMINATED = "terminated"
}

@Entity("contracts")
export class Contract extends BaseEntity {
  @Column({ type: "varchar", length: 200 })
  name!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  code!: string;

  @Column({ type: "enum", enum: ContractType })
  type!: ContractType;

  @Column({ type: "enum", enum: ContractStatus, default: ContractStatus.DRAFT })
  status!: ContractStatus;

  @Column({ type: "uuid", name: "project_id", nullable: true })
  projectId?: string;

  @Column({ type: "varchar", length: 200, name: "party_a", nullable: true })
  partyA?: string;

  @Column({ type: "varchar", length: 200, name: "party_b", nullable: true })
  partyB?: string;

  @Column({ type: "decimal", precision: 15, scale: 2, name: "contract_amount", nullable: true })
  contractAmount?: number;

  @Column({ type: "date", name: "sign_date", nullable: true })
  signDate?: Date;

  @Column({ type: "date", name: "start_date", nullable: true })
  startDate?: Date;

  @Column({ type: "date", name: "end_date", nullable: true })
  endDate?: Date;

  @Column({ type: "jsonb", name: "payment_plan", default: [] })
  paymentPlan!: any[];

  @Column({ type: "decimal", precision: 15, scale: 2, name: "paid_amount", default: 0 })
  paidAmount!: number;

  @Column({ type: "text", name: "content", nullable: true })
  content?: string;

  @Column({ type: "jsonb", default: [] })
  attachments!: string[];

  @Column({ type: "text", name: "remark", nullable: true })
  remark?: string;

  @ManyToOne(() => Project)
  project?: Project;
}
