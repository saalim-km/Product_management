import { categoryController } from "../di/resolver";
import { verifyAuth } from "../middlewares/auth.middleware";
import { BaseRoute } from "./base.route";

export class CategoryRoute extends BaseRoute {
    protected initializeRoutes(): void {
        this.router
        .post('/', verifyAuth,categoryController.addCategory.bind(categoryController))
        .delete('/:id', verifyAuth,categoryController.deleteCategory.bind(categoryController))

        this.router
        .post('/sub/:id',verifyAuth,categoryController.addSubCategory.bind(categoryController))
        .delete('/sub/:id',verifyAuth,categoryController.deleteSubCategory.bind(categoryController))
    }
}