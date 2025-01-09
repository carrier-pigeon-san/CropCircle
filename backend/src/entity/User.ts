import { Entity, Column, Unique, Index, BeforeInsert, OneToMany } from "typeorm"
import { IsEmail, IsNotEmpty, IsOptional, Matches } from "class-validator"
import { BaseModel } from "./BaseModel"
import { Campaign } from "./Campaign"
import { Enrollments } from "./Enrollment"
import * as bcrypt from "bcrypt"

export enum UserRole {
    FARMER = "farmer",
    BUYER = "buyer"
}

@Entity()
@Unique(["email"])
export class User extends BaseModel{
    @Column({name: "first_name", type: "varchar", length: 50, nullable: false})
    @IsNotEmpty({message: "First name is required"})
    @Matches(/^[a-zA-Z]+([-'\s][a-zA-Z]+)*$/, {message: "First name can only contain letters, hyphens, and apostrophes"})
    firstName!: string

    @Column({name: "last_name", type: "varchar", length: 50, nullable: false})
    @Matches(/^[a-zA-Z]+([-'\s][a-zA-Z]+)*$/, {message: "Last name can only contain letters, hyphens, and apostrophes"})
    lastName!: string

    @Index({unique: true})
    @Column({type: "varchar", length: 255, nullable: false})
    @IsNotEmpty({message: "Email is required"})
    @IsEmail({}, {message: "Invalid email"})
    email!: string

    @Column({type: "varchar", length: 255, nullable: false})
    @IsNotEmpty({message: "Password is required"})
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
      message: "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number"
    })
    password!: string

    @Column({type: "enum", enum: UserRole, default: UserRole.BUYER})
    role!: UserRole

    @Index({spatial: true})
    @Column({
      type: "geography",
      spatialFeatureType: "Point",
      srid: 4326,
      nullable: true,
      transformer: {
        from: (value: string | null) => {
          if (!value) return null
          const matches = value.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
          if (!matches || matches.length !== 3) {
            throw new Error("Invalid POINT format in database")
          }
          return {type: "Point", coordinates: [parseFloat(matches[1]), parseFloat(matches[2])]}
        },
        to: (value: {type: "Point", coordinates: [number, number]} | null) => {
          if (!value) return null
          return `POINT(${value.coordinates[0]} ${value.coordinates[1]})`
        }
      }
    })
    location!: {type: "Point", coordinates: [number, number]}

    @BeforeInsert()
    async hashPassword() {
      this.password = await bcrypt.hash(this.password, 10)
    }

    @OneToMany(() => Campaign, campaign => campaign.initiator)
    @IsOptional()
    campaigns!: Campaign[]

    @OneToMany(() => Enrollments, enrollment => enrollment.farmer)
    enrollments!: Enrollments[]
}
