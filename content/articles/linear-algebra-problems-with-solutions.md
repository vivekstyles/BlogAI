---
title: "101 Best Linear Algebra Problems and Solutions: From Eigenvalues to Vector Spaces"
seoTitle: 101 Linear Algebra Problems With Step-by-Step Solutions
description: 101 linear algebra problems with full solutions and checks, from vectors and Gaussian elimination to determinants, eigenvalues, least squares and SVD.
author: BlogAI Editors
authorType: Organization
publishedAt: 2026-10-19
updatedAt: 2026-10-19
status: published
categories:
  - Mathematics
tags: [linear algebra, mathematics, matrices, eigenvalues, practice problems]
tocDepth: 2
---

Linear algebra is learned by doing. Definitions of span, rank and eigenvalues only start to make sense after you have row-reduced a few matrices and watched a vector refuse to change direction. This article collects 101 problems in the order a first course usually covers them: vectors, linear combinations, matrix arithmetic, systems of equations, determinants, inverses, vector spaces, linear transformations, eigenvalues, and finally orthogonality, least squares and the singular value decomposition.

Every problem has a full **solution** and, where it helps, a **check** you can do in a few seconds to catch arithmetic slips. Every answer was recomputed with SymPy (exact arithmetic) before publication. Try each problem before opening the solution; the gap between "I follow the solution" and "I can produce it" is where the learning happens.

If you want the theory and machine-learning context behind these problems rather than practice, read the companion article [101 linear algebra concepts for machine learning](/articles/linear-algebra-concepts-for-machine-learning).

**Notation.** Vectors are columns, written in parentheses in running text, such as $\mathbf{v} = (1, 2, 3)$. $A^{T}$ is the transpose, $A^{-1}$ the inverse, $\det A$ the determinant and $I$ the identity matrix.

## Vectors

### 1. Linear combination of vectors

**Problem:** For $\mathbf{u} = (2, -1, 3)$ and $\mathbf{v} = (1, 4, -2)$, compute $3\mathbf{u} - 2\mathbf{v}$.

<details>
<summary>Show solution</summary>

Scale, then subtract component by component:

$$
3\mathbf{u} - 2\mathbf{v} = (6, -3, 9) - (2, 8, -4) = (4, -11, 13)
$$

**Check:** the first components give $3 \cdot 2 - 2 \cdot 1 = 4$.

</details>

### 2. Length of a vector

**Problem:** Find $\lVert (3, 4, 12) \rVert$.

<details>
<summary>Show solution</summary>

$$
\lVert (3, 4, 12) \rVert = \sqrt{9 + 16 + 144} = \sqrt{169} = 13
$$

</details>

### 3. Unit vector

**Problem:** Find the unit vector in the direction of $(1, 2, 2)$.

<details>
<summary>Show solution</summary>

The length is $\sqrt{1 + 4 + 4} = 3$, so the unit vector is $\left(\tfrac{1}{3}, \tfrac{2}{3}, \tfrac{2}{3}\right)$.

**Check:** $\tfrac{1}{9} + \tfrac{4}{9} + \tfrac{4}{9} = 1$.

</details>

### 4. Dot product

**Problem:** Compute $(1, 2, 3) \cdot (4, -5, 6)$.

<details>
<summary>Show solution</summary>

$$
1 \cdot 4 + 2 \cdot (-5) + 3 \cdot 6 = 4 - 10 + 18 = 12
$$

</details>

### 5. Angle between two vectors

**Problem:** Find the angle between $(1, 0, 1)$ and $(0, 1, 1)$.

<details>
<summary>Show solution</summary>

$$
\cos\theta = \frac{\mathbf{a} \cdot \mathbf{b}}{\lVert \mathbf{a} \rVert \, \lVert \mathbf{b} \rVert} = \frac{1}{\sqrt{2}\,\sqrt{2}} = \frac{1}{2}
\quad\Longrightarrow\quad \theta = 60^\circ
$$

</details>

### 6. Testing orthogonality

**Problem:** Are $(2, -1, 3)$ and $(1, 5, 1)$ orthogonal?

<details>
<summary>Show solution</summary>

$2 - 5 + 3 = 0$. The dot product is zero, so yes, they are orthogonal.

</details>

### 7. Choosing a parameter for orthogonality

**Problem:** For which $k$ are $(k, 2, -1)$ and $(3, k, 4)$ orthogonal?

<details>
<summary>Show solution</summary>

$$
3k + 2k - 4 = 0 \quad\Longrightarrow\quad k = \frac{4}{5}
$$

**Check:** $3(0.8) + 2(0.8) - 4 = 2.4 + 1.6 - 4 = 0$.

</details>

### 8. Cross product

**Problem:** Compute $(1, 2, 3) \times (4, 5, 6)$.

<details>
<summary>Show solution</summary>

$$
(2 \cdot 6 - 3 \cdot 5,\; 3 \cdot 4 - 1 \cdot 6,\; 1 \cdot 5 - 2 \cdot 4) = (-3, 6, -3)
$$

**Check:** the result must be orthogonal to both inputs: $-3 + 12 - 9 = 0$ and $-12 + 30 - 18 = 0$.

</details>

### 9. Area of a triangle in space

**Problem:** Find the area of the triangle with vertices $P(1, 0, 0)$, $Q(0, 2, 0)$ and $R(0, 0, 3)$.

<details>
<summary>Show solution</summary>

$\overrightarrow{PQ} = (-1, 2, 0)$ and $\overrightarrow{PR} = (-1, 0, 3)$. Their cross product is $(6, 3, 2)$, whose length is $\sqrt{36 + 9 + 4} = 7$. The triangle is half the parallelogram, so the area is $\tfrac{7}{2} = 3.5$.

</details>

### 10. Projection of one vector onto another

**Problem:** Project $\mathbf{b} = (1, 3)$ onto the line through $\mathbf{a} = (3, 1)$, and find the error vector.

<details>
<summary>Show solution</summary>

$$
\mathbf{p} = \frac{\mathbf{a} \cdot \mathbf{b}}{\mathbf{a} \cdot \mathbf{a}}\,\mathbf{a} = \frac{6}{10}(3, 1) = (1.8, 0.6),
\qquad
\mathbf{e} = \mathbf{b} - \mathbf{p} = (-0.8, 2.4)
$$

**Check:** $\mathbf{e} \cdot \mathbf{a} = -2.4 + 2.4 = 0$, so the error is perpendicular to the line, as it must be.

</details>

<figure>
<img src="/images/articles/linear-algebra-problems-with-solutions/projection-onto-a-line.svg" alt="Vector b = (1, 3) projected onto the line through a = (3, 1). The projection p = (1.8, 0.6) lies on the line, and the dotted error vector from p to b meets the line at a right angle." width="720" height="340" loading="lazy" decoding="async" />
<figcaption>Problem 10: the projection p is the point on the line closest to b, so the error b − p is perpendicular to a.</figcaption>
</figure>

### 11. Cauchy–Schwarz inequality

**Problem:** Verify $|\mathbf{u} \cdot \mathbf{v}| \le \lVert \mathbf{u} \rVert \, \lVert \mathbf{v} \rVert$ for $\mathbf{u} = (1, 2)$ and $\mathbf{v} = (3, 4)$.

<details>
<summary>Show solution</summary>

$\mathbf{u} \cdot \mathbf{v} = 11$, and $\lVert \mathbf{u} \rVert \, \lVert \mathbf{v} \rVert = \sqrt{5} \cdot 5 \approx 11.18$. Since $11 \le 11.18$, the inequality holds. Equality would require the vectors to be parallel.

</details>

### 12. Distance from a point to a plane

**Problem:** Find the distance from $(1, 2, 3)$ to the plane $2x - y + 2z = 10$.

<details>
<summary>Show solution</summary>

$$
d = \frac{|2(1) - 2 + 2(3) - 10|}{\sqrt{2^2 + (-1)^2 + 2^2}} = \frac{|-4|}{3} = \frac{4}{3}
$$

</details>

## Linear combinations, span and independence

### 13. Writing a vector as a combination

**Problem:** Write $(7, 8)$ as a combination of $(1, 2)$ and $(3, 1)$.

<details>
<summary>Show solution</summary>

Solve $c_1 + 3c_2 = 7$ and $2c_1 + c_2 = 8$. From the second, $c_2 = 8 - 2c_1$; substituting gives $c_1 + 24 - 6c_1 = 7$, so $c_1 = \tfrac{17}{5}$ and $c_2 = \tfrac{6}{5}$.

**Check:** $\tfrac{17}{5} + \tfrac{18}{5} = 7$ and $\tfrac{34}{5} + \tfrac{6}{5} = 8$.

</details>

### 14. Membership in a span

**Problem:** Is $(1, 2, 3)$ in the span of $(1, 0, 1)$ and $(0, 1, 1)$?

<details>
<summary>Show solution</summary>

From the first two components, $c_1 = 1$ and $c_2 = 2$. The third component must then be $c_1 + c_2 = 3$, which matches. Yes: $(1, 2, 3) = 1(1, 0, 1) + 2(0, 1, 1)$.

</details>

### 15. Testing independence with a determinant

**Problem:** Are $(1, 1, 0)$, $(0, 1, 1)$ and $(1, 0, 1)$ linearly independent?

<details>
<summary>Show solution</summary>

Put them in the columns of a matrix and take the determinant:

$$
\det\begin{bmatrix} 1 & 0 & 1 \\ 1 & 1 & 0 \\ 0 & 1 & 1 \end{bmatrix} = 1(1 - 0) - 0 + 1(1 - 0) = 2 \ne 0
$$

The determinant is nonzero, so the vectors are independent and form a basis of $\mathbb{R}^3$.

</details>

### 16. Finding a dependence relation

**Problem:** Show that $(1, 2, 3)$, $(4, 5, 6)$ and $(7, 8, 9)$ are dependent by finding a relation.

<details>
<summary>Show solution</summary>

The vectors step by the same amount, $(3, 3, 3)$, so the middle one is the average of the other two: $\mathbf{v}_1 - 2\mathbf{v}_2 + \mathbf{v}_3 = \mathbf{0}$.

**Check:** $(1 - 8 + 7,\; 2 - 10 + 8,\; 3 - 12 + 9) = (0, 0, 0)$.

</details>

### 17. Too many vectors

**Problem:** Explain why $(1, 0, 0)$, $(0, 1, 0)$, $(0, 0, 1)$ and $(1, 2, 3)$ must be dependent, and find the relation.

<details>
<summary>Show solution</summary>

Any set of more than $n$ vectors in $\mathbb{R}^n$ is dependent, because a matrix with more columns than rows has a free column. Here $(1, 2, 3) = 1\mathbf{e}_1 + 2\mathbf{e}_2 + 3\mathbf{e}_3$.

</details>

### 18. Parameter that causes dependence

**Problem:** For which $k$ are $(1, k)$ and $(k, 4)$ dependent?

<details>
<summary>Show solution</summary>

$\det\begin{bmatrix} 1 & k \\ k & 4 \end{bmatrix} = 4 - k^2 = 0$, so $k = 2$ or $k = -2$.

**Check:** with $k = 2$, $(2, 4) = 2(1, 2)$.

</details>

### 19. Describing a span geometrically

**Problem:** Describe the span of $(1, 2)$ in $\mathbb{R}^2$.

<details>
<summary>Show solution</summary>

All multiples $t(1, 2) = (t, 2t)$: the line $y = 2x$ through the origin.

</details>

### 20. Spanning the plane

**Problem:** Show that $(1, 1)$ and $(1, -1)$ span $\mathbb{R}^2$, and write $(5, 3)$ in terms of them.

<details>
<summary>Show solution</summary>

$\det\begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix} = -2 \ne 0$, so they span the plane. Solving $c_1 + c_2 = 5$ and $c_1 - c_2 = 3$ gives $c_1 = 4$ and $c_2 = 1$.

</details>

### 21. Equation of a plane spanned by two vectors

**Problem:** Find the equation of the plane through the origin spanned by $(1, 0, 2)$ and $(0, 1, -1)$.

<details>
<summary>Show solution</summary>

A normal vector is the cross product: $(1, 0, 2) \times (0, 1, -1) = (-2, 1, 1)$. The plane is $-2x + y + z = 0$.

**Check:** $(1, 0, 2)$ gives $-2 + 0 + 2 = 0$; $(0, 1, -1)$ gives $0 + 1 - 1 = 0$.

</details>

### 22. Independence of polynomials

**Problem:** Are $1$, $1 + x$ and $1 + x + x^2$ independent?

<details>
<summary>Show solution</summary>

Write their coefficients (constant, $x$, $x^2$) as columns:

$$
\begin{bmatrix} 1 & 1 & 1 \\ 0 & 1 & 1 \\ 0 & 0 & 1 \end{bmatrix}
$$

The matrix is triangular with nonzero diagonal, so its determinant is $1$ and the polynomials are independent. They form a basis of the polynomials of degree at most 2.

</details>

## Matrix operations

### 23. Matrix multiplication is not commutative

**Problem:** For $A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$ and $B = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$, compute $AB$ and $BA$.

<details>
<summary>Show solution</summary>

$$
AB = \begin{bmatrix} 2 & 1 \\ 4 & 3 \end{bmatrix}, \qquad BA = \begin{bmatrix} 3 & 4 \\ 1 & 2 \end{bmatrix}
$$

Multiplying by $B$ on the right swaps the columns of $A$; on the left it swaps the rows. $AB \ne BA$.

</details>

### 24. Matrix times vector

**Problem:** Compute $\begin{bmatrix} 1 & 0 & 2 \\ 0 & 1 & -1 \end{bmatrix}\begin{bmatrix} 3 \\ 1 \\ 2 \end{bmatrix}$ and state the shapes.

<details>
<summary>Show solution</summary>

A $2 \times 3$ matrix times a $3 \times 1$ vector gives a $2 \times 1$ vector:

$$
\begin{bmatrix} 3 + 0 + 4 \\ 0 + 1 - 2 \end{bmatrix} = \begin{bmatrix} 7 \\ -1 \end{bmatrix}
$$

</details>

### 25. Transpose of a product

**Problem:** Using $A$ and $B$ from problem 23, verify $(AB)^{T} = B^{T}A^{T}$.

<details>
<summary>Show solution</summary>

$(AB)^{T} = \begin{bmatrix} 2 & 4 \\ 1 & 3 \end{bmatrix}$. Since $B^{T} = B$, $B^{T}A^{T} = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}\begin{bmatrix} 1 & 3 \\ 2 & 4 \end{bmatrix} = \begin{bmatrix} 2 & 4 \\ 1 & 3 \end{bmatrix}$. They match. The order reverses.

</details>

### 26. Powers of a matrix

**Problem:** Find $A^5$ for $A = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$.

<details>
<summary>Show solution</summary>

$A^2 = \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix}$, and each further multiplication adds 1 to the top-right entry, so $A^n = \begin{bmatrix} 1 & n \\ 0 & 1 \end{bmatrix}$ and $A^5 = \begin{bmatrix} 1 & 5 \\ 0 & 1 \end{bmatrix}$. (Prove the pattern by induction: $A^{n}A$ adds the top-left 1 to the top-right entry.)

</details>

### 27. Trace of a product

**Problem:** With $A$ and $B$ from problem 23, verify $\operatorname{tr}(AB) = \operatorname{tr}(BA)$.

<details>
<summary>Show solution</summary>

$\operatorname{tr}(AB) = 2 + 3 = 5$ and $\operatorname{tr}(BA) = 3 + 2 = 5$. The products differ but their traces agree, which is true for any compatible square products.

</details>

### 28. Symmetric plus skew-symmetric

**Problem:** Write $A = \begin{bmatrix} 1 & 4 \\ 2 & 3 \end{bmatrix}$ as a symmetric matrix plus a skew-symmetric matrix.

<details>
<summary>Show solution</summary>

