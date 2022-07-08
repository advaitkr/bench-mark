import aws from "aws-sdk";
import multerS3 from "multer-s3";
import multer from "multer";
import path from "path";
import awsCredentials from "./s3Credentials.js";
console.log("awsCredentials: ", awsCredentials);
const s3 = new aws.S3({
  accessKeyId: awsCredentials.BENCHMARK_AWS_ACCESSKEY,
  secretAccessKey: awsCredentials.BENCHMARK_AWS_SECRET_ACCESS_KEY,
  Bucket: awsCredentials.BENCHMARK_BUCKET_NAME,
});

/**
 * Single Upload
 */
const maxSize = 15 * 1024 * 1024; // for 15MB
const fileUploadToS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: awsCredentials.BENCHMARK_BUCKET_NAME,
    acl: "",
    key: function (req, file, cb) {
      cb(
        null,
        path.basename(file.originalname, path.extname(file.originalname)) +
          "-" +
          Date.now() +
          path.extname(file.originalname)
      );
    },
  }),
  limits: { fileSize: maxSize }, // In bytes = 5 MB
  /*   fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }, */
}).single("file");

/**
 * Check File Type
 * @param file
 * @param cb
 * @return {*}
 */
/* function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /pdf|docx|doc/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
} */

export default fileUploadToS3;
