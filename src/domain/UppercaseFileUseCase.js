module.exports = class UppercaseFileUseCase {
    constructor({streamConverter, fileSystem, context, outputfilename}){
      this.streamConverter = streamConverter;
      this.fileSystem = fileSystem;
      this.context = context;
      this.outputfilename = outputfilename
    }
  
    convert(bucket, fileKey) {
      let stream = this.fileSystem.readAsStream(fileKey, bucket);
      let uppercaseStream = this.streamConverter.convertStream(stream);
      this.fileSystem.writeFromStream(this.outputfilename, bucket, uppercaseStream, this.context.done);
    };
  
    run(domainEvent){
      this.convert(domainEvent.bucketName, domainEvent.fileName);
    }
  }