$$
S = \tfrac{1}{2}(A + A^{T}) = \begin{bmatrix} 1 & 3 \\ 3 & 3 \end{bmatrix}, \qquad
K = \tfrac{1}{2}(A - A^{T}) = \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix}
$$

**Check:** $S + K = A$, $S^{T} = S$ and $K^{T} = -K$.

</details>

### 29. A nilpotent matrix

**Problem:** For $N = \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 0 & 0 & 0 \end{bmatrix}$, compute $N^2$ and $N^3$.

<details>
<summary>Show solution</summary>

Each multiplication shifts the ones one place further up and to the right:

$$
N^2 = \begin{bmatrix} 0 & 0 & 1 \\ 0 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix}, \qquad N^3 = 0
$$

All eigenvalues of a nilpotent matrix are 0.

</details>

### 30. Matrix-vector product as a combination of columns

**Problem:** Compute $\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}\begin{bmatrix} 5 \\ 6 \end{bmatrix}$ as a combination of columns.

<details>
<summary>Show solution</summary>

$$
5\begin{bmatrix} 1 \\ 3 \end{bmatrix} + 6\begin{bmatrix} 2 \\ 4 \end{bmatrix} = \begin{bmatrix} 17 \\ 39 \end{bmatrix}
$$

This "column picture" is why $A\mathbf{x} = \mathbf{b}$ is solvable exactly when $\mathbf{b}$ is in the column space of $A$.

</details>

### 31. Outer product

**Problem:** Compute $\mathbf{u}\mathbf{v}^{T}$ for $\mathbf{u} = (1, 2)$ and $\mathbf{v} = (3, 4, 5)$, and give its rank.

<details>
<summary>Show solution</summary>

$$
\mathbf{u}\mathbf{v}^{T} = \begin{bmatrix} 3 & 4 & 5 \\ 6 & 8 & 10 \end{bmatrix}
$$

The second row is twice the first, so the rank is 1. Every nonzero outer product has rank 1.

</details>

### 32. Rotation matrix

**Problem:** Rotate $(3, 4)$ by $90^\circ$ counterclockwise.

<details>
<summary>Show solution</summary>

$$
R_{90^\circ} = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}, \qquad R_{90^\circ}\begin{bmatrix} 3 \\ 4 \end{bmatrix} = \begin{bmatrix} -4 \\ 3 \end{bmatrix}
$$

**Check:** the length is still 5, and $(3, 4) \cdot (-4, 3) = 0$.

</details>

### 33. Projection matrix

**Problem:** Find the matrix that projects onto the line through $(1, 1)$ and verify $P^2 = P$.

<details>
<summary>Show solution</summary>

$$
P = \frac{\mathbf{a}\mathbf{a}^{T}}{\mathbf{a}^{T}\mathbf{a}} = \frac{1}{2}\begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix}
$$

$P^2 = \tfrac{1}{4}\begin{bmatrix} 2 & 2 \\ 2 & 2 \end{bmatrix} = P$. Projecting twice is the same as projecting once.

</details>

### 34. Reflection matrix

**Problem:** Find the matrix that reflects across the line $y = x$ and apply it to $(2, 5)$.

<details>
<summary>Show solution</summary>

The reflection swaps coordinates: $\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$, giving $(5, 2)$. Applying it twice returns the original vector, so the matrix is its own inverse.

</details>

## Systems of linear equations

### 35. A 2 × 2 system

**Problem:** Solve $x + y = 4$ and $x - y = 2$.

<details>
<summary>Show solution</summary>

Adding the equations gives $2x = 6$, so $x = 3$ and $y = 1$.

</details>

<figure>
<img src="/images/articles/linear-algebra-problems-with-solutions/two-equation-systems.svg" alt="Three panels of two lines each. Left: x + y = 4 and x − y = 2 cross at (3, 1), one solution. Middle: x + y = 4 and x + y = 1 are parallel, no solution. Right: x + y = 4 and 2x + 2y = 8 are the same line, infinitely many solutions." width="720" height="290" loading="lazy" decoding="async" />
<figcaption>Problems 35, 37 and 38: two equations in two unknowns can meet once, never or everywhere.</figcaption>
</figure>

### 36. A 3 × 3 system by elimination

**Problem:** Solve $x + y + z = 6$, $2x - y + z = 3$, $x + 2y - z = 2$.

<details>
<summary>Show solution</summary>

Subtract twice row 1 from row 2, and row 1 from row 3:

$$
-3y - z = -9, \qquad y - 2z = -4
$$

From the second, $y = 2z - 4$. Substituting: $-3(2z - 4) - z = -9$, so $-7z = -21$ and $z = 3$. Then $y = 2$ and $x = 1$.

**Check:** $1 + 2 + 3 = 6$, $2 - 2 + 3 = 3$, $1 + 4 - 3 = 2$.

</details>

### 37. An inconsistent system

**Problem:** Solve $x + 2y = 3$ and $2x + 4y = 7$.

<details>
<summary>Show solution</summary>

Subtracting twice the first equation from the second gives $0 = 1$, which is impossible. There is no solution: the lines are parallel.

</details>

### 38. Infinitely many solutions

**Problem:** Solve $x + y + z = 3$ and $x - y + z = 1$.

<details>
<summary>Show solution</summary>

Subtracting gives $2y = 2$, so $y = 1$ and $x + z = 2$. Let $z = t$ be free:

$$
(x, y, z) = (2 - t,\; 1,\; t), \qquad t \in \mathbb{R}
$$

The solution set is a line: two planes in $\mathbb{R}^3$ that are not parallel meet in a line.

</details>

### 39. Reduced row echelon form

**Problem:** Solve $x + 2y - z = 3$, $2x + 4y + z = 9$, $x + 2y + 2z = 6$ using RREF.

<details>
<summary>Show solution</summary>

$$
\left[\begin{array}{ccc|c} 1 & 2 & -1 & 3 \\ 2 & 4 & 1 & 9 \\ 1 & 2 & 2 & 6 \end{array}\right]
\longrightarrow
\left[\begin{array}{ccc|c} 1 & 2 & 0 & 4 \\ 0 & 0 & 1 & 1 \\ 0 & 0 & 0 & 0 \end{array}\right]
$$

Pivots are in columns 1 and 3, so $y$ is free. With $y = t$: $(x, y, z) = (4 - 2t,\; t,\; 1)$.

</details>

### 40. A homogeneous system

**Problem:** Find all solutions of $A\mathbf{x} = \mathbf{0}$ for $A = \begin{bmatrix} 1 & 2 & 3 \\ 2 & 4 & 6 \end{bmatrix}$.

<details>
<summary>Show solution</summary>

Row 2 is twice row 1, so only $x + 2y + 3z = 0$ remains. With $y = s$ and $z = t$ free:

$$
\mathbf{x} = s(-2, 1, 0) + t(-3, 0, 1)
$$

The null space is a plane with basis $(-2, 1, 0)$ and $(-3, 0, 1)$.

</details>

### 41. When does a system have a unique solution?

**Problem:** For which $k$ does $x + y = 1$, $2x + ky = 3$ have exactly one solution?

<details>
<summary>Show solution</summary>

The coefficient determinant is $k - 2$. For $k \ne 2$ there is exactly one solution. For $k = 2$ the second equation says $2x + 2y = 3$, while the first implies $2x + 2y = 2$, so there is no solution.

</details>

### 42. Cramer's rule for a 3 × 3 system

**Problem:** Use Cramer's rule to find $x$ in problem 36.

<details>
<summary>Show solution</summary>

$$
\det A = \det\begin{bmatrix} 1 & 1 & 1 \\ 2 & -1 & 1 \\ 1 & 2 & -1 \end{bmatrix} = 1(1 - 2) - 1(-2 - 1) + 1(4 + 1) = 7
$$

Replace column 1 with the right-hand side $(6, 3, 2)$:

$$
\det A_x = 6(1 - 2) - 1(-3 - 2) + 1(6 + 2) = 7, \qquad x = \frac{7}{7} = 1
$$

This matches problem 36. Cramer's rule is useful for theory and tiny systems; elimination is far cheaper for anything larger.

