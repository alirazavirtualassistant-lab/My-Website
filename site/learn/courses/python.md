---
id: python
title: Python
icon: 🐍
track: Programming
color: #3776AB
runner: python
packages: 
tagline: The language behind every document pipeline, report and automation you will ever build.
description: A complete Python course from your first print() to production-grade automation: syntax, data structures, functions, files, errors, modules, comprehensions, generators, decorators, typing, testing, packaging, performance and the internals interviewers ask about.
---

# LEVEL: Beginner

## Introduction & setup

Python is a general-purpose programming language that reads almost like English. It is the language behind `python-docx`, `openpyxl`, PyMuPDF, pandas and most of the automation you will meet in document production and reporting work. You write instructions in a plain text file ending in `.py`, and the Python **interpreter** executes them from top to bottom.

Here is the smallest complete program. It prints one line of text to the screen.

```python
print("Hello, document engineer!")
```

`print()` is a built-in **function**: a named piece of behaviour you call with round brackets. The text inside the quotes is a **string**. When you run the file, Python sends that string to standard output, which is the terminal window you ran it from.

### Installing Python

Download the current release from python.org (3.12 or 3.13 at the time of writing). On Windows tick **Add python.exe to PATH** in the installer, otherwise the `python` command will not be found in a new terminal. On macOS and most Linux distributions a `python3` command is already present, but it is often an older version, so install a fresh one anyway.

Check the installation from a terminal:

```bash
python --version        # Windows
python3 --version       # macOS / Linux
```

You should see something like `Python 3.12.6`. If Windows opens the Microsoft Store instead, the PATH box was not ticked; re-run the installer and choose **Modify**.

### Three ways to run code

| Method | How | Best for |
|---|---|---|
| The REPL | type `python` and press Enter, then type expressions | trying one line at a time |
| A script | save `hello.py`, run `python hello.py` | real programs |
| A notebook / this site | run a cell in the browser | learning and experiments |

The REPL (Read-Eval-Print Loop) shows a `>>>` prompt. Type `2 + 2`, press Enter and Python prints `4` immediately. Type `exit()` to leave.

### Your first script

Create a folder for your projects, for example `C:\Projects\learn-python`, open it in VS Code (install the official Python extension by Microsoft), and save this file as `report.py`:

```python
# report.py - my first script
client = "Stewart Title"
pages = 12

print("Client:", client)
print("Pages in the weekly status report:", pages)
```

Run it with `python report.py`. Lines starting with `#` are **comments**: Python ignores them, but they tell the next reader (usually you, three months later) what the code is for.

> **Tip:** Python uses indentation instead of curly braces to group code. Set your editor to insert 4 spaces when you press Tab. Mixing tabs and spaces is the most common beginner error and it shows up as `IndentationError` or `TabError`.

### Why Python for document and data work

- The standard library already includes CSV, JSON, ZIP, XML, HTTP and SQLite support, so you can automate a lot before installing anything.
- The ecosystem covers every file type you touch: `python-docx` for Word, `openpyxl` for Excel, `pypdf` and PyMuPDF for PDF, `ebooklib` for EPUB.
- Scripts are easy to schedule with Task Scheduler or cron, which is how a Friday status report becomes a job that runs itself.
- Interviewers for analyst and automation roles routinely ask for a Python solution on a whiteboard because it is short enough to write in five minutes.

### Try It Yourself

```python
# Change the values and run again
client = "Stewart Title"
pages = 12
print("Client:", client)
print("Pages in the weekly status report:", pages)
print("Python version check:")
import sys
print(sys.version.split()[0])
```

### Quiz

1. What does `print("a", "b")` output?
- [x] a b
- [ ] ab
- [ ] "a" "b"
> `print` separates its arguments with a single space by default and does not show the quotes.

2. Which line is a comment in Python?
- [ ] `// this is ignored`
- [x] `# this is ignored`
- [ ] `/* this is ignored */`
> Python comments start with `#`. The other two forms belong to C-style languages such as JavaScript.

3. Why tick "Add python.exe to PATH" on Windows?
- [ ] It installs pip
- [x] So the `python` command works in any terminal
- [ ] It enables the REPL
> PATH is the list of folders the shell searches for commands. Without it you would have to type the full installation path every time.

### Exercises

1. **Version banner** — Write a script that prints your name on one line and the Python version (from `sys.version`) on the next.
<details><summary>Solution</summary>

```python
import sys
print("Ali Raza")
print(sys.version.split()[0])
```

</details>

2. **Report header** — Store a client name, a report date and a page count in three variables and print them as `Client | Date | Pages` on one line using a single `print` call.
<details><summary>Solution</summary>

```python
client = "Stewart Title"
date = "2026-09-12"
pages = 12
print(client, date, pages, sep=" | ")
```

</details>

### Interview Questions

**Q: Is Python compiled or interpreted?**
Both, in practice. CPython, the reference implementation, compiles your source into bytecode (cached as `.pyc` files in `__pycache__`) and then a virtual machine interprets that bytecode. That is why Python starts quickly and is easy to iterate on, but also why a tight numeric loop is 10 to 100 times slower than the same loop in C. A strong answer adds that there are other implementations: PyPy has a JIT compiler, and CPython 3.13 ships an experimental JIT behind a build flag.

**Q: What is the difference between Python 2 and Python 3, and does it still matter?**
Python 2 reached end of life in January 2020, so any new work should be Python 3. The visible differences are `print` being a function instead of a statement, integer division returning a float (`7 / 2` is `3.5`, use `//` for `3`), and strings being Unicode by default with a separate `bytes` type. It still matters when you inherit legacy scripts in BPO or reporting teams; the `2to3` tool and the `six` library were the standard migration aids.

**Q: What is PEP 8 and why do teams care?**
PEP 8 is the official style guide: 4-space indentation, `snake_case` for functions and variables, `CamelCase` for classes, 79-character lines and two blank lines between top-level definitions. Teams care because consistent style makes code review faster and diffs smaller. In practice you enforce it with a tool rather than by memory: `ruff` or `flake8` for linting and `black` or `ruff format` for auto-formatting, usually run in a pre-commit hook.

## Variables & data types

A **variable** is a name that points at a value. You create one with a single `=`, which is the **assignment** operator. Python works out the type from the value, so there is no `int x` declaration like in Java or C.

```python
pages = 767            # int
price = 49.99          # float
title = "Employee Handbook"   # str
is_final = True        # bool
reviewer = None        # NoneType, "no value yet"
```

Run `type(pages)` and Python answers `<class 'int'>`. The five types above cover most beginner scripts.

### The core built-in types

| Type | Example | What it holds |
|---|---|---|
| `int` | `767` | whole numbers of any size |
| `float` | `49.99` | decimal numbers (64-bit double) |
| `str` | `"Handbook"` | text, Unicode |
| `bool` | `True` / `False` | truth values (note the capital letter) |
| `NoneType` | `None` | the absence of a value |
| `list` | `[1, 2, 3]` | ordered, changeable sequence |
| `dict` | `{"state": "TX"}` | key-value mapping |

Lists and dictionaries get their own chapter later; for now just recognise the brackets.

### Naming rules

Names may contain letters, digits and underscores, cannot start with a digit, and are case sensitive: `Pages` and `pages` are two different variables. By convention use `snake_case` for variables (`page_count`, `client_name`) and `UPPER_CASE` for constants that should never change (`MAX_FIELDS = 168`). Avoid shadowing built-ins: naming a variable `list`, `str` or `id` works but silently breaks the built-in for the rest of the file.

### Dynamic typing and re-assignment

A variable can be re-bound to a value of a different type at any time:

```python
value = 42
print(type(value))    # <class 'int'>
value = "forty-two"
print(type(value))    # <class 'str'>
```

Python is **dynamically typed** (the type lives on the value, not the name) but **strongly typed** (it will not silently convert between unrelated types). `"Pages: " + 12` raises `TypeError`; you have to convert explicitly with `str(12)`.

### Converting between types

```python
int("168")        # 168
float("3.5")      # 3.5
str(767)          # "767"
int(3.99)         # 3  (truncates, does not round)
bool(0)           # False
bool("")          # False
bool("0")         # True  (non-empty string)
```

`int("12 pages")` raises `ValueError` because the whole string must be a number. You will meet this constantly when reading CSV exports, where every column arrives as text.

### Multiple assignment and swapping

```python
width, height = 8.5, 11        # tuple unpacking
a, b = b, a                    # swap without a temporary variable
x = y = 0                      # both names point at 0
```

The swap idiom is a favourite interview warm-up. It works because the right-hand side is evaluated fully (building a tuple) before any name is bound.

> **Tip:** Use `f"..."` strings to print values with labels: `print(f"{title}: {pages} pages")`. You will learn the full f-string syntax in the Strings chapter; for now just know that anything inside `{}` is evaluated.

### Checking truthiness

Every value can be used where a `True`/`False` is expected. Zero, empty strings, empty lists, empty dicts and `None` are **falsy**; everything else is **truthy**. `if reviewer:` therefore means "if a reviewer has been assigned", which reads naturally once you are used to it.

### Try It Yourself

```python
title = "Employee Handbook"
pages = 767
price = 49.99
is_final = False
reviewer = None

print(f"{title}: {pages} pages at ${price}")
print(type(title), type(pages), type(price), type(is_final), type(reviewer))

# conversion from a CSV-style string
raw = "168"
fields = int(raw) + 2
print("Fields after adding two:", fields)

# truthiness
for value in [0, 1, "", "TX", None, [], [0]]:
    print(repr(value), "->", bool(value))
```

### Quiz

1. What does `type(3.0)` return?
- [ ] `<class 'int'>`
- [x] `<class 'float'>`
- [ ] `<class 'decimal'>`
> A literal with a decimal point is always a float, even when the fractional part is zero.

2. What happens when you run `"Pages: " + 12`?
- [ ] It prints `Pages: 12`
- [x] It raises `TypeError`
- [ ] It prints `Pages: ` and ignores the number
> Python is strongly typed: it will not implicitly convert an int to a string. Use `str(12)` or an f-string.

3. Which value is truthy?
- [ ] `0`
- [ ] `""`
- [x] `"0"`
> A non-empty string is always truthy, even when its content is the character zero.

4. After `a, b = 1, 2` and `a, b = b, a`, what is `a`?
- [x] 2
- [ ] 1
- [ ] An error is raised
> The right side builds the tuple `(2, 1)` first, then unpacks it into `a` and `b`.

### Exercises

1. **Rate calculator inputs** — A rate matrix export gives you `premium = "1250.50"` and `pages = "12"` as strings. Convert them to the correct numeric types and print the premium per page rounded to two decimals.
<details><summary>Solution</summary>

```python
premium = "1250.50"
pages = "12"
per_page = float(premium) / int(pages)
print(round(per_page, 2))   # 104.21
```

</details>

2. **Type report** — Create a list of mixed values and print each value together with its type name using `type(v).__name__`.
<details><summary>Solution</summary>

```python
values = [1, 2.5, "SOP", True, None]
for v in values:
    print(repr(v), type(v).__name__)
```

</details>

### Interview Questions

**Q: Is Python statically or dynamically typed? Strongly or weakly?**
Dynamically typed: a name has no fixed type, and the type belongs to the object it currently references, so `x = 1` then `x = "a"` is legal. Strongly typed: the interpreter never silently coerces between unrelated types, so `"1" + 1` raises `TypeError` rather than producing `"11"` as JavaScript would. Type hints (PEP 484) let you add optional static checking with mypy or pyright without changing runtime behaviour, which is the modern middle ground most teams use.

**Q: What is the difference between `is` and `==`?**
`==` compares values by calling `__eq__`; `is` compares identity, meaning both names point at the exact same object in memory. Use `is` only for singletons such as `None`, `True` and `False` (`if reviewer is None:`). A classic trap is that small integers from -5 to 256 are cached by CPython, so `a = 256; b = 256; a is b` is `True` while the same test with 257 may be `False`, which is why relying on `is` for numbers or strings is a bug waiting to happen.

**Q: Why is `None` used instead of an empty string or zero for "no value"?**
Because zero and empty string are valid data. A page count of `0` is a real measurement, while `None` says "not measured yet". Keeping the two distinct prevents subtle reporting errors, such as averaging missing values as zeros in a weekly production report. Idiomatic code checks `if value is None` and functions that find nothing conventionally return `None`.

## Strings

A **string** is a sequence of Unicode characters. You write one with single or double quotes; both are identical, so pick one style and stay consistent. Triple quotes let a string span several lines, which is handy for email bodies and SQL.

```python
client = 'Fiverr client'
sop = "Standard Operating Procedure"
note = """Dear team,
Please review the attached SOP by Friday.
"""
```

### Indexing and slicing

Characters are numbered from 0. Negative numbers count from the end. A **slice** `s[start:stop]` returns characters from `start` up to but not including `stop`.

```python
code = "TX-2026-0042"
print(code[0])        # T
print(code[-1])       # 2
print(code[3:7])      # 2026
print(code[:2])       # TX
print(code[-4:])      # 0042
print(code[::-1])     # 2400-6202-XT  (reversed)
```

Strings are **immutable**: `code[0] = "C"` raises `TypeError`. Every method below returns a new string and leaves the original untouched.

### Methods you will use every day

| Method | Example | Result |
|---|---|---|
| `upper()` / `lower()` | `"Tx".upper()` | `"TX"` |
| `strip()` | `"  TX \n".strip()` | `"TX"` |
| `split()` | `"a,b,c".split(",")` | `["a", "b", "c"]` |
| `join()` | `"-".join(["TX", "42"])` | `"TX-42"` |
| `replace()` | `"v1.docx".replace("v1", "v2")` | `"v2.docx"` |
| `startswith()` / `endswith()` | `"report.pdf".endswith(".pdf")` | `True` |
| `find()` | `"handbook".find("book")` | `4` (or `-1`) |
| `zfill()` | `"42".zfill(4)` | `"0042"` |
| `title()` | `"policy manual".title()` | `"Policy Manual"` |

`split()` with no argument splits on any run of whitespace, which is exactly what you want when cleaning column headers that were pasted from Excel.

### f-strings

Formatted string literals (Python 3.6+) put expressions inside `{}`:

```python
state = "Texas"
files = 1284
rate = 0.9375
print(f"{state}: {files:,} files, {rate:.1%} pass rate")
# Texas: 1,284 files, 93.8% pass rate
```

After the colon comes a **format spec**: `,` inserts thousands separators, `.1%` multiplies by 100 and shows one decimal, `.2f` gives two decimals, `>10` right-aligns in 10 characters and `08.2f` zero-pads. Python 3.8 added `f"{files=}"` which prints `files=1284`, perfect for quick debugging. Python 3.12 allows re-using the same quote type inside the braces, so `f"{row["state"]}"` is now legal.

### Building tables with alignment

```python
rows = [("Texas", 1284), ("Wyoming", 96), ("Florida", 2201)]
print(f"{'State':<10}{'Files':>8}")
for state, n in rows:
    print(f"{state:<10}{n:>8,}")
```

This is how you produce fixed-width text reports for email bodies where HTML tables are not allowed.

### Escapes and raw strings

`\n` is a newline, `\t` a tab and `\\` a literal backslash. Windows paths are full of backslashes, so use a **raw string** `r"C:\Users\Ali\Documents"` where nothing is escaped. `len()` counts characters, and `in` tests membership: `"draft" in filename.lower()`.

> **Warning:** Comparing strings with `==` is case sensitive and whitespace sensitive. Normalise first: `a.strip().casefold() == b.strip().casefold()`. `casefold()` is a stronger `lower()` that also handles German ß and similar cases.

### Try It Yourself

```python
filename = "  Employee_Handbook_v3_FINAL.docx \n"
clean = filename.strip()
stem, ext = clean.rsplit(".", 1)
print("Extension:", ext)
print("Words:", stem.split("_"))
print("Is final:", "final" in stem.lower())
print("Renamed:", stem.replace("_FINAL", "").lower() + "." + ext)

rows = [("Texas", 1284, 0.9375), ("Wyoming", 96, 1.0), ("Florida", 2201, 0.882)]
print(f"{'State':<10}{'Files':>8}{'Pass':>8}")
for state, n, rate in rows:
    print(f"{state:<10}{n:>8,}{rate:>8.1%}")
```

### Quiz

1. What does `"TX-2026"[3:]` return?
- [ ] `"TX-"`
- [x] `"2026"`
- [ ] `"-2026"`
> Slicing from index 3 to the end skips `T`, `X` and `-`.

2. Which expression joins `["a", "b"]` into `"a, b"`?
- [ ] `["a", "b"].join(", ")`
- [x] `", ".join(["a", "b"])`
- [ ] `join(["a", "b"], ", ")`
> `join` is a method of the separator string, not of the list.

3. What does `f"{0.5:.0%}"` produce?
- [x] `50%`
- [ ] `0.5%`
- [ ] `0%`
> The `%` spec multiplies by 100 and appends a percent sign; `.0` asks for zero decimals.

4. What happens with `s = "abc"; s[0] = "x"`?
- [ ] `s` becomes `"xbc"`
- [x] `TypeError` is raised
- [ ] `s` becomes `"x"`
> Strings are immutable. Build a new one instead: `"x" + s[1:]`.

### Exercises

1. **Initials** — Given `name = "ali raza"`, print `A.R.` using string methods only.
<details><summary>Solution</summary>

```python
name = "ali raza"
print(".".join(part[0].upper() for part in name.split()) + ".")
```

</details>

2. **Invoice line** — Format `("EPUB conversion", 3, 45.0)` as `EPUB conversion .......... 3 x $45.00 = $135.00` with the description padded to 25 characters using dots.
<details><summary>Solution</summary>

```python
desc, qty, price = ("EPUB conversion", 3, 45.0)
print(f"{desc + ' ':.<26}{qty} x ${price:.2f} = ${qty * price:.2f}")
```

</details>

3. **Palindrome check** — Write code that reports whether `"A man, a plan, a canal: Panama"` is a palindrome ignoring case and non-letters.
<details><summary>Solution</summary>

```python
s = "A man, a plan, a canal: Panama"
letters = "".join(ch.lower() for ch in s if ch.isalnum())
print(letters == letters[::-1])   # True
```

</details>

### Interview Questions

**Q: Why are strings immutable in Python, and what does that mean for building a large string in a loop?**
Immutability lets strings be hashable (usable as dict keys), safely shared between variables, and interned by the interpreter. The cost is that `s += piece` inside a loop creates a brand-new string each time, which is O(n²) over many iterations. The idiom is to collect pieces in a list and call `"".join(pieces)` once, or write to `io.StringIO`. CPython has an optimisation that makes `+=` fast when the string has a single reference, but you should not rely on it because PyPy and other implementations do not have it.

**Q: What is the difference between `str` and `bytes`?**
`str` is a sequence of Unicode code points; `bytes` is a sequence of integers 0–255. Converting between them requires an encoding: `"Ünïcode".encode("utf-8")` and `data.decode("utf-8")`. Files, sockets and PDF streams give you bytes; everything user-facing should be `str`. The classic bug is reading a DOCX exported CSV with the wrong encoding and getting `UnicodeDecodeError` or mojibake such as `Ã©` for `é`; always pass `encoding="utf-8"` explicitly and consider `utf-8-sig` for files that start with a BOM.

**Q: How would you check whether a string contains a substring, and how would you count occurrences?**
`"book" in "handbook"` returns a boolean and is the idiomatic membership test. `s.find("book")` returns the index or `-1`, while `s.index("book")` raises `ValueError` when not found, which is better when absence is a real error. `s.count("book")` counts non-overlapping occurrences. For pattern-based searches such as finding all policy numbers shaped like `TX-2026-0042`, use `re.findall(r"[A-Z]{2}-\d{4}-\d{4}", text)`.

## Numbers & operators

Python has three numeric types: `int` for whole numbers, `float` for decimals and `complex` for engineering maths. Integers are arbitrary precision, so `2 ** 200` works without overflow. Floats are 64-bit IEEE 754 doubles, the same as in Excel and JavaScript, with the same rounding quirks.

### Arithmetic operators

| Operator | Meaning | Example | Result |
|---|---|---|---|
| `+` `-` `*` | add, subtract, multiply | `7 * 3` | `21` |
| `/` | true division, always float | `7 / 2` | `3.5` |
| `//` | floor division | `7 // 2` | `3` |
| `%` | modulo (remainder) | `7 % 2` | `1` |
| `**` | power | `2 ** 10` | `1024` |
| `-x` | negation | `-(-5)` | `5` |

Floor division rounds toward negative infinity, so `-7 // 2` is `-4`, not `-3`. Modulo follows the same rule, so `-7 % 2` is `1`. This matters when you compute "which page of a 40-row batch is row n on".

```python
rows = 1284
per_page = 40
pages = (rows + per_page - 1) // per_page   # ceiling division without math.ceil
print(pages)                                # 33
print(-(-rows // per_page))                 # 33, the one-liner interviewers like
```

### Operator precedence

`**` binds tighter than unary minus, so `-2 ** 2` is `-4`. Multiplication and division come before addition and subtraction, and comparisons come after arithmetic. When in doubt, add brackets; nobody was ever marked down for clarity.

