import User from "../../models/auth/user.js";
class UserController {
  async me(req, res, next) {
    try {
      const { user, userProfile, adminProfile } = req;
      res.send({ user, userProfile, adminProfile });
      // res.send({
      //   users: await User.find({}, { password: 0 }),
      //   total: await User.count(),
      // });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send(e.message);
    }
  }
  async read(req, res, next) {
    try {
      res.send({
        users: await User.find({}, { password: 0 }),
        total: await User.count(),
      });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send(e.message);
    }
  }

  async find(req, res, next) {
    console.log(req.params);
    const { id } = req.params;
    if (!id) return res.status(422).send("ID missing");
    try {
      res.send({ user: await User.findOne({ _id: id }, { password: 0 }) });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send(e.message);
    }
  }

  async roles(req, res, next) {
    console.log(req.params);
    const { id } = req.params;
    if (!id) return res.status(422).send("ID missing");
    try {
      const user = await User.findOne({ _id: id }, { password: 0 });
      console.log(await app.UserRole.find());
      res.send({
        userRoles: await app.UserRole.find({ user: id })
          .populate("role")
          .populate("user", { password: 0 }),
      });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send(e.message);
    }
  }
  async createRoles(req, res, next) {
    const { id } = req.params;
    const { role } = req.body;
    console.log(req.params, role);
    if (!id) return res.status(422).send("ID missing");
    try {
      const user = await User.findOne({ _id: id }, { password: 0 });
      if (user) {
        await app.UserRole.create({ user: id, role });
        res.send({ userRoles: await app.UserRole.find({ user: id }) });
      } else {
        res.status(404).send("user not found");
      }
    } catch (e) {
      console.log(e.message);
      return res.status(500).send(e.message);
    }
  }
  async deleteRoles(req, res, next) {
    console.log(req.params);
    const { id } = req.params;
    if (!id) return res.status(422).send("ID missing");
    try {
      const user = await User.findOne({ _id: id }, { password: 0 });
      console.log(await app.UserRole.find());
      res.send({ userRoles: await app.UserRole.find({ user: id }) });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send(e.message);
    }
  }

  async create(req, res, next) {
    const { user } = req.body;
    if (!user.name) return res.status(422).send("Name missing");
    try {
      const resp = await User.create({ name: user.name });
      res.send({ resp });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send(e.message);
    }
  }
  async update(req, res, next) {
    const { user } = req.body;

    try {
      const resp = await User.updateOne({}, user);
      res.send({ resp });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send(e.message);
    }
  }
}
export default UserController;
