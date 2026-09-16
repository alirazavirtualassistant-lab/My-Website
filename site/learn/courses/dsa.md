---
id: dsa
title: Data Structures & Algorithms
icon: 🌳
track: Computer Science
color: #2C3E50
runner: python
packages: 
tagline: The problem-solving toolkit every coding interview is built on.
description: Data structures and algorithms in Python, from Big-O to dynamic programming: arrays, strings, hashing, linked lists, stacks, queues, trees, heaps, graphs, sorting, searching, recursion, two pointers, sliding window, BFS/DFS, greedy and DP, with the classic interview problems worked in full.
---

# LEVEL: Beginner

## Why DSA & Big-O notation

A **data structure** is a way of organising data so that a computer can use it efficiently. An **algorithm** is a step-by-step recipe that turns an input into an output. Every program you have ever run is a pile of both, and every coding interview is a test of whether you can pick the right pair for a problem.

Why does it matter? Imagine a title-search team processing 40,000 property records. One way of finding a parcel number checks every record, one after the other. Another way jumps straight to it. On 40 records you cannot tell the difference. On 40 million records the first way takes minutes and the second takes microseconds. Big-O notation is the language we use to describe that gap before we run anything.

### What Big-O measures

Big-O describes **how the running time (or memory) grows as the input grows**. It ignores constants and small terms and keeps only the fastest-growing part. We write the input size as `n`.

```python
def find_parcel(records, parcel_id):
    for r in records:            # runs up to n times
        if r == parcel_id:
            return True
    return False

def first_record(records):
    return records[0]            # runs once, whatever n is
```

`find_parcel` is **O(n)**: doubling the records doubles the worst-case work. `first_record` is **O(1)**: it does the same work whether there are 10 records or 10 million.

### The common classes

| Big-O | Name | Typical example | n = 1,000,000 steps (roughly) |
|---|---|---|---|
| O(1) | constant | dictionary lookup, list index | 1 |
| O(log n) | logarithmic | binary search | 20 |
| O(n) | linear | scanning a list | 1,000,000 |
| O(n log n) | linearithmic | merge sort, `sorted()` | 20,000,000 |
| O(n²) | quadratic | nested loops over the same list | 10¹² |
| O(2ⁿ) | exponential | naive recursive Fibonacci | never finishes |

The table is the reason interviewers care. An O(n²) solution to a 100,000-item problem does ten billion operations. Python manages roughly ten million simple operations a second, so that is about 17 minutes. The O(n log n) version finishes in under a second.

### Spotting the class in code

A single loop over the input is O(n). A loop inside a loop over the same input is O(n²). Halving the problem each step is O(log n). Doing a constant number of steps is O(1).

```python
def has_duplicate_slow(items):          # O(n^2)
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if items[i] == items[j]:
                return True
    return False

def has_duplicate_fast(items):          # O(n)
    seen = set()
    for x in items:
        if x in seen:
            return True
        seen.add(x)
    return False
```

Both functions give the same answer. The second trades a little memory (the `seen` set, O(n) extra space) for a huge time saving. That trade, **time versus space**, is the first design decision in almost every DSA problem.

### Rules for simplifying

1. Drop constants: O(2n) is O(n), O(n/2) is O(n).
2. Drop lower-order terms: O(n² + n) is O(n²).
3. Different inputs get different letters: comparing list `a` with list `b` is O(a × b), not O(n²).
4. Sequential steps add, nested steps multiply.

> **Interview note:** When you finish writing a solution, say its time and space complexity out loud without being asked. "This is O(n) time and O(n) space because of the set" is the single sentence that most reliably separates prepared candidates from unprepared ones.

### Best, average and worst case

`find_parcel` finds the parcel in one step if it is first in the list (best case) and `n` steps if it is last or missing (worst case). Big-O usually means the **worst case** unless you say otherwise. Python's `list.sort()` is O(n log n) worst case but close to O(n) on already-sorted data, and a strong candidate knows to mention that.

### Try It Yourself

```python
import time

def has_duplicate_slow(items):
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if items[i] == items[j]:
                return True
    return False

def has_duplicate_fast(items):
    seen = set()
    for x in items:
        if x in seen:
            return True
        seen.add(x)
    return False

for n in (1000, 2000, 4000):
    data = list(range(n))            # no duplicates, so worst case
    t = time.perf_counter(); has_duplicate_slow(data); slow = time.perf_counter() - t
    t = time.perf_counter(); has_duplicate_fast(data); fast = time.perf_counter() - t
    print(f"n={n:5d}  slow={slow*1000:8.1f} ms  fast={fast*1000:6.2f} ms")
```

### Quiz

1. What is the Big-O of a loop nested inside another loop, both over the same list of n items?
- [ ] O(n)
- [x] O(n²)
- [ ] O(2n)
> The inner loop runs n times for each of the n outer iterations, giving n × n steps.

2. Which simplification is correct?
- [x] O(3n + 10) simplifies to O(n)
- [ ] O(n² + n) simplifies to O(n)
- [ ] O(n log n) simplifies to O(n)
> Constants and lower-order terms are dropped; only the fastest-growing term stays.

3. A dictionary lookup `d[key]` is usually which class?
- [x] O(1)
- [ ] O(log n)
- [ ] O(n)
> Python dicts are hash tables, so the average lookup does not depend on how many keys there are.

4. Doubling the input of an O(log n) algorithm adds roughly how much work?
- [x] One extra step
- [ ] Twice the work
- [ ] Four times the work
> log₂(2n) = log₂(n) + 1, which is why binary search barely notices bigger inputs.

### Exercises

1. **Classify the function** — State the time complexity of a function that, for each of n agents, prints their name and then loops over their m QA scores.
<details><summary>Solution</summary>

```python
# O(n * m): the outer loop runs n times, and for each agent the inner loop runs m times.
# It is NOT O(n^2) because agents and scores are different inputs.
def report(agents):
    for a in agents:               # n
        print(a["name"])           # O(1)
        for s in a["scores"]:      # m
            print(s)
```

</details>

2. **Count the steps** — Write a function `count_steps(n)` that returns how many times a `while` loop runs when it starts at `n` and halves it until it is below 1. Test with 1000 and 1,000,000. What class is it?
<details><summary>Solution</summary>

```python
def count_steps(n):
    steps = 0
    while n >= 1:
        n = n / 2
        steps += 1
    return steps

print(count_steps(1000))       # 10
print(count_steps(1_000_000))  # 20  -> O(log n)
```

</details>

### Interview Questions

**Q: What is Big-O notation and why do we ignore constants?**
Big-O is an upper bound on how an algorithm's running time or memory grows with input size. We ignore constants because they depend on the machine, the language and the compiler, while the growth rate does not. An O(n) Python loop and an O(n) C loop differ by a constant factor of maybe 50, but both double when n doubles, and an O(n²) C program will still lose to an O(n) Python program once n is large enough. In practice, though, constants matter for small inputs, which is why Python's `sort` switches to insertion sort for runs shorter than 32 elements.

**Q: Explain the difference between O(n) and O(log n) with a real example.**
Scanning a phone book page by page to find a name is O(n): the work grows with the number of pages. Opening it in the middle, deciding whether the name is before or after, and repeating on the correct half is O(log n): each step halves what is left, so a 1,000-page book takes about 10 steps and a 1,000,000-page book about 20. The catch is that the logarithmic version only works because the phone book is sorted. Sorting first costs O(n log n), so binary search pays off when you search many times, not once.

**Q: Can an O(n²) algorithm ever be the right choice?**
Yes. For small n, say under 50, the simpler quadratic code is often faster in wall-clock terms because it has no setup overhead and better cache behaviour. Insertion sort beats merge sort on tiny arrays, which is why library sorts use it for small partitions. It can also be the right choice when the quadratic algorithm uses O(1) extra memory and the faster one needs O(n) extra space on a memory-constrained device. The honest answer is to state the trade-off and the expected n rather than reflexively reaching for the asymptotically fastest option.

**Q: What is the difference between time complexity and space complexity?**
Time complexity counts operations as n grows; space complexity counts extra memory as n grows, not including the input itself. A function that reverses a list in place is O(n) time and O(1) space. One that builds a reversed copy is O(n) time and O(n) space. Recursive functions also consume stack space, so a naive recursive sum over a list of n elements is O(n) space even though it creates no new list, and in Python it will hit the default recursion limit of 1000 frames.

## Arrays & lists

An **array** is a block of memory holding items of the same size, side by side. Because the items are contiguous, the computer finds item `i` by arithmetic: start address plus `i` times item size. That is why reading `a[i]` is O(1). Python's `list` is a dynamic array: it behaves like an array that can grow, and it is the data structure you will use more than any other.

### Creating and indexing

```python
pages = [12, 40, 135, 767]
print(pages[0])      # 12   first item
print(pages[-1])     # 767  last item
print(pages[1:3])    # [40, 135]  slice from index 1 up to (not including) 3
print(len(pages))    # 4
```

Indexes start at zero. Negative indexes count from the end. A slice `a[start:stop]` copies the items from `start` up to but not including `stop`, so slicing is O(k) where k is the slice length, not O(1).

### Cost of each operation

This table is worth memorising, because every "why is my code slow" question in an interview comes back to it.

| Operation | Code | Time |
|---|---|---|
| Read or write by index | `a[i]`, `a[i] = x` | O(1) |
| Append at end | `a.append(x)` | O(1) amortised |
| Pop from end | `a.pop()` | O(1) |
| Insert at front or middle | `a.insert(0, x)` | O(n) |
| Pop from front | `a.pop(0)` | O(n) |
| Search by value | `x in a`, `a.index(x)` | O(n) |
| Delete by value | `a.remove(x)` | O(n) |
| Slice | `a[i:j]` | O(j − i) |
| Sort | `a.sort()` | O(n log n) |

Insert and delete anywhere except the end are O(n) because every later item has to shift one slot. If you find yourself doing `pop(0)` in a loop, you have accidentally written an O(n²) algorithm, and the fix is `collections.deque`, which we cover under queues.

### Why append is "amortised" O(1)

A dynamic array keeps some spare capacity. When it runs out, it allocates a bigger block (CPython grows by roughly 12.5 percent plus a small constant) and copies everything across, which is O(n) for that one append. Because that happens rarely and each resize buys many cheap appends, the average cost per append works out to O(1). "Amortised" simply means "averaged over a sequence of operations".

```python
import sys
a = []
last = 0
for i in range(20):
    a.append(i)
    size = sys.getsizeof(a)
    if size != last:
        print(f"after {i+1:2d} items: {size} bytes")
        last = size
```

Run that and you will see the byte size jump only at a few points, not on every append.

### Common array patterns

**Building a result list** is the bread and butter of data processing:

```python
scores = [88, 92, 71, 95, 60]
passed = [s for s in scores if s >= 75]      # [88, 92, 95]
scaled = [s / 100 for s in scores]           # floats
```

**Running totals** show up in report generation constantly, and the prefix-sum trick turns repeated range sums from O(n) each into O(1) each:

```python
daily = [120, 95, 143, 110, 88]          # files processed per day
prefix = [0]
for d in daily:
    prefix.append(prefix[-1] + d)        # [0,120,215,358,468,556]

def range_total(i, j):                   # total of days i..j inclusive
    return prefix[j + 1] - prefix[i]

print(range_total(1, 3))                 # 95+143+110 = 348
```

**In-place reversal** with two indexes walking towards each other is O(n) time and O(1) space:

```python
def reverse_in_place(a):
    i, j = 0, len(a) - 1
    while i < j:
        a[i], a[j] = a[j], a[i]
        i += 1
        j -= 1
    return a
```

### Two-dimensional lists

A rate matrix is a list of lists. Row `r`, column `c` is `matrix[r][c]`. Build them with a comprehension, never with `[[0] * cols] * rows`, because the multiplication copies the *reference* to one inner list and every row would be the same object.

```python
rows, cols = 3, 4
good = [[0] * cols for _ in range(rows)]
bad = [[0] * cols] * rows
bad[0][0] = 99
print(bad)    # [[99,0,0,0],[99,0,0,0],[99,0,0,0]]  all rows changed!
print(good)   # independent rows
```

> **Warning:** Modifying a list while iterating over it (for example `a.remove(x)` inside `for x in a`) skips elements. Build a new list with a comprehension or iterate over a copy `for x in a[:]`.

### Try It Yourself

```python
# Prefix sums: answer many range-total questions in O(1) each
daily = [120, 95, 143, 110, 88, 130, 101]   # files processed per day, Mon..Sun

prefix = [0]
for d in daily:
    prefix.append(prefix[-1] + d)

def range_total(i, j):
    """Total files from day i to day j inclusive (0-based)."""
    return prefix[j + 1] - prefix[i]

print("prefix:", prefix)
print("Mon-Wed:", range_total(0, 2))
print("Thu-Sun:", range_total(3, 6))
print("Whole week:", range_total(0, 6), "== sum(daily):", sum(daily))

# Try: find the 3-day window with the highest total using range_total
best = max(range(len(daily) - 2), key=lambda i: range_total(i, i + 2))
print("Best 3-day window starts on day", best, "with", range_total(best, best + 2))
```

### Quiz

1. What is the time complexity of `a.insert(0, x)` on a Python list of n items?
- [ ] O(1)
- [x] O(n)
- [ ] O(log n)
> Every existing element must shift one position to the right to make room at the front.

2. Why is `list.append` described as amortised O(1)?
- [x] Occasional resizes cost O(n) but are rare enough that the average per append is constant
- [ ] It is always exactly one operation
- [ ] Python pre-allocates the whole list at creation
> The list over-allocates, so most appends just write into spare capacity.

3. What does `[[0] * 3] * 2` produce?
- [ ] Two independent rows of three zeros
- [x] Two references to the same row
- [ ] A syntax error
> The outer `*` copies the reference to the inner list, so changing one row changes both.

4. What is the complexity of `x in a` for a list?
- [x] O(n)
- [ ] O(1)
- [ ] O(log n)
> Lists are not hashed or sorted, so membership testing must scan every element.

### Exercises

1. **Rotate a list** — Write `rotate(a, k)` that returns the list rotated right by k positions, so `rotate([1,2,3,4,5], 2)` gives `[4,5,1,2,3]`. Handle k larger than the list length.
<details><summary>Solution</summary>

```python
def rotate(a, k):
    if not a:
        return a
    k %= len(a)
    return a[-k:] + a[:-k] if k else a[:]

print(rotate([1, 2, 3, 4, 5], 2))   # [4, 5, 1, 2, 3]
print(rotate([1, 2, 3, 4, 5], 7))   # [4, 5, 1, 2, 3]
# O(n) time, O(n) space (creates a new list)
```

</details>

2. **Move zeros to the end** — Given a list of integers, move all zeros to the end while keeping the order of the other numbers, in place and in O(n) time.
<details><summary>Solution</summary>

```python
def move_zeros(a):
    write = 0
    for read in range(len(a)):
        if a[read] != 0:
            a[write], a[read] = a[read], a[write]
            write += 1
    return a

print(move_zeros([0, 1, 0, 3, 12]))  # [1, 3, 12, 0, 0]
# O(n) time, O(1) extra space: 'write' marks where the next non-zero goes
```

</details>

3. **Matrix transpose** — Given a rate matrix as a list of lists, return its transpose (rows become columns).
<details><summary>Solution</summary>

```python
def transpose(m):
    return [[m[r][c] for r in range(len(m))] for c in range(len(m[0]))]

rates = [[1.5, 2.0, 2.5], [3.0, 3.5, 4.0]]
print(transpose(rates))  # [[1.5, 3.0], [2.0, 3.5], [2.5, 4.0]]
# Or simply: list(map(list, zip(*rates)))
```

</details>

### Interview Questions

**Q: How is a Python list implemented and what does that mean for performance?**
A CPython list is a dynamic array of pointers to objects, stored contiguously. Indexing is O(1) because the address is computed arithmetically. Appending is amortised O(1) because the list over-allocates capacity and only occasionally reallocates and copies. Inserting or deleting anywhere else is O(n) because later pointers must shift. Because it stores pointers rather than raw values, a list of a million small integers uses about 8 MB for the pointers plus the objects themselves, which is why NumPy arrays, which store raw values, are far more compact for numeric work.

**Q: What is the difference between an array and a linked list?**
An array stores elements contiguously, so random access is O(1) but insertion in the middle is O(n). A linked list stores each element in its own node with a pointer to the next, so insertion or deletion at a known node is O(1) but reaching the k-th element is O(k). Arrays also win on cache locality: walking a contiguous block is much faster in practice than chasing pointers scattered across memory. In Python you almost always want a list, and reach for `collections.deque` when you need cheap operations at both ends.

**Q: What is a prefix sum and when would you use it?**
A prefix-sum array stores, at index i, the total of all elements before i. Building it is O(n), and afterwards the sum of any range [i, j] is `prefix[j+1] - prefix[i]` in O(1). It is the right tool when you have one array and many range-sum queries, such as "how many files did the team process between any two dates" on a daily production report. If the array changes often, a Fenwick tree or segment tree gives O(log n) updates and queries instead.

**Q: Why should you avoid `del a[0]` or `a.pop(0)` in a loop?**
Each removal from the front shifts every remaining element left, which is O(n), so removing all n items that way is O(n²). For a 100,000-item queue that is five billion pointer moves. `collections.deque` is a doubly linked list of fixed-size blocks that supports `popleft()` in O(1), which is exactly what a queue needs. If you only ever need to process items in order, the simplest fix is to iterate with an index and never remove at all.

## Strings & string problems

A **string** is an immutable sequence of characters. "Immutable" means you cannot change a character in place: every operation that seems to modify a string actually creates a new one. That single fact drives the performance of every string algorithm in Python.

### The basics you must know cold

```python
s = "Policy Manual v3"
print(len(s))              # 16
print(s[0], s[-1])         # P 3
print(s[7:13])             # Manual
print(s.lower())           # policy manual v3
print(s.split())           # ['Policy', 'Manual', 'v3']
print("-".join(["a","b"])) # a-b
print(s.find("Manual"))    # 7   (-1 if missing)
print(s.replace(" ", "_")) # Policy_Manual_v3
print(s.startswith("Pol")) # True
```

Indexing and slicing work exactly like lists. `find` and `in` are O(n × m) in the worst case for a pattern of length m, although CPython uses a fast two-way search that is close to O(n) in practice.

### Building strings efficiently

Because strings are immutable, `s += ch` inside a loop creates a brand-new string each time and copies the old contents. That is O(n²) over n additions. The idiom is to collect pieces in a list and `join` once.

```python
# Slow: O(n^2)
out = ""
for i in range(10000):
    out += str(i)

# Fast: O(n)
parts = []
for i in range(10000):
    parts.append(str(i))
out = "".join(parts)
```

CPython has an optimisation that sometimes makes `+=` on a string with a single reference run in place, but you cannot rely on it, and interviewers will expect the `join` idiom.

### Counting characters

Most string questions start with counting. `collections.Counter` does it in one line and is O(n).

```python
from collections import Counter
c = Counter("mississippi")
print(c)                      # Counter({'i': 4, 's': 4, 'p': 2, 'm': 1})
print(c.most_common(2))       # [('i', 4), ('s', 4)]
```

### Classic problem 1: reverse a string

```python
def reverse(s):
    return s[::-1]                    # O(n) time, O(n) space
```

If the interviewer says "without slicing", convert to a list, use the two-pointer swap from the arrays chapter, and join.

### Classic problem 2: is it a palindrome?

A palindrome reads the same forwards and backwards. The interview version ignores case and non-letters, so "A man, a plan, a canal: Panama" counts.

```python
def is_palindrome(s):
    i, j = 0, len(s) - 1
    while i < j:
        while i < j and not s[i].isalnum(): i += 1
        while i < j and not s[j].isalnum(): j -= 1
        if s[i].lower() != s[j].lower():
            return False
        i += 1; j -= 1
    return True

print(is_palindrome("A man, a plan, a canal: Panama"))   # True
```

This is O(n) time and O(1) extra space, which beats the one-liner `t = [c.lower() for c in s if c.isalnum()]; return t == t[::-1]` on space, though both are acceptable if you explain the difference.

### Classic problem 3: anagrams

Two strings are anagrams if they contain the same letters in any order. Sorting both is O(n log n); counting is O(n).

```python
def is_anagram(a, b):
    return Counter(a) == Counter(b)          # O(n)

def is_anagram_sorted(a, b):
    return sorted(a) == sorted(b)            # O(n log n), simpler
```

The grouping version, "group these words into anagram sets", uses the sorted word as a dictionary key:

```python
def group_anagrams(words):
    groups = {}
    for w in words:
        key = "".join(sorted(w))
        groups.setdefault(key, []).append(w)
    return list(groups.values())

print(group_anagrams(["eat","tea","tan","ate","nat","bat"]))
# [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]
```

### Classic problem 4: first non-repeating character

Two passes, both O(n): count everything, then return the first character with a count of one.

```python
def first_unique(s):
    c = Counter(s)
    for i, ch in enumerate(s):
        if c[ch] == 1:
            return i
    return -1
```

### Useful string methods for data cleaning

| Method | What it does | Example |
|---|---|---|
| `strip()` | remove surrounding whitespace | `" LHR ".strip()` → `"LHR"` |
| `isdigit()` | all characters are digits | `"2026".isdigit()` → `True` |
| `zfill(n)` | pad with leading zeros | `"42".zfill(5)` → `"00042"` |
| `title()` | capitalise each word | `"ali raza".title()` |
| `casefold()` | aggressive lower-case for comparison | `"ß".casefold()` → `"ss"` |
| `f"{x:,.2f}"` | thousands separator, 2 decimals | `f"{1234.5:,.2f}"` → `"1,234.50"` |

> **Tip:** When an interviewer says "string", ask whether it is ASCII or Unicode. A fixed-size array of 26 counters is a valid O(1)-space trick for lower-case English letters, but it breaks the moment a name like "Ñoño" appears in the data.

### Try It Yourself

```python
from collections import Counter

def is_palindrome(s):
    i, j = 0, len(s) - 1
    while i < j:
        while i < j and not s[i].isalnum(): i += 1
        while i < j and not s[j].isalnum(): j -= 1
        if s[i].lower() != s[j].lower():
            return False
        i += 1; j -= 1
    return True

def group_anagrams(words):
    groups = {}
    for w in words:
        groups.setdefault("".join(sorted(w)), []).append(w)
    return list(groups.values())

def first_unique(s):
    c = Counter(s)
    return next((i for i, ch in enumerate(s) if c[ch] == 1), -1)

print(is_palindrome("A man, a plan, a canal: Panama"))
print(is_palindrome("Stewart Title"))
print(group_anagrams(["listen", "silent", "enlist", "google", "gogole", "cat"]))
print(first_unique("leetcode"), first_unique("aabb"))
```

### Quiz

1. Why is `s += ch` in a loop considered slow?
- [x] Strings are immutable, so each `+=` copies the whole string
- [ ] The `+` operator is not defined for strings
- [ ] It uses recursion internally
> Every concatenation allocates a new string and copies the old one, giving O(n²) total.

2. What does `"".join(sorted("cba"))` return?
- [ ] `["a","b","c"]`
- [x] `"abc"`
- [ ] `"cba"`
> `sorted` returns a list of characters; `join` glues them back into a string.

3. Which is the fastest way to check if two long strings are anagrams?
- [ ] Sort both and compare
- [x] Compare character counts
- [ ] Check every permutation
> Counting is O(n); sorting is O(n log n); permutations are O(n!).

4. What does `"42".zfill(5)` return?
- [x] `"00042"`
- [ ] `"42000"`
- [ ] `"   42"`
> `zfill` pads on the left with zeros to the requested width.

### Exercises

1. **Longest common prefix** — Given a list of strings, return the longest prefix shared by all of them, e.g. `["flower","flow","flight"]` → `"fl"`.
<details><summary>Solution</summary>

```python
def longest_common_prefix(words):
    if not words:
        return ""
    lo, hi = min(words), max(words)      # only the min and max matter
    i = 0
    while i < len(lo) and lo[i] == hi[i]:
        i += 1
    return lo[:i]

print(longest_common_prefix(["flower", "flow", "flight"]))  # fl
# O(n * m) to find min/max, then O(m) comparison
```

</details>

2. **Compress a string** — Implement run-length encoding: `"aaabccdddd"` → `"a3b1c2d4"`. If the result is not shorter, return the original.
<details><summary>Solution</summary>

```python
def compress(s):
    if not s:
        return s
    parts, count = [], 1
    for i in range(1, len(s) + 1):
        if i < len(s) and s[i] == s[i - 1]:
            count += 1
        else:
            parts.append(s[i - 1] + str(count))
            count = 1
    out = "".join(parts)
    return out if len(out) < len(s) else s

print(compress("aaabccdddd"))   # a3b1c2d4
print(compress("abc"))          # abc
```

</details>

3. **Valid parcel ID** — A parcel ID is valid if it is exactly 10 characters, the first two are upper-case letters and the rest are digits. Write `valid(pid)` without regular expressions.
<details><summary>Solution</summary>

```python
def valid(pid):
    return (len(pid) == 10
            and pid[:2].isalpha() and pid[:2].isupper()
            and pid[2:].isdigit())

print(valid("WY12345678"), valid("wy12345678"), valid("WY1234567"))
# True False False
```

</details>

### Interview Questions

**Q: Why are Python strings immutable, and how does it affect algorithm design?**
Immutability lets strings be hashed safely, so they can be dictionary keys and set members, and lets the interpreter share and intern them without worrying about someone changing a shared copy. The cost is that any "modification" allocates a new object, so building a string character by character is O(n²) unless you collect pieces in a list and join once, or use `io.StringIO`. For in-place algorithms such as reversing or swapping, you convert to a list, operate, and join back, which costs O(n) extra space that a C programmer working on a mutable `char[]` would not pay.

