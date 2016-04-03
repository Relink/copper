'use strict';

var stream = require('stream');

/**
 * Creates three streams:
 *
 * dest is a writeable stream used internally to write from the
 * asynchronous proxy calls. It listens to backpressure from the
 * exit readable stream, and if that gets stopped, it will hang
 * its callback until that gets read from. When that gets read from,
 * its _read function will get called, which will call the write onER
 * callback and we'll write from our buffer. This will continue until
 * the read buffer empties, and then the _read will stop being called,
 * and the streams push will stop returning false, at which point the
 * streams will continue in flow mode again.
 *
 * src is a readable stream used internally for all the actors to read
 * from. When its buffer gets full, their read() calls will call the
 * _read function which will call onIR, which will call the callback
 * for the write stream which is what is getting written to by the
 * piped input stream that our process is reading from.
 *
 * ext is the duplex stream that is returned from our constructor,
 * and is responsible for getting written to by external source and
 * getting read from by the external destination.
 *
 * @param {Function} callback optional callback which will be called
 * with src and dest.
 * @returns {Stream} If callback is provided, the ext stream will
 * be returned, otherwise an object is returned with each stream
 * as a value.
 */
function createStreams() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$propagate = _ref.propagate;
  var propagate = _ref$propagate === undefined ? false : _ref$propagate;
  var callback = arguments[1];

  var onIR = function onIR() {
    return undefined;
  };
  var onER = function onER() {
    return undefined;
  };

  var dest = new stream.Writable({
    objectMode: true,
    write: function write(d, e, c) {
      if (!ext.push(d)) {
        return onER = c;
      }
      c();
    }
  });

  var src = new stream.Readable({
    objectMode: true,
    read: function read() {
      return onIR();
    }
  });

  var ext = new stream.Duplex({
    readableObjectMode: true,
    writableObjectMode: true,
    write: function write(d, e, c) {
      if (!src.push(d)) {
        return onIR = c;
      }
      c();
    },
    read: function read() {
      return onER();
    }
  });

  if (propagate) {
    ext.on('pipe', function (piped) {
      piped.on('error', function (err) {
        return ext.emit('error', err);
      });
    });
  }

  if (typeof callback == 'function') {
    callback(src, dest);
    return ext;
  }

  return {
    dest: dest,
    src: src,
    ext: ext
  };
};

