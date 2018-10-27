const parser = require("../bin/js-date-parse.js");

QUnit.test("invariant", (assert) =>
{
	assert.deepEqual(parser.parse("yyyy-MM-dd hh:mm:ss.fff", "2012-05-06 09:37:42.012"), new Date(2012, 4, 6, 9, 37, 42, 12));
});

QUnit.test("invariant_twodigitms", (assert) =>
{
	assert.deepEqual(parser.parse("yyyy-MM-dd hh:mm:ss.fff", "2012-05-06 09:37:42.12"), new Date(2012, 4, 6, 9, 37, 42, 12));
});

QUnit.test("invariant_onedigitday", (assert) =>
{
	assert.deepEqual(parser.parse("yyyy-MM-dd hh:mm:ss.fff", "2012-05-6 09:37:42.12"), new Date(2012, 4, 6, 9, 37, 42, 12));
});

QUnit.test("invariant_onedigitmonth", (assert) =>
{
	assert.deepEqual(parser.parse("yyyy-MM-dd hh:mm:ss.fff", "2012-5-06 09:37:42.12"), new Date(2012, 4, 6, 9, 37, 42, 12));
});

QUnit.test("monthname", (assert) =>
{
	assert.deepEqual(parser.parse("MMMM, dd, yy", "July, 12, 14"), new Date(2014, 6, 12, 0, 0, 0, 0));
});

QUnit.test("shortmonthname", (assert) =>
{
	assert.deepEqual(parser.parse("MMM, dd, yy", "Jul, 12, 14"), new Date(2014, 6, 12, 0, 0, 0, 0));
});

QUnit.test("dayname", (assert) =>
{
	assert.deepEqual(parser.parse("dddd, MMM d, yyyy", "Monday, Jul 12, 2014"), new Date(2014, 6, 12, 0, 0, 0, 0));
});

QUnit.test("shortdayname", (assert) =>
{
	assert.deepEqual(parser.parse("ddd, MMM d, yyyy", "Mo, Jul 12, 2014"), new Date(2014, 6, 12, 0, 0, 0, 0));
});