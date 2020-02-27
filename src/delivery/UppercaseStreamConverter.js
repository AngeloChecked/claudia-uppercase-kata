const { Transform } = require("stream");

module.exports = class UppercaseStreamConverter {
  constructor() {
    this.uppercaseTrasform = new Transform({
      decodeStrings: false,
      transform: (chunk, encoding, done) => done(null, chunk.toUpperCase())
    });
  }

  convertStream(stream) {
    stream.pipe(this.uppercaseTrasform);
    return this.uppercaseTrasform;
  }
};
