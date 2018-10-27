
const DEBUG = true;
let monthNames = [
	"january",
	"february",
	"march",
	"april",
	"may",
	"june",
	"july",
	"august",
	"september",
	"october",
	"november",
	"december",
];
let shortMonthNames = [
	"jan",
	"feb",
	"mar",
	"apr",
	"may",
	"jun",
	"jul",
	"aug",
	"sept",
	"oct",
	"nov",
	"dec",
];

let amPmNames = { am: "am", pm: "pm"};
let shortAmPmNames = { am: "a", pm: "p"};

type DateComponentType = "year" | "month" | "day" | "hour" | "minute" | "second" | "millisecond" | "ampm" | "literal";

interface Parser
{
	type: DateComponentType;
	parse: (v: string) => number;
}

export function parse(format: string, value: string): Date
{
	let pattern = "";
	const parsers = [] as Parser[];

	value = value.toLowerCase();

	let i = 0;
	while (i < format.length)
	{
		const spec = eatSpecifier(format, i);

		i += spec.str.length;

		if (spec.parser) 
		{
			// A parser is specified for this group, capture it
			parsers.push(spec.parser);
			pattern += `(${spec.pattern})`;
		}
		else
		{
			// No parser is specified for this group, don't add parens
			pattern += spec.pattern;
		}
	}

	if (DEBUG)
		console.log(`Generated pattern for matching: ${pattern}`);

	const match = new RegExp(`^${pattern}$`).exec(value);

	if (!match)
		return null;

	return dateFromMatch(match, parsers);
}

function eatSameChar(format: string, pos: number): string
{
	const char = format.charAt(pos);

	if (format.charAt(pos+1) !== char)
		return char;
	else if (format.charAt(pos+2) !== char)
		return char + char;
	else if (format.charAt(pos+3) !== char)
		return char + char + char;
	else
		return char + char + char + char;
}

function eatUntilMatch(format: string, pos: number): string
{
	const charToMatch = format.charAt(pos);
	let str = charToMatch;

	let i = pos + 1;
	for (; i < format.length; i++)
	{
		const char = format.charAt(i);
		str += char;
		if (char === charToMatch)
			break;
	}

	if (i === format.length)
		throw "Unterminated literal";

	return str;
}

class SpecifierParserFactory
{
	public static FromFormatAndPosition(format: string, pos: number): SpecifierParser
	{
		switch (format.charAt(pos))
		{
			case "y":
				return new YearSpecifierParser(format, pos);
			case "M":
				return new MonthSpecifierParser(format, pos);
			case "d":
				return new DaySpecifierParser(format, pos);
			case "h":
				return new HourSpecifierParser(format, pos);
			case "m":
				return new MinuteSpecifierParser(format, pos);
			case "s":
				return new SecondSpecifierParser(format, pos);
			case "f":
				return new MillisecondSpecifierParser(format, pos);
			case "t":
				return new AmPmSpecifierParser(format, pos);
			case "'":
			case "\"":
				return new LiteralSpecifierParser(format, pos);
			default:
				return null;
		}
	}
}


abstract class SpecifierParser
{
	constructor(public str: string, public pattern: string, public parser: Parser) {}
}

class IntegerSpecifierParser extends SpecifierParser
{
	constructor(format: string, pos: number, type: DateComponentType, maxDigits: number)
	{
		super(
			eatSameChar(format, pos),
			`\\d{1,${maxDigits}}`,
			{ type: type, parse: (v: string) => parseInt(v, 10) }
		);
	}
}

class YearSpecifierParser extends IntegerSpecifierParser
{
	constructor(format: string, pos: number)
	{
		super(format, pos, "year", 4);
	}
}

class MonthSpecifierParser extends SpecifierParser
{
	constructor(format: string, pos: number)
	{
		const specifierChars = eatSameChar(format, pos);
		
		super(
			specifierChars,
			specifierChars.length === 1 || specifierChars.length === 2 ? `\\d{1,4}` : specifierChars.length === 3 ? shortMonthNames.join("|") : monthNames.join("|"),
			{
				type: "month",
				parse: specifierChars.length === 1 || specifierChars.length === 2 ? (v: string) => (parseInt(v, 10) - 1) : specifierChars.length === 3 ? (v: string) => shortMonthNames.indexOf(v) : (v: string) => monthNames.indexOf(v),
			}
		);
	}
}

class DaySpecifierParser extends IntegerSpecifierParser
{
	constructor(format: string, pos: number)
	{
		super(format, pos, "day", 2);
	}
}

class HourSpecifierParser extends IntegerSpecifierParser
{
	constructor(format: string, pos: number)
	{
		super(format, pos, "hour", 2);
	}
}

class MinuteSpecifierParser extends IntegerSpecifierParser
{
	constructor(format: string, pos: number)
	{
		super(format, pos, "minute", 2);
	}
}

class SecondSpecifierParser extends IntegerSpecifierParser
{
	constructor(format: string, pos: number)
	{
		super(format, pos, "second", 2);
	}
}

class MillisecondSpecifierParser extends IntegerSpecifierParser
{
	constructor(format: string, pos: number)
	{
		super(format, pos, "millisecond", 3);
	}
}

class AmPmSpecifierParser extends SpecifierParser
{
	constructor(format: string, pos: number)
	{
		const chars = eatSameChar(format, pos);
		const names = chars.length === 1 ? shortAmPmNames : amPmNames;
		super(
			chars,
			`${names.am}|${names.pm}`,
			{ type: "ampm", parse: (v: string) => (v === names.am ? 0 : 1) }
		);
	}
}

class LiteralSpecifierParser extends SpecifierParser
{
	constructor(format: string, pos: number)
	{
		const chars = eatUntilMatch(format, pos);
		super(
			chars,
			regexEscape(chars.substring(1, chars.length - 1)),
			{ type: "literal", parse: (v: string) => null }
		);
	}
}

function eatSpecifier(format: string, pos: number): SpecifierParser
{
	const parser = SpecifierParserFactory.FromFormatAndPosition(format, pos);

	if (parser)
		return parser;
	
	const char = format.charAt(pos);
	return {
		parser: null,
		str: char,
		pattern: char
	};	
}

function dateFromMatch(match: RegExpExecArray, parsers: Parser[]): Date
{
	if (match.length - 1 !== parsers.length)
		throw "Not the correct number of parsers for match groups returned";
	
	const date = new Date(0, 0, 0, 0, 0, 0, 0);

	let ampmType = null;
	
	for (let i = 1; i < match.length; i++)
	{
		const parser = parsers[i-1];
		const parsed = parser.parse(match[i]);

		switch (parser.type)
		{
			case "year":
				date.setFullYear(parsed);
				break;
			case "month":
				date.setMonth(parsed);
				break;
			case "day":
				date.setDate(parsed);
				break;
			case "hour":
				date.setHours(parsed);
				break;
			case "minute":
				date.setMinutes(parsed);
				break;
			case "second":
				date.setSeconds(parsed);
				break;
			case "millisecond":
				date.setMilliseconds(parsed);
				break;
			case "ampm":
				ampmType = parsed === 0 ? "am" : "pm";
				break;
			case "literal":
				break;
			default:
				throw "Unhandled parser format";
		}
	}

	if (ampmType != null)
	{
		const hours = date.getHours();
		if (ampmType === "pm" && hours < 12)
			date.setHours(hours + 12);
	}

	return date;
}

function regexEscape(pattern: string): string
{
	return pattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
