import getAuthenticateRequest from "../utils/auth/authenticateRequest.js";
import EnquiryController from "../controllers/app/EnquiryController.js";
import getUserDetails from "../utils/auth/getUserDetails.js";

const regRoutes = (app) => {
  //Your Enquiry routes registrations
  const enquiryController = new EnquiryController();
  app.get(
    `/v1/enquiry`,
    getAuthenticateRequest(app),
    getUserDetails,
    enquiryController.read
  );
  app.post(
    `/v1/enquiry`,
    enquiryController.Enquiry
  );
  app.delete(
    `/v1/enquiry/:id`,
    getAuthenticateRequest(app),
    getUserDetails,
    enquiryController.delete
  );
};
export default regRoutes;
