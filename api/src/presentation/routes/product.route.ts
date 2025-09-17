import { productController } from "../di/resolver";
import { verifyAuth } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import { BaseRoute } from "./base.route";

export class ProductRoute extends BaseRoute {
  protected initializeRoutes(): void {
    this.router
      .post(
        "/",
        verifyAuth,
        upload.fields([{ name: "images", maxCount: 5 }]),
        productController.createProduct.bind(productController)
      )
      .put(
        "/:id",
        upload.fields([{ name: "images", maxCount: 5 }]),
        verifyAuth,
        productController.updateProduct.bind(productController)
      )
      .get(
        "/",
        verifyAuth,
        productController.getAllProducts.bind(productController)
      )
      .delete(
        "/:id",
        verifyAuth,
        productController.deleteProduct.bind(productController)
      );
  }
}
