import VendorProduct from "../../models/app/vendorProduct.js";
import Enquiry from "../../models/app/Enquiry.js";
import Contact from "../../models/app/Contact.js";
import productCategory from "../../models/app/productCategory.js";

class DashboardController {
    async calcAdminKPI(req, res, next) {
        try {
            if (!req.adminProfile) return res.status(404).send("Forbidden");
            const totalProducts = await VendorProduct.count({})
            const totalEnquiries = await Enquiry.count({})
            const totalContacts = await Contact.count({})
            const totalCategories = await productCategory.count({parentId: {$exists: false}})
            res.send({
                totalProducts,
                totalEnquiries,
                totalContacts,
                totalCategories
            });
        } catch (error) {
            console.log(error.message);
            return res.status(500).send(error.message);
        }
        return
    }    
}
export default DashboardController;
