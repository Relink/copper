var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
var sinon = require('sinon');
var _ = require('lodash');
var stream = require('stream');
var EventEmitter = require('events').EventEmitter;
var utils = require('./utils')

describe('sequence', () => {
  describe('create', () => {
    it('applies backpressure and remembers everything', () => {
      var s = utils.sequence({ highWaterMark: 2});
      expect(s.write([1,2,undefined,4])).to.be.true
      expect(s.read()).to.equal(1);
      expect(s.write([5])).to.be.false
      expect(s.read()).to.equal(2);
      expect(s.read()).to.equal(undefined);
      expect(s.read()).to.equal(4);
      expect(s.read()).to.equal(5);
      expect(s.write([6, 7])).to.be.true
      expect(s.read()).to.equal(6);
      expect(s.read()).to.equal(7);
      expect(s.read()).to.equal(null);
    });
  });

  describe('filter', () => {
    it('filters by predicate', done => {
      var s1 = new stream.Readable({objectMode: true});
      s1._read = () => null;

      var filtered = s1.pipe(utils.filter(_.isNumber));
      s1.push('foo');
      s1.push('bar');
      s1.push(1);
      filtered.on('readable', () => {
        expect(filtered.read()).to.equal(1)
        done();
      });
    });
  });

  describe('write', () => {
    var s2;

    beforeEach(() => {
      s2 = new stream.Transform({
        objectMode: true,
        highWaterMark: 2,
        transform: (d, e, cb) => cb(null, d)
      });
    });

    it('calls the callback immediately if the write queue is open', done => {
      utils.write(s2, 'foo').then(() => done())
    });

    it('calls the callback after drain, if the write queue is full', done => {
      s2.write = sinon.stub();
      s2.write.returns(false);
      var resolved = false;

      utils
        .write(s2, 'foo')
        .then(() => {
          resolved = true;
          done();
        });

      setTimeout(() => {
        expect(resolved).to.be.false;
        s2.write.returns(true);
        s2.emit('drain');
      });
    });
  });
});
