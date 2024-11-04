// config/awsConfig.js
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS,
  region: process.env.AWS_S3_REGION,
});

const s3 = new AWS.S3();

module.exports = s3;
