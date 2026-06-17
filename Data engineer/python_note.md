# Python Interview Notes
## Python Fundamentals · OOP · Advanced Python · NumPy · Pandas · Scikit-learn · Matplotlib · Seaborn · FastAPI · Flask

> **Covers:** Python Fundamentals · OOP · Advanced Python · Data Science Stack · ML with Scikit-learn · Visualization · REST APIs  
> **Target:** 3–15 Years Experienced Data/ML Engineers · Backend Developers · Data Scientists  
> **Prepared by:** Senior Data/ML Engineer (10+ years Python experience)

---

## Table of Contents

0. [Python Fundamentals](#0-python-fundamentals)
1. [Python OOP](#1-python-oop)
2. [Advanced Python](#2-advanced-python)
3. [NumPy](#3-numpy)
4. [Pandas](#4-pandas)
5. [Scikit-learn](#5-scikit-learn)
6. [Matplotlib](#6-matplotlib)
7. [Seaborn](#7-seaborn)
8. [FastAPI](#8-fastapi)
9. [Flask](#9-flask)
10. [Scenario-Based Questions](#10-scenario-based-questions)
11. [Coding Questions](#11-coding-questions)
12. [Python Interview Cheat Sheet](#12-python-interview-cheat-sheet)

---


---

# 0. Python Fundamentals

> Added as a standalone section covering core language theory — variables, data types, control flow, functions, modules, exceptions, I/O, and the Python execution model. Essential for interviews at all levels.

---

## 0.1 Python Language Overview

### What is Python?

Python is a **high-level, interpreted, dynamically typed, garbage-collected, general-purpose** programming language created by Guido van Rossum (1991). Key characteristics:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PYTHON CHARACTERISTICS                           │
├──────────────────────┬──────────────────────────────────────────────┤
│ Interpreted          │ Executes line by line via CPython interpreter │
│ Dynamically typed    │ Types checked at runtime, not compile time    │
│ Strongly typed       │ No implicit coercions (1 + "2" → TypeError)  │
│ Garbage collected    │ Reference counting + cyclic GC               │
│ Multi-paradigm       │ OOP + functional + procedural                │
│ Everything is object │ int, str, function, class — all objects      │
│ Duck typing          │ "If it walks and quacks like a duck..."      │
└──────────────────────┴──────────────────────────────────────────────┘
```

### Python Execution Model

```
Source code (.py)
      │
      ▼
  Compiler (CPython)
      │
      ▼
  Bytecode (.pyc in __pycache__)
      │
      ▼
  Python Virtual Machine (PVM)
      │
      ▼
  Output / Side-effects
```

- **CPython** is the reference implementation (C)
- **PyPy** is JIT-compiled → faster for long-running programs
- **Jython** runs on JVM; **IronPython** on .NET CLR
- `.pyc` files cache compiled bytecode for faster repeated imports

---

## 0.2 Variables, Objects, and Names

### Everything is an Object

```python
# In Python, variables are NAMES (labels) that point to objects
# Objects live in memory; names are just references

x = 42          # name 'x' points to int object 42
y = x           # 'y' points to the SAME object as 'x'
x = 100         # 'x' now points to new object 100; y still 42

# id() returns the memory address (identity) of an object
print(id(42))   # consistent for small ints (cached -5 to 256)
print(id(x) == id(y))  # False after reassignment

# type() returns the type of an object
print(type(42))         # <class 'int'>
print(type("hello"))    # <class 'str'>
print(type([]))         # <class 'list'>

# isinstance() — preferred over type() for type checking
print(isinstance(42, int))          # True
print(isinstance(42, (int, float))) # True — tuple of types
```

### Variable Naming Rules

```python
# Valid
my_var = 1
_private = 2        # convention: internal use
__mangled = 3       # name mangling in classes
__dunder__ = 4      # reserved for Python internals
camelCase = 5       # valid but not Pythonic
CamelCase = 6       # convention: class names

# Invalid
2var = 1            # SyntaxError: starts with digit
my-var = 1          # SyntaxError: hyphen not allowed
for = 1             # SyntaxError: reserved keyword

# Python keywords (cannot use as names):
# False, None, True, and, as, assert, async, await,
# break, class, continue, def, del, elif, else, except,
# finally, for, from, global, if, import, in, is, lambda,
# nonlocal, not, or, pass, raise, return, try, while, with, yield
```

### Multiple Assignment and Unpacking

```python
# Multiple assignment
a = b = c = 0            # all point to same int 0

# Tuple unpacking
x, y = 10, 20
a, b, c = [1, 2, 3]

# Extended unpacking (*)
first, *rest = [1, 2, 3, 4, 5]    # first=1, rest=[2,3,4,5]
*init, last  = [1, 2, 3, 4, 5]    # init=[1,2,3,4], last=5
a, *middle, z = [1, 2, 3, 4, 5]   # a=1, middle=[2,3,4], z=5

# Swap without temp variable
a, b = b, a    # Python creates tuple on right first

# Augmented assignment
x += 1;  x -= 1;  x *= 2;  x //= 2;  x **= 2;  x %= 3
x &= 3;  x |= 4;  x ^= 5;  x >>= 1;  x <<= 1
```

---

## 0.3 Data Types

### Numeric Types

```python
# int (arbitrary precision — no overflow!)
x = 1_000_000_000_000_000  # underscores for readability
x = 0b1010          # binary  → 10
x = 0o17            # octal   → 15
x = 0xFF            # hex     → 255
x = int("42")       # string to int
x = int("FF", 16)   # hex string to int → 255

# float (IEEE 754 double precision)
f = 3.14
f = 1.5e10          # scientific notation: 1.5 × 10^10
f = float("inf")    # positive infinity
f = float("nan")    # not a number
# Floating point gotcha:
print(0.1 + 0.2 == 0.3)   # False! (binary representation)
print(round(0.1 + 0.2, 1) == 0.3)  # True

# Use decimal for exact arithmetic
from decimal import Decimal, getcontext
getcontext().prec = 28
print(Decimal("0.1") + Decimal("0.2"))   # 0.3 exactly

# complex
c = 3 + 4j
print(c.real, c.imag, abs(c))   # 3.0, 4.0, 5.0

# Numeric operations
print(10 // 3)   # 3    (floor division)
print(10 %  3)   # 1    (modulo)
print(2 ** 10)   # 1024 (power)
print(divmod(10, 3))  # (3, 1) — quotient and remainder

# Type conversion
int(3.9)    # 3   (truncates, not rounds)
float(3)    # 3.0
round(3.567, 2)  # 3.57
abs(-5)     # 5
```

### Strings

```python
# String literals
s1 = 'single quotes'
s2 = "double quotes"
s3 = """triple
double quotes"""   # multi-line
s4 = r"C:\Users\name"  # raw string — no escape processing
s5 = b"bytes"          # bytes literal
s6 = f"Hello {name}"  # f-string (Python 3.6+)

# Strings are IMMUTABLE sequences of Unicode characters
s = "Hello, World!"
len(s)              # 13
s[0]                # 'H'
s[-1]               # '!'
s[0:5]              # 'Hello' (start inclusive, end exclusive)
s[::-1]             # 'dlroW ,olleH' (reverse)
"ell" in s          # True

# String methods (all return NEW strings — immutable)
"  hello  ".strip()      # 'hello'
"hello".upper()          # 'HELLO'
"HELLO".lower()          # 'hello'
"hello world".title()    # 'Hello World'
"hello".replace("l","r") # 'herro'
"a,b,c".split(",")       # ['a','b','c']
",".join(["a","b","c"])  # 'a,b,c'
"hello".startswith("he") # True
"hello".endswith("lo")   # True
"hello world".find("world")  # 6  (-1 if not found)
"hello world".index("world") # 6  (ValueError if not found)
"hello".center(11, "-")  # '---hello---'
"hello".zfill(8)         # '000hello'
"42".isdigit()           # True
"abc".isalpha()          # True
"abc123".isalnum()       # True

# f-strings (recommended)
name, salary = "Alice", 95000
print(f"{name} earns ₹{salary:,.0f}/year")   # Alice earns ₹95,000/year
print(f"{salary:.2e}")   # 9.50e+04
print(f"{'left':<10}|{'right':>10}")  # alignment
print(f"{3.14159:.3f}")  # 3.142 — 3 decimal places
print(f"{2**10 = }")     # 2**10 = 1024  (debug = syntax, Python 3.8+)

# String formatting alternatives
"{} is {}".format("Python", "great")
"%(name)s" % {"name": "Alice"}   # old style (avoid)

# String interning
a = "hello"
b = "hello"
a is b   # True (Python interns short strings)
# Don't rely on this — use == for string comparison
```

### Boolean

```python
# bool is a subclass of int
True == 1   # True
False == 0  # True
True + True  # 2

# Falsy values — evaluate to False in boolean context
# False, None, 0, 0.0, 0j, "", [], (), {}, set(), range(0)
# any object with __bool__ returning False or __len__ returning 0

bool(0), bool(""), bool([])   # False, False, False
bool(1), bool("a"), bool([0]) # True,  True,  True

# Short-circuit evaluation
x = None
val = x or "default"      # "default" (x is falsy)
val = x and x.attr        # None (short-circuits, no AttributeError)
val = "yes" if x else "no"  # ternary expression

# and/or return operands, not True/False
print(1 and 2)   # 2  (last truthy value)
print(0 and 2)   # 0  (first falsy value)
print(0 or 2)    # 2  (first truthy value)
print(0 or "")   # "" (last value if all falsy)
```

### None

```python
# None is a singleton — the absence of value
x = None
print(type(None))    # <class 'NoneType'>
print(x is None)     # True  (use 'is', not ==)
print(x == None)     # True  (works but not idiomatic)

def find(lst, val):
    for i, v in enumerate(lst):
        if v == val:
            return i
    return None     # explicit None return

result = find([1,2,3], 5)
if result is not None:
    print(f"Found at index {result}")
```

---

## 0.4 Data Structures

### Lists

```python
# Mutable, ordered, allows duplicates
lst = [1, "hello", 3.14, True, None]   # heterogeneous
lst = list(range(10))

# Access
lst[0], lst[-1], lst[2:5], lst[::2]

# Mutate
lst.append(6)           # add to end
lst.insert(2, "x")      # insert at index
lst.extend([7, 8, 9])   # add multiple
lst.remove("hello")     # remove first occurrence (ValueError if absent)
lst.pop()               # remove and return last
lst.pop(2)              # remove and return at index
del lst[0]              # delete by index/slice
del lst[1:3]

# Info
len(lst)
lst.count(5)            # occurrences
lst.index(5)            # first position (ValueError if absent)
5 in lst                # membership test O(n)

# Sort
lst.sort()                          # in-place sort
lst.sort(key=lambda x: -x)         # by custom key
lst.sort(key=lambda x: (x[1], x[0]))  # multi-key
sorted(lst)                         # returns new sorted list
lst.reverse()                       # in-place reverse
list(reversed(lst))                 # new reversed list

# Copy
shallow = lst.copy()    # or lst[:]
import copy
deep = copy.deepcopy(lst)

# List comprehension
squares  = [x**2 for x in range(10)]
even_sq  = [x**2 for x in range(10) if x % 2 == 0]
flat     = [x for row in matrix for x in row]  # flatten 2D

# Common patterns
max_val   = max(lst)
min_val   = min(lst)
total     = sum(lst)
sorted_l  = sorted(lst, reverse=True)
zipped    = list(zip([1,2,3], ["a","b","c"]))  # [(1,'a'),(2,'b'),(3,'c')]
enumed    = list(enumerate(["a","b","c"]))     # [(0,'a'),(1,'b'),(2,'c')]
```

### Tuples

```python
# Immutable, ordered, allows duplicates — faster than lists
t = (1, 2, 3)
t = 1, 2, 3          # parentheses optional
t = (1,)             # single-element tuple needs trailing comma
t = tuple([1, 2, 3]) # from iterable

# Same indexing/slicing as list; cannot mutate
t[0], t[-1], t[1:3]

# Named tuple (readable, memory efficient)
from collections import namedtuple
Point = namedtuple("Point", ["x", "y", "z"])
p = Point(1, 2, 3)
print(p.x, p.y, p[0])   # attribute and index access
p._asdict()              # OrderedDict
p._replace(x=10)         # new tuple with changed field

# typing.NamedTuple (with type hints)
from typing import NamedTuple
class Employee(NamedTuple):
    name: str
    dept: str
    salary: float = 50000.0

# Tuple unpacking
a, b, c = (1, 2, 3)
x, *rest = (1, 2, 3, 4, 5)

# Tuples as dict keys (hashable)
coords = {(0, 0): "origin", (1, 0): "right"}

# Tuple vs List — when to use which?
# Tuple: fixed structure, multiple return values, dict keys, constants
# List:  dynamic collections, need mutation
```

### Dictionaries

```python
# Mutable, ordered (Python 3.7+), key-value pairs
# Keys must be hashable (immutable: int, str, tuple, frozenset)

d = {"name": "Alice", "age": 30, "dept": "Eng"}
d = dict(name="Alice", age=30)
d = dict([("name","Alice"), ("age",30)])
d = {k: v for k, v in zip(["a","b"], [1,2])}

# Access
d["name"]               # "Alice" (KeyError if missing)
d.get("name")           # "Alice" (None if missing)
d.get("email", "N/A")   # "N/A" (default if missing)

# Mutate
d["email"] = "alice@co.com"     # add/update
d.update({"age": 31, "city": "Mumbai"})
d.setdefault("score", 0)        # add only if key missing
del d["age"]
popped = d.pop("dept")          # remove and return
d.pop("missing", None)          # safe pop with default

# Iterate
for key in d:                   # keys
    ...
for key in d.keys():            # explicit keys
    ...
for val in d.values():          # values
    ...
for key, val in d.items():      # key-value pairs
    ...

# Info
len(d)
"name" in d                     # key membership O(1)
list(d.keys()), list(d.values()), list(d.items())

# Merge (Python 3.9+)
d3 = d1 | d2                   # new merged dict
d1 |= d2                        # in-place merge

# Merge (Python 3.5+)
d3 = {**d1, **d2}              # right side wins on conflict

# Dict comprehension
inv = {v: k for k, v in d.items()}
squared = {x: x**2 for x in range(5)}

# defaultdict — auto-creates missing keys
from collections import defaultdict
graph = defaultdict(list)
graph["A"].append("B")          # no KeyError

word_count = defaultdict(int)
for word in text.split():
    word_count[word] += 1

# Counter
from collections import Counter
c = Counter("hello world")
c.most_common(3)                # [('l',3),('o',2),(' ',1)]
```

### Sets

```python
# Mutable, unordered, no duplicates, O(1) lookup
s = {1, 2, 3, 4}
s = set([1, 2, 2, 3, 3])   # {1, 2, 3}
s = set()                   # MUST use set() — {} is empty dict

# Mutate
s.add(5)
s.remove(3)      # KeyError if absent
s.discard(3)     # no error if absent
s.pop()          # remove and return arbitrary element
s.clear()

# Set operations
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
a | b            # union:        {1,2,3,4,5,6}
a & b            # intersection: {3,4}
a - b            # difference:   {1,2}  (in a not in b)
a ^ b            # symmetric diff: {1,2,5,6}  (in one but not both)
a.issubset(b)    # a ⊆ b?
a.issuperset(b)  # a ⊇ b?
a.isdisjoint(b)  # no common elements?

# frozenset — immutable set (hashable, can be dict key)
fs = frozenset([1, 2, 3])

# Set comprehension
even_squares = {x**2 for x in range(10) if x % 2 == 0}

# Use sets for
# - O(1) membership test (vs O(n) for lists)
# - Deduplication: list(set(lst))
# - Set math: common items, unique items
```

### Comparison Summary

```
┌──────────────┬──────────┬─────────┬────────────┬──────────────┐
│              │ Mutable  │ Ordered │ Duplicates │ Lookup       │
├──────────────┼──────────┼─────────┼────────────┼──────────────┤
│ list         │ Yes      │ Yes     │ Yes        │ O(n) by val  │
│ tuple        │ No       │ Yes     │ Yes        │ O(n) by val  │
│ dict         │ Yes      │ Yes3.7+ │ Keys: No   │ O(1) by key  │
│ set          │ Yes      │ No      │ No         │ O(1) member  │
│ frozenset    │ No       │ No      │ No         │ O(1) member  │
└──────────────┴──────────┴─────────┴────────────┴──────────────┘
```

---

## 0.5 Control Flow

### if / elif / else

```python
# Standard conditional
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

# Ternary (conditional expression)
grade = "Pass" if score >= 60 else "Fail"
result = value if value is not None else "default"

# Truthiness
if lst:           # True if list is non-empty
    ...
if not d:         # True if dict is empty
    ...
if x is not None: # Correct None check
    ...

# Pattern matching (Python 3.10+)
match command:
    case "quit":
        quit()
    case "help" | "h":
        show_help()
    case {"action": action, "payload": payload}:
        handle(action, payload)
    case [first, *rest]:
        process_list(first, rest)
    case _:
        print("Unknown command")
```

### Loops

```python
# for loop — iterates over any iterable
for item in iterable:
    ...

# range
for i in range(5):        # 0,1,2,3,4
    ...
for i in range(2, 10, 2): # 2,4,6,8
    ...
for i in range(9, -1, -1):# 9,8,...,0 (countdown)
    ...

# enumerate — index + value
for i, val in enumerate(["a","b","c"]):
    print(i, val)   # 0 a, 1 b, 2 c
for i, val in enumerate(lst, start=1):  # start from 1
    ...

# zip — multiple iterables
for name, score in zip(names, scores):
    print(f"{name}: {score}")

# zip_longest (fills missing with fillvalue)
from itertools import zip_longest
for a, b in zip_longest([1,2,3], [10,20], fillvalue=0):
    ...

# zip(*matrix) — transpose
matrix = [[1,2,3],[4,5,6]]
transposed = list(zip(*matrix))   # [(1,4),(2,5),(3,6)]

# dict iteration
for key, val in d.items():
    ...

# while loop
n = 10
while n > 0:
    n -= 1

# Loop control
for i in range(10):
    if i == 3: continue    # skip rest of this iteration
    if i == 7: break       # exit loop
    print(i)
else:
    # runs if loop completes without break
    print("Loop finished normally")

# Iterating with comprehensions (often cleaner)
result = [process(x) for x in data if condition(x)]
```

---

## 0.6 Functions

### Function Basics

```python
# def, parameters, return
def add(a, b):
    """Add two numbers. Docstring goes here."""
    return a + b

# Multiple return values (tuple)
def minmax(lst):
    return min(lst), max(lst)

lo, hi = minmax([3, 1, 4, 1, 5, 9])

# Default arguments — evaluated ONCE at definition time
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

# Mutable default gotcha
def append_bad(item, lst=[]):   # BAD: shared list!
    lst.append(item); return lst

def append_good(item, lst=None):  # GOOD
    if lst is None: lst = []
    lst.append(item); return lst

# Keyword arguments
def connect(host, port=5432, timeout=30):
    ...
connect("localhost", timeout=10)     # skip port, named timeout
connect(host="db", port=3306)

# *args — variable positional
def sum_all(*args):
    return sum(args)
sum_all(1, 2, 3, 4, 5)   # args = (1,2,3,4,5)

# **kwargs — variable keyword
def create_user(**kwargs):
    return kwargs
create_user(name="Alice", age=30, dept="Eng")

# Combined signature
def func(pos1, pos2, *args, kw_only, **kwargs):
    # pos1, pos2: required positional
    # *args: extra positional
    # kw_only: keyword-only (must be named after *args)
    # **kwargs: extra keyword
    ...

# Unpacking when calling
def add3(a, b, c): return a + b + c
args = [1, 2, 3]
add3(*args)           # unpack list to positional
kw = {"a":1,"b":2,"c":3}
add3(**kw)            # unpack dict to keyword

# Positional-only parameters (Python 3.8+, before /)
def pow(x, y, /, mod=None):   # x and y must be positional
    ...

# Annotations (type hints)
def greet(name: str, times: int = 1) -> str:
    return (f"Hello, {name}! " * times).strip()
```

### Lambda Functions

```python
# Anonymous one-expression function
square = lambda x: x ** 2
add    = lambda a, b: a + b

# Common use: sort key, map/filter
names = ["Charlie", "Alice", "Bob"]
sorted(names, key=lambda n: n.lower())        # case-insensitive sort
sorted(people, key=lambda p: (p.dept, p.salary))  # multi-key

list(map(lambda x: x**2, [1,2,3,4]))         # [1,4,9,16]
list(filter(lambda x: x%2==0, [1,2,3,4,5])) # [2,4]

# Prefer list comprehension over map/filter for clarity:
[x**2 for x in [1,2,3,4]]            # cleaner than map
[x for x in [1,2,3,4,5] if x%2==0]   # cleaner than filter
```

### Scope and LEGB Rule

```python
# Python looks up names in this order:
# L — Local (inside current function)
# E — Enclosing (outer function scopes)
# G — Global (module level)
# B — Built-in (Python builtins)

x = "global"

def outer():
    x = "enclosing"
    def inner():
        x = "local"
        print(x)    # "local"
    inner()
    print(x)        # "enclosing"

outer()
print(x)            # "global"

# global — access/modify global from function
count = 0
def increment():
    global count
    count += 1

# nonlocal — access/modify enclosing scope
def make_counter():
    n = 0
    def counter():
        nonlocal n
        n += 1
        return n
    return counter

c = make_counter()
print(c(), c(), c())   # 1, 2, 3
```

---

## 0.7 Exceptions and Error Handling

### Exception Hierarchy

```
BaseException
├── SystemExit
├── KeyboardInterrupt
├── GeneratorExit
└── Exception
    ├── StopIteration
    ├── ArithmeticError
    │   ├── ZeroDivisionError
    │   ├── OverflowError
    │   └── FloatingPointError
    ├── AttributeError
    ├── ImportError
    │   └── ModuleNotFoundError
    ├── LookupError
    │   ├── IndexError
    │   └── KeyError
    ├── NameError
    │   └── UnboundLocalError
    ├── OSError (IOError)
    │   ├── FileNotFoundError
    │   ├── PermissionError
    │   └── TimeoutError
    ├── RuntimeError
    │   └── RecursionError
    ├── TypeError
    ├── ValueError
    │   └── UnicodeError
    └── ...
```

### try / except / else / finally

```python
# Full exception handling structure
try:
    result = int(input("Enter number: "))
    quotient = 10 / result
except ValueError as e:
    print(f"Not a number: {e}")
except ZeroDivisionError:
    print("Cannot divide by zero")
except (TypeError, AttributeError) as e:
    print(f"Type/attr error: {e}")
except Exception as e:
    print(f"Unexpected: {type(e).__name__}: {e}")
    raise           # re-raise the same exception
else:
    # Runs only if NO exception was raised in try
    print(f"Result: {quotient}")
finally:
    # ALWAYS runs (cleanup: close files, DB connections)
    print("Done")

# Exception chaining
try:
    data = load_config()
except FileNotFoundError as e:
    raise RuntimeError("Config missing") from e     # chain

# Suppress specific exceptions
from contextlib import suppress
with suppress(FileNotFoundError):
    os.remove("optional_file.txt")

# Custom exceptions
class DataPipelineError(Exception):
    """Base class for pipeline errors."""
    pass

class SchemaValidationError(DataPipelineError):
    def __init__(self, column, expected, got):
        self.column   = column
        self.expected = expected
        self.got      = got
        super().__init__(f"Column '{column}': expected {expected}, got {got}")

class DataQualityError(DataPipelineError):
    def __init__(self, message, row_count=None):
        self.row_count = row_count
        super().__init__(message)

# Raise custom exception
def validate_schema(df, schema):
    for col, dtype in schema.items():
        if col not in df.columns:
            raise SchemaValidationError(col, dtype, "MISSING")
        if str(df[col].dtype) != dtype:
            raise SchemaValidationError(col, dtype, str(df[col].dtype))

# Best practices
# 1. Catch specific exceptions, not bare except
# 2. Never silence errors without logging
# 3. Use 'else' for code that should only run if try succeeded
# 4. Use 'finally' for cleanup (or use context managers)
# 5. Include useful info in exception messages
# 6. Re-raise with 'raise' (not raise e) to preserve traceback
```

---

## 0.8 File I/O

```python
# Text files — context manager (auto-closes)
with open("data.txt", "r", encoding="utf-8") as f:
    content  = f.read()              # entire file as string
    lines    = f.readlines()         # list of lines (with \n)
    for line in f:                   # lazy line-by-line (memory efficient)
        process(line.rstrip("\n"))

# Write
with open("output.txt", "w", encoding="utf-8") as f:
    f.write("Hello\n")
    f.writelines(["line1\n", "line2\n"])

# Append
with open("log.txt", "a") as f:
    f.write(f"{timestamp}: {message}\n")

# Modes: 'r' read, 'w' write (overwrite), 'a' append,
#         'x' exclusive create, 'b' binary, '+' read+write
#         'rb' binary read, 'wb' binary write

# Binary files
with open("image.png", "rb") as f:
    data = f.read()

# CSV
import csv
with open("data.csv", "r", newline="") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], row["salary"])

with open("output.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "salary"])
    writer.writeheader()
    writer.writerow({"name": "Alice", "salary": 90000})

# JSON
import json
# Read
with open("config.json") as f:
    config = json.load(f)
data = json.loads('{"key": "value"}')    # from string

# Write
with open("output.json", "w") as f:
    json.dump(data, f, indent=2, default=str)   # default=str handles datetime
json_str = json.dumps(data, indent=2)

# Pickle (Python-specific serialization)
import pickle
with open("model.pkl", "wb") as f:
    pickle.dump(obj, f)
with open("model.pkl", "rb") as f:
    obj = pickle.load(f)

# Path operations
from pathlib import Path

p = Path("data/raw/sales.csv")
p.parent           # Path("data/raw")
p.name             # "sales.csv"
p.stem             # "sales"
p.suffix           # ".csv"
p.exists()         # bool
p.is_file()
p.is_dir()

p2 = Path("data") / "processed" / "output.parquet"  # cross-platform join
p2.mkdir(parents=True, exist_ok=True)    # create dirs
p.read_text()       # shortcut for open+read
p.write_text("...")

# List files
list(Path(".").glob("*.py"))             # *.py files
list(Path(".").rglob("*.csv"))           # recursive glob
[f for f in Path("data").iterdir() if f.is_file()]
```

---

## 0.9 Modules, Packages, and Imports

```python
# Import styles
import os                          # full module
import os.path                     # submodule
from os import path, getcwd        # specific names
from os.path import join, exists   # specific from submodule
from os import *                   # all public names (avoid in production)
import numpy as np                 # alias
from typing import List as L       # alias specific name

# __name__ guard
if __name__ == "__main__":
    # Runs only when script is executed directly
    # Not when imported as module
    main()

# sys.path — where Python looks for modules
import sys
print(sys.path)
sys.path.insert(0, "/custom/module/path")

# __init__.py — marks directory as package
# mypackage/
# ├── __init__.py
# ├── utils.py
# └── models/
#     ├── __init__.py
#     └── classifier.py

from mypackage.utils import helper_fn
from mypackage.models.classifier import Classifier

# Relative imports (within package)
# In mypackage/models/classifier.py:
from ..utils import helper_fn   # go up one level then to utils
from . import base_model        # same package

# Lazy imports (defer until needed)
def get_pandas():
    import pandas as pd   # imported only when function is called
    return pd

# importlib (dynamic imports)
import importlib
module = importlib.import_module("pandas")
klass  = getattr(module, "DataFrame")

# __all__ — controls what gets exported with *
# In mymodule.py:
__all__ = ["PublicClass", "public_function"]   # only these exported
```

---

## 0.10 Comprehensions Deep Dive

```python
# List comprehension — [expression for item in iterable if condition]
squares = [x**2 for x in range(10)]
filtered = [x for x in range(20) if x % 2 == 0 if x % 3 == 0]  # multiple ifs

# Nested loops
flat = [x for row in [[1,2],[3,4],[5,6]] for x in row]  # [1,2,3,4,5,6]
pairs = [(x,y) for x in range(3) for y in range(3) if x != y]

# Dict comprehension
word_len = {word: len(word) for word in "python is great".split()}
inv = {v: k for k, v in {"a":1,"b":2}.items()}
filtered_d = {k: v for k, v in d.items() if v > 0}

# Set comprehension
vowels = {c for c in "hello world" if c in "aeiou"}

# Generator expression — lazy evaluation
total = sum(x**2 for x in range(10**7))   # no list in memory
any_neg = any(x < 0 for x in data)        # short-circuits
all_pos = all(x > 0 for x in data)
first_neg = next((x for x in data if x < 0), None)  # first match or default

# Walrus operator in comprehensions (Python 3.8+)
results = [y for x in data if (y := expensive(x)) > threshold]

# Nested list comprehension (matrix)
matrix = [[1,2,3],[4,5,6],[7,8,9]]
transposed = [[row[i] for row in matrix] for i in range(3)]
# [[1,4,7],[2,5,8],[3,6,9]]

# When NOT to use comprehensions
# – When logic is complex (use regular loop + append)
# – When you need side effects only (use regular loop)
# – When you need early exit (use regular loop)
```

---

## 0.11 Memory Model and Internals

```python
# Python object model — every object has:
# - ob_refcnt: reference count
# - ob_type: pointer to type
# - Value

import sys
x = [1, 2, 3]
print(sys.getrefcount(x))    # reference count (usually +1 for getrefcount itself)

# Reference counting
a = [1, 2, 3]    # refcount = 1
b = a            # refcount = 2
del a            # refcount = 1
b = None         # refcount = 0 → object deallocated immediately

# Cyclic garbage collector
import gc
gc.collect()          # manually trigger
gc.disable()          # turn off (for performance-critical sections)
gc.enable()

# Memory size
import sys
print(sys.getsizeof([]))            # 56 bytes (empty list)
print(sys.getsizeof([1]))           # 64 bytes
print(sys.getsizeof(""))            # 49 bytes
print(sys.getsizeof(int()))         # 28 bytes

# Interning
# Python interns (caches) small integers (-5 to 256) and short strings
a = 256;  b = 256;  print(a is b)   # True (cached)
a = 257;  b = 257;  print(a is b)   # False (not cached)
s1 = "hello"; s2 = "hello"
print(s1 is s2)   # True (interned — single-word, no spaces)

# Memory profiling
# pip install memory-profiler
from memory_profiler import profile
@profile
def memory_heavy():
    return [x**2 for x in range(10**6)]

# tracemalloc — built-in memory tracing
import tracemalloc
tracemalloc.start()
# ... code ...
snapshot = tracemalloc.take_snapshot()
top_stats = snapshot.statistics("lineno")
for stat in top_stats[:3]:
    print(stat)
```

---

## 0.12 Extended Theory and Q&A

### Python Data Model

**Q1. What is Python's data model?**

Answer: The Python data model defines how objects behave with built-in operations. Every object has: an **identity** (`id()` — memory address), a **type** (`type()`), and a **value**. By implementing special (dunder) methods, any class can integrate with Python's syntax. For example: `__add__` enables `+`, `__len__` enables `len()`, `__iter__` enables `for` loops, `__getitem__` enables `[]` subscripting. This is why NumPy arrays, Pandas DataFrames, and SQLAlchemy query objects all work seamlessly with Python built-ins.

---

**Q2. What is the difference between `is` and `==`?**

Answer:
- `==` tests **value equality** — calls `__eq__`. Two different objects with the same value are `==`.
- `is` tests **identity** — same object in memory (`id(a) == id(b)`).

```python
a = [1, 2, 3]
b = [1, 2, 3]
print(a == b)   # True  (same value)
print(a is b)   # False (different objects)

c = a
print(a is c)   # True  (same object)

# Common mistake:
x = None
if x == None:   # works but non-idiomatic
    ...
if x is None:   # CORRECT — None is a singleton
    ...
```

---

**Q3. Why are mutable default arguments dangerous?**

Answer: Default arguments are evaluated **once** when the function is defined, not each time it's called. A mutable default (list, dict) is shared across all calls:

```python
def append(item, lst=[]):    # lst created ONCE
    lst.append(item)
    return lst

append(1)   # [1]
append(2)   # [1, 2]  ← surprising! not [2]
append(3)   # [1, 2, 3]

# Fix: use None sentinel
def append(item, lst=None):
    if lst is None:
        lst = []
    lst.append(item)
    return lst
```

---

**Q4. What is the difference between `deepcopy` and `copy`?**

Answer:
```python
import copy

original = [[1, 2], [3, 4]]

shallow = copy.copy(original)       # new list, but inner lists shared
shallow[0].append(99)
print(original[0])   # [1, 2, 99] — original changed!

deep = copy.deepcopy(original)     # recursively copies all objects
deep[0].append(88)
print(original[0])   # [1, 2, 99] — original unchanged
```
Use `copy` when the outer container needs a new reference but inner immutable objects can be shared. Use `deepcopy` when the entire structure must be independent.

---

**Q5. How does Python manage memory?**

Answer: Python uses two mechanisms:
1. **Reference counting** (primary): Each object tracks the number of references to it. When count reaches 0, memory is freed immediately. Fast, deterministic. Limitation: can't handle cyclic references (A → B → A).
2. **Cyclic garbage collector** (`gc` module): Periodically scans for cyclic reference groups and frees them. Triggered automatically but can be forced with `gc.collect()`.

Additionally: small integers (-5 to 256) and interned strings are cached to avoid redundant allocation. The `del` statement decrements the reference count; it doesn't directly free memory.

---

**Q6. What is duck typing?**

Answer: "If it walks like a duck and quacks like a duck, it's a duck." Python doesn't require objects to be of a specific type — only that they have the required methods/attributes. This is structural typing at runtime:

```python
def process(obj):
    # Works for any object with .read() — file, StringIO, custom
    data = obj.read()
    return data

import io
process(open("file.txt"))           # real file
process(io.StringIO("test data"))   # in-memory string buffer
process(MyCustomReader())           # custom class with .read()
```

Duck typing enables polymorphism without inheritance. Python 3.8+ adds Protocol for static duck typing.

---

**Q7. What is the difference between `__str__` and `__repr__`?**

Answer:
- `__repr__`: Unambiguous representation for developers. Should ideally be valid Python to recreate the object. Used by REPL, `repr()`, containers (lists, dicts show repr of items).
- `__str__`: Human-readable. Used by `print()`, `str()`, `format()`.

If only `__repr__` is defined, Python falls back to it for `str()`. Always implement `__repr__` at minimum.

```python
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __repr__(self): return f"Point({self.x}, {self.y})"
    def __str__(self):  return f"({self.x}, {self.y})"

p = Point(3, 4)
print(p)       # (3, 4)       — __str__
repr(p)        # Point(3, 4)  — __repr__
[p]            # [Point(3, 4)] — __repr__ in container
```

---

**Q8. What is the difference between an iterable and an iterator?**

Answer:
- **Iterable**: Any object that implements `__iter__()`, returning an iterator. Examples: list, tuple, str, dict, set, file, generator. Can be iterated multiple times.
- **Iterator**: Any object implementing both `__iter__()` and `__next__()`. Stateful — tracks current position. Exhausts after one full pass.

```python
lst = [1, 2, 3]        # iterable
it  = iter(lst)        # iterator = iter(iterable)

print(next(it))        # 1
print(next(it))        # 2
print(next(it))        # 3
next(it)               # StopIteration

# Iterator is also iterable
print(iter(it) is it)  # True — __iter__ returns self

# Can iterate list multiple times, iterator only once
for x in lst: print(x)  # 1,2,3
for x in lst: print(x)  # 1,2,3 again

for x in it: print(x)   # nothing — exhausted
```

---

**Q9. Explain how Python's `for` loop works internally.**

Answer: Python's `for x in obj:` is syntactic sugar for:
```python
it = iter(obj)         # calls obj.__iter__()
while True:
    try:
        x = next(it)   # calls it.__next__()
        # loop body
    except StopIteration:
        break
```
This is why you can `for` over any object with `__iter__` — lists, generators, file handles, custom classes. The `for-else` clause's `else` block runs if the loop completes without a `break` (i.e., `StopIteration` was raised naturally).

---

**Q10. What is the difference between `staticmethod` and `classmethod`?**

Answer:
```python
class MyClass:
    count = 0

    def instance_method(self):
        # Has access to instance (self) and class (self.__class__)
        return self

    @classmethod
    def class_method(cls):
        # Has access to class (cls) but not instance
        # cls = MyClass (or subclass if called on subclass)
        cls.count += 1
        return cls()            # useful for alternate constructors

    @staticmethod
    def static_method(x, y):
        # No access to instance OR class
        # Pure utility — logically belongs to class namespace
        return x + y

# Alternate constructor pattern
class Date:
    def __init__(self, year, month, day):
        self.year, self.month, self.day = year, month, day

    @classmethod
    def from_string(cls, date_str):
        y, m, d = map(int, date_str.split("-"))
        return cls(y, m, d)          # cls() supports subclassing

    @staticmethod
    def is_valid(year, month, day):
        return 1 <= month <= 12 and 1 <= day <= 31
```

---

**Q11. What are `*args` and `**kwargs` and how do they interact with parameter order?**

Answer:
```python
# Parameter order (PEP 570):
# def f(pos_only, /, normal, *args, kw_only, **kwargs)

def demo(a, b, /, c, d=10, *args, e, f=20, **kwargs):
    print(f"a={a}, b={b}")          # positional-only (before /)
    print(f"c={c}, d={d}")          # normal
    print(f"args={args}")           # extra positional
    print(f"e={e}, f={f}")          # keyword-only (after *)
    print(f"kwargs={kwargs}")       # extra keyword

demo(1, 2, 3, 4, 5, 6, e=7, f=8, extra=9)
# a=1, b=2 (positional-only)
# c=3, d=4 (normal)
# args=(5, 6) (extra positional)
# e=7, f=8 (keyword-only)
# kwargs={'extra': 9}

# Call-site unpacking
args = [1, 2, 3]
kwargs = {"sep": ", "}
print(*args, **kwargs)   # unpack into function call
```

---

**Q12. What is a closure and what problem does it solve?**

Answer: A closure is a function that captures and remembers variables from its enclosing scope even after the outer function has returned. It solves the need for stateful functions without classes:

```python
def make_adder(n):
    def adder(x):
        return x + n    # 'n' captured from enclosing scope
    return adder

add5  = make_adder(5)
add10 = make_adder(10)
print(add5(3))    # 8
print(add10(3))   # 13

# Inspect closure
print(add5.__closure__[0].cell_contents)   # 5

# Late binding gotcha
funcs = [lambda: i for i in range(3)]
[f() for f in funcs]   # [2, 2, 2] — all capture same 'i' (=2 at end)

# Fix with default argument (captures value at definition)
funcs = [lambda i=i: i for i in range(3)]
[f() for f in funcs]   # [0, 1, 2]
```

---

**Q13. How does Python's `import` system work?**

Answer: When you `import foo`:
1. Python checks `sys.modules` cache — if already imported, returns cached module.
2. If not cached, searches `sys.path` (list of directories) for `foo.py`, `foo/` package, or compiled extension.
3. Creates a new module object, executes the module's code in the module's namespace.
4. Stores the module in `sys.modules`.
5. Binds the name in the current namespace.

```python
import sys
print("pandas" in sys.modules)  # True if already imported

# Force reimport
import importlib
importlib.reload(mymodule)       # re-executes module code

# __init__.py is executed when package is imported
# from package import * imports names in __all__
```

---

**Q14. What are Python's built-in functions and when do you use them?**

Answer: Key built-ins every Python developer must know:

```python
# Type conversion
int("42"), float("3.14"), str(42), bool(0), list((1,2)), tuple([1,2])
bytes("hello","utf-8"), chr(65), ord("A")

# Math
abs(-5), round(3.567, 2), pow(2, 10), divmod(10, 3)
min([3,1,2]), max([3,1,2]), sum([1,2,3])

# Iterables
len(obj), range(10), enumerate(lst), zip(a,b)
map(fn, it), filter(fn, it), reversed(lst), sorted(lst, key=fn)
any(x>0 for x in lst), all(x>0 for x in lst)
next(it, default), iter(obj)

# Object inspection
type(obj), isinstance(obj, cls), issubclass(cls, base)
id(obj), hash(obj), dir(obj), vars(obj), callable(obj)
getattr(obj, "attr", default), setattr(obj, "attr", val), hasattr(obj, "attr")
delattr(obj, "attr")

# I/O
print(*args, sep=" ", end="\n", file=sys.stdout)
input("prompt")
open(path, mode, encoding)

# Functional
list(map(fn, it))   → [fn(x) for x in it]   # same
list(filter(fn,it)) → [x for x in it if fn(x)]  # same
from functools import reduce
reduce(lambda a,b: a+b, [1,2,3,4])   # 10

# repr, eval (careful with eval!)
repr([1,2,3])        # "[1, 2, 3]"
eval("[1, 2, 3]")    # [1, 2, 3]  (DANGEROUS with user input)
exec("x = 1 + 1")   # executes code string

# globals() and locals()
print(globals())     # current global namespace dict
print(locals())      # current local namespace dict
```

---

**Q15. What is the difference between `range`, `xrange`, and `arange`?**

Answer:
- `range` (Python 3): Lazy sequence object. Doesn't create a list. `range(10**9)` uses constant memory. Supports `len()`, indexing, slicing, `in` test.
- `xrange` (Python 2 only): Python 2's lazy range. Removed in Python 3 — `range` in Python 3 IS the lazy version.
- `np.arange` (NumPy): Returns a NumPy ndarray. Supports float steps (`np.arange(0, 1, 0.1)`). Stores all values in memory. Use when you need a NumPy array for math operations.

```python
r = range(0, 10, 2)    # range object — lazy
list(r)                # [0,2,4,6,8] — evaluate when needed
r[3]                   # 6 — supports indexing
6 in r                 # True — O(1) check

import numpy as np
np.arange(0, 1, 0.1)   # array([0. , 0.1, 0.2, ...]) — NumPy array
np.linspace(0, 1, 11)  # preferred for float ranges (exact endpoint)
```

---

### Extended Q&A: OOP Deep Dive

**Q16. What is the difference between composition and inheritance? When to use each?**

Answer: Both reuse code, but differently:
- **Inheritance** ("is-a"): Dog IS-A Animal. Use when the child truly IS a specialization of the parent. Risk: tight coupling, fragile base class problem, deep chains become hard to understand.
- **Composition** ("has-a"): Car HAS-A Engine. One class contains an instance of another. More flexible, loosely coupled. "Prefer composition over inheritance" (Gang of Four).

```python
# Inheritance: Manager IS-A Employee
class Manager(Employee):
    def approve_expense(self): ...

# Composition: Employee HAS-A Address (not Employee IS-A Address)
class Address:
    def __init__(self, city, pincode): ...

class Employee:
    def __init__(self, name, address: Address):
        self.address = address   # composition
```

---

**Q17. What is monkey patching?**

Answer: Monkey patching is dynamically modifying a class or module at runtime — replacing/adding methods or attributes after the original code ran:

```python
import requests

def mock_get(url, **kwargs):
    return MockResponse({"status": "ok"}, 200)

# Replace real method with mock at runtime
requests.get = mock_get   # monkey patch for testing

# Common in testing (but use unittest.mock in production):
from unittest.mock import patch, MagicMock

with patch("requests.get") as mock:
    mock.return_value = MagicMock(status_code=200, json=lambda: {"ok":True})
    result = my_function_that_calls_requests()
```

---

**Q18. What is `__slots__` and when should you use it?**

Answer: By default, Python stores instance attributes in a `__dict__` per instance (a regular Python dict). For classes with many instances, this is wasteful. `__slots__` replaces `__dict__` with a fixed-size C-level array:

```python
class Point:
    __slots__ = ('x', 'y')    # only these attributes allowed
    def __init__(self, x, y):
        self.x, self.y = x, y

# Benefits:
# - ~40-50% less memory per instance
# - ~10-15% faster attribute access
# - Prevents accidental new attribute assignment

# Cost:
# - Can't add new attributes dynamically
# - No __dict__ (can't use **obj.__dict__)
# - Complicates multiple inheritance (each parent needs __slots__)

# When to use: creating millions of small objects (geometry, particles, rows)
```

---

### Extended Q&A: Advanced Python Deep Dive

**Q19. What is a generator expression vs a list comprehension — when does it matter?**

Answer:
```python
import sys

# List comprehension — evaluates all immediately, stores in memory
lst = [x**2 for x in range(10**7)]    # ~80MB in memory
sys.getsizeof(lst)                     # ~80MB

# Generator expression — lazy, evaluates one at a time
gen = (x**2 for x in range(10**7))    # ~200 bytes
sys.getsizeof(gen)                     # ~200 bytes

# When it matters:
# 1. Large sequences that don't fit in memory
# 2. Early termination (any, all, next) — generator stops at first match
# 3. Pipeline processing: gen | filter | transform — no intermediate lists

# When list is better:
# 1. Need to iterate multiple times
# 2. Need indexing: gen[5] → TypeError
# 3. Need len(): len(gen) → TypeError
# 4. Need sorted(), reversed()

# Short-circuit with generators:
has_even = any(x % 2 == 0 for x in range(10**9))  # stops at 0 — O(1)!
```

---

**Q20. Explain `asyncio` — event loop, coroutines, tasks, and gather.**

Answer: asyncio provides single-threaded concurrency via cooperative multitasking:

```python
import asyncio, aiohttp, time

# Coroutine — defined with async def, contains await points
async def fetch(session, url):
    async with session.get(url) as response:
        return await response.text()   # yields control while waiting for I/O

# Run coroutines concurrently with gather
async def main():
    urls = [f"https://httpbin.org/delay/1?i={i}" for i in range(5)]

    start = time.perf_counter()
    async with aiohttp.ClientSession() as session:
        # Concurrent: all 5 requests in-flight simultaneously
        results = await asyncio.gather(*[fetch(session, u) for u in urls])
    print(f"5 requests in {time.perf_counter()-start:.2f}s")  # ~1s not 5s

asyncio.run(main())

# Event loop mechanics:
# 1. await pauses the coroutine and returns control to the event loop
# 2. Event loop monitors I/O events (socket ready, timer expired)
# 3. When event fires, resumes the waiting coroutine
# 4. Only one coroutine runs at a time (single thread)

# asyncio.create_task — schedule coroutine without awaiting immediately
async def demo():
    task1 = asyncio.create_task(coro1())   # starts immediately
    task2 = asyncio.create_task(coro2())   # starts immediately
    result1 = await task1
    result2 = await task2

# asyncio.Queue — producer-consumer pattern
async def producer(q):
    for i in range(5):
        await q.put(i)
        await asyncio.sleep(0.1)

async def consumer(q):
    while True:
        item = await q.get()
        print(f"Processing {item}")
        q.task_done()
```

---

**Q21. What are the differences between `@staticmethod`, `@classmethod`, and `@property` internally?**

Answer: All three are **descriptors** — objects with `__get__` (and optionally `__set__`, `__delete__`) that intercept attribute access on a class.

- `@staticmethod` wraps the function in a `staticmethod` descriptor whose `__get__` returns the raw function (no binding).
- `@classmethod` wraps in a `classmethod` descriptor whose `__get__` returns a bound method with the class pre-filled as first argument.
- `@property` creates a `property` descriptor with separate getter/setter/deleter functions. When you access `obj.attr`, Python calls `property.__get__(obj, type(obj))` which calls the getter.

```python
class Demo:
    @staticmethod
    def sm(): pass

# Internally:
Demo.__dict__['sm']      # <staticmethod object>
Demo.sm                  # <function sm>    — descriptor __get__ called
Demo().sm                # <function sm>    — same, no binding

Demo.__dict__['cm']      # <classmethod object>
Demo.cm                  # <bound method cm of <class 'Demo'>>
```

---

**Q22. How does Python's `with` statement work with context managers?**

Answer: `with expr as var:` is equivalent to:
```python
mgr = expr
value = mgr.__enter__()      # var = value
try:
    # block
except:
    if not mgr.__exit__(*sys.exc_info()):
        raise               # __exit__ returns True to suppress exception
else:
    mgr.__exit__(None, None, None)
```

Key rules: `__enter__` returns the resource (or anything useful). `__exit__` receives exception info; returning `True` suppresses the exception, `False`/`None` re-raises it.

Real-world patterns: database transactions (commit on success, rollback on error), file handles (always close), locks (always release), temp directory (always delete).

---

**Q23. What is Python's `functools.wraps` and why is it needed?**

Answer: When you wrap a function with a decorator, the wrapper function replaces it — losing the original's `__name__`, `__doc__`, `__module__`, `__qualname__`, `__annotations__`, and `__dict__`. This breaks introspection, help(), and some testing tools.

```python
def timer(fn):
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper

@timer
def my_func():
    """Important docstring."""
    pass

print(my_func.__name__)    # 'wrapper' — WRONG
print(my_func.__doc__)     # None — WRONG

# Fix with functools.wraps:
import functools
def timer(fn):
    @functools.wraps(fn)          # copies all metadata from fn to wrapper
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper

@timer
def my_func():
    """Important docstring."""
    pass

print(my_func.__name__)    # 'my_func' — CORRECT
print(my_func.__doc__)     # 'Important docstring.' — CORRECT
my_func.__wrapped__        # original fn accessible
```

---

**Q24. What is the difference between `raise`, `raise e`, and `raise from`?**

Answer:
```python
try:
    dangerous()
except ValueError as e:
    raise               # re-raises original exception, preserves traceback
    raise e             # re-raises but REPLACES traceback (loses original location)
    raise RuntimeError("msg") from e    # chains: shows both exceptions
    raise RuntimeError("msg") from None # suppresses original (clean error)
```
Best practice: use bare `raise` to re-raise, `raise NewException from e` to wrap with context.

---

**Q25. Explain Python's integer and string caching/interning.**

Answer:

**Integer caching**: CPython caches small integers from **-5 to 256**. These are pre-allocated at interpreter startup; `a = 5; b = 5; a is b` → True. Outside this range: `a = 1000; b = 1000; a is b` → False (two separate objects).

**String interning**: CPython automatically interns strings that look like identifiers (letters, digits, underscores, no spaces). String literals in the same compilation unit (file) are usually interned. `sys.intern(s)` forces interning.

```python
a = "hello";  b = "hello";  a is b   # True (interned)
a = "hello world"; b = "hello world"
a is b   # False (contains space — not auto-interned)
a = sys.intern("hello world"); b = sys.intern("hello world")
a is b   # True (manually interned)
```
Practical impact: `is` comparison on strings is unreliable — always use `==`.

---

## Extended Theory: Modules and Ecosystem

### Python Standard Library Essentials

```python
# os — Operating system interface
import os
os.getcwd()                         # current working directory
os.chdir("/path")                   # change directory
os.listdir(".")                     # list directory
os.path.join("dir","file.txt")      # cross-platform path
os.path.exists("file.txt")
os.makedirs("dir/subdir", exist_ok=True)
os.environ.get("HOME", "/tmp")      # environment variables
os.getpid()                         # process ID

# sys — System-specific parameters
import sys
sys.argv                            # command-line arguments
sys.path                            # module search path
sys.version                         # Python version string
sys.exit(0)                         # exit with code
sys.stdin, sys.stdout, sys.stderr   # standard streams

# datetime
from datetime import datetime, date, timedelta
now = datetime.now()
today = date.today()
dt = datetime(2024, 1, 15, 14, 30, 0)
dt.strftime("%Y-%m-%d %H:%M:%S")    # format
datetime.strptime("2024-01-15", "%Y-%m-%d")  # parse
dt + timedelta(days=30)             # arithmetic
(now - dt).days                     # difference in days

# re — Regular expressions
import re
re.match(r"^\d+", "123abc")         # match at start
re.search(r"\d+", "abc123")         # search anywhere
re.findall(r"\d+", "a1b2c3")        # all matches: ['1','2','3']
re.sub(r"\s+", " ", "a  b   c")     # substitute
re.compile(r"\d+").findall(text)    # compile for reuse
re.split(r"[,;]", "a,b;c")         # ['a','b','c']

# Groups
m = re.search(r"(\d{4})-(\d{2})-(\d{2})", "2024-01-15")
m.group(0)    # "2024-01-15"  (full match)
m.group(1)    # "2024"
m.groups()    # ("2024", "01", "15")

# logging
import logging
logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)
logger.debug("Debug message")
logger.info("Pipeline started")
logger.warning("Missing values detected")
logger.error("Failed to connect", exc_info=True)
logger.critical("System shutdown")

# logging with file handler
handler = logging.FileHandler("app.log")
handler.setLevel(logging.WARNING)
logger.addHandler(handler)

# argparse — CLI argument parsing
import argparse
parser = argparse.ArgumentParser(description="Data Pipeline")
parser.add_argument("input",          help="Input CSV path")
parser.add_argument("--output", "-o", help="Output path", default="out.csv")
parser.add_argument("--rows", "-n",   type=int, default=1000)
parser.add_argument("--verbose",      action="store_true")
args = parser.parse_args()
print(args.input, args.output, args.rows, args.verbose)

# subprocess — run shell commands
import subprocess
result = subprocess.run(
    ["python", "--version"],
    capture_output=True, text=True, check=True
)
print(result.stdout)

# threading and multiprocessing (see Advanced Python section)
# json, csv, pathlib, pickle (see File I/O section)
# collections, itertools, functools (see Advanced Python section)
```

---

### Pythonic Code Principles (PEP 8, PEP 20)

```python
# PEP 20 — The Zen of Python
import this
# Key principles:
# Beautiful is better than ugly
# Explicit is better than implicit
# Simple is better than complex
# Readability counts
# There should be one obvious way to do it
# Errors should never pass silently

# PEP 8 — Style Guide highlights
# Naming:
#   snake_case for functions, variables, modules
#   CamelCase for classes
#   UPPER_CASE for constants
#   _private, __mangled, __dunder__

# Pythonic idioms
# 1. Use enumerate instead of range(len(...))
for i, val in enumerate(lst):      # Pythonic
    ...

# 2. Use zip for parallel iteration
for name, score in zip(names, scores):   # Pythonic
    ...

# 3. Use dict.get() with default
value = d.get("key", default)            # Pythonic

# 4. Swap variables
a, b = b, a                              # Pythonic (no temp)

# 5. Check empty containers with truthiness
if not lst:   # Pythonic
    ...
if len(lst) == 0:   # Non-Pythonic

# 6. Unpack sequences
first, *rest = lst        # Pythonic
x, y, z = point           # Pythonic

# 7. String joining
", ".join(lst)             # Pythonic
result = ""
for s in lst: result += s  # Non-Pythonic (O(n²) due to string immutability)

# 8. Ternary
val = x if condition else y

# 9. Use any()/all() instead of loops
if any(x > 0 for x in lst):   # Pythonic

# 10. Context managers for resources
with open("f") as f:   # always close file — Pythonic
    ...

# 11. Use _ for throwaway variables
for _ in range(10):
    ...
_, value = (1, 42)     # ignore first element
```

---

*This document now covers Python Fundamentals (Section 0) + all original 9 topics + extended Theory and Q&A across all sections.*

*Python Fundamentals master checklist: Variables & objects · Data types · Lists/Tuples/Dicts/Sets · Control flow · Functions & scope · Exceptions · File I/O · Modules · Comprehensions · Memory model · 25 deep Q&As*


# 1. Python OOP

## What is it?

Object-Oriented Programming organizes code around **objects** — instances of **classes** that bundle data (attributes) and behavior (methods). Python's OOP model is flexible, supporting multiple inheritance, mixins, metaclasses, and duck typing.

## Four Pillars

```
┌──────────────────────────────────────────────────────────────────┐
│                    FOUR PILLARS OF OOP                           │
├─────────────────┬────────────────────────────────────────────────┤
│ Encapsulation   │ Bundle data + methods; control access          │
│ Inheritance     │ Child class reuses/extends parent class        │
│ Polymorphism    │ Same interface, different implementations       │
│ Abstraction     │ Hide implementation details, expose interface  │
└─────────────────┴────────────────────────────────────────────────┘
```

## Classes and Objects

### Theory

A **class** is a blueprint — a user-defined type that encapsulates state (attributes) and behaviour (methods). An **object** (instance) is a concrete realisation of that blueprint, created by calling the class like a function (`Employee("Alice", ...)`). Every object in Python is an instance of some class; even the class itself is an instance of `type` (or a custom metaclass).

Python stores instance attributes in a per-object dictionary (`obj.__dict__`) by default, making Python objects highly dynamic — you can add or delete attributes at runtime. Class attributes live in the class's own `__dict__` and are shared across all instances. When you access `instance.attr`, Python first checks the instance dict, then the class dict, then walks the MRO chain upward.

The `self` parameter is a convention, not a keyword. Python passes the calling object automatically when you call a method via dot notation: `emp.get_info()` becomes `Employee.get_info(emp)`. The constructor `__init__` does NOT create the object — that is done by `__new__` — it only initialises the already-created instance.

**Access modifiers in Python are conventions, not enforcement:**
- `name` — fully public
- `_name` — protected by convention (internal use)
- `__name` — name-mangled to `_ClassName__name` to prevent accidental override in subclasses

The **property** pattern replaces direct attribute access with getter/setter/deleter logic while preserving clean attribute syntax for callers — far preferable to Java-style `getX()` / `setX()` methods.

```python
class Employee:
    # Class variable (shared across all instances)
    company = "Jio Platforms"
    headcount = 0

    # __init__: constructor
    def __init__(self, name: str, dept: str, salary: float):
        # Instance variables (unique per object)
        self.name    = name
        self.dept    = dept
        self._salary = salary        # convention: protected (single underscore)
        self.__id    = id(self)      # name-mangled: private (double underscore)
        Employee.headcount += 1

    # Instance method
    def get_info(self) -> str:
        return f"{self.name} | {self.dept} | ₹{self._salary:,.0f}"

    # Class method (receives class, not instance)
    @classmethod
    def from_dict(cls, data: dict) -> "Employee":
        return cls(data["name"], data["dept"], data["salary"])

    # Static method (no access to class or instance)
    @staticmethod
    def is_valid_salary(salary: float) -> bool:
        return 0 < salary < 10_000_000

    # Property (getter)
    @property
    def salary(self) -> float:
        return self._salary

    # Property setter
    @salary.setter
    def salary(self, value: float):
        if not Employee.is_valid_salary(value):
            raise ValueError(f"Invalid salary: {value}")
        self._salary = value

    # String representation
    def __repr__(self) -> str:
        return f"Employee(name={self.name!r}, dept={self.dept!r})"

    def __str__(self) -> str:
        return self.get_info()

    # Comparison
    def __eq__(self, other) -> bool:
        return isinstance(other, Employee) and self.name == other.name

    def __lt__(self, other) -> bool:
        return self._salary < other._salary

    def __hash__(self) -> int:
        return hash(self.name)

    # Context manager support
    def __enter__(self):
        print(f"Starting work: {self.name}")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"Done: {self.name}")
        return False  # don't suppress exceptions


# Usage
emp = Employee("Alice", "Engineering", 95000)
emp.salary = 100000        # uses setter
print(emp)                 # uses __str__
print(repr(emp))           # uses __repr__

# Class method constructor
emp2 = Employee.from_dict({"name": "Bob", "dept": "Data", "salary": 85000})

# Context manager
with Employee("Charlie", "ML", 90000) as e:
    print(e.get_info())

# Accessing name-mangled attribute
print(emp._Employee__id)   # works but breaks convention
```

## Inheritance

### Theory

**Inheritance** implements the IS-A relationship and enables code reuse — a child class gets all attributes and methods of its parent and can add new ones or override existing ones. Python supports **single**, **multiple**, **multi-level**, and **mixin** inheritance.

**Multiple inheritance** (`class C(A, B)`) is powerful but needs discipline. Python's **C3 linearisation** algorithm (MRO) guarantees a consistent, unambiguous lookup order: child before parent, left before right, each class at most once. Inspect with `ClassName.__mro__`.

`super()` in Python 3 returns a proxy that delegates to the **next class in the MRO** — not always the direct parent. In cooperative multiple inheritance, all classes in the chain must use `super()` so every class is called exactly once even in a diamond pattern.

**The fragile base class problem:** changing a parent's internal implementation can silently break unrelated child classes. This is one reason "prefer composition over inheritance" is a widely-accepted design principle. Deep inheritance chains (> 2–3 levels) become hard to reason about and test.

```python
# Single inheritance
class Manager(Employee):
    def __init__(self, name: str, dept: str, salary: float, team_size: int):
        super().__init__(name, dept, salary)  # call parent __init__
        self.team_size = team_size

    # Override parent method
    def get_info(self) -> str:
        base = super().get_info()
        return f"{base} | Team: {self.team_size}"

    # New method
    def give_raise(self, employee: Employee, pct: float):
        employee.salary *= (1 + pct / 100)


# Multiple inheritance
class Auditable:
    def __init__(self):
        self.audit_log: list = []

    def log(self, action: str):
        self.audit_log.append(action)


class SeniorManager(Manager, Auditable):
    def __init__(self, name, dept, salary, team_size):
        Manager.__init__(self, name, dept, salary, team_size)
        Auditable.__init__(self)

    def promote(self, employee: Employee):
        employee.salary *= 1.2
        self.log(f"Promoted {employee.name}")


# MRO (Method Resolution Order) — C3 linearization
print(SeniorManager.__mro__)
# SeniorManager → Manager → Employee → Auditable → object

# isinstance and issubclass
mgr = Manager("Diana", "Data", 120000, 5)
print(isinstance(mgr, Employee))    # True (inheritance chain)
print(isinstance(mgr, Manager))     # True
print(issubclass(Manager, Employee)) # True
```

## Abstract Base Classes

### Theory

An **Abstract Base Class (ABC)** defines a contract — a set of methods every concrete subclass must implement. ABCs cannot be instantiated directly; attempting to do so raises `TypeError`. They are Python's way to enforce a shared interface across a family of classes without requiring shared implementation.

ABCs integrate with `isinstance()` and `issubclass()` — you can even register an unrelated class as a "virtual subclass" via `ABC.register(cls)` so it passes `isinstance` checks without actual inheritance. This supports duck-typing while enabling type checks.

Python's `collections.abc` module provides ready-made ABCs: `Iterable`, `Iterator`, `Sequence`, `Mapping`, `MutableMapping`, `Callable`, `Hashable`, `Sized` etc. Implementing the required dunder methods automatically satisfies these ABCs via **structural subtyping** — `isinstance([1,2,3], collections.abc.Sequence)` is `True` even though `list` doesn't explicitly inherit from `Sequence`.

```python
from abc import ABC, abstractmethod

class DataProcessor(ABC):
    """Abstract base class for all data processors."""

    @abstractmethod
    def load(self, path: str):
        """Load data from path."""
        ...

    @abstractmethod
    def transform(self, data):
        """Apply transformation."""
        ...

    @abstractmethod
    def save(self, data, path: str):
        """Save data."""
        ...

    # Concrete method (shared implementation)
    def run(self, input_path: str, output_path: str):
        data = self.load(input_path)
        transformed = self.transform(data)
        self.save(transformed, output_path)


class CSVProcessor(DataProcessor):
    def load(self, path: str):
        import pandas as pd
        return pd.read_csv(path)

    def transform(self, data):
        return data.dropna()

    def save(self, data, path: str):
        data.to_csv(path, index=False)


# DataProcessor()        # TypeError: can't instantiate abstract class
proc = CSVProcessor()    # OK: all abstract methods implemented
```

## Dunder (Magic) Methods

### Theory

**Dunder (magic) methods** are the hooks that let custom classes integrate seamlessly with Python's syntax and built-in functions. When Python evaluates `a + b`, it calls `a.__add__(b)`. When it evaluates `len(obj)`, it calls `obj.__len__()`. This is the **Python data model** — the set of interfaces that make user-defined types first-class citizens of the language.

Key rule: `__hash__` and `__eq__` must be consistent. If two objects are equal, they must have the same hash. If you define `__eq__`, Python automatically sets `__hash__ = None` (making instances unhashable) unless you also define `__hash__`. This matters for using objects as dict keys or set members.

**Reflected operators** (`__radd__`, `__rmul__` etc.) are tried when the left operand's operator raises `NotImplemented` — enabling `3 * my_vector` to work even though `int` doesn't know about your `Vector` class.

**`__getattr__` vs `__getattribute__`:** `__getattr__` is only called when normal attribute lookup fails (useful for dynamic attributes, proxies). `__getattribute__` is called for EVERY attribute access — override with extreme care to avoid infinite recursion.

```python
class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):         return f"Vector({self.x}, {self.y})"
    def __str__(self):          return f"({self.x}, {self.y})"
    def __add__(self, o):       return Vector(self.x+o.x, self.y+o.y)
    def __sub__(self, o):       return Vector(self.x-o.x, self.y-o.y)
    def __mul__(self, scalar):  return Vector(self.x*scalar, self.y*scalar)
    def __rmul__(self, scalar): return self.__mul__(scalar)  # scalar * v
    def __abs__(self):          return (self.x**2 + self.y**2) ** 0.5
    def __bool__(self):         return bool(self.x or self.y)
    def __len__(self):          return 2
    def __iter__(self):         return iter((self.x, self.y))
    def __getitem__(self, i):   return (self.x, self.y)[i]
    def __eq__(self, o):        return self.x == o.x and self.y == o.y
    def __hash__(self):         return hash((self.x, self.y))
    def __neg__(self):          return Vector(-self.x, -self.y)
    def __contains__(self, v):  return v in (self.x, self.y)

v1 = Vector(1, 2)
v2 = Vector(3, 4)
print(v1 + v2)          # Vector(4, 6)
print(abs(v2))          # 5.0
print(3 * v1)           # Vector(3, 6)
print(list(v1))         # [1, 2]
print(1 in v1)          # True


# Callable objects
class Multiplier:
    def __init__(self, factor):
        self.factor = factor

    def __call__(self, x):
        return x * self.factor

double = Multiplier(2)
print(double(5))        # 10
print(callable(double)) # True


# Context manager
class Timer:
    import time
    def __enter__(self):
        self.start = __import__("time").perf_counter()
        return self
    def __exit__(self, *args):
        elapsed = __import__("time").perf_counter() - self.start
        print(f"Elapsed: {elapsed:.4f}s")
        return False

with Timer():
    sum(range(1_000_000))
```

## Dataclasses

### Theory

**Dataclasses** (PEP 557, Python 3.7+) auto-generate `__init__`, `__repr__`, `__eq__`, and optionally `__lt__`/`__hash__` by inspecting class-level field annotations. They eliminate boilerplate for classes that primarily hold data.

`field()` provides fine-grained control: `default_factory` for mutable defaults (avoiding the shared-mutable-default bug), `repr=False` to hide sensitive fields, `compare=False` to exclude from equality checks, `init=False` for computed fields set in `__post_init__`.

**`@dataclass(frozen=True)`** makes the instance immutable and hashable — ideal for value objects, cache keys, and namedtuple replacements. **`@dataclass(slots=True)`** (Python 3.10+) automatically generates `__slots__`, saving ~40% memory per instance.

Compared to plain classes: less boilerplate, self-documenting. Compared to `namedtuple`: mutable by default, supports inheritance naturally. Compared to Pydantic: no runtime type validation — `@dataclass` accepts any value for a typed field at runtime.

```python
from dataclasses import dataclass, field, asdict, astuple
from typing import List, Optional

@dataclass
class Product:
    product_id: int
    name: str
    price: float
    tags: List[str] = field(default_factory=list)
    discount: float = 0.0
    _internal: str = field(default="", repr=False, compare=False)

    # Post-init validation
    def __post_init__(self):
        if self.price < 0:
            raise ValueError(f"Price cannot be negative: {self.price}")
        self.price = round(self.price, 2)

    @property
    def final_price(self) -> float:
        return self.price * (1 - self.discount)


@dataclass(frozen=True)   # immutable (hashable)
class Point:
    x: float
    y: float

@dataclass(order=True)    # auto-generates <, <=, >, >=
class SortableItem:
    sort_index: float = field(init=False, repr=False)
    name: str
    priority: int

    def __post_init__(self):
        self.sort_index = self.priority


p = Product(1, "Widget", 9.99, ["sale", "new"], 0.1)
print(p)                         # Product(product_id=1, name='Widget', ...)
print(p.final_price)             # 8.991
print(asdict(p))                 # dict representation
```

## Metaclasses

### Theory

A **metaclass** is the class of a class — it controls how classes themselves are created. In Python, `type` is the default metaclass of all classes. When Python executes a `class` statement, it calls the metaclass's `__new__` and `__init__` to construct the class object itself.

The creation chain: `instance → class → metaclass (type) → type`. This means `type("MyClass", (Base,), {"attr": 1})` is equivalent to the `class` statement.

**When to use metaclasses:**
- **Singleton pattern** — intercept `__call__` to return an existing instance
- **Class registries** — auto-register subclasses (plugin systems, ORM model discovery)
- **API enforcement** — require attributes at class definition time (stricter than ABCs)
- **ORM magic** — SQLAlchemy, Django ORM use metaclasses to turn field declarations into DB column definitions

**Class decorators** are simpler and should be preferred over metaclasses when possible — they operate on an already-created class and are more transparent. Use metaclasses only when you need to intercept the class creation process itself.

```python
# Metaclass: class of a class
class SingletonMeta(type):
    """Ensure only one instance per class."""
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]


class DatabaseConnection(metaclass=SingletonMeta):
    def __init__(self, url: str):
        self.url = url
        self.connected = False

    def connect(self):
        self.connected = True


db1 = DatabaseConnection("postgresql://localhost/mydb")
db2 = DatabaseConnection("postgresql://otherhost/db")
print(db1 is db2)   # True — same instance
print(db1.url)      # "postgresql://localhost/mydb"


# Registry metaclass
class PluginMeta(type):
    registry = {}

    def __new__(mcs, name, bases, namespace):
        cls = super().__new__(mcs, name, bases, namespace)
        if bases:  # skip base class itself
            mcs.registry[name] = cls
        return cls


class BasePlugin(metaclass=PluginMeta):
    def run(self): ...

class CSVPlugin(BasePlugin):
    def run(self): print("Processing CSV")

class JSONPlugin(BasePlugin):
    def run(self): print("Processing JSON")

print(PluginMeta.registry)  # {'CSVPlugin': ..., 'JSONPlugin': ...}
```

## Interview Questions and Answers

**Q1. What is the difference between `@classmethod`, `@staticmethod`, and instance method?**

Answer:
- **Instance method:** Takes `self` (the instance) as first arg. Can access/modify instance and class state. Most common.
- **`@classmethod`:** Takes `cls` (the class) as first arg. Can access/modify class state. Used for alternate constructors (`from_dict`, `from_csv`).
- **`@staticmethod`:** Takes neither `self` nor `cls`. Pure utility function logically grouped in class. Cannot modify class or instance state.

```python
class Demo:
    count = 0
    def instance_method(self):   return self         # access instance
    @classmethod
    def class_method(cls):       return cls          # access class
    @staticmethod
    def static_method():         return "pure util"  # no access
```

**Q2. What is `__slots__` and why use it?**

Answer: `__slots__` replaces the default `__dict__` per instance with a fixed set of attributes, reducing memory overhead:
```python
class Point:
    __slots__ = ('x', 'y')   # no __dict__, saves ~50-200 bytes per instance
    def __init__(self, x, y):
        self.x, self.y = x, y

# Benefits: faster attribute access, ~40% less memory for many instances
# Drawbacks: can't add arbitrary attributes, no weakref by default
```
Use when creating millions of small objects (e.g., RDD-like items, geometry points).

**Q3. What is MRO and how does Python resolve it?**

Answer: MRO (Method Resolution Order) defines the order Python searches for methods in an inheritance chain. Python uses the **C3 linearization** algorithm. View it with `ClassName.__mro__`. Rule: child before parent, left before right in multiple inheritance. This prevents the "diamond problem" by ensuring each class appears at most once.

**Q4. What is the difference between `__repr__` and `__str__`?**

Answer:
- `__repr__`: Unambiguous representation for developers — should ideally be valid Python to recreate the object. Used in REPL, `repr()`, containers.
- `__str__`: Human-readable string. Used by `print()`, `str()`, `format()`.

If only `__repr__` is defined, Python uses it for both. If both are defined, `str()` uses `__str__`.

**Q5. Explain Python's descriptor protocol.**

Answer: Descriptors are objects that define `__get__`, `__set__`, or `__delete__` — they control attribute access on a class. Properties are built on descriptors. Example: `@property` creates a descriptor object stored in the class that intercepts `instance.attr` access. Used in ORMs (SQLAlchemy column types), validators, and lazy evaluation.

---

# 2. Advanced Python

## Generators and Iterators

### Theory

A **generator** produces values lazily — on demand, one at a time — instead of computing and storing all values upfront. This provides two major advantages: **memory efficiency** (processing a 10 GB file uses constant memory regardless of size) and **pipeline composability** (generators chain together without intermediate lists).

Internally, a generator function compiles to a **generator object** that implements the iterator protocol. When the interpreter encounters `yield`, it saves the entire execution frame (local variables, instruction pointer, stack) into the generator object and suspends. The next `next()` call restores that frame and resumes exactly where it left off. This frame suspension preserves state between calls with no explicit state management.

`send(value)` enables two-way communication — the sent value becomes the result of the `yield` expression inside the generator. This is the foundation of Python's coroutine model; `async`/`await` are built on top of generators at the bytecode level.

**`yield from`** (PEP 380) delegates to a sub-iterator, transparently forwarding `send()`, `throw()`, and `close()` calls — enabling coroutine chaining and generator composition without boilerplate.

**Generator expression** `(expr for x in it)` is syntactically a one-expression generator function. It is nearly zero memory (just the generator object itself), making `sum(x**2 for x in range(10**7))` far preferable to `sum([x**2 for x in range(10**7)])`.

```python
# Iterator protocol: __iter__ + __next__
class Range:
    def __init__(self, start, stop, step=1):
        self.current = start
        self.stop = stop
        self.step = step

    def __iter__(self):
        return self

    def __next__(self):
        if self.current >= self.stop:
            raise StopIteration
        val = self.current
        self.current += self.step
        return val

# Generator function (lazy, memory efficient)
def fibonacci():
    a, b = 0, 1
    while True:
        yield a          # suspends here, returns a
        a, b = b, a + b

fib = fibonacci()
print([next(fib) for _ in range(10)])   # [0,1,1,2,3,5,8,13,21,34]

# Generator with send() — bidirectional
def accumulator():
    total = 0
    while True:
        value = yield total
        if value is None:
            break
        total += value

acc = accumulator()
next(acc)           # prime the generator
acc.send(10)        # → 10
acc.send(20)        # → 30
acc.send(5)         # → 35

# Generator expression (vs list comprehension)
# List comp: evaluates everything immediately → list in memory
squares_list = [x**2 for x in range(1_000_000)]   # 8MB

# Generator expr: lazy, evaluates on demand → tiny memory
squares_gen  = (x**2 for x in range(1_000_000))   # ~200 bytes

# yield from — delegate to sub-generator
def chain(*iterables):
    for it in iterables:
        yield from it   # equivalent to: for item in it: yield item

list(chain([1,2], [3,4], [5]))   # [1,2,3,4,5]


# Practical: streaming large file processing
def read_large_csv(path: str, chunk_size: int = 1000):
    import pandas as pd
    for chunk in pd.read_csv(path, chunksize=chunk_size):
        yield chunk

total = sum(chunk["revenue"].sum() for chunk in read_large_csv("data.csv"))
```

## Decorators

### Theory

A **decorator** is a higher-order function that takes a callable as input, wraps it with additional behaviour, and returns the modified callable. The `@decorator` syntax is pure sugar: `@timer` above `def fn()` is exactly `fn = timer(fn)`.

Decorators implement the **Wrapper/Proxy design pattern** at the language level. Common uses: logging, timing, caching (`lru_cache`), access control, rate limiting, retry logic, input validation, and transaction management — all without modifying the function's own logic (separation of concerns, Open/Closed principle).

**Stacking decorators** applies them bottom-up: `@A` `@B` `def f()` becomes `f = A(B(f))`. Order matters — `@timer @retry` times the entire operation including retries, while `@retry @timer` retries a timed function.

**`functools.wraps`** is essential — it copies `__name__`, `__doc__`, `__module__`, `__qualname__`, and `__annotations__` from the original function to the wrapper, preserving introspectability, help text, and pytest compatibility. It also sets `wrapper.__wrapped__ = fn`, allowing decorator stacks to be introspected.

**Class-based decorators** using `__call__` maintain state between calls (e.g., call counter, persistent cache dict). They are functionally equivalent to closure-based decorators but more explicit and extensible.

```python
import functools, time, logging
from typing import Callable, Any

# Basic decorator
def timer(func: Callable) -> Callable:
    @functools.wraps(func)   # preserves __name__, __doc__
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

@timer
def slow_function(n):
    return sum(range(n))

# Decorator with arguments
def retry(max_attempts: int = 3, delay: float = 1.0, exceptions=(Exception,)):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    if attempt == max_attempts:
                        raise
                    print(f"Attempt {attempt} failed: {e}. Retrying...")
                    time.sleep(delay)
        return wrapper
    return decorator

@retry(max_attempts=3, delay=0.5, exceptions=(ConnectionError, TimeoutError))
def fetch_data(url: str):
    import requests
    return requests.get(url, timeout=5).json()

# Class-based decorator
class Cache:
    def __init__(self, func):
        self.func = func
        self.cache = {}
        functools.update_wrapper(self, func)

    def __call__(self, *args):
        if args not in self.cache:
            self.cache[args] = self.func(*args)
        return self.cache[args]

@Cache
def expensive(n):
    return n ** 2

# Stacking decorators (applied bottom-up)
@timer
@retry(max_attempts=3)
def api_call(url):
    ...
# Equivalent to: timer(retry(3)(api_call))

# functools.lru_cache — built-in memoization
from functools import lru_cache

@lru_cache(maxsize=128)
def fib(n):
    return n if n < 2 else fib(n-1) + fib(n-2)

# functools.cache (Python 3.9+, unbounded)
from functools import cache

@cache
def fib_unbounded(n):
    return n if n < 2 else fib_unbounded(n-1) + fib_unbounded(n-2)
```

## Context Managers

### Theory

A **context manager** guarantees that `__exit__` is called regardless of whether the `with` block completed normally or raised an exception — providing deterministic resource management (similar to RAII in C++).

The `with` statement desugars to: call `__enter__` (bind return value to `as` variable), run the block in a try, call `__exit__(exc_type, exc_val, exc_tb)` in the finally. Returning `True` from `__exit__` suppresses the exception; `False`/`None` propagates it.

**`@contextmanager`** (contextlib) writes a context manager as a generator with a single `yield`. Code before `yield` is the setup (`__enter__`); code after (in `finally`) is the teardown (`__exit__`). This is far more readable than a class for simple cases.

**Why context managers matter in data engineering:**
- Database connections — commit on success, rollback on error, always close
- File handles — always close even on exception
- Distributed locks (Redis, Zookeeper) — always release
- Temp directories/files — always clean up
- Spark session management — always stop the session
- MLflow runs — always end the run, even on failure

```python
from contextlib import contextmanager, suppress, nullcontext

# Class-based context manager
class DatabaseTransaction:
    def __init__(self, conn):
        self.conn = conn

    def __enter__(self):
        self.conn.begin()
        return self.conn

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            self.conn.rollback()
            return False  # re-raise exception
        self.conn.commit()
        return False

# Generator-based (using @contextmanager)
@contextmanager
def managed_resource(name: str):
    print(f"Acquiring: {name}")
    resource = {"name": name, "active": True}
    try:
        yield resource
    except Exception as e:
        print(f"Error handling: {e}")
        raise
    finally:
        resource["active"] = False
        print(f"Releasing: {name}")

with managed_resource("DB Connection") as r:
    print(r["name"])

# contextlib utilities
with suppress(FileNotFoundError):
    open("nonexistent.txt")  # exception silently ignored

# Combine multiple context managers
with open("in.txt") as fin, open("out.txt", "w") as fout:
    fout.write(fin.read())
```

## Closures and Functools

### Theory

A **closure** is a function that captures and remembers variables from its enclosing scope even after the outer function has returned. Python implements this using **cell objects** — each free variable is wrapped in a cell that both the outer and inner function share by reference. Inspect via `fn.__closure__` and `fn.__code__.co_freevars`.

Closures power: factory functions, stateful callbacks, partial application, and decorators themselves. They are a lightweight alternative to classes when you need state without full class overhead.

**Late-binding gotcha** — the most common closure bug: all lambdas in a loop capture the same variable (the loop variable), and see its final value when called. Fix: use a default argument to capture the current value at definition time (`lambda i=i: i`).

`functools.partial` achieves partial application without closures — it creates a new callable with some arguments pre-filled, implemented in C and therefore faster than an equivalent lambda. `operator.itemgetter(0)` is faster than `lambda x: x[0]` for sort keys — prefer `operator` module functions for performance-sensitive sorting.

```python
# Closure: function that captures enclosing scope
def make_multiplier(factor):
    def multiplier(x):
        return x * factor   # factor is captured
    return multiplier

double = make_multiplier(2)
triple = make_multiplier(3)
print(double(5), triple(5))   # 10, 15

# Inspect closure
print(double.__closure__[0].cell_contents)  # 2

# functools.partial: freeze some arguments
from functools import partial

def power(base, exp):
    return base ** exp

square = partial(power, exp=2)
cube   = partial(power, exp=3)
print(square(4), cube(3))   # 16, 27

# functools.reduce
from functools import reduce
product = reduce(lambda a, b: a * b, [1, 2, 3, 4, 5])  # 120

# operator module (faster than lambdas)
import operator
from functools import reduce
total = reduce(operator.add, [1, 2, 3, 4, 5])           # 15
```

## Comprehensions

```python
# List comprehension
squares = [x**2 for x in range(10)]
evens   = [x for x in range(20) if x % 2 == 0]
matrix  = [[i*j for j in range(1, 4)] for i in range(1, 4)]

# Dict comprehension
inv_map = {v: k for k, v in {"a": 1, "b": 2}.items()}
word_len = {word: len(word) for word in ["hello", "world"]}

# Set comprehension
unique_lengths = {len(w) for w in ["cat", "dog", "elephant", "ant"]}

# Generator expression (lazy)
total = sum(x**2 for x in range(1_000_000))   # no list created

# Walrus operator := (Python 3.8+) — assign and test
data = [1, 2, 3, 4, 5, 6]
filtered = [y for x in data if (y := x * 2) > 6]  # [8, 10, 12]
```

## Type Hints and Typing

### Theory

**Type hints** (PEP 484, Python 3.5+) annotate the expected types of variables, function parameters, and return values. They are **not enforced at runtime** by default — Python remains dynamically typed. Their value is in static analysis (`mypy`, `pyright`), IDE autocompletion, documentation, and catching type errors before runtime.

From Python 3.9+, built-in types are directly subscriptable (`list[int]`, `dict[str, float]`). Python 3.10+ adds union syntax (`int | None` vs `Optional[int]`).

**`Protocol`** (PEP 544) enables structural subtyping — any class with the required methods satisfies the Protocol without inheritance. This gives static-type safety to duck typing patterns, which is critical in large codebases.

**`TypeVar`** enables generic functions/classes that preserve type relationships: `def first(lst: list[T]) -> T | None` tells the type checker that if `lst` is `list[int]`, the return is `int | None` — not just `Any`.

In data engineering: annotate DataFrame schemas using `TypedDict` or Pydantic models for pipeline inputs/outputs, use `Callable[[pd.DataFrame], pd.DataFrame]` for transformation functions — this enables both documentation and static validation of pipeline stages.

```python
from typing import (
    List, Dict, Tuple, Set, Optional, Union,
    Callable, Iterator, Generator, TypeVar, Generic,
    Any, Literal, Final, ClassVar, TypedDict, Protocol
)
from typing import overload
from collections.abc import Sequence

# Basic annotations
def greet(name: str) -> str:
    return f"Hello, {name}"

# Optional (can be None)
def find_user(user_id: int) -> Optional[str]:
    ...

# Union (Python 3.10+: use X | Y)
def process(data: Union[str, bytes]) -> str:
    ...

# Python 3.10+ style
def process_new(data: str | bytes) -> str:
    ...

# TypeVar for generics
T = TypeVar('T')

def first(lst: List[T]) -> Optional[T]:
    return lst[0] if lst else None

# Generic class
class Stack(Generic[T]):
    def __init__(self): self._items: List[T] = []
    def push(self, item: T): self._items.append(item)
    def pop(self) -> T: return self._items.pop()

# TypedDict — typed dict
class UserDict(TypedDict):
    name: str
    age: int
    email: str

# Protocol — structural subtyping (duck typing with types)
class Drawable(Protocol):
    def draw(self) -> None: ...

def render(item: Drawable) -> None:
    item.draw()  # any object with .draw() works — no inheritance needed

# Callable
def apply(fn: Callable[[int, int], int], a: int, b: int) -> int:
    return fn(a, b)

# Literal — restrict to specific values
def set_log_level(level: Literal["DEBUG", "INFO", "WARNING", "ERROR"]) -> None:
    ...
```

## Concurrency

### Theory

Python offers three concurrency models, each for different workloads:

**Threading** (`ThreadPoolExecutor`) — threads share process memory. The **GIL** in CPython prevents more than one thread from executing Python bytecode simultaneously. However, the GIL is released during I/O operations (network, disk, `sleep`), so threads are highly effective for **I/O-bound** tasks. Race conditions require `Lock`, `RLock`, `Semaphore`.

**Multiprocessing** (`ProcessPoolExecutor`) — separate OS processes, each with its own GIL. True CPU parallelism. Higher overhead (process creation, IPC via `Queue`/`Pipe`/`shared_memory`). Best for **CPU-bound** tasks (data preprocessing, compression, encoding).

**asyncio** (`async`/`await`) — single-threaded cooperative multitasking. Coroutines voluntarily yield control at `await` points; the event loop runs other coroutines while waiting for I/O. Near-zero overhead, supports tens of thousands of concurrent connections. Libraries must be async-native (`aiohttp`, `asyncpg`); a synchronous blocking call inside a coroutine freezes the entire event loop.

**Decision rule:**
- I/O-bound, simple → `ThreadPoolExecutor`
- I/O-bound, high concurrency → `asyncio`
- CPU-bound → `ProcessPoolExecutor`
- Mixed → `asyncio` + `loop.run_in_executor(ProcessPoolExecutor, ...)`

```python
import threading, multiprocessing, asyncio
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

# Threading (I/O-bound — GIL doesn't matter for I/O)
def fetch_url(url: str) -> str:
    import requests
    return requests.get(url).text

urls = ["https://httpbin.org/get"] * 5
with ThreadPoolExecutor(max_workers=5) as ex:
    results = list(ex.map(fetch_url, urls))

# Multiprocessing (CPU-bound — bypasses GIL)
def cpu_heavy(n: int) -> int:
    return sum(i**2 for i in range(n))

with ProcessPoolExecutor(max_workers=4) as ex:
    results = list(ex.map(cpu_heavy, [10**6] * 4))

# asyncio (async/await — single-threaded concurrency)
import asyncio
import aiohttp

async def fetch_async(session: aiohttp.ClientSession, url: str) -> str:
    async with session.get(url) as resp:
        return await resp.text()

async def main():
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_async(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
    return results

asyncio.run(main())

# threading.Lock — prevent race conditions
counter = 0
lock = threading.Lock()

def increment(n):
    global counter
    for _ in range(n):
        with lock:
            counter += 1
```

## Itertools and Collections

```python
import itertools, collections

# itertools
print(list(itertools.chain([1,2], [3,4], [5])))       # [1,2,3,4,5]
print(list(itertools.islice(range(100), 5, 10)))       # [5,6,7,8,9]
print(list(itertools.combinations([1,2,3], 2)))        # [(1,2),(1,3),(2,3)]
print(list(itertools.permutations([1,2,3], 2)))        # [(1,2),(1,3),(2,1)...]
print(list(itertools.product([0,1], repeat=3)))        # all 3-bit combos
print(list(itertools.accumulate([1,2,3,4,5])))         # [1,3,6,10,15]
print(list(itertools.groupby("AAABBBCCCA")))            # (A,[A,A,A]), (B,[B,B,B])...

for key, group in itertools.groupby(sorted([1,1,2,2,3]), key=lambda x: x):
    print(key, list(group))

# collections
# Counter
from collections import Counter
c = Counter("aabbbbccc")
print(c.most_common(2))    # [('b', 4), ('c', 3)]
c1 = Counter(a=3, b=1)
c2 = Counter(a=1, b=2)
print(c1 + c2)             # Counter({'a': 4, 'b': 3})

# defaultdict
from collections import defaultdict
graph = defaultdict(list)
graph["A"].append("B")     # no KeyError for missing keys

# OrderedDict
from collections import OrderedDict
od = OrderedDict([("a", 1), ("b", 2)])
od.move_to_end("a")        # move to end
od.move_to_end("b", False) # move to front

# namedtuple
from collections import namedtuple
Point = namedtuple("Point", ["x", "y"])
p = Point(3, 4)
print(p.x, p.y, p._asdict())

# deque (O(1) append/pop from both ends)
from collections import deque
dq = deque([1, 2, 3], maxlen=5)
dq.appendleft(0)    # O(1)
dq.rotate(2)        # shift right by 2

# ChainMap
from collections import ChainMap
defaults = {"color": "red", "size": "M"}
overrides = {"color": "blue"}
merged = ChainMap(overrides, defaults)
print(merged["color"])  # "blue" (first found)
print(merged["size"])   # "M" (from defaults)
```

## Interview Questions and Answers

**Q1. What is the GIL and how does it affect Python concurrency?**

Answer: The GIL (Global Interpreter Lock) is a mutex in CPython that allows only ONE thread to execute Python bytecode at a time. This means:
- **I/O-bound tasks:** Threads work well — GIL is released during I/O (network, disk). Use `ThreadPoolExecutor`.
- **CPU-bound tasks:** Threads don't help — GIL prevents true parallelism. Use `ProcessPoolExecutor` (separate processes, each with own GIL) or `asyncio` for cooperative multitasking.
- PyPy, Jython, and GraalPy don't have GIL. CPython 3.13+ has experimental no-GIL mode.

**Q2. What is the difference between `yield` and `return` in a generator?**

Answer:
- `return` exits the function completely, returning a value.
- `yield` suspends execution, saves the local state (variables, instruction pointer), and returns a value to the caller. On `next()` call, resumes from where it suspended.
- A function with any `yield` becomes a generator function, returning a generator object (lazy iterator).
- `yield from` delegates to a sub-iterator.

**Q3. How does Python's `@property` work internally?**

Answer: `@property` creates a descriptor object stored as a class attribute. When you access `obj.attr`, Python sees the descriptor in the class `__dict__`, calls its `__get__` method, which runs the getter function. `@attr.setter` adds a `__set__` method to the same descriptor. This is transparent to the user — they access it like a regular attribute but get the getter/setter behavior.

**Q4. What is the difference between `deepcopy` and `copy`?**

Answer:
```python
import copy
a = [[1, 2], [3, 4]]
b = copy.copy(a)       # shallow: outer list is new, inner lists shared
c = copy.deepcopy(a)   # deep: all objects recursively copied

b[0].append(99)
print(a[0])  # [1, 2, 99] — modified! (shared reference)
c[0].append(99)
print(a[0])  # [1, 2, 99] — unchanged (deep copy)
```

**Q5. Explain Python's memory management and garbage collection.**

Answer: Python uses **reference counting** as the primary mechanism — each object tracks how many references point to it; when count hits 0, it's immediately deallocated. For **cyclic references** (A → B → A), Python has a **cyclic garbage collector** (`gc` module) that periodically detects and collects cycles. Memory for small integers (-5 to 256) and short strings is interned (cached/reused). Use `sys.getrefcount()` to check reference count, `gc.collect()` to force collection.

**Q6. What are `*args` and `**kwargs`?**

Answer: `*args` captures extra positional arguments as a tuple. `**kwargs` captures extra keyword arguments as a dict. Used to write flexible functions:
```python
def log(level, *args, **kwargs):
    msg = " ".join(str(a) for a in args)
    meta = ", ".join(f"{k}={v}" for k, v in kwargs.items())
    print(f"[{level}] {msg} | {meta}")

log("INFO", "User", "logged in", user_id=42, ip="192.168.1.1")
# [INFO] User logged in | user_id=42, ip=192.168.1.1
```

**Q7. What is `__new__` vs `__init__`?**

Answer: `__new__` creates and returns the instance object (allocates memory). `__init__` initializes the already-created instance. `__new__` is called first, then `__init__` on the returned object. Normally you only override `__init__`. Override `__new__` for: Singletons (return existing instance), immutable subclasses (`int`, `str`, `tuple`), metaclass customization.

---

# 3. NumPy

## What is it?

NumPy is the foundational library for numerical computing in Python. It provides the `ndarray` — a fast, memory-efficient N-dimensional array — plus vectorized mathematical operations, broadcasting, linear algebra, and random number generation.

## Why Use NumPy over Lists?

### Theory

NumPy's core structure, the **`ndarray`**, is a contiguous block of homogeneously-typed C values in memory. A Python list is an array of pointers to Python objects scattered in memory — accessing elements requires pointer dereferencing and Python object overhead. The ndarray eliminates all that:

1. **Vectorised operations** — C-level loops over contiguous memory, bypassing per-element Python interpreter overhead. Typically 50–200× faster than equivalent Python loops.
2. **Cache efficiency** — contiguous memory fits into CPU cache lines; modern CPUs process multiple elements per clock cycle (SIMD).
3. **Broadcasting** — shape-compatible arithmetic without explicit loops or memory copies.

**`dtype` matters critically** — always specify: `float64` (default, 8 bytes), `float32` (4 bytes, GPU-friendly), `int32`/`int16` for smaller integers. The wrong dtype causes silent precision loss in ML feature pipelines.

**Strides** describe bytes-to-skip per axis step. A transpose (`a.T`) swaps strides without copying any data — it is O(1) regardless of array size. Slice operations return **views** (same memory, new strides). Boolean/fancy indexing returns **copies** (new memory). Always check `a.base is None` to distinguish copy from view.

```python
import numpy as np

# Speed comparison
import time
n = 1_000_000
py_list = list(range(n))
np_arr  = np.arange(n)

t0 = time.perf_counter(); sum(py_list); print(f"List: {time.perf_counter()-t0:.4f}s")
t0 = time.perf_counter(); np_arr.sum(); print(f"NumPy: {time.perf_counter()-t0:.4f}s")
# NumPy is ~50-100x faster for numeric operations

# Memory: NumPy uses contiguous typed memory (C arrays)
import sys
print(sys.getsizeof(py_list))       # ~8MB (pointers + objects)
print(np_arr.nbytes)                # ~4MB (pure int32 values)
```

## Array Creation

```python
import numpy as np

# From data
a = np.array([1, 2, 3, 4, 5])
b = np.array([[1, 2, 3], [4, 5, 6]], dtype=np.float64)
c = np.array([1+2j, 3+4j])                     # complex

# Factory functions
np.zeros((3, 4))                               # 3×4 of 0.0
np.ones((2, 3), dtype=np.int32)                # 2×3 of 1
np.full((3, 3), 7.0)                           # filled with 7.0
np.eye(4)                                      # 4×4 identity
np.empty((2, 2))                               # uninitialized (fast)
np.zeros_like(b)                               # same shape/dtype, all 0

# Range / linspace
np.arange(0, 10, 2)                            # [0, 2, 4, 6, 8]
np.linspace(0, 1, 5)                           # [0, .25, .5, .75, 1]
np.logspace(0, 2, 5)                           # [1, 3.16, 10, 31.6, 100]

# Random
rng = np.random.default_rng(seed=42)           # reproducible
rng.random((3, 3))                             # uniform [0, 1)
rng.integers(0, 100, size=(4, 4))              # int in [0, 100)
rng.normal(0, 1, size=1000)                    # standard normal
rng.choice(["a","b","c"], size=10, replace=True)
rng.shuffle(a)                                 # in-place

# Structured array
dt = np.dtype([("name", "U20"), ("salary", "f4"), ("dept", "U10")])
emp = np.array([("Alice", 90000, "Eng"), ("Bob", 75000, "Mkt")], dtype=dt)
print(emp["name"])                             # array(['Alice', 'Bob'])
```

## Array Attributes and Inspection

```python
a = np.array([[1,2,3],[4,5,6]])
print(a.shape)          # (2, 3)
print(a.ndim)           # 2
print(a.size)           # 6
print(a.dtype)          # int64
print(a.itemsize)       # 8 bytes per element
print(a.nbytes)         # 48 total bytes
print(a.strides)        # (24, 8) bytes to next row/col
```

## Indexing and Slicing

```python
a = np.arange(12).reshape(3, 4)
# array([[ 0,  1,  2,  3],
#        [ 4,  5,  6,  7],
#        [ 8,  9, 10, 11]])

# Basic indexing
a[0]          # first row: [0, 1, 2, 3]
a[1, 2]       # element at row 1, col 2: 6
a[-1, -1]     # last element: 11

# Slicing [start:stop:step]
a[:, 1]       # all rows, col 1: [1, 5, 9]
a[0:2, :]     # rows 0-1, all cols
a[::2, ::2]   # every other row and col: [[0,2],[8,10]]

# Boolean indexing (fancy indexing — returns copy)
mask = a > 5
a[mask]                            # [6, 7, 8, 9, 10, 11]
a[a % 2 == 0]                      # all even: [0, 2, 4, 6, 8, 10]

# Integer array indexing
rows = np.array([0, 1, 2])
cols = np.array([0, 2, 1])
a[rows, cols]                      # [a[0,0], a[1,2], a[2,1]] = [0, 6, 9]

# np.where
np.where(a > 5, a, 0)             # replace ≤5 with 0
np.where(a % 2 == 0, "even", "odd")  # string replacement

# np.newaxis (add dimension)
v = np.array([1, 2, 3])           # shape (3,)
v[np.newaxis, :]                  # shape (1, 3)
v[:, np.newaxis]                  # shape (3, 1)
```

## Reshaping and Manipulation

```python
a = np.arange(24)
a.reshape(4, 6)                   # reshape (does not copy if possible)
a.reshape(2, 3, 4)               # 3D
a.reshape(-1, 4)                  # -1 = infer: shape (6, 4)

a.flatten()                       # always returns copy, 1D
a.ravel()                         # returns view if possible, 1D

# Transpose
b = np.arange(12).reshape(3, 4)
b.T                               # transpose: shape (4, 3)
np.transpose(b, (1, 0))          # same as .T for 2D

# Stack / concatenate
x = np.array([1, 2, 3])
y = np.array([4, 5, 6])
np.concatenate([x, y])            # [1,2,3,4,5,6]
np.vstack([x, y])                 # [[1,2,3],[4,5,6]]
np.hstack([x.reshape(-1,1), y.reshape(-1,1)])  # col-wise

m1 = np.ones((2,3))
m2 = np.ones((2,3))
np.concatenate([m1, m2], axis=0)  # vertical stack (4,3)
np.concatenate([m1, m2], axis=1)  # horizontal stack (2,6)

# Split
np.split(np.arange(9), 3)         # [array([0,1,2]), ...]
np.hsplit(b, 2)                    # split horizontally
np.vsplit(b, 3)                    # split vertically

# Repeat / tile
np.repeat([1,2,3], 3)             # [1,1,1,2,2,2,3,3,3]
np.tile([1,2,3], 3)               # [1,2,3,1,2,3,1,2,3]
```

## Broadcasting

### Theory

**Broadcasting** allows arithmetic between arrays of different shapes by implicitly stretching size-1 dimensions — without ever copying data. NumPy uses **stride tricks**: a broadcast dimension gets stride=0, so the same memory address is re-read multiple times.

**Three rules (applied after right-aligning shapes with 1s):**
1. If shapes have different lengths, pad the shorter shape on the LEFT with 1s
2. Dimensions of size 1 are stretched to match the other array's size
3. If sizes differ and neither is 1 → `ValueError`

```
(4, 3) + (3,)    →  (4, 3) + (1, 3)  →  (4, 3)  ✓
(4, 1) + (1, 3)  →  (4, 3)            ✓
(4, 3) + (4,)    →  (4, 3) + (1, 4)  →  incompatible  ✗
```

**Critical in Data Engineering:** normalise all features in one vectorised operation — `(X - X.mean(axis=0)) / X.std(axis=0)` broadcasts `(n_features,)` statistics across `(n_samples, n_features)` data. No loop, no copy, O(n) time and O(1) extra memory.

```python
# Broadcasting rules:
# 1. Arrays are right-aligned by shape
# 2. Dimensions of size 1 are stretched to match
# 3. Shapes must be compatible (same or 1)

a = np.array([[1,2,3],[4,5,6]])   # shape (2,3)
b = np.array([10, 20, 30])        # shape (3,) → broadcasts to (2,3)
print(a + b)                      # [[11,22,33],[14,25,36]]

# Column broadcast
col = np.array([[100],[200]])     # shape (2,1) → broadcasts to (2,3)
print(a + col)                    # [[101,102,103],[204,205,206]]

# Outer product via broadcasting
x = np.array([1,2,3])[:, np.newaxis]   # (3,1)
y = np.array([1,2,3,4])                # (4,)
print(x * y)                           # (3,4) outer product

# Normalize each row (subtract mean, divide by std)
data = np.random.normal(0, 1, (100, 5))
normalized = (data - data.mean(axis=0)) / data.std(axis=0)
```

## Vectorized Operations

```python
a = np.array([1.0, 2.0, 3.0, 4.0])

# Math
np.sqrt(a)           # element-wise sqrt
np.exp(a)            # e^x
np.log(a)            # natural log
np.log2(a), np.log10(a)
np.abs(np.array([-1,-2,3]))       # absolute value
np.power(a, 2)       # same as a**2
np.floor(a), np.ceil(a), np.round(a, 2)

# Trigonometry
np.sin(a), np.cos(a), np.tan(a)
np.arcsin(a), np.degrees(a)

# Comparison (element-wise)
np.maximum(a, 2.5)   # element-wise max with scalar
np.minimum(a, 2.5)
np.clip(a, 1.5, 3.5) # clip values to [1.5, 3.5]

# Aggregation
a.sum(), a.min(), a.max(), a.mean(), a.std(), a.var()
a.cumsum(), a.cumprod()
np.median(a)
np.percentile(a, [25, 50, 75])
np.quantile(a, 0.95)

# 2D aggregation
m = np.arange(12).reshape(3,4)
m.sum()                  # total
m.sum(axis=0)            # sum each column: shape (4,)
m.sum(axis=1)            # sum each row: shape (3,)
m.sum(keepdims=True)     # preserve dimensions

# Sorting
np.sort(a)               # sorted copy
np.argsort(a)            # indices that would sort
np.argmax(a), np.argmin(a)
np.searchsorted([1,3,5,7], 4)  # index where 4 would be inserted

# Set operations
np.unique(np.array([1,2,2,3,3,3]))           # [1,2,3]
np.union1d([1,2,3], [3,4,5])                 # [1,2,3,4,5]
np.intersect1d([1,2,3], [3,4,5])             # [3]
np.setdiff1d([1,2,3], [3,4,5])              # [1,2]
```

## Linear Algebra

### Theory

NumPy's `linalg` module wraps **LAPACK** and **BLAS** — industry-standard Fortran/C libraries optimised over decades. With OpenBLAS or Intel MKL, matrix operations automatically use multi-threading and SIMD intrinsics.

**Key rule:** always use `linalg.solve(A, b)` instead of `linalg.inv(A) @ b`. `solve` uses LU decomposition — more numerically stable and 3× faster. Explicit matrix inversion amplifies floating-point errors and is almost never needed in practice.

**SVD** (`U, S, Vt = linalg.svd(A)`) is the backbone of: PCA (principal components = right singular vectors), LSA (text embeddings), collaborative filtering, low-rank approximation (`A ≈ U[:,:k] @ diag(S[:k]) @ Vt[:k,:]`), and the pseudo-inverse (`linalg.pinv`).

**Eigendecomposition** drives PCA (covariance matrix eigenvalues = explained variance), spectral clustering, and PageRank. For symmetric positive-definite matrices, `linalg.eigh` is faster and more stable than `linalg.eig`.

```python
from numpy import linalg as LA

A = np.array([[1,2],[3,4]], dtype=float)
B = np.array([[5,6],[7,8]], dtype=float)

# Matrix multiplication
A @ B                      # matrix multiply (recommended)
np.matmul(A, B)            # same
np.dot(A, B)               # dot product (same for 2D)

# Determinant, inverse, rank
LA.det(A)                  # -2.0
LA.inv(A)                  # inverse matrix
LA.matrix_rank(A)          # 2

# Eigenvalues and eigenvectors
vals, vecs = LA.eig(A)

# Singular Value Decomposition
U, S, Vt = LA.svd(A)

# Solve linear system Ax = b
b = np.array([5.0, 6.0])
x = LA.solve(A, b)         # faster and more stable than inv(A) @ b

# Norms
LA.norm(A)                 # Frobenius norm
LA.norm(A, ord=1)          # 1-norm
LA.norm(A, ord=2)          # spectral norm
LA.norm(b, ord=2)          # vector 2-norm (L2)
```

## Interview Questions and Answers

**Q1. What is the difference between a NumPy view and a copy?**

Answer: A **view** shares memory with the original array — changes to the view affect the original. A **copy** is independent — changes don't affect the original.
```python
a = np.array([1, 2, 3, 4])
v = a[1:3]           # slice → VIEW
v[0] = 99
print(a)             # [1, 99, 3, 4] — original changed!

c = a[1:3].copy()    # explicit copy
c[0] = 0
print(a)             # [1, 99, 3, 4] — original unchanged

# Check: view if base is not None
print(v.base is a)   # True → view
print(c.base is None)# True → copy
```
Boolean/fancy indexing always returns a copy; slicing returns a view.

**Q2. Explain NumPy broadcasting with an example.**

Answer: Broadcasting allows operations on arrays of different shapes by implicitly expanding the smaller array without copying data. Rules: (1) right-align shapes, (2) dimensions of size 1 expand to match, (3) if neither is 1 and they differ → error. Example: `(100, 3) + (3,)` → the `(3,)` is treated as `(1, 3)` then expanded to `(100, 3)`. This is how you subtract the column mean from every row without a loop.

**Q3. What is `np.einsum` and when do you use it?**

Answer: `einsum` (Einstein summation) is a powerful, flexible way to express many linear algebra operations using index notation. Often faster than explicit operations:
```python
# Matrix multiplication: C_ij = sum_k A_ik * B_kj
np.einsum('ik,kj->ij', A, B)   # same as A @ B

# Batch matrix multiply: (batch, m, k) × (batch, k, n) → (batch, m, n)
np.einsum('bij,bjk->bik', A, B)

# Trace: sum of diagonal
np.einsum('ii->', A)

# Outer product
np.einsum('i,j->ij', x, y)
```

---

# 4. Pandas

## What is it?

Pandas provides high-performance, easy-to-use data structures (`Series`, `DataFrame`) and data analysis tools. It's the primary tool for tabular data manipulation in Python — think of it as a programmable spreadsheet with SQL-like capabilities.

## Series

```python
import pandas as pd
import numpy as np

# Create Series
s = pd.Series([1, 2, 3, 4, 5])
s = pd.Series([10, 20, 30], index=["a", "b", "c"])
s = pd.Series({"a": 1, "b": 2, "c": 3})

# Attributes
print(s.index, s.values, s.dtype, s.name, s.shape)

# Access
s["a"]                  # by label
s[0]                    # by position
s[["a", "c"]]           # multiple labels
s["a":"c"]              # label slice (inclusive)
s.iloc[0:2]             # position slice

# Operations (vectorized)
s + 10                  # add 10 to all
s[s > 15]               # boolean filter
s.apply(lambda x: x**2) # apply function
s.map({10: "low", 20: "mid", 30: "high"})  # map values

# String methods
names = pd.Series(["Alice", "Bob", "Charlie"])
names.str.lower()
names.str.contains("li")
names.str.split("l")
```

## DataFrame Creation

### Theory

A Pandas **`DataFrame`** is conceptually a collection of NumPy arrays — one per column — sharing a common **`Index`** (row labels). This design means:
- Vectorised NumPy operations apply directly to numeric columns
- Operations between two DataFrames/Series **align on index** before computing — a powerful automatic-alignment feature that prevents off-by-one bugs but silently produces NaN when indices don't match
- Column access (`df["col"]`) returns a view or copy depending on data layout — use `.copy()` explicitly when you intend to modify independently

**`dtype` management is critical for performance:**
- `object` dtype stores each string as a Python object — slow, memory-heavy
- `category` dtype stores distinct values once and uses integer codes — saves 95%+ memory for low-cardinality strings and makes `groupby`/`sort` 3–5× faster
- `int32`/`float32` halves memory vs `int64`/`float64` for numeric columns
- `datetime64[ns]` unlocks the `.dt` accessor and efficient time-series resampling

**Copy vs View semantics (the `SettingWithCopyWarning`):** operations may return views or copies depending on underlying data layout. Always use `.loc` for assignment — never chain indexing on the left of `=`. Pandas 3.0 introduces **Copy-on-Write (CoW)** semantics to make this deterministic.

```python
# From dict
df = pd.DataFrame({
    "name":   ["Alice", "Bob", "Charlie", "Diana"],
    "dept":   ["Eng", "Mkt", "Eng", "HR"],
    "salary": [90000, 75000, 85000, 70000],
    "hire_date": pd.to_datetime(["2021-01-15", "2022-03-20", "2020-07-01", "2023-05-10"])
})

# From list of dicts
records = [{"a": 1, "b": 2}, {"a": 3, "b": 4}]
df2 = pd.DataFrame(records)

# From CSV/Excel/Parquet
df = pd.read_csv("data.csv", parse_dates=["date"], dtype={"id": "int32"})
df = pd.read_parquet("data.parquet")
df = pd.read_excel("data.xlsx", sheet_name="Sheet1")
df = pd.read_json("data.json", orient="records")
df = pd.read_sql("SELECT * FROM employees", con=engine)

# Attributes
print(df.shape)             # (4, 4)
print(df.dtypes)            # column types
print(df.index)             # RangeIndex
print(df.columns)           # Index(['name', 'dept', ...])
print(df.info())            # summary with nulls
print(df.describe())        # stats for numeric cols
print(df.head(3), df.tail(3))
```

## Selection and Filtering

```python
# Column selection
df["name"]                              # Series
df[["name", "salary"]]                  # DataFrame

# Row selection
df.loc[0]                               # by label (row 0)
df.loc[0:2, "name":"salary"]           # label slice
df.loc[df["salary"] > 80000, ["name","salary"]]  # boolean + cols

df.iloc[0]                              # by integer position
df.iloc[0:3, 1:3]                       # position slice

# Boolean filtering
df[df["salary"] > 80000]
df[(df["dept"] == "Eng") & (df["salary"] > 80000)]
df[(df["dept"] == "Eng") | (df["dept"] == "HR")]
df[~df["dept"].isin(["HR", "Mkt"])]    # NOT IN

# query() — SQL-like string syntax
df.query("salary > 80000 and dept == 'Eng'")
df.query("name in @names_list")         # use external variable with @

# at / iat (single value — fast)
df.at[0, "name"]                       # by label
df.iat[0, 0]                           # by position

# where / mask
df.where(df["salary"] > 80000)         # NaN where condition is False
df.mask(df["salary"] > 80000)          # NaN where condition is True
```

## Data Cleaning

```python
# Missing values
df.isnull()                            # boolean mask
df.isnull().sum()                      # count per column
df.isnull().sum() / len(df) * 100      # percentage

df.dropna()                            # drop rows with any NaN
df.dropna(subset=["salary"])           # drop only if salary is NaN
df.dropna(how="all")                   # drop only if all NaN
df.dropna(thresh=3)                    # keep rows with ≥ 3 non-NaN

df.fillna(0)                           # fill all NaN with 0
df.fillna({"salary": df["salary"].mean(), "dept": "Unknown"})
df.fillna(method="ffill")              # forward fill
df.fillna(method="bfill")              # backward fill
df["salary"].interpolate()             # interpolate numeric

# Duplicates
df.duplicated()                        # boolean mask
df.duplicated(subset=["name"])
df.drop_duplicates()
df.drop_duplicates(subset=["name"], keep="last")

# Data types
df["salary"].astype("int32")
df["hire_date"] = pd.to_datetime(df["hire_date"])
df["dept"] = df["dept"].astype("category")       # memory efficient

# String cleaning
df["name"].str.strip()
df["name"].str.lower()
df["name"].str.replace(r"\s+", " ", regex=True)
df["email"].str.extract(r"@(\w+)\.")             # regex extract

# Renaming
df.rename(columns={"name": "employee_name", "dept": "department"})
df.columns = df.columns.str.lower().str.replace(" ", "_")  # clean all col names
```

## Transformations

```python
# Add / modify columns
df["annual_bonus"] = df["salary"] * 0.1
df["seniority"] = (pd.Timestamp.now() - df["hire_date"]).dt.days / 365

# apply — custom function per row/col
df["name_length"] = df["name"].apply(len)
df["salary_band"] = df["salary"].apply(lambda x: "High" if x > 85000 else "Normal")
df["combined"] = df.apply(lambda row: f"{row['name']} ({row['dept']})", axis=1)

# map — for Series, element-wise
df["dept_code"] = df["dept"].map({"Eng": 1, "Mkt": 2, "HR": 3})

# applymap / map (DataFrame element-wise, pd 2.1+)
df[["salary"]].map(lambda x: f"₹{x:,}")

# assign — chaining friendly
df = (df
      .assign(monthly_salary=lambda d: d["salary"] / 12)
      .assign(is_senior=lambda d: d["seniority"] > 2)
      .assign(dept_upper=lambda d: d["dept"].str.upper()))

# cut / qcut — binning
df["salary_quartile"] = pd.qcut(df["salary"], q=4, labels=["Q1","Q2","Q3","Q4"])
df["salary_bin"] = pd.cut(df["salary"], bins=[0, 70000, 90000, 200000],
                          labels=["Low","Mid","High"])

# get_dummies — one-hot encoding
dummies = pd.get_dummies(df["dept"], prefix="dept")
df = pd.concat([df, dummies], axis=1)

# Sorting
df.sort_values("salary", ascending=False)
df.sort_values(["dept", "salary"], ascending=[True, False])
df.sort_index()
```

## GroupBy and Aggregations

### Theory

GroupBy implements the **split-apply-combine** pattern: (1) **split** the DataFrame into groups by key, (2) **apply** a function independently to each group, (3) **combine** results. The `GroupBy` object is **lazy** — no computation happens until you call a terminal operation.

**Three operation types with different semantics:**
- **Aggregation** (`.agg()`, `.mean()`, `.sum()`) — reduces each group to scalar(s). Result has one row per group.
- **Transformation** (`.transform()`) — applies a function but returns a result with the **same shape as the input**. Each row gets the group's aggregate broadcast back — essential for adding group-level features without collapsing rows.
- **Filtering** (`.filter(fn)`) — drops entire groups where `fn(group)` returns `False`. Returns a subset of original rows with original shape.

**Performance tips:**
- Use `category` dtype for groupby keys — 3–5× speedup
- `.agg()` with named aggregation syntax avoids MultiIndex columns and is cleaner
- Pass `observed=True` for categorical keys to avoid empty rows for unseen category combinations
- For very large DataFrames, consider pushing the aggregation into SQL/Spark instead

`groupby(...).transform("mean")` is the Pandas equivalent of `AVG(col) OVER (PARTITION BY key)` in SQL window functions.

```python
# Basic groupby
df.groupby("dept")["salary"].mean()
df.groupby("dept")["salary"].agg(["mean", "min", "max", "count"])

# Multiple aggregations
df.groupby("dept").agg(
    emp_count   =("name",   "count"),
    avg_salary  =("salary", "mean"),
    total_salary=("salary", "sum"),
    max_salary  =("salary", "max"),
    min_hire    =("hire_date", "min")
).reset_index()

# Custom aggregation
df.groupby("dept")["salary"].agg(lambda x: x.quantile(0.75))

# Transform — broadcast group aggregate back to original shape
df["dept_avg_salary"] = df.groupby("dept")["salary"].transform("mean")
df["rank_in_dept"] = df.groupby("dept")["salary"].rank(ascending=False)

# Filter — keep groups matching condition
df.groupby("dept").filter(lambda g: g["salary"].mean() > 80000)

# apply — arbitrary function on groups
def top2(group):
    return group.nlargest(2, "salary")

df.groupby("dept").apply(top2).reset_index(drop=True)

# Named aggregation (pandas 0.25+)
result = df.groupby("dept").agg(
    n     =("name", "count"),
    avg   =("salary", "mean"),
    total =("salary", "sum"),
)

# pivot_table
pivot = df.pivot_table(
    values="salary",
    index="dept",
    columns="hire_date",
    aggfunc="mean",
    fill_value=0
)
```

## Merging and Joining

### Theory

Pandas `merge` implements a **hash-join** algorithm similar to SQL JOIN. The `how` parameter maps directly to SQL: `inner` (default), `left`, `right`, `outer`. The key insight: if the join key has **duplicates in both DataFrames**, the result has rows = product of duplicate counts per key value — the most common cause of unintended DataFrame size explosions in data pipelines.

**Production safety features:**
- `validate="one_to_one"` / `"one_to_many"` / `"many_to_one"` raises `MergeError` if actual cardinality doesn't match — use this in pipeline code to catch bugs early
- `indicator=True` adds a `_merge` column showing `"left_only"` / `"right_only"` / `"both"` — essential for debugging join completeness
- `suffixes=("_left","_right")` controls how conflicting column names are disambiguated

`pd.concat` is fundamentally different — it stacks DataFrames along an axis without key-based alignment. `axis=0` is equivalent to SQL `UNION ALL`. It aligns by column name (fills missing columns with NaN), which can silently hide schema drift in pipelines — always assert `.columns` or `.dtypes` after concat in production code.

```python
employees = pd.DataFrame({"emp_id":[1,2,3,4], "name":["A","B","C","D"], "dept_id":[1,2,1,3]})
departments = pd.DataFrame({"dept_id":[1,2,3], "dept_name":["Eng","Mkt","HR"]})

# merge (like SQL JOIN)
pd.merge(employees, departments, on="dept_id")                      # INNER
pd.merge(employees, departments, on="dept_id", how="left")          # LEFT
pd.merge(employees, departments, on="dept_id", how="outer")         # FULL
pd.merge(employees, departments, left_on="dept_id", right_on="id")  # different col names

# Suffix for overlapping columns
pd.merge(df1, df2, on="id", suffixes=("_left", "_right"))

# join — joins on index
df1.set_index("emp_id").join(df2.set_index("emp_id"), how="left")

# concat — stack DataFrames
pd.concat([df1, df2], axis=0)                  # row-wise (vertical)
pd.concat([df1, df2], axis=1)                  # col-wise (horizontal)
pd.concat([df1, df2], ignore_index=True)       # reset index
pd.concat([df1, df2], keys=["2023", "2024"])   # hierarchical index
```

## Window Functions

### Theory

Pandas window functions mirror SQL window functions. A **rolling window** (`df.rolling(n)`) computes over a sliding fixed-size window. An **expanding window** (`df.expanding()`) grows from the series start. **EWM** (`df.ewm(span=n)`) applies geometrically decaying weights.

**`groupby().transform()`** is the Pandas equivalent of `OVER (PARTITION BY ...)` in SQL — it computes a group aggregate and broadcasts it back to every row, preserving the original DataFrame shape. Critical for feature engineering: adding department-level statistics as a feature for each employee row.

`shift(n)` creates lag features (positive n) or lead features (negative n) — the foundation of time-series feature engineering. `diff(n)` computes period-over-period differences. All respect group boundaries when applied after `groupby`.

**Performance:** `.rolling().apply(custom_fn)` with a Python function is slow — Python callback per window. Use built-in methods (`.mean()`, `.sum()`, `.std()`) implemented in C via Cython. For custom window logic: pass `engine="numba"` with a Numba JIT-compiled function for near-C speed.

```python
# Rolling windows
df["salary_3roll"] = df.groupby("dept")["salary"].transform(
    lambda x: x.rolling(window=3, min_periods=1).mean()
)

# expanding (cumulative)
df["salary"].expanding().mean()    # expanding mean
df["salary"].cumsum()
df["salary"].cumprod()

# shift — lag/lead
df["prev_salary"] = df.groupby("emp_id")["salary"].shift(1)   # lag 1
df["next_salary"] = df.groupby("emp_id")["salary"].shift(-1)  # lead 1

# diff — period-over-period difference
df["salary_change"] = df.groupby("emp_id")["salary"].diff(1)

# pct_change
df["salary_pct"] = df.groupby("emp_id")["salary"].pct_change()

# rank
df["salary_rank"] = df["salary"].rank(ascending=False, method="dense")
```

## MultiIndex

```python
# Create MultiIndex
arrays = [["Eng","Eng","Mkt","Mkt"], ["Alice","Bob","Charlie","Diana"]]
index = pd.MultiIndex.from_arrays(arrays, names=["dept","name"])
df_mi = pd.Series([90000, 85000, 75000, 70000], index=index)

# Access
df_mi["Eng"]                          # all Eng rows
df_mi["Eng"]["Alice"]                 # specific
df_mi.loc["Eng", "Alice"]

# Cross-section
df_mi.xs("Alice", level="name")       # all Alice rows across depts

# Unstack / stack
df_mi.unstack(level="name")           # name → columns
df_unstacked = df_mi.unstack()
df_unstacked.stack()                  # back to MultiIndex

# reset_index
df_mi.reset_index()                   # MultiIndex → regular columns
```

## Date/Time

```python
# Parse dates
df["date"] = pd.to_datetime(df["date_str"])
df["date"] = pd.to_datetime(df["date_str"], format="%d/%m/%Y")

# Date range
dates = pd.date_range("2024-01-01", periods=12, freq="ME")   # month end
dates = pd.date_range("2024-01-01", "2024-12-31", freq="D")  # daily

# Accessor: .dt
df["year"]    = df["date"].dt.year
df["month"]   = df["date"].dt.month
df["quarter"] = df["date"].dt.quarter
df["dayofweek"] = df["date"].dt.dayofweek   # 0=Mon
df["is_weekend"] = df["date"].dt.dayofweek >= 5

# Resample (time-based groupby)
df.set_index("date").resample("ME")["revenue"].sum()    # monthly sum
df.set_index("date").resample("W")["clicks"].mean()     # weekly avg
df.set_index("date").resample("QE").agg({"revenue":"sum","clicks":"count"})
```

## Performance Tips

```python
# Use categorical dtype for low-cardinality string columns
df["dept"] = df["dept"].astype("category")    # saves ~90% memory

# Use vectorized operations (avoid .apply with Python loops)
# SLOW:
df["result"] = df["col"].apply(lambda x: x * 2 + 1)
# FAST:
df["result"] = df["col"] * 2 + 1

# Use .query() for filtering (sometimes faster, always more readable)
df.query("salary > 80000 and dept == 'Eng'")

# Read only needed columns
df = pd.read_csv("big.csv", usecols=["id","name","salary"])

# Specify dtypes on read
df = pd.read_csv("big.csv", dtype={"id":"int32","salary":"float32"})

# Use eval() for complex expressions (numexpr backend)
df.eval("total = salary + bonus")

# Avoid chained indexing (causes SettingWithCopyWarning)
# BAD:  df[df.salary > 80000]["name"] = "high"
# GOOD: df.loc[df.salary > 80000, "name"] = "high"

# For large data: use chunking
for chunk in pd.read_csv("huge.csv", chunksize=100_000):
    process(chunk)
```

## Interview Questions and Answers

**Q1. What is the difference between `loc` and `iloc`?**

Answer:
- `loc`: Label-based indexing — uses actual index values and column names. Inclusive on both ends for slices (`loc[0:3]` includes row 3).
- `iloc`: Integer position-based indexing — always uses 0-based integer positions. Exclusive on the right for slices (`iloc[0:3]` → rows 0, 1, 2).

```python
df = pd.DataFrame({"a":[10,20,30]}, index=["x","y","z"])
df.loc["x":"y"]   # rows x and y (inclusive)
df.iloc[0:2]      # rows 0 and 1 (exclusive end)
```

**Q2. What is the difference between `apply`, `map`, and `applymap`/`map` for DataFrames?**

Answer:
- `Series.map(func/dict)`: Element-wise on a Series. Ideal for value mapping.
- `Series.apply(func)`: Apply function to each element of a Series. Like map but more flexible (can return non-scalar).
- `DataFrame.apply(func, axis=0/1)`: Apply function along axis — axis=0 (per column), axis=1 (per row).
- `DataFrame.map(func)` (pandas 2.1+, formerly `applymap`): Element-wise on every cell of a DataFrame.

**Q3. How do you handle missing data in Pandas?**

Answer: Detect with `isnull()` / `notnull()`. Handle with:
- `dropna()`: Remove rows/cols with NaN
- `fillna(value)`: Replace with scalar, dict, or method (ffill/bfill)
- `interpolate()`: Numeric interpolation
- Use `subset` and `thresh` params in dropna to be selective

For production pipelines: log the percentage of NaN before filling, and document imputation decisions.

**Q4. What is `SettingWithCopyWarning` and how do you avoid it?**

Answer: It occurs when trying to modify a chained selection (e.g., `df[mask]["col"] = value`) — Pandas isn't sure if you're modifying the original or a copy. Always use `.loc` for assignments:
```python
# WRONG (may not modify original):
df[df["salary"] > 80000]["dept"] = "Senior"

# CORRECT:
df.loc[df["salary"] > 80000, "dept"] = "Senior"
```

**Q5. What is the difference between `merge` and `join`?**

Answer:
- `pd.merge(left, right, on="key")`: Flexible SQL-like join on any columns. Default INNER join.
- `df.join(other)`: Joins on index by default. Convenience wrapper around merge.

Use `merge` when joining on columns. Use `join` when joining on index. `merge` is more explicit and generally preferred.

**Q6. How do you optimize Pandas for large datasets?**

Answer:
1. Specify dtypes on read (`dtype={"id": "int32"}`) — reduces memory 2-4x
2. Use `category` dtype for low-cardinality strings — 10-100x memory savings
3. Use `chunksize` for files that don't fit in memory
4. Prefer vectorized operations over `.apply()` — 10-100x faster
5. Use `.query()` for filtering — leverages numexpr if available
6. Select only needed columns with `usecols`
7. For very large data: Dask, Polars, or push processing to Spark/SQL

---

# 5. Scikit-learn

## What is it?

Scikit-learn is Python's primary machine learning library — consistent API for classification, regression, clustering, dimensionality reduction, preprocessing, model selection, and pipelines. Built on NumPy/SciPy.

## Estimator API (Core Pattern)

### Theory

Scikit-learn's **Estimator API** is the single most important design decision in the library. Every object — transformer, classifier, regressor, clusterer — follows the same interface: `fit()` learns from data and returns `self`, `transform()` applies a learned transformation, `predict()` outputs predictions, `score()` evaluates. This uniformity enables:

- **Composability:** Any estimator can be dropped into a `Pipeline` or `GridSearchCV`
- **Consistency:** Learn the API once, use any algorithm the same way
- **Interoperability:** Third-party libraries (XGBoost, LightGBM, CatBoost) implement the same interface so they work with all sklearn meta-estimators

**Stateful vs stateless methods:** `fit()` modifies the estimator's state (stores `mean_`, `scale_`, `feature_importances_`, `coef_` etc.). `transform()` and `predict()` are stateless — they use the stored state to process new data. NEVER call `fit()` on test data — this is the core rule that prevents data leakage.

The **`check_estimator()`** utility validates that a custom estimator correctly implements the API — essential when building custom transformers for sklearn pipelines.

```python
# ALL sklearn estimators follow this pattern:
# estimator.fit(X, y)        → learns from data, returns self
# estimator.predict(X)       → output predictions
# estimator.transform(X)     → transform data (preprocessors)
# estimator.fit_transform(X) → fit then transform (shortcut)
# estimator.score(X, y)      → evaluate (accuracy, R²...)
# estimator.get_params()     → hyperparameter dict
# estimator.set_params(**p)  → set hyperparameters
```

## Data Preparation

```python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import (
    StandardScaler, MinMaxScaler, RobustScaler, LabelEncoder,
    OneHotEncoder, OrdinalEncoder, PolynomialFeatures
)

# Load data
from sklearn.datasets import load_breast_cancer, fetch_california_housing
X, y = load_breast_cancer(return_X_y=True)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y     # maintain class distribution
)

# Scaling
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)  # fit on train only!
X_test_scaled  = scaler.transform(X_test)        # apply learned params

# Never fit on test set → data leakage!

# Comparison
# StandardScaler: (x - mean) / std → N(0,1), sensitive to outliers
# MinMaxScaler:   (x - min) / (max - min) → [0,1], sensitive to outliers
# RobustScaler:   (x - median) / IQR → robust to outliers

# Encoding
le = LabelEncoder()
y_encoded = le.fit_transform(["cat","dog","cat","fish"])  # [0,1,0,2]
le.classes_           # ['cat', 'dog', 'fish']

# OneHotEncoder (for features, not target)
ohe = OneHotEncoder(sparse_output=False, handle_unknown="ignore")
X_cat = ohe.fit_transform(df[["dept","city"]])
ohe.get_feature_names_out()
```

## Classification

```python
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.ensemble import (
    RandomForestClassifier, GradientBoostingClassifier,
    AdaBoostClassifier, VotingClassifier
)
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, classification_report,
    confusion_matrix, roc_curve
)

# Logistic Regression
lr = LogisticRegression(C=1.0, max_iter=1000, random_state=42)
lr.fit(X_train_scaled, y_train)
y_pred = lr.predict(X_test_scaled)
y_prob = lr.predict_proba(X_test_scaled)[:, 1]   # probability of class 1

print(f"Accuracy:  {accuracy_score(y_test, y_pred):.4f}")
print(f"Precision: {precision_score(y_test, y_pred):.4f}")
print(f"Recall:    {recall_score(y_test, y_pred):.4f}")
print(f"F1 Score:  {f1_score(y_test, y_pred):.4f}")
print(f"ROC-AUC:   {roc_auc_score(y_test, y_prob):.4f}")
print(classification_report(y_test, y_pred))
print(confusion_matrix(y_test, y_pred))

# Random Forest
rf = RandomForestClassifier(
    n_estimators=100,
    max_depth=None,
    min_samples_split=2,
    max_features="sqrt",   # sqrt(n_features) per split
    random_state=42,
    n_jobs=-1              # use all cores
)
rf.fit(X_train, y_train)
rf.feature_importances_    # array of importance scores

# Gradient Boosting
from sklearn.ensemble import HistGradientBoostingClassifier  # faster
gb = HistGradientBoostingClassifier(
    learning_rate=0.05,
    max_iter=200,
    max_depth=4,
    random_state=42
)
```

## Regression

```python
from sklearn.linear_model import (
    LinearRegression, Ridge, Lasso, ElasticNet, BayesianRidge
)
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import (
    mean_squared_error, mean_absolute_error,
    r2_score, mean_absolute_percentage_error
)

X, y = fetch_california_housing(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Linear Regression
lr = LinearRegression()
lr.fit(X_train, y_train)
y_pred = lr.predict(X_test)

print(f"R²:   {r2_score(y_test, y_pred):.4f}")
print(f"RMSE: {mean_squared_error(y_test, y_pred, squared=False):.4f}")
print(f"MAE:  {mean_absolute_error(y_test, y_pred):.4f}")
print(f"MAPE: {mean_absolute_percentage_error(y_test, y_pred)*100:.2f}%")

# Regularization
ridge = Ridge(alpha=1.0)         # L2: shrinks all coefficients
lasso = Lasso(alpha=0.1)         # L1: sparse, drives some to zero
elastic = ElasticNet(alpha=0.1, l1_ratio=0.5)  # L1+L2

# Coefficients
print(lr.coef_, lr.intercept_)
```

## Clustering

```python
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.metrics import silhouette_score, davies_bouldin_score

# K-Means
km = KMeans(n_clusters=3, random_state=42, n_init=10)
labels = km.fit_predict(X_scaled)
print(km.cluster_centers_)        # centroid coordinates
print(km.inertia_)                 # within-cluster sum of squares (WCSS)

# Elbow method (find optimal k)
inertias = []
for k in range(1, 11):
    km = KMeans(n_clusters=k, random_state=42)
    km.fit(X_scaled)
    inertias.append(km.inertia_)

# Silhouette score (higher = better, range [-1, 1])
sil = silhouette_score(X_scaled, labels)

# DBSCAN (no need to specify k, handles noise)
db = DBSCAN(eps=0.5, min_samples=5)
labels = db.fit_predict(X_scaled)
# label = -1 means noise point
```

## Dimensionality Reduction

```python
from sklearn.decomposition import PCA, TruncatedSVD, NMF
from sklearn.manifold import TSNE
from sklearn.preprocessing import StandardScaler

# PCA
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

pca = PCA(n_components=2)
X_2d = pca.fit_transform(X_scaled)
print(pca.explained_variance_ratio_)      # variance per component
print(pca.explained_variance_ratio_.cumsum())  # cumulative

# Auto-select components explaining 95% variance
pca95 = PCA(n_components=0.95)
X_reduced = pca95.fit_transform(X_scaled)

# t-SNE (visualization only, not for new data)
tsne = TSNE(n_components=2, perplexity=30, random_state=42)
X_tsne = tsne.fit_transform(X_scaled)
```

## Pipelines

### Theory

A `Pipeline` chains preprocessing steps and a final estimator into one object. Two critical benefits:

**1. Prevents data leakage in cross-validation.** When `GridSearchCV` runs, it splits data and calls `pipeline.fit(X_train_fold, y_train_fold)` on each fold. Each transformer's `fit` sees only the training fold. The validation fold only ever passes through `transform`. Without a pipeline, fitting the scaler on the full dataset before CV means the validation fold's statistics already leaked into the scaler.

**2. Deployment simplicity.** The entire chain is one serialisable object — `joblib.dump(pipeline, "model.pkl")` saves everything; `pipeline.predict(new_data)` applies all transformations automatically with no risk of preprocessing/model mismatch.

`ColumnTransformer` applies different pipelines to different column subsets in parallel. It is the standard solution for mixed-type DataFrames (numeric → `StandardScaler + SimpleImputer`, categorical → `OneHotEncoder + SimpleImputer`).

Access inner steps via `pipeline.named_steps["step_name"]`. In `GridSearchCV` param grids, use double underscore to reference sub-estimator params: `"classifier__n_estimators": [100, 200]`.

```python
from sklearn.pipeline import Pipeline, make_pipeline
from sklearn.compose import ColumnTransformer, make_column_selector
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestClassifier

# Column transformer for mixed types
numeric_features = ["age", "salary", "years_exp"]
categorical_features = ["dept", "city", "education"]

numeric_transformer = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler",  StandardScaler())
])

categorical_transformer = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("onehot",  OneHotEncoder(handle_unknown="ignore", sparse_output=False))
])

preprocessor = ColumnTransformer(transformers=[
    ("num", numeric_transformer, numeric_features),
    ("cat", categorical_transformer, categorical_features)
])

# Full pipeline
pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier",   RandomForestClassifier(n_estimators=100, random_state=42))
])

# Fit and predict — same API as any estimator
pipeline.fit(X_train, y_train)
y_pred = pipeline.predict(X_test)
y_prob = pipeline.predict_proba(X_test)[:, 1]

# Access inner steps
pipeline.named_steps["classifier"].feature_importances_
```

## Hyperparameter Tuning

```python
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV, cross_val_score
from scipy.stats import randint, uniform

# Cross-validation
scores = cross_val_score(
    RandomForestClassifier(random_state=42),
    X, y,
    cv=5,                    # 5-fold CV
    scoring="roc_auc",
    n_jobs=-1
)
print(f"CV AUC: {scores.mean():.4f} ± {scores.std():.4f}")

# Grid Search
param_grid = {
    "classifier__n_estimators": [50, 100, 200],
    "classifier__max_depth":    [None, 5, 10],
    "classifier__min_samples_split": [2, 5]
}
grid_cv = GridSearchCV(
    pipeline, param_grid,
    cv=5, scoring="roc_auc",
    n_jobs=-1, verbose=1
)
grid_cv.fit(X_train, y_train)
print(grid_cv.best_params_)
print(grid_cv.best_score_)

# Random Search (faster for large spaces)
param_dist = {
    "classifier__n_estimators": randint(50, 300),
    "classifier__max_depth":    [None, 3, 5, 7, 10],
    "classifier__max_features": uniform(0.3, 0.7)
}
rand_cv = RandomizedSearchCV(
    pipeline, param_dist,
    n_iter=50, cv=5,
    scoring="roc_auc",
    random_state=42, n_jobs=-1
)
rand_cv.fit(X_train, y_train)
```

## Model Evaluation

### Theory

**Model evaluation** estimates how well the model performs on unseen data — not training data.

**Train/validation/test philosophy:**
- **Training set:** Fit the model
- **Validation set / CV folds:** Tune hyperparameters and select models
- **Test set:** Used EXACTLY ONCE at the very end. Any decision made using the test set invalidates it as an unbiased estimate — you need a new test set.

**Metric selection:**
| Problem | Primary Metric | Reasoning |
|---|---|---|
| Balanced classification | Accuracy / F1 | Symmetric class costs |
| Imbalanced classification | AUC-PR, F1 | ROC is optimistic when TN count is huge |
| Ranking | NDCG, MAP | Rewards correct rank ordering |
| Regression, outliers costly | RMSE | Squares large errors |
| Regression, robust | MAE | Linear penalty, outlier-resistant |
| Interpretable error | MAPE | Relative % error |

**AUC-ROC vs AUC-PR:** ROC uses true negatives in the denominator of FPR — for imbalanced datasets, a huge TN pool keeps FPR low even with many false positives, giving an overly optimistic curve. Precision-Recall curves don't use TN at all and directly show the quality of positive predictions. Always prefer AUC-PR for fraud detection, medical diagnosis, ad CTR prediction.

**Calibration:** a probability of 0.8 should mean ~80% of those cases are truly positive. Most models (SVM, boosting) are not well-calibrated — use `CalibratedClassifierCV` for probability outputs that feed into business decisions or downstream models.

```python
from sklearn.metrics import (
    confusion_matrix, classification_report,
    roc_curve, precision_recall_curve,
    ConfusionMatrixDisplay
)
import matplotlib.pyplot as plt

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
tn, fp, fn, tp = cm.ravel()
print(f"TN={tn}, FP={fp}, FN={fn}, TP={tp}")

# Key metrics
precision = tp / (tp + fp)     # when predict +, how often correct
recall    = tp / (tp + fn)     # of all actual +, how many we caught
f1        = 2*precision*recall/(precision+recall)
specificity = tn / (tn + fp)   # recall for negative class

# For imbalanced classes: prefer F1, AUC-PR over accuracy
# AUC-ROC: probability that positive ranked higher than negative

# ROC Curve
fpr, tpr, thresholds = roc_curve(y_test, y_prob)

# Precision-Recall Curve (better for imbalanced)
prec, rec, thresholds = precision_recall_curve(y_test, y_prob)

# Regression metrics
r2      = r2_score(y_test, y_pred)          # 1 = perfect, 0 = baseline
rmse    = mean_squared_error(y_test, y_pred, squared=False)
mae     = mean_absolute_error(y_test, y_pred)  # robust to outliers
mape    = mean_absolute_percentage_error(y_test, y_pred)  # interpretable %
```

## Interview Questions and Answers

**Q1. What is data leakage and how do you prevent it?**

Answer: Data leakage occurs when information from outside the training set influences the model, giving unrealistically optimistic evaluation. Forms:
1. **Preprocessing leakage:** Fitting scalers/imputers on the entire dataset (including test) before splitting → test data influences training normalization. Fix: always fit preprocessors only on training data; use Pipeline + CV.
2. **Target leakage:** Using features that are caused by or computed after the target (e.g., using "days in hospital" to predict discharge date).
3. **Train-test contamination:** Shuffling time-series data before splitting.

**Q2. Why is cross-validation better than a single train/test split?**

Answer: A single split gives a high-variance estimate — results depend on which specific rows end up in train vs test. Cross-validation (k-fold) trains k models on k different splits and averages the scores, giving a lower-variance, more reliable estimate of generalization performance. Also: it uses all data for both training and evaluation, which is important for small datasets.

**Q3. Explain precision, recall, and F1-score. When do you use each?**

Answer:
- **Precision:** `TP / (TP + FP)` — of all positive predictions, what fraction is correct? Use when false positives are costly (spam filter: don't want to block legitimate emails).
- **Recall (Sensitivity):** `TP / (TP + FN)` — of all actual positives, what fraction did we catch? Use when false negatives are costly (cancer detection: don't miss real cases).
- **F1-Score:** Harmonic mean of precision and recall. Use for imbalanced classes or when you need a single metric balancing both.

For imbalanced datasets (fraud, medical diagnosis): accuracy is misleading; prefer F1, AUC-PR.

**Q4. What is the bias-variance tradeoff?**

Answer:
- **Bias:** Error from oversimplified model assumptions (underfitting). High bias → model misses patterns. Linear model for non-linear data.
- **Variance:** Error from sensitivity to training data (overfitting). High variance → model memorizes noise. Deep tree with no pruning.
- **Tradeoff:** Decreasing one usually increases the other. Goal: find the sweet spot (right model complexity, regularization, ensemble methods).
- Regularization (Ridge, Lasso, dropout) reduces variance at cost of slight bias increase.

**Q5. What is the difference between Bagging and Boosting?**

Answer:
- **Bagging (Bootstrap Aggregating):** Train independent models on random data subsets in parallel. Average predictions. Reduces **variance**. Example: Random Forest.
- **Boosting:** Train models sequentially, each correcting the previous one's errors. Final prediction = weighted sum. Reduces **bias**. Example: GradientBoosting, XGBoost, LightGBM.

Bagging: good baseline, low overfitting risk. Boosting: usually higher accuracy but needs careful tuning to avoid overfitting.

---

# 6. Matplotlib

## What is it?

Matplotlib is Python's foundational plotting library. Low-level but fully customizable. The `pyplot` interface provides MATLAB-like convenience; the object-oriented API provides full control.

## Figure and Axes Architecture

### Theory

Matplotlib has two coexisting APIs:

**1. `pyplot` state-machine API** (`plt.plot()`, `plt.title()`) — maintains an implicit "current figure/axes" state. Convenient for quick exploratory plots but fragile in loops and functions where state can leak unexpectedly between plots.

**2. Object-Oriented (OO) API** (`fig, ax = plt.subplots(); ax.plot()`) — the correct approach for production code, multi-panel figures, and reusable functions. You work directly with `Figure` and `Axes` objects — explicit, composable, testable.

The **rendering architecture** separates the frontend (Artist hierarchy: `Figure → Axes → Lines, Patches, Text`) from the backend (Agg → PNG/PDF, TkAgg → interactive window). Switch backends with `matplotlib.use("Agg")` before importing pyplot — critical for server-side rendering where no display is available.

**Performance for large data:** `ax.plot` with 10M points is very slow to render — downsample first or use `datashader`/`plotly` for large point clouds. Always call `plt.close("all")` after saving in batch loops — Matplotlib keeps figures in memory, causing memory leaks in long-running reporting scripts.

**DPI and sizing:** `figsize` is in inches; `dpi` is dots per inch. Screen: 72–100 DPI. Web: 150 DPI. Print publication: 300+ DPI. Always use `bbox_inches="tight"` in `savefig` to prevent label clipping.

```python
import matplotlib.pyplot as plt
import numpy as np

# Two styles:
# 1. plt interface (quick, implicit)
plt.plot([1,2,3],[4,5,6])
plt.show()

# 2. OO interface (recommended for complex plots)
fig, ax = plt.subplots(figsize=(8, 5))
ax.plot([1,2,3],[4,5,6])
plt.show()

# Multiple subplots
fig, axes = plt.subplots(2, 3, figsize=(15, 8))
# axes is a 2×3 array of Axes objects
ax1 = axes[0, 0]
ax2 = axes[0, 1]
# or flatten for iteration
for ax in axes.flatten():
    ax.plot(...)

# Shared axes
fig, (ax1, ax2) = plt.subplots(1, 2, sharex=True, sharey=True)

# GridSpec (unequal sizes)
from matplotlib.gridspec import GridSpec
fig = plt.figure(figsize=(12, 8))
gs = GridSpec(2, 3, figure=fig)
ax1 = fig.add_subplot(gs[0, :])     # full top row
ax2 = fig.add_subplot(gs[1, 0:2])  # bottom left×2
ax3 = fig.add_subplot(gs[1, 2])    # bottom right
```

## Common Plot Types

```python
x = np.linspace(0, 2*np.pi, 100)
y1 = np.sin(x)
y2 = np.cos(x)
fig, axes = plt.subplots(2, 3, figsize=(15, 8))

# Line plot
ax = axes[0,0]
ax.plot(x, y1, label="sin", color="steelblue", linewidth=2, linestyle="-")
ax.plot(x, y2, label="cos", color="coral",     linewidth=2, linestyle="--")
ax.set_title("Line Plot"); ax.set_xlabel("x"); ax.set_ylabel("y")
ax.legend(); ax.grid(True, alpha=0.3)

# Bar chart
ax = axes[0,1]
categories = ["Eng","Mkt","HR","Finance"]
values     = [350, 210, 140, 190]
colors     = ["steelblue","coral","seagreen","gold"]
bars = ax.bar(categories, values, color=colors, edgecolor="white", linewidth=1.5)
ax.bar_label(bars, fmt="%d")     # add value labels
ax.set_title("Bar Chart")

# Horizontal bar
ax = axes[0,2]
ax.barh(categories, values, color=colors)
ax.set_title("Horizontal Bar")

# Scatter plot
ax = axes[1,0]
np.random.seed(42)
n = 100
x_s = np.random.randn(n);  y_s = 2*x_s + np.random.randn(n)*0.5
scatter = ax.scatter(x_s, y_s, c=y_s, cmap="viridis",
                     alpha=0.7, s=50, edgecolors="white", linewidths=0.5)
fig.colorbar(scatter, ax=ax, label="y value")
ax.set_title("Scatter Plot")

# Histogram
ax = axes[1,1]
data = np.random.normal(0, 1, 1000)
ax.hist(data, bins=30, color="steelblue", edgecolor="white",
        alpha=0.7, density=True)
# Add KDE curve
from scipy.stats import norm
xr = np.linspace(-4, 4, 100)
ax.plot(xr, norm.pdf(xr), "r-", linewidth=2, label="Normal PDF")
ax.legend(); ax.set_title("Histogram")

# Box plot
ax = axes[1,2]
data_groups = [np.random.normal(m, 1, 50) for m in [0, 1, 2]]
bp = ax.boxplot(data_groups, labels=["G1","G2","G3"], patch_artist=True)
for patch, color in zip(bp['boxes'], ["steelblue","coral","seagreen"]):
    patch.set_facecolor(color)
ax.set_title("Box Plot")

plt.tight_layout()
plt.savefig("plots.png", dpi=150, bbox_inches="tight")
plt.show()
```

## Styling and Customization

```python
# Styling
plt.style.use("seaborn-v0_8-whitegrid")    # apply style
# Other: 'dark_background', 'fivethirtyeight', 'ggplot', 'bmh'

# Custom style context
with plt.style.context("dark_background"):
    plt.plot([1,2,3])

# Colors: named, hex, RGB tuple, colormaps
ax.plot(x, y, color="#2c7bb6")
ax.plot(x, y, color=(0.2, 0.4, 0.8, 0.9))  # RGBA

# Annotations
ax.annotate(
    "Peak",
    xy=(np.pi/2, 1), xycoords="data",           # point to annotate
    xytext=(np.pi, 0.8), textcoords="data",      # text position
    arrowprops=dict(arrowstyle="->", color="red"),
    fontsize=12
)
ax.text(0.05, 0.95, "Note", transform=ax.transAxes,  # axes coordinates
        fontsize=12, verticalalignment="top")

# Ticks
ax.set_xticks([0, np.pi, 2*np.pi])
ax.set_xticklabels(["0", "π", "2π"])
ax.xaxis.set_tick_params(rotation=45)

# Limits
ax.set_xlim(0, 2*np.pi)
ax.set_ylim(-1.2, 1.2)

# Spines
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)

# Fill between
ax.fill_between(x, y1, y2, alpha=0.2, color="steelblue")

# Twin axes (dual y-axis)
ax2 = ax.twinx()
ax2.plot(x, y2*100, color="coral")
ax2.set_ylabel("Scale 2", color="coral")
```

## Interview Questions and Answers

**Q1. What is the difference between `plt.show()` and `fig.savefig()`?**

Answer: `plt.show()` renders the figure to the screen and then clears it — subsequent saves would be empty. `fig.savefig("file.png")` saves to disk without rendering. In production pipelines and Jupyter: always save before show, or use the OO interface (`fig.savefig()`) which doesn't depend on the implicit state. Use `bbox_inches="tight"` to avoid cropped labels.

**Q2. What is the difference between Figure and Axes in Matplotlib?**

Answer: `Figure` is the entire canvas/window — it can contain multiple `Axes` (subplots). `Axes` is an individual plot within the figure — it has its own x-axis, y-axis, title, and data. One `Figure` can have many `Axes` (via `subplots`). The OO API works on `Axes` objects directly (`ax.plot()`, `ax.set_title()`), giving precise control over each subplot.

---

# 7. Seaborn

## What is it?

Seaborn is a high-level statistical visualization library built on Matplotlib. It provides beautiful default styles, tight Pandas integration, automatic aggregation, and built-in statistical plots — with significantly less code than Matplotlib.

## Setup and Themes

### Theory

Seaborn wraps Matplotlib with a DataFrame-native, statistically-aware high-level interface. Rather than passing raw arrays, you pass a DataFrame and column name strings — Seaborn handles grouping, aggregation, colour encoding, faceting, and legend generation automatically.

**Figure-level vs axes-level** is the most important architectural distinction:
- **Axes-level** (`sns.scatterplot`, `sns.boxplot` etc.) return a Matplotlib `Axes`, accept `ax=` parameter, and slot into your own subplot grid. Mix freely with raw Matplotlib code.
- **Figure-level** (`sns.relplot`, `sns.displot`, `sns.catplot`) return a `FacetGrid`, create their own Figure, and support `col=`/`row=` faceting natively. Cannot be placed in an existing axes.

**Statistical capabilities:** `sns.lmplot`/`regplot` fit OLS regression lines with bootstrapped CIs; `errorbar="ci"` computes bootstrapped confidence bands automatically; `kdeplot` estimates kernel density; `ecdfplot` shows the empirical CDF. Seaborn is not just a prettier Matplotlib — it is a statistical visualisation library.

**Colour palette principles:** `husl`/`hls` for categorical data (perceptually uniform hue spacing); `viridis`/`plasma`/`cividis` for sequential data (perceptually uniform, colourblind-friendly); `coolwarm`/`RdBu` for diverging data. Always use colourblind-safe palettes in publications — Seaborn's `colorblind` palette has 6 maximally distinct, accessible colours.

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# Themes
sns.set_theme(style="whitegrid")   # whitegrid, darkgrid, white, dark, ticks
sns.set_palette("husl")            # husl, Set2, deep, muted, bright, dark
sns.set_context("talk")            # paper, notebook, talk, poster (scales font/line sizes)

# Load sample datasets
tips     = sns.load_dataset("tips")
iris     = sns.load_dataset("iris")
titanic  = sns.load_dataset("titanic")
flights  = sns.load_dataset("flights")
diamonds = sns.load_dataset("diamonds")
penguins = sns.load_dataset("penguins")
```

## Relational Plots (scatter, line)

```python
# scatterplot
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

sns.scatterplot(
    data=tips, x="total_bill", y="tip",
    hue="time",       # color by category
    style="smoker",   # marker style by category
    size="size",      # marker size by value
    palette="Set2",
    ax=axes[0]
)
axes[0].set_title("Scatter: Tips Dataset")

# lineplot (with CI)
flights_pivot = flights.pivot(index="month", columns="year", values="passengers")
sns.lineplot(
    data=tips, x="total_bill", y="tip",
    hue="time",
    errorbar="sd",    # show standard deviation band; None, "ci", "sd", "se"
    ax=axes[1]
)
axes[1].set_title("Line Plot")
plt.tight_layout(); plt.show()

# relplot — figure-level with faceting
g = sns.relplot(
    data=tips, x="total_bill", y="tip",
    hue="time", col="smoker", row="sex",
    kind="scatter",
    height=4, aspect=0.8
)
g.set_axis_labels("Total Bill ($)", "Tip ($)")
g.set_titles("{col_name} Smoker | {row_name}")
```

## Distribution Plots

```python
fig, axes = plt.subplots(2, 3, figsize=(16, 10))

# histplot
sns.histplot(tips["total_bill"], kde=True, bins=20,
             color="steelblue", ax=axes[0,0])
axes[0,0].set_title("Histogram + KDE")

# kdeplot
sns.kdeplot(data=tips, x="total_bill", hue="time",
            fill=True, alpha=0.3, ax=axes[0,1])
axes[0,1].set_title("KDE by Time")

# 2D KDE
sns.kdeplot(data=tips, x="total_bill", y="tip",
            fill=True, cmap="Blues", ax=axes[0,2])
axes[0,2].set_title("2D KDE")

# boxplot
sns.boxplot(data=tips, x="day", y="total_bill",
            hue="time", palette="Set3", ax=axes[1,0])
axes[1,0].set_title("Box Plot")

# violinplot
sns.violinplot(data=tips, x="day", y="total_bill",
               hue="sex", split=True,
               inner="quart", palette="Set2", ax=axes[1,1])
axes[1,1].set_title("Violin Plot")

# ecdfplot (empirical CDF)
sns.ecdfplot(data=tips, x="total_bill", hue="time", ax=axes[1,2])
axes[1,2].set_title("ECDF")

plt.tight_layout(); plt.show()
```

## Categorical Plots

```python
fig, axes = plt.subplots(2, 3, figsize=(16, 10))

# barplot (mean + CI)
sns.barplot(data=tips, x="day", y="total_bill",
            hue="sex", palette="Set1",
            capsize=0.1,
            ax=axes[0,0])

# countplot
sns.countplot(data=tips, x="day", hue="sex",
              palette="Set2", ax=axes[0,1])

# pointplot (connected means)
sns.pointplot(data=tips, x="day", y="tip",
              hue="sex", dodge=True,
              markers=["o","s"], linestyles=["-","--"],
              ax=axes[0,2])

# stripplot
sns.stripplot(data=tips, x="day", y="tip",
              hue="sex", dodge=True, alpha=0.5, ax=axes[1,0])

# swarmplot (no overlap)
sns.swarmplot(data=tips, x="day", y="tip",
              hue="sex", dodge=True, size=3, ax=axes[1,1])

# boxenplot (letter-value plot, for large n)
sns.boxenplot(data=diamonds.sample(1000), x="cut", y="price",
              palette="rocket", ax=axes[1,2])

plt.tight_layout(); plt.show()
```

## Matrix Plots (Heatmaps and Clustermap)

```python
# Correlation heatmap
fig, axes = plt.subplots(1, 2, figsize=(16, 6))

corr = tips.select_dtypes("number").corr()
mask = np.triu(np.ones_like(corr, dtype=bool))  # hide upper triangle

sns.heatmap(
    corr, mask=mask,
    annot=True, fmt=".2f",
    cmap="coolwarm", center=0,
    vmin=-1, vmax=1,
    square=True, linewidths=0.5,
    cbar_kws={"shrink": 0.8},
    ax=axes[0]
)
axes[0].set_title("Correlation Heatmap")

# Pivot heatmap (e.g., time series)
flights_pivot = flights.pivot(index="month", columns="year", values="passengers")
sns.heatmap(flights_pivot, annot=True, fmt="d",
            cmap="YlOrRd", ax=axes[1])
axes[1].set_title("Flights Heatmap")
plt.tight_layout(); plt.show()

# Clustermap (hierarchical clustering)
g = sns.clustermap(
    corr, cmap="coolwarm", center=0,
    annot=True, fmt=".2f",
    figsize=(8, 8),
    dendrogram_ratio=0.1
)
```

## Pair and Joint Plots

```python
# pairplot — all pairwise relationships
g = sns.pairplot(
    iris, hue="species",
    diag_kind="kde",       # diagonal: 'hist' or 'kde'
    plot_kws={"alpha": 0.6},
    height=2.5
)
g.fig.suptitle("Iris Pairplot", y=1.02)

# PairGrid — full control
g = sns.PairGrid(iris, hue="species")
g.map_upper(sns.scatterplot, alpha=0.5)
g.map_lower(sns.kdeplot, fill=True, alpha=0.3)
g.map_diag(sns.histplot, kde=True)
g.add_legend()

# jointplot — two variables + marginals
g = sns.jointplot(
    data=tips, x="total_bill", y="tip",
    kind="reg",            # scatter, reg, resid, kde, hex, hist
    hue="time"
)
g.set_axis_labels("Total Bill ($)", "Tip ($)")
g.fig.suptitle("Joint Plot", y=1.02)
```

## FacetGrid

```python
# facetgrid — same plot for subgroups
g = sns.FacetGrid(tips, col="time", row="smoker",
                  height=4, aspect=1.2, margin_titles=True)
g.map_dataframe(sns.scatterplot, x="total_bill", y="tip",
                alpha=0.6, color="steelblue")
g.add_legend()
g.set_axis_labels("Total Bill", "Tip")
g.set_titles(col_template="{col_name}", row_template="{row_name}")
```

## Interview Questions and Answers

**Q1. What is the difference between figure-level and axes-level functions in Seaborn?**

Answer:
- **Axes-level** (`sns.scatterplot()`, `sns.boxplot()`, etc.): Return a Matplotlib `Axes` object, can be placed in a specific `ax`. Can be combined with other Matplotlib code easily.
- **Figure-level** (`sns.relplot()`, `sns.displot()`, `sns.catplot()`, `sns.lmplot()`): Return a `FacetGrid` object and manage the entire figure. Support `col=` and `row=` for faceting. Cannot be placed in an existing `ax`.

Use axes-level in a subplot grid you control. Use figure-level when you want faceting across a variable.

**Q2. When would you choose a violin plot over a box plot?**

Answer: A box plot shows the median, IQR, and outliers but hides the distribution shape. A violin plot shows the full probability density (via KDE), revealing bimodal or skewed distributions that a box plot masks. Use violin when the distribution shape matters (e.g., comparing bimodal salary distributions). Use box plot for clean outlier visibility and simpler reading. For large samples, `boxenplot` (letter-value plot) is a good middle ground.

**Q3. How do you create a heatmap from a DataFrame in Seaborn?**

Answer:
```python
# Correlation heatmap
corr = df.corr()
sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm", center=0)

# Pivot table heatmap
pivot = df.pivot_table(values="sales", index="month", columns="region", aggfunc="sum")
sns.heatmap(pivot, annot=True, fmt=",.0f", cmap="Blues")
```
Key params: `annot=True` adds numbers, `fmt` controls number format, `cmap` sets colormap, `center=0` centers diverging colormaps, `mask` hides parts (e.g., upper triangle of correlation matrix).

---

# 8. FastAPI

## What is it?

FastAPI is a modern, high-performance Python web framework for building APIs with Python type hints. Built on Starlette (ASGI) and Pydantic. Provides automatic OpenAPI/Swagger docs, async support, data validation, and serialization out of the box.

## Core Concepts

### Theory

FastAPI is built on two foundations: **Starlette** (ASGI async framework) and **Pydantic** (data validation via type hints). Understanding both is key.

**ASGI (Asynchronous Server Gateway Interface)** is the successor to WSGI. Where WSGI is synchronous (one request blocks a thread), ASGI supports async I/O — a single worker handles thousands of concurrent connections by suspending at `await` points and resuming when data arrives. This makes FastAPI ideal for ML serving where a single request involves model inference (CPU), database lookup (I/O), and feature store query (I/O) concurrently.

**Pydantic V2** (FastAPI 0.100+) compiles validation to Rust, making it 5–50× faster than V1. On each request, FastAPI uses Pydantic to: parse raw JSON/form data, coerce types (`"42"` → `int`), validate constraints, and run custom validators. Invalid data returns a 422 response with field-level error detail — zero boilerplate.

**Dependency Injection via `Depends()`** is architecturally superior to Flask's `g`: dependencies are cached within a request, support `yield` for cleanup, can be nested, and can be overridden in tests with `app.dependency_overrides`. A `Depends(get_db)` ensures the DB session is opened once per request and always closed — even on exceptions.

**Automatic OpenAPI docs:** FastAPI generates a full OpenAPI 3.0 schema from route definitions, Pydantic models, and type hints. This powers Swagger UI (`/docs`) and ReDoc (`/redoc`) — zero configuration, always in sync with the code.

```python
from fastapi import FastAPI, HTTPException, Depends, Query, Path, Body, Header, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator, EmailStr
from typing import Optional, List
import uvicorn

app = FastAPI(
    title="JioAds ML API",
    description="CTR Prediction and Inventory Ranking API",
    version="1.0.0"
)

# ─── Pydantic Models ───────────────────────────────────────────────
class AdFeatures(BaseModel):
    ad_id:        int     = Field(..., gt=0, description="Ad ID")
    campaign_id:  int     = Field(..., gt=0)
    placement:    str     = Field(..., min_length=1, max_length=100)
    bid_price:    float   = Field(..., gt=0, le=1000.0)
    hour_of_day:  int     = Field(..., ge=0, le=23)
    day_of_week:  int     = Field(..., ge=0, le=6)
    user_segment: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "ad_id": 1001, "campaign_id": 5, "placement": "banner_top",
                "bid_price": 2.5, "hour_of_day": 14, "day_of_week": 1
            }
        }

class CTRPrediction(BaseModel):
    ad_id:      int
    ctr:        float = Field(..., ge=0, le=1)
    confidence: float
    model_version: str

class BulkRequest(BaseModel):
    ads: List[AdFeatures]
    top_k: int = Field(default=10, ge=1, le=100)

# ─── Path & Query Parameters ───────────────────────────────────────
@app.get("/ads/{ad_id}", response_model=CTRPrediction, tags=["Prediction"])
async def get_ctr(
    ad_id: int = Path(..., gt=0, description="The ad ID"),
    include_features: bool = Query(default=False, description="Return features"),
    api_key: str = Header(..., alias="X-API-Key")
):
    """Predict CTR for a single ad."""
    if api_key != "secret-key":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key")
    # ... model inference
    return CTRPrediction(ad_id=ad_id, ctr=0.045, confidence=0.92, model_version="v2.1")

@app.post("/predict", response_model=CTRPrediction, status_code=status.HTTP_200_OK, tags=["Prediction"])
async def predict_ctr(features: AdFeatures):
    """Predict CTR for given ad features."""
    # Validation handled by Pydantic automatically
    ctr = model.predict([features.dict()])
    return CTRPrediction(ad_id=features.ad_id, ctr=float(ctr), confidence=0.9, model_version="v2.1")

@app.post("/rank", response_model=List[CTRPrediction], tags=["Ranking"])
async def rank_ads(request: BulkRequest):
    """Rank multiple ads by predicted CTR."""
    predictions = [
        CTRPrediction(ad_id=ad.ad_id, ctr=float(i/100), confidence=0.9, model_version="v2")
        for i, ad in enumerate(request.ads)
    ]
    return sorted(predictions, key=lambda x: x.ctr, reverse=True)[:request.top_k]
```

## Dependency Injection

```python
from fastapi import Depends
from sqlalchemy.orm import Session
import redis

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Redis dependency
def get_redis():
    r = redis.Redis(host="localhost", port=6379)
    return r

# Auth dependency
def verify_token(token: str = Header(..., alias="Authorization")):
    if not token.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")
    token = token.replace("Bearer ", "")
    payload = decode_jwt(token)  # your JWT decode logic
    return payload

# Nested dependencies
def get_current_user(
    db: Session = Depends(get_db),
    payload: dict = Depends(verify_token)
):
    user = db.query(User).filter(User.id == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Use in endpoint
@app.get("/me")
async def get_me(current_user = Depends(get_current_user)):
    return {"user": current_user.email}
```

## Background Tasks, Middleware, and Events

```python
from fastapi import BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

logger = logging.getLogger(__name__)

# Background task (fire-and-forget)
def log_prediction(ad_id: int, ctr: float):
    logger.info(f"Prediction: ad={ad_id}, ctr={ctr:.4f}")
    # write to DB, emit metric, etc.

@app.post("/predict_with_logging")
async def predict_with_logging(
    features: AdFeatures,
    background_tasks: BackgroundTasks
):
    ctr = 0.045
    background_tasks.add_task(log_prediction, features.ad_id, ctr)
    return {"ad_id": features.ad_id, "ctr": ctr}

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://jioadvertising.com", "http://localhost:3000"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Custom Middleware
from starlette.middleware.base import BaseHTTPMiddleware
import time

class TimingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        start = time.perf_counter()
        response = await call_next(request)
        elapsed = time.perf_counter() - start
        response.headers["X-Process-Time"] = f"{elapsed:.4f}"
        return response

app.add_middleware(TimingMiddleware)

# Startup / shutdown events (lifespan)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Loading ML model...")
    app.state.model = load_model("model.pkl")
    app.state.redis = redis.Redis(host="localhost")
    yield
    # Shutdown
    logger.info("Shutting down...")
    app.state.redis.close()

app = FastAPI(lifespan=lifespan)
```

## Pydantic Validation

### Theory

**Pydantic** is a data validation and settings management library that uses Python type annotations as the schema definition. When you define a `BaseModel` subclass, Pydantic V2 compiles a Rust-based validator for that model at class creation time — making validation 5–50× faster than pure Python.

**Validation pipeline for each incoming request:**
1. **Parsing** — raw JSON bytes → Python dict
2. **Type coercion** — `"42"` → `int`, `"2024-01-15"` → `datetime`, etc.
3. **Constraint validation** — `Field(gt=0)`, `min_length`, `max_length` etc.
4. **Custom validators** — `@field_validator` (single field), `@model_validator` (cross-field)
5. **Error aggregation** — all validation errors collected and returned as a single 422 response

`Field(...)` (ellipsis) marks a field as required. `Field(default=None)` makes it optional. `Field(default_factory=list)` for mutable defaults. The `alias` parameter maps a different JSON key name to the Python field name.

`model_config = ConfigDict(from_attributes=True)` enables creating a Pydantic model from an ORM object (SQLAlchemy row → Pydantic model) — essential for the repository pattern in FastAPI.

For ML serving: define separate `RequestModel` and `ResponseModel` Pydantic models — request validation catches bad inputs before they reach the model, and response validation ensures the model output conforms to the API contract.

```python
from pydantic import BaseModel, Field, field_validator, model_validator, EmailStr
from typing import Optional
from datetime import date

class UserCreate(BaseModel):
    name:        str      = Field(..., min_length=2, max_length=100)
    email:       EmailStr
    age:         int      = Field(..., ge=18, le=120)
    salary:      float    = Field(..., gt=0)
    start_date:  date
    department:  str

    # Field validator
    @field_validator("name")
    @classmethod
    def name_must_be_alpha(cls, v):
        if not v.replace(" ", "").isalpha():
            raise ValueError("Name must contain only letters")
        return v.strip().title()

    # Model validator (multiple fields)
    @model_validator(mode="after")
    def check_salary_vs_dept(self):
        if self.department == "Intern" and self.salary > 50000:
            raise ValueError("Interns cannot earn > 50,000")
        return self

    # Response model (output serialization)
    class Config:
        from_attributes = True    # allow ORM model → Pydantic

# Nested models
class Address(BaseModel):
    street: str
    city:   str
    pincode: str

class Employee(BaseModel):
    id:      int
    name:    str
    address: Address            # nested model
    skills:  List[str] = []
    metadata: dict = {}
```

## Async Database and Caching

```python
import asyncio
from databases import Database
import aioredis

DATABASE_URL = "postgresql+asyncpg://user:pass@localhost/db"
database = Database(DATABASE_URL)

@app.get("/campaigns/{campaign_id}")
async def get_campaign(campaign_id: int, redis = Depends(get_redis)):
    # Check cache first
    cached = await redis.get(f"campaign:{campaign_id}")
    if cached:
        return json.loads(cached)

    # Query DB asynchronously
    query = "SELECT * FROM campaigns WHERE id = :id"
    row = await database.fetch_one(query=query, values={"id": campaign_id})
    if not row:
        raise HTTPException(status_code=404, detail="Campaign not found")

    result = dict(row)
    # Cache for 5 minutes
    await redis.setex(f"campaign:{campaign_id}", 300, json.dumps(result))
    return result
```

## Testing FastAPI

```python
from fastapi.testclient import TestClient
import pytest

client = TestClient(app)

def test_predict_ctr():
    response = client.post(
        "/predict",
        json={"ad_id": 1001, "campaign_id": 5, "placement": "banner",
              "bid_price": 2.5, "hour_of_day": 14, "day_of_week": 1},
        headers={"X-API-Key": "secret-key"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "ctr" in data
    assert 0 <= data["ctr"] <= 1

def test_invalid_ad_id():
    response = client.get("/ads/-1", headers={"X-API-Key": "secret-key"})
    assert response.status_code == 422  # validation error

@pytest.fixture
def auth_client():
    client.headers.update({"X-API-Key": "secret-key"})
    return client
```

## Interview Questions and Answers

**Q1. What is the difference between FastAPI and Flask?**

Answer:
| Feature | FastAPI | Flask |
|---|---|---|
| Performance | Very fast (ASGI/async) | Moderate (WSGI/sync) |
| Async support | Native async/await | Limited (via extensions) |
| Type hints | Built-in, required | Optional |
| Validation | Pydantic (automatic) | Manual or via extensions |
| API docs | Auto Swagger/ReDoc | Manual |
| Learning curve | Moderate | Gentle |
| Ecosystem | Newer, smaller | Mature, large |

Use FastAPI for: new ML APIs, high-performance async APIs, strict type safety. Use Flask for: simple apps, legacy integrations, when team knows Flask well.

**Q2. What is dependency injection in FastAPI?**

Answer: `Depends()` lets you declare dependencies that FastAPI resolves and injects into route handlers automatically. Dependencies can themselves depend on other dependencies (nested). Benefits: code reuse (auth, DB sessions, caching), testability (override deps in tests), clean separation of concerns. Example: `Depends(get_db)` ensures a DB session is always properly opened and closed without repeating the logic in every endpoint.

**Q3. How does Pydantic validation work in FastAPI?**

Answer: When a request arrives, FastAPI uses Pydantic to: (1) parse the raw JSON body into the model's fields, (2) validate each field against its type annotation and `Field()` constraints, (3) run custom validators (`@field_validator`, `@model_validator`). If validation fails, FastAPI automatically returns a 422 Unprocessable Entity response with detailed error messages — no manual validation code needed. Output models are similarly serialized automatically.

---

# 9. Flask

## What is it?

Flask is a lightweight, flexible Python web framework ("micro-framework"). Minimal core, extensible via plugins (Flask-SQLAlchemy, Flask-Login, Flask-JWT, etc.). WSGI-based, synchronous, with a simple and intuitive API.

## Core Application

### Theory

Flask is a **micro-framework** built on **Werkzeug** (WSGI toolkit) and **Jinja2** (templating). It provides routing, request/response handling, session management, and template rendering — everything else (ORM, auth, validation, migrations) is left to extensions. This philosophy maximises flexibility at the cost of having to assemble the stack yourself.

**WSGI** (Web Server Gateway Interface, PEP 3333) is the synchronous Python web standard — the server calls `app(environ, start_response)` for each request, which blocks until the response is complete. Simplicity makes it easy to reason about, but limits scalability for I/O-heavy async workloads compared to ASGI frameworks like FastAPI.

**Application context vs Request context:**
- **Request context** (`request`, `session`, `g`) is pushed at the start of each HTTP request and popped at the end. `g` is a per-request scratch space for shared resources (loaded user, DB session). Thread-local by default.
- **Application context** (`current_app`, `g`) can be pushed manually in CLI commands and background tasks via `with app.app_context()`.

**Blueprints** are the modular architecture pattern — each Blueprint groups routes, templates, and static files with a URL prefix. Large Flask applications must use Blueprints to avoid a monolithic `app.py` and to enable per-feature development in teams.

**When to choose Flask in 2025:** legacy codebases, server-rendered HTML apps (Jinja2 templates), teams with deep Flask expertise, simple CRUD APIs where FastAPI's overhead isn't justified. For new ML-serving APIs, API-first microservices, or high-concurrency endpoints — FastAPI is generally the better choice.

```python
from flask import (
    Flask, request, jsonify, abort, g, current_app,
    render_template, redirect, url_for, session
)
from functools import wraps
import logging

app = Flask(__name__)
app.config.update(
    SECRET_KEY="your-secret-key",
    DEBUG=False,
    SQLALCHEMY_DATABASE_URI="postgresql://user:pass@localhost/db",
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
    JWT_SECRET_KEY="jwt-secret"
)

# ─── Routes ───────────────────────────────────────────────────────
@app.route("/")
def index():
    return jsonify({"status": "ok", "service": "JioAds API"})

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    if not data or "features" not in data:
        abort(400, description="Missing 'features' in request body")

    features = data["features"]
    ctr = model.predict([features])[0]
    return jsonify({"ctr": float(ctr), "version": "v2"}), 200

@app.route("/campaigns/<int:campaign_id>", methods=["GET"])
def get_campaign(campaign_id):
    campaign = Campaign.query.get_or_404(campaign_id)
    return jsonify(campaign.to_dict())

@app.route("/campaigns", methods=["GET"])
def list_campaigns():
    page     = request.args.get("page",     1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    status   = request.args.get("status",   None)

    query = Campaign.query
    if status:
        query = query.filter_by(status=status)
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "items": [c.to_dict() for c in paginated.items],
        "total": paginated.total,
        "pages": paginated.pages,
        "page":  page
    })
```

## Blueprints

### Theory

A **Blueprint** is a blueprint for a section of an application — a collection of routes, error handlers, template filters, and static files that can be registered on the Flask app with an optional URL prefix. Blueprints are created independently and registered later, enabling:

**Modular architecture:** Separate `ads`, `campaigns`, `users`, `analytics` into different Python files. Each team owns its Blueprint and can develop, test, and deploy independently.

**URL namespacing:** `url_prefix="/api/v1/ads"` ensures all routes in the ads Blueprint are under that prefix without repeating it in every `@route`. `url_for("ads.list_ads")` generates URLs using the Blueprint name as a namespace, preventing collisions.

**Per-Blueprint resources:** Blueprints can have their own `before_request`, `after_request`, `errorhandler`, template folder, and static folder — enabling feature-specific middleware without polluting the global app.

**Flask Application Factory pattern** (best practice): define `create_app(config)` that creates the `Flask` app, registers Blueprints, initialises extensions, and returns the app. This enables: multiple app instances with different configs (test vs production), avoiding circular imports between modules, and clean app lifecycle management.

```python
def create_app(config="production"):
    app = Flask(__name__)
    app.config.from_object(configs[config])
    db.init_app(app)
    app.register_blueprint(ads_bp)
    app.register_blueprint(campaigns_bp)
    return app
```

```python
from flask import Blueprint

# ads_bp.py
ads_bp = Blueprint("ads", __name__, url_prefix="/api/v1/ads")

@ads_bp.route("/", methods=["GET"])
def list_ads():
    return jsonify({"ads": []})

@ads_bp.route("/<int:ad_id>", methods=["GET", "PUT", "DELETE"])
def ad_detail(ad_id):
    if request.method == "GET":
        return jsonify({"ad_id": ad_id})
    elif request.method == "PUT":
        data = request.get_json()
        # update logic
        return jsonify({"updated": ad_id})
    elif request.method == "DELETE":
        # delete logic
        return "", 204

# main app
from ads_bp import ads_bp
from campaigns_bp import campaigns_bp

app.register_blueprint(ads_bp)
app.register_blueprint(campaigns_bp)
```

## Request Hooks and Error Handlers

```python
# Before/After request hooks
@app.before_request
def load_user():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if token:
        g.user = verify_token(token)   # g is per-request global
    else:
        g.user = None

@app.after_request
def add_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    return response

@app.teardown_appcontext
def close_db(exc):
    db = g.pop("db", None)
    if db is not None:
        db.close()

# Error handlers
@app.errorhandler(400)
def bad_request(e):
    return jsonify({"error": "Bad Request", "message": str(e)}), 400

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not Found"}), 404

@app.errorhandler(500)
def server_error(e):
    app.logger.error(f"Server error: {e}")
    return jsonify({"error": "Internal Server Error"}), 500

# Custom exception
class ValidationError(Exception):
    def __init__(self, message, status_code=422):
        self.message = message
        self.status_code = status_code

@app.errorhandler(ValidationError)
def handle_validation_error(e):
    return jsonify({"error": e.message}), e.status_code
```

## Decorators (Auth, Rate Limiting)

```python
from functools import wraps
from flask import request, jsonify

# Auth decorator
def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization", "")
        if not token.startswith("Bearer "):
            return jsonify({"error": "Missing token"}), 401
        try:
            payload = verify_jwt(token.replace("Bearer ", ""))
            g.user_id = payload["sub"]
        except Exception:
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)
    return decorated

# Role-based decorator
def require_role(role):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if not hasattr(g, "user") or g.user.role != role:
                return jsonify({"error": "Forbidden"}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator

@app.route("/admin/stats")
@require_auth
@require_role("admin")
def admin_stats():
    return jsonify({"users": 1000, "ads": 50000})
```

## Flask with SQLAlchemy

```python
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy(app)

class Campaign(db.Model):
    __tablename__ = "campaigns"

    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(200), nullable=False)
    budget      = db.Column(db.Numeric(12, 2))
    status      = db.Column(db.String(20), default="active")
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)
    ads         = db.relationship("Ad", backref="campaign", lazy="dynamic")

    def to_dict(self):
        return {
            "id": self.id, "name": self.name,
            "budget": float(self.budget), "status": self.status
        }

class Ad(db.Model):
    __tablename__ = "ads"
    id          = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey("campaigns.id"))
    placement   = db.Column(db.String(100))
    ctr         = db.Column(db.Float)

# CRUD operations
def create_campaign(name, budget):
    campaign = Campaign(name=name, budget=budget)
    db.session.add(campaign)
    db.session.commit()
    return campaign

def get_campaigns(page=1, per_page=20, status=None):
    q = Campaign.query
    if status:
        q = q.filter_by(status=status)
    return q.paginate(page=page, per_page=per_page)
```

## Interview Questions and Answers

**Q1. What is the difference between `request.args`, `request.form`, and `request.get_json()`?**

Answer:
- `request.args`: URL query parameters (e.g., `/search?q=python&page=2`). Returns an ImmutableMultiDict.
- `request.form`: Form data from HTML forms (Content-Type: application/x-www-form-urlencoded or multipart/form-data).
- `request.get_json()`: Parses JSON body (Content-Type: application/json). Returns None if content-type wrong or JSON invalid; use `force=True` to ignore content-type.

**Q2. What is Flask's application context vs request context?**

Answer:
- **Application context** (`g`, `current_app`): Exists for the duration of a request or CLI command. `g` is a per-request storage for arbitrary data. `current_app` proxies to the running Flask app.
- **Request context** (`request`, `session`): Exists for a single HTTP request. `request` holds request data; `session` is a signed cookie-based store.

`push()` both contexts manually in tests/scripts; `with app.app_context()` and `with app.test_request_context()`.

**Q3. What is a Flask Blueprint and why use it?**

Answer: Blueprint is a way to organize routes and handlers into logical modules, then register them on the app. Benefits: modular architecture (separate ads, campaigns, users into different files), reusable components, URL prefixing, per-blueprint error handlers. Essential for large Flask applications to avoid a single monolithic `app.py`.

---

# 10. Scenario-Based Questions

**Q1. You have a Pandas DataFrame with 10M rows. `df.apply()` is too slow. How do you speed it up?**

Answer:
```python
# Instead of:
df["result"] = df["col"].apply(lambda x: x * 2 + 1)          # slow Python loop

# Use vectorized NumPy/Pandas:
df["result"] = df["col"] * 2 + 1                              # fast

# For complex logic, use np.where / np.select:
df["band"] = np.where(df["salary"] > 100000, "High", "Normal")

conditions = [df["salary"] > 100000, df["salary"] > 70000]
choices    = ["High", "Mid"]
df["band"] = np.select(conditions, choices, default="Low")

# Use pandas str methods instead of apply(lambda):
df["clean"] = df["name"].str.lower().str.strip()

# If must use apply, use Swifter or Pandarallel for parallelism:
import swifter
df["result"] = df["col"].swifter.apply(complex_fn)
```

**Q2. How do you handle class imbalance in scikit-learn?**

Answer:
```python
# 1. class_weight='balanced' in the estimator
clf = RandomForestClassifier(class_weight="balanced")
clf = LogisticRegression(class_weight={0: 1, 1: 10})

# 2. Resampling with imbalanced-learn
from imblearn.over_sampling  import SMOTE
from imblearn.under_sampling import RandomUnderSampler
from imblearn.pipeline       import Pipeline as ImbPipeline

pipeline = ImbPipeline([
    ("sampler", SMOTE(random_state=42)),
    ("clf",     RandomForestClassifier())
])

# 3. Use appropriate metric (not accuracy)
from sklearn.metrics import f1_score, roc_auc_score, average_precision_score
score = average_precision_score(y_test, y_prob)   # AUC-PR

# 4. Adjust decision threshold
threshold = 0.3   # lower threshold → more positives detected
y_pred = (y_prob >= threshold).astype(int)
```

**Q3. You need to expose an ML model as a REST API that handles 1000 requests/second. How do you design it with FastAPI?**

Answer:
1. **Async endpoints** — use `async def` with async model inference
2. **Model in app state** — load once at startup, not per request
3. **Batch prediction** — accept arrays, predict in batch (10x faster than one-by-one)
4. **Redis caching** — cache frequent ad_id predictions
5. **Feature preprocessing** — use pre-fitted scalers saved alongside model
6. **Multiple workers** — `uvicorn app:app --workers 4`
7. **Connection pooling** — for DB dependencies
8. **Pydantic validation** — reject malformed requests before model inference

**Q4. Explain the difference between pickling a model with `pickle` vs `joblib`.**

Answer:
- `pickle`: Standard Python serialization. Works but slower for large NumPy arrays, not optimized for scientific objects.
- `joblib`: Optimized for NumPy arrays (uses memory mapping, compression). Faster and smaller files for sklearn models. Use `joblib.dump(model, "model.pkl")` / `joblib.load("model.pkl")`.
- For production: also consider `mlflow.sklearn.save_model()` (includes metadata, environment) or ONNX for cross-platform serving.

**Q5. How do you implement a feature that prevents a Flask/FastAPI endpoint from being called more than 100 times/minute per IP?**

Answer:
```python
# Flask: use Flask-Limiter
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(app=app, key_func=get_remote_address, default_limits=["200/day", "50/hour"])

@app.route("/predict")
@limiter.limit("100/minute")
def predict(): ...

# FastAPI: use slowapi
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/predict")
@limiter.limit("100/minute")
async def predict(request: Request, features: AdFeatures): ...
```

---

# 11. Coding Questions

## 1. Flatten a Nested Dictionary

```python
def flatten_dict(d: dict, parent_key: str = "", sep: str = ".") -> dict:
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key, sep).items())
        else:
            items.append((new_key, v))
    return dict(items)

d = {"a": 1, "b": {"c": 2, "d": {"e": 3}}}
print(flatten_dict(d))   # {"a":1, "b.c":2, "b.d.e":3}
```

## 2. LRU Cache Implementation

```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)   # mark as recently used
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)   # remove LRU (front)

lru = LRUCache(2)
lru.put(1, 1); lru.put(2, 2)
print(lru.get(1))   # 1
lru.put(3, 3)       # evicts key 2
print(lru.get(2))   # -1 (evicted)
```

## 3. Singleton Pattern

```python
class Singleton:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, value):
        # Only init once
        if not hasattr(self, "_initialized"):
            self.value = value
            self._initialized = True

s1 = Singleton(42)
s2 = Singleton(99)
print(s1 is s2)        # True
print(s1.value)        # 42 (not 99)
```

## 4. Custom Iterator (Infinite Fibonacci)

```python
class FibonacciIterator:
    def __init__(self, max_count: int = None):
        self.a, self.b = 0, 1
        self.max_count = max_count
        self.count = 0

    def __iter__(self): return self

    def __next__(self):
        if self.max_count and self.count >= self.max_count:
            raise StopIteration
        val = self.a
        self.a, self.b = self.b, self.a + self.b
        self.count += 1
        return val

print(list(FibonacciIterator(10)))  # [0,1,1,2,3,5,8,13,21,34]
```

## 5. Decorator: Rate Limiter

```python
import time
from collections import deque
from functools import wraps

def rate_limit(calls: int, period: float):
    """Allow at most `calls` per `period` seconds."""
    def decorator(fn):
        timestamps = deque()

        @wraps(fn)
        def wrapper(*args, **kwargs):
            now = time.monotonic()
            # Remove timestamps outside the window
            while timestamps and now - timestamps[0] > period:
                timestamps.popleft()
            if len(timestamps) >= calls:
                wait = period - (now - timestamps[0])
                raise RuntimeError(f"Rate limit exceeded. Retry in {wait:.2f}s")
            timestamps.append(now)
            return fn(*args, **kwargs)
        return wrapper
    return decorator

@rate_limit(calls=3, period=1.0)
def api_call():
    return "ok"
```

## 6. Thread-Safe Counter

```python
import threading

class AtomicCounter:
    def __init__(self, initial=0):
        self._value = initial
        self._lock = threading.Lock()

    def increment(self, delta=1):
        with self._lock:
            self._value += delta
            return self._value

    @property
    def value(self):
        with self._lock:
            return self._value

counter = AtomicCounter()
threads = [threading.Thread(target=lambda: [counter.increment() for _ in range(1000)])
           for _ in range(10)]
[t.start() for t in threads]
[t.join()  for t in threads]
print(counter.value)   # always 10000
```

## 7. Pandas: Feature Engineering Pipeline

```python
import pandas as pd
import numpy as np

def build_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    # Time features
    df["hour"]       = df["event_time"].dt.hour
    df["day_of_week"]= df["event_time"].dt.dayofweek
    df["is_weekend"] = (df["day_of_week"] >= 5).astype(int)

    # Historical CTR (no data leakage: shift by 1)
    df = df.sort_values(["campaign_id","event_time"])
    df["hist_impressions"] = df.groupby("campaign_id")["impression"].transform(
        lambda x: x.shift(1).expanding().sum()
    )
    df["hist_clicks"] = df.groupby("campaign_id")["click"].transform(
        lambda x: x.shift(1).expanding().sum()
    )
    df["hist_ctr"] = df["hist_clicks"] / (df["hist_impressions"] + 1)

    # Log-transform skewed features
    df["log_bid"] = np.log1p(df["bid_price"])

    # Binning
    df["bid_bin"] = pd.qcut(df["bid_price"], q=5, labels=False, duplicates="drop")

    return df.fillna(0)
```

## 8. NumPy: Vectorized Distance Matrix

```python
import numpy as np

def pairwise_euclidean(X: np.ndarray) -> np.ndarray:
    """
    Compute pairwise Euclidean distances without loops.
    ||a - b||² = ||a||² + ||b||² - 2 a·b
    """
    sq_norms = np.sum(X ** 2, axis=1, keepdims=True)
    dist_sq  = sq_norms + sq_norms.T - 2 * X @ X.T
    dist_sq  = np.maximum(dist_sq, 0)   # numerical stability
    return np.sqrt(dist_sq)

X = np.random.randn(100, 10)
D = pairwise_euclidean(X)   # shape (100, 100), no Python loops
```

## 9. Generator Pipeline for Large Files

```python
def read_csv_rows(path):
    with open(path) as f:
        header = f.readline().strip().split(",")
        for line in f:
            yield dict(zip(header, line.strip().split(",")))

def filter_rows(rows, key, value):
    for row in rows:
        if row.get(key) == value:
            yield row

def transform_rows(rows):
    for row in rows:
        row["salary"] = float(row.get("salary", 0))
        row["salary_monthly"] = row["salary"] / 12
        yield row

# Compose pipeline (lazy — no memory overhead)
pipeline = transform_rows(filter_rows(read_csv_rows("employees.csv"), "dept", "Eng"))
for row in pipeline:
    print(row)
```

---

# 12. Python Interview Cheat Sheet

## OOP Quick Reference

```
Pillars: Encapsulation · Inheritance · Polymorphism · Abstraction

class Foo(Base):
    class_var = 0                    # shared by all instances
    def __init__(self, x): self.x=x # instance var
    def method(self): ...            # instance method (self)
    @classmethod
    def class_m(cls): ...            # class method (cls)
    @staticmethod
    def static_m(): ...              # no self/cls
    @property
    def prop(self): return self.x    # getter
    @prop.setter
    def prop(self, v): self.x=v      # setter
    def __repr__(self): ...          # repr()
    def __str__(self):  ...          # str(), print()
    def __eq__(self,o): ...          # == operator
    def __hash__(self): ...          # for dict keys, sets
    def __enter__(self): return self # with statement
    def __exit__(self,*a): ...

# Dunder methods: __add__ __sub__ __mul__ __len__ __iter__
#                 __next__ __contains__ __getitem__ __call__

# Inheritance
class Child(Parent): super().__init__(...)
# Multiple: class C(A, B) — MRO: C→A→B→object
# ABCs: from abc import ABC, abstractmethod

# Dataclass
@dataclass
class Point: x: float; y: float

# Slots (memory efficient)
class S: __slots__ = ('x','y')

# Metaclass
class Meta(type): ...
class MyClass(metaclass=Meta): ...
```

## Advanced Python Quick Reference

```
# Generator
def gen(): yield value
(expr for x in iterable)
next(g), send(val), throw(exc), close()

# Decorator
def dec(fn):
    @functools.wraps(fn)
    def wrapper(*a,**kw): ... return fn(*a,**kw)
    return wrapper

# Context manager
@contextmanager
def cm(): ...; yield resource; ...

# Comprehensions
[x for x in it if cond]          # list
{k:v for k,v in d.items()}       # dict
{x for x in it}                  # set
(x for x in it)                  # generator

# Type hints
x: int | None                    # Python 3.10+
x: Optional[int]                 # Python 3.9-
x: list[int]                     # Python 3.9+
x: Callable[[int], str]
T = TypeVar('T')

# Concurrency
ThreadPoolExecutor   → I/O bound
ProcessPoolExecutor  → CPU bound
asyncio              → I/O bound, single thread
# GIL: only one Python thread executes at a time

# Useful builtins
map(fn, it)     filter(fn, it)   zip(a,b)   enumerate(it)
sorted(it, key=fn, reverse=True)   any(it)   all(it)
functools.reduce   functools.partial   functools.lru_cache
itertools.chain  islice  groupby  combinations  permutations
collections.Counter  defaultdict  deque  namedtuple  OrderedDict
```

## NumPy Quick Reference

```python
np.array([[1,2],[3,4]])    # ndarray
a.shape, a.dtype, a.ndim, a.size, a.nbytes

# Create
np.zeros/ones/full/eye/empty(shape)
np.arange(start, stop, step)
np.linspace(start, stop, num)
rng = np.random.default_rng(42); rng.random/integers/normal()

# Index/Slice
a[0], a[1,2], a[:, 1], a[::2], a[a>5]

# Reshape
a.reshape(-1, 4)    a.flatten()    a.ravel()    a.T
np.concatenate / vstack / hstack / stack
np.split / hsplit / vsplit

# Math (all element-wise, return ndarray)
np.sqrt/exp/log/abs/sin/cos + - * /
np.maximum/minimum/clip

# Aggregation (axis=0→cols, axis=1→rows)
a.sum/min/max/mean/std/var(axis=N)
np.argmax/argmin/argsort

# Linear Algebra
A @ B            # matrix multiply
np.linalg.inv/det/eig/svd/solve

# Broadcasting: right-align shapes, stretch size-1 dims
(2,3) + (3,) → (2,3) + (1,3) → (2,3)

# View vs Copy
a[1:3]           → VIEW (changes propagate)
a[a>5]           → COPY (boolean/fancy indexing)
a.copy()         → explicit copy
```

## Pandas Quick Reference

```python
pd.read_csv/parquet/json/excel/sql(...)
df.head/tail/info/describe/shape/dtypes

# Select
df["col"]              # Series
df[["a","b"]]          # DataFrame
df.loc[row_label, col_label]      # label-based
df.iloc[row_int, col_int]         # position-based
df[df.col > 5]         # boolean filter
df.query("col > 5 and dept == 'Eng'")

# Transform
df["new"] = df["a"] * 2
df.assign(x=lambda d: d.a+1)
df.apply(fn, axis=1)               # row-wise
df["col"].map({1:"a",2:"b"})       # value mapping
df.rename(columns={"old":"new"})
df.drop(columns=["x","y"])

# Clean
df.dropna(subset=["col"])
df.fillna({"a":0, "b":"unknown"})
df.drop_duplicates(subset=["id"])
df["col"].astype("category")

# Groupby
df.groupby("dept").agg(n=("id","count"), avg=("sal","mean"))
df.groupby("dept")["sal"].transform("mean")  # broadcast
df.groupby("dept").filter(lambda g: len(g)>5)

# Window
df["sal"].rolling(3).mean()
df["sal"].expanding().sum()
df["sal"].shift(1)    # lag
df["sal"].diff(1)     # period difference

# Merge/Join
pd.merge(df1, df2, on="key", how="left")
pd.concat([df1,df2], axis=0)

# DateTime
df["dt"].dt.year/month/day/hour/dayofweek
df.set_index("dt").resample("ME").sum()

# Performance
usecols=["a","b"]          # read only needed cols
dtype={"id":"int32"}       # specify dtypes
astype("category")         # low-cardinality strings
vectorized ops > apply()   # always prefer vectorization
```

## Scikit-learn Quick Reference

```
Pipeline([("scaler", StandardScaler()), ("clf", RFC())])
ColumnTransformer([("num", pipe, num_cols), ("cat", pipe, cat_cols)])

# Preprocessing
StandardScaler / MinMaxScaler / RobustScaler
LabelEncoder (target) / OrdinalEncoder / OneHotEncoder (features)
SimpleImputer(strategy="median"/"most_frequent"/"constant")
PolynomialFeatures

# Models
LogisticRegression(C=1.0)          # classification
RandomForestClassifier/Regressor(n_estimators=100, max_depth=None)
GradientBoostingClassifier/Regressor
SVC/SVR(kernel="rbf", C=1, gamma="scale")
KNeighborsClassifier(n_neighbors=5)
LinearRegression / Ridge / Lasso / ElasticNet
KMeans(n_clusters=K) / DBSCAN(eps=0.5)
PCA(n_components=0.95) / TSNE(n_components=2)

# Evaluation
train_test_split(X, y, test_size=0.2, stratify=y)
cross_val_score(clf, X, y, cv=5, scoring="roc_auc")
GridSearchCV / RandomizedSearchCV

# Metrics
accuracy_score / precision_score / recall_score / f1_score
roc_auc_score / average_precision_score (imbalanced)
confusion_matrix / classification_report
r2_score / mean_squared_error / mean_absolute_error

# Key rules
1. fit() only on training data (avoid leakage)
2. Always use Pipeline to prevent leakage in CV
3. For imbalanced: use class_weight="balanced" or SMOTE
4. Prefer AUC-PR over ROC-AUC for imbalanced
```

## FastAPI Quick Reference

```python
@app.get/post/put/delete("/path/{id}")
async def endpoint(
    id:    int     = Path(..., gt=0),
    q:     str     = Query(None),
    body:  Model   = Body(...),
    token: str     = Header(...),
    db           = Depends(get_db)
): ...

# Pydantic Model
class M(BaseModel):
    x: int = Field(..., gt=0)
    y: Optional[str] = None
    @field_validator("x") ...
    @model_validator(mode="after") ...

# Response
return JSONResponse(content={}, status_code=200)
raise HTTPException(status_code=404, detail="Not found")

# Middleware
app.add_middleware(CORSMiddleware, allow_origins=["*"])

# Background task
bg.add_task(fn, arg1, arg2)

# Startup/shutdown
@asynccontextmanager
async def lifespan(app):
    # startup
    yield
    # shutdown
```

## Flask Quick Reference

```python
app = Flask(__name__)
@app.route("/path/<int:id>", methods=["GET","POST"])
def view(id):
    data = request.get_json()           # JSON body
    args = request.args.get("page", 1)  # query params
    form = request.form.get("name")     # form data
    return jsonify({"key": "value"}), 200

# Blueprint
bp = Blueprint("name", __name__, url_prefix="/api")
app.register_blueprint(bp)

# Hooks
@app.before_request
def setup(): ...
@app.after_request
def teardown(response): return response
@app.errorhandler(404)
def not_found(e): return jsonify({"error":"Not Found"}), 404

# Extensions
Flask-SQLAlchemy  # ORM
Flask-Login       # session auth
Flask-JWT-Extended # JWT auth
Flask-Limiter     # rate limiting
Flask-Caching     # caching (Redis)
Flask-Migrate     # DB migrations (Alembic)
```

## Common Gotchas

```
Mutable default argument:        def f(lst=[]):   # BAD — shared across calls
                                 def f(lst=None): lst = lst or []  # GOOD

Late binding closure:            funcs=[lambda: i for i in range(3)]  # all return 2
                                 funcs=[lambda i=i: i for i in range(3)]  # GOOD

Integer caching:                 a = 256; b = 256; a is b  # True (cached)
                                 a = 257; b = 257; a is b  # False

String interning:                "hello" is "hello"  # True (interned)
                                 s = "hel" + "lo"; s is "hello"  # maybe

is vs ==:                        is  → identity (same object)
                                 ==  → equality (same value)
                                 Never use `is` for value comparison

copy vs deepcopy:                copy → shallow (nested mutable shared)
                                 deepcopy → fully independent

NOT IN with NULL:                NOT IN returns empty if subquery has NULL
                                 Use NOT EXISTS instead

GIL:                             Threads for I/O, Processes for CPU
Generator exhaustion:            Once exhausted, yields nothing (no error)
NaN comparisons:                 float('nan') != float('nan')  # True!
                                 use math.isnan() or pd.isna()
```

---

*This document covers Python OOP, Advanced Python, NumPy, Pandas, Scikit-learn, Matplotlib, Seaborn, FastAPI, and Flask for Senior Data/ML Engineer interview preparation.*

*Key areas to master: Python data model (dunders), generators/decorators, NumPy broadcasting/vectorization, Pandas GroupBy/Window functions, sklearn Pipelines/CV, and FastAPI async patterns.*
