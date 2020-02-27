const UppercaseFileUseCase = require('../domain/UppercaseFileUseCase');
const UppercaseStreamConverter = require('../delivery/UppercaseStreamConverter'); 

const assert = require('assert')
const fs = require('fs');

class RealFileSystem {
    
    readAsStream = (fileName, _) => fs.createReadStream(fileName, {encoding: 'utf8'});

    writeFromStream(fileName, _, inputStream, callback) {
        let outputStream = fs.createWriteStream(fileName, {encoding: 'utf8'})   
        inputStream.pipe(outputStream);
        inputStream.on('finish', callback);
    }
}

describe("Local File System Test", () => {

    let outputFileName = 'src/tests/resources/output.txt';
    let inputFileName = 'inputfile.txt';

    beforeEach(() => {
        fs.writeFileSync(outputFileName,"",{encoding:'utf8',flag:'w'})
    });

    it("Output file should be uppercased",async () => {
        await new Promise((resolve, reject) => {
            let context = { done: resolve };
            let usecase = new UppercaseFileUseCase(
                    new UppercaseStreamConverter(),
                    new RealFileSystem(),
                    context,
                    outputFileName
                )
            let domainEvent = {
                fileName: inputFileName,
                bucketName: 'buketName'
            };

            usecase.run(domainEvent)
        });

        let expectedOutput = fs.readFileSync(inputFileName).toString().toUpperCase();
        let output = fs.readFileSync(outputFileName).toString();
        assert.equal(expectedOutput, output)
    });

});


