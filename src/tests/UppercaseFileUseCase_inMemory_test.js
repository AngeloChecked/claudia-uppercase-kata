const UppercaseFileUseCase = require('../domain/UppercaseFileUseCase');
const UppercaseStreamConverter = require('../delivery/UppercaseStreamConverter'); 
const { Readable, Writable } = require("stream");
const assert = require('assert')


class InMemoryFileSystem {
   
    constructor(inputString){
        this.inputString = inputString;
    }

    chunks=[];

    get inMemoryStreamResult(){
        return Buffer.concat(this.chunks).toString();
    }

    readAsStream = () => Readable.from([this.inputString])

    writeFromStream(fileName, bucketName, inputStream, contextCallback) {
        let outputStream = new Writable({
            write: (chunk, encoding, streamCallback) => this.chunks.push(chunk) 
        });
        inputStream.pipe(outputStream);
        inputStream.on('finish', contextCallback)
    }
}

describe("In Memory File System Test", () => {

    let inputText = 'Lorem ipsum dolor sit amet.';
    let fileSystem = new InMemoryFileSystem(inputText);

    it("Output text should be uppercased",async () => {
        await new Promise((resolve, reject) => {
            let usecase = new UppercaseFileUseCase({
                    streamConverter: new UppercaseStreamConverter(), 
                    fileSystem: fileSystem,
                    outputfilename:  null,
                    done: resolve
                });
            let domainEvent = {
                fileName: null,
                bucketName: 'buketName'
            };

            usecase.run(domainEvent)
        });

        let expectedOutputText = 'LOREM IPSUM DOLOR SIT AMET.';
        assert.equal(expectedOutputText, fileSystem.inMemoryStreamResult)
    });

});


