
const UppercaseFileUseCase = require('../domain/UppercaseFileUseCase'); 
const UppercaseStreamConverter = require('../delivery/UppercaseStreamConverter'); 
const S3FileSystem = require('../delivery/S3FileSystem'); 

const mapDomainEventFrom = (eventRecord) => ({
    fileName: eventRecord.s3.object.key,
    bucketName: eventRecord.s3.bucket.name
});

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

  let inputFileName = eventRecord.s3.object.key
  let outputFileName = inputFileName.replace(/^in/, 'out')
  let usecase = new UppercaseFileUseCase({
      streamConverter: new UppercaseStreamConverter(), 
      fileSystem: new S3FileSystem(),
      context:context,
      outputfilename:  outputFileName 
    })
  
  let domainEvent = mapDomainEventFrom(eventRecord)
  usecase.run(domainEvent);
};



