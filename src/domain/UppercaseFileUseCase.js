module.exports = class UppercaseFileUseCase {
  constructor({ streamConverter, fileSystem, done, outputfilename }) {
    this.streamConverter = streamConverter;
    this.fileSystem = fileSystem;
    this.outputfilename = outputfilename;
    this.done = done;
  }

  convertUppercaseAndWriteToSystem(bucket, fileKey) {
    let stream = this.fileSystem.readAsStream(fileKey, bucket);
    let uppercaseStream = this.streamConverter.convertStream(stream);
    this.fileSystem.writeFromStream(
      this.outputfilename,
      bucket,
      uppercaseStream,
      this.done
    );
  }

  run(domainEvent) {
    this.convertUppercaseAndWriteToSystem(domainEvent.bucketName, domainEvent.fileName);
  }
};
