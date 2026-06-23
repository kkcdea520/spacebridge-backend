import { Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { BaseEntity } from "../../../common/entities/Base.entity";
import { Role } from "./Role.entity";
import { Department } from "./Department.entity";
import { Project } from "../../project/entities/Project.entity";

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended"
}

@Entity("users")
export class User extends BaseEntity {
  @Column({ type: "varchar", length: 50, unique: true })
  username!: string;

  @Column({ type: "varchar", length: 255, select: false })
  password!: string;

  @Column({ type: "varchar", length: 50 })
  realName!: string;

  @Column({ type: "varchar", length: 20, unique: true, nullable: true })
  phone?: string;

  @Column({ type: "varchar", length: 100, unique: true, nullable: true })
  email?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  avatar?: string;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.ACTIVE })
  status!: UserStatus;

  @Column({ type: "uuid", name: "department_id", nullable: true })
  departmentId?: string;

  @ManyToOne(() => Department, (department) => department.users)
  department?: Department;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: "user_roles",
    joinColumn: { name: "user_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "role_id", referencedColumnName: "id" }
  })
  roles?: Role[];

  @ManyToMany(() => Project, (project) => project.members)
  @JoinTable({
    name: "project_members",
    joinColumn: { name: "user_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "project_id", referencedColumnName: "id" }
  })
  projects?: Project[];
}
