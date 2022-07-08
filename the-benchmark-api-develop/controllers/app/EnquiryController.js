import Enquiry from "../../models/app/Enquiry.js";
class EnquiryController {
  async read(req, res, next) {
    try {
      if (!req.adminProfile) return res.status(404).send("Forbidden");
      const { page = 1, size = 10 } = req.query;
      const limit = parseInt(size);
      const skip = (page - 1) * size;
      const enquiry = await Enquiry.find({})
        .populate("categoryId")
        .populate("subCategory")
        .sort("-createdAt")
        .skip(skip)
        .limit(limit);
      res.send({
        page,
        total: await Enquiry.count(),
        enquiry,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send(error.message);
    }
  }

  async Enquiry(req, res, next) {
    const { name, email, phone, address, categoryId, subCategory, message,ischecked } = req.body;
    if (!message) return res.status(400).send("Message missing");
    
    try {
      const resp = await Enquiry.create({
        name,
        email,
        phone,
        address,
        categoryId, 
        subCategory, 
        message,
        ischecked,
      });
      res.send({ resp });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send(e.message);
    }
  }

  async delete(req, res, next) {
    console.log(req.params);
    const { id } = req.params;
    const { adminProfile } = req;
    if (!adminProfile) return res.status(404).send("Forbidden");
    if (!id) return res.status(400).send("ID missing");
    const enquiry = await Enquiry.findOne({ _id: id });
    if (!enquiry) return res.status(400).send("Enquiry not found");
    try {
      await Enquiry.deleteOne({ _id: id });
      return res.status(200).send({ enquiry: Enquiry._id });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send(e.message);
    }
  }
}
export default EnquiryController;
