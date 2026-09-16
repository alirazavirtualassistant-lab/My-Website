---
id: javascript
title: JavaScript
icon: ⚡
track: Programming
color: #B8960B
runner: js
libs: 
tagline: The language of the browser and of every docx-js and pptxgenjs pipeline.
description: Modern JavaScript (ES2015+) from variables to async programming: types, functions, arrays and objects, DOM manipulation, events, closures, prototypes, promises, modules, error handling, and the tricky questions every JavaScript interview includes.
---

# LEVEL: Beginner

## Introduction and running JavaScript

JavaScript is the programming language that runs inside every web browser. When a web page reacts to a click, validates a form, or builds a Word document in the browser with `docx`, JavaScript is doing the work. Since 2009 it also runs outside the browser through **Node.js**, which is why the same language can drive a pptxgenjs pipeline on your laptop and a rate calculator hosted on a web page.

You do not need to install anything to start. Every browser ships with a JavaScript engine (Chrome and Edge use V8, Firefox uses SpiderMonkey, Safari uses JavaScriptCore) and a **console** where you can type code and see results immediately.

### Your first line of JavaScript

Open any browser, press `F12` (or `Ctrl+Shift+J` in Chrome and Edge), click the **Console** tab, type the line below and press Enter:

```js
console.log("Hello, document engineer!");
```

`console.log()` is a **function**: a named block of code you can call. The text inside the quotes is a **string**. The console prints the string, then prints `undefined` on a second line because `console.log` itself returns nothing. That second line confuses every beginner; it is normal.

### The three ways to run JavaScript

| Where | How | When you use it |
|---|---|---|
| Browser console | `F12` → Console tab | Trying out one-liners, inspecting a page |
| `<script>` tag in an HTML file | `<script src="app.js"></script>` | Web pages, single-file tools like a rate calculator |
| Node.js | `node app.js` in a terminal | Automation scripts, docx-js and pptxgenjs pipelines |

A minimal HTML page that runs a script looks like this:

```html
<!DOCTYPE html>
<html>
  <body>
    <p id="title">Loading...</p>
    <script>
      document.getElementById("title").textContent = "Rate Calculator v1";
    </script>
  </body>
</html>
```

Save it as `index.html`, double-click it, and the paragraph changes from "Loading..." to "Rate Calculator v1". The `<script>` tag is placed at the end of `<body>` so the element already exists when the code runs.

### Statements, comments and semicolons

A **statement** is one instruction. JavaScript reads statements top to bottom. Comments are ignored by the engine and exist for humans:

```js
// A single-line comment
/* A multi-line comment
   that spans two lines */
let pages = 767;            // the handbook page count
console.log(pages * 2);     // 1534
```

Semicolons at the end of a statement are optional because of a rule called Automatic Semicolon Insertion (ASI), but almost every professional codebase uses them so that tools like Prettier and ESLint behave predictably. Use them.

### Case sensitivity and whitespace

`pages`, `Pages` and `PAGES` are three different names. `console.log` works; `Console.Log` throws `ReferenceError: Console is not defined`. Spaces and blank lines, on the other hand, are free: use them to make code readable.

> **Tip:** When a script "does nothing", the first place to look is the Console tab. Every error JavaScript throws is printed there in red, with the file name and line number.

### What you will be able to build

By the end of this course you will write a single-file HTML tool that reads a title-insurance rate matrix, calculates a premium, and exports the result for Excel, all without a server. Everything in that tool is built from the pieces this course teaches one at a time: values, operators, strings, conditions, loops, functions, arrays, objects, the DOM, and asynchronous code.

### Try It Yourself

```js
// Change the text and the number, then run again.
const client = "Fiverr order #4821";
const pages = 135;
console.log("Deliverable for " + client + ": " + pages + " pages");
console.log("Estimated proofreading hours:", pages / 30);
```

### Quiz

1. Where does JavaScript run?
- [ ] Only inside web browsers
- [x] In browsers and in Node.js outside the browser
- [ ] Only on Windows
> Browsers have always run JavaScript; Node.js (2009) lets the same language run on servers and laptops.

2. What does `console.log("Hi")` return?
- [ ] "Hi"
- [x] undefined
- [ ] true
> `console.log` prints its arguments but returns nothing, and "nothing" in JavaScript is `undefined`.

3. Which keyboard shortcut opens the DevTools console in Chrome?
- [x] Ctrl+Shift+J
- [ ] Ctrl+P
- [ ] Alt+F4
> `Ctrl+Shift+J` (or `F12` then the Console tab) opens the console directly.

### Exercises

1. **Three lines** — Print your name, the current year, and the product of 12 and 31, each on its own line.
<details><summary>Solution</summary>

```js
console.log("Ali Raza");
console.log(2026);
console.log(12 * 31);
```

</details>

2. **Comment it** — Write a script that prints a report title and has a single-line comment explaining what it prints.
<details><summary>Solution</summary>

```js
// Prints the heading used on the weekly production report
console.log("Weekly Production Status - Week 37");
```

</details>

### Interview Questions

**Q: What is the difference between JavaScript and Java?**
Almost everything except the name, which was a 1995 marketing decision by Netscape. Java is statically typed, compiled to bytecode, and class-based from the ground up; JavaScript is dynamically typed, interpreted (then JIT-compiled) by the engine, and prototype-based. JavaScript's official specification is ECMAScript, published by Ecma International, which is why you hear "ES2015" or "ES6". A strong answer mentions that ECMAScript is the standard and JavaScript is the implementation you actually run.

**Q: Is JavaScript compiled or interpreted?**
Historically interpreted, but modern engines such as V8 parse the source, produce bytecode for the Ignition interpreter, and then JIT-compile hot functions with TurboFan into machine code. So the honest answer is "both": you never run a compile step yourself, but the engine compiles behind the scenes. This matters for performance discussions: code that keeps object shapes consistent gets optimized, code that changes types constantly gets de-optimized.

**Q: Why do developers put the script tag at the end of the body or use defer?**
Because the browser parses HTML top to bottom and a plain `<script>` blocks parsing until it downloads and runs. If the script touches an element that has not been parsed yet, `document.getElementById` returns `null` and the script crashes. Putting the tag at the end, or adding `defer` to a `<script src>` in the head, guarantees the DOM is ready. `async` is different: it runs as soon as the download finishes, in any order, so it suits analytics scripts rather than app code.

## Variables and data types

A **variable** is a named box that holds a value. JavaScript gives you three keywords to create one: `let`, `const` and the older `var`.

```js
let pages = 135;          // can be reassigned later
const title = "Policy Manual";  // cannot be reassigned
var legacy = true;        // old style, avoid in new code
```

### let, const and var

| Keyword | Can reassign? | Scope | Hoisting behaviour |
|---|---|---|---|
| `const` | No | Block `{ }` | Exists but unusable until its line runs |
| `let` | Yes | Block `{ }` | Same as `const` |
| `var` | Yes | Whole function | Starts as `undefined` at the top of the function |

Modern code uses `const` by default and switches to `let` only when the value must change. `var` survives only in legacy scripts; its function-level scope causes bugs that the closures chapter demonstrates.

```js
const client = "Stewart Title";
client = "Other";   // TypeError: Assignment to constant variable.
```

Note the subtlety: `const` locks the **binding**, not the value. A `const` array can still be pushed to:

```js
const files = ["deed.pdf"];
files.push("survey.pdf");   // fine
console.log(files);         // ["deed.pdf", "survey.pdf"]
```

### Naming rules

Names may contain letters, digits, `_` and `$`, but cannot start with a digit and cannot be a reserved word such as `class` or `return`. The convention is `camelCase` for variables and functions, `PascalCase` for classes, and `UPPER_SNAKE` for true constants like `MAX_FIELDS = 168`.

### The seven primitive types

A **primitive** is a single, immutable value. JavaScript has seven:

```js
console.log(typeof "SOP-12");     // "string"
console.log(typeof 767);          // "number"
console.log(typeof 9007199254740993n); // "bigint"
console.log(typeof true);         // "boolean"
console.log(typeof undefined);    // "undefined"
console.log(typeof null);         // "object"  <-- a famous bug, see below
console.log(typeof Symbol("id")); // "symbol"
```

`number` covers both integers and decimals; there is no separate `int` and `float`. Every number is a 64-bit IEEE 754 double, which is why `0.1 + 0.2` prints `0.30000000000000004`. `bigint` (the `n` suffix) exists for integers larger than `Number.MAX_SAFE_INTEGER` (9,007,199,254,740,991).

`undefined` means "no value has been assigned yet". `null` means "intentionally empty". `typeof null` returning `"object"` is a bug from 1995 that can never be fixed without breaking the web, and it is asked in nearly every interview.

### Objects: everything else

Anything that is not a primitive is an **object**: plain objects, arrays, functions, dates, regular expressions.

```js
const report = { week: 37, state: "TX", files: 412 };
const states = ["TX", "FL", "NY"];
console.log(typeof report);   // "object"
console.log(typeof states);   // "object"  (use Array.isArray to check)
console.log(Array.isArray(states)); // true
```

Objects are compared and copied **by reference**: two variables can point at the same object, so changing it through one name changes it for the other.

```js
const a = { fields: 168 };
const b = a;
b.fields = 170;
console.log(a.fields);  // 170, because a and b are the same object
```

### Dynamic typing

A variable is not tied to a type. The same `let` can hold a number now and a string later. That flexibility is why tests and `typeof` checks matter, and why TypeScript exists as a typed layer on top of JavaScript.

> **Warning:** A variable declared without `let`, `const` or `var` (`total = 5;`) silently becomes a global. Add `"use strict";` at the top of a script (ES modules and classes are strict automatically) and the same line throws a `ReferenceError`, which is what you want.

### Try It Yourself

```js
const jobTitle = "Document Production Specialist";
let openOrders = 7;
openOrders = openOrders + 2;

const values = [jobTitle, openOrders, 3.14, true, undefined, null, 12n, { a: 1 }, [1, 2]];
for (const v of values) {
  console.log(String(v).padEnd(36), "->", typeof v, Array.isArray(v) ? "(array)" : "");
}
```

### Quiz

1. Which keyword prevents a variable from being reassigned?
- [ ] let
- [x] const
- [ ] var
> `const` fixes the binding; assigning to it again throws a TypeError.

2. What does `typeof null` return?
- [ ] "null"
- [x] "object"
- [ ] "undefined"
> A long-standing bug in the language: `null` reports itself as an object.

3. What is `typeof [1, 2, 3]`?
- [ ] "array"
- [x] "object"
- [ ] "list"
> Arrays are objects. Use `Array.isArray()` to tell them apart from plain objects.

4. What is the value of `x` after `let x;`?
- [x] undefined
- [ ] null
- [ ] 0
> A declared but unassigned variable holds `undefined`.

### Exercises

1. **Type report** — Create five variables of different primitive types and print each with its `typeof`.
<details><summary>Solution</summary>

```js
const name = "Ali", age = 32, active = true, nothing = null, big = 10n;
for (const v of [name, age, active, nothing, big]) console.log(v, typeof v);
```

</details>

2. **Reference check** — Show that copying an object with `=` does not create an independent copy, then fix it with the spread operator.
<details><summary>Solution</summary>

```js
const original = { pages: 135 };
const alias = original;
alias.pages = 200;
console.log(original.pages); // 200 (shared)
const copy = { ...original };
copy.pages = 300;
console.log(original.pages); // 200 (independent)
```

</details>

### Interview Questions

**Q: What is the difference between undefined and null?**
`undefined` is what the engine gives you when nothing has been assigned: an unset variable, a missing object property, a function with no `return`. `null` is a value a developer assigns on purpose to mean "empty". They are loosely equal (`null == undefined` is `true`) but not strictly equal. In JSON, `null` survives but `undefined` properties are dropped by `JSON.stringify`, which matters when you serialize form data from a 168-field AcroForm and wonder where a key went.

**Q: Why does 0.1 + 0.2 not equal 0.3 in JavaScript?**
Because numbers are IEEE 754 double-precision floats and 0.1 and 0.2 cannot be represented exactly in binary, so their sum comes out as 0.30000000000000004. The fix depends on context: compare with a tolerance (`Math.abs(a - b) < Number.EPSILON`), round for display with `toFixed(2)`, or do money math in integer cents. In a rate calculator I keep premiums in cents as integers and only divide by 100 when rendering, which removes the entire class of bug.

**Q: Explain the difference between primitive and reference types.**
Primitives (string, number, bigint, boolean, undefined, null, symbol) are immutable and copied by value: assigning one to a new variable duplicates it. Objects, arrays and functions are copied by reference: the variable holds a pointer, so two variables can share one object. This is why mutating a parameter inside a function can surprise the caller, and why shallow copies (`{...obj}`, `[...arr]`) and deep copies (`structuredClone`) are different tools. Interviewers often follow up with "how would you deep-copy an object with a Date inside", and the answer is `structuredClone`, not `JSON.parse(JSON.stringify())`, which turns dates into strings.

## Operators and type coercion

Operators combine values. Most look like school arithmetic, but JavaScript adds a few that decide how a value is converted from one type to another, and that is where beginners get hurt.

### Arithmetic operators

```js
console.log(10 + 3);   // 13
console.log(10 - 3);   // 7
console.log(10 * 3);   // 30
console.log(10 / 3);   // 3.3333333333333335
console.log(10 % 3);   // 1   (remainder)
console.log(2 ** 10);  // 1024 (exponent)
let n = 5; n++; n += 10; console.log(n); // 16
```

`%` is the remainder, useful for "every 50th page gets a section break". `**` is exponentiation, added in ES2016.

### The plus sign has two jobs

`+` adds numbers, but if **either** side is a string it concatenates:

```js
console.log(1 + 2);        // 3
console.log("1" + 2);      // "12"
console.log(1 + "2" + 3);  // "123"  (left to right: "12" then "123")
console.log("5" - 2);      // 3      (minus only does math, so "5" becomes 5)
console.log("5" * "2");    // 10
```

This is **type coercion**: the engine silently converts a value to the type the operator needs. Every operator except `+` converts strings to numbers. Form inputs always give you strings, so a rate calculator that does `premium + fee` on two inputs will glue "150" and "25" into "15025" instead of 175. Convert first.

### Converting on purpose

```js
console.log(Number("150"));     // 150
console.log(Number("150abc"));  // NaN
console.log(parseInt("150abc")); // 150  (reads digits until it fails)
console.log(parseFloat("3.5in")); // 3.5
console.log(+"42");             // 42 (unary plus, same as Number)
console.log(String(42));        // "42"
console.log((42).toString());   // "42"
console.log(Boolean(""));       // false
console.log(Boolean("0"));      // true (non-empty string)
```

`NaN` ("Not a Number") is what you get from a failed numeric conversion. It is the only value in JavaScript that is not equal to itself, so test for it with `Number.isNaN(x)`, never `x === NaN`.

### Comparison: == versus ===

`===` (strict equality) compares type **and** value. `==` (loose equality) converts types first, following rules nobody memorizes fully:

```js
console.log(5 === "5");        // false
console.log(5 == "5");         // true   ("5" becomes 5)
console.log(0 == false);       // true
console.log("" == 0);          // true
console.log(null == undefined); // true
console.log(null === undefined); // false
console.log([] == false);      // true  (!)
```

The rule professionals follow: always use `===` and `!==`. The single accepted exception is `x == null`, which is a compact way to test for both `null` and `undefined`.

### Truthy and falsy

When a value is used where a boolean is expected (`if`, `!`, `&&`, `||`), it is converted. Exactly eight values are **falsy**; everything else is truthy.

| Falsy values | Note |
|---|---|
| `false` | the boolean itself |
| `0`, `-0`, `0n` | numeric zeros |
| `""` | empty string |
| `null`, `undefined` | the two "nothing" values |
| `NaN` | failed number |

Surprising truthy values: `"0"`, `"false"`, `[]`, `{}`, and any function.

### Logical operators return values, not booleans

`&&` returns the first falsy operand or the last one; `||` returns the first truthy operand or the last one. This makes them useful for defaults:

```js
const name = "" || "Untitled";        // "Untitled"
const count = 0 || 10;                // 10   (0 is falsy, probably not what you meant)
const safe = 0 ?? 10;                 // 0    (?? only replaces null/undefined)
const label = user && user.name;      // undefined if user is null, no crash
```

`??` is the **nullish coalescing** operator (ES2020). Use it when `0` or `""` are legitimate values, which in reports they always are.

### The ternary operator

```js
const pages = 767;
const size = pages > 500 ? "handbook" : "manual";
console.log(size); // "handbook"
```

`condition ? valueIfTrue : valueIfFalse` is the only operator that takes three operands. It is an expression, so it can sit inside a template literal or a function argument.

> **Interview note:** Interviewers love `[] + {}` (gives `"[object Object]"`) and `{} + []` (gives `0` when typed at the console, because the `{}` is parsed as an empty block). You do not need to write code like this; you need to explain that `+` calls `toString`/`valueOf` on objects and that the console treats a leading `{` as a block.

### Try It Yourself

```js
const inputs = ["150", "25.50", "abc", "", "0"];
for (const raw of inputs) {
  const n = Number(raw);
  console.log(JSON.stringify(raw).padEnd(8), "Number:", n, "| isNaN:", Number.isNaN(n), "| truthy:", Boolean(raw));
}
console.log("1" + 2 + 3, "vs", 1 + 2 + "3");
console.log(0 || "fallback", "|", 0 ?? "fallback");
console.log(5 == "5", 5 === "5", null == undefined, NaN === NaN);
```

### Quiz

1. What does `"3" + 4 + 5` evaluate to?
- [ ] 12
- [x] "345"
- [ ] "39"
> Left to right: `"3" + 4` is `"34"`, then `"34" + 5` is `"345"`.

2. Which values are falsy?
- [x] `0`, `""`, `null`, `undefined`, `NaN`, `false`
- [ ] `0`, `"0"`, `[]`, `{}`
- [ ] Only `false` and `null`
> `"0"`, `[]` and `{}` are all truthy; the eight falsy values are false, 0, -0, 0n, "", null, undefined and NaN.

3. What is `0 ?? 10`?
- [x] 0
- [ ] 10
- [ ] undefined
> `??` only substitutes for `null` or `undefined`; `0` is kept.

4. Which comparison should you use by default?
- [ ] `==`
- [x] `===`
- [ ] `=`
> Strict equality avoids coercion surprises; `=` is assignment, not comparison.

### Exercises

1. **Safe total** — Two form fields return `"150"` and `"25"`. Add them correctly and print `175`.
<details><summary>Solution</summary>

```js
const a = "150", b = "25";
console.log(Number(a) + Number(b)); // 175
```

</details>

2. **Default but keep zero** — Given `discount = 0`, choose `??` or `||` so the discount stays 0 instead of becoming the default 5.
<details><summary>Solution</summary>

```js
const discount = 0;
console.log(discount ?? 5); // 0
console.log(discount || 5); // 5 (wrong for this case)
```

</details>

3. **Coercion table** — Print whether each of `"0"`, `0`, `[]`, `"false"` is truthy.
<details><summary>Solution</summary>

```js
for (const v of ["0", 0, [], "false"]) console.log(JSON.stringify(v), Boolean(v));
// "0" true, 0 false, [] true, "false" true
```

</details>

### Interview Questions

**Q: What is the difference between == and ===?**
`===` returns true only when both operands have the same type and value (with the special cases that `NaN !== NaN` and `+0 === -0`). `==` first applies the Abstract Equality algorithm: it converts booleans to numbers, strings to numbers when compared to numbers, and objects to primitives via `valueOf`/`toString`. That is why `"" == 0` and `[] == false` are true. I always use `===`, except `value == null` to catch both null and undefined in one check, and I state that exception explicitly in code review.

**Q: How would you check that a value is a real number?**
`typeof x === "number" && Number.isFinite(x)`. `typeof` alone accepts `NaN` and `Infinity`, which are numbers by type but useless as inputs. `Number.isNaN` differs from the global `isNaN`: the global one coerces first, so `isNaN("abc")` is true even though the argument is a string, while `Number.isNaN("abc")` is false. For form fields I convert with `Number(input.value.trim())` and then run this check before doing any premium math.

**Q: What does the || operator return, and when does it cause bugs?**
It returns the first truthy operand, or the last operand if none are truthy, so it is a value-selecting operator rather than a strict boolean one. The bug is using it for defaults when 0, empty string or false are valid inputs: `options.retries || 3` turns an explicit 0 into 3. ES2020's `??` fixes this by only falling through on null and undefined. In a rate matrix, a zero surcharge is a real value, so `surcharge ?? defaultSurcharge` is the correct choice.

## Strings and template literals

A string is a sequence of characters. Document work is mostly string work: file names, headings, merge fields, cleaning imported text. JavaScript strings are **immutable**: every method returns a new string and leaves the original untouched.

### Creating strings

```js
const a = "Policy Manual";     // double quotes
const b = 'Policy Manual';     // single quotes, identical
const c = `Policy Manual`;     // backticks: a template literal
console.log(a === b && b === c); // true
```

Quotes can be nested by mixing types (`"Ali's laptop"`) or escaped with a backslash (`'Ali\'s laptop'`). Other escapes: `\n` new line, `\t` tab, `\\` backslash, `©` for the copyright symbol.

### Template literals

Backtick strings can embed expressions with `${ }` and can span multiple lines:

```js
const client = "Stewart Title";
const week = 37;
const files = 412;
const msg = `Weekly status for ${client}
Week ${week}: ${files} files processed (${(files / 5).toFixed(1)} per day)`;
console.log(msg);
```

Anything inside `${ }` is a JavaScript expression: arithmetic, function calls, ternaries. Compare that to the old concatenation style, `"Week " + week + ": " + files + " files"`, which is harder to read and easy to get wrong.

### Length and indexing

