const parser = require("../js-date-parse.js");

function parsedDateEqual(test)
{
	const actual = parser.parse(test.format, test.value);
	const expected = test.expected;
	
	return actual.getFullYear() === expected.getFullYear() &&
		actual.getMonth() === expected.getMonth() &&
		actual.getDate() === expected.getDate() &&
		actual.getHours() === expected.getHours() &&
		actual.getMinutes() === expected.getMinutes() &&
		actual.getSeconds() === expected.getSeconds() &&
		actual.getMilliseconds() === expected.getMilliseconds();
}

QUnit.test("invariant", (assert) =>
{
	assert.deepEqual(parser.parse("yyyy-MM-dd hh:mm:ss.fff", "2012-05-06 09:37:42.012"), new Date(2012, 4, 6, 9, 37, 42, 12))
});