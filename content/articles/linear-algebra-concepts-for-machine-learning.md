---
title: 101 Best Linear Algebra Concepts for Machine Learning and AI
description: 101 linear algebra concepts behind machine learning and AI, from vectors and dot products to SVD, PCA, gradients, attention and LoRA, with NumPy examples.
author: BlogAI Editors
publishedAt: 2026-10-16
updatedAt: 2026-10-16
status: published
categories:
  - Mathematics
  - Engineering
tags:
  - linear algebra
  - mathematics
  - machine learning
  - ai
  - deep learning
  - numpy
tocDepth: 2
---

Almost every machine learning model is a pipeline of linear algebra: data is stored as matrices, models multiply those matrices by learned weights, and training adjusts the weights using gradients that are themselves vectors and matrices. You do not need a research-level background to work with these models, but you do need to recognize the handful of ideas that keep reappearing.

This guide collects 101 of those ideas in the order you would naturally learn them. Each entry gives a precise definition, explains where it shows up in machine learning and AI, and, where it helps, includes a small example. The NumPy snippets were run with NumPy 2.3, and the output shown under each snippet is what that code printed.

**How to use this list:** read the section headings first, then jump to whatever you are currently working on. If an entry uses an idea you have not met yet, it is almost always defined in an earlier entry.

## Vectors and vector spaces

### 1. Scalars, vectors, matrices and tensors

A **scalar** is a single number, a **vector** is an ordered list of numbers, a **matrix** is a rectangular grid of numbers, and a **tensor** is the general name for an array with any number of axes. In machine learning the number of axes is often called the array's *rank* or *ndim* (not to be confused with matrix rank, entry 51).

$$
x \in \mathbb{R}, \qquad \mathbf{v} \in \mathbb{R}^{n}, \qquad A \in \mathbb{R}^{m \times n}, \qquad \mathcal{T} \in \mathbb{R}^{b \times s \times d}
$$

A batch of 32 sentences, each 128 tokens long, with 768 numbers per token, is a tensor of shape $(32, 128, 768)$.

### 2. A vector as a feature representation

A data point becomes a vector by listing its measurable features in a fixed order. A house with 3 bedrooms, 2 bathrooms and 140 square meters could be $\mathbf{x} = (3, 2, 140)$. Once data are vectors, "similar data points" can be measured with geometry, which is the premise behind nearest-neighbor methods, clustering and embeddings.

Feature *order* and *scale* matter: swapping two features changes the meaning of every weight, and a feature measured in large units can dominate distances (see entry 16).

### 3. Vector addition and scalar multiplication

Vectors of the same length add component by component, and multiplying by a scalar scales every component:

$$
\mathbf{u} + \mathbf{v} = (u_1 + v_1, \dots, u_n + v_n), \qquad c\,\mathbf{v} = (c v_1, \dots, c v_n)
$$

Every gradient-descent step (entry 92) is exactly these two operations: scale the gradient by the learning rate, then add it to the weights.

### 4. Linear combination

A **linear combination** of vectors $\mathbf{v}_1, \dots, \mathbf{v}_k$ is any sum $c_1\mathbf{v}_1 + \cdots + c_k\mathbf{v}_k$. A linear model's prediction $\hat{y} = w_1 x_1 + \cdots + w_n x_n$ is a linear combination of features, and a matrix-vector product is a linear combination of the matrix's columns (entry 28).

### 5. Vector space

A **vector space** is a set of objects that can be added together and multiplied by scalars while staying in the set, with the usual rules (associativity, a zero vector, additive inverses, distributivity). $\mathbb{R}^n$ is the vector space you will use most, but functions, polynomials and matrices of a fixed shape also form vector spaces.

### 6. Subspace

A **subspace** is a subset of a vector space that contains the zero vector and is closed under addition and scalar multiplication. A line or plane through the origin in $\mathbb{R}^3$ is a subspace; a plane that misses the origin is not. Column spaces and null spaces (entries 49–50) are the subspaces that matter most in practice.

### 7. Span

The **span** of a set of vectors is the set of all their linear combinations. The span of $(1, 0, 0)$ and $(0, 1, 0)$ is the $xy$-plane in $\mathbb{R}^3$. In a linear regression, the predictions the model can possibly produce are exactly the span of the feature columns.

### 8. Linear independence

Vectors are **linearly independent** if the only combination that gives zero is the one with all coefficients zero:

$$
c_1\mathbf{v}_1 + \cdots + c_k\mathbf{v}_k = \mathbf{0} \;\Longrightarrow\; c_1 = \cdots = c_k = 0
$$

If one feature column is a combination of others (for example, a "total price" column equal to "price" plus "tax"), the columns are dependent and regression weights are no longer uniquely determined (entry 53).

### 9. Basis

A **basis** is a linearly independent set that spans the space. Every vector in the space can be written in exactly one way as a combination of basis vectors, and those coefficients are its coordinates in that basis. The standard basis of $\mathbb{R}^3$ is $\mathbf{e}_1 = (1,0,0)$, $\mathbf{e}_2 = (0,1,0)$, $\mathbf{e}_3 = (0,0,1)$.

### 10. Dimension

The **dimension** of a space is the number of vectors in any of its bases. "Embedding dimension 768" means each token is represented by coordinates in a 768-dimensional space. Dimensionality reduction (entries 80–84) looks for a lower-dimensional subspace that keeps most of the useful information.

## Norms and distances

### 11. The L2 (Euclidean) norm

The **L2 norm** is the ordinary length of a vector:

$$
\lVert \mathbf{x} \rVert_2 = \sqrt{x_1^2 + x_2^2 + \cdots + x_n^2}
$$

For $\mathbf{x} = (3, 4)$, $\lVert \mathbf{x} \rVert_2 = \sqrt{9 + 16} = 5$. It is the norm behind mean squared error, weight decay and Euclidean distance.

### 12. The L1 norm

The **L1 norm** sums absolute values: $\lVert \mathbf{x} \rVert_1 = \sum_i \lvert x_i \rvert$. For $(3, -4)$ it is $7$. Penalizing the L1 norm of model weights (lasso) tends to push many weights to exactly zero, which gives sparse, easier-to-interpret models.

### 13. The max (L-infinity) norm

The **max norm** is the largest absolute component: $\lVert \mathbf{x} \rVert_\infty = \max_i \lvert x_i \rvert$. It appears in adversarial machine learning, where an "$\varepsilon$-bounded" attack is often one that changes no single input value (for example, a pixel) by more than $\varepsilon$.

### 14. The general p-norm

All three norms above belong to one family:

$$
\lVert \mathbf{x} \rVert_p = \Big( \sum_i \lvert x_i \rvert^p \Big)^{1/p}, \qquad p \ge 1
$$

