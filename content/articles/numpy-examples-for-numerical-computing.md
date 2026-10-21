---
title: 101 Best NumPy Examples to Master Numerical Computing in Python
seoTitle: 101 NumPy Examples for Numerical Computing in Python
description: 101 runnable NumPy examples covering arrays, indexing, broadcasting, statistics, random numbers, floating point and speed, each with real output from NumPy 2.3.
author: BlogAI Editors
authorType: Organization
publishedAt: 2026-10-17
updatedAt: 2026-10-17
status: published
categories:
  - Programming and Technology
  - Engineering
  - Mathematics
tags:
  - python
  - numpy
  - numerical computing
  - data science
  - scientific computing
tocDepth: 2
---

NumPy is the array library underneath almost every numerical tool in Python, including pandas, scikit-learn, SciPy and matplotlib. Being fluent in it comes down to a few ideas: arrays have a fixed type and shape, operations apply to whole arrays at once (vectorization), arrays of different shapes combine through broadcasting, and some indexing returns views while some returns copies.

This guide works through those ideas in 101 short examples, from creating arrays to numerical stability and speed. Each example is self-contained. They were run with **NumPy 2.3.5 on Python 3.13**, and the output under each snippet is what it printed. Floating-point output can differ in the last digit on other machines or library builds.

**Scope.** Linear algebra gets one short section here. For the math behind matrix products, decompositions and their role in machine learning, see the companion article [101 linear algebra concepts for machine learning and AI](/articles/linear-algebra-concepts-for-machine-learning).

## Creating arrays

### 1. From a Python list

`np.array` infers the dtype from the data. Mixed integers and floats become floats.

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([1, 2.5, 3])
print(a, a.dtype)
print(b, b.dtype)
```

```text
[1 2 3] int64
[1.  2.5 3. ] float64
```

### 2. Shape, number of dimensions and size

```python
import numpy as np

m = np.array([[1, 2, 3], [4, 5, 6]])
print(m.shape, m.ndim, m.size)
```

```text
(2, 3) 2 6
```

### 3. Zeros, ones and constant arrays

Preallocate with `zeros`, `ones` or `full` when you know the final shape.

```python
import numpy as np

print(np.zeros((2, 3)))
print(np.ones(3, dtype=np.int32))
print(np.full((2, 2), 7))
```

```text
[[0. 0. 0.]
 [0. 0. 0.]]
[1 1 1]
[[7 7]
 [7 7]]
```

### 4. Integer ranges with `arange`

`arange` works like Python's `range` and excludes the stop value.

```python
import numpy as np

print(np.arange(5))
print(np.arange(2, 20, 5))
```

```text
[0 1 2 3 4]
[ 2  7 12 17]
```

### 5. Evenly spaced floats with `linspace`

For floating-point steps, prefer `linspace`, which takes a number of points and includes the endpoint. With a float step, rounding can make `arange` return an extra element: `np.arange(1, 1.3, 0.1)` looks like it should give three values but gives four, ending with a value that prints as 1.3 even though the stop value is supposed to be excluded.

```python
import numpy as np

print(np.linspace(0, 1, 5))
print(len(np.arange(1, 1.3, 0.1)))
```

```text
[0.   0.25 0.5  0.75 1.  ]
4
```

### 6. Log-spaced values with `logspace` and `geomspace`

Useful for learning-rate grids or frequency axes.

```python
import numpy as np

print(np.logspace(-3, 0, 4))
print(np.geomspace(1, 1000, 4))
```

```text
[0.001 0.01  0.1   1.   ]
[   1.   10.  100. 1000.]
```

### 7. Identity and diagonal matrices

```python
import numpy as np

print(np.eye(3, dtype=int))
print(np.diag([4, 5, 6]))
```

```text
[[1 0 0]
 [0 1 0]
 [0 0 1]]
[[4 0 0]
 [0 5 0]
 [0 0 6]]
```

### 8. Arrays shaped like another array

`zeros_like`, `ones_like` and `full_like` copy the shape and dtype of an existing array.

```python
import numpy as np

x = np.array([[1.5, 2.5], [3.5, 4.5]])
print(np.zeros_like(x))
print(np.full_like(x, -1))
```

```text
[[0. 0.]
 [0. 0.]]
[[-1. -1.]
 [-1. -1.]]
```

### 9. Coordinate grids with `meshgrid`

`meshgrid` turns two 1-D axes into 2-D coordinate arrays, which is how you evaluate a function over a grid.

```python
import numpy as np

x = np.array([0, 1, 2])
y = np.array([10, 20])
X, Y = np.meshgrid(x, y)
print(X)
print(Y)
print(X + Y)
```

```text
[[0 1 2]
 [0 1 2]]
[[10 10 10]
 [20 20 20]]
[[10 11 12]
 [20 21 22]]
```

### 10. Arrays from a function with `fromfunction`

The function receives index arrays, so it must be vectorized.

```python
import numpy as np

times_table = np.fromfunction(lambda i, j: (i + 1) * (j + 1), (3, 4), dtype=int)
print(times_table)
```

```text
[[ 1  2  3  4]
 [ 2  4  6  8]
 [ 3  6  9 12]]
```

### 11. Repeating patterns with `tile` and `repeat`

`tile` repeats the whole array; `repeat` repeats each element.

```python
import numpy as np

a = np.array([1, 2, 3])
print(np.tile(a, 2))
print(np.repeat(a, 2))
```

```text
[1 2 3 1 2 3]
[1 1 2 2 3 3]
```

### 12. `np.empty` does not initialize memory

`empty` is slightly faster than `zeros` because it skips initialization, but the contents are whatever was in memory. Only use it when you will overwrite every element.

```python
import numpy as np

buf = np.empty(4)
buf[:] = [1, 2, 3, 4]
print(buf)
```

```text
[1. 2. 3. 4.]
```

## Data types and memory

### 13. Choose a dtype explicitly

Smaller dtypes use less memory, at the cost of range and precision.

```python
import numpy as np

for dt in [np.int8, np.int32, np.float32, np.float64]:
    a = np.zeros(1_000, dtype=dt)
    print(dt.__name__, a.itemsize, "bytes per item,", a.nbytes, "bytes total")
```

```text
int8 1 bytes per item, 1000 bytes total
int32 4 bytes per item, 4000 bytes total
float32 4 bytes per item, 4000 bytes total
float64 8 bytes per item, 8000 bytes total
```

### 14. Know the limits with `iinfo` and `finfo`

```python
import numpy as np

print(np.iinfo(np.int8).min, np.iinfo(np.int8).max)
print(np.finfo(np.float32).eps)
print(np.finfo(np.float64).eps)
```

```text
-128 127
1.1920929e-07
2.220446049250313e-16
```

### 15. Integer overflow wraps silently in arrays

Fixed-width integers wrap around instead of raising errors when an array operation overflows. Use a wider dtype when values can grow.

```python
import numpy as np

a = np.array([120, 100], dtype=np.int8)
print(a + a)
print(a.astype(np.int16) + a.astype(np.int16))
```

```text
[-16 -56]
[240 200]
```

### 16. Convert types with `astype`

`astype` returns a new array. Converting floats to integers truncates toward zero; round first if you want rounding.

```python
import numpy as np

x = np.array([1.7, -1.7, 2.5])
print(x.astype(int))
print(np.round(x).astype(int))
```

```text
[ 1 -1  2]
[ 2 -2  2]
```

### 17. NumPy rounds half to even

`np.round` uses "banker's rounding": exact halves go to the nearest even number, which avoids a systematic upward bias when rounding many values.

```python
import numpy as np

print(np.round([0.5, 1.5, 2.5, 3.5]))
```

```text
[0. 2. 2. 4.]
```

### 18. Boolean arrays use one byte per element

```python
import numpy as np

flags = np.array([True, False, True])
print(flags.dtype, flags.nbytes)
print(flags.sum())
```

```text
bool 3
2
```

### 19. Fixed-width strings truncate

NumPy string arrays have a fixed maximum length set at creation. Assigning a longer string cuts it off without warning.

```python
import numpy as np

names = np.array(["ann", "bob"])
print(names.dtype)
names[0] = "alexandra"
print(names)
```

```text
<U3
['ale' 'bob']
```

### 20. Structured arrays hold mixed field types

A structured dtype gives each record named fields, similar to a row in a table.

```python
import numpy as np

people = np.array([("Ana", 31, 1.65), ("Ben", 45, 1.80)],
                  dtype=[("name", "U10"), ("age", "i4"), ("height", "f8")])
print(people["age"].mean())
print(people[people["height"] > 1.7]["name"])
```

```text
38.0
['Ben']
```

## Indexing and slicing

### 21. Basic indexing and negative indices

```python
import numpy as np

a = np.arange(10, 60, 10)
print(a[0], a[-1], a[1:4], a[::-1])
```

```text
10 50 [20 30 40] [50 40 30 20 10]
```

### 22. Index 2-D arrays with a single bracket

`m[1, 2]` is clearer and faster than `m[1][2]`.

```python
import numpy as np

m = np.arange(12).reshape(3, 4)
print(m)
print(m[1, 2], m[:, 0], m[-1, :])
```

```text
[[ 0  1  2  3]
 [ 4  5  6  7]
 [ 8  9 10 11]]
6 [0 4 8] [ 8  9 10 11]
```

### 23. Slices are views, not copies

Changing a slice changes the original array. Call `.copy()` when you need independent data.

```python
import numpy as np

a = np.arange(5)
view = a[1:3]
view[:] = 99
print(a)

b = np.arange(5)
copy = b[1:3].copy()
copy[:] = 99
print(b)
```

```text
[ 0 99 99  3  4]
[0 1 2 3 4]
```

### 24. Check whether two arrays share memory

```python
import numpy as np

a = np.arange(6)
print(np.shares_memory(a, a[::2]))
print(np.shares_memory(a, a[[0, 2]]))
```

```text
True
False
```

### 25. Boolean masks select matching elements

```python
import numpy as np

temps = np.array([12, 25, 31, 8, 19])
print(temps[temps > 18])
print((temps > 18).sum(), "days above 18")
```

```text
[25 31 19]
3 days above 18
```

### 26. Combine masks with `&`, `|` and `~`

```python
import numpy as np

x = np.arange(10)
print(x[(x > 2) & (x % 2 == 0)])
print(x[~(x < 7)])
```

```text
[4 6 8]
[7 8 9]
```

### 27. Fancy indexing with integer arrays

Indexing with a list or array of positions returns a copy in the order you ask for.

```python
import numpy as np

a = np.array([10, 20, 30, 40, 50])
print(a[[4, 0, 2]])
```

```text
[50 10 30]
```

### 28. Pick one element per row

Pairing a row index array with a column index array picks individual cells, such as each sample's score for its true class.

```python
import numpy as np

probs = np.array([[0.1, 0.9], [0.8, 0.2], [0.3, 0.7]])
labels = np.array([1, 0, 0])
print(probs[np.arange(len(labels)), labels])
```

```text
[0.9 0.8 0.3]
```

### 29. Select a sub-grid with `np.ix_`

`m[[0, 2], [1, 3]]` picks two cells, not a 2×2 block. `np.ix_` builds the block.

```python
import numpy as np

m = np.arange(16).reshape(4, 4)
print(m[[0, 2], [1, 3]])
print(m[np.ix_([0, 2], [1, 3])])
```

```text
[ 1 11]
[[ 1  3]
 [ 9 11]]
```

### 30. Find positions with `np.where` and `np.nonzero`

With one argument, `np.where` returns the indices where a condition is true.

```python
import numpy as np

a = np.array([3, 0, 7, 0, 5])
print(np.nonzero(a)[0])
print(np.where(a == 0)[0])
```

```text
[0 2 4]
[1 3]
```

### 31. Choose between two arrays with `np.where`

With three arguments, `np.where` works as a vectorized if/else.

```python
import numpy as np

x = np.array([-2, 3, -1, 4])
print(np.where(x < 0, 0, x))
```

```text
[0 3 0 4]
```

### 32. Multi-way conditions with `np.select`

```python
import numpy as np

bmi = np.array([17.5, 22.0, 27.3, 31.8])
labels = np.select([bmi < 18.5, bmi < 25, bmi < 30], ["under", "normal", "over"], default="obese")
print(labels)
```

```text
['under' 'normal' 'over' 'obese']
```

### 33. Ellipsis selects all remaining axes

`...` stands for as many `:` as needed, which helps with arrays of unknown rank.

```python
import numpy as np

images = np.zeros((2, 4, 4, 3))
print(images[..., 0].shape)
print(images[0, ...].shape)
```

```text
(2, 4, 4)
(4, 4, 3)
```

### 34. Modify selected elements in place

Assigning to a mask or fancy index writes into the original array.

```python
import numpy as np

scores = np.array([45, 82, 39, 91])
scores[scores < 50] = 50
print(scores)
```

```text
[50 82 50 91]
```

## Reshaping and combining arrays

### 35. Reshape with `-1` for the inferred size

```python
import numpy as np

a = np.arange(12)
print(a.reshape(3, -1).shape)
print(a.reshape(-1, 2, 2).shape)
```

```text
(3, 4)
(3, 2, 2)
```

### 36. `ravel` returns a view when it can; `flatten` always copies

```python
import numpy as np

m = np.arange(4).reshape(2, 2)
r = m.ravel()
f = m.flatten()
r[0] = 100
print(m[0, 0], np.shares_memory(m, f))
```

```text
100 False
```

### 37. Transpose and swap axes

```python
import numpy as np

x = np.zeros((2, 3, 4))
print(x.T.shape)
print(np.transpose(x, (1, 0, 2)).shape)
print(np.moveaxis(x, -1, 0).shape)
```

```text
(4, 3, 2)
(3, 2, 4)
(4, 2, 3)
```

### 38. Add an axis with `np.newaxis` or `expand_dims`

A new length-1 axis is how you turn a 1-D array into a column or row for broadcasting.

```python
import numpy as np

v = np.array([1, 2, 3])
print(v[:, np.newaxis].shape, v[np.newaxis, :].shape)
print(np.expand_dims(v, axis=0).shape)
```

```text
(3, 1) (1, 3)
(1, 3)
```

### 39. Remove length-1 axes with `squeeze`

```python
import numpy as np

x = np.zeros((1, 3, 1))
print(np.squeeze(x).shape)
print(np.squeeze(x, axis=0).shape)
```

```text
(3,)
(3, 1)
```

### 40. Join arrays with `concatenate`

`concatenate` joins along an existing axis.

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6]])
print(np.concatenate([a, b], axis=0))
```

```text
[[1 2]
 [3 4]
 [5 6]]
```

### 41. Stack arrays along a new axis

`stack` creates a new axis; `vstack` and `hstack` are shortcuts for common cases.

```python
import numpy as np

a, b = np.array([1, 2, 3]), np.array([4, 5, 6])
print(np.stack([a, b]).shape, np.stack([a, b], axis=1).shape)
print(np.vstack([a, b]))
print(np.column_stack([a, b]))
```

```text
(2, 3) (3, 2)
[[1 2 3]
 [4 5 6]]
[[1 4]
 [2 5]
 [3 6]]
```

### 42. Split arrays into pieces