### Augmented assignment

```python
total = 0
total += 250     # same as total = total + 250
total *= 2
total //= 3
print(total)     # 166
```

### Comparison and logical operators

`==`, `!=`, `<`, `<=`, `>`, `>=` return booleans. Python allows chaining: `0 <= score <= 100` reads exactly like the maths. `and`, `or`, `not` are spelled out as words and **short-circuit**: `a and b` stops at `a` if it is falsy, and returns the actual operand rather than a strict boolean, so `name or "Unknown"` is a common default-value idiom.

### Floating point surprises

```python
print(0.1 + 0.2)              # 0.30000000000000004
print(0.1 + 0.2 == 0.3)       # False
print(round(2.675, 2))        # 2.67, not 2.68
```

Binary floats cannot represent most decimal fractions exactly. For money, premiums and rate matrices use the `decimal` module, which does exact decimal arithmetic with a chosen precision and rounding mode:

```python
from decimal import Decimal, ROUND_HALF_UP
premium = Decimal("1250.505")
print(premium.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))   # 1250.51
```

Always build a `Decimal` from a string, never from a float, otherwise you import the float's error. For comparing floats use `math.isclose(a, b, rel_tol=1e-9)`.

### Useful functions and the math module

```python
import math
abs(-3)                 # 3
round(3.14159, 2)       # 3.14
divmod(1284, 40)        # (32, 4)  quotient and remainder together
max(3, 9, 1), min([4, 2])
sum([1.5, 2.5])         # 4.0
math.ceil(32.1)         # 33
math.floor(32.9)        # 32
math.sqrt(16)           # 4.0
math.pi                 # 3.141592653589793
```

`round()` uses banker's rounding (round half to even) which is why `round(2.5)` is `2` and `round(3.5)` is `4`. Excel's `ROUND` rounds half away from zero, so a Python port of an Excel rate calculator must use `Decimal` with `ROUND_HALF_UP` to match the spreadsheet cent for cent.

> **Interview note:** Interviewers love `0.1 + 0.2 != 0.3`. The good answer is not "Python is broken" but "IEEE 754 binary floats cannot represent 0.1 exactly; use `Decimal` for money, `fractions.Fraction` for exact ratios, and `math.isclose` for tolerant comparison".

### Integer helpers

`int` has handy methods: `(255).bit_length()` is `8`, `bin(10)` is `'0b1010'`, `hex(255)` is `'0xff'`, and underscores are allowed in literals for readability: `1_000_000`. `int("ff", 16)` parses hexadecimal, which you meet in colour codes such as `#3776AB`.

### Try It Yourself

```python
from decimal import Decimal, ROUND_HALF_UP
import math

rows, per_page = 1284, 40
print("pages needed:", -(-rows // per_page), "| divmod:", divmod(rows, per_page))

print("float trap:", 0.1 + 0.2, 0.1 + 0.2 == 0.3, math.isclose(0.1 + 0.2, 0.3))

premium = Decimal("1250.505")
print("banker's round:", round(2.5), round(3.5))
print("Excel-style:", premium.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))

rate_per_thousand = Decimal("5.75")
coverage = Decimal("250000")
print("premium:", (coverage / 1000 * rate_per_thousand).quantize(Decimal("0.01")))

print(0 <= 93 <= 100, "" or "Unknown", 2 ** 100)
```

### Quiz

1. What is `-7 // 2`?
- [ ] -3
- [x] -4
- [ ] 3
> Floor division rounds toward negative infinity, so -3.5 becomes -4.

