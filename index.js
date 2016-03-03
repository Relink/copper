var fanout = require('./lib/fanout');
var BufferStream = require('./lib/BufferStream');

module.exports = {
  fanout: fanout.createStreams,
  BufferStream: BufferStream
};