**Q: How would you check whether one string is a rotation of another?**
`"waterbottle"` is a rotation of `"erbottlewat"`. The trick is that every rotation of `s` is a substring of `s + s`, so the check is `len(a) == len(b) and b in a + a`. That is O(n) with CPython's substring search and one line of code. Interviewers like this question because the naive approach, trying every rotation, is O(n²), and the elegant approach shows you can spot structure in a problem rather than brute-forcing it.

**Q: What is the difference between `find`, `index` and `in` for strings?**
`s.find(sub)` returns the index of the first match or -1; `s.index(sub)` does the same but raises `ValueError` when missing; `sub in s` returns a boolean. All three are O(n × m) worst case but effectively linear for normal text because CPython uses a two-way string matching algorithm. Use `in` when you only need yes or no, `find` when you will handle the missing case yourself, and `index` when a missing value is a bug that should stop the program.

**Q: How would you count word frequency in a 767-page document efficiently?**
Read it in chunks or line by line rather than loading the whole file, normalise each line with `casefold()` and strip punctuation, split on whitespace, and feed the words into a `collections.Counter`, which is a dict subclass with O(1) average updates. Total time is O(total words) and memory is O(distinct words), which for English text is a few tens of thousands of keys even for a very long book. If the text is Unicode, use `str.casefold()` rather than `lower()` so that "STRASSE" and "Straße" compare equal, and consider `unicodedata.normalize("NFKC", ...)` before counting.

## Hash maps & sets

A **hash map** (Python `dict`) stores key–value pairs and finds any key in O(1) on average. A **hash set** (Python `set`) stores only keys. Together they are the most important tool in interview problem solving, because they turn "search the whole list" (O(n)) into "look it up" (O(1)), which turns O(n²) solutions into O(n) ones.

### How hashing works

A hash function turns a key into an integer. The map uses that integer to pick a slot in an internal array. When you look up a key, Python hashes it again, goes straight to that slot, and compares. That is why keys must be **hashable**: immutable types such as `int`, `str`, `float`, `tuple` (of hashables) and `frozenset` qualify; `list`, `dict` and `set` do not.

```python
print(hash("WY12345678"))   # some large integer
d = {}
d[(3, 4)] = "ok"            # tuple key works
# d[[3, 4]] = "no"          # TypeError: unhashable type: 'list'
```

Two different keys can hash to the same slot, a **collision**. CPython resolves it with open addressing: it probes other slots in a deterministic sequence. As the table fills past two-thirds, it resizes, which keeps the probe sequences short and the average lookup O(1). The worst case, when every key collides, is O(n), which is why Python randomises string hashes per process to stop attackers from engineering collisions.

### Dictionary essentials

```python
rates = {"WY": 3.50, "TX": 4.10, "CA": 2.90}
print(rates["WY"])                 # 3.5
print(rates.get("NY", 0.0))        # 0.0 default instead of KeyError
rates["NY"] = 3.75                 # insert
rates["WY"] += 0.25                # update
del rates["CA"]
print("TX" in rates)               # True, O(1)
for state, rate in rates.items():
    print(state, rate)
```

Since Python 3.7 dictionaries keep insertion order, so `list(d)` returns keys in the order they were added. That fact removed the need for `OrderedDict` in most code and is something interviewers may ask about.

### The counting pattern

```python
from collections import defaultdict, Counter

status = ["closed", "open", "closed", "pending", "closed"]

counts = {}
for s in status:
    counts[s] = counts.get(s, 0) + 1

counts2 = defaultdict(int)
for s in status:
    counts2[s] += 1

counts3 = Counter(status)
print(counts3.most_common(1))   # [('closed', 3)]
```

All three are O(n). `Counter` is what you write in an interview once you have explained the manual version.

### The grouping pattern

```python
files = [("WY", "f1"), ("TX", "f2"), ("WY", "f3")]
by_state = defaultdict(list)
for state, name in files:
    by_state[state].append(name)
print(dict(by_state))   # {'WY': ['f1', 'f3'], 'TX': ['f2']}
```

### Classic problem: two sum

Given a list and a target, find two indexes whose values add to the target. The brute force is O(n²). With a dict of "value → index" it is a single O(n) pass.

```python
def two_sum(nums, target):
    seen = {}                        # value -> index
    for i, x in enumerate(nums):
        need = target - x
        if need in seen:
            return [seen[need], i]
        seen[x] = i
    return None

print(two_sum([2, 7, 11, 15], 9))    # [0, 1]
```

The key idea is to ask, for each element, "have I already seen the partner I need?" and to store the element only after checking, so an element cannot pair with itself.

### Sets

A set is a dict without values. Use it for membership tests, deduplication and set algebra.

```python
a = {"f1", "f2", "f3"}
b = {"f2", "f3", "f4"}
print(a & b)   # {'f2', 'f3'}  intersection
print(a | b)   # union
print(a - b)   # {'f1'}  in a but not b
print(a ^ b)   # {'f1', 'f4'}  in exactly one

unique = list(dict.fromkeys([3, 1, 3, 2, 1]))   # [3, 1, 2]  dedupe, keeps order
```

Set operations are O(len(a) + len(b)), which makes "which agents appear in both QA reports" a one-liner instead of a nested loop.

| Operation | dict / set | list |
|---|---|---|
| `x in c` | O(1) average | O(n) |
| add / insert | O(1) average | O(1) end, O(n) elsewhere |
| delete | O(1) average | O(n) |
| ordered by | insertion (dict), unordered (set) | index |
| memory | higher (hash table overhead) | lower |

> **Interview note:** If your first solution has a nested loop, ask yourself "what is the inner loop searching for, and could a dict or set find it in O(1)?" That question alone solves a large fraction of easy and medium problems.

### Try It Yourself

```python
from collections import defaultdict, Counter

def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i
    return None

print("two_sum:", two_sum([2, 7, 11, 15], 9))

# Group files by state, then count
files = [("WY", "f1"), ("TX", "f2"), ("WY", "f3"), ("CA", "f4"), ("TX", "f5"), ("WY", "f6")]
by_state = defaultdict(list)
for state, name in files:
    by_state[state].append(name)
print("grouped:", dict(by_state))
print("counts:", Counter(s for s, _ in files).most_common())

# Set algebra: agents who passed QA in both weeks
week1 = {"Ayesha", "Bilal", "Danish", "Hira"}
week2 = {"Bilal", "Hira", "Kamran"}
print("both weeks:", week1 & week2)
print("only week1:", week1 - week2)
print("any week:", week1 | week2)
```

### Quiz

1. What is the average time complexity of `key in d` for a dict?
- [x] O(1)
- [ ] O(log n)
- [ ] O(n)
> Hashing the key gives the slot directly; only pathological collisions make it slower.

2. Which of these can be a dictionary key?
- [ ] `[1, 2]`
- [x] `(1, 2)`
- [ ] `{1, 2}`
> Tuples of hashable items are immutable and hashable; lists and sets are mutable and not.

3. In the two-sum solution, why do we store `seen[x] = i` after checking for the partner?
- [x] So an element cannot be paired with itself
- [ ] To save memory
- [ ] Because dict insertion is slow
> Checking first guarantees the partner is a different, earlier index.

4. Since which Python version do dicts preserve insertion order as a language guarantee?
- [ ] 2.7
- [ ] 3.5
- [x] 3.7
> CPython 3.6 did it as an implementation detail; 3.7 made it part of the language.

### Exercises

1. **Contains duplicate within k** — Return True if any value appears twice within k indexes of each other, e.g. `[1,2,3,1]`, k=3 → True.
<details><summary>Solution</summary>

```python
def near_duplicate(nums, k):
    last = {}                      # value -> last index seen
    for i, x in enumerate(nums):
        if x in last and i - last[x] <= k:
            return True
        last[x] = i
    return False

print(near_duplicate([1, 2, 3, 1], 3))       # True
print(near_duplicate([1, 2, 3, 1, 2, 3], 2)) # False
# O(n) time, O(n) space
```

</details>

2. **Intersection of two lists** — Return the unique values present in both lists, in O(n + m).
<details><summary>Solution</summary>

```python
def intersection(a, b):
    return list(set(a) & set(b))

print(sorted(intersection([1, 2, 2, 1], [2, 2])))         # [2]
print(sorted(intersection([4, 9, 5], [9, 4, 9, 8, 4])))   # [4, 9]
```

</details>

3. **Subarray sum equals k** — Count contiguous subarrays whose sum is exactly k using prefix sums and a dict.
<details><summary>Solution</summary>

```python
def subarray_sum(nums, k):
    count, running = 0, 0
    seen = {0: 1}                   # prefix sum -> how many times seen
    for x in nums:
        running += x
        count += seen.get(running - k, 0)
        seen[running] = seen.get(running, 0) + 1
    return count

print(subarray_sum([1, 1, 1], 2))        # 2
print(subarray_sum([1, 2, 3], 3))        # 2  ([1,2] and [3])
# O(n): if prefix[j] - prefix[i] == k then the subarray i+1..j sums to k
```

</details>

### Interview Questions

**Q: How does a hash table work and what happens on a collision?**
A hash table applies a hash function to the key to get an integer, reduces it modulo the table size to pick a bucket, and stores the key–value pair there. Two keys can land in the same bucket, and the two standard fixes are chaining (each bucket holds a linked list) and open addressing (probe other buckets in a fixed sequence). CPython uses open addressing with a pseudo-random probe sequence and keeps the table at most two-thirds full, resizing when it crosses that threshold, so the expected number of probes stays constant. That gives O(1) average time and O(n) worst case, and the worst case is why Python salts string hashes to prevent denial-of-service attacks built from colliding keys.

**Q: When would you use a set instead of a list?**
When the question you keep asking is "is this in there?" or "give me the distinct values". Membership on a set is O(1) versus O(n) on a list, so deduplicating a million-row export or checking each of 40,000 parcel IDs against a list of 5,000 flagged ones goes from minutes to milliseconds. The trade-offs are that sets use more memory per element, do not preserve order, and require hashable elements, so a list of lists must be converted to tuples first. If order matters and duplicates must go, `list(dict.fromkeys(items))` gives an ordered dedupe.

**Q: Explain the two-sum solution and its complexity.**
Walk the list once. For each value x, compute the partner `target - x` and check whether it is already in a dictionary that maps seen values to their indexes; if so, return the stored index and the current one, otherwise store x. It is O(n) time because each element does one hash lookup and one insert, and O(n) space for the dictionary. The brute force checks every pair, O(n²). The follow-up, "what if the list is sorted", allows a two-pointer O(n) time, O(1) space solution, and "three sum" combines sorting with two pointers for O(n²).

**Q: What is the difference between `dict.get`, `defaultdict` and `setdefault`?**
`d.get(k, default)` returns a default without inserting it. `d.setdefault(k, default)` returns the value and inserts the default if the key is missing, which is handy for grouping but evaluates the default every call, so `setdefault(k, [])` builds a throw-away list each time. `defaultdict(list)` calls the factory only on a missing key and is the cleanest for grouping or counting, but it silently inserts keys on read, so `if k in dd` and `dd[k]` behave differently, and you usually convert it back to a plain dict before returning it from a function.

## Recursion basics

A **recursive** function calls itself on a smaller version of the same problem until it reaches a case small enough to answer directly. Many data structures, especially trees and graphs, are defined recursively, so recursion is the natural way to process them. Learn to write it, learn when it breaks, and learn how to convert it to a loop.

### The two parts of every recursive function

1. **Base case**: the input is so small that you return an answer without recursing.
2. **Recursive case**: do a little work, then call yourself on a smaller input, and combine.

```python
def factorial(n):
    if n <= 1:            # base case
        return 1
    return n * factorial(n - 1)    # recursive case

print(factorial(5))       # 120
```

Trace it: `factorial(5)` waits for `factorial(4)`, which waits for `factorial(3)`, and so on down to `factorial(1)`, which returns 1. Then the results multiply back up: 1, 2, 6, 24, 120. Each waiting call sits on the **call stack**, so this uses O(n) stack space even though there are no lists.

### The call stack and its limit

Python caps recursion depth at 1000 by default. `factorial(2000)` raises `RecursionError`. You can raise the limit with `sys.setrecursionlimit`, but a truly deep recursion will crash the interpreter, so the real fix for deep problems is an explicit stack or a loop.

```python
import sys
print(sys.getrecursionlimit())   # 1000
```

### Sum of a list, three ways

```python
def sum_rec(a):
    if not a:
        return 0
    return a[0] + sum_rec(a[1:])       # O(n^2)! slicing copies each time

def sum_rec_idx(a, i=0):
    if i == len(a):
        return 0
    return a[i] + sum_rec_idx(a, i + 1)   # O(n) time, O(n) stack

def sum_loop(a):
    total = 0
    for x in a:
        total += x
    return total                         # O(n) time, O(1) space
```

The first version is a common trap: `a[1:]` copies the rest of the list on every call. Pass an index instead of slicing.

### Fibonacci and the exponential trap

```python
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
```

This is correct but O(2ⁿ) because `fib(30)` computes `fib(28)` twice, `fib(27)` three times, and so on. Adding a cache, called **memoisation**, makes it O(n):

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(90))   # 2880067194370816120, instantly
```

Memoisation is the bridge from recursion to dynamic programming, which the Expert level covers in depth.

### Recursion on structures

Nested folders, nested JSON, nested document sections: anything tree-shaped is recursive by nature.

```python
manual = {
    "title": "Policy Manual",
    "sections": [
        {"title": "HR", "sections": [
            {"title": "Leave", "sections": []},
            {"title": "Conduct", "sections": []}]},
        {"title": "IT", "sections": []}]}

def count_sections(node):
    return 1 + sum(count_sections(s) for s in node["sections"])

def print_toc(node, depth=0):
    print("  " * depth + node["title"])
    for s in node["sections"]:
        print_toc(s, depth + 1)

print(count_sections(manual))   # 5
print_toc(manual)
```

A loop cannot easily do this because you do not know the nesting depth in advance. Recursion handles arbitrary depth for free.

### Converting recursion to iteration

Any recursion can be rewritten with an explicit stack (a list you `append` to and `pop` from). This matters for deep inputs and for interviews that ask "now do it without recursion".

```python
def count_sections_iter(root):
    stack, n = [root], 0
    while stack:
        node = stack.pop()
        n += 1
        stack.extend(node["sections"])
    return n
```

### Recursion checklist

| Question | Why it matters |
|---|---|
| What is the base case? | Without it, infinite recursion |
| Does each call shrink the input? | Otherwise it never reaches the base case |
| Is work repeated? | If yes, memoise |
| How deep can it go? | Over ~1000 frames, use a loop or stack |
| Am I slicing? | Slicing in recursion often makes O(n) into O(n²) |

> **Tip:** Draw the recursion tree for a small input such as n=4 before you code. If the tree has repeated subtrees, you need memoisation; if it is a single chain, a loop is probably cleaner.

### Try It Yourself

```python
from functools import lru_cache
import time

def fib_slow(n):
    return n if n < 2 else fib_slow(n - 1) + fib_slow(n - 2)

@lru_cache(maxsize=None)
def fib_fast(n):
    return n if n < 2 else fib_fast(n - 1) + fib_fast(n - 2)

t = time.perf_counter(); print("slow fib(25) =", fib_slow(25)); print(f"  {time.perf_counter()-t:.3f}s")
t = time.perf_counter(); print("fast fib(25) =", fib_fast(25)); print(f"  {time.perf_counter()-t:.6f}s")
print("fast fib(90) =", fib_fast(90))

# Recursive table of contents
manual = {"title": "Policy Manual", "sections": [
    {"title": "HR", "sections": [{"title": "Leave", "sections": []}, {"title": "Conduct", "sections": []}]},
    {"title": "IT", "sections": [{"title": "Passwords", "sections": []}]}]}

def print_toc(node, depth=0):
    print("  " * depth + node["title"])
    for s in node["sections"]:
        print_toc(s, depth + 1)