```js
const s = "TX-2026-00123";
console.log(s.length);     // 13
console.log(s[0]);         // "T"
console.log(s.at(-1));     // "3"   (at() accepts negatives, ES2022)
console.log(s.charAt(3));  // "2"
```

Indexes start at 0. `s[s.length]` is `undefined`, not an error.

### The methods you use every day

| Method | Example | Result |
|---|---|---|
| `toUpperCase()` / `toLowerCase()` | `"Deed".toUpperCase()` | `"DEED"` |
| `trim()` | `"  SOP  ".trim()` | `"SOP"` |
| `includes(sub)` | `"deed.pdf".includes(".pdf")` | `true` |
| `startsWith` / `endsWith` | `"TX-2026".startsWith("TX")` | `true` |
| `indexOf(sub)` | `"a-b-c".indexOf("-")` | `1` (or `-1` if absent) |
| `slice(start, end)` | `"TX-2026-00123".slice(3, 7)` | `"2026"` |
| `split(sep)` | `"TX-2026-00123".split("-")` | `["TX","2026","00123"]` |
| `replace(a, b)` | `"a_b_c".replace("_", " ")` | `"a b_c"` (first only) |
| `replaceAll(a, b)` | `"a_b_c".replaceAll("_", " ")` | `"a b c"` (ES2021) |
| `padStart(n, ch)` | `"7".padStart(3, "0")` | `"007"` |
| `repeat(n)` | `"-".repeat(10)` | `"----------"` |

Because strings are immutable, `s.toUpperCase()` does not change `s`; you must assign the result: `s = s.toUpperCase()`.

### A practical example: building a file name

```js
const state = "tx";
const seq = 123;
const year = 2026;
const fileNo = `${state.toUpperCase()}-${year}-${String(seq).padStart(5, "0")}`;
console.log(fileNo);                 // "TX-2026-00123"
console.log(fileNo.split("-")[2]);   // "00123"
```

This is exactly how a Fiverr batch-rename script or a title-search tracker builds its identifiers. `padStart` keeps the number width fixed so files sort correctly in Windows Explorer.

### Comparing strings

`===` compares character by character and is case sensitive, so `"Deed" === "deed"` is false. Normalize with `toLowerCase()` before comparing user input. For sorting names with accents, use `a.localeCompare(b)` instead of `<`, which compares raw character codes and puts `"Zebra"` before `"apple"`.

### Strings and numbers

`"10" < "9"` is `true` because strings compare alphabetically character by character ("1" comes before "9"). Convert to numbers before comparing numeric strings. `length` counts UTF-16 code units, so an emoji like `"📄".length` is 2; use `[..."📄"].length` to count actual characters.

> **Tip:** Need to build a long piece of text in a loop? Collect the pieces in an array and call `parts.join("\n")` at the end. It reads better than repeated `+=` and makes the separator explicit.

### Try It Yourself

```js
const raw = "  policy manual - revision 3  ";
const clean = raw.trim();
const title = clean
  .split(" ")
  .map(w => w ? w[0].toUpperCase() + w.slice(1) : w)
  .join(" ");
console.log(`[${title}]`);
console.log("Length:", title.length, "| Has 'Revision':", title.includes("Revision"));
console.log("File name:", title.toLowerCase().replaceAll(" ", "_").replace("_-_", "-") + ".docx");
console.log("Row 7 label:", "Row " + String(7).padStart(3, "0"));
```

### Quiz

1. What does `"Deed".slice(1, 3)` return?
- [ ] "De"
- [x] "ee"
- [ ] "eed"
> `slice(1, 3)` takes indexes 1 and 2 (the end index is excluded).

2. After `let s = "abc"; s.toUpperCase();` what is `s`?
- [x] "abc"
- [ ] "ABC"
- [ ] undefined
> Strings are immutable; the method returns a new string that was discarded.

3. Which syntax embeds an expression in a string?
- [ ] `"Week " + ${week}`
- [x] `` `Week ${week}` ``
- [ ] `'Week ${week}'`
> Only backtick template literals process `${ }`.

4. What does `"7".padStart(3, "0")` return?
- [x] "007"
- [ ] "700"
- [ ] "7"
> `padStart` adds the pad character on the left until the length is 3.

### Exercises

1. **Initials** — Turn `"ali raza"` into `"A.R."`.
<details><summary>Solution</summary>

```js
const name = "ali raza";
console.log(name.split(" ").map(w => w[0].toUpperCase() + ".").join("")); // "A.R."
```

</details>

2. **Extract the year** — From `"FL-2025-00891"` print the year as a number.
<details><summary>Solution</summary>

```js
const id = "FL-2025-00891";
console.log(Number(id.split("-")[1])); // 2025
```

</details>

3. **Divider** — Print a line of 40 equals signs followed by the text "REPORT" centered by padding.
<details><summary>Solution</summary>

```js
console.log("=".repeat(40));
console.log("REPORT".padStart(23).padEnd(40));
```

</details>

### Interview Questions

**Q: Why are strings immutable in JavaScript and what does that mean for performance?**
Immutability means a string's characters can never change after creation; methods return new strings. It makes strings safe to share between variables and use as object keys without defensive copies. The performance concern is building large text with `+=` in a loop, which in theory creates many intermediate strings; in practice V8 uses "cons strings" (rope-like structures) so appending is cheap, but collecting parts in an array and calling `join` is still the idiomatic way because it makes the separator explicit and reads clearly.

**Q: What is the difference between slice, substring and substr?**
All three extract part of a string. `slice(start, end)` accepts negative indexes counted from the end. `substring(start, end)` treats negatives as 0 and swaps the arguments if start is greater than end. `substr(start, length)` takes a length instead of an end index and is deprecated in the spec's Annex B. I use `slice` everywhere and mention `substr` only to explain legacy code.

**Q: How do you compare or sort strings correctly across languages?**
Plain `<` and `sort()` compare UTF-16 code units, so uppercase letters sort before lowercase and accented characters land in odd places. `a.localeCompare(b, "en", { sensitivity: "base" })` compares according to locale rules and can ignore case and accents. For big lists, `new Intl.Collator("en").compare` is faster because the collator is created once. A client roster sorted with `localeCompare` puts "Álvarez" next to "Alvarez", which plain sorting will not do.

## Conditions and loops

Programs make decisions and repeat work. Conditions choose a path; loops run a block many times. Together they let a script walk through 400 production files and flag the ones that need attention.

### if, else if, else

```js
const pages = 767;
if (pages > 500) {
  console.log("Handbook: needs an automated TOC and section breaks");
} else if (pages > 50) {
  console.log("Manual: single TOC is enough");
} else {
  console.log("Short document");
}
```

The condition in parentheses is converted to a boolean using the truthy/falsy rules. Braces are optional for a single statement, but always write them; the Apple "goto fail" bug came from a missing brace.

### switch

When you compare one value against many constants, `switch` reads better than a chain of `else if`:

```js
const ext = "docx";
switch (ext) {
  case "docx":
  case "dotx":
    console.log("Word document");
    break;
  case "pdf":
    console.log("PDF");
    break;
  default:
    console.log("Unknown format");
}
```

`switch` uses strict equality (`===`). Without `break`, execution **falls through** into the next case; the stacked `case "docx": case "dotx":` above uses that on purpose to share one branch.

### The classic for loop

```js
for (let i = 1; i <= 3; i++) {
  console.log(`Printing page ${i}`);
}
```

Three parts: initializer (`let i = 1`), condition checked before each iteration (`i <= 3`), and update after each iteration (`i++`). Use `let`, not `var`, so each iteration gets its own `i`.

### while and do...while

```js
let remaining = 168;   // AcroForm fields left to map
let batches = 0;
while (remaining > 0) {
  remaining -= 50;
  batches++;
}
console.log(batches);   // 4

let attempt = 0;
do {
  attempt++;
} while (attempt < 3);
console.log(attempt);   // 3
```

`while` checks first and may run zero times; `do...while` runs the body at least once, which suits "try, then check" logic like retrying an upload.

### for...of and for...in

`for...of` walks the **values** of anything iterable (arrays, strings, Maps, Sets). `for...in` walks the **keys** of an object (as strings) and is almost never what you want for arrays.

```js
const files = ["deed.pdf", "survey.pdf", "policy.docx"];
for (const f of files) console.log(f);

const report = { week: 37, state: "TX", files: 412 };
for (const key in report) console.log(key, "=", report[key]);

for (const [i, f] of files.entries()) console.log(i, f);   // index and value
```

### break and continue

`break` leaves the loop entirely; `continue` skips to the next iteration.

```js
const sizesKB = [120, 3400, 90, 51000, 780];
for (const kb of sizesKB) {
  if (kb < 100) continue;              // skip tiny files
  if (kb > 50000) { console.log("Stop: file too large for email"); break; }
  console.log("Attach", kb, "KB");
}
```

A **label** lets `break` exit an outer loop from inside an inner one (`outer: for (...) { for (...) { break outer; } }`). It is rare, but it comes up when scanning a grid such as a rate matrix.

### Choosing the right loop

| Need | Use |
|---|---|
| Fixed count or index arithmetic | `for (let i = 0; ...)` |
| Every value in an array or string | `for...of` |
| Every key in a plain object | `for...in` or `Object.keys()` |
| Unknown count, condition first | `while` |
| Run at least once | `do...while` |
| Transform or filter an array | `map`, `filter`, `reduce` (next level) |

> **Warning:** A loop whose condition never becomes false runs forever and freezes the browser tab. If the console stops responding after you run a `while`, that is why; close the tab and check the update step.

### Try It Yourself

```js
const docs = [
  { name: "Employee Handbook", pages: 767 },
  { name: "Cover Letter", pages: 1 },
  { name: "Policy Manual", pages: 135 },
  { name: "SOP-12", pages: 24 },
];
let total = 0;
for (const doc of docs) {
  let kind;
  if (doc.pages >= 500) kind = "handbook";
  else if (doc.pages >= 50) kind = "manual";
  else if (doc.pages > 1) kind = "short";
  else kind = "single page";
  total += doc.pages;
  console.log(doc.name.padEnd(20), String(doc.pages).padStart(4), kind);
}
console.log("Total pages:", total);
let i = 0;
while (total > 0) { total = Math.floor(total / 2); i++; }
console.log("Halvings to reach zero:", i);
```

### Quiz

1. What happens without `break` at the end of a `case`?
- [ ] A syntax error
- [x] Execution falls through into the next case
- [ ] The switch restarts
> Fall-through is legal and occasionally intentional, but usually a bug.

2. Which loop always runs its body at least once?
- [ ] while
- [x] do...while
- [ ] for...of
> `do...while` checks the condition after the first run.

3. `for...in` on an array gives you:
- [x] Index keys as strings
- [ ] The values
- [ ] Nothing, it throws
> `for...in` enumerates keys ("0", "1", ...), which is why `for...of` is preferred for arrays.

4. What does `continue` do?
- [ ] Ends the loop
- [x] Skips the rest of this iteration and moves to the next
- [ ] Pauses execution
> `continue` jumps straight to the next iteration's condition check.

### Exercises

1. **FizzBuzz for pages** — For pages 1 to 15 print "Break" for multiples of 3, "Header" for multiples of 5, "BreakHeader" for both, otherwise the number.
<details><summary>Solution</summary>

```js
for (let p = 1; p <= 15; p++) {
  let out = "";
  if (p % 3 === 0) out += "Break";
  if (p % 5 === 0) out += "Header";
  console.log(out || p);
}
```

</details>

2. **Find the first big file** — Given `[120, 340, 5200, 80]` KB, print the index of the first file over 1000 KB and stop looking.
<details><summary>Solution</summary>

```js
const sizes = [120, 340, 5200, 80];
for (let i = 0; i < sizes.length; i++) {
  if (sizes[i] > 1000) { console.log("First big file at index", i); break; }
}
```

</details>

3. **Nested table** — Print a 3 by 3 multiplication grid using nested loops and template literals.
<details><summary>Solution</summary>

```js
for (let r = 1; r <= 3; r++) {
  let row = "";
  for (let c = 1; c <= 3; c++) row += `${r * c}\t`;
  console.log(row);
}
```

</details>

### Interview Questions

**Q: What is the difference between for...in and for...of?**
`for...in` iterates over the enumerable string keys of an object, including keys inherited through the prototype chain, which is why using it on arrays is discouraged: you get index strings, and any property someone added to `Array.prototype` shows up too. `for...of` (ES2015) uses the iterator protocol and yields values from arrays, strings, Maps, Sets, generators and anything with `[Symbol.iterator]`. For plain objects I use `Object.entries(obj)` with `for...of` to get key/value pairs without inheritance surprises.

**Q: When would you use a switch statement instead of if/else, and what are its pitfalls?**
A `switch` reads best when one expression is compared against several literal values, such as dispatching on a file extension or a command name. Pitfalls are forgetting `break` (silent fall-through), the fact that it uses strict equality so `"1"` never matches `1`, and that `case` expressions are evaluated top to bottom so order matters if two match. For more than a handful of cases I often prefer an object lookup, `handlers[ext]?.()`, which is data-driven and easier to extend.

**Q: How do you exit early from nested loops?**
Three options: a labeled `break outer;`, moving the nested loops into a function and using `return`, or replacing the loops with array methods such as `some()`/`find()` that stop as soon as the callback returns true. I prefer the function-with-return approach because it also gives the search a name, which makes the intent obvious when someone reads the rate-matrix lookup six months later.

# LEVEL: Intermediate

## Functions

A **function** is a reusable block of code with a name, inputs (parameters) and an output (the return value). Everything larger than a script is built from them, and in JavaScript they are also **values**: you can store them in variables, pass them to other functions and return them.

### Declaring and calling

```js
function premium(amount, ratePerThousand) {
  return (amount / 1000) * ratePerThousand;
}
console.log(premium(250000, 5.75));   // 1437.5
```

`amount` and `ratePerThousand` are **parameters**; `250000` and `5.75` are **arguments**. `return` sends a value back and ends the function. A function with no `return` returns `undefined`.

### Three ways to write a function

```js
// 1. Function declaration (hoisted: can be called before its line)
function add(a, b) { return a + b; }

// 2. Function expression (stored in a variable, not hoisted)
const subtract = function (a, b) { return a - b; };

// 3. Arrow function (ES2015, shortest, no own `this`)
const multiply = (a, b) => a * b;
const square = n => n * n;               // one param: parentheses optional
const log = () => console.log("hi");     // zero params
const makeDoc = (t) => ({ title: t });   // returning an object literal needs ( )
```

An arrow function with a single expression body returns it automatically. With braces you must write `return`. The `this` difference is covered in the classes chapter; for now, use arrows for short callbacks and declarations for named, top-level functions.

### Default and rest parameters

```js
function fileName(base, ext = "docx", version = 1) {
  return `${base}_v${version}.${ext}`;
}
console.log(fileName("Letterhead"));             // "Letterhead_v1.docx"
console.log(fileName("Letterhead", "dotx", 3));  // "Letterhead_v3.dotx"

function total(...amounts) {           // rest: gathers extra arguments into an array
  let sum = 0;
  for (const a of amounts) sum += a;
  return sum;
}
console.log(total(100, 250, 75));      // 425
```

Defaults apply when the argument is `undefined` (missing), not when it is `null`. The rest parameter must be last.

### Functions as values: callbacks

Passing a function into another function is the pattern behind array methods, event handlers and timers.

```js
function forEachFile(files, action) {
  for (const f of files) action(f);
}
forEachFile(["deed.pdf", "survey.pdf"], f => console.log("Processing", f));

setTimeout(() => console.log("Ran 100 ms later"), 100);
```

The function you pass in is called a **callback** because the receiving code calls it back.

### Returning functions

```js
function makeRater(ratePerThousand) {
  return amount => (amount / 1000) * ratePerThousand;
}
const texasRate = makeRater(5.75);
const floridaRate = makeRater(5.25);
console.log(texasRate(250000), floridaRate(250000));   // 1437.5 1312.5
```

`makeRater` is a **factory**: each call produces a new function that remembers its own rate. That memory is a closure, explained fully two chapters from now.

### Pure functions

A function is **pure** when its output depends only on its inputs and it changes nothing outside itself. Pure functions are easy to test and safe to reuse. `premium()` above is pure; a function that also writes to `document` or a global counter is not. Keep calculation pure and push side effects (printing, DOM updates, file writes) to the edges of the program.

### Immediately invoked function expression

```js
(function () {
  const secret = "only visible in here";
  console.log(secret);
})();
```

An IIFE runs once and keeps its variables private. Before ES modules it was the standard way to avoid polluting the global scope; you will still see it in older docx-js examples.

> **Tip:** Name functions after what they return or do (`calculatePremium`, `formatFileName`, `isLargeFile`). A boolean-returning function should start with `is`, `has` or `can`.

### Try It Yourself

```js
function calculatePremium(amount, ratePerThousand = 5.75, { minimum = 100, round = true } = {}) {
  let p = (amount / 1000) * ratePerThousand;
  if (p < minimum) p = minimum;
  return round ? Math.round(p * 100) / 100 : p;
}
console.log(calculatePremium(250000));                       // 1437.5
console.log(calculatePremium(10000));                        // 100 (minimum)
console.log(calculatePremium(333333, 5.25, { round: false }));

const makeRater = rate => amount => calculatePremium(amount, rate);
const tx = makeRater(5.75), fl = makeRater(5.25);
console.log([100000, 250000, 500000].map(tx));
console.log([100000, 250000, 500000].map(fl));
```

### Quiz

1. What does a function without a `return` statement return?
- [ ] null
- [x] undefined
- [ ] 0
> Falling off the end of a function yields `undefined`.

2. Which is a valid arrow function that returns an object?
- [ ] `() => { title: "A" }`
- [x] `() => ({ title: "A" })`
- [ ] `() => return { title: "A" }`
> Without parentheses the braces are parsed as a block, so the object needs `( )`.

3. When does a default parameter value apply?
- [x] When the argument is undefined or missing
- [ ] When the argument is null
- [ ] When the argument is falsy
> Only `undefined` triggers the default; `null` is passed through.

4. Which kind of function can be called before the line that defines it?
- [x] A function declaration
- [ ] An arrow function stored in const
- [ ] A function expression stored in let
> Declarations are hoisted with their body; variables holding functions are not usable before their line.

### Exercises

1. **isLargeFile** — Write `isLargeFile(kb, limit = 5000)` that returns a boolean, and test it with 120 and 8000.
<details><summary>Solution</summary>

```js
const isLargeFile = (kb, limit = 5000) => kb > limit;
console.log(isLargeFile(120), isLargeFile(8000)); // false true
```

</details>

2. **Average of any count** — Write `average(...nums)` that returns the mean, or 0 when called with no arguments.
<details><summary>Solution</summary>

```js
function average(...nums) {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}
console.log(average(10, 20, 30), average()); // 20 0
```

</details>

3. **Counter factory** — Write `makeCounter()` returning a function that returns 1, 2, 3... on successive calls.
<details><summary>Solution</summary>

```js
function makeCounter() {
  let n = 0;
  return () => ++n;
}
const next = makeCounter();
console.log(next(), next(), next()); // 1 2 3
```

</details>

### Interview Questions

**Q: What are the differences between arrow functions and regular functions?**
Arrow functions have no own `this`, `arguments`, `super` or `new.target`; they capture `this` lexically from the surrounding scope, which makes them ideal for callbacks inside methods. They cannot be used as constructors (`new` throws), have no `prototype` property, and cannot be generators. Regular functions get `this` from how they are called, are hoisted when written as declarations, and are the right tool for object methods that need `this` and for anything called with `new`. The classic bug is using an arrow as an event handler and expecting `this` to be the element; it will be whatever `this` was outside.

**Q: What are first-class functions and higher-order functions?**
"First-class" means functions are values: they can be assigned, passed as arguments, returned and stored in arrays or objects. A higher-order function is one that takes a function as an argument or returns one; `map`, `filter`, `setTimeout` and `addEventListener` are all higher-order. This is what makes composition possible: a `makeRater(rate)` factory returns a specialized rater that the caller can pass to `map`. The concept is the foundation of callbacks, promises and functional patterns, so it is worth being able to define it in one sentence.

**Q: What is the arguments object and why is it discouraged?**
`arguments` is an array-like object available inside non-arrow functions holding every argument passed, even ones without a parameter. It is discouraged because it is not a real array (no `map` or `filter` without `Array.from`), it is absent in arrow functions, and in sloppy mode it is linked to the named parameters so changing one changes the other. Rest parameters (`...args`) give a real array, work in arrows and are explicit in the signature, so they replaced `arguments` in ES2015.

## Arrays and array methods

An **array** is an ordered list of values. Production reports, file lists, rate tables, quiz answers: nearly every dataset you touch arrives as an array, and the methods on `Array.prototype` are the most-used API in the language.

### Creating and reading

```js
const files = ["deed.pdf", "survey.pdf", "policy.docx"];
console.log(files.length);      // 3
console.log(files[0]);          // "deed.pdf"
console.log(files.at(-1));      // "policy.docx"
console.log(files.indexOf("survey.pdf"));   // 1
console.log(files.includes("title.pdf"));   // false
```

Arrays can hold mixed types and other arrays, but a well-behaved array holds one kind of thing.

### Adding and removing

| Method | What it does | Returns |
|---|---|---|
| `push(x)` / `pop()` | add / remove at the **end** | new length / removed item |
| `unshift(x)` / `shift()` | add / remove at the **start** | new length / removed item |
| `splice(i, count, ...items)` | remove `count` at `i`, insert items | removed items |
| `slice(start, end)` | copy a range, original untouched | new array |

```js
const queue = ["A", "B", "C", "D"];
queue.push("E");            // ["A","B","C","D","E"]
queue.shift();              // removes "A"
queue.splice(1, 1, "X");    // ["B","X","D","E"]
console.log(queue.slice(0, 2));   // ["B","X"]  (queue unchanged)
```