</details>

### 43. LU decomposition of a 2 × 2 matrix

**Problem:** Factor $A = \begin{bmatrix} 2 & 1 \\ 6 & 8 \end{bmatrix}$ as $LU$.

<details>
<summary>Show solution</summary>

The multiplier for row 2 is $6 / 2 = 3$; subtracting $3 \times$ row 1 leaves $(0, 5)$:

$$
A = \begin{bmatrix} 1 & 0 \\ 3 & 1 \end{bmatrix}\begin{bmatrix} 2 & 1 \\ 0 & 5 \end{bmatrix}
$$

</details>

### 44. LU decomposition of a 3 × 3 matrix

**Problem:** Factor $A = \begin{bmatrix} 2 & 1 & 1 \\ 4 & 3 & 3 \\ 8 & 7 & 9 \end{bmatrix}$ as $LU$.

<details>
<summary>Show solution</summary>

Multipliers 2 and 4 clear column 1, leaving rows $(0, 1, 1)$ and $(0, 3, 5)$. Multiplier 3 then clears column 2, leaving $(0, 0, 2)$:

$$
L = \begin{bmatrix} 1 & 0 & 0 \\ 2 & 1 & 0 \\ 4 & 3 & 1 \end{bmatrix}, \qquad
U = \begin{bmatrix} 2 & 1 & 1 \\ 0 & 1 & 1 \\ 0 & 0 & 2 \end{bmatrix}
$$

**Check:** $\det A = 2 \cdot 1 \cdot 2 = 4$, the product of the pivots.

</details>

### 45. Why pivoting matters

**Problem:** Solve $0.0001x + y = 1$, $x + y = 2$, and explain what goes wrong without row swaps in low-precision arithmetic.

<details>
<summary>Show solution</summary>

Exactly: $y = 2 - x$, so $0.0001x + 2 - x = 1$, giving $x = \tfrac{1}{0.9999} \approx 1.0001$ and $y \approx 0.9999$.

Without a swap, the multiplier is $10\,000$, and row 2 becomes $-9999y = -9998$. With three significant digits both numbers round to about $-10\,000$, so $y = 1$, and back-substitution gives $0.0001x = 0$, so $x = 0$, which is badly wrong. Swapping rows first (partial pivoting) uses the multiplier $0.0001$ and gives $x \approx 1$, $y \approx 1$ even at low precision.

</details>

### 46. Balancing a chemical equation

**Problem:** Balance $a\,\mathrm{C_3H_8} + b\,\mathrm{O_2} \to c\,\mathrm{CO_2} + d\,\mathrm{H_2O}$.

<details>
<summary>Show solution</summary>

Atom counts give a homogeneous system: carbon $3a = c$, hydrogen $8a = 2d$, oxygen $2b = 2c + d$. Setting $a = 1$: $c = 3$, $d = 4$, $b = \tfrac{6 + 4}{2} = 5$.

$$
\mathrm{C_3H_8} + 5\,\mathrm{O_2} \to 3\,\mathrm{CO_2} + 4\,\mathrm{H_2O}
$$

</details>

## Determinants

### 47. Determinant as area

**Problem:** Find $\det\begin{bmatrix} 3 & 1 \\ 0 & 2 \end{bmatrix}$ and interpret it.

<details>
<summary>Show solution</summary>

$3 \cdot 2 - 1 \cdot 0 = 6$. The matrix sends the unit square to the parallelogram spanned by its columns $(3, 0)$ and $(1, 2)$, which has area 6.

</details>

<figure>
<img src="/images/articles/linear-algebra-problems-with-solutions/determinant-as-area.svg" alt="The unit square next to the parallelogram spanned by the column vectors (3, 0) and (1, 2). The parallelogram is labeled area equals the absolute value of det A, which is 6." width="720" height="360" loading="lazy" decoding="async" />
<figcaption>Problem 47: the absolute value of the determinant is the factor by which the matrix scales area.</figcaption>
</figure>

### 48. A 3 × 3 determinant by cofactors

**Problem:** Compute $\det\begin{bmatrix} 2 & 0 & 1 \\ 1 & 3 & 2 \\ 1 & 1 & 4 \end{bmatrix}$.

<details>
<summary>Show solution</summary>

Expand along row 1 (the zero saves work):

$$
2(3 \cdot 4 - 2 \cdot 1) - 0 + 1(1 \cdot 1 - 3 \cdot 1) = 2(10) + (-2) = 18
$$

</details>

### 49. Determinant of a triangular matrix

**Problem:** Compute $\det\begin{bmatrix} 3 & 5 & 7 \\ 0 & 2 & 9 \\ 0 & 0 & 4 \end{bmatrix}$.

<details>
<summary>Show solution</summary>

For a triangular matrix the determinant is the product of the diagonal: $3 \cdot 2 \cdot 4 = 24$.

</details>

### 50. Effect of scaling a matrix

**Problem:** If $A$ is $3 \times 3$ with $\det A = 5$, find $\det(2A)$.

<details>
<summary>Show solution</summary>

Multiplying the matrix by 2 multiplies each of the 3 rows by 2, and each row scaling multiplies the determinant by 2: $\det(2A) = 2^3 \cdot 5 = 40$.

</details>

### 51. Product and inverse rules

**Problem:** If $\det A = 3$ and $\det B = -2$ for $n \times n$ matrices, find $\det(AB)$, $\det(A^{-1}B^2)$ and $\det(A^{T})$.

<details>
<summary>Show solution</summary>

$\det(AB) = 3(-2) = -6$. $\det(A^{-1}B^2) = \tfrac{1}{3} \cdot (-2)^2 = \tfrac{4}{3}$. $\det(A^{T}) = \det A = 3$.

</details>

### 52. Finding when a matrix is singular

**Problem:** For which $k$ is $\begin{bmatrix} 1 & 2 \\ 3 & k \end{bmatrix}$ singular?

<details>
<summary>Show solution</summary>

$k - 6 = 0$, so $k = 6$. Then row 2 is three times row 1.

</details>

### 53. Vandermonde determinant

**Problem:** Compute $\det\begin{bmatrix} 1 & 1 & 1 \\ 1 & 2 & 4 \\ 1 & 3 & 9 \end{bmatrix}$.

<details>
<summary>Show solution</summary>

This is a Vandermonde matrix with nodes $1, 2, 3$, whose determinant is the product of all differences $x_j - x_i$ with $i < j$:

$$
(2 - 1)(3 - 1)(3 - 2) = 2
$$

Because it is nonzero, exactly one parabola passes through any three points with $x = 1, 2, 3$.

</details>

### 54. Volume of a parallelepiped

**Problem:** Find the volume of the box spanned by $(1, 0, 0)$, $(1, 2, 0)$ and $(1, 1, 3)$.

<details>
<summary>Show solution</summary>

$$
\det\begin{bmatrix} 1 & 1 & 1 \\ 0 & 2 & 1 \\ 0 & 0 & 3 \end{bmatrix} = 1 \cdot 2 \cdot 3 = 6
$$

The volume is $|6| = 6$.

</details>

### 55. A 4 × 4 determinant by elimination

**Problem:** Compute $\det\begin{bmatrix} 1 & 2 & 0 & 1 \\ 0 & 1 & 3 & 0 \\ 2 & 0 & 1 & 1 \\ 1 & 1 & 1 & 2 \end{bmatrix}$.

<details>
<summary>Show solution</summary>

Adding multiples of one row to another does not change the determinant. Clear column 1 (row 3 minus $2\times$ row 1, row 4 minus row 1), then column 2 using row 2:

$$
\begin{bmatrix} 1 & 2 & 0 & 1 \\ 0 & 1 & 3 & 0 \\ 0 & -4 & 1 & -1 \\ 0 & -1 & 1 & 1 \end{bmatrix}
\to
\begin{bmatrix} 1 & 2 & 0 & 1 \\ 0 & 1 & 3 & 0 \\ 0 & 0 & 13 & -1 \\ 0 & 0 & 4 & 1 \end{bmatrix}
$$

