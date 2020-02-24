
const UppercaseFileUseCase = require('../domain/UppercaseFileUseCase'); 
const UppercaseStreamConverter = require('../delivery/UppercaseStreamConverter'); 
const S3FileSystem = require('../delivery/S3FileSystem'); 

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
  let usecase = new UppercaseFileUseCase(
    new UppercaseStreamConverter(), 
    new S3FileSystem(),
    context,
    outputFileName
  )
  
  usecase.run(eventRecord);
};