2. What does `round(2.5)` return?
- [x] 2
- [ ] 3
- [ ] 2.5
> Python rounds half to even (banker's rounding). `round(3.5)` gives 4.

3. Which type should you use for currency calculations?
- [ ] `float`
- [x] `decimal.Decimal`
- [ ] `int` with the value in dollars
> `Decimal` does exact base-10 arithmetic with a rounding mode you control; floats accumulate binary representation error.

4. What is `-2 ** 2`?
- [x] -4
- [ ] 4
- [ ] SyntaxError
> `**` binds tighter than unary minus, so it is `-(2 ** 2)`.

### Exercises

1. **Rate calculator** — A title policy costs `$5.75` per `$1,000` of coverage with a minimum premium of `$100`. Compute the premium for coverage amounts 12,000 and 250,000 using `Decimal`, rounding half up to cents.
<details><summary>Solution</summary>

```python
from decimal import Decimal, ROUND_HALF_UP
rate = Decimal("5.75")
for coverage in (Decimal("12000"), Decimal("250000")):
    premium = max(coverage / 1000 * rate, Decimal("100"))
    print(coverage, premium.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))
```

</details>

2. **Seconds to h:m:s** — Convert `4523` seconds into `1h 15m 23s` using `divmod`.
<details><summary>Solution</summary>

```python
total = 4523
h, rem = divmod(total, 3600)
m, s = divmod(rem, 60)
print(f"{h}h {m}m {s}s")
```

</details>

### Interview Questions

**Q: Why does `0.1 + 0.2 == 0.3` evaluate to False and how do you handle it?**
Floats are stored in binary, and 0.1 and 0.2 are repeating fractions in base 2, so each is stored with a tiny error that survives the addition. The fix depends on context: `math.isclose(a, b, rel_tol=1e-9)` for tolerant comparison in analytics, `decimal.Decimal` built from strings for money and rate calculations, or `fractions.Fraction` when you need exact rational arithmetic. Excel has the same underlying representation but hides it by displaying 15 significant digits.

**Q: What is the difference between `/`, `//` and `%`, and how do they behave with negatives?**
`/` always returns a float (`7 / 7` is `1.0`). `//` returns the floor of the quotient and keeps the operand type, so `7 // 2` is `3` and `7.0 // 2` is `3.0`. `%` returns the remainder with the same sign as the divisor, which makes `-1 % 12` equal `11`, useful for wrapping around clock hours or circular indexes. The invariant `a == (a // b) * b + a % b` always holds, which is what `divmod` returns as a pair.

**Q: How does Python handle very large integers, and what is the performance cost?**
`int` is arbitrary precision: it grows in 30-bit "digits" as needed, so `factorial(100)` is exact. The cost is that arithmetic on big values is slower than on machine-sized ones because each operation loops over digits, and since Python 3.11 converting integers with more than 4,300 digits to or from decimal strings raises `ValueError` by default (a denial-of-service guard, adjustable via `sys.set_int_max_str_digits`). For numeric heavy lifting you use NumPy arrays, which store fixed-width machine integers and floats.

## Conditions & loops

Programs make decisions with `if` and repeat work with loops. Both rely on **indentation**: the indented block under the header line is the code that runs conditionally or repeatedly. Four spaces is the convention.

### if, elif, else

```python
pass_rate = 0.93
if pass_rate >= 0.95:
    grade = "Excellent"
elif pass_rate >= 0.90:
    grade = "Good"
else:
    grade = "Needs coaching"
print(grade)     # Good
```

Python evaluates the branches top to bottom and runs the first one whose condition is truthy. `elif` is optional and repeatable; `else` is optional and catches everything left over. There is no `switch` statement, but Python 3.10 added `match`/`case` structural pattern matching for more complex branching.

### Conditional expressions

A one-line form exists for simple choices:

```python
status = "FINAL" if is_approved else "DRAFT"
```

Use it when the two outcomes are values, not when they involve side effects.

### The for loop

`for` iterates over any **iterable**: a list, a string, a range, a file, a dictionary.

```python
states = ["Texas", "Wyoming", "Florida"]
for state in states:
    print(state.upper())

for i in range(3):          # 0, 1, 2
    print(i)

for i in range(1, 11, 2):   # 1, 3, 5, 7, 9
    print(i)
```

`range(start, stop, step)` stops before `stop`. To get both index and value use `enumerate`, and to walk two lists in step use `zip`:

```python
for n, state in enumerate(states, start=1):
    print(f"{n}. {state}")

files = [1284, 96, 2201]
for state, count in zip(states, files):
    print(state, count)
```

### The while loop

`while` repeats as long as a condition holds. It is the right tool when you do not know the number of iterations in advance, such as retrying a download or paging through an API.

```python
attempt = 0
while attempt < 3:
    attempt += 1
    print("attempt", attempt)
```

Forgetting to change the condition variable creates an infinite loop; press Ctrl+C to stop a runaway script.

### break, continue and else

`break` exits the loop immediately. `continue` skips to the next iteration. Loops can have an `else` clause that runs only if the loop finished **without** a `break`, which is perfect for search-and-not-found logic:

```python
docs = ["sop_v1.docx", "letterhead.dotx", "rates.xlsx"]
for name in docs:
    if name.endswith(".pdf"):
        print("found PDF:", name)
        break
else:
    print("no PDF in batch")
```

### Nested loops

```python
for row in range(1, 4):
    for col in range(1, 4):
        print(row * col, end="\t")
    print()
```

`end="\t"` stops `print` from adding a newline. Nested loops multiply the work: 1,000 × 1,000 is a million iterations, which is where you start reaching for dictionaries or sets instead (next level).

### match statement (3.10+)

```python
match ext:
    case ".docx" | ".dotx":
        kind = "Word"
    case ".pdf":
        kind = "PDF"
    case _:
        kind = "Other"
```

`case _` is the wildcard. `match` can also destructure tuples, lists and dictionaries, which makes it useful for parsing command results and JSON.

> **Warning:** Do not modify a list while iterating over it with `for`. Removing items shifts the indexes and skips elements. Iterate over a copy (`for x in items[:]`) or build a new filtered list instead.

### Try It Yourself

```python
agents = {"Sara": 0.97, "Bilal": 0.91, "Hina": 0.86, "Omar": 0.94}
threshold = 0.90

for n, (name, score) in enumerate(agents.items(), start=1):
    if score >= 0.95:
        band = "Excellent"
    elif score >= threshold:
        band = "Good"
    else:
        band = "Coaching"
    print(f"{n}. {name:<6} {score:.0%}  {band}")

# find the first agent below threshold, or report none
for name, score in agents.items():
    if score < threshold:
        print("First below threshold:", name)
        break
else:
    print("Everyone passed")

# while loop with a counter
batch, page = 1284, 0
while batch > 0:
    page += 1
    batch -= 40
print("pages printed:", page)
```

### Quiz

1. What does `range(2, 10, 3)` produce?
- [x] 2, 5, 8
- [ ] 2, 5, 8, 11
- [ ] 3, 6, 9
> It starts at 2, steps by 3 and stops before 10.

2. When does a `for` loop's `else` block run?
- [ ] Only when the loop body raised an exception
- [x] When the loop finished without hitting `break`
- [ ] When the iterable was empty, only
> The `else` runs after normal completion, including for empty iterables, but is skipped by `break`.

3. Which keyword skips the rest of the current iteration?
- [ ] `break`
- [x] `continue`
- [ ] `pass`
> `continue` jumps to the next iteration; `break` leaves the loop; `pass` does nothing at all.

4. What does `enumerate(["a", "b"], start=1)` yield first?
- [ ] `("a", 1)`
- [x] `(1, "a")`
- [ ] `["a"]`
> `enumerate` yields `(index, value)` tuples, with the index starting at the value you pass.

### Exercises

1. **FizzBuzz** — Print 1 to 15, but `Fizz` for multiples of 3, `Buzz` for multiples of 5 and `FizzBuzz` for both.
<details><summary>Solution</summary>

```python
for i in range(1, 16):
    out = ""
    if i % 3 == 0:
        out += "Fizz"
    if i % 5 == 0:
        out += "Buzz"
    print(out or i)
```

</details>

2. **Batch splitter** — Given 1,284 title files and 40 per batch, print `Batch 1: files 1-40`, `Batch 2: files 41-80`, and so on, with the last batch showing the real end.
<details><summary>Solution</summary>

```python
total, size = 1284, 40
for n, start in enumerate(range(1, total + 1, size), start=1):
    end = min(start + size - 1, total)
    print(f"Batch {n}: files {start}-{end}")
```

</details>

3. **Prime check** — Use a `for`/`else` loop to print whether 97 is prime.
<details><summary>Solution</summary>

```python
n = 97
for d in range(2, int(n ** 0.5) + 1):
    if n % d == 0:
        print(n, "is not prime, divisible by", d)
        break
else:
    print(n, "is prime")
```

</details>

### Interview Questions

**Q: How does Python's `for` loop differ from a C-style `for` loop?**
Python's `for` is a "for each" over an iterable: it calls `iter()` on the object and repeatedly calls `next()` until `StopIteration`, so there is no index variable unless you ask for one with `enumerate`. This means it works on lists, strings, files, generators and database cursors alike, and it cannot run off the end of a sequence. The C-style pattern `for (i = 0; i < n; i++)` maps to `for i in range(n)`, and `range` is lazy, so `range(10**9)` costs no memory.

**Q: What does the `else` clause on a loop do and when is it useful?**
It runs when the loop terminates normally, that is, without a `break`. The classic use is a search: loop through candidates, `break` when you find a match, and put the "not found" handling in `else` instead of maintaining a `found = False` flag. Many developers find the keyword confusing (it reads like "no-break"), so some teams avoid it, but you should recognise it in code review.

**Q: Why is modifying a list while iterating over it dangerous, and what is the fix?**
The `for` loop keeps an internal index into the list; when you remove an element, everything after it shifts left and the next element is skipped, while inserting can cause an infinite loop. The fixes are to iterate over a copy (`for x in list(items)`), to build a new list with a comprehension (`items = [x for x in items if keep(x)]`), or to iterate in reverse when deleting by index. Dictionaries are stricter: changing their size during iteration raises `RuntimeError` immediately.

# LEVEL: Intermediate

## Lists, tuples, sets & dicts

Python ships four collection types, and picking the right one is half of writing clean code. The mental model: a **list** is an ordered, changeable sequence; a **tuple** is an ordered, unchangeable sequence; a **set** is an unordered bag of unique items; a **dict** maps keys to values.

| Type | Literal | Ordered | Mutable | Duplicates | Typical use |
|---|---|---|---|---|---|
| list | `[1, 2]` | yes | yes | yes | rows read from a file |
| tuple | `(1, 2)` | yes | no | yes | a fixed record, dict keys |
| set | `{1, 2}` | no | yes | no | membership, de-duplication |
| dict | `{"a": 1}` | insertion order (3.7+) | yes | unique keys | lookups by name or ID |

### Lists

```python
files = ["sop_v1.docx", "rates.xlsx"]
files.append("cover.pdf")          # add to the end
files.insert(0, "index.md")        # add at position
files.extend(["a.png", "b.png"])   # add many
removed = files.pop()              # remove and return last
files.remove("rates.xlsx")         # remove by value (first match)
print(len(files), files[0], files[-1], files[1:3])
files.sort()                       # in place, returns None
print(sorted(files, key=len, reverse=True))   # new list
```

`sort()` changes the list and returns `None`, which is why `files = files.sort()` is a bug that leaves you with nothing. `sorted()` returns a new list and works on any iterable. Both take `key=`, a function applied to each item before comparison.

### Tuples

```python
page_size = (8.5, 11)
width, height = page_size          # unpacking
record = ("TX-2026-0042", "Texas", 250000)
policy, state, coverage = record
```

Tuples are immutable, so they can be dictionary keys and set members; lists cannot. A one-item tuple needs a trailing comma: `(5,)`. Functions that return multiple values really return a tuple. For readable records use `collections.namedtuple` or a dataclass (covered in Advanced).

### Sets

```python
approved = {"Sara", "Bilal", "Hina"}
logged_in = {"Bilal", "Omar", "Hina"}
print(approved & logged_in)    # intersection {'Bilal', 'Hina'}
print(approved | logged_in)    # union
print(approved - logged_in)    # difference {'Sara'}
print("Omar" in approved)      # False, O(1) lookup
unique_states = set(["TX", "TX", "WY"])   # {'TX', 'WY'}
```

Set membership is a hash lookup, so checking 10,000 IDs against a set of 1,000,000 takes milliseconds, while the same check against a list takes minutes. An empty set is `set()`, because `{}` creates an empty dict.

### Dictionaries

```python
rates = {"TX": 5.75, "WY": 4.10}
rates["FL"] = 6.25                  # add or overwrite
print(rates["TX"])                  # 5.75
print(rates.get("CA"))              # None instead of KeyError
print(rates.get("CA", 0.0))         # default value
for state, rate in rates.items():
    print(state, rate)
print(list(rates.keys()), list(rates.values()))
del rates["WY"]
rates.setdefault("NV", 5.0)         # insert only if missing
merged = {**rates, "AZ": 5.5}       # copy with additions (3.5+)
merged = rates | {"AZ": 5.5}        # same, Python 3.9+
```

Keys must be hashable (strings, numbers, tuples). Since Python 3.7 dictionaries remember insertion order, which is why `json.dumps` produces predictable output. `collections.Counter` counts things in one line, and `collections.defaultdict(list)` builds grouped lists without checking for missing keys.

### Copying and aliasing

```python
a = [1, 2, 3]
b = a            # same object!
b.append(4)
print(a)         # [1, 2, 3, 4]
c = a.copy()     # shallow copy; a[:] and list(a) also work
```

Assignment never copies. For nested structures use `copy.deepcopy`. This is the single most common source of "my data changed by itself" bugs.

> **Interview note:** Be ready to state the time complexity: list index and append are O(1), list `in` and `insert(0, x)` are O(n), dict and set lookups are O(1) on average, and `sorted()` is O(n log n) using Timsort, which is stable.

### Try It Yourself

```python
from collections import Counter, defaultdict

production = [
    ("Texas", "Sara", 42), ("Wyoming", "Bilal", 7), ("Texas", "Hina", 38),
    ("Florida", "Sara", 55), ("Texas", "Omar", 12), ("Florida", "Hina", 40),
]

by_state = defaultdict(int)
by_agent = defaultdict(list)
for state, agent, files in production:
    by_state[state] += files
    by_agent[agent].append(files)

print("files per state:", dict(by_state))
print("agent totals:", {a: sum(v) for a, v in by_agent.items()})
print("states seen:", Counter(s for s, _, _ in production).most_common())
print("unique agents:", sorted({a for _, a, _ in production}))

top = max(production, key=lambda row: row[2])
print("largest batch:", top)
print("sorted by state then files desc:",
      sorted(production, key=lambda r: (r[0], -r[2])))
```

### Quiz

1. What does `files = files.sort()` leave in `files`?
- [ ] The sorted list
- [x] `None`
- [ ] The original unsorted list
> `list.sort()` sorts in place and returns `None`. Use `sorted()` if you want a new list back.

2. Which literal creates an empty set?
- [ ] `{}`
- [x] `set()`
- [ ] `[]`
> `{}` is an empty dict; sets have no empty literal.

3. Why can a tuple be a dict key but a list cannot?
- [x] Tuples are immutable and therefore hashable
- [ ] Tuples are faster
- [ ] Lists can only hold numbers
> Dict keys must be hashable, and hashing requires the value never to change.

4. What is the average time complexity of `x in some_set`?
- [x] O(1)
- [ ] O(log n)
- [ ] O(n)
> Sets are hash tables, so membership is a constant-time hash lookup on average.

### Exercises

1. **De-duplicate preserving order** — Given `["TX", "WY", "TX", "FL", "WY"]`, produce `["TX", "WY", "FL"]`.
<details><summary>Solution</summary>

```python
items = ["TX", "WY", "TX", "FL", "WY"]
print(list(dict.fromkeys(items)))   # dict keys are unique and ordered
```

</details>

2. **Invert a dictionary** — Turn `{"Sara": "Texas", "Bilal": "Wyoming", "Hina": "Texas"}` into `{"Texas": ["Sara", "Hina"], "Wyoming": ["Bilal"]}`.
<details><summary>Solution</summary>

```python
from collections import defaultdict
agents = {"Sara": "Texas", "Bilal": "Wyoming", "Hina": "Texas"}
by_state = defaultdict(list)
for agent, state in agents.items():
    by_state[state].append(agent)
print(dict(by_state))
```

</details>

3. **Two-sum** — Given `nums = [2, 7, 11, 15]` and `target = 9`, return the indexes of the two numbers that add up to the target in one pass using a dict.
<details><summary>Solution</summary>

```python
nums, target = [2, 7, 11, 15], 9
seen = {}
for i, n in enumerate(nums):
    if target - n in seen:
        print(seen[target - n], i)
        break
    seen[n] = i
```

</details>

### Interview Questions

**Q: What is the difference between a list and a tuple, and when would you choose each?**
Both are ordered sequences that support indexing, slicing and iteration. A list is mutable, has methods such as `append` and `sort`, and is meant for homogeneous collections that grow or change, such as rows read from a CSV. A tuple is immutable, slightly smaller in memory, hashable when its contents are, and signals "this is one record with a fixed shape", such as `(policy_no, state, coverage)`. Choose tuples for dict keys, function return values and constants, and lists for anything you will modify.

**Q: How does a Python dictionary work internally?**
A dict is an open-addressing hash table. Since CPython 3.6 it stores a compact array of entries (hash, key, value) plus a sparse index array, which is what makes it insertion-ordered and about 20 percent smaller than the old layout. Lookup hashes the key, probes the index array, and compares hashes then keys until it finds a match; average cost is O(1), worst case O(n) if many keys collide. When the table gets two-thirds full it resizes, which is an O(n) operation amortised over inserts. Keys must be hashable, meaning they implement `__hash__` and `__eq__` consistently.

**Q: What is the difference between a shallow copy and a deep copy?**
A shallow copy (`list(a)`, `a[:]`, `a.copy()`, `dict(d)`) creates a new outer container whose elements are the same objects as the original, so mutating a nested list changes both. `copy.deepcopy(a)` recursively copies every nested object, at a cost in time and memory, and handles cycles via a memo dict. In reporting code a typical bug is building a matrix with `[[0] * 3] * 3`, which creates three references to one inner list; the fix is `[[0] * 3 for _ in range(3)]`.

**Q: When would you use a set over a list?**
Whenever the questions are "is this item present" or "which items are shared or missing", because set operations are hash-based and O(1) per element, while list membership is a linear scan. Deduplicating a column of 500,000 policy numbers is `set(column)`. Sets are unordered and cannot hold unhashable items such as lists, so if you need order after deduplication use `dict.fromkeys(items)`.

## Functions & scope

A **function** packages code so you can run it many times with different inputs. You define one with `def`, a name, a parameter list and an indented body; `return` sends a value back to the caller.

```python
def premium(coverage, rate_per_thousand=5.75, minimum=100.0):
    """Return the title premium for a coverage amount."""
    amount = coverage / 1000 * rate_per_thousand
    return max(amount, minimum)

print(premium(250000))                # 1437.5
print(premium(12000))                 # 100.0
print(premium(250000, 4.10))          # positional
print(premium(250000, minimum=150))   # keyword
```

The string right after the `def` line is a **docstring**; `help(premium)` displays it. Default values make parameters optional. A function without an explicit `return` returns `None`.

### Positional, keyword and variadic arguments

```python
def log(message, *tags, level="INFO", **extra):
    print(level, message, tags, extra)

log("batch done", "prod", "TX", level="WARN", files=1284)
# WARN batch done ('prod', 'TX') {'files': 1284}
```

`*tags` collects extra positional arguments into a tuple; `**extra` collects extra keyword arguments into a dict. On the calling side the stars do the reverse: `premium(*[250000, 4.10])` and `premium(**{"coverage": 250000})` unpack a list or dict into arguments. Python 3.8 added `/` and `*` markers to force positional-only or keyword-only parameters: `def f(a, b, /, c, *, d)`.

### Scope: the LEGB rule

When Python sees a name it searches four scopes in order: **L**ocal (inside the current function), **E**nclosing (any outer function), **G**lobal (module level), **B**uilt-in (`print`, `len`).

```python
counter = 0            # global

def bump():
    global counter     # without this, counter += 1 makes a new local and fails
    counter += 1

def outer():
    total = 0
    def inner():
        nonlocal total # refer to outer's variable
        total += 1
    inner(); inner()
    return total

bump(); print(counter, outer())   # 1 2
```

Reading a global inside a function works without any keyword; assigning to it needs `global`. Assigning to an enclosing function's variable needs `nonlocal`. Both are code smells in large programs; returning values is cleaner.

### Mutable default arguments

```python
def add_file(name, batch=[]):     # BUG: one shared list for every call
    batch.append(name)
    return batch

print(add_file("a.pdf"))          # ['a.pdf']
print(add_file("b.pdf"))          # ['a.pdf', 'b.pdf']  surprise!
```

Default values are evaluated once, when the `def` runs. The idiom is `batch=None` then `if batch is None: batch = []` inside the body.

### Functions are objects

A function is a value: you can store it in a variable, pass it to another function, and return it. `lambda` creates a small anonymous function on the spot.

```python
by_length = sorted(["cover.pdf", "sop_v3_final.docx", "a.md"], key=len)
square = lambda x: x * x
ops = {"add": lambda a, b: a + b, "mul": lambda a, b: a * b}
print(ops["mul"](6, 7))
```

Keep lambdas to a single expression; anything longer deserves a `def` and a name.

### Type hints and docstrings

```python
def pages_needed(rows: int, per_page: int = 40) -> int:
    """Return how many report pages `rows` rows will fill."""
    return -(-rows // per_page)
```

Hints do not change behaviour but they document intent, power editor autocomplete and let mypy catch mistakes. A good function is short, does one thing, has no hidden side effects, and its name is a verb phrase.

> **Tip:** Return early to avoid deep nesting. `if not rows: return 0` at the top of a function is clearer than wrapping the rest of the body in an `if rows:` block.

### Try It Yourself

```python
def premium(coverage: float, rate_per_thousand: float = 5.75, *, minimum: float = 100.0) -> float:
    """Title premium: coverage/1000 * rate, never below the minimum."""
    return max(coverage / 1000 * rate_per_thousand, minimum)

def summarise(*amounts, label="Batch", **options):
    total = sum(premium(a, **options) for a in amounts)
    return f"{label}: {len(amounts)} policies, ${total:,.2f}"

print(premium(250000))
print(premium(12000, minimum=150))
print(summarise(250000, 12000, 98000, label="TX Friday", rate_per_thousand=6.0))

def make_counter():
    count = 0
    def step():
        nonlocal count
        count += 1
        return count
    return step

tick = make_counter()
print(tick(), tick(), tick())

def add_file(name, batch=None):
    if batch is None:
        batch = []
    batch.append(name)
    return batch

print(add_file("a.pdf"), add_file("b.pdf"))
```

### Quiz

1. What does a function return if it has no `return` statement?
- [ ] `0`
- [ ] An empty string
- [x] `None`
> Every function returns something; without a `return` value that something is `None`.

2. In `def f(a, *args, **kwargs)`, what type is `kwargs`?
- [ ] tuple
- [x] dict
- [ ] list
> `**` collects extra keyword arguments into a dictionary; `*` collects positionals into a tuple.

3. Why is `def f(items=[])` a bug?
- [x] The list is created once and shared across all calls
- [ ] Lists cannot be default values
- [ ] It raises `SyntaxError`
> Defaults are evaluated at definition time, so every call that omits the argument appends to the same list.

4. Which keyword lets an inner function rebind a variable of its enclosing function?
- [ ] `global`
- [x] `nonlocal`
- [ ] `outer`
> `nonlocal` targets the nearest enclosing function scope; `global` targets module scope.

### Exercises

1. **Safe average** — Write `average(values)` that returns `None` for an empty list and the mean otherwise, with a type-hinted signature.
<details><summary>Solution</summary>

```python
def average(values: list[float]) -> float | None:
    if not values:
        return None
    return sum(values) / len(values)

print(average([]), average([90, 95, 100]))
```

</details>

2. **Flexible formatter** — Write `fmt(*parts, sep=" | ", **fields)` that joins `parts` with `sep` and appends `key=value` pairs for each field.
<details><summary>Solution</summary>

```python
def fmt(*parts, sep=" | ", **fields):
    head = sep.join(str(p) for p in parts)
    tail = " ".join(f"{k}={v}" for k, v in fields.items())
    return f"{head} {tail}".strip()

print(fmt("TX", "Friday", files=1284, agent="Sara"))
```

</details>

3. **Memoised Fibonacci** — Write a recursive `fib(n)` that caches results in a dictionary passed as a default argument deliberately.
<details><summary>Solution</summary>

```python
def fib(n, _cache={0: 0, 1: 1}):
    if n not in _cache:
        _cache[n] = fib(n - 1) + fib(n - 2)
    return _cache[n]

print(fib(50))
```

</details>

### Interview Questions

**Q: Is Python pass-by-value or pass-by-reference?**
Neither in the C++ sense; it is "pass by object reference" (also called pass by assignment). The callee receives a new name bound to the same object the caller passed. If the object is mutable, such as a list, mutations inside the function are visible to the caller; if you rebind the parameter (`items = []`) the caller is unaffected because you only changed the local name. That is why `def add(items): items.append(1)` mutates and `def reset(items): items = []` does nothing outside.

**Q: What are `*args` and `**kwargs` and when do you use them?**
`*args` collects surplus positional arguments into a tuple and `**kwargs` collects surplus keyword arguments into a dict; the names are convention, the stars are the syntax. They are essential for wrapper functions and decorators that must forward any signature (`def wrapper(*args, **kwargs): return func(*args, **kwargs)`), for APIs like `print(*values, sep=...)`, and for passing option dictionaries through layers. Overusing them hides the real signature from readers and tools, so prefer explicit parameters in public functions.

**Q: Explain the LEGB rule and the `global` and `nonlocal` keywords.**
Name resolution checks Local, then Enclosing function scopes, then Global (module), then Built-ins, and stops at the first hit. Assignment inside a function always creates a local unless you declare `global name` (bind in module scope) or `nonlocal name` (bind in the nearest enclosing function). The infamous `UnboundLocalError` happens when you read a global and then assign to the same name inside one function; the compiler marks the name local for the whole function, so the early read fails. Closures, decorators and callback factories rely on the Enclosing scope, which is why `nonlocal` exists.

**Q: What makes a function "pure" and why does it matter for testing?**
A pure function's output depends only on its arguments and it has no side effects: no printing, no file writes, no mutation of its inputs or global state. Pure functions are trivially unit-testable (`assert premium(250000) == 1437.5`), safe to cache with `functools.lru_cache`, and safe to run in parallel. In an automation pipeline you isolate the impure parts (reading files, sending email) at the edges and keep the calculation core pure, which is why a rate calculator should return a number rather than write to Excel directly.

## Modules, packages & virtual environments

A **module** is any `.py` file. A **package** is a folder containing modules and (usually) an `__init__.py`. `import` loads a module once, runs its top-level code, caches it in `sys.modules`, and binds a name in your namespace.

```python
import math                       # module object
from pathlib import Path          # one name
from collections import Counter, defaultdict
import datetime as dt             # alias
```

Prefer `import module` and `module.function()` in large codebases; it keeps the origin of every name obvious. `from module import *` pollutes the namespace and defeats linters, so avoid it outside the REPL.

### Writing your own module

Save this as `rates.py`:

```python
"""Title premium helpers."""
DEFAULT_RATE = 5.75

def premium(coverage, rate=DEFAULT_RATE):
    return max(coverage / 1000 * rate, 100.0)

if __name__ == "__main__":
    print(premium(250000))
```

In another file in the same folder, `import rates` then `rates.premium(98000)`. The `if __name__ == "__main__":` block runs only when the file is executed directly (`python rates.py`), not when it is imported, which lets one file be both a library and a script.

### Package layout

```text
docgen/
    __init__.py        # makes the folder a package; can re-export names
    rates.py
    reports/
        __init__.py
        weekly.py
```

Inside `weekly.py` you can write `from docgen.rates import premium` (absolute import, preferred) or `from ..rates import premium` (relative import, only works when run as part of the package via `python -m docgen.reports.weekly`).

### How Python finds modules

`sys.path` is the search list: the script's folder first, then `PYTHONPATH`, then the standard library, then `site-packages` where pip installs things. Naming your own file `csv.py` or `random.py` shadows the standard module and produces baffling `AttributeError` messages. Check with `print(module.__file__)`.

### The standard library tour

| Module | What it is for |
|---|---|
| `os`, `shutil`, `pathlib` | files, folders, paths |
| `csv`, `json`, `sqlite3` | tabular and structured data |
| `re` | regular expressions |
| `datetime`, `zoneinfo` | dates, times, time zones |
| `zipfile` | DOCX and EPUB are ZIP files |
| `logging`, `argparse` | production scripts |
| `itertools`, `functools`, `collections` | building blocks |
| `subprocess` | run LibreOffice or Pandoc from Python |

### Virtual environments

Every project should have its own isolated set of packages so that the `python-docx` version one client needs does not break another client's script. The built-in `venv` module creates one:

```bash
python -m venv .venv
.venv\Scripts\activate          # Windows PowerShell / cmd
source .venv/bin/activate       # macOS / Linux
python -m pip install python-docx openpyxl
python -m pip freeze > requirements.txt
```

Activation prepends `.venv/bin` (or `Scripts`) to your PATH, so `python` and `pip` now refer to the environment. Use `python -m pip` rather than bare `pip` to be certain you are installing into the interpreter you think you are. `pip install -r requirements.txt` recreates the environment on another machine. Add `.venv/` to `.gitignore`.

`pip list` shows what is installed, `pip show python-docx` its version and location, and `pip install "openpyxl>=3.1,<4"` pins a compatible range. Faster drop-in alternatives such as `uv` (`uv venv`, `uv pip install`) are gaining ground, and `pipx` installs command-line tools like `black` into their own isolated environments.

> **Warning:** Never `pip install` into the system Python on Linux or macOS; Debian and Homebrew now refuse with an "externally-managed-environment" error (PEP 668) precisely because it breaks OS tools. Always use a venv.

### Try It Yourself

```python
import sys, math, importlib, types

# a module is just an object with attributes
print(type(math), math.__name__)
print([n for n in dir(math) if n.startswith("is")])

# build a module at runtime to see what import does under the hood
src = '''
DEFAULT_RATE = 5.75
def premium(coverage, rate=DEFAULT_RATE):
    return max(coverage / 1000 * rate, 100.0)
'''
rates = types.ModuleType("rates")
exec(src, rates.__dict__)
sys.modules["rates"] = rates       # now it is importable
import rates as r
print(r.premium(250000), r is rates)

print("cached modules:", len(sys.modules))
print("first search path entry:", sys.path[0] or "(script folder)")
print("version:", sys.version_info.major, sys.version_info.minor)
```

### Quiz

1. When does the code under `if __name__ == "__main__":` run?
- [x] Only when the file is executed directly
- [ ] Every time the module is imported
- [ ] Never; it is a comment
> When imported, `__name__` is the module's name; when run as a script it is the string `"__main__"`.

2. What does `python -m venv .venv` create?
- [ ] A copy of the Python installer
- [x] An isolated folder with its own `site-packages` and interpreter link
- [ ] A requirements file
> A venv is a directory with its own package folder and activation scripts pointing at the base interpreter.

3. Why is naming your script `csv.py` a problem?
- [x] It shadows the standard library `csv` module on `sys.path`
- [ ] Python forbids the name
- [ ] It will be treated as a data file
> The script's folder is first on `sys.path`, so `import csv` finds your file instead of the library.

4. Which command guarantees pip installs into the active interpreter?
- [ ] `pip3 install`
- [x] `python -m pip install`
- [ ] `install pip`
> Running pip as a module of a specific `python` removes any ambiguity about which pip is on PATH.

### Exercises

1. **Bootstrap a project** — Write the shell commands to create a venv, install `python-docx` pinned to any 1.x version, and freeze the environment.
<details><summary>Solution</summary>

```bash
python -m venv .venv
source .venv/bin/activate      # or .venv\Scripts\activate on Windows
python -m pip install "python-docx>=1,<2"
python -m pip freeze > requirements.txt
```

</details>

2. **Dual-use module** — Write `pages.py` with a `pages_needed(rows, per_page=40)` function that also prints `pages_needed(1284)` when run directly but not when imported.
<details><summary>Solution</summary>

```python
def pages_needed(rows, per_page=40):
    return -(-rows // per_page)

if __name__ == "__main__":
    print(pages_needed(1284))
```

</details>

### Interview Questions

**Q: What happens when you write `import foo`?**
Python first checks `sys.modules`; if `foo` is already there it just binds the name. Otherwise it walks `sys.meta_path` finders, which search each entry of `sys.path` for `foo.py`, a `foo/` package or a compiled extension, creates a module object, stores it in `sys.modules` before executing (so circular imports see a partially initialised module rather than recursing forever), executes the file's top-level code in the module's namespace, and finally binds `foo` in the importer's namespace. Because execution happens once, module-level code is a natural place for one-time setup, and `importlib.reload` exists for the rare case you need to re-run it.

**Q: What is a circular import and how do you fix it?**
Module A imports B at the top, and B imports A at the top; whichever is imported second finds a half-initialised module in `sys.modules` and `from A import name` fails with `ImportError: cannot import name`. Fixes, from best to worst: restructure so shared code lives in a third module both import; use `import A` and access `A.name` at call time rather than `from A import name`; or move the import inside the function that needs it so it runs after both modules finish loading. Type-only imports can go under `if TYPE_CHECKING:` to break the cycle at runtime.

**Q: Why use virtual environments, and what is the difference between venv, virtualenv, conda and Poetry?**
A virtual environment isolates a project's dependencies so different projects can pin different versions and the system interpreter stays clean. `venv` is in the standard library and is enough for most work; `virtualenv` is the older third-party tool it was derived from, with a few extra features and faster creation. `conda` manages non-Python binaries too (BLAS, CUDA), which is why data science teams use it. Poetry, PDM, Hatch and `uv` add lock files and dependency resolution on top of a venv, giving reproducible installs across machines; `uv` in particular is now common because it is dramatically faster than pip.

## Files & paths

Almost every automation job starts by reading files and ends by writing them. Python's `pathlib` module gives you an object-oriented path type that works identically on Windows and Linux, and the `open()` built-in reads and writes file contents.

### Paths with pathlib

```python
from pathlib import Path

root = Path.home() / "Documents" / "clients"
sop = root / "acme" / "SOP_v3.docx"
print(sop.name)        # SOP_v3.docx
print(sop.stem)        # SOP_v3
print(sop.suffix)      # .docx
print(sop.parent)      # .../clients/acme
print(sop.exists())    # False on this machine
print(sop.with_suffix(".pdf"))
```

The `/` operator joins path parts and inserts the correct separator. `Path.cwd()` is the working directory, `Path(__file__).parent` is the folder of the running script, and `Path("~/x").expanduser()` resolves the tilde. Use raw strings for Windows literals: `Path(r"C:\Users\Ali")`.

### Listing and creating

```python
out = Path("output")
out.mkdir(parents=True, exist_ok=True)
for p in Path("input").glob("*.docx"):        # non-recursive
    print(p)
for p in Path("input").rglob("*.pdf"):        # recursive
    print(p.stat().st_size, p)
```

`mkdir(exist_ok=True)` avoids the error when the folder already exists. `shutil.copy2`, `shutil.move` and `p.unlink()` (delete a file) cover the rest.

### Reading and writing text

```python
text = Path("notes.txt").read_text(encoding="utf-8")
Path("out.txt").write_text("done\n", encoding="utf-8")

with open("log.txt", "a", encoding="utf-8") as f:     # a = append
    f.write("batch complete\n")

with open("big.txt", encoding="utf-8") as f:
    for line in f:                                     # streams line by line
        if "ERROR" in line:
            print(line.rstrip())
```

The `with` statement is a **context manager**: it closes the file when the block ends, even if an exception is raised. Modes are `"r"` (read, default), `"w"` (write, truncates), `"a"` (append), `"x"` (create, fail if exists) plus `"b"` for binary. Always pass `encoding`; the platform default on Windows is often cp1252 and produces mojibake for anything outside Latin-1.

### CSV

```python
import csv

with open("production.csv", newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        print(row["state"], int(row["files"]))

with open("summary.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["state", "files"])
    writer.writeheader()
    writer.writerow({"state": "TX", "files": 1284})
```

`newline=""` is required by the `csv` module so it can handle line endings itself; without it Windows produces blank rows between records. `DictReader` uses the header row as keys; every value is a string until you convert it. For Excel-exported files with a BOM use `encoding="utf-8-sig"`.

### JSON

```python
import json

config = {"client": "Acme", "fields": 168, "final": True, "reviewer": None}
Path("config.json").write_text(json.dumps(config, indent=2), encoding="utf-8")
loaded = json.loads(Path("config.json").read_text(encoding="utf-8"))
print(loaded["fields"] + 1)
```

`json.dumps` converts to a string, `json.dump(obj, file)` writes to a file object; `loads`/`load` are the reverse. `True` becomes `true`, `None` becomes `null`, and tuples become lists. Dates and `Decimal` are not serialisable by default; pass `default=str` or convert first. `ensure_ascii=False` keeps Urdu or accented text readable in the file.

### Binary files and ZIPs

DOCX, XLSX, PPTX and EPUB files are ZIP archives of XML. You can inspect one without any third-party library:

```python
import zipfile
with zipfile.ZipFile("handbook.docx") as z:
    print(z.namelist()[:5])
    xml = z.read("word/document.xml")[:200]
```

> **Tip:** Write to a temporary file and then `os.replace(tmp, final)` when overwriting a report that other people open. `os.replace` is atomic on the same volume, so a crash halfway never leaves a half-written file.

### Try It Yourself

```python
import csv, json, tempfile
from pathlib import Path

work = Path(tempfile.mkdtemp()) / "reports"
work.mkdir(parents=True, exist_ok=True)

rows = [{"state": "TX", "agent": "Sara", "files": 42},
        {"state": "WY", "agent": "Bilal", "files": 7},
        {"state": "TX", "agent": "Hina", "files": 38}]

csv_path = work / "production.csv"
with csv_path.open("w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["state", "agent", "files"])
    w.writeheader()
    w.writerows(rows)

totals = {}
with csv_path.open(newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        totals[row["state"]] = totals.get(row["state"], 0) + int(row["files"])

json_path = work / "totals.json"
json_path.write_text(json.dumps(totals, indent=2), encoding="utf-8")

for p in sorted(work.iterdir()):
    print(f"{p.name:<16}{p.stat().st_size:>6} bytes")
print(json_path.read_text())
print(json.loads(json_path.read_text()) == totals)
```

### Quiz

1. What does `Path("a") / "b" / "c.txt"` produce?
- [x] A path `a/b/c.txt` with the right separator for the OS
- [ ] A string `"a/b/c.txt"` always with forward slashes
- [ ] An error because `/` only works on numbers
> `Path` overloads `/` to join segments and renders with `\` on Windows and `/` elsewhere.

2. Why pass `newline=""` when opening a file for the `csv` module?
- [ ] To remove empty lines from the data
- [x] So the csv module controls line endings and Windows does not double them
- [ ] It enables Unicode
> Without it, the text layer translates `\n` to `\r\n` and csv writes `\r\r\n`, producing blank rows in Excel.

3. Which mode creates a new file and fails if it already exists?
- [ ] `"w"`
- [ ] `"a"`
- [x] `"x"`
> `"x"` is exclusive creation, useful for never overwriting a client deliverable by accident.

4. What does `json.dumps({"a": None})` return?
- [x] `'{"a": null}'`
- [ ] `'{"a": None}'`
- [ ] `'{"a": ""}'`
> JSON has no `None`; the encoder maps it to `null`, and `True` to `true`.

### Exercises

1. **Rename batch** — For every `.docx` in a folder, write the code that renames `Name_FINAL.docx` to `Name.docx` using pathlib only.
<details><summary>Solution</summary>

```python
from pathlib import Path
for p in Path("deliverables").glob("*_FINAL.docx"):
    p.rename(p.with_name(p.name.replace("_FINAL", "")))
```

</details>

2. **CSV to JSON** — Read `production.csv` with columns `state,files` and write `production.json` as a list of objects with `files` as an integer.
<details><summary>Solution</summary>

```python
import csv, json
from pathlib import Path
with open("production.csv", newline="", encoding="utf-8") as f:
    data = [{"state": r["state"], "files": int(r["files"])} for r in csv.DictReader(f)]
Path("production.json").write_text(json.dumps(data, indent=2), encoding="utf-8")
```

</details>

3. **Largest files** — Print the five largest files under a folder tree with sizes in MB.
<details><summary>Solution</summary>

```python
from pathlib import Path
files = [p for p in Path("clients").rglob("*") if p.is_file()]
for p in sorted(files, key=lambda p: p.stat().st_size, reverse=True)[:5]:
    print(f"{p.stat().st_size / 1_048_576:8.2f} MB  {p}")
```

</details>

### Interview Questions

**Q: Why should you use `with open(...)` instead of calling `open()` and `close()` yourself?**
`with` guarantees the file is closed when the block exits, whether normally or via an exception or `return`. Without it, an exception between open and close leaks a file handle, and on Windows a still-open file cannot be renamed or deleted, which is a classic cause of "file in use" failures in batch jobs. Under the hood `with` calls the object's `__enter__` and `__exit__`, the same protocol used by locks, database transactions and `tempfile` objects.

**Q: How would you process a 5 GB CSV export without running out of memory?**
Stream it: iterate the file object line by line (or with `csv.reader`) so only one row is in memory at a time, aggregate into small dictionaries, and write results as you go. Avoid `read()`, `readlines()` and `list(reader)`, which load everything. If you need pandas, use `pd.read_csv(path, chunksize=100_000)` and process each chunk, or use `usecols` and `dtype` to shrink each row. For repeated queries, load it once into SQLite or Parquet instead of re-parsing text.

**Q: What is the difference between `os.path` and `pathlib`?**
`os.path` is a module of string functions (`join`, `splitext`, `basename`) that predates Python 3.4; `pathlib` provides `Path` objects with those operations as methods and properties, plus `read_text`, `glob`, `mkdir` and `exists`. `pathlib` code is shorter and less error-prone (no forgotten separators), and most standard library functions accept `Path` objects via the `os.PathLike` protocol. You still meet `os.path` in older code and in a few APIs that require strings, where `str(path)` converts.

**Q: What is a text encoding and why does `UnicodeDecodeError` happen?**
An encoding is the rule that maps bytes on disk to Unicode characters. UTF-8 is the modern standard, but Windows applications often write cp1252, and Excel adds a byte order mark to "CSV UTF-8" exports. `UnicodeDecodeError` means the bytes are not valid for the encoding you asked for, typically because you left the default and the platform default differs. Fixes: always pass `encoding="utf-8"` (or `"utf-8-sig"` for BOM files), detect with the `charset-normalizer` package when files come from unknown sources, and use `errors="replace"` only for logs where losing a character is acceptable.

## Errors & exceptions

When something goes wrong at runtime, Python raises an **exception**: an object describing the problem that unwinds the call stack until something catches it. Uncaught, it prints a traceback and stops the program. Handling exceptions well is the difference between a script that crashes at 2 a.m. on file 812 of 1,284 and one that logs the problem and moves on.

### try / except

```python
try:
    files = int("12 files")
except ValueError as err:
    print("bad number:", err)
    files = 0
```

Python runs the `try` block; if a `ValueError` occurs it jumps to the matching `except`. `err` is the exception object; `str(err)` gives its message. Catch only what you expect: a bare `except:` also swallows `KeyboardInterrupt` and `SystemExit`, which makes scripts impossible to stop.

### Multiple handlers, else and finally

```python
try:
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
except FileNotFoundError:
    data = {}
except (PermissionError, json.JSONDecodeError) as err:
    raise SystemExit(f"cannot read {path}: {err}")
else:
    print("loaded", len(data), "keys")      # runs only if no exception
finally:
    print("finished attempt")               # always runs
```

`else` keeps the happy-path code out of the `try` so you do not accidentally catch its errors. `finally` runs no matter what, which is where cleanup goes when a context manager is not available.

### The exception hierarchy

| Exception | Raised when |
|---|---|
| `ValueError` | right type, wrong value: `int("x")` |
| `TypeError` | wrong type: `"a" + 1` |
| `KeyError` / `IndexError` | missing dict key / list index |
| `FileNotFoundError`, `PermissionError` | file problems (subclasses of `OSError`) |
| `ZeroDivisionError` | `x / 0` |
| `AttributeError` | `None.upper()` |
| `StopIteration` | iterator exhausted |

All of these inherit from `Exception`, which inherits from `BaseException`. Catching `Exception` catches everything a normal program should handle while letting Ctrl+C through. `KeyError` and `IndexError` both inherit from `LookupError`, so one handler can cover both.

### Raising your own

```python
def premium(coverage):
    if coverage <= 0:
        raise ValueError(f"coverage must be positive, got {coverage}")
    return coverage / 1000 * 5.75
```

Define custom exceptions for your domain so callers can distinguish your errors from library errors:

```python
class DocumentError(Exception):
    """Base for all docgen problems."""

class MissingFieldError(DocumentError):
    def __init__(self, field):
        super().__init__(f"required field missing: {field}")
        self.field = field
```

Inside an `except` block, `raise` alone re-raises the current exception with its traceback intact. `raise NewError("context") from err` chains the original as the cause, which prints both tracebacks and is what you want when wrapping a library error in your own type. `from None` suppresses the chain.

### EAFP versus LBYL

Python culture prefers "Easier to Ask Forgiveness than Permission": try the operation and handle the exception, rather than "Look Before You Leap" with checks that can race. `try: value = d[key] except KeyError:` is idiomatic where Java would write `if key in d`. For dictionaries `d.get(key, default)` is even shorter.

### Assertions and warnings

`assert condition, "message"` raises `AssertionError` and is for catching programmer mistakes during development; the `-O` flag strips assertions, so never use them to validate user input. The `warnings` module issues `DeprecationWarning` and friends without stopping execution.

> **Warning:** Do not silence errors with `except Exception: pass`. At minimum log the traceback with `logging.exception("context")` so the failure is visible in the job log.

### Try It Yourself

```python
import json

class DocumentError(Exception):
    """Base class for our pipeline errors."""

class MissingFieldError(DocumentError):
    def __init__(self, field):
        super().__init__(f"required field missing: {field}")
        self.field = field

def load_config(text):
    try:
        cfg = json.loads(text)
    except json.JSONDecodeError as err:
        raise DocumentError("config is not valid JSON") from err
    for field in ("client", "fields"):
        if field not in cfg:
            raise MissingFieldError(field)
    return cfg

samples = ['{"client": "Acme", "fields": 168}', '{"client": "Acme"}', '{oops}']
for s in samples:
    try:
        cfg = load_config(s)
    except MissingFieldError as err:
        print("missing:", err.field)
    except DocumentError as err:
        print("document error:", err, "| cause:", type(err.__cause__).__name__)
    else:
        print("ok:", cfg)
    finally:
        print("--")

# EAFP in action
rates = {"TX": 5.75}
for state in ("TX", "CA"):
    try:
        print(state, rates[state])
    except KeyError:
        print(state, "no rate on file")
```

### Quiz

1. Which block runs only when the `try` block raised no exception?
- [ ] `finally`
- [x] `else`
- [ ] `except`
> `else` is for the success path; `finally` runs in every case.

2. What does a bare `raise` inside an `except` block do?
- [x] Re-raises the current exception with its original traceback
- [ ] Raises a new generic `Exception`
- [ ] Ends the program silently
> A bare `raise` is the correct way to log an error and let it propagate unchanged.

3. Why is `except:` with no type discouraged?
- [ ] It is a syntax error in Python 3
- [x] It also catches `KeyboardInterrupt` and `SystemExit`
- [ ] It only catches `ValueError`
> Those two inherit from `BaseException`, so a bare except makes a script impossible to stop with Ctrl+C.

4. What does `raise B("x") from a` do?
- [x] Sets `a` as the `__cause__` of the new exception so both tracebacks print
- [ ] Replaces `a` with `B` in the call stack
- [ ] Suppresses `a` entirely
> Explicit chaining documents that the new error was caused by the old one; `from None` hides the chain.

### Exercises

1. **Safe int** — Write `to_int(text, default=0)` that returns the integer in `text` or the default, handling both `ValueError` and `TypeError` (for `None`).
<details><summary>Solution</summary>

```python
def to_int(text, default=0):
    try:
        return int(text)
    except (ValueError, TypeError):
        return default

print(to_int("42"), to_int("12 pages"), to_int(None))
```

</details>

2. **Retry** — Write `retry(func, attempts=3)` that calls `func()`, retries on `OSError`, and re-raises after the last attempt.
<details><summary>Solution</summary>

```python
def retry(func, attempts=3):
    for n in range(1, attempts + 1):
        try:
            return func()
        except OSError as err:
            print(f"attempt {n} failed: {err}")
            if n == attempts:
                raise
```

</details>

3. **Validate a record** — Raise a custom `RateError` with the row number if a rate is missing or not positive in `[("TX", 5.75), ("WY", None), ("FL", -1)]`.
<details><summary>Solution</summary>

```python
class RateError(ValueError):
    pass

rows = [("TX", 5.75), ("WY", None), ("FL", -1)]
for n, (state, rate) in enumerate(rows, start=1):
    try:
        if rate is None or rate <= 0:
            raise RateError(f"row {n}: invalid rate for {state}: {rate!r}")
    except RateError as err:
        print(err)
```

</details>

### Interview Questions

**Q: What is the difference between an error and an exception in Python, and what is the hierarchy?**
In Python everything raised is an exception object; "error" is just the naming convention for most built-in classes. The root is `BaseException`, with `SystemExit`, `KeyboardInterrupt` and `GeneratorExit` directly under it, and `Exception` as the parent of everything a program should normally catch: `ValueError`, `TypeError`, `LookupError` (`KeyError`, `IndexError`), `OSError` (`FileNotFoundError`, `PermissionError`), `ArithmeticError` (`ZeroDivisionError`) and so on. Custom exceptions subclass `Exception` or a more specific class so that callers can catch broad or narrow as needed.

**Q: Explain EAFP versus LBYL and why Python prefers EAFP.**
Look Before You Leap checks preconditions first (`if os.path.exists(p): open(p)`), while Easier to Ask Forgiveness than Permission attempts the operation and handles the exception. EAFP is preferred because it avoids race conditions (the file could vanish between the check and the open), it is often faster when the failure is rare since a `try` costs almost nothing in CPython unless an exception is raised, and it works with duck typing where you cannot enumerate every valid type. LBYL is still right when the check is cheap and the failure would be expensive or have side effects, such as validating a whole batch before writing any output.

**Q: How do you handle errors in a long-running batch job that processes thousands of files?**
Wrap the per-file work in a `try`/`except Exception` inside the loop so one bad file does not kill the batch, log the failure with `logging.exception` to capture the traceback, append the file name and error to a failures list, and continue. At the end write a summary report with counts of succeeded and failed items and exit with a non-zero status if anything failed so the scheduler notices. Let truly fatal problems such as a missing output folder or `KeyboardInterrupt` propagate immediately, and make the job idempotent so you can re-run it for just the failed files.

**Q: What does `finally` guarantee, and how does it interact with `return`?**
`finally` runs whenever control leaves the `try` statement: after normal completion, after a handled or unhandled exception, and even when the `try` or `except` block executes `return`, `break` or `continue`. If `finally` itself returns a value, it overrides the earlier return and silently discards any in-flight exception, which linters flag because it hides errors. Its purpose is cleanup that must happen regardless of outcome, such as releasing a lock or deleting a temp file, and context managers are the reusable form of the same guarantee.

# LEVEL: Advanced

## Comprehensions & generators

A **comprehension** builds a collection from an iterable in a single expression. It replaces the three-line "create empty list, loop, append" pattern with one readable line, and CPython runs it faster because the append happens in C.

```python
sizes = [12, 40, 135, 767]
doubled = [n * 2 for n in sizes]                    # list
large = [n for n in sizes if n > 100]               # with filter
labels = {n: "big" if n > 100 else "small" for n in sizes}   # dict
states = {row[0] for row in production}             # set
pairs = [(a, b) for a in "xy" for b in (1, 2)]      # nested: x1 x2 y1 y2
```

Read a comprehension from left to right as an English sentence: "n times 2, for each n in sizes, if n is greater than 100". The `if` filter comes after the loop; a conditional expression (`a if c else b`) goes before it. Two `for` clauses nest in the same order as nested loops would.

### When not to use one

If you need more than one `if`, more than two `for` clauses, or a `try`, write a normal loop. Comprehensions are for transforming data, not for side effects such as printing or writing files; `[print(x) for x in xs]` builds a useless list of `None`.

### Generator expressions

Swap the square brackets for round ones and you get a **generator expression**, which produces values lazily, one at a time, instead of building the whole list in memory.

```python
total = sum(n * 2 for n in sizes)                   # no list created
first_big = next(n for n in sizes if n > 100)        # 135
any_pdf = any(p.suffix == ".pdf" for p in paths)
```

When a generator expression is the only argument to a function call you can drop the extra brackets. Use a generator whenever the consumer only needs to iterate once: `sum`, `max`, `any`, `all`, `", ".join(...)`, `for` loops, or writing to a file.

### Generator functions

A function containing `yield` is a **generator function**. Calling it does not run the body; it returns a generator object. Each `next()` runs until the next `yield`, hands the value out, and freezes the function's local state until the next request.

```python
def read_records(path):
    with open(path, encoding="utf-8") as f:
        next(f)                        # skip header
        for line in f:
            state, files = line.rstrip("\n").split(",")
            yield state, int(files)

for state, files in read_records("production.csv"):
    ...
```

This reads a multi-gigabyte file with constant memory, and the `with` block closes the file when the generator is exhausted or garbage collected. Generators are single-use: once exhausted, iterating again yields nothing; call the function again for a fresh one.

### Pipelines

Because generators consume iterables and produce iterables, you can chain them like Unix pipes:

```python
lines = (l.rstrip() for l in open("log.txt"))
errors = (l for l in lines if "ERROR" in l)
codes = (l.split()[2] for l in errors)
print(Counter(codes).most_common(3))
```

Nothing happens until `Counter` starts pulling values; then each line flows through all three stages before the next line is read. `yield from iterable` delegates to another generator, which is how you flatten nested structures or split a big generator into helpers.

### Sending values and closing

Generators are also coroutines in disguise: `gen.send(value)` resumes the generator and makes the `yield` expression evaluate to `value`, `gen.close()` raises `GeneratorExit` inside it so `finally` blocks run, and `gen.throw(exc)` raises an exception at the paused `yield`. This machinery is what `asyncio` was originally built on.

> **Interview note:** "What is the difference between a list comprehension and a generator expression?" Answer with memory and laziness: the list is built eagerly and can be indexed or iterated twice; the generator is computed on demand, uses constant memory, and can be consumed only once. Mention `sys.getsizeof` to prove it.

### Try It Yourself

```python
import sys
from collections import Counter

sizes = [12, 40, 135, 767, 3, 250]
print([n for n in sizes if n > 100])
print({n: ("big" if n > 100 else "small") for n in sizes})
print(sorted({n % 5 for n in sizes}))

squares_list = [n * n for n in range(100_000)]
squares_gen = (n * n for n in range(100_000))
print("list bytes:", sys.getsizeof(squares_list), "| generator bytes:", sys.getsizeof(squares_gen))
print("sum via generator:", sum(squares_gen))
print("second pass yields:", sum(squares_gen))   # exhausted -> 0

def batches(items, size):
    """Yield successive chunks of `size` items."""
    for i in range(0, len(items), size):
        yield items[i:i + size]

log = """INFO batch 1 ok
ERROR E102 timeout
INFO batch 2 ok
ERROR E102 timeout
ERROR E404 missing file""".splitlines()

codes = (line.split()[1] for line in log if line.startswith("ERROR"))
print(Counter(codes).most_common())
for n, chunk in enumerate(batches(list(range(1, 11)), 4), start=1):
    print("batch", n, chunk)
```

### Quiz

1. What does `[x for x in range(5) if x % 2]` produce?
- [ ] `[0, 2, 4]`
- [x] `[1, 3]`
- [ ] `[1, 3, 5]`
> `x % 2` is truthy for odd numbers, and `range(5)` stops at 4.

2. What is `sum(x for x in [1, 2, 3])` using?
- [x] A generator expression passed directly to `sum`
- [ ] A tuple comprehension
- [ ] A list comprehension without brackets
> There is no tuple comprehension; parentheses around a comprehension make a lazy generator.

3. What happens the second time you iterate over an exhausted generator?
- [ ] It restarts from the beginning
- [x] It yields nothing
- [ ] It raises `ValueError`
> Generators keep their position; after `StopIteration` they stay finished.

4. What does calling a generator function do?
- [ ] Runs the body until the first `yield`
- [x] Returns a generator object without running any body code
- [ ] Returns a list of all yielded values
> Execution starts only when `next()` is called, which is what makes generators lazy.

### Exercises

1. **Flatten** — Turn `[[1, 2], [3], [4, 5, 6]]` into `[1, 2, 3, 4, 5, 6]` with one comprehension.
<details><summary>Solution</summary>

```python
nested = [[1, 2], [3], [4, 5, 6]]
print([x for sub in nested for x in sub])
```

</details>

2. **Fibonacci generator** — Write `fib()` that yields Fibonacci numbers forever, then print the first ten with `itertools.islice`.
<details><summary>Solution</summary>

```python
from itertools import islice
def fib():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b
print(list(islice(fib(), 10)))
```

</details>

3. **Running total** — Write a generator `running_total(values)` that yields the cumulative sum, and test it on `[10, 20, 30]`.
<details><summary>Solution</summary>

```python
def running_total(values):
    total = 0
    for v in values:
        total += v
        yield total
print(list(running_total([10, 20, 30])))   # [10, 30, 60]
```

</details>

### Interview Questions

**Q: What is the difference between a list comprehension and a generator expression?**
A list comprehension evaluates eagerly and returns a list that lives in memory, so it can be indexed, sliced, measured with `len` and iterated repeatedly. A generator expression returns an iterator that computes each item on demand, uses a few dozen bytes regardless of length, and is exhausted after one pass. Choose the list when you need random access or multiple passes, and the generator when feeding a single consumer such as `sum`, `join`, a `for` loop or a file writer. For a million rows the list version can use tens of megabytes while the generator uses almost none.

**Q: How does `yield` work internally?**
When the compiler sees `yield` in a function it marks it as a generator: calling the function creates a generator object holding a suspended frame instead of running the code. Each `next()` resumes the frame at the last `yield`, runs until the next one, and returns the yielded value; local variables and the instruction pointer survive between calls because the frame is kept alive on the heap rather than the stack. When the function returns, `StopIteration` is raised with the return value attached. This is also why generators are cheap to create and why `yield from` and `async`/`await` could be built on the same frame-suspension mechanism.

**Q: When would you avoid a comprehension?**
When it hurts readability: more than two `for` clauses, nested conditionals, or long expressions that need intermediate names. When you need side effects such as logging or writing per item, because a comprehension that discards its result misleads the reader. When exception handling is required per item, since there is no `try` inside a comprehension. And when the result would be huge and consumed once, where a generator or a plain loop with streaming output is more memory-efficient.

## Decorators & closures

A **closure** is a function that remembers variables from the scope where it was created, even after that scope has finished. A **decorator** is a function that takes a function and returns a new one, usually a closure that wraps the original with extra behaviour. Together they let you add timing, logging, caching, retries and access checks without touching the wrapped code.

### Closures

```python
def make_multiplier(factor):
    def multiply(x):
        return x * factor      # factor is captured from the enclosing scope
    return multiply

per_thousand = make_multiplier(5.75)
print(per_thousand(250))       # 1437.5
print(per_thousand.__closure__[0].cell_contents)   # 5.75
```

`multiply` keeps a reference to `factor` in a **cell** object. Each call to `make_multiplier` produces an independent closure. To rebind a captured variable rather than just read it you need `nonlocal`, as in the counter example from the Functions chapter.

### A first decorator

```python
import functools, time

def timed(func):
    @functools.wraps(func)          # copies name, docstring, annotations
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.perf_counter() - start:.3f}s")
        return result
    return wrapper

@timed
def build_report(rows):
    return sum(rows)
```

The `@timed` line is exactly equivalent to `build_report = timed(build_report)`. It runs once, at definition time, and replaces the name with the wrapper. `functools.wraps` matters: without it `build_report.__name__` becomes `"wrapper"`, which breaks logging, pickling and documentation tools.

### Decorators with arguments

A decorator that takes its own parameters needs one more layer: a **decorator factory** that returns the real decorator.

```python
def retry(times=3, exceptions=(OSError,)):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as err:
                    if attempt == times:
                        raise
                    print(f"{func.__name__} attempt {attempt} failed: {err}")
        return wrapper
    return decorator

@retry(times=5)
def download(url): ...
```

`@retry(times=5)` first calls `retry(times=5)` to get `decorator`, then applies it to `download`.

### Stacking and ordering

```python
@timed
@retry()
def convert(path): ...
```

Decorators apply bottom-up: `convert = timed(retry()(convert))`, so the timer measures all retries together. Reverse the order and each attempt is timed separately.

### Decorators from the standard library

| Decorator | Effect |
|---|---|
| `@functools.lru_cache(maxsize=128)` / `@functools.cache` | memoise return values by arguments |
| `@functools.wraps(f)` | preserve metadata on wrappers |
| `@property`, `@staticmethod`, `@classmethod` | method kinds on classes |
| `@dataclasses.dataclass` | generate `__init__`, `__repr__`, `__eq__` |
| `@contextlib.contextmanager` | turn a generator into a `with` manager |
| `@functools.singledispatch` | overload by first argument type |

`@lru_cache` is the one interviewers ask about: it wraps the function in a dictionary keyed by the (hashable) arguments and returns the stored result on repeat calls, which turns exponential recursive Fibonacci into linear time.

### Class-based decorators and decorating classes

Any callable can be a decorator. A class with `__call__` can hold state, such as a call counter. Decorators can also be applied to classes; `@dataclass` is the famous example, and a registry decorator that stores each decorated class in a dictionary is a common plugin pattern:

```python
CONVERTERS = {}
def register(ext):
    def deco(cls):
        CONVERTERS[ext] = cls
        return cls
    return deco

@register(".docx")
class DocxConverter: ...
```

> **Tip:** Keep decorators generic: accept `*args, **kwargs`, return whatever the wrapped function returns, and never swallow exceptions silently. A decorator that changes the return type is a trap for every future caller.

### Try It Yourself

```python
import functools, time

CALLS = {}

def counted(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        CALLS[func.__name__] = CALLS.get(func.__name__, 0) + 1
        return func(*args, **kwargs)
    return wrapper

def retry(times=3):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except ValueError as err:
                    print(f"  attempt {attempt}: {err}")
                    if attempt == times:
                        raise
        return wrapper
    return decorator

attempts = iter([ValueError("locked"), ValueError("locked"), "converted"])

@counted
@retry(times=3)
def convert(name):
    outcome = next(attempts)
    if isinstance(outcome, Exception):
        raise outcome
    return f"{name} -> {outcome}"

print(convert("handbook.docx"))
print("name preserved:", convert.__name__, "| calls:", CALLS)

@functools.lru_cache(maxsize=None)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

t = time.perf_counter()
print("fib(80) =", fib(80), "| cache:", fib.cache_info(), f"| {time.perf_counter() - t:.4f}s")
```

### Quiz

1. `@deco` above `def f(): ...` is equivalent to what?
- [x] `f = deco(f)`
- [ ] `deco = f(deco)`
- [ ] `f = deco()`
> The decorator syntax applies `deco` to the function object and rebinds the name to the result.

2. Why use `functools.wraps` in a decorator?
- [ ] It makes the wrapper faster
- [x] It copies the original function's name, docstring and metadata onto the wrapper
- [ ] It is required or the decorator will not run
> Without it, `help()`, logging and tools that inspect `__name__` see `wrapper` instead of the real function.

3. In `@a` stacked over `@b` over `def f`, which decorator is applied first?
- [ ] `a`
- [x] `b`
- [ ] They run at the same time
> Decorators apply from the bottom up: `f = a(b(f))`.

4. What does `@functools.lru_cache` require of the function's arguments?
- [x] They must be hashable
- [ ] They must be integers
- [ ] There must be exactly one argument
> The cache is a dictionary keyed by the arguments, so lists and dicts as arguments raise `TypeError`.

### Exercises

1. **Logging decorator** — Write `@logged` that prints the function name and its arguments before each call and the result after.
<details><summary>Solution</summary>

```python
import functools
def logged(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"-> {func.__name__}{args}{kwargs or ''}")
        result = func(*args, **kwargs)
        print(f"<- {result!r}")
        return result
    return wrapper

@logged
def premium(coverage, rate=5.75):
    return coverage / 1000 * rate
premium(250000, rate=6)
```

</details>

2. **Rate limiter** — Write `@once` that lets a function run only the first time and returns the cached result on later calls, using a closure with `nonlocal`.
<details><summary>Solution</summary>

```python
import functools
def once(func):
    done, value = False, None
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        nonlocal done, value
        if not done:
            value, done = func(*args, **kwargs), True
        return value
    return wrapper

@once
def load_rates():
    print("loading...")
    return {"TX": 5.75}
print(load_rates(), load_rates())
```

</details>

### Interview Questions

**Q: What is a decorator and how does it work?**
A decorator is a callable that takes a function (or class) and returns a replacement, and the `@name` syntax is sugar for `f = name(f)` executed right after the `def`. Most decorators return a closure that calls the original with `*args, **kwargs` and adds behaviour before or after: timing, logging, caching, authentication, retries. Decorators with parameters are factories that return the actual decorator, which is why `@retry(times=3)` has parentheses and `@timed` does not. Good decorators use `functools.wraps` to preserve metadata and stay transparent about return values and exceptions.

**Q: What is a closure and where do closures appear in everyday Python?**
A closure is an inner function that captures free variables from its enclosing scope, kept alive in cell objects after the outer function returns. They appear in decorators (the wrapper captures `func`), callback factories, `functools.partial`-style helpers, and any time you return a lambda that refers to a loop variable. That last case is the classic bug: `[lambda: i for i in range(3)]` all return 2 because they share one cell that ends at 2; the fix is a default argument `lambda i=i: i` which binds the value at creation time.

**Q: How does `functools.lru_cache` work and what are its limitations?**
It wraps the function in a dictionary that maps the argument tuple (and sorted keyword items) to the return value, evicting the least recently used entry when `maxsize` is exceeded; `maxsize=None` (or `@functools.cache`) never evicts. Arguments must be hashable, so lists and dicts cannot be cached, and `1` and `1.0` share an entry because they compare equal. The cache is per-function and process-wide, so on methods it keeps `self` alive and grows with every instance, which is a memory leak in long-running services; `cache_info()` and `cache_clear()` help you monitor and reset it. It is ideal for pure functions with a small argument space such as rate lookups or recursive calculations.

## Iterators, itertools & functools

The **iterator protocol** is the contract behind every `for` loop. An **iterable** is any object whose `__iter__()` returns an iterator; an **iterator** is an object with `__next__()` that produces the next value or raises `StopIteration`. Lists, dicts, strings and files are iterables; generators are iterators.

```python
files = ["a.docx", "b.docx"]
it = iter(files)          # calls files.__iter__()
print(next(it))           # a.docx
print(next(it))           # b.docx
print(next(it, "done"))   # default instead of StopIteration
```

A `for` loop does exactly this: obtain an iterator, call `next` until `StopIteration`, then stop. Iterators are also iterables (their `__iter__` returns themselves), which is why you can loop over a generator.

### Writing a class-based iterator

```python
class Countdown:
    def __init__(self, start):
        self.current = start
    def __iter__(self):
        return self
    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        self.current -= 1
        return self.current + 1

print(list(Countdown(3)))    # [3, 2, 1]
```

In practice a generator function does the same job in four lines, so class-based iterators are reserved for cases where you need extra methods or state inspection.

### itertools: the iterator toolbox

| Function | Example | Yields |
|---|---|---|
| `count(10, 2)` | infinite | 10, 12, 14, ... |
| `cycle("AB")` | infinite | A, B, A, B, ... |
| `repeat(0, 3)` | | 0, 0, 0 |
| `chain(a, b)` | `chain([1], [2, 3])` | 1, 2, 3 |
| `islice(it, 5)` | | first five items |
| `zip_longest(a, b, fillvalue="")` | | pairs, padding the shorter |
| `groupby(rows, key)` | requires sorted input | (key, group iterator) |
| `accumulate([1, 2, 3])` | | 1, 3, 6 |
| `product("AB", [1, 2])` | | A1, A2, B1, B2 |
| `combinations("ABC", 2)` | | AB, AC, BC |
| `permutations("ABC", 2)` | | AB, AC, BA, BC, CA, CB |
| `batched(it, 3)` | Python 3.12+ | tuples of three |
| `pairwise(it)` | Python 3.10+ | (a, b), (b, c), ... |

`groupby` is the one that bites people: it groups **consecutive** equal keys, so sort by the same key first or you get fragmented groups.

```python
from itertools import groupby
rows = sorted(production, key=lambda r: r[0])
for state, group in groupby(rows, key=lambda r: r[0]):
    print(state, sum(r[2] for r in group))
```

### functools: functions that make functions

`functools.partial` freezes some arguments of a function, producing a new callable, which is cleaner than a lambda when passing callbacks:

```python
from functools import partial, reduce
to_cents = partial(round, ndigits=2)
print(to_cents(1437.5049))          # 1437.5
print(reduce(lambda a, b: a * b, [1, 2, 3, 4]))   # 24
```

`reduce` folds a sequence into one value; for sums and products prefer `sum` and `math.prod`, and keep `reduce` for genuinely custom folds. `functools.singledispatch` turns a function into a generic function that picks an implementation by the type of its first argument, a tidy alternative to `isinstance` chains when exporting `Decimal`, `date` and `Path` objects to JSON. `functools.cached_property` computes an attribute once per instance and stores it, ideal for an expensive `page_count` on a document object. `functools.total_ordering` fills in the missing comparison methods when you define `__eq__` and one of `__lt__`, `__le__`, `__gt__`, `__ge__`.

### Built-ins that consume iterators

`enumerate`, `zip`, `map`, `filter`, `reversed`, `sorted`, `min`, `max`, `sum`, `any`, `all` all accept any iterable and most return lazy iterators themselves. `zip` stops at the shortest input; pass `strict=True` (3.10+) to raise if lengths differ, which catches misaligned columns early.

> **Warning:** Iterators are consumed by inspection. `if any(it):` followed by `for x in it:` skips the elements `any` already pulled. Convert to a list first if you need to look twice.

### Try It Yourself

```python
from itertools import groupby, chain, islice, accumulate, count, pairwise
from functools import partial, reduce
from operator import itemgetter

production = [("Texas", "Sara", 42), ("Wyoming", "Bilal", 7), ("Texas", "Hina", 38),
              ("Florida", "Sara", 55), ("Texas", "Omar", 12), ("Florida", "Hina", 40)]

by_state = sorted(production, key=itemgetter(0))
for state, group in groupby(by_state, key=itemgetter(0)):
    rows = list(group)
    print(f"{state:<8} {len(rows)} batches, {sum(r[2] for r in rows)} files")

files = [r[2] for r in production]
print("cumulative:", list(accumulate(files)))
print("deltas:", [b - a for a, b in pairwise(files)])
print("ids:", list(islice(count(1001), 3)))
print("chained:", list(chain([1, 2], (3,), "ab")))

label = partial("{state}-{n:04d}".format, state="TX")
print(label(n=7), label(n=42))
print("largest via reduce:", reduce(lambda a, b: a if a[2] >= b[2] else b, production))

it = iter(files)
print("first two:", next(it), next(it), "| rest:", list(it), "| again:", list(it))
```

### Quiz

1. What must an object implement to be an iterator?
- [ ] `__len__` and `__getitem__`
- [x] `__iter__` returning itself and `__next__`
- [ ] Only `__next__`
> Iterators are iterables that return themselves from `__iter__` and produce values from `__next__` until `StopIteration`.

2. What does `itertools.groupby` require to group all equal keys together?
- [x] The input must be sorted by the same key
- [ ] The input must be a list, not a generator
- [ ] Nothing; it groups globally
> `groupby` only merges consecutive runs; unsorted input produces repeated keys.

3. What does `zip([1, 2, 3], "ab")` yield?
- [x] `(1, 'a')`, `(2, 'b')`
- [ ] `(1, 'a')`, `(2, 'b')`, `(3, None)`
- [ ] A `ValueError`
> `zip` stops at the shortest iterable unless you pass `strict=True` or use `zip_longest`.

4. What does `functools.partial(int, base=2)` return?
- [ ] The integer 2
- [x] A callable that parses binary strings
- [ ] A cached version of `int`
> `partial` pre-fills arguments, so `partial(int, base=2)("1010")` returns 10.

### Exercises

1. **Chunk a stream** — Write `chunked(iterable, n)` that works on any iterator (not just lists) and yields lists of up to `n` items, then test it on a generator.
<details><summary>Solution</summary>

```python
from itertools import islice
def chunked(iterable, n):
    it = iter(iterable)
    while chunk := list(islice(it, n)):
        yield chunk
print(list(chunked((x * x for x in range(10)), 4)))
```

</details>

2. **Report grouping** — Using `groupby`, print each agent with the total files across `production` rows.
<details><summary>Solution</summary>

```python
from itertools import groupby
from operator import itemgetter
production = [("Texas", "Sara", 42), ("Wyoming", "Bilal", 7), ("Florida", "Sara", 55)]
for agent, g in groupby(sorted(production, key=itemgetter(1)), key=itemgetter(1)):
    print(agent, sum(r[2] for r in g))
```

</details>

### Interview Questions

**Q: What is the difference between an iterable and an iterator?**
An iterable is anything you can loop over: it implements `__iter__` (or the legacy `__getitem__` with integer indexes) and returns a fresh iterator each time, so a list can be iterated many times. An iterator is the object doing the walking: it implements `__next__`, keeps its position, raises `StopIteration` when done, and returns itself from `__iter__`. Every iterator is an iterable but not vice versa; generators, file objects and the results of `map`, `zip` and `enumerate` are iterators and are therefore single-use, which is a frequent source of "my loop ran zero times the second time" bugs.

**Q: How would you implement a lazy pipeline that reads a large log, filters errors, and counts codes without loading the file?**
Chain generators: a file object yields lines lazily, a generator expression filters lines containing ERROR, another extracts the code, and `collections.Counter` consumes the final iterator one item at a time. Memory stays constant because each stage holds one element, and the file is closed by the `with` block once the consumer finishes. `itertools.islice` lets you test the pipeline on the first thousand lines, and `itertools.tee` can split the stream if two consumers need it, at the cost of buffering the difference between them.

**Q: When would you use `functools.partial` instead of a lambda?**
`partial` is explicit about which arguments are pre-bound, it keeps a reference to the underlying function and its bound arguments (`p.func`, `p.args`, `p.keywords`) for introspection, it pickles for multiprocessing where lambdas do not, and it evaluates its arguments once at creation rather than late-binding them like a lambda does in a loop. A lambda is better when you need to reorder arguments or compute something from them, because `partial` can only fill positions from the left and keywords by name.

## Classes, dataclasses & dunder methods

A **class** bundles data (attributes) and behaviour (methods) into a new type. You create **instances** by calling the class, and Python passes the instance as the first argument, conventionally named `self`, to every method.

```python
class Document:
    kind = "generic"                          # class attribute, shared

    def __init__(self, title, pages):         # initialiser, runs on creation
        self.title = title                    # instance attributes
        self.pages = pages

    def summary(self):
        return f"{self.title} ({self.pages} pages)"

sop = Document("Onboarding SOP", 12)
print(sop.summary(), Document.kind, sop.kind)
```

Attribute lookup checks the instance dictionary first, then the class, then parent classes, so a class attribute acts as a default that an instance can override.

### Inheritance and super()

```python
class PdfDocument(Document):
    kind = "pdf"
    def __init__(self, title, pages, encrypted=False):
        super().__init__(title, pages)
        self.encrypted = encrypted
    def summary(self):
        lock = " [locked]" if self.encrypted else ""
        return super().summary() + lock
```

`super()` calls the next class in the method resolution order (MRO), which for single inheritance is simply the parent. `isinstance(obj, Document)` is true for subclasses too; `type(obj) is Document` is not.

### Dunder methods

Double-underscore methods let your objects participate in Python's syntax. You never call them directly; the interpreter does.

| Method | Triggered by |
|---|---|
| `__repr__` | `repr(x)`, debugger, containers |
| `__str__` | `str(x)`, `print(x)` |
| `__eq__`, `__lt__` | `==`, `<`, sorting |
| `__hash__` | dict keys, sets |
| `__len__`, `__getitem__`, `__contains__` | `len(x)`, `x[i]`, `in` |
| `__iter__` | `for` loops |
| `__add__`, `__mul__` | `+`, `*` |
| `__enter__`, `__exit__` | `with` |
| `__call__` | `x()` |

Always define `__repr__`; it should look like the constructor call (`Document('SOP', 12)`) so that debugging output is unambiguous. If you define `__eq__`, Python sets `__hash__` to `None`, so define both if instances go into sets.

### Properties

`@property` turns a method into a read-only computed attribute, and the paired setter validates assignments:

```python
class Batch:
    def __init__(self, files):
        self._files = files
    @property
    def files(self):
        return self._files
    @files.setter
    def files(self, value):
        if value < 0:
            raise ValueError("files cannot be negative")
        self._files = value
    @property
    def pages(self):
        return -(-self._files // 40)
```

Start with a plain attribute and switch to a property only when you need validation; the calling code does not change.

### Dataclasses

Most classes are just containers for a few fields. `@dataclass` (3.7+) generates `__init__`, `__repr__` and `__eq__` from annotated fields:

```python
from dataclasses import dataclass, field

@dataclass(order=True, frozen=True)
class Policy:
    policy_no: str
    state: str
    coverage: float = 0.0
    riders: list[str] = field(default_factory=list)

    @property
    def premium(self):
        return max(self.coverage / 1000 * 5.75, 100.0)

p = Policy("TX-2026-0042", "TX", 250000)
print(p, p.premium, p == Policy("TX-2026-0042", "TX", 250000))
```

`order=True` adds comparison methods field by field; `frozen=True` makes instances immutable and hashable; `field(default_factory=list)` avoids the shared-mutable-default trap; `dataclasses.asdict(p)` converts to a dict for JSON, and `slots=True` (3.10+) cuts memory per instance. `typing.NamedTuple` is the lighter, tuple-based alternative, and `enum.Enum` covers fixed sets of constants such as document states.

### Class and static methods

`@classmethod` receives the class instead of the instance (`cls`) and is the idiom for alternative constructors like `Policy.from_csv_row(row)`. `@staticmethod` receives neither and is just a function namespaced inside the class. Both are covered in depth in the OOP course.

> **Interview note:** Be ready to explain `__slots__` (fixed attribute list, no per-instance `__dict__`, 30–50 percent less memory), why `__repr__` matters, and the difference between `__new__` (creates the instance) and `__init__` (initialises it).

### Try It Yourself

```python
from dataclasses import dataclass, field, asdict
import json

@dataclass(order=True)
class Policy:
    state: str
    policy_no: str
    coverage: float = 0.0
    riders: list = field(default_factory=list)

    @property
    def premium(self) -> float:
        return round(max(self.coverage / 1000 * 5.75, 100.0), 2)

    @classmethod
    def from_row(cls, row: str):
        state, no, cov = row.split(",")
        return cls(state, no, float(cov))

class Batch:
    def __init__(self, *policies):
        self._items = list(policies)
    def __len__(self):
        return len(self._items)
    def __iter__(self):
        return iter(self._items)
    def __getitem__(self, i):
        return self._items[i]
    def __add__(self, other):
        return Batch(*self._items, *other._items)
    def __repr__(self):
        return f"Batch({len(self)} policies, ${sum(p.premium for p in self):,.2f})"

a = Batch(Policy.from_row("TX,TX-0042,250000"), Policy.from_row("WY,WY-0007,12000"))
b = Batch(Policy("FL", "FL-0100", 98000, riders=["survey"]))
both = a + b
print(both, len(both), both[0].premium)
print(sorted(both)[0])
print(json.dumps(asdict(both[2])))
print(Policy("TX", "X", 1) == Policy("TX", "X", 1), hasattr(both[0], "__dict__"))
```

### Quiz

1. What does `self` refer to inside a method?
- [x] The instance the method was called on
- [ ] The class
- [ ] The module
> Python passes the instance automatically as the first argument; `self` is only a naming convention.

2. Which method should look like a constructor call and is used by debuggers?
- [ ] `__str__`
- [x] `__repr__`
- [ ] `__init__`
> `__repr__` is the unambiguous developer representation; `__str__` is the friendly one and falls back to `__repr__`.

3. Why use `field(default_factory=list)` in a dataclass?
- [x] A plain `[]` default would be shared between all instances
- [ ] Dataclasses cannot have defaults
- [ ] It makes the field read-only
> Mutable defaults are evaluated once; the factory creates a fresh list per instance, and dataclasses actually raise an error if you try `= []`.

4. What does `frozen=True` do on a dataclass?
- [ ] Prevents subclassing
- [x] Makes instances immutable and hashable
- [ ] Removes the `__init__`
> Assignment after creation raises `FrozenInstanceError`, and Python can safely generate `__hash__` from the fields.

### Exercises

1. **Money type** — Write a `Money` dataclass with `amount` and `currency` that supports `+` between same-currency values and raises `ValueError` otherwise.
<details><summary>Solution</summary>

```python
from dataclasses import dataclass
@dataclass(frozen=True)
class Money:
    amount: float
    currency: str = "USD"
    def __add__(self, other):
        if self.currency != other.currency:
            raise ValueError("currency mismatch")
        return Money(self.amount + other.amount, self.currency)
print(Money(10) + Money(5.5))
```

</details>

2. **Temperature property** — Write a class storing Celsius internally with a `fahrenheit` property that reads and writes.
<details><summary>Solution</summary>

```python
class Temp:
    def __init__(self, c):
        self.c = c
    @property
    def fahrenheit(self):
        return self.c * 9 / 5 + 32
    @fahrenheit.setter
    def fahrenheit(self, f):
        self.c = (f - 32) * 5 / 9
t = Temp(100); t.fahrenheit = 32; print(t.c)
```

</details>

### Interview Questions

**Q: What is the difference between `__str__` and `__repr__`?**
`__repr__` is the unambiguous representation for developers, ideally valid Python that recreates the object (`Policy('TX', 'TX-0042', 250000.0)`), and it is what containers, the REPL and debuggers show. `__str__` is the readable form for end users, used by `print` and `str()`, and if you do not define it Python falls back to `__repr__`. Define `__repr__` on every class; define `__str__` only when a friendlier form is genuinely useful, such as formatting a Money object as `$1,437.50`.

**Q: When would you use a dataclass versus a regular class versus a NamedTuple?**
Use a dataclass when the class is mostly data with a few methods: it removes boilerplate, supports defaults, mutability control with `frozen`, ordering, `slots`, and converts to dicts easily. Use a `NamedTuple` when you want an immutable, tuple-compatible record that unpacks and is very light in memory, such as coordinates or CSV rows. Write a regular class when behaviour dominates, when you need custom `__init__` logic beyond field assignment, or when the class participates in a deep hierarchy; dataclasses can still be a base but their generated `__init__` can surprise you with inheritance and default ordering rules.

**Q: Explain `__slots__`.**
By default every instance has a `__dict__` that stores attributes, which costs a few hundred bytes and allows arbitrary attribute creation. Declaring `__slots__ = ("title", "pages")` tells Python to reserve fixed storage for exactly those attributes, so instances lose the dict, use roughly half the memory, and attribute access is slightly faster; assigning an undeclared attribute raises `AttributeError`. It matters when you create millions of small objects, such as one per row of a large export. Drawbacks are that subclasses must also declare slots to keep the benefit and you cannot add attributes dynamically; `@dataclass(slots=True)` gives you the same for free.

## Type hints & testing with pytest

Two habits separate scripts from software: writing down what types a function expects, and proving it works with automated tests. Python supports both without changing how the code runs.

### Type hints (PEP 484)

```python
from decimal import Decimal
from pathlib import Path

def premium(coverage: Decimal, rate: Decimal = Decimal("5.75")) -> Decimal:
    return max(coverage / 1000 * rate, Decimal("100"))

def load_rows(path: Path, limit: int | None = None) -> list[dict[str, str]]:
    ...
```

Annotations are stored in `__annotations__` and ignored at runtime. Their value comes from tools: VS Code and PyCharm autocomplete on them, and **mypy** or **pyright** check that every call matches. Since Python 3.9 you can use built-in generics like `list[str]` and `dict[str, int]`; since 3.10 `X | None` replaces `Optional[X]` and `int | str` replaces `Union[int, str]`.

### The typing toolbox

| Hint | Meaning |
|---|---|
| `list[int]`, `tuple[str, int]`, `set[str]` | typed containers |
| `Iterable[str]`, `Sequence[int]`, `Mapping[str, float]` | accept any compatible type (from `collections.abc`) |
| `Callable[[int, str], bool]` | a function taking int and str, returning bool |
| `Literal["docx", "pdf"]` | one of fixed values |
| `TypedDict` | dict with known keys, ideal for JSON |
| `Protocol` | structural typing: "anything with a `.read()`" |
| `TypeVar`, `Generic` | generic functions and classes |
| `Any` | opt out of checking |

Prefer abstract input types (`Iterable`) and concrete return types (`list`). `TypedDict` is the sweet spot for config files and API payloads:

```python
from typing import TypedDict, NotRequired
class ReportConfig(TypedDict):
    client: str
    fields: int
    reviewer: NotRequired[str]
```

Run `pip install mypy` then `mypy src/`; start with `--ignore-missing-imports` and tighten to `--strict` as coverage grows. Type hints do not validate data at runtime; for that use `pydantic` or explicit checks.

### Testing with pytest

pytest discovers files named `test_*.py`, runs every function named `test_*`, and treats a failed `assert` as a test failure with a detailed diff. Install with `pip install pytest` and run `pytest -q` from the project root.

```python
# tests/test_rates.py
import pytest
from docgen.rates import premium

def test_minimum_applies():
    assert premium(12000) == 100.0

def test_standard_rate():
    assert premium(250000) == pytest.approx(1437.5)

def test_negative_coverage_rejected():
    with pytest.raises(ValueError, match="positive"):
        premium(-1)

@pytest.mark.parametrize("coverage,expected", [
    (0, 100.0), (17_391, 100.0), (17_392, 100.004),
])
def test_boundaries(coverage, expected):
    assert premium(coverage) == pytest.approx(expected, abs=0.01)
```

`pytest.approx` handles float rounding; `pytest.raises` asserts an exception; `parametrize` runs one test body over many cases and reports each separately.

### Fixtures

A **fixture** builds something tests need and cleans up afterwards. pytest injects it by parameter name, and the built-in `tmp_path` gives every test its own temporary folder:

```python
@pytest.fixture
def sample_csv(tmp_path):
    p = tmp_path / "production.csv"
    p.write_text("state,files\nTX,42\nWY,7\n", encoding="utf-8")
    return p

def test_load_rows(sample_csv):
    rows = load_rows(sample_csv)
    assert [r["state"] for r in rows] == ["TX", "WY"]
```

Fixtures in `conftest.py` are shared across the folder. `monkeypatch` swaps attributes or environment variables for one test; `capsys` captures printed output; `unittest.mock.patch` replaces network or file calls so tests run offline.

### Useful flags

`pytest -x` stops at the first failure, `-k rates` runs tests matching a name, `-v` shows each test, `--lf` re-runs the last failures, and `pytest --cov=docgen` (with `pytest-cov`) reports line coverage. Put tests in CI so every commit runs them.

> **Tip:** Name tests after the behaviour, not the function: `test_minimum_premium_applies_below_threshold` tells the reader what broke without opening the file.

### Try It Yourself

```python
# A tiny pytest-style runner so the tests execute in the browser.
from typing import TypedDict, get_type_hints
import math, traceback

class Policy(TypedDict):
    state: str
    coverage: float

def premium(policy: Policy, rate: float = 5.75) -> float:
    if policy["coverage"] <= 0:
        raise ValueError("coverage must be positive")
    return max(policy["coverage"] / 1000 * rate, 100.0)

print("hints:", get_type_hints(premium))

def test_minimum():
    assert premium({"state": "TX", "coverage": 12000}) == 100.0

def test_standard():
    assert math.isclose(premium({"state": "TX", "coverage": 250000}), 1437.5)

def test_rejects_negative():
    try:
        premium({"state": "TX", "coverage": -5})
    except ValueError as err:
        assert "positive" in str(err)
    else:
        assert False, "expected ValueError"

def test_deliberate_failure():
    assert premium({"state": "WY", "coverage": 1000}) == 5.75   # wrong: minimum applies

passed = failed = 0
for name, fn in list(globals().items()):
    if name.startswith("test_") and callable(fn):
        try:
            fn(); passed += 1; print("PASS", name)
        except AssertionError as err:
            failed += 1; print("FAIL", name, "-", err or "assertion failed")
print(f"{passed} passed, {failed} failed")
```

### Quiz

1. What does a type hint do at runtime?
- [ ] Raises `TypeError` on a mismatch
- [x] Nothing; it is stored as metadata for tools
- [ ] Converts the argument to the annotated type
> Hints are checked by mypy or pyright, not by the interpreter. Runtime validation needs a library such as pydantic.

2. Which is the modern spelling of `Optional[int]`?
- [x] `int | None`
- [ ] `int or None`
- [ ] `Maybe[int]`
> PEP 604 (Python 3.10) introduced the `|` union syntax for annotations.

3. How does pytest find tests?
- [ ] You register each test in a list
- [x] Files named `test_*.py` and functions named `test_*`
- [ ] Only classes inheriting from `TestCase`
> Discovery is by naming convention; `unittest.TestCase` classes are also collected for compatibility.

4. What is `tmp_path` in a pytest test signature?
- [x] A built-in fixture providing a fresh temporary directory
- [ ] A string constant
- [ ] A command-line option
> pytest injects fixtures by parameter name; `tmp_path` is a `pathlib.Path` cleaned up automatically.

### Exercises

1. **Annotate** — Add complete type hints to `def group(rows, key): ...` which takes an iterable of dicts and a key name and returns a dict mapping each key value to the list of rows.
<details><summary>Solution</summary>

```python
from collections.abc import Iterable
from typing import Any
def group(rows: Iterable[dict[str, Any]], key: str) -> dict[Any, list[dict[str, Any]]]:
    out: dict[Any, list[dict[str, Any]]] = {}
    for row in rows:
        out.setdefault(row[key], []).append(row)
    return out
```

</details>

2. **Parametrised tests** — Write pytest tests for `pages_needed(rows, per_page=40)` covering 0, 40, 41 and 1284 rows.
<details><summary>Solution</summary>

```python
import pytest
from docgen.pages import pages_needed

@pytest.mark.parametrize("rows,expected", [(0, 0), (40, 1), (41, 2), (1284, 33)])
def test_pages_needed(rows, expected):
    assert pages_needed(rows) == expected
```

</details>

### Interview Questions

**Q: What are the benefits and costs of type hints in Python?**
Benefits: earlier bug detection with mypy or pyright (wrong argument order, `None` passed where a string is required), better editor autocompletion and refactoring, self-documenting signatures, and runtime uses such as dataclasses, FastAPI request validation and pydantic models. Costs: extra typing to write and maintain, a learning curve for generics and protocols, occasional friction with highly dynamic code, and a false sense of safety because nothing is enforced at runtime. Most teams adopt them gradually, starting with public function signatures and running mypy in CI in non-strict mode.

**Q: What is a fixture in pytest and how does it compare to setUp in unittest?**
A fixture is a function decorated with `@pytest.fixture` that prepares a resource and optionally tears it down after a `yield`; tests receive it by naming it as a parameter, so each test declares exactly what it needs. Fixtures compose (a fixture can use other fixtures), have scopes (function, module, session) to control how often they run, and live in `conftest.py` for sharing. `unittest.setUp` runs before every test in a class whether or not the test needs everything it builds, cannot be composed as easily, and requires class-based tests. Fixtures also replace most global state and make expensive setups such as a database connection session-scoped.

**Q: How do you test code that reads files, calls an API or uses the current time?**
Isolate the side effect behind a parameter or small function, then substitute it in tests: pass a `Path` from `tmp_path` with a known file, patch `requests.get` with `unittest.mock.patch` or the `responses` library to return canned JSON, and inject a `now` function or patch `datetime` so the report date is fixed. The pure calculation core is then tested directly with plain asserts, and one or two integration tests hit the real dependencies behind a marker such as `@pytest.mark.integration` that CI can skip. This is dependency injection in its simplest form and is why pure functions are cheaper to test.

**Q: What is the difference between a unit test, an integration test and an end-to-end test?**
A unit test checks one function or class in isolation with all dependencies faked, runs in milliseconds, and pinpoints the failing line; `premium(12000) == 100` is a unit test. An integration test exercises several real components together, such as reading an actual CSV and writing an actual DOCX, to catch mismatches between modules. An end-to-end test drives the whole system the way a user would, for example running the CLI against a sample folder and checking the produced PDF. A healthy suite is a pyramid: many fast unit tests, fewer integration tests and a handful of end-to-end checks, because the higher levels are slower and harder to diagnose.

# LEVEL: Expert

## Memory model & the GIL

Everything in Python is an object on the heap, and every variable is a reference to one. Understanding how CPython allocates, counts and frees those objects explains a whole family of interview questions: why `a = b` does not copy, why `is` behaves oddly for small integers, what the GIL actually locks, and why a script's memory never seems to shrink.

### Objects, references and identity

```python
a = [1, 2, 3]
b = a
print(id(a) == id(b), a is b)        # True True: one object, two names
import sys
print(sys.getrefcount(a))            # 3: a, b, and the temporary argument
del b
print(sys.getrefcount(a))            # 2
```

Each CPython object begins with a header holding its **reference count** and a pointer to its type. Assignment increments the count, `del` or rebinding decrements it, and when it hits zero the object is freed immediately and deterministically. That is why a file opened without `with` usually closes as soon as the last reference disappears in CPython, and why the same code leaks handles under PyPy, which has no refcounting.

### The cyclic garbage collector

Reference counting cannot free cycles: two objects that point at each other keep each other's count at one forever. The `gc` module runs a generational collector that finds unreachable cycles. New objects start in generation 0, survivors are promoted, and collections of older generations happen less often. Python 3.12 replaced the fixed thresholds with a scheme keyed to allocation counts, and 3.13 made the collector incremental.

```python
import gc
print(gc.get_count(), gc.get_threshold())
gc.collect()           # force a full collection, returns unreachable objects found
gc.disable()           # sometimes done during a tight allocation-heavy loop
```

Cycles that include objects with `__del__` were uncollectable before 3.4 (PEP 442 fixed this). `weakref` lets caches reference objects without keeping them alive.

### Interning and caching

CPython pre-allocates integers from -5 to 256 and interns short identifier-like strings, so `x = 100; y = 100; x is y` is `True` while `x = 1000; y = 1000` may not be, depending on whether the compiler folded them into the same constant. Never use `is` for value comparison. `sys.intern()` forces interning of long strings, which speeds up dictionary lookups when millions of rows share the same keys.

### Memory allocation

Small objects (up to 512 bytes) come from **pymalloc**, an arena allocator that carves 256 KB arenas into pools of fixed-size blocks; larger objects go to the system `malloc`. Freed blocks are kept for reuse, so a process that once held a 2 GB DataFrame will often stay near that size afterwards. `sys.getsizeof` reports one object's direct size (a list's 8-byte pointers, not its elements); `tracemalloc` tracks allocations by source line, which is the tool for hunting leaks:

```python
import tracemalloc
tracemalloc.start()
rows = [dict(id=i, state="TX") for i in range(100_000)]
current, peak = tracemalloc.get_traced_memory()
print(f"{current / 1e6:.1f} MB now, {peak / 1e6:.1f} MB peak")
for stat in tracemalloc.take_snapshot().statistics("lineno")[:3]:
    print(stat)
```

A dict per row costs about 200 bytes; `__slots__` classes, tuples or NumPy arrays cut that by two to ten times.

### The Global Interpreter Lock

The **GIL** is a mutex that lets only one thread execute Python bytecode at a time. It exists because reference counting is not thread-safe: two threads incrementing the same count simultaneously would corrupt it, and a lock per object would make single-threaded code slower. Consequences:

- CPU-bound pure Python threads do not run in parallel; four threads summing numbers take as long as one.
- I/O-bound threads work well, because a thread releases the GIL while waiting on a socket, disk or `time.sleep`.
- C extensions such as NumPy, PyMuPDF and `zlib` release the GIL during heavy work, so they can parallelise across threads.
- True parallelism for Python code needs `multiprocessing` (separate interpreters) or, from Python 3.13, the experimental free-threaded build (`python3.13t`, PEP 703) that removes the GIL at the cost of some single-thread speed.

Python 3.12 also added per-interpreter GILs for sub-interpreters (PEP 684), exposed as `concurrent.interpreters` in 3.14.

> **Interview note:** "Does the GIL make Python single-threaded?" No: threads exist and interleave, and they switch every 5 ms (`sys.getswitchinterval()`) or when one blocks on I/O. It makes Python single-*core* for bytecode. The right follow-up is to name the workload: threads for waiting, processes for computing.

### Try It Yourself

```python
import sys, gc, tracemalloc

a = [1, 2, 3]; b = a
print("same object:", a is b, "| refcount:", sys.getrefcount(a))

x, y = 256, 256
p, q = int("1000"), int("1000")
print("small int cached:", x is y, "| large ints:", p is q, "| equal:", p == q)

class Node:
    def __init__(self): self.other = None
n1, n2 = Node(), Node()
n1.other, n2.other = n2, n1           # a reference cycle
del n1, n2
print("cycle freed by refcount? no. gc found:", gc.collect(), "unreachable objects")

print("sizes:", sys.getsizeof(0), sys.getsizeof(2**70), sys.getsizeof([]), sys.getsizeof([0]*1000))

tracemalloc.start()
rows_dict = [dict(id=i, state="TX", files=i % 40) for i in range(20_000)]
d_now, _ = tracemalloc.get_traced_memory(); tracemalloc.reset_peak()
class Row:
    __slots__ = ("id", "state", "files")
    def __init__(self, i): self.id, self.state, self.files = i, "TX", i % 40
rows_slots = [Row(i) for i in range(20_000)]
s_now, _ = tracemalloc.get_traced_memory()
print(f"20k dict rows: {d_now/1e6:.2f} MB | 20k slots rows: {(s_now-d_now)/1e6:.2f} MB")
print("switch interval:", sys.getswitchinterval(), "s")
```

### Quiz

1. When does CPython free an object whose reference count reaches zero?
- [x] Immediately
- [ ] At the next garbage collection cycle
- [ ] When the program exits
> Reference counting is deterministic; the cyclic collector only exists for reference cycles.

2. What does the GIL prevent?
- [ ] Threads from being created
- [x] More than one thread executing Python bytecode at the same time
- [ ] I/O operations from overlapping
> Threads still interleave and overlap on I/O; they simply cannot run bytecode in parallel on multiple cores.

3. Why can `a = 1000; b = 1000; a is b` be `False`?
- [ ] Because 1000 is a float
- [x] Only small integers (-5 to 256) are guaranteed to be cached
- [ ] Because `is` compares values, not identity
> Identity of larger ints depends on how they were created; use `==` for values.

4. Which tool shows which source lines allocated the most memory?
- [ ] `sys.getsizeof`
- [x] `tracemalloc`
- [ ] `gc.get_count`
> `tracemalloc` snapshots allocations with tracebacks; `getsizeof` only reports one object's size.

### Exercises

1. **Prove a cycle** — Create two objects that reference each other, delete the names, and show with `gc.collect()` that the collector (not refcounting) freed them.
<details><summary>Solution</summary>

```python
import gc
class N: pass
a, b = N(), N()
a.peer, b.peer = b, a
del a, b
print(gc.collect() >= 2)   # at least the two nodes were unreachable
```

</details>

2. **Measure slots** — Compare `sys.getsizeof` of an instance with and without `__slots__`, remembering to add the `__dict__` size for the plain class.
<details><summary>Solution</summary>

```python
import sys
class Plain:
    def __init__(self): self.a, self.b = 1, 2
class Slim:
    __slots__ = ("a", "b")
    def __init__(self): self.a, self.b = 1, 2
p, s = Plain(), Slim()
print(sys.getsizeof(p) + sys.getsizeof(p.__dict__), sys.getsizeof(s))
```

</details>

### Interview Questions

**Q: How does Python manage memory?**
CPython uses reference counting as the primary mechanism: every object stores how many references point at it and is freed the instant that count reaches zero, which gives deterministic cleanup. A generational cyclic garbage collector supplements this by periodically finding groups of objects that reference each other but are unreachable from the program. Allocation itself goes through pymalloc, an arena-based allocator for small objects that reduces fragmentation and system calls, with larger blocks delegated to the C allocator. Memory returned to pymalloc is reused rather than released to the OS, so resident size tends to plateau at the high-water mark, which is why long-running jobs process large files in chunks or in child processes.

**Q: What is the GIL, why does it exist, and how do you work around it?**
The Global Interpreter Lock is a mutex in CPython that allows only one thread to run bytecode at a time, protecting reference counts and interpreter state without fine-grained locking. It exists because it made the interpreter simpler and single-threaded code faster, and because C extensions could rely on it. For I/O-bound work threads or `asyncio` are fine because the GIL is released while waiting; for CPU-bound Python code use `multiprocessing` or `concurrent.futures.ProcessPoolExecutor` to get one interpreter per core, or push the heavy loop into NumPy, Cython or a C library that releases the GIL. Python 3.13 ships an optional free-threaded build without a GIL, and sub-interpreters with their own GIL arrived in 3.12, but as of 2026 most production deployments still run the standard build.

**Q: What is the difference between `is` and `==`, and why do small integers behave strangely?**
`==` calls `__eq__` and compares values; `is` compares object identity, that is, whether both names refer to the same memory address. CPython caches the integers -5 through 256 and interns compile-time string constants as an optimisation, so `256 is 256` is `True` and `257 is 257` may be `True` in the same compiled block but `False` when computed at runtime. This is an implementation detail, not a language guarantee, which is why linters flag `is` with literals (`SyntaxWarning` since 3.8). The only correct uses of `is` are singletons such as `None`, `True`, `False`, `Ellipsis` and sentinel objects you create yourself.

**Q: How would you find a memory leak in a long-running Python service?**
First confirm growth with process metrics (RSS over time) and rule out normal high-water-mark behaviour. Then use `tracemalloc`: take a snapshot after warm-up, another after an hour, and `compare_to` them by line number to see which allocations keep growing. Common culprits are unbounded caches (`lru_cache` on methods, module-level dicts), listeners or callbacks never unregistered, reference cycles involving objects with expensive resources, and C extension objects that were never closed. `gc.get_objects()` with `collections.Counter(type(o) for o in ...)` shows which types are multiplying, and `objgraph` draws what still references them. The fix is usually a bounded cache, weak references, or explicit `close()` in a context manager.

## Performance & profiling

Python is fast enough for almost every document and reporting task, provided you measure before optimising and choose the right data structure. The order of work is always: make it correct, measure, find the hot spot, fix that one thing, measure again.

### Measure first

```python
import timeit
setup = "rows = list(range(100_000))"
print(timeit.timeit("[r * 2 for r in rows]", setup, number=100))
print(timeit.timeit("list(map(lambda r: r * 2, rows))", setup, number=100))
```

`timeit` runs a snippet many times and reports the total seconds, disabling garbage collection during the run for stable numbers. For quick manual timing use `time.perf_counter()`, never `time.time()`, which has coarse resolution on Windows.

### Profile to find the hot spot

```bash
python -m cProfile -s cumulative build_report.py | head -30
```

`cProfile` records every function call with counts and time; sorting by `cumulative` shows which top-level function is responsible. Inside code use `cProfile.Profile()` as a context manager (3.8+) and `pstats.Stats(p).sort_stats("tottime").print_stats(10)`. For line-level detail install `line_profiler`; for a visual call tree use `snakeviz`; for production sampling without slowing the process use `py-spy top --pid`. The 80/20 rule holds: in a typical document pipeline, one regex or one nested loop accounts for most of the runtime.

### The big wins, in order

| Problem | Fix | Typical speed-up |
|---|---|---|
| `x in list` inside a loop | use a `set` or `dict` | 100–10,000x |
| string `+=` in a loop | collect in list, `"".join` | 10–100x |
| repeated `re.compile` | compile once at module level | 2–5x |
| calling a function per element | vectorise with NumPy/pandas | 10–100x |
| reading a file with `readlines()` | iterate the file object | memory, not time |
| attribute lookup in hot loop | bind to local: `append = out.append` | 1.2–1.5x |
| CPU-bound work | `multiprocessing` / C extension | up to core count |

Algorithmic changes dominate everything else. Replacing an O(n²) nested loop that matches 50,000 policy numbers against 50,000 records with a dictionary lookup turns a 10-minute job into a 1-second job; no micro-optimisation comes close.

### Built-ins and C-level code

Built-ins such as `sum`, `min`, `sorted`, `str.join`, `dict.get` and comprehension loops execute in C. `sorted(rows, key=itemgetter(2))` beats `key=lambda r: r[2]` because `operator.itemgetter` avoids a Python frame per call. `collections.deque` gives O(1) appends and pops at both ends, where `list.insert(0, x)` is O(n). `bisect` keeps a sorted list searchable in O(log n). `array` and `bytearray` store numbers compactly.

### Caching and laziness

`functools.lru_cache` removes repeated work for pure functions with repeated arguments, such as rate lookups by state. Generators keep memory flat so the process never swaps. Reading a large Excel workbook with `openpyxl.load_workbook(path, read_only=True)` streams rows instead of building the whole object model.

### When Python itself is the bottleneck

Use NumPy or pandas for numeric tables (the loop runs in C over contiguous memory). Use `multiprocessing.Pool` for embarrassingly parallel work like converting 1,284 DOCX files to PDF. Consider Cython, `mypyc` or a Rust extension via `PyO3` for hot loops, or PyPy for long-running pure-Python services. Python 3.11 made the interpreter about 25 percent faster through specialised adaptive bytecode (PEP 659), and 3.13 added an experimental JIT, so upgrading is itself an optimisation.

> **Warning:** Never optimise on a hunch. Developers routinely guess wrong about hot spots; a profile of a "slow" report generator usually shows the time in one `str.replace` chain or one unindexed lookup, not in the code they suspected.

### Try It Yourself

```python
import timeit, random, re, cProfile, pstats, io
from operator import itemgetter

random.seed(1)
policies = [f"TX-2026-{i:05d}" for i in range(20_000)]
lookup_list = policies[:]
lookup_set = set(policies)
sample = random.sample(policies, 500)

t_list = timeit.timeit(lambda: [p in lookup_list for p in sample], number=1)
t_set = timeit.timeit(lambda: [p in lookup_set for p in sample], number=1)
print(f"membership: list {t_list*1000:.1f} ms vs set {t_set*1000:.3f} ms ({t_list/t_set:,.0f}x)")

def concat(parts):
    s = ""
    for p in parts: s += p
    return s
parts = ["row\n"] * 50_000
print("concat:", f"{timeit.timeit(lambda: concat(parts), number=3):.3f}s",
      "| join:", f"{timeit.timeit(lambda: ''.join(parts), number=3):.3f}s")

pattern = r"TX-(\d{4})-(\d{5})"
pat = re.compile(pattern)
t_pre = timeit.timeit(lambda: [pat.match(p) for p in sample], number=20)
t_each = timeit.timeit(lambda: [re.match(pattern, p) for p in sample], number=20)
print(f"precompiled regex: {t_pre:.3f}s | re.match each time: {t_each:.3f}s")

rows = [(p, random.randint(1, 60)) for p in sample]
print("itemgetter:", f"{timeit.timeit(lambda: sorted(rows, key=itemgetter(1)), number=200):.3f}s",
      "| lambda:", f"{timeit.timeit(lambda: sorted(rows, key=lambda r: r[1]), number=200):.3f}s")

def slow_report():
    return sum(len(p) for p in policies if p in lookup_set)
with cProfile.Profile() as prof:
    slow_report()
out = io.StringIO()
pstats.Stats(prof, stream=out).sort_stats("cumulative").print_stats(4)
print(out.getvalue().splitlines()[0])
```

### Quiz

1. What is the first step when a script is too slow?
- [ ] Rewrite the loops as comprehensions
- [x] Profile it to find where the time actually goes
- [ ] Add threads
> Guessing is unreliable; `cProfile` or `py-spy` shows the real hot spot in minutes.

2. Which change most likely turns a 10-minute matching job into seconds?
- [ ] Using `timeit`
- [x] Replacing `x in some_list` with a set or dict lookup
- [ ] Binding methods to local names
> Algorithmic complexity dominates: O(n²) to O(n) beats any constant-factor tweak.

3. Why is `time.perf_counter()` preferred over `time.time()` for benchmarks?
- [x] It has the highest available resolution and is monotonic
- [ ] It returns milliseconds
- [ ] It pauses garbage collection
> `time.time()` can jump with clock adjustments and is coarse on some platforms; `timeit` handles GC.

4. Which structure gives O(1) `appendleft` and `popleft`?
- [ ] `list`
- [x] `collections.deque`
- [ ] `tuple`
> Lists shift every element on front insertion; deques are doubly linked blocks.

### Exercises

1. **Profile a function** — Write code that profiles `sorted(random.random() for _ in range(200_000))` with `cProfile` and prints the five most expensive entries by total time.
<details><summary>Solution</summary>

```python
import cProfile, pstats, random
with cProfile.Profile() as prof:
    sorted(random.random() for _ in range(200_000))
pstats.Stats(prof).sort_stats("tottime").print_stats(5)
```

</details>

2. **Deduplicate fast** — Given two lists of 100,000 policy numbers each, print how many appear in both, first with a nested loop (comment it out after timing on 2,000 items) and then with set intersection.
<details><summary>Solution</summary>

```python
import timeit
a = [f"P{i}" for i in range(2000)]
b = [f"P{i}" for i in range(1000, 3000)]
slow = lambda: sum(1 for x in a if x in b)
fast = lambda: len(set(a) & set(b))
print(timeit.timeit(slow, number=1), timeit.timeit(fast, number=1), fast())
```

</details>

### Interview Questions

**Q: How would you speed up a slow Python script?**
Measure first with `cProfile` or `py-spy` to find the hot spot, because intuition is usually wrong. Then apply fixes in order of leverage: fix the algorithm and data structure (sets and dicts for membership, sorting once instead of searching repeatedly, generators to avoid materialising huge lists); move work into C-level code (built-ins, `str.join`, precompiled regexes, NumPy or pandas for numeric tables); cache repeated pure computations with `lru_cache`; and only then parallelise with `multiprocessing` for CPU-bound work or threads/asyncio for I/O-bound work. Re-measure after every change and stop when it is fast enough; a report that ran in 40 minutes and now runs in 3 rarely needs Cython.

**Q: Why is a list comprehension faster than an equivalent `for` loop with `append`?**
The comprehension is compiled to specialised bytecode that appends directly to the new list with a `LIST_APPEND` instruction, avoiding the attribute lookup and Python-level method call of `result.append(x)` on every iteration, and it runs in its own frame with the loop variable as a fast local. The difference is typically 20–40 percent, which matters only in hot loops; readability should decide in ordinary code. `map` with a built-in function can be faster still because no Python function is called per element, while `map` with a lambda is usually slower than the comprehension.

**Q: What is the time complexity of common list, dict and set operations?**
List: index and `append` are O(1) amortised, `insert(0, x)` and `pop(0)` are O(n) because elements shift, `x in list` is O(n), and `sort` is O(n log n) with Timsort, which is stable and adaptive to already-sorted runs. Dict and set: insert, lookup and delete are O(1) on average thanks to hashing, O(n) in pathological collision cases, and iteration is O(n) in insertion order. String concatenation in a loop is O(n²) in general, `"".join` is O(n). Knowing these lets you predict that matching two 50,000-row lists with nested loops means 2.5 billion comparisons while a dict join means 100,000 operations.

**Q: How do you decide between threads, processes and asyncio for performance?**
Classify the workload. If the time goes to waiting on the network, disk or external programs (downloading 500 PDFs, calling LibreOffice for conversions), threads or asyncio give near-linear speed-ups because the GIL is released during waits; asyncio scales to thousands of connections with lower overhead but requires async-aware libraries. If the time goes to Python computation (parsing, transforming, computing statistics), the GIL serialises threads and you need `ProcessPoolExecutor` to use multiple cores, accepting the cost of pickling data between processes. Often the best answer is to eliminate the Python loop entirely with NumPy or pandas, which frequently beats parallelism because a vectorised operation on one core outruns eight cores of interpreted code.

## Concurrency

Concurrency means making progress on several tasks at once; parallelism means running them simultaneously on multiple cores. Python offers three tools, and choosing correctly depends entirely on whether your work is **I/O-bound** (waiting for files, networks, external programs) or **CPU-bound** (computing).

| Tool | Parallel Python code? | Best for | Overhead |
|---|---|---|---|
| `threading` | No (GIL) | I/O-bound, blocking libraries | low |
| `asyncio` | No (single thread) | many concurrent I/O tasks, async libraries | very low |
| `multiprocessing` | Yes | CPU-bound | high (process start, pickling) |

### Threads

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import urllib.request

def fetch(url):
    with urllib.request.urlopen(url, timeout=10) as r:
        return url, len(r.read())

urls = [f"https://example.com/doc{i}.pdf" for i in range(20)]
with ThreadPoolExecutor(max_workers=8) as pool:
    futures = [pool.submit(fetch, u) for u in urls]
    for fut in as_completed(futures):
        url, size = fut.result()          # re-raises any exception from the worker
        print(url, size)
```

`ThreadPoolExecutor` manages worker threads for you; `pool.map(fetch, urls)` returns results in order, `as_completed` in finish order. Downloading twenty files this way takes roughly the time of the slowest one instead of the sum. Shared mutable state needs a `threading.Lock`; `queue.Queue` is the thread-safe way to pass work between producer and consumer threads. Use `threading.Thread(target=..., daemon=True)` directly only when you need long-lived background threads.

### Processes

```python
from concurrent.futures import ProcessPoolExecutor

def convert(path):
    ...                                 # CPU-heavy: render DOCX to PDF, OCR, hash
    return path

if __name__ == "__main__":              # required on Windows and macOS (spawn)
    with ProcessPoolExecutor() as pool:  # defaults to os.cpu_count() workers
        for done in pool.map(convert, paths, chunksize=10):
            print("done", done)
```

Each worker is a separate interpreter with its own GIL, so eight cores give close to eight times the throughput for CPU-bound work. Arguments and results are pickled through pipes, so pass file paths rather than large objects, and keep the worker function at module level so it can be imported by the child. The `if __name__ == "__main__":` guard prevents the child processes from re-running the pool creation when they import your script under the default `spawn` start method (the default on all platforms since Python 3.14; Linux used `fork` before that).

### asyncio

`asyncio` runs many **coroutines** on one thread with an event loop. A coroutine is defined with `async def` and pauses at `await` points, letting other coroutines run while it waits.

```python
import asyncio

async def fetch(client, url):
    resp = await client.get(url)          # httpx.AsyncClient, aiohttp, etc.
    return url, len(resp.content)

async def main(urls):
    async with httpx.AsyncClient() as client:
        results = await asyncio.gather(*(fetch(client, u) for u in urls))
    return results

asyncio.run(main(urls))
```

`asyncio.gather` schedules all coroutines and waits for all results; `asyncio.TaskGroup` (3.11+) does the same with structured cancellation. `asyncio.Semaphore(10)` limits concurrency, `asyncio.wait_for` adds timeouts, and `asyncio.to_thread(blocking_fn)` runs a blocking call in a thread so it does not freeze the loop. Calling a blocking function like `time.sleep` or `requests.get` inside a coroutine stalls everything, which is the number one asyncio bug.

### Choosing

- Converting 1,284 DOCX files with LibreOffice: I/O-bound waiting on a subprocess, use a thread pool of 4 to 8.
- Hashing or OCR-ing those files in Python: CPU-bound, use a process pool.
- Polling 2,000 API endpoints: asyncio with an async HTTP client.
- A GUI or web server that must stay responsive: asyncio or threads for the waiting parts.

> **Interview note:** Interviewers ask "why did threads not speed up my loop?" The answer is the GIL plus the workload type. Follow up with the measurement you would take: time it with 1, 2 and 4 workers; if it does not scale it is CPU-bound and needs processes or a C library.

### Try It Yourself

```python
import asyncio, time, random

# The browser runner cannot start OS threads or processes, but asyncio works.
async def convert(name, seconds):
    print(f"start  {name}")
    await asyncio.sleep(seconds)          # pretend to wait on LibreOffice
    print(f"done   {name} ({seconds:.1f}s)")
    return name, seconds

async def main():
    jobs = {"sop.docx": 0.6, "handbook.docx": 1.0, "letterhead.dotx": 0.3, "rates.xlsx": 0.5}
    sem = asyncio.Semaphore(2)            # at most two conversions at once
    async def limited(name, secs):
        async with sem:
            return await convert(name, secs)
    t0 = time.perf_counter()
    results = await asyncio.gather(*(limited(n, s) for n, s in jobs.items()))
    wall = time.perf_counter() - t0
    print(f"sequential would take {sum(jobs.values()):.1f}s; concurrent took {wall:.1f}s")
    print("results:", results)

try:
    loop = asyncio.get_event_loop()
except RuntimeError:
    loop = asyncio.new_event_loop()
if loop.is_running():                     # browser: a loop already exists, schedule onto it
    asyncio.ensure_future(main())
else:                                     # normal CPython: asyncio.run(main()) also works
    loop.run_until_complete(main())
```

### Quiz

1. Which tool gives true parallel execution of pure-Python CPU-bound code?
- [ ] `threading`
- [ ] `asyncio`
- [x] `multiprocessing`
> Only separate processes escape the GIL; threads and coroutines share one interpreter lock.

2. What happens if you call `time.sleep(5)` inside a coroutine?
- [x] The whole event loop stalls for five seconds
- [ ] Only that coroutine pauses
- [ ] It is converted to `await asyncio.sleep(5)` automatically
> Blocking calls never yield to the loop; use `await asyncio.sleep` or `asyncio.to_thread`.

3. Why must worker functions for `ProcessPoolExecutor` be defined at module level?
- [ ] For readability
- [x] They are pickled by reference and re-imported in the child process
- [ ] Nested functions are slower
> Lambdas and local functions cannot be pickled, so the child cannot locate them.

4. What does `asyncio.gather` return?
- [x] A list of results in the same order as the awaitables passed in
- [ ] Results in completion order
- [ ] Only the first result
> `gather` preserves input order; `as_completed` yields in finish order.

### Exercises

1. **Thread pool download** — Write code that uses `ThreadPoolExecutor` to call a `fetch(url)` function for ten URLs with four workers and prints results as they complete, handling exceptions per URL.
<details><summary>Solution</summary>

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
def run(urls, fetch):
    with ThreadPoolExecutor(max_workers=4) as pool:
        futs = {pool.submit(fetch, u): u for u in urls}
        for fut in as_completed(futs):
            try:
                print(futs[fut], fut.result())
            except Exception as err:
                print(futs[fut], "failed:", err)
```

</details>

2. **Rate-limited coroutines** — Write an async function that runs 50 fake jobs (each `await asyncio.sleep(0.1)`) with at most five running at once using a `Semaphore`, and prints the elapsed time.
<details><summary>Solution</summary>

```python
import asyncio, time
async def job(sem, i):
    async with sem:
        await asyncio.sleep(0.1)
        return i
async def main():
    sem = asyncio.Semaphore(5)
    t = time.perf_counter()
    await asyncio.gather(*(job(sem, i) for i in range(50)))
    print(f"{time.perf_counter() - t:.1f}s")   # about 1.0s
asyncio.run(main())
```

</details>

### Interview Questions

**Q: What is the difference between concurrency and parallelism, and how does each map to Python?**
Concurrency is dealing with many things at once by interleaving them; parallelism is doing many things at the same instant on different cores. Threads and asyncio give concurrency: they overlap waiting periods so I/O-bound programs finish sooner, but because of the GIL only one thread executes Python bytecode at a time. Multiprocessing gives parallelism by running separate interpreters, each with its own GIL, at the price of process start-up and pickling data across the boundary. A download-and-convert pipeline typically uses both: a thread pool for the downloads and a process pool for the CPU-heavy conversion.

**Q: How does asyncio work under the hood?**
An event loop runs on one thread and keeps a queue of ready callbacks plus a selector watching file descriptors. A coroutine is a generator-like object; when it hits `await` on something not yet ready, it suspends and returns control to the loop, which runs other ready tasks. When the awaited I/O completes, the selector wakes the loop, which resumes the coroutine at the exact `await`. Tasks wrap coroutines so the loop can schedule them, and `gather` or `TaskGroup` composes them. Because there is no pre-emption, a coroutine that never awaits blocks everything, and CPU-heavy work must go to `run_in_executor` or `asyncio.to_thread`.

**Q: What is a race condition and how do you prevent one in Python threads?**
A race condition occurs when the result depends on the timing of threads accessing shared state, such as two threads doing `counter += 1`, which is a read, add and write that can interleave so one increment is lost, even under the GIL since the switch can happen between bytecodes. Prevent it by protecting the critical section with `threading.Lock` (`with lock: counter += 1`), by using thread-safe structures such as `queue.Queue`, by giving each thread its own data and merging results at the end, or by avoiding shared mutable state entirely with immutable messages. Deadlocks come from acquiring multiple locks in different orders, so always acquire in a fixed order or use a single lock.

**Q: When would you choose multiprocessing over threading, and what are its pitfalls?**
Choose processes when the work is CPU-bound in Python and you have spare cores: parsing large files, computing hashes, image processing, heavy pandas transforms per file. Pitfalls: everything sent to a worker is pickled, so passing large DataFrames is slow and lambdas or open file handles cannot be sent at all; workers start fresh under `spawn`, so module-level setup runs again and global state is not shared; on Windows the `if __name__ == "__main__"` guard is mandatory; and each worker duplicates memory, which matters with big models loaded per process. Use `chunksize` in `map` to reduce IPC overhead, `initializer` to load shared resources once per worker, and shared memory (`multiprocessing.shared_memory`) or files for large data.

## Building & packaging CLI tools

The scripts you write for clients and colleagues become real tools when they take arguments, log what they did, exit with meaningful status codes, and install with one command. This chapter covers `argparse`, `logging`, project layout with `pyproject.toml`, and publishing.

### argparse

```python
# docgen/cli.py
import argparse, sys
from pathlib import Path

def build_parser():
    p = argparse.ArgumentParser(prog="docgen", description="Generate weekly production reports.")
    p.add_argument("input", type=Path, help="CSV export from the production system")
    p.add_argument("-o", "--output", type=Path, default=Path("report.docx"))
    p.add_argument("--state", action="append", help="filter by state; repeatable")
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("-v", "--verbose", action="count", default=0)
    p.add_argument("--version", action="version", version="%(prog)s 1.2.0")
    return p

def main(argv=None):
    args = build_parser().parse_args(argv)
    if not args.input.exists():
        print(f"error: {args.input} not found", file=sys.stderr)
        return 2
    ...
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

`argparse` generates `--help`, validates types, and exits with status 2 on bad usage. Accepting `argv` in `main()` makes the CLI testable: `main(["data.csv", "--dry-run"])`. Sub-commands (`docgen build`, `docgen validate`) come from `p.add_subparsers(dest="command")`. For larger tools, `click` and `typer` reduce boilerplate, but `argparse` needs no dependency.

### Logging

```python
import logging
log = logging.getLogger(__name__)

def configure(verbosity):
    level = [logging.WARNING, logging.INFO, logging.DEBUG][min(verbosity, 2)]
    logging.basicConfig(level=level, format="%(asctime)s %(levelname)-8s %(name)s: %(message)s",
                        handlers=[logging.StreamHandler(), logging.FileHandler("docgen.log", encoding="utf-8")])

log.info("processing %s rows", len(rows))       # lazy %-formatting, no f-string
log.exception("failed on %s", path)             # inside except: includes traceback
```

Use `print` for the tool's actual output and `logging` for diagnostics. Levels are DEBUG, INFO, WARNING, ERROR, CRITICAL; the root logger defaults to WARNING. Libraries should only call `getLogger(__name__)` and never configure handlers; the application configures once in `main`. `logging.handlers.RotatingFileHandler` keeps log files bounded on scheduled jobs.

### Exit codes and stderr

Return 0 on success and non-zero on failure so Task Scheduler, cron and CI can detect problems; conventionally 1 for a general error and 2 for usage errors. Send errors to `sys.stderr` so they do not pollute output that might be piped into another tool.

### Project layout and pyproject.toml

```text
docgen/
    pyproject.toml
    README.md
    src/docgen/__init__.py
    src/docgen/cli.py
    tests/test_cli.py
```

```toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "docgen"
version = "1.2.0"
description = "Weekly production report generator"
requires-python = ">=3.10"
dependencies = ["python-docx>=1.1", "openpyxl>=3.1"]

[project.scripts]
docgen = "docgen.cli:main"
```

`pyproject.toml` (PEP 621) replaces `setup.py`. The `src/` layout prevents tests from importing the uninstalled copy by accident. `[project.scripts]` creates a `docgen` command on install that calls `main()` and uses its return value as the exit code. `pip install -e .` installs in editable mode for development.

### Building and distributing

```bash
python -m pip install build twine
python -m build                  # creates dist/docgen-1.2.0-py3-none-any.whl and .tar.gz
python -m twine upload dist/*    # to PyPI (or --repository testpypi first)
pipx install docgen              # users get an isolated command
```

A **wheel** is a pre-built zip that installs without running code; the **sdist** is the source archive. Follow semantic versioning: patch for fixes, minor for features, major for breaking changes. For internal tools you can skip PyPI and `pip install` straight from a Git URL or a shared wheel folder. To hand a tool to a colleague without Python, `pyinstaller --onefile cli.py` bundles an interpreter into a single executable.

> **Tip:** Add `[tool.ruff]` and `[tool.pytest.ini_options]` sections to the same `pyproject.toml` so linting, formatting and testing configuration travel with the project.

### Try It Yourself

```python
import argparse, logging, sys, io, tomllib

parser = argparse.ArgumentParser(prog="docgen", description="Generate weekly production reports.")
parser.add_argument("input", help="CSV export")
parser.add_argument("-o", "--output", default="report.docx")
parser.add_argument("--state", action="append", help="filter by state; repeatable")
parser.add_argument("--dry-run", action="store_true")
parser.add_argument("-v", "--verbose", action="count", default=0)

stream = io.StringIO()
logging.basicConfig(stream=stream, level=logging.DEBUG, format="%(levelname)-7s %(name)s: %(message)s", force=True)
log = logging.getLogger("docgen.cli")

def main(argv):
    args = parser.parse_args(argv)
    level = [logging.WARNING, logging.INFO, logging.DEBUG][min(args.verbose, 2)]
    logging.getLogger().setLevel(level)
    log.info("input=%s output=%s states=%s", args.input, args.output, args.state)
    log.debug("dry-run=%s", args.dry_run)
    if args.dry_run:
        print("would write", args.output)
        return 0
    print("wrote", args.output)
    return 0

for argv in (["prod.csv", "--dry-run", "-vv", "--state", "TX", "--state", "WY"], ["prod.csv", "-o", "friday.docx", "-v"]):
    print("$ docgen", " ".join(argv), "-> exit", main(argv))
print(stream.getvalue())

pyproject = b'''
[project]
name = "docgen"
version = "1.2.0"
dependencies = ["python-docx>=1.1", "openpyxl>=3.1"]
[project.scripts]
docgen = "docgen.cli:main"
'''
meta = tomllib.loads(pyproject.decode())
print(meta["project"]["name"], meta["project"]["version"], meta["project"]["scripts"])
print(parser.format_usage().strip())
```

### Quiz

1. What exit code does `argparse` use for invalid arguments?
- [ ] 0
- [ ] 1
- [x] 2
> Usage errors exit with 2 by convention; your own failures should return 1.

2. Why should `main()` accept an `argv` parameter?
- [x] So tests can call it with a list instead of patching `sys.argv`
- [ ] argparse requires it
- [ ] To support Windows
> `parse_args(None)` falls back to `sys.argv[1:]`, so production behaviour is unchanged.

3. Where should logging handlers be configured?
- [ ] In every module that logs
- [x] Once, in the application's entry point
- [ ] In the library's `__init__.py`
> Libraries only obtain loggers; the application decides levels, formats and destinations.

4. What does `[project.scripts]` in `pyproject.toml` do?
- [ ] Lists shell scripts to copy
- [x] Creates a console command that calls the named function on install
- [ ] Runs the function during build
> The entry point becomes an executable on PATH inside the environment that installed the package.

### Exercises

1. **Sub-commands** — Extend a parser with `build` (takes `input`) and `validate` (takes `input` and `--strict`) sub-commands and dispatch to two functions.
<details><summary>Solution</summary>

```python
import argparse
p = argparse.ArgumentParser(prog="docgen")
sub = p.add_subparsers(dest="command", required=True)
b = sub.add_parser("build"); b.add_argument("input")
v = sub.add_parser("validate"); v.add_argument("input"); v.add_argument("--strict", action="store_true")
args = p.parse_args(["validate", "x.csv", "--strict"])
handlers = {"build": lambda a: print("building", a.input), "validate": lambda a: print("validating", a.input, a.strict)}
handlers[args.command](args)
```

</details>

2. **Rotating log** — Configure logging to write INFO and above to `job.log`, rotating at 1 MB with three backups, and WARNING and above to the console.
<details><summary>Solution</summary>

```python
import logging
from logging.handlers import RotatingFileHandler
fh = RotatingFileHandler("job.log", maxBytes=1_000_000, backupCount=3, encoding="utf-8")
fh.setLevel(logging.INFO)
ch = logging.StreamHandler(); ch.setLevel(logging.WARNING)
logging.basicConfig(level=logging.INFO, handlers=[fh, ch],
                    format="%(asctime)s %(levelname)s %(message)s")
```

</details>

### Interview Questions

**Q: How do you structure a Python project so it can be installed and tested cleanly?**
Use a `src/` layout with the package under `src/<name>/`, tests in a separate `tests/` folder, and a `pyproject.toml` declaring metadata, dependencies and console entry points. Install it into a virtual environment in editable mode (`pip install -e .`) so tests import the same code path users will get; the `src/` layout guarantees that an uninstalled package cannot be imported by accident from the repo root. Pin development tools (pytest, ruff, mypy) as optional dependencies under `[project.optional-dependencies]`, run them in CI, and generate a lock file with `pip-tools` or `uv` for reproducible deployments.

**Q: Why use the `logging` module instead of `print`?**
`logging` separates diagnostic messages from program output, supports severity levels that can be raised or lowered at runtime without code changes, records timestamps and module names automatically, and routes messages to multiple destinations such as a rotating file, the console and a monitoring system. `log.exception` captures full tracebacks inside `except` blocks. Because messages use lazy `%` formatting, expensive string building is skipped when the level is disabled. In a scheduled report job this is the difference between "it failed last night" and a log line that says which file, which row and which exception at 02:13.

**Q: What is the difference between a wheel and an sdist, and why does it matter?**
An sdist is the source tarball; installing it requires running the build backend on the user's machine, and for packages with C extensions that means a compiler. A wheel is a pre-built zip archive with a standardised name encoding the Python version, ABI and platform (`py3-none-any` for pure Python), so `pip` just unpacks it, which is faster and more reliable. Publish both: wheels for the common platforms and an sdist as the fallback. The `build` package creates both and `twine` uploads them; `pip` prefers a matching wheel automatically.

**Q: How would you deploy a Python automation to run every Friday on a server that has no internet access?**
Build a wheel of the tool and download its dependencies on a connected machine with `pip download -r requirements.txt -d wheels/ --platform` matching the server, copy the folder over, and install offline with `pip install --no-index --find-links wheels/ docgen`. Alternatively freeze everything into a single executable with PyInstaller or a container image. Then schedule it with cron or Windows Task Scheduler calling the installed `docgen` command with absolute paths, capture stdout and stderr to a log file, and have the job exit non-zero on failure so the scheduler can alert. Pin versions so the offline install is reproducible and keep the wheels folder under version control or in artifact storage.

## Interview coding patterns

Coding interviews for analyst, automation and junior software roles reuse a small set of patterns. Recognising the pattern turns a scary blank editor into a familiar template. This chapter collects the ones that appear most often, each with the Python idiom that makes it short.

### Hash map for counting and lookup

Most "find the pair", "first duplicate" and "most frequent" questions are one pass with a dict or set.

```python
from collections import Counter

def first_duplicate(items):
    seen = set()
    for x in items:
        if x in seen:
            return x
        seen.add(x)
    return None

def top_k(words, k):
    return [w for w, _ in Counter(words).most_common(k)]

def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return seen[target - n], i
        seen[n] = i
```

Anagram grouping is `groups.setdefault("".join(sorted(w)), []).append(w)`.

### Two pointers and sliding window

Sorted arrays and substrings problems use two indexes moving toward or with each other.

```python
def is_palindrome(s):
    s = [c.lower() for c in s if c.isalnum()]
    i, j = 0, len(s) - 1
    while i < j:
        if s[i] != s[j]:
            return False
        i, j = i + 1, j - 1
    return True

def longest_unique_substring(s):
    last, start, best = {}, 0, 0
    for i, ch in enumerate(s):
        if ch in last and last[ch] >= start:
            start = last[ch] + 1
        last[ch] = i
        best = max(best, i - start + 1)
    return best
```

### Stack for matching and parsing

```python
def balanced(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack
```

The same shape validates nested XML tags in a DOCX or evaluates reverse Polish notation.

### Binary search

```python
import bisect

def search(sorted_list, target):
    lo, hi = 0, len(sorted_list) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if sorted_list[mid] == target:
            return mid
        if sorted_list[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

# rate matrix lookup: which tier does coverage 250,000 fall in?
tiers = [0, 50_000, 100_000, 250_000, 500_000]
print(bisect.bisect_right(tiers, 250_000) - 1)     # 3
```

`bisect` is the honest answer in production; writing the loop by hand is the interview answer.

### Recursion, memoisation and dynamic programming

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def ways_to_climb(n):                # 1 or 2 steps at a time
    return 1 if n <= 1 else ways_to_climb(n - 1) + ways_to_climb(n - 2)

def coin_change(coins, amount):      # fewest coins, bottom-up DP
    best = [0] + [float("inf")] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                best[a] = min(best[a], best[a - c] + 1)
    return best[amount] if best[amount] != float("inf") else -1
```

Spot DP when the problem asks for a count, minimum or maximum over choices and sub-problems overlap.

### Breadth-first and depth-first search

```python
from collections import deque

def shortest_path(graph, start, goal):
    queue, seen = deque([(start, 0)]), {start}
    while queue:
        node, dist = queue.popleft()
        if node == goal:
            return dist
        for nxt in graph.get(node, ()):
            if nxt not in seen:
                seen.add(nxt)
                queue.append((nxt, dist + 1))
    return -1
```

BFS with a deque finds shortest paths in unweighted graphs; DFS with recursion or a stack finds connected components, cycles and topological orders (dependency ordering of report sections, for example).

### Sorting with keys and intervals

Merging overlapping intervals (meeting rooms, shift schedules) is sort-then-sweep: sort by start, then extend the current interval while the next start is inside it. `sorted(rows, key=lambda r: (-r.score, r.name))` sorts by score descending then name ascending.

### How to perform in the interview

1. Restate the problem and ask about input size, duplicates, empty input and value ranges.
2. Say the brute force and its complexity, then improve it.
3. Write clean code with real names; talk while you type.
4. Trace one small example by hand, then test the edge cases you listed.
5. State time and space complexity at the end.

> **Interview note:** Python-specific points that impress: `collections.Counter`, `deque`, `heapq` for top-k in O(n log k), `enumerate` instead of `range(len(x))`, `zip` for pairing, and saying "I would use `bisect` in production but let me implement it".

### Try It Yourself

```python
from collections import Counter, deque
from functools import lru_cache
import bisect, heapq

def first_duplicate(items):
    seen = set()
    for x in items:
        if x in seen: return x
        seen.add(x)
print("first dup:", first_duplicate([3, 1, 4, 1, 5]))

def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen: return seen[target - n], i
        seen[n] = i
print("two sum:", two_sum([2, 7, 11, 15], 9))

def balanced(s):
    pairs, stack = {")": "(", "]": "[", "}": "{"}, []
    for ch in s:
        if ch in "([{": stack.append(ch)
        elif ch in pairs and (not stack or stack.pop() != pairs[ch]): return False
    return not stack
print("balanced:", balanced("{[()]}"), balanced("([)]"))

tiers = [0, 50_000, 100_000, 250_000, 500_000]
print("tier for 249,999:", bisect.bisect_right(tiers, 249_999) - 1)

@lru_cache(maxsize=None)
def climb(n): return 1 if n <= 1 else climb(n - 1) + climb(n - 2)
print("ways to climb 30:", climb(30))

graph = {"intake": ["search", "exam"], "search": ["commit"], "exam": ["commit"], "commit": ["policy"]}
def bfs(g, a, b):
    q, seen = deque([(a, 0)]), {a}
    while q:
        node, d = q.popleft()
        if node == b: return d
        for n in g.get(node, ()):
            if n not in seen: seen.add(n); q.append((n, d + 1))
    return -1
print("intake -> policy steps:", bfs(graph, "intake", "policy"))

def merge(intervals):
    out = []
    for s, e in sorted(intervals):
        if out and s <= out[-1][1]: out[-1][1] = max(out[-1][1], e)
        else: out.append([s, e])
    return out
print("merged shifts:", merge([[9, 12], [11, 13], [14, 16], [15, 17], [18, 19]]))

scores = [("Sara", 97), ("Bilal", 91), ("Hina", 86), ("Omar", 94)]
print("top 2 agents:", heapq.nlargest(2, scores, key=lambda r: r[1]))
print("anagrams:", Counter("listen") == Counter("silent"))
```

### Quiz

1. Which structure gives O(1) `popleft` for BFS?
- [ ] `list`
- [x] `collections.deque`
- [ ] `set`
> `list.pop(0)` is O(n); a deque pops from either end in constant time.

2. What is the time complexity of two-sum with a hash map?
- [ ] O(n²)
- [x] O(n)
- [ ] O(n log n)
> One pass, with each lookup and insert being O(1) on average.

3. Which pattern solves "longest substring without repeating characters"?
- [x] Sliding window
- [ ] Binary search
- [ ] Dynamic programming
> A window expands with the right pointer and jumps its left edge past repeated characters.

4. What does `@lru_cache` add to a naive recursive Fibonacci?
- [ ] Nothing; recursion is already efficient
- [x] Memoisation, turning exponential time into linear
- [ ] Iteration
> Each `fib(n)` is computed once and stored, so later calls return instantly.

### Exercises

1. **Group anagrams** — Group `["eat", "tea", "tan", "ate", "nat", "bat"]` into lists of anagrams.
<details><summary>Solution</summary>

```python
words = ["eat", "tea", "tan", "ate", "nat", "bat"]
groups = {}
for w in words:
    groups.setdefault("".join(sorted(w)), []).append(w)
print(list(groups.values()))
```

</details>

2. **Top k frequent** — Return the 2 most frequent numbers in `[1, 1, 1, 2, 2, 3]` using `heapq` in O(n log k).
<details><summary>Solution</summary>

```python
import heapq
from collections import Counter
nums, k = [1, 1, 1, 2, 2, 3], 2
counts = Counter(nums)
print(heapq.nlargest(k, counts, key=counts.get))   # [1, 2]
```

</details>

3. **Valid production sequence** — Titles must move `intake -> search -> exam -> commit -> policy`. Given a log of events per file, detect any file whose events are out of order.
<details><summary>Solution</summary>

```python
order = {s: i for i, s in enumerate(["intake", "search", "exam", "commit", "policy"])}
log = {"F1": ["intake", "search", "exam"], "F2": ["intake", "exam", "search"]}
for f, events in log.items():
    steps = [order[e] for e in events]
    print(f, "ok" if steps == sorted(steps) else "OUT OF ORDER")
```

</details>

### Interview Questions

**Q: How would you find the first non-repeating character in a string, and what is the complexity?**
Count characters in one pass with `collections.Counter`, then walk the string a second time and return the first character whose count is one; both passes are O(n) time and the counter is O(k) space for k distinct characters. Because dicts preserve insertion order since 3.7 you can also do it in one structure: `next((c for c, n in Counter(s).items() if n == 1), None)`. Mention that for a fixed alphabet an array of 26 or 256 counters is even leaner, and that the naive `s.count(c)` inside a loop is O(n²) and would be rejected for long inputs.

**Q: Explain how you would approach a problem you have never seen in an interview.**
Clarify inputs, outputs and constraints first, including size limits and edge cases such as empty input, duplicates and negative numbers. Propose the brute-force solution aloud with its complexity so the interviewer knows you can solve it at all, then look for the structure that improves it: repeated lookups suggest a hash map, sorted data suggests binary search or two pointers, nested choices suggest recursion with memoisation, and "shortest" or "fewest" suggests BFS. Write the code in small functions, test with a tiny example by hand, and finish by stating time and space complexity and what you would change for production, such as using `bisect` or `heapq` instead of hand-rolled loops.

**Q: What is the difference between O(n log n) and O(n²), and where does each come from in practice?**
O(n²) usually comes from a nested loop over the same data, such as comparing every record with every other to find duplicates; doubling the input quadruples the time, so 50,000 rows means 2.5 billion comparisons. O(n log n) comes from comparison sorting, or from n operations that each cost log n, such as binary searches or heap pushes; doubling the input roughly doubles the time plus a little. In practice the difference is a job that finishes in a second versus one that runs for an hour, which is why sorting first and then sweeping, or hashing into a dict for O(n), is the standard escape from quadratic behaviour.

**Q: Write a function to merge two sorted lists into one sorted list without using `sorted`.**
Walk both lists with two indexes, always appending the smaller head and advancing that index, then append whatever remains from the longer list. Time is O(n + m) and space is O(n + m) for the output. In Python: `import heapq; list(heapq.merge(a, b))` does the same lazily and is the production answer, but the interview wants the two-pointer version:
```python
def merge(a, b):
    i = j = 0; out = []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]: out.append(a[i]); i += 1
        else: out.append(b[j]); j += 1
    return out + a[i:] + b[j:]
```
This is the merge step of merge sort, and interviewers often follow up by asking you to sort a list with it recursively.
