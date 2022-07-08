import fileUpload from "../../helpers/fileUpload/index.js";
class FileUploadController {
  async find(req, res, next) {
    const { id } = req.params;
    if (!id) return res.status(400).send("ID missing");
    const fileInfo = await FileUpload.findOne({ _id: id });
    if (!fileInfo) return res.status(400).send("File not found");
    try {
      const file = fileInfo.path;
      return res.download(file);
    } catch (error) {
      console.log(error.message);
      return res.status(500).send(error.message);
    }
  }

  async create(req, res, next) {
    await fileUpload(req, res, next);
  }

  async createPublic(req, res, next) {
    await fileUpload(req, res, next);
  }
}
export default FileUploadController;
