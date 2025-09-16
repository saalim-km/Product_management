import { categoryController } from "../di/resolver";
import { verifyAuth } from "../middlewares/auth.middleware";
import { BaseRoute } from "./base.route";

export class CategoryRoute extends BaseRoute {
    protected initializeRoutes(): void {
        this.router
        .post('/', verifyAuth,categoryController.addCategory.bind(categoryController))
        .delete('/:id', verifyAuth,categoryController.deleteCategory.bind(categoryController))
        .get('/', verifyAuth,categoryController.getAllCategories.bind(categoryController))

        this.router
        .post('/sub',verifyAuth,categoryController.addSubCategory.bind(categoryController))
        .delete('/sub/:id',verifyAuth,categoryController.deleteSubCategory.bind(categoryController))
        .get('/sub',verifyAuth,categoryController.getallSubCategories.bind(categoryController));
    }
}