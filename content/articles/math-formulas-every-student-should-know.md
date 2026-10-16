---
title: 100 Best Mathematics Formulas Every Student Should Know
description: The 100 formulas students use most, from algebra and geometry to calculus, statistics and vectors, each with symbols explained and a worked example.
author: BlogAI Editors
publishedAt: 2026-10-16
updatedAt: 2026-10-16
status: published
categories:
  - Mathematics
tags: [mathematics, formulas, algebra, geometry, trigonometry, calculus]
tocDepth: 2
---

This is a working reference for the formulas that come up again and again in school and early university mathematics: algebra, exponents and logarithms, geometry, coordinate geometry, trigonometry, sequences, calculus, probability and statistics, and vectors and matrices.

Each of the 100 entries gives the formula, what every symbol means, when to reach for it, and a short worked example. Use the sections as a checklist. If you cannot say when a formula applies, or you cannot redo its example without looking, that is the one to practise. Each formula was checked against the open textbooks and reference pages listed under [References](#references), and every worked example was recomputed numerically.

## Arithmetic and algebra

These are the algebra results that save the most time when solving equations and simplifying expressions ([OpenStax Algebra and Trigonometry 2e, sections 1.4, 1.5, 2.5 and 5.1](https://openstax.org/books/algebra-and-trigonometry-2e/pages/2-5-quadratic-equations); [Prealgebra 2e, sections 6.2 and 6.4](https://openstax.org/books/prealgebra-2e/pages/6-4-solve-simple-interest-applications)).

### 1. Quadratic formula

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

**Symbols:** $a$, $b$ and $c$ are the coefficients of $ax^2 + bx + c = 0$, with $a \neq 0$.

**Use it when:** a quadratic does not factor easily. It works for every quadratic equation in standard form.

**Example:** For $2x^2 - 3x - 2 = 0$, $x = \frac{3 \pm \sqrt{9 + 16}}{4} = \frac{3 \pm 5}{4}$, so $x = 2$ or $x = -\tfrac{1}{2}$.

### 2. Discriminant

$$
\Delta = b^2 - 4ac
$$

**Symbols:** $\Delta$ is the expression under the square root in the quadratic formula.

**Use it when:** you need to know what kind of roots a quadratic has without solving it. $\Delta > 0$ gives two real roots, $\Delta = 0$ one repeated real root, and $\Delta < 0$ two complex roots.

**Example:** For $x^2 + 4x + 5 = 0$, $\Delta = 16 - 20 = -4$, so there are no real solutions.

### 3. Square of a sum or difference

$$
(a \pm b)^2 = a^2 \pm 2ab + b^2
$$

**Symbols:** $a$ and $b$ are any real numbers or expressions.

**Use it when:** you expand a squared binomial, complete the square, or do mental arithmetic.

**Example:** $103^2 = (100 + 3)^2 = 10000 + 600 + 9 = 10609$.

### 4. Difference of squares

$$
a^2 - b^2 = (a + b)(a - b)
$$

**Symbols:** $a$ and $b$ are any real numbers or expressions.

**Use it when:** you factor an expression made of two perfect squares separated by a minus sign, or multiply two numbers placed evenly around a round number.

**Example:** $52 \times 48 = (50 + 2)(50 - 2) = 2500 - 4 = 2496$.

### 5. Sum and difference of cubes

$$
a^3 + b^3 = (a + b)(a^2 - ab + b^2), \qquad a^3 - b^3 = (a - b)(a^2 + ab + b^2)
$$

**Symbols:** $a$ and $b$ are any real numbers or expressions.

**Use it when:** you factor a sum or difference of two cubes. The quadratic factor does not factor further over the real numbers.

**Example:** $x^3 - 8 = (x - 2)(x^2 + 2x + 4)$. Check at $x = 3$: $27 - 8 = 19$ and $(1)(9 + 6 + 4) = 19$.

### 6. Binomial theorem

$$
(x + y)^n = \sum_{k=0}^{n} \binom{n}{k} x^{n-k} y^{k}
$$

**Symbols:** $n$ is a non-negative integer and $\binom{n}{k} = \frac{n!}{k!(n-k)!}$ is a binomial coefficient.

**Use it when:** you expand a power of a binomial, or need one specific term without expanding everything.

**Example:** $(x + 2)^4 = x^4 + 8x^3 + 24x^2 + 32x + 16$, using the coefficients $\binom{4}{k} 2^k = 1, 8, 24, 32, 16$.

### 7. Vertex of a parabola

$$
h = -\frac{b}{2a}, \qquad k = f(h), \qquad f(x) = a(x - h)^2 + k
$$

**Symbols:** $f(x) = ax^2 + bx + c$; $(h, k)$ is the vertex.

**Use it when:** you need the maximum or minimum value of a quadratic, or want to rewrite it in vertex form.

**Example:** For $f(x) = 2x^2 - 8x + 3$, $h = \frac{8}{4} = 2$ and $k = 8 - 16 + 3 = -5$, so the minimum is at $(2, -5)$ and $f(x) = 2(x - 2)^2 - 5$.

### 8. Simple interest

$$
I = Prt
$$

**Symbols:** $I$ is the interest, $P$ the principal, $r$ the annual rate as a decimal, and $t$ the time in years.

**Use it when:** interest is paid only on the original principal, not on earlier interest.

**Example:** \$2,000 at 5% for 3 years earns $I = 2000 \times 0.05 \times 3 = 300$, so \$300.

### 9. Percent change

$$
\text{percent change} = \frac{\text{new} - \text{original}}{\text{original}} \times 100\%
$$

**Symbols:** "original" is the starting value and "new" is the value after the change. A negative result is a decrease.

**Use it when:** you compare a value before and after a change, such as prices, scores or populations.

**Example:** A price rising from 80 to 92 changes by $\frac{12}{80} \times 100\% = 15\%$.

## Exponents and logarithms

The exponent rules come from [Algebra and Trigonometry 2e, sections 1.2 and 1.3](https://openstax.org/books/algebra-and-trigonometry-2e/pages/1-2-exponents-and-scientific-notation); the logarithm rules from [sections 6.3 and 6.5](https://openstax.org/books/algebra-and-trigonometry-2e/pages/6-5-logarithmic-properties); and the growth formulas from [section 6.1](https://openstax.org/books/algebra-and-trigonometry-2e/pages/6-1-exponential-functions). The [NIST Digital Library of Mathematical Functions, §4.8](https://dlmf.nist.gov/4.8) states the same identities for real and complex arguments.

### 10. Product and quotient of powers

$$
a^m \cdot a^n = a^{m+n}, \qquad \frac{a^m}{a^n} = a^{m-n}
$$

**Symbols:** $a$ is the base ($a \neq 0$ for the quotient); $m$ and $n$ are exponents.

**Use it when:** you multiply or divide powers with the same base.

**Example:** $2^3 \cdot 2^4 = 2^7 = 128$ and $\frac{5^6}{5^4} = 5^2 = 25$.

### 11. Power of a power

$$
(a^m)^n = a^{mn}
$$

**Symbols:** $a$ is the base; $m$ and $n$ are exponents.

**Use it when:** a power is itself raised to a power.

**Example:** $(3^2)^3 = 3^6 = 729$.

### 12. Zero and negative exponents

$$
a^0 = 1, \qquad a^{-n} = \frac{1}{a^n} \quad (a \neq 0)
$$

**Symbols:** $a$ is a nonzero base and $n$ is a positive exponent. $0^0$ is left undefined in this context.

**Use it when:** you simplify expressions or rewrite fractions as powers before differentiating or integrating.

**Example:** $4^{-2} = \frac{1}{16}$ and $7^0 = 1$.

### 13. Rational exponents

$$
a^{m/n} = \left(\sqrt[n]{a}\right)^m = \sqrt[n]{a^m}
$$

**Symbols:** $n$ is the root, $m$ is the power. For even $n$, take $a \geq 0$.

**Use it when:** you convert between radicals and exponents, which makes the exponent rules and the power rule for derivatives usable on roots.

**Example:** $8^{2/3} = \left(\sqrt[3]{8}\right)^2 = 2^2 = 4$.

### 14. Definition of a logarithm

$$
y = \log_b x \iff b^y = x
$$

**Symbols:** $b$ is the base ($b > 0$, $b \neq 1$) and $x > 0$ is the argument.

**Use it when:** you switch between exponential and logarithmic form to solve for an exponent.

**Example:** $\log_2 32 = 5$ because $2^5 = 32$.

### 15. Product rule for logarithms

$$
\log_b(MN) = \log_b M + \log_b N
$$

**Symbols:** $M, N > 0$; $b$ is a valid base.

**Use it when:** you expand a log of a product or combine a sum of logs.

**Example:** $\log_{10} 20 + \log_{10} 5 = \log_{10} 100 = 2$.

### 16. Quotient rule for logarithms

$$
\log_b\left(\frac{M}{N}\right) = \log_b M - \log_b N
$$

**Symbols:** $M, N > 0$; $b$ is a valid base.

**Use it when:** you expand a log of a fraction or combine a difference of logs.

**Example:** $\log_3 54 - \log_3 2 = \log_3 27 = 3$.

### 17. Power rule for logarithms

$$
\log_b\left(M^n\right) = n \log_b M
$$

**Symbols:** $M > 0$; $n$ is a real number.

**Use it when:** you need to bring an unknown exponent down so you can solve for it.

**Example:** $\log_2\left(8^5\right) = 5 \log_2 8 = 15$.

### 18. Change of base

$$
\log_b M = \frac{\log_n M}{\log_n b}
$$

**Symbols:** $n$ is any convenient valid base, usually $10$ or $e$.

**Use it when:** your calculator only has $\log$ and $\ln$ keys.

**Example:** $\log_5 30 = \frac{\ln 30}{\ln 5} \approx \frac{3.4012}{1.6094} \approx 2.1133$.

### 19. Compound interest

$$
A(t) = P\left(1 + \frac{r}{n}\right)^{nt}
$$

**Symbols:** $A(t)$ is the account value, $P$ the principal, $r$ the annual rate as a decimal, $n$ the number of compounding periods per year, and $t$ the time in years.

**Use it when:** interest is added to the balance at regular intervals and then earns interest itself.

**Example:** \$1,000 at 6% compounded monthly for 5 years: $1000(1.005)^{60} \approx 1348.85$, so about \$1,348.85.

### 20. Continuous growth and decay

$$
A(t) = a e^{rt}
$$

**Symbols:** $a$ is the initial amount, $r$ the continuous rate (negative for decay), $t$ the time, and $e \approx 2.71828$.

**Use it when:** growth or decay happens continuously, as in continuously compounded interest, population models or radioactive decay.

**Example:** $500 e^{0.03 \times 10} = 500 e^{0.3} \approx 674.93$.

## Geometry: 2D shapes

Perimeter and area formulas follow [OpenStax Prealgebra 2e, sections 9.3 to 9.5](https://openstax.org/books/prealgebra-2e/pages/9-4-use-properties-of-rectangles-triangles-and-trapezoids); Heron's formula is in [Algebra and Trigonometry 2e, section 10.2](https://openstax.org/books/algebra-and-trigonometry-2e/pages/10-2-non-right-triangles-law-of-cosines); and arc length and sector area are in [section 7.1](https://openstax.org/books/algebra-and-trigonometry-2e/pages/7-1-angles).

### 21. Pythagorean theorem

$$
a^2 + b^2 = c^2
$$

**Symbols:** $a$ and $b$ are the legs of a right triangle and $c$ is the hypotenuse.

**Use it when:** you know two sides of a right triangle and need the third.

**Example:** Legs 5 and 12 give $c = \sqrt{25 + 144} = \sqrt{169} = 13$.

### 22. Rectangle area and perimeter

$$
A = LW, \qquad P = 2L + 2W
$$

**Symbols:** $L$ is the length and $W$ the width.

**Use it when:** you measure floors, screens, plots of land or any rectangular region.

**Example:** An 8 by 3 rectangle has $A = 24$ and $P = 22$.

### 23. Triangle area

$$
A = \frac{1}{2}bh
$$

**Symbols:** $b$ is a base and $h$ the perpendicular height to that base.

**Use it when:** you know a base and its height.

**Example:** $b = 10$ and $h = 6$ give $A = 30$.

### 24. Heron's formula

$$
A = \sqrt{s(s - a)(s - b)(s - c)}, \qquad s = \frac{a + b + c}{2}
$$

**Symbols:** $a$, $b$ and $c$ are the side lengths and $s$ is the semi-perimeter.

**Use it when:** you know all three sides but no height or angle.

**Example:** For sides 13, 14 and 15, $s = 21$ and $A = \sqrt{21 \cdot 8 \cdot 7 \cdot 6} = \sqrt{7056} = 84$.

### 25. Trapezoid area

$$
A = \frac{1}{2}h(b + B)
$$

**Symbols:** $b$ and $B$ are the two parallel sides and $h$ is the distance between them.

**Use it when:** a shape has exactly one pair of parallel sides, or when you estimate an area under a curve with trapezoids.

**Example:** $b = 4$, $B = 10$ and $h = 5$ give $A = \frac{1}{2} \cdot 5 \cdot 14 = 35$.

### 26. Circumference of a circle

$$
C = 2\pi r = \pi d
$$

**Symbols:** $r$ is the radius and $d = 2r$ the diameter.

**Use it when:** you need the distance around a circle, such as a wheel's travel per turn.

**Example:** $r = 7$ gives $C = 14\pi \approx 43.98$.

### 27. Area of a circle

$$
A = \pi r^2
$$

**Symbols:** $r$ is the radius.

**Use it when:** you need the region enclosed by a circle.

**Example:** $r = 7$ gives $A = 49\pi \approx 153.94$.

### 28. Arc length

$$
s = r\theta
$$

**Symbols:** $s$ is the arc length, $r$ the radius, and $\theta$ the central angle **in radians**.

**Use it when:** you need the length of part of a circle.

**Example:** $r = 10$ and $\theta = 60^\circ = \frac{\pi}{3}$ give $s = \frac{10\pi}{3} \approx 10.47$.

### 29. Area of a sector

$$
A = \frac{1}{2}r^2\theta
$$

**Symbols:** $r$ is the radius and $\theta$ the central angle in radians.

**Use it when:** you need the area of a "pizza slice" of a circle.

**Example:** $r = 10$ and $\theta = \frac{\pi}{3}$ give $A = \frac{50\pi}{3} \approx 52.36$.

## Geometry: 3D solids

Volume and surface-area formulas follow [OpenStax Prealgebra 2e, section 9.6](https://openstax.org/books/prealgebra-2e/pages/9-6-solve-geometry-applications-volume-and-surface-area).

### 30. Volume of a rectangular solid

$$
V = LWH, \qquad V_{\text{cube}} = s^3
$$

**Symbols:** $L$, $W$ and $H$ are length, width and height; $s$ is the edge of a cube.

**Use it when:** you need the capacity of a box, room or tank.

**Example:** A 4 by 3 by 2 box has $V = 24$; a cube with $s = 3$ has $V = 27$.

### 31. Surface area of a rectangular solid

$$
S = 2LH + 2LW + 2WH, \qquad S_{\text{cube}} = 6s^2
$$

**Symbols:** As in item 30.

**Use it when:** you need the material to cover or wrap a box.

**Example:** For the 4 by 3 by 2 box, $S = 2(8) + 2(12) + 2(6) = 52$; for a cube with $s = 3$, $S = 54$.

### 32. Volume of a cylinder

$$
V = \pi r^2 h
$$

**Symbols:** $r$ is the radius of the base and $h$ the height.

**Use it when:** you need the capacity of a can, pipe or tank.

**Example:** $r = 3$ and $h = 5$ give $V = 45\pi \approx 141.37$.

### 33. Surface area of a cylinder

$$
S = 2\pi r^2 + 2\pi r h
$$

**Symbols:** $2\pi r^2$ is the two circular ends and $2\pi r h$ is the curved side.

**Use it when:** you need the material for a closed can.

**Example:** $r = 3$ and $h = 5$ give $S = 18\pi + 30\pi = 48\pi \approx 150.80$.

### 34. Volume of a cone

$$
V = \frac{1}{3}\pi r^2 h
$$

**Symbols:** $r$ is the radius of the base and $h$ the perpendicular height.

**Use it when:** you need the volume of a cone, funnel or conical pile. It is one third of the cylinder with the same base and height.

**Example:** $r = 3$ and $h = 4$ give $V = 12\pi \approx 37.70$.

### 35. Volume of a sphere

$$
V = \frac{4}{3}\pi r^3
$$

**Symbols:** $r$ is the radius.

**Use it when:** you need the volume of a ball, bubble or planet model.

**Example:** $r = 3$ gives $V = 36\pi \approx 113.10$.

### 36. Surface area of a sphere

$$
S = 4\pi r^2
$$

**Symbols:** $r$ is the radius.

**Use it when:** you need the area of a sphere's surface, for example to coat or paint it.

**Example:** $r = 5$ gives $S = 100\pi \approx 314.16$.

## Coordinate geometry

Distance, midpoint and circle formulas follow [OpenStax Intermediate Algebra 2e, section 11.1](https://openstax.org/books/intermediate-algebra-2e/pages/11-1-distance-and-midpoint-formulas-circles); line formulas follow [Algebra and Trigonometry 2e, section 4.1](https://openstax.org/books/algebra-and-trigonometry-2e/pages/4-1-linear-functions).

### 37. Distance formula

$$
d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}
$$

**Symbols:** $(x_1, y_1)$ and $(x_2, y_2)$ are the two points.

**Use it when:** you need the straight-line distance between two points. It is the Pythagorean theorem on a grid.

**Example:** From $(1, 2)$ to $(4, 6)$: $d = \sqrt{9 + 16} = 5$.

### 38. Midpoint formula

$$
M = \left(\frac{x_1 + x_2}{2}, \frac{y_1 + y_2}{2}\right)
$$

**Symbols:** $(x_1, y_1)$ and $(x_2, y_2)$ are the endpoints of a segment.

**Use it when:** you need the point halfway between two points, such as the center of a circle given a diameter.

**Example:** The midpoint of $(-2, 3)$ and $(6, 7)$ is $(2, 5)$.

### 39. Slope of a line

$$
m = \frac{y_2 - y_1}{x_2 - x_1}
$$

**Symbols:** $m$ is the slope (rise over run) and $x_1 \neq x_2$.

**Use it when:** you need the rate of change between two points.

**Example:** Through $(1, 2)$ and $(4, 8)$, $m = \frac{6}{3} = 2$.

### 40. Slope-intercept form

$$
y = mx + b
$$

**Symbols:** $m$ is the slope and $b$ the $y$-intercept (the value of $y$ when $x = 0$).

**Use it when:** you want to graph a line quickly or read off its rate and starting value.

**Example:** $y = 2x - 3$ crosses the $y$-axis at $-3$, and at $x = 4$ gives $y = 5$.

### 41. Point-slope form

$$
y - y_1 = m(x - x_1)
$$

**Symbols:** $(x_1, y_1)$ is a known point on the line and $m$ the slope.

**Use it when:** you know one point and the slope and need the line's equation.

**Example:** Through $(2, 5)$ with slope $-3$: $y - 5 = -3(x - 2)$, which simplifies to $y = -3x + 11$.

### 42. Parallel and perpendicular slopes

$$
m_1 = m_2 \ \text{(parallel)}, \qquad m_1 m_2 = -1 \ \text{(perpendicular)}
$$

**Symbols:** $m_1$ and $m_2$ are the slopes of two non-vertical lines.

**Use it when:** you need a line parallel or perpendicular to a given one.

**Example:** For $y = \frac{2}{3}x + 1$, any parallel line has slope $\frac{2}{3}$ and any perpendicular line has slope $-\frac{3}{2}$.

### 43. Equation of a circle

$$
(x - h)^2 + (y - k)^2 = r^2
$$

**Symbols:** $(h, k)$ is the center and $r$ the radius.

**Use it when:** you write or read the equation of a circle, or test whether a point lies on it.

**Example:** Center $(2, -1)$ and radius 3 give $(x - 2)^2 + (y + 1)^2 = 9$. The point $(5, -1)$ lies on it because $9 + 0 = 9$.

## Trigonometry

Definitions, identities and the triangle laws follow [OpenStax Algebra and Trigonometry 2e, sections 7.1, 7.2, 9.1 to 9.3, 10.1 and 10.2](https://openstax.org/books/algebra-and-trigonometry-2e/pages/9-2-sum-and-difference-identities). The identities also appear in [NIST DLMF §4.14](https://dlmf.nist.gov/4.14) and [§4.21](https://dlmf.nist.gov/4.21).

### 44. Right-triangle ratios (SOH CAH TOA)

$$
\sin\theta = \frac{\text{opposite}}{\text{hypotenuse}}, \quad \cos\theta = \frac{\text{adjacent}}{\text{hypotenuse}}, \quad \tan\theta = \frac{\text{opposite}}{\text{adjacent}}
$$

**Symbols:** $\theta$ is an acute angle of a right triangle; the sides are named relative to $\theta$.

**Use it when:** you know a side and an angle of a right triangle, or two sides, and need the rest.

**Example:** In a 3-4-5 triangle, for the angle opposite the side of length 3: $\sin\theta = \frac{3}{5}$, $\cos\theta = \frac{4}{5}$, $\tan\theta = \frac{3}{4}$.

### 45. Reciprocal and quotient identities

$$
\csc\theta = \frac{1}{\sin\theta}, \quad \sec\theta = \frac{1}{\cos\theta}, \quad \cot\theta = \frac{1}{\tan\theta}, \quad \tan\theta = \frac{\sin\theta}{\cos\theta}
$$

**Symbols:** Each identity holds wherever the denominator is nonzero.

**Use it when:** you rewrite an expression in terms of sine and cosine to simplify it.

**Example:** With $\sin\theta = \frac{3}{5}$ and $\cos\theta = \frac{4}{5}$: $\csc\theta = \frac{5}{3}$, $\sec\theta = \frac{5}{4}$, $\cot\theta = \frac{4}{3}$.

### 46. Degree and radian conversion

$$
\theta_{\text{rad}} = \theta_{\text{deg}} \times \frac{\pi}{180}
$$

**Symbols:** $360^\circ = 2\pi$ radians, so $180^\circ = \pi$ radians.

**Use it when:** a formula needs radians, which includes arc length, sector area, and every calculus formula for trigonometric functions.

**Example:** $135^\circ = \frac{135\pi}{180} = \frac{3\pi}{4}$, and $\frac{\pi}{6} = 30^\circ$.

### 47. Pythagorean identity

$$
\sin^2\theta + \cos^2\theta = 1
$$

**Symbols:** $\theta$ is any angle.

**Use it when:** you know one of sine or cosine and need the other, or need to simplify an expression.

**Example:** If $\sin\theta = 0.6$ and $\theta$ is in the first quadrant, $\cos\theta = \sqrt{1 - 0.36} = 0.8$.

### 48. Tangent and secant identity

$$
1 + \tan^2\theta = \sec^2\theta
$$

**Symbols:** Valid wherever $\cos\theta \neq 0$. The companion identity is $1 + \cot^2\theta = \csc^2\theta$.

**Use it when:** an expression mixes $\tan$ and $\sec$, which is common in integration.

**Example:** If $\tan\theta = 2$, then $\sec^2\theta = 5$ and $\sec\theta = \pm\sqrt{5}$, with the sign set by the quadrant.

### 49. Sine of a sum or difference

$$
\sin(\alpha \pm \beta) = \sin\alpha\cos\beta \pm \cos\alpha\sin\beta
$$

**Symbols:** $\alpha$ and $\beta$ are any angles; the signs match on both sides.

**Use it when:** you need exact values of angles built from $30^\circ$, $45^\circ$ and $60^\circ$, or need to expand $\sin(x + c)$.

**Example:** $\sin 75^\circ = \sin(45^\circ + 30^\circ) = \frac{\sqrt{2}}{2}\cdot\frac{\sqrt{3}}{2} + \frac{\sqrt{2}}{2}\cdot\frac{1}{2} = \frac{\sqrt{6} + \sqrt{2}}{4} \approx 0.9659$.

### 50. Cosine of a sum or difference

$$
\cos(\alpha \pm \beta) = \cos\alpha\cos\beta \mp \sin\alpha\sin\beta
$$

**Symbols:** $\alpha$ and $\beta$ are any angles. Note the sign flips: a sum on the left gives a minus on the right.

**Use it when:** as for item 49, but for cosine.

**Example:** $\cos 75^\circ = \cos(45^\circ + 30^\circ) = \frac{\sqrt{2}}{2}\cdot\frac{\sqrt{3}}{2} - \frac{\sqrt{2}}{2}\cdot\frac{1}{2} = \frac{\sqrt{6} - \sqrt{2}}{4} \approx 0.2588$.

### 51. Double-angle formula for sine

$$
\sin 2\theta = 2\sin\theta\cos\theta
$$

**Symbols:** $\theta$ is any angle.

**Use it when:** you simplify products of sine and cosine, or solve equations containing $\sin 2\theta$.

**Example:** With $\sin\theta = \frac{3}{5}$ and $\cos\theta = \frac{4}{5}$: $\sin 2\theta = 2 \cdot \frac{3}{5} \cdot \frac{4}{5} = \frac{24}{25}$.

### 52. Double-angle formulas for cosine

$$
\cos 2\theta = \cos^2\theta - \sin^2\theta = 1 - 2\sin^2\theta = 2\cos^2\theta - 1
$$

**Symbols:** $\theta$ is any angle. Pick the form that matches what you know.

**Use it when:** you need to lower the power of $\sin^2$ or $\cos^2$, for example before integrating.

**Example:** With the same angle, $\cos 2\theta = \frac{16}{25} - \frac{9}{25} = \frac{7}{25}$.

### 53. Half-angle formulas

$$
\sin\frac{\alpha}{2} = \pm\sqrt{\frac{1 - \cos\alpha}{2}}, \qquad \cos\frac{\alpha}{2} = \pm\sqrt{\frac{1 + \cos\alpha}{2}}
$$

**Symbols:** The sign depends on the quadrant where $\frac{\alpha}{2}$ lies.

**Use it when:** you need exact values for half of a known angle, such as $15^\circ$ or $22.5^\circ$.

**Example:** $\sin 15^\circ = \sqrt{\frac{1 - \cos 30^\circ}{2}} = \sqrt{\frac{1 - \sqrt{3}/2}{2}} \approx 0.2588$ (positive, since $15^\circ$ is in the first quadrant).

### 54. Law of sines

$$
\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C}
$$

**Symbols:** $a$, $b$ and $c$ are sides; $A$, $B$ and $C$ are the angles opposite them.

**Use it when:** in any triangle, you know two angles and a side, or two sides and an angle opposite one of them.

**Example:** With $A = 30^\circ$, $B = 45^\circ$ and $a = 10$: $b = \frac{10 \sin 45^\circ}{\sin 30^\circ} = 10\sqrt{2} \approx 14.14$.

### 55. Law of cosines

$$
a^2 = b^2 + c^2 - 2bc\cos A
$$

**Symbols:** $A$ is the angle between sides $b$ and $c$, and $a$ is the side opposite $A$.

**Use it when:** you know two sides and the angle between them, or all three sides. With $A = 90^\circ$ it reduces to the Pythagorean theorem.

**Example:** $b = 5$, $c = 7$, $A = 60^\circ$: $a^2 = 25 + 49 - 35 = 39$, so $a \approx 6.245$.

### 56. Triangle area from two sides and the included angle

$$
A = \frac{1}{2}ab\sin C
$$

**Symbols:** $a$ and $b$ are two sides and $C$ is the angle between them.

**Use it when:** you know two sides and the angle between them but not the height.

**Example:** $a = 8$, $b = 5$, $C = 30^\circ$: $A = \frac{1}{2} \cdot 8 \cdot 5 \cdot \frac{1}{2} = 10$.

## Sequences and series

These follow [OpenStax Algebra and Trigonometry 2e, sections 13.2 to 13.4](https://openstax.org/books/algebra-and-trigonometry-2e/pages/13-4-series-and-their-notations).

### 57. nth term of an arithmetic sequence

$$
a_n = a_1 + (n - 1)d
$$

**Symbols:** $a_1$ is the first term, $d$ the common difference, and $n$ the term number.

**Use it when:** each term goes up or down by the same amount.

**Example:** $a_1 = 3$, $d = 4$: $a_{10} = 3 + 9 \cdot 4 = 39$.

### 58. Sum of an arithmetic series

$$
S_n = \frac{n(a_1 + a_n)}{2}
$$

**Symbols:** $S_n$ is the sum of the first $n$ terms; $a_1$ and $a_n$ are the first and last of them.

**Use it when:** you add many terms of an arithmetic sequence.

**Example:** For the sequence in item 57, $S_{10} = \frac{10(3 + 39)}{2} = 210$.

### 59. Sum of the first n positive integers

$$
1 + 2 + \cdots + n = \frac{n(n + 1)}{2}
$$

**Symbols:** $n$ is a positive integer. This is item 58 with $a_1 = 1$ and $a_n = n$.

**Use it when:** counting handshakes, pairs, or totals that grow by one each step.

**Example:** $1 + 2 + \cdots + 100 = \frac{100 \cdot 101}{2} = 5050$.

### 60. nth term of a geometric sequence

$$
a_n = a_1 r^{n-1}
$$

**Symbols:** $a_1$ is the first term and $r$ the common ratio.

**Use it when:** each term is multiplied by the same factor.

**Example:** $a_1 = 2$, $r = 3$: $a_6 = 2 \cdot 3^5 = 486$.

### 61. Sum of a finite geometric series

$$
S_n = \frac{a_1(1 - r^n)}{1 - r}, \qquad r \neq 1
$$

**Symbols:** $S_n$ is the sum of the first $n$ terms.

**Use it when:** you total a fixed number of terms that grow or shrink by a constant factor, such as regular savings deposits.

**Example:** $a_1 = 2$, $r = 3$, $n = 6$: $S_6 = \frac{2(1 - 729)}{1 - 3} = 728$.

### 62. Sum of an infinite geometric series

$$
S = \frac{a_1}{1 - r}, \qquad -1 < r < 1
$$

**Symbols:** $S$ is the sum of all the terms; it exists only when $\lvert r \rvert < 1$.

**Use it when:** terms shrink by a constant factor forever, as in repeating decimals.

**Example:** $8 + 4 + 2 + 1 + \cdots = \frac{8}{1 - \frac{1}{2}} = 16$.

## Limits and derivatives

These follow [OpenStax Calculus Volume 1, chapters 2 to 4](https://openstax.org/books/calculus-volume-1/pages/3-3-differentiation-rules), including its [table of derivatives](https://openstax.org/books/calculus-volume-1/pages/b-table-of-derivatives). All trigonometric derivatives assume radians.

### 63. The fundamental trigonometric limit

$$
\lim_{\theta \to 0} \frac{\sin\theta}{\theta} = 1
$$

**Symbols:** $\theta$ is measured in radians.

**Use it when:** a limit contains $\sin$ of something small divided by that same small quantity. It is also why $\frac{d}{dx}\sin x = \cos x$.

**Example:** $\lim_{x \to 0} \frac{\sin 3x}{x} = \lim_{x \to 0} 3 \cdot \frac{\sin 3x}{3x} = 3$.

### 64. Limit definition of the derivative

$$
f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}
$$

**Symbols:** $h$ is a small change in $x$; the derivative exists where this limit exists.

**Use it when:** you are asked to differentiate "from first principles", or you need to understand what a derivative measures: the instantaneous rate of change.

**Example:** For $f(x) = x^2$ at $x = 3$: $\frac{(3 + h)^2 - 9}{h} = 6 + h \to 6$, so $f'(3) = 6$.

### 65. Power rule

$$
\frac{d}{dx} x^n = n x^{n-1}
$$

**Symbols:** $n$ is a real constant.

**Use it when:** you differentiate powers of $x$, including roots and reciprocals once they are written as exponents.

**Example:** $\frac{d}{dx}\sqrt{x} = \frac{d}{dx}x^{1/2} = \frac{1}{2}x^{-1/2} = \frac{1}{2\sqrt{x}}$.

### 66. Sum and constant multiple rules

$$
\frac{d}{dx}\left[c f(x) \pm g(x)\right] = c f'(x) \pm g'(x)
$$

**Symbols:** $c$ is a constant; $f$ and $g$ are differentiable functions.

**Use it when:** you differentiate a polynomial or any sum of terms, one term at a time.

**Example:** $\frac{d}{dx}(4x^3 - 7x + 2) = 12x^2 - 7$.

### 67. Product rule

$$
\frac{d}{dx}\left[f(x)g(x)\right] = f'(x)g(x) + f(x)g'(x)
$$

**Symbols:** $f$ and $g$ are differentiable functions.

**Use it when:** you differentiate two functions multiplied together.

**Example:** $\frac{d}{dx}(x^2 \sin x) = 2x\sin x + x^2\cos x$.

### 68. Quotient rule

$$
\frac{d}{dx}\left[\frac{f(x)}{g(x)}\right] = \frac{f'(x)g(x) - f(x)g'(x)}{\left[g(x)\right]^2}
$$

**Symbols:** $f$ and $g$ are differentiable and $g(x) \neq 0$. The order in the numerator matters.

**Use it when:** you differentiate one function divided by another.

**Example:** $\frac{d}{dx}\frac{x}{x^2 + 1} = \frac{(x^2 + 1) - x(2x)}{(x^2 + 1)^2} = \frac{1 - x^2}{(x^2 + 1)^2}$.

### 69. Chain rule

$$
\frac{d}{dx} f\big(g(x)\big) = f'\big(g(x)\big)\, g'(x)
$$

**Symbols:** $g$ is the inner function and $f$ the outer function.

**Use it when:** you differentiate a function of a function. Differentiate the outside, keep the inside, then multiply by the derivative of the inside.

**Example:** $\frac{d}{dx}(3x^2 + 1)^5 = 5(3x^2 + 1)^4 \cdot 6x = 30x(3x^2 + 1)^4$.

### 70. Derivatives of sine, cosine and tangent

$$
\frac{d}{dx}\sin x = \cos x, \qquad \frac{d}{dx}\cos x = -\sin x, \qquad \frac{d}{dx}\tan x = \sec^2 x
$$

**Symbols:** $x$ is in radians.

**Use it when:** you differentiate periodic models such as waves, oscillations and rotations.

**Example:** $\frac{d}{dx}(\sin x + \tan x)$ at $x = 0$ is $\cos 0 + \sec^2 0 = 2$.

### 71. Derivatives of exponential functions

$$
\frac{d}{dx} e^x = e^x, \qquad \frac{d}{dx} b^x = b^x \ln b
$$

**Symbols:** $b > 0$ is a constant base.

**Use it when:** you need the rate of change of an exponential growth or decay model.

**Example:** $\frac{d}{dx} 2^x$ at $x = 3$ is $8\ln 2 \approx 5.545$.

### 72. Derivatives of logarithms

$$
\frac{d}{dx}\ln x = \frac{1}{x}, \qquad \frac{d}{dx}\log_b x = \frac{1}{x \ln b}
$$

**Symbols:** $x > 0$ (more generally, $\frac{d}{dx}\ln\lvert x\rvert = \frac{1}{x}$ for $x \neq 0$).

**Use it when:** you differentiate logarithms, or use logarithmic differentiation on products and powers.

**Example:** By the chain rule, $\frac{d}{dx}\ln(x^2 + 1) = \frac{2x}{x^2 + 1}$, which equals 1 at $x = 1$.

### 73. L'Hôpital's rule

$$
\lim_{x \to a} \frac{f(x)}{g(x)} = \lim_{x \to a} \frac{f'(x)}{g'(x)}
$$

**Symbols:** Valid when $f(x) \to 0$ and $g(x) \to 0$ (or both tend to $\pm\infty$), $f$ and $g$ are differentiable near $a$, and the limit on the right exists or is infinite.

**Use it when:** direct substitution gives $\frac{0}{0}$ or $\frac{\infty}{\infty}$. Do not use it on any other form.

**Example:** $\lim_{x \to 0} \frac{e^x - 1}{x}$ is $\frac{0}{0}$, so it equals $\lim_{x \to 0} \frac{e^x}{1} = 1$.

## Integrals

Basic antiderivatives follow the [table of integrals in OpenStax Calculus Volume 1](https://openstax.org/books/calculus-volume-1/pages/a-table-of-integrals); the fundamental theorem, substitution and area are in [sections 5.3](https://openstax.org/books/calculus-volume-1/pages/5-3-the-fundamental-theorem-of-calculus), [5.5](https://openstax.org/books/calculus-volume-1/pages/5-5-substitution) and [6.1](https://openstax.org/books/calculus-volume-1/pages/6-1-areas-between-curves); integration by parts is in [Calculus Volume 2, section 3.1](https://openstax.org/books/calculus-volume-2/pages/3-1-integration-by-parts).

### 74. Power rule for integrals

$$
\int x^n \, dx = \frac{x^{n+1}}{n + 1} + C, \qquad n \neq -1
$$

**Symbols:** $C$ is the constant of integration.

**Use it when:** you integrate powers of $x$, including roots written as exponents.

**Example:** $\int 6x^2 \, dx = 2x^3 + C$.

### 75. Integral of 1/x

$$
\int \frac{1}{x} \, dx = \ln\lvert x\rvert + C
$$

**Symbols:** $x \neq 0$. This covers the one case, $n = -1$, that item 74 excludes.

**Use it when:** the integrand is a reciprocal, or a fraction whose numerator is the derivative of its denominator.

**Example:** $\int \frac{3}{x} \, dx = 3\ln\lvert x\rvert + C$.

### 76. Integrals of exponential functions

$$
\int e^x \, dx = e^x + C, \qquad \int a^x \, dx = \frac{a^x}{\ln a} + C
$$

**Symbols:** $a > 0$, $a \neq 1$.

**Use it when:** you integrate exponential growth or decay.

**Example:** $\int 2^x \, dx = \frac{2^x}{\ln 2} + C$.

### 77. Integrals of sine and cosine

$$
\int \sin x \, dx = -\cos x + C, \qquad \int \cos x \, dx = \sin x + C
$$

**Symbols:** $x$ is in radians.

**Use it when:** you integrate periodic functions. Watch the minus sign on the sine integral.

**Example:** $\int (\cos x - \sin x)\, dx = \sin x + \cos x + C$.

### 78. Fundamental theorem of calculus, part 1

$$
\frac{d}{dx} \int_a^x f(t)\, dt = f(x)
$$

**Symbols:** $f$ is continuous on an interval containing $a$ and $x$; $t$ is a dummy variable.

**Use it when:** you differentiate a function defined as an integral with a variable upper limit.

**Example:** $\frac{d}{dx}\int_0^x \sqrt{1 + t^3}\, dt = \sqrt{1 + x^3}$, which is 3 at $x = 2$.

### 79. Fundamental theorem of calculus, part 2

$$
\int_a^b f(x)\, dx = F(b) - F(a)
$$

**Symbols:** $F$ is any antiderivative of the continuous function $f$ on $[a, b]$.

**Use it when:** you evaluate any definite integral whose antiderivative you can find.

**Example:** $\int_1^3 x^2\, dx = \frac{27}{3} - \frac{1}{3} = \frac{26}{3}$.

### 80. Integration by substitution

$$
\int f\big(g(x)\big)\, g'(x)\, dx = \int f(u)\, du, \qquad u = g(x)
$$

**Symbols:** $u$ is the inner function; $du = g'(x)\,dx$.

**Use it when:** the integrand contains a function and (a constant multiple of) its derivative. It is the chain rule in reverse.

**Example:** With $u = x^2 + 1$: $\int 2x(x^2 + 1)^4\, dx = \int u^4\, du = \frac{(x^2 + 1)^5}{5} + C$.

### 81. Integration by parts

$$
\int u\, dv = uv - \int v\, du
$$

**Symbols:** $u$ and $v$ are differentiable functions of $x$; you choose $u$ so that $du$ is simpler.

**Use it when:** you integrate a product such as a polynomial times an exponential, sine or logarithm. It is the product rule in reverse.

**Example:** With $u = x$ and $dv = e^x dx$: $\int x e^x\, dx = x e^x - \int e^x\, dx = x e^x - e^x + C$.

### 82. Area between two curves

$$
A = \int_a^b \left[f(x) - g(x)\right] dx
$$

**Symbols:** $f(x) \geq g(x)$ on $[a, b]$; $f$ is the upper curve and $g$ the lower one.

**Use it when:** you need the area of a region trapped between two graphs.

**Example:** Between $f(x) = x$ and $g(x) = x^2$ on $[0, 1]$: $A = \frac{1}{2} - \frac{1}{3} = \frac{1}{6}$.

## Probability and statistics

Probability rules and counting follow [OpenStax Algebra and Trigonometry 2e, sections 13.5 and 13.7](https://openstax.org/books/algebra-and-trigonometry-2e/pages/13-7-probability); conditional probability, independence and the statistics formulas follow [OpenStax Introductory Statistics 2e, chapters 2 to 4](https://openstax.org/books/introductory-statistics-2e/pages/2-7-measures-of-the-spread-of-the-data).

### 83. Probability of an event (equally likely outcomes)

$$
P(E) = \frac{n(E)}{n(S)}
$$

**Symbols:** $n(E)$ is the number of outcomes in event $E$ and $n(S)$ the number in the sample space; every outcome must be equally likely.

**Use it when:** outcomes are equally likely, as with fair dice, coins and well-shuffled cards.

**Example:** Rolling an even number on a fair die: $P = \frac{3}{6} = \frac{1}{2}$.

### 84. Complement rule

$$
P(E') = 1 - P(E)
$$

**Symbols:** $E'$ is "not $E$".

**Use it when:** the opposite event is easier to count, especially "at least one" questions.

**Example:** Getting at least one six in two rolls: $1 - \left(\frac{5}{6}\right)^2 = \frac{11}{36} \approx 0.306$.

### 85. Addition rule

$$
P(E \cup F) = P(E) + P(F) - P(E \cap F)
$$

**Symbols:** $E \cup F$ is "$E$ or $F$"; $E \cap F$ is "$E$ and $F$". For mutually exclusive events $P(E \cap F) = 0$.

**Use it when:** you need the probability that at least one of two events happens.

**Example:** Drawing a heart or a face card: $\frac{13}{52} + \frac{12}{52} - \frac{3}{52} = \frac{22}{52} = \frac{11}{26}$.

### 86. Conditional probability

$$
P(A \mid B) = \frac{P(A \cap B)}{P(B)}, \qquad P(B) > 0
$$

**Symbols:** $P(A \mid B)$ is the probability of $A$ given that $B$ has happened.

**Use it when:** new information shrinks the sample space.

**Example:** Given that a drawn card is a face card, the chance it is a king is $\frac{4/52}{12/52} = \frac{1}{3}$.

### 87. Multiplication rule for independent events

$$
P(A \cap B) = P(A)\, P(B)
$$

**Symbols:** $A$ and $B$ are independent: knowing one happened does not change the probability of the other.

**Use it when:** you combine separate experiments, such as a coin flip and a die roll.

**Example:** Heads and a six: $\frac{1}{2} \cdot \frac{1}{6} = \frac{1}{12}$.

### 88. Permutations

$$
P(n, r) = \frac{n!}{(n - r)!}
$$

**Symbols:** $n$ distinct objects, $r$ of them chosen, **order matters**; $n! = n(n-1)\cdots 1$.

**Use it when:** you count arrangements, rankings or codes.

**Example:** Gold, silver and bronze among 10 runners: $P(10, 3) = 10 \cdot 9 \cdot 8 = 720$.

### 89. Combinations

$$
C(n, r) = \binom{n}{r} = \frac{n!}{r!\,(n - r)!}
$$

**Symbols:** $n$ distinct objects, $r$ chosen, **order does not matter**.

**Use it when:** you count committees, hands of cards or subsets.

**Example:** Choosing 3 of 10 people for a committee: $C(10, 3) = \frac{720}{6} = 120$.

### 90. Mean

$$
\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i
$$

**Symbols:** $x_1, \dots, x_n$ are the data values and $n$ is how many there are. For a whole population the mean is written $\mu$.

**Use it when:** you summarize the center of numerical data.

**Example:** For 4, 8, 6, 5, 7: $\bar{x} = \frac{30}{5} = 6$.

### 91. Standard deviation

$$
s = \sqrt{\frac{\sum (x - \bar{x})^2}{n - 1}}, \qquad \sigma = \sqrt{\frac{\sum (x - \mu)^2}{N}}
$$

**Symbols:** $s$ is the sample standard deviation (divide by $n - 1$); $\sigma$ is the population standard deviation (divide by the population size $N$).

**Use it when:** you measure how spread out the data are around the mean.

**Example:** For 4, 8, 6, 5, 7 the squared deviations from 6 sum to $4 + 4 + 0 + 1 + 1 = 10$. As a sample, $s = \sqrt{10/4} \approx 1.581$; as a whole population, $\sigma = \sqrt{10/5} \approx 1.414$.

### 92. z-score

$$
z = \frac{x - \mu}{\sigma}
$$

**Symbols:** $x$ is a value, $\mu$ the mean and $\sigma$ the standard deviation (use $\bar{x}$ and $s$ for a sample).

**Use it when:** you compare values from different scales, or count how many standard deviations a value lies from the mean.

**Example:** A score of 85 on a test with $\mu = 70$ and $\sigma = 10$ has $z = 1.5$.

### 93. Binomial probability

$$
P(X = x) = \binom{n}{x} p^x q^{n - x}, \qquad \mu = np, \qquad \sigma = \sqrt{npq}
$$

**Symbols:** $n$ independent trials, each a success with probability $p$; $q = 1 - p$; $X$ counts the successes.

**Use it when:** you count successes in a fixed number of independent yes/no trials with the same probability.

**Example:** Exactly 3 heads in 5 fair flips: $\binom{5}{3}(0.5)^5 = \frac{10}{32} = 0.3125$. Here $\mu = 2.5$ and $\sigma = \sqrt{1.25} \approx 1.118$.

## Vectors and matrices

Vector formulas follow [OpenStax Calculus Volume 3, sections 2.2 to 2.4](https://openstax.org/books/calculus-volume-3/pages/2-3-the-dot-product); matrix formulas follow [Algebra and Trigonometry 2e, sections 11.7 and 11.8](https://openstax.org/books/algebra-and-trigonometry-2e/pages/11-8-solving-systems-with-cramers-rule).

### 94. Magnitude of a vector

$$
\lVert \mathbf{v} \rVert = \sqrt{v_1^2 + v_2^2 + v_3^2}
$$

**Symbols:** $\mathbf{v} = \langle v_1, v_2, v_3 \rangle$. The unit vector in the same direction is $\frac{\mathbf{v}}{\lVert \mathbf{v} \rVert}$ for $\mathbf{v} \neq \mathbf{0}$.

**Use it when:** you need the length of a vector, such as a speed from a velocity vector.

**Example:** $\lVert \langle 2, 3, 6 \rangle \rVert = \sqrt{4 + 9 + 36} = 7$, so the unit vector is $\langle \tfrac{2}{7}, \tfrac{3}{7}, \tfrac{6}{7} \rangle$.

### 95. Dot product

$$
\mathbf{u} \cdot \mathbf{v} = u_1 v_1 + u_2 v_2 + u_3 v_3
$$

**Symbols:** $\mathbf{u}$ and $\mathbf{v}$ are vectors; the result is a scalar.

**Use it when:** you test perpendicularity (dot product zero), compute work, or find projections.

**Example:** $\langle 1, 2, 3 \rangle \cdot \langle 4, -5, 6 \rangle = 4 - 10 + 18 = 12$.

### 96. Angle between two vectors

$$
\cos\theta = \frac{\mathbf{u} \cdot \mathbf{v}}{\lVert \mathbf{u} \rVert \, \lVert \mathbf{v} \rVert}
$$

**Symbols:** $\theta$ is the angle between nonzero vectors $\mathbf{u}$ and $\mathbf{v}$, with $0 \leq \theta \leq \pi$.

**Use it when:** you need the angle between two directions, or a similarity measure between vectors.

**Example:** For $\langle 1, 0 \rangle$ and $\langle 1, 1 \rangle$: $\cos\theta = \frac{1}{1 \cdot \sqrt{2}}$, so $\theta = 45^\circ$.

### 97. Cross product

$$
\mathbf{u} \times \mathbf{v} = \langle u_2 v_3 - u_3 v_2,\; u_3 v_1 - u_1 v_3,\; u_1 v_2 - u_2 v_1 \rangle, \qquad \lVert \mathbf{u} \times \mathbf{v} \rVert = \lVert \mathbf{u} \rVert \, \lVert \mathbf{v} \rVert \sin\theta
$$

**Symbols:** $\mathbf{u}$ and $\mathbf{v}$ are 3D vectors; the result is perpendicular to both, and its length is the area of the parallelogram they span.

**Use it when:** you need a normal vector to a plane, a torque, or the area of a parallelogram or triangle in 3D.

**Example:** $\langle 1, 2, 3 \rangle \times \langle 4, 5, 6 \rangle = \langle -3, 6, -3 \rangle$, so the parallelogram has area $\sqrt{54} \approx 7.348$.

### 98. Determinant of a 2×2 matrix

$$
\det\begin{pmatrix} a & b \\ c & d \end{pmatrix} = ad - bc
$$

**Symbols:** $a$, $b$, $c$ and $d$ are the matrix entries.

**Use it when:** you check whether a matrix is invertible (nonzero determinant), solve systems with Cramer's rule, or find an area scale factor.

**Example:** $\det\begin{pmatrix} 3 & 8 \\ 4 & 6 \end{pmatrix} = 18 - 32 = -14$.

### 99. Inverse of a 2×2 matrix

$$
A^{-1} = \frac{1}{ad - bc}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}, \qquad ad - bc \neq 0
$$

**Symbols:** $A = \begin{pmatrix} a & b \\ c & d \end{pmatrix}$. Swap $a$ and $d$, negate $b$ and $c$, and divide by the determinant.

**Use it when:** you solve $AX = B$ as $X = A^{-1}B$, or undo a linear transformation.

**Example:** For $A = \begin{pmatrix} 4 & 7 \\ 2 & 6 \end{pmatrix}$, $\det A = 10$ and $A^{-1} = \begin{pmatrix} 0.6 & -0.7 \\ -0.2 & 0.4 \end{pmatrix}$.

### 100. Cramer's rule for a 2×2 system

$$
x = \frac{D_x}{D}, \qquad y = \frac{D_y}{D}, \qquad D = \begin{vmatrix} a_1 & b_1 \\ a_2 & b_2 \end{vmatrix} \neq 0
$$

**Symbols:** The system is $a_1 x + b_1 y = c_1$ and $a_2 x + b_2 y = c_2$. $D_x$ replaces the $x$-column of $D$ with $c_1, c_2$; $D_y$ replaces the $y$-column.

**Use it when:** you solve a small linear system and the determinant is nonzero.

**Example:** For $2x + 3y = 8$ and $x - y = -1$: $D = -5$, $D_x = -5$, $D_y = -10$, so $x = 1$ and $y = 2$.

## Common mistakes

These are the slips that most often turn a correct formula into a wrong answer. Each one can be caught by checking the conditions listed with the formula above.

- **Squaring a sum term by term.** $(a + b)^2 \neq a^2 + b^2$; the $2ab$ term is missing. With $a = 3$ and $b = 4$, $(a + b)^2 = 49$ but $a^2 + b^2 = 25$. Similarly, $\sqrt{a^2 + b^2} \neq a + b$.
- **Inventing log rules.** $\log(M + N)$ does not split into $\log M + \log N$. The product rule is about $\log(MN)$.
- **Using degrees where radians are required.** Arc length, sector area, $\lim_{\theta \to 0} \frac{\sin\theta}{\theta} = 1$ and every trigonometric derivative and integral assume radians. In degrees the same limit is $\frac{\pi}{180} \approx 0.01745$, not 1.
- **Dropping the inner derivative.** In the chain rule, $\frac{d}{dx}\sin(3x) = 3\cos(3x)$, not $\cos(3x)$.
- **Reversing the quotient rule numerator.** It is $f'g - fg'$; swapping the order flips the sign of the answer.
- **Forgetting the constant of integration.** Every indefinite integral needs $+ C$.
- **Summing an infinite geometric series that diverges.** $\frac{a_1}{1 - r}$ only applies when $-1 < r < 1$. For $1 + 2 + 4 + \cdots$ it would give $-1$, which is meaningless.
- **Multiplying probabilities of dependent events.** $P(A \cap B) = P(A)P(B)$ only holds for independent events; otherwise use $P(A \cap B) = P(A \mid B)P(B)$.
- **Mixing up permutations and combinations.** If swapping two chosen items gives a new outcome, order matters and you need permutations.
- **Choosing the wrong standard deviation.** Divide by $n - 1$ for a sample and by $N$ for a full population.
- **Taking only the negative of a slope for a perpendicular line.** The perpendicular slope is the negative *reciprocal*: $2$ becomes $-\frac{1}{2}$, not $-2$.
- **Ignoring the sign in half-angle formulas.** Choose $+$ or $-$ from the quadrant of $\frac{\alpha}{2}$, not of $\alpha$.

## Next steps

A list of formulas is only useful once you can pick the right one quickly. To build that skill:

- Practise faster mental shortcuts in [math tricks to solve problems faster](/articles/math-tricks-to-solve-problems-faster).
- Apply items 1 to 9 to full problems in [algebra problems with solutions for beginners](/articles/algebra-problems-with-solutions-for-beginners).
- See items 83 to 93 used on real data in [probability and statistics real-world examples](/articles/probability-statistics-real-world-examples).
- Take items 94 to 100 further in [linear algebra concepts for machine learning](/articles/linear-algebra-concepts-for-machine-learning).
- Browse more articles and blogs in the [mathematics category](/category/mathematics).

## References

- *Algebra and Trigonometry 2e*, Jay Abramson, OpenStax (2021). https://openstax.org/books/algebra-and-trigonometry-2e/pages/2-5-quadratic-equations
- *Prealgebra 2e*, Lynn Marecek, MaryAnne Anthony-Smith and Andrea Honeycutt Mathis, OpenStax (2020). https://openstax.org/books/prealgebra-2e/pages/9-6-solve-geometry-applications-volume-and-surface-area
- *Intermediate Algebra 2e*, Lynn Marecek and Andrea Honeycutt Mathis, OpenStax (2020). https://openstax.org/books/intermediate-algebra-2e/pages/11-1-distance-and-midpoint-formulas-circles
- *Calculus Volume 1*, Gilbert Strang and Edwin "Jed" Herman, OpenStax (2016). https://openstax.org/books/calculus-volume-1/pages/3-3-differentiation-rules
- *Calculus Volume 2*, Gilbert Strang and Edwin "Jed" Herman, OpenStax (2016). https://openstax.org/books/calculus-volume-2/pages/3-1-integration-by-parts
- *Calculus Volume 3*, Gilbert Strang and Edwin "Jed" Herman, OpenStax (2016). https://openstax.org/books/calculus-volume-3/pages/2-3-the-dot-product
- *Introductory Statistics 2e*, Barbara Illowsky and Susan Dean, OpenStax (2023). https://openstax.org/books/introductory-statistics-2e/pages/2-7-measures-of-the-spread-of-the-data
- *NIST Digital Library of Mathematical Functions*, Chapter 4 (Elementary Functions), §4.8 Identities, National Institute of Standards and Technology. https://dlmf.nist.gov/4.8
- *NIST Digital Library of Mathematical Functions*, §4.14 Definitions and Periodicity and §4.21 Identities, National Institute of Standards and Technology. https://dlmf.nist.gov/4.21
