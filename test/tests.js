const parser = require("../bin/js-date-parse.js");

QUnit.test("invariant", (assert) =>
{
	assert.deepEqual(parser.parse("yyyy-MM-dd hh:mm:ss.fff", "2012-05-06 09:37:42.012"), new Date(2012, 4, 6, 9, 37, 42, 12));
});

QUnit.test("monthname", (assert) =>
{
	assert.deepEqual(parser.parse("MMMM, dd, yy", "July, 12, 14"), new Date(2014, 6, 12, 0, 0, 0, 0));
});