import { Entity, Column, OneToMany, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../common/entities/Base.entity";
import { User } from "./User.entity";

@Entity("departments")
export class Department extends BaseEntity {
  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  description?: string;

  @Column({ type: "int", default: 0 })
  sort!: number;

  @Column({ type: "uuid", name: "parent_id", nullable: true })
  parentId?: string;

  @ManyToOne(() => Department, (department) => department.children, { nullable: true })
  parent?: Department;

  @OneToMany(() => Department, (department) => department.parent)
  children?: Department[];

  @OneToMany(() => User, (user) => user.department)
  users?: User[];
}
