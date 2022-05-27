# mutableJS / Core

Mutable state, with reactive functions - automatic result recalculations on state changes

[![npm](https://img.shields.io/npm/dt/@mutablejs/core?style=for-the-badge)](https://www.npmjs.com/package/@mutablejs/core) ![GitHub Repo stars](https://img.shields.io/github/stars/mutablejs/core?label=GitHub%20Stars&style=for-the-badge) [![GitHub](https://img.shields.io/github/license/mutablejs/core?color=blue&style=for-the-badge)](https://github.com/mutableJS/core/blob/master/LICENSE)
![GitHub last commit](https://img.shields.io/github/last-commit/mutablejs/core?style=for-the-badge) [![Issues](https://img.shields.io/github/issues/mutableJS/core?style=for-the-badge)](https://github.com/mutableJS/core/issues)

[![Support Server](https://img.shields.io/discord/978049671110987856.svg?label=Discord&logo=Discord&colorB=7289da&style=for-the-badge)](https://discord.gg/gNdgy8uS3R)

## FAQ

#### Why was mutableJS created?

Inspired by the other big front-end frameworks and libraries, like [React](https://reactjs.org/), [Vue.JS](https://vuejs.org/) and friends, research
on variables mutability has started and developed into the current reactive execution mechanism.

#### Is it ready to use?

At the current stage mutableJS is still in research stage and can (thought to) be used with the `@mutablejs/dom` package.

#### Accompanying packages?

Currently there is 1 more package: [@mutablejs/dom](https://www.npmjs.com/package/@mutablejs/dom) and 1 more repo: [mutableJS / Demo repo](https://github.com/mutableJS/demo).

## Installation

Install with **npm**:

```bash
    npm install @mutablejs/core
```

Install with **yarn**:

```bash
    yarn add @mutablejs/core
```

## Features

Currently our `mutables()` initial values support:

-   Primitive values, like `strings`, `booleans`, `numbers`, `nulls`, `undefined`
-   Arrays
-   Objects

All the usual getters/ setters/ operations work, as they would work in VanillaJS:

```javascript
import mutable from '@mutablejs/core';

const someMutableCounter = mutable(0);

someMutableCounter.value += 1; // someMutableCounter.value equals to 1
someMutableCounter.value += 1;

console.log(someMutableCounter.value); // Console output is `2`
```

`mutableFn()` accepts and reacts to named and unnamed parameters:

```typescript
import { mutableFn } from '@mutablejs/core';

type NamedParams = { paramA: string; paramB: number };
const withNamedParams = mutableFn(({ paramA, paramB }: NamedParams) =>
	console.log(paramA, paramB),
);

const unNamedParams = mutableFn((a: number, b: boolean) => console.log(a, b));
```

## Usage/Examples

#### Primitive values:

```typescript
import mutable, { mutableFn } from '@mutablejs/core';

const logFn = mutableFn(({ input }: { input: any }) => {
	console.log('Value changed to: ', input);
});

const someMutableData = mutable('Hello');

logFn({ input: someMutableData });

someMutableData.value += ' World!'; // Console should print `Value changed to: Hello World!`
```

#### Arrays:

```typescript
const someMutableArray = mutable(['Hello']);

logFn({ input: someMutableArray });

someMutableArray.value.push('World!'); // Console should print `Value changed to: ['Hello', 'World!']`
someMutableArray.value[0] = 'Hej'; // Console should print `Value changed to: ['Hej', 'World!']`
someMutableArray.value.splice(0, 1); // Console should print `Value changed to: ['World!']`
```

#### Objects:

```typescript
const someMutableObject = mutable({ a: 'Something' });

logFn({ input: someMutableObject });

someMutableObject.value.b = 'Changed'; // Console should print `Value changed to: { a: 'Something', b: 'Changed' }`
someMutableObject.value.a = 'Data'; // Console should print `Value changed to: { a: 'Data', b: 'Changed' }`
delete someMutableObject.value.a; // Console should print `Value changed to: { b: 'Changed' }`
```

## Authors

-   [@donnikitos](https://www.github.com/donnikitos)

## Feedback

Any feedback? Join our [Discord server](https://discord.gg/gNdgy8uS3R) and reach out to us.\
We are open to suggestions, ideas and collaboration.
