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

    // Base case, nothing to process. Check for tail because
    // we have undefined values that we process as well!
    if (!head && _.isEmpty(tail)) {
      return cb();
    };
    if (self.push(head)) {
      return process(tail);
    }

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

module.exports = u;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSSxTQUFTLFFBQVEsUUFBUixDQUFUO0FBQ0osSUFBSSxPQUFPLFFBQVEsTUFBUixDQUFQO0FBQ0osSUFBSSxJQUFJLFFBQVEsUUFBUixDQUFKO0FBQ0osSUFBSSxJQUFJLEVBQUo7O0FBRUosS0FBSyxRQUFMLENBQWMsY0FBZCxFQUE4QixPQUFPLE1BQVAsQ0FBOUI7QUFDQSxTQUFTLGNBQVQsR0FBb0M7TUFBWCw2REFBTyxrQkFBSTs7QUFDbEMsU0FBTyxFQUFFLEtBQUYsQ0FBUSxFQUFFLFlBQVksSUFBWixFQUFWLEVBQThCLElBQTlCLENBQVAsQ0FEa0M7QUFFbEMsU0FBTyxNQUFQLENBQWMsSUFBZCxDQUFtQixJQUFuQixFQUF5QixJQUF6QixFQUZrQztBQUdsQyxPQUFLLElBQUwsR0FBWSxFQUFaLENBSGtDO0NBQXBDOztBQU1BLGVBQWUsU0FBZixDQUF5QixNQUF6QixHQUFrQyxTQUFTLEtBQVQsQ0FBZ0IsS0FBaEIsRUFBdUIsUUFBdkIsRUFBaUMsRUFBakMsRUFBcUM7QUFDckUsTUFBSSxPQUFPLEdBQUcsTUFBSCxDQUFVLEtBQVYsQ0FBUCxDQURpRTtBQUVyRSxNQUFJLE9BQU8sSUFBUCxDQUZpRTtBQUdyRSxVQUFRLElBQVIsRUFIcUU7O0FBS3JFLFdBQVMsT0FBVCxPQUFtQzs7O1FBQWhCLGdCQUFnQjs7UUFBUCxzQkFBTzs7OztBQUlqQyxRQUFJLENBQUMsSUFBRCxJQUFTLEVBQUUsT0FBRixDQUFVLElBQVYsQ0FBVCxFQUEwQjtBQUM1QixhQUFPLElBQVAsQ0FENEI7S0FBOUIsQ0FKaUM7QUFPakMsUUFBSSxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQUosRUFBcUI7QUFDbkIsYUFBTyxRQUFRLElBQVIsQ0FBUCxDQURtQjtLQUFyQjs7OztBQVBpQyxRQWFqQyxDQUFLLElBQUwsR0FBWSxJQUFaLENBYmlDO0FBY2pDLFNBQUssRUFBTCxHQUFVLEVBQVYsQ0FkaUM7R0FBbkMsQ0FMcUU7Q0FBckM7O0FBdUJsQyxlQUFlLFNBQWYsQ0FBeUIsS0FBekIsR0FBaUMsU0FBUyxJQUFULEdBQWlCOzs7OztBQUtoRCxNQUFJLEtBQUssSUFBTCxDQUFVLE1BQVYsR0FBbUIsQ0FBbkIsRUFBc0I7QUFDeEIsU0FBSyxJQUFMLENBQVUsS0FBSyxJQUFMLENBQVUsS0FBVixFQUFWLEVBRHdCO0FBRXhCLFNBQUssSUFBTCxDQUFVLE1BQVYsSUFBb0IsQ0FBcEIsSUFBeUIsS0FBSyxFQUFMLEVBQXpCLENBRndCO0dBQTFCO0NBTCtCOzs7Ozs7Ozs7QUFvQmpDLEVBQUUsUUFBRixHQUFhLFNBQVMsTUFBVCxDQUFnQixJQUFoQixFQUFzQjtBQUNqQyxTQUFPLElBQUksY0FBSixDQUFtQixJQUFuQixDQUFQLENBRGlDO0NBQXRCOzs7Ozs7OztBQVdiLEVBQUUsTUFBRixHQUFXLFNBQVMsTUFBVCxDQUFpQixTQUFqQixFQUE0QjtBQUNyQyxTQUFPLElBQUksT0FBTyxTQUFQLENBQWlCO0FBQzFCLGdCQUFZLElBQVo7QUFDQSxlQUFXLG1CQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFhO0FBQ3RCLGdCQUFVLENBQVYsSUFBZSxFQUFFLElBQUYsRUFBUSxDQUFSLENBQWYsR0FBNEIsR0FBNUIsQ0FEc0I7S0FBYjtHQUZOLENBQVAsQ0FEcUM7Q0FBNUI7O0FBU1gsT0FBTyxPQUFQLEdBQWlCLENBQWpCIiwiZmlsZSI6InV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHN0cmVhbSA9IHJlcXVpcmUoJ3N0cmVhbScpO1xudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xudmFyIHUgPSB7fTtcblxudXRpbC5pbmhlcml0cyhTZXF1ZW5jZVN0cmVhbSwgc3RyZWFtLkR1cGxleClcbmZ1bmN0aW9uIFNlcXVlbmNlU3RyZWFtIChvcHRzID0ge30pIHtcbiAgb3B0cyA9IF8ubWVyZ2UoeyBvYmplY3RNb2RlOiB0cnVlIH0sIG9wdHMpO1xuICBzdHJlYW0uRHVwbGV4LmNhbGwodGhpcywgb3B0cyk7XG4gIHRoaXMudGFpbCA9IFtdO1xufVxuXG5TZXF1ZW5jZVN0cmVhbS5wcm90b3R5cGUuX3dyaXRlID0gZnVuY3Rpb24gd3JpdGUgKGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgdmFyIGRhdGEgPSBbXS5jb25jYXQoY2h1bmspO1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHByb2Nlc3MoZGF0YSk7XG5cbiAgZnVuY3Rpb24gcHJvY2VzcyAoW2hlYWQsIC4uLnRhaWxdKSB7XG5cbiAgICAvLyBCYXNlIGNhc2UsIG5vdGhpbmcgdG8gcHJvY2Vzcy4gQ2hlY2sgZm9yIHRhaWwgYmVjYXVzZVxuICAgIC8vIHdlIGhhdmUgdW5kZWZpbmVkIHZhbHVlcyB0aGF0IHdlIHByb2Nlc3MgYXMgd2VsbCFcbiAgICBpZiAoIWhlYWQgJiYgXy5pc0VtcHR5KHRhaWwpKSB7XG4gICAgICByZXR1cm4gY2IoKVxuICAgIH07XG4gICAgaWYgKHNlbGYucHVzaChoZWFkKSkge1xuICAgICAgcmV0dXJuIHByb2Nlc3ModGFpbClcbiAgICB9XG5cbiAgICAvLyBJZiB0aGVyZSBpcyBzdGlsbCBhIHRhaWwsIHRoZW4gd2UgbmVlZCB0byBidWZmZXIgdGhlIHJlc3RcbiAgICAvLyBvZiB0aGUgZGF0YSBhcnJheSBhbmQgZGVhbCB3aXRoIGl0IG91cnNlbHZlcy5cbiAgICBzZWxmLnRhaWwgPSB0YWlsO1xuICAgIHNlbGYuY2IgPSBjYlxuICB9O1xufVxuXG5TZXF1ZW5jZVN0cmVhbS5wcm90b3R5cGUuX3JlYWQgPSBmdW5jdGlvbiByZWFkICgpIHtcblxuICAvLyBpZiB3ZSBoYXZlIGRhdGEgdG8gcHJvY2VzcyBpbiBvdXIgY3VzdG9tICd0YWlsJyBidWZmZXIsXG4gIC8vIHdlIHNob3VsZCBkbyB0aGF0IG9uIGVhY2ggcmVhZCwgYW5kIHRoZW4gY2FsbCB0aGUgY2FsbGJhY2tcbiAgLy8gZm9yIHRoZSBhc3NvY2lhdGVkIHdyaXRlIHRoYXQgZ2F2ZSB1cyBhbGwgdGhpcyBkYXRhIVxuICBpZiAodGhpcy50YWlsLmxlbmd0aCA+IDApIHtcbiAgICB0aGlzLnB1c2godGhpcy50YWlsLnNoaWZ0KCkpXG4gICAgdGhpcy50YWlsLmxlbmd0aCA9PSAwICYmIHRoaXMuY2IoKTtcbiAgfVxufVxuXG5cblxuLyoqXG4gKiBUYWtlcyBhIG9iamVjdE1vZGUgc3RyZWFtIHdpdGggQXJyYXkgb2JqZWN0cyBhbmQgZmxhdHRlbnMgdGhlIGFycmF5XG4gKiBlbWl0dGluZyBlYWNoIGl0ZW0gaW4gdGhlIGFycmF5IGFzIGEgc2VwYXJhdGUgb2JqZWN0IGluIHRoZSBzdHJlYW0uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBhbnkgb3B0aW9ucyB0aGF0IHNob3VsZCBiZSBwYXNzZWQgdG8gdGhlIFN0cmVhbVxuICogY29uc3RydWN0b3JcbiAqIEByZXR1cm5zIHtTdHJlYW19XG4gKi9cbnUuc2VxdWVuY2UgPSBmdW5jdGlvbiBjcmVhdGUob3B0cykge1xuICByZXR1cm4gbmV3IFNlcXVlbmNlU3RyZWFtKG9wdHMpO1xufVxuXG5cbi8qKlxuICogRmlsdGVycyB0aGUgc3RyZWFtLCBvbmx5IG9iamVjdHMgdGhhdCByZXR1cm4gdHJ1ZSB3aGVuIHBhc3NlZCB0byB0aGVcbiAqIHByZWRpY2F0ZSB3aWxsIGJlIHBhc3NlZCBmdXJ0aGVyIGRvd24gc3RyZWFtLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIGNhbGxlZCB3aXRoIG9uZSBhcmd1bWVudCwgdGhlIGRhdGEgb2JqZWN0LlxuICogQHJldHVybnMge1N0cmVhbX1cbiAqL1xudS5maWx0ZXIgPSBmdW5jdGlvbiBmaWx0ZXIgKHByZWRpY2F0ZSkge1xuICByZXR1cm4gbmV3IHN0cmVhbS5UcmFuc2Zvcm0oe1xuICAgIG9iamVjdE1vZGU6IHRydWUsXG4gICAgdHJhbnNmb3JtOiAoZCwgZSwgYykgPT4ge1xuICAgICAgcHJlZGljYXRlKGQpID8gYyhudWxsLCBkKSA6IGMoKVxuICAgIH1cbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVcbiJdfQ==