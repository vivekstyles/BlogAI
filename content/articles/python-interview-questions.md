---
title: 30 Python Interview Questions and Answers for Beginners and Experienced Developers
seoTitle: 30 Python Interview Questions and Answers (2026)
description: 30 Python interview questions with clear answers and code run on Python 3.14, from mutable defaults and scope to the GIL, asyncio, the MRO and Python 3.15.
author: BlogAI Editors
authorType: Organization
publishedAt: 2026-10-21
updatedAt: 2026-10-21
status: published
categories:
  - Programming and Technology
tags:
  - python
  - interview questions
  - programming
  - career
  - asyncio
  - concurrency
tocDepth: 2
---

A good Python interview answer does three things: it states the rule, shows a short example, and explains why the language works that way. This guide gives you that for 30 questions that come up again and again, from beginner topics such as mutability and scope to the questions experienced developers get about the GIL, `asyncio`, memory management and the method resolution order.

**How to use it.** Questions 1–15 cover the fundamentals every Python role expects. Questions 16–30 are asked of mid-level and senior developers. Try to answer each question aloud before reading the answer, then run the code yourself. Every snippet was run on **Python 3.14.3** in October 2026, and the outputs shown are the real outputs. Python 3.15 was released on 9 October 2026 ([Python 3.15 release schedule](https://peps.python.org/pep-0790/)); where a newer version changes an answer, it is noted.

**What interviewers are really checking.** Most of these questions are not trivia. "What happens with a mutable default argument?" checks whether you understand that names refer to objects. "Explain the GIL" checks whether you can choose the right concurrency tool. If you understand the model behind the answer, follow-up questions become much easier.

## Python fundamentals (questions 1–15)

### 1. What is Python, and is it compiled or interpreted?

Python is a high-level, dynamically typed, garbage-collected language. "Interpreted" is a simplification. The reference implementation, **CPython**, first compiles your source code to **bytecode** and then runs that bytecode in a virtual machine. You can see the bytecode with the `dis` module:

```python
import dis
dis.dis(compile("x = 1 + 2", "<s>", "exec"))
```

On Python 3.14 the output includes `LOAD_SMALL_INT 3` followed by `STORE_NAME 0 (x)`: the compiler already folded `1 + 2` into `3`. Bytecode is cached in `__pycache__` folders as `.pyc` files. Other implementations exist, such as PyPy, which adds a just-in-time compiler. Bytecode instructions change between versions, so never rely on them.

**Follow-up to expect:** "Is Python slow?" A good answer: pure-Python loops are slower than compiled languages, but most heavy work in real programs runs in C extensions such as NumPy, and recent CPython releases have added a specializing interpreter and an experimental JIT compiler.

### 2. What is the difference between mutable and immutable objects?

A **mutable** object can be changed in place; an **immutable** one cannot. Lists, dictionaries, sets and most user-defined objects are mutable. Integers, floats, strings, tuples, `frozenset` and `bytes` are immutable.

```python
s = "hi"; t = s; s += "!"
print(s, t)        # hi! hi       -> a new string was created; t still points to the old one

a = [1, 2]; b = a; a += [3]
print(a, b)        # [1, 2, 3] [1, 2, 3]  -> the same list was changed in place
```

Why it matters: only immutable (more precisely, *hashable*) objects can be dictionary keys or set members, and passing a mutable object to a function lets the function change it. Python 3.15 adds a built-in immutable `frozendict` ([What's New in Python 3.15](https://docs.python.org/3.15/whatsnew/3.15.html)).

### 3. When do you use a list, a tuple, a set or a dictionary?

| Type | Ordered | Mutable | Duplicates | Typical use |
|---|---|---|---|---|
| `list` | yes | yes | yes | a sequence you will change: results, a queue of work |
| `tuple` | yes | no | yes | a fixed record, such as `(lat, lon)`, or a dictionary key |
| `set` | no | yes | no | fast membership tests, removing duplicates, set algebra |
| `dict` | insertion order | yes | keys unique | mapping keys to values, counting, lookups |

The key performance fact: checking `x in some_list` scans the list item by item, while `x in some_set` and `key in some_dict` use a hash table and take roughly constant time on average ([Python time complexity](https://wiki.python.org/moin/TimeComplexity)). Question 29 shows the measured difference.

### 4. What is the difference between `is` and `==`?

`==` compares **values** (it calls `__eq__`). `is` compares **identity**: whether two names refer to the very same object.

```python
x = [1, 2, 3]; y = [1, 2, 3]
print(x == y, x is y)   # True False
print(None is None)     # True
```

Use `is` only for singletons such as `None`, `True` and `False` (`if value is None:`). A common trap: `a is b` may be `True` for small integers or short strings because CPython caches some objects, but that is an implementation detail, and the result can differ for other values or other interpreters. Never use `is` to compare numbers or strings.

### 5. How are arguments passed to functions in Python?

Neither "by value" nor "by reference" describes it well. Python passes **references to objects** (often called *call by sharing*). The function receives a new name bound to the same object. If the object is mutable and the function changes it, the caller sees the change; if the function rebinds its parameter to a new object, the caller does not.

```python
def add_item(items):
    items.append(4)      # changes the shared list

def rebind(items):
    items = [0]          # only rebinds the local name

nums = [1, 2, 3]
add_item(nums); rebind(nums)
print(nums)              # [1, 2, 3, 4]
```

### 6. What is the mutable default argument trap?

Default values are evaluated **once, when the function is defined**, not each time it is called. A mutable default is therefore shared between calls:

```python
def append_bad(item, bucket=[]):
    bucket.append(item)
    return bucket

print(append_bad(1))   # [1]
print(append_bad(2))   # [1, 2]   <- the same list as last time

def append_good(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket

print(append_good(1))  # [1]
print(append_good(2))  # [2]
```

The fix is the `None` sentinel shown above. Linters such as Ruff and Pylint flag mutable defaults.

### 7. What do `*args` and `**kwargs` do?

In a function definition, `*args` collects extra positional arguments into a tuple and `**kwargs` collects extra keyword arguments into a dictionary. The names are conventions; the stars do the work.

```python
def describe(*args, **kwargs):
    return args, kwargs

print(describe(1, 2, colour="green", size=3))
# ((1, 2), {'colour': 'green', 'size': 3})
```

In a call, the same stars **unpack**: `f(*my_list, **my_dict)`. They are common in decorators and wrappers that pass arguments through unchanged. You can also force keyword-only arguments with a bare `*` (`def f(a, *, verbose=False)`) and positional-only ones with `/`.

### 8. What is the difference between a list comprehension and a generator expression?

A list comprehension builds the whole list in memory immediately. A generator expression produces items lazily, one at a time, when something iterates over it.

```python
import sys
squares_list = [n * n for n in range(1_000_000)]
squares_gen = (n * n for n in range(1_000_000))
print(sys.getsizeof(squares_list), sys.getsizeof(squares_gen))   # 8448728 208
print(sum(squares_gen))                                          # 333332833333500000
```

The list object alone takes about 8.4 MB (not counting the integers it points to); the generator takes 208 bytes regardless of length. Use a generator when you only iterate once, for example inside `sum()`, `any()` or `max()`. Use a list when you need indexing, `len()` or several passes. A generator can only be consumed once.

### 9. What is the difference between a shallow copy and a deep copy?

A **shallow copy** creates a new outer container but shares the inner objects. A **deep copy** recursively copies everything.

```python
import copy
original = [[1, 2], [3, 4]]
shallow = copy.copy(original)      # same as original[:] or list(original)
deep = copy.deepcopy(original)
original[0].append(99)
print(shallow, deep)               # [[1, 2, 99], [3, 4]] [[1, 2], [3, 4]]
```

Assignment (`b = a`) copies nothing at all; it only adds a second name.

### 10. What is a decorator? Write one.

A decorator is a function that takes a function and returns a replacement, usually a wrapper that adds behavior before or after the call. `@timed` above a definition is shorthand for `slow_sum = timed(slow_sum)`.

```python
import functools, time

def timed(func):
    @functools.wraps(func)          # keeps the original name and docstring
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.perf_counter() - start:.4f}s")
        return result
    return wrapper

@timed
def slow_sum(n):
    return sum(range(n))

print(slow_sum(10_000_000))   # slow_sum took 0.1567s, then 49999995000000
```

Mention `functools.wraps`: without it, `slow_sum.__name__` would be `"wrapper"`, which breaks debugging and documentation tools. Real-world decorators include `@functools.cache`, `@property`, `@dataclass` and route decorators in web frameworks.

### 11. How do `try`, `except`, `else` and `finally` work together?

`try` holds the code that might fail; `except` handles specific exceptions; `else` runs only if no exception was raised; `finally` always runs, even after `return`.

```python
def parse(text):
    try:
        value = int(text)
    except ValueError:
        print("not a number")
        return None
    else:
        print("parsed")
        return value
    finally:
        print("always runs")

parse("42")    # parsed, always runs -> 42
parse("abc")   # not a number, always runs -> None
```

Good practice: catch the narrowest exception you can handle, keep the `try` block small, and never use a bare `except:`, which also catches `KeyboardInterrupt`. Python 3.14 lets you write `except TimeoutError, ConnectionError:` without brackets when there is no `as` clause (PEP 758), and warns when `return`, `break` or `continue` leave a `finally` block (PEP 765) ([What's New in Python 3.14](https://docs.python.org/3/whatsnew/3.14.html)).

### 12. What does the `with` statement do?

`with` uses a **context manager** to guarantee setup and cleanup: files are closed, locks are released and transactions are committed or rolled back, even if an exception occurs. Any object with `__enter__` and `__exit__` methods works, and `contextlib.contextmanager` turns a generator into one:

```python
import time
from contextlib import contextmanager

@contextmanager
def timer(label):
    start = time.perf_counter()
    try:
        yield
    finally:
        print(f"{label}: {time.perf_counter() - start:.3f}s")

with timer("sleep"):
    time.sleep(0.1)          # sleep: 0.100s
```

### 13. What does `if __name__ == "__main__":` do?

When Python runs a file directly, it sets that module's `__name__` to `"__main__"`. When the file is imported, `__name__` is the module's name. The check therefore lets a file work both as a script and as an importable module: code under the `if` runs only when you execute the file, not when another module imports its functions. It is also required for `multiprocessing` on Windows and macOS, where child processes import the main module.

### 14. How does Python look up variable names (scope)?

Python searches four scopes in order, known as **LEGB**: **L**ocal (the current function), **E**nclosing (outer functions), **G**lobal (the module) and **B**uilt-in. Assigning to a name inside a function makes it local unless you declare otherwise with `global` or `nonlocal`.

```python
count = 0

def outer():
    total = 0
    def inner():
        nonlocal total      # refers to outer's total
        total += 1
        return total
    inner()
    return inner()

def bump():
    global count            # refers to the module-level count
    count += 1

print(outer()); bump(); print(count)    # 2, then 1
```

Without `nonlocal`, `total += 1` raises `UnboundLocalError`, because the assignment makes `total` local to `inner`. Prefer returning values over `global`, which makes code harder to test.

### 15. Why do lambdas created in a loop all return the same value?

Closures look up variables **when they are called**, not when they are created (late binding). By the time you call the functions, the loop variable holds its last value.

```python
funcs = [lambda: i for i in range(3)]
print([f() for f in funcs])            # [2, 2, 2]

funcs = [lambda i=i: i for i in range(3)]
print([f() for f in funcs])            # [0, 1, 2]
```

The fix binds the current value as a default argument (evaluated at definition time; see question 6) or uses `functools.partial`.

## Questions for experienced developers (16–30)

### 16. What are iterators and generators?

An **iterable** is anything you can loop over; it returns an **iterator** from `__iter__`. An iterator returns the next item from `__next__` and raises `StopIteration` when it is exhausted. A **generator function** uses `yield` to create an iterator without writing a class: its local state is paused at each `yield` and resumed on the next `next()` call.

```python
def countdown(n):
    while n > 0:
        yield n
        n -= 1

gen = countdown(3)
print(next(gen), next(gen), list(gen))   # 3 2 [1]
```

Generators make pipelines that process large files or streams in constant memory. `yield from` delegates to another iterator, and generators are also the foundation of context managers (question 12).

### 17. What is the GIL, and what changed in Python 3.13 and 3.14?

The **Global Interpreter Lock** is a mutex in CPython that lets only one thread execute Python bytecode at a time. It keeps reference counting and the interpreter's internals simple and safe, but it means threads cannot speed up CPU-bound pure-Python code on multiple cores. Threads still help with I/O, because the GIL is released while a thread waits on the network or disk, and many C extensions release it during heavy computation.

What changed:

- **Python 3.13** added an experimental **free-threaded build** that can run without the GIL ([PEP 703](https://peps.python.org/pep-0703/)).
- **Python 3.14** made the free-threaded build **officially supported** ([PEP 779](https://peps.python.org/pep-0779/)), with single-threaded overhead reported at roughly 5–10% ([What's New in Python 3.14](https://docs.python.org/3/whatsnew/3.14.html)). It is still a separate build (`python3.14t`), not the default.
- **Python 3.15** added a stable ABI for free-threaded extensions (PEP 803), so one compiled extension can support free-threaded CPython ([What's New in Python 3.15](https://docs.python.org/3.15/whatsnew/3.15.html)).

`sys._is_gil_enabled()` (3.13+) tells you which mode you are running in; it printed `True` on the standard 3.14 build used for this article. A strong answer adds that removing the GIL does not remove the need for locks: your own shared data still needs synchronization.

### 18. When do you use threading, multiprocessing or asyncio?

<figure>
<img src="/images/articles/python-interview-questions/concurrency-chooser.svg" alt="Decision diagram. Start with the question: what is the program waiting on? If it waits on I/O such as the network, disk or a database, use asyncio for many connections or threads with ThreadPoolExecutor for blocking libraries, because the GIL is released while waiting. If it is busy with pure-Python computation, use processes with ProcessPoolExecutor, NumPy and other C code, or threads on the free-threaded build in Python 3.14 and later. A note says to measure first, because if the program is neither, concurrency will not make it faster." width="720" height="360" loading="lazy" decoding="async" />
<figcaption>Choose the tool by what the program is waiting on, and measure before and after.</figcaption>
</figure>

- **I/O-bound with many connections** (thousands of HTTP requests, websockets): `asyncio`, which runs many tasks in one thread with low overhead.
- **I/O-bound with blocking libraries** (a database driver or SDK without async support): threads, usually through `concurrent.futures.ThreadPoolExecutor`.
- **CPU-bound pure Python** (parsing, simulations): processes with `ProcessPoolExecutor` or `multiprocessing`, which sidestep the GIL at the cost of copying data between processes. On the free-threaded build, threads can now run such code in parallel. Python 3.14 also added `InterpreterPoolExecutor`, which runs work in separate interpreters inside one process.
- **CPU-bound numeric code:** vectorize with NumPy first; it is often faster than any amount of parallel Python.

### 19. How does `asyncio` work?

`asyncio` runs **coroutines** (functions defined with `async def`) on a single-threaded **event loop**. When a coroutine reaches `await` on something that is not ready, such as a network response, it yields control so the loop can run other tasks. Concurrency comes from overlapping waits, not from parallel CPU work.

```python
import asyncio, time

async def fetch(name, delay):
    await asyncio.sleep(delay)      # stands in for a network call
    return name

async def main():
    start = time.perf_counter()
    async with asyncio.TaskGroup() as tg:           # Python 3.11+
        t1 = tg.create_task(fetch("a", 1))
        t2 = tg.create_task(fetch("b", 1))
    print(t1.result(), t2.result(), f"{time.perf_counter() - start:.1f}s")

asyncio.run(main())        # a b 1.0s  (two 1-second waits overlapped)
```

Points interviewers look for: a blocking call such as `time.sleep()` or `requests.get()` inside a coroutine freezes the whole loop (use `asyncio.to_thread` or an async library such as HTTPX); `TaskGroup` cancels the remaining tasks if one fails, which is safer than a bare `gather`; and Python 3.14 added `python -m asyncio ps PID` to inspect running tasks.

### 20. How does Python manage memory?

CPython uses **reference counting**: every object counts the references to it and is freed as soon as the count reaches zero. Reference counting cannot free **cycles** (A refers to B and B refers to A), so a **cyclic garbage collector** periodically finds and frees unreachable groups of objects. The `gc` module controls it.

```python
import gc

class Node:
    def __init__(self):
        self.other = None

a, b = Node(), Node()
a.other, b.other = b, a     # a reference cycle
del a, b                    # counts never reach zero...
gc.collect()                # ...so the cycle collector frees them
```

Practical consequences: objects are usually freed promptly, which is why files are often closed even without `with` (but do not rely on it); cycles involving large objects can keep memory alive until a collection runs; and memory leaks in Python usually come from references you forgot about, such as caches and global lists. `tracemalloc` shows where memory is allocated. (Python 3.14.0–3.14.4 shipped an incremental garbage collector, which was reverted in 3.14.5 to the 3.13 design after reports of memory pressure ([What's New in Python 3.14](https://docs.python.org/3/whatsnew/3.14.html)).)

### 21. What does `__slots__` do?

By default, each instance stores its attributes in a per-instance `__dict__`. Declaring `__slots__` reserves fixed slots instead, which saves memory when you create many instances and makes attribute access slightly faster. The trade-off: you cannot add attributes that are not listed.

```python
class PointSlots:
    __slots__ = ("x", "y")
    def __init__(self, x, y):
        self.x, self.y = x, y

p = PointSlots(1, 2)
p.z = 3
# AttributeError: 'PointSlots' object has no attribute 'z' and no __dict__ for setting new attributes
```

With dataclasses you get the same with `@dataclass(slots=True)` (Python 3.10+).

### 22. What is the difference between `__repr__` and `__str__`, and why must `__eq__` and `__hash__` agree?

`__repr__` is for developers: unambiguous, ideally valid Python that recreates the object. `__str__` is for users. `print()` and f-strings use `__str__`, and fall back to `__repr__`.

If two objects are equal, they **must** have the same hash, or sets and dictionaries break. Python enforces part of this: defining `__eq__` without `__hash__` sets `__hash__` to `None`, making instances unhashable.

```python
class Money:
    def __init__(self, amount, currency):
        self.amount, self.currency = amount, currency
    def __repr__(self):
        return f"Money({self.amount!r}, {self.currency!r})"
    def __str__(self):
        return f"{self.amount:.2f} {self.currency}"
    def __eq__(self, other):
        if not isinstance(other, Money):
            return NotImplemented
        return (self.amount, self.currency) == (other.amount, other.currency)
    def __hash__(self):
        return hash((self.amount, self.currency))

m = Money(5, "EUR")
print(repr(m), str(m), m == Money(5, "EUR"), len({m, Money(5, "EUR")}))
# Money(5, 'EUR') 5.00 EUR True 1
```

Hash only fields that never change; if a hashed field changes while the object is in a set, the set can no longer find it.

### 23. When would you use a dataclass, a named tuple or a Pydantic model?

- **`@dataclass`** generates `__init__`, `__repr__` and `__eq__` from type-annotated fields. Use it for plain data inside your program. `frozen=True` makes instances immutable and hashable, and `slots=True` saves memory.
- **`typing.NamedTuple`** creates an immutable tuple with named fields. Use it when the data should behave like a tuple, for example to unpack it or use it as a dictionary key.
- **Pydantic** models (a third-party library) **validate and convert** data at runtime. Use them at boundaries where data comes from outside: API requests, configuration files, JSON.

```python
from dataclasses import dataclass

@dataclass(frozen=True, slots=True)
class Order:
    id: int
    items: tuple[str, ...] = ()

o = Order(1, ("pen",))
print(o)        # Order(id=1, items=('pen',))
o.id = 2        # raises FrozenInstanceError
```

Note that dataclasses do **not** check types at runtime: `Order("one")` works. That is the job of a type checker or Pydantic.

### 24. What is a descriptor, and how does `@property` use it?

A **descriptor** is an object that defines `__get__`, `__set__` or `__delete__` and controls attribute access when it is stored on a class. Properties, methods, `classmethod` and `staticmethod` are all descriptors. `@property` lets you start with a plain attribute and later add validation or computation without changing the code that uses it:

```python
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius            # goes through the setter below

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self):
        return self._celsius * 9 / 5 + 32

t = Temperature(25)
print(t.fahrenheit)      # 77.0
t.celsius = -300         # ValueError: below absolute zero
```

### 25. What is a metaclass, and what would you use instead?

Classes are objects too, and a **metaclass** is the class of a class: it controls how classes are created. `type` is the default metaclass (`type(SomeClass)` is `type`). Metaclasses can register, validate or modify classes as they are defined, which is how some ORMs and frameworks work.

A strong answer adds that you rarely need one. `__init_subclass__` and class decorators cover most use cases with less magic:

```python
class Plugin:
    registry = {}
    def __init_subclass__(cls, name, **kwargs):
        super().__init_subclass__(**kwargs)
        Plugin.registry[name] = cls

class CsvExporter(Plugin, name="csv"): pass
class JsonExporter(Plugin, name="json"): pass

print(Plugin.registry)
# {'csv': <class '__main__.CsvExporter'>, 'json': <class '__main__.JsonExporter'>}
```

### 26. How does multiple inheritance work (MRO and `super()`)?

Python computes a **method resolution order (MRO)** for every class using the **C3 linearization** algorithm. It keeps each class before its parents and preserves the order in which parents are listed. `super()` means "the next class in the MRO of the instance", not "my parent", which lets every class in a diamond run exactly once.

```python
class A:
    def greet(self): return "A"
class B(A):
    def greet(self): return "B>" + super().greet()
class C(A):
    def greet(self): return "C>" + super().greet()
class D(B, C):
    def greet(self): return "D>" + super().greet()

print([k.__name__ for k in D.__mro__], D().greet())
# ['D', 'B', 'C', 'A', 'object'] D>B>C>A
```

Notice that `B`'s `super()` calls `C`, not `A`. If a class layout makes C3 impossible, Python raises `TypeError` when the class is defined.

### 27. Are type hints enforced?

No. The interpreter stores annotations but does not check them at runtime:

```python
def double(x: int) -> int:
    return x * 2

print(double("ab"))     # abab  (no error)
```

Type hints are checked by static tools such as **mypy** or **Pyright** and used by editors, and some libraries (Pydantic, FastAPI) read them at runtime on purpose. Useful features to mention: `Protocol` for structural ("duck") typing, generics with the Python 3.12 syntax `def first[T](items: list[T]) -> T` ([PEP 695](https://peps.python.org/pep-0695/)), and **deferred evaluation of annotations** in Python 3.14 ([PEP 649](https://peps.python.org/pep-0649/)), which means forward references no longer need quotes.

### 28. How do you find and fix slow Python code?

Measure before optimizing. A good answer describes a process:

1. **Profile** to find where time goes: `python -m cProfile -s cumtime script.py`, or a sampling profiler that attaches to a running program. Python 3.15 adds a `profiling` package with a deterministic profiler (`profiling.tracing`, the new home of cProfile) and a statistical sampling profiler (`profiling.sampling`) ([What's New in Python 3.15](https://docs.python.org/3.15/whatsnew/3.15.html)).
2. **Benchmark** small changes with `timeit`, which repeats code many times to reduce noise.
3. **Fix the algorithm or data structure first:** a set instead of a list for lookups (question 29), a dictionary instead of nested loops, avoiding repeated work with `functools.cache`.
4. **Then use faster tools:** vectorize with NumPy or pandas, move hot loops to compiled code (Numba, Cython, Rust), or parallelize (question 18).

### 29. Why is a membership test faster on a set than on a list?

A list is checked item by item, so `x in list` takes time proportional to its length, O(n). A set (and a dictionary's keys) stores items in a hash table: Python hashes `x` and jumps straight to the right bucket, which takes O(1) time on average.

<figure>
<img src="/images/articles/python-interview-questions/list-vs-set-lookup.svg" alt="Log-log line chart of the time for one membership test against the number of items, from 10 to 100,000, searching for the last item. The list line rises steadily from about 0.1 microseconds at 10 items to about 1,000 microseconds at 100,000 items. The set line stays flat at about 0.03 to 0.05 microseconds for every size." width="720" height="330" loading="lazy" decoding="async" />
<figcaption>Measured with timeit on one Windows laptop with Python 3.13. Absolute times vary by machine; the shapes do not.</figcaption>
</figure>

In that test, finding the last of 100,000 items took about 1 millisecond in a list and about 0.05 microseconds in a set. Two related facts are often asked: since Python 3.7, dictionaries preserve **insertion order** as a language guarantee ([What's New in Python 3.7](https://docs.python.org/3/whatsnew/3.7.html)), and building a set costs O(n), so it only pays off when you test membership more than once.

### 30. What is structural pattern matching?

The `match` statement (Python 3.10, [PEP 634](https://peps.python.org/pep-0634/)) compares a value against **patterns** that can check its shape and pull out parts at the same time. It is more than a `switch`: patterns can match sequences, mappings, class instances and alternatives, and can include guards.

```python
def handle(command):
    match command.split():
        case ["go", direction]:
            return f"moving {direction}"
        case ["take", *items] if items:
            return f"taking {', '.join(items)}"
        case ["quit" | "exit"]:
            return "bye"
        case _:
            return "unknown command"

for c in ["go north", "take key lamp", "exit", "dance"]:
    print(handle(c))
# moving north / taking key, lamp / bye / unknown command
```

A detail that catches people out: a bare name in a pattern, such as `case direction:`, **captures** any value rather than comparing against a variable called `direction`. To compare against a constant, use a dotted name such as `Color.RED`.

## Newer Python features worth knowing in 2026

Interviewers do not expect you to know every release, but recent features make good follow-up questions and show that you keep up. All are from the official "What's New" pages:

- **Template strings (t-strings), Python 3.14** ([PEP 750](https://peps.python.org/pep-0750/)). `t"Hello {name}"` returns a `Template` object instead of a string, so a library can process the interpolated values before combining them, for example to escape HTML or build safe SQL. In our test, a small `render()` function turned `t"Hello {name}!"` with `name = "<script>"` into `Hello &lt;script&gt;!`.
- **Lazy imports, Python 3.15** ([PEP 810](https://peps.python.org/pep-0810/)). `lazy import json` defers loading a module until the name is first used, which can cut startup time for command-line tools.
- **UTF-8 by default, Python 3.15** ([PEP 686](https://peps.python.org/pep-0686/)). `open()` now uses UTF-8 when you do not pass an `encoding`, regardless of the system locale. Passing `encoding="utf-8"` explicitly is still a good habit for code that must run on older versions.
- **Unpacking in comprehensions, Python 3.15** (PEP 798), `frozendict` (PEP 814) and a built-in `sentinel` type (PEP 661).

## How to prepare in the last week

- **Write code by hand or in a plain editor.** Many interviews use a shared document without autocomplete.
- **Explain while you code.** Say what you are about to do and why; interviewers grade reasoning as much as the result.
- **Know your complexity.** Be ready to state the time and memory cost of your solution and of common operations (list append and index: O(1); `x in list`: O(n); dictionary lookup: O(1) on average; sorting: O(n log n)).
- **Practice with real problems.** Short exercises from [Exercism's Python track](https://exercism.org/tracks/python) or the yearly puzzles at [Advent of Code](https://adventofcode.com/) build fluency. Building something end to end helps even more; see our [25 Python projects for beginners](/articles/python-projects-for-beginners).
- **For data roles**, expect pandas and NumPy questions as well. Our [pandas tips and tricks](/articles/pandas-tips-and-tricks-for-data-analysis) and [NumPy examples](/articles/numpy-examples-for-numerical-computing) cover the usual ground.

## Where to go next

- Practice practical scripting with [15 Python automation scripts to save time at work](/articles/python-automation-scripts).
- If you are interviewing for data or machine learning roles, review the [20 best Python libraries for data science and machine learning](/articles/python-libraries-for-machine-learning).
- See [10 Python web scraping techniques](/articles/python-web-scraping-techniques) for a worked example of `asyncio` with HTTPX.
- Find more programming writing in the [Programming and Technology category](/category/programming-and-technology).

## References

1. Python Software Foundation. "What's New in Python 3.14." [docs.python.org](https://docs.python.org/3/whatsnew/3.14.html)
2. Python Software Foundation. "What's New in Python 3.15." [docs.python.org](https://docs.python.org/3.15/whatsnew/3.15.html)
3. "PEP 790 – Python 3.15 Release Schedule." [peps.python.org](https://peps.python.org/pep-0790/)
4. Gross, S. "PEP 703 – Making the Global Interpreter Lock Optional in CPython." [peps.python.org](https://peps.python.org/pep-0703/)
5. "PEP 779 – Criteria for supported status for free-threaded Python." [peps.python.org](https://peps.python.org/pep-0779/)
6. Python Software Foundation. "dis — Disassembler for Python bytecode." [docs.python.org](https://docs.python.org/3/library/dis.html)
7. Python Software Foundation. "Data model." *The Python Language Reference*. [docs.python.org](https://docs.python.org/3/reference/datamodel.html)
8. Python Software Foundation. "Coroutines and Tasks" (asyncio). [docs.python.org](https://docs.python.org/3/library/asyncio-task.html)
9. Python Software Foundation. "gc — Garbage Collector interface." [docs.python.org](https://docs.python.org/3/library/gc.html)
10. Simionato, M. "The Python 2.3 Method Resolution Order." [docs.python.org](https://docs.python.org/3/howto/mro.html)
11. Bucher, B., & van Rossum, G. "PEP 634 – Structural Pattern Matching: Specification." [peps.python.org](https://peps.python.org/pep-0634/)
12. "PEP 750 – Template Strings." [peps.python.org](https://peps.python.org/pep-0750/)
13. "PEP 810 – Explicit lazy imports." [peps.python.org](https://peps.python.org/pep-0810/)
14. Python Wiki. "TimeComplexity." [wiki.python.org](https://wiki.python.org/moin/TimeComplexity)
