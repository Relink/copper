var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
var sinon = require('sinon');
var _ = require('lodash');
var stream = require('stream');
var EventEmitter = require('events').EventEmitter;
var BufferStream = require('./BufferStream');

describe('BufferStream', () => {

  // Create readable stream for testing.
  require('util').inherits(SourceStream, stream.Readable);
  function SourceStream (options) {
    stream.Readable.call(this, options);
  }
  SourceStream.prototype._read = function () {
  };

  beforeEach(() => {

  })

  it('pauses and resumes stream based on predicate', done => {
    var ready = true;
    var predicate = function () {
      return ready == false;
    };

    var stream = new BufferStream(predicate, 0);
    stream._writableState.highWaterMark = 0;
    var src = new SourceStream({ objectMode: true });
    var messages = [];

    src.pipe(stream).on('data', msg => {
      messages.push(msg)
    })

    src.push(1);
    src.push(2);
    process.nextTick(() => {

      // First message should go through, predicate is returning false.
      // Second message should get caught in buffer (highwatermark set to 1)
      expect(messages).to.deep.equal([1]);
      ready = false;
      src.push(3);
      src.push(4);
      process.nextTick(() => {

        // Be sure that without the ready state changing,
        // we did not send any messages
        expect(messages).to.deep.equal([1]);
        ready = true;

        // need 30ms just to make give the callstack time to
        // cycle through the settimeout in the function!
        // All messages should go through in order.
        setTimeout(() => {
          expect(messages).to.deep.equal([1,2,3,4]);
          done();
        }, 30)
      });
    });
  });
});
