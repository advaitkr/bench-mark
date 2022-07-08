import FileUpload from "../../models/app/fileUpload.js";
import fileUploadLocal from "./fileUploadLocal.js";
import fileUploadToS3 from "./s3Config.js";

const fileUpload = async (req, res) => {
  if (process.env.BENCHMARK_NODE_ENV === "development") {
    console.log("Development calling");
    console.log("req.body: ", req.body, "authorization" in req.headers);
    console.log("res.req.file: ", res.req.file);
    fileUploadLocal(req, res, (error) => {
      if (error) {
        console.log("errors", error);
        return res.send({ error: error });
      } else {
        if (!req.file) {
          res.status(400).send("No files were uploaded");
        } else {
          const { filename, path, mimetype } = res.req.file;
          let filePath = `${process.env.BENCHMARK_API_URL}/file/${res.req.file.filename}`;
          if (!filename) return res.status(400).send("File name missing");
          if (!path) return res.status(400).send("Path missing");
          if (!mimetype) return res.status(400).send("Mimetype missing");
          try {
            FileUpload.create({
              filename,
              filePath,
              absolutePath: path,
              mimetype,
            });
          } catch (e) {
            console.log(e);
            return res
              .status(500)
              .send("Unable to process your request, Please try again later");
          }
          return res.send({ filePath });
        }
      }
    });
  }
  if (process.env.BENCHMARK_NODE_ENV === "production1") {
    console.log("Production calling");
    fileUploadToS3(req, res, (error) => {
      if (error) {
        console.log("errors", error);
        return res.send({ error: error });
      } else {
        const { path, key, location, mimetype } = res.req.file;
        if (!req.file) {
          res.status(400).send("No files were uploaded");
        } else {
          if (!key) return res.status(400).send("File name missing");
          if (!location) return res.status(400).send("Path missing");
          if (!mimetype) return res.status(400).send("Mimetype missing");
          try {
            FileUpload.create({
              filename: key,
              filePath: location,
              absolutePath: path,
              mimetype,
            });
            console.log("uploading file");
          } catch (e) {
            console.log(e);
            return res
              .status(500)
              .send("Unable to process your request, Please try again later");
          }
          return res.status(200).send(res.req.file);
        }
      }
    });
  }
};

export default fileUpload;