```python
import numpy as np

a = np.arange(10)
print(np.split(a, [3, 7]))
print([len(p) for p in np.array_split(a, 3)])
```

```text
[array([0, 1, 2]), array([3, 4, 5, 6]), array([7, 8, 9])]
[4, 3, 3]
```

### 43. Pad arrays with `np.pad`

```python
import numpy as np

img = np.ones((2, 2), dtype=int)
print(np.pad(img, 1, constant_values=0))
print(np.pad(np.array([1, 2, 3]), 2, mode="edge"))
```

```text
[[0 0 0 0]
 [0 1 1 0]
 [0 1 1 0]
 [0 0 0 0]]
[1 1 1 2 3 3 3]
```

### 44. Sliding windows without copying

`sliding_window_view` returns overlapping windows as a view, a fast way to compute moving statistics.

```python
import numpy as np
from numpy.lib.stride_tricks import sliding_window_view

x = np.array([1, 3, 5, 7, 9])
windows = sliding_window_view(x, 3)
print(windows)
print(windows.mean(axis=1))
```

```text
[[1 3 5]
 [3 5 7]
 [5 7 9]]
[3. 5. 7.]
```

## Broadcasting and vectorization

### 45. Scalars broadcast to every element

```python
import numpy as np

prices = np.array([10.0, 20.0, 30.0])
print(prices * 1.2)
```

```text
[12. 24. 36.]
```

### 46. Broadcasting rules in one example

Shapes are compared from the right. Two dimensions are compatible when they are equal or one of them is 1. Here `(3, 1)` and `(4,)` broadcast to `(3, 4)`.

```python
import numpy as np

col = np.array([[0], [10], [20]])
row = np.array([1, 2, 3, 4])
print((col + row).shape)
print(col + row)
```

```text
(3, 4)
[[ 1  2  3  4]
 [11 12 13 14]
 [21 22 23 24]]
```

### 47. Standardize columns of a matrix

Subtracting the column means (shape `(n_features,)`) from a matrix of shape `(n_samples, n_features)` broadcasts across rows.

```python
import numpy as np

X = np.array([[1.0, 200.0], [2.0, 300.0], [3.0, 400.0]])
Z = (X - X.mean(axis=0)) / X.std(axis=0)
print(Z.round(3))
print(Z.mean(axis=0).round(12), Z.std(axis=0))
```

```text
[[-1.225 -1.225]
 [ 0.     0.   ]
 [ 1.225  1.225]]
[0. 0.] [1. 1.]
```

### 48. Normalize rows with `keepdims=True`

`keepdims=True` keeps the reduced axis as length 1 so the result broadcasts back against the original.

```python
import numpy as np

counts = np.array([[2, 3, 5], [1, 1, 2]])
print(counts / counts.sum(axis=1, keepdims=True))
```

```text
[[0.2  0.3  0.5 ]
 [0.25 0.25 0.5 ]]
```

### 49. Pairwise distances without loops

Adding axes turns two point sets into a full distance matrix in one expression.

```python
import numpy as np

a = np.array([[0, 0], [3, 4]])
b = np.array([[0, 0], [6, 8], [3, 0]])
d = np.sqrt(((a[:, None, :] - b[None, :, :]) ** 2).sum(axis=-1))
print(d)
```

```text
[[ 0. 10.  3.]
 [ 5.  5.  4.]]
```

### 50. Outer products and tables

`np.outer` (or broadcasting) builds every pairwise combination.

```python
import numpy as np

print(np.outer([1, 2, 3], [1, 10]))
```

```text
[[ 1 10]
 [ 2 20]
 [ 3 30]]
```

### 51. Shape mismatches raise a clear error

```python
import numpy as np

try:
    np.ones((3, 2)) + np.ones(3)
except ValueError as err:
    print(err)
```

```text
operands could not be broadcast together with shapes (3,2) (3,) 
```

### 52. Vectorization beats Python loops

Array operations run in compiled code. The exact speedup depends on your machine; this snippet only checks that it is large.

```python
import time
import numpy as np

x = np.random.default_rng(0).random(1_000_000)

t0 = time.perf_counter()
loop = sum(v * v for v in x)
t1 = time.perf_counter()
vec = np.dot(x, x)
t2 = time.perf_counter()

print(np.isclose(loop, vec))
print("vectorized at least 20x faster:", (t1 - t0) / (t2 - t1) > 20)
```

```text
True
vectorized at least 20x faster: True
```

### 53. Universal functions work element-wise

Functions such as `np.sqrt`, `np.exp` and `np.log` are "ufuncs" that apply to every element.

```python
import numpy as np

x = np.array([1.0, 4.0, 9.0])
print(np.sqrt(x), np.log(x).round(3), np.exp([0, 1]).round(3))
```

```text
[1. 2. 3.] [0.    1.386 2.197] [1.    2.718]
```

### 54. Write results into an existing array with `out=`

`out=` avoids allocating a new array, which matters inside tight loops on large data.

```python
import numpy as np

a = np.arange(5, dtype=float)
np.multiply(a, 2, out=a)
print(a)
```

```text
[0. 2. 4. 6. 8.]
```