```python
import numpy as np

x = np.array([3.0, -4.0])
print(np.linalg.norm(x, 1), np.linalg.norm(x, 2), np.linalg.norm(x, np.inf))
```

```text
7.0 5.0 4.0
```

### 15. Unit vectors and normalization

A **unit vector** has norm 1. Dividing a nonzero vector by its norm, $\hat{\mathbf{x}} = \mathbf{x} / \lVert \mathbf{x} \rVert_2$, keeps its direction and discards its length. Normalizing embeddings to unit length turns the dot product into cosine similarity (entry 21), which is why many retrieval systems store normalized vectors.

### 16. Euclidean distance

The distance between two points is the norm of their difference: $d(\mathbf{x}, \mathbf{y}) = \lVert \mathbf{x} - \mathbf{y} \rVert_2$. k-nearest neighbors and k-means clustering both rely on it. Because distance mixes all features together, features are usually standardized first so that a feature measured in thousands does not drown out one measured in fractions.

### 17. Norm penalties as regularization

Adding a norm of the weights to the loss discourages large or unnecessary weights:

$$
\text{L2 (ridge)}: \; \mathcal{L}(\mathbf{w}) + \lambda \lVert \mathbf{w} \rVert_2^2, \qquad \text{L1 (lasso)}: \; \mathcal{L}(\mathbf{w}) + \lambda \lVert \mathbf{w} \rVert_1
$$

The hyperparameter $\lambda$ controls the trade-off between fitting the training data and keeping the weights small. Ridge regression even has a closed-form solution (entry 67).

### 18. The Frobenius norm

The **Frobenius norm** treats a matrix as one long vector:

$$
\lVert A \rVert_F = \sqrt{\sum_{i,j} a_{ij}^2} = \sqrt{\operatorname{tr}(A^\top A)}
$$

It measures reconstruction error in low-rank approximation (entry 80) and in matrix factorization recommenders (entry 85).

## Dot products and similarity

### 19. The dot product

The **dot product** multiplies matching components and adds the results:

$$
\mathbf{u} \cdot \mathbf{v} = \mathbf{u}^\top \mathbf{v} = \sum_{i=1}^{n} u_i v_i
$$

For $\mathbf{u} = (1, 2, 3)$ and $\mathbf{v} = (4, 5, 6)$, $\mathbf{u} \cdot \mathbf{v} = 4 + 10 + 18 = 32$. A single neuron computes a dot product between its weights and its inputs, then adds a bias.

### 20. The geometric meaning of the dot product

The dot product also equals the product of the lengths times the cosine of the angle between the vectors:

$$
\mathbf{u} \cdot \mathbf{v} = \lVert \mathbf{u} \rVert \, \lVert \mathbf{v} \rVert \cos\theta
$$

A large positive value means the vectors point in similar directions, zero means they are perpendicular, and a negative value means they point in roughly opposite directions.

### 21. Cosine similarity

**Cosine similarity** keeps only the angle:

$$
\cos\theta = \frac{\mathbf{u} \cdot \mathbf{v}}{\lVert \mathbf{u} \rVert \, \lVert \mathbf{v} \rVert}
$$

It ranges from $-1$ to $1$ and ignores vector length, which is useful when length reflects something like document size rather than meaning.

```python
import numpy as np

u = np.array([1.0, 2.0, 3.0])
v = np.array([2.0, 4.0, 6.5])
w = np.array([-3.0, 0.0, 1.0])

def cosine(a, b):
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))

print(round(cosine(u, v), 4), round(cosine(u, w), 4))
```

```text
0.9993 0.0
```

### 22. Orthogonal vectors

Two vectors are **orthogonal** when their dot product is zero. Orthogonal directions carry non-overlapping information, which is why principal components (entry 82) and the columns of orthogonal matrices (entry 57) are so convenient to work with.

### 23. Embeddings and nearest-neighbor search

An **embedding** maps an item such as a word, image or document to a vector so that related items end up close together. Word-vector models such as those of Mikolov et al. (2013) were evaluated on how well vector similarity captured syntactic and semantic word relationships. Semantic search, recommendation and retrieval-augmented generation all reduce to the same linear algebra: embed the query, then find the stored vectors with the highest dot product or cosine similarity.

### 24. The outer product

The **outer product** of $\mathbf{u} \in \mathbb{R}^m$ and $\mathbf{v} \in \mathbb{R}^n$ is the $m \times n$ matrix $\mathbf{u}\mathbf{v}^\top$, whose $(i, j)$ entry is $u_i v_j$. Every outer product has rank 1, and every matrix is a sum of rank-1 outer products, which is exactly what the SVD (entry 78) writes down.

### 25. The Hadamard (element-wise) product

The **Hadamard product** $A \odot B$ multiplies matching entries of two same-shaped arrays. It is not matrix multiplication. Gates in LSTMs, attention masks and dropout masks are all applied with element-wise products; in NumPy it is `A * B`, while matrix multiplication is `A @ B`.

### 26. The Cauchy–Schwarz inequality

For any two vectors,

$$
\lvert \mathbf{u} \cdot \mathbf{v} \rvert \le \lVert \mathbf{u} \rVert \, \lVert \mathbf{v} \rVert
$$

This is why cosine similarity can never leave $[-1, 1]$, and it is a workhorse in proofs about learning algorithms, for example bounding how much a prediction can change when the input changes.

## Matrices as linear maps

### 27. The data (design) matrix

A dataset with $m$ examples and $n$ features is stored as an $m \times n$ matrix $X$: one row per example, one column per feature. Most libraries follow this "rows are samples" convention, so a whole batch of predictions from a linear model is the single product $X\mathbf{w}$.

### 28. Matrix-vector product as a combination of columns

The product $A\mathbf{x}$ can be read two ways: each output entry is a dot product of a row of $A$ with $\mathbf{x}$, or, equivalently, the whole output is a linear combination of the columns of $A$ weighted by the entries of $\mathbf{x}$:

$$
\begin{bmatrix} 1 & 2 \\ 3 & 4 \\ 5 & 6 \end{bmatrix} \begin{bmatrix} 2 \\ -1 \end{bmatrix}
= 2 \begin{bmatrix} 1 \\ 3 \\ 5 \end{bmatrix} - 1 \begin{bmatrix} 2 \\ 4 \\ 6 \end{bmatrix}
= \begin{bmatrix} 0 \\ 2 \\ 4 \end{bmatrix}
$$

The column view explains why the possible outputs of $A\mathbf{x}$ form the column space of $A$ (entry 49).

### 29. Linear maps