`push`, `pop`, `shift`, `unshift`, `splice`, `sort` and `reverse` **mutate** the array. `slice`, `map`, `filter`, `concat` return new arrays.

### The big three: map, filter, reduce

Each takes a callback and never mutates the source.

```js
const jobs = [
  { id: "F-101", pages: 12,  rate: 4 },
  { id: "F-102", pages: 767, rate: 3 },
  { id: "F-103", pages: 135, rate: 4 },
];

const fees = jobs.map(j => j.pages * j.rate);          // [48, 2301, 540]
const big  = jobs.filter(j => j.pages > 100);          // two objects
const total = jobs.reduce((sum, j) => sum + j.pages * j.rate, 0);   // 2889
console.log(fees, big.length, total);
```

- `map` transforms each element and returns an array of the same length.
- `filter` keeps elements where the callback returns a truthy value.
- `reduce` folds the array into one value; the second argument (`0`) is the starting accumulator. Forgetting it makes the first element the accumulator, which breaks on empty arrays and on arrays of objects.

Chaining is natural: `jobs.filter(j => j.rate === 4).map(j => j.id)` gives `["F-101", "F-103"]`.

### Searching

```js
console.log(jobs.find(j => j.pages > 100));        // first matching object
console.log(jobs.findIndex(j => j.id === "F-103")); // 2
console.log(jobs.some(j => j.pages > 500));        // true
console.log(jobs.every(j => j.rate >= 3));         // true
```

`find` returns `undefined` when nothing matches; guard with optional chaining, `jobs.find(...)?.id`.

### Sorting correctly

`sort()` without a comparator converts everything to strings, so `[10, 9, 1].sort()` gives `[1, 10, 9]`. Always pass a comparator returning negative, zero or positive:

```js
const pages = [767, 12, 135];
pages.sort((a, b) => a - b);                     // [12, 135, 767]
jobs.sort((a, b) => a.id.localeCompare(b.id));   // alphabetical by id
const byPagesDesc = jobs.toSorted((a, b) => b.pages - a.pages);   // ES2023: copy, not mutate
```

### Other everyday helpers

```js
[1, [2, [3]]].flat(Infinity);          // [1, 2, 3]
["a", "b"].join(" | ");                // "a | b"
Array.from({ length: 3 }, (_, i) => i + 1);   // [1, 2, 3]
[..."abc"];                            // ["a", "b", "c"]
const copy = [...files];               // shallow copy
[1, 2, 3].forEach(n => console.log(n));  // loop, returns undefined
```

`forEach` is for side effects only. If you find yourself pushing into an outer array inside `forEach`, you wanted `map` or `filter`.

### Grouping and counting with reduce

```js
const byState = [
  { file: "TX-1", state: "TX" }, { file: "FL-1", state: "FL" }, { file: "TX-2", state: "TX" },
].reduce((acc, row) => {
  (acc[row.state] ??= []).push(row.file);
  return acc;
}, {});
console.log(byState);   // { TX: ["TX-1", "TX-2"], FL: ["FL-1"] }
```

ES2024 adds `Object.groupBy(rows, r => r.state)` which does the same in one line; check browser support before relying on it.

> **Warning:** `const arr = [];` then `arr[5] = "x"` creates a **sparse** array with length 6 and four empty slots. `map` and `forEach` skip empty slots, `for...of` yields `undefined` for them. Avoid writing past the end; use `push`.

### Try It Yourself

```js
const production = [
  { file: "TX-2026-00120", state: "TX", pages: 42, qa: "pass" },
  { file: "FL-2026-00033", state: "FL", pages: 18, qa: "fail" },
  { file: "TX-2026-00121", state: "TX", pages: 65, qa: "pass" },
  { file: "NY-2026-00007", state: "NY", pages: 9,  qa: "pass" },
  { file: "FL-2026-00034", state: "FL", pages: 27, qa: "pass" },
];
const passed = production.filter(r => r.qa === "pass");
const totalPages = passed.reduce((s, r) => s + r.pages, 0);
const perState = production.reduce((acc, r) => { acc[r.state] = (acc[r.state] || 0) + 1; return acc; }, {});
console.log("Pass rate:", (passed.length / production.length * 100).toFixed(1) + "%");
console.log("Pages passed QA:", totalPages);
console.log("Files per state:", perState);
console.log("Largest first:", production.toSorted((a, b) => b.pages - a.pages).map(r => `${r.file} (${r.pages})`).join(", "));
console.log("Any failures?", production.some(r => r.qa === "fail"), "| First failure:", production.find(r => r.qa === "fail")?.file);
```

### Quiz

1. Which method returns a new array of the same length with transformed values?
- [x] map
- [ ] filter
- [ ] forEach
> `map` applies the callback to each element and collects the results.

2. What does `[10, 9, 1].sort()` return?
- [ ] [1, 9, 10]
- [x] [1, 10, 9]
- [ ] [10, 9, 1]
> The default sort compares strings, and "10" comes before "9".

3. Which of these mutates the original array?
- [ ] slice
- [x] splice
- [ ] filter
> `splice` removes/inserts in place; `slice` and `filter` return copies.

4. What is the purpose of the second argument to `reduce`?
- [x] The initial accumulator value
- [ ] The index to start at
- [ ] The element count
> Without it the first element becomes the accumulator, which fails on empty arrays.

### Exercises

1. **Failed files** — From the `production` array above, print the file names that failed QA, as one comma-separated string.
<details><summary>Solution</summary>

```js
console.log(production.filter(r => r.qa === "fail").map(r => r.file).join(", "));
```

</details>

2. **Top two** — Return the two files with the most pages without mutating the source array.
<details><summary>Solution</summary>

```js
const top2 = [...production].sort((a, b) => b.pages - a.pages).slice(0, 2);
console.log(top2.map(r => r.file));
```

</details>

3. **Unique states** — Produce a sorted array of unique state codes.
<details><summary>Solution</summary>

```js
console.log([...new Set(production.map(r => r.state))].sort()); // ["FL", "NY", "TX"]
```

</details>

### Interview Questions

**Q: What is the difference between map and forEach?**
`map` returns a new array containing the callback's return values and is meant for transformation; `forEach` returns `undefined` and exists for side effects such as logging or DOM updates. Using `map` and ignoring the result wastes an allocation and misleads readers; using `forEach` with an outer `push` is a sign you wanted `map` or `filter`. Neither can be broken out of early; for that use `some`, `every`, `find` or a plain `for...of`.

**Q: How would you remove duplicates from an array?**
For primitives, `[...new Set(arr)]` is the idiomatic one-liner and runs in O(n). For objects, deduplicate by a key: build a `Map` keyed on `obj.id` and take `map.values()`, or use `filter` with `findIndex`, which is O(n²) and fine only for small lists. In a production-report merge I key on the file number because two rows with the same file number are the same record even if the timestamps differ.

**Q: Explain how reduce works and give a use beyond summing.**
`reduce` walks the array left to right, calling the callback with an accumulator and the current element and using the returned value as the next accumulator; the final accumulator is the result. Beyond sums it builds lookups (`{ id: row }`), groups rows by a field, counts occurrences, flattens nested arrays, or composes functions by folding them into one. The trap is forgetting the initial value or mutating the accumulator in surprising ways; I always pass an explicit initial value and return the accumulator on every path.

**Q: Why is sort tricky in JavaScript?**
The default comparator converts elements to strings, so numbers sort lexicographically and `undefined` values go to the end. `sort` also mutates in place, which corrupts shared data when you sort a prop or a cached array. Since ES2019 the sort is guaranteed stable, so multi-key sorting can be done by sorting on the secondary key first. `toSorted` (ES2023) returns a copy; before that the pattern was `[...arr].sort(cmp)`.

## Objects and JSON

An **object** is a collection of key/value pairs. Keys are strings (or symbols); values can be anything, including other objects and functions. JSON is the text format for exchanging objects, and it is how every API, config file and docx-js template describes data.

### Object literals

```js
const order = {
  id: 4821,
  client: "Fiverr buyer",
  deliverable: "Fillable PDF form",
  fields: 168,
  "due date": "2026-09-30",     // keys with spaces need quotes
  rush: true,
};
console.log(order.fields);          // 168
console.log(order["due date"]);     // bracket access for awkward keys
const key = "client";
console.log(order[key]);            // dynamic access
```

Dot notation works for valid identifiers; bracket notation takes any string expression. Reading a missing property gives `undefined`, not an error; reading a property **of** `undefined` throws, which is what optional chaining (`order.meta?.author`) prevents.

### Adding, changing, deleting

```js
order.status = "in progress";      // add
order.fields = 170;                // change
delete order.rush;                 // remove
console.log("rush" in order);      // false
console.log(Object.hasOwn(order, "id"));   // true (ES2022)
```

### Shorthand properties and methods

```js
const title = "Letterhead Suite";
const pages = 3;
const doc = {
  title,            // same as title: title
  pages,
  describe() {      // method shorthand
    return `${this.title} (${this.pages} pages)`;
  },
  [`v${2}`]: true,  // computed key: "v2"
};
console.log(doc.describe());   // "Letterhead Suite (3 pages)"
```

Inside a method, `this` refers to the object the method was called on.

### Iterating over objects

```js
Object.keys(order);      // ["id", "client", ...]
Object.values(order);    // [4821, "Fiverr buyer", ...]
Object.entries(order);   // [["id", 4821], ["client", "Fiverr buyer"], ...]
for (const [k, v] of Object.entries(order)) console.log(`${k}: ${v}`);
```

`Object.fromEntries` reverses `entries`, which makes transforming an object as easy as transforming an array: `Object.fromEntries(Object.entries(rates).map(([k, v]) => [k, v * 1.1]))`.

### Copying objects

```js
const defaults = { font: "Calibri", size: 11, margins: { top: 1, left: 1 } };
const shallow = { ...defaults, size: 12 };     // spread: top level copied
shallow.margins.top = 0.5;
console.log(defaults.margins.top);             // 0.5  (nested object shared!)

const deep = structuredClone(defaults);        // real deep copy (browsers, Node 17+)
deep.margins.top = 2;
console.log(defaults.margins.top);             // still 0.5
```

Spread and `Object.assign({}, a, b)` are shallow: nested objects are shared. `structuredClone` copies deeply and handles Dates, Maps, Sets and typed arrays, but not functions or DOM nodes.

### JSON: JavaScript Object Notation

JSON is a text format with strict rules: keys in double quotes, no trailing commas, no comments, and only strings, numbers, booleans, null, arrays and objects.

```js
const text = JSON.stringify(order);
console.log(text);   // {"id":4821,"client":"Fiverr buyer",...}
const pretty = JSON.stringify(order, null, 2);   // indented with 2 spaces
const back = JSON.parse(text);
console.log(back.id === order.id, back === order);   // true false (a new object)
```

`JSON.stringify` drops properties whose value is `undefined`, a function or a symbol, and turns `Date` objects into ISO strings. `NaN` and `Infinity` become `null`. The second argument can be an array of keys to keep, or a **replacer** function; `JSON.parse` accepts a **reviver** to rebuild dates:

```js
const s = JSON.stringify({ due: new Date("2026-09-30"), note: undefined });
console.log(s);    // {"due":"2026-09-30T00:00:00.000Z"}
const obj = JSON.parse(s, (k, v) => (k === "due" ? new Date(v) : v));
console.log(obj.due instanceof Date);   // true
```

### Map and Set

When keys are not strings, or you need insertion order and fast size, use `Map`; for unique values use `Set`.

```js
const rateByState = new Map([["TX", 5.75], ["FL", 5.25]]);
rateByState.set("NY", 6.1);
console.log(rateByState.get("TX"), rateByState.size, rateByState.has("CA"));
const seen = new Set(["deed", "deed", "survey"]);
console.log(seen.size);   // 2
```

> **Interview note:** "How do you deep-clone an object?" The old answer `JSON.parse(JSON.stringify(obj))` loses Dates, `undefined`, Maps and functions and throws on circular references. The modern answer is `structuredClone`. Say both and explain the difference.

### Try It Yourself

```js
const template = {
  name: "Letterhead Suite",
  fonts: { heading: "Georgia", body: "Calibri" },
  sizes: [11, 12],
  created: new Date("2026-01-15"),
  approved: undefined,
};
const shallow = { ...template };
const viaJson = JSON.parse(JSON.stringify(template));
const deep = structuredClone(template);

shallow.fonts.body = "Arial";
console.log("Shared nested object:", template.fonts.body);   // Arial
console.log("JSON keeps Date?", viaJson.created instanceof Date, "| has 'approved'?", "approved" in viaJson);
console.log("structuredClone keeps Date?", deep.created instanceof Date, "| has 'approved'?", "approved" in deep);
console.log(JSON.stringify(template, ["name", "sizes"], 2));
console.log(Object.entries(template.fonts).map(([role, font]) => `${role}=${font}`).join("; "));
```

### Quiz

1. What does `JSON.stringify({ a: undefined, b: 1 })` produce?
- [ ] `{"a":undefined,"b":1}`
- [x] `{"b":1}`
- [ ] `{"a":null,"b":1}`
> Properties with `undefined` values are omitted from JSON output.

2. Which copy method duplicates nested objects?
- [ ] `{ ...obj }`
- [ ] `Object.assign({}, obj)`
- [x] `structuredClone(obj)`
> Spread and `Object.assign` are shallow; nested objects remain shared.

3. How do you read a property whose key is stored in a variable?
- [ ] `obj.key`
- [x] `obj[key]`
- [ ] `obj->key`
> Bracket notation evaluates the expression inside; dot notation uses the literal name.

4. Which is valid JSON?
- [ ] `{ id: 1 }`
- [x] `{ "id": 1 }`
- [ ] `{ "id": 1, }`
> JSON requires double-quoted keys and forbids trailing commas.

### Exercises

1. **Invert a lookup** — Turn `{ TX: 5.75, FL: 5.25 }` into `{ "5.75": "TX", "5.25": "FL" }`.
<details><summary>Solution</summary>

```js
const rates = { TX: 5.75, FL: 5.25 };
console.log(Object.fromEntries(Object.entries(rates).map(([k, v]) => [v, k])));
```

</details>

2. **Count fields by type** — Given `[{name:"a",type:"text"},{name:"b",type:"checkbox"},{name:"c",type:"text"}]` produce `{ text: 2, checkbox: 1 }`.
<details><summary>Solution</summary>

```js
const fields = [{ name: "a", type: "text" }, { name: "b", type: "checkbox" }, { name: "c", type: "text" }];
const counts = fields.reduce((acc, f) => ({ ...acc, [f.type]: (acc[f.type] || 0) + 1 }), {});
console.log(counts);
```

</details>

3. **Round trip with dates** — Serialize an object with a Date, then parse it back so the Date is a Date again.
<details><summary>Solution</summary>

```js
const s = JSON.stringify({ due: new Date("2026-09-30") });
const o = JSON.parse(s, (k, v) => (k === "due" ? new Date(v) : v));
console.log(o.due.getFullYear()); // 2026
```

</details>

### Interview Questions

**Q: What is the difference between a Map and a plain object?**
A `Map` accepts keys of any type (objects, numbers, booleans) and keeps insertion order reliably, exposes `size` directly, and is optimized for frequent additions and removals. A plain object coerces keys to strings, has prototype properties like `constructor` that can collide with data keys (use `Object.create(null)` to avoid that), and has no direct size. Objects serialize to JSON automatically; Maps do not, so you convert with `Object.fromEntries(map)`. I use objects for fixed-shape records and Maps for dynamic lookups such as rate-by-state tables.

**Q: What are the limitations of JSON as a data format?**
JSON has no representation for Dates (they become strings), `undefined`, functions, `NaN`/`Infinity` (they become `null`), BigInt (`JSON.stringify` throws), Maps, Sets, or circular references (throws "Converting circular structure to JSON"). Numbers are IEEE doubles, so integers beyond 2^53 lose precision, which bites with 19-digit IDs from some databases. Comments are not allowed, which is why config files often use JSON5 or YAML. Knowing these limits explains most "my data changed after the API call" bugs.

**Q: How do you safely access a deeply nested property that may not exist?**
Optional chaining, `order?.client?.address?.city`, returns `undefined` at the first nullish link instead of throwing "Cannot read properties of undefined". Combine it with `??` for a default: `order?.client?.address?.city ?? "Unknown"`. Before ES2020 you chained `&&` checks or wrote a `get(obj, path)` helper like lodash's. Optional chaining also works for calls, `callback?.()`, and bracket access, `obj?.[key]`.

## DOM and events

The **DOM** (Document Object Model) is the browser's live tree of objects representing the HTML page. JavaScript reads and changes that tree, and the page updates instantly. **Events** are how the page tells your code that something happened: a click, a keystroke, a file dropped onto an input.

### Finding elements

```js
const title = document.querySelector("#title");         // first match for a CSS selector
const rows  = document.querySelectorAll("table tr");    // static NodeList of all matches
const byId  = document.getElementById("amount");        // fastest for ids
```

`querySelector` accepts any CSS selector (`.class`, `input[type=number]`, `tr:nth-child(2)`). It returns `null` when nothing matches, so check before using the result.

### Reading and changing content

```js
title.textContent = "Rate Calculator";          // plain text, HTML escaped
title.innerHTML = "Rate <em>Calculator</em>";   // parses HTML, dangerous with user input
const amount = document.getElementById("amount").value;   // inputs use .value (always a string)
title.setAttribute("data-version", "2");
title.classList.add("ready");
title.classList.toggle("dark");
title.style.color = "#B8960B";
```

Use `textContent` unless you deliberately insert markup. Setting `innerHTML` from user-typed text is the classic cross-site scripting (XSS) hole.

### Creating and removing elements

```js
const table = document.querySelector("#results");
const tr = document.createElement("tr");
for (const cell of ["TX-2026-00120", "42", "pass"]) {
  const td = document.createElement("td");
  td.textContent = cell;
  tr.append(td);
}
table.append(tr);          // adds at the end
// tr.remove();            // deletes it again
```

`append` accepts multiple nodes or strings; `prepend`, `before`, `after` and `replaceWith` position relative to an element. For many rows, build them in a `DocumentFragment` and append once to avoid repeated reflows.

### Listening for events

```js
const button = document.querySelector("#calc");
button.addEventListener("click", (event) => {
  const amount = Number(document.getElementById("amount").value);
  document.querySelector("#out").textContent = (amount / 1000 * 5.75).toFixed(2);
});
```

`addEventListener(type, handler)` attaches a function; you can attach several to one element, and remove one with `removeEventListener` using the same function reference. Common types: `click`, `input` (fires on every keystroke), `change` (fires when the field loses focus or a select changes), `submit`, `keydown`, `DOMContentLoaded`.

### The event object

The handler receives an `Event` with useful members:

| Property / method | Meaning |
|---|---|
| `event.target` | the element that triggered the event |
| `event.currentTarget` | the element the listener is attached to |
| `event.preventDefault()` | stop the default action (form submit, link navigation) |
| `event.stopPropagation()` | stop the event bubbling to ancestors |
| `event.key` | which key was pressed (keyboard events) |

```js
document.querySelector("form").addEventListener("submit", e => {
  e.preventDefault();     // keep the page from reloading
  console.log("Fields:", Object.fromEntries(new FormData(e.target)));
});
```

### Bubbling and delegation

An event fires on the target and then **bubbles** up through every ancestor to `document`. That lets one listener on a table handle clicks on thousands of cells:

```js
document.querySelector("#results").addEventListener("click", e => {
  const row = e.target.closest("tr");
  if (row) row.classList.toggle("selected");
});
```

Delegation also works for rows added later, which per-row listeners cannot do.

### Waiting for the page

If your script runs in `<head>` without `defer`, the elements do not exist yet. Either move the script to the end of `<body>`, add `defer`, or wrap the code:

```js
document.addEventListener("DOMContentLoaded", () => { /* safe to touch elements */ });
```

> **Tip:** In the console, `$0` is the element currently selected in the Elements tab, and `$("selector")` is a shortcut for `querySelector`. They are console-only helpers, not real JavaScript.

### Try It Yourself

```js
// This runner shows console output; the DOM code below builds elements in memory.
if (typeof document === "undefined") {
  console.log("No DOM in this environment. Paste this into a browser console instead.");
} else {
  const table = document.createElement("table");
  const rows = [["TX-2026-00120", 42, "pass"], ["FL-2026-00033", 18, "fail"]];
  for (const r of rows) {
    const tr = document.createElement("tr");
    for (const v of r) { const td = document.createElement("td"); td.textContent = v; tr.append(td); }
    if (r[2] === "fail") tr.classList.add("qa-fail");
    table.append(tr);
  }
  table.addEventListener("click", e => console.log("clicked", e.target.closest("tr")?.firstChild.textContent));
  console.log(table.outerHTML);
  console.log("Rows:", table.querySelectorAll("tr").length, "| Failures:", table.querySelectorAll(".qa-fail").length);
  table.querySelector("tr").dispatchEvent(new Event("click", { bubbles: true }));
}
```

### Quiz

1. Which property safely sets plain text on an element?
- [x] textContent
- [ ] innerHTML
- [ ] outerHTML
> `textContent` escapes markup; `innerHTML` parses it and can execute injected scripts.

2. What does `event.preventDefault()` do on a form submit?
- [ ] Stops bubbling
- [x] Stops the browser from submitting and reloading the page
- [ ] Clears the form
> Default actions include navigation and submission; `preventDefault` cancels them.

3. What is event delegation?
- [x] One listener on an ancestor handles events from many descendants
- [ ] Passing an event to another function
- [ ] Removing listeners automatically
> Because events bubble, a parent can inspect `event.target` and handle children, including ones added later.

