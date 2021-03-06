'use strict';

var _ = require('lodash');
var util = require('util');
var Transform = require('stream').Transform;
util.inherits(BufferStream, Transform);

/**
 * Creates a transform stream that puts backpressure on the incoming stream whenever
 * the predicate returns true.
 *
 * @param {Function} predicate this should return true when the stream should
 * stop reading from the input
 * @param {Number} timeout polling frequency - how often to check the predicate
 * after the stream is paused.
 * @param {} options
 */
function BufferStream(predicate, timeout, options) {
  options = _.merge({ objectMode: true }, options);
  Transform.call(this, options);
  this.timeout = timeout == undefined ? 100 : timeout;
  this.predicate = predicate;
};

BufferStream.prototype._transform = function (data, encoding, done) {
  var _this = this;

  if (this.predicate()) {
    return setTimeout(function () {
      return _this._transform(data, encoding, done);
    }, this.timeout);
  }
  done(null, data);
};

module.exports = BufferStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9CdWZmZXJTdHJlYW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLElBQUksUUFBUSxRQUFSLENBQUo7QUFDSixJQUFJLE9BQU8sUUFBUSxNQUFSLENBQVA7QUFDSixJQUFJLFlBQVksUUFBUSxRQUFSLEVBQWtCLFNBQWxCO0FBQ2hCLEtBQUssUUFBTCxDQUFjLFlBQWQsRUFBNEIsU0FBNUI7Ozs7Ozs7Ozs7OztBQVlBLFNBQVMsWUFBVCxDQUFzQixTQUF0QixFQUFpQyxPQUFqQyxFQUEwQyxPQUExQyxFQUFtRDtBQUNqRCxZQUFVLEVBQUUsS0FBRixDQUFRLEVBQUUsWUFBWSxJQUFaLEVBQVYsRUFBOEIsT0FBOUIsQ0FBVixDQURpRDtBQUVqRCxZQUFVLElBQVYsQ0FBZSxJQUFmLEVBQXFCLE9BQXJCLEVBRmlEO0FBR2pELE9BQUssT0FBTCxHQUFlLFdBQVcsU0FBWCxHQUF1QixHQUF2QixHQUE2QixPQUE3QixDQUhrQztBQUlqRCxPQUFLLFNBQUwsR0FBaUIsU0FBakIsQ0FKaUQ7Q0FBbkQ7O0FBUUEsYUFBYSxTQUFiLENBQXVCLFVBQXZCLEdBQW9DLFVBQVUsSUFBVixFQUFnQixRQUFoQixFQUEwQixJQUExQixFQUFnQzs7O0FBQ2xFLE1BQUksS0FBSyxTQUFMLEVBQUosRUFBcUI7QUFDbkIsV0FBTyxXQUFXO2FBQU0sTUFBSyxVQUFMLENBQWdCLElBQWhCLEVBQXNCLFFBQXRCLEVBQWdDLElBQWhDO0tBQU4sRUFBNkMsS0FBSyxPQUFMLENBQS9ELENBRG1CO0dBQXJCO0FBR0EsT0FBSyxJQUFMLEVBQVcsSUFBWCxFQUprRTtDQUFoQzs7QUFPcEMsT0FBTyxPQUFQLEdBQWlCLFlBQWpCIiwiZmlsZSI6IkJ1ZmZlclN0cmVhbS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbnZhciBUcmFuc2Zvcm0gPSByZXF1aXJlKCdzdHJlYW0nKS5UcmFuc2Zvcm07XG51dGlsLmluaGVyaXRzKEJ1ZmZlclN0cmVhbSwgVHJhbnNmb3JtKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgdHJhbnNmb3JtIHN0cmVhbSB0aGF0IHB1dHMgYmFja3ByZXNzdXJlIG9uIHRoZSBpbmNvbWluZyBzdHJlYW0gd2hlbmV2ZXJcbiAqIHRoZSBwcmVkaWNhdGUgcmV0dXJucyB0cnVlLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSB0aGlzIHNob3VsZCByZXR1cm4gdHJ1ZSB3aGVuIHRoZSBzdHJlYW0gc2hvdWxkXG4gKiBzdG9wIHJlYWRpbmcgZnJvbSB0aGUgaW5wdXRcbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lb3V0IHBvbGxpbmcgZnJlcXVlbmN5IC0gaG93IG9mdGVuIHRvIGNoZWNrIHRoZSBwcmVkaWNhdGVcbiAqIGFmdGVyIHRoZSBzdHJlYW0gaXMgcGF1c2VkLlxuICogQHBhcmFtIHt9IG9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gQnVmZmVyU3RyZWFtKHByZWRpY2F0ZSwgdGltZW91dCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gXy5tZXJnZSh7IG9iamVjdE1vZGU6IHRydWUgfSwgb3B0aW9ucyk7XG4gIFRyYW5zZm9ybS5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICB0aGlzLnRpbWVvdXQgPSB0aW1lb3V0ID09IHVuZGVmaW5lZCA/IDEwMCA6IHRpbWVvdXQ7XG4gIHRoaXMucHJlZGljYXRlID0gcHJlZGljYXRlO1xufTtcblxuXG5CdWZmZXJTdHJlYW0ucHJvdG90eXBlLl90cmFuc2Zvcm0gPSBmdW5jdGlvbiAoZGF0YSwgZW5jb2RpbmcsIGRvbmUpIHtcbiAgaWYgKHRoaXMucHJlZGljYXRlKCkpe1xuICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHRoaXMuX3RyYW5zZm9ybShkYXRhLCBlbmNvZGluZywgZG9uZSksIHRoaXMudGltZW91dCk7XG4gIH1cbiAgZG9uZShudWxsLCBkYXRhKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQnVmZmVyU3RyZWFtO1xuIl19