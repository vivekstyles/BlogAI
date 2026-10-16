---
title: 101 Best Math Tricks to Solve Problems Faster
description: 101 math tricks for mental multiplication, squares, divisibility, percents, algebra and geometry, each with a proof, a worked example and its limits.
author: BlogAI Editors
authorType: Organization
publishedAt: 2026-10-16
updatedAt: 2026-10-16
status: published
categories:
  - Mathematics
tags: [mathematics, mental math, intuitive math, number theory, problem solving]
tocDepth: 2
---

Most "math tricks" are not tricks at all. They are ordinary algebra applied to numbers with a convenient shape: a number close to 100, a number ending in 5, a divisor that happens to split 1000 or 1001. Once you see the algebra, the shortcut stops being something to memorize and becomes something you can rebuild on the spot, and you also learn exactly when it breaks.

That is the approach of this list. Every one of the 101 tricks below comes with four parts:

- **The trick:** what to do.
- **Why it works:** a short algebraic justification.
- **Example:** a worked calculation. Every example and identity in this article was checked with a computer algebra script before publication.
- **When it does not apply:** the limits, so you do not use a shortcut outside its range.

A fair warning before you start. In a long-running Physics Forums discussion about "human calculator" techniques, posters pointed out that many tricks only cover specific number patterns and that the real bottleneck is holding intermediate digits in your head, which improves only with practice ([Physics Forums, 2016](https://www.physicsforums.com/threads/does-the-human-calculator-stuff-really-work.895965/)). That matches the design of this list: learn the handful that fit the problems you actually meet, and treat the rest as worked examples of why algebra is useful.

The final section turns from arithmetic to strategy. George Pólya's *How to Solve It* (Princeton University Press, first published 1945) describes problem solving in four phases (understand the problem, devise a plan, carry it out, look back) and collects heuristics such as working backwards, drawing a figure and solving a simpler related problem ([Princeton University Press](https://press.princeton.edu/books/paperback/9780691164076/how-to-solve-it); [Wikipedia summary](https://en.wikipedia.org/wiki/How_to_Solve_It)). Those heuristics often save more time than any arithmetic shortcut.

## Mental multiplication tricks

### 1. Multiply by 5: multiply by 10, then halve

**The trick.** To compute $5 \times n$, compute $10 \times n$ and divide by 2.

**Why it works.** $5 = \dfrac{10}{2}$, so $5n = \dfrac{10n}{2}$.

**Example.** $5 \times 68 = 680 \div 2 = 340$, and $5 \times 47 = 470 \div 2 = 235$.

**When it does not apply.** It always works, but it is only faster when halving is easy. Halving $10n$ is usually easier than halving $n$ first, because $10n$ is always even.

### 2. Multiply by 25: multiply by 100, then divide by 4

**The trick.** $25 \times n = 100n \div 4$.

**Why it works.** $25 = \dfrac{100}{4}$.

**Example.** $25 \times 36 = 3600 \div 4 = 900$. Alternatively, divide first: $36 \div 4 = 9$, so the answer is $900$.

**When it does not apply.** Dividing first is only clean when $n$ is a multiple of 4. Otherwise divide $100n$ by 4, or split: $25 \times 38 = 25 \times 36 + 25 \times 2 = 950$.

### 3. Multiply by 9: multiply by 10, then subtract once

**The trick.** $9 \times n = 10n - n$.

**Why it works.** $9 = 10 - 1$, and multiplication distributes over subtraction.

**Example.** $9 \times 47 = 470 - 47 = 423$.

**When it does not apply.** It always holds. The only risk is a borrowing error in the subtraction, so check the last digit: $9 \times 7 = 63$ ends in 3, and so does 423.

### 4. Multiply a two-digit number by 11: put the digit sum in the middle

**The trick.** For a two-digit number with digits $a$ and $b$, write $a$, then $a + b$, then $b$. If $a + b \ge 10$, carry the 1 into the hundreds.

**Why it works.**

$$
11(10a + b) = 110a + 11b = 100a + 10(a + b) + b
$$

**Example.** $11 \times 43$: $4$, $4 + 3 = 7$, $3$ gives $473$. With a carry, $11 \times 87$: $8$, $15$, $7$ becomes $957$.

**When it does not apply.** For longer numbers you must add each neighbouring pair of digits (for example $11 \times 352 = 3872$), and carries can chain, so the trick loses its speed advantage.

### 5. Multiply by 99: multiply by 100, then subtract once

**The trick.** $99 \times n = 100n - n$.

**Why it works.** $99 = 100 - 1$.

**Example.** $99 \times 34 = 3400 - 34 = 3366$.

**When it does not apply.** Always valid. The same idea gives $999 \times n = 1000n - n$, but the subtraction gets harder for large $n$.

### 6. Multiply a two-digit number by 101: write it twice

**The trick.** For a two-digit number $n$, $101 \times n$ is $n$ written twice.

**Why it works.** $101n = 100n + n$. Shifting a two-digit $n$ two places left leaves exactly two empty places for the second copy.

**Example.** $101 \times 47 = 4747$.

**When it does not apply.** For three-digit numbers the copies overlap: $101 \times 347 = 34700 + 347 = 35047$, not $347347$. (Writing a three-digit number twice is multiplication by $1001$.)

### 7. Double one factor and halve the other

**The trick.** If one factor is even, halve it and double the other. Repeat until the product is easy.

**Why it works.** $a \times b = \dfrac{a}{2} \times 2b$, because $\dfrac{1}{2} \times 2 = 1$.

**Example.** $16 \times 35 = 8 \times 70 = 560$.

**When it does not apply.** Halving an odd number produces a fraction, so stop when neither factor halves cleanly. The trick also does not help when neither number becomes "round".

### 8. Split one factor into tens and units

**The trick.** Break one factor into parts that are easy to multiply, then add the partial products.

**Why it works.** The distributive property: $a(b + c) = ab + ac$.

**Example.** $7 \times 68 = 7 \times 60 + 7 \times 8 = 420 + 56 = 476$.

**When it does not apply.** Always valid. When both factors have several digits, the number of partial products grows quickly, and other tricks in this section are faster.

### 9. Round, multiply, then compensate

**The trick.** Round a factor to a nearby round number, multiply, then subtract (or add) the overshoot.

**Why it works.** $a(b - k) = ab - ak$.

**Example.** $6 \times 49 = 6 \times 50 - 6 = 294$, and $7 \times 198 = 7 \times 200 - 7 \times 2 = 1386$.

**When it does not apply.** It is only worth it when the rounding distance $k$ is small. Remember to multiply the correction by the other factor: $7 \times 198$ is $1400 - 14$, not $1400 - 2$.

### 10. Multiply two numbers just below 100

**The trick.** Find each number's deficit from 100. Subtract one deficit from the other number to get the first two digits; multiply the deficits to get the last two.

**Why it works.**

$$
(100 - a)(100 - b) = 100\,(100 - a - b) + ab
$$

**Example.** $97 \times 96$: deficits $3$ and $4$. Left part $96 - 3 = 93$, right part $3 \times 4 = 12$, so $9312$. With a carry, $88 \times 89$: deficits $12$ and $11$, left part $77$, right part $132$, so $7700 + 132 = 7832$.

**When it does not apply.** If $ab \ge 100$, the right part spills into the hundreds and must be added, not written beside the left part. The trick is slow for numbers far from 100.

### 11. Multiply two numbers just above 100

**The trick.** Add one number's excess over 100 to the other number for the leading digits; multiply the excesses for the last two digits.

**Why it works.**

$$
(100 + a)(100 + b) = 100\,(100 + a + b) + ab
$$

**Example.** $104 \times 107$: $107 + 4 = 111$, $4 \times 7 = 28$, so $11128$.

**When it does not apply.** Same carry rule as trick 10 when $ab \ge 100$. If one number is above 100 and one below, the product $ab$ is negative and must be subtracted: $103 \times 98 = 100 \times 101 - 6 = 10094$.

### 12. Same tens digit, units that add to 10

**The trick.** If two two-digit numbers share a tens digit $a$ and their units digits add to 10, multiply $a$ by $a + 1$, then append the product of the units digits as two digits.

**Why it works.** With units $b$ and $c$ where $b + c = 10$:

$$
(10a + b)(10a + c) = 100a^2 + 10a(b + c) + bc = 100\,a(a + 1) + bc
$$

**Example.** $43 \times 47$: $4 \times 5 = 20$, $3 \times 7 = 21$, so $2021$. And $62 \times 68 = 4216$.

**When it does not apply.** Both conditions are required. $43 \times 48$ fails because $3 + 8 \ne 10$. Write $bc$ with two digits: $41 \times 49 = 2009$, not $209$.

### 13. Use the midpoint: difference of squares

**The trick.** If two numbers are equally spaced around an easy number $m$, the product is $m^2$ minus the square of the gap.

**Why it works.** $(m - d)(m + d) = m^2 - d^2$, the difference-of-squares identity ([OpenStax Algebra and Trigonometry 2e, §1.4](https://openstax.org/books/algebra-and-trigonometry-2e/pages/1-4-polynomials)).

**Example.** $47 \times 53 = 50^2 - 3^2 = 2500 - 9 = 2491$, and $38 \times 42 = 1600 - 4 = 1596$.

**When it does not apply.** The numbers must be the same distance from an easy square, which means their sum must be even. For $47 \times 54$, use $47 \times 53 + 47 = 2538$.

### 14. Multiply two "teens"

**The trick.** For $13 \times 17$: add one number to the units digit of the other ($13 + 7 = 20$), multiply by 10, then add the product of the units digits ($3 \times 7 = 21$).

**Why it works.**

$$
(10 + a)(10 + b) = 10\,(10 + a + b) + ab
$$

**Example.** $13 \times 17 = 200 + 21 = 221$, and $16 \times 18 = 240 + 48 = 288$.

**When it does not apply.** Only for numbers from 11 to 19. The same idea works around any base, such as 20 or 50, if you replace the 10s with that base.

### 15. Factor into friendly pairs

**The trick.** Break factors apart to create pairs such as $4 \times 25 = 100$ or $8 \times 125 = 1000$.

**Why it works.** Multiplication is associative and commutative, so factors can be regrouped freely.

**Example.** $32 \times 125 = 4 \times (8 \times 125) = 4 \times 1000 = 4000$, and $44 \times 25 = 11 \times (4 \times 25) = 1100$.

**When it does not apply.** Only when the factors contain the right partners. $33 \times 125$ has no factor of 8, so use trick 9 instead ($32 \times 125 + 125$).

### 16. Cross-multiply two-digit numbers

**The trick.** For $\overline{ab} \times \overline{cd}$, compute three columns from right to left: $b \times d$, then $a \times d + b \times c$, then $a \times c$, carrying as you go.

**Why it works.**

$$
(10a + b)(10c + d) = 100\,ac + 10\,(ad + bc) + bd
$$

**Example.** $23 \times 41$: $3 \times 1 = 3$; $2 \times 1 + 3 \times 4 = 14$, write 4 carry 1; $2 \times 4 + 1 = 9$. Answer $943$. For $67 \times 58$: $56$ (write 6, carry 5); $6 \times 8 + 7 \times 5 + 5 = 88$ (write 8, carry 8); $6 \times 5 + 8 = 38$. Answer $3886$.

**When it does not apply.** It always works, but it demands holding carries in memory. If a number is near 100 or near a round number, tricks 9 to 13 are easier.

## Squares and roots

### 17. Square a number ending in 5

**The trick.** For a number written as "$a$5", multiply $a$ by $a + 1$ and append 25.

**Why it works.**

$$
(10a + 5)^2 = 100a^2 + 100a + 25 = 100\,a(a + 1) + 25
$$

**Example.** $65^2$: $6 \times 7 = 42$, so $4225$. $115^2$: $11 \times 12 = 132$, so $13225$.

**When it does not apply.** Only for numbers ending in 5. For a product like $65 \times 75$, use trick 13 ($70^2 - 5^2 = 4875$).

### 18. Square a number near 50

**The trick.** For $50 + d$, add $d$ to 25 for the first two digits and append $d^2$ as two digits.

**Why it works.**

$$
(50 + d)^2 = 2500 + 100d + d^2 = 100\,(25 + d) + d^2
$$

**Example.** $53^2$: $25 + 3 = 28$, $3^2 = 09$, so $2809$. $47^2$: $25 - 3 = 22$, $09$, so $2209$.

**When it does not apply.** $d^2$ must fit in two digits, so it is clean only for $|d| \le 9$, that is, from 41 to 59.

### 19. Square a number near 100

**The trick.** For $100 + d$, the first part is $100 + 2d$ and the last two digits are $d^2$.

**Why it works.** $(100 + d)^2 = 100\,(100 + 2d) + d^2$, which is the perfect-square pattern $(a + b)^2 = a^2 + 2ab + b^2$ ([OpenStax Algebra and Trigonometry 2e, §1.4](https://openstax.org/books/algebra-and-trigonometry-2e/pages/1-4-polynomials)).

**Example.** $97^2$: $100 - 6 = 94$, $3^2 = 09$, so $9409$. $104^2$: $108$, $16$, so $10816$.

**When it does not apply.** Again $d^2$ must stay below 100, so it is clean for $|d| \le 9$.

### 20. Step from a square you know

**The trick.** To get $(n + 1)^2$ from $n^2$, add $n$ and $n + 1$.

**Why it works.** $(n + 1)^2 - n^2 = 2n + 1 = n + (n + 1)$.

**Example.** $31^2 = 30^2 + 30 + 31 = 961$, and $41^2 = 1600 + 40 + 41 = 1681$.

**When it does not apply.** It works for neighbours. For larger steps use $(n + k)^2 = n^2 + 2nk + k^2$, and do not drop the $2nk$ term.

### 21. Square by moving to a round number

**The trick.** To square $n$, move down by $d$ and up by $d$ to make one factor round, multiply, then add $d^2$.

**Why it works.** $n^2 = (n - d)(n + d) + d^2$.

**Example.** $48^2 = 46 \times 50 + 2^2 = 2300 + 4 = 2304$, and $87^2 = 84 \times 90 + 9 = 7569$.

**When it does not apply.** Always valid, but only helpful when the new product is easy. Forgetting $+d^2$ is the usual mistake.

### 22. Sums of consecutive odd numbers are squares

**The trick.** The sum of the first $n$ odd numbers is $n^2$.

**Why it works.** $\sum_{k=1}^{n} (2k - 1) = 2 \cdot \dfrac{n(n + 1)}{2} - n = n^2$.

**Example.** $1 + 3 + 5 + \dots + 19$ has 10 terms, so the sum is $10^2 = 100$.

**When it does not apply.** The sum must start at 1 and skip no odd numbers. For $11 + 13 + \dots + 19$, compute $10^2 - 5^2 = 75$.

### 23. Rule out squares by the last digit

**The trick.** A perfect square can only end in 0, 1, 4, 5, 6 or 9. A whole number ending in 2, 3, 7 or 8 is not a perfect square.

**Why it works.** The last digit of $n^2$ depends only on the last digit of $n$, and the squares $0^2, 1^2, \dots, 9^2$ end in 0, 1, 4, 9, 6, 5, 6, 9, 4, 1.

**Example.** $1{,}234{,}567$ ends in 7, so it is not a perfect square.

**When it does not apply.** The test can only rule numbers out. $5{,}555$ ends in 5 and is still not a square.

### 24. Rule out squares by the digit sum

**The trick.** Reduce a number by repeatedly adding its digits (its *digital root*). A perfect square has digital root 1, 4, 7 or 9.

**Why it works.** A number leaves the same remainder mod 9 as its digit sum (see trick 41), and squares mod 9 can only be 0, 1, 4 or 7.

**Example.** $5{,}555$: $5 + 5 + 5 + 5 = 20$, $2 + 0 = 2$. Not 1, 4, 7 or 9, so $5{,}555$ is not a square. (It sits between $74^2 = 5476$ and $75^2 = 5625$.)

**When it does not apply.** Like trick 23, it only rules numbers out. $1{,}234{,}567$ has digital root 1 but is not a square.

### 25. Bracket a square root between two squares

**The trick.** Find the perfect squares on either side of the number.

**Why it works.** The square root function is increasing, so $a^2 < x < b^2$ implies $a < \sqrt{x} < b$ for positive numbers.

**Example.** $49 < 50 < 64$, so $7 < \sqrt{50} < 8$. And $196 < 200 < 225$ gives $14 < \sqrt{200} < 15$.

**When it does not apply.** This gives bounds, not a decimal answer. Use trick 26 to refine it.

### 26. Refine a square root with one division

**The trick.** If $x = n^2 + r$ with $n^2$ the nearest perfect square, then $\sqrt{x} \approx n + \dfrac{r}{2n}$.

**Why it works.** $\left(n + \dfrac{r}{2n}\right)^2 = n^2 + r + \dfrac{r^2}{4n^2}$, which differs from $x$ only by the small term $\dfrac{r^2}{4n^2}$.

**Example.** $\sqrt{50} \approx 7 + \dfrac{1}{14} \approx 7.0714$; the true value is $7.0711$. For $\sqrt{80}$, use $81$: $9 - \dfrac{1}{18} \approx 8.944$.

**When it does not apply.** The error grows when $r$ is large compared with $n$, and the estimate is always slightly too high. Use the nearest square, even if $r$ is negative: starting $\sqrt{80}$ from $64$ gives $9$, a poor estimate.

### 27. Simplify a radical by pulling out square factors

**The trick.** Factor out the largest perfect square.

**Why it works.** $\sqrt{a^2 b} = a\sqrt{b}$ for $a, b \ge 0$.

**Example.** $\sqrt{72} = \sqrt{36 \cdot 2} = 6\sqrt{2}$.

**When it does not apply.** The rule splits products, not sums: $\sqrt{9 + 16} = 5$, while $\sqrt{9} + \sqrt{16} = 7$.

### 28. Find the square root of a perfect square from its last digit

**The trick.** Use the last digit to narrow the root's last digit to two options, bracket the root between multiples of 10, then test the midpoint ending in 5.

**Why it works.** By trick 23's table, a square ending in 6 has a root ending in 4 or 6 (similarly 1 ↔ 1 or 9, 4 ↔ 2 or 8, 9 ↔ 3 or 7). Squares grow with the root, so comparing with $(10a + 5)^2$ picks the lower or upper option.

**Example.** $\sqrt{5476}$: ends in 6, so the root ends in 4 or 6. $70^2 = 4900 < 5476 < 6400 = 80^2$, so the root is 74 or 76. Since $75^2 = 5625 > 5476$, the root is $74$.

**When it does not apply.** Only for numbers you already know are perfect squares. Otherwise use tricks 25 and 26.

### 29. Find the cube root of a perfect cube

**The trick.** The last digit of a perfect cube identifies the last digit of its root. Then find the tens digit from the part of the number before the last three digits.

**Why it works.** The cubes $0^3, 1^3, \dots, 9^3$ end in 0, 1, 8, 7, 4, 5, 6, 3, 2, 9, which are all different, so each last digit points to exactly one root digit. Dropping the last three digits divides roughly by $10^3$, which removes the units digit from the root.

**Example.** $\sqrt[3]{405224}$: last digit 4 means the root ends in 4. The leading part $405$ lies between $7^3 = 343$ and $8^3 = 512$, so the tens digit is 7. Root: $74$. Likewise $\sqrt[3]{857375} = 95$.

**When it does not apply.** Only for perfect cubes with a two-digit root. A number that is not a perfect cube will still produce an answer, but it will be wrong.

## Divisibility rules

### 30. Divisibility by 2, 5 and 10: look at the last digit

**The trick.** A whole number is divisible by 2 if it ends in 0, 2, 4, 6 or 8; by 5 if it ends in 0 or 5; by 10 if it ends in 0 ([OpenStax Prealgebra 2e, §2.4](https://openstax.org/books/prealgebra-2e/pages/2-4-find-multiples-and-factors)).

**Why it works.** Write $n = 10q + r$, where $r$ is the last digit. Since $10q$ is a multiple of 2, 5 and 10, only $r$ decides.

**Example.** $3{,}745$ ends in 5: divisible by 5, not by 2 or 10.

**When it does not apply.** Last-digit tests only work for divisors of 10. For 4 and 8, use more digits (tricks 31 and 32).

### 31. Divisibility by 4: last two digits

**The trick.** A number is divisible by 4 exactly when the number formed by its last two digits is ([Wolfram MathWorld](https://mathworld.wolfram.com/DivisibilityTests.html)).

**Why it works.** $n = 100q + r$ and $100 = 4 \times 25$, so only $r$ matters.

**Example.** $7{,}316$: $16$ is divisible by 4, so $7{,}316$ is ($7316 = 4 \times 1829$).

**When it does not apply.** An even last digit is not enough: $7{,}318$ ends in 18, and $18$ is not divisible by 4.

### 32. Divisibility by 8: last three digits

**The trick.** Check the number formed by the last three digits.

**Why it works.** $1000 = 8 \times 125$, so $n = 1000q + r$ and only $r$ matters.

**Example.** $5{,}128$: $128 = 8 \times 16$, so $5{,}128$ is divisible by 8 ($5128 = 8 \times 641$).

**When it does not apply.** Checking only the last two digits is not enough: $116$ ends in 16, which is divisible by 8, but $116$ is not.

### 33. Divisibility by 25: ends in 00, 25, 50 or 75

**The trick.** A number is divisible by 25 when its last two digits are 00, 25, 50 or 75.

**Why it works.** $100 = 4 \times 25$, so only the last two digits matter, and those four are the two-digit multiples of 25.

**Example.** $3{,}475$ ends in 75, so it is divisible by 25 ($3475 = 25 \times 139$).

**When it does not apply.** Ending in 5 is not enough: $3{,}465$ ends in 65.

### 34. Divisibility by 3: digit sum

**The trick.** A number is divisible by 3 when its digit sum is ([OpenStax Prealgebra 2e, §2.4](https://openstax.org/books/prealgebra-2e/pages/2-4-find-multiples-and-factors)).

**Why it works.** $10 = 9 + 1$, so every power of 10 leaves remainder 1 when divided by 3. A number $\sum d_k 10^k$ therefore leaves the same remainder as $\sum d_k$.

**Example.** $4{,}587$: $4 + 5 + 8 + 7 = 24$, divisible by 3, so $4587 = 3 \times 1529$.

**When it does not apply.** The digit sum gives the remainder mod 3, not the quotient.

### 35. Divisibility by 9: digit sum

**The trick.** A number is divisible by 9 when its digit sum is.

**Why it works.** Same reason as trick 34: every power of 10 is 1 more than a multiple of 9.

**Example.** $4{,}587$ has digit sum 24, not a multiple of 9, so it is not divisible by 9. $4{,}581$ has digit sum 18, so $4581 = 9 \times 509$.

**When it does not apply.** Do not mix this up with 3: a digit sum of 24 passes the 3 test and fails the 9 test.

### 36. Divisibility by 6, 12, 15 and friends: combine coprime tests

**The trick.** To test a composite divisor, split it into factors that share no common factor and run both tests. $6 = 2 \times 3$, $12 = 4 \times 3$, $15 = 3 \times 5$, $18 = 2 \times 9$.

**Why it works.** If coprime numbers $a$ and $b$ both divide $n$, then their product $ab$ divides $n$.

**Example.** Is $7{,}316$ divisible by 12? It passes the 4 test (trick 31), but its digit sum is 17, so it fails the 3 test. Not divisible by 12.

**When it does not apply.** The factors must be coprime. $12$ is divisible by both 4 and 6 but not by 24, because 4 and 6 share the factor 2.

### 37. Divisibility by 11: alternating digit sum

**The trick.** Starting from the units digit, alternately add and subtract digits. The number is divisible by 11 exactly when this alternating sum is (including 0) ([Wolfram MathWorld](https://mathworld.wolfram.com/DivisibilityTests.html)).

**Why it works.** $10 = 11 - 1$, so $10^k$ leaves remainder $(-1)^k$ when divided by 11.

**Example.** $918{,}082$: $2 - 8 + 0 - 8 + 1 - 9 = -22$, a multiple of 11. Indeed $918082 = 11 \times 83462$.

**When it does not apply.** Plain digit sums do not work for 11. A negative alternating sum is fine; only divisibility by 11 matters.

### 38. Divisibility by 7: subtract twice the last digit

**The trick.** Remove the last digit $y$, leaving $x$. Then $10x + y$ is divisible by 7 exactly when $x - 2y$ is. Repeat as needed ([Wolfram MathWorld](https://mathworld.wolfram.com/DivisibilityTests.html)).

**Why it works.** $(10x + y) - 10(x - 2y) = 21y$, a multiple of 7. Since 10 and 7 share no factor, $10x + y$ is a multiple of 7 exactly when $x - 2y$ is.

**Example.** $343$: $34 - 2 \times 3 = 28 = 4 \times 7$. Yes. $2{,}401$: $240 - 2 = 238$, then $23 - 16 = 7$. Yes ($2401 = 7^4$).

**When it does not apply.** It answers yes or no; the intermediate numbers are not the remainder. For very long numbers, trick 40 is faster.

### 39. Divisibility by 13: add four times the last digit

**The trick.** Remove the last digit $y$, leaving $x$. Then $10x + y$ is divisible by 13 exactly when $x + 4y$ is.

**Why it works.** $(10x + y) - 10(x + 4y) = -39y = -3 \times 13y$, and 10 shares no factor with 13.

**Example.** $2{,}197$: $219 + 28 = 247$, then $24 + 28 = 52 = 4 \times 13$. Yes ($2197 = 13^3$).

**When it does not apply.** Like trick 38, the intermediate values are not remainders. For many digits, use trick 40.

### 40. Divisibility by 7, 11 and 13 at once: three-digit blocks

**The trick.** Split the number into groups of three digits from the right and take the alternating sum, starting with $+$ on the last group. The original number is divisible by 7, 11 or 13 exactly when this sum is.

**Why it works.** $1001 = 7 \times 11 \times 13$, so $1000$ leaves remainder $-1$ for each of the three divisors, and the blocks pick up alternating signs ([Cut the Knot](https://www.cut-the-knot.org/blue/div7-11-13.shtml); [John D. Cook, 2020](https://www.johndcook.com/blog/2020/11/10/test-for-divisibility-by-13/)).

**Example.** $4{,}894{,}498{,}518$: $518 - 498 + 894 - 4 = 910 = 2 \times 5 \times 7 \times 13$. So the number is divisible by 7 and 13 but not by 11. (This example comes from John D. Cook's post.)

**When it does not apply.** The signs must alternate. Simply adding the blocks fails: $1001$ itself would give $1 + 1 = 2$.

### 41. Find a remainder mod 9 from the digit sum

**The trick.** The remainder of $n \div 9$ equals the remainder of its digit sum divided by 9.

**Why it works.** Every power of 10 leaves remainder 1 mod 9 (trick 35), so $n$ and its digit sum differ by a multiple of 9.

**Example.** $4{,}573$: $4 + 5 + 7 + 3 = 19$, $1 + 9 = 10$, $1 + 0 = 1$. So $4573 = 9 \times 508 + 1$.

**When it does not apply.** A final digital root of 9 means remainder 0, not 9.

### 42. Check a multiplication by casting out nines

**The trick.** Reduce each factor and the claimed answer to their remainders mod 9 (digit sums). The product of the factors' remainders must match the answer's remainder.

**Why it works.** Remainders multiply: if $a \equiv r$ and $b \equiv s \pmod 9$, then $ab \equiv rs \pmod 9$ ([Wolfram MathWorld, Casting Out Nines](https://mathworld.wolfram.com/CastingOutNines.html)).

**Example.** Claim: $348 \times 27 = 9396$. Remainders: $348 \to 15 \to 6$, $27 \to 0$, so the product's remainder is $0$. And $9396 \to 27 \to 0$. The check passes, and in fact the claim is correct.

**When it does not apply.** A pass is not a proof. Swapped digits (writing $9369$) or an extra zero (writing $93960$) leave the digit sum unchanged and slip through ([Wolfram MathWorld](https://mathworld.wolfram.com/CastingOutNines.html)).

### 43. Add a second check: casting out elevens

**The trick.** Repeat the check with remainders mod 11, using the alternating digit sum from trick 37.

**Why it works.** Remainders mod 11 also multiply. Swapping two neighbouring digits $a$ and $b$ changes the alternating sum by $\pm 2(a - b)$, which is a multiple of 11 only when $a = b$, so adjacent swaps of different digits are caught.

**Example.** $348 \to 8 - 4 + 3 = 7$; $27 \to 7 - 2 = 5$; $7 \times 5 = 35 \to 2$. And $9396 \to 6 - 9 + 3 - 9 = -9 \to 2$. Pass. The swapped answer $9369$ gives $9 - 6 + 3 - 9 = -3 \to 8$, so it fails.

**When it does not apply.** Errors that change the answer by a multiple of 11 still pass. Use it together with casting out nines, not instead of estimation.

### 44. Check the last digit of a product

**The trick.** The last digit of a product equals the last digit of the product of the factors' last digits.

**Why it works.** $(10a + b)(10c + d) = 10(\dots) + bd$, so only $bd$ affects the units place.

**Example.** $387 \times 46$ must end in 2, because $7 \times 6 = 42$. A claimed answer of $17{,}804$ is wrong; the correct product is $17{,}802$.

**When it does not apply.** It only checks one digit. Pair it with an estimate (trick 61) to check the size.

## Fractions, decimals and percentages

### 45. Swap the numbers in a percentage

**The trick.** $x\%$ of $y$ equals $y\%$ of $x$. Use whichever is easier.

**Why it works.** $\dfrac{x}{100} \cdot y = \dfrac{y}{100} \cdot x$, because multiplication is commutative.

**Example.** $8\%$ of $50$ = $50\%$ of $8$ = $4$.

**When it does not apply.** It only helps when the swapped percentage is friendly, such as 10%, 25% or 50%.

### 46. Build any percentage from 10%, 5% and 1%

**The trick.** Find 10% by dividing by 10, halve it for 5%, divide by 10 again for 1%, then combine.

**Why it works.** A percent is a ratio with denominator 100 ([OpenStax Prealgebra 2e, §6.1](https://openstax.org/books/prealgebra-2e/pages/6-1-understand-percent)), so percentages of the same amount add: $35\% = 3 \times 10\% + 5\%$.

**Example.** $35\%$ of $240$: $10\% = 24$, so $3 \times 24 + 12 = 84$.

**When it does not apply.** "Cross out the last digit" for 10% only works for whole numbers ending in 0. For 10% of 245, move the decimal point: $24.5$. Teachers report this shortcut as a common source of errors ([Mr Barton Maths](https://mrbartonmaths.com/percentage-increase-and-decrease-probing-questions/)).

### 47. Change by a percentage with a single multiplier

**The trick.** To increase by $p\%$, multiply by $1 + \dfrac{p}{100}$. To decrease by $p\%$, multiply by $1 - \dfrac{p}{100}$. Convert the percentage to a decimal by moving the decimal point two places left ([OpenStax Prealgebra 2e, §6.1](https://openstax.org/books/prealgebra-2e/pages/6-1-understand-percent)).

**Why it works.** $x + \dfrac{p}{100}x = x\left(1 + \dfrac{p}{100}\right)$.

**Example.** Increase 80 by 30%: $80 \times 1.3 = 104$. Decrease 60 by 15%: $60 \times 0.85 = 51$.

**When it does not apply.** Multiplying by $0.3$ gives the 30% *amount* (24), not the new total. A multiplier above 1 always increases, so $\times 1.15$ cannot be a 15% decrease.

### 48. Chain percentage changes by multiplying

**The trick.** Successive changes multiply; they do not add.

**Why it works.** A change of $a$ then $b$ (as decimals) gives $(1 + a)(1 + b) = 1 + a + b + ab$. The extra $ab$ is why adding fails.

**Example.** $+20\%$ then $-20\%$: $1.2 \times 0.8 = 0.96$, a 4% loss overall. Three 10% rises: $1.1^3 = 1.331$, a 33.1% rise, not 30%.

**When it does not apply.** Adding is a reasonable estimate only when the changes are small, because then $ab$ is tiny.

### 49. Undo a percentage change by dividing

**The trick.** To find the value before a change, divide by the multiplier.

**Why it works.** If $\text{new} = \text{old} \times m$, then $\text{old} = \text{new} \div m$.

**Example.** A price is £91 after a 30% rise. Original: $91 \div 1.3 = 70$.

**When it does not apply.** Subtracting 30% of the new price is wrong: $91 \times 0.7 = 63.7$. Teachers list this reversal as a frequent misconception ([Mr Barton Maths](https://mrbartonmaths.com/percentage-increase-and-decrease-probing-questions/)).

### 50. Keep percentage points and percent change apart

**The trick.** When a rate moves from 4% to 5%, it rose by 1 *percentage point*, which is a 25% *relative* increase.

**Why it works.** Percentage points are a difference, $5 - 4 = 1$. Percent change is a ratio, $\dfrac{5 - 4}{4} = 0.25$.

**Example.** An interest rate going from 2% to 3% is a 1-point rise and a 50% relative rise.

**When it does not apply.** This is a reading trick, not a shortcut. It matters whenever the quantity being changed is itself a percentage.

### 51. Estimate doubling time with the rule of 72

**The trick.** At a growth rate of $r\%$ per period, the doubling time is roughly $72 \div r$ periods.

**Why it works.** Doubling requires $(1 + i)^t = 2$, so $t = \dfrac{\ln 2}{\ln(1 + i)}$. For small $i$, $\ln(1 + i) \approx i$, giving $t \approx \dfrac{0.693}{i} = \dfrac{69.3}{r}$. Using 72 instead of 69.3 partly corrects for $\ln(1 + i)$ being slightly smaller than $i$ at typical rates, and 72 has many divisors.

**Example.** At 6% per year: $72 \div 6 = 12$ years. The exact value is $\ln 2 / \ln 1.06 \approx 11.9$ years.

**When it does not apply.** It is an approximation for moderate rates. At 72% per period, the rule says 1 period, but the exact answer is about 1.28.

### 52. Memorize a few benchmark fractions

**The trick.** Know the decimal forms of common fractions: $\tfrac{1}{8} = 0.125$, $\tfrac{3}{8} = 0.375$, $\tfrac{5}{8} = 0.625$, $\tfrac{7}{8} = 0.875$, $\tfrac{1}{6} = 0.1\overline{6}$, $\tfrac{1}{12} = 0.08\overline{3}$, $\tfrac{1}{16} = 0.0625$.

**Why it works.** Each comes from repeated halving ($\tfrac{1}{8} = \tfrac{1}{2} \cdot \tfrac{1}{2} \cdot \tfrac{1}{2}$) or from $\tfrac{1}{3} = 0.\overline{3}$, so you can rebuild them.

**Example.** $0.375 \times 48 = \tfrac{3}{8} \times 48 = 18$.

**When it does not apply.** Only for decimals that match a benchmark. $0.37 \times 48$ is close to 18 but not equal ($17.76$).

### 53. Read sevenths from the cycle 142857

**The trick.** Every fraction $\tfrac{k}{7}$ (for $k = 1$ to $6$) repeats the digits $142857$ in the same cyclic order. Start where the leading digit matches.

**Why it works.** In the long division of 1 by 7, the remainders cycle through all of $1, 2, \dots, 6$. Starting from a different numerator just starts the same cycle at a different point.

**Example.** $\tfrac{3}{7} \approx 0.43$, so start at the 4: $\tfrac{3}{7} = 0.\overline{428571}$.

**When it does not apply.** This specific cycle is unique to 7. Other denominators such as 17 have their own longer cycles, and denominators such as 13 split into two separate cycles.

### 54. Divide by 5 or 25 by multiplying

**The trick.** $n \div 5 = 2n \div 10$, and $n \div 25 = 4n \div 100$.

**Why it works.** $\tfrac{1}{5} = \tfrac{2}{10}$ and $\tfrac{1}{25} = \tfrac{4}{100}$.

**Example.** $460 \div 5 = 920 \div 10 = 92$, and $1300 \div 25 = 5200 \div 100 = 52$.

**When it does not apply.** It works for any number, but produces decimals when $2n$ is not a multiple of 10: $463 \div 5 = 92.6$.

### 55. Compare fractions by cross-multiplying

**The trick.** To compare $\tfrac{a}{b}$ and $\tfrac{c}{d}$ with positive denominators, compare $ad$ with $bc$.

**Why it works.** Multiplying both fractions by the positive number $bd$ preserves the order: $\tfrac{a}{b} < \tfrac{c}{d} \iff ad < bc$.

**Example.** $\tfrac{5}{8}$ vs $\tfrac{7}{11}$: $5 \times 11 = 55 < 56 = 8 \times 7$, so $\tfrac{5}{8} < \tfrac{7}{11}$.

**When it does not apply.** If a denominator is negative, the inequality flips. Rewrite the fractions with positive denominators first.

### 56. Add two unit fractions in one line

**The trick.** $\dfrac{1}{a} + \dfrac{1}{b} = \dfrac{a + b}{ab}$.

**Why it works.** Use the common denominator $ab$: $\dfrac{b}{ab} + \dfrac{a}{ab}$.

**Example.** $\tfrac{1}{3} + \tfrac{1}{5} = \tfrac{8}{15}$.

**When it does not apply.** Simplify afterwards when $a$ and $b$ share a factor: $\tfrac{1}{4} + \tfrac{1}{6} = \tfrac{10}{24} = \tfrac{5}{12}$.

### 57. Telescope sums of consecutive-product fractions

**The trick.** Rewrite each term as a difference so that neighbouring terms cancel.

**Why it works.** $\dfrac{1}{n(n + 1)} = \dfrac{1}{n} - \dfrac{1}{n + 1}$, so in a sum everything cancels except the first and last pieces.

**Example.**

$$
\frac{1}{1 \cdot 2} + \frac{1}{2 \cdot 3} + \dots + \frac{1}{9 \cdot 10} = 1 - \frac{1}{10} = \frac{9}{10}
$$

**When it does not apply.** The terms must be consecutive. Gaps break the cancellation, and for $\tfrac{1}{n(n + 2)}$ you need a factor of $\tfrac{1}{2}$: $\tfrac{1}{n(n+2)} = \tfrac{1}{2}\left(\tfrac{1}{n} - \tfrac{1}{n + 2}\right)$.

### 58. Cancel before you multiply

**The trick.** Divide out common factors between any numerator and any denominator before multiplying.

**Why it works.** $\dfrac{a}{b} \cdot \dfrac{c}{d} = \dfrac{ac}{bd}$, and a common factor can be removed from $ac$ and $bd$ at any stage.

**Example.** $\dfrac{14}{15} \cdot \dfrac{25}{28}$: cancel 14 with 28 (leaving $\tfrac{1}{2}$) and 25 with 15 (leaving $\tfrac{5}{3}$), giving $\tfrac{5}{6}$. Likewise $\tfrac{3}{8}$ of $64$ is $3 \times 8 = 24$.

**When it does not apply.** Cancellation works for products only. In $\dfrac{14 + 5}{28}$, you cannot cancel the 14.

### 59. Turn a repeating decimal into a fraction

**The trick.** A block of $k$ repeating digits right after the decimal point equals that block over $k$ nines.

**Why it works.** If $x = 0.\overline{ab}$, then $100x - x = ab$, so $x = \dfrac{ab}{99}$. The same argument works with $10^k - 1$ for any block length.

**Example.** $0.\overline{27} = \tfrac{27}{99} = \tfrac{3}{11}$, and $0.\overline{7} = \tfrac{7}{9}$.

**When it does not apply.** If non-repeating digits come first, shift them out first: $0.1\overline{6} = \tfrac{1}{10}\left(1 + 0.\overline{6}\right) = \tfrac{1}{6}$.

### 60. Average by deviations from a guess

**The trick.** Pick a convenient guess, average the differences from it, and add that to the guess.

**Why it works.** $\dfrac{1}{n}\sum x_i = g + \dfrac{1}{n}\sum (x_i - g)$ for any guess $g$.

**Example.** Mean of 87, 92, 78, 95 with guess 90: deviations $-3, +2, -12, +5$ sum to $-8$, and $-8 \div 4 = -2$. Mean: $88$.

**When it does not apply.** Always valid for the arithmetic mean. It does not work for medians or weighted averages unless you weight the deviations.

## Estimation and checking

### 61. Round to one significant figure first

**The trick.** Round each number to one significant figure and compute an estimate before doing the exact calculation.

**Why it works.** The relative error of each rounded factor is limited, so the estimate lands in the right order of magnitude.

**Example.** $412 \times 587 \approx 400 \times 600 = 240{,}000$. The exact product is $241{,}844$.

**When it does not apply.** Errors can pile up when every number is rounded in the same direction, and the estimate is not a substitute for the exact answer when precision matters.

### 62. Use scientific notation for very large or small numbers

**The trick.** Write numbers as $a \times 10^n$ with $1 \le |a| < 10$, multiply the $a$ parts and add the exponents ([OpenStax Algebra and Trigonometry 2e, §1.2](https://openstax.org/books/algebra-and-trigonometry-2e/pages/1-2-exponents-and-scientific-notation)).

**Why it works.** $(a \times 10^m)(b \times 10^n) = ab \times 10^{m+n}$ by the product rule for exponents.

**Example.** $32{,}000 \times 600{,}000 = (3.2 \times 10^4)(6 \times 10^5) = 19.2 \times 10^9 = 1.92 \times 10^{10}$.

**When it does not apply.** Remember to renormalize: $19.2 \times 10^9$ is correct but not in standard form.

### 63. Bracket the answer between bounds

**The trick.** Round all factors down for a lower bound and all up for an upper bound.

**Why it works.** For positive numbers, multiplication preserves order: if $a_1 \le a \le a_2$ and $b_1 \le b \le b_2$, then $a_1 b_1 \le ab \le a_2 b_2$.

**Example.** $410 \times 580 = 237{,}800 \le 412 \times 587 \le 420 \times 590 = 247{,}800$.

**When it does not apply.** With negative numbers or subtraction, the directions change. For $a - b$, the lower bound uses the smallest $a$ and the largest $b$.

### 64. Count the digits of a product

**The trick.** The product of an $m$-digit and an $n$-digit whole number has either $m + n - 1$ or $m + n$ digits.

**Why it works.** $10^{m-1} \le a < 10^m$ and $10^{n-1} \le b < 10^n$, so $10^{m+n-2} \le ab < 10^{m+n}$.

**Example.** $4{,}321 \times 567$ (4 digits times 3 digits) must have 6 or 7 digits. The exact product, $2{,}450{,}007$, has 7.

**When it does not apply.** It narrows the size to two options; use trick 61 to choose between them.

### 65. Let the units do the work

**The trick.** Multiply by conversion factors written as fractions equal to 1, and cancel units like numbers.

**Why it works.** A factor such as $\dfrac{1000\ \text{m}}{1\ \text{km}}$ equals 1, so multiplying by it changes the units but not the quantity.

**Example.**

$$
90\ \frac{\text{km}}{\text{h}} \times \frac{1000\ \text{m}}{1\ \text{km}} \times \frac{1\ \text{h}}{3600\ \text{s}} = 25\ \frac{\text{m}}{\text{s}}
$$

**When it does not apply.** Units confirm the form of an answer, not its numerical correctness. A formula can have the right units and the wrong constant (for example, $\pi r^2$ versus $2\pi r^2$).

### 66. Test an algebraic step with a number

**The trick.** After simplifying an expression, substitute a simple value into both the original and the result.

**Why it works.** If two expressions are identical, they agree for every value of the variable, so one disagreement proves an error.

**Example.** Is $(x + 3)^2 = x^2 + 9$? At $x = 1$: $16 \ne 10$. The correct expansion is $x^2 + 6x + 9$, which gives 16.

**When it does not apply.** Agreement at one value does not prove the identity. Avoid test values like 0 and 1, which hide many errors; try two values such as 2 and 3.

### 67. Check by the inverse operation

**The trick.** Check a product by dividing, a quotient by multiplying, a sum by subtracting, a root by squaring.

**Why it works.** Inverse operations undo each other: $(a \times b) \div b = a$ when $b \ne 0$.

**Example.** To check $348 \times 27 = 9396$, compute $9396 \div 27 = 348$.

**When it does not apply.** Squaring checks the magnitude of a root, not its sign: both $3$ and $-3$ square to 9.

### 68. Divide using compatible numbers

**The trick.** Replace the dividend with a nearby number that the divisor divides evenly.

**Why it works.** Small changes to the dividend change the quotient by the change divided by the divisor.

**Example.** $4{,}970 \div 7 \approx 4{,}900 \div 7 = 700$. The exact answer is $710$, since $70 \div 7 = 10$ was dropped.

**When it does not apply.** It is an estimate. For the exact quotient, add back the adjustment as shown.

### 69. Add from left to right

**The trick.** Add the thousands, then the hundreds, tens and units, keeping a running total.

**Why it works.** Addition is associative and commutative, so place values can be added in any order.

**Example.** $3{,}476 + 2{,}858$: $5000 + 1200 + 120 + 14 = 6334$.

**When it does not apply.** Always valid. For long columns of numbers, standard column addition with carries is less error-prone on paper.

### 70. Subtract from a power of 10 with nines

**The trick.** To compute $1000 - n$ for a three-digit $n$, subtract each digit from 9 except the last nonzero one, which you subtract from 10.

**Why it works.** $1000 - n = (999 - n) + 1$, and subtracting from 999 never needs borrowing.

**Example.** $1000 - 367$: $9 - 3 = 6$, $9 - 6 = 3$, $10 - 7 = 3$. Answer: $633$.

**When it does not apply.** Trailing zeros stay zeros: $1000 - 360 = 640$, so apply the "from 10" step to the last nonzero digit.

## Algebra shortcuts

### 71. Add the first n whole numbers by pairing

**The trick.** $1 + 2 + \dots + n = \dfrac{n(n + 1)}{2}$.

**Why it works.** Write the sum forwards and backwards. Each of the $n$ column pairs adds to $n + 1$, so twice the sum is $n(n + 1)$.

**Example.** $1 + 2 + \dots + 100 = \dfrac{100 \times 101}{2} = 5050$.

**When it does not apply.** The sum must start at 1 with step 1. For other arithmetic sequences, use trick 72.

### 72. Sum any arithmetic sequence: count times average

**The trick.** Sum = number of terms × average of the first and last term ([OpenStax Algebra and Trigonometry 2e, §13.4](https://openstax.org/books/algebra-and-trigonometry-2e/pages/13-4-series-and-their-notations)).

**Why it works.** $S_n = \dfrac{n(a_1 + a_n)}{2}$, by the same pairing argument as trick 71.

**Example.** $3 + 7 + 11 + \dots + 99$: there are $\dfrac{99 - 3}{4} + 1 = 25$ terms, and the average of the ends is $51$. Sum: $25 \times 51 = 1275$.

**When it does not apply.** The gap between terms must be constant. Count the terms carefully: the usual error is forgetting the $+1$.

### 73. Sum a geometric sequence in one step

**The trick.** $a + ar + ar^2 + \dots + ar^{n-1} = a\,\dfrac{r^n - 1}{r - 1}$ ([OpenStax Algebra and Trigonometry 2e, §13.4](https://openstax.org/books/algebra-and-trigonometry-2e/pages/13-4-series-and-their-notations)).

**Why it works.** Multiply the sum $S$ by $r$ and subtract: all the middle terms cancel, leaving $rS - S = ar^n - a$.

**Example.** $1 + 3 + 9 + 27 + 81 + 243 = \dfrac{3^6 - 1}{3 - 1} = \dfrac{728}{2} = 364$.

**When it does not apply.** The formula fails for $r = 1$, where the sum is simply $na$.

### 74. Factor out the common factor first

**The trick.** When the same factor appears in every term, pull it out before computing.

**Why it works.** The distributive property: $ab + ac = a(b + c)$.

**Example.** $37 \times 63 + 37 \times 37 = 37 \times (63 + 37) = 37 \times 100 = 3700$.

**When it does not apply.** The factor must multiply every term. $37 \times 63 + 38 \times 37$ works ($37 \times 101$); $37 \times 63 + 36 \times 38$ does not.

### 75. Spot the difference of squares

**The trick.** Any expression of the form $a^2 - b^2$ factors as $(a + b)(a - b)$ ([OpenStax Algebra and Trigonometry 2e, §1.5](https://openstax.org/books/algebra-and-trigonometry-2e/pages/1-5-factoring-polynomials)).

**Why it works.** Expanding $(a + b)(a - b)$ gives $a^2 - ab + ab - b^2 = a^2 - b^2$.

**Example.** $101^2 - 99^2 = (101 + 99)(101 - 99) = 200 \times 2 = 400$, and $x^2 - 49 = (x + 7)(x - 7)$.

**When it does not apply.** A *sum* of squares, $a^2 + b^2$, does not factor over the real numbers.

### 76. Factor quadratics with the ac method

**The trick.** Find two numbers whose product is $ac$ and whose sum is $b$. Split the middle term with them and factor by grouping ([OpenStax Algebra and Trigonometry 2e, §1.5](https://openstax.org/books/algebra-and-trigonometry-2e/pages/1-5-factoring-polynomials)).

**Why it works.** If $(px + q)(rx + s)$ is the factorization, then $a = pr$, $c = qs$, and $b = ps + qr$. The two middle-term pieces $ps$ and $qr$ multiply to $pqrs = ac$.

**Example.** $6x^2 + 11x + 4$: $ac = 24$, and $3 \times 8 = 24$ with $3 + 8 = 11$. So $6x^2 + 3x + 8x + 4 = 3x(2x + 1) + 4(2x + 1) = (3x + 4)(2x + 1)$.

**When it does not apply.** If no integer pair exists, the quadratic does not factor over the integers. Use the quadratic formula instead.

### 77. Check roots with their sum and product

**The trick.** For $ax^2 + bx + c = 0$, the roots add to $-\dfrac{b}{a}$ and multiply to $\dfrac{c}{a}$.

**Why it works.** If the roots are $r$ and $s$, then $ax^2 + bx + c = a(x - r)(x - s) = a x^2 - a(r + s)x + ars$. Compare coefficients.

**Example.** $x^2 - 5x + 6 = 0$: the roots sum to 5 and multiply to 6, so they are 2 and 3.

**When it does not apply.** It identifies roots quickly only when they are small integers. Otherwise use it as a check after solving.

### 78. Use the discriminant before solving

**The trick.** Compute $b^2 - 4ac$ first. Positive: two real roots. Zero: one repeated root. Negative: no real roots ([OpenStax Algebra and Trigonometry 2e, §2.5](https://openstax.org/books/algebra-and-trigonometry-2e/pages/2-5-quadratic-equations)).

**Why it works.** The quadratic formula is $x = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$, and the square root is real only when $b^2 - 4ac \ge 0$.

**Example.** $2x^2 + 3x + 5 = 0$: $9 - 40 = -31 < 0$, so there are no real solutions. No need to try factoring.

**When it does not apply.** Only for quadratics. A perfect-square discriminant also tells you the roots are rational, so factoring will work.

### 79. Complete the square to find the vertex

**The trick.** Rewrite $x^2 + bx + c$ as $\left(x + \tfrac{b}{2}\right)^2 + c - \tfrac{b^2}{4}$.

**Why it works.** Expanding $\left(x + \tfrac{b}{2}\right)^2$ gives $x^2 + bx + \tfrac{b^2}{4}$, so subtracting $\tfrac{b^2}{4}$ restores the original expression ([OpenStax Algebra and Trigonometry 2e, §2.5](https://openstax.org/books/algebra-and-trigonometry-2e/pages/2-5-quadratic-equations)).

**Example.** $x^2 + 6x + 5 = (x + 3)^2 - 4$. The minimum value is $-4$ at $x = -3$, and the roots are $x = -3 \pm 2$, that is, $-1$ and $-5$.

**When it does not apply.** If the $x^2$ coefficient is not 1, factor it out of the first two terms first.

### 80. Clear fractions with the least common denominator

**The trick.** Multiply every term of an equation by the least common denominator before solving.

**Why it works.** Multiplying both sides of an equation by the same nonzero number keeps it balanced.

**Example.** $\dfrac{x}{3} + \dfrac{x}{4} = 7$. Multiply by 12: $4x + 3x = 84$, so $x = 12$.

**When it does not apply.** Multiply *every* term, including the right side. With variables in a denominator, check that your solution does not make any denominator zero.

### 81. Rewrite powers with a common base

**The trick.** Express all bases as powers of the same prime, then use the exponent rules.

**Why it works.** $a^m a^n = a^{m+n}$ and $(a^m)^n = a^{mn}$ ([OpenStax Algebra and Trigonometry 2e, §1.2](https://openstax.org/books/algebra-and-trigonometry-2e/pages/1-2-exponents-and-scientific-notation)).

**Example.** $4^5 \times 8^2 = 2^{10} \times 2^6 = 2^{16} = 65536$, and $\dfrac{27^2}{9^3} = \dfrac{3^6}{3^6} = 1$.

**When it does not apply.** Exponent rules work across multiplication, not addition: $2^3 + 2^3 = 2^4$, not $2^6$.

## Geometry shortcuts

### 82. Exterior angle of a triangle

**The trick.** An exterior angle of a triangle equals the sum of the two interior angles that are not next to it.

**Why it works.** The interior angles add to $180^\circ$ ([OpenStax Prealgebra 2e, §9.3](https://openstax.org/books/prealgebra-2e/pages/9-3-use-properties-of-angles-triangles-and-the-pythagorean-theorem)), and the exterior angle is $180^\circ$ minus the third interior angle. Both equal $A + B$.

**Example.** If two interior angles are $50^\circ$ and $60^\circ$, the exterior angle at the third vertex is $110^\circ$.

**When it does not apply.** It uses the two *remote* interior angles, not the adjacent one.

### 83. Angle sum of any polygon

**The trick.** The interior angles of an $n$-sided polygon add to $(n - 2) \times 180^\circ$.

**Why it works.** Diagonals from one vertex divide a convex polygon into $n - 2$ triangles, each contributing $180^\circ$.

**Example.** A hexagon's angles add to $720^\circ$, so each angle of a regular hexagon is $120^\circ$.

**When it does not apply.** The "divide by $n$" step only applies to regular polygons. The sum itself also holds for non-convex simple polygons.

### 84. Recognize Pythagorean triples and their multiples

**The trick.** Learn 3-4-5, 5-12-13, 8-15-17 and 7-24-25. Any multiple of a triple is also a triple.

**Why it works.** If $a^2 + b^2 = c^2$, then $(ka)^2 + (kb)^2 = k^2 c^2 = (kc)^2$.

**Example.** A right triangle with legs 15 and 20 is 3-4-5 scaled by 5, so the hypotenuse is 25.

**When it does not apply.** Only for right triangles, and only when the sides match a known triple. Otherwise compute $\sqrt{a^2 + b^2}$.

### 85. Generate Pythagorean triples

**The trick.** For whole numbers $m > n > 0$, the numbers $m^2 - n^2$, $2mn$ and $m^2 + n^2$ form a Pythagorean triple.

**Why it works.**

$$
(m^2 - n^2)^2 + (2mn)^2 = m^4 + 2m^2n^2 + n^4 = (m^2 + n^2)^2
$$

**Example.** $m = 3, n = 2$ gives 5, 12, 13. $m = 4, n = 1$ gives 15, 8, 17.

**When it does not apply.** Some choices give scaled copies (for example $m = 3, n = 1$ gives 8, 6, 10). To get every primitive triple, $m$ and $n$ must be coprime and not both odd.

### 86. Use the special right triangles

**The trick.** In a $45^\circ$-$45^\circ$-$90^\circ$ triangle, the sides are in the ratio $1 : 1 : \sqrt{2}$. In a $30^\circ$-$60^\circ$-$90^\circ$ triangle, they are $1 : \sqrt{3} : 2$.

**Why it works.** The first is half a square, so the Pythagorean theorem gives a diagonal of $\sqrt{1^2 + 1^2} = \sqrt{2}$. The second is half an equilateral triangle of side 2, with height $\sqrt{2^2 - 1^2} = \sqrt{3}$.

**Example.** A $45^\circ$ right triangle with leg 7 has hypotenuse $7\sqrt{2}$. A $30^\circ$-$60^\circ$-$90^\circ$ triangle with hypotenuse 10 has legs $5$ and $5\sqrt{3}$.

**When it does not apply.** Only for those exact angles. Match the shortest side to the smallest angle.

### 87. Distance between two points is Pythagoras

**The trick.** The distance between $(x_1, y_1)$ and $(x_2, y_2)$ is $\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$. Look for a familiar triple in the differences.

**Why it works.** The horizontal and vertical differences are the legs of a right triangle whose hypotenuse is the segment ([OpenStax Prealgebra 2e, §9.3](https://openstax.org/books/prealgebra-2e/pages/9-3-use-properties-of-angles-triangles-and-the-pythagorean-theorem)).

**Example.** From $(1, 2)$ to $(7, 10)$: differences $6$ and $8$, a 3-4-5 triple doubled, so the distance is $10$.

**When it does not apply.** It is the straight-line distance in a flat plane, not a distance along streets or on a sphere.

### 88. Scale factors square for area and cube for volume

**The trick.** If every length is multiplied by $k$, areas are multiplied by $k^2$ and volumes by $k^3$.

**Why it works.** Similar figures have proportional sides ([OpenStax Prealgebra 2e, §9.3](https://openstax.org/books/prealgebra-2e/pages/9-3-use-properties-of-angles-triangles-and-the-pythagorean-theorem)). Area is a product of two lengths and volume a product of three.

**Example.** A 12-inch pizza versus an 8-inch pizza: $k = 1.5$, so the area ratio is $1.5^2 = 2.25$. Doubling every edge of a box multiplies its volume by 8.

**When it does not apply.** The shapes must be similar (every length scaled by the same factor). Stretching only one dimension does not follow this rule.

### 89. Trapezoid area: average base times height

**The trick.** Area = average of the two parallel sides × height.

**Why it works.** $A = \tfrac{1}{2}h(b + B)$ ([OpenStax Prealgebra 2e, §9.4](https://openstax.org/books/prealgebra-2e/pages/9-4-use-properties-of-rectangles-triangles-and-trapezoids)), which is $\dfrac{b + B}{2} \times h$. Two copies of the trapezoid, one rotated, form a parallelogram with base $b + B$.

**Example.** Bases 6 and 10, height 4: $8 \times 4 = 32$.

**When it does not apply.** The height is the perpendicular distance between the parallel sides, not a slanted side length.

### 90. Shoelace formula for a polygon's area from its corners

**The trick.** For vertices $(x_1, y_1), \dots, (x_n, y_n)$ listed in order around the shape,

$$
A = \frac{1}{2}\left|\sum_{i=1}^{n} \left(x_i y_{i+1} - x_{i+1} y_i\right)\right|
$$

where $(x_{n+1}, y_{n+1}) = (x_1, y_1)$.

**Why it works.** Each term is twice the signed area of the triangle formed by the origin and one edge. Adding them around the boundary cancels everything outside the polygon.

**Example.** Triangle $(0, 0), (4, 0), (1, 3)$: $(0 - 0) + (12 - 0) + (0 - 0) = 12$, so $A = 6$. Check: base 4, height 3, $\tfrac{1}{2} \times 4 \times 3 = 6$.

**When it does not apply.** The vertices must be in order around the boundary, and the polygon must not cross itself.

### 91. Count the diagonals of a polygon

**The trick.** An $n$-sided polygon has $\dfrac{n(n - 3)}{2}$ diagonals.

**Why it works.** Each vertex connects to $n - 3$ others by a diagonal (not itself or its two neighbours). That counts each diagonal twice, once from each end.

**Example.** An octagon has $\dfrac{8 \times 5}{2} = 20$ diagonals.

**When it does not apply.** It counts diagonals, not their intersections or the regions they create.

## Problem-solving strategies

These are heuristics in the sense Pólya used the word: suggestions that often help, not guarantees ([Princeton University Press](https://press.princeton.edu/books/paperback/9780691164076/how-to-solve-it)). Each one still gets a reason and a worked example.

### 92. Name the unknown before computing

**The trick.** Pólya's first phase is understanding the problem: state what is unknown, what is given, and what condition links them ([Wikipedia summary of *How to Solve It*](https://en.wikipedia.org/wiki/How_to_Solve_It)). Then write that condition as an equation.

**Why it works.** Many fast wrong answers come from computing with the given numbers before deciding what the answer represents.

**Example.** A bat and a ball cost \$1.10 together, and the bat costs \$1.00 more than the ball. Let the ball cost $b$. Then $b + (b + 1.00) = 1.10$, so $2b = 0.10$ and $b = 0.05$. The ball costs 5 cents, not 10.

**When it does not apply.** This is a habit, not a formula. It costs a few seconds on simple problems and saves the most on worded ones.

### 93. Draw a figure

**The trick.** Sketch the situation, label the known lengths and angles, and mark the unknown. "Draw a figure" is one of the heuristics in Pólya's dictionary ([Wikipedia summary](https://en.wikipedia.org/wiki/How_to_Solve_It)).

**Why it works.** A diagram can reveal a known structure, such as a right triangle, that the words hide.

**Example.** A 10 m ladder leans against a wall with its foot 6 m out. The sketch is a right triangle with hypotenuse 10 and leg 6, which is 3-4-5 doubled, so the ladder reaches 8 m up the wall.

**When it does not apply.** A sketch is not a proof. A carelessly drawn figure can suggest equal lengths or right angles that are not actually given.

### 94. Work backwards from the result

**The trick.** When the final state is known, reverse each step in the opposite order using inverse operations. Working backwards is one of Pólya's named heuristics ([Princeton University Press](https://press.princeton.edu/books/paperback/9780691164076/how-to-solve-it)).

**Why it works.** Each operation has an inverse, and undoing the steps in reverse order recovers the starting value.

**Example.** "I double a number, add 7 and get 31." Undo: $31 - 7 = 24$, then $24 \div 2 = 12$. Check: $2 \times 12 + 7 = 31$.

**When it does not apply.** Steps without a unique inverse block the method. If the step was "square it", working backwards gives two candidates.

### 95. Specialize: try small cases first

**The trick.** Solve the problem for small values, then look for the rule. Pólya lists specialization as a heuristic ([Wikipedia summary](https://en.wikipedia.org/wiki/How_to_Solve_It)).

**Why it works.** Small cases are easy to count directly and often reveal a structure you can then prove.

**Example.** How many handshakes when 10 people each shake hands once with everyone else? With 2, 3, 4 people: 1, 3, 6. Each of $n$ people shakes $n - 1$ hands, and each handshake is counted twice, giving $\dfrac{n(n - 1)}{2}$. For 10 people: $45$.

**When it does not apply.** A pattern from small cases must still be justified. Patterns can break later; the reasoning step is what makes the answer reliable.

### 96. Look for a repeating pattern

**The trick.** When a calculation repeats, find the cycle length and use the remainder.

**Why it works.** Last digits of powers depend only on the previous last digit, so they must eventually repeat.

**Example.** The last digit of $7^{2026}$: the last digits of $7^1, 7^2, 7^3, 7^4$ are 7, 9, 3, 1, then repeat. Since $2026 = 4 \times 506 + 2$, the last digit matches $7^2$, which is 9.

**When it does not apply.** You must confirm the cycle actually repeats, and line up the remainder correctly (a remainder of 0 corresponds to the 4th position, not the first).

### 97. Use symmetry

**The trick.** When a problem treats two quantities the same way, try the case where they are equal, then measure how far you are from it.

**Why it works.** For two numbers with a fixed sum $2m$, write them as $m + d$ and $m - d$. Their product is $m^2 - d^2$, which is largest when $d = 0$.

**Example.** Two numbers add to 20. Their product is at most $10 \times 10 = 100$; for example $12 \times 8 = 100 - 4 = 96$.

**When it does not apply.** Symmetry suggests where to look, not that the symmetric case is the answer. Check whether the problem's conditions are truly symmetric.

### 98. Assume one extreme, then adjust

**The trick.** For "two kinds of things" problems, assume everything is of one kind, then swap items one at a time to fix the total. This is systematic guess-and-check.

**Why it works.** Each swap changes the total by the same fixed amount, so the number of swaps is the shortfall divided by that amount. It is the same as solving a system of two linear equations.

**Example.** A farm has 20 animals (chickens and cows) with 56 legs. If all 20 were chickens there would be 40 legs. Each cow adds 2 legs, so there are $(56 - 40) \div 2 = 8$ cows and 12 chickens. Check: $12 \times 2 + 8 \times 4 = 56$.

**When it does not apply.** It works when each item contributes a fixed amount. With three or more kinds, you need more information.

### 99. Introduce an auxiliary variable

**The trick.** Replace a repeated expression with a new letter to turn an unfamiliar problem into a familiar one. Pólya calls this an auxiliary element or auxiliary problem ([Wikipedia summary](https://en.wikipedia.org/wiki/How_to_Solve_It)).

**Why it works.** The substitution does not change the solutions; it only changes how they look.

**Example.** $x^4 - 5x^2 + 4 = 0$. Let $u = x^2$: $u^2 - 5u + 4 = 0$, so $u = 1$ or $u = 4$. Then $x = \pm 1$ or $x = \pm 2$.

**When it does not apply.** Translate back at the end, and discard values that are impossible for the substitution. Here $u = x^2$ cannot be negative for real $x$.

### 100. Decompose and recombine

**The trick.** Break a hard shape or problem into easy pieces, solve each, and recombine. "Decomposing and recombining" is another of Pólya's heuristics ([Wikipedia summary](https://en.wikipedia.org/wiki/How_to_Solve_It)).

**Why it works.** Area is additive for non-overlapping pieces; more generally, a sum of independent parts can be found part by part.

**Example.** An L-shaped floor that is a $10 \times 6$ rectangle with a $4 \times 3$ corner removed has area $60 - 12 = 48$. Splitting it into a $10 \times 3$ and a $6 \times 3$ rectangle gives the same $30 + 18 = 48$.

**When it does not apply.** The pieces must not overlap or leave gaps. If they overlap, subtract the overlap once.

### 101. Look back

**The trick.** After finishing, check the answer, check the argument, and ask whether the method could solve related problems. This is the fourth phase of Pólya's method ([Princeton University Press](https://press.princeton.edu/books/paperback/9780691164076/how-to-solve-it)).

**Why it works.** Checks such as substitution, estimation (trick 61) or casting out nines (trick 42) catch errors cheaply. Asking "where else does this work?" is how individual tricks become a toolkit.

**Example.** For the equation in trick 80, substitute $x = 12$: $\tfrac{12}{3} + \tfrac{12}{4} = 4 + 3 = 7$. Correct. Looking back also shows that the "clear the denominators" step is the same idea used to compare fractions in trick 55.

**When it does not apply.** It always applies, but it takes time; under a strict time limit, prioritize a quick estimate or substitution check over a full review.

## Common mistakes

Most errors with shortcuts come from using a trick outside the conditions that make its algebra true. The most frequent ones:

- **Splitting a square over a sum.** $(a + b)^2 \ne a^2 + b^2$; the middle term $2ab$ is required (trick 66). Likewise, $\sqrt{a + b} \ne \sqrt{a} + \sqrt{b}$ (trick 27).
- **Adding percentages that should multiply.** Successive changes multiply (trick 48), and a reverse percentage needs division, not subtraction (trick 49). These two errors appear in teachers' lists of common misconceptions ([Mr Barton Maths](https://mrbartonmaths.com/percentage-increase-and-decrease-probing-questions/)).
- **Combining divisibility tests that share a factor.** Passing the tests for 4 and 6 does not prove divisibility by 24 (trick 36).
- **Trusting a passed check as proof.** Casting out nines misses swapped digits and extra zeros ([Wolfram MathWorld](https://mathworld.wolfram.com/CastingOutNines.html)). Pair it with an estimate.
- **Ignoring the carry.** Tricks 4, 10, 11 and 16 all produce two-digit pieces that can overflow into the next place.
- **Stretching a trick beyond its range.** Squaring near 50 or 100 is clean only within 9 of the base (tricks 18 and 19); the rule of 72 is only an approximation (trick 51).
- **Using one check value of 0 or 1.** These values hide many algebra errors (trick 66).

## Next steps

If you want to go from shortcuts to fluency, these articles build on the same foundations:

- [Math formulas every student should know](/articles/math-formulas-every-student-should-know): a reference for the identities used throughout this list.
- [Algebra problems with solutions for beginners](/articles/algebra-problems-with-solutions-for-beginners): practice tricks 71 to 81 on full worked problems.
- [Probability and statistics with real-world examples](/articles/probability-statistics-real-world-examples): estimation and percentage reasoning applied to data.
- [Linear algebra concepts for machine learning](/articles/linear-algebra-concepts-for-machine-learning): where scaling, distance and decomposition ideas lead next.
- [All Mathematics articles](/category/mathematics) on this site.

A practical approach: pick three or four tricks that match the arithmetic you do most often, practise them until they are automatic, and always finish with a quick check (tricks 42, 61 and 101).

## References

1. Marecek, L., Anthony-Smith, M., and Honeycutt Mathis, A. *Prealgebra 2e*. OpenStax, 2020. Sections [2.4 Find Multiples and Factors](https://openstax.org/books/prealgebra-2e/pages/2-4-find-multiples-and-factors), [6.1 Understand Percent](https://openstax.org/books/prealgebra-2e/pages/6-1-understand-percent), [9.3 Use Properties of Angles, Triangles, and the Pythagorean Theorem](https://openstax.org/books/prealgebra-2e/pages/9-3-use-properties-of-angles-triangles-and-the-pythagorean-theorem), [9.4 Use Properties of Rectangles, Triangles, and Trapezoids](https://openstax.org/books/prealgebra-2e/pages/9-4-use-properties-of-rectangles-triangles-and-trapezoids).
2. Abramson, J. *Algebra and Trigonometry 2e*. OpenStax, 2021. Sections [1.2 Exponents and Scientific Notation](https://openstax.org/books/algebra-and-trigonometry-2e/pages/1-2-exponents-and-scientific-notation), [1.4 Polynomials](https://openstax.org/books/algebra-and-trigonometry-2e/pages/1-4-polynomials), [1.5 Factoring Polynomials](https://openstax.org/books/algebra-and-trigonometry-2e/pages/1-5-factoring-polynomials), [2.5 Quadratic Equations](https://openstax.org/books/algebra-and-trigonometry-2e/pages/2-5-quadratic-equations), [13.4 Series and Their Notations](https://openstax.org/books/algebra-and-trigonometry-2e/pages/13-4-series-and-their-notations).
3. Pólya, G. *How to Solve It*. Princeton University Press, 1945; Princeton Science Library edition 2014. [Publisher's page](https://press.princeton.edu/books/paperback/9780691164076/how-to-solve-it).
4. "How to Solve It." *Wikipedia*. [en.wikipedia.org/wiki/How_to_Solve_It](https://en.wikipedia.org/wiki/How_to_Solve_It). Used as a secondary summary of the book's four phases and heuristics.
5. Weisstein, E. W. "Divisibility Tests." *MathWorld*, Wolfram Research. [mathworld.wolfram.com/DivisibilityTests.html](https://mathworld.wolfram.com/DivisibilityTests.html).
6. Weisstein, E. W. "Casting Out Nines." *MathWorld*, Wolfram Research. [mathworld.wolfram.com/CastingOutNines.html](https://mathworld.wolfram.com/CastingOutNines.html).
7. Bogomolny, A. "Divisibility by 7, 11, and 13." *Cut the Knot*. [cut-the-knot.org/blue/div7-11-13.shtml](https://www.cut-the-knot.org/blue/div7-11-13.shtml).
8. Cook, J. D. "Test for divisibility by 13." 10 November 2020. [johndcook.com](https://www.johndcook.com/blog/2020/11/10/test-for-divisibility-by-13/).
9. "Probing Questions: Percentage Increase and Decrease." *Mr Barton Maths*. [mrbartonmaths.com](https://mrbartonmaths.com/percentage-increase-and-decrease-probing-questions/). Teacher resource on common misconceptions.
10. "Does the human calculator stuff really work?" *Physics Forums*, thread started 5 December 2016. [physicsforums.com](https://www.physicsforums.com/threads/does-the-human-calculator-stuff-really-work.895965/). Community discussion, cited only for practitioners' opinions.
