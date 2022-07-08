import Contact from "../../models/app/Contact.js";
class ContactController {
  async read(req, res, next) {
    try {
      if (!req.adminProfile) return res.status(404).send("Forbidden");
      const { page = 1, size = 10 } = req.query;
      const limit = parseInt(size);
      const skip = (page - 1) * size;
      const contact = await Contact.find({})
        .sort("-createdAt")
        .skip(skip)
        .limit(limit);
      res.send({
        page,
        total: await Contact.count(),
        contact,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send(error.message);
    }
  }

  async Contact(req, res, next) {
    const { name, email, phone, message } = req.body;
    if (!message) return res.status(400).send("Message missing");
    try {
      const resp = await Contact.create({
        name,
        email,
        phone,
        message
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
    const contact = await Contact.findOne({ _id: id });
    if (!contact) return res.status(400).send("Contact not found");
    try {
      await Contact.deleteOne({ _id: id });
      return res.status(200).send({ contact: Contact._id });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send(e.message);
    }
  }
}
export default ContactController;
