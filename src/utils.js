var stream = require('stream');
var util = require('util');
var _ = require('lodash');
var u = {};

util.inherits(SequenceStream, stream.Duplex)
function SequenceStream (opts = {}) {
  opts = _.merge({ objectMode: true }, opts);
  stream.Duplex.call(this, opts);
  this.tail = [];
}

SequenceStream.prototype._write = function write (chunk, encoding, cb) {
  var data = [].concat(chunk);
  var self = this;
  process(data);

  function process ([head, ...tail]) {
    if (!head) { return cb() };
    if (self.push(head)) { return process(tail) }
    if (tail.length === 0){ return cb() }

    // If there is still a tail, then we need to buffer the rest
    // of the data array and deal with it ourselves.
    self.tail = tail;
    self.cb = cb
  };
}

SequenceStream.prototype._read = function read () {

  // if we have data to process in our custom 'tail' buffer,
  // we should do that on each read, and then call the callback
  // for the associated write that gave us all this data!
  if (this.tail.length > 0) {
    this.push(this.tail.shift())
    this.tail.length == 0 && this.cb();
  }
}



/**
 * Takes a objectMode stream with Array objects and flattens the array
 * emitting each item in the array as a separate object in the stream.
 * @param {Object} opts any options that should be passed to the Stream
 * constructor
 * @returns {Stream}
 */
u.sequence = function create(opts) {
  return new SequenceStream(opts);
}


/**
 * Filters the stream, only objects that return true when passed to the
 * predicate will be passed further down stream.
 * @param {Function} predicate called with one argument, the data object.
 * @returns {Stream}
 */
u.filter = function filter (predicate) {
  return new stream.Transform({
    objectMode: true,
    transform: (d, e, c) => {
      predicate(d) ? c(null, d) : c()
    }
  });
};

module.exports = u
