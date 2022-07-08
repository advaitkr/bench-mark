import getAuthenticateRequest from "../utils/auth/authenticateRequest.js";
import ProductCategoryController from "../controllers/app/ProductCategoryController.js";

const regRoutes = (app) => {
  //ProductCategory routes registrations
  const productCategoryController = new ProductCategoryController();
  app.get(`/v1/product-categories`, productCategoryController.read);
  app.get(`/v1/all-product-categories`, productCategoryController.readAll);
  app.post(
    `/v1/product-category`,
    // getAuthenticateRequest(app),
    productCategoryController.create
  );
  app.patch(
    `/v1/product-category/:id`,
    // getAuthenticateRequest(app),
    productCategoryController.update
  );
  app.delete(
    `/v1/product-category/:id`,
    getAuthenticateRequest(app),
    productCategoryController.delete
  );
};
export default regRoutes;