Finally row 4 minus $\tfrac{4}{13}$ row 3 leaves $1 + \tfrac{4}{13} = \tfrac{17}{13}$ in the corner. The determinant is $1 \cdot 1 \cdot 13 \cdot \tfrac{17}{13} = 17$.

</details>

## Matrix inverses

### 56. Inverse of a 2 × 2 matrix

**Problem:** Invert $A = \begin{bmatrix} 4 & 7 \\ 2 & 6 \end{bmatrix}$.

<details>
<summary>Show solution</summary>

$\det A = 24 - 14 = 10$. Swap the diagonal, negate the off-diagonal and divide by the determinant:

$$
A^{-1} = \frac{1}{10}\begin{bmatrix} 6 & -7 \\ -2 & 4 \end{bmatrix}
$$

**Check:** the top-left entry of $AA^{-1}$ is $\tfrac{24 - 14}{10} = 1$.

</details>

### 57. Inverse of a 3 × 3 matrix by Gauss–Jordan

**Problem:** Invert $A = \begin{bmatrix} 1 & 2 & 3 \\ 0 & 1 & 4 \\ 5 & 6 & 0 \end{bmatrix}$.

<details>
<summary>Show solution</summary>

Row-reduce $[A \mid I]$ until the left block is $I$. The determinant is $1(0 - 24) - 2(0 - 20) + 3(0 - 5) = 1$, so the inverse has integer entries:

$$
A^{-1} = \begin{bmatrix} -24 & 18 & 5 \\ 20 & -15 & -4 \\ -5 & 4 & 1 \end{bmatrix}
$$

**Check:** row 1 of $A$ times column 1 of $A^{-1}$: $-24 + 40 - 15 = 1$.

</details>

### 58. Solving a system with an inverse

**Problem:** Solve $4x + 7y = 1$, $2x + 6y = 2$ using problem 56.

<details>
<summary>Show solution</summary>

$$
\mathbf{x} = A^{-1}\mathbf{b} = \frac{1}{10}\begin{bmatrix} 6 - 14 \\ -2 + 8 \end{bmatrix} = \begin{bmatrix} -0.8 \\ 0.6 \end{bmatrix}
$$

**Check:** $4(-0.8) + 7(0.6) = 1$ and $2(-0.8) + 6(0.6) = 2$. In software, call a solver (such as `numpy.linalg.solve`) rather than forming the inverse; it is faster and more accurate.

</details>

### 59. Inverse of a product

**Problem:** Show that $(AB)^{-1} = B^{-1}A^{-1}$.

<details>
<summary>Show solution</summary>

$(AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1} = AIA^{-1} = I$. The order reverses, like taking off socks and shoes.

</details>

### 60. Inverse of an orthogonal matrix

**Problem:** Find the inverse of the rotation $R = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}$.

<details>
<summary>Show solution</summary>

Its columns are orthonormal, so $R^{-1} = R^{T} = \begin{bmatrix} \cos\theta & \sin\theta \\ -\sin\theta & \cos\theta \end{bmatrix}$, which is rotation by $-\theta$.

</details>

### 61. A matrix with no inverse

**Problem:** Show that $\begin{bmatrix} 2 & 4 \\ 1 & 2 \end{bmatrix}$ is not invertible in two ways.

<details>
<summary>Show solution</summary>

The determinant is $4 - 4 = 0$. Also, $(2, -1)$ is a nonzero vector in the null space: $2 \cdot 2 + 4 \cdot (-1) = 0$ and $2 - 2 = 0$. A matrix that sends a nonzero vector to zero cannot be undone.

</details>

### 62. Sherman–Morrison formula

**Problem:** Use $(I + \mathbf{u}\mathbf{v}^{T})^{-1} = I - \dfrac{\mathbf{u}\mathbf{v}^{T}}{1 + \mathbf{v}^{T}\mathbf{u}}$ with $\mathbf{u} = (1, 0)$ and $\mathbf{v} = (1, 1)$.

<details>
<summary>Show solution</summary>

$I + \mathbf{u}\mathbf{v}^{T} = \begin{bmatrix} 2 & 1 \\ 0 & 1 \end{bmatrix}$ and $\mathbf{v}^{T}\mathbf{u} = 1$, so

$$
(I + \mathbf{u}\mathbf{v}^{T})^{-1} = I - \frac{1}{2}\begin{bmatrix} 1 & 1 \\ 0 & 0 \end{bmatrix} = \begin{bmatrix} 0.5 & -0.5 \\ 0 & 1 \end{bmatrix}
$$

**Check:** the 2 × 2 formula gives $\tfrac{1}{2}\begin{bmatrix} 1 & -1 \\ 0 & 2 \end{bmatrix}$, the same matrix. The formula lets software update an inverse after a rank-one change without starting over.

</details>

## Vector spaces and subspaces

### 63. Is it a subspace?

**Problem:** Which of these are subspaces of $\mathbb{R}^2$: the line $y = 2x$, the line $y = 2x + 1$?

<details>
<summary>Show solution</summary>

$y = 2x$ is a subspace: it contains $\mathbf{0}$ and is closed under addition and scaling. $y = 2x + 1$ is not, because it does not contain $(0, 0)$.

</details>

### 64. Symmetric matrices as a subspace

**Problem:** Show that the $2 \times 2$ symmetric matrices form a subspace and find its dimension.

<details>
<summary>Show solution</summary>

Sums and multiples of symmetric matrices are symmetric, and the zero matrix is symmetric. Every such matrix is

$$
\begin{bmatrix} a & b \\ b & c \end{bmatrix} = a\begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix} + b\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix} + c\begin{bmatrix} 0 & 0 \\ 0 & 1 \end{bmatrix}
$$

These three matrices form a basis, so the dimension is 3.

</details>

### 65. Coordinates in a non-standard basis

**Problem:** Find the coordinates of $p(x) = 3 - 2x + 5x^2$ in the basis $\{1,\; 1 + x,\; 1 + x + x^2\}$.

<details>
<summary>Show solution</summary>

Write $p = a + b(1 + x) + c(1 + x + x^2)$ and match coefficients from the highest power down: $x^2$: $c = 5$; $x$: $b + c = -2$, so $b = -7$; constant: $a + b + c = 3$, so $a = 5$. Coordinates: $(5, -7, 5)$.

**Check:** $5 - 7(1 + x) + 5(1 + x + x^2) = 3 - 2x + 5x^2$.

</details>

### 66. Rank of a matrix

**Problem:** Find the rank of $A = \begin{bmatrix} 1 & 2 & 3 \\ 2 & 4 & 6 \\ 1 & 0 & 1 \end{bmatrix}$.

<details>
<summary>Show solution</summary>

Row 2 is twice row 1. Rows 1 and 3 are not multiples of each other. Elimination leaves two nonzero rows, so the rank is 2.

</details>

### 67. Basis for a null space

**Problem:** Find the null space of $\begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \\ 7 & 8 & 9 \end{bmatrix}$.

<details>
<summary>Show solution</summary>

Elimination gives $x - z = 0$ and $y + 2z = 0$. With $z = t$: $\mathbf{x} = t(1, -2, 1)$, so the columns satisfy $\mathbf{c}_1 - 2\mathbf{c}_2 + \mathbf{c}_3 = \mathbf{0}$. Problem 16 found the same coefficients for the rows.

</details>

### 68. Rank–nullity theorem

**Problem:** A $3 \times 5$ matrix has rank 2. What is the dimension of its null space?

<details>
<summary>Show solution</summary>

$\text{rank} + \text{nullity} = \text{number of columns}$, so the nullity is $5 - 2 = 3$.

</details>

### 69. The four fundamental subspaces

**Problem:** Find bases for the four fundamental subspaces of $A = \begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix}$.

<details>
<summary>Show solution</summary>

- Column space: multiples of $(1, 2)$.
- Null space: $x + 2y = 0$, so multiples of $(-2, 1)$.
- Row space: multiples of $(1, 2)$ (the matrix is symmetric).
- Left null space (null space of $A^{T}$): multiples of $(-2, 1)$.

