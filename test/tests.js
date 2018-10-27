const parser = require("../bin/js-date-parse.js");

QUnit.test("invariant", (assert) =>
{
	assert.deepEqual(parser.parse("yyyy-MM-dd hh:mm:ss.fff", "2012-05-06 09:37:42.012"), new Date(2012, 4, 6, 9, 37, 42, 12))
});