A function $f$ is **linear** if $f(\mathbf{x} + \mathbf{y}) = f(\mathbf{x}) + f(\mathbf{y})$ and $f(c\,\mathbf{x}) = c\,f(\mathbf{x})$. Every linear map between finite-dimensional spaces can be written as multiplication by a matrix, so "matrix" and "linear transformation" are two views of the same object. Rotations, scalings, projections and shears are all linear maps.

### 30. Matrix multiplication is composition

If $B$ maps $\mathbf{x}$ to $B\mathbf{x}$ and $A$ then maps that to $A(B\mathbf{x})$, the combined map is the single matrix $AB$. The entry $(AB)_{ij}$ is the dot product of row $i$ of $A$ with column $j$ of $B$, and the inner dimensions must match: an $m \times k$ matrix times a $k \times n$ matrix gives an $m \times n$ matrix.

### 31. Matrix multiplication is not commutative

In general $AB \ne BA$, and one of the two products may not even be defined. Order matters in code too: `X @ W` and `W @ X` are different computations, and shape errors in neural network code are very often a transposed or swapped product.

```python
import numpy as np

A = np.array([[1, 2], [0, 1]])
B = np.array([[0, 1], [1, 0]])
print(A @ B)
print(B @ A)
```

```text
[[2 1]
 [1 0]]
[[0 1]
 [1 2]]
```

### 32. The identity matrix

The **identity matrix** $I$ has ones on the diagonal and zeros elsewhere, and $AI = IA = A$. Residual connections in deep networks compute $\mathbf{x} + f(\mathbf{x})$, which is the identity map plus a learned correction; at initialization this makes it easy for a very deep network to behave close to the identity.

### 33. The transpose

The **transpose** $A^\top$ swaps rows and columns: $(A^\top)_{ij} = a_{ji}$. Two rules come up constantly: $(AB)^\top = B^\top A^\top$, and $\mathbf{u} \cdot \mathbf{v} = \mathbf{u}^\top\mathbf{v}$. In backpropagation, gradients flow backward through a layer $\mathbf{y} = W\mathbf{x}$ by multiplying with $W^\top$.

### 34. Symmetric matrices

A matrix is **symmetric** if $A = A^\top$. Covariance matrices, Gram matrices $X^\top X$, kernel matrices and Hessians of smooth functions are all symmetric, and symmetric matrices have especially well-behaved eigenvalues (entry 73).

### 35. Diagonal matrices

A **diagonal matrix** has nonzero entries only on its main diagonal. Multiplying by $\operatorname{diag}(d_1, \dots, d_n)$ simply scales coordinate $i$ by $d_i$, so diagonal matrices are cheap to store, multiply and invert. Many matrix decompositions (eigendecomposition, SVD) exist precisely to turn a general matrix into a diagonal one in a well-chosen basis.

### 36. A fully connected layer

A dense (fully connected) neural network layer computes

$$
\mathbf{y} = \sigma(W\mathbf{x} + \mathbf{b})
$$

where $W$ is a weight matrix, $\mathbf{b}$ a bias vector and $\sigma$ a nonlinearity applied element-wise. A layer mapping 784 inputs to 128 outputs has a $128 \times 784$ weight matrix, which is $100{,}352$ weights plus 128 biases.

### 37. Linear versus affine maps

$W\mathbf{x}$ is linear, but $W\mathbf{x} + \mathbf{b}$ is **affine**: it is linear plus a shift, and it does not map zero to zero. A common trick appends a constant 1 to every input so the bias becomes one extra column of $W$, turning the affine map back into a purely linear one.

### 38. Why stacked linear layers collapse

Two linear layers with no nonlinearity between them are equivalent to one: $W_2(W_1\mathbf{x}) = (W_2W_1)\mathbf{x}$. However many such layers you stack, the network can only represent linear functions. Nonlinear activations such as ReLU are what give depth its extra expressive power.

### 39. The trace

The **trace** is the sum of the diagonal entries, $\operatorname{tr}(A) = \sum_i a_{ii}$. It equals the sum of the eigenvalues, is unchanged by cyclic permutations ($\operatorname{tr}(ABC) = \operatorname{tr}(CAB)$), and gives compact formulas such as $\lVert A \rVert_F^2 = \operatorname{tr}(A^\top A)$. The cyclic property is used constantly when deriving matrix gradients.

### 40. Batched matrix multiplication

Deep learning frameworks apply the same matrix product to many inputs at once. With a batch $X$ of shape $(b, n)$ and weights $W$ of shape $(n, k)$, `X @ W` has shape $(b, k)$. For stacks of matrices, `@` multiplies the last two axes and broadcasts over the leading ones.

```python
import numpy as np

rng = np.random.default_rng(0)
X = rng.normal(size=(32, 10, 64))   # batch, sequence, features
W = rng.normal(size=(64, 16))
print((X @ W).shape)
```

```text
(32, 10, 16)
```

## Systems of equations, inverses and determinants

### 41. Linear systems Ax = b

A **linear system** asks for the $\mathbf{x}$ with $A\mathbf{x} = \mathbf{b}$. It has exactly one solution, infinitely many, or none, depending on whether $\mathbf{b}$ lies in the column space of $A$ and whether $A$ has a nontrivial null space. Fitting a model often amounts to solving (or approximately solving) such a system.

### 42. Gaussian elimination

**Gaussian elimination** solves $A\mathbf{x} = \mathbf{b}$ by subtracting multiples of rows to create zeros below the diagonal, then back-substituting. It costs on the order of $n^3$ operations for an $n \times n$ system and is the algorithm underneath most direct solvers.

### 43. LU decomposition

Elimination can be recorded as a factorization $A = LU$ (usually with row swaps, $PA = LU$), where $L$ is lower triangular and $U$ is upper triangular. Once $A$ is factored, each new right-hand side $\mathbf{b}$ costs only two cheap triangular solves.

### 44. The matrix inverse

A square matrix $A$ is **invertible** if there is a matrix $A^{-1}$ with $AA^{-1} = A^{-1}A = I$. For a $2 \times 2$ matrix,

$$
\begin{bmatrix} a & b \\ c & d \end{bmatrix}^{-1} = \frac{1}{ad - bc} \begin{bmatrix} d & -b \\ -c & a \end{bmatrix}, \qquad ad - bc \ne 0
$$

The inverse is mainly a theoretical tool; in code you rarely compute it explicitly (entry 47).

### 45. The determinant

The **determinant** $\det(A)$ is the factor by which the linear map $A$ scales area (in 2D) or volume (in higher dimensions), with a sign that records whether orientation flips. $\det(AB) = \det(A)\det(B)$, and $A$ is invertible exactly when $\det(A) \ne 0$. Normalizing flows use log-determinants of Jacobians (entry 89) to track how a transformation stretches probability density.

### 46. Singular matrices

