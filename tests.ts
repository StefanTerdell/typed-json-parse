import { Json } from ".";

const validString: Json<'"hello"'> = "hello";
const stringWithEscapedQuotes: Json<'"abc \\"def\\" ghi"'> = 'abc "def" ghi';
const stringUnexpectedEnd: Json<'"abc'> = "Invalid Json: Unexpected end of string";
const emptyString: Json<'""'> = "";

const validNumber: Json<'123'> = 123;
const negativeNumber: Json<'-123'> = -123;
const numberWithFraction: Json<'123.456'> = 123.456;
const numberWithExponent: Json<'1e10'> = 1e10;
const numberWithNegativeExponent: Json<'-1.23e-4'> = -1.23e-4;
const invalidNumberWithLeadingZero: Json<'0123'> = "Invalid Json: Numbers can not start with 0";

const validTrue: Json<'true'> = true;
const validFalse: Json<'false'> = false;
const invalidBoolean: Json<'truue'> = "Invalid Json: Expected a 'true' or 'false' literal";

const validNull: Json<'null'> = null;
const invalidNull: Json<'nul'> = "Invalid Json: Expected a 'null' literal";

const validArray: Json<'[1, true, "hello"]'> = [1, true, "hello"];
const arrayWithWhitespace: Json<'   [   1,   true   , "hello"   ]   '> = [1, true, "hello"];
const emptyArray: Json<'[]'> = [];
const arrayWithInvalidItem: Json<'[1, truue]'> = "Invalid Json: Expected a value: Expected a 'true' or 'false' literal";

const validObject: Json<'{"x": true, "y": 123}'> = { x: true, y: 123 };
const emptyObject: Json<'{}'> = {};
const objectWithEscapedQuotesInKey: Json<'{ "foo\\"bar": true }'> = { 'foo"bar': true };
const objectWithInvalidKey: Json<'{123: true}'> = "Invalid Json: Expected a string key: Expected double quotes";
const objectWithMissingColon: Json<'{"x" true}'> = "Invalid Json: Expected a :";
const objectWithExtraComma: Json<'{"x": true, }'> = "Invalid Json: Expected a string key: Expected double quotes";

const complexObject: Json<`{
  "hello": "world",
  "nestedArray": [1, "two", {"key": false}],
  "anotherObject": { "a": 123, "b": true },
  "numberWithExponent": 2.5e10
}`> = {
  hello: "world",
  nestedArray: [1, "two", { key: false }],
  anotherObject: { a: 123, b: true },
  numberWithExponent: 2.5e10,
};

const validObjectWithUnexpectedSuffix: Json<'{"x": true, "y": 123}abc'> =
  "Unexpected suffix: 'abc'";
const invalidBooleanLiteral: Json<'falsee'> = "Unexpected suffix: 'e'"
const invalidNumber: Json<'123e+ab'> = "Unexpected suffix: 'ab'";