4. What type is `input.value`?
- [ ] number
- [x] string
- [ ] boolean
> Form values are always strings; convert with `Number()` before arithmetic.

### Exercises

1. **Live total** — Given two number inputs `#a` and `#b` and a `<span id="sum">`, update the span on every keystroke.
<details><summary>Solution</summary>

```js
const a = document.querySelector("#a"), b = document.querySelector("#b"), sum = document.querySelector("#sum");
const update = () => { sum.textContent = Number(a.value) + Number(b.value); };
a.addEventListener("input", update);
b.addEventListener("input", update);
```

</details>

2. **Delete row** — Each table row has a button with class `del`. Use delegation so clicking it removes that row.
<details><summary>Solution</summary>

```js
document.querySelector("table").addEventListener("click", e => {
  if (e.target.matches("button.del")) e.target.closest("tr").remove();
});
```

</details>

3. **Escape key** — Log "closing" when the user presses Escape anywhere on the page.
<details><summary>Solution</summary>

```js
document.addEventListener("keydown", e => { if (e.key === "Escape") console.log("closing"); });
```

</details>

### Interview Questions

**Q: What is the difference between event bubbling and capturing?**
Every DOM event travels in three phases: capturing from `window` down to the target, the target phase, then bubbling from the target back up to `window`. Listeners run in the bubbling phase by default; passing `{ capture: true }` as the third argument to `addEventListener` runs them on the way down instead. Capturing is rare in application code but useful for intercepting events before a child handler can stop propagation, such as global click logging. Some events like `focus` and `blur` do not bubble, which is why `focusin`/`focusout` exist.

**Q: Why is innerHTML dangerous and what should you use instead?**
`innerHTML` parses a string as HTML, so if any part comes from user input, an attacker can inject `<img src=x onerror="...">` and run script in every viewer's browser: cross-site scripting. Use `textContent` for text, `createElement` plus `append` for structure, or a sanitizer such as DOMPurify when you genuinely need to render user-supplied HTML. In a single-file rate calculator I never touch `innerHTML` with anything derived from the form.

**Q: How would you render 10,000 table rows efficiently?**
Avoid touching the live DOM 10,000 times: build rows in a `DocumentFragment` or in a detached `<tbody>` and append once, which triggers a single reflow. Use event delegation for row clicks instead of 10,000 listeners. If the list is scrolled, virtualize it: render only the visible window of rows and reuse elements as the user scrolls. And measure with the Performance tab rather than guessing, because the bottleneck is usually layout, not JavaScript.

**Q: What is the difference between the input and change events?**
`input` fires on every modification of a field's value, keystroke by keystroke, including paste and drag. `change` fires when the modification is committed: on blur for text fields, immediately for checkboxes, radios and selects. Use `input` for live previews such as a running total and `change` for expensive work like re-running a validation across 168 fields, often combined with a debounce.

## Scope, hoisting and closures

**Scope** is the set of variables a piece of code can see. **Hoisting** is what the engine does with declarations before running a scope. **Closures** are functions that keep access to the scope they were created in. These three ideas explain most "why is this undefined" bugs and appear in every JavaScript interview.

### Three kinds of scope

```js
const appName = "RateCalc";              // global scope: visible everywhere

function run() {
  const state = "TX";                    // function scope: visible inside run only
  if (state === "TX") {
    const rate = 5.75;                   // block scope: visible inside the braces only
    console.log(appName, state, rate);   // works
  }
  // console.log(rate);                  // ReferenceError: rate is not defined
}
run();
```

`let` and `const` are block scoped. `var` ignores blocks and is scoped to the whole function:

```js
function demo() {
  if (true) { var x = 1; let y = 2; }
  console.log(x);   // 1
  console.log(typeof y);   // "undefined": y is not visible here
}
demo();
```

Inner scopes can read outer variables; outer scopes cannot read inner ones. When the same name exists in both, the inner one **shadows** the outer.

### Hoisting

Before executing a scope, the engine registers its declarations. Function declarations are hoisted with their body, so you can call them earlier in the file:

```js
console.log(greet());      // "hello" — works
function greet() { return "hello"; }
```

`var` declarations are hoisted but initialized to `undefined`:

```js
console.log(count);        // undefined, not an error
var count = 5;
```

`let` and `const` are hoisted too, but they sit in the **temporal dead zone** (TDZ) until their line runs, so touching them early throws:

```js
console.log(total);        // ReferenceError: Cannot access 'total' before initialization
let total = 5;
```

The TDZ is a feature: it turns silent `undefined` bugs into loud errors.

### Closures

A closure is created every time a function is defined inside another scope and keeps using that scope's variables after the outer function has returned.

```js
function makeCounter(label) {
  let count = 0;                        // private to this closure
  return function () {
    count++;
    return `${label}: ${count}`;
  };
}
const qaChecks = makeCounter("QA checks");
const rejects = makeCounter("Rejects");
console.log(qaChecks(), qaChecks(), rejects());   // "QA checks: 1" "QA checks: 2" "Rejects: 1"
```

Each call to `makeCounter` creates a fresh `count`. Nothing outside can read or reset it; the only door is the returned function. This is how JavaScript did private state before class fields.

### The loop bug every interviewer asks

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var:", i), 0);   // prints 3, 3, 3
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let:", j), 0);   // prints 0, 1, 2
}
```

With `var` there is one shared `i` for the whole function; by the time the timers fire, the loop has finished and `i` is 3. With `let`, each iteration gets its own binding, so each closure captures a different `j`. Before `let`, the fix was an IIFE: `(function (k) { setTimeout(() => console.log(k)); })(i);`.

### Practical closure patterns

**Memoization** caches expensive results:

```js
function memoize(fn) {
  const cache = new Map();
  return arg => {
    if (!cache.has(arg)) cache.set(arg, fn(arg));
    return cache.get(arg);
  };
}
const slowSquare = n => { for (let k = 0; k < 1e6; k++); return n * n; };
const fastSquare = memoize(slowSquare);
```

**Once**: run a setup function only the first time:

```js
const once = fn => { let done = false, result; return (...a) => done ? result : (done = true, result = fn(...a)); };
```

**Module pattern**: an IIFE returning an object whose methods close over private variables, the ancestor of ES modules.

### Scope and memory

A closure keeps its whole enclosing scope alive as long as the function exists. Capturing a 50 MB parsed PDF inside a long-lived event handler keeps that PDF in memory; the performance chapter shows how to spot this in DevTools.

> **Interview note:** Be ready to define a closure in one sentence ("a function bundled with references to its surrounding lexical scope"), then show the counter example, then explain the `var`-in-loop bug. That trio is the standard sequence.

### Try It Yourself

```js
function makeRateTable(name) {
  const rates = {};                       // private state
  let lookups = 0;
  return {
    set(state, rate) { rates[state] = rate; return this; },
    get(state) { lookups++; return rates[state] ?? null; },
    stats() { return `${name}: ${Object.keys(rates).length} states, ${lookups} lookups`; },
  };
}
const table = makeRateTable("2026 matrix").set("TX", 5.75).set("FL", 5.25);
console.log(table.get("TX"), table.get("CA"));
console.log(table.stats());
console.log("rates" in table, typeof table.rates);   // false "undefined": truly private

for (var i = 0; i < 3; i++) setTimeout(() => console.log("var i =", i), 0);
for (let j = 0; j < 3; j++) setTimeout(() => console.log("let j =", j), 0);
try { console.log(late); } catch (e) { console.log(e.constructor.name + ":", e.message); }
let late = "declared after use";
```

### Quiz

1. What does accessing a `let` variable before its declaration do?
- [ ] Returns undefined
- [x] Throws a ReferenceError
- [ ] Returns null
> `let` and `const` are in the temporal dead zone until their declaration executes.

2. What does the `var` loop with `setTimeout` print?
- [ ] 0 1 2
- [x] 3 3 3
- [ ] undefined three times
> One shared `i` is captured, and it equals 3 when the timers run.

3. A closure is:
- [x] A function that retains access to its defining scope
- [ ] A function with no parameters
- [ ] A block of code inside braces
> Closures "close over" variables from the scope in which they were created.

4. Which declaration is scoped to the whole function rather than the block?
- [ ] let
- [ ] const
- [x] var
> `var` ignores block boundaries such as `if` and `for`.

### Exercises

1. **Private balance** — Write `makeAccount(initial)` returning `{ deposit, withdraw, balance }` where the balance variable cannot be accessed directly.
<details><summary>Solution</summary>

```js
function makeAccount(initial) {
  let bal = initial;
  return {
    deposit: n => (bal += n),
    withdraw: n => (bal -= n),
    balance: () => bal,
  };
}
const acc = makeAccount(100); acc.deposit(50); acc.withdraw(30);
console.log(acc.balance()); // 120
```

</details>

2. **Fix the loop** — Rewrite the `var` timer loop so it prints 0, 1, 2 without using `let`.
<details><summary>Solution</summary>

```js
for (var i = 0; i < 3; i++) {
  (function (k) { setTimeout(() => console.log(k), 0); })(i);
}
```

</details>

3. **Memoized fibonacci** — Use a closure-based cache to compute fib(40) instantly.
<details><summary>Solution</summary>

```js
const fib = (() => {
  const memo = new Map();
  const f = n => n < 2 ? n : memo.get(n) ?? (memo.set(n, f(n - 1) + f(n - 2)), memo.get(n));
  return f;
})();
console.log(fib(40)); // 102334155
```

</details>

### Interview Questions

**Q: What is a closure and where have you used one?**
A closure is a function together with the lexical environment in which it was defined, so it can read and update those variables after the outer function has returned. I use closures for private state (a counter or cache that no other code can reset), for factories that specialize a function such as `makeRater(rate)`, for memoization, and for event handlers that need access to the data they were created with. The cost is that captured scopes stay in memory as long as the closure lives, so I avoid capturing large buffers in long-lived handlers.

**Q: Explain hoisting and how var, let, const and functions differ.**
Hoisting means the engine registers declarations at the top of their scope before executing any code. Function declarations are hoisted with their body and are callable immediately. `var` is hoisted and initialized to `undefined`, so early reads return `undefined` silently. `let`, `const` and `class` are hoisted but left uninitialized in the temporal dead zone, so early reads throw a `ReferenceError`. Function expressions and arrows follow the rule of the variable holding them, which is why `const f = () => {}` cannot be called before its line.

**Q: What is lexical scope?**
Lexical (static) scope means a variable's visibility is determined by where it is written in the source, not by where a function is called from. An inner function can always see its enclosing function's variables because the nesting is fixed at author time, and the engine resolves each name by walking outward through the scope chain. JavaScript has no dynamic scope, with the single notable exception that `this` is determined by the call site rather than the source position, which is why `this` confuses people while closures do not.

**Q: How do you create private variables in JavaScript?**
Historically with closures: a factory function or module pattern keeps variables in its scope and exposes only functions that touch them. Since ES2022 classes support hard-private fields with the `#name` syntax, which the engine enforces even against `Object.keys` and reflection. `WeakMap` keyed by instance is a third approach used in libraries that target older engines. Naming conventions like `_private` are only a hint and interviewers will note that they enforce nothing.

# LEVEL: Advanced

## Error handling

Things go wrong: a form field holds text where a number is expected, a fetch times out, a PDF is corrupt. **Error handling** is how a program reports those failures precisely and recovers where it can, instead of dying with a red stack trace in the console.

### Throwing

`throw` stops execution and hands a value to the nearest enclosing `catch`. Always throw `Error` objects, never bare strings, because only `Error` carries a stack trace:

```js
function parseAmount(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error(`Invalid amount: "${raw}"`);
  }
  return n;
}
```

An `Error` has `name`, `message` and (non-standard but universal) `stack`. Built-in subclasses tell you what kind of failure happened: `TypeError` (wrong type, calling undefined), `RangeError` (invalid length, recursion too deep), `SyntaxError` (bad JSON), `ReferenceError` (unknown variable).

### try, catch, finally

```js
try {
  const amount = parseAmount("abc");
  console.log("never reached");
} catch (err) {
  console.log(err.name, "-", err.message);     // Error - Invalid amount: "abc"
} finally {
  console.log("runs whether or not there was an error");
}
```

`finally` runs on success, on failure and even after a `return` inside `try`; use it to release resources such as closing a modal or hiding a spinner. Since ES2019 you may omit the binding, `catch { ... }`, when you do not need the error object.

### Custom error classes

Custom errors let callers decide how to react based on the **type** of failure:

```js
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}
class NotFoundError extends Error {
  constructor(what) { super(`${what} not found`); this.name = "NotFoundError"; }
}

function validateForm(fields) {
  for (const [name, value] of Object.entries(fields)) {
    if (value === "") throw new ValidationError(name, `Field "${name}" is required`);
  }
}
try {
  validateForm({ applicant: "Ali", county: "" });
} catch (e) {
  if (e instanceof ValidationError) console.log("Highlight field:", e.field);
  else throw e;              // not ours: rethrow
}
```

Rethrowing unknown errors is important. A `catch` that swallows everything hides real bugs.

### The cause option

ES2022 lets you wrap a low-level error inside a high-level one without losing it:

```js
try {
  JSON.parse("{ bad json");
} catch (e) {
  const wrapped = new Error("Could not load rate matrix", { cause: e });
  console.log(wrapped.message, "->", wrapped.cause.name);   // ... -> SyntaxError
}
```

### Errors in asynchronous code

A `try/catch` only catches errors thrown **synchronously** inside its block. Errors inside a callback or a promise escape it:

```js
try {
  setTimeout(() => { throw new Error("late"); }, 0);
} catch (e) { /* never runs */ }
```

For promises, use `.catch()` or `await` inside `try`; the next chapter covers both. Two global hooks catch what slips through: `window.addEventListener("error", ...)` for synchronous errors and `window.addEventListener("unhandledrejection", ...)` for promises. In production you send those to a logging service.

### Error handling strategy

| Situation | Do |
|---|---|
| Invalid user input | Throw a `ValidationError`, show a friendly message near the field |
| Recoverable failure (retryable fetch) | Catch, retry with backoff, then surface |
| Programmer bug (TypeError from your own code) | Do not catch; let it reach the console or the global handler |
| Optional feature failing (localStorage blocked) | Catch locally, degrade gracefully |

Catch as **close to the decision** as possible, not around every line. Let errors propagate up to the layer that knows what the user should see.

### Returning errors instead of throwing

Some code prefers result objects: `{ ok: true, value }` or `{ ok: false, error }`. This keeps control flow explicit and is common in validation of many fields at once, where you want **all** 168 problems in one list rather than stopping at the first.

> **Warning:** `catch (e) {}` with an empty body is the most expensive line you will ever write. If you must ignore an error, write a comment saying why, and log it at debug level.

### Try It Yourself

```js
class ValidationError extends Error {
  constructor(field, message) { super(message); this.name = "ValidationError"; this.field = field; }
}
function validate(form) {
  const problems = [];
  if (!form.applicant?.trim()) problems.push(new ValidationError("applicant", "Applicant name is required"));
  const amt = Number(form.amount);
  if (!Number.isFinite(amt) || amt <= 0) problems.push(new ValidationError("amount", `Amount "${form.amount}" is not a positive number`));
  if (!/^[A-Z]{2}$/.test(form.state ?? "")) problems.push(new ValidationError("state", "State must be a two-letter code"));
  if (problems.length) throw new AggregateError(problems, `${problems.length} validation problem(s)`);
  return { ...form, amount: amt };
}
for (const form of [{ applicant: "Ali", amount: "250000", state: "TX" }, { applicant: " ", amount: "x", state: "Texas" }]) {
  try {
    console.log("OK:", validate(form));
  } catch (e) {
    if (e instanceof AggregateError) for (const p of e.errors) console.log(`${p.name} [${p.field}]: ${p.message}`);
    else throw e;
  } finally {
    console.log("--- checked", JSON.stringify(form));
  }
}
try { JSON.parse("{oops"); } catch (e) { const w = new Error("Config load failed", { cause: e }); console.log(w.message, "| cause:", w.cause.name); }
```

### Quiz

1. Which block always runs, even after a `return` inside `try`?
- [ ] catch
- [x] finally
- [ ] else
> `finally` executes on every exit path from the try statement.

2. Why throw `new Error("x")` instead of `throw "x"`?
- [x] Error objects carry a stack trace and a name
- [ ] Strings cannot be thrown
- [ ] Strings are slower
> Any value can be thrown, but only `Error` instances give you `stack`, `name` and `instanceof` checks.

3. Does `try/catch` catch an error thrown inside a `setTimeout` callback?
- [ ] Yes
- [x] No, the callback runs later on a different stack
- [ ] Only in strict mode
> The try block has already finished by the time the timer fires.

4. What does the `cause` option on Error do?
- [ ] Prints the error twice
- [x] Attaches the original lower-level error to a new higher-level one
- [ ] Prevents the error from being caught
> `new Error(msg, { cause })` (ES2022) preserves the chain for debugging.

### Exercises

1. **Safe JSON** — Write `safeParse(text)` that returns the parsed object or `null` on invalid JSON, without letting the error escape.
<details><summary>Solution</summary>

```js
function safeParse(text) {
  try { return JSON.parse(text); } catch { return null; }
}
console.log(safeParse('{"a":1}'), safeParse("{bad"));
```

</details>

2. **Retry helper** — Write `retry(fn, times)` that calls `fn` until it does not throw, at most `times` times, then rethrows the last error.
<details><summary>Solution</summary>

```js
function retry(fn, times) {
  let last;
  for (let i = 0; i < times; i++) {
    try { return fn(); } catch (e) { last = e; }
  }
  throw last;
}
let n = 0;
console.log(retry(() => { if (++n < 3) throw new Error("flaky"); return "ok on try " + n; }, 5));
```

</details>

3. **Typed catch** — Throw a `RangeError` for a page count over 2000 and a `TypeError` for a non-number, then handle each differently.
<details><summary>Solution</summary>

```js
function checkPages(p) {
  if (typeof p !== "number") throw new TypeError("pages must be a number");
  if (p > 2000) throw new RangeError("too many pages");
  return p;
}
for (const v of ["12", 5000, 767]) {
  try { console.log(checkPages(v)); }
  catch (e) { console.log(e instanceof RangeError ? "range:" : e instanceof TypeError ? "type:" : "other:", e.message); }
}
```

</details>

### Interview Questions

**Q: How do you decide where to put try/catch?**
At the boundary that can make a meaningful decision: the top of a request handler, an event handler, or a batch-processing loop where one bad file should not stop the other 399. Wrapping every line hides bugs and makes code unreadable; wrapping nothing means one bad input kills the tool. Inside library code I mostly let errors propagate, adding context with the `cause` option, and I catch only where I can retry, substitute a default, or show the user something specific.

**Q: What is the difference between operational errors and programmer errors?**
Operational errors are expected failures of the environment or input: network down, file missing, invalid form value. Programmer errors are bugs: calling a method on `undefined`, wrong argument types, off-by-one. Operational errors should be handled: retried, reported to the user, logged. Programmer errors should crash loudly during development and be fixed, because catching them and continuing leaves the program in an unknown state. The distinction, popularized by the Node.js community, shapes how I write catch blocks: check the error type and rethrow anything I did not anticipate.

**Q: How would you validate a form with 168 fields and report every problem at once?**
Collect rather than throw early: iterate the field definitions, push a `ValidationError` with the field name into an array for each failure, then either return the array or throw an `AggregateError` containing them. The UI maps each error's `field` to the input and shows the message inline. This gives the user one round trip instead of 168, and it keeps the validation rules data-driven so adding a field means adding a rule, not a branch. I also validate on `change` per field for instant feedback and on submit for the full set.

## this, prototypes and classes

JavaScript is object-oriented, but not the way Java or C# are. Objects inherit directly from other objects through a **prototype chain**, and the keyword `this` is decided by **how a function is called**, not where it was written. `class` syntax (ES2015) is a cleaner surface over the same machinery.

### How this is determined

| Call style | `this` is |
|---|---|
| `obj.method()` | `obj` |
| `fn()` (plain call) | `undefined` in strict mode, `globalThis` otherwise |
| `new Fn()` | the newly created object |
| `fn.call(x)`, `fn.apply(x)`, `fn.bind(x)()` | `x` |
| Arrow function | whatever `this` was in the surrounding scope |

```js
const report = {
  title: "Weekly Status",
  print() { return `Printing ${this.title}`; },
};
console.log(report.print());          // "Printing Weekly Status"
const detached = report.print;
console.log(detached());              // TypeError in strict mode: this is undefined
const fixed = report.print.bind(report);
console.log(fixed());                 // works again
```

Losing `this` when a method is passed as a callback (`button.addEventListener("click", report.print)`) is the most common bug in this area. Fixes: `bind`, wrap in an arrow (`() => report.print()`), or use a class field arrow method.

Arrow functions do not have their own `this`, so inside a method they inherit it, which makes them perfect for callbacks:

```js
const batch = {
  files: ["a.pdf", "b.pdf"],
  prefix: "Stewart-",
  rename() { return this.files.map(f => this.prefix + f); }   // arrow keeps this
};
console.log(batch.rename());   // ["Stewart-a.pdf", "Stewart-b.pdf"]
```

### Prototypes

Every object has a hidden link to another object, its **prototype**. When you read a property that the object lacks, the engine looks at the prototype, then the prototype's prototype, until it reaches `null`.

```js
const base = { describe() { return `${this.kind} with ${this.pages} pages`; } };
const manual = Object.create(base);      // manual's prototype is base
manual.kind = "Manual"; manual.pages = 135;
console.log(manual.describe());          // "Manual with 135 pages"
console.log(Object.getPrototypeOf(manual) === base);   // true
console.log(manual.hasOwnProperty("describe"));        // false: inherited
```

Arrays inherit from `Array.prototype`, which inherits from `Object.prototype`, which is why every array has `map` and `toString`. Adding a method to `Array.prototype` gives it to every array, which is powerful and almost always a bad idea in shared code.