A square matrix with $\det(A) = 0$ is **singular**: it squashes some direction to zero, so information is lost and the map cannot be undone. In practice, matrices that are *nearly* singular are the real danger, because they make solutions extremely sensitive to small errors (entry 69).

### 47. Solve, do not invert

Writing $\mathbf{x} = A^{-1}\mathbf{b}$ is fine on paper, but computing $A^{-1}$ and then multiplying is slower and usually less accurate than solving the system directly with a factorization, as John D. Cook explains in "Don't invert that matrix" (2010). In NumPy, prefer `np.linalg.solve(A, b)` over `np.linalg.inv(A) @ b`.

```python
import numpy as np

A = np.array([[4.0, 1.0], [2.0, 3.0]])
b = np.array([1.0, 2.0])
x = np.linalg.solve(A, b)
print(x, np.allclose(A @ x, b))
```

```text
[0.1 0.6] True
```

### 48. The Moore–Penrose pseudoinverse

Non-square or singular matrices have no inverse, but every matrix has a **pseudoinverse** $A^{+}$, computed from the SVD by inverting only the nonzero singular values. $A^{+}\mathbf{b}$ gives the least-squares solution of $A\mathbf{x} \approx \mathbf{b}$, and among all least-squares solutions it picks the one with the smallest norm. NumPy provides it as `np.linalg.pinv`.

## Rank and the four fundamental subspaces

### 49. Column space

The **column space** of $A$ is the span of its columns, which is the set of all possible outputs $A\mathbf{x}$. $A\mathbf{x} = \mathbf{b}$ has a solution exactly when $\mathbf{b}$ is in the column space. Least squares (entry 64) finds the point of the column space closest to $\mathbf{b}$ when $\mathbf{b}$ is not in it.

### 50. Null space

The **null space** of $A$ is the set of all $\mathbf{x}$ with $A\mathbf{x} = \mathbf{0}$. If it contains a nonzero vector $\mathbf{n}$, then $\mathbf{x}$ and $\mathbf{x} + \mathbf{n}$ produce identical outputs, so the inputs cannot be told apart from the outputs. For a model's weights, a nontrivial null space of the data matrix means different weight vectors make exactly the same predictions.

### 51. Rank

The **rank** of a matrix is the dimension of its column space, which always equals the dimension of its row space. A $1000 \times 50$ data matrix has rank at most 50; if its rank is lower, some features are redundant combinations of others.

```python
import numpy as np

X = np.array([[1.0, 2.0, 3.0],
              [2.0, 4.0, 6.1],
              [0.0, 1.0, 1.0],
              [1.0, 0.0, 1.0]])
X_dependent = X.copy()
X_dependent[:, 2] = X[:, 0] + X[:, 1]   # third column = first + second
print(np.linalg.matrix_rank(X), np.linalg.matrix_rank(X_dependent))
```

```text
3 2
```

### 52. The rank–nullity theorem

For an $m \times n$ matrix,

$$
\operatorname{rank}(A) + \dim \operatorname{null}(A) = n
$$

Every input dimension either survives into the output (rank) or is lost in the null space. It is a quick sanity check: a $3 \times 5$ matrix has rank at most 3, so its null space has dimension at least 2.

### 53. Full rank, multicollinearity and identifiability

When the columns of a data matrix are linearly independent ("full column rank"), the least-squares weights are unique. When features are exactly or nearly dependent, a situation statisticians call **multicollinearity**, the weights become non-unique or extremely unstable even though predictions may still look fine. Dropping redundant features or adding ridge regularization (entry 67) restores a unique, stable answer.

### 54. Low-rank matrices

A matrix of rank $r$ can be written as the product of an $m \times r$ and an $r \times n$ matrix, which takes $r(m + n)$ numbers instead of $mn$. Many real matrices, such as user–item ratings or the weight updates during fine-tuning, are well approximated by low-rank matrices, which is the idea behind matrix factorization (entry 85) and LoRA (entry 100).

### 55. The four fundamental subspaces

Every $m \times n$ matrix $A$ defines four subspaces: the column space and left null space (in $\mathbb{R}^m$), and the row space and null space (in $\mathbb{R}^n$). Within each pair the two subspaces are orthogonal complements. Gilbert Strang's MIT course 18.06 is organized around this picture, and it explains at a glance when systems are solvable and when solutions are unique.

## Orthogonality and projections

### 56. Orthonormal bases

An **orthonormal** set of vectors is mutually orthogonal and each has length 1. In an orthonormal basis $\mathbf{q}_1, \dots, \mathbf{q}_n$, coordinates are just dot products: $\mathbf{x} = \sum_i (\mathbf{q}_i^\top\mathbf{x})\,\mathbf{q}_i$. No system needs to be solved, which is why orthonormal bases make computations both simple and numerically stable.

### 57. Orthogonal matrices

A square matrix $Q$ whose columns are orthonormal satisfies $Q^\top Q = I$, so $Q^{-1} = Q^\top$. Orthogonal matrices preserve lengths and angles ($\lVert Q\mathbf{x} \rVert = \lVert \mathbf{x} \rVert$); they represent rotations and reflections. Orthogonal weight initialization is used in some deep and recurrent networks because repeatedly multiplying by an orthogonal matrix neither blows up nor shrinks the signal.

### 58. Projection onto a vector

The projection of $\mathbf{b}$ onto the line through $\mathbf{a}$ is

$$
\operatorname{proj}_{\mathbf{a}}(\mathbf{b}) = \frac{\mathbf{a}^\top\mathbf{b}}{\mathbf{a}^\top\mathbf{a}}\,\mathbf{a}
$$

and the leftover $\mathbf{b} - \operatorname{proj}_{\mathbf{a}}(\mathbf{b})$ is orthogonal to $\mathbf{a}$. For $\mathbf{a} = (1, 1)$ and $\mathbf{b} = (2, 0)$, the projection is $(1, 1)$ and the leftover $(1, -1)$ is indeed perpendicular to $\mathbf{a}$.

### 59. Projection onto a subspace

If the columns of $A$ are independent, the matrix that projects onto the column space of $A$ is

$$
P = A (A^\top A)^{-1} A^\top
$$

$P$ is symmetric and satisfies $P^2 = P$ (projecting twice changes nothing). The fitted values of linear regression are $\hat{\mathbf{y}} = P\mathbf{y}$, which is why statisticians call $P$ the "hat matrix".

### 60. The Gram–Schmidt process

**Gram–Schmidt** turns independent vectors into an orthonormal basis for the same span: take each vector in turn, subtract its projections onto the vectors already processed, and normalize what is left. In floating-point arithmetic the classical version can lose orthogonality, so libraries use modified Gram–Schmidt or Householder reflections instead.

