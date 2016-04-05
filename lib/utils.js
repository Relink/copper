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

    if (!head) {
      return cb();
    };
    if (self.push(head)) {
      return process(tail);
    }
    if (tail.length === 0) {
      return cb();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSSxTQUFTLFFBQVEsUUFBUixDQUFUO0FBQ0osSUFBSSxPQUFPLFFBQVEsTUFBUixDQUFQO0FBQ0osSUFBSSxJQUFJLFFBQVEsUUFBUixDQUFKO0FBQ0osSUFBSSxJQUFJLEVBQUo7O0FBRUosS0FBSyxRQUFMLENBQWMsY0FBZCxFQUE4QixPQUFPLE1BQVAsQ0FBOUI7QUFDQSxTQUFTLGNBQVQsR0FBb0M7TUFBWCw2REFBTyxrQkFBSTs7QUFDbEMsU0FBTyxFQUFFLEtBQUYsQ0FBUSxFQUFFLFlBQVksSUFBWixFQUFWLEVBQThCLElBQTlCLENBQVAsQ0FEa0M7QUFFbEMsU0FBTyxNQUFQLENBQWMsSUFBZCxDQUFtQixJQUFuQixFQUF5QixJQUF6QixFQUZrQztBQUdsQyxPQUFLLElBQUwsR0FBWSxFQUFaLENBSGtDO0NBQXBDOztBQU1BLGVBQWUsU0FBZixDQUF5QixNQUF6QixHQUFrQyxTQUFTLEtBQVQsQ0FBZ0IsS0FBaEIsRUFBdUIsUUFBdkIsRUFBaUMsRUFBakMsRUFBcUM7QUFDckUsTUFBSSxPQUFPLEdBQUcsTUFBSCxDQUFVLEtBQVYsQ0FBUCxDQURpRTtBQUVyRSxNQUFJLE9BQU8sSUFBUCxDQUZpRTtBQUdyRSxVQUFRLElBQVIsRUFIcUU7O0FBS3JFLFdBQVMsT0FBVCxPQUFtQzs7O1FBQWhCLGdCQUFnQjs7UUFBUCxzQkFBTzs7QUFDakMsUUFBSSxDQUFDLElBQUQsRUFBTztBQUFFLGFBQU8sSUFBUCxDQUFGO0tBQVgsQ0FEaUM7QUFFakMsUUFBSSxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQUosRUFBcUI7QUFBRSxhQUFPLFFBQVEsSUFBUixDQUFQLENBQUY7S0FBckI7QUFDQSxRQUFJLEtBQUssTUFBTCxLQUFnQixDQUFoQixFQUFrQjtBQUFFLGFBQU8sSUFBUCxDQUFGO0tBQXRCOzs7O0FBSGlDLFFBT2pDLENBQUssSUFBTCxHQUFZLElBQVosQ0FQaUM7QUFRakMsU0FBSyxFQUFMLEdBQVUsRUFBVixDQVJpQztHQUFuQyxDQUxxRTtDQUFyQzs7QUFpQmxDLGVBQWUsU0FBZixDQUF5QixLQUF6QixHQUFpQyxTQUFTLElBQVQsR0FBaUI7Ozs7O0FBS2hELE1BQUksS0FBSyxJQUFMLENBQVUsTUFBVixHQUFtQixDQUFuQixFQUFzQjtBQUN4QixTQUFLLElBQUwsQ0FBVSxLQUFLLElBQUwsQ0FBVSxLQUFWLEVBQVYsRUFEd0I7QUFFeEIsU0FBSyxJQUFMLENBQVUsTUFBVixJQUFvQixDQUFwQixJQUF5QixLQUFLLEVBQUwsRUFBekIsQ0FGd0I7R0FBMUI7Q0FMK0I7Ozs7Ozs7OztBQW9CakMsRUFBRSxRQUFGLEdBQWEsU0FBUyxNQUFULENBQWdCLElBQWhCLEVBQXNCO0FBQ2pDLFNBQU8sSUFBSSxjQUFKLENBQW1CLElBQW5CLENBQVAsQ0FEaUM7Q0FBdEI7Ozs7Ozs7O0FBV2IsRUFBRSxNQUFGLEdBQVcsU0FBUyxNQUFULENBQWlCLFNBQWpCLEVBQTRCO0FBQ3JDLFNBQU8sSUFBSSxPQUFPLFNBQVAsQ0FBaUI7QUFDMUIsZ0JBQVksSUFBWjtBQUNBLGVBQVcsbUJBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQWE7QUFDdEIsZ0JBQVUsQ0FBVixJQUFlLEVBQUUsSUFBRixFQUFRLENBQVIsQ0FBZixHQUE0QixHQUE1QixDQURzQjtLQUFiO0dBRk4sQ0FBUCxDQURxQztDQUE1Qjs7QUFTWCxPQUFPLE9BQVAsR0FBaUIsQ0FBakIiLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgc3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG52YXIgdSA9IHt9O1xuXG51dGlsLmluaGVyaXRzKFNlcXVlbmNlU3RyZWFtLCBzdHJlYW0uRHVwbGV4KVxuZnVuY3Rpb24gU2VxdWVuY2VTdHJlYW0gKG9wdHMgPSB7fSkge1xuICBvcHRzID0gXy5tZXJnZSh7IG9iamVjdE1vZGU6IHRydWUgfSwgb3B0cyk7XG4gIHN0cmVhbS5EdXBsZXguY2FsbCh0aGlzLCBvcHRzKTtcbiAgdGhpcy50YWlsID0gW107XG59XG5cblNlcXVlbmNlU3RyZWFtLnByb3RvdHlwZS5fd3JpdGUgPSBmdW5jdGlvbiB3cml0ZSAoY2h1bmssIGVuY29kaW5nLCBjYikge1xuICB2YXIgZGF0YSA9IFtdLmNvbmNhdChjaHVuayk7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgcHJvY2VzcyhkYXRhKTtcblxuICBmdW5jdGlvbiBwcm9jZXNzIChbaGVhZCwgLi4udGFpbF0pIHtcbiAgICBpZiAoIWhlYWQpIHsgcmV0dXJuIGNiKCkgfTtcbiAgICBpZiAoc2VsZi5wdXNoKGhlYWQpKSB7IHJldHVybiBwcm9jZXNzKHRhaWwpIH1cbiAgICBpZiAodGFpbC5sZW5ndGggPT09IDApeyByZXR1cm4gY2IoKSB9XG5cbiAgICAvLyBJZiB0aGVyZSBpcyBzdGlsbCBhIHRhaWwsIHRoZW4gd2UgbmVlZCB0byBidWZmZXIgdGhlIHJlc3RcbiAgICAvLyBvZiB0aGUgZGF0YSBhcnJheSBhbmQgZGVhbCB3aXRoIGl0IG91cnNlbHZlcy5cbiAgICBzZWxmLnRhaWwgPSB0YWlsO1xuICAgIHNlbGYuY2IgPSBjYlxuICB9O1xufVxuXG5TZXF1ZW5jZVN0cmVhbS5wcm90b3R5cGUuX3JlYWQgPSBmdW5jdGlvbiByZWFkICgpIHtcblxuICAvLyBpZiB3ZSBoYXZlIGRhdGEgdG8gcHJvY2VzcyBpbiBvdXIgY3VzdG9tICd0YWlsJyBidWZmZXIsXG4gIC8vIHdlIHNob3VsZCBkbyB0aGF0IG9uIGVhY2ggcmVhZCwgYW5kIHRoZW4gY2FsbCB0aGUgY2FsbGJhY2tcbiAgLy8gZm9yIHRoZSBhc3NvY2lhdGVkIHdyaXRlIHRoYXQgZ2F2ZSB1cyBhbGwgdGhpcyBkYXRhIVxuICBpZiAodGhpcy50YWlsLmxlbmd0aCA+IDApIHtcbiAgICB0aGlzLnB1c2godGhpcy50YWlsLnNoaWZ0KCkpXG4gICAgdGhpcy50YWlsLmxlbmd0aCA9PSAwICYmIHRoaXMuY2IoKTtcbiAgfVxufVxuXG5cblxuLyoqXG4gKiBUYWtlcyBhIG9iamVjdE1vZGUgc3RyZWFtIHdpdGggQXJyYXkgb2JqZWN0cyBhbmQgZmxhdHRlbnMgdGhlIGFycmF5XG4gKiBlbWl0dGluZyBlYWNoIGl0ZW0gaW4gdGhlIGFycmF5IGFzIGEgc2VwYXJhdGUgb2JqZWN0IGluIHRoZSBzdHJlYW0uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBhbnkgb3B0aW9ucyB0aGF0IHNob3VsZCBiZSBwYXNzZWQgdG8gdGhlIFN0cmVhbVxuICogY29uc3RydWN0b3JcbiAqIEByZXR1cm5zIHtTdHJlYW19XG4gKi9cbnUuc2VxdWVuY2UgPSBmdW5jdGlvbiBjcmVhdGUob3B0cykge1xuICByZXR1cm4gbmV3IFNlcXVlbmNlU3RyZWFtKG9wdHMpO1xufVxuXG5cbi8qKlxuICogRmlsdGVycyB0aGUgc3RyZWFtLCBvbmx5IG9iamVjdHMgdGhhdCByZXR1cm4gdHJ1ZSB3aGVuIHBhc3NlZCB0byB0aGVcbiAqIHByZWRpY2F0ZSB3aWxsIGJlIHBhc3NlZCBmdXJ0aGVyIGRvd24gc3RyZWFtLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIGNhbGxlZCB3aXRoIG9uZSBhcmd1bWVudCwgdGhlIGRhdGEgb2JqZWN0LlxuICogQHJldHVybnMge1N0cmVhbX1cbiAqL1xudS5maWx0ZXIgPSBmdW5jdGlvbiBmaWx0ZXIgKHByZWRpY2F0ZSkge1xuICByZXR1cm4gbmV3IHN0cmVhbS5UcmFuc2Zvcm0oe1xuICAgIG9iamVjdE1vZGU6IHRydWUsXG4gICAgdHJhbnNmb3JtOiAoZCwgZSwgYykgPT4ge1xuICAgICAgcHJlZGljYXRlKGQpID8gYyhudWxsLCBkKSA6IGMoKVxuICAgIH1cbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVcbiJdfQ==