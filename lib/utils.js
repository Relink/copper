'use strict';

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var stream = require('stream');
var util = require('util');
var _ = require('lodash');
var u = {};

util.inherits(SequenceStream, stream.Duplex);
function SequenceStream() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  opts = _.merge({ objectMode: true }, opts);
  stream.Duplex.call(this, opts);
  this.tail = [];
}

SequenceStream.prototype._write = function write(chunk, encoding, cb) {
  var data = [].concat(chunk);
  var self = this;
  process(data);

  function process(_ref) {
    var _ref2 = _toArray(_ref);

    var head = _ref2[0];

    var tail = _ref2.slice(1);

    // Base case, nothing to process. Check for tail so we
    // can process undefined values as well!
    if (!head && _.isEmpty(tail)) {
      return cb();
    };

    // if pushing works, recurse
    if (self.push(head)) {
      return process(tail);
    };

    // if pushing doesnt work, but it was
    // anyways the last item, callback
    if (_.isEmpty(tail)) {
      return cb();
    };

    // If there is still a tail, then we need to buffer the rest
    // of the data array and deal with it ourselves.
    self.tail = tail;
    self.cb = cb;
  };
};

SequenceStream.prototype._read = function read() {

  // if we have data to process in our custom 'tail' buffer,
  // we should do that on each read, and then call the callback
  // for the associated write that gave us all this data!
  if (this.tail.length > 0) {
    this.push(this.tail.shift());
    this.tail.length == 0 && this.cb();
  }
};

/**
 * Takes a objectMode stream with Array objects and flattens the array
 * emitting each item in the array as a separate object in the stream.
 * @param {Object} opts any options that should be passed to the Stream
 * constructor
 * @returns {Stream}
 */
u.sequence = function create(opts) {
  return new SequenceStream(opts);
};

/**
 * Filters the stream, only objects that return true when passed to the
 * predicate will be passed further down stream.
 * @param {Function} predicate called with one argument, the data object.
 * @returns {Stream}
 */
u.filter = function filter(predicate) {
  return new stream.Transform({
    objectMode: true,
    transform: function transform(d, e, c) {
      predicate(d) ? c(null, d) : c();
    }
  });
};

/*
 * Helper function used to listen to backpressure.
 */
u.write = function write(stream, data) {
  return new Promise(function (resolve, reject) {
    if (!stream.write(data)) {
      return stream.once('drain', resolve.bind(null, data));
    };
    resolve(data);
  });
};

