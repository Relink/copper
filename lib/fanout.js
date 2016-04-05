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
function createStreams(callback) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9mYW5vdXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFNBQVMsUUFBUSxRQUFSLENBQVQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUErQkosU0FBUyxhQUFULENBQXdCLFFBQXhCLEVBQWtDO0FBQ2hDLE1BQUksT0FBTztXQUFNO0dBQU4sQ0FEcUI7QUFFaEMsTUFBSSxPQUFPO1dBQU07R0FBTixDQUZxQjs7QUFJaEMsTUFBSSxPQUFPLElBQUksT0FBTyxRQUFQLENBQWdCO0FBQzdCLGdCQUFZLElBQVo7QUFDQSxXQUFPLGVBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQWE7QUFDbEIsVUFBSSxDQUFDLElBQUksSUFBSixDQUFTLENBQVQsQ0FBRCxFQUFjO0FBQ2hCLGVBQU8sT0FBTyxDQUFQLENBRFM7T0FBbEI7QUFHQSxVQUprQjtLQUFiO0dBRkUsQ0FBUCxDQUo0Qjs7QUFjaEMsTUFBSSxNQUFNLElBQUksT0FBTyxRQUFQLENBQWdCO0FBQzVCLGdCQUFZLElBQVo7QUFDQSxVQUFNO2FBQU07S0FBTjtHQUZFLENBQU4sQ0FkNEI7O0FBbUJoQyxNQUFJLE1BQU0sSUFBSSxPQUFPLE1BQVAsQ0FBYztBQUMxQix3QkFBb0IsSUFBcEI7QUFDQSx3QkFBb0IsSUFBcEI7QUFDQSxXQUFPLGVBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQWE7QUFDbEIsVUFBSSxDQUFDLElBQUksSUFBSixDQUFTLENBQVQsQ0FBRCxFQUFhO0FBQ2YsZUFBTyxPQUFPLENBQVAsQ0FEUTtPQUFqQjtBQUdBLFVBSmtCO0tBQWI7QUFNUCxVQUFNO2FBQU07S0FBTjtHQVRFLENBQU4sQ0FuQjRCOztBQStCaEMsTUFBSSxPQUFPLFFBQVAsSUFBbUIsVUFBbkIsRUFBK0I7QUFDakMsYUFBUyxHQUFULEVBQWMsSUFBZCxFQURpQztBQUVqQyxXQUFPLEdBQVAsQ0FGaUM7R0FBbkM7O0FBS0EsU0FBTztBQUNMLFVBQU0sSUFBTjtBQUNBLFNBQUssR0FBTDtBQUNBLFNBQUssR0FBTDtHQUhGLENBcENnQztDQUFsQzs7QUEyQ0EsT0FBTyxPQUFQLEdBQWlCO0FBQ2YsaUJBQWUsYUFBZjtDQURGIiwiZmlsZSI6ImZhbm91dC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBzdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKTtcblxuLyoqXG4gKiBDcmVhdGVzIHRocmVlIHN0cmVhbXM6XG4gKlxuICogZGVzdCBpcyBhIHdyaXRlYWJsZSBzdHJlYW0gdXNlZCBpbnRlcm5hbGx5IHRvIHdyaXRlIGZyb20gdGhlXG4gKiBhc3luY2hyb25vdXMgcHJveHkgY2FsbHMuIEl0IGxpc3RlbnMgdG8gYmFja3ByZXNzdXJlIGZyb20gdGhlXG4gKiBleGl0IHJlYWRhYmxlIHN0cmVhbSwgYW5kIGlmIHRoYXQgZ2V0cyBzdG9wcGVkLCBpdCB3aWxsIGhhbmdcbiAqIGl0cyBjYWxsYmFjayB1bnRpbCB0aGF0IGdldHMgcmVhZCBmcm9tLiBXaGVuIHRoYXQgZ2V0cyByZWFkIGZyb20sXG4gKiBpdHMgX3JlYWQgZnVuY3Rpb24gd2lsbCBnZXQgY2FsbGVkLCB3aGljaCB3aWxsIGNhbGwgdGhlIHdyaXRlIG9uRVJcbiAqIGNhbGxiYWNrIGFuZCB3ZSdsbCB3cml0ZSBmcm9tIG91ciBidWZmZXIuIFRoaXMgd2lsbCBjb250aW51ZSB1bnRpbFxuICogdGhlIHJlYWQgYnVmZmVyIGVtcHRpZXMsIGFuZCB0aGVuIHRoZSBfcmVhZCB3aWxsIHN0b3AgYmVpbmcgY2FsbGVkLFxuICogYW5kIHRoZSBzdHJlYW1zIHB1c2ggd2lsbCBzdG9wIHJldHVybmluZyBmYWxzZSwgYXQgd2hpY2ggcG9pbnQgdGhlXG4gKiBzdHJlYW1zIHdpbGwgY29udGludWUgaW4gZmxvdyBtb2RlIGFnYWluLlxuICpcbiAqIHNyYyBpcyBhIHJlYWRhYmxlIHN0cmVhbSB1c2VkIGludGVybmFsbHkgZm9yIGFsbCB0aGUgYWN0b3JzIHRvIHJlYWRcbiAqIGZyb20uIFdoZW4gaXRzIGJ1ZmZlciBnZXRzIGZ1bGwsIHRoZWlyIHJlYWQoKSBjYWxscyB3aWxsIGNhbGwgdGhlXG4gKiBfcmVhZCBmdW5jdGlvbiB3aGljaCB3aWxsIGNhbGwgb25JUiwgd2hpY2ggd2lsbCBjYWxsIHRoZSBjYWxsYmFja1xuICogZm9yIHRoZSB3cml0ZSBzdHJlYW0gd2hpY2ggaXMgd2hhdCBpcyBnZXR0aW5nIHdyaXR0ZW4gdG8gYnkgdGhlXG4gKiBwaXBlZCBpbnB1dCBzdHJlYW0gdGhhdCBvdXIgcHJvY2VzcyBpcyByZWFkaW5nIGZyb20uXG4gKlxuICogZXh0IGlzIHRoZSBkdXBsZXggc3RyZWFtIHRoYXQgaXMgcmV0dXJuZWQgZnJvbSBvdXIgY29uc3RydWN0b3IsXG4gKiBhbmQgaXMgcmVzcG9uc2libGUgZm9yIGdldHRpbmcgd3JpdHRlbiB0byBieSBleHRlcm5hbCBzb3VyY2UgYW5kXG4gKiBnZXR0aW5nIHJlYWQgZnJvbSBieSB0aGUgZXh0ZXJuYWwgZGVzdGluYXRpb24uXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgb3B0aW9uYWwgY2FsbGJhY2sgd2hpY2ggd2lsbCBiZSBjYWxsZWRcbiAqIHdpdGggc3JjIGFuZCBkZXN0LlxuICogQHJldHVybnMge1N0cmVhbX0gSWYgY2FsbGJhY2sgaXMgcHJvdmlkZWQsIHRoZSBleHQgc3RyZWFtIHdpbGxcbiAqIGJlIHJldHVybmVkLCBvdGhlcndpc2UgYW4gb2JqZWN0IGlzIHJldHVybmVkIHdpdGggZWFjaCBzdHJlYW1cbiAqIGFzIGEgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVN0cmVhbXMgKGNhbGxiYWNrKSB7XG4gIHZhciBvbklSID0gKCkgPT4gdW5kZWZpbmVkO1xuICB2YXIgb25FUiA9ICgpID0+IHVuZGVmaW5lZDtcblxuICB2YXIgZGVzdCA9IG5ldyBzdHJlYW0uV3JpdGFibGUoe1xuICAgIG9iamVjdE1vZGU6IHRydWUsXG4gICAgd3JpdGU6IChkLCBlLCBjKSA9PiB7XG4gICAgICBpZiAoIWV4dC5wdXNoKGQpKSB7XG4gICAgICAgIHJldHVybiBvbkVSID0gYztcbiAgICAgIH1cbiAgICAgIGMoKTtcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBzcmMgPSBuZXcgc3RyZWFtLlJlYWRhYmxlKHtcbiAgICBvYmplY3RNb2RlOiB0cnVlLFxuICAgIHJlYWQ6ICgpID0+IG9uSVIoKVxuICB9KVxuXG4gIHZhciBleHQgPSBuZXcgc3RyZWFtLkR1cGxleCh7XG4gICAgcmVhZGFibGVPYmplY3RNb2RlOiB0cnVlLFxuICAgIHdyaXRhYmxlT2JqZWN0TW9kZTogdHJ1ZSxcbiAgICB3cml0ZTogKGQsIGUsIGMpID0+IHtcbiAgICAgIGlmICghc3JjLnB1c2goZCkpe1xuICAgICAgICByZXR1cm4gb25JUiA9IGM7XG4gICAgICB9XG4gICAgICBjKCk7XG4gICAgfSxcbiAgICByZWFkOiAoKSA9PiBvbkVSKClcbiAgfSk7XG5cbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2soc3JjLCBkZXN0KTtcbiAgICByZXR1cm4gZXh0O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkZXN0OiBkZXN0LFxuICAgIHNyYzogc3JjLFxuICAgIGV4dDogZXh0XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGVTdHJlYW1zOiBjcmVhdGVTdHJlYW1zXG59O1xuIl19