var fanout = require('./lib/fanout');
var BufferStream = require('./lib/BufferStream');
var utils = require('./lib/utils');

module.exports = {
  fanout: fanout.createStreams,
  BufferStream: BufferStream,
  sequence: utils.sequence,
  filter: utils.filter
};
