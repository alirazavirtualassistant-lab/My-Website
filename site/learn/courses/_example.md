---
id: _example
title: Example Course
icon: 📘
track: Programming
color: #3776AB
runner: python
packages: 
tagline: A tiny reference course that shows every construct the parser supports.
description: Use this file as a template. It has one chapter per level so the validator passes.
---

# LEVEL: Beginner

## Your first program

Every program starts somewhere. In Python you print text to the screen with the `print()` function. A **function** is a named block of code you can call. Here is the smallest useful program you can write, and it is genuinely all you need to check that Python is installed and working on any machine you sit down at.

```python
print("Hello, document engineer!")
```

The text between the quotes is a **string**. Python sends it to standard output, which is the terminal window you ran the program from. Change the text, run it again, and you have written your second program.

### Variables hold values

A variable is a name that points at a value. You create one with `=`:

```python
pages = 135
title = "Policy Manual"
print(title, "has", pages, "pages")
```

| Name | Type | Example |
|---|---|---|
| `pages` | int | `135` |
| `title` | str | `"Policy Manual"` |

> **Tip:** Names are case sensitive, so `Pages` and `pages` are different variables.

- Strings use quotes.
- Numbers do not.
  - Whole numbers are `int`.
  - Decimals are `float`.

### Try It Yourself

```python
pages = 135
title = "Policy Manual"
print(title, "has", pages, "pages")
```

### Quiz

1. What does `print("a", "b")` output?
- [x] a b
- [ ] ab
- [ ] "a" "b"
> `print` separates its arguments with a space by default.

2. Which line creates a variable?
- [ ] `print(x)`
- [x] `x = 5`
- [ ] `x == 5`
> A single `=` assigns. A double `==` compares.

### Exercises

1. **Greeting** — Store your name in a variable and print `Hello, <name>!`.
<details><summary>Solution</summary>

```python
name = "Ali"
print("Hello, " + name + "!")
```

</details>

### Interview Questions

**Q: Is Python compiled or interpreted?**
Both, in practice. CPython compiles source to bytecode (`.pyc` files) and then interprets that bytecode on a virtual machine. Interviewers want to hear that you know the bytecode step exists and that this is why Python is slower than C for tight loops but fast to iterate on.

# LEVEL: Intermediate

## A second chapter

This chapter exists so that the example has every level. It shows a JavaScript block being highlighted as well, because the renderer supports many languages even if the course runner is Python. Interviewers frequently ask you to switch languages mid-conversation, so being able to read both fluently is a real skill. Notice how comments, strings, numbers and keywords each get their own colour in the rendered page, which makes long examples much easier to scan while you study. The rest of this paragraph pads the word count so the validator accepts it as a genuine chapter rather than a stub, because in real courses every chapter must teach something substantial. Real chapters should be several hundred words long and contain multiple examples with explanations after each one.

```js
const pages = [12, 40, 135];
console.log(pages.reduce((a, b) => a + b, 0)); // 187
```

### Quiz

1. What does `reduce` return here?
- [x] 187
- [ ] [12, 40, 135]
- [ ] undefined
> The callback adds each element to the accumulator starting at 0.

### Interview Questions

**Q: What is the difference between `let` and `const`?**
Both are block scoped. `const` prevents re-assignment of the binding, not mutation of the value, so a `const` array can still be pushed to. Prefer `const` by default and use `let` only when you really re-assign.

# LEVEL: Advanced

## A third chapter

Advanced chapters go into internals. Here we simply demonstrate a callout and a details block so the example stays short but still valid. The validator requires a minimum number of words in each chapter body so that no one can ship an empty chapter by accident, which is why this paragraph keeps going for a while and explains the reasoning behind the rule rather than just repeating filler. Every chapter should leave the learner able to do something they could not do before, and it should end with a quiz that confirms it, exercises that practise it, and interview questions that show how it comes up in hiring conversations. That is the contract every course file in this folder signs up to, and the tools in the tools folder enforce it.

> **Warning:** Never trust a page count until you have opened the file.

<details><summary>Why?</summary>

Because different PDF readers count differently when there are hidden pages.

</details>

### Quiz

1. Callouts start with which markdown character?
- [x] >
- [ ] #
- [ ] *
> Blockquotes become callouts when they begin with a bold label like **Tip:**.

### Interview Questions

**Q: Why do we validate content files?**
Because a broken file breaks a whole course page for the learner. Automated validation catches missing answers, empty chapters and structural mistakes before the site is deployed, which is exactly the same discipline you apply to production reports.

# LEVEL: Expert

## A fourth chapter

Expert chapters should discuss performance, edge cases and production practice. This one only demonstrates a SQL block and an Excel block to prove that the highlighter handles them, and again fills the body with enough explanatory text to satisfy the validator. When writing real content, think about what a senior interviewer would probe: trade-offs, failure modes, how you measured something, and what you would do differently. Bring concrete numbers from real work, such as the size of a rate matrix or the number of fields in a form, because specificity is what separates a memorised answer from an experienced one. Keep code examples short enough to read in one screen and always explain the output that the learner should expect to see when they run it.

```sql
SELECT state, COUNT(*) AS files
FROM production
GROUP BY state
ORDER BY files DESC;
```

```excel
=SUMIFS(C:C, A:A, "Wyoming", B:B, ">="&DATE(2026,1,1))
```

### Quiz

1. Which clause filters groups?
- [ ] WHERE
- [x] HAVING
- [ ] ORDER BY
> `WHERE` filters rows before grouping; `HAVING` filters after.

### Interview Questions

**Q: When would you use SUMIFS instead of a PivotTable?**
When the report layout is fixed and must not change shape as data changes, or when the result feeds another formula. PivotTables are faster for exploration; SUMIFS is better for locked-down management reports.