print_toc(manual)
```

### Quiz

1. What happens if a recursive function has no base case?
- [ ] It returns None
- [x] It recurses until Python raises RecursionError
- [ ] It runs as a loop
> Each call pushes a frame; without a stopping condition the stack limit (default 1000) is hit.

2. What is the time complexity of naive recursive Fibonacci?
- [ ] O(n)
- [ ] O(n²)
- [x] O(2ⁿ)
> Each call makes two more calls, so the number of calls roughly doubles with n.

3. Why is `sum_rec(a[1:])` slower than passing an index?
- [x] Slicing copies the list on every call, making it O(n²)
- [ ] Slices are not allowed in recursion
- [ ] It uses more stack frames
> Each `a[1:]` copies n−1, then n−2, ... elements, summing to O(n²).

4. What does memoisation do?
- [x] Stores results of calls so repeated inputs are not recomputed
- [ ] Converts recursion to iteration
- [ ] Increases the recursion limit
> A cache keyed by arguments turns the exponential Fibonacci tree into a linear chain.

### Exercises

1. **Power function** — Write `power(x, n)` recursively in O(log n) using the fact that xⁿ = (x^(n/2))² when n is even.
<details><summary>Solution</summary>

```python
def power(x, n):
    if n == 0:
        return 1
    half = power(x, n // 2)
    return half * half if n % 2 == 0 else half * half * x

print(power(2, 10), power(3, 5))   # 1024 243
# O(log n) calls because n halves each time
```

</details>

2. **Flatten nested lists** — Turn `[1, [2, [3, 4]], 5]` into `[1, 2, 3, 4, 5]` for any depth.
<details><summary>Solution</summary>

```python
def flatten(items):
    out = []
    for x in items:
        if isinstance(x, list):
            out.extend(flatten(x))
        else:
            out.append(x)
    return out

print(flatten([1, [2, [3, 4]], 5]))   # [1, 2, 3, 4, 5]
```

</details>

3. **Reverse a string recursively** — Without slicing the whole string in one go, reverse it by recursion, then explain why the iterative version is better.
<details><summary>Solution</summary>

```python
def reverse(s):
    if len(s) <= 1:
        return s
    return reverse(s[1:]) + s[0]

print(reverse("manual"))   # launam
# O(n^2) because of slicing and string concatenation, and O(n) stack depth.
# The iterative s[::-1] or a two-pointer swap on a list is O(n) time and does not risk RecursionError.
```

</details>

### Interview Questions

**Q: What is recursion and what are its two essential parts?**
Recursion is a technique where a function solves a problem by calling itself on smaller instances of the same problem. It needs a base case, an input small enough to answer directly, and a recursive case that reduces the input and combines the sub-results. For example, the number of sections in a nested policy manual is one plus the section counts of each child, with a childless section as the base case. If the reduction step does not actually shrink the input, or the base case is unreachable, the function recurses forever and crashes with a stack overflow, which in Python appears as `RecursionError` after about 1000 frames.

**Q: What is the difference between recursion and iteration, and when do you prefer each?**
Iteration repeats with loops and explicit state; recursion repeats with function calls and implicit state on the call stack. Recursion is clearer for problems that are naturally self-similar, such as tree traversal, nested JSON, permutations and divide-and-conquer algorithms like merge sort. Iteration is faster in Python because function calls are expensive, uses O(1) stack space, and cannot hit the recursion limit, so I prefer it for linear problems such as summing a list or walking a linked list. When recursion is natural but depth is a risk, I keep the recursive shape but use an explicit stack.

**Q: What is memoisation and how does it relate to dynamic programming?**
Memoisation caches a function's return value keyed by its arguments so that repeated calls with the same input return instantly. Naive recursive Fibonacci is O(2ⁿ) because it recomputes the same sub-problems; with `functools.lru_cache` it becomes O(n) time and O(n) space. Dynamic programming is the same insight applied deliberately: identify overlapping sub-problems, store their answers, and build up from small to large. Memoisation is "top-down DP" that keeps the recursive structure; "bottom-up DP" fills a table iteratively and usually saves stack space and often memory too.

**Q: What is tail recursion and does Python optimise it?**
A call is tail-recursive when the recursive call is the very last action, so nothing remains to be done after it returns, as in `def f(n, acc): return acc if n == 0 else f(n-1, acc*n)`. Languages such as Scheme and some C compilers reuse the current stack frame for such calls, so recursion depth becomes unbounded. CPython deliberately does not do this, because Guido van Rossum wanted stack traces to remain complete and the language to stay simple, so a tail-recursive Python function still consumes one frame per call and still hits the recursion limit. The practical consequence is that in Python you convert deep tail recursion into a `while` loop by hand.

# LEVEL: Intermediate

## Linked lists

A **linked list** is a chain of nodes. Each node holds a value and a reference to the next node. Unlike an array there is no contiguous block of memory, so you cannot jump to index 5; you start at the **head** and follow `next` pointers. What you gain is O(1) insertion and deletion at any node you already hold, with no shifting.

### Defining a node

```python
class Node:
    def __init__(self, val, next=None):
        self.val = val
        self.next = next

# Build 1 -> 2 -> 3
head = Node(1, Node(2, Node(3)))
```

The list is just the head node; the last node's `next` is `None`. Every linked-list algorithm is a walk from `head` following `next` until `None`.

### Walking, counting, printing

```python
def to_list(head):
    out, cur = [], head
    while cur:
        out.append(cur.val)
        cur = cur.next
    return out

def length(head):
    n, cur = 0, head
    while cur:
        n += 1
        cur = cur.next
    return n
```

Both are O(n) time, O(1) extra space. The pattern `cur = head; while cur: ...; cur = cur.next` is the linked-list equivalent of a `for` loop.

### Inserting and deleting

```python
def push_front(head, val):
    return Node(val, head)                  # O(1)

def insert_after(node, val):
    node.next = Node(val, node.next)        # O(1) if you hold the node

def delete_value(head, val):
    dummy = Node(0, head)                   # dummy simplifies deleting the head
    prev = dummy
    while prev.next:
        if prev.next.val == val:
            prev.next = prev.next.next      # unlink
            break
        prev = prev.next
    return dummy.next
```

The **dummy node** trick is worth learning: it means the head is no longer a special case, which removes a whole class of off-by-one bugs.

| Operation | Singly linked list | Python list |
|---|---|---|
| Access k-th element | O(k) | O(1) |
| Insert / delete at front | O(1) | O(n) |
| Insert / delete at back | O(n) without tail pointer, O(1) with | O(1) amortised |
| Insert after known node | O(1) | O(n) |
| Memory per element | value + pointer + object overhead | pointer only |

### Classic problem 1: reverse a linked list

This is the most asked linked-list question in interviews. Walk the list, redirecting each `next` pointer backwards.

```python
def reverse(head):
    prev, cur = None, head
    while cur:
        nxt = cur.next      # save the rest
        cur.next = prev     # flip the pointer
        prev = cur          # advance prev
        cur = nxt           # advance cur
    return prev             # new head
```

O(n) time, O(1) space. Trace it on `1 -> 2 -> 3` on paper: after the loop, `3 -> 2 -> 1 -> None`. The recursive version is elegant but uses O(n) stack.

### Classic problem 2: find the middle (slow and fast pointers)

Move one pointer one step at a time and another two steps. When the fast one reaches the end, the slow one is at the middle. One pass, no counting.

```python
def middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow           # second middle for even lengths
```

### Classic problem 3: detect a cycle (Floyd's algorithm)

If `next` pointers ever loop back, a plain walk never ends. With slow and fast pointers, if there is a cycle the fast one eventually laps the slow one and they meet.

```python
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False
```

O(n) time and O(1) space, which beats the obvious "store visited nodes in a set" solution on memory.

### Classic problem 4: merge two sorted lists

```python
def merge(a, b):
    dummy = tail = Node(0)
    while a and b:
        if a.val <= b.val:
            tail.next, a = a, a.next
        else:
            tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b          # attach whatever is left
    return dummy.next
```

This is the merge step of merge sort, and it is also how you combine two sorted production reports without sorting again.

### Doubly linked lists

Add a `prev` pointer and you can walk backwards and delete a node in O(1) without knowing its predecessor. Python's `collections.deque` and the `OrderedDict` used in LRU caches are built on this idea.

> **Interview note:** Always ask whether you may modify the list, whether it can be empty, and whether it might contain a cycle. Then draw three nodes on the whiteboard and update the drawing as you write each pointer assignment. Pointer bugs are almost always caught by the drawing, not by the code.

### Try It Yourself

```python
class Node:
    def __init__(self, val, next=None):
        self.val, self.next = val, next

def from_list(items):
    head = None
    for x in reversed(items):
        head = Node(x, head)
    return head

def to_list(head):
    out = []
    while head:
        out.append(head.val); head = head.next
    return out

def reverse(head):
    prev = None
    while head:
        head.next, prev, head = prev, head, head.next
    return prev

def middle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    return slow.val

def merge(a, b):
    dummy = tail = Node(0)
    while a and b:
        if a.val <= b.val: tail.next, a = a, a.next
        else:              tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b
    return dummy.next

lst = from_list([1, 2, 3, 4, 5])
print("reversed:", to_list(reverse(lst)))
print("middle of 1..5:", middle(from_list([1, 2, 3, 4, 5])))
print("merged:", to_list(merge(from_list([1, 4, 9]), from_list([2, 3, 10, 11]))))
```

### Quiz

1. What is the time complexity of reaching the k-th node of a singly linked list?
- [ ] O(1)
- [x] O(k)
- [ ] O(log k)
> There is no index arithmetic; you must follow k pointers from the head.

2. In the reverse algorithm, why do we save `cur.next` before flipping the pointer?
- [x] Because after `cur.next = prev` we would lose the rest of the list
- [ ] To count the nodes
- [ ] To detect a cycle
> Once the pointer is flipped, the only reference to the remaining nodes is the saved one.

3. What does the fast pointer in Floyd's cycle detection do?
- [ ] Moves backwards
- [x] Moves two nodes per step
- [ ] Marks visited nodes
> If there is a cycle, the two-step pointer must eventually land on the one-step pointer.

4. What is the purpose of a dummy head node?
- [x] It removes the special case of inserting or deleting at the head
- [ ] It stores the length of the list
- [ ] It makes the list circular
> With a dummy, every real node has a predecessor, so one code path handles all positions.

### Exercises

1. **Remove the n-th node from the end** — In one pass, delete the n-th node from the end of the list.
<details><summary>Solution</summary>

```python
def remove_nth_from_end(head, n):
    dummy = Node(0, head)
    lead = follow = dummy
    for _ in range(n):            # move lead n steps ahead
        lead = lead.next
    while lead.next:              # advance both until lead is at the last node
        lead, follow = lead.next, follow.next
    follow.next = follow.next.next
    return dummy.next
# O(n) time, O(1) space: the gap between the pointers is exactly n
```

</details>

2. **Palindrome linked list** — Return True if the values read the same forwards and backwards, using O(1) extra space.
<details><summary>Solution</summary>

```python
def is_palindrome(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    prev = None                       # reverse second half
    while slow:
        slow.next, prev, slow = prev, slow, slow.next
    a, b = head, prev
    while b:
        if a.val != b.val:
            return False
        a, b = a.next, b.next
    return True
# Find middle, reverse the second half in place, compare halves.
```

</details>

3. **Remove duplicates from a sorted list** — Given `1 -> 1 -> 2 -> 3 -> 3`, return `1 -> 2 -> 3`.
<details><summary>Solution</summary>

```python
def dedupe_sorted(head):
    cur = head
    while cur and cur.next:
        if cur.val == cur.next.val:
            cur.next = cur.next.next     # skip the duplicate
        else:
            cur = cur.next
    return head
```

</details>

### Interview Questions

**Q: When would you choose a linked list over an array?**
When you need cheap insertion or deletion at known positions and rarely need random access: an undo history, an LRU cache's recency list, or a queue with pushes at one end and pops at the other. A doubly linked list lets you unlink any node in O(1) once you hold a reference to it, which an array cannot do. In practice arrays win far more often because of O(1) indexing and cache-friendly contiguous memory, and in Python the honest answer is that I would use `collections.deque` for a queue and only write my own linked list when a problem is specifically about pointer manipulation.

**Q: How do you reverse a linked list, and what is the complexity?**
Keep three pointers: `prev` starting at None, `cur` at the head, and `nxt` to save the rest. For each node, save `cur.next` in `nxt`, point `cur.next` at `prev`, then advance `prev` to `cur` and `cur` to `nxt`. When `cur` is None, `prev` is the new head. It is O(n) time and O(1) space because every node is visited once and only three references are held. The recursive version reverses the tail first and then sets `head.next.next = head`, but it consumes O(n) stack frames, which in Python fails on lists longer than about 1000 nodes.

**Q: Explain Floyd's cycle-detection algorithm and how you would find where the cycle starts.**
Use a slow pointer moving one step and a fast pointer moving two; if they ever point at the same node there is a cycle, and if the fast pointer reaches None there is not. To find the start of the cycle, after the pointers meet, reset one to the head and move both one step at a time; the node where they meet again is the cycle entrance. That works because the distance from the head to the entrance equals the distance from the meeting point around the loop to the entrance, which follows from the fast pointer having travelled exactly twice as far. The whole thing is O(n) time and O(1) space, unlike the visited-set approach which needs O(n) memory.

**Q: How would you design an LRU cache?**
Combine a hash map for O(1) lookup with a doubly linked list for O(1) recency updates. The map goes from key to node; the list holds nodes in order of use, most recent at the head. On `get`, find the node via the map, unlink it and move it to the head. On `put`, insert at the head, and if capacity is exceeded, remove the tail node and delete its key from the map. Every operation is O(1). In Python, `collections.OrderedDict` with `move_to_end` and `popitem(last=False)` implements exactly this in a few lines, and I would mention that before hand-rolling the list.

## Stacks & queues

A **stack** is last-in, first-out (LIFO): the last thing you push is the first thing you pop, like a pile of signed contracts on a desk. A **queue** is first-in, first-out (FIFO): the first document into the print queue is the first one printed. Both are simple, both are O(1) per operation when implemented properly, and both appear in a surprising number of interview problems.

### Stack with a Python list

A list's `append` and `pop` both work at the end in O(1), so a list is already a perfectly good stack.

```python
stack = []
stack.append("draft")       # push
stack.append("reviewed")
stack.append("approved")
print(stack[-1])            # peek: approved
print(stack.pop())          # approved
print(stack.pop())          # reviewed
print(len(stack))           # 1
```

Never pop from an empty list without checking; it raises `IndexError`.

### Queue with collections.deque

A list is a bad queue because `pop(0)` is O(n). `collections.deque` (double-ended queue) gives O(1) at both ends.

```python
from collections import deque
q = deque()
q.append("job1")            # enqueue at the right
q.append("job2")
q.append("job3")
print(q.popleft())          # job1: dequeue from the left
print(q[0])                 # peek: job2
print(len(q))               # 2
```

`deque` also accepts `maxlen`, which makes it a rolling window: `deque(maxlen=7)` keeps only the last seven items, handy for a seven-day moving average.

| Structure | Push | Pop | Peek | Python tool |
|---|---|---|---|---|
| Stack | `append` O(1) | `pop` O(1) | `[-1]` | `list` |
| Queue | `append` O(1) | `popleft` O(1) | `[0]` | `collections.deque` |
| Priority queue | `heappush` O(log n) | `heappop` O(log n) | `[0]` | `heapq` |

### Classic stack problem: balanced brackets

Every opening bracket must be closed by the matching type in the right order. Push openers, and on each closer check that the top of the stack is its partner.

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

print(balanced("{[()]}"), balanced("([)]"), balanced("(("))   # True False False
```

O(n) time, O(n) space. The same idea validates nested XML tags in a DOCX `document.xml` or matching `{% if %}` and `{% endif %}` blocks in a template.

### Classic stack problem: evaluate reverse Polish notation

Postfix expressions such as `2 3 4 * +` need no parentheses. Push numbers; on an operator, pop two, compute, push the result.

```python
def eval_rpn(tokens):
    st = []
    for t in tokens:
        if t in "+-*/":
            b, a = st.pop(), st.pop()
            st.append({"+": a + b, "-": a - b, "*": a * b, "/": int(a / b)}[t])
        else:
            st.append(int(t))
    return st[0]

print(eval_rpn("2 3 4 * +".split()))   # 14
```

Note the pop order: the second pop is the left operand. This is exactly how a calculator, and Python's own bytecode interpreter, evaluate expressions.

### Monotonic stack: next greater element

For each element, find the next element to its right that is larger. The brute force is O(n²). A stack that only ever holds indexes of decreasing values does it in O(n).

```python
def next_greater(nums):
    res = [-1] * len(nums)
    st = []                          # indexes with decreasing values
    for i, x in enumerate(nums):
        while st and nums[st[-1]] < x:
            res[st.pop()] = x        # x is the answer for those indexes
        st.append(i)
    return res

print(next_greater([2, 1, 2, 4, 3]))   # [4, 2, 4, -1, -1]
```

Each index is pushed once and popped at most once, so the total is O(n) even though there is a nested `while`. This pattern also solves "daily temperatures" and "largest rectangle in a histogram".

### Queue in action: level-by-level processing

A queue is the engine of breadth-first search, which the Graphs chapter covers. Here is the simplest use: simulate a helpdesk that serves tickets in arrival order.

```python
from collections import deque
tickets = deque([("T1", 3), ("T2", 1), ("T3", 2)])    # (id, minutes)
clock = 0
while tickets:
    tid, mins = tickets.popleft()
    clock += mins
    print(f"{tid} done at minute {clock}")
```

### Implement a queue with two stacks

A favourite interview question. Push into `inbox`; to pop, if `outbox` is empty, pour everything from `inbox` into it (reversing the order), then pop from `outbox`. Each element moves at most twice, so the amortised cost per operation is O(1).

```python
class Queue:
    def __init__(self):
        self.inbox, self.outbox = [], []
    def enqueue(self, x):
        self.inbox.append(x)
    def dequeue(self):
        if not self.outbox:
            while self.inbox:
                self.outbox.append(self.inbox.pop())
        return self.outbox.pop()
```

> **Tip:** When a problem says "most recent", "nested", "undo" or "matching", think stack. When it says "in order of arrival", "level by level" or "shortest path in an unweighted graph", think queue.

### Try It Yourself

```python
from collections import deque

def balanced(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    st = []
    for ch in s:
        if ch in "([{":
            st.append(ch)
        elif ch in pairs and (not st or st.pop() != pairs[ch]):
            return False
    return not st

def next_greater(nums):
    res, st = [-1] * len(nums), []
    for i, x in enumerate(nums):
        while st and nums[st[-1]] < x:
            res[st.pop()] = x
        st.append(i)
    return res

print(balanced("{[()]}"), balanced("([)]"))
print(next_greater([73, 74, 75, 71, 69, 72, 76, 73]))

# Rolling 3-day average with a bounded deque
window = deque(maxlen=3)
for day, files in enumerate([120, 95, 143, 110, 88], 1):
    window.append(files)
    print(f"day {day}: last-3 avg = {sum(window)/len(window):.1f}")
```

### Quiz

1. Which Python structure gives O(1) removal from the front?
- [ ] `list`
- [x] `collections.deque`
- [ ] `tuple`
> `list.pop(0)` shifts every element; `deque.popleft()` is constant time.

2. In the balanced-brackets check, what does an empty stack at the end mean?
- [x] Every opener was matched and closed
- [ ] The string had no brackets
- [ ] There was an error
> Leftover openers would remain on the stack, so empty means fully balanced.

3. What is the amortised cost of dequeue in the two-stack queue?
- [x] O(1)
- [ ] O(n)
- [ ] O(log n)
> Each element is moved from inbox to outbox at most once over its lifetime.

4. Why is the next-greater-element algorithm O(n) despite the nested while loop?
- [x] Each index is pushed and popped at most once
- [ ] The while loop never runs more than once
- [ ] The list is sorted first
> Total pops cannot exceed total pushes, and there are exactly n pushes.

### Exercises

1. **Min stack** — Design a stack with `push`, `pop`, `top` and `get_min` all in O(1).
<details><summary>Solution</summary>

```python
class MinStack:
    def __init__(self):
        self.st, self.mins = [], []
    def push(self, x):
        self.st.append(x)
        self.mins.append(x if not self.mins else min(x, self.mins[-1]))
    def pop(self):
        self.mins.pop()
        return self.st.pop()
    def top(self):
        return self.st[-1]
    def get_min(self):
        return self.mins[-1]
# A parallel stack stores the minimum "so far" at each height.
```

</details>

2. **Daily temperatures** — For each day, how many days until a warmer temperature? `[73,74,75,71,69,72,76,73]` → `[1,1,4,2,1,1,0,0]`.
<details><summary>Solution</summary>

```python
def daily_temperatures(t):
    res, st = [0] * len(t), []
    for i, x in enumerate(t):
        while st and t[st[-1]] < x:
            j = st.pop()
            res[j] = i - j
        st.append(i)
    return res
# Monotonic stack of indexes; O(n).
```

</details>

3. **Simplify a path** — Turn `/a/./b/../../c/` into `/c` using a stack.
<details><summary>Solution</summary>

```python
def simplify(path):
    st = []
    for part in path.split("/"):
        if part == "..":
            if st: st.pop()
        elif part and part != ".":
            st.append(part)
    return "/" + "/".join(st)

print(simplify("/a/./b/../../c/"))   # /c
```

</details>

### Interview Questions

**Q: What is the difference between a stack and a queue, and give a real use of each?**
A stack is LIFO: the most recently added item is removed first. A queue is FIFO: the oldest item is removed first. Function calls use a stack, which is why a stack trace shows the most recent call on top and why deep recursion overflows it. Undo in Word is a stack of edits. A print spooler, a BPO ticket queue and breadth-first search all use a queue, because fairness or level order matters. In Python a list is a fine stack, while a queue should be `collections.deque` so that removing from the front stays O(1).

**Q: How would you implement a stack using queues, or a queue using stacks?**
A queue from two stacks uses an inbox for pushes and an outbox for pops; when the outbox is empty you pour the inbox into it, which reverses the order, giving amortised O(1) per operation. A stack from one queue is done by, after each push, rotating the queue so the new element comes to the front: dequeue and re-enqueue the previous n−1 elements, making push O(n) and pop O(1). Interviewers ask this to see whether you understand amortised analysis and can reason about ordering, not because anyone does it in production.

**Q: Explain the monotonic stack pattern.**
A monotonic stack keeps its elements in strictly increasing or decreasing order by popping anything that would break the order before pushing. While popping, each popped element learns its answer from the element that evicted it, which is why it solves "next greater element", "daily temperatures", "stock span" and "largest rectangle in a histogram" in O(n). The complexity argument is that every element is pushed exactly once and popped at most once, so the nested loop does at most 2n total operations. I like to describe it as "each element waits on the stack until someone bigger comes along".

**Q: How does `collections.deque` achieve O(1) at both ends?**
It is implemented as a doubly linked list of fixed-size blocks (64 pointers each in CPython) with pointers to the left and right ends and indexes into the end blocks. Appending or popping on either side touches only the end block and allocates a new block only when one fills, so it is O(1) with excellent constant factors. Indexing into the middle, `d[i]`, is O(n) because it must walk the blocks, which is the trade-off against a list. It is also thread-safe for append and popleft, which is why the standard `queue.Queue` is built on it.

## Sorting algorithms

**Sorting** puts items in order. It matters for two reasons: sorted output is what people want to read (a production report ordered by date or state), and many faster algorithms, including binary search and two pointers, only work on sorted data. Interviews expect you to know how the classic algorithms work, their complexities, and when the built-in sort is the right answer (almost always).

### Bubble sort: O(n²), the teaching example

Repeatedly swap adjacent items that are out of order. After each pass, the largest remaining item "bubbles" to the end.

```python
def bubble_sort(a):
    n = len(a)
    for i in range(n):
        swapped = False
        for j in range(n - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swapped = True
        if not swapped:
            break                # already sorted: O(n) best case
    return a
```

Interviewers ask about it to check that you can analyse nested loops and spot the early-exit optimisation.

### Insertion sort: O(n²) but great for small or nearly sorted data

Take each item and insert it into the sorted part on its left by shifting larger items right.

```python
def insertion_sort(a):
    for i in range(1, len(a)):
        key, j = a[i], i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a
```

It is O(n) on sorted input, stable, in place, and Timsort uses it for small runs.

### Merge sort: O(n log n), divide and conquer

Split the list in half, sort each half recursively, then merge the two sorted halves.

```python
def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left, right = merge_sort(a[:mid]), merge_sort(a[mid:])
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    out.extend(left[i:]); out.extend(right[j:])
    return out
```

There are log₂ n levels of splitting and each level does O(n) merging work, so O(n log n) in every case. It needs O(n) extra space for the merged lists. Because `<=` keeps equal items in their original order, it is **stable**.

### Quick sort: O(n log n) average, in place

Pick a **pivot**, partition the list into items less than, equal to, and greater than the pivot, then recurse on the two sides.

```python
def quick_sort(a):
    if len(a) <= 1:
        return a
    pivot = a[len(a) // 2]
    less  = [x for x in a if x < pivot]
    equal = [x for x in a if x == pivot]
    more  = [x for x in a if x > pivot]
    return quick_sort(less) + equal + quick_sort(more)
```

This readable version uses extra space; the in-place Lomuto or Hoare partition is the real thing. Its weakness is the worst case: if the pivot is always the smallest item (choosing the first element on sorted input), the time becomes O(n²). Random or median-of-three pivots make that vanishingly unlikely.

### Comparison table

| Algorithm | Best | Average | Worst | Space | Stable |
|---|---|---|---|---|---|
| Bubble | O(n) | O(n²) | O(n²) | O(1) | yes |
| Insertion | O(n) | O(n²) | O(n²) | O(1) | yes |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | yes |
| Quick | O(n log n) | O(n log n) | O(n²) | O(log n) | no |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | no |
| Timsort (Python) | O(n) | O(n log n) | O(n log n) | O(n) | yes |
| Counting | O(n + k) | O(n + k) | O(n + k) | O(k) | yes |

**Stable** means items that compare equal keep their original relative order. That matters when you sort a report by state and want files within each state to stay in date order.

### Python's built-in sort

`sorted(iterable)` returns a new list; `list.sort()` sorts in place and returns `None`. Both use **Timsort**, a hybrid of merge sort and insertion sort that detects already-sorted runs, so it is O(n) on sorted or reverse-sorted data and O(n log n) otherwise. Both take `key=` and `reverse=`.

```python
files = [("WY", "2026-03-02", 12), ("TX", "2026-03-01", 40), ("WY", "2026-03-01", 7)]
files.sort(key=lambda f: (f[0], f[1]))       # by state, then date
print(files)
by_pages_desc = sorted(files, key=lambda f: f[2], reverse=True)
```

A `key` function is called once per element, then comparisons use the precomputed keys. Because Timsort is stable, sorting by date and then by state gives "state, then date within state" in two passes.

> **Warning:** Never sort a list of mixed types in Python 3; `sorted([3, "a"])` raises `TypeError`. Use a `key` that maps everything to one type.

### Counting sort: beating O(n log n) when keys are small integers

If values are integers in a small range, count them and write them back out. O(n + k) where k is the range.

```python
def counting_sort(a, k):
    counts = [0] * (k + 1)
    for x in a:
        counts[x] += 1
    out = []
    for v, c in enumerate(counts):
        out.extend([v] * c)
    return out

print(counting_sort([3, 1, 4, 1, 5, 9, 2, 6], 9))
```

This sorts a million QA scores from 0 to 100 in linear time.

### Try It Yourself

```python
import random, time

def insertion_sort(a):
    for i in range(1, len(a)):
        key, j = a[i], i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]; j -= 1
        a[j + 1] = key
    return a

def merge_sort(a):
    if len(a) <= 1: return a
    mid = len(a) // 2
    l, r = merge_sort(a[:mid]), merge_sort(a[mid:])
    out, i, j = [], 0, 0
    while i < len(l) and j < len(r):
        if l[i] <= r[j]: out.append(l[i]); i += 1
        else:            out.append(r[j]); j += 1
    return out + l[i:] + r[j:]

data = [random.randint(0, 100000) for _ in range(2000)]
for name, fn in [("insertion", insertion_sort), ("merge", merge_sort), ("built-in", sorted)]:
    t = time.perf_counter(); out = fn(data[:]); dt = time.perf_counter() - t
    print(f"{name:10s} {dt*1000:8.2f} ms  sorted={out == sorted(data)}")

# Stable multi-key sort on a production log
files = [("WY", "2026-03-02", 12), ("TX", "2026-03-01", 40), ("WY", "2026-03-01", 7)]
print(sorted(files, key=lambda f: (f[0], f[1])))
```

### Quiz

1. Which algorithm has O(n log n) time in the worst case?
- [ ] Quick sort
- [x] Merge sort
- [ ] Insertion sort
> Merge sort always splits in half; quick sort degrades to O(n²) with bad pivots.

2. What does "stable" mean for a sort?
- [x] Equal elements keep their original relative order
- [ ] It never crashes
- [ ] It uses O(1) space
> Stability is what lets you sort by one key and then another to get a multi-level order.

3. Which algorithm does Python's `sorted()` use?
- [ ] Quick sort
- [ ] Heap sort
- [x] Timsort
> Timsort combines merge sort with insertion sort on small runs and exploits existing order.

4. When is counting sort a good choice?
- [x] When the values are integers in a small known range
- [ ] When the data is strings
- [ ] When memory is extremely limited
> It runs in O(n + k) but needs an array of size k, so k must be small.

### Exercises

1. **Sort by frequency** — Sort the characters of a string so the most frequent come first: `"tree"` → `"eert"` or `"eetr"`.
<details><summary>Solution</summary>

```python
from collections import Counter
def frequency_sort(s):
    c = Counter(s)
    return "".join(sorted(s, key=lambda ch: (-c[ch], ch)))
print(frequency_sort("tree"))   # eert
# O(n log n); the key tuple sorts by count descending then by character
```

</details>

2. **Merge k sorted lists** — Given several sorted lists, merge them into one sorted list efficiently.
<details><summary>Solution</summary>

```python
import heapq
def merge_k(lists):
    return list(heapq.merge(*lists))
# heapq.merge is O(N log k) where N is the total items and k the number of lists.
# Manual version: push (value, list_index, item_index) tuples on a heap and pop the smallest.
print(merge_k([[1, 4, 9], [2, 3], [0, 10]]))
```

</details>

3. **In-place quick sort** — Implement quick sort with Lomuto partition, sorting the list in place.
<details><summary>Solution</summary>

```python
def quick_sort_inplace(a, lo=0, hi=None):
    if hi is None: hi = len(a) - 1
    if lo >= hi: return a
    pivot, i = a[hi], lo
    for j in range(lo, hi):
        if a[j] < pivot:
            a[i], a[j] = a[j], a[i]; i += 1
    a[i], a[hi] = a[hi], a[i]
    quick_sort_inplace(a, lo, i - 1)
    quick_sort_inplace(a, i + 1, hi)
    return a
print(quick_sort_inplace([5, 2, 9, 1, 5, 6]))
```

</details>

### Interview Questions

**Q: Compare merge sort and quick sort. Which would you choose?**
Both are O(n log n) on average. Merge sort guarantees O(n log n) in the worst case and is stable, but needs O(n) extra memory. Quick sort is in place with O(log n) stack, has better cache behaviour and lower constants, but degrades to O(n²) on adversarial pivots and is not stable. For general-purpose sorting in memory, a well-implemented quick sort or introsort is usually fastest, which is why C's `qsort` and C++'s `std::sort` use variants of it. When stability matters, such as sorting a report by state while preserving date order, or when the data is on disk and must be merged in chunks, merge sort wins. In Python I just call `sorted`, which is a stable merge-based Timsort.

**Q: Why is Timsort a good choice for a language's default sort?**
Real data is rarely random: logs are mostly in time order, exports are grouped, a list edited by a user is nearly sorted. Timsort scans for existing ascending or descending runs, extends short runs with insertion sort to a minimum of about 32 elements, and merges runs with a galloping mode that skips ahead when one run is consistently smaller. That gives O(n) on already-sorted data, O(n log n) worst case, stability, and very few comparisons, which matters in Python where each comparison is a relatively expensive method call. It was written by Tim Peters for CPython 2.3 in 2002 and later adopted by Java and Android.

**Q: Can you sort faster than O(n log n)?**
Any sort based purely on comparing pairs needs Ω(n log n) comparisons, because n! orderings must be distinguished and each comparison halves the possibilities. Non-comparison sorts sidestep this by using the structure of the keys: counting sort is O(n + k) for integers in range k, radix sort is O(d × n) for d-digit keys, and bucket sort is near-linear for uniformly distributed floats. So sorting a million QA scores between 0 and 100 is O(n) with counting sort. The trade-off is memory proportional to the key range and the fact that the keys must be integers or fixed-length strings, not arbitrary objects.

**Q: What does the `key` argument do and why is it better than `cmp`?**
`key` maps each element to a sort key once, so for n elements there are n key calls and then O(n log n) cheap comparisons on the precomputed keys. The old `cmp` function was called on every comparison, O(n log n) times, each an expensive Python call, and it was removed in Python 3. If you have legacy comparison logic, `functools.cmp_to_key` wraps it, but a tuple key such as `key=lambda r: (r.state, -r.pages)` is nearly always clearer and faster. The negation trick handles descending order for numbers, and for strings you use two stable sort passes instead.

## Searching & binary search

**Searching** means finding an item, or the position where it should be. Linear search works on anything and costs O(n). **Binary search** works only on sorted data but costs O(log n), which is the difference between a million steps and twenty. It is also one of the most bug-prone algorithms ever written, so the goal of this chapter is to make you write it correctly every time.

### Linear search

```python
def linear_search(a, target):
    for i, x in enumerate(a):
        if x == target:
            return i
    return -1
```

Use it when the data is unsorted, small, or you only search once. `list.index` and `in` do this for you.

### Binary search on a sorted list

Compare the target with the middle element. If equal, done. If the target is smaller, discard the right half; if larger, discard the left half. Repeat.

```python
def binary_search(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == target:
            return mid
        elif a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

rates = [1.25, 2.00, 2.75, 3.50, 4.10, 5.00]
print(binary_search(rates, 3.50))   # 3
print(binary_search(rates, 3.00))   # -1
```

Each step halves the range, so after log₂ n steps only one element remains. On 40,000 sorted parcel numbers that is 16 comparisons.

### The invariant that keeps it correct

Write down what is always true: **the answer, if it exists, lies in `a[lo..hi]` inclusive**. Every line must preserve that. `lo = mid + 1` is safe because `a[mid]` was too small; `hi = mid - 1` because it was too big. The loop ends when `lo > hi`, meaning the range is empty. Off-by-one bugs come from mixing an inclusive `hi` with `hi = mid` or `while lo < hi`, so pick one convention and stick with it.

### Finding the leftmost position: bisect

Often you do not want "any match" but "the first position where target could be inserted". That is `bisect_left`, and it answers questions such as "how many values are below x", "which rate band does this amount fall in", and "does x exist, and where would it go".

```python
from bisect import bisect_left, bisect_right, insort

bands = [0, 50_000, 100_000, 250_000, 500_000]      # premium band lower limits
def band_for(amount):
    return bisect_right(bands, amount) - 1

print(band_for(75_000))      # 1
print(band_for(500_000))     # 4
print(bisect_left([1, 2, 2, 2, 3], 2))   # 1  first 2
print(bisect_right([1, 2, 2, 2, 3], 2))  # 4  one past last 2
```

`bisect_left` returns the first index with `a[i] >= x`; `bisect_right` returns the first index with `a[i] > x`. The count of `x` in a sorted list is therefore `bisect_right - bisect_left` in O(log n). `insort` inserts while keeping order, though the insert itself is O(n) because of shifting.

### Binary search on the answer

The most powerful use of binary search is not on an array at all. If a yes/no question is **monotonic** (false, false, ..., true, true), you can binary-search for the boundary. Example: what is the minimum reading speed so that a 767-page handbook can be reviewed in 5 days, if each day's pages must be a whole-day chunk?

```python
def min_speed(pages_per_chapter, days):
    def feasible(speed):
        need, day_pages = 1, 0
        for p in pages_per_chapter:
            if day_pages + p > speed:
                need += 1; day_pages = 0
            day_pages += p
        return need <= days
    lo, hi = max(pages_per_chapter), sum(pages_per_chapter)
    while lo < hi:
        mid = (lo + hi) // 2
        if feasible(mid):
            hi = mid          # mid works; try smaller
        else:
            lo = mid + 1      # mid fails; need bigger
    return lo

print(min_speed([120, 95, 143, 110, 88, 130, 81], 3))   # 299
```

This is the "split array largest sum" / "Koko eating bananas" pattern: O(n log(range)). Here the loop uses `lo < hi` with `hi = mid`, the convention for "find the smallest value that satisfies".

### Searching a rotated sorted list

A sorted list rotated at an unknown pivot, like `[4,5,6,7,0,1,2]`, is still binary-searchable: one half is always properly sorted, so check which half is sorted and whether the target is inside it.

```python
def search_rotated(a, t):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == t:
            return mid
        if a[lo] <= a[mid]:                       # left half sorted
            if a[lo] <= t < a[mid]: hi = mid - 1
            else:                   lo = mid + 1
        else:                                     # right half sorted
            if a[mid] < t <= a[hi]: lo = mid + 1
            else:                   hi = mid - 1
    return -1
```

| Situation | Tool | Cost |
|---|---|---|
| Unsorted, one search | linear scan, `in` | O(n) |
| Unsorted, many searches | build a set or dict | O(n) build, O(1) each |
| Sorted, many searches | `bisect` | O(log n) each |
| Monotonic yes/no over a range | binary search on the answer | O(log range × check) |

> **Interview note:** In languages with fixed-width integers, `(lo + hi) // 2` can overflow; the safe form is `lo + (hi - lo) // 2`. Python integers do not overflow, but mentioning the issue shows you know the classic bug that lived in Java's `Arrays.binarySearch` for nine years.

### Try It Yourself

```python
from bisect import bisect_left, bisect_right

def binary_search(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == target: return mid
        if a[mid] < target:  lo = mid + 1
        else:                hi = mid - 1
    return -1

parcels = sorted([10482, 10007, 10930, 10215, 10777, 10333, 10099])
print(parcels)
print("10777 at index", binary_search(parcels, 10777))
print("10500 at index", binary_search(parcels, 10500))

# Premium bands with bisect
bands = [0, 50_000, 100_000, 250_000, 500_000]
for amount in (25_000, 75_000, 250_000, 999_999):
    print(f"amount {amount:>8,} -> band {bisect_right(bands, amount) - 1}")

# Count occurrences in a sorted list in O(log n)
scores = [60, 71, 88, 88, 88, 92, 95]
print("88 appears", bisect_right(scores, 88) - bisect_left(scores, 88), "times")
```

### Quiz

1. Binary search requires the data to be:
- [x] Sorted
- [ ] Unique
- [ ] Stored in a linked list
> Halving only works if you can tell which half the target is in by comparing with the middle.

2. How many steps does binary search need for 1,000,000 elements?
- [ ] About 1,000
- [x] About 20
- [ ] About 500,000
> log₂(1,000,000) ≈ 19.9, so at most 20 halvings.

3. What does `bisect_left([1,3,3,5], 3)` return?
- [x] 1
- [ ] 2
- [ ] 3
> `bisect_left` gives the first index whose value is >= 3.

4. "Binary search on the answer" requires the feasibility check to be:
- [ ] Recursive
- [x] Monotonic
- [ ] O(1)
> If the answers form a pattern like false...false true...true, the boundary can be found by halving.

### Exercises

1. **First bad version** — Versions 1..n; once a version is bad, all later ones are bad. Given `is_bad(v)`, find the first bad version with the fewest calls.
<details><summary>Solution</summary>

```python
def first_bad(n, is_bad):
    lo, hi = 1, n
    while lo < hi:
        mid = (lo + hi) // 2
        if is_bad(mid): hi = mid
        else:           lo = mid + 1
    return lo

print(first_bad(10, lambda v: v >= 7))   # 7, in about 4 calls
```

</details>

2. **Square root by binary search** — Compute `int(sqrt(x))` without `math.sqrt`.
<details><summary>Solution</summary>

```python
def isqrt(x):
    lo, hi = 0, x
    while lo < hi:
        mid = (lo + hi + 1) // 2      # round up so lo can advance
        if mid * mid <= x: lo = mid
        else:              hi = mid - 1
    return lo

print(isqrt(17), isqrt(16), isqrt(1_000_000))   # 4 4 1000
```

</details>

3. **Find the peak** — A list rises then falls. Find the index of the maximum in O(log n).
<details><summary>Solution</summary>

```python
def peak(a):
    lo, hi = 0, len(a) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] < a[mid + 1]: lo = mid + 1   # still rising
        else:                   hi = mid       # peak is here or left
    return lo

print(peak([1, 3, 8, 12, 9, 4]))   # 3
```

</details>

### Interview Questions

**Q: Implement binary search and explain the common bugs.**
Keep `lo` and `hi` as an inclusive range, loop while `lo <= hi`, compute `mid`, and move `lo = mid + 1` or `hi = mid - 1` depending on the comparison. The three classic bugs are: an infinite loop from `hi = mid` combined with `lo <= hi`, because when `lo == hi == mid` nothing changes; an off-by-one where the last element is never checked because `hi = len(a)` is paired with `lo <= hi`; and integer overflow of `lo + hi` in fixed-width languages, fixed with `lo + (hi - lo) // 2`. My habit is to state the invariant, "the target, if present, is in a[lo..hi]", and to check each update against it.

**Q: What is the difference between `bisect_left` and `bisect_right`?**
Both binary-search a sorted list for an insertion point that keeps it sorted. `bisect_left` returns the position before any existing equal elements, so it is the index of the first element `>= x`; `bisect_right` returns the position after them, the first element `> x`. For a list of premium bands, `bisect_right(bands, amount) - 1` gives the band an amount falls into when the band boundary itself belongs to the higher band. Their difference counts how many times x appears, and `bisect_left(a, x) < len(a) and a[i] == x` is an O(log n) membership test.

**Q: When can you apply binary search to something that is not a sorted array?**
Whenever there is a monotonic predicate over an ordered range: as the candidate value increases, the answer to "is this feasible" flips from no to yes exactly once. Examples are the smallest capacity that ships all packages within D days, the smallest reading speed to finish a handbook in k days, the first failing build in a commit history (`git bisect`), and the largest square that fits. You binary-search the candidate range and call the O(n) feasibility check at each step, giving O(n log range). The key skill is recognising the monotonicity and choosing the correct bounds.

**Q: How would you search efficiently in a very large sorted file on disk?**
If the records are fixed-width, seek directly to byte offset `mid * record_size` and binary-search the file itself in O(log n) reads without loading it. If they are variable-length lines, seek to a byte offset, discard the partial line, and read the next full line to sample the key. For many searches, build an index: a sorted list of the first key in each block plus the block offset, kept in memory, and `bisect` into it, which is essentially how database B-tree indexes and SQLite's page structure work. For a one-off search on a 767-page text export, though, a linear `grep` is simpler and the disk read dominates anyway.

## Two pointers & sliding window

Many array and string problems that look O(n²) become O(n) once you keep two indexes that move in a disciplined way. **Two pointers** usually start at opposite ends or move at different speeds. A **sliding window** is two pointers that bound a contiguous range which grows and shrinks. Both patterns are built on the same idea: never re-scan what you have already looked at.

### Two pointers from both ends

The classic use is a sorted list. To find two numbers summing to a target, start at both ends: if the sum is too small, move the left pointer right; if too big, move the right pointer left.

```python
def two_sum_sorted(a, target):
    i, j = 0, len(a) - 1
    while i < j:
        s = a[i] + a[j]
        if s == target:
            return i, j
        if s < target:
            i += 1
        else:
            j -= 1
    return None

print(two_sum_sorted([1, 3, 4, 6, 8, 11], 10))   # (2, 3)
```

O(n) time and O(1) space, versus the dictionary version's O(n) space. Each step eliminates one candidate, and no valid pair can be skipped because moving `i` only happens when `a[i]` is too small to pair with anything at or before `j`.

### Container with most water

Given heights, pick two lines that hold the most water. Start with the widest container and always move the shorter side inward, because moving the taller side can never increase the area.

```python
def max_area(h):
    i, j, best = 0, len(h) - 1, 0
    while i < j:
        best = max(best, min(h[i], h[j]) * (j - i))
        if h[i] < h[j]:
            i += 1
        else:
            j -= 1
    return best

print(max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]))   # 49
```

### Fast and slow pointers on the same array

Remove duplicates from a sorted list in place: a `write` pointer marks where the next unique value goes; a `read` pointer scans ahead.

```python
def dedupe_sorted(a):
    if not a:
        return 0
    write = 1
    for read in range(1, len(a)):
        if a[read] != a[write - 1]:
            a[write] = a[read]
            write += 1
    return write            # length of the unique prefix

a = [1, 1, 2, 2, 2, 3]
n = dedupe_sorted(a)
print(a[:n])                # [1, 2, 3]
```

### Fixed-size sliding window

Compute the maximum total of any k consecutive days. Instead of summing each window from scratch (O(n × k)), add the new right element and subtract the element that fell off the left.

```python
def max_window_sum(a, k):
    cur = sum(a[:k])
    best = cur
    for i in range(k, len(a)):
        cur += a[i] - a[i - k]
        best = max(best, cur)
    return best

daily = [120, 95, 143, 110, 88, 130, 101]
print(max_window_sum(daily, 3))   # 358 (120+95+143)
```

O(n) time, O(1) space. Rolling averages, moving sums and "any k consecutive" questions all use this.

### Variable-size sliding window

When the window size is not fixed, expand the right end until a condition breaks, then shrink from the left until it holds again. The state inside the window is usually a counter or a set.

```python
def longest_unique_substring(s):
    last = {}                 # char -> last index seen
    left = best = 0
    for right, ch in enumerate(s):
        if ch in last and last[ch] >= left:
            left = last[ch] + 1          # jump past the previous copy
        last[ch] = right
        best = max(best, right - left + 1)
    return best

print(longest_unique_substring("abcabcbb"))   # 3  ("abc")
print(longest_unique_substring("pwwkew"))     # 3  ("wke")
```

Each pointer only moves forward, so the total work is at most 2n steps.

### Minimum window containing all required characters

The heavyweight of the family: find the shortest substring of `s` that contains every character of `t` (with multiplicity). Keep a counter of what is still needed and shrink whenever the window is valid.

```python
from collections import Counter

def min_window(s, t):
    need = Counter(t)
    missing = len(t)
    left = 0
    best = (0, 0)
    for right, ch in enumerate(s, 1):
        if need[ch] > 0:
            missing -= 1
        need[ch] -= 1
        if missing == 0:                     # window is valid; shrink
            while need[s[left]] < 0:
                need[s[left]] += 1
                left += 1
            if best == (0, 0) or right - left < best[1] - best[0]:
                best = (left, right)
            need[s[left]] += 1              # release one and continue
            missing += 1
            left += 1
    return s[best[0]:best[1]]

print(min_window("ADOBECODEBANC", "ABC"))   # BANC
```

| Pattern | Signal words | Shape |
|---|---|---|
| Opposite ends | sorted, pair, palindrome, container | `i` from left, `j` from right |
| Fast / slow | in place, remove, compact | `read` scans, `write` lags |
| Fixed window | "k consecutive", "moving average" | add right, drop left |
| Variable window | "longest / shortest substring with..." | expand right, shrink left while invalid |

> **Tip:** Before coding a window, write down exactly what state you track inside it (a sum, a count, a Counter) and how that state changes when one element enters and when one leaves. If you can update it in O(1) on both events, the whole algorithm is O(n).

### Try It Yourself

```python
from collections import Counter

def two_sum_sorted(a, target):
    i, j = 0, len(a) - 1
    while i < j:
        s = a[i] + a[j]
        if s == target: return i, j
        if s < target:  i += 1
        else:           j -= 1
    return None

def max_window_sum(a, k):
    cur = best = sum(a[:k])
    for i in range(k, len(a)):
        cur += a[i] - a[i - k]
        best = max(best, cur)
    return best

def longest_unique_substring(s):
    last, left, best = {}, 0, 0
    for right, ch in enumerate(s):
        if ch in last and last[ch] >= left:
            left = last[ch] + 1
        last[ch] = right
        best = max(best, right - left + 1)
    return best

print(two_sum_sorted([1, 3, 4, 6, 8, 11], 10))
print(max_window_sum([120, 95, 143, 110, 88, 130, 101], 3))
print(longest_unique_substring("abcabcbb"), longest_unique_substring("pwwkew"))

# Longest run of days with at most 2 distinct statuses
def longest_k_distinct(items, k):
    count, left, best = Counter(), 0, 0
    for right, x in enumerate(items):
        count[x] += 1
        while len(count) > k:
            count[items[left]] -= 1
            if count[items[left]] == 0: del count[items[left]]
            left += 1
        best = max(best, right - left + 1)
    return best
print(longest_k_distinct(list("AABCCCAABB"), 2))   # 5 ("CCCAA")
```

### Quiz

1. Why is the two-pointer two-sum on a sorted list O(n)?
- [x] Each step moves one pointer inward, so at most n steps happen
- [ ] It uses a hash map
- [ ] It sorts the list first
> The pointers only move toward each other and stop when they meet.

2. In a fixed-size sliding window, what happens when the window moves one step right?
- [x] Add the new element on the right and subtract the one leaving on the left
- [ ] Recompute the whole window
- [ ] Sort the window
> That O(1) update is what makes the whole pass O(n) instead of O(n × k).

3. In the longest-unique-substring algorithm, why does the left pointer never move backwards?
- [x] Because any window starting earlier would still contain the repeated character
- [ ] Because the string is sorted
- [ ] Because the dictionary is cleared
> Moving left back would re-include the duplicate; only forward moves can restore validity.

4. In "container with most water", which pointer do you move?
- [ ] Always the left one
- [x] The one at the shorter line
- [ ] Both together
> Moving the taller line can only reduce the width without raising the limiting height.

### Exercises

1. **Three sum** — Find all unique triplets in a list that sum to zero.
<details><summary>Solution</summary>

```python
def three_sum(nums):
    nums.sort(); out = []
    for i in range(len(nums) - 2):
        if i and nums[i] == nums[i - 1]: continue        # skip duplicate anchors
        j, k = i + 1, len(nums) - 1
        while j < k:
            s = nums[i] + nums[j] + nums[k]
            if s < 0:   j += 1
            elif s > 0: k -= 1
            else:
                out.append([nums[i], nums[j], nums[k]])
                j += 1
                while j < k and nums[j] == nums[j - 1]: j += 1
    return out
print(three_sum([-1, 0, 1, 2, -1, -4]))   # [[-1, -1, 2], [-1, 0, 1]]
# O(n^2): sort once, then two pointers for each anchor
```

</details>

2. **Max consecutive ones with k flips** — Longest run of 1s if you may flip at most k zeros: `[1,1,0,0,1,1,1,0,1]`, k=2 → 7.
<details><summary>Solution</summary>

```python
def longest_ones(a, k):
    left = zeros = best = 0
    for right, x in enumerate(a):
        if x == 0: zeros += 1
        while zeros > k:
            if a[left] == 0: zeros -= 1
            left += 1
        best = max(best, right - left + 1)
    return best
print(longest_ones([1, 1, 0, 0, 1, 1, 1, 0, 1], 2))   # 7
```

</details>

3. **Squares of a sorted array** — Given a sorted list with negatives, return the sorted squares in O(n).
<details><summary>Solution</summary>

```python
def sorted_squares(a):
    out = [0] * len(a)
    i, j = 0, len(a) - 1
    for w in range(len(a) - 1, -1, -1):        # fill from the largest
        if abs(a[i]) > abs(a[j]):
            out[w] = a[i] ** 2; i += 1
        else:
            out[w] = a[j] ** 2; j -= 1
    return out
print(sorted_squares([-4, -1, 0, 3, 10]))   # [0, 1, 9, 16, 100]
```

</details>

### Interview Questions

**Q: What is the sliding window technique and when does it apply?**
It maintains a contiguous range [left, right] over an array or string and updates some summary of the range in O(1) as elements enter on the right and leave on the left. It applies when the problem asks about contiguous subarrays or substrings and the property being tracked, such as a sum, a distinct count or a character multiset, can be updated incrementally. Fixed windows answer "best k consecutive"; variable windows answer "longest or shortest range satisfying a condition", expanding until the condition breaks and shrinking until it holds. Because both pointers only move forward, the total is O(n), replacing the O(n²) or O(n³) brute force.

**Q: When do two pointers work and when do they fail?**
Two pointers from opposite ends work when the data is sorted or otherwise monotonic so that a comparison tells you unambiguously which pointer to move, for example pair sums on a sorted list or the container-with-most-water argument. They fail when moving a pointer could skip a better answer, which happens on unsorted input for sum problems; there you need a hash map instead. The fast/slow variant works on any array for in-place compaction because the write pointer never overtakes the read pointer. The honest test is whether you can prove that the discarded candidate could never be part of the answer.

**Q: Explain the minimum window substring algorithm and its complexity.**
Keep a counter of characters still needed from `t` and a count of how many are missing. Expand `right` and decrement the need for each character; when missing reaches zero the window is valid. Then advance `left` while the character at `left` has a negative need, meaning it is surplus, and record the window if it is the shortest so far. Release the character at `left`, increment missing, and continue expanding. Each character enters and leaves at most once, so the time is O(|s| + |t|) and the space is O(|t|) for the counter. The trap is forgetting multiplicity: `t = "AABC"` needs two A's, which is why we count rather than use a set.

**Q: How would you find the longest substring with at most k distinct characters?**
Slide a window with a Counter of characters inside it. Expand `right`, adding the new character; while the Counter has more than k keys, remove the character at `left`, deleting the key when its count hits zero, and advance `left`. After each expansion record `right - left + 1`. Time is O(n) because each index enters and leaves once, and space is O(k) for the counter. The same skeleton solves "fruit into baskets" (k=2), "longest substring with at most k replacements" and, with a sum instead of a counter, "smallest subarray with sum at least S".

# LEVEL: Advanced

## Trees & binary search trees

A **tree** is a hierarchy of nodes: one **root**, and every other node has exactly one **parent**. Nodes without children are **leaves**. A document's heading structure, a folder tree, an org chart of a 20-agent team, and the XML inside a DOCX are all trees. A **binary tree** limits each node to at most two children, called left and right.

### Defining a binary tree node

```python
class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val, self.left, self.right = val, left, right

root = TreeNode(8,
    TreeNode(3, TreeNode(1), TreeNode(6)),
    TreeNode(10, None, TreeNode(14)))
```

### Vocabulary you will be tested on

| Term | Meaning |
|---|---|
| Depth of a node | edges from the root to it |
| Height of a tree | edges on the longest root-to-leaf path |
| Balanced | left and right heights differ by at most 1 at every node |
| Complete | every level full except possibly the last, filled left to right |
| Full | every node has 0 or 2 children |
| Perfect | full and all leaves at the same depth: 2^(h+1) − 1 nodes |

### Recursive shape of every tree algorithm

Because a subtree is itself a tree, most tree functions are three lines: handle the empty tree, recurse on children, combine.

```python
def height(node):
    if node is None:
        return -1
    return 1 + max(height(node.left), height(node.right))

def count(node):
    return 0 if node is None else 1 + count(node.left) + count(node.right)

def max_value(node):
    if node is None:
        return float("-inf")
    return max(node.val, max_value(node.left), max_value(node.right))
```

Each visits every node once: O(n) time, O(h) stack space where h is the height.

### Binary search trees

A **binary search tree (BST)** adds an ordering rule: every value in the left subtree is smaller than the node, every value in the right subtree is larger. That rule makes search, insert and delete O(h), which is O(log n) when the tree is balanced.

```python
def search(node, target):
    while node and node.val != target:
        node = node.left if target < node.val else node.right
    return node

def insert(node, val):
    if node is None:
        return TreeNode(val)
    if val < node.val:
        node.left = insert(node.left, val)
    elif val > node.val:
        node.right = insert(node.right, val)
    return node
```

The tree above (8, 3, 10, 1, 6, 14) is a valid BST. Searching for 6 goes 8 → 3 → 6: three comparisons instead of six.

### Deleting from a BST

Three cases: a leaf is simply removed; a node with one child is replaced by that child; a node with two children is replaced by its **in-order successor** (the smallest value in its right subtree), and that successor is deleted from the right subtree.

```python
def delete(node, val):
    if node is None:
        return None
    if val < node.val:
        node.left = delete(node.left, val)
    elif val > node.val:
        node.right = delete(node.right, val)
    else:
        if node.left is None:  return node.right
        if node.right is None: return node.left
        succ = node.right
        while succ.left:
            succ = succ.left
        node.val = succ.val
        node.right = delete(node.right, succ.val)
    return node
```

### Validating a BST

The classic trap is checking only that each child is on the correct side of its parent. A node deep in the left subtree must be smaller than *every* ancestor it is left of, so pass down a valid range.

```python
def is_bst(node, lo=float("-inf"), hi=float("inf")):
    if node is None:
        return True
    if not (lo < node.val < hi):
        return False
    return is_bst(node.left, lo, node.val) and is_bst(node.right, node.val, hi)
```

### The balance problem

Insert 1, 2, 3, 4, 5 in order and the BST becomes a linked list of height n−1, so every operation is O(n). Self-balancing trees (AVL, red-black) rotate nodes on insert and delete to keep height O(log n). Python has no built-in balanced BST; the standard workarounds are a sorted list with `bisect` (O(log n) search, O(n) insert) or the third-party `sortedcontainers` package. Databases use B-trees, a wide, shallow cousin optimised for disk pages.

| Operation | Balanced BST | Unbalanced BST worst | Sorted list + bisect | Hash map |
|---|---|---|---|---|
| Search | O(log n) | O(n) | O(log n) | O(1) |
| Insert | O(log n) | O(n) | O(n) | O(1) |
| Min / max | O(log n) | O(n) | O(1) | O(n) |
| Range query | O(log n + k) | O(n) | O(log n + k) | O(n) |
| Sorted iteration | O(n) | O(n) | O(n) | O(n log n) |

A BST beats a hash map when you need order: "all files closed between these two dates", "the next larger rate band", "the k smallest values".

> **Interview note:** State the height assumption every time you give a BST complexity. "O(log n) if balanced, O(n) worst case" is the expected phrasing, and it opens the door for you to mention AVL or red-black trees.

### Try It Yourself

```python
class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val, self.left, self.right = val, left, right

def insert(node, val):
    if node is None: return TreeNode(val)
    if val < node.val:   node.left = insert(node.left, val)
    elif val > node.val: node.right = insert(node.right, val)
    return node

def height(node):
    return -1 if node is None else 1 + max(height(node.left), height(node.right))

def inorder(node):
    return [] if node is None else inorder(node.left) + [node.val] + inorder(node.right)

def is_bst(node, lo=float("-inf"), hi=float("inf")):
    if node is None: return True
    return lo < node.val < hi and is_bst(node.left, lo, node.val) and is_bst(node.right, node.val, hi)

root = None
for v in [8, 3, 10, 1, 6, 14, 4, 7, 13]:
    root = insert(root, v)
print("in-order (sorted):", inorder(root))
print("height:", height(root), "is BST:", is_bst(root))

chain = None
for v in range(1, 8):
    chain = insert(chain, v)
print("height after sorted inserts:", height(chain), "(degenerates to a list)")
```

### Quiz

1. In a BST, where are values smaller than the root?
- [x] In the left subtree
- [ ] In the right subtree
- [ ] At the leaves only
> The ordering rule applies recursively: left subtree smaller, right subtree larger.

2. What is the worst-case search time in an unbalanced BST?
- [ ] O(log n)
- [x] O(n)
- [ ] O(1)
> Inserting sorted data produces a chain, so a search may visit every node.

3. When deleting a node with two children, what replaces it?
- [ ] Its parent
- [x] Its in-order successor (smallest value in the right subtree)
- [ ] Any leaf
> The successor preserves the BST ordering; the in-order predecessor also works.

4. Why does checking only parent-child order fail to validate a BST?
- [x] A node must satisfy bounds set by all its ancestors, not just its parent
- [ ] Because trees can have cycles
- [ ] Because the root has no parent
> A value 9 under 3's right child, with root 8, is "correct" locally but violates the global rule.

### Exercises

1. **Lowest common ancestor in a BST** — Given two values, find the deepest node that has both as descendants.
<details><summary>Solution</summary>

```python
def lca_bst(node, a, b):
    while node:
        if a < node.val and b < node.val:   node = node.left
        elif a > node.val and b > node.val: node = node.right
        else:                               return node
    return None
# O(h): the first node that splits the two values (or equals one) is the LCA.
```

</details>

2. **Sorted array to balanced BST** — Build a height-balanced BST from a sorted list.
<details><summary>Solution</summary>

```python
def build(a):
    if not a: return None
    mid = len(a) // 2
    return TreeNode(a[mid], build(a[:mid]), build(a[mid + 1:]))
# Choosing the middle element as root keeps both halves within one node of each other.
# O(n) nodes created; O(n log n) with slicing, O(n) if you pass indexes instead.
```

</details>

3. **k-th smallest element** — Return the k-th smallest value in a BST without building the full in-order list.
<details><summary>Solution</summary>

```python
def kth_smallest(root, k):
    stack, node = [], root
    while True:
        while node:
            stack.append(node); node = node.left
        node = stack.pop()
        k -= 1
        if k == 0: return node.val
        node = node.right
# Iterative in-order traversal that stops early: O(h + k).
```

</details>

### Interview Questions

**Q: What is a binary search tree and what are its complexities?**
A BST is a binary tree where every node's left subtree holds smaller values and right subtree holds larger values. Search, insert and delete each follow one root-to-leaf path, so they cost O(h) where h is the height: O(log n) if the tree is balanced, O(n) if it has degenerated into a chain, which happens when you insert already-sorted data. In-order traversal yields the values in sorted order in O(n), which is what makes BSTs useful for range queries and ordered iteration that a hash map cannot do. Production systems use self-balancing variants such as red-black trees (Java's `TreeMap`, C++ `std::map`) or B-trees in databases.

**Q: How do self-balancing trees keep O(log n) height?**
AVL trees store each node's height and, after an insert or delete, walk back up checking that the left and right heights differ by at most one; when they differ by two, a single or double rotation restores the balance in O(1) per rotation. Red-black trees use colour bits and looser rules (no two consecutive reds, equal black height on every path), which guarantee height at most 2 log n with fewer rotations, so they favour insert-heavy workloads while AVL favours lookup-heavy ones. Both give O(log n) for all operations. In an interview I would not code the rotations from memory but I would draw a right rotation and explain that it moves the left child up and re-attaches its right subtree.

**Q: How would you check whether a binary tree is a valid BST?**
Recursively pass down the allowed open interval (lo, hi) for each node: the root gets (−∞, +∞), the left child gets (lo, node.val) and the right child gets (node.val, hi). A node is valid if its value lies strictly inside its interval and both subtrees are valid. This is O(n) time and O(h) space. The alternative is an in-order traversal checking that each value is strictly greater than the previous one, which is also O(n) and catches the same cases. The common wrong answer compares each node only with its immediate children, which misses a value in the left subtree that is larger than a grandparent.

**Q: When would you use a BST instead of a hash map?**
When order matters. A hash map gives O(1) lookups but no notion of "next", "previous", "smallest", or "between". A balanced BST gives O(log n) lookups plus O(log n) minimum and maximum, predecessor and successor, and O(log n + k) range queries, and iterating it yields sorted output. Rate-band lookups ("which band is this amount in"), leaderboards, interval scheduling and event calendars are BST-shaped. In Python, since there is no built-in balanced tree, I would reach for `bisect` on a sorted list for mostly-read data or the `sortedcontainers` package when inserts are frequent.

## Tree traversals & recursion on trees

To do anything useful with a tree you must **visit every node** in some order. There are two families: **depth-first** traversals, which go as deep as possible before backtracking, and **breadth-first** (level-order) traversal, which visits level by level. Each order answers a different kind of question, and interviewers expect you to produce all of them both recursively and iteratively.

### The three depth-first orders

For a node with value V, left subtree L and right subtree R:

| Order | Visit sequence | Typical use |
|---|---|---|
| Pre-order | V, L, R | copy a tree, serialise, print a folder outline |
| In-order | L, V, R | sorted output from a BST |
| Post-order | L, R, V | delete a tree, compute sizes, evaluate expression trees |

```python
def preorder(node, out):
    if node:
        out.append(node.val)
        preorder(node.left, out)
        preorder(node.right, out)

def inorder(node, out):
    if node:
        inorder(node.left, out)
        out.append(node.val)
        inorder(node.right, out)

def postorder(node, out):
    if node:
        postorder(node.left, out)
        postorder(node.right, out)
        out.append(node.val)
```

For the BST `8 (3 (1, 6), 10 (-, 14))`: pre-order is `8 3 1 6 10 14`, in-order is `1 3 6 8 10 14`, post-order is `1 6 3 14 10 8`. All are O(n) time and O(h) stack space.

### Iterative traversals with an explicit stack

Deep trees can overflow Python's recursion limit, and some interviewers ask for the iterative version. Pre-order is easy: push the root, then pop, visit, push right then left (so left is processed first).

```python
def preorder_iter(root):
    out, stack = [], [root] if root else []
    while stack:
        node = stack.pop()
        out.append(node.val)
        if node.right: stack.append(node.right)
        if node.left:  stack.append(node.left)
    return out

def inorder_iter(root):
    out, stack, node = [], [], root
    while stack or node:
        while node:                 # go as far left as possible
            stack.append(node)
            node = node.left
        node = stack.pop()
        out.append(node.val)
        node = node.right
    return out
```

### Level-order with a queue (BFS)

```python
from collections import deque

def level_order(root):
    if not root:
        return []
    levels, q = [], deque([root])
    while q:
        size = len(q)                     # nodes on this level
        level = []
        for _ in range(size):
            node = q.popleft()
            level.append(node.val)
            if node.left:  q.append(node.left)
            if node.right: q.append(node.right)
        levels.append(level)
    return levels
# [[8], [3, 10], [1, 6, 14]]
```

Taking `len(q)` at the start of each round is the trick that separates levels. This pattern answers "right side view" (last value of each level), "minimum depth" (first level with a leaf) and "zigzag order".

### Recursion on trees: return what the parent needs

The skill in tree problems is deciding what each recursive call should return to its parent. Some examples:

**Maximum depth** returns a height:

```python
def max_depth(node):
    return 0 if not node else 1 + max(max_depth(node.left), max_depth(node.right))
```

**Path sum** returns whether a root-to-leaf path with a given total exists:

```python
def has_path_sum(node, target):
    if not node:
        return False
    if not node.left and not node.right:
        return node.val == target
    rest = target - node.val
    return has_path_sum(node.left, rest) or has_path_sum(node.right, rest)
```

**Diameter** (longest path between any two nodes) returns a height to the parent but updates a global best with the sum of both child heights:

```python
def diameter(root):
    best = 0
    def height(node):
        nonlocal best
        if not node:
            return 0
        l, r = height(node.left), height(node.right)
        best = max(best, l + r)
        return 1 + max(l, r)
    height(root)
    return best
```

This "return one thing, record another" shape also solves maximum path sum, balanced-tree checking and longest univalue path.

### Same tree, symmetric tree, invert

```python
def same(a, b):
    if not a or not b:
        return a is b
    return a.val == b.val and same(a.left, b.left) and same(a.right, b.right)

def invert(node):
    if node:
        node.left, node.right = invert(node.right), invert(node.left)
    return node

def is_symmetric(root):
    def mirror(a, b):
        if not a or not b:
            return a is b
        return a.val == b.val and mirror(a.left, b.right) and mirror(a.right, b.left)
    return mirror(root, root)
```

### Serialising a tree

Pre-order with explicit `None` markers is enough to rebuild a binary tree exactly, which is how you would store a document outline or send a tree over JSON.

```python
def serialize(node):
    return "#" if not node else f"{node.val},{serialize(node.left)},{serialize(node.right)}"

def deserialize(s):
    it = iter(s.split(","))
    def build():
        v = next(it)
        if v == "#":
            return None
        return TreeNode(int(v), build(), build())
    return build()
```

> **Tip:** When a tree question stumps you, ask "what would I need from my left child and my right child to answer for myself?" Write that as the return value, handle `None` first, and the recursion writes itself.

### Try It Yourself

```python
from collections import deque

class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val, self.left, self.right = val, left, right

root = TreeNode(8, TreeNode(3, TreeNode(1), TreeNode(6, TreeNode(4), TreeNode(7))),
                   TreeNode(10, None, TreeNode(14, TreeNode(13))))

def pre(n):  return [] if not n else [n.val] + pre(n.left) + pre(n.right)
def ino(n):  return [] if not n else ino(n.left) + [n.val] + ino(n.right)
def post(n): return [] if not n else post(n.left) + post(n.right) + [n.val]

def levels(root):
    out, q = [], deque([root])
    while q:
        out.append([]);
        for _ in range(len(q)):
            n = q.popleft(); out[-1].append(n.val)
            if n.left: q.append(n.left)
            if n.right: q.append(n.right)
    return out

def diameter(root):
    best = 0
    def h(n):
        nonlocal best
        if not n: return 0
        l, r = h(n.left), h(n.right)
        best = max(best, l + r)
        return 1 + max(l, r)
    h(root); return best

print("pre :", pre(root))
print("in  :", ino(root))
print("post:", post(root))
print("levels:", levels(root))
print("right side view:", [lvl[-1] for lvl in levels(root)])
print("diameter (edges):", diameter(root))
```

### Quiz

1. Which traversal of a BST produces sorted output?
- [ ] Pre-order
- [x] In-order
- [ ] Level-order
> Left subtree (smaller), then node, then right subtree (larger) yields ascending order.

2. In iterative pre-order, why push the right child before the left?
- [x] So the left child is popped and processed first
- [ ] To save memory
- [ ] Because the right subtree is always smaller
> A stack is LIFO; the last pushed (left) is the first popped.

3. What is the purpose of `size = len(q)` in level-order traversal?
- [x] It fixes how many nodes belong to the current level before their children are added
- [ ] It counts the total nodes
- [ ] It prevents infinite loops
> Without it, children enqueued during the round would be mixed into the same level.

4. Post-order is the natural choice for:
- [ ] Printing a folder outline
- [x] Computing subtree sizes or freeing nodes
- [ ] Sorted output
> A node is visited after both children, so their results are available to combine.

### Exercises

1. **Build a tree from pre-order and in-order** — Reconstruct the unique binary tree from its pre-order and in-order sequences.
<details><summary>Solution</summary>

```python
def build(pre, ino):
    if not pre: return None
    root = TreeNode(pre[0])
    k = ino.index(pre[0])                       # left subtree has k nodes
    root.left  = build(pre[1:k + 1], ino[:k])
    root.right = build(pre[k + 1:], ino[k + 1:])
    return root
# Pre-order's first item is the root; in-order splits into left and right parts around it.
# O(n^2) with slicing and index(); O(n) with a dict of in-order positions and index bounds.
```

</details>

2. **Is the tree height-balanced?** — Return True if every node's subtrees differ in height by at most 1, in O(n).
<details><summary>Solution</summary>

```python
def is_balanced(root):
    def h(n):                       # returns height, or -1 if unbalanced below
        if not n: return 0
        l = h(n.left)
        if l < 0: return -1
        r = h(n.right)
        if r < 0: return -1
        return -1 if abs(l - r) > 1 else 1 + max(l, r)
    return h(root) >= 0
# Post-order: each node reports its height and a sentinel for "already failed".
```

</details>

3. **Sum of left leaves** — Add up the values of all leaves that are a left child.
<details><summary>Solution</summary>

```python
def sum_left_leaves(node, is_left=False):
    if not node: return 0
    if not node.left and not node.right:
        return node.val if is_left else 0
    return sum_left_leaves(node.left, True) + sum_left_leaves(node.right, False)
```

</details>

### Interview Questions

**Q: Explain the three DFS traversal orders and give a use for each.**
Pre-order visits the node before its children, so it is used to copy or serialise a tree and to print an outline such as a document's heading hierarchy in reading order. In-order visits left, node, right and on a BST yields sorted values, so it is used for ordered output and for validating a BST by checking that values increase. Post-order visits children before the node, so it is used when a node's answer depends on its subtrees: computing sizes or heights, evaluating an expression tree, or freeing memory bottom-up. All three are O(n) time and O(h) space, and all can be made iterative with an explicit stack, in-order being the trickiest because you must descend fully left before popping.

**Q: How does level-order traversal work and what is its space complexity?**
Use a queue: enqueue the root, then repeatedly dequeue a node, record it, and enqueue its children. To group by level, read the queue's length at the start of each round and process exactly that many nodes. Time is O(n). Space is O(w) where w is the maximum width of the tree, which for a complete binary tree is about n/2 at the bottom level, so worst case O(n), compared with DFS's O(h) which is O(log n) for balanced trees. That difference is why BFS is chosen when you need the shallowest answer, such as minimum depth, and DFS when memory is tight or the answer depends on full paths.

**Q: What does "return what the parent needs" mean in tree recursion?**
Most tree problems are solved by a post-order style function where each call returns a small summary of its subtree that the parent can combine. For maximum depth that summary is a height; for balance checking it is a height or a failure sentinel; for diameter it is a height while a shared variable tracks the best left-plus-right sum seen. Choosing that return value correctly is the whole problem. A typical mistake is returning the final answer from each call when the parent actually needs an intermediate quantity, which is why diameter uses `nonlocal best` alongside a function that returns height.

**Q: How would you serialise and deserialise a binary tree?**
Pre-order traversal with an explicit marker for null children, such as `8,3,1,#,#,6,#,#,10,#,14,#,#`, captures the exact shape because each node is followed by its complete left subtree and then its right. Deserialising consumes tokens with an iterator: read a token, return None if it is the marker, otherwise create the node and recursively build left then right. Both directions are O(n) time and produce O(n) output. Level-order with markers also works and is what LeetCode uses in its examples. For a BST specifically you can drop the markers and rebuild from pre-order alone using value bounds, which is a nice follow-up to mention.

## Heaps & priority queues

A **priority queue** always hands you the most important item next, not the oldest. A **heap** is the standard way to build one: a complete binary tree stored in a flat list where every parent is smaller than (min-heap) or larger than (max-heap) its children. That single rule gives O(1) access to the minimum and O(log n) insert and remove, which is why heaps power schedulers, Dijkstra's algorithm, "top k" reports and merging sorted streams.

### The array layout

A heap is stored in a list with no pointers. For the node at index `i`:

- parent is at `(i - 1) // 2`
- children are at `2i + 1` and `2i + 2`

```text
        1
      /   \
     3     2
    / \   /
   7   4 5
list: [1, 3, 2, 7, 4, 5]
```

Every level is full except the last, which fills left to right, so the list has no gaps.

### heapq: Python's min-heap

```python
import heapq

h = []
for x in [7, 3, 9, 1, 5]:
    heapq.heappush(h, x)          # O(log n) each
print(h[0])                       # 1  peek the minimum, O(1)
print(heapq.heappop(h))           # 1  remove the minimum, O(log n)
print(heapq.heappop(h))           # 3

data = [7, 3, 9, 1, 5]
heapq.heapify(data)               # O(n), in place
print(data[0])                    # 1
```

`heapify` is O(n), not O(n log n), because most nodes are near the bottom and sink only a step or two. The list after `heapify` is a heap, not a sorted list: only `data[0]` is guaranteed to be the minimum.

### How push and pop stay O(log n)

**Push** appends at the end and "sifts up": swap with the parent while smaller. **Pop** moves the last element to the root and "sifts down": swap with the smaller child while larger. Each swap moves one level and the tree has log₂ n levels.

```python
def sift_up(a, i):
    while i > 0:
        p = (i - 1) // 2
        if a[i] < a[p]:
            a[i], a[p] = a[p], a[i]
            i = p
        else:
            break

def sift_down(a, i, n):
    while True:
        l, r, smallest = 2 * i + 1, 2 * i + 2, i
        if l < n and a[l] < a[smallest]: smallest = l
        if r < n and a[r] < a[smallest]: smallest = r
        if smallest == i:
            break
        a[i], a[smallest] = a[smallest], a[i]
        i = smallest
```

### Max-heap and priority with tuples

`heapq` only does min-heaps. For a max-heap, push negated values. For records, push tuples; Python compares them element by element, so put the priority first and add a tie-breaker so that unorderable objects never get compared.

```python
h = []
heapq.heappush(h, (-95, "Hira"))      # highest score first
heapq.heappush(h, (-88, "Bilal"))
print(heapq.heappop(h))               # (-95, 'Hira')

import itertools
counter = itertools.count()
tasks = []
heapq.heappush(tasks, (2, next(counter), {"job": "print"}))
heapq.heappush(tasks, (1, next(counter), {"job": "sign"}))
print(heapq.heappop(tasks)[2])        # {'job': 'sign'}
```

The counter guarantees FIFO order among equal priorities and prevents `TypeError` from comparing dicts.

### Top-k: the heap's signature problem

To find the k largest of n items, keep a min-heap of size k. Push each item; if the heap grows past k, pop the smallest. What remains are the k largest. O(n log k) time and O(k) space, which beats sorting (O(n log n)) when k is small.

```python
def top_k(nums, k):
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k:
            heapq.heappop(h)
    return sorted(h, reverse=True)

print(top_k([88, 92, 71, 95, 60, 99, 84], 3))   # [99, 95, 92]
print(heapq.nlargest(3, [88, 92, 71, 95, 60, 99, 84]))   # same, built in
```

`heapq.nlargest(k, iterable, key=...)` and `nsmallest` implement exactly this and accept a `key` function, so "the 5 agents with the highest QA score" is one line.

### k-th largest and streaming median

**k-th largest in a stream**: keep a min-heap of size k; its root is always the k-th largest so far. **Running median**: keep a max-heap of the lower half and a min-heap of the upper half, balanced to differ by at most one element; the median is a root or the average of both roots. Each new value costs O(log n).

```python
class MedianFinder:
    def __init__(self):
        self.low, self.high = [], []          # max-heap (negated), min-heap
    def add(self, x):
        heapq.heappush(self.low, -x)
        heapq.heappush(self.high, -heapq.heappop(self.low))
        if len(self.high) > len(self.low):
            heapq.heappush(self.low, -heapq.heappop(self.high))
    def median(self):
        if len(self.low) > len(self.high):
            return -self.low[0]
        return (-self.low[0] + self.high[0]) / 2
```

### Heap sort

Heapify, then pop n times: O(n log n), O(1) extra space when done in place, but not stable and slower in practice than Timsort because of poor cache behaviour.

| Task | Tool | Time |
|---|---|---|
| Repeated "give me the smallest" | `heappush` / `heappop` | O(log n) each |
| k largest / smallest | `nlargest` / `nsmallest` | O(n log k) |
| Merge k sorted lists | `heapq.merge` | O(N log k) |
| Full sort | `sorted` | O(n log n) |
| Find only the minimum once | `min` | O(n) |

> **Warning:** Never search or delete from the middle of a heap by value; that is O(n) and breaks the abstraction. The standard trick for "update priority" is lazy deletion: push the new entry and skip stale entries when they surface at the top.

### Try It Yourself

```python
import heapq, itertools

scores = [("Ayesha", 88), ("Bilal", 92), ("Danish", 71), ("Hira", 95),
          ("Kamran", 60), ("Nadia", 99), ("Omar", 84)]

print("top 3:", heapq.nlargest(3, scores, key=lambda s: s[1]))
print("bottom 2:", heapq.nsmallest(2, scores, key=lambda s: s[1]))

# Priority job queue with tie-breaking counter
tick = itertools.count()
jobs = []
for prio, name in [(2, "print handbook"), (1, "sign contract"), (2, "email client"), (3, "archive")]:
    heapq.heappush(jobs, (prio, next(tick), name))
while jobs:
    prio, _, name = heapq.heappop(jobs)
    print(f"priority {prio}: {name}")

# Streaming median
low, high = [], []
for x in [5, 15, 1, 3, 8, 7]:
    heapq.heappush(low, -x)
    heapq.heappush(high, -heapq.heappop(low))
    if len(high) > len(low):
        heapq.heappush(low, -heapq.heappop(high))
    med = -low[0] if len(low) > len(high) else (-low[0] + high[0]) / 2
    print(f"after {x}: median = {med}")
```

### Quiz

1. In a min-heap stored as a list, where are the children of index i?
- [ ] i + 1 and i + 2
- [x] 2i + 1 and 2i + 2
- [ ] i // 2 and i // 2 + 1
> The complete-tree layout puts each level after the previous one, giving the 2i+1 / 2i+2 rule.

2. What is the time complexity of `heapq.heapify`?
- [ ] O(n log n)
- [x] O(n)
- [ ] O(log n)
> Sifting down from the bottom up costs more only for the few nodes near the top, summing to O(n).

3. To find the k largest of n items, which heap do you keep?
- [x] A min-heap of size k
- [ ] A max-heap of size n
- [ ] A max-heap of size k
> The smallest of the k largest sits at the root and is evicted whenever something larger arrives.

4. How do you make `heapq` behave as a max-heap?
- [x] Push negated values (or tuples with negated priorities)
- [ ] Pass `reverse=True`
- [ ] Use `heapq.maxheap()`
> `heapq` has no max-heap mode; negation flips the order.

### Exercises

1. **k closest points to the origin** — Given (x, y) points, return the k nearest to (0, 0) in O(n log k).
<details><summary>Solution</summary>

```python
import heapq
def k_closest(points, k):
    h = []
    for x, y in points:
        heapq.heappush(h, (-(x * x + y * y), x, y))   # max-heap on distance
        if len(h) > k: heapq.heappop(h)
    return [(x, y) for _, x, y in h]
print(k_closest([(1, 3), (-2, 2), (5, 8), (0, 1)], 2))   # [(-2, 2), (0, 1)] in some order
```

</details>

2. **Task scheduler with cooldown** — Given tasks like `["A","A","A","B","B","B"]` and cooldown n=2, compute the minimum time to run all of them (idle slots allowed).
<details><summary>Solution</summary>

```python
from collections import Counter
def least_interval(tasks, n):
    counts = Counter(tasks)
    top = max(counts.values())
    ties = sum(1 for c in counts.values() if c == top)
    return max(len(tasks), (top - 1) * (n + 1) + ties)
print(least_interval(list("AAABBB"), 2))   # 8  -> A B _ A B _ A B
# The greedy heap simulation also works; the formula is the closed form interviewers accept.
```

</details>

3. **Merge k sorted lists manually** — Without `heapq.merge`, merge several sorted lists using a heap of (value, list index, position).
<details><summary>Solution</summary>

```python
import heapq
def merge_k(lists):
    h = [(lst[0], i, 0) for i, lst in enumerate(lists) if lst]
    heapq.heapify(h); out = []
    while h:
        v, i, j = heapq.heappop(h)
        out.append(v)
        if j + 1 < len(lists[i]):
            heapq.heappush(h, (lists[i][j + 1], i, j + 1))
    return out
print(merge_k([[1, 4, 9], [2, 3], [0, 10]]))   # O(N log k)
```

</details>

### Interview Questions

**Q: What is a heap and why is it stored in an array?**
A heap is a complete binary tree in which every parent is ordered relative to its children (smaller for a min-heap). Because the tree is complete, its nodes can be laid out level by level in a plain array with the parent of index i at (i−1)//2 and the children at 2i+1 and 2i+2, which removes all pointer overhead and gives excellent cache locality. Insert appends and sifts up; remove-min swaps the last element into the root and sifts down; both touch one node per level, so O(log n). Peeking at the minimum is O(1). Building a heap from n items is O(n) with the bottom-up heapify, which is a common trick question because people expect O(n log n).

**Q: Why is finding the top k elements with a heap better than sorting?**
Sorting costs O(n log n) and produces information you do not need. A min-heap of size k processes each of the n elements with an O(log k) push and pop, giving O(n log k) time and O(k) space, and it works on a stream where n is unknown or too large for memory. For k = 10 and n = 10 million QA records, that is roughly 33 million operations versus 230 million, and 10 stored items versus 10 million. If k is close to n, sorting is simpler and just as fast, and `heapq.nlargest` actually switches to `sorted` internally when k is large relative to n.

**Q: How would you implement a priority queue that supports changing an item's priority?**
`heapq` has no decrease-key, so the standard approach is lazy deletion: keep a dictionary from item to its current entry, push a new tuple whenever the priority changes, mark the old entry as removed (for example by setting a flag inside a mutable list entry), and when popping, discard entries marked removed until a live one surfaces. Each change is O(log n) and stale entries cost at most one extra pop each. Dijkstra's algorithm uses exactly this pattern, skipping a popped node whose recorded distance is already better. If true decrease-key is required, a Fibonacci heap or an indexed binary heap with a position map is the textbook answer, but lazy deletion is what production Python code does.

**Q: Explain the two-heap median algorithm.**
Maintain a max-heap for the smaller half of the values and a min-heap for the larger half, keeping their sizes equal or letting the low side hold one extra. To add a value, push it to the low heap, then move the low heap's maximum to the high heap, and if the high heap is now bigger, move its minimum back to the low heap; this keeps every element of low at most every element of high. The median is the low root when sizes differ, or the mean of both roots when equal. Each insert is O(log n) and the median is O(1), compared with O(n log n) for re-sorting on every query, which matters for dashboards that show a running median of turnaround times.

## Graphs & BFS/DFS

A **graph** is a set of nodes (**vertices**) connected by **edges**. Cities and roads, web pages and links, tasks and their dependencies: whenever relationships are not a simple hierarchy, you have a graph. A tree is a connected graph with no cycles. Most graph interview problems are solved by two traversals, **breadth-first search (BFS)** and **depth-first search (DFS)**, plus bookkeeping.

### Representing a graph

The **adjacency list** maps each node to its neighbours and is the default representation: O(V + E) space and fast iteration.

```python
from collections import defaultdict

edges = [("A", "B"), ("A", "C"), ("B", "D"), ("C", "D"), ("D", "E")]
graph = defaultdict(list)
for u, v in edges:
    graph[u].append(v)
    graph[v].append(u)            # omit this line for a directed graph
print(dict(graph))
# {'A': ['B','C'], 'B': ['A','D'], 'C': ['A','D'], 'D': ['B','C','E'], 'E': ['D']}
```

An **adjacency matrix** is a V×V grid where `m[u][v]` is 1 (or the weight) if an edge exists: O(1) edge checks but O(V²) space, wasteful for sparse graphs.

| Term | Meaning |
|---|---|
| Directed / undirected | edges have a direction (A→B) or not |
| Weighted | edges carry a cost (distance, time, price) |
| Degree | number of edges at a node |
| Path | sequence of edges between two nodes |
| Cycle | path that returns to its start |
| Connected component | maximal set of nodes reachable from each other |
| DAG | directed acyclic graph, e.g. task dependencies |

### Breadth-first search

BFS explores in rings: all nodes one edge away, then two, then three. It uses a queue and finds the **shortest path in an unweighted graph**.

```python
from collections import deque

def bfs(graph, start):
    dist = {start: 0}
    q = deque([start])
    while q:
        u = q.popleft()
        for v in graph[u]:
            if v not in dist:              # visited check
                dist[v] = dist[u] + 1
                q.append(v)
    return dist

print(bfs(graph, "A"))   # {'A': 0, 'B': 1, 'C': 1, 'D': 2, 'E': 3}
```

Mark a node visited **when you enqueue it**, not when you dequeue it, or the same node can be added many times. O(V + E) time, O(V) space. To recover the path, store `parent[v] = u` and walk back.

### Depth-first search

DFS follows one path as far as it goes, then backtracks. The iterative version swaps the queue for a stack.

```python
def dfs(graph, u, visited=None):
    if visited is None:
        visited = set()
    visited.add(u)
    for v in graph[u]:
        if v not in visited:
            dfs(graph, v, visited)
    return visited

def dfs_iter(graph, start):
    visited, stack = set(), [start]
    while stack:
        u = stack.pop()
        if u in visited:
            continue
        visited.add(u)
        stack.extend(v for v in graph[u] if v not in visited)
    return visited
```

DFS is also O(V + E). Use it for connectivity, cycle detection, topological sorting and backtracking.

### Counting connected components

Run a traversal from every unvisited node and count how many times you had to start.

```python
def count_components(graph, nodes):
    visited, count = set(), 0
    for n in nodes:
        if n not in visited:
            count += 1
            dfs(graph, n, visited)
    return count
```

### Grids are graphs

A 2-D grid is a graph where each cell connects to its four neighbours. Number-of-islands is DFS on a grid; compute neighbours on the fly instead of building an adjacency list.

```python
def num_islands(grid):
    rows, cols = len(grid), len(grid[0])
    seen = set()
    def dfs(r, c):
        if not (0 <= r < rows and 0 <= c < cols) or grid[r][c] != "1" or (r, c) in seen:
            return
        seen.add((r, c))
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            dfs(r + dr, c + dc)
    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1" and (r, c) not in seen:
                count += 1
                dfs(r, c)
    return count
```

### Detecting cycles and topological order

In a **directed** graph, a cycle exists if DFS reaches a node that is currently on the recursion stack, not merely visited. **Topological sort** orders a DAG so every edge points forward; Kahn's algorithm does it with in-degrees and a queue, which is how build systems and document-assembly pipelines order their steps.

```python
def topo_sort(graph, nodes):
    indeg = {n: 0 for n in nodes}
    for u in nodes:
        for v in graph[u]:
            indeg[v] += 1
    q = deque(n for n in nodes if indeg[n] == 0)
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in graph[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return order if len(order) == len(nodes) else None   # None means a cycle
```

### Weighted shortest paths: Dijkstra

When edges have costs, BFS is wrong. Dijkstra uses a min-heap keyed by distance so far and always settles the nearest unsettled node: O((V + E) log V). It does not work with negative edges (use Bellman-Ford).

```python
import heapq
def dijkstra(wgraph, src):
    dist = {src: 0}
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist.get(u, float("inf")):
            continue                        # stale entry
        for v, w in wgraph[u]:
            nd = d + w
            if nd < dist.get(v, float("inf")):
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist
```

> **Interview note:** Say "BFS for shortest path in an unweighted graph, Dijkstra for non-negative weights, Bellman-Ford for negative weights, DFS for cycles and topological order" in one breath. It shows you have a map of the territory.

### Try It Yourself

```python
from collections import defaultdict, deque
import heapq

edges = [("A", "B"), ("A", "C"), ("B", "D"), ("C", "D"), ("D", "E"), ("F", "G")]
g = defaultdict(list)
for u, v in edges:
    g[u].append(v); g[v].append(u)

def bfs_path(g, s, t):
    parent, q = {s: None}, deque([s])
    while q:
        u = q.popleft()
        if u == t:
            path = []
            while u is not None: path.append(u); u = parent[u]
            return path[::-1]
        for v in g[u]:
            if v not in parent: parent[v] = u; q.append(v)
    return None

def components(g, nodes):
    seen, comps = set(), []
    for n in nodes:
        if n in seen: continue
        stack, comp = [n], []
        while stack:
            u = stack.pop()
            if u in seen: continue
            seen.add(u); comp.append(u); stack.extend(g[u])
        comps.append(sorted(comp))
    return comps

print("shortest A->E:", bfs_path(g, "A", "E"))
print("components:", components(g, "ABCDEFG"))

# Dijkstra on a weighted graph (delivery times in minutes)
wg = {"Office": [("Court", 15), ("Bank", 5)], "Bank": [("Court", 5)], "Court": [("Client", 10)], "Client": []}
dist, pq = {"Office": 0}, [(0, "Office")]
while pq:
    d, u = heapq.heappop(pq)
    if d > dist[u]: continue
    for v, w in wg[u]:
        if d + w < dist.get(v, 1e9):
            dist[v] = d + w; heapq.heappush(pq, (d + w, v))
print("fastest times:", dist)
```

### Quiz

1. Which traversal finds the shortest path in an unweighted graph?
- [x] BFS
- [ ] DFS
- [ ] Dijkstra only
> BFS explores nodes in order of distance, so the first time it reaches the target is via a shortest path.

2. When should a node be marked visited in BFS?
- [x] When it is enqueued
- [ ] When it is dequeued
- [ ] After all its neighbours are processed
> Marking on dequeue lets the same node be enqueued multiple times, wasting work and breaking distances.

3. What does a topological sort that returns fewer nodes than the graph has indicate?
- [ ] The graph is undirected
- [x] The graph contains a cycle
- [ ] The graph is disconnected
> Nodes on a cycle never reach in-degree zero, so they are never emitted.

4. Which representation is best for a sparse graph with 100,000 nodes?
- [x] Adjacency list
- [ ] Adjacency matrix
- [ ] Edge list only
> A matrix would need 10¹⁰ cells; an adjacency list stores only the edges that exist.

### Exercises

1. **Course schedule** — Given n courses and prerequisite pairs `(a, b)` meaning b must come before a, return True if all courses can be finished.
<details><summary>Solution</summary>

```python
from collections import defaultdict, deque
def can_finish(n, prereqs):
    g, indeg = defaultdict(list), [0] * n
    for a, b in prereqs:
        g[b].append(a); indeg[a] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    done = 0
    while q:
        u = q.popleft(); done += 1
        for v in g[u]:
            indeg[v] -= 1
            if indeg[v] == 0: q.append(v)
    return done == n
print(can_finish(2, [(1, 0)]), can_finish(2, [(1, 0), (0, 1)]))   # True False
```

</details>

2. **Clone a graph** — Given a node with `val` and `neighbors`, return a deep copy.
<details><summary>Solution</summary>

```python
def clone(node, seen=None):
    if seen is None: seen = {}
    if node in seen: return seen[node]
    copy = type(node)(node.val)
    seen[node] = copy
    copy.neighbors = [clone(nb, seen) for nb in node.neighbors]
    return copy
# The dictionary maps originals to copies so cycles terminate; O(V + E).
```

</details>

3. **Rotting oranges** — In a grid, 2 = rotten, 1 = fresh, 0 = empty. Each minute rot spreads to adjacent fresh oranges. How many minutes until none are fresh, or -1?
<details><summary>Solution</summary>

```python
from collections import deque
def oranges(grid):
    R, C = len(grid), len(grid[0])
    q = deque((r, c, 0) for r in range(R) for c in range(C) if grid[r][c] == 2)
    fresh = sum(row.count(1) for row in grid)
    t = 0
    while q:
        r, c, t = q.popleft()
        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == 1:
                grid[nr][nc] = 2; fresh -= 1; q.append((nr, nc, t + 1))
    return -1 if fresh else t
# Multi-source BFS: seed the queue with every rotten orange at time 0.
```

</details>

### Interview Questions

**Q: Compare BFS and DFS: complexity, memory and when to use each.**
Both are O(V + E) time on an adjacency list. BFS uses a queue and O(V) memory in the worst case (the whole frontier), and it is the tool for shortest paths in unweighted graphs, level-by-level processing and "minimum number of moves" puzzles. DFS uses a stack, recursive or explicit, with memory proportional to the depth of the current path, and it is the tool for cycle detection, topological sorting, connected components and backtracking-style searches that need complete paths. In Python I write recursive DFS for clarity but switch to the iterative form on large graphs to avoid the 1000-frame recursion limit.

**Q: How do you detect a cycle in a directed versus an undirected graph?**
In a directed graph, run DFS with three states per node: unvisited, in progress (on the current recursion path) and finished. Reaching an in-progress node means a back edge and therefore a cycle. Alternatively run Kahn's topological sort and check whether every node was emitted. In an undirected graph, seeing an already-visited neighbour that is not the node you came from indicates a cycle, or you can use a union-find structure and detect an edge whose endpoints are already in the same set. The directed case needs the three-state version because a visited-but-finished node reached again is a cross edge, not a cycle.

**Q: Explain Dijkstra's algorithm and its limitation.**
Dijkstra finds shortest paths from a source in a graph with non-negative edge weights. Keep a min-heap of (distance, node) starting with (0, source); repeatedly pop the closest node, and for each neighbour, if going through this node is shorter than its recorded distance, update the distance and push the new pair. Skip popped entries whose distance is worse than the recorded one; they are stale. With a binary heap the cost is O((V + E) log V). It fails with negative edges because it assumes that once a node is popped its distance is final, which a later negative edge could contradict; Bellman-Ford handles that in O(V × E), and detects negative cycles too.

**Q: What is topological sort and where have you used the idea?**
A topological order lists the nodes of a directed acyclic graph so that every edge goes from earlier to later. Kahn's algorithm computes in-degrees, repeatedly removes a node with in-degree zero and decrements its neighbours; DFS post-order reversed gives the same result. It is O(V + E). Any dependency problem is a topological sort: building a 767-page handbook where the index depends on page numbers, which depend on the TOC, which depends on headings, is exactly this, as are course prerequisites, `make` targets and the order Excel recalculates dependent cells. If the algorithm cannot emit every node, the dependencies contain a cycle, which is the error you report.

## Greedy algorithms

A **greedy algorithm** builds a solution step by step, making the choice that looks best right now and never revisiting it. When that works it is fast and simple. The catch is that it only works when the problem has the **greedy-choice property**: a locally optimal choice is part of some globally optimal solution. Half of the skill is recognising when that holds, and half is knowing when it does not and you need dynamic programming instead.

### The template

1. Sort or organise the input so the "best next choice" is easy to find.
2. Loop, taking the best available choice each time.
3. Argue, at least informally, why that choice never hurts.

### Coin change with canonical coins

For Pakistani rupee coins and notes (1, 2, 5, 10, 20, 50, 100), taking the largest denomination that fits is optimal.

```python
def make_change(amount, coins=(100, 50, 20, 10, 5, 2, 1)):
    result = {}
    for c in coins:
        if amount >= c:
            result[c], amount = divmod(amount, c)
    return result

print(make_change(188))   # {100: 1, 50: 1, 20: 1, 10: 1, 5: 1, 2: 1, 1: 1}
```

Now try coins (1, 3, 4) and amount 6: greedy takes 4 + 1 + 1 = 3 coins, but 3 + 3 = 2 coins is better. Greedy fails, and the DP chapter fixes it.

### Activity selection (interval scheduling)

Given meetings with start and end times, attend as many as possible. Greedy: always pick the meeting that **ends earliest**, then discard everything that overlaps it.

```python
def max_meetings(intervals):
    intervals.sort(key=lambda iv: iv[1])        # by end time
    count, last_end = 0, float("-inf")
    for start, end in intervals:
        if start >= last_end:
            count += 1
            last_end = end
    return count

print(max_meetings([(1, 4), (3, 5), (0, 6), (5, 7), (3, 9), (5, 9), (6, 10), (8, 11)]))  # 3
```

Why it works: the earliest-ending meeting leaves the most room for the rest, so swapping it for any other first choice can never increase the count. O(n log n) from the sort.

### Merging overlapping intervals

Sort by start; if the next interval starts before the current one ends, extend the current one.

```python
def merge_intervals(iv):
    iv.sort()
    out = [list(iv[0])]
    for s, e in iv[1:]:
        if s <= out[-1][1]:
            out[-1][1] = max(out[-1][1], e)
        else:
            out.append([s, e])
    return out

print(merge_intervals([(1, 3), (2, 6), (8, 10), (9, 12), (15, 18)]))  # [[1,6],[8,12],[15,18]]
```

This shows up as "merge booked time slots" and "combine page ranges in a print job".

### Jump game

From each index you may jump up to `nums[i]` steps. Can you reach the end? Track the farthest index reachable so far.

```python
def can_jump(nums):
    farthest = 0
    for i, n in enumerate(nums):
        if i > farthest:
            return False
        farthest = max(farthest, i + n)
    return True

print(can_jump([2, 3, 1, 1, 4]), can_jump([3, 2, 1, 0, 4]))   # True False
```

O(n) time, O(1) space. The minimum-jumps version also tracks the end of the current jump range.

### Fractional knapsack versus 0/1 knapsack

With a bag of capacity W and items with value and weight, greedy by value-per-weight ratio is optimal **if you can take fractions** of items. If items are all-or-nothing (0/1 knapsack), greedy fails and DP is required. This distinction is a favourite interview probe.

```python
def fractional_knapsack(items, W):
    items.sort(key=lambda it: it[0] / it[1], reverse=True)   # (value, weight)
    total = 0.0
    for value, weight in items:
        take = min(weight, W)
        total += value * take / weight
        W -= take
        if W == 0:
            break
    return total

print(fractional_knapsack([(60, 10), (100, 20), (120, 30)], 50))   # 240.0
```

### Huffman coding

Repeatedly merge the two least-frequent symbols into one node, using a heap. The resulting prefix code is provably optimal and is part of DEFLATE, which compresses every DOCX, XLSX and PDF stream you produce.

```python
import heapq
def huffman_lengths(freq):
    h = [[f, [sym, 0]] for sym, f in freq.items()]
    heapq.heapify(h)
    while len(h) > 1:
        lo, hi = heapq.heappop(h), heapq.heappop(h)
        for pair in lo[1:]: pair[1] += 1          # depth of every symbol under lo
        for pair in hi[1:]: pair[1] += 1
        heapq.heappush(h, [lo[0] + hi[0]] + lo[1:] + hi[1:])
    return dict(h[0][1:])

print(huffman_lengths({"a": 45, "b": 13, "c": 12, "d": 16, "e": 9, "f": 5}))
# a gets 1 bit, the rare symbols get 4
```

### When greedy fails

| Problem | Greedy works? | Why / what instead |
|---|---|---|
| Coin change, canonical coins | yes | each larger coin dominates combinations of smaller ones |
| Coin change, arbitrary coins | no | DP over amounts |
| Interval scheduling (count) | yes | earliest end time exchange argument |
| Weighted interval scheduling | no | DP with binary search |
| Fractional knapsack | yes | ratio ordering |
| 0/1 knapsack | no | DP over capacity |
| Minimum spanning tree | yes | Kruskal / Prim, cut property |
| Shortest path, non-negative weights | yes | Dijkstra |
| Longest path in a general graph | no | NP-hard |

> **Tip:** In an interview, propose the greedy idea, then immediately try to break it with a tiny counter-example. If you cannot break it in a minute and can sketch an exchange argument ("swapping my choice for the optimal one never makes things worse"), commit. If you break it, say so and move to DP. Interviewers reward the check more than the initial guess.

### Try It Yourself

```python
def max_meetings(intervals):
    intervals = sorted(intervals, key=lambda iv: iv[1])
    chosen, last_end = [], float("-inf")
    for s, e in intervals:
        if s >= last_end:
            chosen.append((s, e)); last_end = e
    return chosen

def merge_intervals(iv):
    iv = sorted(iv); out = [list(iv[0])]
    for s, e in iv[1:]:
        if s <= out[-1][1]: out[-1][1] = max(out[-1][1], e)
        else: out.append([s, e])
    return out

def make_change(amount, coins):
    used = []
    for c in coins:
        while amount >= c:
            amount -= c; used.append(c)
    return used

# Client calls booked for one day (start hour, end hour)
calls = [(9, 10.5), (10, 11), (10.5, 12), (11, 12.5), (13, 14), (13.5, 15), (14, 16)]
print("max non-overlapping calls:", max_meetings(calls))
print("busy blocks:", merge_intervals(calls))
print("change 188 with canonical coins:", make_change(188, (100, 50, 20, 10, 5, 2, 1)))
print("change 6 with coins (4, 3, 1):", make_change(6, (4, 3, 1)), "<- greedy gives 3 coins; optimal is [3, 3]")
```

### Quiz

1. What property must a problem have for a greedy algorithm to be correct?
- [x] A locally optimal choice is always part of some globally optimal solution
- [ ] The input must be sorted
- [ ] There must be no ties
> Without the greedy-choice property, an early choice can rule out the best answer.

2. For interval scheduling, which greedy rule is optimal?
- [ ] Earliest start time
- [ ] Shortest duration
- [x] Earliest end time
> Finishing earliest leaves the maximum room for later meetings; the other rules have counter-examples.

3. Why does greedy coin change fail for coins (1, 3, 4) and amount 6?
- [x] It picks 4 first and is forced into 4+1+1 instead of 3+3
- [ ] Because 6 is even
- [ ] It never fails
> Greedy commits to the largest coin without considering combinations of smaller ones.

4. Which knapsack variant can be solved greedily?
- [x] Fractional knapsack
- [ ] 0/1 knapsack
- [ ] Both
> Taking items by value-per-weight ratio is optimal only when partial items are allowed.

### Exercises

1. **Minimum meeting rooms** — Given meeting intervals, return the minimum number of rooms needed so no two overlapping meetings share a room.
<details><summary>Solution</summary>

```python
import heapq
def min_rooms(intervals):
    intervals.sort()
    ends = []                                  # min-heap of end times
    for s, e in intervals:
        if ends and ends[0] <= s:
            heapq.heapreplace(ends, e)         # reuse the room that freed up
        else:
            heapq.heappush(ends, e)
    return len(ends)
print(min_rooms([(0, 30), (5, 10), (15, 20)]))   # 2
```

</details>

2. **Assign cookies** — Children have greed factors and cookies have sizes; a child is content if they get a cookie at least as big as their greed. Maximise content children.
<details><summary>Solution</summary>

```python
def max_content(greed, sizes):
    greed.sort(); sizes.sort()
    i = j = 0
    while i < len(greed) and j < len(sizes):
        if sizes[j] >= greed[i]: i += 1
        j += 1
    return i
print(max_content([1, 2, 3], [1, 1]), max_content([1, 2], [1, 2, 3]))   # 1 2
# Give the smallest sufficient cookie to the least greedy child; two pointers on sorted lists.
```

</details>

3. **Gas station** — Circular route with gas[i] available and cost[i] to reach the next station. Find a starting index that completes the loop, or -1.
<details><summary>Solution</summary>

```python
def can_complete(gas, cost):
    if sum(gas) < sum(cost): return -1
    start = tank = 0
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        if tank < 0:
            start, tank = i + 1, 0           # cannot start anywhere before i+1
    return start
print(can_complete([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]))   # 3
```

</details>

### Interview Questions

**Q: What is a greedy algorithm and how do you know when it is safe?**
A greedy algorithm makes the locally best choice at each step and never reconsiders it. It is safe when the problem has the greedy-choice property, meaning some optimal solution contains the greedy choice, and optimal substructure, meaning the remaining problem after that choice is a smaller instance of the same problem. The standard way to justify it is an exchange argument: take any optimal solution, swap its first differing choice for the greedy one, and show the result is no worse. When I cannot make that argument, I look for a small counter-example, and if I find one, I switch to dynamic programming, which explores the choices greedy would have skipped.

**Q: Why does earliest-finish-time work for interval scheduling but earliest-start does not?**
Picking the earliest start can select a long meeting that blocks several short ones; for example, (0, 10) beats (1, 2), (3, 4) and (5, 6) combined. Earliest finish time leaves the largest possible free window for the remaining meetings, and the exchange argument is clean: in any optimal schedule, replacing its first meeting with the earliest-finishing compatible one cannot cause any later meeting to become incompatible, so the count stays the same. Shortest duration also fails, since a short meeting in the middle can conflict with two longer ones on either side. The algorithm is O(n log n) for the sort and O(n) for the scan.

**Q: Greedy versus dynamic programming: how do you decide?**
Both need optimal substructure. Greedy additionally needs that one choice can be fixed without looking at the alternatives; DP is for when the best choice depends on the results of sub-problems, so you must compute and compare them. Fractional knapsack is greedy because splitting items means the ratio ordering is never wrong; 0/1 knapsack is DP because taking a high-ratio heavy item may waste capacity that two lighter items would fill better. Greedy is typically O(n log n) and DP O(n × W) or worse, so when greedy is provably correct it is the better answer, and when it is not, no amount of speed compensates for a wrong result.

**Q: Describe Kruskal's algorithm and why the greedy choice is correct.**
Kruskal builds a minimum spanning tree by sorting all edges by weight and adding each edge in turn if it connects two different components, tracked with a union-find structure. It is O(E log E) for the sort. The greedy choice is justified by the cut property: for any partition of the vertices into two sets, the lightest edge crossing the cut belongs to some minimum spanning tree, and every edge Kruskal accepts is the lightest edge crossing the cut between its two components at that moment. Prim's algorithm is the same idea grown from a single vertex with a heap, and is preferable on dense graphs. I would mention that both fail if you need constraints such as a maximum degree, where the problem becomes NP-hard.

# LEVEL: Expert

## Dynamic programming

**Dynamic programming (DP)** solves a problem by breaking it into overlapping sub-problems, solving each once, and storing the answers. It applies when a problem has **optimal substructure** (the best answer is built from best answers to smaller instances) and **overlapping sub-problems** (the same smaller instances recur). Memoised recursion is top-down DP; filling a table is bottom-up DP.

### The five-step recipe

1. **Define the state**: what does `dp[i]` (or `dp[i][j]`) mean in words?
2. **Write the recurrence**: how does `dp[i]` depend on smaller states?
3. **Set base cases**.
4. **Choose the order** of evaluation so dependencies are ready (or memoise).
5. **Read the answer** from the table, and optimise space if only recent rows are used.

### Climbing stairs (1-D DP)

You can climb 1 or 2 steps at a time. How many ways to reach step n? State: `dp[i]` = ways to reach step i. Recurrence: `dp[i] = dp[i-1] + dp[i-2]`.

```python
def climb(n):
    a, b = 1, 1                  # dp[0], dp[1]
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

print(climb(10))   # 89
```

O(n) time, O(1) space because only the last two values matter. This is Fibonacci in disguise; "decode ways" and "min cost climbing stairs" are the same shape.

### House robber

Rob houses in a row without robbing two adjacent ones. State: `dp[i]` = best loot from the first i houses. Recurrence: `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`.

```python
def rob(nums):
    prev, cur = 0, 0
    for x in nums:
        prev, cur = cur, max(cur, prev + x)
    return cur

print(rob([2, 7, 9, 3, 1]))   # 12  (2 + 9 + 1)
```

### Coin change (unbounded knapsack)

Fewest coins to make an amount, with arbitrary denominations, the problem greedy could not solve. State: `dp[a]` = fewest coins for amount a.

```python
def coin_change(coins, amount):
    INF = float("inf")
    dp = [0] + [INF] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a and dp[a - c] + 1 < dp[a]:
                dp[a] = dp[a - c] + 1
    return dp[amount] if dp[amount] != INF else -1

print(coin_change([1, 3, 4], 6))     # 2
print(coin_change([2], 3))           # -1
```

O(amount × coins) time, O(amount) space. Counting the *number of ways* uses the same table but loops coins on the outside to avoid counting orderings twice.

### 0/1 knapsack (2-D DP with space optimisation)

Items with weight and value, capacity W, each item at most once. State: `dp[w]` = best value using capacity w. Iterate capacity **downwards** so each item is used once.

```python
def knapsack(items, W):              # items: (value, weight)
    dp = [0] * (W + 1)
    for value, weight in items:
        for w in range(W, weight - 1, -1):
            dp[w] = max(dp[w], dp[w - weight] + value)
    return dp[W]

print(knapsack([(60, 10), (100, 20), (120, 30)], 50))   # 220 (not 240: no fractions)
```

### Longest common subsequence (2-D DP)

The core of `diff`, of Word's Compare Documents, and of every "edit distance" question. State: `dp[i][j]` = LCS length of `a[:i]` and `b[:j]`.

```python
def lcs(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]

print(lcs("policy manual", "policy handbook"))   # 9
```

O(m × n) time and space; two rows suffice if you only need the length. **Edit distance** (Levenshtein) is the same grid with insert, delete and replace costs, and it is what fuzzy-matching a misspelled parcel ID uses.

### Longest increasing subsequence

The O(n²) DP is `dp[i] = 1 + max(dp[j] for j < i if a[j] < a[i])`. The O(n log n) version keeps a list of the smallest tail for each length and uses `bisect`:

```python
from bisect import bisect_left
def lis(a):
    tails = []
    for x in a:
        i = bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)

print(lis([10, 9, 2, 5, 3, 7, 101, 18]))   # 4
```

### Top-down versus bottom-up

| | Top-down (memoised recursion) | Bottom-up (table) |
|---|---|---|
| Writing | closer to the recurrence, quick to get right | needs explicit order |
| Sub-problems computed | only those reached | all of them |
| Stack | recursion depth can overflow | none |
| Space optimisation | hard | easy (keep last rows) |
| Speed in Python | slower (function calls) | faster |

### Recognising DP in the wild

Signals: "minimum/maximum number of ways", "longest/shortest subsequence", "can you reach", "count the ways", inputs up to a few thousand (O(n²) is fine), and a brute force that would be exponential. Non-signals: contiguous subarray questions (usually sliding window or Kadane), sorted input (two pointers or binary search).

> **Interview note:** Say the state definition out loud before writing code: "dp[i][j] is the minimum cost to convert the first i characters of A into the first j characters of B." A precise state sentence is worth more than a correct table filled in silence, because it shows the interviewer you could fix the recurrence if a test fails.

### Try It Yourself

```python
def coin_change(coins, amount):
    INF = float("inf")
    dp = [0] + [INF] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a and dp[a - c] + 1 < dp[a]:
                dp[a] = dp[a - c] + 1
    return dp[amount] if dp[amount] != INF else -1

def edit_distance(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            cost = 0 if a[i - 1] == b[j - 1] else 1
            dp[i][j] = min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    return dp[m][n]

def knapsack(items, W):
    dp = [0] * (W + 1)
    for value, weight in items:
        for w in range(W, weight - 1, -1):
            dp[w] = max(dp[w], dp[w - weight] + value)
    return dp[W]

print("coin change (1,3,4) for 6:", coin_change([1, 3, 4], 6))
print("edit distance WY10482 -> WY10428:", edit_distance("WY10482", "WY10428"))
print("edit distance kitten -> sitting:", edit_distance("kitten", "sitting"))
print("0/1 knapsack:", knapsack([(60, 10), (100, 20), (120, 30)], 50))
```

### Quiz

1. Which two properties make a problem suitable for DP?
- [x] Optimal substructure and overlapping sub-problems
- [ ] Sorted input and unique values
- [ ] Recursion and a base case
> Without overlap, plain divide-and-conquer suffices; without optimal substructure, sub-answers cannot be combined.

2. In 0/1 knapsack with a 1-D table, why iterate capacity downwards?
- [x] So each item is counted at most once per capacity
- [ ] To save time
- [ ] Because the list is sorted
> Going upwards would let `dp[w - weight]` already include the current item, turning it into unbounded knapsack.

3. What is the time complexity of the standard LCS algorithm on strings of length m and n?
- [ ] O(m + n)
- [x] O(m × n)
- [ ] O(2^(m+n))
> Every cell of the (m+1) × (n+1) table is filled once in O(1).

4. What is the main advantage of bottom-up over top-down DP in Python?
- [x] No recursion limit and easy space optimisation
- [ ] It computes fewer sub-problems
- [ ] It needs no base cases
> Memoised recursion is elegant but consumes stack frames and cannot easily drop old rows.

### Exercises

1. **Unique paths** — In an m × n grid moving only right or down, how many paths from top-left to bottom-right?
<details><summary>Solution</summary>

```python
def unique_paths(m, n):
    row = [1] * n
    for _ in range(1, m):
        for j in range(1, n):
            row[j] += row[j - 1]
    return row[-1]
print(unique_paths(3, 7))   # 28   O(m*n) time, O(n) space
```

</details>

2. **Word break** — Can `s` be segmented into words from a dictionary? `"leetcode"`, `{"leet","code"}` → True.
<details><summary>Solution</summary>

```python
def word_break(s, words):
    words = set(words)
    dp = [True] + [False] * len(s)          # dp[i]: s[:i] is segmentable
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True; break
    return dp[-1]
print(word_break("leetcode", ["leet", "code"]))   # True
```

</details>

3. **Maximum subarray (Kadane)** — Largest sum of a contiguous subarray, in O(n).
<details><summary>Solution</summary>

```python
def max_subarray(a):
    best = cur = a[0]
    for x in a[1:]:
        cur = max(x, cur + x)        # extend or restart
        best = max(best, cur)
    return best
print(max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))   # 6
# dp[i] = best sum ending at i = max(a[i], dp[i-1] + a[i]); only the previous value is kept.
```

</details>

### Interview Questions

**Q: How do you approach a DP problem you have never seen?**
First I write the brute-force recursion and check whether it recomputes the same sub-problems; if it does, DP applies. Then I define the state in one sentence, including every parameter that changes between calls, and write the recurrence as "the answer for this state is the best over the choices available here". I fix base cases, pick an evaluation order where dependencies come first, and estimate complexity as number of states times work per state. Finally I test the table by hand on a tiny input. For example, for edit distance the state is (i, j), the choices are insert, delete or replace, and there are m × n states with O(1) work each.

**Q: What is the difference between memoisation and tabulation?**
Memoisation is top-down: you write the natural recursive function and cache results by argument, typically with `functools.lru_cache`, so each state is computed once and only reachable states are computed at all. Tabulation is bottom-up: you allocate a table, fill it in an order that guarantees dependencies are ready, and read off the answer. Tabulation avoids recursion depth limits, has lower constant factors in Python, and allows rolling arrays that cut space from O(n²) to O(n). Memoisation is faster to write and can win when only a small fraction of states are needed, such as sparse knapsack capacities.

**Q: Explain the 0/1 knapsack solution and why greedy fails.**
Define `dp[i][w]` as the best value using the first i items within capacity w; either skip item i, giving `dp[i-1][w]`, or take it if it fits, giving `dp[i-1][w-weight] + value`. Fill the table in O(n × W) time, and compress to one row by iterating w downwards so that each item is used at most once. Greedy by value-per-weight fails because a high-ratio item can leave capacity that nothing else fits into: with capacity 50 and items (60, 10), (100, 20), (120, 30), greedy by ratio takes the first two for 160 and wastes 20 units, while the optimum takes the last two for 220. The pseudo-polynomial O(n × W) bound is worth mentioning, since W can be huge.

**Q: How would you compute edit distance and where is it used?**
Levenshtein distance is the minimum number of single-character insertions, deletions or substitutions to turn A into B. `dp[i][j]` is the distance between the first i characters of A and the first j of B; it equals `dp[i-1][j-1]` if the characters match, otherwise one plus the minimum of `dp[i-1][j]` (delete), `dp[i][j-1]` (insert) and `dp[i-1][j-1]` (replace). It is O(m × n) time and O(min(m, n)) space with two rows. It is used for spell checking, fuzzy matching of names and parcel IDs during data validation, DNA alignment, and `diff` tools; in a title-search QA pipeline I would use it to flag records whose owner names differ from the source by a distance of one or two.

## Backtracking

**Backtracking** explores every candidate solution by building it one piece at a time, abandoning a partial candidate the moment it cannot lead to a valid answer, and undoing the last choice to try the next. It is depth-first search over a **decision tree**. Permutations, combinations, subsets, N-Queens, Sudoku and word search are all backtracking, and the code for all of them has the same three-part shape: choose, explore, un-choose.

### The template

```python
def backtrack(path, choices):
    if is_complete(path):
        results.append(path[:])          # copy! path will be mutated
        return
    for c in choices:
        if not is_valid(c, path):
            continue                     # prune
        path.append(c)                   # choose
        backtrack(path, remaining(choices, c))   # explore
        path.pop()                       # un-choose
```

The `path[:]` copy is the bug most people write on a whiteboard: appending the live list means every stored result later mutates to empty.

### Subsets

Every element is either in or out. Recurse on the index; at each step branch twice.

```python
def subsets(nums):
    res = []
    def go(i, path):
        if i == len(nums):
            res.append(path[:])
            return
        go(i + 1, path)                  # exclude nums[i]
        path.append(nums[i])             # include
        go(i + 1, path)
        path.pop()
    go(0, [])
    return res

print(subsets([1, 2, 3]))    # 8 subsets
```

There are 2ⁿ subsets, each copied in O(n), so O(n × 2ⁿ). No algorithm can do better because the output is that big.

### Permutations

```python
def permutations(nums):
    res = []
    def go(path, used):
        if len(path) == len(nums):
            res.append(path[:])
            return
        for i, x in enumerate(nums):
            if used[i]:
                continue
            used[i] = True; path.append(x)
            go(path, used)
            path.pop(); used[i] = False
    go([], [False] * len(nums))
    return res

print(len(permutations([1, 2, 3, 4])))   # 24
```

O(n × n!). With duplicates in the input, sort first and skip `nums[i] == nums[i-1] and not used[i-1]` to avoid producing the same permutation twice.

### Combination sum

Numbers may be reused; find all combinations summing to a target. Pass a start index so combinations are generated in one order only.

```python
def combination_sum(cands, target):
    res = []
    cands.sort()
    def go(start, remaining, path):
        if remaining == 0:
            res.append(path[:]); return
        for i in range(start, len(cands)):
            if cands[i] > remaining:
                break                             # prune: sorted, nothing later fits
            path.append(cands[i])
            go(i, remaining - cands[i], path)     # i, not i+1: reuse allowed
            path.pop()
    go(0, target, [])
    return res

print(combination_sum([2, 3, 6, 7], 7))   # [[2, 2, 3], [7]]
```

The `break` on sorted candidates is pruning: it cuts whole subtrees without visiting them, which is the difference between exponential and usable.

### N-Queens

Place n queens on an n×n board so none attack. Place one queen per row; track used columns and both diagonals in sets for O(1) validity checks.

```python
def n_queens(n):
    res, cols, d1, d2 = [], set(), set(), set()
    board = []
    def go(r):
        if r == n:
            res.append(board[:]); return
        for c in range(n):
            if c in cols or r - c in d1 or r + c in d2:
                continue
            cols.add(c); d1.add(r - c); d2.add(r + c); board.append(c)
            go(r + 1)
            cols.remove(c); d1.remove(r - c); d2.remove(r + c); board.pop()
    go(0)
    return res

print(len(n_queens(8)))   # 92
```

`r - c` is constant along one diagonal direction and `r + c` along the other, a fact worth memorising.

### Word search on a grid

Does a word exist as a path of adjacent cells (no cell reused)? DFS from every cell, marking the cell during exploration and restoring it afterwards: the "un-choose" step done in place.

```python
def exist(board, word):
    R, C = len(board), len(board[0])
    def go(r, c, k):
        if k == len(word): return True
        if not (0 <= r < R and 0 <= c < C) or board[r][c] != word[k]:
            return False
        tmp, board[r][c] = board[r][c], "#"          # mark visited
        found = any(go(r + dr, c + dc, k + 1) for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)))
        board[r][c] = tmp                             # restore
        return found
    return any(go(r, c, 0) for r in range(R) for c in range(C))
```

### Backtracking versus DP versus brute force

| Question asks for | Approach |
|---|---|
| All solutions / enumerate them | backtracking |
| Count or optimum, overlapping sub-problems | DP |
| Existence with heavy pruning | backtracking, often with memo (e.g. word break) |
| Small n (≤ 20) and no structure | brute force / bitmask |

Complexity of backtracking is bounded by the size of the decision tree: O(2ⁿ) for subsets, O(n!) for permutations, O(kⁿ) for k choices per position. Pruning does not change the worst case but changes whether it finishes.

> **Warning:** Always ask about duplicates in the input and whether the output order matters. Both change the code: duplicates need a sort-and-skip rule, and "combinations" versus "permutations" decides whether you pass a start index or a used array.

### Try It Yourself

```python
def subsets(nums):
    res = []
    def go(i, path):
        if i == len(nums):
            res.append(path[:]); return
        go(i + 1, path)
        path.append(nums[i]); go(i + 1, path); path.pop()
    go(0, []); return res

def combination_sum(cands, target):
    res, cands = [], sorted(cands)
    def go(start, rem, path):
        if rem == 0: res.append(path[:]); return
        for i in range(start, len(cands)):
            if cands[i] > rem: break
            path.append(cands[i]); go(i, rem - cands[i], path); path.pop()
    go(0, target, []); return res

def n_queens(n):
    count, cols, d1, d2 = 0, set(), set(), set()
    def go(r):
        nonlocal count
        if r == n: count += 1; return
        for c in range(n):
            if c in cols or r - c in d1 or r + c in d2: continue
            cols.add(c); d1.add(r - c); d2.add(r + c)
            go(r + 1)
            cols.remove(c); d1.remove(r - c); d2.remove(r + c)
    go(0); return count

print("subsets:", subsets(["docx", "pdf", "epub"]))
print("ways to bill 7 hours in blocks of 2,3,6,7:", combination_sum([2, 3, 6, 7], 7))
for n in (4, 6, 8):
    print(f"{n}-queens solutions:", n_queens(n))
```

### Quiz

1. What are the three steps at the heart of backtracking?
- [x] Choose, explore, un-choose
- [ ] Sort, search, return
- [ ] Split, merge, combine
> Each recursive frame adds a choice, recurses, then removes it so the next choice starts clean.

2. Why must you append `path[:]` rather than `path` to the results?
- [x] Because `path` is mutated later and every stored reference would change
- [ ] Because lists cannot be appended to lists
- [ ] To sort the result
> Without the copy, all results point at the same list, which ends up empty.

3. How many subsets does a set of n elements have?
- [ ] n²
- [x] 2ⁿ
- [ ] n!
> Each element is independently in or out.

4. In N-Queens, which expression identifies an anti-diagonal (top-right to bottom-left)?
- [ ] r − c
- [x] r + c
- [ ] r × c
> Along that diagonal, moving down one row and left one column keeps r + c constant.

### Exercises

1. **Letter combinations of a phone number** — For digits "23", produce all letter strings (2 = abc, 3 = def).
<details><summary>Solution</summary>

```python
def letter_combos(digits):
    keys = {"2":"abc","3":"def","4":"ghi","5":"jkl","6":"mno","7":"pqrs","8":"tuv","9":"wxyz"}
    res = []
    def go(i, path):
        if i == len(digits): res.append("".join(path)); return
        for ch in keys[digits[i]]:
            path.append(ch); go(i + 1, path); path.pop()
    if digits: go(0, [])
    return res
print(letter_combos("23"))   # 9 strings
```

</details>

2. **Generate parentheses** — All valid strings of n pairs of brackets.
<details><summary>Solution</summary>

```python
def gen_parens(n):
    res = []
    def go(s, open_, close):
        if len(s) == 2 * n: res.append(s); return
        if open_ < n:     go(s + "(", open_ + 1, close)
        if close < open_: go(s + ")", open_, close + 1)
    go("", 0, 0); return res
print(gen_parens(3))   # ['((()))', '(()())', '(())()', '()(())', '()()()']
# Pruning: never close more than you have opened.
```

</details>

3. **Palindrome partitioning** — Split a string into pieces that are all palindromes; return every partition.
<details><summary>Solution</summary>

```python
def partitions(s):
    res = []
    def go(start, path):
        if start == len(s): res.append(path[:]); return
        for end in range(start + 1, len(s) + 1):
            piece = s[start:end]
            if piece == piece[::-1]:
                path.append(piece); go(end, path); path.pop()
    go(0, []); return res
print(partitions("aab"))   # [['a', 'a', 'b'], ['aa', 'b']]
```

</details>

### Interview Questions

**Q: What is backtracking and how does it differ from plain DFS?**
Backtracking is depth-first search over a tree of partial solutions, where each level adds one decision, and where partial solutions that can no longer succeed are abandoned early. Plain DFS visits nodes of an existing graph; backtracking generates the "graph" on the fly and its defining feature is the un-choose step that restores state so the next branch starts from the same point. Constraint checking before recursing, which is pruning, is what makes it practical: N-Queens without pruning explores n^n placements, with column and diagonal sets it explores a tiny fraction. Its worst case is still exponential, which is why it is the tool for enumerating all answers rather than for optimisation problems with overlapping sub-problems, where DP applies.

**Q: How do you avoid duplicate results when the input has duplicates?**
Sort the input so equal elements are adjacent, then at each level of the recursion skip an element if it equals the previous one and the previous one was not used at this level. For subsets and combinations that is `if i > start and nums[i] == nums[i-1]: continue`; for permutations it is `if i > 0 and nums[i] == nums[i-1] and not used[i-1]: continue`. The rule ensures that among equal elements you always take them in left-to-right order, so each multiset of choices is produced exactly once. The alternative, collecting results in a set of tuples, works but wastes the exponential effort of generating duplicates first.

**Q: Explain the complexity of generating all permutations and whether it can be improved.**
There are n! permutations, and producing each one costs O(n) to copy, so the output alone is O(n × n!), and no algorithm can beat the size of its own output. The backtracking approach visits about e × n! nodes in its recursion tree, still O(n × n!). Heap's algorithm generates each next permutation with a single swap, which lowers the constant but not the bound. In practice the honest answer is that n above about 10 is infeasible (10! is 3.6 million), so if an interviewer needs permutations of 15 items they are really asking for pruning, DP over bitmasks (O(2ⁿ × n)), or a different formulation.

**Q: How would you solve Sudoku, and how does pruning change the runtime?**
Scan for the first empty cell, try each digit 1 to 9 that does not already appear in that row, column or 3×3 box, place it, recurse, and undo it if the recursion fails. Keeping three arrays of sets, one per row, column and box, makes the validity check O(1) instead of O(27). Without pruning you would try 9^81 boards; with constraint checks, a typical puzzle is solved in a few thousand placements, and choosing the empty cell with the fewest legal digits first (most-constrained-variable heuristic) cuts that further. It is a good example of how backtracking's worst case is meaningless in practice and the order of choices dominates the runtime.

## Tries & advanced string algorithms

A **trie** (prefix tree) stores strings character by character along its edges, so all words sharing a prefix share a path. Lookup and insert cost O(L) for a word of length L regardless of how many words are stored, and every word with a given prefix is found by walking to the prefix's node. Autocomplete, spell checkers and IP routing tables are trie problems. This chapter also covers the pattern-matching algorithms interviewers use to separate strong candidates: KMP, Rabin-Karp and the Z-function.

### Building a trie

```python
class TrieNode:
    __slots__ = ("children", "end")
    def __init__(self):
        self.children = {}
        self.end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
        node.end = True

    def search(self, word):
        node = self._walk(word)
        return node is not None and node.end

    def starts_with(self, prefix):
        return self._walk(prefix) is not None

    def _walk(self, s):
        node = self.root
        for ch in s:
            node = node.children.get(ch)
            if node is None:
                return None
        return node

t = Trie()
for w in ["policy", "polish", "poll", "pdf"]:
    t.insert(w)
print(t.search("poll"), t.search("pol"), t.starts_with("pol"))   # True False True
```

Memory is O(total characters) in the worst case, more than a set of strings, but prefix queries are the point.

### Autocomplete: collect all words under a prefix

```python
def words_with_prefix(trie, prefix):
    node = trie._walk(prefix)
    out = []
    def dfs(n, path):
        if n.end:
            out.append(prefix + "".join(path))
        for ch, child in sorted(n.children.items()):
            path.append(ch); dfs(child, path); path.pop()
    if node:
        dfs(node, [])
    return out

print(words_with_prefix(t, "pol"))   # ['policy', 'polish', 'poll']
```

O(L + output size), independent of the dictionary's size. A hash set cannot do this without scanning every word.

| Operation | Trie | Hash set | Sorted list + bisect |
|---|---|---|---|
| Insert word | O(L) | O(L) | O(n) |
| Exact lookup | O(L) | O(L) average | O(L log n) |
| Prefix query | O(L + k) | O(n × L) | O(L log n + k) |
| Memory | high (one node per char) | low | low |

### Knuth-Morris-Pratt (KMP)

Naive substring search restarts from scratch after a mismatch: O(n × m). KMP precomputes, for each prefix of the pattern, the length of its longest proper prefix that is also a suffix (the **failure function**), so on a mismatch it slides the pattern forward without re-reading text characters. O(n + m).

```python
def build_lps(p):
    lps, k = [0] * len(p), 0
    for i in range(1, len(p)):
        while k and p[i] != p[k]:
            k = lps[k - 1]
        if p[i] == p[k]:
            k += 1
        lps[i] = k
    return lps

def kmp_search(text, p):
    lps, k, hits = build_lps(p), 0, []
    for i, ch in enumerate(text):
        while k and ch != p[k]:
            k = lps[k - 1]
        if ch == p[k]:
            k += 1
        if k == len(p):
            hits.append(i - k + 1)
            k = lps[k - 1]
    return hits

print(build_lps("aabaaab"))                   # [0,1,0,1,2,2,3]
print(kmp_search("abxabcabcaby", "abcaby"))   # [6]
```

The `lps` table is the whole algorithm. `lps[i] = k` means "if I mismatch after matching i+1 characters, I can pretend I have already matched k of them".

### Rabin-Karp: hashing windows

Hash the pattern, then hash each window of the text with a **rolling hash** that updates in O(1) as the window slides. Compare strings only when hashes match. Expected O(n + m), and it extends naturally to searching for many patterns of the same length at once (hash each pattern into a set).

```python
def rabin_karp(text, p, base=256, mod=1_000_000_007):
    n, m = len(text), len(p)
    if m > n: return []
    hp = ht = 0
    high = pow(base, m - 1, mod)
    for i in range(m):
        hp = (hp * base + ord(p[i])) % mod
        ht = (ht * base + ord(text[i])) % mod
    hits = []
    for i in range(n - m + 1):
        if hp == ht and text[i:i + m] == p:
            hits.append(i)
        if i + m < n:
            ht = ((ht - ord(text[i]) * high) * base + ord(text[i + m])) % mod
    return hits

print(rabin_karp("the rate matrix has a rate column", "rate"))   # [4, 22]
```

Plagiarism checkers use exactly this: hash every k-word window of each document and compare the hash sets.

### The Z-function

`z[i]` is the length of the longest substring starting at i that matches a prefix of the string. Computing it is O(n) and it gives another linear pattern matcher: build `z` on `pattern + "$" + text` and every position where `z[i] == len(pattern)` is a match. It also answers "what is the shortest period of this string" and "is this string a repetition".

```python
def z_function(s):
    n, z = len(s), [0] * len(s)
    l = r = 0
    for i in range(1, n):
        if i < r:
            z[i] = min(r - i, z[i - l])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] > r:
            l, r = i, i + z[i]
    return z

print(z_function("aabxaab"))   # [0,1,0,0,3,1,0]
```

> **Tip:** In Python, `text.find(pattern)` already uses a fast two-way algorithm and is written in C, so for a single pattern it beats a hand-written KMP by a wide margin. Write KMP or Rabin-Karp in interviews to show you understand them, and say explicitly that in production you would use the built-in or a trie/Aho-Corasick when there are many patterns.

### Try It Yourself

```python
class Trie:
    def __init__(self): self.root = {}
    def insert(self, word):
        node = self.root
        for ch in word: node = node.setdefault(ch, {})
        node["$"] = True
    def walk(self, s):
        node = self.root
        for ch in s:
            node = node.get(ch)
            if node is None: return None
        return node
    def complete(self, prefix):
        out = []
        def dfs(node, path):
            for ch, child in sorted(node.items()):
                if ch == "$": out.append(prefix + "".join(path))
                else: path.append(ch); dfs(child, path); path.pop()
        node = self.walk(prefix)
        if node: dfs(node, [])
        return out

t = Trie()
for w in ["policy", "polish", "poll", "pdf", "portfolio", "power bi"]:
    t.insert(w)
print("prefix 'po':", t.complete("po"))
print("prefix 'pol':", t.complete("pol"))
print("exact 'poll':", t.walk("poll") is not None and "$" in t.walk("poll"))

def build_lps(p):
    lps, k = [0] * len(p), 0
    for i in range(1, len(p)):
        while k and p[i] != p[k]: k = lps[k - 1]
        if p[i] == p[k]: k += 1
        lps[i] = k
    return lps

def kmp(text, p):
    lps, k, hits = build_lps(p), 0, []
    for i, ch in enumerate(text):
        while k and ch != p[k]: k = lps[k - 1]
        if ch == p[k]: k += 1
        if k == len(p): hits.append(i - k + 1); k = lps[k - 1]
    return hits

print("KMP hits:", kmp("rate matrix, rate calc, rebate", "rate"))
```

### Quiz

1. What is the lookup cost of a word of length L in a trie holding n words?
- [x] O(L)
- [ ] O(log n)
- [ ] O(n)
> Each character follows one edge; the number of stored words is irrelevant.

2. What does the KMP failure (LPS) table store?
- [x] For each prefix of the pattern, the length of its longest proper prefix that is also a suffix
- [ ] The position of each character in the text
- [ ] A hash of each prefix
> That value tells the matcher how far it can safely slide the pattern after a mismatch.

3. Why does Rabin-Karp still compare the actual strings when hashes match?
- [x] Different strings can share a hash (collisions)
- [ ] Hashes are case-insensitive
- [ ] To count the matches
> A hash match is only probable evidence; the character comparison confirms it.

4. Which structure best supports "find all words starting with a prefix"?
- [ ] Hash set
- [x] Trie
- [ ] Heap
> The prefix's node is the root of a subtree containing exactly those words.

### Exercises

1. **Longest word built one character at a time** — From a list of words, find the longest word where every prefix is also in the list, e.g. `["w","wo","wor","worl","world"]` → "world".
<details><summary>Solution</summary>

```python
def longest_buildable(words):
    words = set(words); best = ""
    for w in sorted(words, key=lambda w: (-len(w), w)):
        if all(w[:i] in words for i in range(1, len(w) + 1)):
            return w
    return best
print(longest_buildable(["w", "wo", "wor", "worl", "world", "apple"]))   # world
# Trie version: DFS from the root only through nodes where end is True; track the deepest.
```

</details>

2. **Repeated substring pattern** — Is the string made by repeating a substring? `"abab"` → True, `"aba"` → False.
<details><summary>Solution</summary>

```python
def repeated(s):
    return s in (s + s)[1:-1]
print(repeated("abab"), repeated("aba"))   # True False
# With KMP: n = len(s), k = lps[-1]; repeated iff k > 0 and n % (n - k) == 0.
```

</details>

3. **Replace words with roots** — Given roots `["cat","bat","rat"]` and sentence `"the cattle was rattled by the battery"`, replace each word by its shortest root prefix.
<details><summary>Solution</summary>

```python
def replace_words(roots, sentence):
    trie = {}
    for r in roots:
        node = trie
        for ch in r: node = node.setdefault(ch, {})
        node["$"] = True
    def shortest(word):
        node, path = trie, []
        for ch in word:
            if ch not in node: return word
            node = node[ch]; path.append(ch)
            if "$" in node: return "".join(path)
        return word
    return " ".join(shortest(w) for w in sentence.split())
print(replace_words(["cat", "bat", "rat"], "the cattle was rattled by the battery"))
# the cat was rat by the bat
```

</details>

### Interview Questions

**Q: When would you use a trie instead of a hash set?**
When prefix operations matter: autocomplete, "does any stored word start with this", longest-prefix matching such as IP routing, or scanning a text for many patterns at once. A trie answers a prefix query in O(L + k) for output size k, while a hash set would need to scan all n words. The costs are memory, since each character becomes a node with its own dictionary, and slower exact lookups in Python because each step is a dict access rather than one hash of the whole string. For pure membership testing with no prefix queries, a set is the right choice, and I would say so before reaching for a trie.

**Q: Explain how KMP achieves O(n + m).**
Preprocessing builds the LPS array: for each pattern position, the length of the longest proper prefix of the pattern that is also a suffix of the pattern up to that position. During the search, on a mismatch after matching k characters, instead of moving the text pointer back, KMP sets k to `lps[k-1]`, reusing the fact that the last `lps[k-1]` matched characters are also a prefix of the pattern. The text pointer only moves forward, so the search is O(n), and building the table with the same fallback logic is O(m). The amortised argument is that k increases at most n times, so it can decrease at most n times in total.

**Q: How does a rolling hash work and what are its risks?**
Treat a window of m characters as a base-b number modulo a prime p; when the window slides, subtract the leading character times b^(m-1), multiply by b, add the new trailing character, all mod p, in O(1). Rabin-Karp compares the pattern's hash against each window's hash and verifies candidates by direct comparison. The risks are collisions, which are handled by verification but can be forced by an adversary who knows b and p, giving O(n × m) worst case; the mitigations are a random base, a large prime, or double hashing with two moduli. I have used the same idea to detect duplicated paragraphs across hundreds of SOP documents by hashing sliding windows of words.

**Q: How would you find all occurrences of thousands of keywords in a large document?**
Build a trie of the keywords and turn it into an Aho-Corasick automaton by adding failure links, which are the trie equivalent of KMP's LPS table, plus output links so that a node also reports keywords that are suffixes of its path. Then scan the document once, following goto and failure links, in O(text length + total keyword length + number of matches), independent of how many keywords there are. Running `text.find` per keyword would be O(keywords × text), which for 5,000 terms over a 767-page handbook is billions of character comparisons. In Python, the `pyahocorasick` package implements this in C; for a one-off job a compiled regular expression alternation is a reasonable middle ground.

## Complexity analysis deep-dive & amortised cost

Beginner Big-O tells you to count loops. Expert analysis tells you *why* the answer is what it is, which operations are cheap only on average, what the hidden costs of Python's data structures are, and how to say all of this precisely.

### Big-O, Big-Ω and Big-Θ

- **O(f)**: an upper bound. "At most this fast-growing."
- **Ω(f)**: a lower bound. "At least this fast-growing."
- **Θ(f)**: tight. Both at once.

Saying "binary search is O(n)" is technically true but useless; it is Θ(log n). Comparison sorting is Ω(n log n) in the worst case, which is a statement about every possible algorithm, not just one. Interviewers who ask "can you do better than O(n log n)" want to hear that comparison-based sorting cannot, and that counting or radix sort escapes the bound by not comparing.

### Amortised analysis

An operation is amortised O(1) if a sequence of n operations costs O(n) in total, even though some individual operations are expensive. Three standard ways to argue it:

1. **Aggregate**: total cost over n operations divided by n.
2. **Accounting**: charge each cheap operation a little extra "credit" that pays for the rare expensive one.
3. **Potential**: define a function of the data structure's state that rises with cheap operations and drops to pay for expensive ones.

The dynamic array is the canonical case. If capacity doubles on overflow, appending n items copies at most 1 + 2 + 4 + ... + n < 2n elements in total, so the amortised cost per append is O(1). CPython grows by about 1/8 rather than doubling, which trades a slightly higher constant for less wasted memory; the amortised bound still holds because growth is geometric.

```python
import sys
a, sizes = [], []
for i in range(1, 60):
    a.append(i)
    sizes.append(sys.getsizeof(a))
changes = [i + 1 for i in range(1, len(sizes)) if sizes[i] != sizes[i - 1]]
print("resizes happened at lengths:", changes)
```

Also amortised O(1): `dict` insert, `set.add` and the pops in a monotonic stack.

### Hidden costs in Python operations

| Looks like O(1) | Actually | Why |
|---|---|---|
| `a[1:]` in a recursive call | O(n) | slicing copies |
| `s += ch` | O(n) | strings are immutable |
| `x in list` | O(n) | linear scan |
| `list.insert(0, x)` / `pop(0)` | O(n) | shifting |
| `len(generator)` | error | generators have no length |
| `sum(a)` inside a loop | O(n) per call | recomputed every time |
| `sorted(a)[0]` | O(n log n) | use `min(a)` for O(n) |
| `k in d.keys()` in Python 2 | O(n) | Python 3 keys view is O(1) |
| `"".join(list)` | O(total chars) | fine, but it is not O(1) |

Each of these has been the "why is your O(n) solution timing out" moment in some interview.

### Recurrences and the Master Theorem

Divide-and-conquer costs are recurrences of the form T(n) = a·T(n/b) + f(n): a sub-problems, each of size n/b, plus f(n) work to split and combine. The Master Theorem gives the answer by comparing f(n) with n^(log_b a):

| Recurrence | a, b, f(n) | n^(log_b a) | Result | Example |
|---|---|---|---|---|
| T(n) = 2T(n/2) + O(n) | 2, 2, n | n | Θ(n log n) | merge sort |
| T(n) = T(n/2) + O(1) | 1, 2, 1 | 1 | Θ(log n) | binary search |
| T(n) = 2T(n/2) + O(1) | 2, 2, 1 | n | Θ(n) | tree traversal |
| T(n) = 4T(n/2) + O(n) | 4, 2, n | n² | Θ(n²) | naive matrix multiply |
| T(n) = T(n − 1) + O(1) | — | — | Θ(n) | linear recursion |
| T(n) = 2T(n − 1) + O(1) | — | — | Θ(2ⁿ) | naive Fibonacci-like |

If f(n) is polynomially smaller than n^(log_b a), the leaves dominate; if equal, multiply by log n; if larger, the root dominates.

### Space complexity, honestly

Space includes the recursion stack, temporary lists and output. `sorted(a)` is O(n) extra; `a.sort()` still allocates a temp buffer of up to n/2. A recursive DFS is O(h) stack; on a linked list h = n. Generators turn O(n) space into O(1): `sum(x * x for x in a)` never builds the squared list.

```python
import tracemalloc
tracemalloc.start()
squares = [x * x for x in range(200_000)]
print("list:", tracemalloc.get_traced_memory()[1] // 1024, "KB peak")
tracemalloc.stop(); del squares
tracemalloc.start()
total = sum(x * x for x in range(200_000))
print("generator:", tracemalloc.get_traced_memory()[1] // 1024, "KB peak")
tracemalloc.stop()
```

### Constant factors and the real world

Big-O hides constants, but constants decide what ships. Python's `sorted` on a million integers is O(n log n) in C and takes well under a second; a hand-written O(n) counting sort in pure Python may be slower because each bytecode costs 50 to 100 nanoseconds. Cache behaviour matters too: a contiguous NumPy array iterates far faster than a linked list of the same length. When you measure, use `timeit` or `time.perf_counter`, run several sizes, and check that doubling n scales as predicted.

> **Interview note:** A strong closing answer on complexity has four parts: the Big-O with a one-clause reason, whether any operation is amortised, the space including the stack, and the practical n at which it stops being acceptable ("O(n²) is fine for the 500 files a day we process, not for the 40,000 historical records").

### Try It Yourself

```python
import time, sys

def measure(fn, sizes):
    prev = None
    for n in sizes:
        data = list(range(n))
        t = time.perf_counter(); fn(data); dt = time.perf_counter() - t
        ratio = f"x{dt / prev:.1f}" if prev else ""
        print(f"  n={n:>7,}  {dt*1000:8.2f} ms  {ratio}")
        prev = dt

def linear(a):        return sum(a)
def nlogn(a):         return sorted(a, reverse=True)
def quadratic(a):     return sum(1 for i in range(len(a)) for j in range(i) if a[i] < a[j])
def pop_front(a):
    while a: a.pop(0)

print("O(n) sum: time should roughly double each step")
measure(linear, [50_000, 100_000, 200_000])
print("O(n log n) sort:")
measure(nlogn, [50_000, 100_000, 200_000])
print("O(n^2) nested loop: time should roughly quadruple")
measure(quadratic, [500, 1000, 2000])
print("O(n^2) hidden in pop(0):")
measure(pop_front, [5_000, 10_000, 20_000])

print("\nlist growth pattern (bytes):")
a, last = [], 0
for i in range(30):
    a.append(i)
    if sys.getsizeof(a) != last:
        last = sys.getsizeof(a); print(f"  len {len(a):2d} -> {last} bytes")
```

### Quiz

1. What does Θ(f(n)) mean?
- [x] The function is bounded above and below by f(n) up to constants
- [ ] Only an upper bound
- [ ] Only a lower bound
> Θ is the tight bound; O is upper, Ω is lower.

2. Why is appending to a dynamic array amortised O(1) even though resizes copy the whole array?
- [x] Geometric growth means total copying over n appends is O(n)
- [ ] Resizes never happen
- [ ] Each resize is O(1)
> 1 + 2 + 4 + ... + n < 2n, so the average per append is constant.

3. Using the Master Theorem, T(n) = 2T(n/2) + O(n) solves to:
- [ ] Θ(n)
- [x] Θ(n log n)
- [ ] Θ(n²)
> f(n) = n equals n^(log₂ 2) = n, the middle case, so multiply by log n.

4. What is the lower bound for comparison-based sorting?
- [x] Ω(n log n)
- [ ] Ω(n)
- [ ] Ω(n²)
> n! possible orderings need log₂(n!) ≈ n log n comparisons to distinguish.

### Exercises

1. **Spot the hidden cost** — This function is meant to be O(n). Find the problem and fix it.
```python
def unique_in_order(items):
    out = []
    for x in items:
        if x not in out:
            out.append(x)
    return out
```
<details><summary>Solution</summary>

```python
def unique_in_order(items):
    seen, out = set(), []
    for x in items:
        if x not in seen:          # O(1) instead of O(len(out))
            seen.add(x); out.append(x)
    return out
# The original is O(n^2) because `x not in out` scans a list. Equivalent: list(dict.fromkeys(items)).
```

</details>

2. **Solve the recurrence** — Give Θ bounds for T(n) = 3T(n/2) + O(n) and T(n) = T(n/2) + O(n).
<details><summary>Solution</summary>

```text
T(n) = 3T(n/2) + n:  n^(log2 3) ≈ n^1.585 dominates n, so Θ(n^1.585)  (Karatsuba multiplication).
T(n) = T(n/2) + n:   n^(log2 1) = 1 is smaller than n, so the root dominates: Θ(n)  (e.g. quickselect average).
```

</details>

3. **Amortised stack with multipop** — A stack supports push, pop and multipop(k) which pops up to k items. Show that n operations cost O(n).
<details><summary>Solution</summary>

```text
Accounting argument: charge 2 units per push. One unit pays for the push itself and one is
stored as credit on the element. Every pop or multipop step removes an element that already
carries a credit, so it costs nothing extra. n operations cost at most 2n units, so amortised O(1).
```

</details>

### Interview Questions

**Q: What is amortised analysis and how does it differ from average-case analysis?**
Amortised analysis bounds the total cost of a worst-case *sequence* of operations and divides by the number of operations; it makes no assumptions about input distribution. Average-case analysis assumes a probability distribution over inputs and computes expected cost, so it can be wrong for adversarial data. Dynamic array append is amortised O(1): any sequence of n appends costs O(n) total, guaranteed. Hash table lookup is average-case O(1): it depends on keys hashing well, and a malicious set of colliding keys makes it O(n), which is why Python randomises string hashing. In an interview, using the right word for each shows you understand the guarantee you are giving.

**Q: Explain the Master Theorem and apply it to merge sort and binary search.**
For T(n) = a·T(n/b) + f(n), compare f(n) with n^c where c = log_b a. If f grows slower, T is Θ(n^c); if equal, Θ(n^c log n); if faster (and regular), Θ(f(n)). Merge sort splits into 2 halves and merges in O(n): a=2, b=2, c=1, f(n)=n, the equal case, so Θ(n log n). Binary search makes one call on half the input with O(1) work: a=1, b=2, c=0, f(n)=1, equal case, so Θ(log n). Strassen's matrix multiplication has a=7, b=2 and f(n)=n², and since n^(log₂ 7) ≈ n^2.81 beats n², it is Θ(n^2.81). The theorem does not cover recurrences like T(n) = T(n−1) + n, which you sum directly to Θ(n²).

**Q: Give examples of operations people assume are O(1) in Python but are not.**
`list.pop(0)` and `insert(0, x)` are O(n) because elements shift; `x in some_list` is O(n); `s += ch` on strings is O(n) because strings are immutable; slicing `a[i:j]` is O(j−i); `a[1:]` inside recursion turns O(n) into O(n²); `len()` is O(1) for lists but a generator has no length at all; `sorted(a)[0]` is O(n log n) where `min(a)` is O(n); and `heapq.nlargest(k, a)` is O(n log k), not O(k). The fix for most of them is picking the right container: `deque` for front pops, `set` for membership, `join` for string building, and index passing instead of slicing.

**Q: How would you measure whether your complexity analysis is right?**
Run the function on inputs of size n, 2n, 4n and 8n with `time.perf_counter`, repeat each a few times and take the minimum, then look at the ratios: about 2 means linear, about 4 means quadratic, and slightly more than 2 that shrinks toward 2 means n log n. For memory use `tracemalloc` and compare peak usage across sizes the same way. Profile with `cProfile` to find which function dominates before optimising, because the bottleneck is often not the part with the worst Big-O but a cheap operation called millions of times. I did this for a report generator that was slow, and the culprit was a `df.append` in a loop, an O(n²) pattern, not the sorting I had suspected.

## The top 30 interview problems & how to approach a whiteboard round

Coding interviews recycle a small number of patterns. This chapter lists thirty problems that cover most of what a screen or on-site will ask, mapped to the technique that solves each, then walks through a 45-minute whiteboard round so the technique comes out under pressure.

### The 30 problems and their patterns

| # | Problem | Pattern | Time / space |
|---|---|---|---|
| 1 | Two sum | hash map | O(n) / O(n) |
| 2 | Best time to buy and sell stock | running minimum | O(n) / O(1) |
| 3 | Contains duplicate | set | O(n) / O(n) |
| 4 | Product of array except self | prefix and suffix products | O(n) / O(1) extra |
| 5 | Maximum subarray | Kadane (DP) | O(n) / O(1) |
| 6 | Merge intervals | sort + sweep | O(n log n) / O(n) |
| 7 | 3-sum | sort + two pointers | O(n²) / O(1) |
| 8 | Container with most water | two pointers | O(n) / O(1) |
| 9 | Longest substring without repeats | sliding window | O(n) / O(k) |
| 10 | Minimum window substring | sliding window + counter | O(n) / O(k) |
| 11 | Valid anagram / group anagrams | counting / sorted key | O(n) / O(n) |
| 12 | Valid parentheses | stack | O(n) / O(n) |
| 13 | Longest palindromic substring | expand around centre | O(n²) / O(1) |
| 14 | Reverse linked list | pointer flipping | O(n) / O(1) |
| 15 | Merge two sorted lists | dummy head merge | O(n) / O(1) |
| 16 | Linked list cycle | fast/slow pointers | O(n) / O(1) |
| 17 | LRU cache | hash map + doubly linked list | O(1) per op |
| 18 | Invert / max depth of binary tree | recursion | O(n) / O(h) |
| 19 | Validate BST | bounds recursion | O(n) / O(h) |
| 20 | Level-order traversal | BFS with queue | O(n) / O(w) |
| 21 | Lowest common ancestor | recursion / BST walk | O(n) or O(h) |
| 22 | Kth largest element | heap or quickselect | O(n log k) / O(k) |
| 23 | Top k frequent elements | counter + heap / bucket | O(n log k) |
| 24 | Number of islands | grid DFS / BFS | O(rc) / O(rc) |
| 25 | Course schedule | topological sort | O(V + E) |
| 26 | Clone graph | DFS + visited map | O(V + E) |
| 27 | Climbing stairs / house robber | 1-D DP | O(n) / O(1) |
| 28 | Coin change / word break | 1-D DP over amount or index | O(n·m) |
| 29 | Longest common subsequence / edit distance | 2-D DP | O(mn) |
| 30 | Subsets / permutations / N-Queens | backtracking | exponential |

Write each from memory with its complexity and you are prepared for most screens.

### Worked example: product of array except self

Return `out[i]` = product of all elements except `nums[i]`, without division, in O(n). Build prefix products left to right, then multiply in suffix products right to left with one running variable.

```python
def product_except_self(nums):
    n = len(nums)
    out = [1] * n
    for i in range(1, n):
        out[i] = out[i - 1] * nums[i - 1]        # product of everything left of i
    suffix = 1
    for i in range(n - 1, -1, -1):
        out[i] *= suffix                          # times everything right of i
        suffix *= nums[i]
    return out

print(product_except_self([1, 2, 3, 4]))   # [24, 12, 8, 6]
```

### Worked example: longest palindromic substring

Expand around each of the 2n − 1 centres (each character and each gap).

```python
def longest_palindrome(s):
    best = ""
    for centre in range(len(s)):
        for l, r in ((centre, centre), (centre, centre + 1)):
            while l >= 0 and r < len(s) and s[l] == s[r]:
                l -= 1; r += 1
            if r - l - 1 > len(best):
                best = s[l + 1:r]
    return best

print(longest_palindrome("babad"), longest_palindrome("cbbd"))   # bab (or aba), bb
```

### The whiteboard process (45 minutes)

| Minutes | Step | What you do |
|---|---|---|
| 0–5 | Clarify | Restate the problem; ask about size, ranges, duplicates, empty input, sortedness, mutability; write one example with its expected output |
| 5–10 | Brute force | State the obvious solution and its complexity out loud, as a baseline |
| 10–15 | Pattern | What is the inner loop searching for (hash map)? Sorted (two pointers, binary search)? Contiguous (sliding window)? Overlapping sub-problems (DP)? Enumerate all (backtracking)? Shortest path (BFS)? Name the pattern and target complexity |
| 15–35 | Code | Small functions, real names, talk while writing; when stuck, trace the example |
| 35–42 | Test | Trace by hand on the example, then edge cases: empty, one element, all equal |
| 42–45 | Wrap up | State time and space; say what changes for huge or streaming input |

Interviewers grade four signals: problem solving (brute force to optimal, with reasons), coding (correct, readable, handles edges), communication (thinks aloud, asks before assuming) and verification (traces code and finds own bugs).

> **Interview note:** If you recognise the problem, say so and solve it anyway with full explanation; interviewers can tell when someone is reciting. If you do not, the process above produces a solution from first principles, and a clean O(n log n) with a clear explanation beats a confused O(n).

### Try It Yourself

```python
import random, math, heapq
from collections import Counter

def product_except_self(nums):
    out = [1] * len(nums)
    for i in range(1, len(nums)):
        out[i] = out[i - 1] * nums[i - 1]
    suffix = 1
    for i in range(len(nums) - 1, -1, -1):
        out[i] *= suffix; suffix *= nums[i]
    return out

def max_profit(prices):
    lo, best = float("inf"), 0
    for p in prices:
        lo = min(lo, p); best = max(best, p - lo)
    return best

def top_k_frequent(items, k):
    return [x for x, _ in heapq.nlargest(k, Counter(items).items(), key=lambda kv: kv[1])]

def longest_palindrome(s):
    best = ""
    for c in range(len(s)):
        for l, r in ((c, c), (c, c + 1)):
            while l >= 0 and r < len(s) and s[l] == s[r]: l -= 1; r += 1
            if r - l - 1 > len(best): best = s[l + 1:r]
    return best

print("product except self:", product_except_self([1, 2, 3, 4]))
print("best single trade:", max_profit([7, 1, 5, 3, 6, 4]))
print("top 2 statuses:", top_k_frequent(["closed", "open", "closed", "pending", "closed", "open"], 2))
print("longest palindrome:", longest_palindrome("forgeeksskeegfor"))

# Self-test: run every function on random data and compare with a brute force
for _ in range(200):
    a = [random.randint(1, 9) for _ in range(random.randint(1, 6))]
    brute = [math.prod(a[:i] + a[i+1:]) for i in range(len(a))]
    assert product_except_self(a) == brute, a
print("200 random checks passed")
```

### Quiz

1. Which pattern solves "longest substring without repeating characters"?
- [ ] Backtracking
- [x] Sliding window
- [ ] Binary search
> The answer is a contiguous range maintained by two forward-moving pointers.

2. What is the first thing you should do when handed a whiteboard problem?
- [ ] Start coding the optimal solution
- [x] Clarify the problem and write a small example
- [ ] Ask for a hint
> Misunderstanding the problem is the most common way to fail; examples expose it early.

3. Product of array except self without division uses:
- [x] Prefix products and suffix products
- [ ] A hash map
- [ ] Sorting
> Multiplying everything to the left by everything to the right avoids division and stays O(n).

4. Quickselect's average and worst-case time are:
- [x] O(n) average, O(n²) worst
- [ ] O(n log n) both
- [ ] O(log n) average, O(n) worst
> Random pivots make the bad case vanishingly rare, but it exists, unlike the heap's guaranteed bound.

### Exercises

1. **Best time to buy and sell stock II** — You may complete as many trades as you like (sell before buying again). Maximise profit.
<details><summary>Solution</summary>

```python
def max_profit_many(prices):
    return sum(max(0, prices[i] - prices[i - 1]) for i in range(1, len(prices)))
print(max_profit_many([7, 1, 5, 3, 6, 4]))   # 7
# Greedy: collect every upward step; any profitable trade decomposes into daily rises.
```

</details>

2. **Top k frequent with bucket sort** — Solve top-k frequent elements in O(n) rather than O(n log k).
<details><summary>Solution</summary>

```python
from collections import Counter
def top_k(nums, k):
    counts = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]      # index = frequency
    for x, c in counts.items():
        buckets[c].append(x)
    out = []
    for c in range(len(buckets) - 1, 0, -1):
        out.extend(buckets[c])
        if len(out) >= k: return out[:k]
    return out
print(top_k([1, 1, 1, 2, 2, 3], 2))   # [1, 2]
```

</details>

3. **Design a 45-minute plan** — Write, as comments, the questions you would ask and the steps you would take for "find the k most common words in a 767-page handbook", then implement it.
<details><summary>Solution</summary>

```python
# Clarify: case-insensitive? strip punctuation? stop words? memory limit? ties?
# Brute force: count with a dict, sort all words: O(n log n).
# Optimise: Counter + heapq.nlargest -> O(n log k); or bucket sort -> O(n).
# Edge cases: empty text, k > distinct words, Unicode (casefold), hyphenated words.
import re, heapq
from collections import Counter
def top_words(text, k):
    words = re.findall(r"[a-z0-9']+", text.casefold())
    return heapq.nlargest(k, Counter(words).items(), key=lambda kv: (kv[1], kv[0]))
print(top_words("The policy. The manual! the POLICY manual policy.", 2))
```

</details>

### Interview Questions

**Q: Walk me through how you would approach a problem you have never seen before.**
I restate the problem and write a concrete example with the expected output, then ask about constraints: input size, ranges, duplicates, whether input is sorted or mutable, and what to return on empty input. I describe the brute force and its complexity so we share a baseline. Then I look for the pattern by asking what the inner loop is searching for, whether the structure is contiguous, sorted, hierarchical or graph-like, and whether sub-problems overlap. I state the target complexity, code it in small named functions, trace it on the example and an edge case, and finish with time and space and one follow-up such as how it would change for streaming input. The goal is that at every minute the interviewer knows what I am thinking and why.

**Q: Which data structure would you pick for each: fast membership, ordered iteration, priority scheduling, prefix search, undo history?**
Fast membership is a set or dict, O(1) average. Ordered iteration with frequent inserts is a balanced BST or, in Python, `bisect` on a sorted list or `sortedcontainers`; for mostly-static data a sorted list is enough. Priority scheduling is a heap via `heapq`, O(log n) push and pop, with a counter for stable tie-breaking. Prefix search is a trie, O(L) per query plus output. Undo history is a stack, with a second stack for redo, and if memory is a concern a bounded `deque(maxlen=n)`. Being able to answer this in one breath, with the complexity of each, is what "knows their data structures" means to an interviewer.

**Q: How do you handle getting stuck during a coding interview?**
I say that I am stuck and on what, because silence is the worst signal. I go back to the small example and trace what the state should be at each step, which usually reveals the missing invariant. If the optimal approach is not coming, I write the brute force cleanly and correctly, state its complexity, and then optimise the bottleneck loop, since a working O(n²) with a clear explanation is far better than an unfinished O(n). I also use the interviewer: asking "would a hash map of seen values be the right direction?" costs nothing and often gets a nod. What I never do is write code I cannot explain.

**Q: What follow-up questions should you expect after solving a problem, and how do you prepare for them?**
The standard follow-ups are: what if the input does not fit in memory (stream it, use external sort, or keep a bounded heap); what if it is called many times on the same data (precompute an index, prefix sums or a trie); what if the data changes (use a structure with cheap updates, such as a Fenwick tree instead of prefix sums); what if there are concurrent writers (locks, or an immutable snapshot); and can you reduce space (rolling DP rows, in-place two pointers). I prepare by asking myself those five questions after every practice problem, so that in the room the answer is a recall rather than a derivation.