### 61. QR decomposition

Every matrix with independent columns factors as $A = QR$, with $Q$ having orthonormal columns and $R$ upper triangular. QR is the numerically preferred way to solve least-squares problems (entry 66), and repeated QR steps are the basis of the classical algorithm for computing eigenvalues.

```python
import numpy as np

A = np.array([[1.0, 1.0], [1.0, 0.0], [0.0, 1.0]])
Q, R = np.linalg.qr(A)
print(np.allclose(Q.T @ Q, np.eye(2)), np.allclose(Q @ R, A))
```

```text
True True
```

### 62. Change of basis

The same vector has different coordinates in different bases. If the columns of $B$ are a basis, the coordinates $\mathbf{c}$ of $\mathbf{x}$ in that basis satisfy $B\mathbf{c} = \mathbf{x}$, and a linear map with matrix $A$ in standard coordinates has matrix $B^{-1}AB$ in the new basis. PCA (entry 82) is a change to the basis of principal directions.

### 63. Rotations preserve geometry

Because orthogonal matrices preserve dot products, rotating every vector in a dataset changes no distances or angles. This is why embeddings are only meaningful up to rotation, and why you should compare two embedding spaces with methods that first align them (for example, orthogonal Procrustes) rather than coordinate by coordinate.

## Least squares and regression

### 64. The least-squares problem

When $A\mathbf{x} = \mathbf{b}$ has no exact solution (more equations than unknowns, plus noise), least squares picks the $\mathbf{x}$ that minimizes the squared error:

$$
\hat{\mathbf{x}} = \arg\min_{\mathbf{x}} \lVert A\mathbf{x} - \mathbf{b} \rVert_2^2
$$

Ordinary linear regression is exactly this problem, with $A$ the design matrix and $\mathbf{b}$ the targets.

### 65. The normal equations

Setting the gradient of $\lVert A\mathbf{x} - \mathbf{b} \rVert^2$ to zero gives the **normal equations**:

$$
A^\top A\,\hat{\mathbf{x}} = A^\top \mathbf{b}
$$

They are compact and good for derivations, but forming $A^\top A$ squares the condition number (entry 69), so numerical libraries usually avoid them.

### 66. Least squares in practice

`np.linalg.lstsq` minimizes $\lVert \mathbf{b} - A\mathbf{x} \rVert_2$ using an SVD-based method, and returns the minimum-norm solution when several minimizers exist. Here it fits a line to five points:

```python
import numpy as np

x = np.array([0.0, 1.0, 2.0, 3.0, 4.0])
y = np.array([1.1, 2.9, 5.2, 7.1, 8.8])
A = np.column_stack([x, np.ones_like(x)])   # columns: slope, intercept
(slope, intercept), *_ = np.linalg.lstsq(A, y)
print(round(slope, 3), round(intercept, 3))
```

```text
1.96 1.1
```

### 67. Ridge regression in closed form

Adding an L2 penalty to least squares gives

$$
\hat{\mathbf{w}} = (X^\top X + \lambda I)^{-1} X^\top \mathbf{y}
$$

The $\lambda I$ term makes the matrix invertible even when $X^\top X$ is singular, and it shrinks the weights toward zero. Larger $\lambda$ means more shrinkage, lower variance and more bias.

### 68. Residuals are orthogonal to the features

At the least-squares solution, the residual $\mathbf{r} = \mathbf{b} - A\hat{\mathbf{x}}$ is orthogonal to every column of $A$: $A^\top\mathbf{r} = \mathbf{0}$. That is the normal equations restated, and it is why, when the model includes an intercept column, linear-regression residuals always sum to zero.

### 69. The condition number

The **condition number** $\kappa(A) = \sigma_{\max} / \sigma_{\min}$ (the ratio of the largest to smallest singular value) measures how much relative errors in the input can be amplified in the solution of $A\mathbf{x} = \mathbf{b}$. A rough rule is that you can lose about $\log_{10}\kappa(A)$ digits of accuracy. Because $\kappa(A^\top A) = \kappa(A)^2$, solving the normal equations can lose twice as many digits as a QR or SVD approach.

```python
import numpy as np

A = np.array([[1.0, 1.0], [1.0, 1.0001]])
print(f"{np.linalg.cond(A):.3g}", f"{np.linalg.cond(A.T @ A):.3g}")
```

```text
4e+04 1.6e+09
```

## Eigenvalues and eigenvectors

### 70. Eigenvalues and eigenvectors

A nonzero vector $\mathbf{v}$ is an **eigenvector** of a square matrix $A$ if multiplying by $A$ only scales it:

$$
A\mathbf{v} = \lambda \mathbf{v}
$$

The scale factor $\lambda$ is the **eigenvalue**. Eigenvectors are the directions a linear map stretches without turning, and they describe its long-run behavior when applied repeatedly.

### 71. The characteristic polynomial

The eigenvalues are the roots of $\det(A - \lambda I) = 0$. For $A = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$ this is $(2 - \lambda)^2 - 1 = 0$, so $\lambda = 1$ and $\lambda = 3$. This is a hand-calculation tool; numerical software computes eigenvalues with iterative algorithms instead of finding polynomial roots.

### 72. Eigendecomposition (diagonalization)

If an $n \times n$ matrix has $n$ independent eigenvectors, collected as the columns of $V$, then

$$
A = V \Lambda V^{-1}
$$

with the eigenvalues on the diagonal of $\Lambda$. Powers become easy, $A^k = V\Lambda^kV^{-1}$, which explains why repeated multiplication is dominated by the largest eigenvalues, a key idea behind exploding and vanishing gradients in recurrent networks.

### 73. The spectral theorem

A real symmetric matrix always has real eigenvalues and an orthonormal set of eigenvectors, so

$$
A = Q \Lambda Q^\top
$$

with $Q$ orthogonal. Covariance matrices are symmetric, which is what makes PCA (entry 82) work so cleanly.

```python
import numpy as np

A = np.array([[2.0, 1.0], [1.0, 2.0]])
eigenvalues, Q = np.linalg.eigh(A)   # eigh is for symmetric matrices
print(eigenvalues)
print(np.allclose(Q @ np.diag(eigenvalues) @ Q.T, A))
```

```text
[1. 3.]
True
```

### 74. Positive definite and semidefinite matrices

A symmetric matrix $A$ is **positive definite** if $\mathbf{x}^\top A\mathbf{x} > 0$ for every nonzero $\mathbf{x}$ (equivalently, all eigenvalues are positive), and **positive semidefinite** if $\mathbf{x}^\top A\mathbf{x} \ge 0$. Covariance matrices and Gram matrices $X^\top X$ are always positive semidefinite, and a valid kernel in a support vector machine must produce positive semidefinite kernel matrices.