### Constructor functions (the old way)

```js
function Doc(title, pages) {
  this.title = title;
  this.pages = pages;
}
Doc.prototype.summary = function () { return `${this.title}: ${this.pages}p`; };
const d = new Doc("SOP-12", 24);
console.log(d.summary(), d instanceof Doc);   // "SOP-12: 24p" true
```

`new` creates an empty object, sets its prototype to `Doc.prototype`, runs the function with `this` bound to that object, and returns it. Methods live on the prototype so all instances share one copy.

### Classes (the modern way)

```js
class Doc {
  static count = 0;                 // shared by the class, not instances
  #draft = true;                    // private field (ES2022)
  constructor(title, pages) {
    this.title = title;
    this.pages = pages;
    Doc.count++;
  }
  get size() { return this.pages > 500 ? "handbook" : "manual"; }
  set pages(v) { if (v < 0) throw new RangeError("pages"); this._pages = v; }
  get pages() { return this._pages; }
  publish() { this.#draft = false; return this; }
  get isDraft() { return this.#draft; }
  summary() { return `${this.title}: ${this.pages}p (${this.size})`; }
}

class Handbook extends Doc {
  constructor(title, pages, chapters) {
    super(title, pages);            // must call before using this
    this.chapters = chapters;
  }
  summary() { return super.summary() + `, ${this.chapters} chapters`; }
}
const h = new Handbook("Employee Handbook", 767, 14).publish();
console.log(h.summary(), h.isDraft, Doc.count, h instanceof Doc);
```

Under the hood, `class` still creates a constructor function and a prototype; `extends` sets up the prototype chain; `super.summary()` looks up the parent's method. Differences from old-style functions: class bodies are always strict, classes are not hoisted (TDZ applies), and calling one without `new` throws.

### Choosing between the two

Use classes when many objects share behaviour and need `instanceof` checks or inheritance, such as `ValidationError extends Error`. Use plain objects and factory functions when you just need data with a few helpers; they avoid `this` entirely and compose better.

> **Interview note:** "What does `new` do?" has a four-step answer: create an object, link its prototype to `Fn.prototype`, call `Fn` with `this` set to it, return the object unless the function returned another object explicitly.

### Try It Yourself

```js
class Deliverable {
  static #count = 0;
  #approved = false;
  constructor(title, pages) { this.title = title; this.pages = pages; Deliverable.#count++; }
  static get count() { return Deliverable.#count; }
  approve() { this.#approved = true; return this; }
  get status() { return this.#approved ? "approved" : "draft"; }
  describe() { return `${this.title} (${this.pages}p) - ${this.status}`; }
}
class Ebook extends Deliverable {
  constructor(title, pages, format = "EPUB3") { super(title, pages); this.format = format; }
  describe() { return `${super.describe()} [${this.format}]`; }
}
const items = [new Deliverable("Policy Manual", 135).approve(), new Ebook("Cookbook", 210)];
for (const it of items) console.log(it.describe());
console.log("Created:", Deliverable.count, "| Ebook is Deliverable?", items[1] instanceof Deliverable);
console.log("Prototype chain:", Object.getPrototypeOf(Object.getPrototypeOf(items[1])) === Deliverable.prototype);

const describe = items[0].describe;
try { describe(); } catch (e) { console.log("Detached method:", e.constructor.name); }
console.log("Bound:", describe.call(items[1]));
console.log("Private field visible?", Object.keys(items[0]));
```

### Quiz

1. In `obj.method()`, what is `this` inside `method`?
- [x] obj
- [ ] window
- [ ] undefined
> Method-call syntax binds `this` to the object before the dot.

2. What does an arrow function do with `this`?
- [ ] Binds it to the arrow function itself
- [x] Uses the `this` of the enclosing scope
- [ ] Sets it to undefined
> Arrows have no own `this`; they capture it lexically.

3. Where do methods defined in a class body live?
- [ ] On each instance
- [x] On the class's prototype
- [ ] In a global table
> All instances share one copy via the prototype chain.

4. What must a subclass constructor do before using `this`?
- [x] Call `super()`
- [ ] Call `this.init()`
- [ ] Nothing
> Until `super()` returns, `this` is uninitialized and accessing it throws.

### Exercises

1. **Fix the callback** — `setTimeout(report.print, 0)` loses `this`. Show two fixes.
<details><summary>Solution</summary>

```js
const report = { title: "W37", print() { console.log(this.title); } };
setTimeout(() => report.print(), 0);        // arrow wrapper
setTimeout(report.print.bind(report), 0);   // bind
```

</details>

2. **Shape hierarchy** — Create `Field` with `name` and `validate()` returning true, and `RequiredField` whose `validate()` returns false when the value is empty.
<details><summary>Solution</summary>

```js
class Field { constructor(name, value) { this.name = name; this.value = value; } validate() { return true; } }
class RequiredField extends Field { validate() { return this.value !== "" && this.value != null; } }
console.log(new RequiredField("county", "").validate(), new Field("note", "").validate()); // false true
```

</details>

3. **Prototype by hand** — Without `class`, create a `Counter` constructor whose `inc` method lives on the prototype.
<details><summary>Solution</summary>

```js
function Counter() { this.n = 0; }
Counter.prototype.inc = function () { return ++this.n; };
const c = new Counter(); c.inc(); c.inc();
console.log(c.n, Object.hasOwn(c, "inc")); // 2 false
```

</details>

### Interview Questions

**Q: Explain prototypal inheritance and how it differs from classical inheritance.**
In JavaScript, objects inherit directly from other objects: each has an internal `[[Prototype]]` link, and property lookup walks that chain until it finds the name or hits `null`. There are no classes as blueprints at runtime; the `class` keyword is syntax over constructor functions and prototypes. Classical inheritance (Java, C#) copies structure from a class into an instance at construction time, while prototypal inheritance delegates lookups at access time, so changing a prototype method later affects existing objects. This makes JavaScript flexible and is why `Object.create(proto)` is a complete inheritance mechanism on its own.

**Q: What are call, apply and bind?**
All three set `this` explicitly. `fn.call(ctx, a, b)` invokes immediately with individual arguments; `fn.apply(ctx, [a, b])` invokes with an array of arguments, which was the pre-spread way to pass an array to `Math.max`; `fn.bind(ctx, a)` returns a new function with `this` (and optionally leading arguments) permanently fixed, without calling it. `bind` is what you use to pass a method as an event handler or timer callback. A bound function's `this` cannot be changed again by `call` or `apply`.

**Q: What are the differences between class syntax and constructor functions?**
Classes are always in strict mode, are not hoisted (they sit in the TDZ like `let`), throw when called without `new`, and their methods are non-enumerable so they do not show up in `for...in`. They add `extends`/`super` with correct handling of built-ins like `Error` and `Array`, static members, getters/setters, and private `#fields` that constructor functions cannot express. Under the hood they still produce a constructor function with a prototype, so `typeof MyClass` is `"function"`.

**Q: How does instanceof work, and when does it fail?**
`a instanceof B` walks `a`'s prototype chain looking for `B.prototype`. It fails across realms (an array from an iframe is not `instanceof` the parent window's `Array`, which is why `Array.isArray` exists), it fails for primitives (`"x" instanceof String` is false), and it can be spoofed or customized through `Symbol.hasInstance`. For plain type checks I use `typeof` for primitives, `Array.isArray` for arrays and `instanceof` for my own classes such as custom errors.

## Promises, async/await and fetch

JavaScript runs on a single thread, so it cannot wait for a network request or a file read by blocking; the page would freeze. Instead, slow operations are **asynchronous**: they start now and report back later. Promises and `async/await` are the modern way to write that "later" without nesting callbacks six levels deep.

### From callbacks to promises

Early JavaScript passed a callback to be run when the work was done. Chaining several steps produced the "pyramid of doom":

```js
loadMatrix(url, matrix => {
  calculate(matrix, amount, premium => {
    render(premium, () => console.log("done"));
  });
});
```

A **Promise** is an object representing a value that will exist later. It is in one of three states: *pending*, *fulfilled* (with a value) or *rejected* (with a reason), and it settles exactly once.

```js
const delay = (ms, value) => new Promise(resolve => setTimeout(() => resolve(value), ms));

delay(200, "matrix loaded")
  .then(msg => { console.log(msg); return 1437.5; })
  .then(premium => console.log("Premium:", premium))
  .catch(err => console.log("Failed:", err.message))
  .finally(() => console.log("cleanup"));
```

`then` receives the fulfilled value and returns a **new** promise, so steps chain flat. A value returned from `then` becomes the next step's input; a promise returned from `then` is awaited before continuing. `catch` handles a rejection anywhere earlier in the chain. `finally` runs either way.

### Creating a rejecting promise

```js
function fetchRate(state) {
  return new Promise((resolve, reject) => {
    const rates = { TX: 5.75, FL: 5.25 };
    setTimeout(() => rates[state] ? resolve(rates[state]) : reject(new Error(`No rate for ${state}`)), 100);
  });
}
```

Reject with an `Error`, not a string, for the same stack-trace reasons as `throw`.

### async and await

`async` marks a function as returning a promise; `await` pauses that function (not the whole program) until a promise settles and gives you its value, or throws its rejection so ordinary `try/catch` works:

```js
async function quote(state, amount) {
  try {
    const rate = await fetchRate(state);
    const premium = (amount / 1000) * rate;
    return premium.toFixed(2);
  } catch (err) {
    console.log("Could not quote:", err.message);
    return null;
  }
}
quote("TX", 250000).then(p => console.log("TX:", p));   // "TX: 1437.50"
quote("CA", 250000).then(p => console.log("CA:", p));   // logs the error, then "CA: null"
```

An `async` function always returns a promise, even if you `return 5`. `await` is only valid inside `async` functions and at the top level of ES modules.

### Running work in parallel

`await` in a loop runs requests one after another. When they are independent, start them all and wait together:

```js
const states = ["TX", "FL", "NY"];
const results = await Promise.allSettled(states.map(s => fetchRate(s)));   // inside an async function or module
results.forEach((r, i) => console.log(states[i], r.status, r.value ?? r.reason.message));
```

| Combinator | Resolves when | Rejects when |
|---|---|---|
| `Promise.all(list)` | all fulfil, gives array of values | any rejects (fast-fail) |
| `Promise.allSettled(list)` | all settle, gives `{status, value/reason}` | never |
| `Promise.race(list)` | first settles (fulfil or reject) | first rejects |
| `Promise.any(list)` | first fulfils | all reject (`AggregateError`) |

`race` against a `delay(ms)` that rejects is the classic way to add a timeout.

### fetch

`fetch(url, options)` returns a promise for a `Response`. The promise rejects only on network failure; an HTTP 404 or 500 still **fulfils**, so check `response.ok` yourself:

```js
async function loadMatrix(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} loading ${url}`);
  return res.json();                       // also a promise; .text() and .blob() exist too
}

async function saveReport(report) {
  const res = await fetch("/api/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(report),
  });
  return res.ok;
}
```

Cancel a request with an `AbortController`: pass `{ signal: controller.signal }` and call `controller.abort()`; the awaiting code receives an `AbortError`. `AbortSignal.timeout(5000)` builds a signal that aborts after five seconds.

### Common mistakes

- Forgetting `await` and getting a `Promise { <pending> }` instead of a value.
- Using `forEach` with an async callback: `forEach` does not wait. Use `for...of` with `await`, or `Promise.all(arr.map(async ...))`.
- Not returning inside `then`, which breaks the chain.
- Catching too early so the caller never learns the operation failed.

> **Tip:** Unhandled rejections print "Uncaught (in promise)" in the console. Every promise chain should end in a `catch` or be awaited inside a `try` at some level.

### Try It Yourself

```js
const delay = (ms, v) => new Promise(r => setTimeout(() => r(v), ms));
const rates = { TX: 5.75, FL: 5.25, NY: 6.1 };
function fetchRate(state) {
  return delay(50 + Math.random() * 100).then(() => {
    if (!(state in rates)) throw new Error(`No rate for ${state}`);
    return rates[state];
  });
}
async function main() {
  console.log("Sequential:");
  const t0 = Date.now();
  for (const s of ["TX", "FL"]) console.log(" ", s, await fetchRate(s));
  console.log("  took ~", Date.now() - t0, "ms");

  console.log("Parallel with allSettled:");
  const t1 = Date.now();
  const results = await Promise.allSettled(["TX", "FL", "NY", "CA"].map(fetchRate));
  results.forEach((r, i) => console.log(" ", ["TX", "FL", "NY", "CA"][i], r.status, r.value ?? r.reason.message));
  console.log("  took ~", Date.now() - t1, "ms");

  const timeout = ms => delay(ms).then(() => { throw new Error("timeout"); });
  try { await Promise.race([delay(300, "slow"), timeout(100)]); }
  catch (e) { console.log("Race:", e.message); }
  console.log("any:", await Promise.any([fetchRate("CA"), fetchRate("TX")]));
}
main().catch(e => console.log("Unhandled:", e));
```

### Quiz

1. What does an `async` function return?
- [ ] The value after `return`
- [x] A promise that resolves to the returned value
- [ ] undefined
> `async` wraps the return value in a promise automatically.

2. When does `fetch()` reject?
- [ ] On HTTP 404
- [ ] On HTTP 500
- [x] On network failure or abort
> HTTP error statuses fulfil the promise; check `response.ok`.

3. Which combinator waits for every promise even if some reject?
- [ ] Promise.all
- [x] Promise.allSettled
- [ ] Promise.race
> `allSettled` never rejects; it reports each outcome.

4. Which loop correctly awaits each item in sequence?
- [ ] `arr.forEach(async x => await f(x))`
- [x] `for (const x of arr) await f(x);`
- [ ] `arr.map(x => await f(x))`
> `forEach` ignores returned promises, and `await` is not allowed inside a non-async `map` callback.

### Exercises

1. **Promisify a timer** — Write `sleep(ms)` that returns a promise and use it to log "a", wait 100 ms, then log "b".
<details><summary>Solution</summary>

```js
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => { console.log("a"); await sleep(100); console.log("b"); })();
```

</details>

2. **Timeout wrapper** — Write `withTimeout(promise, ms)` that rejects with "timeout" if the promise takes too long.
<details><summary>Solution</summary>

```js
const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);
withTimeout(new Promise(r => setTimeout(() => r("done"), 50)), 200).then(console.log);
withTimeout(new Promise(r => setTimeout(() => r("done"), 500)), 200).catch(e => console.log(e.message));
```

</details>

3. **Retry with backoff** — Write `retryAsync(fn, tries)` that awaits `fn()`, and on failure waits 100 ms times the attempt number before trying again.
<details><summary>Solution</summary>

```js
async function retryAsync(fn, tries) {
  for (let i = 1; ; i++) {
    try { return await fn(); }
    catch (e) { if (i >= tries) throw e; await new Promise(r => setTimeout(r, 100 * i)); }
  }
}
let n = 0;
retryAsync(async () => { if (++n < 3) throw new Error("flaky"); return "ok after " + n; }, 5).then(console.log);
```

</details>

### Interview Questions

**Q: What is a promise and what states can it be in?**
A promise is an object that represents the eventual result of an asynchronous operation. It starts pending and settles exactly once into fulfilled with a value or rejected with a reason; once settled it never changes, and any `then` attached later still receives the result. That immutability is what makes promises composable: you can hand the same promise to several consumers, chain transformations with `then`, and centralize failure handling with one `catch`. Promises are also the foundation `async/await` is built on, so understanding them explains why `await` throws on rejection.

**Q: What is the difference between Promise.all and Promise.allSettled, and when would you use each?**
`Promise.all` resolves with an array of values when every input fulfils and rejects immediately when any input rejects, discarding the others' results; it suits work where partial success is useless, such as loading all three parts of a document before rendering. `Promise.allSettled` waits for every input and returns `{ status, value }` or `{ status, reason }` per item, never rejecting; it suits batch jobs such as converting 50 files where you want a report of which ones failed. `Promise.any` and `Promise.race` complete the family for "first success" and "first to finish".

**Q: Why doesn't try/catch around a promise chain catch its rejection, and how do you handle it?**
`try/catch` only sees exceptions thrown synchronously while the block runs; a promise's rejection happens later, on a microtask, after the block has finished. Either attach `.catch()` to the chain, or `await` the promise inside an `async` function so the rejection is rethrown synchronously at the `await` point where `try/catch` can see it. For the last line of defence, `window.addEventListener("unhandledrejection", ...)` (or `process.on("unhandledRejection")` in Node) logs anything that escaped.

**Q: How does async/await relate to promises, and does it block the thread?**
`async/await` is syntactic sugar over promises: an `async` function returns a promise, and each `await` suspends the function, registering the rest of it as a continuation that runs when the awaited promise settles. The thread is never blocked; other events and timers keep running while the function is suspended. That is why `await` in a loop is slow but not frozen, and why independent requests should be started first and awaited together with `Promise.all`.

## Modules, destructuring and modern syntax

ES2015 and its yearly successors added syntax that makes code shorter and safer. This chapter covers the pieces you will use daily: **modules** for organizing files, **destructuring** and **spread** for pulling data apart and putting it together, and the newer operators for dealing with missing values.

### ES modules

A module is a file with its own scope. Nothing leaks out unless you `export` it, and nothing comes in unless you `import` it.

```js
// rates.js
export const DEFAULT_RATE = 5.75;
export function premium(amount, rate = DEFAULT_RATE) { return (amount / 1000) * rate; }
export default class RateTable { /* ... */ }