**Check:** the row space is perpendicular to the null space: $(1, 2) \cdot (-2, 1) = 0$.

</details>

### 70. Change of basis

**Problem:** Find the coordinates of $(4, 3)$ in the basis $\{(2, 1), (1, 1)\}$.

<details>
<summary>Show solution</summary>

Solve $2a + b = 4$ and $a + b = 3$: subtracting gives $a = 1$, then $b = 2$. Coordinates: $(1, 2)$. Equivalently, multiply by $P^{-1}$ where $P = \begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}$ has the basis vectors as columns.

</details>

### 71. Dimension of a solution space

**Problem:** What is the dimension of the subspace $x + y + z + w = 0$ in $\mathbb{R}^4$?

<details>
<summary>Show solution</summary>

One equation of rank 1 on 4 unknowns leaves $4 - 1 = 3$ free variables. A basis is $(-1, 1, 0, 0)$, $(-1, 0, 1, 0)$, $(-1, 0, 0, 1)$.

</details>

### 72. Intersection of two subspaces

**Problem:** Find the intersection of the planes $x + y + z = 0$ and $x - y = 0$.

<details>
<summary>Show solution</summary>

From the second, $y = x$; then $z = -2x$. The intersection is the line spanned by $(1, 1, -2)$.

</details>

## Linear transformations

### 73. Is the map linear?

**Problem:** Which is linear: $T_1(x, y) = (x + y, 2x)$ or $T_2(x, y) = (x + 1, y)$?

<details>
<summary>Show solution</summary>

$T_1$ is linear: it is multiplication by $\begin{bmatrix} 1 & 1 \\ 2 & 0 \end{bmatrix}$. $T_2$ is not, because $T_2(0, 0) = (1, 0) \ne (0, 0)$; a linear map must send zero to zero.

</details>

### 74. Matrix of a transformation

**Problem:** Find the matrix of $T(x, y, z) = (x + 2y,\; 3z - y)$.

<details>
<summary>Show solution</summary>

The columns are the images of the standard basis vectors: $T(\mathbf{e}_1) = (1, 0)$, $T(\mathbf{e}_2) = (2, -1)$, $T(\mathbf{e}_3) = (0, 3)$.

$$
\begin{bmatrix} 1 & 2 & 0 \\ 0 & -1 & 3 \end{bmatrix}
$$

</details>

### 75. Rotation by 30 degrees

**Problem:** Rotate $(1, 0)$ by $30^\circ$.

<details>
<summary>Show solution</summary>

$$
\begin{bmatrix} \cos 30^\circ & -\sin 30^\circ \\ \sin 30^\circ & \cos 30^\circ \end{bmatrix}\begin{bmatrix} 1 \\ 0 \end{bmatrix} = \begin{bmatrix} \sqrt{3}/2 \\ 1/2 \end{bmatrix}
$$

</details>

### 76. Composing transformations

**Problem:** Rotate by $90^\circ$, then reflect across the $x$-axis. What single transformation is this?

<details>
<summary>Show solution</summary>

The matrix of "first $R$, then $F$" is $FR$:

$$
FR = \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix} = \begin{bmatrix} 0 & -1 \\ -1 & 0 \end{bmatrix}
$$

This sends $(x, y)$ to $(-y, -x)$: reflection across the line $y = -x$.

</details>

### 77. Kernel and image

**Problem:** Find the kernel and image of $T(x, y, z) = (x - y,\; y - z)$.

<details>
<summary>Show solution</summary>

The kernel needs $x = y = z$: the line spanned by $(1, 1, 1)$. The rank is $3 - 1 = 2$, so the image is all of $\mathbb{R}^2$.

</details>

### 78. A shear preserves area

**Problem:** Show that the shear $\begin{bmatrix} 1 & k \\ 0 & 1 \end{bmatrix}$ preserves area for every $k$.

<details>
<summary>Show solution</summary>

Its determinant is $1 \cdot 1 - k \cdot 0 = 1$, so areas are multiplied by 1. A shear slides layers past each other, like pushing a deck of cards sideways.

</details>

### 79. Differentiation as a matrix

**Problem:** Find the matrix of $D = \frac{d}{dx}$ on polynomials of degree at most 2, in the basis $\{1, x, x^2\}$.

<details>
<summary>Show solution</summary>

$D(1) = 0$, $D(x) = 1$, $D(x^2) = 2x$. These images, written in coordinates, are the columns:

$$
D = \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 2 \\ 0 & 0 & 0 \end{bmatrix}
$$

**Check:** $3 - 2x + 5x^2$ has coordinates $(3, -2, 5)$, and $D$ sends them to $(-2, 10, 0)$, which is $-2 + 10x$.

</details>

### 80. A matrix in a better basis

**Problem:** Write $A = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$ in the basis $\{(1, 1), (1, -1)\}$.

<details>
<summary>Show solution</summary>

$A(1, 1) = (3, 3) = 3(1, 1)$ and $A(1, -1) = (1, -1)$. In this basis the transformation is simply $\begin{bmatrix} 3 & 0 \\ 0 & 1 \end{bmatrix}$: stretch by 3 along $(1, 1)$, leave $(1, -1)$ alone. This is what diagonalization means (problem 87).

</details>

## Eigenvalues and eigenvectors

### 81. Eigenvalues of a symmetric 2 × 2 matrix

**Problem:** Find the eigenvalues and eigenvectors of $A = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$.

<details>
<summary>Show solution</summary>

$$
\det(A - \lambda I) = (2 - \lambda)^2 - 1 = 0 \quad\Longrightarrow\quad \lambda = 3 \text{ or } \lambda = 1
$$

For $\lambda = 3$: $(A - 3I)\mathbf{x} = \mathbf{0}$ gives $\mathbf{x} = (1, 1)$. For $\lambda = 1$: $\mathbf{x} = (1, -1)$.

**Check:** $3 + 1 = 4 = \operatorname{tr} A$ and $3 \cdot 1 = 3 = \det A$.

</details>

<figure>
<img src="/images/articles/linear-algebra-problems-with-solutions/eigenvectors-of-a-symmetric-matrix.svg" alt="Left: the unit circle with three arrows: eigenvector directions (1, 1) and (1, −1) and the vector (1, 0). Right: after multiplying by A = [[2, 1], [1, 2]] the circle becomes a tilted ellipse; the (1, 1) arrow is stretched three times, the (1, −1) arrow is unchanged, and (1, 0) becomes (2, 1), which points in a new direction." width="720" height="360" loading="lazy" decoding="async" />
<figcaption>Problem 81: eigenvectors are the directions that A only stretches. The ellipse's axes lie along them, with half-lengths equal to the eigenvalues 3 and 1.</figcaption>
</figure>

### 82. Eigenvalues of a non-symmetric matrix

**Problem:** Find the eigenvalues and eigenvectors of $A = \begin{bmatrix} 4 & 1 \\ 2 & 3 \end{bmatrix}$.

<details>
<summary>Show solution</summary>

$$
\lambda^2 - 7\lambda + 10 = 0 \quad\Longrightarrow\quad \lambda = 5 \text{ or } \lambda = 2
$$

For $\lambda = 5$: $A - 5I = \begin{bmatrix} -1 & 1 \\ 2 & -2 \end{bmatrix}$, so $\mathbf{x} = (1, 1)$. For $\lambda = 2$: $A - 2I = \begin{bmatrix} 2 & 1 \\ 2 & 1 \end{bmatrix}$, so $\mathbf{x} = (1, -2)$.

**Check:** $A(1, -2) = (2, -4) = 2(1, -2)$.

</details>

### 83. Eigenvalues of a triangular matrix

**Problem:** Find the eigenvalues of $\begin{bmatrix} 3 & 7 & -1 \\ 0 & -2 & 5 \\ 0 & 0 & 6 \end{bmatrix}$.

<details>
<summary>Show solution</summary>

$\det(A - \lambda I)$ is the product of the diagonal entries $(3 - \lambda)(-2 - \lambda)(6 - \lambda)$, so the eigenvalues are $3$, $-2$ and $6$.