### 75. Cholesky decomposition

A positive definite matrix factors as $A = LL^\top$ with $L$ lower triangular. Cholesky is about twice as fast as LU, and it is the standard way to sample from a multivariate Gaussian: if $\mathbf{z}$ has independent standard-normal entries and $\Sigma = LL^\top$, then $\boldsymbol{\mu} + L\mathbf{z}$ has mean $\boldsymbol{\mu}$ and covariance $\Sigma$. Gaussian-process libraries also rely on it.

### 76. Power iteration

Multiplying a vector by $A$ over and over, and renormalizing each time, converges (under mild conditions) to the eigenvector with the largest-magnitude eigenvalue. This **power iteration** is simple enough to run on enormous sparse matrices, and it is the classic way to compute PageRank-style scores on a link graph.

```python
import numpy as np

A = np.array([[2.0, 1.0], [1.0, 2.0]])
v = np.array([1.0, 0.0])
for _ in range(50):
    v = A @ v
    v = v / np.linalg.norm(v)
print(np.round(v, 4), round(v @ A @ v, 4))   # eigenvector and its eigenvalue
```

```text
[0.7071 0.7071] 3.0
```

### 77. Markov chains and stationary distributions

A Markov chain with transition matrix $P$ (each row sums to 1) has a stationary distribution $\boldsymbol{\pi}$ with $\boldsymbol{\pi}^\top P = \boldsymbol{\pi}^\top$, which is a left eigenvector with eigenvalue 1. Long-run behavior in random-walk models, MCMC samplers and PageRank is governed by this eigenvector.

## SVD, PCA and dimensionality reduction

### 78. Singular value decomposition (SVD)

Every real $m \times n$ matrix, square or not, factors as

$$
A = U \Sigma V^\top
$$

where $U$ and $V$ have orthonormal columns and $\Sigma$ is diagonal with nonnegative **singular values** $\sigma_1 \ge \sigma_2 \ge \cdots \ge 0$. Equivalently, $A = \sum_i \sigma_i \mathbf{u}_i \mathbf{v}_i^\top$, a sum of rank-1 pieces ordered by importance. NumPy's `np.linalg.svd` returns `U`, `S` and `Vh` (that is, $V^\top$), with the singular values sorted in descending order.

### 79. The geometry of the SVD

The SVD says every linear map is a rotation (or reflection) $V^\top$, followed by stretching each axis by $\sigma_i$, followed by another rotation $U$. The largest singular value is the most any unit vector can be stretched, and the number of nonzero singular values is the rank.

### 80. Truncated SVD and the best low-rank approximation

Keeping only the top $k$ singular values gives

$$
A_k = \sum_{i=1}^{k} \sigma_i \mathbf{u}_i \mathbf{v}_i^\top
$$

By the Eckart–Young theorem, $A_k$ is the closest rank-$k$ matrix to $A$ in both the Frobenius and spectral norms, and the Frobenius error is $\sqrt{\sigma_{k+1}^2 + \cdots}$. This underlies image compression demos, latent semantic analysis and many model-compression methods.

```python
import numpy as np

rng = np.random.default_rng(0)
A = rng.normal(size=(6, 4))
U, S, Vh = np.linalg.svd(A, full_matrices=False)
k = 2
A_k = (U[:, :k] * S[:k]) @ Vh[:k, :]
print(np.isclose(np.linalg.norm(A - A_k), np.sqrt(np.sum(S[k:] ** 2))))
```

```text
True
```

### 81. The covariance matrix

For a data matrix $X$ whose columns have been centered (mean subtracted), the sample covariance matrix is

$$
C = \frac{1}{m - 1} X^\top X
$$

Entry $C_{ij}$ is the covariance between features $i$ and $j$, and the diagonal holds the variances. It is symmetric and positive semidefinite.

### 82. Principal component analysis (PCA)

**PCA** finds the orthogonal directions along which the centered data vary most. They are the eigenvectors of the covariance matrix, or equivalently the right singular vectors of the centered data matrix, and projecting onto the top $k$ of them gives the best $k$-dimensional linear summary of the data in the squared-error sense. *Mathematics for Machine Learning* (Deisenroth, Faisal and Ong) devotes a full chapter to deriving it.

```python
import numpy as np

rng = np.random.default_rng(1)
t = rng.normal(size=200)
X = np.column_stack([t, 2 * t + 0.1 * rng.normal(size=200)])   # nearly 1-D data
Xc = X - X.mean(axis=0)
_, S, Vh = np.linalg.svd(Xc, full_matrices=False)
explained = S**2 / np.sum(S**2)
print(np.round(np.abs(Vh[0]), 3), np.round(explained, 4))
```

```text
[0.446 0.895] [9.996e-01 4.000e-04]
```

### 83. Explained variance

The variance captured by principal component $i$ is proportional to $\sigma_i^2$ (or to the covariance eigenvalue $\lambda_i$), so the **explained variance ratio** is $\sigma_i^2 / \sum_j \sigma_j^2$. In the example above, the first component explains almost all of the variance because the data lie close to a line. Choosing $k$ so that the cumulative ratio passes a threshold such as 95% is a common heuristic, not a rule.

### 84. Whitening

**Whitening** transforms data so its covariance becomes the identity: rotate onto the principal axes, then divide each coordinate by its standard deviation, $\mathbf{z} = \Lambda^{-1/2} Q^\top(\mathbf{x} - \boldsymbol{\mu})$. Whitened features are uncorrelated with unit variance, which can make some learning algorithms better conditioned. Directions with tiny variance get hugely amplified, so a small constant is usually added to the eigenvalues first.

### 85. Matrix factorization for recommendations

A user–item rating matrix $R$ (users by items) can be approximated as $R \approx UV^\top$, where each row of $U$ is a user's vector of latent factors and each row of $V$ is an item's. A predicted rating is a dot product $\mathbf{u}_i^\top \mathbf{v}_j$. Because most ratings are missing, the factors are fitted only to observed entries, usually with gradient descent or alternating least squares rather than a plain SVD.

### 86. The spectral norm

The **spectral norm** $\lVert A \rVert_2 = \sigma_{\max}(A)$ is the largest factor by which $A$ can stretch a vector. A layer $\mathbf{x} \mapsto W\mathbf{x}$ is Lipschitz with constant $\lVert W \rVert_2$, so constraining spectral norms bounds how sensitive a network is to input changes. *Spectral normalization*, used to stabilize GAN discriminators, divides each weight matrix by an estimate of its spectral norm (computed with power iteration, entry 76).

## Matrix calculus for training models

### 87. The gradient

For a scalar function $f(\mathbf{x})$ of a vector, the **gradient** collects all partial derivatives:

$$
\nabla f(\mathbf{x}) = \left( \frac{\partial f}{\partial x_1}, \dots, \frac{\partial f}{\partial x_n} \right)
$$

It points in the direction of steepest increase, and its length is the rate of increase in that direction. Training a model means following the negative gradient of the loss.

### 88. Two gradients worth memorizing

Two identities cover a surprising amount of machine learning:

$$
\nabla_{\mathbf{x}}\, \mathbf{x}^\top A\mathbf{x} = (A + A^\top)\mathbf{x}, \qquad \nabla_{\mathbf{w}} \lVert X\mathbf{w} - \mathbf{y} \rVert_2^2 = 2X^\top(X\mathbf{w} - \mathbf{y})
$$

For symmetric $A$ the first becomes $2A\mathbf{x}$. Setting the second to zero gives the normal equations (entry 65).

```python
import numpy as np

rng = np.random.default_rng(2)
X, y, w = rng.normal(size=(5, 3)), rng.normal(size=5), rng.normal(size=3)
loss = lambda w: np.sum((X @ w - y) ** 2)
analytic = 2 * X.T @ (X @ w - y)
h = 1e-6
numeric = np.array([(loss(w + h * e) - loss(w - h * e)) / (2 * h) for e in np.eye(3)])
print(np.allclose(analytic, numeric, atol=1e-5))
```

```text
True
```

### 89. The Jacobian

For a vector-valued function $\mathbf{f}: \mathbb{R}^n \to \mathbb{R}^m$, the **Jacobian** is the $m \times n$ matrix of partial derivatives $J_{ij} = \partial f_i / \partial x_j$. It is the best linear approximation of $\mathbf{f}$ near a point: $\mathbf{f}(\mathbf{x} + \boldsymbol{\delta}) \approx \mathbf{f}(\mathbf{x}) + J\boldsymbol{\delta}$. For a linear layer $\mathbf{f}(\mathbf{x}) = W\mathbf{x}$, the Jacobian is simply $W$.

### 90. The Hessian

The **Hessian** of a scalar function is the symmetric matrix of second derivatives, $H_{ij} = \partial^2 f / \partial x_i \partial x_j$. Its eigenvalues describe the curvature of the loss surface: large eigenvalues mean steep, narrow valleys where a big learning rate overshoots, and mixed-sign eigenvalues mean a saddle point. For least squares, the Hessian is the constant matrix $2X^\top X$.

### 91. The chain rule as Jacobian products (backpropagation)

For a composition $\mathbf{y} = \mathbf{f}(\mathbf{g}(\mathbf{x}))$, the Jacobians multiply: $J_{\mathbf{y}, \mathbf{x}} = J_{\mathbf{f}} \, J_{\mathbf{g}}$. Backpropagation evaluates this product from the loss backward, multiplying a row vector (the gradient so far) by one Jacobian at a time. That ordering is far cheaper than forming the full Jacobian matrices, because each step is a vector–matrix product rather than a matrix–matrix product.

### 92. Gradient descent

Gradient descent repeatedly updates the parameters with

$$
\mathbf{w} \leftarrow \mathbf{w} - \eta \, \nabla_{\mathbf{w}} \mathcal{L}(\mathbf{w})
$$

where $\eta$ is the learning rate. For a quadratic loss the method converges only if $\eta < 2/\lambda_{\max}$, where $\lambda_{\max}$ is the largest Hessian eigenvalue, and it converges slowly when the condition number of the Hessian is large. Optimizers such as momentum and Adam were designed largely to cope with this ill-conditioning.

### 93. Convexity and positive semidefinite Hessians

A twice-differentiable function is **convex** exactly when its Hessian is positive semidefinite everywhere. Convex losses, such as least squares, ridge and logistic regression, have no bad local minima, so gradient descent can reach the global minimum. Deep network losses are not convex, which is one reason their training behavior is harder to analyze.

## Tensors and efficient computation

### 94. Tensor shapes in deep learning

Most deep learning bugs are shape bugs, so it pays to name every axis. A transformer's hidden states typically have shape $(\text{batch}, \text{sequence}, d_\text{model})$, image batches are $(\text{batch}, \text{channels}, \text{height}, \text{width})$ in PyTorch's default layout, and attention scores have shape $(\text{batch}, \text{heads}, \text{sequence}, \text{sequence})$.

### 95. Broadcasting

**Broadcasting** lets arrays of different shapes combine without copying data. NumPy compares shapes from the last axis backward; two dimensions are compatible when they are equal or one of them is 1, and missing leading dimensions count as 1. Adding a bias vector to every row of a batch is the classic case; *Deep Learning* (Goodfellow, Bengio and Courville) describes the same convention for adding a vector to a matrix.

```python
import numpy as np

X = np.arange(6.0).reshape(3, 2)   # 3 examples, 2 features
mu = X.mean(axis=0)                # shape (2,)
print(X - mu)                      # (3, 2) - (2,) broadcasts over rows
```

```text
[[-2. -2.]
 [ 0.  0.]
 [ 2.  2.]]
```

### 96. Einstein summation (einsum)

`einsum` names each axis with a letter and sums over letters that disappear from the output. It expresses many linear algebra operations in one readable line: `"ij,j->i"` is a matrix-vector product, `"ij,jk->ik"` a matrix product, `"bqd,bkd->bqk"` a batched set of all query–key dot products.

```python
import numpy as np

rng = np.random.default_rng(3)
Q = rng.normal(size=(2, 4, 8))   # batch, queries, dim
K = rng.normal(size=(2, 5, 8))   # batch, keys, dim
scores = np.einsum("bqd,bkd->bqk", Q, K)
print(scores.shape, np.allclose(scores, Q @ K.transpose(0, 2, 1)))
```

```text
(2, 4, 5) True
```

### 97. The cost of matrix multiplication

Multiplying an $m \times k$ matrix by a $k \times n$ matrix takes $mnk$ multiply–add pairs, usually counted as $2mnk$ floating-point operations. A single $4096 \times 4096$ by $4096 \times 4096$ product is therefore about $1.4 \times 10^{11}$ operations. Because matrix products dominate the cost of training and running neural networks, hardware accelerators are built around fast matrix multiplication.

## Linear algebra inside modern AI models

### 98. Scaled dot-product attention

The core of the Transformer (Vaswani et al., 2017) is a few matrix products:

$$
\operatorname{Attention}(Q, K, V) = \operatorname{softmax}\!\left( \frac{QK^\top}{\sqrt{d_k}} \right) V
$$

