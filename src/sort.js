const utils = require('./utils');
const fanout = require('./fanout').createStreams;

/**
 *
 * @param {function} translate function that turns the data
 * into an integer for sorting.
 * @param {integer} start The initial value.
 * @param {integer} [max] The maximum length to allow the internal
 * buffer to get before emitting an error.
 * @returns {Stream}
 */
function sort (translate, start, max) {

  return fanout(function (src, dest) {
    // src and dest and transforma and max and start.
  })
}


function wait(src, dest, start, translate, messages = []) {
  src.on('readable', handleData);

  function handleData () {
    src.removeListener('readable', handleNewData)

    // recurse through the magic
    magic(src, dest, start, translate, messages)
      .then(params => wait.apply(null, params));
  };
}


// returns promise that resolves to final params for itself
// for next call
function magic (src, dest, start, translate, messages) {
  [head, ...tail] = messages;
  if (translate(head) == start + 1) {
    return utils.write(dest, head)
      .then(magic.bind(null, src, dest, start + 1, translate, tail));
  }

  const msg = src.read();
  if (msg) {
    messages.push(msg).sort();
    return magic(src, dest, start, translate, messages)
  }

  // base case,
  return Promise.resolve([src, dest, start, translate, messages]);
}
