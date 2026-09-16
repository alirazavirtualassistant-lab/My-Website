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

