---
title: 100 Best Pandas Tips and Tricks for Data Analysis
seoTitle: 100 Pandas Tips and Tricks for Data Analysis
description: 100 practical pandas tips for loading, cleaning, filtering, grouping, reshaping and speeding up data analysis, each with code and real output from pandas 3.0.
author: BlogAI Editors
authorType: Organization
publishedAt: 2026-10-17
updatedAt: 2026-10-17
status: published
categories:
  - Engineering
tags:
  - python
  - pandas
  - data analysis
  - data science
  - data cleaning
tocDepth: 2
---

Most pandas code that feels slow, confusing or fragile can be fixed with a small number of habits: load only what you need with the right types, select with `.loc`, replace loops with vectorized operations, and lean on `groupby`, `merge` and reshaping instead of hand-written bookkeeping. This guide collects 100 of those habits, grouped by the stage of an analysis where you would use them.

Every tip has a short, self-contained snippet you can paste into a notebook. The snippets were run with **pandas 3.0.3 and NumPy 2.3.5 on Python 3.13**, without PyArrow installed, and the output shown under each one is what it printed. If you are still on pandas 2.x, almost everything works the same; tips that depend on pandas 3 behavior say so.

**What changed in pandas 3.0.** pandas 3.0.0 was released on January 21, 2026. The two changes you will notice most are a dedicated string dtype (`str`) used by default for text columns, and Copy-on-Write, which makes every indexing result behave like a copy and ends "chained assignment" ([What's new in 3.0.0](https://pandas.pydata.org/docs/whatsnew/v3.0.0.html)). Tips 9, 95 and 96 show what that means in practice.

## Loading data the right way

### 1. Read only the columns you need with `usecols`

Skipping columns at read time saves memory and time, and it documents which fields your analysis depends on.

```python
import io
import pandas as pd

csv = io.StringIO("id,name,city,salary,notes\n1,Ana,Lisbon,52000,x\n2,Ben,Oslo,61000,y\n")
df = pd.read_csv(csv, usecols=["id", "city", "salary"])
print(df)
```

```text
   id    city  salary
0   1  Lisbon   52000
1   2    Oslo   61000
```

### 2. Set column types while reading

Passing `dtype` avoids a second conversion pass and stops pandas from guessing wrong, such as reading ZIP codes as integers and dropping their leading zeros.

```python
import io
import pandas as pd

csv = io.StringIO("zip,count\n02134,5\n10001,7\n")
print(pd.read_csv(csv)["zip"].tolist())
csv.seek(0)
print(pd.read_csv(csv, dtype={"zip": "str"})["zip"].tolist())
```

```text
[2134, 10001]
['02134', '10001']
```

### 3. Parse dates at load time

`parse_dates` converts the column to `datetime64` immediately, so date filtering and resampling work without an extra step.

```python
import io
import pandas as pd

csv = io.StringIO("day,sales\n2026-01-03,120\n2026-01-04,98\n")
df = pd.read_csv(csv, parse_dates=["day"])
print(df.dtypes)
```

```text
day      datetime64[us]
sales             int64
dtype: object
```

### 4. Peek at a large file with `nrows`

Read the first few rows to check the delimiter, header and types before committing to a full load.

```python
import io
import pandas as pd

rows = "\n".join(f"{i},{i * 2}" for i in range(100_000))
csv = io.StringIO("a,b\n" + rows)
preview = pd.read_csv(csv, nrows=3)
print(preview)
```

```text
   a  b
0  0  0
1  1  2
2  2  4
```

### 5. Process files bigger than memory with `chunksize`

With `chunksize`, `read_csv` returns an iterator of DataFrames. Aggregate each chunk and combine the partial results.

```python
import io
import pandas as pd

rows = "\n".join(f"{i % 3},{i}" for i in range(10_000))
csv = io.StringIO("group,value\n" + rows)

totals = None
for chunk in pd.read_csv(csv, chunksize=2_500):
    part = chunk.groupby("group")["value"].sum()
    totals = part if totals is None else totals.add(part, fill_value=0)
print(totals)
```

```text
group
0    16668333
1    16661667
2    16665000
Name: value, dtype: int64
```

### 6. Declare extra missing-value markers

Real files encode "missing" as `-`, `n/a`, `?` or `999`. Tell `read_csv` up front with `na_values`.

```python
import io
import pandas as pd

csv = io.StringIO("item,price\npen,1.5\ncup,-\nbag,n/a\n")
df = pd.read_csv(csv, na_values=["-", "n/a"])
print(df)
print(df["price"].dtype)
```

```text
  item  price
0  pen    1.5
1  cup    NaN
2  bag    NaN
float64
```

### 7. Handle thousands separators and decimal commas

European-style numbers such as `1.234,5` load as text unless you set `thousands` and `decimal`.

```python
import io
import pandas as pd

csv = io.StringIO("city;revenue\nBerlin;1.234,5\nMunich;12.000,0\n")
df = pd.read_csv(csv, sep=";", thousands=".", decimal=",")
print(df["revenue"].sum())
```

```text
13234.5
```

### 8. Build a DataFrame from a list of records

A list of dictionaries, such as rows from a JSON API, becomes a DataFrame directly. Missing keys become `NaN`.

```python
import pandas as pd

records = [
    {"user": "ana", "plan": "pro", "seats": 3},
    {"user": "ben", "plan": "free"},
]
print(pd.DataFrame.from_records(records))
```

```text
  user  plan  seats
0  ana   pro    3.0
1  ben  free    NaN
```

### 9. Know the pandas 3 string dtype

In pandas 3, text columns get the `str` dtype instead of `object`. It holds only strings and missing values, so code that checks `dtype == object` to find text columns needs updating; use `select_dtypes` (tip 14) or `pd.api.types.is_string_dtype` instead.

```python
import pandas as pd

s = pd.Series(["a", "b", None])
print(s.dtype)
print(s.dtype == object)
print(pd.api.types.is_string_dtype(s))
```

```text
str
False
True
```

### 10. Flatten nested JSON with `json_normalize`

Nested objects become dotted column names, which is far easier than unpacking dictionaries by hand.

```python
import pandas as pd

data = [
    {"id": 1, "user": {"name": "Ana", "address": {"city": "Lisbon"}}},
    {"id": 2, "user": {"name": "Ben", "address": {"city": "Oslo"}}},
]
print(pd.json_normalize(data))
```

```text
   id user.name user.address.city
0   1       Ana            Lisbon
1   2       Ben              Oslo
```

### 11. Read whitespace-aligned text with `sep=r"\s+"`

Whitespace-aligned text, such as console output pasted from a report, can be read by treating any run of spaces as the separator.

```python
import io
import pandas as pd

text = io.StringIO("name   score  grade\nAna      91      A\nBen      78      C\n")
print(pd.read_csv(text, sep=r"\s+"))
```

```text
  name  score grade
0  Ana     91     A
1  Ben     78     C
```

### 12. Write CSV without the index

`to_csv` writes the index as an unnamed first column by default. Unless the index carries meaning, turn it off so the file round-trips cleanly.

```python
import pandas as pd

df = pd.DataFrame({"a": [1, 2], "b": ["x", "y"]})
print(df.to_csv(index=False))
```

```text
a,b
1,x
2,y

```

## Inspecting a new dataset

### 13. Get the shape, types and missing counts with `info`

`info()` prints row count, each column's non-null count and dtype, and memory use in one call.

```python
import pandas as pd

df = pd.DataFrame({"age": [31, None, 45], "city": ["Lisbon", "Oslo", None]})
df.info()
```

```text
<class 'pandas.DataFrame'>
RangeIndex: 3 entries, 0 to 2
Data columns (total 2 columns):
 #   Column  Non-Null Count  Dtype  
---  ------  --------------  -----  
 0   age     2 non-null      float64
 1   city    2 non-null      str    
dtypes: float64(1), str(1)
memory usage: 180.0 bytes
```

### 14. Select columns by type with `select_dtypes`

Grab all numeric or all text columns without listing names, which keeps code working when columns are added.

```python
import pandas as pd

df = pd.DataFrame({"id": [1, 2], "name": ["a", "b"], "score": [9.5, 7.0]})
print(df.select_dtypes(include="number").columns.tolist())
print(df.select_dtypes(include="str").columns.tolist())
```

```text
['id', 'score']
['name']
```

### 15. Summarize text columns with `describe(include="all")`

By default `describe` covers only numeric columns. `include="all"` adds count, unique values, the most frequent value and its frequency for text columns.

```python
import pandas as pd

df = pd.DataFrame({"city": ["Oslo", "Oslo", "Rome"], "temp": [3.0, 5.0, 14.0]})
print(df.describe(include="all"))
```

```text
        city       temp
count      3   3.000000
unique     2        NaN
top     Oslo        NaN
freq       2        NaN
mean     NaN   7.333333
std      NaN   5.859465
min      NaN   3.000000
25%      NaN   4.000000
50%      NaN   5.000000
75%      NaN   9.500000
max      NaN  14.000000
```

### 16. Count missing values per column, sorted

Chaining `isna().sum()` with `sort_values` puts the worst columns first.

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({"a": [1, np.nan, 3], "b": [np.nan, np.nan, 1], "c": [1, 2, 3]})
print(df.isna().sum().sort_values(ascending=False))
```

```text
b    2
a    1
c    0
dtype: int64
```

### 17. Get missing values as a percentage

`isna().mean()` gives the share of missing values because `True` counts as 1.

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({"a": [1, np.nan, 3, 4], "b": [np.nan, np.nan, 1, 2]})
print((df.isna().mean() * 100).round(1))
```

```text
a    25.0
b    50.0
dtype: float64
```

### 18. Count categories with proportions

`value_counts(normalize=True)` returns shares instead of counts; `dropna=False` keeps missing values visible instead of silently dropping them.

```python
import pandas as pd

s = pd.Series(["pro", "free", "free", None, "free"])
print(s.value_counts(normalize=True, dropna=False))
```

```text
free    0.6
pro     0.2
NaN     0.2
Name: proportion, dtype: float64
```

### 19. Count combinations of columns

`DataFrame.value_counts` counts unique row combinations, a quick way to see how two categorical fields interact.

```python
import pandas as pd

df = pd.DataFrame({"plan": ["pro", "free", "free", "pro"], "region": ["EU", "EU", "US", "EU"]})
print(df.value_counts(["plan", "region"]))
```

```text
plan  region
pro   EU        2
free  EU        1
      US        1
Name: count, dtype: int64
```

### 20. Count distinct values with `nunique`

High-cardinality columns, such as IDs, are rarely useful as categories. `nunique` flags them.

```python
import pandas as pd

df = pd.DataFrame({"id": [1, 2, 3, 4], "country": ["PT", "PT", "NO", "PT"]})
print(df.nunique())
```

```text
id         4
country    2
dtype: int64
```

### 21. Look at a random sample, not just the head

The first rows of a file are often unrepresentative (sorted by date, say). `sample` with a fixed `random_state` is reproducible.

```python
import pandas as pd

df = pd.DataFrame({"x": range(100)})
print(df.sample(n=3, random_state=42))
```

```text
     x
83  83
53  53
70  70
```

### 22. Measure true memory use with `deep=True`

Without `deep=True`, pandas only counts pointer sizes for Python-object-backed columns and underestimates text-heavy data.

```python
import pandas as pd

df = pd.DataFrame({"city": ["Lisbon", "Oslo", "Rome"] * 1000})
print(df.memory_usage(deep=False)["city"])
print(df.memory_usage(deep=True)["city"])
```

```text
24000
161000
```

## Selecting and filtering

### 23. Use `.loc` for labels and `.iloc` for positions

Mixing them is the most common source of off-by-one bugs. `.loc` slices *include* the end label; `.iloc` slices exclude it, like Python lists.

```python
import pandas as pd

df = pd.DataFrame({"v": [10, 20, 30, 40]}, index=[1, 2, 3, 4])
print(df.loc[1:3, "v"].tolist())
print(df.iloc[1:3, 0].tolist())
```

```text
[10, 20, 30]
[20, 30]
```

### 24. Combine conditions with `&`, `|` and parentheses

Python's `and`/`or` do not work element-wise. Use `&`, `|` and `~`, and wrap each comparison in parentheses because of operator precedence.

```python
import pandas as pd

df = pd.DataFrame({"age": [22, 35, 41, 19], "city": ["Oslo", "Rome", "Oslo", "Rome"]})
print(df[(df["age"] > 20) & (df["city"] == "Oslo")])
```

```text
   age  city
0   22  Oslo
2   41  Oslo
```

### 25. Filter with `query` for readable conditions

`query` reads like SQL and can reference Python variables with `@`.

```python
import pandas as pd

df = pd.DataFrame({"age": [22, 35, 41, 19], "city": ["Oslo", "Rome", "Oslo", "Rome"]})
min_age = 30
print(df.query("age >= @min_age and city == 'Oslo'"))
```

```text
   age  city
2   41  Oslo
```

### 26. Test membership with `isin`

`isin` replaces long chains of `==` comparisons joined with `|`.

```python
import pandas as pd

df = pd.DataFrame({"country": ["PT", "NO", "IT", "ES"], "sales": [5, 3, 8, 2]})
print(df[df["country"].isin(["PT", "ES"])])
```

```text
  country  sales
0      PT      5
3      ES      2
```

### 27. Filter a range with `between`

`between` is inclusive on both ends by default; change it with `inclusive="left"`, `"right"` or `"neither"`.

```python
import pandas as pd

s = pd.Series([5, 10, 15, 20])
print(s[s.between(10, 15)].tolist())
print(s[s.between(10, 15, inclusive="left")].tolist())
```

```text
[10, 15]
[10]
```

### 28. Get the top or bottom rows with `nlargest` and `nsmallest`

These are faster and clearer than sorting the whole frame and calling `head`.

```python
import pandas as pd

df = pd.DataFrame({"product": list("abcde"), "revenue": [120, 340, 90, 510, 230]})
print(df.nlargest(2, "revenue"))
```

```text
  product  revenue
3       d      510
1       b      340
```

### 29. Find the row label of the maximum with `idxmax`

`idxmax` and `idxmin` return the index label, which you can then pass to `.loc`.

```python
import pandas as pd

df = pd.DataFrame({"temp": [12.5, 19.1, 15.3]}, index=["Mon", "Tue", "Wed"])
hottest = df["temp"].idxmax()
print(hottest, df.loc[hottest, "temp"])
```

```text
Tue 19.1
```

### 30. Filter inside a method chain with a callable

`.loc` accepts a function of the DataFrame, so you can filter on a column created earlier in the same chain.

```python
import pandas as pd

df = pd.DataFrame({"price": [10, 25, 40], "qty": [3, 1, 2]})
result = df.assign(total=lambda d: d["price"] * d["qty"]).loc[lambda d: d["total"] > 30]
print(result)
```

```text
   price  qty  total
2     40    2     80
```

### 31. Select columns by name pattern with `filter`

`filter(like=...)` or `filter(regex=...)` picks columns whose names match, handy for wide survey or sensor data.

```python
import pandas as pd

df = pd.DataFrame(columns=["id", "q1_score", "q2_score", "q1_time", "notes"])
print(df.filter(like="score").columns.tolist())
print(df.filter(regex=r"^q1_").columns.tolist())
```

```text
['q1_score', 'q2_score']
['q1_score', 'q1_time']
```

### 32. Use `at` for fast single-value access

`.at` (labels) and `.iat` (positions) are optimized for reading or writing one scalar.

```python
import pandas as pd

df = pd.DataFrame({"score": [88, 92]}, index=["ana", "ben"])
df.at["ben", "score"] = 95
print(df.at["ben", "score"])
```

```text
95
```

### 33. Keep the shape with `where` and `mask`

`where` keeps values where the condition is true and replaces the rest; `mask` does the opposite. Neither drops rows.

```python
import pandas as pd

s = pd.Series([3, -1, 7, -4])
print(s.where(s > 0, 0).tolist())
print(s.mask(s > 0, 0).tolist())
```

```text
[3, 0, 7, 0]
[0, -1, 0, -4]
```

### 34. Filter rows that contain text

`str.contains` with `case=False` matches regardless of capitalization. Use `regex=False` when searching for characters such as `.` or `+` literally.

```python
import pandas as pd

s = pd.Series(["Data Science", "data engineering", "Biology", "C++ basics"])
print(s[s.str.contains("data", case=False)].tolist())
print(s[s.str.contains("C++", regex=False)].tolist())
```

```text
['Data Science', 'data engineering']
['C++ basics']
```

### 35. Drop columns by name safely

`drop(columns=...)` is clearer than `axis=1`; `errors="ignore"` stops it failing when a column is already gone.

```python
import pandas as pd

df = pd.DataFrame({"a": [1], "b": [2], "tmp": [0]})
print(df.drop(columns=["tmp", "not_there"], errors="ignore").columns.tolist())
```

```text
['a', 'b']
```

### 36. Reorder columns by list

Index with a list to reorder, which also documents the column order expected by downstream code.

```python
import pandas as pd

df = pd.DataFrame({"b": [2], "c": [3], "a": [1]})
print(df[["a", "b", "c"]])
```

```text
   a  b  c
0  1  2  3
```

## Cleaning data

### 37. Normalize column names in one line

Strip spaces, lower-case and replace separators so every column is a valid, predictable identifier.

```python
import pandas as pd

df = pd.DataFrame(columns=[" First Name", "Last-Name ", "Total Sales ($)"])
df.columns = (
    df.columns.str.strip()
    .str.lower()
    .str.replace(r"[^a-z0-9]+", "_", regex=True)
    .str.strip("_")
)
print(df.columns.tolist())
```

```text
['first_name', 'last_name', 'total_sales']
```

### 38. Rename specific columns with a dictionary

`rename(columns=...)` changes only the names you list and leaves the rest alone.

```python
import pandas as pd

df = pd.DataFrame({"amt": [1], "dt": ["2026-01-01"]})
print(df.rename(columns={"amt": "amount", "dt": "date"}).columns.tolist())
```

```text
['amount', 'date']
```

### 39. Drop rows only when key columns are missing

`dropna(subset=...)` targets the columns that matter; dropping on any missing value often throws away good data.

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({"id": [1, 2, np.nan], "email": ["a@x.io", np.nan, "c@x.io"]})
print(df.dropna(subset=["id"]))
```

```text
    id   email
0  1.0  a@x.io
1  2.0     NaN
```

### 40. Keep rows with enough data using `thresh`

`thresh=n` keeps rows with at least `n` non-missing values.

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({"a": [1, np.nan, np.nan], "b": [2, 5, np.nan], "c": [3, 6, 9]})
print(df.dropna(thresh=2))
```

```text
     a    b  c
0  1.0  2.0  3
1  NaN  5.0  6
```

### 41. Fill missing values per column

`fillna` accepts a dictionary, so each column can get a sensible default.

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({"qty": [1, np.nan, 3], "note": ["ok", None, None]})
print(df.fillna({"qty": 0, "note": "none"}))
```

```text
   qty  note
0  1.0    ok
1  0.0  none
2  3.0  none
```

### 42. Fill with the group mean using `transform`

Filling a missing price with the average of the same category is usually better than the global average.

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    "cat": ["fruit", "fruit", "veg", "veg"],
    "price": [2.0, np.nan, 1.0, 3.0],
})
df["price"] = df["price"].fillna(df.groupby("cat")["price"].transform("mean"))
print(df)
```

```text
     cat  price
0  fruit    2.0
1  fruit    2.0
2    veg    1.0
3    veg    3.0
```

### 43. Forward-fill with a limit

In time series, carrying the last value forward is common, but `limit` stops a single reading from covering a long outage.

```python
import pandas as pd
import numpy as np

s = pd.Series([10, np.nan, np.nan, np.nan, 14])
print(s.ffill(limit=1).tolist())
```

```text
[10.0, 10.0, nan, nan, 14.0]
```

### 44. Interpolate gaps in numeric series

`interpolate` estimates missing values from neighbors. Linear interpolation is the default; with a `DatetimeIndex`, `method="time"` weights by the actual time gaps.

```python
import pandas as pd
import numpy as np

s = pd.Series([1.0, np.nan, np.nan, 4.0])
print(s.interpolate().tolist())
```

```text
[1.0, 2.0, 3.0, 4.0]
```

### 45. Find and remove duplicates on a key

`duplicated(subset=..., keep=False)` marks every copy, which is what you want when reviewing duplicates. `drop_duplicates(keep="last")` keeps the most recent one.

```python
import pandas as pd

df = pd.DataFrame({"email": ["a@x.io", "b@x.io", "a@x.io"], "version": [1, 1, 2]})
print(df[df.duplicated(subset="email", keep=False)])
print(df.drop_duplicates(subset="email", keep="last"))
```

```text
    email  version
0  a@x.io        1
2  a@x.io        2
    email  version
1  b@x.io        1
2  a@x.io        2
```

### 46. Replace several values at once

`replace` with a dictionary maps many raw codes to clean values in one call.

```python
import pandas as pd

s = pd.Series(["Y", "N", "yes", "no", "Y"])
print(s.replace({"Y": "yes", "N": "no"}).tolist())
```

```text
['yes', 'no', 'yes', 'no', 'yes']
```

### 47. Convert messy numbers with `to_numeric(errors="coerce")`

Values that cannot be parsed become `NaN` instead of raising an error. Count them afterwards so bad data is not hidden.

```python
import pandas as pd

s = pd.Series(["12", "7.5", "n/a", "1,200"])
clean = pd.to_numeric(s.str.replace(",", ""), errors="coerce")
print(clean.tolist())
print("unparsed:", clean.isna().sum())
```

```text
[12.0, 7.5, nan, 1200.0]
unparsed: 1
```

### 48. Cap outliers with `clip`

`clip` limits values to a range, such as a valid percentage between 0 and 100. On larger samples, clipping at percentiles (winsorizing) keeps a few extreme values from dominating averages.

```python
import pandas as pd

pct = pd.Series([-3, 45, 88, 102, 67])
print(pct.clip(lower=0, upper=100).tolist())

s = pd.Series(range(1, 101)).astype(float)
s.iloc[-1] = 10_000
low, high = s.quantile([0.01, 0.99])
print(round(s.mean(), 1), round(s.clip(low, high).mean(), 1))
```

```text
[0, 45, 88, 100, 67]
149.5 51.5
```

### 49. Use nullable integers to keep integers with missing values

A missing value turns an integer column into floats. The nullable `Int64` dtype (capital I) keeps integers and shows `<NA>`.

```python
import pandas as pd

s = pd.Series([1, None, 3])
print(s.dtype, s.tolist())
print(s.astype("Int64").tolist())
```

```text
float64 [1.0, nan, 3.0]
[1, <NA>, 3]
```

### 50. Let pandas pick the best types with `convert_dtypes`

`convert_dtypes` switches columns to nullable dtypes that support missing values consistently.

```python
import pandas as pd

df = pd.DataFrame({"n": [1.0, 2.0, None], "flag": [True, False, None]})
print(df.dtypes.to_dict())
print(df.convert_dtypes().dtypes.to_dict())
```

```text
{'n': dtype('float64'), 'flag': dtype('O')}
{'n': Int64Dtype(), 'flag': BooleanDtype}
```

## Text and categorical data

### 51. Chain string cleaning with the `.str` accessor

`.str` applies Python string methods to a whole column and propagates missing values instead of failing.

```python
import pandas as pd

s = pd.Series(["  Alice ", "BOB", None, "carol  "])
print(s.str.strip().str.title().tolist())
```

```text
['Alice', 'Bob', nan, 'Carol']
```

### 52. Split a column into several columns

`str.split(expand=True)` returns a DataFrame. `n=1` splits only on the first separator.

```python
import pandas as pd

s = pd.Series(["Ana Silva", "Ben van Dijk"])
print(s.str.split(" ", n=1, expand=True).set_axis(["first", "last"], axis=1))
```

```text
  first      last
0   Ana     Silva
1   Ben  van Dijk
```

### 53. Extract parts of text with named regex groups

Named groups in `str.extract` become column names.

```python
import pandas as pd

s = pd.Series(["order-2026-001", "order-2025-114"])
print(s.str.extract(r"order-(?P<year>\d{4})-(?P<num>\d+)"))
```

```text
   year  num
0  2026  001
1  2025  114
```

### 54. Find all matches with `str.findall`

`findall` returns a list per row, useful for hashtags, mentions or codes.

```python
import pandas as pd

s = pd.Series(["Loving #pandas and #python", "No tags here"])
print(s.str.findall(r"#(\w+)").tolist())
```

```text
[['pandas', 'python'], []]
```

### 55. Turn lists into rows with `explode`

After `findall` or `split`, `explode` gives one row per list element and repeats the other columns.

```python
import pandas as pd

df = pd.DataFrame({"post": [1, 2], "tags": [["pandas", "python"], ["sql"]]})
print(df.explode("tags", ignore_index=True))
```

```text
   post    tags
0     1  pandas
1     1  python
2     2     sql
```

### 56. One-hot encode delimited tags with `str.get_dummies`

A column like `"red|blue"` becomes one indicator column per tag.

```python
import pandas as pd

s = pd.Series(["red|blue", "blue", "green|red"])
print(s.str.get_dummies(sep="|"))
```

```text
   blue  green  red
0     1      0    1
1     1      0    0
2     0      1    1
```

### 57. Save memory with the `category` dtype

Columns with few distinct values repeated many times use far less memory as categoricals.

```python
import pandas as pd

s = pd.Series(["low", "medium", "high"] * 10_000)
print(s.memory_usage(deep=True))
print(s.astype("category").memory_usage(deep=True))
```

```text
1600132
30292
```

### 58. Give categories an order

An ordered categorical sorts and compares in the order you define instead of alphabetically.

```python
import pandas as pd

sizes = pd.Categorical(["M", "S", "L", "S"], categories=["S", "M", "L"], ordered=True)
s = pd.Series(sizes)
print(s.sort_values().tolist())
print((s > "S").tolist())
```

```text
['S', 'S', 'M', 'L']
[True, False, True, False]
```

### 59. Bin numbers into labeled ranges with `cut`

`cut` uses fixed edges you choose. By default bins are closed on the right, so `(18, 35]` includes 35.

```python
import pandas as pd

ages = pd.Series([15, 22, 35, 47, 70])
print(pd.cut(ages, bins=[0, 18, 35, 60, 120], labels=["child", "young", "adult", "senior"]).tolist())
```

```text
['child', 'young', 'young', 'adult', 'senior']
```

### 60. Bin into equal-sized groups with `qcut`

`qcut` uses quantiles, so each bin holds roughly the same number of rows, which is useful for deciles and quartiles.

```python
import pandas as pd

spend = pd.Series([5, 12, 20, 33, 41, 58, 75, 90])
print(pd.qcut(spend, q=4, labels=["Q1", "Q2", "Q3", "Q4"]).tolist())
```

```text
['Q1', 'Q1', 'Q2', 'Q2', 'Q3', 'Q3', 'Q4', 'Q4']
```

## Dates and time series

### 61. Parse dates with an explicit format

An explicit `format` is faster and avoids day/month ambiguity. `errors="coerce"` turns bad values into `NaT`.

```python
import pandas as pd

s = pd.Series(["03/04/2026", "31/12/2026", "not a date"])
print(pd.to_datetime(s, format="%d/%m/%Y", errors="coerce").tolist())
```

```text
[Timestamp('2026-04-03 00:00:00'), Timestamp('2026-12-31 00:00:00'), NaT]
```

### 62. Pull date parts with the `.dt` accessor

```python
import pandas as pd

s = pd.Series(pd.to_datetime(["2026-10-16", "2026-12-25"]))
print(pd.DataFrame({
    "year": s.dt.year,
    "month": s.dt.month,
    "weekday": s.dt.day_name(),
    "quarter": s.dt.quarter,
}))
```

```text
   year  month weekday  quarter
0  2026     10  Friday        4
1  2026     12  Friday        4
```

### 63. Know the default datetime resolution in pandas 3

pandas 3 infers microsecond resolution (`datetime64[us]`) for most inputs, where earlier versions always used nanoseconds. This avoids out-of-bounds errors for dates before 1678 or after 2262 ([What's new in 3.0.0](https://pandas.pydata.org/docs/whatsnew/v3.0.0.html)).

```python
import pandas as pd

s = pd.Series(pd.to_datetime(["1500-01-01", "2026-10-16", "3000-01-01"]))
print(s.dtype)
print(s.tolist())
```

```text
datetime64[us]
[Timestamp('1500-01-01 00:00:00'), Timestamp('2026-10-16 00:00:00'), Timestamp('3000-01-01 00:00:00')]
```

### 64. Generate date ranges with `date_range`

Frequency aliases include `D` (day), `W-MON` (weekly on Monday), `MS` (month start) and `ME` (month end).

```python
import pandas as pd

print(pd.date_range("2026-01-01", periods=4, freq="MS").strftime("%Y-%m-%d").tolist())
print(pd.date_range("2026-01-01", periods=3, freq="W-MON").strftime("%Y-%m-%d").tolist())
```

```text
['2026-01-01', '2026-02-01', '2026-03-01', '2026-04-01']
['2026-01-05', '2026-01-12', '2026-01-19']
```

### 65. Resample to a lower frequency

`resample` is `groupby` for time. Here daily sales become monthly totals.

```python
import pandas as pd
import numpy as np

idx = pd.date_range("2026-01-01", "2026-03-31", freq="D")
sales = pd.Series(np.arange(len(idx)), index=idx)
print(sales.resample("ME").sum())
```

```text
2026-01-31     465
2026-02-28    1246
2026-03-31    2294
Freq: ME, dtype: int64
```

### 66. Smooth noisy series with rolling windows

A rolling mean over a time-based window (`"7D"`) handles missing days correctly; a count-based window (`7`) does not.

```python
import pandas as pd

idx = pd.to_datetime(["2026-01-01", "2026-01-02", "2026-01-05", "2026-01-06"])
s = pd.Series([10, 20, 30, 40], index=idx)
print(s.rolling("3D").mean())
```

```text
2026-01-01    10.0
2026-01-02    15.0
2026-01-05    30.0
2026-01-06    35.0
dtype: float64
```

### 67. Compute period-over-period change

`diff` gives the absolute change and `pct_change` the relative change from the previous row.

```python
import pandas as pd

revenue = pd.Series([100, 120, 90, 135], index=["Q1", "Q2", "Q3", "Q4"])
print(pd.DataFrame({"diff": revenue.diff(), "pct": revenue.pct_change().round(3)}))
```

```text
    diff   pct
Q1   NaN   NaN
Q2  20.0  0.20
Q3 -30.0 -0.25
Q4  45.0  0.50
```

### 68. Compare with the same period last year using `shift`

`shift(n)` moves values down `n` rows, so you can line up each value with an earlier one.

```python
import pandas as pd

idx = pd.date_range("2025-01-01", periods=24, freq="MS")
s = pd.Series(range(100, 124), index=idx)
yoy = (s / s.shift(12) - 1).dropna()
print(yoy.head(3).round(3))
```

```text
2026-01-01    0.120
2026-02-01    0.119
2026-03-01    0.118
Freq: MS, dtype: float64
```

### 69. Fill missing dates with `asfreq`

`asfreq` exposes gaps in an irregular series by inserting the missing timestamps.

```python
import pandas as pd

idx = pd.to_datetime(["2026-01-01", "2026-01-02", "2026-01-04"])
s = pd.Series([5, 6, 8], index=idx)
print(s.asfreq("D"))
```

```text
2026-01-01    5.0
2026-01-02    6.0
2026-01-03    NaN
2026-01-04    8.0
Freq: D, dtype: float64
```

### 70. Work with time zones explicitly

`tz_localize` attaches a zone to naive timestamps; `tz_convert` converts between zones. Store data in UTC and convert only for display.

```python
import pandas as pd

ts = pd.Series(pd.to_datetime(["2026-07-01 09:00", "2026-12-01 09:00"]))
utc = ts.dt.tz_localize("UTC")
print(utc.dt.tz_convert("Europe/Lisbon").tolist())
```

```text
[Timestamp('2026-07-01 10:00:00+0100', tz='Europe/Lisbon'), Timestamp('2026-12-01 09:00:00+0000', tz='Europe/Lisbon')]
```

### 71. Select rows by date string with a `DatetimeIndex`

Partial date strings select whole months or years.

```python
import pandas as pd

idx = pd.date_range("2026-01-30", periods=5, freq="D")
s = pd.Series(range(5), index=idx)
print(s.loc["2026-02"])
```

```text
2026-02-01    2
2026-02-02    3
2026-02-03    4
Freq: D, dtype: int64
```

### 72. Calculate durations with `Timedelta`

Subtracting dates gives a `Timedelta`; `.dt.days` or division by `pd.Timedelta(hours=1)` converts it to a number.

```python
import pandas as pd

df = pd.DataFrame({
    "start": pd.to_datetime(["2026-01-01 08:00", "2026-01-02 22:30"]),
    "end": pd.to_datetime(["2026-01-01 17:30", "2026-01-03 06:00"]),
})
print(((df["end"] - df["start"]) / pd.Timedelta(hours=1)).tolist())
```

```text
[9.5, 7.5]
```

## Grouping and aggregation

### 73. Use named aggregation for clean output columns

Named aggregation sets output column names directly and avoids a MultiIndex in the columns.

```python
import pandas as pd

df = pd.DataFrame({"team": ["a", "a", "b"], "points": [10, 14, 7], "games": [1, 1, 1]})
print(df.groupby("team").agg(total=("points", "sum"), avg=("points", "mean"), games=("games", "count")))
```

```text
      total   avg  games
team                    
a        24  12.0      2
b         7   7.0      1
```

### 74. Add group statistics to every row with `transform`

`transform` returns a result the same length as the input, so you can compare each row to its group.

```python
import pandas as pd

df = pd.DataFrame({"team": ["a", "a", "b", "b"], "points": [10, 14, 7, 9]})
df["share"] = df["points"] / df.groupby("team")["points"].transform("sum")
print(df.round(3))
```

```text
  team  points  share
0    a      10  0.417
1    a      14  0.583
2    b       7  0.438
3    b       9  0.562
```

### 75. Keep whole groups with `filter`

`groupby(...).filter` keeps or drops entire groups based on a condition, such as customers with at least two orders.

```python
import pandas as pd

df = pd.DataFrame({"customer": ["x", "y", "y", "z", "z", "z"], "amount": [5, 3, 4, 1, 2, 3]})
print(df.groupby("customer").filter(lambda g: len(g) >= 2)["customer"].unique().tolist())
```

```text
['y', 'z']
```

### 76. Number rows within each group with `cumcount`

Useful for "first order", "second order" and similar sequence features.

```python
import pandas as pd

df = pd.DataFrame({"customer": ["x", "y", "x", "x", "y"]})
df["order_no"] = df.groupby("customer").cumcount() + 1
print(df)
```

```text
  customer  order_no
0        x         1
1        y         1
2        x         2
3        x         3
4        y         2
```

### 77. Take the latest row per group

Sort, then `groupby(...).tail(1)` (or `head(1)`) keeps one row per group with all its columns.

```python
import pandas as pd

df = pd.DataFrame({
    "user": ["a", "a", "b", "b"],
    "ts": pd.to_datetime(["2026-01-01", "2026-03-01", "2026-02-01", "2026-01-15"]),
    "status": ["trial", "paid", "paid", "trial"],
})
print(df.sort_values("ts").groupby("user").tail(1).sort_values("user"))
```

```text
  user         ts status
1    a 2026-03-01   paid
2    b 2026-02-01   paid
```

### 78. Get the top n rows per group

Sort by the value, then `groupby(...).head(n)`.

```python
import pandas as pd

df = pd.DataFrame({
    "region": ["N", "N", "N", "S", "S"],
    "rep": ["a", "b", "c", "d", "e"],
    "sales": [50, 80, 65, 40, 90],
})
print(df.sort_values("sales", ascending=False).groupby("region").head(2).sort_values(["region", "sales"]))
```

```text
  region rep  sales
2      N   c     65
1      N   b     80
3      S   d     40
4      S   e     90
```

### 79. Compute running totals per group

`cumsum` after `groupby` restarts the running total for each group.

```python
import pandas as pd

df = pd.DataFrame({"store": ["a", "a", "b", "a", "b"], "sales": [1, 2, 3, 4, 5]})
df["running"] = df.groupby("store")["sales"].cumsum()
print(df)
```

```text
  store  sales  running
0     a      1        1
1     a      2        3
2     b      3        3
3     a      4        7
4     b      5        8
```

### 80. Rank within groups

`rank(method="dense")` gives ties the same rank without gaps.

```python
import pandas as pd

df = pd.DataFrame({"class": ["a", "a", "a", "b"], "score": [90, 85, 90, 70]})
df["rank"] = df.groupby("class")["score"].rank(method="dense", ascending=False)
print(df)
```

```text
  class  score  rank
0     a     90   1.0
1     a     85   2.0
2     a     90   1.0
3     b     70   1.0
```

### 81. Group by time and another key with `pd.Grouper`

`pd.Grouper(key=..., freq=...)` resamples inside a `groupby`.

```python
import pandas as pd

df = pd.DataFrame({
    "day": pd.to_datetime(["2026-01-05", "2026-01-20", "2026-02-03", "2026-02-10"]),
    "shop": ["a", "a", "a", "b"],
    "sales": [10, 15, 20, 5],
})
print(df.groupby(["shop", pd.Grouper(key="day", freq="MS")])["sales"].sum())
```

```text
shop  day       
a     2026-01-01    25
      2026-02-01    20
b     2026-02-01     5
Name: sales, dtype: int64
```

### 82. Keep group keys as columns with `as_index=False`

Without it, group keys move into the index, which often needs a `reset_index` afterwards.

```python
import pandas as pd

df = pd.DataFrame({"team": ["a", "a", "b"], "points": [10, 14, 7]})
print(df.groupby("team", as_index=False)["points"].sum())
```

```text
  team  points
0    a      24
1    b       7
```

### 83. Apply different functions to different columns

Pass a dictionary to `agg` to choose a function per column.

```python
import pandas as pd

df = pd.DataFrame({"team": ["a", "a", "b"], "points": [10, 14, 7], "player": ["x", "y", "z"]})
print(df.groupby("team").agg({"points": "max", "player": "nunique"}))
```

```text
      points  player
team                
a         14       2
b          7       1
```

### 84. Flatten MultiIndex columns after aggregation

When you aggregate several functions without naming them, join the column levels into single names.

```python
import pandas as pd

df = pd.DataFrame({"team": ["a", "a", "b"], "points": [10, 14, 7]})
out = df.groupby("team").agg({"points": ["sum", "mean"]})
out.columns = ["_".join(col) for col in out.columns]
print(out.reset_index())
```

```text
  team  points_sum  points_mean
0    a          24         12.0
1    b           7          7.0
```

## Reshaping and combining

### 85. Summarize with `pivot_table` and totals

`margins=True` adds row and column totals; `fill_value` replaces empty cells.

```python
import pandas as pd

df = pd.DataFrame({
    "region": ["N", "N", "S", "S"],
    "product": ["x", "y", "x", "x"],
    "sales": [10, 20, 30, 40],
})
print(pd.pivot_table(df, index="region", columns="product", values="sales",
                     aggfunc="sum", fill_value=0, margins=True))
```

```text
product   x   y  All
region              
N        10  20   30
S        70   0   70
All      80  20  100
```

### 86. Build frequency tables with `crosstab`

`normalize="index"` turns counts into row percentages.

```python
import pandas as pd

df = pd.DataFrame({"plan": ["free", "free", "pro", "pro", "pro"], "churned": [1, 0, 0, 0, 1]})
print(pd.crosstab(df["plan"], df["churned"], normalize="index").round(2))
```

```text
churned     0     1
plan               
free     0.50  0.50
pro      0.67  0.33
```

### 87. Turn wide data into long data with `melt`

Long ("tidy") data, with one observation per row, is what `groupby`, plotting libraries and many models expect.

```python
import pandas as pd

wide = pd.DataFrame({"city": ["Oslo", "Rome"], "2025": [5, 9], "2026": [6, 11]})
print(wide.melt(id_vars="city", var_name="year", value_name="visitors"))
```

```text
   city  year  visitors
0  Oslo  2025         5
1  Rome  2025         9
2  Oslo  2026         6
3  Rome  2026        11
```

### 88. Turn long data back into wide data with `pivot`

`pivot` is the inverse of `melt`. It raises an error if an index/column pair appears twice; use `pivot_table` with an `aggfunc` in that case.

```python
import pandas as pd

long = pd.DataFrame({"city": ["Oslo", "Oslo", "Rome"], "year": [2025, 2026, 2025], "visitors": [5, 6, 9]})
print(long.pivot(index="city", columns="year", values="visitors"))
```

```text
year  2025  2026
city            
Oslo   5.0   6.0
Rome   9.0   NaN
```

### 89. Check join keys with `validate`

`validate="many_to_one"` raises an error if the right table has duplicate keys, which would otherwise silently multiply rows.

```python
import pandas as pd

orders = pd.DataFrame({"cust": [1, 1, 2], "amount": [5, 7, 3]})
customers = pd.DataFrame({"cust": [1, 2, 2], "name": ["Ana", "Ben", "Ben (dup)"]})
try:
    orders.merge(customers, on="cust", validate="many_to_one")
except pd.errors.MergeError as err:
    print("MergeError:", str(err).splitlines()[0])
```

```text
MergeError: Merge keys are not unique in right dataset; not a many-to-one merge
```

### 90. Audit a join with `indicator=True`

The `_merge` column tells you which rows matched, which only came from the left, and which only from the right.

```python
import pandas as pd

left = pd.DataFrame({"id": [1, 2, 3]})
right = pd.DataFrame({"id": [2, 3, 4]})
merged = left.merge(right, on="id", how="outer", indicator=True)
print(merged["_merge"].value_counts().sort_index())
```

```text
_merge
left_only     1
right_only    1
both          2
Name: count, dtype: int64
```

### 91. Join on the nearest earlier timestamp with `merge_asof`

`merge_asof` matches each row to the most recent row in another table, such as attaching the latest exchange rate to each trade. Both tables must be sorted on the key.

```python
import pandas as pd

trades = pd.DataFrame({"time": pd.to_datetime(["2026-01-01 10:02", "2026-01-01 10:07"]), "qty": [5, 3]})
rates = pd.DataFrame({"time": pd.to_datetime(["2026-01-01 10:00", "2026-01-01 10:05"]), "rate": [1.10, 1.12]})
print(pd.merge_asof(trades, rates, on="time"))
```

```text
                 time  qty  rate
0 2026-01-01 10:02:00    5  1.10
1 2026-01-01 10:07:00    3  1.12
```

### 92. Stack many DataFrames with `concat` and `keys`

`keys` records which source each row came from, which helps when combining monthly files.

```python
import pandas as pd

jan = pd.DataFrame({"sales": [1, 2]})
feb = pd.DataFrame({"sales": [3]})
combined = pd.concat([jan, feb], keys=["jan", "feb"], names=["month", "row"])
print(combined.reset_index())
```

```text
  month  row  sales
0   jan    0      1
1   jan    1      2
2   feb    0      3
```

### 93. Patch missing values from another table with `combine_first`

`combine_first` keeps the first object's values and fills its gaps from the second, aligned on the index.

```python
import pandas as pd
import numpy as np

primary = pd.DataFrame({"phone": ["111", np.nan, "333"]}, index=["a", "b", "c"])
backup = pd.DataFrame({"phone": ["999", "222", "999"]}, index=["a", "b", "c"])
print(primary.combine_first(backup))
```

```text
  phone
a   111
b   222
c   333
```

### 94. Move between index levels with `stack` and `unstack`

`unstack` moves an index level into the columns; `stack` moves it back.

```python
import pandas as pd

s = pd.Series([1, 2, 3, 4], index=pd.MultiIndex.from_product([["a", "b"], ["x", "y"]]))
wide = s.unstack()
print(wide)
print(wide.stack().tolist())
```

```text
   x  y
a  1  2
b  3  4
[1, 2, 3, 4]
```

## Speed, safety and pandas 3 habits

### 95. Stop using chained assignment

Under Copy-on-Write (the default in pandas 3), `df["col"][mask] = value` modifies a temporary copy and never changes `df`. pandas 3 emits a `ChainedAssignmentError` warning when it sees this pattern. Write it as a single `.loc` assignment. pandas 3 also removed `SettingWithCopyWarning`, because the ambiguous case it warned about no longer exists ([Copy-on-Write user guide](https://pandas.pydata.org/docs/user_guide/copy_on_write.html)).

```python
import pandas as pd

import warnings

df = pd.DataFrame({"price": [10, 20, 30]})
with warnings.catch_warnings(record=True) as caught:
    warnings.simplefilter("always")
    df["price"][df["price"] > 15] = 0
print(caught[0].category.__name__)
print(df["price"].tolist())

df.loc[df["price"] > 15, "price"] = 0
print(df["price"].tolist())
```

```text
ChainedAssignmentError
[10, 20, 30]
[10, 0, 0]
```

### 96. Rely on Copy-on-Write instead of defensive copies

Under Copy-on-Write, a subset is a separate object as far as you are concerned: changing it never changes the parent. pandas only copies the data when one of them is modified, so you no longer need `.copy()` "just in case" to avoid side effects.

```python
import pandas as pd

df = pd.DataFrame({"a": [1, 2, 3]})
subset = df[df["a"] > 1]
subset.loc[:, "a"] = 100
print(df["a"].tolist(), subset["a"].tolist())
```

```text
[1, 2, 3] [100, 100]
```

### 97. Replace row loops with vectorized operations

Column arithmetic runs in compiled code. Looping with `iterrows` creates a Series per row and is typically orders of magnitude slower. The timings below are from one run on one machine and will differ on yours; the gap is the point.

```python
import time
import numpy as np
import pandas as pd

df = pd.DataFrame({"price": np.random.default_rng(0).random(100_000), "qty": 3})

start = time.perf_counter()
looped = [row["price"] * row["qty"] for _, row in df.iterrows()]
loop_time = time.perf_counter() - start

start = time.perf_counter()
vectorized = df["price"] * df["qty"]
vec_time = time.perf_counter() - start

print(np.allclose(looped, vectorized))
print(f"vectorized was more than 100x faster: {loop_time / vec_time > 100}")
```

```text
True
vectorized was more than 100x faster: True
```

### 98. Use `np.select` or `case_when` instead of nested `apply`

For if/elif/else logic over columns, `np.select` evaluates all conditions vectorized. `Series.case_when` (added in pandas 2.2) does the same in pandas style.

```python
import numpy as np
import pandas as pd

scores = pd.Series([95, 72, 58, 81])
print(np.select([scores >= 90, scores >= 70], ["A", "B"], default="C").tolist())
print(pd.Series("C", index=scores.index).case_when([(scores >= 90, "A"), (scores >= 70, "B")]).tolist())
```

```text
['A', 'B', 'C', 'B']
['A', 'B', 'C', 'B']
```

### 99. Write readable pipelines with `assign`, `pipe` and `pd.col`

Method chains keep each step visible. `pipe` lets you insert your own functions, and pandas 3.0 adds initial support for `pd.col("name")` expressions inside `assign` as an alternative to lambdas.

```python
import pandas as pd

def drop_test_users(d):
    return d[~d["user"].str.startswith("test")]

raw = pd.DataFrame({"user": ["ana", "test1", "ben"], "price": [10, 99, 20], "qty": [2, 1, 3]})
result = (
    raw
    .pipe(drop_test_users)
    .assign(total=pd.col("price") * pd.col("qty"))
    .sort_values("total", ascending=False)
)
print(result)
```

```text
  user  price  qty  total
2  ben     20    3     60
0  ana     10    2     20
```

### 100. Test DataFrames with `pd.testing`

`assert_frame_equal` checks values, dtypes, index and column names, and reports exactly what differs. It is the right tool for unit-testing data transformations.

```python
import pandas as pd

expected = pd.DataFrame({"a": [1, 2]})
actual = pd.DataFrame({"a": [1.0, 2.0]})
try:
    pd.testing.assert_frame_equal(actual, expected)
except AssertionError as err:
    print(str(err).splitlines()[0])
pd.testing.assert_frame_equal(actual, expected, check_dtype=False)
print("values match when dtype is ignored")
```

```text
Attributes of DataFrame.iloc[:, 0] (column name="a") are different
values match when dtype is ignored
```

## Common mistakes to avoid

- **Chained assignment.** `df["a"][mask] = x` silently does nothing in pandas 3. Use `df.loc[mask, "a"] = x` (tip 95).
- **Using `and`/`or` in filters.** Use `&`, `|`, `~` and parentheses (tip 24).
- **Checking `dtype == object` to find text.** In pandas 3 text columns are `str`; use `select_dtypes(include="str")` or `is_string_dtype` (tips 9 and 14).
- **Joining on keys that are not unique.** Rows multiply silently. Add `validate=` to `merge` (tip 89).
- **Looping over rows.** Reach for vectorized arithmetic, `np.select` or `groupby` first (tips 97 and 98).
- **Dropping every row with any missing value.** Use `subset` or `thresh`, and look at why the data is missing before deciding (tips 39 and 40).
- **Letting pandas guess types for IDs and ZIP codes.** Read them as strings (tip 2).

## Where to go next

- Learn the array engine under every DataFrame in [101 NumPy examples to master numerical computing in Python](/articles/numpy-examples-for-numerical-computing).
- Put cleaned data to work with [100 Python machine learning examples with real-world applications](/articles/python-machine-learning-examples).
- Practice end to end with [101 Python data science projects for beginners to advanced](/articles/python-data-science-projects).
- See where pandas fits among the other tools in [100 Python libraries for data science](/articles/python-libraries-for-data-science).
- Brush up on the statistics behind `describe`, `quantile` and `corr` with [100 probability and statistics examples](/articles/probability-statistics-real-world-examples).

## References

1. pandas development team. "What's new in 3.0.0 (January 21, 2026)." pandas documentation. [pandas.pydata.org](https://pandas.pydata.org/docs/whatsnew/v3.0.0.html)
2. pandas development team. "pandas 3.0 released!" pandas community blog. [pandas.pydata.org](https://pandas.pydata.org/community/blog/pandas-3.0.html)
3. pandas development team. "Copy-on-Write (CoW)." pandas user guide. [pandas.pydata.org](https://pandas.pydata.org/docs/user_guide/copy_on_write.html)
4. pandas development team. "Group by: split-apply-combine." pandas user guide. [pandas.pydata.org](https://pandas.pydata.org/docs/user_guide/groupby.html)
5. pandas development team. "Merge, join, concatenate and compare." pandas user guide. [pandas.pydata.org](https://pandas.pydata.org/docs/user_guide/merging.html)
6. pandas development team. "Time series / date functionality." pandas user guide. [pandas.pydata.org](https://pandas.pydata.org/docs/user_guide/timeseries.html)
7. pandas development team. "Scaling to large datasets." pandas user guide. [pandas.pydata.org](https://pandas.pydata.org/docs/user_guide/scale.html)
8. McKinney, W. (2022). *Python for Data Analysis*, 3rd edition. O'Reilly. Free online edition: [wesmckinney.com/book](https://wesmckinney.com/book/)
9. Wickham, H. (2014). "Tidy Data." *Journal of Statistical Software*, 59(10). [doi.org/10.18637/jss.v059.i10](https://doi.org/10.18637/jss.v059.i10)
