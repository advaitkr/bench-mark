import getAuthenticateRequest from "../utils/auth/authenticateRequest.js";
import HomeBannerController from "../controllers/app/HomeBannerController.js";

const regRoutes = (app) => {
  //HomeBanner routes registrations
  const homeBannerController = new HomeBannerController();
  app.get(`/v1/home-banners`, homeBannerController.read);
  app.get(`/v1/home-banner/:id`, homeBannerController.find);
  app.post(
    `/v1/home-banner`,
    getAuthenticateRequest(app),
    homeBannerController.create
  );
  app.patch(
    `/v1/home-banner/:id`,
    getAuthenticateRequest(app),
    homeBannerController.update
  );
  app.delete(
    `/v1/home-banner/:id`,
    getAuthenticateRequest(app),
    homeBannerController.delete
  );
};
export default regRoutes;
