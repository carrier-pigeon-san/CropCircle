import { timeStamp } from "console";
import { BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

export class BaseModel extends BaseEntity {
  [key : string] : any;

  @PrimaryGeneratedColumn("uuid")
  id!: string

  @CreateDateColumn({name: 'created_at', type: "timestamp"})
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: "timestamp"})
  updatedAt!: Date
}
