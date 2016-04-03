'use strict';

var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
var sinon = require('sinon');
var _ = require('lodash');
var stream = require('stream');
var EventEmitter = require('events').EventEmitter;
var BufferStream = require('./BufferStream');

describe('BufferStream', function () {

  // Create readable stream for testing.
  require('util').inherits(SourceStream, stream.Readable);
  function SourceStream(options) {
    stream.Readable.call(this, options);
  }
  SourceStream.prototype._read = function () {};

  beforeEach(function () {});

  it('pauses and resumes stream based on predicate', function (done) {
    var ready = true;
    var predicate = function predicate() {
      return ready == false;
    };

    var stream = new BufferStream(predicate, 0);
    stream._writableState.highWaterMark = 0;
    var src = new SourceStream({ objectMode: true });
    var messages = [];

    src.pipe(stream).on('data', function (msg) {
      messages.push(msg);
    });

    src.push(1);
    src.push(2);
    process.nextTick(function () {

      // First message should go through, predicate is returning false.
      // Second message should get caught in buffer (highwatermark set to 1)
      expect(messages).to.deep.equal([1]);
      ready = false;
      src.push(3);
      src.push(4);
      process.nextTick(function () {

        // Be sure that without the ready state changing,
        // we did not send any messages
        expect(messages).to.deep.equal([1]);
        ready = true;

        // need 30ms just to make give the callstack time to
        // cycle through the settimeout in the function!
        // All messages should go through in order.
        setTimeout(function () {
          expect(messages).to.deep.equal([1, 2, 3, 4]);
          done();
        }, 30);
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9CdWZmZXJTdHJlYW0uc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksT0FBTyxRQUFRLE1BQVIsQ0FBUDtBQUNKLEtBQUssR0FBTCxDQUFTLFFBQVEsWUFBUixDQUFUO0FBQ0EsSUFBSSxTQUFTLEtBQUssTUFBTDtBQUNiLElBQUksUUFBUSxRQUFRLE9BQVIsQ0FBUjtBQUNKLElBQUksSUFBSSxRQUFRLFFBQVIsQ0FBSjtBQUNKLElBQUksU0FBUyxRQUFRLFFBQVIsQ0FBVDtBQUNKLElBQUksZUFBZSxRQUFRLFFBQVIsRUFBa0IsWUFBbEI7QUFDbkIsSUFBSSxlQUFlLFFBQVEsZ0JBQVIsQ0FBZjs7QUFFSixTQUFTLGNBQVQsRUFBeUIsWUFBTTs7O0FBRzdCLFVBQVEsTUFBUixFQUFnQixRQUFoQixDQUF5QixZQUF6QixFQUF1QyxPQUFPLFFBQVAsQ0FBdkMsQ0FINkI7QUFJN0IsV0FBUyxZQUFULENBQXVCLE9BQXZCLEVBQWdDO0FBQzlCLFdBQU8sUUFBUCxDQUFnQixJQUFoQixDQUFxQixJQUFyQixFQUEyQixPQUEzQixFQUQ4QjtHQUFoQztBQUdBLGVBQWEsU0FBYixDQUF1QixLQUF2QixHQUErQixZQUFZLEVBQVosQ0FQRjs7QUFVN0IsYUFBVyxZQUFNLEVBQU4sQ0FBWCxDQVY2Qjs7QUFjN0IsS0FBRyw4Q0FBSCxFQUFtRCxnQkFBUTtBQUN6RCxRQUFJLFFBQVEsSUFBUixDQURxRDtBQUV6RCxRQUFJLFlBQVksU0FBWixTQUFZLEdBQVk7QUFDMUIsYUFBTyxTQUFTLEtBQVQsQ0FEbUI7S0FBWixDQUZ5Qzs7QUFNekQsUUFBSSxTQUFTLElBQUksWUFBSixDQUFpQixTQUFqQixFQUE0QixDQUE1QixDQUFULENBTnFEO0FBT3pELFdBQU8sY0FBUCxDQUFzQixhQUF0QixHQUFzQyxDQUF0QyxDQVB5RDtBQVF6RCxRQUFJLE1BQU0sSUFBSSxZQUFKLENBQWlCLEVBQUUsWUFBWSxJQUFaLEVBQW5CLENBQU4sQ0FScUQ7QUFTekQsUUFBSSxXQUFXLEVBQVgsQ0FUcUQ7O0FBV3pELFFBQUksSUFBSixDQUFTLE1BQVQsRUFBaUIsRUFBakIsQ0FBb0IsTUFBcEIsRUFBNEIsZUFBTztBQUNqQyxlQUFTLElBQVQsQ0FBYyxHQUFkLEVBRGlDO0tBQVAsQ0FBNUIsQ0FYeUQ7O0FBZXpELFFBQUksSUFBSixDQUFTLENBQVQsRUFmeUQ7QUFnQnpELFFBQUksSUFBSixDQUFTLENBQVQsRUFoQnlEO0FBaUJ6RCxZQUFRLFFBQVIsQ0FBaUIsWUFBTTs7OztBQUlyQixhQUFPLFFBQVAsRUFBaUIsRUFBakIsQ0FBb0IsSUFBcEIsQ0FBeUIsS0FBekIsQ0FBK0IsQ0FBQyxDQUFELENBQS9CLEVBSnFCO0FBS3JCLGNBQVEsS0FBUixDQUxxQjtBQU1yQixVQUFJLElBQUosQ0FBUyxDQUFULEVBTnFCO0FBT3JCLFVBQUksSUFBSixDQUFTLENBQVQsRUFQcUI7QUFRckIsY0FBUSxRQUFSLENBQWlCLFlBQU07Ozs7QUFJckIsZUFBTyxRQUFQLEVBQWlCLEVBQWpCLENBQW9CLElBQXBCLENBQXlCLEtBQXpCLENBQStCLENBQUMsQ0FBRCxDQUEvQixFQUpxQjtBQUtyQixnQkFBUSxJQUFSOzs7OztBQUxxQixrQkFVckIsQ0FBVyxZQUFNO0FBQ2YsaUJBQU8sUUFBUCxFQUFpQixFQUFqQixDQUFvQixJQUFwQixDQUF5QixLQUF6QixDQUErQixDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFPLENBQVAsQ0FBL0IsRUFEZTtBQUVmLGlCQUZlO1NBQU4sRUFHUixFQUhILEVBVnFCO09BQU4sQ0FBakIsQ0FScUI7S0FBTixDQUFqQixDQWpCeUQ7R0FBUixDQUFuRCxDQWQ2QjtDQUFOLENBQXpCIiwiZmlsZSI6IkJ1ZmZlclN0cmVhbS5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNoYWkgPSByZXF1aXJlKCdjaGFpJyk7XG5jaGFpLnVzZShyZXF1aXJlKCdzaW5vbi1jaGFpJykpO1xudmFyIGV4cGVjdCA9IGNoYWkuZXhwZWN0O1xudmFyIHNpbm9uID0gcmVxdWlyZSgnc2lub24nKTtcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG52YXIgc3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJyk7XG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xudmFyIEJ1ZmZlclN0cmVhbSA9IHJlcXVpcmUoJy4vQnVmZmVyU3RyZWFtJyk7XG5cbmRlc2NyaWJlKCdCdWZmZXJTdHJlYW0nLCAoKSA9PiB7XG5cbiAgLy8gQ3JlYXRlIHJlYWRhYmxlIHN0cmVhbSBmb3IgdGVzdGluZy5cbiAgcmVxdWlyZSgndXRpbCcpLmluaGVyaXRzKFNvdXJjZVN0cmVhbSwgc3RyZWFtLlJlYWRhYmxlKTtcbiAgZnVuY3Rpb24gU291cmNlU3RyZWFtIChvcHRpb25zKSB7XG4gICAgc3RyZWFtLlJlYWRhYmxlLmNhbGwodGhpcywgb3B0aW9ucyk7XG4gIH1cbiAgU291cmNlU3RyZWFtLnByb3RvdHlwZS5fcmVhZCA9IGZ1bmN0aW9uICgpIHtcbiAgfTtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcblxuICB9KVxuXG4gIGl0KCdwYXVzZXMgYW5kIHJlc3VtZXMgc3RyZWFtIGJhc2VkIG9uIHByZWRpY2F0ZScsIGRvbmUgPT4ge1xuICAgIHZhciByZWFkeSA9IHRydWU7XG4gICAgdmFyIHByZWRpY2F0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiByZWFkeSA9PSBmYWxzZTtcbiAgICB9O1xuXG4gICAgdmFyIHN0cmVhbSA9IG5ldyBCdWZmZXJTdHJlYW0ocHJlZGljYXRlLCAwKTtcbiAgICBzdHJlYW0uX3dyaXRhYmxlU3RhdGUuaGlnaFdhdGVyTWFyayA9IDA7XG4gICAgdmFyIHNyYyA9IG5ldyBTb3VyY2VTdHJlYW0oeyBvYmplY3RNb2RlOiB0cnVlIH0pO1xuICAgIHZhciBtZXNzYWdlcyA9IFtdO1xuXG4gICAgc3JjLnBpcGUoc3RyZWFtKS5vbignZGF0YScsIG1zZyA9PiB7XG4gICAgICBtZXNzYWdlcy5wdXNoKG1zZylcbiAgICB9KVxuXG4gICAgc3JjLnB1c2goMSk7XG4gICAgc3JjLnB1c2goMik7XG4gICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG5cbiAgICAgIC8vIEZpcnN0IG1lc3NhZ2Ugc2hvdWxkIGdvIHRocm91Z2gsIHByZWRpY2F0ZSBpcyByZXR1cm5pbmcgZmFsc2UuXG4gICAgICAvLyBTZWNvbmQgbWVzc2FnZSBzaG91bGQgZ2V0IGNhdWdodCBpbiBidWZmZXIgKGhpZ2h3YXRlcm1hcmsgc2V0IHRvIDEpXG4gICAgICBleHBlY3QobWVzc2FnZXMpLnRvLmRlZXAuZXF1YWwoWzFdKTtcbiAgICAgIHJlYWR5ID0gZmFsc2U7XG4gICAgICBzcmMucHVzaCgzKTtcbiAgICAgIHNyYy5wdXNoKDQpO1xuICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG5cbiAgICAgICAgLy8gQmUgc3VyZSB0aGF0IHdpdGhvdXQgdGhlIHJlYWR5IHN0YXRlIGNoYW5naW5nLFxuICAgICAgICAvLyB3ZSBkaWQgbm90IHNlbmQgYW55IG1lc3NhZ2VzXG4gICAgICAgIGV4cGVjdChtZXNzYWdlcykudG8uZGVlcC5lcXVhbChbMV0pO1xuICAgICAgICByZWFkeSA9IHRydWU7XG5cbiAgICAgICAgLy8gbmVlZCAzMG1zIGp1c3QgdG8gbWFrZSBnaXZlIHRoZSBjYWxsc3RhY2sgdGltZSB0b1xuICAgICAgICAvLyBjeWNsZSB0aHJvdWdoIHRoZSBzZXR0aW1lb3V0IGluIHRoZSBmdW5jdGlvbiFcbiAgICAgICAgLy8gQWxsIG1lc3NhZ2VzIHNob3VsZCBnbyB0aHJvdWdoIGluIG9yZGVyLlxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBleHBlY3QobWVzc2FnZXMpLnRvLmRlZXAuZXF1YWwoWzEsMiwzLDRdKTtcbiAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0sIDMwKVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=