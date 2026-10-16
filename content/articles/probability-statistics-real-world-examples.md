---
title: 100 Best Probability and Statistics Examples for Real-World Applications
seoTitle: 100 Probability and Statistics Examples From Real Life
description: 100 worked probability and statistics examples, from medical tests and A/B tests to polls and quality control, each solved step by step.
author: BlogAI Editors
authorType: Organization
publishedAt: 2026-10-16
updatedAt: 2026-10-16
status: published
categories:
  - Mathematics
tags: [mathematics, probability, statistics, data science, big data]
tocDepth: 2
---

Probability and statistics are easiest to learn when every formula is attached to a decision someone actually has to make: should a patient worry about a positive test, did a website change really lift sales, how many people does a survey need? This article collects 100 short, fully worked examples arranged from basic probability to the paradoxes that catch out experienced analysts.

Each example follows the same pattern: the **scenario**, the **concept** it uses, the **computation** step by step, and a one-line **interpretation**. Unless a figure is explicitly cited, the numbers are **illustrative**: they were chosen to make the arithmetic clear, not taken from real studies. The only real data set used here is the 1973 Berkeley admissions data in example 96. Every result was recomputed with Python (NumPy and SciPy) before publication.

Formulas and conventions follow standard references, mainly OpenStax *[Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)* and the NIST/SEMATECH *[e-Handbook of Statistical Methods](https://www.itl.nist.gov/div898/handbook/)*.

## Basic probability

These examples use the classical definition of probability (favorable outcomes divided by equally likely outcomes), the complement rule, and counting.

### 1. Rolling a six in a board game

**Scenario:** A board game lets you leave the starting square only on a six. **Concept:** Equally likely outcomes.

$$
P(6) = \frac{\text{favorable outcomes}}{\text{possible outcomes}} = \frac{1}{6} \approx 0.167
$$

**Interpretation:** On average, one turn in six lets you start moving.

### 2. Rolling a total of seven with two dice

**Scenario:** Many dice games pay out on a total of seven. **Concept:** Counting outcomes in a sample space of $6 \times 6 = 36$ ordered pairs.

The pairs that sum to 7 are (1,6), (2,5), (3,4), (4,3), (5,2), (6,1):

$$
P(\text{sum} = 7) = \frac{6}{36} = \frac{1}{6} \approx 0.167
$$

**Interpretation:** Seven is the most likely total because more pairs produce it than any other sum.

### 3. Drawing a heart or a king

**Scenario:** A magician asks you to draw a card that is either a heart or a king. **Concept:** Addition rule for overlapping events.

$$
P(H \cup K) = P(H) + P(K) - P(H \cap K) = \frac{13}{52} + \frac{4}{52} - \frac{1}{52} = \frac{16}{52} \approx 0.308
$$

**Interpretation:** Subtract the king of hearts once, or it is counted twice.

### 4. At least one six in four rolls

**Scenario:** A classic gambling bet: will at least one six appear in four rolls of a die? **Concept:** Complement rule, $P(\text{at least one}) = 1 - P(\text{none})$.

$$
1 - \left(\frac{5}{6}\right)^4 = 1 - 0.4823 = 0.5177
$$

By contrast, getting at least one double six in 24 rolls of two dice has probability $1 - (35/36)^{24} \approx 0.4914$.

**Interpretation:** The first bet is slightly favorable and the second slightly unfavorable, even though both "feel" similar.

### 5. Guessing a four-digit PIN

**Scenario:** A phone locks after three wrong PIN attempts. Suppose the PIN was chosen uniformly at random. **Concept:** Equally likely outcomes without repetition of guesses.

$$
P(\text{success in 3 guesses}) = \frac{3}{10\,000} = 0.0003
$$

**Interpretation:** Lockouts keep random guessing nearly hopeless; real PINs are not uniform, which is why common PINs are riskier.

### 6. The birthday problem in a meeting room

**Scenario:** What is the chance that at least two of 23 colleagues share a birthday? Assume 365 equally likely birthdays and ignore leap years. **Concept:** Complement rule with a product of probabilities.

$$
P(\text{no match}) = \frac{365}{365} \cdot \frac{364}{365} \cdots \frac{343}{365} \approx 0.4927
$$

$$
P(\text{at least one match}) = 1 - 0.4927 \approx 0.5073
$$

With 50 people the probability rises to about 0.9704.

**Interpretation:** Coincidences are far more common than intuition suggests because the number of *pairs* grows quickly.

### 7. Winning a 6-of-49 lottery

**Scenario:** A lottery draws 6 numbers from 49, and order does not matter. **Concept:** Combinations.

$$
\binom{49}{6} = \frac{49!}{6!\,43!} = 13\,983\,816
$$

**Interpretation:** One ticket has a 1 in 13,983,816 chance of matching all six numbers.

### 8. Redundant servers

**Scenario:** A website runs on two servers. Suppose each is down 1% of the time, independently. The site fails only if both are down. **Concept:** Multiplication rule for independent events.

$$
P(\text{both down}) = 0.01 \times 0.01 = 0.0001, \qquad P(\text{site up}) = 0.9999
$$

**Interpretation:** Redundancy works only if failures are truly independent; a shared power supply would break this calculation.

### 9. Components in series

**Scenario:** A device needs three parts to work, each with an assumed reliability of 0.98, failing independently. **Concept:** Series reliability is a product.

$$
R = 0.98^3 = 0.941192
$$

**Interpretation:** Chaining parts erodes reliability: three good parts give a system that fails almost 6% of the time.

### 10. Counting license plates

**Scenario:** A plate format uses three letters followed by three digits. **Concept:** Fundamental counting principle.

$$
26^3 \times 10^3 = 17\,576 \times 1000 = 17\,576\,000
$$

**Interpretation:** The format supports about 17.6 million distinct plates.

### 11. Podium finishes in a race

**Scenario:** Eight runners compete; how many different gold–silver–bronze outcomes are possible? **Concept:** Permutations (order matters).

$$
P(8, 3) = 8 \times 7 \times 6 = 336
$$

**Interpretation:** A prediction of the exact podium has a 1 in 336 chance if all orders were equally likely.

### 12. Coffee and tea drinkers in a survey

**Scenario:** Suppose 60% of employees drink coffee, 30% drink tea, and 20% drink both. **Concept:** Addition rule.

$$
P(C \cup T) = 0.60 + 0.30 - 0.20 = 0.70, \qquad P(\text{neither}) = 0.30
$$

**Interpretation:** A break room stocking both drinks covers 70% of staff.

## Conditional probability and Bayes' theorem

Conditional probability $P(A \mid B)$ is the probability of $A$ once you know $B$ happened. Bayes' theorem reverses the condition:

$$
P(A \mid B) = \frac{P(B \mid A)\,P(A)}{P(B)}
$$

### 13. A positive medical screening test

**Scenario:** Suppose a condition affects 1% of people, a test is 95% sensitive (detects 95% of true cases) and 90% specific (correctly clears 90% of healthy people). A person tests positive. **Concept:** Bayes' theorem and base rates.

Think of 10,000 people: 100 have the condition and 95 of them test positive; 9,900 do not, and 10% of them, 990, also test positive.

$$
P(\text{condition} \mid +) = \frac{95}{95 + 990} = \frac{95}{1085} \approx 0.0876
$$

**Interpretation:** With a rare condition, most positives are false positives; a positive result means "investigate further," not "diagnosed."

### 14. A second positive test

**Scenario:** The same person takes the test again and is positive again. Assume the two results are independent given the true status (real repeat tests often are not). **Concept:** Sequential Bayesian updating; yesterday's posterior is today's prior.

$$
P = \frac{0.0876 \times 0.95}{0.0876 \times 0.95 + 0.9124 \times 0.10} = \frac{0.0832}{0.0832 + 0.0912} \approx 0.477
$$

**Interpretation:** Two positives raise the probability from about 9% to about 48%, which is why confirmatory testing matters.

### 15. A spam filter and the word "free"

**Scenario:** Suppose 40% of email is spam, the word "free" appears in 25% of spam and 2% of legitimate mail. **Concept:** Bayes' theorem for classification.

$$
P(\text{spam} \mid \text{free}) = \frac{0.40 \times 0.25}{0.40 \times 0.25 + 0.60 \times 0.02} = \frac{0.100}{0.112} \approx 0.893
$$

**Interpretation:** One word moves the spam probability from 40% to about 89%; real filters combine many such clues.

### 16. Workplace drug testing

**Scenario:** Suppose 5% of applicants use a substance, and the test is 99% sensitive and 98% specific. **Concept:** Positive predictive value.

$$
P(\text{user} \mid +) = \frac{0.05 \times 0.99}{0.05 \times 0.99 + 0.95 \times 0.02} = \frac{0.0495}{0.0685} \approx 0.723
$$

**Interpretation:** Even an excellent test leaves about 28% of positives as false alarms at this base rate.

### 17. Product returns from a contingency table

**Scenario:** An online store sold 1,000 orders: 200 shoe orders (50 returned) and 800 other orders (40 returned). **Concept:** Conditional probability from counts, and why the order of conditioning matters.

$$
P(\text{return} \mid \text{shoes}) = \frac{50}{200} = 0.25, \qquad P(\text{shoes} \mid \text{return}) = \frac{50}{90} \approx 0.556
$$

**Interpretation:** A quarter of shoe orders come back, but more than half of all returns are shoes. These answer different questions.

### 18. The Monty Hall game show

**Scenario:** A prize is behind one of three doors. You pick one; the host, who knows where the prize is, always opens a different, empty door and offers a switch. **Concept:** Conditional probability with an informed host.

Your first pick is right with probability $1/3$. The host never reveals the prize, so switching wins whenever your first pick was wrong:

$$
P(\text{win by switching}) = 1 - \frac{1}{3} = \frac{2}{3}
$$

**Interpretation:** Switching doubles your chances, but only because the host's choice is constrained by knowledge.

### 19. Which factory made the defective part?

**Scenario:** Factory A makes 60% of parts with a 2% defect rate; factory B makes 40% with a 5% defect rate (illustrative). **Concept:** Law of total probability, then Bayes.

$$
P(D) = 0.60 \times 0.02 + 0.40 \times 0.05 = 0.012 + 0.020 = 0.032
$$

$$
P(A \mid D) = \frac{0.012}{0.032} = 0.375
$$

**Interpretation:** Although A makes most parts, a defective part is more likely (62.5%) to come from B.

### 20. Rain and a late commute

**Scenario:** Suppose it rains on 30% of days; you are late 40% of the time when it rains and 10% when it is dry. **Concept:** Total probability and reverse conditioning.

$$
P(L) = 0.3 \times 0.4 + 0.7 \times 0.1 = 0.19, \qquad P(\text{rain} \mid L) = \frac{0.12}{0.19} \approx 0.632
$$

**Interpretation:** If you were late, it probably rained, even though most days are dry.

### 21. Is device type independent of buying?

**Scenario:** Of 1,000 visitors, 400 used mobile (60 bought) and 600 used desktop (90 bought). **Concept:** Independence means $P(A \mid B) = P(A)$.

$$
P(\text{buy}) = \frac{150}{1000} = 0.15, \quad P(\text{buy} \mid \text{mobile}) = \frac{60}{400} = 0.15, \quad P(\text{buy} \mid \text{desktop}) = \frac{90}{600} = 0.15
$$

**Interpretation:** In this sample, device type tells you nothing about whether someone buys.

### 22. Credit card fraud alerts

**Scenario:** Suppose 0.1% of transactions are fraudulent, and a detector flags 99% of fraud and 1% of legitimate transactions. **Concept:** Base rates in rare-event detection.

$$
P(\text{fraud} \mid \text{flag}) = \frac{0.001 \times 0.99}{0.001 \times 0.99 + 0.999 \times 0.01} = \frac{0.00099}{0.01098} \approx 0.090
$$

**Interpretation:** About nine in ten alerts are false; fraud teams need a cheap second check, not automatic blocking.

### 23. The prosecutor's fallacy

**Scenario:** Suppose a forensic trait matches by chance with probability 1 in 1,000,000, and the crime occurred in a city of 5,000,000 people. A suspect matches and there is no other evidence. **Concept:** Confusing $P(\text{match} \mid \text{innocent})$ with $P(\text{innocent} \mid \text{match})$.

Expected innocent matches: $4\,999\,999 \times 10^{-6} \approx 5$. With one true culprit also matching:

$$
P(\text{guilty} \mid \text{match}) \approx \frac{1}{1 + 5} \approx 0.167
$$

**Interpretation:** "One in a million" does not mean "a million to one guilty"; in a large population, chance matches add up.

### 24. The two-child puzzle

**Scenario:** A family has two children and at least one is a boy. What is the chance both are boys? Assume each child is equally likely to be a boy or a girl, independently. **Concept:** Conditioning shrinks the sample space.

Equally likely families: BB, BG, GB, GG. Knowing "at least one boy" removes GG:

$$
P(BB \mid \text{at least one B}) = \frac{1}{3}
$$

**Interpretation:** The exact wording of what you know changes the answer; this is a common source of disagreement.

## Discrete probability distributions

A [binomial experiment](https://openstax.org/books/introductory-statistics-2e/pages/4-3-binomial-distribution) has a fixed number of independent trials, each with the same success probability $p$. Its mean is $np$ and its standard deviation is $\sqrt{np(1-p)}$.

### 25. Free throws in basketball

**Scenario:** A player makes 70% of free throws (assumed constant and independent). What is the chance of exactly 7 makes in 10 attempts? **Concept:** Binomial probability.

$$
P(X = 7) = \binom{10}{7}(0.7)^7(0.3)^3 = 120 \times 0.08235 \times 0.027 \approx 0.267
$$

**Interpretation:** Even the most likely outcome happens only about a quarter of the time.

### 26. Finding at least one defect in a sample

**Scenario:** Suppose 2% of items are defective. An inspector checks 50. **Concept:** Binomial complement.

$$
P(X \ge 1) = 1 - 0.98^{50} = 1 - 0.3642 \approx 0.636
$$

**Interpretation:** A sample of 50 misses a 2% defect problem more than a third of the time.

### 27. Guessing on a multiple-choice quiz

**Scenario:** A student guesses all 10 questions, each with 4 options. The pass mark is 6. **Concept:** Binomial upper tail.

$$
P(X \ge 6) = \sum_{k=6}^{10} \binom{10}{k}(0.25)^k(0.75)^{10-k} \approx 0.0197
$$

**Interpretation:** Pure guessing passes about 2% of the time.

### 28. Email campaign clicks

**Scenario:** An email goes to 1,000 subscribers; suppose each clicks with probability 3%. **Concept:** Binomial mean and standard deviation.

$$
\mu = np = 30, \qquad \sigma = \sqrt{1000 \times 0.03 \times 0.97} \approx 5.39
$$

**Interpretation:** Between roughly 19 and 41 clicks (two standard deviations) would be unremarkable.

### 29. Calls to a help desk

**Scenario:** Suppose a help desk receives an average of 3 calls per 10 minutes, arriving randomly. **Concept:** Poisson distribution, $P(X=k) = e^{-\lambda}\lambda^k / k!$.

$$
P(X = 5) = \frac{e^{-3} 3^5}{5!} = \frac{0.04979 \times 243}{120} \approx 0.101, \qquad P(X = 0) = e^{-3} \approx 0.050
$$

**Interpretation:** A quiet 10-minute stretch happens about 5% of the time.

### 30. Server errors in a day

**Scenario:** Suppose a service logs 2 critical errors per day on average. Is a day with 5 or more unusual? **Concept:** Poisson upper tail.

$$
P(X \ge 5) = 1 - \sum_{k=0}^{4} \frac{e^{-2}2^k}{k!} = 1 - 0.9473 \approx 0.053
$$

**Interpretation:** About one day in 19 would have 5 or more errors by chance alone, so a single bad day is weak evidence of a new bug.

### 31. Typos in a document

**Scenario:** Suppose each word has a 1 in 500 chance of a typo, and a document has 1,000 words. **Concept:** Poisson approximation to the binomial with $\lambda = np = 2$.

$$
\text{Binomial: } (0.998)^{1000} \approx 0.13507, \qquad \text{Poisson: } e^{-2} \approx 0.13534
$$

**Interpretation:** For many rare, independent chances, the Poisson shortcut is almost exact; a typo-free document is about a 13.5% outcome.

### 32. Sales calls until the first sale

**Scenario:** Suppose each sales call succeeds with probability 0.2. **Concept:** Geometric distribution.

$$
E[\text{calls}] = \frac{1}{p} = 5, \qquad P(\text{first sale on call 3}) = 0.8^2 \times 0.2 = 0.128
$$

**Interpretation:** Plan on about five calls per sale, with plenty of variation.

### 33. Waiting for the third sale

**Scenario:** Same salesperson; what is the chance the third sale comes on exactly the 10th call? **Concept:** Negative binomial distribution.

$$
P = \binom{9}{2}(0.2)^3(0.8)^7 = 36 \times 0.008 \times 0.2097 \approx 0.060
$$

**Interpretation:** The first nine calls must contain exactly two sales, then call 10 must succeed.

### 34. Acceptance sampling from a small lot

**Scenario:** A lot of 50 items contains 5 defectives. An inspector draws 10 without replacement. **Concept:** Hypergeometric distribution.

$$
P(\text{no defectives}) = \frac{\binom{45}{10}}{\binom{50}{10}} \approx 0.311
$$

**Interpretation:** A lot that is 10% defective passes a zero-defect inspection of 10 items about 31% of the time.

### 35. Matching exactly three lottery numbers

**Scenario:** In the 6-of-49 lottery, what is the chance of matching exactly 3? **Concept:** Hypergeometric counting.

$$
P = \frac{\binom{6}{3}\binom{43}{3}}{\binom{49}{6}} = \frac{20 \times 12\,341}{13\,983\,816} = \frac{246\,820}{13\,983\,816} \approx 0.0177
$$

**Interpretation:** Roughly 1 ticket in 57 matches exactly three numbers.

### 36. Collecting all six stickers

**Scenario:** Cereal boxes contain one of 6 stickers, equally likely. How many boxes until you have all six? **Concept:** Coupon collector problem, $E = n\left(1 + \tfrac{1}{2} + \cdots + \tfrac{1}{n}\right)$.

$$
E = 6\left(1 + \frac{1}{2} + \frac{1}{3} + \frac{1}{4} + \frac{1}{5} + \frac{1}{6}\right) = 6 \times 2.45 = 14.7
$$

**Interpretation:** The last sticker is the slow one: once you have five, you need six more boxes on average.

## The normal distribution

The normal distribution has the familiar bell shape, with mean $\mu$ and standard deviation $\sigma$ ([NIST section 1.3.6.6.1](https://www.itl.nist.gov/div898/handbook/eda/section3/eda3661.htm)). A z-score, $z = (x - \mu)/\sigma$, counts how many standard deviations a value lies from the mean, and the [empirical rule](https://openstax.org/books/introductory-statistics-2e/pages/6-1-the-standard-normal-distribution) says about 68%, 95% and 99.7% of values fall within 1, 2 and 3 standard deviations. Below, $\Phi$ is the standard normal cumulative probability.

### 37. How tall is unusually tall?

**Scenario:** Suppose adult heights in a group are normal with mean 170 cm and standard deviation 7 cm. Where does 185 cm fall? **Concept:** z-score and percentile.

$$
z = \frac{185 - 170}{7} \approx 2.14, \qquad \Phi(2.14) \approx 0.984
$$

**Interpretation:** A 185 cm person is taller than about 98.4% of this group.

### 38. Reading a standardized score

**Scenario:** A test is scaled to mean 100 and standard deviation 15. **Concept:** Empirical rule.

$$
100 \pm 15 = [85, 115] \;(\approx 68\%), \qquad 100 \pm 30 = [70, 130] \;(\approx 95\%)
$$

**Interpretation:** A score of 130 is at the edge of the middle 95%, so it is uncommon but not extraordinary.

### 39. Bolts within tolerance

**Scenario:** Suppose bolt diameters are normal with mean 10.00 mm and standard deviation 0.02 mm, and the specification is 9.96 to 10.04 mm. **Concept:** Probability between two z-scores.

$$
z = \pm\frac{0.04}{0.02} = \pm 2, \qquad P(-2 < Z < 2) \approx 0.9545
$$

**Interpretation:** About 4.55% of bolts would be out of spec, too many for most production lines.

### 40. Process capability in manufacturing

**Scenario:** Suppose a shaft must be 10.00 ± 0.05 mm and the process standard deviation is 0.01 mm. **Concept:** Capability indices $C_p$ and $C_{pk}$ ([NIST section 6.1.6](https://www.itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm)).

$$
C_p = \frac{\text{USL} - \text{LSL}}{6\sigma} = \frac{0.10}{0.06} \approx 1.67
$$

If the process mean drifts to 10.02 mm:

$$
C_{pk} = \min\left(\frac{10.05 - 10.02}{0.03}, \frac{10.02 - 9.95}{0.03}\right) = \min(1.00, 2.33) = 1.00
$$

**Interpretation:** The process is precise enough, but an off-center mean wastes much of that margin.

### 41. Setting a cutoff for the top 10%

**Scenario:** Exam scores are assumed normal with mean 70 and standard deviation 10. What score marks the top 10%? **Concept:** Inverse normal (percentile to value).

$$
z_{0.90} \approx 1.2816, \qquad x = 70 + 1.2816 \times 10 \approx 82.8
$$

**Interpretation:** A score of about 83 or higher places a student in the top tenth.

### 42. Late food deliveries

**Scenario:** Suppose delivery times are normal with mean 30 minutes and standard deviation 5. A guarantee promises delivery within 40 minutes. **Concept:** Upper-tail probability.

$$
z = \frac{40 - 30}{5} = 2, \qquad P(Z > 2) \approx 0.0228
$$

**Interpretation:** About 2.3% of orders would break the guarantee.

### 43. Is a coin biased after 1,000 flips?

**Scenario:** A fair coin is flipped 1,000 times. How likely is 530 or more heads? **Concept:** Normal approximation to the binomial with continuity correction.

$$
\mu = 500, \quad \sigma = \sqrt{1000 \times 0.5 \times 0.5} \approx 15.81, \quad z = \frac{529.5 - 500}{15.81} \approx 1.866
$$

$$
P(Z > 1.866) \approx 0.0310 \quad (\text{exact binomial: } 0.0310)
$$

**Interpretation:** 530 heads would happen about 3% of the time with a fair coin, suspicious but not proof.

### 44. Total time for a two-step task

**Scenario:** Step A takes a normally distributed time with mean 20 and SD 4 minutes; step B mean 30 and SD 3, independently. **Concept:** Sums of independent normals; variances add.

$$
\mu = 50, \qquad \sigma = \sqrt{4^2 + 3^2} = 5, \qquad P(T > 55) = P(Z > 1) \approx 0.159
$$

**Interpretation:** Standard deviations do not add (4 + 3 = 7 is wrong); variances do.

### 45. Comparing scores on two different tests

**Scenario:** Ana scores 650 on a test with mean 500 and SD 100; Ben scores 28 on a test with mean 21 and SD 5. **Concept:** Standardizing puts different scales on one ruler.

$$
z_{\text{Ana}} = \frac{650 - 500}{100} = 1.5, \qquad z_{\text{Ben}} = \frac{28 - 21}{5} = 1.4
$$

**Interpretation:** Ana did slightly better relative to her test-takers.

### 46. Airline overbooking

**Scenario:** A flight has 200 seats and sells 210 tickets. Suppose each passenger shows up independently with probability 0.94. **Concept:** Binomial tail, checked with a normal approximation.

$$
\mu = 210 \times 0.94 = 197.4, \qquad \sigma = \sqrt{210 \times 0.94 \times 0.06} \approx 3.44
$$

$$
P(X \ge 201) \approx P\!\left(Z > \frac{200.5 - 197.4}{3.44}\right) = P(Z > 0.90) \approx 0.184 \quad (\text{exact: } 0.186)
$$

**Interpretation:** Under these assumptions, about 1 flight in 5 would have more passengers than seats.

## Expectation and variance

The expected value $E[X] = \sum x \, P(x)$ is the long-run average; variance measures spread around it.

### 47. Is a raffle ticket worth it?

**Scenario:** A charity sells 1,000 tickets at \$5 each for a single \$2,000 prize. **Concept:** Expected value of a gamble.

$$
E[\text{net}] = 0.001 \times 1995 + 0.999 \times (-5) = 1.995 - 4.995 = -3
$$

**Interpretation:** Each ticket loses \$3 on average; the buyer is effectively donating.

### 48. Pricing an insurance policy

**Scenario:** Suppose a policy pays \$20,000 with probability 1% per year. **Concept:** Expected payout as the break-even premium.

$$
E[\text{payout}] = 0.01 \times 20\,000 = 200
$$

**Interpretation:** A premium of \$250 would leave the insurer an expected \$50 per policy to cover costs and risk.

### 49. A bet on red in American roulette

**Scenario:** An American wheel has 38 pockets, 18 red. A \$1 bet on red pays \$1. **Concept:** Expected value and house edge.

$$
E = \frac{18}{38}(1) + \frac{20}{38}(-1) = -\frac{2}{38} \approx -0.0526
$$

**Interpretation:** The player loses about 5.3 cents per dollar bet in the long run.

### 50. Extended warranty

**Scenario:** A two-year warranty costs \$150. Suppose the chance of needing a \$600 repair in that time is 10%. **Concept:** Comparing expected cost with price.

$$
E[\text{repair cost}] = 0.10 \times 600 = 60 < 150
$$

**Interpretation:** On average the warranty costs more than it saves; it buys peace of mind, not expected value.

### 51. Risk of a two-asset mix

**Scenario:** An illustrative portfolio holds 60% in asset A (SD 20%) and 40% in asset B (SD 10%), with correlation 0.3. This is a calculation exercise, not investment advice. **Concept:** Variance of a weighted sum.

$$
\sigma_p^2 = 0.6^2(0.2)^2 + 0.4^2(0.1)^2 + 2(0.6)(0.4)(0.2)(0.1)(0.3) = 0.0144 + 0.0016 + 0.00288 = 0.01888
$$

$$
\sigma_p = \sqrt{0.01888} \approx 13.7\%
$$

**Interpretation:** The mix is less volatile than the weighted average of SDs (16%) because the assets do not move perfectly together.

### 52. Uncertainty in a project schedule

**Scenario:** Three independent tasks have duration SDs of 2, 3 and 6 days. **Concept:** Variances of independent variables add.

$$
\sigma_{\text{total}} = \sqrt{2^2 + 3^2 + 6^2} = \sqrt{49} = 7 \text{ days}
$$

**Interpretation:** The total uncertainty is dominated by the most uncertain task.

### 53. Mixed-up coats at a party

**Scenario:** $n$ guests' coats are returned at random. How many guests expect to get their own coat? **Concept:** Linearity of expectation with indicator variables.

Each guest gets their own coat with probability $1/n$, so

$$
E[\text{matches}] = n \times \frac{1}{n} = 1
$$

**Interpretation:** Whether there are 5 guests or 500, the expected number of correct returns is one.

### 54. Restaurant no-shows

**Scenario:** A restaurant has 80 reservations; suppose each no-shows independently with probability 0.10. **Concept:** Binomial expectation and spread.

$$
E = 80 \times 0.10 = 8, \qquad \sigma = \sqrt{80 \times 0.1 \times 0.9} \approx 2.68
$$

**Interpretation:** Expect about 8 empty tables' worth of guests, give or take 3.

### 55. The casino's long-run take

**Scenario:** Players wager a total of \$1,000,000 on red at American roulette. **Concept:** Law of large numbers applied to the house edge from example 49.

$$
E[\text{casino win}] = \frac{2}{38} \times 1\,000\,000 \approx 52\,632
$$

**Interpretation:** Individual sessions vary wildly, but across huge volumes the result settles near the expected value.

### 56. Waiting for a bus

**Scenario:** A bus comes every 10 minutes and you arrive at a random time. **Concept:** Continuous uniform distribution on $[0, 10]$.

$$
E[W] = \frac{0 + 10}{2} = 5, \qquad \sigma = \frac{10}{\sqrt{12}} \approx 2.89
$$

**Interpretation:** You wait 5 minutes on average, and waits under 2 minutes or over 8 are each a 20% chance.

### 57. Time between customer arrivals

**Scenario:** Suppose customers arrive randomly, on average every 4 minutes. What is the chance of a gap longer than 10 minutes? **Concept:** Exponential distribution, $P(T > t) = e^{-t/\mu}$.

$$
P(T > 10) = e^{-10/4} = e^{-2.5} \approx 0.082
$$

**Interpretation:** About 8% of gaps exceed 10 minutes, and the exponential is memoryless: having waited 5 minutes does not make an arrival "due."

## Descriptive statistics

Descriptive statistics summarize data: where its center is, how spread out it is, and what shape it has.

### 58. Mean versus median salary

**Scenario:** A small firm's ten annual salaries, in thousands of dollars, are 42, 45, 48, 50, 52, 55, 58, 60, 65 and 400. **Concept:** Sensitivity of the mean to outliers.

$$
\bar{x} = \frac{875}{10} = 87.5, \qquad \text{median} = \frac{52 + 55}{2} = 53.5
$$

**Interpretation:** The mean suggests a typical salary of \$87,500, but nine of ten employees earn \$65,000 or less; the median describes them better.

### 59. Which shoe size to stock most

**Scenario:** A store's last 12 sales were sizes 8, 9, 9, 10, 9, 7, 11, 9, 8, 10, 9, 8. **Concept:** Mode.

Size 9 appears five times, more than any other size, so the mode is 9.

**Interpretation:** For stocking decisions on categories, the mode answers "what is most common" directly.

### 60. Day-to-day temperature variation

**Scenario:** Five daily highs (°C) were 18, 21, 23, 19, 24. **Concept:** Sample standard deviation.

$$
\bar{x} = 21, \qquad s^2 = \frac{(-3)^2 + 0^2 + 2^2 + (-2)^2 + 3^2}{5 - 1} = \frac{26}{4} = 6.5, \qquad s \approx 2.55
$$

**Interpretation:** A typical day differs from the average by about 2.5 °C. Dividing by $n - 1$ corrects for using the sample mean.

### 61. Spread of delivery times

**Scenario:** Eleven delivery times (minutes) were 12, 14, 15, 15, 17, 18, 19, 21, 22, 25, 41. **Concept:** Quartiles and interquartile range (IQR).

Using the median of each half (excluding the overall median of 18):

$$
Q_1 = 15, \qquad Q_3 = 22, \qquad \text{IQR} = 22 - 15 = 7
$$

**Interpretation:** The middle half of deliveries spans 7 minutes. Software may give slightly different quartiles because several quartile conventions exist.

### 62. Flagging an outlier

**Scenario:** Same delivery data. **Concept:** The 1.5 × IQR fence rule used in box plots.

$$
\text{upper fence} = 22 + 1.5 \times 7 = 32.5, \qquad \text{lower fence} = 15 - 1.5 \times 7 = 4.5
$$

**Interpretation:** The 41-minute delivery is flagged for review; an outlier is a question, not automatically an error.

### 63. Comparing variability on different scales

**Scenario:** Machine A fills 500 g bags with SD 5 g; machine B fills 50 g bags with SD 1 g. **Concept:** Coefficient of variation, $CV = s / \bar{x}$.

$$
CV_A = \frac{5}{500} = 1\%, \qquad CV_B = \frac{1}{50} = 2\%
$$

**Interpretation:** B has the smaller SD but is relatively twice as variable.

### 64. Weighted course grade

**Scenario:** Homework counts 20% (score 90), the midterm 30% (75) and the final 50% (82). **Concept:** Weighted mean.

$$
0.2(90) + 0.3(75) + 0.5(82) = 18 + 22.5 + 41 = 81.5
$$

**Interpretation:** The final exam's weight pulls the grade toward 82.

### 65. Average growth rate

**Scenario:** An investment gains 50% one year and loses 50% the next. **Concept:** Geometric mean for growth rates.

$$
1.5 \times 0.5 = 0.75, \qquad \sqrt{0.75} \approx 0.866 \;\Rightarrow\; -13.4\% \text{ per year}
$$

**Interpretation:** The arithmetic average return is 0%, yet the money shrank by 25%; compounding needs the geometric mean.

### 66. Average speed on a round trip

**Scenario:** You drive to a town at 60 km/h and return the same distance at 40 km/h. **Concept:** Harmonic mean for rates over equal distances.

$$
\bar{v} = \frac{2}{\frac{1}{60} + \frac{1}{40}} = 48 \text{ km/h}
$$

**Interpretation:** The answer is not 50, because you spend more time at the slower speed.

### 67. Smoothing daily sales

**Scenario:** Daily sales were 120, 135, 128, 150, 160, 145. **Concept:** Three-day moving average.

$$
\frac{120 + 135 + 128}{3} \approx 127.7, \quad \frac{135 + 128 + 150}{3} \approx 137.7, \quad \frac{128 + 150 + 160}{3} = 146, \quad \frac{150 + 160 + 145}{3} \approx 151.7
$$

**Interpretation:** The smoothed series shows a steady upward trend that day-to-day noise partly hides.

### 68. A guarantee that works for any distribution

**Scenario:** Wait times have mean 10 minutes and SD 2, but the shape is unknown. **Concept:** Chebyshev's inequality, at least $1 - 1/k^2$ of values lie within $k$ SDs.

$$
k = 2: \; 1 - \frac{1}{4} = 75\% \text{ within } [6, 14], \qquad k = 3: \; 1 - \frac{1}{9} \approx 88.9\%
$$

**Interpretation:** Without assuming normality you still get a guaranteed (if conservative) bound.

## Sampling and confidence intervals

The [standard error of the mean](https://openstax.org/books/introductory-statistics-2e/pages/7-1-the-central-limit-theorem-for-sample-means-averages), $\sigma/\sqrt{n}$, measures how much sample means vary from sample to sample. A 95% confidence interval comes from a procedure that captures the true value in about 95% of repeated samples; any single interval either contains it or does not ([NIST section 1.3.5.2](https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm)).

### 69. Standard error of light bulb lifetimes

**Scenario:** A sample of 100 bulbs has SD 120 hours. **Concept:** Standard error.

$$
SE = \frac{s}{\sqrt{n}} = \frac{120}{\sqrt{100}} = 12 \text{ hours}
$$

**Interpretation:** Individual bulbs vary by about 120 hours, but the sample average is uncertain by only about 12.

### 70. Confidence interval for average screen time

**Scenario:** A sample of 25 people reports a mean of 4.2 hours of daily screen time with SD 0.8. **Concept:** t-interval, $\bar{x} \pm t_{0.975,\,n-1}\, s/\sqrt{n}$.

$$
t_{0.975,\,24} \approx 2.064, \qquad 2.064 \times \frac{0.8}{\sqrt{25}} \approx 0.330
$$

$$
4.2 \pm 0.33 = [3.87, \; 4.53]
$$

**Interpretation:** The data are consistent with a population average between about 3.9 and 4.5 hours.

### 71. Margin of error in an election poll

**Scenario:** A random sample of 1,000 voters shows 52% support for a candidate. **Concept:** Confidence interval for a proportion.

$$
SE = \sqrt{\frac{0.52 \times 0.48}{1000}} \approx 0.0158, \qquad 1.96 \times 0.0158 \approx 0.031
$$

$$
0.52 \pm 0.031 = [0.489, \; 0.551]
$$

**Interpretation:** The interval includes values below 50%, so the poll alone cannot say the candidate leads.

### 72. How many people to survey

**Scenario:** A pollster wants a ±3 percentage point margin at 95% confidence. **Concept:** Sample size for a proportion, using the worst case $p = 0.5$.

$$
n = \frac{1.96^2 \times 0.5 \times 0.5}{0.03^2} \approx 1067.1 \;\Rightarrow\; 1068
$$

**Interpretation:** Roughly a thousand respondents buys a ±3 point margin for a simple random sample; always round up.

### 73. Sample size for a mean

**Scenario:** Suppose blood pressure readings have SD 15 mmHg and a study wants the mean within ±2 mmHg at 95% confidence. **Concept:** $n = (z\sigma/E)^2$.

$$
n = \left(\frac{1.96 \times 15}{2}\right)^2 = 216.09 \;\Rightarrow\; 217
$$

**Interpretation:** About 217 participants are needed, before allowing for dropouts.

### 74. The cost of halving the margin of error

**Scenario:** The pollster from example 72 now wants ±1.5 points. **Concept:** Margin of error shrinks with $\sqrt{n}$.

$$
n = \frac{1.96^2 \times 0.25}{0.015^2} \approx 4268.4 \;\Rightarrow\; 4269
$$

**Interpretation:** Twice the precision needs four times the sample, which is why precision gets expensive.

### 75. Surveying a large share of a small population

**Scenario:** A company surveys 400 of its 2,000 employees. **Concept:** Finite population correction (FPC).

$$
\text{FPC} = \sqrt{\frac{N - n}{N - 1}} = \sqrt{\frac{1600}{1999}} \approx 0.895
$$

**Interpretation:** Standard errors shrink by about 10.5% because a fifth of the whole population was sampled.

### 76. Stratified sampling by department

**Scenario:** A firm has 600 engineers, 300 salespeople and 100 support staff, and wants a sample of 200. **Concept:** Proportional allocation.

$$
200 \times \frac{600}{1000} = 120, \qquad 200 \times \frac{300}{1000} = 60, \qquad 200 \times \frac{100}{1000} = 20
$$

**Interpretation:** Each group appears in the sample in its true proportion, so a small group cannot be missed by chance.

### 77. Averages are steadier than individuals

**Scenario:** Suppose individual delivery times have mean 30 and SD 6 minutes. A courier's daily average over 36 deliveries is reported. **Concept:** Central limit theorem.

$$
SE = \frac{6}{\sqrt{36}} = 1, \qquad P(\bar{X} > 32) = P(Z > 2) \approx 0.0228
$$

**Interpretation:** A 32-minute *single* delivery is ordinary, but a 32-minute *daily average* is rare.

### 78. Estimating a fish population

**Scenario:** Ecologists tag 100 fish and release them. Later they catch 80, of which 16 are tagged. **Concept:** Capture–recapture (Lincoln–Petersen estimator).

$$
\hat{N} = \frac{100 \times 80}{16} = 500
$$

A bias-reduced version (Chapman's estimator), $\frac{(101)(81)}{17} - 1$, gives about 480.

**Interpretation:** The lake holds roughly 500 fish, assuming tagged fish mix evenly and are not easier or harder to catch.

## Hypothesis testing and A/B tests

A hypothesis test asks how surprising the data would be if a default claim (the null hypothesis, $H_0$) were true. The p-value measures that surprise; as the American Statistical Association's 2016 statement stresses, it is not the probability that the hypothesis is true and does not measure the size of an effect ([Wasserstein & Lazar, 2016](https://doi.org/10.1080/00031305.2016.1154108)).

### 79. Are cereal boxes underfilled?

**Scenario:** Boxes should hold 500 g. Suppose the filling SD is known to be 10 g, and 40 boxes average 497 g. **Concept:** One-sample z-test.

$$
z = \frac{497 - 500}{10/\sqrt{40}} = \frac{-3}{1.581} \approx -1.90, \qquad p_{\text{two-sided}} \approx 0.058
$$

**Interpretation:** At the 5% level the shortfall is not statistically significant; it is not proof that filling is fine either.

### 80. Testing a battery-life claim

**Scenario:** A maker claims 20 hours of battery life. Sixteen tested units average 19.2 hours with SD 1.6. **Concept:** One-sample t-test, one-sided.

$$
t = \frac{19.2 - 20}{1.6/\sqrt{16}} = \frac{-0.8}{0.4} = -2.0, \qquad df = 15, \qquad p \approx 0.032
$$

**Interpretation:** If the claim were true, an average this low would happen only about 3% of the time.

### 81. An A/B test on a sign-up button

**Scenario:** Version A converts 200 of 4,000 visitors (5.00%); version B converts 250 of 4,000 (6.25%). **Concept:** Two-proportion z-test.

$$
\hat{p} = \frac{450}{8000} = 0.05625, \qquad SE = \sqrt{0.05625 \times 0.94375 \times \left(\frac{1}{4000} + \frac{1}{4000}\right)} \approx 0.00515
$$

$$
z = \frac{0.0625 - 0.0500}{0.00515} \approx 2.43, \qquad p \approx 0.015
$$

**Interpretation:** The lift is unlikely to be pure chance, assuming the test was planned in advance and not stopped early when it looked good.

### 82. Is the die fair?

**Scenario:** A die rolled 60 times shows faces 1–6 with counts 8, 9, 12, 11, 6, 14. **Concept:** Chi-square goodness-of-fit test, each expected count 10.

$$
\chi^2 = \sum \frac{(O - E)^2}{E} = \frac{4 + 1 + 4 + 1 + 16 + 16}{10} = 4.2, \qquad df = 5, \qquad p \approx 0.52
$$

**Interpretation:** These counts are entirely typical for a fair die; uneven-looking counts are normal in small samples.

### 83. Remote-work preference by department

**Scenario:** In a survey, 60 of 100 engineers and 35 of 100 salespeople prefer remote work. **Concept:** Chi-square test of independence.

Expected counts under independence are 47.5 (remote) and 52.5 (office) in each department:

$$
\chi^2 = 2\left[\frac{(60 - 47.5)^2}{47.5} + \frac{(40 - 52.5)^2}{52.5}\right] \approx 12.53, \qquad df = 1, \qquad p \approx 0.0004
$$

**Interpretation:** Preference is strongly associated with department in this sample.

### 84. Comparing two teaching methods

**Scenario:** Method A: 30 students, mean 78, SD 10. Method B: 30 students, mean 72, SD 12. **Concept:** Welch two-sample t-test ([NIST section 1.3.5.3](https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm)).

$$
SE = \sqrt{\frac{10^2}{30} + \frac{12^2}{30}} \approx 2.852, \qquad t = \frac{78 - 72}{2.852} \approx 2.10
$$

With Welch–Satterthwaite $df \approx 56.2$, the two-sided $p \approx 0.040$.

**Interpretation:** The difference is statistically significant at 5%, but only a randomized design would justify calling it an effect of the method.

### 85. Did training speed up typing?

**Scenario:** Eight employees' typing speed changed by +5, +3, +6, −1, +4, +2, +7, +3 words per minute after training. **Concept:** Paired t-test on the differences.

$$
\bar{d} = 3.625, \qquad s_d \approx 2.504, \qquad t = \frac{3.625}{2.504/\sqrt{8}} \approx 4.10, \qquad df = 7, \qquad p \approx 0.005
$$

**Interpretation:** Pairing removes person-to-person variation, which makes a small study informative.

### 86. Running twenty tests at once

**Scenario:** An analyst tests 20 metrics, each at $\alpha = 0.05$, when nothing has really changed. **Concept:** Family-wise error rate and the Bonferroni correction.

$$
P(\text{at least one false positive}) = 1 - 0.95^{20} \approx 0.642, \qquad \alpha_{\text{Bonferroni}} = \frac{0.05}{20} = 0.0025
$$

**Interpretation:** Test enough things and something will look "significant"; adjust the threshold or pre-register the main metric.

### 87. How long to run an A/B test

**Scenario:** The baseline conversion rate is 5%, and the team wants to detect a lift to 6% with 5% significance (two-sided) and 80% power. **Concept:** Sample size for two proportions.

$$
n = \frac{\left(1.96\sqrt{2(0.055)(0.945)} + 0.8416\sqrt{0.05(0.95) + 0.06(0.94)}\right)^2}{(0.06 - 0.05)^2} \approx 8158
$$

**Interpretation:** About 8,158 visitors per variant are needed; small lifts on small baselines need large samples.

### 88. The power of the cereal-box test

**Scenario:** Return to example 79. If the true mean really is 497 g, how often would that test detect it? **Concept:** Statistical power.

With the standardized shift $\delta = -1.897$ and a two-sided cutoff of 1.96:

$$
\text{power} = \Phi(-1.96 - \delta) + \Phi(-1.96 + \delta) = \Phi(-0.063) + \Phi(-3.857) \approx 0.475
$$

**Interpretation:** The test misses a real 3 g shortfall more than half the time, so "not significant" in example 79 was weak reassurance.

## Correlation and regression

The next four examples share one small, illustrative data set: monthly advertising spend $x$ (in \$1,000s) of 1, 2, 3, 4, 5 and sales $y$ (in \$10,000s) of 3, 5, 4, 7, 8. Its building blocks are $\bar{x} = 3$, $\bar{y} = 5.4$, $S_{xx} = 10$, $S_{yy} = 17.2$ and $S_{xy} = 12$.

### 89. Correlation between advertising and sales

**Scenario:** Does sales move with advertising? **Concept:** Pearson correlation coefficient.

$$
r = \frac{S_{xy}}{\sqrt{S_{xx} S_{yy}}} = \frac{12}{\sqrt{10 \times 17.2}} \approx 0.915
$$

**Interpretation:** A strong positive linear association; it does not by itself show that advertising causes sales.

### 90. Fitting a regression line

**Scenario:** Same data; predict sales at a spend of 6. **Concept:** Least-squares line, $b = S_{xy}/S_{xx}$, $a = \bar{y} - b\bar{x}$.

$$
b = \frac{12}{10} = 1.2, \qquad a = 5.4 - 1.2 \times 3 = 1.8, \qquad \hat{y} = 1.8 + 1.2x
$$

$$
\hat{y}(6) = 1.8 + 7.2 = 9.0
$$

**Interpretation:** Each extra \$1,000 is associated with \$12,000 more sales, but $x = 6$ is outside the data, so this is a cautious extrapolation.

### 91. How much does the line explain?

**Scenario:** Same data. **Concept:** Coefficient of determination.

$$
R^2 = r^2 \approx 0.915^2 \approx 0.837
$$

**Interpretation:** About 84% of the month-to-month variation in sales is accounted for by the linear relationship with spend.

### 92. Residuals and typical prediction error

**Scenario:** Same data. **Concept:** Residuals $y - \hat{y}$ and the standard error of the estimate.

Predicted values are 3.0, 4.2, 5.4, 6.6, 7.8, so the residuals are 0, 0.8, −1.4, 0.4, 0.2:

$$
SSE = 0 + 0.64 + 1.96 + 0.16 + 0.04 = 2.8, \qquad s_e = \sqrt{\frac{2.8}{5 - 2}} \approx 0.966
$$

**Interpretation:** Predictions are typically off by about 1 unit (\$10,000); month 3 is the worst fit.

### 93. Interpreting a slope in house prices

**Scenario:** Suppose a regression of price on floor area gives a slope of \$150 per square foot. Two otherwise similar houses differ by 200 square feet. **Concept:** Slope as a rate of change.

$$
150 \times 200 = 30\,000
$$

**Interpretation:** The model predicts a \$30,000 price difference, holding the model's other inputs fixed; it is a prediction, not an appraisal.

### 94. Ice cream and swimming accidents

**Scenario:** Suppose ice cream sales ($X$) and swimming accidents ($Y$) correlate at 0.6, while each correlates with temperature ($Z$) at 0.8 and 0.75. **Concept:** Partial correlation controls for a confounder.

$$
r_{XY \cdot Z} = \frac{r_{XY} - r_{XZ} r_{YZ}}{\sqrt{(1 - r_{XZ}^2)(1 - r_{YZ}^2)}} = \frac{0.6 - 0.8 \times 0.75}{\sqrt{0.36 \times 0.4375}} = \frac{0}{0.397} = 0
$$

**Interpretation:** In this constructed example, the whole association is explained by hot weather. Correlation is not causation.

### 95. Regression to the mean in performance reviews

**Scenario:** Suppose scores on two quarterly reviews correlate at $r = 0.5$, and an employee scored 2 SDs above average last quarter. **Concept:** Regression to the mean, $\hat{z}_y = r\,z_x$.

$$
\hat{z}_y = 0.5 \times 2 = 1
$$

**Interpretation:** The best prediction is still above average but closer to the mean, with no change in ability required; praise or criticism given in between can easily be mistaken for the cause.

## Paradoxes and pitfalls

### 96. Berkeley admissions and Simpson's paradox

**Scenario:** In 1973, graduate admissions at the University of California, Berkeley appeared to favor men. The data below are the six largest departments, as published with [Bickel, Hammel and O'Connell (1975)](https://doi.org/10.1126/science.187.4175.398) and distributed as R's [UCBAdmissions data set](https://stat.ethz.ch/R-manual/R-devel/library/datasets/html/UCBAdmissions.html). **Concept:** Simpson's paradox, where a trend in every group reverses or disappears when groups are combined.

Combined over the six departments:

$$
\text{men: } \frac{1198}{2691} \approx 44.5\%, \qquad \text{women: } \frac{557}{1835} \approx 30.4\%
$$

By department:

| Department | Men applied | Men admitted | Women applied | Women admitted |
| --- | --- | --- | --- | --- |
| A | 825 | 62.1% | 108 | 82.4% |
| B | 560 | 63.0% | 25 | 68.0% |
| C | 325 | 36.9% | 593 | 34.1% |
| D | 417 | 33.1% | 375 | 34.9% |
| E | 191 | 27.7% | 393 | 23.9% |
| F | 373 | 5.9% | 341 | 7.0% |

Women had the higher admission rate in four of the six departments. Most women applied to departments C–F, which admitted few applicants of either sex, while most men applied to A and B, which admitted most applicants.

**Interpretation:** The aggregate gap reflects *where* people applied, which matches the original authors' conclusion that the data did not show department-level bias against women. Always ask whether a lurking grouping variable explains a combined trend.

### 97. The gambler's fallacy

**Scenario:** A fair coin has landed heads five times in a row. What is the chance the next flip is heads? **Concept:** Independence.

$$
P(\text{heads on flip 6} \mid 5 \text{ heads}) = 0.5, \qquad P(6 \text{ heads in a row, before starting}) = 0.5^6 = \frac{1}{64}
$$

**Interpretation:** A streak is unlikely *in advance*, but once five heads have happened, the coin has no memory.

### 98. Benford's law for leading digits

**Scenario:** An analyst checks whether the first digits of thousands of invoice amounts look natural. **Concept:** Benford's law, $P(d) = \log_{10}(1 + 1/d)$, which applies to many data sets spanning several orders of magnitude.

$$
P(1) = \log_{10} 2 \approx 0.301, \qquad P(9) = \log_{10}\frac{10}{9} \approx 0.046
$$

**Interpretation:** Under Benford's law, about 30% of amounts would start with 1 and under 5% with 9. A large deviation is a reason to look closer, not proof of fraud, since many legitimate data sets do not follow the law.

### 99. The class-size paradox

**Scenario:** A school has two classes, one with 10 students and one with 90. **Concept:** The inspection paradox: averages depend on who is asked.

$$
\text{average per class} = \frac{10 + 90}{2} = 50, \qquad \text{average experienced by a student} = \frac{10^2 + 90^2}{100} = 82
$$

**Interpretation:** The school can truthfully report 50 while the typical student sits in a class of 90. The same effect can make buses or gyms feel more crowded than their reported averages.

### 100. Small hospitals and extreme days

**Scenario:** One hospital has about 15 births a day, another about 45. Which records more days on which over 60% of babies are boys? Assume each birth is a boy with probability 0.5. **Concept:** Small samples vary more (the binomial spread shrinks with $n$).

"Over 60%" means at least 10 of 15, or at least 28 of 45:

$$
P(X \ge 10 \mid n = 15) \approx 0.151, \qquad P(X \ge 28 \mid n = 45) \approx 0.068
$$

**Interpretation:** The small hospital sees such days more than twice as often. Extreme rates, good or bad, cluster in small groups, so rank small schools, towns or stores with care.

## Common mistakes

These are the errors that show up again and again when the examples above are applied to real data:

- **Ignoring the base rate.** Examples 13, 16 and 22 show that an accurate test for a rare event still produces mostly false alarms. Always ask how common the thing is before interpreting a positive.
- **Reversing a conditional probability.** $P(A \mid B)$ and $P(B \mid A)$ answer different questions (examples 17 and 23).
- **Assuming independence that is not there.** Redundant systems (example 8) and repeated tests (example 14) only behave as calculated if their failures are unrelated.
- **Adding standard deviations.** Variances of independent quantities add; standard deviations do not (examples 44 and 52).
- **Using the mean for skewed data.** For incomes, house prices and wait times, report the median as well (example 58).
- **Misreading a confidence interval.** The 95% describes how often the method succeeds over repeated samples, not the probability that one computed interval is correct ([NIST section 1.3.5.2](https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm)).
- **Treating p < 0.05 as a verdict.** A p-value is not the probability that the null hypothesis is true, and it says nothing about effect size ([Wasserstein & Lazar, 2016](https://doi.org/10.1080/00031305.2016.1154108)). "Not significant" can simply mean low power (example 88).
- **Testing many things and reporting the winner.** Multiple comparisons inflate false positives quickly (example 86). Decide the main metric and sample size before an A/B test starts (example 87).
- **Equating correlation with causation.** A lurking variable can create or erase an association (examples 94 and 96).
- **Expecting streaks to correct themselves.** Independent events have no memory (examples 57 and 97).
- **Over-reading small samples.** The most extreme results usually come from the smallest groups (example 100).

## Next steps

To keep practicing, pair these examples with the other guides in this series:

- [Math formulas every student should know](/articles/math-formulas-every-student-should-know), a reference for the formulas used above.
- [Math tricks to solve problems faster](/articles/math-tricks-to-solve-problems-faster), for quicker mental arithmetic on percentages and fractions.
- [Algebra problems with solutions for beginners](/articles/algebra-problems-with-solutions-for-beginners), if rearranging formulas such as the sample-size equations felt shaky.
- [Linear algebra concepts for machine learning](/articles/linear-algebra-concepts-for-machine-learning), the natural next step after regression.

You can also browse more mathematics writing in the [Mathematics category](/category/mathematics).

## References

1. Illowsky, B., & Dean, S. (2023). *Introductory Statistics 2e*. OpenStax. [https://openstax.org/details/books/introductory-statistics-2e](https://openstax.org/details/books/introductory-statistics-2e). Sections used: [4.3 Binomial Distribution](https://openstax.org/books/introductory-statistics-2e/pages/4-3-binomial-distribution), [6.1 The Standard Normal Distribution](https://openstax.org/books/introductory-statistics-2e/pages/6-1-the-standard-normal-distribution), [7.1 The Central Limit Theorem for Sample Means](https://openstax.org/books/introductory-statistics-2e/pages/7-1-the-central-limit-theorem-for-sample-means-averages).
2. NIST/SEMATECH. *e-Handbook of Statistical Methods* (last updated 2022). National Institute of Standards and Technology. [https://www.itl.nist.gov/div898/handbook/](https://www.itl.nist.gov/div898/handbook/) ([doi:10.18434/M32189](https://doi.org/10.18434/M32189)). Sections used: [1.3.5.2 Confidence Limits for the Mean](https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm), [1.3.5.3 Two-Sample t-Test for Equal Means](https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm), [1.3.6.6.1 Normal Distribution](https://www.itl.nist.gov/div898/handbook/eda/section3/eda3661.htm), [6.1.6 What is Process Capability?](https://www.itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm).
3. Bickel, P. J., Hammel, E. A., & O'Connell, J. W. (1975). Sex bias in graduate admissions: Data from Berkeley. *Science*, 187(4175), 398–404. [https://doi.org/10.1126/science.187.4175.398](https://doi.org/10.1126/science.187.4175.398).
4. R Core Team. *UCBAdmissions: Student Admissions at UC Berkeley* (R datasets package documentation). [https://stat.ethz.ch/R-manual/R-devel/library/datasets/html/UCBAdmissions.html](https://stat.ethz.ch/R-manual/R-devel/library/datasets/html/UCBAdmissions.html).
5. Wasserstein, R. L., & Lazar, N. A. (2016). The ASA's statement on p-values: Context, process, and purpose. *The American Statistician*, 70(2), 129–133. [https://doi.org/10.1080/00031305.2016.1154108](https://doi.org/10.1080/00031305.2016.1154108).
