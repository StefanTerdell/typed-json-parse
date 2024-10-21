# Typed JSON Parse

## Summary

This package overrides the default `JSON.parse()` types with a JSON parser built in TypeScript types, meaning if you put a valid string literal in, you will get the actual type it represents.

```typescript
const value = JSON.parse('{ "Hello": "NPM!", "foo": [true, 123] }');

// With the actual type of value being:
const value: {
  Hello: string,
  foo: (boolean | number)[]
}
```

## But its useless

Correct. Since you have the literal string, just use the contents in JS/TS. As a tiny bonus, any non-literal string produces `unknown` instead of `any`.

## So, why?

[I was bored.](https://stefan-tries-to-think.fly.dev/blog/typing-json-parse)
