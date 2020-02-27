const aws = require("aws-sdk");

module.exports = class S3FileSystem {
  constructor() {
    this.s3 = new aws.S3({ signatureVersion: "v4" });
  }

  readAsStream(s3Key, bucket) {
    let stream = this.s3
      .getObject({
        Bucket: bucket,
        Key: s3Key
      })
      .createReadStream();
    stream.setEncoding("utf8");
    return stream;
  }

  writeFromStream(s3Key, bucket, stream, doneCallback) {
    this.s3.upload(
      {
        Bucket: bucket,
        Key: s3Key,
        Body: stream,
        ACL: "private"
      },
      doneCallback
    );
  }
};
