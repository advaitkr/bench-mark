import userRoutes from "./userRoutes.js";
import enquiryRoutes from "./enquiryRoutes.js";
import contactRoutes from "./contactRoutes.js";
import productRoutes from "./productRoutes.js";
import productCategoryRoutes from "./productCategoryRoutes.js"
import homeBannerRoutes from "./homeBannerRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import fileuploadRoutes from "./fileUploadRoutes.js";

const regRoutes = (app) => {
  userRoutes(app);
  enquiryRoutes(app);
  contactRoutes(app);
  productRoutes(app);
  productCategoryRoutes(app);
  homeBannerRoutes(app);
  dashboardRoutes(app);
  fileuploadRoutes(app);
};
export default regRoutes;
