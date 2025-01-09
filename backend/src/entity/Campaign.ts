import { Column, Index, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseModel } from "./BaseModel";
import { Enrollments } from "./Enrollment";
import { User } from "./User";

export enum CampaignStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

@Entity()
export class Campaign extends BaseModel {
  @Column({type: "varchar", length: 50, nullable: false})
  title!: string

  @ManyToOne(() => User, user => user.campaigns, {nullable: false})
  initiator!: User

  @Column({type: "varchar", length: 50, nullable: false})
  crop!: string

  @Column({type: "text", nullable: false})
  description!: string

  @Column({name: "target_quantity", type: "int", nullable: false})
  targetQuantity!: number

  @Column({name: "current_quantity", type: "int", nullable: false})
  currentQuantity!: number

  @Column({name: "start_date", type: "date", nullable: false})
  startDate!: Date

  @Column({type: "date", nullable: false})
  deadline!: Date

  @Index({spatial: true})
  @Column({
    type: "geography",
    spatialFeatureType: "Point",
    srid: 4326,
    nullable: false,
    transformer: {
      from: (value: string) => {
        if (!value) return null;
        const matches = value.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
        if (!matches || matches.length !== 3) {
          throw new Error("Invalid POINT format in database");
        }
        return {type: "Point", coordinates: [parseFloat(matches[1]), parseFloat(matches[2])]};
      },
      to: (value: {type: "Point", coordinates: [number, number]}) => {
        if (!value) return null;
        return `POINT(${value.coordinates[0]} ${value.coordinates[1]})`;
      }
    }
  })
  location!: {type: "Point", coordinates: [number, number]}

  @Column({type: "enum", enum: CampaignStatus, default: CampaignStatus.PENDING})
  status!: CampaignStatus

  @OneToMany(() => Enrollments, enrollment => enrollment.campaign)
  enrollments!: Enrollments[]
}
