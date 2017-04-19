module.exports = function(error) {
  assert.isAbove(error.message.search("'length' of undefined"), -1, '"Length is undefined" error must be returned');
}