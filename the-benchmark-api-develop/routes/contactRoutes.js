import getAuthenticateRequest from "../utils/auth/authenticateRequest.js";
import ContactController from "../controllers/app/ContactController.js";
import getUserDetails from "../utils/auth/getUserDetails.js";

const regRoutes = (app) => {
  //Your Enquiry routes registrations
  const contactController = new ContactController();
  app.get(
    `/v1/contact`,
    getAuthenticateRequest(app),
    getUserDetails,
    contactController.read
  );
  app.post(
    `/v1/contact`,
    contactController.Contact
  );
  app.delete(
    `/v1/contact/:id`,
    getAuthenticateRequest(app),
    getUserDetails,
    contactController.delete
  );
};
export default regRoutes;
