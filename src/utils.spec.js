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
      expect(s.write([1,2,3,4])).to.be.true
      expect(s.read()).to.equal(1);
      expect(s.write([5])).to.be.false
      expect(s.read()).to.equal(2);
      expect(s.read()).to.equal(3);
      expect(s.read()).to.equal(4);
      expect(s.read()).to.equal(5);
      expect(s.write([6,7])).to.be.true
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
});
