import getAuthenticateRequest from "../utils/auth/authenticateRequest.js";
import ProductController from "../controllers/app/ProductController.js";
import getUserDetails from "../utils/auth/getUserDetails.js";

const regRoutes = (app) => {
  //VendorProduct routes registrations
  const productController = new ProductController();
  app.get(
    `/v1/vendor-products`,
    // getAuthenticateRequest(app),
    // getUserDetails,
    productController.read
  );
  app.get(
    `/v1/admin/vendor-products`,
    getAuthenticateRequest(app),
    getUserDetails,
    productController.adminRead
  );
  app.get(
    `/v1/vendor-product/:id`,
    // getAuthenticateRequest(app),
    productController.find
  );
  app.get(
    `/v1/vendor-product/:id/products`,
    // getAuthenticateRequest(app),
    productController.findVendorProductsUsingVendorId
  );
  app.get(
    `/v1/vendor/:id/products`,
    // getAuthenticateRequest(app),
    productController.findVendorProductsUsingVendorId
  );
  app.get(
    `/v1/vendor-products/search`,
    productController.searchVendorProduct
  );
  app.post(
    `/v1/vendor-product`,
    getAuthenticateRequest(app),
    getUserDetails,
    productController.create
  );
  app.patch(
    `/v1/vendor-product/:id`,
    getAuthenticateRequest(app),
    getUserDetails,
    productController.update
  );
  app.patch(
    `/v1/vendor-product/:id/edit`,
    getAuthenticateRequest(app),
    getUserDetails,
    productController.edit
  );
  app.delete(
    `/v1/vendor-product/:id`,
    getAuthenticateRequest(app),
    productController.delete
  );
};
export default regRoutes;
