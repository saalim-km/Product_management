import { IUser } from "../../models/user";
import { IBaseRepository } from "./base.repository";

export interface IUserRepository extends IBaseRepository<IUser>  {
    
}