module.exports = {
  createStreams: createStreams
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9mYW5vdXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFNBQVMsUUFBUSxRQUFSLENBQVQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUErQkosU0FBUyxhQUFULEdBQTREO21FQUFkLGtCQUFjOzs0QkFBbkMsVUFBbUM7TUFBbkMsMkNBQVksdUJBQXVCO01BQVYsd0JBQVU7O0FBQzFELE1BQUksT0FBTztXQUFNO0dBQU4sQ0FEK0M7QUFFMUQsTUFBSSxPQUFPO1dBQU07R0FBTixDQUYrQzs7QUFJMUQsTUFBSSxPQUFPLElBQUksT0FBTyxRQUFQLENBQWdCO0FBQzdCLGdCQUFZLElBQVo7QUFDQSxXQUFPLGVBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQWE7QUFDbEIsVUFBSSxDQUFDLElBQUksSUFBSixDQUFTLENBQVQsQ0FBRCxFQUFjO0FBQ2hCLGVBQU8sT0FBTyxDQUFQLENBRFM7T0FBbEI7QUFHQSxVQUprQjtLQUFiO0dBRkUsQ0FBUCxDQUpzRDs7QUFjMUQsTUFBSSxNQUFNLElBQUksT0FBTyxRQUFQLENBQWdCO0FBQzVCLGdCQUFZLElBQVo7QUFDQSxVQUFNO2FBQU07S0FBTjtHQUZFLENBQU4sQ0Fkc0Q7O0FBbUIxRCxNQUFJLE1BQU0sSUFBSSxPQUFPLE1BQVAsQ0FBYztBQUMxQix3QkFBb0IsSUFBcEI7QUFDQSx3QkFBb0IsSUFBcEI7QUFDQSxXQUFPLGVBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQWE7QUFDbEIsVUFBSSxDQUFDLElBQUksSUFBSixDQUFTLENBQVQsQ0FBRCxFQUFhO0FBQ2YsZUFBTyxPQUFPLENBQVAsQ0FEUTtPQUFqQjtBQUdBLFVBSmtCO0tBQWI7QUFNUCxVQUFNO2FBQU07S0FBTjtHQVRFLENBQU4sQ0FuQnNEOztBQStCMUQsTUFBSSxTQUFKLEVBQWU7QUFDYixRQUFJLEVBQUosQ0FBTyxNQUFQLEVBQWUsaUJBQVM7QUFDdEIsWUFBTSxFQUFOLENBQVMsT0FBVCxFQUFrQjtlQUFPLElBQUksSUFBSixDQUFTLE9BQVQsRUFBa0IsR0FBbEI7T0FBUCxDQUFsQixDQURzQjtLQUFULENBQWYsQ0FEYTtHQUFmOztBQU1BLE1BQUksT0FBTyxRQUFQLElBQW1CLFVBQW5CLEVBQStCO0FBQ2pDLGFBQVMsR0FBVCxFQUFjLElBQWQsRUFEaUM7QUFFakMsV0FBTyxHQUFQLENBRmlDO0dBQW5DOztBQUtBLFNBQU87QUFDTCxVQUFNLElBQU47QUFDQSxTQUFLLEdBQUw7QUFDQSxTQUFLLEdBQUw7R0FIRixDQTFDMEQ7Q0FBNUQ7O0FBaURBLE9BQU8sT0FBUCxHQUFpQjtBQUNmLGlCQUFlLGFBQWY7Q0FERiIsImZpbGUiOiJmYW5vdXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgc3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJyk7XG5cbi8qKlxuICogQ3JlYXRlcyB0aHJlZSBzdHJlYW1zOlxuICpcbiAqIGRlc3QgaXMgYSB3cml0ZWFibGUgc3RyZWFtIHVzZWQgaW50ZXJuYWxseSB0byB3cml0ZSBmcm9tIHRoZVxuICogYXN5bmNocm9ub3VzIHByb3h5IGNhbGxzLiBJdCBsaXN0ZW5zIHRvIGJhY2twcmVzc3VyZSBmcm9tIHRoZVxuICogZXhpdCByZWFkYWJsZSBzdHJlYW0sIGFuZCBpZiB0aGF0IGdldHMgc3RvcHBlZCwgaXQgd2lsbCBoYW5nXG4gKiBpdHMgY2FsbGJhY2sgdW50aWwgdGhhdCBnZXRzIHJlYWQgZnJvbS4gV2hlbiB0aGF0IGdldHMgcmVhZCBmcm9tLFxuICogaXRzIF9yZWFkIGZ1bmN0aW9uIHdpbGwgZ2V0IGNhbGxlZCwgd2hpY2ggd2lsbCBjYWxsIHRoZSB3cml0ZSBvbkVSXG4gKiBjYWxsYmFjayBhbmQgd2UnbGwgd3JpdGUgZnJvbSBvdXIgYnVmZmVyLiBUaGlzIHdpbGwgY29udGludWUgdW50aWxcbiAqIHRoZSByZWFkIGJ1ZmZlciBlbXB0aWVzLCBhbmQgdGhlbiB0aGUgX3JlYWQgd2lsbCBzdG9wIGJlaW5nIGNhbGxlZCxcbiAqIGFuZCB0aGUgc3RyZWFtcyBwdXNoIHdpbGwgc3RvcCByZXR1cm5pbmcgZmFsc2UsIGF0IHdoaWNoIHBvaW50IHRoZVxuICogc3RyZWFtcyB3aWxsIGNvbnRpbnVlIGluIGZsb3cgbW9kZSBhZ2Fpbi5cbiAqXG4gKiBzcmMgaXMgYSByZWFkYWJsZSBzdHJlYW0gdXNlZCBpbnRlcm5hbGx5IGZvciBhbGwgdGhlIGFjdG9ycyB0byByZWFkXG4gKiBmcm9tLiBXaGVuIGl0cyBidWZmZXIgZ2V0cyBmdWxsLCB0aGVpciByZWFkKCkgY2FsbHMgd2lsbCBjYWxsIHRoZVxuICogX3JlYWQgZnVuY3Rpb24gd2hpY2ggd2lsbCBjYWxsIG9uSVIsIHdoaWNoIHdpbGwgY2FsbCB0aGUgY2FsbGJhY2tcbiAqIGZvciB0aGUgd3JpdGUgc3RyZWFtIHdoaWNoIGlzIHdoYXQgaXMgZ2V0dGluZyB3cml0dGVuIHRvIGJ5IHRoZVxuICogcGlwZWQgaW5wdXQgc3RyZWFtIHRoYXQgb3VyIHByb2Nlc3MgaXMgcmVhZGluZyBmcm9tLlxuICpcbiAqIGV4dCBpcyB0aGUgZHVwbGV4IHN0cmVhbSB0aGF0IGlzIHJldHVybmVkIGZyb20gb3VyIGNvbnN0cnVjdG9yLFxuICogYW5kIGlzIHJlc3BvbnNpYmxlIGZvciBnZXR0aW5nIHdyaXR0ZW4gdG8gYnkgZXh0ZXJuYWwgc291cmNlIGFuZFxuICogZ2V0dGluZyByZWFkIGZyb20gYnkgdGhlIGV4dGVybmFsIGRlc3RpbmF0aW9uLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIG9wdGlvbmFsIGNhbGxiYWNrIHdoaWNoIHdpbGwgYmUgY2FsbGVkXG4gKiB3aXRoIHNyYyBhbmQgZGVzdC5cbiAqIEByZXR1cm5zIHtTdHJlYW19IElmIGNhbGxiYWNrIGlzIHByb3ZpZGVkLCB0aGUgZXh0IHN0cmVhbSB3aWxsXG4gKiBiZSByZXR1cm5lZCwgb3RoZXJ3aXNlIGFuIG9iamVjdCBpcyByZXR1cm5lZCB3aXRoIGVhY2ggc3RyZWFtXG4gKiBhcyBhIHZhbHVlLlxuICovXG5mdW5jdGlvbiBjcmVhdGVTdHJlYW1zICh7cHJvcGFnYXRlID0gZmFsc2V9ID0ge30sIGNhbGxiYWNrKSB7XG4gIHZhciBvbklSID0gKCkgPT4gdW5kZWZpbmVkO1xuICB2YXIgb25FUiA9ICgpID0+IHVuZGVmaW5lZDtcblxuICB2YXIgZGVzdCA9IG5ldyBzdHJlYW0uV3JpdGFibGUoe1xuICAgIG9iamVjdE1vZGU6IHRydWUsXG4gICAgd3JpdGU6IChkLCBlLCBjKSA9PiB7XG4gICAgICBpZiAoIWV4dC5wdXNoKGQpKSB7XG4gICAgICAgIHJldHVybiBvbkVSID0gYztcbiAgICAgIH1cbiAgICAgIGMoKTtcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBzcmMgPSBuZXcgc3RyZWFtLlJlYWRhYmxlKHtcbiAgICBvYmplY3RNb2RlOiB0cnVlLFxuICAgIHJlYWQ6ICgpID0+IG9uSVIoKVxuICB9KVxuXG4gIHZhciBleHQgPSBuZXcgc3RyZWFtLkR1cGxleCh7XG4gICAgcmVhZGFibGVPYmplY3RNb2RlOiB0cnVlLFxuICAgIHdyaXRhYmxlT2JqZWN0TW9kZTogdHJ1ZSxcbiAgICB3cml0ZTogKGQsIGUsIGMpID0+IHtcbiAgICAgIGlmICghc3JjLnB1c2goZCkpe1xuICAgICAgICByZXR1cm4gb25JUiA9IGM7XG4gICAgICB9XG4gICAgICBjKCk7XG4gICAgfSxcbiAgICByZWFkOiAoKSA9PiBvbkVSKClcbiAgfSk7XG5cbiAgaWYgKHByb3BhZ2F0ZSkge1xuICAgIGV4dC5vbigncGlwZScsIHBpcGVkID0+IHtcbiAgICAgIHBpcGVkLm9uKCdlcnJvcicsIGVyciA9PiBleHQuZW1pdCgnZXJyb3InLCBlcnIpKVxuICAgIH0pO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2soc3JjLCBkZXN0KTtcbiAgICByZXR1cm4gZXh0O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkZXN0OiBkZXN0LFxuICAgIHNyYzogc3JjLFxuICAgIGV4dDogZXh0XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGVTdHJlYW1zOiBjcmVhdGVTdHJlYW1zXG59O1xuIl19