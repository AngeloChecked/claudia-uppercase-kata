const { Transform } = require("stream");

module.exports = class UppercaseStreamConverter {
  constructor() {
    this.transform = new Transform({ decodeStrings: false });
  }

  convertStream(stream) {
    this.transform._transform = (chunk, encoding, done) => {
      done(null, chunk.toUpperCase());
    };
    stream.pipe(this.transform);
    return this.transform;
  }
};
