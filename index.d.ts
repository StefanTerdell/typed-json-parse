type JsonString<T, Literal extends boolean> = T extends `"${infer Tail}`
  ? ReadJsonString<Tail, Literal, "">
  : "Expected double quotes";

type ReadJsonString<
  T,
  Literal extends boolean,
  Acc extends string,
> = T extends `"${infer Tail}`
  ? [Literal extends true ? Acc : string, Tail]
  : T extends `\\"${infer Tail}`
    ? ReadJsonString<Tail, Literal, `${Acc}"`>
    : T extends `${infer Head}${infer Tail}`
      ? ReadJsonString<Tail, Literal, `${Acc}${Head}`>
      : "Unexpected end of string";

type JsonNumber<T> = T extends `-${infer Tail}`
  ? JsonNumberPositive<Tail>
  : JsonNumberPositive<T>;

type JsonNumberPositive<T> = T extends `0${string}`
  ? "Numbers can not start with 0"
  : T extends `${number}${string}`
    ? ReadJsonNumber<T>
    : "Expected a number";

type ReadJsonNumber<T> = T extends `${infer Head}${infer Tail}`
  ? Head extends `${number}`
    ? ReadJsonNumber<Tail>
    : Head extends "."
      ? ReadJsonNumberFraction<Tail>
      : Head extends "E" | "e"
        ? JsonNumberExponent<Tail>
        : [number, T]
  : [number, T];

type ReadJsonNumberFraction<T> = T extends `${infer Head}${infer Tail}`
  ? Head extends `${number}`
    ? ReadJsonNumberFraction<Tail>
    : Head extends "E" | "e"
      ? JsonNumberExponent<Tail>
      : [number, T]
  : [number, T];

type JsonNumberExponent<T> = T extends `${infer Head}${infer Tail}`
  ? Head extends "-" | "+" | `${number}`
    ? ReadJsonNumberExponent<Tail>
    : "Unexpected end of number"
  : [number, T];

type ReadJsonNumberExponent<T extends string> =
  T extends `${number}${infer Tail}`
    ? ReadJsonNumberExponent<Tail>
    : [number, T];

type JsonTrueLiteral<T> =
  T extends `${"T" | "t"}${"R" | "r"}${"U" | "u"}${"E" | "e"}${infer Tail}`
    ? [true, Tail]
    : "Expected a 'true' literal";

type JsonFalseLiteral<T> =
  T extends `${"F" | "f"}${"A" | "a"}${"L" | "l"}${"S" | "s"}${"E" | "e"}${infer Tail}`
    ? [false, Tail]
    : "Expected a 'false' literal";

type JsonBooleanLiteral<T> =
  JsonTrueLiteral<T> extends [true, infer Tail]
    ? [boolean, Tail]
    : JsonFalseLiteral<T> extends [false, infer Tail]
      ? [boolean, Tail]
      : "Expected a 'true' or 'false' literal";

type JsonNullLiteral<T> =
  T extends `${"N" | "n"}${"U" | "u"}${"L" | "l"}${"L" | "l"}${infer Tail}`
    ? [null, Tail]
    : "Expected a 'null' literal";

type NestedError<T, M extends string> = T extends string ? `${M}: ${T}` : M;

type JsonArray<T> = T extends `[${infer Tail}`
  ? JsonArrayFirstItem<Tail>
  : never;

type JsonArrayFirstItem<
  T extends string,
  I = never,
> = T extends `]${infer Tail}`
  ? [I[], Tail]
  : JsonValue<SkipWhiteSpace<T>> extends [infer NewI, infer Tail extends string]
    ? JsonArrayNextItem<SkipWhiteSpace<Tail>, I | NewI>
    : NestedError<
        JsonValue<SkipWhiteSpace<T>>,
        "Expected a value or end of array"
      >;

type JsonArrayNextItem<T, I> = T extends `]${infer Tail}`
  ? [I[], Tail]
  : T extends `,${infer Tail}`
    ? JsonValue<SkipWhiteSpace<Tail>> extends [
        infer NewI,
        infer Tail extends string,
      ]
      ? JsonArrayNextItem<SkipWhiteSpace<Tail>, NewI | I>
      : NestedError<JsonValue<SkipWhiteSpace<Tail>>, "Expected a value">
    : "Expected a comma or end of array";

type JsonObject<T> = T extends `{${infer Tail}`
  ? JsonObjectFirstProperty<Tail>
  : "Expected a {";

type JsonObjectFirstProperty<T extends string> = T extends `}${infer Tail}`
  ? [{}, Tail]
  : JsonObjectProperty<SkipWhiteSpace<T>, {}>;

type JsonObjectNextProperty<T, O extends object> = T extends `}${infer Tail}`
  ? [O, Tail]
  : T extends `,${infer Tail extends string}`
    ? JsonObjectProperty<SkipWhiteSpace<Tail>, O>
    : "Expected a comma or end of object";

type JsonObjectProperty<T extends string, O extends object> =
  JsonString<SkipWhiteSpace<T>, true> extends [
    infer NewKey extends string,
    infer Tail extends string,
  ]
    ? SkipWhiteSpace<Tail> extends `:${infer Tail}`
      ? JsonValue<SkipWhiteSpace<Tail>> extends [
          infer NewValue,
          infer Tail extends string,
        ]
        ? JsonObjectNextProperty<
            SkipWhiteSpace<Tail>,
            {
              [Key in keyof O | NewKey]: Key extends keyof O
                ? O[Key]
                : NewValue;
            }
          >
        : NestedError<JsonValue<SkipWhiteSpace<Tail>>, "Expected a value">
      : "Expected a :"
    : NestedError<JsonString<SkipWhiteSpace<T>, true>, "Expected a string key">;

type JsonValueStarters<T> = {
  '"': JsonString<T, false>;
  t: JsonBooleanLiteral<T>;
  T: JsonBooleanLiteral<T>;
  f: JsonBooleanLiteral<T>;
  F: JsonBooleanLiteral<T>;
  n: JsonNullLiteral<T>;
  N: JsonNullLiteral<T>;
  "[": JsonArray<T>;
  "{": JsonObject<T>;
  "-": JsonNumber<T>;
  [Key: `${number}`]: JsonNumber<T>;
};

type JsonValue<T extends string> =
  T extends `${infer Head extends keyof JsonValueStarters<T>}${string}`
    ? JsonValueStarters<T>[Head]
    : `Unexpected token at ${T}`;

type SkipWhiteSpace<T extends string> =
  T extends `${" " | "\n" | "\t"}${infer Tail}` ? SkipWhiteSpace<Tail> : T;

export type Json<T extends string> = "" extends T
  ? unknown
  : JsonValue<SkipWhiteSpace<T>> extends [infer T, infer Tail extends string]
    ? SkipWhiteSpace<Tail> extends ""
      ? T
      : `Unexpected suffix: '${SkipWhiteSpace<Tail>}'`
    : NestedError<JsonValue<SkipWhiteSpace<T>>, "Invalid Json">;

declare global {
  interface JSON {
    parse<T extends string>(
      text: T,
      reviver?: (this: any, key: string, value: any) => any,
    ): Json<T>;
  }
}