// app.js
import RateTable, { premium, DEFAULT_RATE as BASE } from "./rates.js";
import * as rates from "./rates.js";       // namespace object
console.log(premium(250000), BASE, rates.DEFAULT_RATE);
```

A file may have many named exports and one default export. In the browser you load the entry file with `<script type="module" src="app.js"></script>`; module scripts are deferred automatically, always strict, and `this` at top level is `undefined`. Modules run once even if imported many times, and imports are live bindings, not copies.

**Dynamic import** loads a module on demand and returns a promise, which is how a single-file tool can pull in `docx` only when the user clicks Export:

```js
const { Document, Packer } = await import("https://cdn.jsdelivr.net/npm/docx@9/+esm");
```

CommonJS (`require`/`module.exports`) is the older Node format; the Node.js course compares the two.

### Array destructuring

```js
const [state, year, seq] = "TX-2026-00123".split("-");
console.log(state, year, seq);                // TX 2026 00123
const [first, , third] = ["a", "b", "c"];     // skip with a hole
const [head, ...rest] = [1, 2, 3, 4];         // rest collects the remainder
let a = 1, b = 2; [a, b] = [b, a];            // swap without a temp
```

### Object destructuring

```js
const order = { id: 4821, client: "Fiverr buyer", fields: 168, meta: { rush: true } };
const { id, client: buyer, fields = 0, meta: { rush }, notes = "none" } = order;
console.log(id, buyer, fields, rush, notes);  // 4821 "Fiverr buyer" 168 true "none"
```

`client: buyer` renames, `= 0` supplies a default when the property is `undefined`, and nested patterns reach inside. Destructuring in parameters gives functions named options:

```js
function exportDoc({ format = "docx", pages, title = "Untitled" } = {}) {
  return `${title}.${format} (${pages ?? "?"} pages)`;
}
console.log(exportDoc({ pages: 135, title: "Policy Manual" }));
console.log(exportDoc());                     // the `= {}` makes the whole argument optional
```

### Spread and rest

Spread (`...`) expands an iterable or object into individual items; rest gathers them.

```js
const base = { font: "Calibri", size: 11 };
const heading = { ...base, size: 16, bold: true };   // later keys win
const all = [...["deed.pdf"], ...["survey.pdf"], "policy.docx"];
console.log(Math.max(...[12, 767, 135]));            // 767
const { size, ...withoutSize } = heading;            // object rest
```

Spread copies are shallow; nested objects are shared, as the objects chapter showed.

### Optional chaining and nullish coalescing

```js
const cfg = { export: { format: "pdf" } };
console.log(cfg.export?.format);        // "pdf"
console.log(cfg.print?.copies);         // undefined, no crash
console.log(cfg.print?.copies ?? 1);    // 1
cfg.onDone?.();                         // call only if it exists
console.log(cfg.export?.["format"]);    // bracket form
```

`?.` short-circuits the whole rest of the chain on `null`/`undefined`. `??` supplies a default only for those two values, unlike `||`.

### Logical assignment (ES2021)

```js
let settings = {};
settings.theme ??= "light";      // assign only if null/undefined
settings.retries ||= 3;          // assign if falsy
settings.debug &&= false;        // assign only if currently truthy
```

### Smaller conveniences

| Feature | Example | Since |
|---|---|---|
| Numeric separators | `1_000_000` | ES2021 |
| `Array.prototype.at` | `files.at(-1)` | ES2022 |
| `Object.hasOwn` | `Object.hasOwn(o, "k")` | ES2022 |
| `structuredClone` | deep copy | ES2022-era browsers |
| `Array.prototype.toSorted`/`with` | non-mutating copies | ES2023 |
| `Object.groupBy` | group array into object | ES2024 |
| `Set` methods `union`, `intersection` | `a.union(b)` | ES2025 |

> **Warning:** Destructuring `null` or `undefined` throws ("Cannot destructure property"). When the source can be missing, default it: `const { x } = maybe ?? {};`.

### Try It Yourself

```js
const orders = [
  { id: 4821, client: { name: "Nadia", country: "AE" }, items: [{ sku: "form-168", qty: 1 }], rush: true },
  { id: 4822, client: { name: "Tom" }, items: [{ sku: "dotx-suite", qty: 3 }, { sku: "epub3", qty: 1 }] },
  { id: 4823, items: [] },
];
for (const { id, client: { name = "Unknown", country = "--" } = {}, items: [firstItem, ...moreItems] = [], rush = false } of orders) {
  console.log(`#${id} ${name} (${country}) first=${firstItem?.sku ?? "none"} +${moreItems.length} rush=${rush}`);
}
const defaults = { format: "docx", toc: true, fonts: { body: "Calibri" } };
const overrides = { toc: false, fonts: { heading: "Georgia" } };
const merged = { ...defaults, ...overrides, fonts: { ...defaults.fonts, ...overrides.fonts } };
console.log(merged);
const [min, max] = [Math.min(...[12, 767, 135]), Math.max(...[12, 767, 135])];
console.log({ min, max });
let prefs = { pageSize: null };
prefs.pageSize ??= "Letter"; prefs.margins ||= 1;
console.log(prefs, 1_000_000 === 1000000);
```

### Quiz

1. Which HTML attribute makes a script an ES module?
- [ ] `defer`
- [x] `type="module"`
- [ ] `async`
> Module scripts use `<script type="module">` and are deferred automatically.

2. What does `const { client: buyer } = order` do?
- [ ] Creates a variable named `client`
- [x] Creates a variable named `buyer` with `order.client`'s value
- [ ] Renames the property on the object
> The `prop: name` pattern extracts `prop` into a variable called `name`.

3. What does `a?.b.c` return when `a` is undefined?
- [x] undefined
- [ ] Throws TypeError
- [ ] null
> Optional chaining short-circuits the rest of the chain once it hits nullish.

4. In `{ ...a, ...b }`, which object's keys win on conflict?
- [ ] a
- [x] b
- [ ] It throws
> Later spreads overwrite earlier ones.

### Exercises

1. **Options object** — Write `makeLabel({ text, width = 20, fill = "." })` that pads `text` to `width` with `fill`, and call it with only `text`.
<details><summary>Solution</summary>

```js
const makeLabel = ({ text, width = 20, fill = "." }) => text.padEnd(width, fill);
console.log(makeLabel({ text: "Total" })); // "Total..............."
```

</details>

2. **Swap and rest** — Given `[10, 20, 30, 40]`, swap the first two and collect the rest, printing `20 10 [30, 40]`.
<details><summary>Solution</summary>

```js
let [a, b, ...rest] = [10, 20, 30, 40];
[a, b] = [b, a];
console.log(a, b, rest);
```

</details>

3. **Safe deep read** — Read `report.summary.totals.pages` from an object that may lack any level, defaulting to 0.
<details><summary>Solution</summary>

```js
const report = { summary: {} };
console.log(report?.summary?.totals?.pages ?? 0); // 0
```

</details>

### Interview Questions

**Q: What are the differences between ES modules and CommonJS?**
ES modules use `import`/`export`, are statically analysable (imports are resolved before execution, enabling tree-shaking and early errors), export live bindings, are strict by default and support top-level `await`. CommonJS uses `require()` and `module.exports`, loads synchronously at call time, exports a copied value, and is the historical Node format. Browsers only understand ESM; Node supports both, choosing by `.mjs`/`.cjs` extension or the `"type"` field in `package.json`. Interop is the pain point: ESM can import CJS, but CJS cannot `require` an ESM file synchronously (Node 22 relaxed this when the module has no top-level await).

**Q: What is the difference between the rest and spread operators?**
Same three dots, opposite direction. Spread expands an iterable or object into individual elements at a call site, array literal or object literal (`f(...args)`, `[...a, ...b]`, `{ ...defaults, ...overrides }`). Rest collects remaining items into an array or object at a binding site: function parameters (`function f(first, ...others)`) and destructuring patterns (`const [head, ...tail] = list`). Rest must be the last element; spread can appear anywhere and multiple times.

**Q: Why prefer ?? over || for defaults?**
`||` returns the right-hand side whenever the left is falsy, so legitimate values like `0`, `""` and `false` get replaced, a bug that shows up as "my zero discount became 5". `??` only substitutes for `null` and `undefined`, which is precisely "value not provided". Mixing `??` with `||` or `&&` in one expression without parentheses is a syntax error by design, which forces you to state precedence explicitly. Use `??` for defaults and `||` for genuine boolean-ish fallbacks.

## Regular expressions, dates and Intl

Three built-in tools do most of the "clean and format" work in document scripts. **Regular expressions** find and replace patterns in text, the **Date** object handles time, and **Intl** formats numbers, currencies and dates for a specific locale.

### Regular expression basics

A regex is a pattern between slashes with optional flags. `test` answers yes/no; `match`, `matchAll` and `replace` extract or rewrite.

```js
const fileNo = /^([A-Z]{2})-(\d{4})-(\d{5})$/;
console.log(fileNo.test("TX-2026-00123"));      // true
console.log(fileNo.test("tx-2026-123"));        // false
const m = "TX-2026-00123".match(fileNo);
console.log(m[1], m[2], m[3]);                   // TX 2026 00123
```

| Piece | Meaning |
|---|---|
| `^` / `$` | start / end of input (or of line with the `m` flag) |
| `\d` `\w` `\s` | digit, word character, whitespace (uppercase negates) |
| `[A-Z]` | character class |
| `{2}` `{1,3}` `+` `*` `?` | repetition |
| `( )` | capture group; `(?<name> )` named group; `(?: )` non-capturing |
| the pipe symbol | alternation (either/or) |
| `.` | any character except newline (unless the `s` flag) |

Flags: `g` all matches, `i` case-insensitive, `m` multiline anchors, `s` dot matches newline, `u` full Unicode, `y` sticky.

### Named groups and matchAll

```js
const re = /(?<state>[A-Z]{2})-(?<year>\d{4})-(?<seq>\d{5})/g;
const text = "Files TX-2026-00123 and FL-2025-00891 are ready.";
for (const hit of text.matchAll(re)) {
  console.log(hit.groups.state, hit.groups.year, hit.index);
}
```

`matchAll` requires the `g` flag and returns an iterator of full match objects. With `g`, `String.prototype.match` returns only the matched strings, without groups.

### Replacing

```js
"2026-09-15".replace(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1");            // "15/09/2026"
"a  b   c".replace(/\s+/g, " ");                                          // "a b c"
"deed.PDF survey.Pdf".replace(/\.pdf\b/gi, ".pdf");                         // normalize extension case
"Price: 150".replace(/\d+/, n => String(Number(n) * 2));                  // callback replacer
```

`$1`..`$9` and `$<name>` refer to groups; a function replacer receives the match and groups and returns the replacement. Escape user input before building a regex from it: `text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")`. The `RegExp.escape()` method (2025) does this in newer engines.

### Lookarounds and common patterns

```js
/\d+(?= pages)/.exec("767 pages")[0];       // "767"  lookahead: digits followed by " pages"
/(?<=\$)\d+/.exec("Fee $150")[0];           // "150"  lookbehind
const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // good enough for a form
const phone = /^\+?\d[\d\s-]{7,}$/;
```

Regexes are greedy by default (`.*` eats as much as it can); add `?` for lazy matching (`.*?`). Catastrophic backtracking from nested quantifiers like `(a+)+` can hang the page on hostile input; keep patterns simple or anchor them.

### Dates

```js
const d = new Date(2026, 8, 15);             // months are 0-based: 8 = September
console.log(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getDay());   // 2026 9 15 2 (Tuesday)
const iso = new Date("2026-09-15T10:30:00Z"); // ISO strings with Z are UTC
console.log(iso.toISOString());              // "2026-09-15T10:30:00.000Z"
console.log(Date.now());                      // milliseconds since 1970-01-01 UTC
const due = new Date(d); due.setDate(due.getDate() + 14);   // add 14 days (rolls over months)
console.log(Math.round((due - d) / 86_400_000), "days");    // 14
```

Rules that save hours: months are zero-based; `new Date("2026-09-15")` is parsed as UTC midnight while `new Date("2026-09-15T00:00")` is local; `getDay()` is the weekday, `getDate()` the day of month; and `Date` objects are mutable, so copy before you `setDate`. The upcoming **Temporal** API fixes all of this but is not yet in every browser, so libraries like date-fns and Day.js remain common.

### Intl: locale-aware formatting

```js
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const pkr = new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 });
console.log(usd.format(1437.5), pkr.format(402500));       // "$1,437.50" "Rs 402,500" (symbol depends on ICU data)
console.log(new Intl.NumberFormat("en-US", { style: "percent" }).format(0.925));   // "93%" (rounds; set maximumFractionDigits)

const fmt = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "America/Chicago" });
console.log(fmt.format(iso));                              // "September 15, 2026"
console.log(iso.toLocaleDateString("en-GB"));              // "15/09/2026"
console.log(new Intl.RelativeTimeFormat("en").format(-3, "day"));   // "3 days ago"
console.log(new Intl.ListFormat("en").format(["deed", "survey", "policy"]));   // "deed, survey, and policy"
```

Create a formatter once and reuse it; construction is the expensive part. `Intl.Collator` sorts names correctly, and `Intl.PluralRules` picks "1 file" versus "2 files".

> **Tip:** For anything that will be parsed by a machine (file names, CSV, logs) use ISO 8601 (`2026-09-15`). For anything a human reads, use `Intl`. Never hand-format dates with string concatenation.

### Try It Yourself

```js
const log = `2026-09-14 TX-2026-00120 42p pass $1,437.50
2026-09-14 FL-2026-00033 18p FAIL $980.00
2026-09-15 NY-2026-00007 9p pass $2,105.25`;
const line = /^(?<date>\d{4}-\d{2}-\d{2}) (?<file>[A-Z]{2}-\d{4}-\d{5}) (?<pages>\d+)p (?<qa>pass|fail) \$(?<amt>[\d,]+\.\d{2})$/gim;
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const dateFmt = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
let total = 0;
for (const { groups: g } of log.matchAll(line)) {
  const amt = Number(g.amt.replace(/,/g, ""));
  total += amt;
  console.log(dateFmt.format(new Date(g.date)), g.file.replace(/^(\w\w)-(\d+)-(\d+)$/, "$1/$3"), g.qa.toLowerCase(), usd.format(amt));
}
console.log("Total:", usd.format(total), "| PKR:", new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(total * 280));
const due = new Date(Date.UTC(2026, 8, 15)); due.setUTCDate(due.getUTCDate() + 30);
console.log("Due:", due.toISOString().slice(0, 10), "| Day:", ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][due.getUTCDay()]);
```

### Quiz

1. What does `new Date(2026, 0, 1)` represent?
- [x] 1 January 2026
- [ ] 1 February 2026
- [ ] 0 January 2026
> Months are zero-based: 0 is January.

2. Which flag is required for `matchAll`?
- [ ] i
- [x] g
- [ ] m
> `matchAll` throws a TypeError if the regex lacks the global flag.

3. What does `"a1b22".match(/\d+/g)` return?
- [x] ["1", "22"]
- [ ] ["1"]
- [ ] "1"
> With `g`, `match` returns all matched substrings.

4. Which is the right tool to display 1437.5 as "$1,437.50"?
- [ ] `toFixed(2)` plus string concatenation
- [x] `Intl.NumberFormat` with `style: "currency"`
- [ ] `JSON.stringify`
> `Intl.NumberFormat` handles grouping, symbols and locale rules.

### Exercises

1. **Slugify** — Turn `"Employee Handbook (Rev. 3)!"` into `"employee-handbook-rev-3"`.
<details><summary>Solution</summary>

```js
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
console.log(slug("Employee Handbook (Rev. 3)!"));
```

</details>

2. **Business days** — Add 5 working days (skip Saturday and Sunday) to 2026-09-15.
<details><summary>Solution</summary>

```js
function addBusinessDays(date, n) {
  const d = new Date(date);
  while (n > 0) { d.setUTCDate(d.getUTCDate() + 1); if (d.getUTCDay() % 6 !== 0) n--; }
  return d;
}
console.log(addBusinessDays(new Date("2026-09-15"), 5).toISOString().slice(0, 10)); // 2026-09-22
```

</details>

3. **Extract amounts** — From `"Fees: $150.00, $2,300.50 and $75"` produce the numeric total.
<details><summary>Solution</summary>

```js
const s = "Fees: $150.00, $2,300.50 and $75";
const total = [...s.matchAll(/\$([\d,]+(?:\.\d+)?)/g)].reduce((t, m) => t + Number(m[1].replace(/,/g, "")), 0);
console.log(total); // 2525.5
```

</details>

### Interview Questions

**Q: What are the main pitfalls of the JavaScript Date object?**
Months are zero-indexed while days are one-indexed; date-only ISO strings parse as UTC but date-time strings without a zone parse as local time; non-ISO strings like "09/15/2026" parse inconsistently across engines; `Date` objects are mutable so setters change shared references; and there is no built-in support for time zones beyond the local one and UTC except through `Intl`. Daylight-saving transitions make "add 24 hours" differ from "add one day". The Temporal proposal addresses all of these with immutable, zone-aware types, and until it ships broadly I use `Intl.DateTimeFormat` with an explicit `timeZone` for display and ISO strings for storage.

**Q: When would you avoid a regular expression?**
When the input has real structure that a parser already handles: HTML (use the DOM), JSON (`JSON.parse`), CSV with quoted fields (a CSV library), URLs (`new URL()`). Regexes also fail for validation that has external rules, like "is this a deliverable email address", where a simple shape check plus a confirmation email beats a 400-character pattern. And I avoid regexes with nested quantifiers on untrusted input because of catastrophic backtracking, which can hang a page; a linear-time scan or the `v` flag's restrictions are safer.

**Q: How do you format currency and numbers for different locales?**
`Intl.NumberFormat(locale, { style: "currency", currency })` handles the symbol, grouping separators, decimal marks and digit counts for each locale, so the same value renders as "$1,437.50" for en-US and "1.437,50 $" for de-DE. I create the formatter once, store it, and call `format` per value because construction is comparatively slow. For accounting output, `currencySign: "accounting"` gives parentheses for negatives, and `notation: "compact"` gives "1.4K" for dashboards. Rounding for display must never replace exact math; I keep the underlying values in cents.

# LEVEL: Expert

## Event loop and microtasks

JavaScript executes on one thread, yet a page can download a rate matrix, animate a spinner and respond to clicks at the same time. The mechanism that makes this work is the **event loop**, and the ordering rules it enforces are the single most common senior-level interview topic.

### The pieces

- **Call stack**: where synchronous code runs. One function frame at a time; when the stack is empty the engine is idle.
- **Web APIs / host environment**: timers, `fetch`, DOM events, `FileReader` run outside the engine, in the browser (or libuv in Node), and produce callbacks when done.
- **Task queue** (macrotasks): callbacks from `setTimeout`, `setInterval`, I/O, UI events, `MessageChannel`. One task is taken per loop iteration.
- **Microtask queue**: promise reactions (`then`/`catch`/`finally`, the continuation after `await`), `queueMicrotask`, `MutationObserver`. Drained **completely** after every task and after every microtask that enqueues more.
- **Rendering**: between tasks, the browser may run `requestAnimationFrame` callbacks, style, layout and paint, about every 16.7 ms at 60 Hz.

### The ordering rule

After the current script (a task) finishes, the engine runs **all** microtasks, then renders if needed, then picks the next task.

```js
console.log("1 sync");
setTimeout(() => console.log("5 timeout"), 0);
Promise.resolve().then(() => console.log("3 microtask"));
queueMicrotask(() => console.log("4 microtask"));
console.log("2 sync");
// Output order: 1, 2, 3, 4, 5
```

The timeout has a delay of 0 but still waits for the current task and all microtasks. Browsers also clamp nested timeouts to at least 4 ms after five levels, and background tabs throttle them to once per second.

### async/await desugared

```js
async function run() {
  console.log("a");
  await null;                 // hands control back; the rest is queued as a microtask
  console.log("c");
}
run();
console.log("b");
// a, b, c
```

Everything before the first `await` runs synchronously. Each `await` schedules the continuation as a microtask, so `await` never yields to a timer or a render; it only yields to other microtasks. That is why a loop that only awaits already-resolved promises can still starve rendering.

### Microtask starvation

A microtask that enqueues another microtask forever blocks rendering and timers, because the queue never empties:

```js
function loop() { Promise.resolve().then(loop); }   // freezes the tab
```

Long synchronous work has the same effect. To yield to the browser, use `await new Promise(r => setTimeout(r, 0))` between chunks, or `scheduler.yield()` in browsers that support it. This matters when a single-file tool parses a 50 MB CSV: process 5,000 rows, yield, update a progress bar, repeat.

### Timers are not precise

`setTimeout(fn, 100)` means "not before 100 ms", never "exactly at". If a task is running when the timer fires, the callback waits. For animation use `requestAnimationFrame`, which runs right before paint and pauses in hidden tabs. For work after paint, chain `requestAnimationFrame` then `setTimeout(0)`, or use `requestIdleCallback` for low-priority work.

### Node differences

Node's loop has phases (timers, pending callbacks, poll, check, close). `setImmediate` runs in the check phase after I/O; `process.nextTick` runs before promise microtasks and is even higher priority. The Node.js course goes into this; the browser model above is what interviewers ask most.

### Classic interview puzzle

```js
setTimeout(() => console.log("timeout 1"), 0);
Promise.resolve().then(() => { console.log("p1"); setTimeout(() => console.log("timeout 2"), 0); })
  .then(() => console.log("p2"));
(async () => { console.log("async start"); await 0; console.log("async after await"); })();
console.log("script end");
```

Output: `async start`, `script end`, `p1`, `async after await`, `p2`, `timeout 1`, `timeout 2`. Trace it: synchronous logs first; then microtasks in enqueue order (`p1` was queued before the async continuation, and `p2` is queued only when `p1`'s `then` returns); then the two tasks in creation order.

> **Interview note:** The strongest answers draw the diagram (stack, task queue, microtask queue), state the rule "drain all microtasks before the next task", then walk a puzzle out loud. Mentioning render timing and starvation separates senior from mid-level.

### Try It Yourself

```js
const out = [];
const log = s => { out.push(s); console.log(s); };
log("1 script start");
setTimeout(() => log("timeout A"), 0);
setTimeout(() => { log("timeout B"); Promise.resolve().then(() => log("microtask inside timeout B")); }, 0);
Promise.resolve().then(() => log("micro 1")).then(() => log("micro 1 -> then"));
queueMicrotask(() => log("micro 2"));
(async () => { log("async before await"); await null; log("async after await"); await null; log("async after 2nd await"); })();
log("2 script end");
setTimeout(() => {
  console.log("\nExpected order check:");
  const expected = ["1 script start", "async before await", "2 script end", "micro 1", "micro 2", "async after await", "micro 1 -> then", "async after 2nd await", "timeout A", "timeout B", "microtask inside timeout B"];
  console.log(JSON.stringify(out) === JSON.stringify(expected) ? "matches the event-loop model" : "differs: " + out.join(" | "));
}, 10);
```

### Quiz

1. In what order do these run: a resolved promise's `then`, a `setTimeout(fn, 0)`, and the remaining synchronous code?
- [x] synchronous code, then the promise callback, then the timeout
- [ ] synchronous code, then the timeout, then the promise callback
- [ ] the promise callback first
> Microtasks drain after the current task; the timeout is a later task.

2. What does `await` schedule the rest of the function as?
- [ ] A macrotask
- [x] A microtask
- [ ] A render callback
> The continuation after `await` is a promise reaction, which lives in the microtask queue.

3. Which API runs a callback right before the browser paints?
- [ ] setTimeout
- [x] requestAnimationFrame
- [ ] queueMicrotask
> `requestAnimationFrame` aligns with the display refresh and pauses in hidden tabs.

4. What happens if microtasks keep enqueueing new microtasks?
- [ ] The browser interleaves them with timers
- [x] Rendering and timers are starved until the queue empties
- [ ] They are dropped after 1000
> The microtask queue must drain fully before the loop continues.

### Exercises

1. **Predict the output** — Without running it, order the logs of: `setTimeout(()=>log("T"))`, `Promise.resolve().then(()=>log("P"))`, `log("S")`. Then verify.
<details><summary>Solution</summary>

```js
setTimeout(() => console.log("T"));
Promise.resolve().then(() => console.log("P"));
console.log("S");
// S, P, T
```

</details>

2. **Chunked processing** — Process an array of 100,000 numbers in chunks of 10,000, yielding to the event loop between chunks and logging progress.
<details><summary>Solution</summary>

```js
async function processAll(items, chunk = 10000) {
  let sum = 0;
  for (let i = 0; i < items.length; i += chunk) {
    for (let j = i; j < Math.min(i + chunk, items.length); j++) sum += items[j];
    console.log(`progress ${Math.min(i + chunk, items.length)}/${items.length}`);
    await new Promise(r => setTimeout(r, 0));
  }
  return sum;
}
processAll(Array.from({ length: 100000 }, (_, i) => i)).then(s => console.log("sum", s));
```

</details>

3. **Microtask vs task** — Write code proving that a microtask queued inside a timeout runs before the next timeout.
<details><summary>Solution</summary>

```js
setTimeout(() => { console.log("t1"); Promise.resolve().then(() => console.log("m in t1")); }, 0);
setTimeout(() => console.log("t2"), 0);
// t1, m in t1, t2
```

</details>

### Interview Questions

**Q: Explain the JavaScript event loop.**
The engine runs one call stack. Asynchronous APIs provided by the host (timers, network, DOM events) do their work outside the stack and enqueue callbacks when finished. The event loop repeatedly takes one task from the task queue, runs it to completion, then drains the entire microtask queue (promise reactions, `queueMicrotask`), then lets the browser render if a frame is due, and repeats. Because a task runs to completion, long synchronous work freezes the UI; because microtasks drain fully, promise chains run before any timer or paint. That model explains `setTimeout(fn, 0)` running after `Promise.resolve().then(fn)` and why `await` in a tight loop does not let the page repaint.

**Q: What is the difference between microtasks and macrotasks and why does it matter?**
Macrotasks (tasks) come from timers, I/O and events, and only one runs per loop iteration with rendering allowed in between. Microtasks come from promises and `queueMicrotask`, and all of them, including ones enqueued while draining, run before the loop moves on. It matters for ordering (promise callbacks always beat timers), for consistency (a promise-based state update is guaranteed to finish before the next event handler), and for performance (a runaway microtask chain blocks rendering entirely, whereas timers interleave). When I need to let the page breathe between chunks of work I explicitly use a macrotask such as `setTimeout(0)`.

**Q: Why might setTimeout(fn, 0) not run immediately, and what alternatives exist?**
Because it enqueues a task that waits for the current task, all microtasks, and possibly a render, plus browsers clamp nested timers to at least 4 ms and throttle background tabs to one per second. If I want "as soon as possible but after the current work" I use `queueMicrotask` or a resolved promise; if I want "before the next paint" I use `requestAnimationFrame`; if I want "when idle" I use `requestIdleCallback`; and for "yield but keep priority" the newer `scheduler.postTask` and `scheduler.yield` exist in Chromium. Choosing the right queue is a large part of making a heavy single-page tool feel responsive.

## Memory and performance

JavaScript manages memory for you, but "automatic" is not "free". A single-file tool that parses a 50 MB CSV, keeps every parsed row in a closure and re-renders a 10,000-row table on each keystroke will crawl. This chapter shows how memory is reclaimed, how it leaks, and how to measure before optimizing.

### Garbage collection

The engine allocates objects on the heap and periodically runs a **mark-and-sweep** collector: starting from roots (the global object, the current call stack, active closures), it marks everything reachable and frees the rest. V8 uses a generational design: a small "young" space collected often (scavenger) and an "old" space collected less often with incremental, concurrent marking so pauses stay short.

The practical rule: memory is freed when nothing reachable references it. Leaks are always **unintended references**.

### The five classic leaks

| Leak | Example | Fix |
|---|---|---|
| Accidental globals | `total = 0` without `let` in sloppy mode | `"use strict"`, modules |
| Forgotten timers | `setInterval(poll, 1000)` never cleared | `clearInterval` on teardown |
| Detached DOM nodes | removing a table but keeping `rows[]` in a variable | drop the references, avoid caching nodes |
| Listeners on long-lived objects | `window.addEventListener("resize", handler)` from a component that is destroyed | `removeEventListener`, or `{ signal }` with an `AbortController` |
| Closures holding large data | an event handler that captured a 50 MB parsed file | capture only what is needed; null out after use |

```js
const controller = new AbortController();
window.addEventListener("resize", onResize, { signal: controller.signal });
// later, on teardown:
controller.abort();     // removes every listener registered with that signal
```

### Weak references

`WeakMap` and `WeakSet` hold keys weakly: if the key object becomes unreachable elsewhere, the entry disappears. That makes them ideal for caching data **about** DOM nodes or objects you do not own:

```js
const metadata = new WeakMap();
metadata.set(someElement, { parsedAt: Date.now() });
// when someElement is removed and dropped, the entry is collected automatically
```

`WeakRef` and `FinalizationRegistry` (ES2021) offer finer control but are rarely the right tool in application code.

### Measuring before optimizing

```js
const t0 = performance.now();
const result = heavyWork();
console.log(`heavyWork took ${(performance.now() - t0).toFixed(1)} ms`);

console.time("parse"); parseCsv(text); console.timeEnd("parse");
performance.mark("start"); /* ... */ performance.mark("end");
performance.measure("render", "start", "end");
```

In DevTools: the **Performance** tab records a flame chart of tasks, layout and paint; the **Memory** tab takes heap snapshots (compare two snapshots to find growing retained objects, and filter by "Detached" to catch detached DOM trees). `performance.memory` in Chromium reports heap size for quick checks.

### Algorithmic wins beat micro-optimizations

```js
const ids = Array.from({ length: 100000 }, (_, i) => `F-${i}`);
const lookup = new Set(ids);
ids.includes("F-99999");    // O(n): scans the array
lookup.has("F-99999");      // O(1): hash lookup
```

Checking 10,000 rows against a 100,000-entry list with `includes` is a billion comparisons; with a `Set` it is 10,000. The same applies to `find` in a loop (build a `Map` by key first), string concatenation of huge outputs (collect and `join`), and repeated `querySelector` inside a loop (query once).

### Rendering performance

- **Layout thrashing**: alternating reads (`offsetHeight`) and writes (`style.width`) forces synchronous layout each time. Batch reads, then writes.
- **Debounce** input handlers (`wait until typing pauses`) and **throttle** scroll handlers (`at most every 100 ms`).
- Build large DOM updates in a `DocumentFragment` and insert once.
- Avoid `innerHTML +=` in loops; it re-parses the whole string each time.

```js
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
input.addEventListener("input", debounce(recalculate, 250));
```

### Engine-friendly code

V8 optimizes functions whose objects keep a consistent **shape** (same properties added in the same order) and whose arrays hold one element kind. Adding properties conditionally, deleting properties, or mixing numbers and strings in one array causes de-optimization. Typed arrays (`Float64Array`) give compact, fast numeric storage for a 50,000-cell rate matrix.

> **Warning:** Do not optimize from intuition. A `for` loop versus `forEach` difference is nanoseconds; a `Set` versus `includes` difference is seconds. Profile first, then fix the top item.

### Try It Yourself

```js
const N = 60000;
const ids = Array.from({ length: N }, (_, i) => `F-${String(i).padStart(6, "0")}`);
const probes = Array.from({ length: 2000 }, (_, i) => `F-${String(N - 1 - i * 7).padStart(6, "0")}`);

let t = performance.now(), hits = 0;
for (const p of probes) if (ids.includes(p)) hits++;
console.log("Array.includes:", hits, "hits in", (performance.now() - t).toFixed(1), "ms");

t = performance.now(); const set = new Set(ids); hits = 0;
for (const p of probes) if (set.has(p)) hits++;
console.log("Set.has (incl. build):", hits, "hits in", (performance.now() - t).toFixed(1), "ms");

t = performance.now(); let s = "";
for (let i = 0; i < 20000; i++) s += `${ids[i]},${i % 50},pass\n`;
console.log("String +=:", (performance.now() - t).toFixed(1), "ms", s.length, "chars");

t = performance.now(); const parts = [];
for (let i = 0; i < 20000; i++) parts.push(`${ids[i]},${i % 50},pass`);
const joined = parts.join("\n") + "\n";
console.log("Array join:", (performance.now() - t).toFixed(1), "ms", joined.length, "chars");

const cache = new WeakMap(); let key = { name: "big buffer" };
cache.set(key, new Float64Array(1_000_000));
console.log("WeakMap has key:", cache.has(key)); key = null;
console.log("Key dropped; the 8 MB buffer is now collectable when GC runs.");
```

### Quiz

1. When does the garbage collector free an object?
- [ ] When you set it to null
- [x] When nothing reachable references it anymore
- [ ] At the end of every function
> Setting to null only helps if it removes the last reference.

2. Which structure lets cached data disappear with its key object?
- [ ] Map
- [x] WeakMap
- [ ] Set
> `WeakMap` holds keys weakly, so entries vanish when the key is otherwise unreachable.

3. What is layout thrashing?
- [x] Alternating DOM reads and writes that force repeated synchronous layout
- [ ] Too many event listeners
- [ ] Memory fragmentation
> Reading `offsetHeight` after a style write forces the browser to recompute layout each time.

4. Which change gives the largest speedup when checking membership in a 100,000-item list?
- [ ] Replacing forEach with a for loop
- [x] Replacing `Array.includes` with `Set.has`
- [ ] Using `var` instead of `let`
> Algorithmic complexity (O(n) to O(1)) dwarfs micro-optimizations.

### Exercises

1. **Throttle** — Write `throttle(fn, ms)` that calls `fn` at most once per `ms`.
<details><summary>Solution</summary>

```js
const throttle = (fn, ms) => { let last = 0; return (...a) => { const now = Date.now(); if (now - last >= ms) { last = now; fn(...a); } }; };
const log = throttle(x => console.log("run", x), 100);
for (let i = 0; i < 5; i++) log(i); // only "run 0"
```

</details>

2. **Index by key** — Given 50,000 rows with `file` keys and 5,000 lookups, replace `rows.find` with a Map and time both.
<details><summary>Solution</summary>

```js
const rows = Array.from({ length: 50000 }, (_, i) => ({ file: "F" + i, pages: i % 100 }));
const keys = Array.from({ length: 5000 }, (_, i) => "F" + (i * 9));
let t = performance.now(); keys.forEach(k => rows.find(r => r.file === k)); console.log("find", (performance.now() - t).toFixed(1), "ms");
t = performance.now(); const byFile = new Map(rows.map(r => [r.file, r])); keys.forEach(k => byFile.get(k)); console.log("map", (performance.now() - t).toFixed(1), "ms");
```

</details>

3. **Leak hunt** — Explain why this leaks and fix it: `function start() { const data = new Array(1e6).fill(0); setInterval(() => console.log(data.length), 1000); }`.
<details><summary>Solution</summary>

```js
// The interval closure references `data` forever and nobody clears the interval.
function start() {
  const data = new Array(1e6).fill(0);
  const len = data.length;                 // capture only what is needed
  const id = setInterval(() => console.log(len), 1000);
  return () => clearInterval(id);          // give the caller a way to stop it
}
const stop = start(); setTimeout(stop, 3500);
```

</details>

### Interview Questions

**Q: How does garbage collection work in JavaScript and what causes memory leaks?**
Engines use tracing collectors: V8 marks every object reachable from roots (globals, the stack, closures, active timers and listeners) and sweeps the rest, using a generational scheme so short-lived objects are reclaimed cheaply. Leaks are objects that remain reachable by mistake: accidental globals, uncleared `setInterval`s, listeners on `window` or `document` from components that no longer exist, detached DOM nodes kept in arrays, and closures that captured large data. I find them by taking two heap snapshots in DevTools after repeating an action and comparing retained size by constructor, then fixing the reference chain the snapshot shows.

**Q: What is the difference between debounce and throttle?**
Debounce delays a call until activity stops for a given interval, so a search box fires once after the user pauses typing; throttle guarantees at most one call per interval while activity continues, so a scroll handler runs every 100 ms regardless of how many scroll events fire. Debounce suits "final value" work such as validation or auto-save; throttle suits continuous feedback such as updating a position indicator. Both are closures over a timer or timestamp, and both need a way to cancel on teardown.

**Q: How would you speed up a slow page: what do you measure and in what order?**
First reproduce and measure: record the Performance tab to see whether time goes to scripting, layout, paint or network, and check the Memory tab if it slows down over time. Then fix the largest bucket: algorithmic issues (O(n²) lookups, repeated DOM queries) usually dominate scripting; layout thrashing and huge DOM trees dominate rendering; oversized bundles and uncompressed assets dominate loading. I apply one change at a time and re-measure, because intuition about JavaScript performance is wrong more often than right, and I keep a before/after number for the write-up.

**Q: What are hidden classes or object shapes and why should I care?**
V8 assigns each object a hidden class describing its property layout; objects created with the same properties in the same order share a class, and functions that always see one shape get fast inline caches. Adding properties in different orders, adding them conditionally, or deleting them creates many shapes and makes the code polymorphic or megamorphic, which falls back to slow dictionary lookups. The fix is to initialize every property in the constructor or literal, use `undefined` rather than `delete`, and keep arrays homogeneous. It rarely matters for UI code, but for a hot loop over 100,000 rate rows it is the difference between 20 ms and 200 ms.

## Functional patterns and immutability

Functional programming in JavaScript is not about avoiding classes; it is about writing small **pure functions**, treating data as **immutable**, and building larger behaviour by **composing** functions. Code written this way is easier to test, to reason about and to run in parallel across Web Workers.

### Pure functions and side effects

A pure function returns the same output for the same input and touches nothing outside itself. Impure code (DOM writes, network, `Date.now()`, `Math.random()`, mutation of arguments) should be pushed to the edges.

```js
// impure: mutates its argument
function applyDiscountBad(order) { order.total = order.total * 0.9; return order; }

// pure: returns a new object
const applyDiscount = order => ({ ...order, total: order.total * 0.9 });
```

The pure version can be called twice safely, memoized, and unit-tested with no setup.

### Immutability in practice

JavaScript has no immutable data structures built in, but conventions and a few helpers get you most of the way.

```js
const rates = Object.freeze({ TX: 5.75, FL: 5.25 });
rates.TX = 6;                    // silently ignored (throws in strict mode)
const next = { ...rates, NY: 6.1 };   // updates produce new objects

const files = ["b.pdf", "a.pdf"];
const sorted = files.toSorted();          // ES2023, copy
const replaced = files.with(0, "c.pdf");  // ES2023, copy with one element changed
const without = files.filter(f => f !== "a.pdf");
```

`Object.freeze` is shallow; nested objects stay mutable. For deep immutability, freeze recursively or use a library such as Immer, which lets you write mutable-looking code (`draft.total = 5`) and produces a new immutable result.

Updating nested state immutably by hand looks like this:

```js
const state = { report: { week: 37, rows: [{ file: "TX-1", qa: "pass" }] } };
const updated = {
  ...state,
  report: {
    ...state.report,
    rows: state.report.rows.map(r => r.file === "TX-1" ? { ...r, qa: "fail" } : r),
  },
};
console.log(state.report.rows[0].qa, updated.report.rows[0].qa);   // pass fail
```

Because unchanged branches are shared, a UI can detect changes with a cheap `===` comparison instead of deep equality; that is the idea behind React state and Redux reducers.

### Higher-order functions and composition

```js
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

const trim = s => s.trim();
const lower = s => s.toLowerCase();
const slug = s => s.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const slugify = pipe(trim, lower, slug);
console.log(slugify("  Employee Handbook (Rev 3) "));   // "employee-handbook-rev-3"
```

`pipe` reads left to right, `compose` right to left (mathematical order). Each step is a tiny, testable function; the pipeline documents the transformation.

### Currying and partial application

Currying turns `f(a, b, c)` into `f(a)(b)(c)`, so you can fix arguments one at a time:

```js
const curry = fn => function c(...args) { return args.length >= fn.length ? fn(...args) : (...more) => c(...args, ...more); };
const premium = curry((rate, minimum, amount) => Math.max(minimum, (amount / 1000) * rate));
const texas = premium(5.75, 100);
console.log([100000, 250000].map(texas));   // [575, 1437.5]
```

Partial application with `bind` does one step: `const texas = premium.bind(null, 5.75, 100)`.

### Data pipelines with array methods

```js
const rows = [
  { file: "TX-1", state: "TX", pages: 42, qa: "pass" },
  { file: "FL-1", state: "FL", pages: 18, qa: "fail" },
  { file: "TX-2", state: "TX", pages: 65, qa: "pass" },
];
const summary = rows
  .filter(r => r.qa === "pass")
  .map(r => ({ state: r.state, pages: r.pages }))
  .reduce((acc, r) => ({ ...acc, [r.state]: (acc[r.state] ?? 0) + r.pages }), {});
console.log(summary);   // { TX: 107 }
```

Each stage is declarative: what to keep, what shape, how to fold. For large arrays, note that each stage allocates a new array; a single `reduce` or a `for...of` loop is faster when profiling says it matters, and iterator helpers (`values().filter().map()`, ES2025) process lazily without intermediate arrays.

### Generators and lazy sequences

```js
function* pages(total, size) {
  for (let start = 1; start <= total; start += size) yield [start, Math.min(start + size - 1, total)];
}
for (const [a, b] of pages(767, 250)) console.log(`print ${a}-${b}`);
```

A generator produces values on demand, which suits paging through a 767-page handbook or streaming rows without building the whole list.

### When not to go functional

Deep immutable updates of large arrays copy a lot; a loop that mutates a local array it just created is perfectly fine. Tiny functions everywhere can hurt readability. The goal is predictable code: pure by default, mutation contained and local.

> **Tip:** Name the pipeline stages. `rows.filter(isPassed).map(toStateAndPages).reduce(sumByState, {})` reads as documentation; three inline arrows do not.

### Try It Yourself

```js
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
const rows = Object.freeze([
  { file: "TX-2026-00120", state: "TX", pages: 42, qa: "pass", fee: 168 },
  { file: "FL-2026-00033", state: "FL", pages: 18, qa: "fail", fee: 72 },
  { file: "TX-2026-00121", state: "TX", pages: 65, qa: "pass", fee: 260 },
  { file: "NY-2026-00007", state: "NY", pages: 9,  qa: "pass", fee: 36 },
]);
const isPassed = r => r.qa === "pass";
const groupBy = key => list => list.reduce((acc, r) => ({ ...acc, [r[key]]: [...(acc[r[key]] ?? []), r] }), {});
const sumBy = field => list => list.reduce((s, r) => s + r[field], 0);
const mapValues = fn => obj => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v)]));

const feesByState = pipe(list => list.filter(isPassed), groupBy("state"), mapValues(sumBy("fee")));
console.log("Fees by state (passed only):", feesByState(rows));

const markFailed = file => list => list.map(r => r.file === file ? { ...r, qa: "fail" } : r);
const after = markFailed("NY-2026-00007")(rows);
console.log("Original untouched:", rows[3].qa, "| New:", after[3].qa, "| Shared unchanged row:", rows[0] === after[0]);
try { rows.push({}); } catch (e) { console.log("Frozen array:", e.constructor.name); }

const curry = fn => function c(...a) { return a.length >= fn.length ? fn(...a) : (...m) => c(...a, ...m); };
const premium = curry((rate, min, amount) => Math.max(min, amount / 1000 * rate));
console.log("Curried TX rater:", [100000, 250000, 5000].map(premium(5.75)(100)));
function* chunks(list, n) { for (let i = 0; i < list.length; i += n) yield list.slice(i, i + n); }
console.log("Chunks:", [...chunks(rows.map(r => r.file), 3)]);
```

### Quiz

1. Which of these is a pure function?
- [ ] `() => Date.now()`
- [x] `(a, b) => a + b`
- [ ] `arr => arr.push(1)`
> It depends only on its inputs and changes nothing outside.

2. What does `Object.freeze` do to nested objects?
- [ ] Freezes them too
- [x] Nothing; freezing is shallow
- [ ] Deletes them
> Only the top-level object's own properties become read-only.

3. `pipe(f, g)(x)` equals:
- [x] `g(f(x))`
- [ ] `f(g(x))`
- [ ] `f(x) + g(x)`
> `pipe` applies functions left to right.

4. Which ES2023 method sorts without mutating?
- [ ] sort
- [x] toSorted
- [ ] sortCopy
> `toSorted`, `toReversed`, `toSpliced` and `with` return copies.

### Exercises

1. **Deep freeze** — Write `deepFreeze(obj)` that freezes an object and everything nested inside it.
<details><summary>Solution</summary>

```js
function deepFreeze(o) {
  for (const v of Object.values(o)) if (v && typeof v === "object" && !Object.isFrozen(v)) deepFreeze(v);
  return Object.freeze(o);
}
const cfg = deepFreeze({ fonts: { body: "Calibri" } });
console.log(Object.isFrozen(cfg.fonts)); // true
```

</details>

2. **Immutable update by path** — Write `setIn(obj, ["a", "b", "c"], value)` returning a new object with the nested value changed and other branches shared.
<details><summary>Solution</summary>

```js
const setIn = (obj, [k, ...rest], value) =>
  rest.length === 0 ? { ...obj, [k]: value } : { ...obj, [k]: setIn(obj?.[k] ?? {}, rest, value) };
const s = { a: { b: { c: 1 }, keep: {} } };
const t = setIn(s, ["a", "b", "c"], 2);
console.log(t.a.b.c, s.a.b.c, s.a.keep === t.a.keep); // 2 1 true
```

</details>

3. **Compose validators** — Given `required`, `minLen(3)` and `isCode` (two uppercase letters) each returning an error string or null, write `validateAll(...rules)` returning the first error.
<details><summary>Solution</summary>

```js
const required = v => v ? null : "required";
const minLen = n => v => v.length >= n ? null : `min ${n} chars`;
const isCode = v => /^[A-Z]{2}$/.test(v) ? null : "two uppercase letters";
const validateAll = (...rules) => v => rules.reduce((err, r) => err ?? r(v), null);
console.log(validateAll(required, isCode)("tx"), validateAll(required, minLen(3))("SOP-12"));
```

</details>

### Interview Questions

**Q: What is a pure function and why does it matter?**
A pure function's result depends only on its arguments and it has no observable side effects: no mutation of inputs or globals, no I/O, no reading clocks or randomness. Purity makes functions trivially testable (call and assert), safely memoizable, parallelizable across workers, and composable without ordering concerns. In a rate calculator I keep the premium math pure and isolated from DOM code so the same function runs in the browser tool, in a Node batch script and in unit tests without modification.

**Q: How do you achieve immutability in JavaScript, and what does it cost?**
By convention: never mutate, always return new values using spread, `map`/`filter`, `toSorted` and friends, plus `Object.freeze` in development to catch accidental mutation. Libraries like Immer or Immutable.js make deep updates ergonomic or use structural sharing to keep copies cheap. The cost is allocation: copying a 100,000-element array on every update is expensive, so I mutate locally inside a function that owns the data and expose immutable results at boundaries. The benefit is cheap change detection by reference and freedom from "who changed this object" bugs.

**Q: Explain currying versus partial application.**
Partial application fixes some arguments of a function and returns a function taking the rest, in one step: `premium.bind(null, 5.75)`. Currying transforms an n-argument function into a chain of n single-argument functions, so arguments can be supplied one at a time in any grouping. Both create specialized functions from general ones, which is useful for building pipelines and configuration-first APIs like `makeRater(rate)(amount)`. In practice JavaScript code uses partial application and closures far more than strict currying, and I mention that lodash's `curry` handles the arity bookkeeping when it is genuinely needed.

## Browser APIs and building a single-file tool

Modern browsers ship a rich standard library that lets a single HTML file read files, keep settings, do heavy work off the main thread and hand a generated spreadsheet back to the user. This chapter tours the APIs and then assembles them into a title-insurance **rate calculator with Excel export**, the kind of tool a production team can open from a shared drive with no server.

### Blob, File and object URLs

A `Blob` is an immutable chunk of bytes with a MIME type. A `File` is a Blob with a name. Anything you build in memory can become a download:

```js
const csv = "file,pages,premium\nTX-2026-00120,42,1437.50\n";
const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });   // BOM so Excel reads UTF-8
const url = URL.createObjectURL(blob);
const a = Object.assign(document.createElement("a"), { href: url, download: "premiums.csv" });
a.click();
URL.revokeObjectURL(url);       // release the memory
```

`docx.Packer.toBlob(doc)` and pptxgenjs produce Blobs the same way, and the same five lines save them.

### Reading user files

```js
document.querySelector("#matrix").addEventListener("change", async e => {
  const file = e.target.files[0];           // a File
  console.log(file.name, file.size, file.type, new Date(file.lastModified));
  const text = await file.text();           // also: file.arrayBuffer(), file.stream()
  const rows = text.trim().split(/\r?\n/).map(l => l.split(","));
});
```

`file.text()` replaced the older `FileReader` callback API. Drag-and-drop delivers files through `event.dataTransfer.files`.

### localStorage and sessionStorage

Key/value string storage per origin, about 5 MB, synchronous. Store settings and drafts, never secrets.

```js
const KEY = "ratecalc.settings";
const save = s => localStorage.setItem(KEY, JSON.stringify(s));
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) ?? {}; } catch { return {}; } };
```

Wrap access in `try/catch`: private windows and blocked storage throw. For structured or large data (parsed matrices, cached files), use **IndexedDB**, typically through a tiny wrapper like `idb`.

### Web Workers

Parsing a 200,000-row matrix on the main thread freezes the UI. A worker runs a script on another thread and communicates by messages:

```js
// worker.js
self.onmessage = ({ data }) => {
  const rows = data.text.split("\n").map(l => l.split(","));
  self.postMessage({ count: rows.length });
};
// main.js
const worker = new Worker("worker.js");
worker.postMessage({ text });
worker.onmessage = e => console.log("rows:", e.data.count);
```

For a single-file tool, inline the worker code in a `<script type="text/js-worker">` block and create it from a Blob URL: `new Worker(URL.createObjectURL(new Blob([code], { type: "text/javascript" })))`. Messages are copied via structured clone; pass `ArrayBuffer`s as transferables to avoid copying.

### Other APIs worth knowing

| API | Use |
|---|---|
| `navigator.clipboard.writeText` | copy a result table for pasting into Excel |
| `window.print()` with `@media print` CSS | print-ready output without PDF libraries |
| `Notification`, `Intl`, `crypto.randomUUID()` | alerts, formatting, unique IDs |
| `history.pushState`, `URLSearchParams` | shareable links: `?state=TX&amount=250000` |
| `fetch` + `Cache API` + service worker | offline-capable tool |

### Assembling the rate calculator

The structure of the single file:

1. **HTML**: a form (state select, amount input, policy type), a results table, Import and Export buttons.
2. **Data**: the rate matrix embedded as a JSON constant, or loaded from a CSV the user picks.
3. **Pure logic**: `lookupRate(matrix, state, amount)` finds the tier row where `amount` falls between `min` and `max`; `calculate(matrix, input)` returns `{ base, endorsements, total }`.
4. **UI layer**: event listeners read the form, call the logic, render rows with `createElement`.
5. **Persistence**: last inputs saved to `localStorage`.
6. **Export**: rows converted to CSV with proper quoting and downloaded via a Blob; a real `.xlsx` needs a library such as SheetJS (`XLSX.utils.json_to_sheet` and `XLSX.writeFile`) loaded from a CDN.

The core lookup with tiered rates:

```js
function lookupRate(tiers, amount) {
  const tier = tiers.find(t => amount >= t.min && amount <= t.max);
  if (!tier) throw new RangeError(`No tier for ${amount}`);
  return tier.base + Math.ceil(Math.max(0, amount - tier.min) / 1000) * tier.perThousand;
}
```

CSV quoting rule: wrap a field in double quotes if it contains a comma, quote or newline, and double any quotes inside. Without it, a client name like `Smith, John` shifts every column in Excel.

> **Warning:** `localStorage` is readable by any script on the same origin and persists until cleared. Store preferences and drafts there, never client PII or API keys.

### Try It Yourself

```js
const tiers = [
  { state: "TX", min: 0,      max: 100000, base: 832,  perThousand: 0 },
  { state: "TX", min: 100001, max: 1000000, base: 832, perThousand: 5.27 },
  { state: "FL", min: 0,      max: 100000, base: 575,  perThousand: 5.75 },
  { state: "FL", min: 100001, max: 1000000, base: 575, perThousand: 5.0 },
];
function lookupRate(state, amount) {
  const tier = tiers.find(t => t.state === state && amount >= t.min && amount <= t.max);
  if (!tier) throw new RangeError(`No ${state} tier for ${amount}`);
  return tier.base + Math.ceil(Math.max(0, amount - tier.min) / 1000) * tier.perThousand;
}
const orders = [["TX", 250000, "Smith, John"], ["FL", 95000, "Nadia \"NB\" Baig"], ["TX", 1000000, "Acme LLC"]];
const csvField = v => /[",\n]/.test(String(v)) ? `"${String(v).replaceAll('"', '""')}"` : String(v);
const rows = orders.map(([state, amount, client]) => ({ state, amount, client, premium: lookupRate(state, amount).toFixed(2) }));
const csv = "﻿" + [Object.keys(rows[0]).join(","), ...rows.map(r => Object.values(r).map(csvField).join(","))].join("\r\n");
console.log(csv);
const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
console.log("Blob size:", blob.size, "bytes | type:", blob.type);
if (typeof document !== "undefined" && typeof URL.createObjectURL === "function") {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: "premiums.csv" });
  a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  console.log("Download triggered: premiums.csv (open in Excel)");
}
try { localStorage.setItem("ratecalc.last", JSON.stringify(orders[0])); console.log("Saved:", localStorage.getItem("ratecalc.last")); }
catch (e) { console.log("localStorage unavailable here:", e.constructor.name); }
```

### Quiz

1. Why prepend `"﻿"` to a CSV before download?
- [x] So Excel detects UTF-8 and shows accented characters correctly
- [ ] To add a header row
- [ ] To compress the file
> The byte-order mark tells Excel the encoding; without it, non-ASCII text is garbled.

2. What must you do after a download from `URL.createObjectURL`?
- [ ] Nothing
- [x] Call `URL.revokeObjectURL` to release memory
- [ ] Delete the Blob
> Object URLs keep the Blob alive until revoked or the page unloads.

3. Where should heavy CSV parsing run to keep the UI responsive?
- [ ] In a setTimeout
- [x] In a Web Worker
- [ ] In localStorage
> Workers run on a separate thread; timers still run on the main thread.

4. What type does `localStorage.getItem` return?
- [x] string or null
- [ ] object
- [ ] number
> Storage holds strings only; use `JSON.parse`/`JSON.stringify` for objects.

### Exercises

1. **CSV parser** — Write `parseCsvLine(line)` that handles quoted fields with commas and doubled quotes.
<details><summary>Solution</summary>

```js
function parseCsvLine(line) {
  const out = []; let cur = "", q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
    else if (c === '"') q = true;
    else if (c === ",") { out.push(cur); cur = ""; }
    else cur += c;
  }
  out.push(cur); return out;
}
console.log(parseCsvLine('TX,250000,"Smith, John","He said ""hi"""'));
```

</details>

2. **Settings with fallback** — Write `loadSettings()` that returns saved settings merged over defaults and never throws.
<details><summary>Solution</summary>

```js
const DEFAULTS = { state: "TX", policy: "owner" };
function loadSettings() {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem("settings") ?? "{}") }; }
  catch { return { ...DEFAULTS }; }
}
console.log(loadSettings());
```

</details>

3. **Inline worker** — Create a worker from a string of code that doubles a number and logs the reply.
<details><summary>Solution</summary>

```js
const code = "self.onmessage = e => self.postMessage(e.data * 2);";
const w = new Worker(URL.createObjectURL(new Blob([code], { type: "text/javascript" })));
w.onmessage = e => console.log("worker says", e.data);
w.postMessage(21);
```

</details>

### Interview Questions

**Q: How would you let a user download a generated file from the browser without a server?**
Build the bytes in memory (a CSV string, or a Blob from docx's `Packer.toBlob` or pdf-lib's `save()`), wrap them in a `Blob` with the right MIME type, create an object URL with `URL.createObjectURL`, assign it to an `<a download="name.ext">` element, call `click()`, and revoke the URL afterwards. For very large files use the File System Access API (`showSaveFilePicker`) where supported so data streams to disk instead of living in memory. For CSV I add a UTF-8 BOM so Excel opens it correctly, and I quote fields containing commas, quotes or newlines.

**Q: What are the differences between localStorage, sessionStorage, cookies and IndexedDB?**
`localStorage` persists per origin until cleared, holds strings, about 5 MB, synchronous. `sessionStorage` is the same but scoped to one tab and cleared when it closes. Cookies are tiny (4 KB), sent with every HTTP request, and are the right place only for session identifiers, ideally `HttpOnly` so scripts cannot read them. IndexedDB is an asynchronous, transactional object store with far higher limits, suitable for cached matrices, parsed documents and offline data. None of them is safe for secrets, because any script on the origin can read the first three and IndexedDB.

**Q: When do you reach for a Web Worker and what are its limits?**
When CPU-bound work would block the main thread for more than a frame or two: parsing large CSV or JSON, running a heavy calculation across a rate matrix, generating a 700-page document with docx. Workers have no DOM access, communicate only by message passing with structured clone (or transfer of ArrayBuffers), and need their own script or a Blob URL when inlined. They add complexity, so for work under about 50 ms I stay on the main thread and yield between chunks instead. SharedArrayBuffer and Atomics enable true shared memory but require cross-origin isolation headers.

**Q: How do you make a single-file browser tool robust for non-technical colleagues?**
Validate inputs and show the error next to the field; never fail silently. Wrap storage and file APIs in try/catch and degrade gracefully when they are blocked. Embed the data and the libraries (or pin CDN versions with integrity hashes) so the tool works offline and does not change under people's feet. Keep the calculation pure and covered by a self-test that runs on load and shows a green check, so a broken update is obvious. And version the file name, because "which rate calculator are you using" is the first support question.

## JavaScript interview traps

Every JavaScript interview includes a round of "what does this print". The questions look like trivia, but each one tests a real rule: coercion, floating point, scope, `this`, the event loop. This chapter collects the traps, the output, and the one-sentence rule that explains it, so you can answer calmly and then say what you would do in real code.

### Coercion traps

| Expression | Output | Rule |
|---|---|---|
| `0.1 + 0.2 === 0.3` | `false` | IEEE 754 doubles; compare with a tolerance or work in cents |
| `typeof null` | `"object"` | historical bug, use `x === null` |
| `typeof NaN` | `"number"` | NaN is a numeric value; test with `Number.isNaN` |
| `NaN === NaN` | `false` | the only value not equal to itself; `Object.is(NaN, NaN)` is true |
| `[] + []` | `""` | arrays convert to strings via `join` |
| `[] + {}` | `"[object Object]"` | object to string |
| `[1, 2] + [3]` | `"1,23"` | both become strings |
| `"5" * "2"` | `10` | `*` converts to numbers |
| `"5" + 2 - 1` | `51` | `+` concatenates, then `-` converts "52" to 52 |
| `true + true` | `2` | booleans become 1 |
| `[] == false` | `true` | `[]` becomes `""`, then `0` |
| `null == 0` | `false` | null only loosely equals undefined |
| `null >= 0` | `true` | relational operators convert null to 0 |

### Number traps

```js
console.log(0.1 * 3);                    // 0.30000000000000004
console.log(9007199254740993);           // 9007199254740992 (beyond MAX_SAFE_INTEGER)
console.log(parseInt("08"));             // 8 (ES5+; older engines read octal)
console.log(parseInt("0x1F"));           // 31
console.log(["1", "2", "3"].map(parseInt)); // [1, NaN, NaN]: map passes the index as the radix
console.log(Math.max());                 // -Infinity
console.log((0.615).toFixed(2));         // "0.61" (binary rounding), not "0.62"
console.log(1 / 0, -1 / 0, 0 / 0);       // Infinity -Infinity NaN
```

The `map(parseInt)` trap is a favourite: `map` calls the callback with `(value, index, array)`, so `parseInt("2", 1)` and `parseInt("3", 2)` fail. Use `map(Number)` or `map(s => parseInt(s, 10))`.

### Scope, hoisting and this traps

```js
var a = 1;
function f() { console.log(a); var a = 2; }
f();                                     // undefined: the inner var is hoisted

