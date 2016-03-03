var stream = require('stream');
var _ = require('lodash');

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
function createStreams (callback) {
  var onIR = _.noop;
  var onER = _.noop;

  var dest = new stream.Writable({
    objectMode: true,
    write: (d, e, c) => {
      if (!ext.push(d)) {
        return onER = c;
      }
      c();
    }
  });

  var src = new stream.Readable({
    objectMode: true,
    read: () => onIR()
  })

  var ext = new stream.Duplex({
    readableObjectMode: true,
    writableObjectMode: true,
    write: (d, e, c) => {
      if (!src.push(d)){
        return onIR = c;
      }
      c();
    },
    read: () => onER()
  });

  if (typeof callback == 'function') {
    callback(src, dest);
    return ext;
  }
  return {
    dest: dest,
    src: src,
    ext: ext
  }
};

module.exports = {
  createStreams: createStreams
};
