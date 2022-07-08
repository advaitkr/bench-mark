import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const __dirname = path.resolve();
const maxSize = 15 * 1024 * 1024; // for 5MB

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "public/uploads"));
  },
  filename: function (req, file, callback) {
    callback(null, uuidv4() + path.extname(file.originalname));
  },
});
const fileUploadLocal = multer({ storage: storage, limits: { fileSize: maxSize }}).single("file");
export default fileUploadLocal;
