import { injectable } from "tsyringe";
import { BaseRepository } from "./base-repository.mongo";
import { IUser } from "../../domain/models/user";
import { IUserRepository } from "../../domain/interfaces/repository/user.repository";
import { User } from "../database/schemas/user.schema";

@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
    constructor(){
        super(User)
    }
}