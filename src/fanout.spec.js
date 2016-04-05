var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
var sinon = require('sinon');
var _ = require('lodash');
var stream = require('stream');
var EventEmitter = require('events').EventEmitter;
var fanout = require('./fanout')


describe('fanout', () => {

  describe('createStreams', () => {

    it('creates a direct connection between input stream and src ', done => {
      var input = stream.Readable({ objectMode: true, highWaterMark: 2, read: sinon.stub() });
      var created = fanout.createStreams();
      var ext = created.ext;
      var src = created.src;

      sinon.stub(src, 'push', src.push);
      sinon.stub(ext, 'write', ext.write);

      input.pipe(ext);

      var i = 0;
      var pushResults = []
      while (++i <= 3) pushResults.push(input.push(i));

      expect(pushResults).to.deep.equal([true, false, false]);
      expect(src.push.callCount).to.equal(0);
      expect(ext.write.callCount).to.equal(0);
      expect(input._read.callCount).to.equal(0)

      setTimeout(() => {

        // Note: this shows that these are all asyncrhonous:
        expect(src.push.callCount).to.equal(3);
        expect(ext.write.callCount).to.equal(3);
        expect(input._read.callCount).to.equal(1)
        var j = 0;
        var readResults = [];
        while(++j <= 3) readResults.push(src.read());

        expect(readResults).to.deep.equal([1,2,3]);
        done();
      })
    });

    it('src will cause more read calls from the input', done => {

      // --------------------------------------------
      // this mess simulates our kafka consumer stream
      // ---------------------------------------------

      var consumer = new EventEmitter();
      var paused = true;
      var i = 0;

      function emit (consumer) {
        if (paused) return;
        consumer.emit('data', ++i);
        setTimeout(() => {
          emit(consumer)
        }, 100)
      }

      consumer.on('resume', () => {
        paused = false;
        emit(consumer);
      })

      consumer.on('pause', () => {
        paused = true;
      })

      function reader () {
        consumer.emit('resume');
      }

      var input = stream.Readable({ objectMode: true, highWaterMark: 2, read: reader });

      consumer.on('data', data => {
        if (!input.push(data)) {
          consumer.emit('pause');
        }
      });

      // ------------------------------------------------
      // end mess
      // ------------------------------------------------

      var created = fanout.createStreams();
      var ext = created.ext;
      var src = created.src;

      src._readableState.highWaterMark = 2;
      ext._writableState.highWaterMark = 3;

      sinon.stub(src, 'push', src.push);
      sinon.stub(ext, 'write', ext.write);
      sinon.stub(input, 'push', input.push);

      input.on('readable', _.noop); // kick off

      input
        .pipe(ext);

      // nothing should happen syncrhonously
      expect(src.push.callCount).to.equal(0);

      setTimeout(() => {

        // Here we see the effects of buffering that builds up
        // before the emitter is stopped.
        expect(input.push.callCount).to.equal(6);
        expect(ext.write.callCount).to.equal(4);
        expect(src.push.callCount).to.equal(2);

        // read 6 times
        var firstReads = [];
        var i = 0;
        while (++i <= 6) firstReads.push(src.read());
        expect(firstReads).to.deep.equal([1,2,3,4,5,6]);

        // reading 6 times should have called the input.push
        // function 6 more times, and filled up all the other
        // buffers along the way.
        expect(input.push.callCount).to.equal(12);
        expect(ext.write.callCount).to.equal(10);
        expect(src.push.callCount).to.equal(8);

        done();
      })
    })
  })
});
