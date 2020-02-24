const aws = require("aws-sdk");
const { Transform } = require("stream");

class S3FileSystem {
  constructor() {
    this.s3 = new aws.S3({ signatureVersion: "v4" });
  }

  readAsStream(s3Key, bucket) {
    let stream = this.s3
      .getObject({
        Bucket: bucket,
        Key: s3Key
      }).createReadStream();
    stream.setEncoding("utf8");
    return stream;
  }

  writeFromStream(s3Key, bucket, stream, callback) {
    this.s3.upload({
        Bucket: bucket,
        Key: s3Key,
        Body: stream,
        ACL: "private"
      }, callback);
  }
}

class UppercaseStreamConverter {
  convertStream(stream) {
    let uppercase = new Transform({ decodeStrings: false });
    uppercase._transform = (chunk, encoding, done) => {
      done(null, chunk.toUpperCase());
    };
    stream.pipe(uppercase);
    return uppercase;
  }
}

class UppercaseFileUseCase {
  constructor(streamConverter, fileSystem, context){
    this.streamConverter = streamConverter;
    this.fileSystem = fileSystem;
    this.context = context;
  }

  convert(bucket, fileKey) {
    let stream = this.fileSystem.readAsStream(fileKey, bucket);
    let uppercaseStream = this.streamConverter.convertStream(stream);
    this.fileSystem.writeFromStream(fileKey.replace(/^in/, 'out'), bucket, uppercaseStream, this.context.done);
  };

  run(eventRecord){
    this.convert(eventRecord.s3.bucket.name, eventRecord.s3.object.key);
  }

}

exports.handler = (event, context, bc) => {
  
  let eventRecord = event.Records && event.Records[0];

  if (!eventRecord) {
    context.fail("no records in the event");
    return;
  }

  if (!(eventRecord.eventSource === "aws:s3" && eventRecord.s3)) {
    context.fail("unsupported event source");
    return;
  }

  let usecase = new UppercaseFileUseCase(
    new UppercaseStreamConverter(), 
    new S3FileSystem(),
    context
  )
  
  usecase.run(eventRecord);
};

