import { container } from "tsyringe";
import { IUserRepository } from "../../domain/interfaces/repository/user.repository";
import { UserRepository } from "../../interfaceAdapters/repositories/user-repository.mongo";

export class RepositoryRegistry {
  static registerRepositories(): void {
    container.register<IUserRepository>('IUserRepository' , {
        useClass : UserRepository
    })
  }
}
