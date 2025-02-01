import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Enrollments } from "./entity/Enrollment"
import { Campaign } from "./entity/Campaign"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "cc_dev",
    password: "CC_dev_pwd1",
    database: "cc_dev_db",
    synchronize: true,
    logging: false,
    entities: [User, Enrollments, Campaign],
    migrations: [],
    subscribers: [],
})