module.exports = u;
//# sourceMappingURL=data:application/json;base64,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YSxJQUFiLEVBQW1CLElBQW5CLENBQXJCLENBQVAsQ0FEc0I7S0FBeEIsQ0FEc0M7QUFJdEMsWUFBUSxJQUFSLEVBSnNDO0dBQXJCLENBQW5CLENBRHNDO0NBQTlCOztBQVNWLE9BQU8sT0FBUCxHQUFpQixDQUFqQiIsImZpbGUiOiJ1dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBzdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKTtcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbnZhciB1ID0ge307XG5cbnV0aWwuaW5oZXJpdHMoU2VxdWVuY2VTdHJlYW0sIHN0cmVhbS5EdXBsZXgpXG5mdW5jdGlvbiBTZXF1ZW5jZVN0cmVhbSAob3B0cyA9IHt9KSB7XG4gIG9wdHMgPSBfLm1lcmdlKHsgb2JqZWN0TW9kZTogdHJ1ZSB9LCBvcHRzKTtcbiAgc3RyZWFtLkR1cGxleC5jYWxsKHRoaXMsIG9wdHMpO1xuICB0aGlzLnRhaWwgPSBbXTtcbn1cblxuU2VxdWVuY2VTdHJlYW0ucHJvdG90eXBlLl93cml0ZSA9IGZ1bmN0aW9uIHdyaXRlIChjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIHZhciBkYXRhID0gW10uY29uY2F0KGNodW5rKTtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBwcm9jZXNzKGRhdGEpO1xuXG4gIGZ1bmN0aW9uIHByb2Nlc3MgKFtoZWFkLCAuLi50YWlsXSkge1xuXG4gICAgLy8gQmFzZSBjYXNlLCBub3RoaW5nIHRvIHByb2Nlc3MuIENoZWNrIGZvciB0YWlsIHNvIHdlXG4gICAgLy8gY2FuIHByb2Nlc3MgdW5kZWZpbmVkIHZhbHVlcyBhcyB3ZWxsIVxuICAgIGlmICghaGVhZCAmJiBfLmlzRW1wdHkodGFpbCkpIHtcbiAgICAgIHJldHVybiBjYigpO1xuICAgIH07XG5cbiAgICAvLyBpZiBwdXNoaW5nIHdvcmtzLCByZWN1cnNlXG4gICAgaWYgKHNlbGYucHVzaChoZWFkKSkge1xuICAgICAgcmV0dXJuIHByb2Nlc3ModGFpbCk7XG4gICAgfTtcblxuICAgIC8vIGlmIHB1c2hpbmcgZG9lc250IHdvcmssIGJ1dCBpdCB3YXNcbiAgICAvLyBhbnl3YXlzIHRoZSBsYXN0IGl0ZW0sIGNhbGxiYWNrXG4gICAgaWYgKF8uaXNFbXB0eSh0YWlsKSkge1xuICAgICAgcmV0dXJuIGNiKCk7XG4gICAgfTtcblxuICAgIC8vIElmIHRoZXJlIGlzIHN0aWxsIGEgdGFpbCwgdGhlbiB3ZSBuZWVkIHRvIGJ1ZmZlciB0aGUgcmVzdFxuICAgIC8vIG9mIHRoZSBkYXRhIGFycmF5IGFuZCBkZWFsIHdpdGggaXQgb3Vyc2VsdmVzLlxuICAgIHNlbGYudGFpbCA9IHRhaWw7XG4gICAgc2VsZi5jYiA9IGNiXG4gIH07XG59XG5cblNlcXVlbmNlU3RyZWFtLnByb3RvdHlwZS5fcmVhZCA9IGZ1bmN0aW9uIHJlYWQgKCkge1xuXG4gIC8vIGlmIHdlIGhhdmUgZGF0YSB0byBwcm9jZXNzIGluIG91ciBjdXN0b20gJ3RhaWwnIGJ1ZmZlcixcbiAgLy8gd2Ugc2hvdWxkIGRvIHRoYXQgb24gZWFjaCByZWFkLCBhbmQgdGhlbiBjYWxsIHRoZSBjYWxsYmFja1xuICAvLyBmb3IgdGhlIGFzc29jaWF0ZWQgd3JpdGUgdGhhdCBnYXZlIHVzIGFsbCB0aGlzIGRhdGEhXG4gIGlmICh0aGlzLnRhaWwubGVuZ3RoID4gMCkge1xuICAgIHRoaXMucHVzaCh0aGlzLnRhaWwuc2hpZnQoKSlcbiAgICB0aGlzLnRhaWwubGVuZ3RoID09IDAgJiYgdGhpcy5jYigpO1xuICB9XG59XG5cblxuXG4vKipcbiAqIFRha2VzIGEgb2JqZWN0TW9kZSBzdHJlYW0gd2l0aCBBcnJheSBvYmplY3RzIGFuZCBmbGF0dGVucyB0aGUgYXJyYXlcbiAqIGVtaXR0aW5nIGVhY2ggaXRlbSBpbiB0aGUgYXJyYXkgYXMgYSBzZXBhcmF0ZSBvYmplY3QgaW4gdGhlIHN0cmVhbS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIGFueSBvcHRpb25zIHRoYXQgc2hvdWxkIGJlIHBhc3NlZCB0byB0aGUgU3RyZWFtXG4gKiBjb25zdHJ1Y3RvclxuICogQHJldHVybnMge1N0cmVhbX1cbiAqL1xudS5zZXF1ZW5jZSA9IGZ1bmN0aW9uIGNyZWF0ZShvcHRzKSB7XG4gIHJldHVybiBuZXcgU2VxdWVuY2VTdHJlYW0ob3B0cyk7XG59XG5cblxuLyoqXG4gKiBGaWx0ZXJzIHRoZSBzdHJlYW0sIG9ubHkgb2JqZWN0cyB0aGF0IHJldHVybiB0cnVlIHdoZW4gcGFzc2VkIHRvIHRoZVxuICogcHJlZGljYXRlIHdpbGwgYmUgcGFzc2VkIGZ1cnRoZXIgZG93biBzdHJlYW0uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgY2FsbGVkIHdpdGggb25lIGFyZ3VtZW50LCB0aGUgZGF0YSBvYmplY3QuXG4gKiBAcmV0dXJucyB7U3RyZWFtfVxuICovXG51LmZpbHRlciA9IGZ1bmN0aW9uIGZpbHRlciAocHJlZGljYXRlKSB7XG4gIHJldHVybiBuZXcgc3RyZWFtLlRyYW5zZm9ybSh7XG4gICAgb2JqZWN0TW9kZTogdHJ1ZSxcbiAgICB0cmFuc2Zvcm06IChkLCBlLCBjKSA9PiB7XG4gICAgICBwcmVkaWNhdGUoZCkgPyBjKG51bGwsIGQpIDogYygpXG4gICAgfVxuICB9KTtcbn07XG5cbi8qXG4gKiBIZWxwZXIgZnVuY3Rpb24gdXNlZCB0byBsaXN0ZW4gdG8gYmFja3ByZXNzdXJlLlxuICovXG51LndyaXRlID0gZnVuY3Rpb24gd3JpdGUgKHN0cmVhbSwgZGF0YSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGlmICghc3RyZWFtLndyaXRlKGRhdGEpKXtcbiAgICAgIHJldHVybiBzdHJlYW0ub25jZSgnZHJhaW4nLCByZXNvbHZlLmJpbmQobnVsbCwgZGF0YSkpXG4gICAgfTtcbiAgICByZXNvbHZlKGRhdGEpO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdVxuIl19