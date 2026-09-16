---
id: oop
title: Object-Oriented Programming
icon: 🧩
track: Programming
color: #8E44AD
runner: python
packages: 
tagline: Classes, objects, inheritance, polymorphism and design patterns in Python and JavaScript.
description: Object-oriented programming taught the way university courses and technical interviews expect it: the four pillars, UML, SOLID, design patterns, composition vs inheritance, and how these ideas appear in Python and JavaScript codebases.
---

# LEVEL: Beginner

## What is OOP (procedural vs object-oriented)

**Object-oriented programming (OOP)** is a way of organising code around *things* (objects) that combine data and the operations on that data, instead of around a sequence of steps. Most large programs you will read, from `python-docx` to the JavaScript in a web page, are written this way, and every software engineering degree and most technical interviews expect you to explain it.

### The procedural way

In **procedural** code, data lives in variables and functions operate on it from outside. Here is a tiny document tracker written that way:

```python
doc_title = "Employee Handbook"
doc_pages = 767
doc_status = "draft"

def approve(status):
    if status == "draft":
        return "approved"
    return status

def summary(title, pages, status):
    return f"{title}: {pages} pages [{status}]"

doc_status = approve(doc_status)
print(summary(doc_title, doc_pages, doc_status))
```

This works for one document. With fifty documents you need fifty sets of variables, or parallel lists that must be kept in sync, and every function needs the right combination of arguments passed in the right order. Nothing stops `approve` being called with a page count by mistake.

### The object-oriented way

OOP bundles the data and the functions that belong to it into one unit, a **class**, and lets you create as many independent **objects** from it as you need:

```python
class Document:
    def __init__(self, title, pages):
        self.title = title
        self.pages = pages
        self.status = "draft"

    def approve(self):
        if self.status == "draft":
            self.status = "approved"

    def summary(self):
        return f"{self.title}: {self.pages} pages [{self.status}]"

handbook = Document("Employee Handbook", 767)
sop = Document("Onboarding SOP", 12)
handbook.approve()
print(handbook.summary())
print(sop.summary())
```

Each object carries its own `title`, `pages` and `status`, and `approve()` always acts on the right document because it is called *on* that document. The data and behaviour travel together.

### Vocabulary

| Term | Meaning | In the example |
|---|---|---|
| Class | a blueprint describing data and behaviour | `Document` |
| Object / instance | one concrete thing built from the blueprint | `handbook`, `sop` |
| Attribute / field / property | a piece of data stored in an object | `title`, `pages`, `status` |
| Method | a function that belongs to a class | `approve()`, `summary()` |
| State | the current values of an object's attributes | `status == "approved"` |
| Message | calling a method on an object | `handbook.approve()` |

### The four pillars

Interviewers and exams describe OOP through four principles, each of which gets its own chapter later:

1. **Encapsulation** — keep data and the code that changes it together, and hide the internal details behind a clear interface.
2. **Abstraction** — expose only what the user of a class needs (`approve()`), not how it works inside.
3. **Inheritance** — build new classes from existing ones (`PdfDocument` is a `Document`).
4. **Polymorphism** — different classes can respond to the same message in their own way (`summary()` on a PDF versus a DOCX).

### When OOP helps and when it does not

OOP shines when you model many similar things with state that changes over time: documents in a pipeline, agents on a BPO team, policies in a title-insurance system, widgets in a user interface. It adds ceremony you do not need for a ten-line script that converts one CSV file; a couple of plain functions are better there. Modern Python and JavaScript mix styles freely: functions for transformations, classes for stateful things.

> **Interview note:** "What is OOP?" is a warm-up question. Give the one-sentence definition (objects that combine state and behaviour), name the four pillars, and then give a concrete example from your own work, such as a `Document` class with `approve()` and `export_pdf()` methods, rather than the textbook `Animal`/`Dog`.

### Try It Yourself

```python
# Procedural version
def summary(title, pages, status):
    return f"{title}: {pages} pages [{status}]"

print(summary("Employee Handbook", 767, "draft"))

# Object-oriented version of the same idea
class Document:
    def __init__(self, title, pages):
        self.title = title
        self.pages = pages
        self.status = "draft"

    def approve(self):
        if self.status == "draft":
            self.status = "approved"

    def summary(self):
        return f"{self.title}: {self.pages} pages [{self.status}]"

docs = [Document("Employee Handbook", 767), Document("Onboarding SOP", 12), Document("Letterhead", 1)]
docs[0].approve()
for d in docs:
    print(d.summary())

print(type(docs[0]).__name__, isinstance(docs[0], Document), docs[0] is docs[1])
```

### Quiz

1. What is a class?
- [x] A blueprint that describes the data and behaviour of a kind of object
- [ ] A single object in memory
- [ ] A function that returns a dictionary
> Objects are created from a class; the class itself is the description, not the thing.

2. Which statement about procedural code is true?
- [ ] It cannot use functions
- [x] Data and the functions that operate on it are kept separate
- [ ] It is always slower than OOP
> Procedural programs pass data into free-standing functions; OOP bundles the two together.

3. Which of these is NOT one of the four pillars of OOP?
- [ ] Encapsulation
- [ ] Polymorphism
- [x] Compilation
> The four pillars are encapsulation, abstraction, inheritance and polymorphism.

4. In `handbook.approve()`, what is `handbook`?
- [ ] A class
- [x] An object (instance) receiving the message `approve`
- [ ] A method
> Calling a method on an object is sometimes described as sending it a message.

### Exercises

1. **Rewrite procedurally to OOP** — Convert a procedural agent tracker (`name`, `files_processed`, a function `log_file(count)` that adds one) into an `Agent` class with a `log_file()` method.
<details><summary>Solution</summary>

```python
class Agent:
    def __init__(self, name):
        self.name = name
        self.files_processed = 0

    def log_file(self):
        self.files_processed += 1

a = Agent("Sara")
a.log_file(); a.log_file()
print(a.name, a.files_processed)   # Sara 2
```

</details>

2. **Identify the parts** — In the `Document` class above, list which names are attributes, which are methods, and which are objects.
<details><summary>Solution</summary>

```text
Attributes: title, pages, status
Methods: __init__, approve, summary
Objects: handbook, sop (and every element of docs)
Class: Document
```

</details>

### Interview Questions

**Q: What is object-oriented programming and why is it used?**
OOP organises a program as a collection of objects, each combining state (attributes) and behaviour (methods), created from classes that act as blueprints. It is used because it maps naturally onto real-world entities, keeps related data and logic together so changes are localised, allows code reuse through inheritance and composition, and lets you swap implementations through polymorphism. For example, a document pipeline with `Document`, `PdfDocument` and `DocxDocument` classes can add EPUB support by adding one class rather than editing every function that handles files. The trade-off is extra structure, which is overkill for small scripts.

**Q: What is the difference between a class and an object?**
A class is the definition: it names the attributes an object will have and the methods it can run, and it exists once in the program. An object (or instance) is a concrete value created from that class, with its own copy of the attribute values, and you can have thousands of them. `Document` is the class; `Document("SOP", 12)` creates one object, and `Document("Handbook", 767)` creates a different one with independent state. In Python the class itself is also an object, which is what allows class attributes and class methods.

**Q: What are the four pillars of OOP? Give a one-line example of each.**
Encapsulation: bundling data with methods and restricting direct access, such as a `Bank Account` whose balance changes only through `deposit()` and `withdraw()`. Abstraction: exposing a simple interface and hiding complexity, such as `document.export_pdf()` hiding the rendering engine. Inheritance: deriving a specialised class from a general one, such as `PdfDocument(Document)` reusing `approve()`. Polymorphism: different classes responding to the same call, such as `doc.render()` producing DOCX XML or PDF bytes depending on the object's class. A strong answer adds that composition is often preferred over inheritance in practice.

## Classes & objects

A **class** is created with the `class` keyword. Calling the class like a function creates an **object**. Everything else in OOP builds on these two moves, so this chapter looks at exactly what happens when you define a class and instantiate it.

### Defining a class

```python
class Policy:
    """A title-insurance policy."""

p = Policy()
print(type(p))          # <class '__main__.Policy'>
print(isinstance(p, Policy))   # True
```

Even an empty class is useful: the body can be `pass` or just a docstring. `type(p)` returns the class, and `isinstance` checks whether an object was made from a class (or one of its subclasses). Class names use `CapWords` by convention; instances use `snake_case`.

### Instances are independent

```python
a = Policy()
b = Policy()
a.state = "TX"
b.state = "WY"
print(a.state, b.state)      # TX WY
print(a is b)                # False
```

Each call to `Policy()` builds a new object with its own memory. Python lets you attach attributes to an instance at any time, though real code sets them in `__init__` so every instance has the same shape.

### Class attributes versus instance attributes

```python
class Policy:
    rate_per_thousand = 5.75      # class attribute: shared by all policies

    def __init__(self, coverage):
        self.coverage = coverage  # instance attribute: unique per policy

p1, p2 = Policy(250_000), Policy(98_000)
print(p1.rate_per_thousand, p2.rate_per_thousand)   # 5.75 5.75
Policy.rate_per_thousand = 6.00                     # changes for everyone
print(p1.rate_per_thousand)                         # 6.0
p2.rate_per_thousand = 4.10                         # creates an instance attribute on p2 only
print(Policy.rate_per_thousand, p1.rate_per_thousand, p2.rate_per_thousand)   # 6.0 6.0 4.1
```

Lookup goes instance first, then class, then parent classes. Assigning through an instance always writes to that instance, never to the class, which is a common source of confusion. Class attributes are right for constants and defaults; mutable class attributes such as a list are a trap because every instance shares the same list.

### Inspecting objects

| Tool | What it shows |
|---|---|
| `vars(p)` or `p.__dict__` | the instance's own attributes as a dict |
| `dir(p)` | every attribute and method name available, including inherited |
| `type(p)` / `p.__class__` | the class |
| `Policy.__name__`, `Policy.__doc__` | name and docstring |
| `hasattr(p, "state")`, `getattr(p, "state", None)` | safe attribute access |

`vars(p)` makes the difference between class and instance attributes visible: after `p2.rate_per_thousand = 4.10`, `vars(p2)` contains it while `vars(p1)` does not.

### The same idea in JavaScript

JavaScript has had `class` syntax since ES2015. The shape is familiar, though the mechanism underneath (prototypes) is different and is covered in the Advanced level:

```js
class Policy {
  static ratePerThousand = 5.75;      // class-level field
  constructor(coverage) {
    this.coverage = coverage;          // instance field
  }
}
const p = new Policy(250000);
console.log(p instanceof Policy, Policy.ratePerThousand);
```

Note `new` is required in JavaScript, and class-level data uses `static`.

### Objects as values

Objects can be stored in lists and dictionaries, passed to functions and returned from them, just like numbers and strings. A list of `Policy` objects sorted by coverage, or a dictionary mapping policy numbers to `Policy` objects, is the normal way to hold a batch in memory.

> **Tip:** Everything in Python is an object, including integers, functions and classes themselves. `type(Policy)` is `type`, the metaclass that builds classes. You do not need metaclasses in daily work, but knowing that classes are objects explains why you can pass a class to a function or store it in a dict.

### Try It Yourself

```python
class Policy:
    """A title-insurance policy."""
    rate_per_thousand = 5.75          # shared default

    def __init__(self, policy_no, coverage):
        self.policy_no = policy_no
        self.coverage = coverage

p1 = Policy("TX-0042", 250_000)
p2 = Policy("WY-0007", 98_000)

print(type(p1).__name__, isinstance(p1, Policy), p1 is p2)
print("instance dict:", vars(p1))
print("class attr via instance:", p1.rate_per_thousand)

Policy.rate_per_thousand = 6.0          # change the shared default
p2.rate_per_thousand = 4.10             # override on one instance only
print("p1:", p1.rate_per_thousand, "| p2:", p2.rate_per_thousand, "| class:", Policy.rate_per_thousand)
print("p2 own attributes:", list(vars(p2)))

batch = {p.policy_no: p for p in (p1, p2)}
print(sorted(batch, key=lambda k: batch[k].coverage))
print("is a class an object?", isinstance(Policy, object), type(Policy).__name__)
```

### Quiz

1. What does calling `Policy()` do?
- [ ] Defines the class
- [x] Creates a new instance of `Policy`
- [ ] Copies the last instance
> Calling a class runs `__new__` and then `__init__` and returns a fresh object.

2. After `Policy.rate = 6.0` and `p.rate = 4.1`, what is `Policy.rate`?
- [x] 6.0
- [ ] 4.1
- [ ] An error is raised
> Assigning through an instance creates an instance attribute; the class attribute is untouched.

3. Which call returns only the attributes stored on the instance itself?
- [ ] `dir(p)`
- [x] `vars(p)`
- [ ] `type(p)`
> `vars` returns `p.__dict__`; `dir` includes class and inherited names.

4. In JavaScript, how do you create an instance of a class?
- [ ] `Policy()`
- [x] `new Policy()`
- [ ] `Policy.create()`
> JavaScript class constructors must be called with `new`; calling without it throws a `TypeError`.

### Exercises

1. **Shared counter bug** — Create a class with a class attribute `items = []` and show that two instances share it, then fix it using `__init__`.
<details><summary>Solution</summary>

```python
class Bad:
    items = []
a, b = Bad(), Bad()
a.items.append("x")
print(b.items)          # ['x'] shared!

class Good:
    def __init__(self):
        self.items = []
c, d = Good(), Good()
c.items.append("x")
print(d.items)          # []
```

</details>

2. **Registry** — Build a dictionary of `Agent` objects keyed by name from the list `["Sara", "Bilal", "Hina"]` and print the names of agents with more than 30 files after setting some values.
<details><summary>Solution</summary>

```python
class Agent:
    def __init__(self, name, files=0):
        self.name, self.files = name, files
team = {n: Agent(n) for n in ["Sara", "Bilal", "Hina"]}
team["Sara"].files, team["Hina"].files = 42, 38
print([a.name for a in team.values() if a.files > 30])
```

</details>

### Interview Questions

**Q: What is the difference between a class attribute and an instance attribute?**
A class attribute is defined in the class body and stored once on the class object, so every instance sees the same value unless it shadows it; an instance attribute is set on `self` (usually in `__init__`) and belongs to one object. Reads fall back from instance to class, but writes through an instance always create or update an instance attribute, so `Policy.rate = 6` changes the default for everyone while `p.rate = 4.1` affects only `p`. Class attributes are ideal for constants and defaults; a mutable class attribute such as a list is shared state and almost always a bug.

**Q: What happens step by step when you call `Policy("TX", 250000)`?**
Python calls the metaclass's `__call__`, which first invokes `Policy.__new__(Policy, "TX", 250000)` to allocate a bare instance, then `Policy.__init__(instance, "TX", 250000)` to populate it, and returns the instance. `__new__` is rarely overridden (immutable types and singletons are the main cases), while `__init__` is where almost all initialisation goes. If `__init__` returns anything other than `None` Python raises `TypeError`, which is a reminder that it initialises an existing object rather than creating one.

**Q: Is everything in Python an object, and why does that matter?**
Yes: integers, strings, functions, modules and classes are all instances of some class, and classes are instances of `type`. This uniformity means you can pass functions and classes as arguments, store them in dictionaries for dispatch tables, add attributes to them, and introspect them with `type`, `vars` and `dir`. It also underlies decorators, factories that return classes, and plugin registries, and it is why `isinstance(Policy, object)` is `True`. In JavaScript the picture is similar in that functions and classes are objects, but primitives such as numbers are not objects and get temporarily wrapped when you call methods on them.

## Attributes & methods

Objects hold **attributes** (data) and expose **methods** (functions that act on that data). This chapter shows how methods access the object they belong to, how they change state, and how to design them so they read clearly.

### Methods receive the instance

```python
class Batch:
    def __init__(self, name):
        self.name = name
        self.files = []

    def add(self, filename):
        self.files.append(filename)

    def count(self):
        return len(self.files)

friday = Batch("TX Friday")
friday.add("TX-0042.pdf")
friday.add("TX-0043.pdf")
print(friday.count())            # 2
print(Batch.count(friday))       # 2, the same call spelled out
```

`friday.add("x")` is sugar for `Batch.add(friday, "x")`. Python passes the instance as the first parameter automatically, and by universal convention that parameter is named `self`. Forgetting `self` in the definition produces the famous error `add() takes 1 positional argument but 2 were given`.

### Methods that read, methods that change

A good habit from OOP design is to separate **queries** (return information, change nothing) from **commands** (change state, return nothing or a status). `count()` is a query; `add()` is a command. Mixing them, such as a method that both changes state and returns a computed value, makes code harder to reason about and test.

### Methods calling methods

```python
class Batch:
    ...
    def is_full(self):
        return self.count() >= 40

    def add(self, filename):
        if self.is_full():
            raise ValueError(f"{self.name} is full")
        self.files.append(filename)
```

Inside a method you call other methods through `self`. This keeps the rule "40 files per batch" in one place; if the limit changes you edit `is_full` only.

### Returning self for chaining

```python
class Report:
    def __init__(self):
        self.lines = []
    def title(self, text):
        self.lines.append(text.upper()); return self
    def line(self, text):
        self.lines.append(text); return self
    def build(self):
        return "\n".join(self.lines)

print(Report().title("Weekly status").line("Texas: 1,284 files").build())
```

Returning `self` allows a fluent style. JavaScript libraries such as jQuery and many builder APIs use this heavily; in Python it is common in test builders and query builders (SQLAlchemy, pandas method chains).

### Attributes computed on demand

Not every piece of information needs storing. A value that can be derived from others should usually be a method or a property, so it can never go stale:

```python
class Policy:
    def __init__(self, coverage, rate=5.75):
        self.coverage = coverage
        self.rate = rate
    def premium(self):
        return max(self.coverage / 1000 * self.rate, 100.0)
```

If `premium` were stored in `__init__`, changing `coverage` later would leave a wrong premium behind.

### Naming and the public interface

| Convention | Meaning |
|---|---|
| `name` | public: part of the class's interface |
| `_name` | internal: "please do not touch from outside" |
| `__name` | name-mangled to `_ClassName__name`; avoids clashes in subclasses |
| `__name__` | dunder: reserved for Python protocols |

Python does not enforce privacy; the underscore is a contract between programmers. Methods should be verbs (`add`, `approve`, `export_pdf`); attributes and query methods should be nouns or adjectives (`files`, `is_full`, `premium`).

### The same in JavaScript

```js
class Batch {
  #files = [];                       // truly private field (ES2022)
  constructor(name) { this.name = name; }
  add(filename) { this.#files.push(filename); return this; }
  get count() { return this.#files.length; }
}
console.log(new Batch("TX").add("a.pdf").add("b.pdf").count);   // 2
```

JavaScript uses `this` instead of `self` and does not list it as a parameter; `#files` is genuinely private, unlike Python's convention.

> **Warning:** Methods that need no `self` are a sign the function does not belong in the class, or should be a `@staticmethod`. Every method that takes `self` but never uses it is a code smell reviewers will flag.

### Try It Yourself

```python
class Batch:
    LIMIT = 40

    def __init__(self, name):
        self.name = name
        self._files = []

    def add(self, filename):
        if self.is_full():
            raise ValueError(f"{self.name} is full")
        self._files.append(filename)
        return self                      # enables chaining

    def count(self):
        return len(self._files)

    def is_full(self):
        return self.count() >= self.LIMIT

    def describe(self):
        state = "FULL" if self.is_full() else f"{self.LIMIT - self.count()} slots left"
        return f"{self.name}: {self.count()} files ({state})"

friday = Batch("TX Friday")
friday.add("TX-0042.pdf").add("TX-0043.pdf")
print(friday.describe())
print("explicit call:", Batch.count(friday))

for i in range(38):
    friday.add(f"TX-{100 + i}.pdf")
print(friday.describe())
try:
    friday.add("one too many")
except ValueError as err:
    print("error:", err)

print("public interface:", [n for n in dir(friday) if not n.startswith("_")])
```

### Quiz

1. What does `self` refer to inside a method?
- [x] The instance the method was called on
- [ ] The class
- [ ] The previous method's return value
> Python inserts the instance as the first argument automatically; `self` is just the conventional name.

2. `friday.add("x")` is equivalent to which call?
- [ ] `add(friday, "x")`
- [x] `Batch.add(friday, "x")`
- [ ] `Batch.add("x")`
> Method call syntax binds the instance as the first argument of the function stored on the class.

3. Why return `self` from a method?
- [ ] It is required by Python
- [x] To allow method chaining such as `r.title("a").line("b")`
- [ ] To make the method a query
> Returning the instance lets the next call operate on the same object in one expression.

4. What does a single leading underscore on `_files` mean?
- [ ] Python blocks access from outside the class
- [x] It is internal by convention and callers should not rely on it
- [ ] It is a class attribute
> Python has no enforced privacy; the underscore is a signal to other programmers and to tools like `help()`.

### Exercises

1. **Query vs command** — Write a `Counter` class with `increment()` (command, returns nothing), `value()` (query) and `reset()`; show that `value()` never changes state.
<details><summary>Solution</summary>

```python
class Counter:
    def __init__(self):
        self._n = 0
    def increment(self):
        self._n += 1
    def value(self):
        return self._n
    def reset(self):
        self._n = 0
c = Counter(); c.increment(); c.increment()
print(c.value(), c.value()); c.reset(); print(c.value())
```

</details>

2. **Fluent builder** — Write an `Email` class whose `to()`, `subject()` and `body()` methods chain, and a `render()` method that returns the text.
<details><summary>Solution</summary>

```python
class Email:
    def __init__(self):
        self._to, self._subject, self._body = "", "", ""
    def to(self, addr): self._to = addr; return self
    def subject(self, s): self._subject = s; return self
    def body(self, b): self._body = b; return self
    def render(self):
        return f"To: {self._to}\nSubject: {self._subject}\n\n{self._body}"
print(Email().to("ops@example.com").subject("Friday report").body("Attached.").render())
```

</details>

### Interview Questions

**Q: Why does Python require `self` explicitly while Java and JavaScript use an implicit `this`?**
Python's design principle "explicit is better than implicit" applies: a method is just a function stored on the class, and `obj.method(x)` binds `obj` as the first argument, so writing `self` makes that mechanism visible and lets you call `Class.method(obj, x)` directly or pass unbound methods around. It also avoids ambiguity between local variables and attributes, since attributes always appear as `self.name`. JavaScript's `this` is set at call time by how the function is invoked, which is a frequent source of bugs (a method extracted into a callback loses its `this`), and Python avoids that class of problem entirely by binding at attribute access.

**Q: What is command-query separation and why does it matter?**
Command-query separation is the principle that a method should either change state (a command) or return information (a query), not both. Queries become safe to call any number of times, in any order, in logging statements and in tests without side effects, while commands are the only places state changes, which makes the flow of data easier to trace. A classic violation is `stack.pop()`, which both mutates and returns, accepted for convenience; a worse one is a `get_report()` method that silently regenerates and saves the file, surprising callers who only wanted to read it.

**Q: When should a value be a stored attribute and when should it be computed by a method?**
Store values that are inputs or independent facts, such as `coverage` and `rate`; compute values that derive from them, such as `premium`, so they cannot drift out of sync when an input changes. Compute in a method or `@property` unless profiling shows the calculation is expensive and called often, in which case cache it explicitly (`functools.cached_property`) and invalidate the cache when inputs change. Storing derived data is a form of duplication, and the bug it produces, a stale value that was correct at construction time, is one of the hardest to spot in reports.

## Constructors, self & this

A **constructor** is the code that runs when an object is created. It sets the object's initial state so that every method can rely on the attributes existing. In Python the constructor is `__init__`; in JavaScript it is the `constructor` method. Both receive a reference to the new object: `self` in Python, `this` in JavaScript.

### __init__ in Python

```python
class Agent:
    def __init__(self, name, team, files=0):
        self.name = name
        self.team = team
        self.files = files
        self.active = True

sara = Agent("Sara", "Title Search")
bilal = Agent("Bilal", "QA", files=12)
print(vars(sara))
```

Every parameter after `self` is filled from the arguments to `Agent(...)`. Defaults make arguments optional. Attributes that are always the same at creation (`active = True`) still go in `__init__` so that the object's shape is defined in one place. Assign every attribute in `__init__`, even if only to `None`; methods should never need `hasattr` checks.

### Validation belongs in the constructor

```python
class Policy:
    def __init__(self, policy_no, coverage):
        if coverage <= 0:
            raise ValueError("coverage must be positive")
        if not policy_no.startswith(("TX", "WY", "FL")):
            raise ValueError(f"unsupported state in {policy_no}")
        self.policy_no = policy_no
        self.coverage = coverage
```

An object that cannot be constructed in an invalid state never needs defensive checks later. Raising in `__init__` aborts creation, and the caller gets a clear exception at the point of the mistake instead of a `NoneType` error three functions away.

### __new__ versus __init__

Python actually creates the object in `__new__` and then calls `__init__` to fill it in. You override `__new__` only for immutable types (subclassing `tuple` or `str`) or for singletons and object pools; day-to-day code only writes `__init__`. Interviewers ask about the distinction because it reveals whether you understand that `__init__` initialises an object that already exists.

### Alternative constructors

A class can offer several ways to build itself using `@classmethod`, covered in depth later:

```python
class Policy:
    ...
    @classmethod
    def from_csv_row(cls, row):
        policy_no, coverage = row.split(",")
        return cls(policy_no, float(coverage))

p = Policy.from_csv_row("TX-0042,250000")
```

### Constructors in JavaScript

```js
class Agent {
  constructor(name, team, files = 0) {
    this.name = name;
    this.team = team;
    this.files = files;
    this.active = true;
  }
}
const sara = new Agent("Sara", "Title Search");
console.log(sara);
```

The differences: `constructor` is a fixed method name, `this` is implicit, and you must call the class with `new`. Before ES2015 the same thing was written as a constructor function, `function Agent(name) { this.name = name; }`, and you still see that in older code.

### The `this` problem in JavaScript

`this` is decided by *how* a function is called, not where it was written:

```js
const agent = new Agent("Sara", "QA");
agent.describe = function () { return `${this.name} (${this.team})`; };
console.log(agent.describe());          // Sara (QA)
const fn = agent.describe;
console.log(fn());                      // TypeError: cannot read 'name' of undefined
setTimeout(() => console.log(agent.describe()), 0);   // arrow keeps outer this
```

Passing a method as a callback detaches it from its object. Fixes are `fn.bind(agent)`, an arrow function wrapper, or defining the method as an arrow-function class field (`describe = () => ...`). Python's bound methods carry their instance with them, so `fn = agent.describe; fn()` simply works.

### Comparing the two

| | Python | JavaScript |
|---|---|---|
| constructor name | `__init__` | `constructor` |
| reference to new object | `self` (explicit parameter) | `this` (implicit) |
| creation | `Agent("Sara")` | `new Agent("Sara")` |
| defaults | `files=0` in signature | `files = 0` in signature |
| private data | `_name` convention | `#name` fields |
| detached method keeps object? | yes (bound method) | no (unless bound or arrow) |

> **Tip:** Keep constructors cheap and free of side effects: no file reads, no network calls, no printing. A constructor that opens a database connection makes the class impossible to test without a database. Take dependencies as parameters instead and construct them outside.

### Try It Yourself

```python
class Policy:
    STATES = ("TX", "WY", "FL")

    def __init__(self, policy_no, coverage, rate=5.75):
        if coverage <= 0:
            raise ValueError("coverage must be positive")
        if policy_no[:2] not in self.STATES:
            raise ValueError(f"unsupported state in {policy_no}")
        self.policy_no = policy_no
        self.coverage = coverage
        self.rate = rate

    @classmethod
    def from_csv_row(cls, row):
        no, cov = row.split(",")
        return cls(no.strip(), float(cov))

    def premium(self):
        return max(self.coverage / 1000 * self.rate, 100.0)

good = Policy.from_csv_row("TX-0042, 250000")
print(vars(good), good.premium())

for bad in (("CA-0001", 100), ("TX-0002", -5)):
    try:
        Policy(*bad)
    except ValueError as err:
        print("rejected:", err)

# bound methods carry their instance, unlike JavaScript's detached `this`
calc = good.premium
print(calc(), calc.__self__ is good)

# __new__ runs before __init__
class Traced:
    def __new__(cls, *args):
        print("__new__ allocating", cls.__name__)
        return super().__new__(cls)
    def __init__(self, x):
        print("__init__ setting x =", x)
        self.x = x
Traced(7)
```

### Quiz

1. What does `__init__` return?
- [ ] The new object
- [x] `None`; it initialises an object that `__new__` already created
- [ ] The class
> Returning a value from `__init__` raises `TypeError`; creation happens in `__new__`.

2. Where should argument validation for a new object go?
- [x] In the constructor, raising an exception on bad input
- [ ] In every method that uses the attribute
- [ ] Nowhere; Python is dynamically typed
> Rejecting invalid state at construction time means the rest of the class can trust its attributes.

3. In JavaScript, what happens when you call `const f = obj.method; f()`?
- [ ] It works exactly like Python
- [x] `this` is undefined (or the global object), usually causing an error
- [ ] `f` is bound automatically
> `this` depends on the call site; detached methods lose their object unless bound or wrapped in an arrow function.

4. Which Python feature provides a second way to construct a class, such as from a CSV row?
- [ ] A second `__init__`
- [x] A `@classmethod` that returns `cls(...)`
- [ ] A global function only
> Python has no constructor overloading; class methods are the idiom for alternative constructors.

### Exercises

1. **Validated constructor** — Write a `Rectangle(width, height)` class that rejects non-positive dimensions and has an `area()` method.
<details><summary>Solution</summary>

```python
class Rectangle:
    def __init__(self, width, height):
        if width <= 0 or height <= 0:
            raise ValueError("dimensions must be positive")
        self.width, self.height = width, height
    def area(self):
        return self.width * self.height
print(Rectangle(8.5, 11).area())
```

</details>

2. **Alternative constructor** — Add `Rectangle.square(side)` and `Rectangle.from_string("8.5x11")` class methods.
<details><summary>Solution</summary>

```python
class Rectangle:
    def __init__(self, width, height):
        self.width, self.height = width, height
    @classmethod
    def square(cls, side):
        return cls(side, side)
    @classmethod
    def from_string(cls, text):
        w, h = text.lower().split("x")
        return cls(float(w), float(h))
print(vars(Rectangle.square(4)), vars(Rectangle.from_string("8.5x11")))
```

</details>

3. **JavaScript this** — Explain in a comment why the following fails and write the one-line fix: `const log = agent.describe; log();`
<details><summary>Solution</summary>

```js
// `this` is bound at call time; calling log() has no receiver, so this is undefined.
const log = agent.describe.bind(agent);   // or: const log = () => agent.describe();
log();
```

</details>

### Interview Questions

**Q: What is the difference between `__new__` and `__init__`?**
`__new__` is a static method that receives the class and returns a new instance; it is the actual constructor and is the only place you can control allocation. `__init__` receives that instance as `self` and initialises its attributes; it returns `None`. You override `__new__` for immutable built-ins (a `str` subclass must set its value before `__init__` runs), for singletons that return an existing instance, and for caching or object pools. In practice 99 percent of classes only define `__init__`, and knowing why is the point of the question.

**Q: Does Python support constructor overloading?**
Not in the Java sense: a class has one `__init__`, and defining it twice keeps only the last. The Pythonic alternatives are default and keyword arguments (`def __init__(self, a, b=None)`), `*args`/`**kwargs` with type checks for genuinely different shapes, and, most cleanly, class methods as named alternative constructors such as `Policy.from_csv_row(row)` and `Policy.from_dict(d)`. Named constructors are considered better design than overloading because the name documents the input format.

**Q: How does `this` work in JavaScript compared to `self` in Python?**
In Python, `self` is an ordinary parameter bound when you access `obj.method`, producing a bound method object that permanently carries `obj`, so methods can be passed around freely. In JavaScript, `this` is not bound at definition time but determined by the call: `obj.method()` sets it to `obj`, a plain `fn()` sets it to `undefined` in strict mode, `new Fn()` sets it to the new object, and `call`/`apply`/`bind` set it explicitly. Arrow functions do not have their own `this` and inherit it lexically from the enclosing scope, which is why callbacks inside class methods are usually written as arrows. The common bug is passing `obj.method` as an event handler and losing `this`; the fix is `bind` or an arrow-function class field.

**Q: Should a constructor ever perform I/O such as opening a file or a database connection?**
Generally no. Constructors should be cheap, predictable and side-effect free so that objects can be created in tests, in loops and in list comprehensions without touching external systems. Take the dependency as a parameter instead (`Report(source=csv_reader)`) or accept a path and defer the read to an explicit `load()` method; this is dependency injection and it makes the class testable with fakes. Frameworks that must acquire resources at construction time document it clearly and pair it with a context manager so the resource is released deterministically.

# LEVEL: Intermediate

## Encapsulation & properties

**Encapsulation** is the first pillar: keep an object's data together with the methods that operate on it, and control how the outside world can read or change that data. The goal is that an object can never be put into an invalid state by code outside the class, because every change goes through a method that enforces the rules.

### Why direct access is dangerous

```python
class Account:
    def __init__(self):
        self.balance = 0

acct = Account()
acct.balance = -5000        # nothing stops this
```

With a public attribute, every piece of code in the program is responsible for keeping `balance` valid. Encapsulation moves that responsibility into the class.

### Convention-based privacy in Python

```python
class Account:
    def __init__(self):
        self._balance = 0            # one underscore: internal

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("deposit must be positive")
        self._balance += amount

    def withdraw(self, amount):
        if amount > self._balance:
            raise ValueError("insufficient funds")
        self._balance -= amount

    def balance(self):
        return self._balance
```

Python does not have `private` or `protected` keywords. A single leading underscore says "internal, use at your own risk"; tools such as `help()` and `from module import *` respect it, and reviewers will reject code that reaches into `_balance` from outside. A double underscore (`__balance`) triggers **name mangling**: Python renames it to `_Account__balance`, which prevents accidental clashes in subclasses but is not real security.

### Properties: attribute syntax with method control

Getter and setter methods like `balance()` and `set_balance()` are the Java style. Python's `@property` gives you the same control while keeping the natural `acct.balance` syntax:

```python
class Policy:
    def __init__(self, coverage):
        self.coverage = coverage      # goes through the setter below

    @property
    def coverage(self):
        return self._coverage

    @coverage.setter
    def coverage(self, value):
        if value <= 0:
            raise ValueError("coverage must be positive")
        self._coverage = float(value)

    @property
    def premium(self):                # read-only computed attribute
        return max(self._coverage / 1000 * 5.75, 100.0)

p = Policy(250_000)
p.coverage = 300_000          # validated
print(p.premium)              # 1725.0, no brackets
p.premium = 5                 # AttributeError: can't set attribute
```

The huge practical benefit: you can start with a plain attribute and later turn it into a property without changing a single caller. That is why Python code does not write getters and setters up front. A `@coverage.deleter` exists too, and `functools.cached_property` computes once and caches.

### Read-only and immutable objects

For values that must never change after construction, expose only a getter, use a `frozen=True` dataclass, or a `NamedTuple`. Immutable objects are safe to share, hash and use as dictionary keys, and they eliminate a whole class of bugs in multithreaded code.

### Encapsulation in JavaScript

```js
class Account {
  #balance = 0;                         // private field: real enforcement
  deposit(amount) {
    if (amount <= 0) throw new RangeError("deposit must be positive");
    this.#balance += amount;
  }
  get balance() { return this.#balance; }         // getter
  set balance(v) { throw new Error("read-only"); } // optional setter
}
const a = new Account();
a.deposit(100);
console.log(a.balance);   // 100
// a.#balance -> SyntaxError outside the class
```

`#fields` (ES2022) are enforced by the language, and `get`/`set` keywords define accessor properties, the direct equivalent of `@property`. Older code used closures or `Object.defineProperty` for the same effect.

### What to hide and what to show

| Show (public interface) | Hide (implementation) |
|---|---|
| operations callers need: `deposit`, `approve`, `export_pdf` | storage details: lists, dicts, cache |
| stable computed values: `premium`, `page_count` | helper methods: `_recalculate`, `_load_template` |
| validated attributes via properties | raw fields that must stay consistent |

The test is: can I rewrite the inside of the class without changing any code that uses it? If yes, the encapsulation is good.

> **Interview note:** When asked "how does Python do private members?", say: by convention (`_name`), with name mangling for `__name`, and with properties to control access, and note that this is a deliberate design ("we are all consenting adults") rather than a missing feature.

### Try It Yourself

```python
class Policy:
    MIN_PREMIUM = 100.0

    def __init__(self, policy_no, coverage):
        self._policy_no = policy_no          # read-only after construction
        self.coverage = coverage             # validated by the setter
        self.__audit = []                    # name-mangled

    @property
    def policy_no(self):
        return self._policy_no

    @property
    def coverage(self):
        return self._coverage

    @coverage.setter
    def coverage(self, value):
        if value <= 0:
            raise ValueError("coverage must be positive")
        self._coverage = float(value)
        self.__audit.append(("coverage", value))

    @property
    def premium(self):
        return max(self._coverage / 1000 * 5.75, self.MIN_PREMIUM)

    def history(self):
        return list(self.__audit)           # return a copy, not the internal list

p = Policy("TX-0042", 250_000)
p.coverage = 300_000
print(p.policy_no, p.coverage, p.premium)

for action in (lambda: setattr(p, "coverage", -1), lambda: setattr(p, "premium", 5), lambda: setattr(p, "policy_no", "X")):
    try:
        action()
    except (ValueError, AttributeError) as err:
        print(type(err).__name__ + ":", err)

print("history:", p.history())
print("mangled name:", [n for n in vars(p) if "audit" in n])
```

### Quiz

1. What does a double leading underscore (`__balance`) do in Python?
- [ ] Makes the attribute truly private
- [x] Name-mangles it to `_ClassName__balance`
- [ ] Makes it a class attribute
> Mangling prevents accidental clashes in subclasses; the attribute is still reachable under its mangled name.

2. What is the main advantage of `@property` over `get_x()`/`set_x()` methods?
- [x] Callers use plain attribute syntax, so you can add validation later without changing them
- [ ] It is faster
- [ ] It makes the attribute private
> Properties let a class evolve from a plain attribute to a validated one with zero caller changes.

3. Which JavaScript feature enforces private state at the language level?
- [ ] A leading underscore
- [x] `#private` class fields
- [ ] `var`
> `#fields` are inaccessible outside the class body; underscores are only a convention.

4. Why does `history()` return `list(self.__audit)` instead of `self.__audit`?
- [x] So callers cannot mutate the internal list
- [ ] Because lists cannot be returned directly
- [ ] To make it faster
> Returning the internal object would let outside code bypass the class's rules; a copy preserves encapsulation.

### Exercises

1. **Temperature with validation** — Write a `Sensor` class with a `celsius` property that rejects values below -273.15 and a read-only `kelvin` property.
<details><summary>Solution</summary>

```python
class Sensor:
    def __init__(self, celsius):
        self.celsius = celsius
    @property
    def celsius(self):
        return self._c
    @celsius.setter
    def celsius(self, v):
        if v < -273.15:
            raise ValueError("below absolute zero")
        self._c = v
    @property
    def kelvin(self):
        return self._c + 273.15
s = Sensor(25); print(s.kelvin)
```

</details>

2. **Defensive copies** — Write a `Team` class holding a private list of agent names, with `add(name)` and a `members` property that returns a tuple so callers cannot modify the list.
<details><summary>Solution</summary>

```python
class Team:
    def __init__(self):
        self._members = []
    def add(self, name):
        self._members.append(name)
    @property
    def members(self):
        return tuple(self._members)
t = Team(); t.add("Sara"); print(t.members)
```

</details>

### Interview Questions

**Q: What is encapsulation and how do you achieve it in Python?**
Encapsulation bundles data with the methods that maintain its invariants and restricts outside access so the object cannot be corrupted. Python achieves it by convention rather than enforcement: a single underscore marks internal members, double underscores add name mangling to avoid subclass clashes, and `@property` lets you expose attribute-style access while validating writes, computing values or making them read-only. The practical outcome is that the class's public interface stays stable while its internals can change, which is what makes refactoring safe.

**Q: Why does Python not have real private members like Java or C++?**
The language designers chose openness and simplicity: enforced privacy adds complexity, gets in the way of debugging, testing and monkey-patching, and can always be bypassed via reflection in other languages anyway. The `_name` convention communicates intent, and code review plus linters enforce it socially. This is often summarised as "we are all consenting adults here". JavaScript went the other way in 2022 with `#fields` because its runtime is shared with untrusted third-party code in browsers, where hard privacy has real value.

**Q: What are getters and setters and when are they a code smell?**
Getters and setters are methods that read and write a field, giving the class a chance to validate, log or compute. They become a smell when a class exposes a getter and a setter for every field with no logic in them, because that is a public attribute with extra typing and no encapsulation benefit. Python's answer is to use plain attributes until you need behaviour, then introduce a property; in Java the same insight leads to immutable value objects with only constructors and getters, and to "tell, don't ask" designs where you call `account.withdraw(50)` rather than `account.setBalance(account.getBalance() - 50)`.

## Inheritance

**Inheritance** lets a new class (the **subclass** or child) reuse and extend an existing class (the **superclass**, base or parent). The subclass automatically gets every attribute and method of the parent and can add new ones or replace existing ones. It models an *is-a* relationship: a `PdfDocument` *is a* `Document`.

### Basic inheritance

```python
class Document:
    def __init__(self, title, pages):
        self.title = title
        self.pages = pages
        self.status = "draft"

    def approve(self):
        self.status = "approved"

    def describe(self):
        return f"{self.title} ({self.pages} pages, {self.status})"

class PdfDocument(Document):
    def __init__(self, title, pages, encrypted=False):
        super().__init__(title, pages)      # run the parent's initialiser
        self.encrypted = encrypted

    def describe(self):                     # override
        base = super().describe()
        return base + (" [encrypted]" if self.encrypted else "")

    def lock(self):                         # extension
        self.encrypted = True

doc = PdfDocument("Rate Manual", 48)
doc.approve()             # inherited unchanged
doc.lock()                # new behaviour
print(doc.describe())     # Rate Manual (48 pages, approved) [encrypted]
```

Three things happen here: `approve` is **inherited**, `describe` is **overridden** (replaced, while still calling the original through `super()`), and `lock` is **added**. Forgetting `super().__init__()` is the classic bug: the parent's attributes are never set and later methods fail with `AttributeError`.

### super() and the method resolution order

`super()` returns a proxy that looks up the next class in the **MRO** (method resolution order), the linearised list of classes Python searches for attributes. `PdfDocument.__mro__` is `(PdfDocument, Document, object)`. Every class ultimately inherits from `object`, which provides defaults such as `__repr__`, `__eq__` and `__hash__`.

### Checking types

```python
isinstance(doc, Document)        # True: subclasses count
isinstance(doc, PdfDocument)     # True
type(doc) is Document            # False: exact type only
issubclass(PdfDocument, Document)   # True
```

Prefer `isinstance` over `type(x) is`, and prefer polymorphism (next chapter) over either.

### Multiple inheritance and mixins

Python allows a class to inherit from several parents. The common, safe use is **mixins**: small classes that add one capability and hold no state of their own.

```python
class JsonMixin:
    def to_json(self):
        import json
        return json.dumps(vars(self))

class Report(JsonMixin, Document):
    pass

print(Report("Weekly", 3).to_json())
print([c.__name__ for c in Report.__mro__])   # Report, JsonMixin, Document, object
```

With multiple parents the MRO uses the C3 linearisation algorithm: children before parents, left to right, each class once. Cooperative `super()` calls in every `__init__` make diamonds work, but deep multiple inheritance is hard to reason about and is avoided in most codebases.

### Inheritance in JavaScript

```js
class Document {
  constructor(title, pages) { this.title = title; this.pages = pages; this.status = "draft"; }
  describe() { return `${this.title} (${this.pages} pages, ${this.status})`; }
}
class PdfDocument extends Document {
  constructor(title, pages, encrypted = false) {
    super(title, pages);                 // must be called before using `this`
    this.encrypted = encrypted;
  }
  describe() { return super.describe() + (this.encrypted ? " [encrypted]" : ""); }
}
```

`extends` and `super` map directly. JavaScript has single inheritance only; mixins are done with functions that return classes or with `Object.assign` onto prototypes.

### When inheritance is wrong

Inheritance couples the child tightly to the parent's implementation. If `Document` changes how `status` works, every subclass may break. Use it only when the child truly *is a* parent and can be used anywhere the parent is expected (the Liskov principle in the Expert level). A `Report` that merely *has* a document should hold one as an attribute instead; that is composition, covered in the Advanced level.

> **Warning:** Inheriting from built-ins such as `list` or `dict` to add behaviour is tempting but leaky: many methods bypass your overrides (`dict.update` does not call your `__setitem__`). Use `collections.UserDict`/`UserList` or composition instead.

### Try It Yourself

```python
class Document:
    def __init__(self, title, pages):
        self.title, self.pages, self.status = title, pages, "draft"
    def approve(self):
        self.status = "approved"
    def describe(self):
        return f"{self.title} ({self.pages} pages, {self.status})"

class PdfDocument(Document):
    def __init__(self, title, pages, encrypted=False):
        super().__init__(title, pages)
        self.encrypted = encrypted
    def describe(self):
        return super().describe() + (" [encrypted]" if self.encrypted else "")
    def lock(self):
        self.encrypted = True

class DocxDocument(Document):
    def __init__(self, title, pages, template="letterhead.dotx"):
        super().__init__(title, pages)
        self.template = template
    def describe(self):
        return f"{super().describe()} from {self.template}"

class JsonMixin:
    def to_json(self):
        import json
        return json.dumps(vars(self))

class Report(JsonMixin, DocxDocument):
    pass

docs = [PdfDocument("Rate Manual", 48), DocxDocument("Onboarding SOP", 12), Report("Weekly status", 3)]
docs[0].lock(); docs[2].approve()
for d in docs:
    print(f"{type(d).__name__:<13}", d.describe())

print(docs[2].to_json())
print("MRO:", [c.__name__ for c in Report.__mro__])
print(isinstance(docs[2], Document), issubclass(Report, PdfDocument), type(docs[2]) is Document)
```

### Quiz

1. What does `super().__init__(title, pages)` do?
- [x] Runs the parent class's initialiser on the same instance
- [ ] Creates a second object of the parent class
- [ ] Copies the parent's attributes into a dictionary
> `super()` looks up the next class in the MRO and calls its method with the current `self`.

2. What is the MRO of `class C(A, B)` where both inherit from `object`?
- [x] C, A, B, object
- [ ] C, B, A, object
- [ ] C, object, A, B
> C3 linearisation puts the class first, then its bases left to right, then their bases, each once.

3. Which check returns `True` for subclasses as well as the exact class?
- [ ] `type(x) is Document`
- [x] `isinstance(x, Document)`
- [ ] `x.__class__ == Document`
> `isinstance` walks the MRO; `type(x) is` compares the exact class only.

4. What is a mixin?
- [ ] A class that cannot be instantiated
- [x] A small class adding one capability, meant to be combined via multiple inheritance
- [ ] A subclass of `dict`
> Mixins such as `JsonMixin` hold no state of their own and are listed before the main base class.

### Exercises

1. **Employee hierarchy** — Create `Employee(name, salary)` with `annual_cost()`, and `Contractor(Employee)` whose `annual_cost()` adds a 10 percent agency fee using `super()`.
<details><summary>Solution</summary>

```python
class Employee:
    def __init__(self, name, salary):
        self.name, self.salary = name, salary
    def annual_cost(self):
        return self.salary
class Contractor(Employee):
    def annual_cost(self):
        return super().annual_cost() * 1.10
print(Contractor("Omar", 50_000).annual_cost())   # 55000.0
```

</details>

2. **Diamond MRO** — Define `A`, `B(A)`, `C(A)`, `D(B, C)` each with a `who()` method that prints its name and calls `super().who()` where possible; print the MRO and call `D().who()`.
<details><summary>Solution</summary>

```python
class A:
    def who(self): print("A")
class B(A):
    def who(self): print("B"); super().who()
class C(A):
    def who(self): print("C"); super().who()
class D(B, C):
    def who(self): print("D"); super().who()
print([k.__name__ for k in D.__mro__])   # D, B, C, A, object
D().who()
```

</details>

### Interview Questions

**Q: What is inheritance and what problems can it cause?**
Inheritance lets a subclass reuse and specialise a base class, modelling an is-a relationship and enabling polymorphism through a shared interface. The problems are tight coupling (a subclass depends on the parent's implementation details, so changes ripple down), the fragile base class problem (an innocent change in the parent breaks children), deep hierarchies that are hard to follow, and the temptation to inherit for code reuse when the relationship is really has-a. Modern guidance is to keep hierarchies shallow, prefer composition for reuse, and use inheritance mainly for interface sharing and true specialisation.

**Q: How does Python resolve a method when a class has multiple parents?**
Python computes a method resolution order using the C3 linearisation: the class itself, then its parents in the order listed, merged so that every class appears once, before its own parents, and the relative order of parents is preserved. `super()` follows this list rather than always calling "the parent", which is why cooperative multiple inheritance works when every class in the chain calls `super()`. If the constraints cannot be satisfied, such as `class X(A, B)` where `B` is a subclass of `A`, Python raises `TypeError: Cannot create a consistent method resolution order`. You can inspect it with `Cls.__mro__` or `Cls.mro()`.

**Q: What does `super()` do, and why is calling it in `__init__` important?**
`super()` returns a proxy object that delegates attribute lookups to the next class in the instance's MRO after the current one, so `super().__init__(...)` runs the parent's initialiser on the same `self`. Skipping it means the parent's attributes are never created and inherited methods fail with `AttributeError`, often far from the real cause. In Python 3 the zero-argument form works inside methods; the explicit `super(Child, self)` form is only needed in unusual situations. In JavaScript the rule is even stricter: a subclass constructor must call `super()` before touching `this` or the engine throws a `ReferenceError`.

## Polymorphism & method overriding

**Polymorphism** ("many forms") means that different classes can respond to the same method call in their own way, and the calling code does not need to know which class it is dealing with. It is what makes a loop like `for doc in documents: doc.export()` work when the list contains PDFs, DOCX files and EPUBs.

### Overriding

The most direct form: a subclass replaces a method inherited from its parent.

```python
class Document:
    def export(self):
        return f"{self.title}: generic export"

class PdfDocument(Document):
    def export(self):
        return f"{self.title}: rendering with PyMuPDF"

class EpubDocument(Document):
    def export(self):
        return f"{self.title}: packaging EPUB3 container"

for doc in [PdfDocument("Rates"), EpubDocument("Handbook"), Document("Memo")]:
    print(doc.export())
```

Python decides at run time which `export` to call by looking at the object's class, a process called **dynamic dispatch**. The loop body is written once and works for every current and future subclass. The signature of the override should match the parent's so callers can substitute freely.

### Duck typing

Python goes further than class-based languages: an object does not need to inherit from anything to be used polymorphically. If it has the method, it works. "If it walks like a duck and quacks like a duck, it is a duck."

```python
class Spreadsheet:                      # no relation to Document
    def export(self):
        return "writing XLSX with openpyxl"

def export_all(items):
    for item in items:
        print(item.export())

export_all([PdfDocument("Rates"), Spreadsheet()])
```

This is why Python code says "file-like object" rather than "subclass of File": anything with `.read()` works. JavaScript behaves the same way, since it has no static types and method calls are just property lookups.

### Overloading versus overriding

**Overloading** means several methods with the same name but different parameter lists in one class, chosen at compile time by argument types (Java, C++). Python and JavaScript do not support it; a second `def` with the same name replaces the first. The idioms instead are default arguments, `*args`, `isinstance` checks, or `functools.singledispatch`, which dispatches on the type of the first argument:

```python
from functools import singledispatch

@singledispatch
def render(value):
    return str(value)

@render.register
def _(value: float):
    return f"{value:,.2f}"

@render.register
def _(value: list):
    return ", ".join(render(v) for v in value)

print(render(1437.5), render([1, 2.5]))
```

### Operator polymorphism

`+` adds numbers, joins strings and concatenates lists: the same operator, different behaviour, chosen by the type of the operands. Your own classes join in by defining `__add__`, `__eq__` and friends, covered in the Advanced level.

### Calling the parent from an override

An override often wants to extend rather than replace. `super().method()` runs the parent's version so you can add before or after it:

```python
class AuditedDocument(Document):
    def approve(self):
        print(f"audit: approving {self.title}")
        super().approve()
```

### Polymorphism in JavaScript

```js
class Document { export() { return `${this.title}: generic`; } }
class PdfDocument extends Document { export() { return `${this.title}: PDF`; } }
const items = [new PdfDocument("Rates"), new Document("Memo"), { title: "x", export() { return "duck"; } }];
items.forEach(i => console.log(i.export()));
```

The plain object literal at the end is duck typing in action.

### Designing for polymorphism

| Do | Avoid |
|---|---|
| define the shared method names in a base class or Protocol | `if isinstance(doc, PdfDocument): ... elif ...` chains |
| keep override signatures compatible | overrides that need extra required arguments |
| call `super()` when extending, not replacing | silently swallowing the parent's behaviour |
| use `NotImplementedError` for "subclass must override" | returning `None` from a base method that should be overridden |

An `isinstance` chain that grows every time you add a type is the signal that a method belongs on the classes instead: replace the chain with one method name and let each class implement it.

> **Interview note:** Be ready with the difference between compile-time polymorphism (overloading, resolved by the compiler from argument types) and run-time polymorphism (overriding, resolved from the object's actual class). Python only has the run-time kind, plus duck typing.

### Try It Yourself

```python
from functools import singledispatch

class Document:
    def __init__(self, title):
        self.title = title
    def export(self):
        raise NotImplementedError(f"{type(self).__name__} must implement export()")
    def approve(self):
        return f"{self.title} approved"

class PdfDocument(Document):
    def export(self):
        return f"{self.title}: rendering pages with PyMuPDF"

class EpubDocument(Document):
    def export(self):
        return f"{self.title}: packaging EPUB3 container"

class AuditedPdf(PdfDocument):
    def approve(self):
        return "AUDIT | " + super().approve()

class Spreadsheet:                    # duck-typed: not a Document at all
    def __init__(self, name): self.title = name
    def export(self):
        return f"{self.title}: writing XLSX with openpyxl"

for item in [PdfDocument("Rate Manual"), EpubDocument("Handbook"), Spreadsheet("Rate matrix"), AuditedPdf("Policy")]:
    print(f"{type(item).__name__:<13}", item.export())

print(AuditedPdf("Policy").approve())
try:
    Document("Memo").export()
except NotImplementedError as err:
    print("error:", err)

@singledispatch
def render(value): return str(value)
@render.register
def _(value: float): return f"{value:,.2f}"
@render.register
def _(value: list): return "[" + ", ".join(render(v) for v in value) + "]"
print(render(1437.5), render("TX"), render([1, 2.5, "x"]))
```

### Quiz

1. What is method overriding?
- [x] A subclass providing its own version of a method defined in its parent
- [ ] Two methods with the same name but different parameters in one class
- [ ] Renaming a method
> Overriding replaces the inherited behaviour; the object's actual class decides which version runs.

2. Does Python support method overloading by parameter types?
- [ ] Yes, like Java
- [x] No; a later `def` with the same name replaces the earlier one
- [ ] Only for `__init__`
> Use defaults, `*args` or `functools.singledispatch` instead.

3. What is duck typing?
- [ ] Checking `isinstance` before every call
- [x] Using an object based on the methods it has rather than its class
- [ ] A form of inheritance
> If an object has `export()`, it can be exported, regardless of its class.

4. What should a base-class method that subclasses must override do?
- [ ] Return `None`
- [x] Raise `NotImplementedError`
- [ ] Print a warning
> Raising makes a missing override an immediate, obvious failure rather than a silent bug.

### Exercises

1. **Shape areas** — Write `Shape` with `area()` raising `NotImplementedError`, `Rectangle(w, h)` and `Circle(r)` overriding it, and compute the total area of a mixed list.
<details><summary>Solution</summary>

```python
import math
class Shape:
    def area(self): raise NotImplementedError
class Rectangle(Shape):
    def __init__(self, w, h): self.w, self.h = w, h
    def area(self): return self.w * self.h
class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return math.pi * self.r ** 2
print(round(sum(s.area() for s in [Rectangle(2, 3), Circle(1)]), 2))
```

</details>

2. **Replace an isinstance chain** — Refactor `def describe(x): if isinstance(x, Pdf): ... elif isinstance(x, Docx): ...` into polymorphic `describe()` methods.
<details><summary>Solution</summary>

```python
class Pdf:
    def describe(self): return "PDF document"
class Docx:
    def describe(self): return "Word document"
def describe(x):
    return x.describe()
print(describe(Pdf()), describe(Docx()))
```

</details>

### Interview Questions

**Q: What is polymorphism? Give an example from real code.**
Polymorphism is the ability of different types to respond to the same operation with type-specific behaviour, so calling code depends on an interface rather than a concrete class. A document pipeline might hold `PdfDocument`, `DocxDocument` and `EpubDocument` objects in one list and call `doc.export(path)` on each; every class implements `export` differently, and adding a new format means adding a class, not editing the loop. In Python this works through overriding and duck typing, and the same idea appears in `len()` working on strings, lists and your own classes with `__len__`.

**Q: What is the difference between overloading and overriding?**
Overloading defines multiple methods with the same name and different parameter lists in one class, resolved at compile time from the argument types; Java and C++ support it, Python and JavaScript do not, so a second definition simply replaces the first. Overriding is a subclass replacing an inherited method with the same signature, resolved at run time from the object's class; both languages support it. Python's substitutes for overloading are default arguments, `*args`/`**kwargs`, and `functools.singledispatch` for type-based dispatch on the first argument.

**Q: What is duck typing and what are its trade-offs?**
Duck typing means an object's suitability is determined by the methods and attributes it has, not by its declared type, so any object with `read()` can be passed where a file is expected. It gives flexibility and loose coupling, makes testing easy with simple fakes, and avoids deep hierarchies. The costs are that errors appear at run time as `AttributeError` deep inside a call rather than at the boundary, and that the required interface is implicit. Modern Python mitigates this with `typing.Protocol`, which lets a static checker verify that an object has the right methods without requiring inheritance, giving structural typing with tool support.

## Abstraction, abstract classes & interfaces

**Abstraction** is the pillar about hiding complexity behind a simple, well-named interface. The user of a `Document` calls `export()` without caring whether PyMuPDF, python-docx or an EPUB packager runs underneath. Abstract classes and interfaces are the tools that make such contracts explicit.

### Abstract base classes

An **abstract class** defines methods that subclasses must implement, and cannot itself be instantiated. Python provides this through the `abc` module:

```python
from abc import ABC, abstractmethod

class Exporter(ABC):
    @abstractmethod
    def export(self, doc, path):
        """Write doc to path and return the number of bytes written."""

    @abstractmethod
    def extension(self) -> str: ...

    def output_name(self, doc):                 # concrete helper, inherited by all
        return f"{doc.title}.{self.extension()}"

class PdfExporter(Exporter):
    def export(self, doc, path):
        return 1024
    def extension(self):
        return "pdf"

Exporter()          # TypeError: Can't instantiate abstract class
PdfExporter()       # fine, all abstract methods implemented
```

Attempting to instantiate a class with unimplemented abstract methods fails immediately with a clear error, rather than later with `NotImplementedError` at the first call. Abstract classes can still contain concrete methods, class attributes and `__init__`, which is what distinguishes them from pure interfaces. `@abstractmethod` can also be combined with `@property`, `@classmethod` and `@staticmethod`.

### Interfaces

An **interface** is a contract of method names and signatures with no implementation at all. Java and C# have an `interface` keyword; Python has two equivalents:

1. An ABC with only abstract methods.
2. A `typing.Protocol`, which describes the required methods **structurally**: any class that has them satisfies the protocol, without inheriting from it.

```python
from typing import Protocol, runtime_checkable

@runtime_checkable
class Exportable(Protocol):
    def export(self, path: str) -> int: ...

class Spreadsheet:
    def export(self, path: str) -> int:
        return 512

def save(item: Exportable, path):
    return item.export(path)

print(isinstance(Spreadsheet(), Exportable))     # True, no inheritance needed
```

Protocols formalise duck typing so that mypy can check calls, and `@runtime_checkable` allows `isinstance` checks against the method names. They are the modern way to say "anything with these methods" in type hints.

### Built-in ABCs

`collections.abc` defines the protocols the language itself uses: `Iterable`, `Iterator`, `Sized`, `Container`, `Sequence`, `Mapping`, `Hashable`, `Callable`. Inheriting from `Sequence` and implementing `__getitem__` and `__len__` gives you `__contains__`, `__iter__`, `index` and `count` for free, a pattern called **template method**: the base class supplies an algorithm built on a few abstract steps.

### Template method in practice

```python
class ReportBuilder(ABC):
    def build(self, rows):                  # the fixed algorithm
        self.start()
        for row in rows:
            self.add_row(row)
        return self.finish()

    @abstractmethod
    def start(self): ...
    @abstractmethod
    def add_row(self, row): ...
    @abstractmethod
    def finish(self): ...

class TextReport(ReportBuilder):
    def start(self): self.lines = []
    def add_row(self, row): self.lines.append(" | ".join(map(str, row)))
    def finish(self): return "\n".join(self.lines)
```

Subclasses fill in the steps; the ordering lives in one place.

### Abstraction in JavaScript

JavaScript has neither abstract classes nor interfaces in the language. The conventions are to throw from a base method, to check `new.target`, or to use TypeScript:

```js
class Exporter {
  constructor() { if (new.target === Exporter) throw new TypeError("abstract"); }
  export(doc, path) { throw new Error("export() must be implemented"); }
}
// TypeScript
interface Exportable { export(path: string): number; }
abstract class Exporter { abstract export(doc: Doc, path: string): number; }
```

TypeScript interfaces are structural like Python protocols, and are erased at compile time.

### Choosing the tool

| Need | Use |
|---|---|
| shared implementation plus mandatory overrides | ABC with abstract and concrete methods |
| pure contract, subclasses opt in explicitly | ABC with only abstract methods |
| accept any object with the right methods, static checking | `Protocol` |
| runtime `isinstance` on structure | `@runtime_checkable` Protocol |

> **Tip:** Keep interfaces small. An `Exporter` with two methods is easy to implement in a test double; an interface with fifteen methods forces every implementation and every fake to carry dead code. This is the Interface Segregation principle from the SOLID chapter.

### Try It Yourself

```python
from abc import ABC, abstractmethod
from typing import Protocol, runtime_checkable

class Exporter(ABC):
    @abstractmethod
    def render(self, doc) -> bytes: ...
    @property
    @abstractmethod
    def extension(self) -> str: ...
    def export(self, doc):                   # template method
        data = self.render(doc)
        name = f"{doc['title']}.{self.extension}"
        return name, len(data)

class PdfExporter(Exporter):
    extension = "pdf"
    def render(self, doc):
        return b"%PDF-1.7 " + doc["title"].encode() * doc["pages"]

class EpubExporter(Exporter):
    @property
    def extension(self): return "epub"
    def render(self, doc):
        return b"PK mimetype application/epub+zip " + doc["title"].encode()

class BrokenExporter(Exporter):
    def render(self, doc): return b""        # forgot `extension`

doc = {"title": "Handbook", "pages": 3}
for exp in (PdfExporter(), EpubExporter()):
    print(exp.export(doc))
try:
    BrokenExporter()
except TypeError as err:
    print("abstract check:", err)

@runtime_checkable
class Exportable(Protocol):
    def export(self, doc): ...

class Spreadsheet:                            # satisfies the protocol structurally
    def export(self, doc): return (doc["title"] + ".xlsx", 512)

print([isinstance(x, Exportable) for x in (PdfExporter(), Spreadsheet(), "text")])
print(Spreadsheet().export(doc))
```

### Quiz

1. What happens when you instantiate a class with an unimplemented `@abstractmethod`?
- [x] `TypeError` at instantiation
- [ ] `NotImplementedError` when the method is called
- [ ] Nothing until the method is used
> ABCs check at creation time, which surfaces the mistake immediately.

2. How does a class satisfy a `typing.Protocol`?
- [ ] By inheriting from it
- [x] By having the required methods with compatible signatures
- [ ] By registering with `abc.register`
> Protocols are structural; inheritance is optional and usually omitted.

3. Which is the main difference between an abstract class and an interface?
- [x] An abstract class can contain implemented methods and state; an interface is only a contract
- [ ] Interfaces are faster
- [ ] Abstract classes cannot have `__init__`
> Abstract classes share code; interfaces share only method names and signatures.

4. What is the template method pattern?
- [ ] A way to generate HTML
- [x] A base-class method that defines an algorithm's steps and calls abstract hooks subclasses fill in
- [ ] A metaclass
> `build()` calling `start()`, `add_row()` and `finish()` is the pattern in action.

### Exercises

1. **Payment interface** — Define an abstract `PaymentMethod` with `charge(amount)` and a concrete `receipt(amount)` that calls it; implement `Card` and `BankTransfer`.
<details><summary>Solution</summary>

```python
from abc import ABC, abstractmethod
class PaymentMethod(ABC):
    @abstractmethod
    def charge(self, amount): ...
    def receipt(self, amount):
        return f"{type(self).__name__}: {self.charge(amount)}"
class Card(PaymentMethod):
    def charge(self, amount): return f"charged ${amount:.2f} to card"
class BankTransfer(PaymentMethod):
    def charge(self, amount): return f"transfer of ${amount:.2f} initiated"
print(Card().receipt(45), BankTransfer().receipt(45))
```

</details>

2. **Protocol check** — Write a `Readable` protocol requiring `read() -> str`, and a function `first_line(source: Readable)` that works with both `io.StringIO` and a custom class.
<details><summary>Solution</summary>

```python
import io
from typing import Protocol
class Readable(Protocol):
    def read(self) -> str: ...
class Fixed:
    def read(self): return "line one\nline two"
def first_line(source: Readable) -> str:
    return source.read().splitlines()[0]
print(first_line(io.StringIO("a\nb")), first_line(Fixed()))
```

</details>

### Interview Questions

**Q: What is the difference between an abstract class and an interface, and how does Python express each?**
An abstract class is a partially implemented class that cannot be instantiated: it provides shared code and state plus abstract methods subclasses must implement, modelling an is-a relationship. An interface is a pure contract of method signatures with no implementation, which a class can promise to fulfil regardless of its ancestry. Python expresses abstract classes with `abc.ABC` and `@abstractmethod`, and interfaces either as ABCs with only abstract methods or, more idiomatically now, as `typing.Protocol` classes that are satisfied structurally. Java requires the `interface` keyword and single inheritance of classes, which is why interfaces matter more there; Python's multiple inheritance and duck typing make the distinction softer.

**Q: When would you use an ABC rather than duck typing?**
Use an ABC when you want the missing-method error at instantiation rather than at first use, when the base class supplies real shared behaviour such as a template method, when you want `isinstance` checks to express a clear category, or when the hierarchy is part of a public library where explicit contracts help users. Stick with duck typing, optionally documented with a `Protocol`, when accepting third-party objects you do not control, in small scripts, and in tests where lightweight fakes are convenient. Many codebases combine them: a `Protocol` for what functions accept and an ABC for the family of classes they ship.

**Q: What is abstraction and how is it different from encapsulation?**
Abstraction is about the outside view: presenting a simplified model that exposes only the operations a user needs (`export()`) and hides how they are done. Encapsulation is about the inside: bundling data with the methods that maintain it and restricting direct access so invariants hold. They reinforce each other, since a well-abstracted interface is only stable if the internals are encapsulated, but they answer different questions: abstraction asks "what can I do with this?", encapsulation asks "who is allowed to change this and how?". An `Exporter` ABC is abstraction; the `_buffer` attribute inside `PdfExporter` protected by methods is encapsulation.


# LEVEL: Advanced

## Composition vs inheritance

Inheritance answers "what *is* this object?"; composition answers "what does this object *have* and *use*?". Both reuse code, but they fail in different ways, and "favour composition over inheritance" is one of the most quoted design rules in software engineering. This chapter shows why, when the rule applies, and when inheritance is still the right call.

### The problem with deep hierarchies

Suppose a document pipeline starts with `Document` and grows:

```python
class Document: ...
class PdfDocument(Document): ...
class SignedPdfDocument(PdfDocument): ...
class EncryptedSignedPdfDocument(SignedPdfDocument): ...
```

Now a client wants an encrypted but unsigned PDF, and then a signed EPUB. Every combination of features needs a new class, the tree explodes, and a change in `Document.__init__` ripples through everything below it. This is the **fragile base class** problem: subclasses depend on implementation details of their parents, so parents cannot change safely.

### Composition: has-a instead of is-a

Model the features as separate objects and plug them in:

```python
class Encryptor:
    def __init__(self, password): self.password = password
    def apply(self, data): return b"ENC(" + data + b")"

class Signer:
    def __init__(self, cert): self.cert = cert
    def apply(self, data): return data + b" [signed:" + self.cert.encode() + b"]"

class Document:
    def __init__(self, title, processors=()):
        self.title = title
        self.processors = list(processors)       # has-a list of behaviours
    def render(self):
        data = self.title.encode()
        for p in self.processors:
            data = p.apply(data)
        return data

doc = Document("Handbook", [Signer("ali-cert"), Encryptor("s3cret")])
print(doc.render())     # b'ENC(Handbook [signed:ali-cert])'
```

Any combination is a list, order is explicit, and each processor is testable alone. The `Document` never needs to know how signing works.

### Delegation

Composition usually comes with **delegation**: the outer object forwards calls to the inner one. In Python this can be explicit methods or `__getattr__`:

```python
class LoggedList:
    def __init__(self): self._items = []; self.log = []
    def append(self, x):
        self.log.append(f"append {x!r}")
        self._items.append(x)
    def __getattr__(self, name):            # forward everything else to the list
        return getattr(self._items, name)
```

Contrast with `class LoggedList(list)`: subclassing `list` looks shorter, but `extend`, `+=` and `__init__` bypass your `append`, so logging silently misses items. The standard library's `collections.UserList` exists precisely because subclassing built-ins is unreliable.

### Strategy: swapping behaviour at runtime

Composition allows behaviour to change after construction:

```python
class Report:
    def __init__(self, exporter): self.exporter = exporter
    def save(self, rows): return self.exporter.export(rows)

report = Report(CsvExporter())
report.exporter = ExcelExporter()      # same object, new behaviour
```

An inherited behaviour is fixed at class-definition time; a composed one is a field you can assign. This is the Strategy pattern, covered in the Expert level.

### Mixins: inheritance used like composition

A **mixin** is a small class with one capability, designed to be combined through multiple inheritance:

```python
class JsonMixin:
    def to_json(self):
        import json
        return json.dumps(self.__dict__)

class ReprMixin:
    def __repr__(self):
        return f"{type(self).__name__}({self.__dict__})"

class Invoice(JsonMixin, ReprMixin):
    def __init__(self, number, total): self.number, self.total = number, total
```

Mixins are fine when they hold no state and make no assumptions beyond a documented attribute. Django's class-based views and Python's `socketserver` are built this way. They become a problem when they call each other's methods and the MRO decides who wins.

### When inheritance is right

- The relationship is genuinely **is-a** and the Liskov Substitution Principle holds: any `PdfExporter` can be used wherever an `Exporter` is expected.
- A framework requires it: `unittest.TestCase`, `Exception` subclasses, Django models, `abc.ABC` contracts.
- The base class is designed for extension: abstract methods, template methods, documented hooks.
- The hierarchy is shallow (two or three levels) and stable.

| Question | Inheritance | Composition |
|---|---|---|
| Relationship | is-a | has-a / uses-a |
| Reuse | inherits all public methods, wanted or not | exposes only what you delegate |
| Change behaviour | at class definition | at runtime |
| Coupling | tight to base implementation | to an interface |
| Combining features | one class per combination | list or fields of parts |
| Testing | subclass needs base | parts tested alone with fakes |

> **Interview note:** Quote the rule, then immediately qualify it. "Favour composition" does not mean "never inherit"; it means do not inherit *just to reuse code*. Inherit for substitutability and framework contracts, compose for capabilities.

### Try It Yourself

```python
# The same feature set two ways: inheritance explodes, composition composes.

# 1. Inheritance: one class per combination
class Doc:
    def __init__(self, title): self.title = title
    def render(self): return self.title

class SignedDoc(Doc):
    def render(self): return super().render() + " [signed]"

class EncryptedDoc(Doc):
    def render(self): return "ENC(" + super().render() + ")"

class SignedEncryptedDoc(SignedDoc, EncryptedDoc):   # MRO: Signed -> Encrypted -> Doc
    pass

print(SignedEncryptedDoc("Handbook").render())
print([c.__name__ for c in SignedEncryptedDoc.__mro__])

# 2. Composition: behaviours are objects, order is explicit
class Signer:
    def apply(self, s): return s + " [signed]"

class Encryptor:
    def apply(self, s): return "ENC(" + s + ")"

class Watermark:
    def __init__(self, text): self.text = text
    def apply(self, s): return f"{s} {{{self.text}}}"

class Document:
    def __init__(self, title, steps=()):
        self.title, self.steps = title, list(steps)
    def render(self):
        out = self.title
        for step in self.steps:
            out = step.apply(out)
        return out

print(Document("Handbook", [Signer(), Encryptor()]).render())
print(Document("Handbook", [Encryptor(), Signer()]).render())         # order changed, no new class
d = Document("Handbook", [Watermark("DRAFT")])
d.steps.append(Signer())                                               # behaviour changed at runtime
print(d.render())

# 3. Delegation beats subclassing built-ins
class BadLog(list):
    def append(self, x):
        print("logged", x); super().append(x)

b = BadLog(); b.extend([1, 2])            # nothing logged: extend bypasses append
print("BadLog contents:", b)

class GoodLog:
    def __init__(self): self._items = []
    def append(self, x):
        print("logged", x); self._items.append(x)
    def extend(self, xs):
        for x in xs: self.append(x)
    def __len__(self): return len(self._items)
    def __getattr__(self, name): return getattr(self._items, name)

g = GoodLog(); g.extend([1, 2]); print("GoodLog length:", len(g), "index of 2:", g.index(2))
```

### Quiz

1. "Favour composition over inheritance" mainly warns against…
- [ ] using classes at all
- [x] inheriting only to reuse code when there is no true is-a relationship
- [ ] using more than one object
> Inheritance for substitutability is fine; inheritance for convenience couples you to the base implementation.

2. Which is a sign that composition would be better?
- [x] You need many combinations of optional features
- [ ] The framework requires a base class
- [ ] There are exactly two classes
> Combinations multiply subclasses; composed parts combine freely.

3. Why is subclassing `list` to log appends unreliable?
- [ ] `list` cannot be subclassed
- [x] Methods like `extend` and `+=` do not call your overridden `append`
- [ ] Subclasses of built-ins cannot have new methods
> CPython's built-in methods call the C implementation directly.

4. A mixin should ideally…
- [ ] hold most of the object's state
- [x] add one capability and have no state or few documented requirements
- [ ] override `__init__`
> Stateless single-purpose mixins combine predictably.

### Exercises

1. **Notifier** — Build a `Report` class that can notify by email, SMS, or both, using composition rather than `EmailReport`/`SmsReport` subclasses.
<details><summary>Solution</summary>

```python
class Email:
    def send(self, msg): return f"email: {msg}"
class Sms:
    def send(self, msg): return f"sms: {msg}"
class Report:
    def __init__(self, channels): self.channels = list(channels)
    def publish(self, msg): return [c.send(msg) for c in self.channels]
print(Report([Email(), Sms()]).publish("Weekly report ready"))
```

</details>

2. **Delegating wrapper** — Write `ReadOnlyDict` that wraps a dict, forwards reads, and raises `TypeError` on `__setitem__` and `__delitem__`.
<details><summary>Solution</summary>

```python
class ReadOnlyDict:
    def __init__(self, data): self._d = dict(data)
    def __getitem__(self, k): return self._d[k]
    def __len__(self): return len(self._d)
    def __iter__(self): return iter(self._d)
    def __contains__(self, k): return k in self._d
    def __setitem__(self, k, v): raise TypeError("read-only")
    def __delitem__(self, k): raise TypeError("read-only")
    def __getattr__(self, name): return getattr(self._d, name)
r = ReadOnlyDict({"state": "WY"}); print(r["state"], "state" in r, r.get("x", 0))
```

</details>

3. **Refactor a hierarchy** — Given `Vehicle -> Car -> ElectricCar` where `ElectricCar` only adds a battery, decide whether to keep inheritance and justify in a comment.
<details><summary>Solution</summary>

```python
# Keep inheritance: an ElectricCar is-a Car (LSP holds: it drives, parks, has wheels).
# Compose the power source instead of a third level for hybrids:
class Battery:
    def __init__(self, kwh): self.kwh = kwh
class Car:
    def __init__(self, make, power): self.make, self.power = make, power
car = Car("Tesla", Battery(75))
```

</details>

### Interview Questions

**Q: Explain "favour composition over inheritance" with an example where it matters.**
Inheritance couples a subclass to its parent's implementation and fixes behaviour at class-definition time, so using it merely to reuse code creates fragile, combinatorial hierarchies. Composition builds an object from parts it holds and delegates to, so features combine freely and can change at runtime. A document pipeline needing signing, encryption and watermarking in any order would require seven subclasses with inheritance; with composition it is one `Document` with a list of processor objects, each unit-tested alone with fakes. Inheritance remains correct for true is-a relationships where substitutability holds and for framework contracts like `Exception` or `TestCase`. The mature answer is: inherit for polymorphic substitution, compose for capabilities.

**Q: What is the fragile base class problem?**
It is the situation where a seemingly safe change to a base class breaks subclasses because they depended on details of how the base was implemented, not just on its interface. A classic example is a base `Collection.add_all()` that calls `self.add()` for each item; a subclass overriding `add()` to count items double-counts if the base later changes `add_all()` to insert directly, or vice versa. Python's built-ins show it concretely: `list.extend` does not call an overridden `append`. Mitigations are documenting which methods are hooks, using template methods with explicit abstract steps, marking classes `final` in typed code, and preferring composition so the outer object depends only on the inner one's public interface.

**Q: What is a mixin and how does it differ from a base class or an interface?**
A mixin is a class that provides one reusable capability, such as `to_json()` or `__repr__`, meant to be combined with other classes through multiple inheritance rather than instantiated or used as a primary parent. Unlike a base class it does not define what the object is, and unlike an interface it carries an implementation. Good mixins are stateless or document the attributes they expect, avoid `__init__`, and do not call each other, so their position in the MRO does not matter. Django's `LoginRequiredMixin` and Python's `socketserver.ThreadingMixIn` are the canonical examples; the alternative when a mixin starts needing state is to turn it into a composed helper object.

## Dunder methods & operator overloading

Python's syntax is a thin layer over **dunder methods** (double-underscore, also called magic or special methods). `a + b` calls `a.__add__(b)`, `len(x)` calls `x.__len__()`, `for item in x` calls `x.__iter__()`. Implementing them makes your classes feel like built-in types: printable, comparable, iterable, usable with `in`, `with` and `[]`. This is how `pathlib.Path` supports `/`, and how `Decimal` supports arithmetic.

### Representation

```python
class Money:
    def __init__(self, amount, currency="USD"):
        self.amount, self.currency = round(amount, 2), currency
    def __repr__(self):                      # unambiguous, for developers
        return f"Money({self.amount!r}, {self.currency!r})"
    def __str__(self):                       # readable, for users
        return f"{self.amount:,.2f} {self.currency}"
    def __format__(self, spec):              # f"{m:>12}" support
        return format(str(self), spec)

m = Money(1118, "USD")
print(repr(m), str(m), f"[{m:>14}]")
```

`repr` should ideally be valid code that recreates the object; `str` falls back to `repr` if undefined. Containers always use `repr` for their items, which is why a list of `Money` shows the constructor form.

### Comparison and hashing

```python
from functools import total_ordering

@total_ordering
class Money:
    ...
    def __eq__(self, other):
        if not isinstance(other, Money): return NotImplemented
        return (self.amount, self.currency) == (other.amount, other.currency)
    def __lt__(self, other):
        if not isinstance(other, Money) or other.currency != self.currency: return NotImplemented
        return self.amount < other.amount
    def __hash__(self):
        return hash((self.amount, self.currency))
```

Return `NotImplemented` (not `False`) for unsupported types so Python can try the reflected operation on the other operand. Defining `__eq__` sets `__hash__` to `None` automatically, making instances unhashable, so define `__hash__` on the same fields whenever objects are immutable and you want them in sets or as dict keys. `@total_ordering` fills in `__le__`, `__gt__`, `__ge__` from `__eq__` and one ordering method.

### Arithmetic operators

| Expression | Method | Reflected | In-place |
|---|---|---|---|
| `a + b` | `__add__` | `__radd__` | `__iadd__` |
| `a - b` | `__sub__` | `__rsub__` | `__isub__` |
| `a * b` | `__mul__` | `__rmul__` | `__imul__` |
| `a / b` | `__truediv__` | `__rtruediv__` | `__itruediv__` |
| `a // b` | `__floordiv__` | | |
| `a % b` | `__mod__` | | |
| `a @ b` | `__matmul__` | | |
| `-a`, `abs(a)` | `__neg__`, `__abs__` | | |

```python
def __add__(self, other):
    if not isinstance(other, Money) or other.currency != self.currency: return NotImplemented
    return Money(self.amount + other.amount, self.currency)
def __mul__(self, factor):
    if not isinstance(factor, (int, float)): return NotImplemented
    return Money(self.amount * factor, self.currency)
__rmul__ = __mul__                      # so 3 * money works too
```

When `3 * m` runs, `int.__mul__` returns `NotImplemented`, so Python tries `m.__rmul__(3)`. `sum(list_of_money)` starts with `0 + Money`, which needs `__radd__` to accept `0`; a common idiom is `def __radd__(self, other): return self if other == 0 else self.__add__(other)`.

### Container protocol

```python
class RateMatrix:
    def __init__(self, rows): self._rows = list(rows)          # [(coverage, rate), ...]
    def __len__(self): return len(self._rows)
    def __getitem__(self, i): return self._rows[i]             # enables indexing, slicing and iteration
    def __contains__(self, coverage): return any(c == coverage for c, _ in self._rows)
    def __iter__(self): return iter(self._rows)
    def __reversed__(self): return reversed(self._rows)
```

`__getitem__` alone makes an object iterable (Python tries indices 0, 1, 2… until `IndexError`), but define `__iter__` for clarity and speed. `__bool__` decides truthiness; without it, `__len__` is used, so an empty matrix is falsy.

### Callables, context managers and attribute access

```python
class Formatter:
    def __init__(self, spec): self.spec = spec
    def __call__(self, value): return format(value, self.spec)   # instance behaves like a function

class Timer:
    def __enter__(self):
        import time; self.start = time.perf_counter(); return self
    def __exit__(self, exc_type, exc, tb):
        import time; self.elapsed = time.perf_counter() - self.start
        return False                                              # do not swallow exceptions

with Timer() as t:
    sum(range(10**5))
print(round(t.elapsed, 4))
```

`__getattr__` is called only when normal lookup fails (good for delegation); `__getattribute__` is called for every access (rarely needed, easy to recurse). `__setattr__` and `__delattr__` intercept assignment, and `__slots__` replaces the per-instance `__dict__` with fixed slots, saving memory and blocking typos.

### The full picture

Other useful hooks: `__enter__`/`__exit__` (with), `__iter__`/`__next__` (iterators), `__index__` (use as list index), `__round__`, `__int__`, `__float__`, `__copy__`/`__deepcopy__`, `__getstate__`/`__setstate__` (pickling), `__class_getitem__` (`Matrix[int]`), `__init_subclass__` (hook when subclassed), `__set_name__` (descriptors).

> **Warning:** Overload operators only when the meaning is obvious to a reader. `Money + Money` is clear; `Report + Report` is not (append pages? merge data?). `pathlib` chose `/` for joining because paths already look that way. When in doubt, write a named method.

### Try It Yourself

```python
from functools import total_ordering

@total_ordering
class Money:
    __slots__ = ("amount", "currency")
    def __init__(self, amount, currency="USD"):
        object.__setattr__(self, "amount", round(float(amount), 2))
        object.__setattr__(self, "currency", currency)
    def __setattr__(self, name, value):
        raise AttributeError("Money is immutable")
    def __repr__(self): return f"Money({self.amount!r}, {self.currency!r})"
    def __str__(self): return f"{self.amount:,.2f} {self.currency}"
    def __format__(self, spec): return format(str(self), spec)
    def _check(self, other):
        return isinstance(other, Money) and other.currency == self.currency
    def __eq__(self, other):
        return (self.amount, self.currency) == (other.amount, other.currency) if isinstance(other, Money) else NotImplemented
    def __lt__(self, other):
        return self.amount < other.amount if self._check(other) else NotImplemented
    def __hash__(self): return hash((self.amount, self.currency))
    def __add__(self, other):
        return Money(self.amount + other.amount, self.currency) if self._check(other) else NotImplemented
    def __radd__(self, other):                       # lets sum() start from 0
        return self if other == 0 else NotImplemented
    def __mul__(self, k):
        return Money(self.amount * k, self.currency) if isinstance(k, (int, float)) else NotImplemented
    __rmul__ = __mul__
    def __neg__(self): return Money(-self.amount, self.currency)
    def __bool__(self): return self.amount != 0

class RateMatrix:
    def __init__(self, rows): self._rows = sorted(rows)
    def __len__(self): return len(self._rows)
    def __getitem__(self, i): return self._rows[i]
    def __contains__(self, coverage): return any(c == coverage for c, _ in self._rows)
    def __call__(self, coverage):                    # matrix(amount) -> premium for that bracket
        for limit, rate in self._rows:
            if coverage <= limit: return rate
        raise ValueError("coverage exceeds matrix")

premiums = [Money(575), Money(1118), Money(1830)]
print(sum(premiums), max(premiums), sorted(premiums, reverse=True)[0])
print(f"{3 * Money(100):>16}|", -Money(5), bool(Money(0)))
print(Money(575) == Money(575.00), len({Money(1), Money(1.0), Money(2)}))
try:
    Money(1) + 5
except TypeError as e:
    print("TypeError:", e)
try:
    Money(1).amount = 2
except AttributeError as e:
    print("AttributeError:", e)

matrix = RateMatrix([(500_000, Money(1830)), (100_000, Money(575)), (250_000, Money(1118))])
print(len(matrix), matrix[0], 250_000 in matrix, matrix(180_000))
for limit, rate in matrix:
    print(f"up to {limit:>9,}: {rate}")
```

### Quiz

1. `3 * money` works because…
- [ ] `int.__mul__` understands Money
- [x] `int.__mul__` returns `NotImplemented`, so Python calls `money.__rmul__(3)`
- [ ] Python swaps operands automatically for all types
> Reflected methods are tried when the left operand declines.

2. Defining `__eq__` without `__hash__` makes instances…
- [x] unhashable (`__hash__` becomes `None`)
- [ ] hashable by id
- [ ] hashable by `__eq__`
> Equal objects must hash equally, so Python disables the default identity hash.

3. Which method lets an object be used in a `with` statement?
- [ ] `__call__`
- [x] `__enter__` and `__exit__`
- [ ] `__iter__`
> The context manager protocol; `__exit__` returning `True` suppresses the exception.

4. What should an operator method return for an unsupported operand type?
- [ ] `None`
- [ ] `False`
- [x] `NotImplemented`
> Returning `NotImplemented` lets Python try the other operand and finally raise `TypeError`.

### Exercises

1. **Vector** — Implement `Vector(x, y)` with `+`, `-`, scalar `*` (both sides), `abs()`, `==` and a readable `repr`.
<details><summary>Solution</summary>

```python
import math
class Vector:
    def __init__(self, x, y): self.x, self.y = x, y
    def __repr__(self): return f"Vector({self.x}, {self.y})"
    def __eq__(self, o): return isinstance(o, Vector) and (self.x, self.y) == (o.x, o.y)
    def __add__(self, o): return Vector(self.x + o.x, self.y + o.y)
    def __sub__(self, o): return Vector(self.x - o.x, self.y - o.y)
    def __mul__(self, k): return Vector(self.x * k, self.y * k) if isinstance(k, (int, float)) else NotImplemented
    __rmul__ = __mul__
    def __abs__(self): return math.hypot(self.x, self.y)
print(2 * Vector(3, 4), abs(Vector(3, 4)), Vector(1, 1) + Vector(2, 2) == Vector(3, 3))
```

</details>

2. **Page range** — Write `Pages(start, end)` supporting `len`, iteration, `in`, and `str` giving "12-20".
<details><summary>Solution</summary>

```python
class Pages:
    def __init__(self, start, end): self.start, self.end = start, end
    def __len__(self): return self.end - self.start + 1
    def __iter__(self): return iter(range(self.start, self.end + 1))
    def __contains__(self, p): return self.start <= p <= self.end
    def __str__(self): return f"{self.start}-{self.end}"
p = Pages(12, 20); print(len(p), 15 in p, list(p)[:3], str(p))
```

</details>

3. **Temporary directory context** — Write a context manager class `Workdir` that creates a temp directory on enter and removes it on exit, even when an exception occurs.
<details><summary>Solution</summary>

```python
import tempfile, shutil, os
class Workdir:
    def __enter__(self):
        self.path = tempfile.mkdtemp(); return self.path
    def __exit__(self, et, ev, tb):
        shutil.rmtree(self.path, ignore_errors=True); return False
with Workdir() as d:
    open(os.path.join(d, "x.txt"), "w").write("hi"); print(os.listdir(d))
print(os.path.exists(d))
```

</details>

### Interview Questions

**Q: What is the difference between `__str__` and `__repr__`, and which should you always implement?**
`__repr__` is the unambiguous developer representation, used by the REPL, debuggers, logging and containers, and ideally looks like the constructor call that recreates the object. `__str__` is the user-facing text used by `print` and `str()`, and falls back to `__repr__` when missing. Always implement `__repr__` because it is what you see when something goes wrong in a log or a list of objects; add `__str__` only when a friendlier form is genuinely different, such as `1,118.00 USD` versus `Money(1118.0, 'USD')`. A good `__repr__` includes the fields that define identity and uses `!r` so strings are quoted.

**Q: How does Python evaluate `a + b` when the types differ?**
It first calls `type(a).__add__(a, b)`; if that returns `NotImplemented`, it calls `type(b).__radd__(b, a)`; if that also returns `NotImplemented`, it raises `TypeError`. One exception: if `b` is an instance of a subclass of `type(a)` and overrides the reflected method, the reflected method is tried first, so subclasses can refine behaviour. This is why operator methods should return `NotImplemented` rather than raising for unknown types, and why `sum()` over custom objects needs `__radd__` to accept the integer 0 start value. In-place operators like `+=` try `__iadd__` first and fall back to `__add__` followed by assignment.

**Q: When would you use `__slots__`, and what are the trade-offs?**
`__slots__` declares a fixed set of attribute names so instances store them in a compact array instead of a per-instance `__dict__`, cutting memory per object by roughly half and making attribute access slightly faster. It suits classes instantiated in the millions, such as a row object for every record in a production log, and it also prevents typo attributes from being silently created. Costs: no dynamic attributes, no `__dict__` unless you add it to slots, `__weakref__` must be listed to allow weak references, multiple inheritance with two slotted bases fails, and pickling and some ORM or mocking libraries need care. Dataclasses support `slots=True` since Python 3.10, which gives the benefit with less boilerplate.

## Class methods, static methods & class attributes

Not everything belongs to an instance. Some data is shared by every object of a class (a counter, a registry, a default setting) and some behaviour needs the class rather than an object (alternative constructors, validators, helpers). Python provides **class attributes**, `@classmethod` and `@staticmethod` for these, and understanding how they differ from instance attributes and methods is a standard interview check.

### Class attributes vs instance attributes

```python
class Document:
    count = 0                       # class attribute: one copy, shared
    default_font = "Calibri"

    def __init__(self, title):
        self.title = title          # instance attribute: one per object
        Document.count += 1

a, b = Document("SOP"), Document("Handbook")
print(Document.count, a.count, b.count)     # 2 2 2
a.default_font = "Arial"                     # creates an INSTANCE attribute that shadows the class one
print(a.default_font, b.default_font)        # Arial Calibri
```

Reading `a.count` looks in `a.__dict__` first, then `type(a).__dict__`, then the MRO. Writing `a.x = …` always writes to the instance, which is why `self.count += 1` would silently create an instance copy instead of updating the shared value; use `Document.count` or `type(self).count`.

### The mutable default trap

```python
class Report:
    sections = []                   # shared by every report!
    def add(self, s): self.sections.append(s)

r1, r2 = Report(), Report()
r1.add("Summary")
print(r2.sections)                  # ['Summary']
```

Mutable class attributes are shared state. Initialise per-instance containers in `__init__`. The same trap applies to mutable default arguments (`def __init__(self, sections=[])`).

### Instance methods

A normal method receives the instance as `self`. Accessing it through the class gives the plain function; through an instance gives a **bound method** with `self` filled in:

```python
Document.rename            # <function Document.rename>
a.rename                   # <bound method Document.rename of Document('SOP')>
a.rename("New") == Document.rename(a, "New")
```

### @classmethod

A class method receives the class as `cls` instead of an instance. Its main jobs are **alternative constructors** and access to class-level state, and it respects subclasses because `cls` is whatever class the call went through:

```python
class Document:
    def __init__(self, title, pages): self.title, self.pages = title, pages

    @classmethod
    def from_dict(cls, d):
        return cls(d["title"], int(d.get("pages", 0)))

    @classmethod
    def from_json(cls, text):
        import json
        return cls.from_dict(json.loads(text))

class Handbook(Document): pass

h = Handbook.from_json('{"title": "Employee Handbook", "pages": 767}')
print(type(h).__name__)     # Handbook, not Document
```

`dict.fromkeys`, `datetime.fromtimestamp`, `int.from_bytes` and `Path.home()` are standard-library class methods. Class methods also make good registries:

```python
class Exporter:
    _registry = {}
    @classmethod
    def register(cls, name):
        def deco(sub): cls._registry[name] = sub; return sub
        return deco
    @classmethod
    def create(cls, name, *args): return cls._registry[name](*args)

@Exporter.register("pdf")
class PdfExporter(Exporter): ...
```

### @staticmethod

A static method receives neither `self` nor `cls`. It is a plain function stored in the class namespace because it belongs there conceptually:

```python
class Document:
    @staticmethod
    def is_valid_title(title):
        return bool(title) and len(title) <= 120 and title == title.strip()
```

Call it as `Document.is_valid_title(t)` or `doc.is_valid_title(t)`. If a static method starts needing the class, convert it to a class method; if it needs nothing from the class at all, consider making it a module-level function, which is more idiomatic in Python than in Java.

| Kind | First parameter | Can access instance state | Can access class state | Typical use |
|---|---|---|---|---|
| instance method | `self` | yes | yes (via `type(self)`) | behaviour of one object |
| `@classmethod` | `cls` | no | yes | alternative constructors, registries, subclass-aware factories |
| `@staticmethod` | none | no | no (except by name) | validators, pure helpers grouped with the class |

### Class-level configuration and `__init_subclass__`

Class attributes are a clean way to configure subclasses declaratively, and `__init_subclass__` runs when a subclass is defined:

```python
class Exporter:
    extension = None
    def __init_subclass__(cls, **kw):
        super().__init_subclass__(**kw)
        if cls.extension is None:
            raise TypeError(f"{cls.__name__} must set extension")

class PdfExporter(Exporter):
    extension = "pdf"
```

Django models and ORMs use the same idea: fields declared as class attributes, collected by machinery at class-creation time.

### Properties and class attributes together

A `@property` on the class combined with a class attribute default is the standard way to give a computed or validated attribute a fallback:

```python
class Page:
    dpi = 300
    @property
    def pixel_width(self): return int(self.width_inches * self.dpi)
```

Change `Page.dpi = 150` and every page recomputes; set `page.dpi = 600` and only that page changes.

> **Tip:** When a method does not use `self`, linters (pylint `no-self-use`, Ruff `PLR6301`) will flag it. That is your prompt to decide between `@staticmethod`, `@classmethod` or a module function. Interviewers like hearing that you make that choice deliberately.

### Try It Yourself

```python
import json

class Document:
    count = 0                       # class attribute shared by all documents
    default_font = "Calibri"
    _registry = {}

    def __init__(self, title, pages=0):
        self.title, self.pages = title, pages
        self.sections = []          # per-instance container, NOT a class attribute
        type(self).count += 1       # updates the shared counter, works for subclasses too

    def __repr__(self): return f"{type(self).__name__}({self.title!r}, {self.pages})"

    @classmethod
    def from_dict(cls, d): return cls(d["title"], int(d.get("pages", 0)))

    @classmethod
    def from_json(cls, text): return cls.from_dict(json.loads(text))

    @classmethod
    def register(cls, kind):
        def deco(sub): cls._registry[kind] = sub; return sub
        return deco

    @classmethod
    def create(cls, kind, *a, **kw): return cls._registry[kind](*a, **kw)

    @staticmethod
    def is_valid_title(t): return bool(t) and len(t) <= 120 and t == t.strip()

    def __init_subclass__(cls, **kw):
        super().__init_subclass__(**kw)
        cls.count = 0               # each subclass gets its own counter

@Document.register("handbook")
class Handbook(Document):
    default_font = "Georgia"

@Document.register("sop")
class SOP(Document): pass

d = Document.from_json('{"title": "Rate Matrix Guide", "pages": 12}')
h = Handbook.from_dict({"title": "Employee Handbook", "pages": 767})
s = Document.create("sop", "Escrow SOP", 9)
print(d, h, s)
print("counts:", Document.count, Handbook.count, SOP.count)
print("fonts:", d.default_font, h.default_font)
h.default_font = "Arial"                        # shadows on this instance only
print("after shadow:", h.default_font, Handbook.default_font, "instance dict:", h.__dict__.keys())
d.sections.append("Intro"); print("sections isolated:", d.sections, s.sections)
print("valid titles:", Document.is_valid_title("SOP"), d.is_valid_title(" SOP "))
print(Document.from_dict, "|", d.from_dict)     # both bound to the class
print(Document.is_valid_title, "|", d.is_valid_title)   # plain function either way
```

### Quiz

1. `self.count += 1` inside a method, where `count` is a class attribute, does what?
- [ ] Increments the shared class attribute
- [x] Creates an instance attribute `count` that shadows the class attribute
- [ ] Raises `AttributeError`
> Augmented assignment reads from the class but writes to the instance; use `type(self).count += 1`.

2. Why prefer `cls(...)` over `Document(...)` inside a class method constructor?
- [x] So subclasses calling the method get instances of the subclass
- [ ] `Document(...)` is a syntax error there
- [ ] `cls` is faster
> `Handbook.from_json(...)` should return a `Handbook`.

3. A method that uses neither `self` nor `cls` is best declared as…
- [ ] an instance method
- [x] a `@staticmethod` (or a module-level function)
- [ ] a `@property`
> Static methods signal that no instance or class state is involved.

4. Which class attribute definition is a bug waiting to happen?
- [ ] `dpi = 300`
- [x] `sections = []`
- [ ] `default_font = "Calibri"`
> A mutable class attribute is shared by every instance.

### Exercises

1. **Alternative constructor** — Add `Temperature.from_fahrenheit(f)` to a class that stores Celsius, and verify it works for a subclass.
<details><summary>Solution</summary>

```python
class Temperature:
    def __init__(self, c): self.c = c
    @classmethod
    def from_fahrenheit(cls, f): return cls((f - 32) * 5 / 9)
class Reading(Temperature): pass
r = Reading.from_fahrenheit(212); print(type(r).__name__, round(r.c, 1))
```

</details>

2. **Instance counter with reset** — Track how many `Ticket` objects exist, with a class method `reset()` and a static method `is_valid_id(s)` that checks the pattern `TCK-` plus digits.
<details><summary>Solution</summary>

```python
import re
class Ticket:
    total = 0
    def __init__(self, tid):
        if not self.is_valid_id(tid): raise ValueError(tid)
        self.tid = tid; Ticket.total += 1
    @classmethod
    def reset(cls): cls.total = 0
    @staticmethod
    def is_valid_id(s): return re.fullmatch(r"TCK-\d+", s) is not None
Ticket("TCK-1"); Ticket("TCK-2"); print(Ticket.total); Ticket.reset(); print(Ticket.total)
```

</details>

3. **Plugin registry** — Use `__init_subclass__` to register every subclass of `Plugin` under its `name` attribute automatically.
<details><summary>Solution</summary>

```python
class Plugin:
    registry = {}
    name = None
    def __init_subclass__(cls, **kw):
        super().__init_subclass__(**kw)
        if cls.name: Plugin.registry[cls.name] = cls
class Pdf(Plugin): name = "pdf"
class Epub(Plugin): name = "epub"
print(sorted(Plugin.registry))
```

</details>

### Interview Questions

**Q: Explain the difference between instance methods, class methods and static methods.**
An instance method receives the object as `self` and works with per-object state. A class method, marked `@classmethod`, receives the class as `cls`; it is used for alternative constructors (`Document.from_json`), factories that must return the right subclass, and access to class-level state such as registries or counters. A static method, marked `@staticmethod`, receives nothing implicit and is a plain function namespaced under the class for discoverability, typical for validators and conversions. The decision rule is what the code needs: instance state, class identity, or neither. In Python the last category is often better as a module-level function, unlike Java where everything must live in a class.

**Q: How does attribute lookup work for `obj.x` and why does `self.count += 1` behave unexpectedly?**
Lookup checks data descriptors on the type first (such as properties), then the instance `__dict__`, then non-data descriptors and plain attributes on the class and its MRO, and finally `__getattr__` if defined. Assignment through `obj.x = v` writes to the instance `__dict__` (unless a data descriptor or `__setattr__` intercepts). `self.count += 1` therefore reads the class value through the lookup chain, adds one, and stores the result on the instance, leaving the class attribute unchanged and shadowed for that object only. To update shared state you write `type(self).count += 1` or `Document.count += 1`, and mutable class attributes such as lists are shared unless replaced per instance in `__init__`.

**Q: When would you use `__init_subclass__` instead of a metaclass?**
`__init_subclass__` (Python 3.6+) is a hook on the base class that runs whenever a subclass is created, with the new class as `cls` and any keyword arguments from the class statement. It covers most reasons people once wrote metaclasses: validating that subclasses define required attributes, registering plugins automatically, or injecting defaults. It is simpler, composes with other bases without metaclass conflicts, and is easier to read. A metaclass is still needed when you must change how the class object itself is built, such as customising the namespace before the body executes (`__prepare__`), altering `isinstance` behaviour, or making classes callable in unusual ways, which is what `abc.ABCMeta` and `enum.EnumMeta` do.

## OOP in JavaScript (prototypes, classes, this)

JavaScript is object-oriented, but not class-based at heart: objects inherit directly from other objects through a **prototype chain**, and the `class` keyword added in ES2015 is syntax over that mechanism. Interviewers for full-stack roles ask about prototypes, the meaning of `this`, and how JavaScript's model differs from Python's. This chapter explains the model with JavaScript in the text and, because this course runs Python, a Python simulation of the prototype chain in the Try It block.

### Objects and prototypes

Every object has a hidden link to another object, its prototype. Property lookup walks that chain until it finds the name or reaches `null`:

```js
const document = { title: "Handbook", describe() { return `${this.title}, ${this.pages} pages`; } };
const handbook = Object.create(document);   // handbook's prototype is document
handbook.pages = 767;
console.log(handbook.describe());            // "Handbook, 767 pages"
console.log(Object.getPrototypeOf(handbook) === document);   // true
console.log(handbook.hasOwnProperty("title"));                // false: inherited
```

`handbook` has one own property (`pages`); `title` and `describe` are found on `document`. Assigning `handbook.title = "SOP"` creates an own property that shadows the prototype's, exactly like a Python instance attribute shadowing a class attribute.

### Constructor functions (pre-2015)

```js
function Document(title, pages) { this.title = title; this.pages = pages; }
Document.prototype.describe = function () { return `${this.title}, ${this.pages} pages`; };
const d = new Document("SOP", 12);
```

`new` creates an empty object, sets its prototype to `Document.prototype`, runs the function with `this` bound to that object, and returns it. Methods live on `Document.prototype`, shared by all instances, which is why `d.describe === Document.prototype.describe`.

### ES2015 classes

```js
class Document {
  #status = "draft";                       // private field (ES2022)
  static count = 0;                        // class (static) field
  constructor(title, pages = 0) { this.title = title; this.pages = pages; Document.count++; }
  describe() { return `${this.title}, ${this.pages} pages`; }
  get isLong() { return this.pages > 100; }
  set status(v) { if (!["draft", "approved"].includes(v)) throw new Error(v); this.#status = v; }
  get status() { return this.#status; }
  static fromJSON(text) { const o = JSON.parse(text); return new this(o.title, o.pages); }
}
class Handbook extends Document {
  constructor(title, pages) { super(title, pages); this.kind = "handbook"; }
  describe() { return "Handbook: " + super.describe(); }
}
```

Under the hood this is the constructor-function pattern: `Handbook.prototype` inherits from `Document.prototype`, and `new this(...)` in a static method creates a subclass instance when called as `Handbook.fromJSON(...)`. Private fields `#status` are genuinely inaccessible from outside (unlike Python's `_name` convention). Classes are not hoisted and run in strict mode.

### this

`this` is not the instance the method was defined on; it is determined by *how the function is called*:

| Call form | `this` is |
|---|---|
| `obj.method()` | `obj` |
| `fn()` | `undefined` in strict mode (`window` in sloppy mode) |
| `new Fn()` | the new object |
| `fn.call(x)`, `fn.apply(x)`, `fn.bind(x)()` | `x` |
| arrow function | inherited from the enclosing scope (lexical) |

The classic bug:

```js
const d = new Document("SOP", 12);
const f = d.describe;
f();                                  // TypeError: cannot read 'title' of undefined
setTimeout(d.describe, 0);            // same problem: the method is detached
setTimeout(() => d.describe(), 0);    // fine: arrow keeps the call form obj.method()
const bound = d.describe.bind(d);     // or bind once
```

Arrow functions do not have their own `this`, which makes them right for callbacks inside methods and wrong for methods themselves (an arrow method on the prototype would capture the module's `this`). Class field arrows (`handleClick = () => {...}`) create a bound copy per instance, which is why React components used them.

### Comparing with Python

| Concept | Python | JavaScript |
|---|---|---|
| Inheritance mechanism | classes with MRO (C3) | prototype chain, single parent per object |
| Instance reference | explicit `self` parameter | implicit `this`, decided at call time |
| Private members | `_name` convention, `__name` mangling | `#name` real privacy |
| Class attribute | `count = 0` in class body | `static count = 0` |
| Alternative constructor | `@classmethod` | `static` method using `new this()` |
| Dunder methods | `__add__`, `__len__`, `__iter__` | `Symbol.iterator`, `toString`, `valueOf`; no operator overloading |
| Multiple inheritance | supported | not supported; use mixins via `Object.assign` or class factories |
| Bound methods | created automatically on access | must bind manually or use arrows |

JavaScript has no operator overloading and no multiple inheritance; mixins are implemented by copying methods (`Object.assign(Target.prototype, mixin)`) or by functions returning classes (`const Serializable = Base => class extends Base { … }`).

### Duck typing and structural interfaces

JavaScript is dynamically typed like Python and uses duck typing everywhere: anything with a `then` method is treated as a promise, anything with `Symbol.iterator` works in `for…of`. TypeScript adds structural interfaces that resemble Python's `Protocol`.

> **Interview note:** The three-part JavaScript OOP question is almost always: what is the prototype chain, what does `class` compile to, and what is `this` in a detached method. Answer with `Object.create`, "syntactic sugar over prototypes with real differences: strict mode, no hoisting, `#private`", and the call-site table.

### Try It Yourself

```python
# A tiny simulation of JavaScript's prototype chain and `this` binding, in Python.
# JsObject.get walks the chain like JS property lookup; call() shows why `this` depends on the call site.

class JsObject:
    def __init__(self, proto=None, **own):
        self.proto = proto                  # like [[Prototype]]
        self.own = dict(own)                # own properties

    def get(self, name):
        obj = self
        while obj is not None:
            if name in obj.own:
                return obj.own[name]
            obj = obj.proto
        return None                         # JS returns undefined

    def set(self, name, value):             # assignment always creates an OWN property (shadowing)
        self.own[name] = value

    def has_own(self, name): return name in self.own

    def call(self, name, *args):            # obj.method(...) : `this` is obj
        fn = self.get(name)
        return fn(self, *args)

def describe(this):
    return f"{this.get('title')}, {this.get('pages')} pages"

# Object.create(document) in JS
document = JsObject(title="Handbook", describe=describe)
handbook = JsObject(proto=document, pages=767)
print(handbook.call("describe"))                       # "Handbook, 767 pages"
print("own title?", handbook.has_own("title"), "| own pages?", handbook.has_own("pages"))
handbook.set("title", "SOP")                           # shadows the prototype's title
print(handbook.call("describe"), "| prototype still:", document.get("title"))

# class Document { constructor(...) {...} describe() {...} }  ->  methods live on Document.prototype
Document_prototype = JsObject(describe=describe)
def new_Document(title, pages):                        # what `new Document(title, pages)` does
    obj = JsObject(proto=Document_prototype)
    obj.set("title", title); obj.set("pages", pages)
    return obj

# class Handbook extends Document: Handbook.prototype's prototype is Document.prototype
Handbook_prototype = JsObject(proto=Document_prototype,
                              describe=lambda this: "Handbook: " + describe(this))
def new_Handbook(title, pages):
    obj = JsObject(proto=Handbook_prototype)
    obj.set("title", title); obj.set("pages", pages)
    return obj

d, h = new_Document("Rate Guide", 12), new_Handbook("Employee Handbook", 767)
print(d.call("describe")); print(h.call("describe"))
print("shared method:", d.get("describe") is Document_prototype.get("describe"))

# The detached-method bug: const f = d.describe; f()  ->  `this` is undefined
f = d.get("describe")
try:
    f(None)
except AttributeError:
    print("TypeError-like: cannot read 'title' of undefined")
bound = lambda *a: f(d, *a)                            # d.describe.bind(d)
print("bound:", bound())
```

### Quiz

1. In JavaScript, where are methods defined with `class` syntax stored?
- [ ] On each instance
- [x] On the class's `prototype` object, shared by all instances
- [ ] In a hidden static table
> `d.describe === Document.prototype.describe` is `true`.

2. `const f = obj.method; f();` fails because…
- [ ] functions cannot be assigned to variables
- [x] `this` is determined by the call site, and a plain call has `this` undefined in strict mode
- [ ] `obj` was garbage collected
> Use `obj.method()`, `bind`, or an arrow wrapper.

3. Arrow functions differ from regular functions in that they…
- [x] have no own `this` and take it from the enclosing scope
- [ ] cannot take arguments
- [ ] always return objects
> That is why arrows suit callbacks inside methods but not prototype methods.

4. Which is true of JavaScript compared with Python?
- [ ] JavaScript supports multiple inheritance with `extends A, B`
- [x] JavaScript `#fields` are truly private, while Python's `__name` is only name-mangled
- [ ] JavaScript supports operator overloading via `Symbol.add`
> Private fields cannot be read outside the class body; Python's mangling is a convention.

### Exercises

1. **Translate to JS** — Convert this Python to an ES2015 class with a static alternative constructor: `class Money: def __init__(self, amount, cur="USD") ...; @classmethod def from_cents(cls, c) ...`.
<details><summary>Solution</summary>

```js
class Money {
  constructor(amount, cur = "USD") { this.amount = amount; this.cur = cur; }
  static fromCents(c) { return new this(c / 100); }
  toString() { return `${this.amount.toFixed(2)} ${this.cur}`; }
}
console.log(String(Money.fromCents(111800)));
```

</details>

2. **Fix `this`** — The following loses `this`: `class Timer { start() { setInterval(function () { this.tick++; }, 1000); } }`. Rewrite it two ways.
<details><summary>Solution</summary>

```js
class Timer {
  tick = 0;
  start() { setInterval(() => { this.tick++; }, 1000); }           // arrow: lexical this
}
class Timer2 {
  tick = 0;
  start() { setInterval(function () { this.tick++; }.bind(this), 1000); }   // explicit bind
}
```

</details>

3. **Prototype simulation** — Extend the Python `JsObject` with a `get_prototype_of` method and an `instance_of(proto)` method that walks the chain like `instanceof`.
<details><summary>Solution</summary>

```python
class JsObject:
    def __init__(self, proto=None, **own): self.proto, self.own = proto, dict(own)
    def get_prototype_of(self): return self.proto
    def instance_of(self, proto):
        p = self.proto
        while p is not None:
            if p is proto: return True
            p = p.proto
        return False
base = JsObject(); sub = JsObject(proto=base); obj = JsObject(proto=sub)
print(obj.instance_of(base), base.instance_of(obj))
```

</details>

### Interview Questions

**Q: Explain prototypal inheritance and how `class` relates to it.**
Every JavaScript object has an internal prototype link; property reads walk that chain until a match or `null`, while writes create own properties that shadow inherited ones. `Object.create(proto)` makes an object with a given prototype, and constructor functions with `new` set the prototype to `Fn.prototype`, where shared methods live. `class` is syntax for that same arrangement: `extends` sets `Sub.prototype`'s prototype to `Base.prototype` and links the constructors, `super()` calls the parent constructor, and static members sit on the constructor object. The real differences are that class bodies are strict mode, class declarations are not hoisted, calling a class without `new` throws, and `#private` fields and `static` blocks have no pre-2015 equivalent.

**Q: What determines the value of `this`, and how do you avoid losing it?**
`this` is bound at call time by the call form, not by where the function was defined: `obj.m()` binds `obj`, a bare `f()` binds `undefined` in strict mode, `new` binds the new object, and `call`, `apply` and `bind` set it explicitly; arrow functions have no `this` of their own and use the enclosing scope's. You lose it when a method is passed as a callback (`setTimeout(d.describe)`, `arr.map(this.format)`) because it is invoked as a bare function. Fixes are wrapping in an arrow (`() => d.describe()`), binding once in the constructor (`this.describe = this.describe.bind(this)`), or defining the method as a class field arrow. I prefer the arrow wrapper at the call site because it keeps prototype methods shared instead of creating a copy per instance.

**Q: How would you implement a mixin or multiple inheritance in JavaScript?**
JavaScript objects have a single prototype, so multiple inheritance is emulated. The simplest mixin copies methods onto a prototype with `Object.assign(Document.prototype, Serializable, Printable)`, which works for stateless behaviour but does not cooperate with `super`. The more structured approach is a class factory: `const Serializable = Base => class extends Base { toJSON() { … } }`, applied as `class Handbook extends Serializable(Printable(Document)) {}`, which builds a real chain so `super` calls flow through each mixin. Composition is usually cleaner: hold a serializer object and delegate. I mention that Python solves this with the C3 MRO and cooperative `super()`, which is why the same design is a single `class Handbook(Serializable, Printable, Document)` there.

# LEVEL: Expert

## SOLID principles

**SOLID** is five design principles for object-oriented code, collected by Robert C. Martin, that together make systems easier to change without breaking. Every senior-level OOP interview touches at least one of them, and the strongest answers pair each principle with a violation, the fix, and the cost of over-applying it.

### S: Single Responsibility Principle

A class should have one reason to change. "Responsibility" means a stakeholder or axis of change, not "one method".

```python
class ReportService:                       # violates SRP: three reasons to change
    def load_rows(self, path): ...         # storage format changes
    def compute_totals(self, rows): ...    # business rules change
    def render_pdf(self, totals): ...      # output format changes
```

Split along those axes: `RowLoader`, `TotalsCalculator`, `PdfRenderer`, with a thin `ReportService` that coordinates them. Each can now change and be tested alone. Over-applied, SRP produces dozens of one-method classes; the test is whether the pieces change for different reasons, not their size.

### O: Open/Closed Principle

Software entities should be open for extension but closed for modification: add behaviour by adding code, not by editing working code.

```python
def export(doc, fmt):                      # closed to extension: every new format edits this
    if fmt == "pdf": ...
    elif fmt == "docx": ...
    elif fmt == "epub": ...
```

```python
class Exporter(ABC):
    @abstractmethod
    def export(self, doc): ...

EXPORTERS = {"pdf": PdfExporter, "docx": DocxExporter}   # add a key, touch nothing else
def export(doc, fmt): return EXPORTERS[fmt]().export(doc)
```

Polymorphism, registries and plugins are how OCP is achieved. The cost is indirection; do not build an abstraction until a second variant actually exists.

### L: Liskov Substitution Principle

Subtypes must be usable wherever their base type is expected without the caller knowing. Concretely, an override must not strengthen preconditions, weaken postconditions or throw new exception types.

```python
class Document:
    def add_page(self, page): self.pages.append(page)

class ReadOnlyDocument(Document):
    def add_page(self, page): raise PermissionError    # LSP violation: callers of Document break
```

The famous example is `Square(Rectangle)`: setting `width` on a square must also change `height`, breaking code that assumes rectangles behave independently. Fixes are to model the concept differently (an immutable `Shape` with `area()`, or a `ReadOnlyView` that does not claim to be a `Document`). Python's `collections.abc` separates `Sequence` from `MutableSequence` for exactly this reason.

### I: Interface Segregation Principle

Clients should not be forced to depend on methods they do not use. Fat interfaces make every implementation carry stubs and every test double huge.

```python
class Storage(ABC):                         # fat
    def read(self): ...
    def write(self, data): ...
    def list_versions(self): ...
    def restore(self, version): ...

class Readable(Protocol):                   # segregated
    def read(self) -> bytes: ...
class Writable(Protocol):
    def write(self, data: bytes) -> None: ...
```

A function that only reads accepts `Readable`; an S3 backend without versioning is no longer forced to raise `NotImplementedError` from four methods. Python's `Protocol` makes segregation cheap because no class has to declare which small interfaces it satisfies.

### D: Dependency Inversion Principle

High-level modules should not depend on low-level modules; both should depend on abstractions. Practically: pass dependencies in, typed by interface, rather than constructing concrete ones inside.

```python
class ReportService:
    def __init__(self):
        self.db = PostgresConnection("prod")     # hard-wired: untestable, unswappable

class ReportService:
    def __init__(self, repo: RowRepository):     # inverted: any repo, including a fake
        self.repo = repo
```

**Dependency injection** is the technique (constructor injection above); DIP is the principle. The composition root, usually `main()`, wires the concrete objects together. The cost is that reading the code no longer tells you which implementation runs; good naming and a single wiring location keep it manageable.

### The principles together

| Principle | Smell it fixes | Tool |
|---|---|---|
| SRP | God class, unrelated reasons to change | Split by axis of change |
| OCP | `if/elif` chains on type | Polymorphism, registries |
| LSP | Overrides that raise or ignore | Model the real hierarchy, prefer composition |
| ISP | `NotImplementedError` stubs, huge fakes | Small protocols |
| DIP | `new` of concrete classes inside logic | Inject abstractions |

> **Interview note:** Interviewers rarely want definitions; they want a story. Prepare one real refactor per principle: "the exporter `if` chain became a registry (OCP), which let the client add EPUB without a deployment of the core".

### Try It Yourself

```python
from abc import ABC, abstractmethod
from typing import Protocol

# --- SRP + DIP: the service depends on small abstractions passed in ---
class RowSource(Protocol):
    def rows(self) -> list[dict]: ...

class Renderer(ABC):
    @abstractmethod
    def render(self, totals: dict) -> str: ...

class ListSource:                        # a fake for tests, or a CSV/DB source in production
    def __init__(self, rows): self._rows = rows
    def rows(self): return self._rows

class TotalsCalculator:                  # one reason to change: business rules
    def totals(self, rows):
        out = {}
        for r in rows:
            out[r["state"]] = out.get(r["state"], 0) + r["files"]
        return out

class TextRenderer(Renderer):
    def render(self, totals): return "\n".join(f"{k}: {v}" for k, v in sorted(totals.items()))

class CsvRenderer(Renderer):
    def render(self, totals): return "state,files\n" + "\n".join(f"{k},{v}" for k, v in sorted(totals.items()))

# --- OCP: new renderers are registered, the service is never edited ---
RENDERERS: dict[str, type[Renderer]] = {"text": TextRenderer, "csv": CsvRenderer}

class ReportService:
    def __init__(self, source: RowSource, calc: TotalsCalculator):
        self.source, self.calc = source, calc
    def build(self, fmt: str) -> str:
        return RENDERERS[fmt]().render(self.calc.totals(self.source.rows()))

rows = [{"state": "WY", "files": 124}, {"state": "CO", "files": 310}, {"state": "WY", "files": 6}]
svc = ReportService(ListSource(rows), TotalsCalculator())
print(svc.build("text")); print(svc.build("csv"))

class JsonRenderer(Renderer):            # extension without modification
    def render(self, totals):
        import json; return json.dumps(totals, sort_keys=True)
RENDERERS["json"] = JsonRenderer
print(svc.build("json"))

# --- LSP: a subtype that breaks the contract vs a correct model ---
class Rectangle:
    def __init__(self, w, h): self.w, self.h = w, h
    def area(self): return self.w * self.h

class Square(Rectangle):                 # violates LSP once width and height are set independently
    def __init__(self, s): super().__init__(s, s)
    def __setattr__(self, k, v):
        object.__setattr__(self, "w", v); object.__setattr__(self, "h", v)

def stretch(rect: Rectangle):
    rect.w = 10; rect.h = 2
    return rect.area()

print("rectangle:", stretch(Rectangle(3, 3)), "square:", stretch(Square(3)), "<- caller expected 20")
```

### Quiz

1. A class that loads rows, computes totals and renders a PDF violates…
- [x] Single Responsibility
- [ ] Liskov Substitution
- [ ] Dependency Inversion
> It has three unrelated reasons to change.

2. Replacing an `if fmt == ...` chain with a registry of exporter classes is an application of…
- [ ] ISP
- [x] Open/Closed
- [ ] SRP
> New formats are added without modifying the dispatch code.

3. `Square(Rectangle)` is the classic violation of…
- [ ] OCP
- [x] LSP
- [ ] DIP
> Code written for rectangles produces wrong results when given a square.

4. Dependency inversion means…
- [ ] Never import other modules
- [x] Depend on abstractions that are passed in rather than constructing concrete classes inside
- [ ] Always use a DI framework
> Constructor injection of a protocol-typed collaborator is the common form.

### Exercises

1. **Segregate** — Split a `Printer` interface with `print()`, `scan()`, `fax()` so a basic printer does not have to stub `scan` and `fax`.
<details><summary>Solution</summary>

```python
from typing import Protocol
class Printer(Protocol):
    def print(self, doc) -> None: ...
class Scanner(Protocol):
    def scan(self) -> bytes: ...
class BasicPrinter:
    def print(self, doc): print("printing", doc)
class MultiFunction:
    def print(self, doc): print("printing", doc)
    def scan(self): return b"scan"
def run(p: Printer): p.print("SOP")
run(BasicPrinter()); run(MultiFunction())
```

</details>

2. **Invert a dependency** — Refactor `class Mailer: def __init__(self): self.smtp = smtplib.SMTP("mail")` so it can be unit-tested with a fake.
<details><summary>Solution</summary>

```python
from typing import Protocol
class Transport(Protocol):
    def send(self, to: str, body: str) -> None: ...
class Mailer:
    def __init__(self, transport: Transport): self.transport = transport
    def notify(self, to, body): self.transport.send(to, body)
class FakeTransport:
    def __init__(self): self.sent = []
    def send(self, to, body): self.sent.append((to, body))
fake = FakeTransport(); Mailer(fake).notify("qa@example.com", "Report ready"); print(fake.sent)
```

</details>

3. **Fix an LSP break** — `class Bird: def fly()` and `class Penguin(Bird)` raising in `fly()`. Remodel it.
<details><summary>Solution</summary>

```python
class Bird:
    def eat(self): return "eats"
class FlyingBird(Bird):
    def fly(self): return "flies"
class Sparrow(FlyingBird): pass
class Penguin(Bird): pass          # never claims to fly, so no caller is surprised
def migrate(b: FlyingBird): return b.fly()
print(migrate(Sparrow()), Penguin().eat())
```

</details>

### Interview Questions

**Q: Explain SOLID and give one concrete violation and fix for each.**
SRP: one reason to change; a `ReportService` that loads, computes and renders splits into three collaborators. OCP: extend without modifying; an `if/elif` on export format becomes a registry of `Exporter` classes so EPUB is added with a new class and one dictionary entry. LSP: subtypes must be substitutable; a `ReadOnlyDocument(Document)` whose `add_page` raises breaks callers, so model it as a separate view type. ISP: clients depend only on what they use; a fat `Storage` interface becomes `Readable` and `Writable` protocols so a read-only backend has no stubs. DIP: depend on abstractions passed in; `ReportService` receives a `RowRepository` instead of constructing `PostgresConnection`, making it testable with a fake. The through-line is that all five reduce the blast radius of a change.

**Q: Can SOLID be over-applied? How do you decide when to stop?**
Yes: each principle adds indirection, and applied speculatively it produces interfaces with one implementation, factories that create one type and services split into fragments that always change together. My rule is to introduce an abstraction when the second concrete variant arrives or when a test needs a seam, and to split a class when two different stakeholders are asking for changes to it. I also watch the ratio of interfaces to implementations and whether a newcomer can trace a request through the code. Python's duck typing and `Protocol` lower the cost, since a dependency can be typed by a small protocol without any class hierarchy, so I lean towards DIP and ISP early and towards SRP and OCP only when change pressure appears.

**Q: How does dependency injection relate to DIP, and do you need a framework?**
DIP is the principle that policy code depends on abstractions; dependency injection is the mechanism that supplies the concrete implementations from outside, usually through the constructor. In Python a framework is rarely needed: a `main()` composition root instantiates the repository, renderer and service and wires them together, and tests pass fakes to the same constructors. Frameworks such as `dependency-injector` or FastAPI's `Depends` help when the object graph is large, has scopes such as per-request, or needs configuration-driven swapping, at the cost of magic that hides the wiring. I keep constructor injection explicit and reach for a container only when manual wiring exceeds a screen or two.

## Design patterns

A **design pattern** is a named, reusable solution to a recurring design problem, catalogued by the "Gang of Four" (Gamma, Helm, Johnson, Vlissides) in 1994. Knowing the names gives teams a shared vocabulary: "make that a Strategy" says in three words what would take a paragraph. This chapter covers the five that come up most in interviews and in document-automation code, with Python-idiomatic versions rather than Java translations.

### Singleton: one instance

**Problem:** exactly one configuration or connection pool should exist.

```python
class Config:
    _instance = None
    def __new__(cls, *a, **kw):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
```

Every `Config()` call returns the same object. In Python the idiomatic singleton is usually a **module**: `config.py` with module-level state is imported once and shared. Singletons are global state, which makes tests order-dependent and hides dependencies; prefer creating one instance in the composition root and injecting it. Interviewers like to hear that Singleton is the pattern you know how to avoid.

### Factory: creating without naming the class

**Problem:** the caller knows *what kind* of object it needs, not which class implements it.

```python
class Exporter(ABC): ...
class PdfExporter(Exporter): ...
class EpubExporter(Exporter): ...

def make_exporter(kind: str, **options) -> Exporter:     # factory function
    registry = {"pdf": PdfExporter, "epub": EpubExporter}
    try:
        return registry[kind](**options)
    except KeyError:
        raise ValueError(f"unknown exporter {kind!r}") from None
```

The GoF **Factory Method** is an overridable method on a creator class (`Document.create_exporter()` overridden in subclasses); **Abstract Factory** groups related factories (a `ThemeFactory` producing matching fonts, colours and page styles). In Python a function or a `@classmethod` on the base usually suffices, and a dict registry plus `__init_subclass__` makes it self-maintaining.

### Strategy: interchangeable algorithms

**Problem:** the same operation has several algorithms chosen at runtime.

```python
class PricingStrategy(Protocol):
    def premium(self, coverage: float) -> float: ...

class StandardRate:
    def premium(self, coverage): return 575 + max(0, coverage - 100_000) * 0.0036
class ReissueRate:
    def premium(self, coverage): return StandardRate().premium(coverage) * 0.6

class Quote:
    def __init__(self, coverage, strategy: PricingStrategy): self.coverage, self.strategy = coverage, strategy
    def total(self): return round(self.strategy.premium(self.coverage), 2)

print(Quote(250_000, StandardRate()).total(), Quote(250_000, ReissueRate()).total())
```

Because Python functions are objects, a strategy is often just a callable: `Quote(250_000, strategy=reissue_rate)`. Use classes when strategies carry configuration or several methods. Strategy is composition replacing an `if` chain and is the direct implementation of OCP.

### Observer: publish and subscribe

**Problem:** when one object changes, others must react without the subject knowing who they are.

```python
class Subject:
    def __init__(self): self._observers = []
    def subscribe(self, fn): self._observers.append(fn); return fn
    def notify(self, *args, **kw):
        for fn in list(self._observers): fn(*args, **kw)

class JobQueue(Subject):
    def complete(self, job):
        self.notify("completed", job)

queue = JobQueue()
queue.subscribe(lambda event, job: print("email:", event, job))
queue.subscribe(lambda event, job: print("dashboard refresh:", job))
queue.complete("handbook.pdf")
```

Observers are callables; the subject only knows the calling convention. Real systems add unsubscribe, error isolation (one failing observer must not stop the rest), and often weak references so observers can be garbage collected. GUI events, Django signals and `asyncio` callbacks are Observer.

### Builder: constructing step by step

**Problem:** an object needs many optional parts, and a constructor with fifteen keyword arguments is unreadable or the parts must be assembled in order.

```python
class DocumentBuilder:
    def __init__(self, title): self._doc = {"title": title, "sections": [], "meta": {}}
    def author(self, name): self._doc["meta"]["author"] = name; return self
    def section(self, heading, body): self._doc["sections"].append((heading, body)); return self
    def toc(self, depth=2): self._doc["meta"]["toc_depth"] = depth; return self
    def build(self): 
        if not self._doc["sections"]: raise ValueError("a document needs at least one section")
        return dict(self._doc)

doc = (DocumentBuilder("Employee Handbook").author("Ali Raza")
       .section("Leave policy", "...").section("Conduct", "...").toc(3).build())
```

Each method returns `self` (a **fluent interface**), and `build()` validates and produces the final object. `python-docx` and `pptxgenjs` are effectively builders. When the product is immutable, Builder is how you assemble it; when options are simple, keyword arguments and dataclasses are enough.

### Other names to recognise

| Pattern | One-line purpose | Python form |
|---|---|---|
| Adapter | Make an existing class fit an interface | Wrapper class delegating with renamed methods |
| Decorator | Add behaviour to an object without subclassing | `functools.wraps` decorators, wrapper objects |
| Facade | Simple entry point over a complex subsystem | A module with a few functions over `pikepdf`, `PyMuPDF` |
| Template Method | Fixed algorithm, overridable steps | ABC with abstract hooks |
| Command | Encapsulate an action as an object | Callables in a queue, undo stacks |
| Iterator | Sequential access without exposing structure | `__iter__`, generators |
| Proxy | Control access to another object | Lazy loading, caching wrappers |

> **Tip:** In interviews, name the *problem* before the pattern: "we needed to add export formats without touching the core, so a registry-based Factory". Reciting pattern definitions without a problem sounds memorised; describing a problem and reaching for the name sounds experienced.

### Try It Yourself

```python
from abc import ABC, abstractmethod

# Factory with self-registering subclasses
class Exporter(ABC):
    registry = {}
    kind = None
    def __init_subclass__(cls, **kw):
        super().__init_subclass__(**kw)
        if cls.kind: Exporter.registry[cls.kind] = cls
    @abstractmethod
    def export(self, doc) -> str: ...
    @classmethod
    def create(cls, kind, **opts):
        try: return cls.registry[kind](**opts)
        except KeyError: raise ValueError(f"unknown exporter {kind!r}") from None

class PdfExporter(Exporter):
    kind = "pdf"
    def __init__(self, dpi=300): self.dpi = dpi
    def export(self, doc): return f"{doc['title']}.pdf @ {self.dpi} dpi, {len(doc['sections'])} sections"

class EpubExporter(Exporter):
    kind = "epub"
    def export(self, doc): return f"{doc['title']}.epub, reflowable, toc depth {doc['meta'].get('toc_depth', 1)}"

# Strategy as plain callables
def standard_rate(coverage): return 575 + max(0, coverage - 100_000) * 0.0036
def reissue_rate(coverage): return standard_rate(coverage) * 0.6

class Quote:
    def __init__(self, coverage, strategy=standard_rate): self.coverage, self.strategy = coverage, strategy
    def total(self): return round(self.strategy(self.coverage), 2)

# Observer with error isolation
class Subject:
    def __init__(self): self._subs = []
    def subscribe(self, fn): self._subs.append(fn); return fn
    def notify(self, *a):
        for fn in list(self._subs):
            try: fn(*a)
            except Exception as e: print("observer failed:", e)

# Builder with a fluent interface and validation
class DocumentBuilder:
    def __init__(self, title): self._d = {"title": title, "sections": [], "meta": {}}
    def author(self, n): self._d["meta"]["author"] = n; return self
    def section(self, h, body=""): self._d["sections"].append((h, body)); return self
    def toc(self, depth=2): self._d["meta"]["toc_depth"] = depth; return self
    def build(self):
        if not self._d["sections"]: raise ValueError("no sections")
        return dict(self._d)

# Singleton via __new__ (and why a module is usually better)
class Settings:
    _inst = None
    def __new__(cls):
        if cls._inst is None:
            cls._inst = super().__new__(cls); cls._inst.output_dir = "/out"
        return cls._inst

doc = DocumentBuilder("Employee Handbook").author("Ali Raza").section("Leave").section("Conduct").toc(3).build()
events = Subject()
events.subscribe(lambda kind, out: print("  mail:", kind, "->", out))
events.subscribe(lambda kind, out: 1 / 0)                 # a broken observer does not stop the others
events.subscribe(lambda kind, out: print("  dashboard:", out))
for kind in ("pdf", "epub"):
    out = Exporter.create(kind, **({"dpi": 150} if kind == "pdf" else {})).export(doc)
    events.notify(kind, out)
try: Exporter.create("mobi")
except ValueError as e: print(e)
print("quotes:", Quote(250_000).total(), Quote(250_000, reissue_rate).total())
print("singleton:", Settings() is Settings(), Settings().output_dir)
try: DocumentBuilder("Empty").build()
except ValueError as e: print("builder validation:", e)
```

### Quiz

1. Which pattern replaces an `if fmt == "pdf" ... elif` chain with interchangeable objects chosen at runtime?
- [ ] Singleton
- [x] Strategy
- [ ] Builder
> Strategy composes the algorithm; Factory chooses which object to construct.

2. In Python, the most idiomatic "singleton" for shared configuration is usually…
- [ ] a metaclass
- [x] a module with module-level state
- [ ] a class with `__new__` override
> Modules are imported once; `__new__` singletons hide global state in a class.

3. Observer's main benefit is that the subject…
- [x] does not know who reacts to its events
- [ ] runs faster
- [ ] guarantees delivery order across threads
> Loose coupling: subscribers are added without changing the subject.

4. A fluent `DocumentBuilder` returns `self` from each method so that…
- [ ] it is thread-safe
- [x] calls can be chained before `build()` validates and produces the object
- [ ] it can be pickled
> Method chaining is a hallmark of Builder in Python and JavaScript.

### Exercises

1. **Adapter** — A legacy `OldPrinter` has `print_text(s)`. Write an adapter so it satisfies a `Printer` protocol with `print(doc)`.
<details><summary>Solution</summary>

```python
class OldPrinter:
    def print_text(self, s): print("legacy:", s)
class PrinterAdapter:
    def __init__(self, old): self.old = old
    def print(self, doc): self.old.print_text(str(doc))
def run(p): p.print("SOP v2")
run(PrinterAdapter(OldPrinter()))
```

</details>

2. **Command with undo** — Implement `RenameCommand(doc, new_title)` with `execute()` and `undo()`, and a history that can undo the last command.
<details><summary>Solution</summary>

```python
class RenameCommand:
    def __init__(self, doc, new): self.doc, self.new, self.old = doc, new, doc["title"]
    def execute(self): self.doc["title"] = self.new
    def undo(self): self.doc["title"] = self.old
class History:
    def __init__(self): self.stack = []
    def run(self, cmd): cmd.execute(); self.stack.append(cmd)
    def undo(self): self.stack.pop().undo()
d = {"title": "Draft"}; h = History(); h.run(RenameCommand(d, "Final")); print(d); h.undo(); print(d)
```

</details>

3. **Thread-safe singleton** — Make a `__new__`-based singleton safe under concurrent first access.
<details><summary>Solution</summary>

```python
import threading
class Pool:
    _inst = None
    _lock = threading.Lock()
    def __new__(cls):
        if cls._inst is None:
            with cls._lock:
                if cls._inst is None:            # double-checked locking
                    cls._inst = super().__new__(cls)
        return cls._inst
print(Pool() is Pool())
```

</details>

### Interview Questions

**Q: Describe the Strategy pattern and how it differs from a Factory.**
Strategy encapsulates a family of interchangeable algorithms behind one interface so the client can be configured with any of them at runtime; a `Quote` takes a `PricingStrategy` and calls `premium()` without knowing whether it is standard, reissue or simultaneous-issue pricing. Factory is about *creation*: it hides which concrete class is instantiated, returning something typed by the base interface, such as `make_exporter("pdf")`. They often appear together, with a factory choosing the strategy from configuration, but Strategy answers "how do I vary behaviour" and Factory answers "how do I vary construction". In Python a strategy is frequently a plain function and a factory a dictionary of classes, and I say that in interviews because it shows the pattern is about the idea, not the class ceremony.

**Q: Why is Singleton considered an anti-pattern by many, and what do you use instead?**
Singleton makes a class responsible for enforcing its own single instance, which turns it into global mutable state: any code can reach it, dependencies become invisible, tests share state across cases, and swapping a fake requires patching. It also violates SRP by mixing lifecycle management with the class's real job. The alternative is to create one instance in the composition root and inject it wherever needed, which keeps the "one instance" property as a wiring decision rather than a class constraint and makes testing trivial. When a genuinely process-wide resource exists, such as a logging configuration, a module with module-level state is the Python-native form and `functools.lru_cache` on a factory gives lazy single creation without a special class.

**Q: How would you implement Observer robustly in production?**
Beyond a list of callables and a `notify` loop, production code needs unsubscribe (return a handle or the function), error isolation so one failing subscriber is logged and the rest still run, and a decision about synchronous versus queued delivery; long-running subscribers should be dispatched to a task queue so the subject does not stall. Iterate over a copy of the subscriber list because observers often unsubscribe during notification, and consider `weakref.WeakMethod` so subscribers do not keep objects alive. Typed events (dataclasses per event kind) prevent argument drift, and in an async application the subject awaits coroutine subscribers with `asyncio.gather(return_exceptions=True)`. Django signals and `blinker` implement most of this; I reuse them unless the dependency is unwelcome.

## UML class diagrams & modelling

**UML** (Unified Modeling Language) class diagrams are the standard way to draw an object-oriented design: which classes exist, what they contain, and how they relate. You will meet them in software engineering coursework, design documents and system-design interviews, where you may be asked to sketch a model on a whiteboard. This chapter teaches the notation, the relationships that matter, and how to go from a requirement to a model and then to code.

### The class box

A class is a rectangle with three compartments: name, attributes, operations.

```text
+----------------------------------+
|           Document               |
+----------------------------------+
| - title: str                     |
| - pages: int                     |
| + status: DocumentStatus         |
| # created_at: datetime           |
+----------------------------------+
| + render(fmt: str): bytes        |
| + approve(): None                |
| + from_json(text: str): Document |   (underlined = static / class-level)
+----------------------------------+
```

Visibility markers: `+` public, `-` private, `#` protected, `~` package. Abstract classes and methods are written in *italics* (or with `{abstract}`), interfaces with `<<interface>>` above the name, and static members underlined. Attribute syntax is `name: type = default`; operation syntax is `name(params): return type`.

### Relationships

| Relationship | Meaning | Arrow | Code |
|---|---|---|---|
| Association | A knows about B | plain line, optional arrowhead | `self.b = b` |
| Aggregation | A has B, B can exist alone | hollow diamond at A | list of shared parts |
| Composition | A owns B, B dies with A | filled diamond at A | parts created in `__init__` |
| Inheritance (generalisation) | B is-a A | hollow triangle at A | `class B(A)` |
| Realisation | B implements interface A | dashed line, hollow triangle | ABC / Protocol |
| Dependency | A uses B temporarily | dashed arrow | parameter or local |

```text
 Document  <|--  Handbook            (inheritance: Handbook is-a Document)
 Document  *--   Section             (composition: sections die with the document)
 Report    o--   Chart               (aggregation: charts can be reused elsewhere)
 Report    -->   Exporter            (association: a report has an exporter)
 Report  ..>     PdfLibrary          (dependency: used inside render())
 PdfExporter ..|> <<interface>> Exporter   (realisation)
```

Aggregation versus composition is the most-asked distinction: a `Section` cannot exist outside its `Document` (composition, filled diamond), while a `Chart` may appear in several reports (aggregation, hollow diamond). In code the difference shows in who creates and deletes the part.

### Multiplicity

Numbers at line ends say how many: `1`, `0..1`, `*` or `0..*`, `1..*`, `3..5`.

```text
 Document 1 ---- * Section        one document has many sections; each section belongs to one document
 Author   1..* ---- * Document     documents have at least one author; authors write many documents
 Order    1 ---- 0..1 Invoice      an order has at most one invoice
```

Multiplicity drives the data structures: `1 -- *` is a list on the one side and a back-reference on the many side; `* -- *` needs an association class or a join table in a database.

### From requirement to model

Take a client brief: *"A title-insurance production system tracks files. Each file belongs to one state and one client, passes through examination steps done by agents, and produces exactly one policy when closed. Agents belong to a team led by one supervisor. Weekly reports summarise files per state."*

1. **Nouns** become candidate classes: File, State, Client, ExaminationStep, Agent, Policy, Team, Supervisor, WeeklyReport.
2. **Verbs** become operations or associations: belongs to, passes through, produces, leads, summarises.
3. **Decide kinds**: `State` is probably an enum, not a class; `Supervisor` is an `Agent` with a role (inheritance or a flag); `WeeklyReport` depends on `File` but does not own it.
4. **Multiplicities**: File `*` -- `1` Client; File `1` -- `0..1` Policy; Team `1` -- `1..*` Agent; Team `1` -- `1` Supervisor.
5. **Draw, then challenge**: does `Supervisor(Agent)` pass LSP? Can a file change client? Are examination steps ordered (a list) or a set?

```text
 Client 1 ---- * File * ---- 1 State (enum)
                   |1
                   |---- 0..1 Policy
                   |---- * ExaminationStep * ---- 1 Agent
 Team 1 ---- 1..* Agent
 Team 1 ---- 1 Supervisor      Supervisor --|> Agent
 WeeklyReport ..> File
```

### Other UML diagrams you should recognise

- **Sequence diagram**: objects as vertical lifelines, messages as horizontal arrows in time order; ideal for "what happens when the user clicks Export".
- **Use case diagram**: actors and the goals they achieve; requirements level.
- **State machine diagram**: the lifecycle of one object, such as `Draft -> Under review -> Approved -> Archived`, which maps directly to an enum plus allowed transitions.
- **Activity diagram**: flowchart of a process, useful for SOPs.

### Tools

PlantUML and Mermaid render diagrams from text, which keeps them in version control next to the code:

```text
classDiagram
    Document <|-- Handbook
    Document "1" *-- "*" Section
    Document : -title str
    Document : +render(fmt) bytes
    class Exporter { <<interface>> +export(doc) }
    PdfExporter ..|> Exporter
```

Mermaid renders in GitHub, GitLab, Notion and VS Code; PlantUML has richer notation. Draw.io and Lucidchart are the visual options. In an interview, a whiteboard and consistent arrowheads are enough.

> **Interview note:** When asked to model something, say the multiplicities out loud and justify the diamonds. "Sections are composition because they cannot exist without the document; charts are aggregation because the same chart appears in the quarterly pack" is precisely what the interviewer is listening for.

### Try It Yourself

```python
# Code that mirrors a class diagram, plus a tiny renderer that prints the diagram back from the code.
from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum

class State(Enum):
    WY = "Wyoming"; CO = "Colorado"; TX = "Texas"

@dataclass
class Section:                      # composition: created and owned by Document
    heading: str
    body: str = ""

@dataclass
class Chart:                        # aggregation: shared between reports
    name: str

class Exporter(ABC):                # <<interface>>
    @abstractmethod
    def export(self, doc: Document) -> str: ...

class Document:
    def __init__(self, title: str):
        self._title = title                       # - private
        self.sections: list[Section] = []         # 1 *-- * Section
    def add_section(self, heading, body=""):      # + public
        self.sections.append(Section(heading, body)); return self
    def render(self, exporter: Exporter) -> str:  # ..> dependency on Exporter
        return exporter.export(self)
    @property
    def title(self): return self._title

class Handbook(Document):                         # Handbook --|> Document
    def __init__(self, title, edition: int):
        super().__init__(title); self.edition = edition

class Report(Document):
    def __init__(self, title, state: State):
        super().__init__(title); self.state = state
        self.charts: list[Chart] = []             # o-- aggregation

class TextExporter(Exporter):                     # TextExporter ..|> Exporter
    def export(self, doc):
        return f"{doc.title}: " + ", ".join(s.heading for s in doc.sections)

def class_diagram(*classes):
    """Print a Mermaid classDiagram for the given classes from their live structure."""
    lines = ["classDiagram"]
    for cls in classes:
        for base in cls.__bases__:
            if base is not object and base is not ABC:
                arrow = "..|>" if base is Exporter else "--|>"
                lines.append(f"    {cls.__name__} {arrow} {base.__name__}")
        if getattr(cls, "__abstractmethods__", None):
            lines.append(f"    class {cls.__name__} {{ <<interface>> }}")
        for name, fn in vars(cls).items():
            if callable(fn) and not name.startswith("__"):
                vis = "-" if name.startswith("_") else "+"
                lines.append(f"    {cls.__name__} : {vis}{name}()")
    return "\n".join(lines)

shared_chart = Chart("Files per state")
wy = Report("Weekly Production WY", State.WY).add_section("Summary").add_section("Escalations")
wy.charts.append(shared_chart)
co = Report("Weekly Production CO", State.CO); co.charts.append(shared_chart)   # aggregation: same chart, two reports
hb = Handbook("Employee Handbook", edition=3).add_section("Leave").add_section("Conduct")
print(wy.render(TextExporter())); print(hb.render(TextExporter()))
print("chart shared:", wy.charts[0] is co.charts[0], "| sections owned:", wy.sections is not co.sections)
print(class_diagram(Document, Handbook, Report, Exporter, TextExporter))
```

### Quiz

1. A filled diamond on an association line means…
- [ ] inheritance
- [x] composition: the part cannot outlive the whole
- [ ] a dependency
> A hollow diamond is aggregation, where parts are shared or independent.

2. A dashed line with a hollow triangle pointing at `<<interface>> Exporter` means…
- [x] realisation: the class implements the interface
- [ ] the class depends on Exporter temporarily
- [ ] the class is abstract
> Solid line with hollow triangle is inheritance; dashed is realisation.

3. `Team 1 ---- 1..* Agent` states that…
- [ ] an agent can be in many teams
- [x] every team has at least one agent, and each agent belongs to exactly one team
- [ ] teams are optional
> Read each end from the perspective of the opposite class.

4. In a class box, `- title: str` denotes…
- [ ] a static attribute
- [x] a private attribute named title of type str
- [ ] a method
> `+` is public, `#` protected, `~` package; underlining marks static.

### Exercises

1. **Model a library** — Draw (in Mermaid text) Book, Copy, Member and Loan with multiplicities: a book has many copies, a loan links one copy to one member, a member has many loans.
<details><summary>Solution</summary>

```text
classDiagram
    Book "1" *-- "1..*" Copy
    Member "1" --> "*" Loan
    Copy "1" --> "*" Loan
    Loan : +borrowed_on date
    Loan : +due_on date
    Loan : +return_copy()
```

</details>

2. **Aggregation or composition?** — Decide for: Order/OrderLine, Playlist/Song, House/Room, Course/Student. Justify each in a comment.
<details><summary>Solution</summary>

```text
Order *-- OrderLine      composition: a line has no meaning outside its order and is deleted with it
Playlist o-- Song        aggregation: songs exist independently and appear in many playlists
House *-- Room           composition: rooms are part of the house's structure
Course --- Student       plain association (many-to-many): neither owns the other; enrolment is an association class
```

</details>

3. **State machine to code** — Turn `Draft -> Review -> Approved -> Archived` (with Review -> Draft on rejection) into an enum with an allowed-transitions table and a `transition()` function that raises on illegal moves.
<details><summary>Solution</summary>

```python
from enum import Enum, auto
class Status(Enum):
    DRAFT = auto(); REVIEW = auto(); APPROVED = auto(); ARCHIVED = auto()
ALLOWED = {Status.DRAFT: {Status.REVIEW}, Status.REVIEW: {Status.APPROVED, Status.DRAFT},
           Status.APPROVED: {Status.ARCHIVED}, Status.ARCHIVED: set()}
def transition(current, new):
    if new not in ALLOWED[current]: raise ValueError(f"{current.name} -> {new.name} not allowed")
    return new
s = transition(Status.DRAFT, Status.REVIEW); s = transition(s, Status.DRAFT); print(s)
```

</details>

### Interview Questions

**Q: Explain the difference between association, aggregation and composition with examples.**
All three are "has-a" relationships that differ in ownership and lifetime. Association is the weakest: a `Report` knows its `Exporter`, either may exist without the other, drawn as a plain line. Aggregation is a whole-part relationship where the parts are shared or independent: a `Chart` appears in several reports and survives when one is deleted, drawn with a hollow diamond. Composition is exclusive ownership with shared lifetime: a `Section` is created by and destroyed with its `Document`, drawn with a filled diamond. In code, composition usually means the whole constructs its parts in `__init__` and never hands out references it expects others to keep, whereas aggregation means parts are passed in from outside. Interviewers accept that the boundary is a modelling judgement as long as you justify it.

**Q: How do you approach modelling a system from a written requirement?**
I underline nouns as candidate classes and verbs as operations or associations, then prune: nouns that are just values become attributes or enums, nouns that are roles become inheritance or a role attribute, and duplicates merge. Next I assign multiplicities on every association and ask the lifetime question to pick aggregation versus composition. Then I look for behaviour that belongs together and for objects whose state has a lifecycle, which suggests a state diagram, and I draw a sequence diagram for the one or two most important flows to check the classes can actually collaborate. Finally I test the model against the principles: does every subclass pass LSP, does any class have too many reasons to change, and can the design be extended for the next likely requirement without editing the core. I keep the diagram as Mermaid text in the repository so it changes with the code.

**Q: Are UML diagrams still relevant when teams use agile methods?**
The heavyweight "model everything up front" use of UML is gone, but the notation is still the most compact way to communicate a design, and class and sequence diagrams appear in most design reviews, architecture decision records and system-design interviews. The modern practice is lightweight: a few diagrams for the parts that are hard to explain in prose, generated or written as text (Mermaid, PlantUML) so they are versioned and reviewable, and thrown away or updated as the code changes. For document-automation projects I draw the pipeline's class diagram and one sequence diagram per output format; they cost half an hour and prevent the "where does the TOC get built?" question from being asked in every onboarding.

## Anti-patterns & OOP interview questions

Knowing what good design looks like is half the skill; recognising bad design quickly is the other half, and interviews test both. This chapter catalogues the OOP **anti-patterns** you will meet in real codebases (and in "what is wrong with this code?" questions), then finishes with the interview questions that recur across junior, mid and senior loops with the shape of a strong answer.

### Structural anti-patterns

| Anti-pattern | Symptom | Fix |
|---|---|---|
| God object | One class knows and does everything; thousands of lines; every change touches it | Split by responsibility (SRP), extract collaborators |
| Anemic domain model | Classes are bags of getters and setters; all logic lives in "service" or "manager" classes | Move behaviour next to the data it operates on |
| Feature envy | A method uses another object's data more than its own | Move the method to that object |
| Inappropriate intimacy | Classes reach into each other's private fields | Expose intent-revealing methods; encapsulate |
| Deep inheritance / yo-yo problem | Understanding one method requires scrolling up and down six levels of hierarchy | Flatten, favour composition |
| Refused bequest | Subclass overrides inherited methods to raise or do nothing | Remodel; the is-a claim is false (LSP) |
| Circular dependency | A imports B imports A | Introduce an interface or move the shared piece down |
| Primitive obsession | Strings and dicts everywhere for money, dates, IDs, statuses | Small value objects, enums, dataclasses |
| Boolean parameter | `export(doc, True, False)` | Enums or separate methods |
| Speculative generality | Abstract classes with one subclass, hooks nobody uses | Delete until needed (YAGNI) |

### Behavioural anti-patterns

- **Type switching**: `if isinstance(x, Pdf): ... elif isinstance(x, Epub): ...` scattered through the code; that is polymorphism done by hand. Put the varying behaviour in the classes or a registry.
- **Getter/setter for everything**: Python's properties exist so you do not write Java-style accessors; expose attributes and add a property only when validation or computation is needed.
- **Singleton everywhere**: hidden global state; inject instead.
- **Mutable shared defaults**: class-level lists and `def f(x=[])`.
- **Constructor that does work**: `__init__` opening files or network connections makes the class impossible to construct in tests; take the resource as a parameter or add a factory.
- **Exceptions as control flow across layers**: raising a `DatabaseError` up to the UI; translate at boundaries.
- **Leaky abstraction**: an `Exporter` interface whose methods take `pdf_options`.

### A small "what is wrong here?" drill

```python
class Manager:
    def __init__(self):
        self.db = sqlite3.connect("prod.db")           # work in constructor, hard-wired dependency
        self.cache = []                                # fine
    def process(self, doc, is_pdf, is_signed):         # boolean parameters
        if is_pdf:                                     # type switching
            data = doc.title.encode() + b"%PDF"
        else:
            data = doc.title.encode()
        if is_signed: data += b"[signed]"
        self.db.execute("INSERT ...", (doc.title, data))
        self.send_email(doc.owner.email, "done")       # feature envy: reaching through doc.owner
        return data
```

Strong answers list: inject the connection (DIP, testability), replace booleans with an `Exporter` strategy and a `Signer` step (OCP, composition), give `Document` a `notify_owner()` or pass an `Owner` (encapsulation), and split persistence from processing (SRP).

### Interview questions by level

**Junior / graduate**

- What are the four pillars? One sentence each with an example: encapsulation (`_balance` with `deposit()`), abstraction (`export()` hides the library), inheritance (`Handbook(Document)`), polymorphism (`for x in items: x.render()`).
- Class vs object; `__init__` vs constructor; `self`.
- Method overriding vs overloading (Python has no overloading by signature; use defaults or `functools.singledispatch`).
- What is `super()` and why is it not just "call the parent"? (It follows the MRO.)

**Mid-level**

- Composition vs inheritance with a story.
- Abstract class vs interface vs Protocol.
- Explain the MRO for a diamond hierarchy; what `super()` calls in each class.
- `@classmethod` vs `@staticmethod`; alternative constructors.
- Dunder methods you have implemented and why (`__eq__`/`__hash__` pitfalls).
- Immutability: dataclass `frozen=True`, `__slots__`, `NamedTuple`.
- Two or three design patterns with a real use.

**Senior**

- SOLID with refactors from your own work.
- When did a pattern make things worse?
- Modelling a system live (see the UML chapter): nouns, verbs, multiplicities, LSP check.
- OOP vs functional: when do you avoid classes? (Pure transformations, pipelines of functions, data as dataclasses; classes when state and behaviour genuinely belong together or when polymorphism is needed.)
- Testing OO code: seams, fakes over mocks, avoiding testing private methods.
- Language comparison: Python's MRO and duck typing vs JavaScript's prototypes vs Java's single inheritance and interfaces.

### The answers interviewers remember

1. **Lead with the concept, then a concrete example from your work.** "Encapsulation: in the rate calculator the `_matrix` is private and `premium(coverage)` is the only way in, so a client's bad edit to the sheet could never corrupt a quote."
2. **Name trade-offs unprompted.** Every pattern and principle has a cost; saying it shows judgement.
3. **Know your language's idioms.** In Python, mention protocols, dataclasses, `__init_subclass__`, `functools.singledispatch`; in JS, `#private`, prototypes, `bind`.
4. **Draw when asked to design.** A class box and three arrows beat five minutes of talking.
5. **Admit limits precisely.** "I have used Observer through Django signals but not written a thread-safe one" is a better answer than bluffing.

### Rapid-fire checks

```python
class A:
    def hi(self): return "A"
class B(A):
    def hi(self): return "B" + super().hi()
class C(A):
    def hi(self): return "C" + super().hi()
class D(B, C): pass
print(D().hi())                      # "BCA": MRO is D, B, C, A; super() in B resolves to C
print([k.__name__ for k in D.__mro__])
```

Be ready to explain the output above, why `list.__init__` versus `__new__` matters for immutables, why `__eq__` disables hashing, and what `a is b` versus `a == b` means.

> **Warning:** The most common way strong candidates lose OOP interviews is over-engineering the live design: five interfaces, two factories and a singleton for a three-class problem. Start with the simplest model that satisfies the requirements, then say what you would add when the next requirement arrives.

### Try It Yourself

```python
# Before/after: an anti-pattern-laden class refactored with composition, injection and small value objects.
from dataclasses import dataclass
from enum import Enum
from typing import Protocol

# ---------- BEFORE ----------
class Manager:
    def __init__(self):
        self.store = {}                              # pretend database created inside (hard-wired)
    def process(self, title, owner_email, is_pdf, is_signed):      # booleans, primitives, does everything
        data = title.encode() + (b"%PDF" if is_pdf else b"")
        if is_signed: data += b"[signed]"
        self.store[title] = data
        print(f"(before) emailing {owner_email}: done")
        return data

print(Manager().process("Handbook", "ali@example.com", True, True))

# ---------- AFTER ----------
class Format(Enum):
    PDF = "pdf"; TEXT = "text"

@dataclass(frozen=True)
class Owner:
    name: str
    email: str

@dataclass(frozen=True)
class Document:
    title: str
    owner: Owner

class Renderer(Protocol):
    def render(self, doc: Document) -> bytes: ...

class PdfRenderer:
    def render(self, doc): return doc.title.encode() + b"%PDF"
class TextRenderer:
    def render(self, doc): return doc.title.encode()

class Signer:                                      # optional step, composed not flagged
    def apply(self, data: bytes) -> bytes: return data + b"[signed]"

class Repository(Protocol):
    def save(self, key: str, data: bytes) -> None: ...

class MemoryRepository:
    def __init__(self): self.items = {}
    def save(self, key, data): self.items[key] = data

class Notifier(Protocol):
    def notify(self, owner: Owner, message: str) -> None: ...

class PrintNotifier:
    def notify(self, owner, message): print(f"(after) emailing {owner.email}: {message}")

class Processor:                                   # one job: orchestrate injected collaborators
    RENDERERS = {Format.PDF: PdfRenderer, Format.TEXT: TextRenderer}
    def __init__(self, repo: Repository, notifier: Notifier, steps=()):
        self.repo, self.notifier, self.steps = repo, notifier, list(steps)
    def process(self, doc: Document, fmt: Format) -> bytes:
        data = self.RENDERERS[fmt]().render(doc)
        for step in self.steps:
            data = step.apply(data)
        self.repo.save(doc.title, data)
        self.notifier.notify(doc.owner, "done")
        return data

repo = MemoryRepository()
proc = Processor(repo, PrintNotifier(), steps=[Signer()])
doc = Document("Handbook", Owner("Ali Raza", "ali@example.com"))
print(proc.process(doc, Format.PDF))
print("stored keys:", list(repo.items))

# Testability: swap in fakes without patching
class SilentNotifier:
    def __init__(self): self.calls = []
    def notify(self, owner, message): self.calls.append((owner.email, message))
fake = SilentNotifier()
Processor(MemoryRepository(), fake).process(doc, Format.TEXT)
print("fake notifier saw:", fake.calls)

# Rapid-fire: MRO and cooperative super()
class A:
    def hi(self): return "A"
class B(A):
    def hi(self): return "B" + super().hi()
class C(A):
    def hi(self): return "C" + super().hi()
class D(B, C): pass
print(D().hi(), [k.__name__ for k in D.__mro__])
```

### Quiz

1. A class with 3,000 lines that handles parsing, pricing, persistence and email is called a…
- [ ] Facade
- [x] God object
- [ ] Builder
> The fix is splitting along reasons to change.

2. A model whose classes hold only data while all logic sits in service classes is…
- [x] an anemic domain model
- [ ] the Strategy pattern
- [ ] dependency inversion
> Behaviour should live with the data it operates on.

3. `if isinstance(x, Pdf): ... elif isinstance(x, Epub): ...` repeated across modules suggests…
- [ ] good defensive coding
- [x] missing polymorphism: the varying behaviour belongs in the classes or a registry
- [ ] a Singleton
> Type switching is polymorphism done by hand.

4. For `class D(B, C)` where B and C both subclass A and each calls `super().hi()`, `D().hi()` calls in order…
- [x] D, B, C, A
- [ ] D, B, A, C
- [ ] D, C, B, A
> The C3 MRO places C before A so cooperative `super()` reaches every class once.

5. The best response to a live design question is usually to…
- [ ] introduce interfaces for every class immediately
- [x] start with the simplest model that meets the requirements and say what you would add next
- [ ] refuse to draw until all requirements are known
> Over-engineering is the most common failure mode for strong candidates.

### Exercises

1. **Spot the smells** — List at least four anti-patterns in: `class App: def __init__(self): self.conn = psycopg2.connect(...); def run(self, path, verbose, dry): ... 400 lines ...`.
<details><summary>Solution</summary>

```text
1. Work and a hard-wired dependency in __init__ (untestable; violates DIP).
2. Boolean parameters `verbose`, `dry` (use an Options dataclass or enums).
3. God object: a 400-line run() doing everything (violates SRP).
4. Primitive obsession: `path` as a string rather than pathlib.Path / a value object.
5. Likely hidden global state if App is used as a singleton.
```

</details>

2. **Replace booleans** — Refactor `export(doc, compress=True, encrypt=False)` into a design that scales to more options without changing the signature.
<details><summary>Solution</summary>

```python
from dataclasses import dataclass, field
@dataclass(frozen=True)
class ExportOptions:
    compress: bool = True
    encrypt: bool = False
    password: str | None = None
def export(doc, options: ExportOptions = ExportOptions()):
    steps = []
    if options.compress: steps.append("compress")
    if options.encrypt: steps.append("encrypt")
    return f"{doc}: {steps}"
print(export("Handbook", ExportOptions(encrypt=True, password="x")))
```

</details>

3. **Value object** — Replace `amount: float, currency: str` pairs with a frozen `Money` dataclass that validates the currency code and forbids mixing currencies in `__add__`.
<details><summary>Solution</summary>

```python
from dataclasses import dataclass
@dataclass(frozen=True)
class Money:
    amount: float
    currency: str
    def __post_init__(self):
        if len(self.currency) != 3 or not self.currency.isupper(): raise ValueError(self.currency)
    def __add__(self, other):
        if self.currency != other.currency: raise ValueError("currency mismatch")
        return Money(self.amount + other.amount, self.currency)
print(Money(575, "USD") + Money(543, "USD"))
```

</details>

### Interview Questions

**Q: What is an anemic domain model and why is it considered an anti-pattern?**
An anemic model has domain classes that are only data holders, with every rule, validation and calculation living in separate service or manager classes that reach into those objects. It looks object-oriented but is procedural code with extra ceremony: invariants are not protected because any service can set any field, the same rule is duplicated across services, and the domain vocabulary is lost. The remedy is to move behaviour to the data it belongs with, so `Quote.apply_reissue_discount()` and `Document.approve()` enforce their own rules and services only orchestrate. The nuance is that thin services for cross-object workflows and persistence are still right; the smell is when *all* logic is outside the objects.

**Q: How do you refactor a God object safely?**
First get characterisation tests around the current behaviour, because the class is usually under-tested and every change risks regression. Then identify clusters of methods and fields that change together, using the reasons-to-change lens, and extract one cluster at a time into a collaborator that the God object delegates to, keeping its public interface stable so callers are untouched. Introduce interfaces for the extracted parts only where a test seam or a second implementation is needed. Each extraction is a separate small pull request with the tests green, and dependencies that were constructed inside move to the constructor so the pieces can be tested alone. The final step is to move callers directly to the collaborators and shrink the original to a facade or delete it.

**Q: When would you not use OOP?**
When the problem is a pipeline of transformations over data with little state, such as parsing a CSV, validating rows and writing a report, plain functions and dataclasses are clearer, easier to test and compose better than classes. When there is exactly one implementation and no lifecycle, a module with functions beats a class with one method. Concurrency-heavy code often favours immutable data and pure functions to avoid shared-state bugs. I reach for classes when data and the operations that maintain its invariants belong together (a `Money` value, a `Document` with a status lifecycle), when polymorphism across several implementations is genuinely needed, or when a framework's contract requires them. Most real codebases mix both: functional cores with object-oriented boundaries.

**Q: Tell me about a time a design pattern made things worse.**
A strong answer names the pattern, the context and what you learned. Example: in a document pipeline with two export formats I introduced an Abstract Factory producing matched renderers, stylesheets and post-processors, anticipating many formats. Only a third format ever arrived, and every change required editing three factory classes plus the interface, so simple tweaks became multi-file pull requests and new contributors could not find where output was actually produced. I replaced it with a registry of small exporter classes and plain keyword options, cutting the export package by half and making the third format a single file. The lesson I give interviewers is that patterns solve specific pressures; applied before the pressure exists they are cost without benefit.
