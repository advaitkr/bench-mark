import UserController from "../controllers/app/UserController.js";
import getAuthenticateRequest from "../utils/auth/authenticateRequest.js";
// import User from "../../models/auth/user.js";
import User from "../models/auth/user.js";
import CustomerProfile from "../models/app/customerProfile.js";
import AdminProfile from "../models/app/adminProfile.js";

const regRoutes = (app) => {
  //Scope routes registrations
  const userController = new UserController();
  app.get(
    `/v1/users`,
    getAuthenticateRequest(app),
    (req, res, next) => {
      console.log("req.token");
      console.log(req.token);
      next();
    },
    userController.read
  );
  app.get(
    `/v1/me`,
    getAuthenticateRequest(app),
    async (req, res, next) => {
      console.log("req.token");

      req.user = await User.findOne(
        { _id: req.token?.user },
        { password: 0, otp: 0 }
      );
      console.log(req.user);
      req.userProfile = await CustomerProfile.findOne({
        user: req.token?.user?._id,
      }).populate("user", "-password");

      console.log(req.userProfile);
      req.adminProfile = await AdminProfile.findOne({
        user: req.token?.user?._id,
      }).populate('subscription');

      next();
    },
    userController.me
  );
  app.get(`/v1/user/:id`, getAuthenticateRequest(app), userController.find);
  app.get(
    `/v1/user/:id/roles`,
    getAuthenticateRequest(app),
    userController.roles
  );
  app.post(
    `/v1/user/:id/roles`,
    getAuthenticateRequest(app),
    userController.createRoles
  );
  app.post(
    `/v1/user`,
    getAuthenticateRequest(app),

    userController.create
  );
  app.patch(`/v1/user/:id`, getAuthenticateRequest(app), userController.update);
};
export default regRoutes;
