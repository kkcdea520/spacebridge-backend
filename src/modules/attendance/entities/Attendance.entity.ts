import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../common/entities/Base.entity";
import { User } from "../../system/entities/User.entity";
import { Project } from "../../project/entities/Project.entity";

export enum AttendanceType {
  CLOCK_IN = "clock_in",
  CLOCK_OUT = "clock_out"
}

export enum AttendanceMethod {
  GPS = "gps",
  FACE = "face",
  IP = "ip",
  QR = "qr"
}

export enum AttendanceStatus {
  NORMAL = "normal",
  LATE = "late",
  EARLY = "early",
  ABSENT = "absent",
  EXCEPTION = "exception"
}

@Entity("attendances")
export class Attendance extends BaseEntity {
  @Column({ type: "uuid", name: "user_id" })
  userId!: string;

  @Column({ type: "uuid", name: "project_id", nullable: true })
  projectId?: string;

  @Column({ type: "enum", enum: AttendanceType })
  type!: AttendanceType;

  @Column({ type: "enum", enum: AttendanceMethod })
  method!: AttendanceMethod;

  @Column({ type: "timestamp", name: "check_time" })
  checkTime!: Date;

  @Column({ type: "enum", enum: AttendanceStatus, default: AttendanceStatus.NORMAL })
  status!: AttendanceStatus;

  @Column({ type: "decimal", precision: 10, scale: 6, name: "latitude", nullable: true })
  latitude?: number;

  @Column({ type: "decimal", precision: 10, scale: 6, name: "longitude", nullable: true })
  longitude?: number;

  @Column({ type: "varchar", length: 500, name: "location_address", nullable: true })
  locationAddress?: string;

  @Column({ type: "varchar", length: 255, name: "photo_url", nullable: true })
  photoUrl?: string;

  @Column({ type: "varchar", length: 50, name: "device_ip", nullable: true })
  deviceIp?: string;

  @Column({ type: "text", name: "remark", nullable: true })
  remark?: string;

  @Column({ type: "boolean", name: "is_offline", default: false })
  isOffline!: boolean;

  @Column({ type: "uuid", name: "exception_approval_id", nullable: true })
  exceptionApprovalId?: string;

  @ManyToOne(() => User)
  user?: User;

  @ManyToOne(() => Project)
  project?: Project;
}
