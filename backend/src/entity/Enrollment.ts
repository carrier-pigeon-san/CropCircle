import { Entity, Column, ManyToOne, Unique } from "typeorm";
import { BaseModel } from "./BaseModel";
import { User } from "./User";
import { Campaign } from "./Campaign";

export enum EnrollmentStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected"
}

@Entity()
@Unique(["farmer", "campaign"])
export class Enrollments extends BaseModel {
  @ManyToOne(() => User, user => user.enrollments)
  farmer!: User;

  @ManyToOne(() => Campaign, campaign => campaign.enrollments)
  campaign!: Campaign;

  @Column({ type: "int", nullable: false })
  quantity!: number;

  @Column({ type: "enum", enum: EnrollmentStatus, default: EnrollmentStatus.PENDING })
  status!: EnrollmentStatus;

  @Column({ name: "enrollment_date", type: "date", nullable: true })
  enrollmentDate!: Date;
}