const obj = { n: 1, get() { return this.n; }, arrow: () => this };
const g = obj.get;
console.log(obj.get(), typeof g === "function");   // 1 true, but g() alone loses this

for (var i = 0; i < 3; i++) setTimeout(() => console.log(i));   // 3 3 3
```

### Array and object traps

```js
console.log([10, 1, 2].sort());          // [1, 10, 2]: string sort
console.log(new Array(3));               // [ <3 empty items> ], not [3]
console.log(Array(3).map(() => 1));      // still empty: map skips holes
console.log(Array.from({ length: 3 }, () => 1));   // [1, 1, 1]
console.log([1, 2, 3].indexOf(NaN));     // -1; includes(NaN) is true
console.log({} === {});                  // false: different references
const k = {}; const m = { [k]: 1 }; console.log(Object.keys(m));   // ["[object Object]"]
console.log([..."hello"].reverse().join(""));      // "olleh" (strings have no reverse)
```

### Equality and copies

```js
const src = { deep: { x: 1 } };
const shallow = { ...src };
shallow.deep.x = 2;
console.log(src.deep.x);                 // 2: nested object shared
console.log(JSON.stringify({ d: new Date(0), u: undefined, f() {} }));   // {"d":"1970-01-01T00:00:00.000Z"}
```

### Async traps

```js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");                        // A D C B

