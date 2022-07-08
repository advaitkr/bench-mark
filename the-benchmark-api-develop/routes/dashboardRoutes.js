import getAuthenticateRequest from "../utils/auth/authenticateRequest.js";
import DashboardController from '../controllers/app/DashboardController.js';
import getUserDetails from "../utils/auth/getUserDetails.js";

const regRoutes = (app) => {
    //Product routes registrations
    const dashboardController = new DashboardController();
    app.get(`/v1/admin/dashboard`,
        getAuthenticateRequest(app),
        getUserDetails,
        dashboardController.calcAdminKPI);
};
export default regRoutes;
