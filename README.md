# Typed JSON Parse

[Get it from npm](https://www.npmjs.com/package/typed-json-parse)

## Summary

This package overrides the default `JSON.parse()` types with a [JSON parser built in TypeScript types](https://github.com/StefanTerdell/typed-json-parse/blob/main/index.d.ts), meaning if you put a valid string literal in, you will get the actual type it represents or a somewhat useful error message.

```typescript
import "typed-json-parse"

const value = JSON.parse('{ "Hello": "NPM!", "foo": [true, 123] }')

// With the actual type of value being:
const value: {
  Hello: string,
  foo: (boolean | number)[]
}
```

## But that's useless

Correct. Since you have the literal string, just use the contents in JS/TS. As a tiny bonus, any non-literal string produces `unknown` instead of `any`.
## So, why?

[I was bored.](https://stefan-tries-to-think.fly.dev/blog/typing-json-parse)