async function x() { return 1; }
console.log(x());                        // Promise { 1 }, not 1

[1, 2, 3].forEach(async n => await n);   // forEach does not await
```

### Strings and misc

```js
console.log("b" + "a" + +"a" + "a");     // "baNaNa": +"a" is NaN
console.log("abc".length, "📄".length);   // 3 2 (UTF-16 code units)
console.log(typeof typeof 1);            // "string"
console.log(!!"false", !!"");            // true false
console.log(1 < 2 < 3, 3 > 2 > 1);       // true false: (3 > 2) is true, true > 1 is false
console.log(010);                        // 8 in sloppy mode (legacy octal); SyntaxError in strict
```

### How to answer in the room

1. State the output.
2. State the rule in one sentence.
3. Say what you would do in production: "I would never write this; I would use `===`, `Number.isNaN`, `toSorted` with a comparator, `let` in loops, and a linter that flags the rest."

Interviewers are testing whether you understand the mechanism, not whether you have memorized trivia. Explaining `[] == false` by walking the Abstract Equality steps (object to primitive `""`, then `""` to `0`, `false` to `0`) is worth more than a correct guess.

> **Interview note:** If you do not know an output, say so and reason out loud from the rules you do know. Bluffing a wrong answer confidently is the only way to actually fail these questions.

### Try It Yourself

```js
const cases = [
  ["0.1 + 0.2 === 0.3", () => 0.1 + 0.2 === 0.3],
  ["typeof null", () => typeof null],
  ["NaN === NaN", () => NaN === NaN],
  ["[] + {}", () => [] + {}],
  ["[1,2] + [3]", () => [1, 2] + [3]],
  ['"5" + 2 - 1', () => "5" + 2 - 1],
  ["[] == false", () => [] == false],
  ["null == 0 / null >= 0", () => [null == 0, null >= 0]],
  ['["1","2","3"].map(parseInt)', () => ["1", "2", "3"].map(parseInt)],
  ["[10,1,2].sort()", () => [10, 1, 2].sort()],
  ["Array(3).map(() => 1).length", () => Array(3).map(() => 1).length],
  ["(0.615).toFixed(2)", () => (0.615).toFixed(2)],
  ['"b"+"a"+ +"a"+"a"', () => "b" + "a" + +"a" + "a"],
  ["typeof typeof 1", () => typeof typeof 1],
  ["1 < 2 < 3 / 3 > 2 > 1", () => [1 < 2 < 3, 3 > 2 > 1]],
  ["Math.max()", () => Math.max()],
  ["9007199254740993", () => 9007199254740993],
  ["{} === {}", () => ({}) === ({})],
];
const show = v => Array.isArray(v) ? "[" + v.map(show).join(", ") + "]" : typeof v === "string" ? JSON.stringify(v) : String(v);
for (const [label, fn] of cases) console.log(label.padEnd(32), "->", show(fn()));
console.log("A"); setTimeout(() => console.log("B (timeout)"), 0); Promise.resolve().then(() => console.log("C (microtask)")); console.log("D");
```

### Quiz

1. What does `["1", "2", "3"].map(parseInt)` return?
- [ ] [1, 2, 3]
- [x] [1, NaN, NaN]
- [ ] ["1", "2", "3"]
> `map` passes the index as `parseInt`'s radix argument.

2. What is `[] == false`?
- [x] true
- [ ] false
- [ ] TypeError
> `[]` converts to `""`, then both sides become the number 0.

3. What does `new Array(3)` create?
- [ ] [3]
- [x] An array of length 3 with empty slots
- [ ] [undefined, undefined, undefined]
> A single numeric argument sets the length; `map` and `forEach` skip the holes.

4. What is `typeof NaN`?
- [ ] "NaN"
- [x] "number"
- [ ] "undefined"
> NaN is a special numeric value defined by IEEE 754.

5. What prints from `console.log("A"); setTimeout(()=>console.log("B")); Promise.resolve().then(()=>console.log("C")); console.log("D");`?
- [ ] A B C D
- [x] A D C B
- [ ] A D B C
> Synchronous first, then microtasks (C), then the timeout task (B).

### Exercises

1. **Explain three** — For `0.1 + 0.2`, `typeof null` and `[] + {}`, write the output and the one-line rule as comments.
<details><summary>Solution</summary>

```js
console.log(0.1 + 0.2);   // 0.30000000000000004: binary floating point cannot represent 0.1 exactly
console.log(typeof null); // "object": legacy bug in the type tag
console.log([] + {});     // "[object Object]": + converts both operands to strings
```

</details>

2. **Fix the traps** — Rewrite `[10,1,2].sort()`, `["1","2"].map(parseInt)` and the `var` timer loop so they behave as a beginner expects.
<details><summary>Solution</summary>

```js
console.log([10, 1, 2].toSorted((a, b) => a - b));
console.log(["1", "2"].map(Number));
for (let i = 0; i < 3; i++) setTimeout(() => console.log(i));
```

</details>

3. **Safe equality** — Write `sameNumber(a, b)` that treats NaN as equal to NaN and uses a tolerance for floats.
<details><summary>Solution</summary>

```js
const sameNumber = (a, b) => (Number.isNaN(a) && Number.isNaN(b)) || Math.abs(a - b) < Number.EPSILON * 4;
console.log(sameNumber(0.1 + 0.2, 0.3), sameNumber(NaN, NaN), sameNumber(1, 2)); // true true false
```

</details>

### Interview Questions

**Q: Walk me through why [] == false is true.**
The Abstract Equality algorithm sees an object compared to a boolean. First the boolean is converted to a number, so `false` becomes `0`. Then the object is converted to a primitive via `ToPrimitive`, which calls `valueOf` (returns the array itself, not primitive) and then `toString`, giving `""`. Now `"" == 0` compares a string to a number, so the string is converted to a number, `0`, and `0 == 0` is true. The lesson is that `==` performs up to three conversions per comparison, which is why `===` is the default in every style guide.

**Q: What is the output of a var loop with setTimeout, and how would you fix it?**
`for (var i = 0; i < 3; i++) setTimeout(() => console.log(i))` prints 3, 3, 3 because `var` creates one function-scoped binding that all three closures share, and the loop finishes before any timer runs. `let` gives each iteration its own binding, printing 0, 1, 2; alternatively pass `i` as an extra argument to `setTimeout(fn, 0, i)` or wrap the body in an IIFE. In practice I use `let` everywhere and let ESLint's `no-var` rule enforce it.

**Q: Why is 9007199254740993 printed as 9007199254740992?**
JavaScript numbers are 64-bit doubles with a 53-bit mantissa, so integers are exact only up to 2^53 - 1, which is `Number.MAX_SAFE_INTEGER` (9,007,199,254,740,991). Above that, not every integer has a representation and the literal rounds to the nearest even representable value. For large identifiers such as 19-digit database keys, keep them as strings or use `BigInt` (`9007199254740993n`), and be aware that `JSON.parse` will silently round them unless you use a reviver on the raw text. `Number.isSafeInteger` is the check to add before doing arithmetic on IDs.

**Q: How do you approach a "what does this print" question you have not seen before?**
I narrate the rules in order: identify synchronous versus asynchronous statements, then apply hoisting and scope to each variable, then evaluate operators left to right with their coercion rules, and finally order any async output by microtask before macrotask. I say each intermediate value out loud so the interviewer can follow, and if I hit a rule I am unsure of I state my assumption explicitly. Then I finish with the production fix, because the goal of these questions is to check that I can prevent the bug, not just predict it.