Each row of $QK^\top$ holds one query's dot products with every key (entry 19), softmax turns each row into weights that sum to 1, and multiplying by $V$ takes weighted averages of the value vectors. The paper explains the $1/\sqrt{d_k}$ factor: if query and key components are independent with mean 0 and variance 1, their dot product has variance $d_k$, and large dot products push softmax into regions with extremely small gradients.

```python
import numpy as np

def attention(Q, K, V):
    scores = Q @ K.T / np.sqrt(K.shape[-1])
    scores = scores - scores.max(axis=-1, keepdims=True)   # stable softmax
    weights = np.exp(scores)
    weights = weights / weights.sum(axis=-1, keepdims=True)
    return weights @ V, weights

rng = np.random.default_rng(4)
Q, K, V = rng.normal(size=(3, 8)), rng.normal(size=(5, 8)), rng.normal(size=(5, 16))
out, weights = attention(Q, K, V)
print(out.shape, np.allclose(weights.sum(axis=1), 1.0))
```

```text
(3, 16) True
```

### 99. Multi-head attention

Instead of one attention operation, multi-head attention projects the inputs with several learned matrices and runs attention in parallel in each projected subspace:

$$
\operatorname{MultiHead}(Q, K, V) = \operatorname{Concat}(\text{head}_1, \dots, \text{head}_h)\,W^{O}, \qquad \text{head}_i = \operatorname{Attention}(QW_i^{Q}, KW_i^{K}, VW_i^{V})
$$

The base model in the original paper used $d_\text{model} = 512$ and $h = 8$ heads, so each head works in a $d_k = 64$-dimensional subspace. Each head is free to attend to different relationships, and all of it is still just matrix multiplication.

### 100. Low-rank adaptation (LoRA)

LoRA (Hu et al., 2021) fine-tunes a large model by freezing a pretrained weight matrix $W_0 \in \mathbb{R}^{d \times k}$ and learning a low-rank update:

$$
\mathbf{h} = W_0\mathbf{x} + \Delta W\,\mathbf{x} = W_0\mathbf{x} + BA\,\mathbf{x}, \qquad B \in \mathbb{R}^{d \times r}, \; A \in \mathbb{R}^{r \times k}, \; r \ll \min(d, k)
$$

$A$ starts as random Gaussian and $B$ as zero, so the update is zero at the start of training, and the update is scaled by $\alpha / r$. For a $4096 \times 4096$ matrix with $r = 8$, $B$ and $A$ together hold $8 \times (4096 + 4096) = 65{,}536$ trainable numbers instead of about 16.8 million. The paper reports up to 10,000 times fewer trainable parameters than full fine-tuning of GPT-3 175B.

### 101. Numerical precision and stability

Real computations use floating-point numbers, so algebraically equal formulas can give different answers. A few habits prevent most problems: subtract the maximum before exponentiating in softmax (as in entry 98), solve systems instead of inverting (entry 47), prefer QR or SVD over normal equations for ill-conditioned problems (entry 69), and compare floats with tolerances (`np.allclose`) rather than `==`. Lower-precision formats such as float16 and bfloat16 make these habits even more important.

```python
import numpy as np

print(0.1 + 0.2 == 0.3, np.isclose(0.1 + 0.2, 0.3))
z = np.array([1000.0, 1001.0, 1002.0])
with np.errstate(over="ignore", invalid="ignore"):
    naive = np.exp(z) / np.exp(z).sum()
stable = np.exp(z - z.max()) / np.exp(z - z.max()).sum()
print(naive, np.round(stable, 4))
```

```text
False True
[nan nan nan] [0.09   0.2447 0.6652]
```

## Common mistakes

- **Confusing `*` with `@`.** In NumPy and PyTorch, `*` is the element-wise (Hadamard) product and `@` is matrix multiplication (entries 25 and 30).
- **Mixing up the two meanings of "rank".** A tensor's number of axes and a matrix's linear-algebra rank are different things (entries 1 and 51).
- **Computing inverses to solve systems.** Use a solver or least-squares routine instead (entries 47 and 66).
- **Forgetting to center data before PCA.** Without subtracting the mean, the first component mostly points at the mean rather than along the direction of greatest variance (entry 82).
- **Comparing raw distances between unscaled features.** Standardize first, or the feature with the largest units dominates (entry 16).
- **Assuming that a small error in the inputs means a small error in the output.** Check the condition number when results look unstable (entry 69).

## Next steps

- Practice the algebra behind these ideas with [150 algebra problems with solutions](/articles/algebra-problems-with-solutions-for-beginners).
- Keep the core identities at hand with [100 mathematics formulas every student should know](/articles/math-formulas-every-student-should-know).
- See where covariance, regression and hypothesis tests show up in practice in [100 probability and statistics examples](/articles/probability-statistics-real-world-examples).
- Speed up hand calculations with [101 math tricks to solve problems faster](/articles/math-tricks-to-solve-problems-faster).
- Browse more writing on [mathematics](/category/mathematics) and [engineering](/category/engineering), including external blogs in the [community directory](/directory).

## References

1. Deisenroth, M. P., Faisal, A. A., & Ong, C. S. (2020). *Mathematics for Machine Learning*. Cambridge University Press. Free PDF: [mml-book.github.io](https://mml-book.github.io/)
2. Goodfellow, I., Bengio, Y., & Courville, A. (2016). *Deep Learning*, Chapter 2: Linear Algebra. MIT Press. [deeplearningbook.org](https://www.deeplearningbook.org/contents/linear_algebra.html)
3. Strang, G. *18.06SC Linear Algebra* (Fall 2011). MIT OpenCourseWare. [ocw.mit.edu](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/)
4. Vaswani, A., Shazeer, N., Parmar, N., et al. (2017). "Attention Is All You Need." arXiv:1706.03762. [arxiv.org](https://arxiv.org/abs/1706.03762)
5. Hu, E. J., Shen, Y., Wallis, P., et al. (2021). "LoRA: Low-Rank Adaptation of Large Language Models." arXiv:2106.09685. [arxiv.org](https://arxiv.org/abs/2106.09685)
6. Mikolov, T., Chen, K., Corrado, G., & Dean, J. (2013). "Efficient Estimation of Word Representations in Vector Space." arXiv:1301.3781. [arxiv.org](https://arxiv.org/abs/1301.3781)
7. Cook, J. D. (2010, January 19). "Don't invert that matrix." [johndcook.com](https://www.johndcook.com/blog/2010/01/19/dont-invert-that-matrix/)
8. NumPy Developers. "Broadcasting." NumPy documentation. [numpy.org](https://numpy.org/doc/stable/user/basics.broadcasting.html)
9. NumPy Developers. "numpy.linalg.svd" and "numpy.linalg.lstsq." NumPy documentation. [numpy.org](https://numpy.org/doc/stable/reference/generated/numpy.linalg.svd.html)
