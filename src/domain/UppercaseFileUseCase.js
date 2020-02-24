module.exports = class UppercaseFileUseCase {
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