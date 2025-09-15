import { RepositoryRegistry } from "./repository-registry";
import { ServiceRegistry } from "./service-registry";
import { UsecaseRegistry } from "./usecase-registry";

export class DependencyInjection{
    static registerAll(): void {
        RepositoryRegistry.registerRepositories();
        ServiceRegistry.registerServices();
        UsecaseRegistry.registerUsecases();
    }
}