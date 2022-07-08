import User from "../../models/auth/user.js";
import CustomerProfile from "../../models/app/customerProfile.js";
import AdminProfile from "../../models/app/adminProfile.js";

const getUserDetails = async (req, res, next) => {
  // console.log("req.token");

  req.user = await User.findOne(
    { _id: req.token?.user },
    { password: 0, otp: 0 }
  );
  req.adminProfile = await AdminProfile.findOne({ user: req.token?.user });
  console.log("admin", req.adminProfile)
  console.log("user", req.userProfile)
  console.log("token: ",req.token)

  next();
};
export default getUserDetails;