### 55. Accumulate and reduce with ufunc methods

Every binary ufunc has `.reduce`, `.accumulate` and `.outer`.

```python
import numpy as np

a = np.array([3, 1, 4, 1, 5])
print(np.add.accumulate(a))
print(np.maximum.accumulate(a))
print(np.multiply.reduce(a))
```

```text
[ 3  4  8  9 14]
[3 3 4 4 5]
60
```

### 56. Add into repeated indices with `np.add.at`

`a[idx] += 1` counts each repeated index only once. `np.add.at` applies every addition.

```python
import numpy as np

idx = np.array([0, 1, 1, 3, 1])
a = np.zeros(4, dtype=int)
a[idx] += 1
b = np.zeros(4, dtype=int)
np.add.at(b, idx, 1)
print(a, b)
```

```text
[1 1 0 1] [1 3 0 1]
```

## Math, aggregation and statistics

### 57. Aggregate along an axis

`axis=0` collapses rows (one result per column); `axis=1` collapses columns (one result per row).

```python
import numpy as np

m = np.array([[1, 2, 3], [4, 5, 6]])
print(m.sum(), m.sum(axis=0), m.sum(axis=1))
```

```text
21 [5 7 9] [ 6 15]
```

### 58. Mean, median, standard deviation and variance

`np.std` uses the population formula by default (`ddof=0`). Use `ddof=1` for the sample standard deviation that most statistics courses and pandas use.

```python
import numpy as np

x = np.array([2, 4, 4, 4, 5, 5, 7, 9])
print(x.mean(), np.median(x), x.std(), x.std(ddof=1).round(4))
```

```text
5.0 4.5 2.0 2.1381
```

### 59. Percentiles and quantiles

```python
import numpy as np

x = np.arange(1, 101)
print(np.percentile(x, [25, 50, 75]))
print(np.quantile(x, 0.9))
```

```text
[25.75 50.5  75.25]
90.10000000000001
```

### 60. Ignore missing values with `nan` functions

A single `NaN` makes `mean` return `NaN`. The `nan*` versions skip missing values.

```python
import numpy as np

x = np.array([1.0, np.nan, 3.0])
print(np.mean(x), np.nanmean(x), np.nanmax(x))
```

```text
nan 2.0 3.0
```

### 61. Weighted average

```python
import numpy as np

grades = np.array([80, 90, 70])
weights = np.array([0.5, 0.3, 0.2])
print(np.average(grades, weights=weights))
```

```text
81.0
```

### 62. Cumulative sums and differences

`cumsum` and `diff` are inverses of each other, up to the first element.

```python
import numpy as np

daily = np.array([5, 3, 8, 2])
total = np.cumsum(daily)
print(total, np.diff(total))
```

```text
[ 5  8 16 18] [3 8 2]
```

### 63. Argmax, argmin and argsort

The `arg*` functions return positions, which you can use to index other arrays.

```python
import numpy as np

names = np.array(["ana", "ben", "cy", "dee"])
scores = np.array([72, 95, 64, 88])
print(names[scores.argmax()])
print(names[np.argsort(scores)[::-1]])
```

```text
ben
['ben' 'dee' 'ana' 'cy']
```

### 64. Top-k without a full sort using `argpartition`

`argpartition` puts the k largest values in the last k slots in linear time; sort only those k afterwards.

```python
import numpy as np

x = np.array([7, 2, 9, 4, 11, 5, 8])
top3 = np.argpartition(x, -3)[-3:]
print(np.sort(x[top3])[::-1])
```

```text
[11  9  8]
```

### 65. Unique values and their counts

```python
import numpy as np

colors = np.array(["red", "blue", "red", "green", "red"])
values, counts = np.unique(colors, return_counts=True)
print(dict(zip(values.tolist(), counts.tolist())))
```

```text
{'blue': 1, 'green': 1, 'red': 3}
```

### 66. Count integers with `bincount`

`bincount` counts non-negative integers in a single pass, faster than `unique` for small labels.

```python
import numpy as np

labels = np.array([0, 2, 1, 2, 2, 0])
print(np.bincount(labels))
print(np.bincount(labels, weights=[10, 5, 3, 5, 5, 1]))
```

```text
[2 1 3]
[11.  3. 15.]
```

### 67. Histograms

```python
import numpy as np

x = np.array([1, 2, 2, 3, 3, 3, 4, 7, 9])
counts, edges = np.histogram(x, bins=[0, 3, 6, 9])
print(counts, edges)
```

```text
[3 4 2] [0 3 6 9]
```

### 68. Assign values to bins with `digitize`

```python
import numpy as np

ages = np.array([5, 17, 30, 64, 70])
edges = np.array([18, 65])
print(np.digitize(ages, edges))
```

```text
[0 0 1 1 2]
```

### 69. Correlation and covariance

`np.corrcoef` treats each *row* as a variable by default. Pass `rowvar=False` when variables are columns.

```python
import numpy as np

hours = np.array([1, 2, 3, 4, 5])
score = np.array([52, 60, 61, 70, 78])
print(np.corrcoef(hours, score).round(4))
print(np.cov(hours, score))
```

