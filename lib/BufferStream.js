var _ = require('lodash');
var util = require('util');
var Transform = require('stream').Transform;
util.inherits(BufferStream, Transform);

/**
 * Creates a transform stream that puts backpressure on the incoming stream whenever
 * the predicate returns true.
 *
 * @param {Function} predicate this should return true when the stream should
 * stop reading from the input
 * @param {Number} timeout polling frequency - how often to check the predicate
 * after the stream is paused.
 * @param {} options
 */
function BufferStream(predicate, timeout, options) {
  options = _.merge({ objectMode: true }, options);
  Transform.call(this, options);
  this.timeout = timeout == undefined ? 100 : timeout;
  this.predicate = predicate;
};


BufferStream.prototype._transform = function (data, encoding, done) {
  if (this.predicate()){
    return setTimeout(() => this._transform(data, encoding, done), this.timeout);
  }
  done(null, data);
};

module.exports = BufferStream;
