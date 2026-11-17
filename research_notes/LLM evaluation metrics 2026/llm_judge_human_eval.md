# Model-based and human evaluation of LLMs (LLM-as-a-judge, G-Eval, human eval, Arena ratings, AlpacaEval LC) — status as of November 2026

Research date: 2026-11-07. Most of the base papers are 2023–2025. Each claim carries its date.

## How exactly does each technique work, and what are its formulas?

### Takeaway
LLM-as-a-judge comes in three forms (pairwise, single-answer grading, reference-guided). G-Eval adds auto-generated CoT steps, a form-filling output and a probability-weighted score: score = Σ p(sᵢ)·sᵢ. Arena-style leaderboards moved from online Elo to a Bradley-Terry logistic regression, later with style covariates. AlpacaEval 2.0's LC win rate fits a GLM and zeroes the length term. Kappa and alpha correct raw agreement for chance.

### Cited Findings

**LLM-as-a-judge (Zheng et al., 2023, MT-Bench / Chatbot Arena paper)**
- The paper defines three variants, used alone or together:
  - **Pairwise comparison:** the judge sees a question and two answers and picks the better one or declares a tie.
  - **Single answer grading:** the judge assigns a score to one answer directly.
  - **Reference-guided grading:** the judge is given a reference solution, for example for math.
  — [Zheng et al. 2023, arXiv:2306.05685](https://arxiv.org/abs/2306.05685) (Sec. 3.1, from full PDF text)
- Trade-offs:
  - Pairwise comparison scales poorly because the number of pairs "grows quadratically".
  - Single-answer grading "may be unable to discern subtle differences" between specific pairs.
  - Absolute scores fluctuate more than pairwise results when the judge model changes.
  — [Zheng et al. 2023](https://arxiv.org/abs/2306.05685)
- Multi-turn judging works better when both full conversations go in one prompt. Splitting the turns across prompts made GPT-4 struggle to locate earlier responses. — [Zheng et al. 2023](https://arxiv.org/abs/2306.05685)
- **Agreement metric definition:** "the probability of randomly selected individuals (but not identical) of each type agreeing on a randomly selected question". It can be computed with or without ties. — [Zheng et al. 2023](https://arxiv.org/abs/2306.05685)

**G-Eval (Liu et al., 2023)**
- **Auto-CoT:** the LLM is given only the task introduction and the evaluation criteria. It generates its own "Evaluation Steps". For coherence, the steps were: identify the main points, compare with the article, assign a 1–5 score. — [G-Eval, arXiv:2303.16634v3](https://arxiv.org/html/2303.16634v3)
- **Form-filling:** prompt + generated CoT + source + target are concatenated. The LLM fills in an "Evaluation Form (scores ONLY)". This replaces scoring by target-text likelihood, which is the GPTScore approach. — [G-Eval](https://arxiv.org/html/2303.16634v3)
- **Probability-weighted score:** score = Σᵢ p(sᵢ) × sᵢ over the predefined scores S = {s₁…sₙ}. It uses a 1–5 scale for summarization and 1–3 for dialogue engagingness. — [G-Eval](https://arxiv.org/html/2303.16634v3)
- GPT-4 did not expose token probabilities at the time. The authors sampled n=20 times at temperature=1, top_p=1 to estimate them. — [G-Eval](https://arxiv.org/html/2303.16634v3)
- **Results:**
  - SummEval average Spearman ρ 0.514, Kendall τ 0.418 for G-Eval-4. The best prior method, UniEval, had ρ 0.474, τ 0.377.
  - Topical-Chat average r 0.575, ρ 0.588.
  - QAGS average r 0.599, ρ 0.611, τ 0.525.
  - G-Eval-3.5 was poor on QAGS-XSUM (r 0.211).
  — [G-Eval](https://arxiv.org/html/2303.16634v3)

**Rubric-based grading**
- Zheng et al. found GPT-4 single-answer grading matched both pairwise GPT-4 and humans well, which "means GPT-4 has a relatively stable internal rubric". — [Zheng et al. 2023](https://arxiv.org/abs/2306.05685)
- G-Eval's explicit criteria plus generated evaluation steps are, in effect, a rubric fed to the judge. — [G-Eval](https://arxiv.org/html/2303.16634v3)
- (No dedicated primary source on rubric design was fetched. See Gaps.)

**Elo (as originally used by Chatbot Arena)**
- Expected score: E_A = 1 / (1 + 10^((R_B − R_A)/400)). Update: R'_A = R_A + K(S_A − E_A), with S_A = 1 for a win, 0.5 for a draw, 0 for a loss. — [Wikipedia: Elo rating system](https://en.wikipedia.org/wiki/Elo_rating_system)
- Typical K values: Elo's original proposal used 32 for weaker players and 16 for masters. FIDE uses 40, 20 or 10 depending on games played and rating. — [Wikipedia: Elo](https://en.wikipedia.org/wiki/Elo_rating_system)
- Chatbot Arena tuned K to balance stability against letting new models rise quickly. It shuffled the battles into 1,000 permutations to stabilize the online Elo scores. The blog does not state the K value in its text. — [LMSYS blog, 2023-12-07](https://lmsys.org/blog/2023-12-07-leaderboard/)

**Bradley-Terry (Arena's current basis, since Dec 2023)**
- Arena switched from online Elo to maximum-likelihood Bradley-Terry. The reasons given:
  - Online Elo is order-dependent and noisy.
  - Arena holds the full battle history.
  - Most models are static.
  - BT gives more stable ratings and better confidence intervals.
  Mean ratings and rankings were "very similar" under both methods. Ties count as half a win and half a loss. Confidence intervals come from bootstrapping the MLE. — [LMSYS blog, 2023-12-07](https://lmsys.org/blog/2023-12-07-leaderboard/)
- **Formulation:**
  - Each battle i has Xᵢ ∈ ℝᴹ: +1 for the left model, −1 for the right, 0 otherwise. Yᵢ = 1 if the left model wins.
  - β̂ = argmin_β (1/n) Σ BCELoss(sigmoid(Xᵢᵀβ), Yᵢ).
  - β̂_m is the "Arena Score", formerly called the Elo score. This is equivalent to P(m beats m′) = sigmoid(β_m − β_m′). Arena reports scores on an Elo-like scale.
  — [LMSYS blog: style control, 2024-08-28](https://lmsys.org/blog/2024-08-28-style-control/)
- **Style control (Aug 2024):**
  - Adds style covariates Zᵢ, each a normalized (feature_A − feature_B)/(feature_A + feature_B), with coefficients γ: sigmoid(Xᵢᵀβ + Zᵢᵀγ).
  - Features: answer token length, markdown header count, bold count, list count.
  - Coefficients with both controls on: length 0.249, list 0.031, header 0.024, bold 0.019. Length dominates.
  - Example rank changes: grok-2-mini 6→18; gpt-4o-mini 6→11; claude-3-opus 16→10.
  - The authors say the analysis is observational, so confounders may remain.
  — [LMSYS blog, 2024-08-28](https://lmsys.org/blog/2024-08-28-style-control/)

**Win rate and length-controlled win rate (AlpacaEval 2.0, Dubois et al., 2024)**
- **Raw win rate:** the share of instructions on which the auto-annotator prefers the model's output over a baseline's. The baseline is GPT-4 Turbo (gpt4_1106_preview) and the annotator is GPT-4-Turbo-based. — [Dubois et al. 2024, arXiv:2404.04475](https://arxiv.org/html/2404.04475)
- **GLM (Eq. 1):** q(y=1 | z_m, z_b, x) = logistic( (θ_m − θ_b) + φ_{m,b}·tanh( (len(z_m) − len(z_b)) / std(len(z_m) − len(z_b)) ) + (ψ_m − ψ_b)·γ_x )
  - Model term: θ_m − θ_b.
  - Length term: tanh of the length difference normalized by its standard deviation. The tanh captures diminishing returns, and weak L2 regularization on φ guards against truncation attacks.
  - Instruction term: γ_x is the difficulty of instruction x.
  — [Dubois et al. 2024](https://arxiv.org/html/2404.04475)
- **LC win rate (Eq. 2):** winrate^LC(m,b) = 100 · E_x[ logistic(θ_m − θ_b + (ψ_m − ψ_b)·γ_x) ]. The length term is set to zero, which asks: "what would the preference be if the model's and baseline's output had the same length?" — [Dubois et al. 2024](https://arxiv.org/html/2404.04475)

**Human evaluation methods and agreement statistics**
- **Pairwise preference with ties:** used by MT-Bench experts (3K expert votes) and by Chatbot Arena crowd votes (30K conversations released). — [Zheng et al. 2023](https://arxiv.org/abs/2306.05685)
- Absolute Likert-style scales (1–5) are used for human labels in SummEval and in G-Eval's scoring. — [G-Eval](https://arxiv.org/html/2303.16634v3)
- **Cohen's kappa** (two raters): κ = (p_o − p_e)/(1 − p_e).
  - p_o = Σ_k O_kk / N, the observed agreement.
  - p_e = (1/N²) Σ_k O_k· O_·k, chance agreement from the marginals.
  - Landis & Koch bands: 0–0.20 slight, 0.21–0.40 fair, 0.41–0.60 moderate, 0.61–0.80 substantial, 0.81–1 almost perfect. Wikipedia notes these bands are opinion-based and "may be more harmful than helpful".
  - Kappa depends on prevalence and on differences between raters' marginals.
  - Fleiss' kappa handles more than two raters and generalizes Scott's pi.
  — [Wikipedia: Cohen's kappa](https://en.wikipedia.org/wiki/Cohen%27s_kappa)
- **Krippendorff's alpha:** α = 1 − D_o/D_e, observed over expected disagreement.
  - Handles any number of coders and missing data.
  - Supports nominal, ordinal, interval, ratio and other metrics.
  - Common thresholds: α ≥ 0.800 is reliable; 0.667–0.800 supports tentative conclusions only; below 0.667 the data are discarded.
  — [Wikipedia: Krippendorff's alpha](https://en.wikipedia.org/wiki/Krippendorff%27s_alpha)

### Inferences
- LC win rate and Arena style control use the same idea: add a nuisance covariate (length or style) to a logistic preference model, then report the model term with that covariate held at zero.
- BT and Elo share the same logistic win-probability form. BT fits it in batch, so the result does not depend on battle order.

### Gaps
- The exact Elo K-factor Chatbot Arena used in 2023 is not stated in the blog text (the formula is shown as an image).
- No primary source was fetched on Arena methodology changes in 2025–2026. The old domain news.lmarena.ai now 301-redirects to arena.ai, and the response post calls the company "Arena", which suggests a rebrand. The date and details of any rebrand were not verified.
- Anthropic and OpenAI evaluation guides were not fetched. Their recommendations are not represented here.

## What does the evidence say about reliability and failure modes of LLM judges?

### Takeaway
Strong judges reach human-level agreement on MT-Bench-style pairwise tasks: about 66% with ties and 85% without ties for GPT-4 vs experts, against human-human figures of 63% and 81%. Judges still show strong position bias, verbosity bias, self-preference, leniency and reasoning-grading failures. Percent agreement overstates alignment compared with chance-corrected metrics.

### Cited Findings

**Exact MT-Bench agreement figures**
- The abstract says GPT-4 achieves "over 80% agreement, the same level of agreement between humans." — [Zheng et al. 2023](https://arxiv.org/abs/2306.05685)
- The "over 80%" figure is the **no-tie setup (S2)**. Table 5, first turn, MT-Bench:
  - GPT-4 pairwise vs human: **85%** (S2, no ties, random baseline 50%) and **66%** (S1, ties and inconsistent votes counted as ties, random baseline 33%).
  - Human vs human: **81%** (S2) and **63%** (S1).
  - Second turn: GPT-4 vs human 85% (S2) and 66% (S1); human-human 82% (S2) and 67% (S1).
  - GPT-4 single-answer grading vs human: 85% (S2) and 60% (S1) on the first turn.
  — [Zheng et al. 2023, Table 5](https://arxiv.org/abs/2306.05685)
- When a human disagreed with GPT-4 and was shown GPT-4's judgment, humans deemed it reasonable in 75% of cases and changed their choice in 34%. — [Zheng et al. 2023](https://arxiv.org/abs/2306.05685)
- GPT-4–human agreement rises with the performance gap between models, from 70% to nearly 100%. — [Zheng et al. 2023](https://arxiv.org/abs/2306.05685)

**Position bias** (Zheng et al. 2023, Table 2, two similar GPT-3.5 answers per question)
- Consistency when positions are swapped:

  | Judge | Consistency | Favors first position |
  |---|---|---|
  | GPT-4 | 65.0% | 30.0% |
  | GPT-3.5 | 46.2% | 50.0% |
  | Claude-v1 | 23.8% | 75.0% |

- Claude-v1 also showed name bias toward "Assistant A".
- Only GPT-4 was consistent in more than 60% of cases.

— [Zheng et al. 2023](https://arxiv.org/abs/2306.05685)

**Verbosity bias**
- In the "repetitive list" attack, a list was padded with rephrased duplicate items. Over 23 answers, the attack fooled Claude-v1 91.3% of the time, GPT-3.5 91.3%, and GPT-4 8.7%. — [Zheng et al. 2023](https://arxiv.org/abs/2306.05685)
- In AlpacaEval, prompting the baseline to be verbose or concise swung its raw win rate from 22.9% to 64.3%. Under LC the swing was 41.9% to 51.6%. Normalized standard deviation across verbosity prompts fell from 25% to 10%. — [Dubois et al. 2024](https://arxiv.org/html/2404.04475)
- Length control raised AlpacaEval's Spearman correlation with Chatbot Arena from 0.94 to 0.98. — [Dubois et al. 2024](https://arxiv.org/abs/2404.04475)
- Arena human voters also reward length. It is the largest style coefficient, at 0.249. — [LMSYS style control](https://lmsys.org/blog/2024-08-28-style-control/)

**Self-preference / self-enhancement**
- GPT-4 as judge favored itself with a 10% higher win rate than humans gave it, and Claude-v1 with 25%. GPT-3.5 did not favor itself. The authors say their data "cannot determine" whether this is a real self-enhancement bias. — [Zheng et al. 2023](https://arxiv.org/abs/2306.05685)
- GPT-4 and Llama 2 can recognize their own outputs with non-trivial accuracy. Under fine-tuning, self-recognition correlates linearly with self-preference, and controlled experiments suggest the link is causal. — [Panickssery, Bowman & Feng 2024, arXiv:2404.13076](https://arxiv.org/abs/2404.13076)
- G-Eval-4 always scored GPT-3.5 summaries above human-written ones, even where humans preferred the human summaries. Human agreement on that set was very low (Krippendorff's α = 0.07). The authors warn of self-reinforcement if LLM evaluators are used as reward signals. — [G-Eval](https://arxiv.org/html/2303.16634v3)

**Reasoning and grading failures**
- GPT-4 was misled by the answers it graded, even on math it could solve on its own. On 10 math questions with positions swapped (20 judgments), the failure rate was 14/20 with the default prompt, 6/20 with CoT and 3/20 with reference-guided grading, which the paper summarizes as 70% to 15%. — [Zheng et al. 2023, Table 4](https://arxiv.org/abs/2306.05685)

**Agreement metrics overstate alignment; leniency** ("Judging the Judges", Thakur et al. 2024)
- Setup: 13 judges graded 9 exam-taker models.
- Only the best and largest judges aligned reasonably with humans. Even they stayed "well below" inter-human agreement, and scores differed by up to 5 points.
- Percent agreement is "insufficient", and chance-corrected or other alignment metrics are needed.
- Judges are lenient and sensitive to prompt complexity and length.
- For ranking models, small judges and even lexical metrics gave a reasonable signal.
— [Thakur et al. 2024, arXiv:2406.12624](https://arxiv.org/abs/2406.12624)

**Withdrawn 2026 preprint (low confidence)**
- A June 2026 preprint reported an exact-match vs Cohen's κ gap of 33–41 pp on MT-Bench, judge rankings shifting up to 14 positions across benchmarks, and test-retest reliability above 0.95 alongside position bias above 0.10. It covered 21 judges and about 541K judgments.
- arXiv **withdrew** v2 (3 Nov 2026) as not meeting its "research content quality standards". **Do not rely on these figures.**
— [Norman, Rivera & Hughes 2026, arXiv:2606.19544](https://arxiv.org/abs/2606.19544)

**Human preference leaderboards: "The Leaderboard Illusion" (Singh et al., Apr 2025)**
- Claims:
  - Undisclosed private testing lets a few providers test many variants and disclose only the best. Meta tested 27 private variants before Llama-4.
  - Proprietary models are sampled more and removed less. Estimated arena data shares: Google 19.2%, OpenAI 20.4%; 83 open-weight models together 29.7%.
  - Limited extra arena data can yield relative gains of up to 112% on the arena distribution.
  - Authors include Shivalika Singh, Sayash Kapoor, Sanmi Koyejo, Noah A. Smith, Sara Hooker and others. arXiv v1 29 Apr 2025, v2 12 May 2025.
  — [Singh et al. 2025, arXiv:2504.20879](https://arxiv.org/abs/2504.20879)
- **Arena's response** (9 May 2025, updated 13 Jun 2025):
  - The pre-release testing policy was public since 1 Mar 2024, and any provider may test multiple variants as capacity allows.
  - Its stats show open models at 40.9%, against the writeup's 8.8%.
  - The 100+ point boost plot is a simulation. Arena estimates the real effect at about +11 after 50 tests and 3,000 votes.
  - The 112% figure came from Arena-Hard, a static 500-prompt benchmark with an LLM judge, not from human Arena votes.
  - Arena says it helped Cohere test 9 pre-release models since Jan 2025.
  - Announced changes: mark scores "provisional" until 2,000 fresh post-release votes when more than 10 models are tested in parallel, and explicitly mark retired models.
  — [Arena, "Our Response"](https://arena.ai/blog/our-response)
- Commentary is split: Arvind Narayanan found the response unconvincing, while a Latent Space summary called it a rebuttal. This comes from search-result summaries and was not independently verified. — [Simon Willison, 2025-04-30](https://feeds.simonwillison.net/2025/Apr/30/criticism-of-the-chatbot-arena/)

### Inferences
- "~80% agreement" is accurate only for the no-tie setting. With ties the GPT-4–human figure is 66%, still level with humans (63%). Writers should state which setup they mean.
- Position and verbosity bias are well documented with numbers. Self-preference has mechanistic evidence (Panickssery) but weaker effect-size evidence from Zheng et al.
- Most hard numbers come from 2023–2024 judges (GPT-4, Claude-v1). Newer judges may do better, but no fetched 2026 primary source quantifies this.

### Gaps
- No verified 2025–2026 quantitative benchmark of frontier judges' bias rates was fetched. JudgeBench and RewardBench were mentioned but not read.
- Whether Arena published the promised policy updates, and its 2026 methodology, was not verified.

## What are current best practices in 2026 for building a reliable judge?

### Takeaway
The evidence supports these practices:
- Calibrate the judge against a human-labeled set, and compare its agreement with human-human agreement using chance-corrected statistics.
- Swap positions or randomize them.
- Use references or CoT for reasoning tasks.
- Give explicit criteria or rubrics.
- Control for length and style.
- Prefer juries of diverse model families over a single judge from the family being evaluated.

### Cited Findings
- **Position swap:** call the judge twice with the order swapped, declare a win only if both orders agree, and otherwise call a tie. Random position assignment also works at scale. — [Zheng et al. 2023](https://arxiv.org/abs/2306.05685)
- **Few-shot examples:** raised GPT-4's consistency from 65.0% to 77.5%. Caveats: consistency is not accuracy, the examples may add new biases, and prompts cost 4× more. — [Zheng et al. 2023](https://arxiv.org/abs/2306.05685)
- **Reference-guided or CoT judging for math and reasoning:** see the 14/20 → 6/20 → 3/20 failure counts above. — [Zheng et al. 2023](https://arxiv.org/abs/2306.05685)
- **Explicit criteria plus generated evaluation steps, and probability-weighting scores** rather than taking the argmax. Probability-weighting reduces ties and gives finer-grained scores. — [G-Eval](https://arxiv.org/html/2303.16634v3)
- **Length and style control:** apply regression-based debiasing (AlpacaEval LC; Arena style control). — [Dubois et al. 2024](https://arxiv.org/html/2404.04475); [LMSYS style control](https://lmsys.org/blog/2024-08-28-style-control/)
- **Juries:** a Panel of LLM evaluators (PoLL) of smaller models from disjoint families outperformed a single large judge across 3 judge settings and 6 datasets. The authors report it is "over seven times less expensive" and shows less intra-model bias. — [Verga et al. 2024, arXiv:2404.18796](https://arxiv.org/abs/2404.18796)
- **Avoid same-family judges where possible:** self-recognition drives self-preference. — [Panickssery et al. 2024](https://arxiv.org/abs/2404.13076)
- **Validate with more than percent agreement:** report kappa or alpha and compare against inter-human agreement. — [Thakur et al. 2024](https://arxiv.org/abs/2406.12624); [Wikipedia: Cohen's kappa](https://en.wikipedia.org/wiki/Cohen%27s_kappa)
- **Statistical calibration:** an ICML 2026 paper proposes estimating judge sensitivity and specificity on a labeled calibration set and debiasing the accuracy estimate. It identifies regimes where judge-based estimates beat human-only ones. This is known only from a search-result summary of the slides; the full text was not read. — [ICML 2026 slides](https://icml.cc/media/icml-2026/Slides/63607.pdf)
- **Survey:** Gu et al.'s LLM-as-a-Judge survey (v6 revised Oct 2025) organizes the field around consistency, bias mitigation and judge-reliability evaluation. — [Gu et al., arXiv:2411.15594](https://arxiv.org/abs/2411.15594)
- **Practitioner thresholds:** vendor guides cite κ > 0.6 vs human labels as acceptable and > 0.8 as strong, and recommend a 100–300 sample human audit. These are heuristics with no empirical standard behind them. — [koji.so guide (2026)](https://www.koji.so/docs/llm-as-a-judge-vs-human-evaluation)

### Inferences
- A defensible 2026 recipe:
  1. Write a rubric with explicit criteria.
  2. Build a human-labeled calibration set with measured inter-annotator agreement (κ or α).
  3. Run the judge with swapped positions (pairwise) or a reference (correctness tasks).
  4. Report judge–human κ or α next to human–human agreement.
  5. Control length.
  6. Use a cross-family jury for high-stakes comparisons.
  7. Re-validate whenever the judge model or prompt changes. Zheng et al. note that absolute scores shift when the judge changes.
- This recipe is a synthesis of the sources above, not a single published standard.

### Gaps
- Official Anthropic and OpenAI evaluation-guide recommendations were not retrieved, so no vendor-official guidance is cited.
- The PoLL paper's specific judge models, aggregation rule (e.g., max or average voting) and kappa figures were not available on the abstract page.
- No authoritative 2026 consensus standard (e.g., ISO or NIST) for LLM-judge validation was found.