```text
[[1.     0.9793]
 [0.9793 1.    ]]
[[  2.5  15.5]
 [ 15.5 100.2]]
```

### 70. Clip values to a range

```python
import numpy as np

print(np.clip(np.array([-5, 3, 12]), 0, 10))
```

```text
[ 0  3 10]
```

## Random numbers

### 71. Use a `Generator`, not the legacy global functions

`np.random.default_rng(seed)` is the recommended interface ([NumPy random docs](https://numpy.org/doc/stable/reference/random/index.html)). A seed makes results reproducible.

```python
import numpy as np

rng = np.random.default_rng(42)
print(rng.integers(0, 10, size=5))
print(rng.random(3).round(4))
```

```text
[0 7 6 4 4]
[0.6974 0.0942 0.9756]
```

### 72. Same seed, same numbers

```python
import numpy as np

a = np.random.default_rng(7).normal(size=3)
b = np.random.default_rng(7).normal(size=3)
print(np.array_equal(a, b))
```

```text
True
```

### 73. Sample from common distributions

```python
import numpy as np

rng = np.random.default_rng(0)
heights = rng.normal(loc=170, scale=10, size=100_000)
waits = rng.exponential(scale=5, size=100_000)
print(round(heights.mean(), 1), round(heights.std(), 1))
print(round(waits.mean(), 2))
```

```text
170.0 10.0
5.0
```

### 74. Random choice with probabilities

```python
import numpy as np

rng = np.random.default_rng(1)
draws = rng.choice(["win", "lose"], size=10_000, p=[0.3, 0.7])
print((draws == "win").mean())
```

```text
0.299
```

### 75. Shuffle and permute

`shuffle` reorders in place; `permutation` returns a shuffled copy. Shuffle indices to keep features and labels aligned.

```python
import numpy as np

rng = np.random.default_rng(3)
X = np.array([[1], [2], [3], [4]])
y = np.array([10, 20, 30, 40])
order = rng.permutation(len(y))
print(X[order].ravel(), y[order])
```

```text
[4 3 2 1] [40 30 20 10]
```

### 76. A train/test split by hand

```python
import numpy as np

rng = np.random.default_rng(0)
idx = rng.permutation(10)
train, test = idx[:8], idx[8:]
print(sorted(train.tolist()), sorted(test.tolist()))
```

```text
[0, 2, 3, 4, 5, 6, 7, 9] [1, 8]
```

### 77. Bootstrap a confidence interval

Resampling with replacement estimates how much a statistic would vary between samples.

```python
import numpy as np

rng = np.random.default_rng(0)
sample = rng.normal(50, 10, size=200)
boot_means = rng.choice(sample, size=(5_000, sample.size), replace=True).mean(axis=1)
low, high = np.percentile(boot_means, [2.5, 97.5])
print(round(sample.mean(), 2), round(low, 2), round(high, 2))
```

```text
50.15 48.78 51.47
```

### 78. Monte Carlo estimate of pi

The share of random points in the unit square that fall inside the quarter circle approaches $\pi/4$.

```python
import numpy as np

rng = np.random.default_rng(0)
pts = rng.random((1_000_000, 2))
inside = (pts ** 2).sum(axis=1) <= 1
print(4 * inside.mean())
```

```text
3.141168
```

## Linear algebra essentials

### 79. Matrix multiplication with `@`

`*` multiplies element by element; `@` is the matrix product.

```python
import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[0, 1], [1, 0]])
print(A * B)
print(A @ B)
```

```text
[[0 2]
 [3 0]]
[[2 1]
 [4 3]]
```

### 80. Solve a linear system

Use `np.linalg.solve` rather than computing an inverse; it is faster and more accurate. This solves $2x + y = 5$ and $x + 3y = 10$.

```python
import numpy as np

A = np.array([[2.0, 1.0], [1.0, 3.0]])
b = np.array([5.0, 10.0])
x = np.linalg.solve(A, b)
print(x, np.allclose(A @ x, b))
```

```text
[1. 3.] True
```

### 81. Least-squares line fit

`lstsq` finds the best-fitting coefficients when there are more equations than unknowns.

```python
import numpy as np

x = np.array([0, 1, 2, 3, 4], dtype=float)
y = np.array([1.1, 2.9, 5.2, 7.1, 8.8])
A = np.column_stack([x, np.ones_like(x)])
(slope, intercept), *_ = np.linalg.lstsq(A, y)
print(round(slope, 3), round(intercept, 3))
```

```text
1.96 1.1
```

### 82. Fit a polynomial with `Polynomial.fit`

The `numpy.polynomial` package is the recommended interface for polynomial fitting. Its coefficients run from the lowest power up, so the output below means $1 - x + 3x^2$.

```python
import numpy as np
from numpy.polynomial import Polynomial

x = np.linspace(-2, 2, 9)
y = 3 * x**2 - x + 1
p = Polynomial.fit(x, y, deg=2).convert()
print(p.coef.round(6))
```

```text
[ 1. -1.  3.]
```

### 83. Determinant, inverse and rank

```python
import numpy as np

A = np.array([[4.0, 7.0], [2.0, 6.0]])
print(round(np.linalg.det(A), 6))
print(np.linalg.inv(A))
print(np.linalg.matrix_rank(np.array([[1, 2], [2, 4]])))
```

```text
10.0
[[ 0.6 -0.7]
 [-0.2  0.4]]
1
```

### 84. Eigenvalues of a symmetric matrix

For symmetric matrices, `eigh` is faster and returns real, sorted eigenvalues.

```python
import numpy as np

S = np.array([[2.0, 1.0], [1.0, 2.0]])
vals, vecs = np.linalg.eigh(S)
print(vals)
print(np.allclose(S @ vecs, vecs * vals))
```

```text
[1. 3.]
True
```

### 85. Norms

```python
import numpy as np

v = np.array([3.0, 4.0])
print(np.linalg.norm(v), np.linalg.norm(v, 1), np.linalg.norm(v, np.inf))
```

```text
5.0 7.0 4.0
```

### 86. Batched products with `einsum`

`einsum` names each axis, which makes batched and multi-axis products explicit.

```python
import numpy as np

A = np.arange(2 * 2 * 3).reshape(2, 2, 3)
B = np.arange(2 * 3 * 2).reshape(2, 3, 2)
C = np.einsum("bij,bjk->bik", A, B)
print(C.shape, np.array_equal(C, A @ B))
print(np.einsum("ii", np.eye(3)))
```

```text
(2, 2, 2) True
3.0
```

## Floating point and numerical methods

### 87. Never compare floats with `==`

Many decimals have no exact binary representation. Compare with a tolerance using `np.isclose` or `np.allclose`.

```python
import numpy as np

print(0.1 + 0.2 == 0.3)
print(np.isclose(0.1 + 0.2, 0.3))
```

```text
False
True
```

### 88. Detect NaN and infinity

`NaN` is not equal to itself, so use `np.isnan`, `np.isinf` or `np.isfinite`.

```python
import numpy as np

x = np.array([1.0, np.nan, np.inf, -np.inf])
print(np.nan == np.nan)
print(np.isnan(x), np.isfinite(x))
```

```text
False
[False  True False False] [ True False False False]
```

### 89. Control floating-point warnings with `errstate`

Dividing by zero produces `inf` or `nan` plus a warning. `np.errstate` silences or escalates the warning locally.

```python
import numpy as np

with np.errstate(divide="ignore", invalid="ignore"):
    print(np.array([1.0, 0.0]) / 0.0)

with np.errstate(divide="raise"):
    try:
        np.array([1.0]) / 0.0
    except FloatingPointError as err:
        print("FloatingPointError:", err)
```

```text
[inf nan]
FloatingPointError: divide by zero encountered in divide
```

### 90. A numerically stable softmax

Subtracting the maximum before exponentiating gives the same result mathematically but avoids overflow.

```python
import numpy as np

def softmax(z):
    e = np.exp(z - z.max())
    return e / e.sum()

print(softmax(np.array([1000.0, 1001.0, 1002.0])).round(4))
```

```text
[0.09   0.2447 0.6652]
```

### 91. `log1p` and `expm1` for tiny values

For very small `x`, `log(1 + x)` loses precision because `1 + x` rounds to 1. `log1p` computes it accurately.

```python
import numpy as np

x = 1e-18
print(np.log(1 + x), np.log1p(x))
```

```text
0.0 1e-18
```

### 92. Summing many floats: `np.sum` uses pairwise summation

A running total (here `cumsum`, which adds one value at a time) accumulates rounding error, which is severe in `float32`. `np.sum` uses pairwise summation and stays much closer; `math.fsum` returns the correctly rounded sum.

```python
import math
import numpy as np

x = np.full(10_000_000, 0.1, dtype=np.float32)
print(np.cumsum(x)[-1])
print(np.sum(x))
print(math.fsum(x.tolist()))
```

```text
1.087937e+06
1.0000001e+06
1000000.0149011612
```

### 93. Numerical derivatives with `np.gradient`

`gradient` uses central differences in the interior and one-sided differences at the edges, so interior estimates are better than the end points. Compare with the true derivative, $\cos x$.

```python
import numpy as np

x = np.linspace(0, np.pi, 5)
y = np.sin(x)
print(np.gradient(y, x).round(3))
print(np.cos(x).round(3))
```

```text
[ 0.9    0.637  0.    -0.637 -0.9  ]
[ 1.     0.707  0.    -0.707 -1.   ]
```

### 94. Numerical integration with the trapezoid rule

NumPy 2 names this function `np.trapezoid` (the old `np.trapz` was deprecated). The exact integral of $\sin x$ from 0 to $\pi$ is 2.

```python
import numpy as np

x = np.linspace(0, np.pi, 1_001)
print(np.trapezoid(np.sin(x), x))
```

```text
1.9999983550656628
```

### 95. Linear interpolation with `np.interp`

```python
import numpy as np

hours = np.array([0, 6, 12, 18])
temp = np.array([8.0, 10.0, 18.0, 12.0])
print(np.interp([3, 9, 15], hours, temp))
```

```text
[ 9. 14. 15.]
```

### 96. Find polynomial roots

`np.roots` takes coefficients from the highest power down. Here: $x^2 - 5x + 6 = 0$.

```python
import numpy as np

print(np.sort(np.roots([1, -5, 6])))
```

```text
[2. 3.]
```

## Input, output and performance

### 97. Save and load arrays in NumPy's binary format

`.npy` stores one array exactly, including dtype and shape; `.npz` stores several.

```python
import numpy as np

a = np.arange(6).reshape(2, 3)
np.save("demo.npy", a)
np.savez_compressed("demo.npz", weights=a, bias=np.array([0.5]))
print(np.load("demo.npy"))
with np.load("demo.npz") as data:
    print(sorted(data.files), data["bias"])
```

```text
[[0 1 2]
 [3 4 5]]
['bias', 'weights'] [0.5]
```

### 98. Read and write text files

`savetxt` and `loadtxt` are fine for small numeric tables; use pandas for messy CSV files.

```python
import numpy as np

m = np.array([[1.5, 2.0], [3.25, 4.0]])
np.savetxt("demo.csv", m, delimiter=",", fmt="%.2f", header="a,b", comments="")
print(np.loadtxt("demo.csv", delimiter=",", skiprows=1))
```

```text
[[1.5  2.  ]
 [3.25 4.  ]]
```

### 99. Memory-map arrays larger than RAM

`np.memmap` keeps the data on disk and loads only the parts you touch.

```python
import numpy as np

mm = np.memmap("big.dat", dtype=np.float32, mode="w+", shape=(1_000, 1_000))
mm[0, :5] = [1, 2, 3, 4, 5]
mm.flush()
del mm

ro = np.memmap("big.dat", dtype=np.float32, mode="r", shape=(1_000, 1_000))
print(ro[0, :5], ro.shape)
```

```text
[1. 2. 3. 4. 5.] (1000, 1000)
```

### 100. Row-major layout and why it matters

NumPy stores arrays in row-major (C) order by default. Walking along the last axis touches neighbouring memory, so it is usually faster than walking down columns. `strides` shows how many bytes each step moves.

```python
import numpy as np

m = np.zeros((1_000, 1_000))
print(m.flags["C_CONTIGUOUS"], m.strides)
print(m.T.flags["C_CONTIGUOUS"], m.T.strides)
```

```text
True (8000, 8)
False (8, 8000)
```

### 101. Print arrays the way you want

`np.set_printoptions` (or the `np.printoptions` context manager) controls precision and suppresses scientific notation.

```python
import numpy as np

x = np.array([0.000012345, 123.456789])
print(x)
with np.printoptions(precision=3, suppress=True):
    print(x)
```

```text
[1.23450000e-05 1.23456789e+02]
[  0.    123.457]
```

## Common mistakes to avoid

- **Assuming a slice is a copy.** Slices are views; changing them changes the original (example 23).
- **Using `*` for matrix multiplication.** Use `@` (example 79).
- **Comparing floats with `==`.** Use `np.isclose` (example 87).
- **Ignoring integer overflow.** Small integer dtypes wrap around silently (example 15).
- **Using `arange` with float steps.** Use `linspace` when you need an exact number of points (example 5).
- **Forgetting `ddof=1`** when you want the sample standard deviation (example 58).
- **Using the legacy `np.random.seed` global state** in new code instead of `default_rng` (example 71).
- **Inverting a matrix to solve a system.** Call `np.linalg.solve` (example 80).

## Where to go next

- See how these ideas power machine learning in [101 linear algebra concepts for machine learning and AI](/articles/linear-algebra-concepts-for-machine-learning).
- Move from arrays to labeled tables with [100 pandas tips and tricks for data analysis](/articles/pandas-tips-and-tricks-for-data-analysis).
- Apply NumPy inside real models with [100 Python machine learning examples with real-world applications](/articles/python-machine-learning-examples).
- Review the statistics behind examples 58–69 in [100 probability and statistics examples](/articles/probability-statistics-real-world-examples).

## References

1. Harris, C. R., Millman, K. J., van der Walt, S. J., et al. (2020). "Array programming with NumPy." *Nature*, 585, 357–362. [doi.org/10.1038/s41586-020-2649-2](https://doi.org/10.1038/s41586-020-2649-2)
2. NumPy Developers. "NumPy user guide." [numpy.org](https://numpy.org/doc/stable/user/index.html)
3. NumPy Developers. "Broadcasting." [numpy.org](https://numpy.org/doc/stable/user/basics.broadcasting.html)
4. NumPy Developers. "Copies and views." [numpy.org](https://numpy.org/doc/stable/user/basics.copies.html)
5. NumPy Developers. "Random sampling (numpy.random)." [numpy.org](https://numpy.org/doc/stable/reference/random/index.html)
6. NumPy Developers. "NumPy 2.0 migration guide." [numpy.org](https://numpy.org/doc/stable/numpy_2_0_migration_guide.html)
7. NumPy Developers. "NumPy 2.3.0 release notes." [numpy.org](https://numpy.org/doc/stable/release/2.3.0-notes.html)
8. Goldberg, D. (1991). "What every computer scientist should know about floating-point arithmetic." *ACM Computing Surveys*, 23(1), 5–48. [doi.org/10.1145/103162.103163](https://doi.org/10.1145/103162.103163)
