import { Entity, Column, ManyToMany } from "typeorm";
import { BaseEntity } from "../../../common/entities/Base.entity";
import { User } from "./User.entity";

@Entity("roles")
export class Role extends BaseEntity {
  @Column({ type: "varchar", length: 50, unique: true })
  name!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  displayName?: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "jsonb", default: {} })
  permissions!: Record<string, any>;

  @Column({ type: "boolean", default: false, name: "is_system" })
  isSystem!: boolean;

  @ManyToMany(() => User, (user) => user.roles)
  users?: User[];
}