</details>

### 84. Using trace and determinant

**Problem:** A $2 \times 2$ matrix has trace 10 and determinant 21. Find its eigenvalues.

<details>
<summary>Show solution</summary>

They are the roots of $\lambda^2 - 10\lambda + 21 = 0$: $\lambda = 3$ and $\lambda = 7$. Their sum is the trace and their product is the determinant.

</details>

### 85. Eigenvalues of a block matrix

**Problem:** Find the eigenvalues of $\begin{bmatrix} 2 & 0 & 0 \\ 0 & 3 & 4 \\ 0 & 4 & 9 \end{bmatrix}$.

<details>
<summary>Show solution</summary>

The matrix is block diagonal, so its eigenvalues are 2 together with those of $\begin{bmatrix} 3 & 4 \\ 4 & 9 \end{bmatrix}$: $\lambda^2 - 12\lambda + 11 = 0$, so $\lambda = 11$ and $\lambda = 1$. The eigenvalues are 2, 11 and 1.

</details>

### 86. Complex eigenvalues of a rotation

**Problem:** Find the eigenvalues of $\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$.

<details>
<summary>Show solution</summary>

$\lambda^2 + 1 = 0$, so $\lambda = \pm i$. No real vector keeps its direction under a $90^\circ$ rotation, which is why the eigenvalues are not real.

</details>

### 87. Diagonalization

**Problem:** Diagonalize $A = \begin{bmatrix} 4 & 1 \\ 2 & 3 \end{bmatrix}$ from problem 82.

<details>
<summary>Show solution</summary>

Put the eigenvectors in the columns of $P$ and the eigenvalues on the diagonal of $D$:

$$
A = PDP^{-1}, \qquad P = \begin{bmatrix} 1 & 1 \\ 1 & -2 \end{bmatrix}, \qquad D = \begin{bmatrix} 5 & 0 \\ 0 & 2 \end{bmatrix}
$$

**Check:** $AP = \begin{bmatrix} 5 & 2 \\ 5 & -4 \end{bmatrix} = PD$.

</details>

### 88. Fibonacci numbers from matrix powers

**Problem:** Use $F = \begin{bmatrix} 1 & 1 \\ 1 & 0 \end{bmatrix}$ to find the 10th Fibonacci number.

<details>
<summary>Show solution</summary>

$F^n = \begin{bmatrix} F_{n+1} & F_n \\ F_n & F_{n-1} \end{bmatrix}$, and

$$
F^{10} = \begin{bmatrix} 89 & 55 \\ 55 & 34 \end{bmatrix}
$$

so $F_{10} = 55$. The eigenvalues of $F$ are $\varphi = \tfrac{1 + \sqrt{5}}{2}$ and $\psi = \tfrac{1 - \sqrt{5}}{2}$, which gives Binet's formula $F_n = \tfrac{\varphi^n - \psi^n}{\sqrt{5}}$.

</details>

### 89. A matrix that cannot be diagonalized

**Problem:** Show that $\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$ is not diagonalizable.

<details>
<summary>Show solution</summary>

The only eigenvalue is $\lambda = 1$ (repeated). $A - I = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}$ has a one-dimensional null space spanned by $(1, 0)$. Two independent eigenvectors are needed to diagonalize a $2 \times 2$ matrix, and there is only one.

</details>

### 90. Steady state of a Markov chain

**Problem:** Each day 90% of customers of shop A stay and 10% switch to B; B keeps 50% and loses 50% to A. Find the long-run market shares.

<details>
<summary>Show solution</summary>

With column-stochastic matrix $P = \begin{bmatrix} 0.9 & 0.5 \\ 0.1 & 0.5 \end{bmatrix}$, the steady state is the eigenvector with $\lambda = 1$: $P\mathbf{s} = \mathbf{s}$. The first row gives $0.9a + 0.5b = a$, so $0.1a = 0.5b$ and $a = 5b$. Normalizing, $\mathbf{s} = \left(\tfrac{5}{6}, \tfrac{1}{6}\right)$.

**Check:** $0.9 \cdot \tfrac{5}{6} + 0.5 \cdot \tfrac{1}{6} = \tfrac{4.5 + 0.5}{6} = \tfrac{5}{6}$.

</details>

### 91. Cayley–Hamilton theorem

**Problem:** Use Cayley–Hamilton to find the inverse of $A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$.

<details>
<summary>Show solution</summary>

The characteristic polynomial is $\lambda^2 - 5\lambda - 2$, and every matrix satisfies its own: $A^2 - 5A - 2I = 0$. Multiply by $A^{-1}$: $A - 5I = 2A^{-1}$, so

$$
A^{-1} = \frac{1}{2}(A - 5I) = \begin{bmatrix} -2 & 1 \\ 1.5 & -0.5 \end{bmatrix}
$$

This matches the 2 × 2 formula, $\tfrac{1}{-2}\begin{bmatrix} 4 & -2 \\ -3 & 1 \end{bmatrix}$.

</details>

### 92. Solving a system of differential equations

**Problem:** Solve $\mathbf{x}'(t) = A\mathbf{x}(t)$ with $A = \begin{bmatrix} 4 & 1 \\ 2 & 3 \end{bmatrix}$.

<details>
<summary>Show solution</summary>

Each eigenpair from problem 82 gives a solution $e^{\lambda t}\mathbf{v}$:

$$
\mathbf{x}(t) = c_1 e^{5t}\begin{bmatrix} 1 \\ 1 \end{bmatrix} + c_2 e^{2t}\begin{bmatrix} 1 \\ -2 \end{bmatrix}
$$

The constants come from the initial condition. As $t$ grows, the $e^{5t}$ term dominates, so solutions line up with $(1, 1)$.

</details>

## Orthogonality, least squares and decompositions

### 93. Gram–Schmidt process

**Problem:** Orthonormalize $\mathbf{a}_1 = (1, 1, 0)$ and $\mathbf{a}_2 = (1, 0, 1)$.

<details>
<summary>Show solution</summary>

$\mathbf{q}_1 = \tfrac{1}{\sqrt{2}}(1, 1, 0)$. Remove from $\mathbf{a}_2$ its component along $\mathbf{q}_1$:

$$
\mathbf{a}_2 - (\mathbf{q}_1 \cdot \mathbf{a}_2)\mathbf{q}_1 = (1, 0, 1) - \tfrac{1}{2}(1, 1, 0) = \left(\tfrac{1}{2}, -\tfrac{1}{2}, 1\right)
$$

Its length is $\sqrt{3/2}$, so $\mathbf{q}_2 = \tfrac{1}{\sqrt{6}}(1, -1, 2)$.

**Check:** $\mathbf{q}_1 \cdot \mathbf{q}_2 = \tfrac{1 - 1 + 0}{\sqrt{12}} = 0$.

</details>

### 94. QR decomposition

**Problem:** Factor $A = \begin{bmatrix} 1 & 1 \\ 1 & 0 \\ 0 & 1 \end{bmatrix}$ as $QR$.

<details>
<summary>Show solution</summary>

The columns of $A$ are the vectors from problem 93, so $Q = [\mathbf{q}_1 \; \mathbf{q}_2]$. $R$ records the dot products and lengths from Gram–Schmidt:

$$
R = \begin{bmatrix} \sqrt{2} & 1/\sqrt{2} \\ 0 & \sqrt{3/2} \end{bmatrix}
$$

**Check:** the first column of $QR$ is $\sqrt{2}\,\mathbf{q}_1 = (1, 1, 0)$.

</details>

### 95. Least squares line of best fit

**Problem:** Fit $y = c + mx$ to the points $(0, 1)$, $(1, 3)$, $(2, 4)$, $(3, 4)$.

<details>
<summary>Show solution</summary>

The system $A\mathbf{x} = \mathbf{b}$ has no exact solution, so solve the normal equations $A^{T}A\hat{\mathbf{x}} = A^{T}\mathbf{b}$:

$$
A = \begin{bmatrix} 1 & 0 \\ 1 & 1 \\ 1 & 2 \\ 1 & 3 \end{bmatrix}, \quad
A^{T}A = \begin{bmatrix} 4 & 6 \\ 6 & 14 \end{bmatrix}, \quad
A^{T}\mathbf{b} = \begin{bmatrix} 12 \\ 23 \end{bmatrix}
$$

Solving gives $c = 1.5$ and $m = 1$: the line $y = 1.5 + x$.

**Check:** the residuals are $-0.5, 0.5, 0.5, -0.5$. They sum to zero and are orthogonal to the $x$ values: $0 + 0.5 + 1 - 1.5 = 0$.

</details>

<figure>
<img src="/images/articles/linear-algebra-problems-with-solutions/least-squares-line.svg" alt="Four data points (0, 1), (1, 3), (2, 4), (3, 4) with the best-fit line y = 1.5 + x. Dashed vertical segments show residuals of 0.5 between each point and the line; their squares sum to 1." width="720" height="340" loading="lazy" decoding="async" />
<figcaption>Problem 95: least squares chooses the line that minimizes the sum of the squared vertical distances.</figcaption>
</figure>

### 96. Projection onto a column space

**Problem:** Using problem 95, find the projection of $\mathbf{b} = (1, 3, 4, 4)$ onto the column space of $A$.

<details>
<summary>Show solution</summary>

The projection is $A\hat{\mathbf{x}} = (1.5, 2.5, 3.5, 4.5)$: the fitted values. The error $\mathbf{b} - A\hat{\mathbf{x}} = (-0.5, 0.5, 0.5, -0.5)$ is perpendicular to both columns of $A$, which is exactly what the normal equations say.

</details>

### 97. Orthogonal diagonalization of a symmetric matrix

**Problem:** Write $A = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$ as $Q\Lambda Q^{T}$.

<details>
<summary>Show solution</summary>

Normalize the eigenvectors from problem 81:

$$
Q = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}, \qquad \Lambda = \begin{bmatrix} 3 & 0 \\ 0 & 1 \end{bmatrix}
$$

By the spectral theorem every real symmetric matrix has real eigenvalues and orthonormal eigenvectors, so $Q^{-1} = Q^{T}$.

</details>

### 98. Testing positive definiteness

**Problem:** Is $A = \begin{bmatrix} 2 & -1 \\ -1 & 2 \end{bmatrix}$ positive definite?

<details>
<summary>Show solution</summary>

Three equivalent tests all say yes:

- Eigenvalues: $\lambda^2 - 4\lambda + 3 = 0$ gives 1 and 3, both positive.
- Leading minors: $2 > 0$ and $\det A = 3 > 0$.
- Energy: $\mathbf{x}^{T}A\mathbf{x} = 2x^2 - 2xy + 2y^2 = x^2 + y^2 + (x - y)^2 > 0$ for every nonzero $(x, y)$.

</details>

### 99. Singular value decomposition

**Problem:** Find the singular values of $A = \begin{bmatrix} 3 & 0 \\ 4 & 5 \end{bmatrix}$ and the singular vectors.

<details>
<summary>Show solution</summary>

$$
A^{T}A = \begin{bmatrix} 25 & 20 \\ 20 & 25 \end{bmatrix}
$$

has eigenvalues 45 and 5 with eigenvectors $\mathbf{v}_1 = \tfrac{1}{\sqrt{2}}(1, 1)$ and $\mathbf{v}_2 = \tfrac{1}{\sqrt{2}}(1, -1)$. The singular values are $\sigma_1 = \sqrt{45} = 3\sqrt{5}$ and $\sigma_2 = \sqrt{5}$. The left singular vectors are $\mathbf{u}_i = A\mathbf{v}_i / \sigma_i$:

$$
\mathbf{u}_1 = \tfrac{1}{\sqrt{10}}(1, 3), \qquad \mathbf{u}_2 = \tfrac{1}{\sqrt{10}}(3, -1)
$$

**Check:** $\sigma_1\sigma_2 = 15 = |\det A|$.

</details>

### 100. Best rank-one approximation

**Problem:** Find the best rank-one approximation to $A$ from problem 99 and its error.

<details>
<summary>Show solution</summary>

Keep only the largest singular value (Eckart–Young theorem):

$$
A_1 = \sigma_1\mathbf{u}_1\mathbf{v}_1^{T} = \frac{3}{2}\begin{bmatrix} 1 & 1 \\ 3 & 3 \end{bmatrix} = \begin{bmatrix} 1.5 & 1.5 \\ 4.5 & 4.5 \end{bmatrix}
$$

The error $A - A_1 = \begin{bmatrix} 1.5 & -1.5 \\ -0.5 & 0.5 \end{bmatrix}$ has Frobenius norm $\sqrt{2.25 + 2.25 + 0.25 + 0.25} = \sqrt{5} = \sigma_2$. The same idea compresses images and powers principal component analysis.

</details>

### 101. Condition number

**Problem:** Find the condition number of $A$ from problem 99, and explain why $B = \begin{bmatrix} 1 & 1 \\ 1 & 1.0001 \end{bmatrix}$ is dangerous to solve with.

<details>
<summary>Show solution</summary>

$\kappa(A) = \sigma_1 / \sigma_2 = 3\sqrt{5} / \sqrt{5} = 3$: well-conditioned. For $B$, $\kappa(B) \approx 40\,002$. A relative error in the data can be amplified by up to that factor in the solution, so about 4 to 5 significant digits can be lost. Change the right-hand side from $(2, 2)$ to $(2, 2.0001)$ and the solution jumps from $(2, 0)$ to $(1, 1)$.

</details>

## Common mistakes

- **Treating matrix multiplication as commutative.** $AB \ne BA$ in general (problem 23), and $(AB)^{-1} = B^{-1}A^{-1}$, not $A^{-1}B^{-1}$.
- **Forgetting that a subspace must contain zero.** A line or plane that misses the origin is not a subspace (problem 63).
- **Assuming $\det(A + B) = \det A + \det B$.** Only products split: $\det(AB) = \det A \det B$. And $\det(kA) = k^n\det A$, not $k\det A$ (problem 50).
- **Counting rows instead of pivots.** Rank is the number of pivots after elimination, not the number of rows (problem 66).
- **Expecting every matrix to be diagonalizable.** A repeated eigenvalue can come with too few eigenvectors (problem 89).
- **Forming $A^{-1}$ to solve $A\mathbf{x} = \mathbf{b}$.** Elimination or a library solver is faster and more stable (problem 58), and an ill-conditioned matrix loses accuracy either way (problem 101).
- **Mixing up which side the eigenvector goes on.** $A\mathbf{v} = \lambda\mathbf{v}$ uses column vectors on the right. In row-vector code such as $\mathbf{x}P$ for Markov chains, the steady state is a left eigenvector.

## Next steps

- Connect these problems to models in [101 linear algebra concepts for machine learning and AI](/articles/linear-algebra-concepts-for-machine-learning).
- See how least squares and gradients drive training in [100 mathematical optimization techniques](/articles/mathematical-optimization-techniques).
- Review prerequisite algebra in [algebra problems with solutions for beginners](/articles/algebra-problems-with-solutions-for-beginners), or vector and matrix formulas in [mathematics formulas every student should know](/articles/math-formulas-every-student-should-know).
- Explore more topics in [100 advanced mathematics concepts with real-world applications](/articles/advanced-mathematics-concepts-with-applications) and the [mathematics category](/category/mathematics).

## References

- *Introduction to Linear Algebra*, 6th edition, Gilbert Strang, Wellesley-Cambridge Press (2023). Book site: https://math.mit.edu/~gs/linearalgebra/
- *18.06 Linear Algebra*, Gilbert Strang, MIT OpenCourseWare (Spring 2010). https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/
- *Linear Algebra*, Jim Hefferon, free textbook (4th edition, 2020). https://hefferon.net/linearalgebra/
- *A First Course in Linear Algebra*, Robert A. Beezer, open textbook. http://linear.pugetsound.edu/
- *Numerical Linear Algebra*, Lloyd N. Trefethen and David Bau III, SIAM (1997): pivoting, QR, SVD and conditioning.
