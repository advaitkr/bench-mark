import HomeBanner from "../../models/app/homeBanner.js";
class HomeBannerController {
  async read(req, res, next) {
    try {
      res.send({
        homeBanners: await HomeBanner.find(),
        total: await HomeBanner.count(),
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send(error.message);
    }
  }

  async find(req, res, next) {
    console.log(req.params);
    const { id } = req.params;
    if (!id) return res.status(400).send("ID missing");
    const homeBanner = await HomeBanner.findOne({ _id: id });
    if (!homeBanner) return res.status(400).send("HomeBanner not found");
    try {
      res.send({ homeBanner });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send(error.message);
    }
  }

  async create(req, res, next) {
    const { image, description } = req.body;
    if (!image) return res.status(400).send("Image missing");
    if (!description) return res.status(400).send("Description missing");
    try {
      const resp = await HomeBanner.create({
        image,
        description,
      });
      res.send({ resp });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send(e.message);
    }
  }

  async update(req, res, next) {
    const { id } = req.params;
    if (!id) return res.status(400).send("ID missing");
    const homeBanner = await HomeBanner.findOne({ _id: id });
    if (!homeBanner) return res.status(400).send("HomeBanner not found");
    try {
      await HomeBanner.updateOne({ _id: id }, req.body);
      res.send({
        homeBanner: await HomeBanner.findOne({ _id: id }),
      });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send(e.message);
    }
  }

  async delete(req, res, next) {
    console.log(req.params);
    const { id } = req.params;
    if (!id) return res.status(400).send("ID missing");
    const homeBanner = await HomeBanner.findOne({ _id: id });
    if (!homeBanner) return res.status(400).send("HomeBanner not found");
    try {
      await HomeBanner.deleteOne({ _id: id });
      res.send({ homeBanner: homeBanner._id });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send(e.message);
    }
  }
}
export default HomeBannerController;
