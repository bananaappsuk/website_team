const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");




const myS3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS,
  },
  region: process.env.AWS_S3_REGION,
});


const upload = multer({
  storage: multerS3({
    s3: myS3,
    bucket: process.env.BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});


module.exports = upload;