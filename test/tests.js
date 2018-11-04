const parser = require("../bin/js-date-parse.js");

QUnit.test("united_states_date", (assert) =>
{
	assert.deepEqual(parser.parse("MM/dd/yyyy", "3/14/1990"), new Date(1990, 2, 14, 0, 0, 0, 0));
});

QUnit.test("european_date", (assert) =>
{
	assert.deepEqual(parser.parse("dd/MM/yyyy", "14/3/1990"), new Date(1990, 2, 14, 0, 0, 0, 0));
});
