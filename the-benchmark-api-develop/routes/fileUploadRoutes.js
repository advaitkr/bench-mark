import getAuthenticateRequest from "../utils/auth/authenticateRequest.js";
import FileUploadController from "../controllers/app/FileUploadController.js";

const regRoutes = (app) => {
  //File Upload routes registrations
  const fileUploadController = new FileUploadController();
  app.get(
    `/v1/file/:id`,
    getAuthenticateRequest(app),
    fileUploadController.find
  );
  app.post(
    `/v1/file-upload`,
    getAuthenticateRequest(app),
    fileUploadController.create
  );
  app.post(
    `/v1/file-upload-public`,
    fileUploadController.createPublic
  );
};
export default regRoutes;
