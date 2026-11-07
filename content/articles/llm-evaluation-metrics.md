---
title: "25 Essential LLM Evaluation Metrics and Techniques: A Complete Guide to Measuring AI Model Performance in 2026"
seoTitle: "25 LLM Evaluation Metrics and Techniques: 2026 Guide"
slug: llm-evaluation-metrics
description: How to measure an LLM in 2026, from perplexity, BLEU and pass@k to RAG faithfulness, LLM-as-a-judge, agent reliability and error bars, with worked examples.
author: BlogAI Editors
authorType: Organization
publishedAt: 2026-11-07
updatedAt: 2026-11-07
status: published
categories:
  - Artificial Intelligence
  - Programming and Technology
tags:
  - llm evaluation
  - large language models
  - machine learning
  - ai safety
  - generative ai
  - ai
tocDepth: 2
---

No single number tells you how good a large language model (LLM) is. A model can top a leaderboard and still invent facts in your product, refuse harmless requests or answer too slowly for your users. This guide explains the **25 metrics and techniques** that teams use to measure LLMs in 2026: what each one measures, how it is computed, where it breaks and when to use it.

**The short answer.** Measure an LLM with a small stack of metrics, not one score:

- **Statistical metrics** (perplexity, accuracy, exact match) for pre-training and benchmarks with fixed answers.
- **Reference-overlap metrics** (BLEU, ROUGE, METEOR, chrF, BERTScore) mainly for translation and summarization. They correlate weakly with human judgment on open-ended output.
- **Execution and calibration metrics** (pass@k, ECE, Brier score) for code and for confidence.
- **Retrieval, RAG and factuality metrics** (ranking metrics, context precision and recall, faithfulness, hallucination rate, FActScore, SelfCheckGPT, SimpleQA) for grounding and truth.
- **Model-based and human judgment** (LLM-as-a-judge, arena ratings, length-controlled win rates, kappa and alpha) for open-ended quality.
- **Agent, safety and production metrics** (task success, pass^k, time horizons, attack success rate with over-refusal, latency) plus **error bars** on everything.

The most important lesson: **a metric name means nothing without its implementation, judge model, decoding settings and error bar.** Two tools can report "faithfulness" and mean different things.

**How we wrote this.** We built this guide from primary sources: the original papers, the source code of evaluation libraries (EleutherAI's lm-evaluation-harness, Hugging Face's lighteval, SacreBLEU, the official SQuAD script), tool documentation and leaderboard repositories. Each claim links to its source. The worked examples are our own arithmetic applied to the cited formulas, not figures quoted from the sources. Model scores come with dates, and we flag figures that come from secondary sources or could not be verified at the primary source. Tool statuses and versions are as of 7 November 2026.

## The 25 metrics at a glance

| # | Metric or technique | Family | Best used for |
|---|---|---|---|
| 1 | Perplexity, cross-entropy, bits-per-byte | Statistical | Pre-training, comparing language models |
| 2 | Multiple-choice accuracy (acc, acc_norm) | Statistical | Knowledge and reasoning benchmarks |
| 3 | Exact match and token F1 | Statistical | Extractive QA, short answers, math final answers |
| 4 | BLEU (SacreBLEU) | Reference overlap | Machine translation, for comparison with past results |
| 5 | ROUGE-1, ROUGE-2, ROUGE-L | Reference overlap | Summarization baselines |
| 6 | METEOR | Reference overlap | Recall-sensitive translation scoring |
| 7 | chrF and chrF++ | Reference overlap | Translation, morphologically rich languages |
| 8 | BERTScore and embedding cosine similarity | Semantic similarity | Paraphrase-tolerant reference scoring |
| 9 | pass@k | Execution | Code generation |
| 10 | Calibration: ECE, MCE, Brier score | Reliability | Confidence and abstention decisions |
| 11 | Retrieval ranking: precision@k, recall@k, MRR, nDCG | RAG retrieval | Tuning retrievers with relevance labels |
| 12 | Context precision and context recall | RAG retrieval | RAG retrieval quality with LLM labels |
| 13 | Faithfulness (groundedness) | RAG generation | Detecting unsupported claims in RAG answers |
| 14 | Answer relevancy | RAG generation | Detecting off-topic or incomplete answers |
| 15 | Summarization hallucination rate (HHEM) | Factuality | Comparing models on grounded summaries |
| 16 | FActScore | Factuality | Long-form factuality |
| 17 | SelfCheckGPT | Factuality | Reference-free hallucination detection |
| 18 | SimpleQA correct, attempted and F-score | Factuality | Short-form factual knowledge |
| 19 | LLM-as-a-judge and G-Eval | Model-based | Open-ended quality at scale |
| 20 | Elo, Bradley-Terry, win rate, LC win rate | Model-based and human | Ranking chat models |
| 21 | Cohen's kappa, Krippendorff's alpha | Human evaluation | Validating human labels and judges |
| 22 | Agent task success, pass^k, 50% time horizon | Agentic | Tool use, coding agents, computer use |
| 23 | Attack success rate, over-refusal, toxicity | Safety | Jailbreak robustness and the helpfulness trade-off |
| 24 | TTFT, ITL, TPS, RPS | Production | Serving performance and SLAs |
| 25 | Error bars and prompt-format spread | Statistical rigor | Every reported number |

## Statistical metrics: the foundations

These are the oldest metrics, with exact definitions. Most practical problems come from implementation details rather than the headline formula. EleutherAI's lm-evaluation-harness registers 19 metrics in 2026, including perplexity, bits-per-byte, acc, acc_norm, exact_match, BLEU, chrF, chrF++, TER and Brier score ([lm-evaluation-harness metrics.py](https://raw.githubusercontent.com/EleutherAI/lm-evaluation-harness/main/lm_eval/api/metrics.py)). Hugging Face's lighteval adds ROUGE, BERTScore, maj@k and LLM-as-a-judge metrics ([lighteval metric list](https://huggingface.co/docs/lighteval/metric-list)).

### 1. Perplexity, cross-entropy and bits-per-byte

**What it measures.** How surprised a language model is by real text. Lower is better.

**How it is computed.** Perplexity is the exponential of the mean negative log-likelihood per token, that is, the exponential of the cross-entropy in nats:

$$
\text{PPL} = \exp\Big(-\frac{1}{N}\sum_{i=1}^{N} \log p(x_i \mid x_{<i})\Big)
$$

The harness computes it as `math.exp(-mean(items))` and marks it lower-is-better ([lm-evaluation-harness](https://raw.githubusercontent.com/EleutherAI/lm-evaluation-harness/main/lm_eval/api/metrics.py)). The Pile paper defines **bits per UTF-8 byte** as

$$
\text{bpb} = \frac{L_T}{L_B} \cdot \frac{\ell}{\ln 2}
$$

where $\ell$ is the per-token loss in nats, $L_T$ the number of tokens and $L_B$ the number of bytes. The authors chose it because it does not depend on the tokenizer ([Gao et al. 2020](https://ar5iv.labs.arxiv.org/html/2101.00027)).

**Worked example.** A model gives four tokens probabilities 0.5, 0.25, 0.5 and 0.125. The losses are 1, 2, 1 and 3 bits, 7 bits in total, so the cross-entropy is 1.75 bits per token (1.213 nats). Perplexity is $2^{1.75} \approx 3.36$, the inverse geometric mean of the probabilities. If those four tokens span 10 bytes, bpb = 7/10 = 0.70.

**Limitations.** Raw perplexity is comparable only between models that share a tokenizer and the same evaluation text. That is why word-perplexity, byte-perplexity and bits-per-byte exist.

**When to use it.** For pre-training and language-modeling evaluation. Do not use it as a proxy for instruction-following or chat quality. Our guide to [the techniques behind modern LLMs](/articles/llm-breakthroughs) explains why cross-entropy is also the training loss.

### 2. Multiple-choice accuracy (acc and acc_norm)

**What it measures.** The share of items answered correctly. Benchmarks such as MMLU, GPQA and the multiple-choice items of Humanity's Last Exam (HLE) report it.

**How it is computed.** Accuracy is correct answers divided by total items, but how the model's "chosen" option is picked matters. The harness's `acc` selects the option with the highest summed log-probability:

$$
\hat{a} = \arg\max_j \log P(a_j \mid q)
$$

That **biases selection toward shorter options**, because every extra token lowers the summed log-probability. `acc_norm` divides each option's log-probability by its length in bytes, which does not depend on the tokenizer. EleutherAI uses it across its multiple-choice tasks ([EleutherAI blog](https://blog.eleuther.ai/multiple-choice-normalization/)).

**Limitations.** Accuracy inherits the benchmark's label errors. Experts behind MMLU-Redux estimated that **6.49% of MMLU questions contain errors**, and that 57% of the Virology subset is erroneous. Corrected labels reshuffle rankings: Palmyra X v3 moves from 4th to 1st on Virology ([MMLU-Redux, arXiv 2406.04127](https://arxiv.org/abs/2406.04127)).

**When to use it.** For benchmarks with constrained answers. Always state which normalization you used.

### 3. Exact match and token-level F1

**What it measures.** Whether a short answer is right (exact match, EM), or how much of it overlaps with the correct answer (token F1).

**How it is computed.** EM scores 1 if the normalized prediction equals a gold answer. The official SQuAD v2.0 script lowercases text, strips punctuation and the articles a, an and the, and collapses whitespace before comparing. F1 is computed over the overlapping bags of tokens, and each question takes the **maximum over all gold answers** ([SQuAD evaluate-v2.0.py](https://raw.githubusercontent.com/rajpurkar/SQuAD-explorer/master/evaluate-v2.0.py)):

$$
P = \frac{|\text{common}|}{|\text{pred}|}, \quad R = \frac{|\text{common}|}{|\text{gold}|}, \quad F_1 = \frac{2PR}{P + R}
$$

**Worked example.** Gold answer "the Eiffel Tower", prediction "Eiffel Tower in Paris". After normalization the gold answer is two tokens and the prediction four, with two in common. EM = 0, $P = 2/4$, $R = 2/2$ and $F_1 \approx 0.667$.

**Limitations.** Names collide across tools. The harness's `f1` is a corpus-level scikit-learn F1 for multiple-choice tasks, not SQuAD token F1 ([lm-evaluation-harness](https://raw.githubusercontent.com/EleutherAI/lm-evaluation-harness/main/lm_eval/api/metrics.py)). lighteval's math EM strips LaTeX, and its `maj_at_k` takes a majority vote over k samples ([lighteval](https://huggingface.co/docs/lighteval/metric-list)). Check which variant a reported number uses.

**When to use it.** EM for short answers with a single correct form, such as GSM8K, MATH or AIME final answers. F1 when wording varies, as in extractive question answering.

## Reference-overlap and similarity metrics: useful baselines, weak judges

These metrics compare a model's output with one or more human-written references. They are cheap and reproducible, but they reward resemblance to the reference rather than correctness.

### 4. BLEU

**What it measures.** How many of the candidate's word n-grams (sequences of 1 to 4 words) appear in the reference translations.

**How it is computed.** BLEU uses modified n-gram precision: it **clips** each candidate n-gram count to the maximum count in any single reference, so the candidate "the the the the the the the" earns 2/7, not 7/7. Then

$$
\text{BLEU} = \text{BP} \cdot \exp\Big(\sum_{n=1}^{N} w_n \log p_n\Big)
$$

with $N = 4$ and uniform weights. The brevity penalty is $\text{BP} = e^{1 - r/c}$ when the candidate corpus length $c$ is no longer than the effective reference length $r$, and 1 otherwise. BP is computed **over the whole corpus**, not per sentence ([Papineni et al. 2002](https://aclanthology.org/P02-1040.pdf)).

**Worked example.** With $c = 12$ and $r = 15$, $\text{BP} = e^{-0.25} \approx 0.779$. Every precision is scaled down by about 22%.

**Limitations.** More references raise scores: in the original paper, one human translator scored 0.3468 against four references and 0.2571 against two ([Papineni et al.](https://aclanthology.org/P02-1040.pdf)). Implementations differ, so report BLEU through **SacreBLEU**, which scores detokenized text and prints a reproducibility signature such as `BLEU|nrefs:1|case:mixed|eff:no|tok:13a|smooth:exp|version:2.0.0` ([sacrebleu](https://github.com/mjpost/sacrebleu)). In lighteval, `bleu` is corpus SacreBLEU but `bleu_4` is averaged sentence-level NLTK BLEU, a different quantity ([lighteval](https://huggingface.co/docs/lighteval/metric-list)). The WMT22 metrics task, titled "Stop Using BLEU", found that overlap metrics "correlate poorly with human ratings" compared with neural metrics ([Freitag et al. 2022](https://aclanthology.org/2022.wmt-1.2)). The Codex paper warned that BLEU gains "may not indicate improved rates of functional correctness" for code ([Chen et al. 2021](https://ar5iv.labs.arxiv.org/html/2107.03374)).

**When to use it.** Only for translation, and mainly for comparison with past results.

### 5. ROUGE-1, ROUGE-2 and ROUGE-L

**What it measures.** How much of a reference summary's wording appears in a generated summary.

**How it is computed.** ROUGE-N is recall-oriented: matched n-grams divided by the total n-grams in the reference. ROUGE-L uses the longest common subsequence (LCS):

$$
F_{lcs} = \frac{(1 + \beta^2)\, R_{lcs} P_{lcs}}{R_{lcs} + \beta^2 P_{lcs}}
$$

In the DUC evaluations, $\beta$ was set very large, so only recall counted ([Lin 2004](https://aclanthology.org/W04-1013.pdf)). Modern libraries usually report F1 ($\beta = 1$). `rougeLsum` refers to the summary-level union-LCS.

**Worked example ($\beta = 1$).** Reference "the cat sat on the mat", candidate "the cat on the mat". All five candidate words match, so ROUGE-1 F1 ≈ 0.909. Three of the five reference bigrams match, out of four candidate bigrams, so ROUGE-2 F1 ≈ 0.667. The LCS is five words long, so ROUGE-L F1 ≈ 0.909.

**Limitations.** In G-Eval's SummEval table, Spearman correlation with human judgments was only **0.192 for ROUGE-1, 0.205 for ROUGE-2 and 0.165 for ROUGE-L** ([Liu et al. 2023](https://ar5iv.labs.arxiv.org/html/2303.16634)).

**When to use it.** As a cheap summarization baseline. Never as the headline quality signal.

### 6. METEOR

**What it measures.** Translation quality with more credit for recall and for synonyms than BLEU gives.

**How it is computed.** METEOR aligns unigrams in stages (exact match, then Porter stem, then WordNet synonym) and weights recall heavily:

$$
F_{mean} = \frac{10PR}{R + 9P}, \quad \text{Penalty} = 0.5 \left(\frac{\text{chunks}}{\text{matched unigrams}}\right)^3, \quad \text{Score} = F_{mean}(1 - \text{Penalty})
$$

([Banerjee & Lavie 2005](https://aclanthology.org/W05-0909.pdf)).

**Worked example (the paper's sentence pair).** "the president spoke to the audience" against "the president then spoke to the audience" has 6 matches in 2 chunks. $P = 1$, $R \approx 0.857$, $F_{mean} \approx 0.870$, penalty ≈ 0.0185 and score ≈ 0.853.

**Limitations.** On DARPA/TIDES 2003 data, METEOR reached a system-level Pearson correlation of **0.964** with human judgments, against 0.941 for recall alone, but the authors admit the parameters "have not yet been trained to be optimal" ([Banerjee & Lavie](https://aclanthology.org/W05-0909.pdf)). Only the 2005 formula is verified here; modern variants and NLTK defaults differ.

**When to use it.** When recall and synonymy matter in translation-style tasks.

### 7. chrF and chrF++

**What it measures.** Overlap of character n-grams, which makes it robust to word endings and tokenization.

**How it is computed.** Precision and recall are averaged over character 1- to 6-grams, then combined:

$$
\text{chrF}_\beta = \frac{(1 + \beta^2)\, \text{chrP} \cdot \text{chrR}}{\beta^2 \cdot \text{chrP} + \text{chrR}}
$$

Popović's original paper favored $\beta = 3$ ([Popović 2015](https://aclanthology.org/W15-3049.pdf)). **SacreBLEU's default is $\beta = 2$**, and adding word bigrams (word order 2) gives chrF++ ([sacrebleu](https://github.com/mjpost/sacrebleu)). lm-evaluation-harness added chrF++ in v0.4.13 ([releases](https://github.com/EleutherAI/lm-evaluation-harness/releases)).

**Worked example.** chrP = 0.6, chrR = 0.8 and $\beta = 2$ give $(5 \times 0.48)/(2.4 + 0.8) = 2.4/3.2 = 0.75$.

**Limitations.** WMT22 groups chrF with the overlap metrics that neural metrics beat ([Freitag et al. 2022](https://aclanthology.org/2022.wmt-1.2)). Scores change with $\beta$.

**When to use it.** For translation, especially into morphologically rich languages. Always state $\beta$.

### 8. BERTScore and embedding cosine similarity

**What it measures.** Semantic similarity between candidate and reference, so paraphrases get credit that n-gram metrics deny.

**How it is computed.** BERTScore embeds the tokens of both texts with a contextual model and greedily matches each token to its most similar counterpart by cosine similarity. Recall averages the best match for each reference token $x_i$, precision the best match for each candidate token $\hat{x}_j$:

$$
R_{\text{BERT}} = \frac{1}{|x|}\sum_{x_i \in x} \max_{\hat{x}_j \in \hat{x}} \cos(x_i, \hat{x}_j), \quad P_{\text{BERT}} = \frac{1}{|\hat{x}|}\sum_{\hat{x}_j \in \hat{x}} \max_{x_i \in x} \cos(x_i, \hat{x}_j), \quad F_{\text{BERT}} = \frac{2PR}{P + R}
$$

Optional IDF weighting downweights common words. Baseline rescaling, $\hat{R} = (R - b)/(1 - b)$, only makes scores easier to read; it does not change rankings ([Zhang et al. 2019](https://ar5iv.labs.arxiv.org/html/1904.09675)). Sentence-level cosine similarity, $a \cdot b / (\lVert a \rVert \lVert b \rVert)$, is the coarser version of the same idea.

**Worked example (illustrative similarities).** A 2-token reference and a 3-token candidate with cosine rows [0.9, 0.2, 0.3] and [0.1, 0.8, 0.4] give $R = (0.9 + 0.8)/2 = 0.85$, $P = (0.9 + 0.8 + 0.4)/3 = 0.70$ and $F_1 \approx 0.768$. For sentence vectors (1, 2, 2) and (2, 1, 2), cosine similarity is 8/9 ≈ 0.889.

**Limitations.** The package defaults to `roberta-large` for English, its README calls `microsoft/deberta-xlarge-mnli` the best model, and in its example rescaling moves F1 from 0.959 to 0.759 ([bert_score](https://github.com/Tiiiger/bert_score)). Scores shift with the model and layer, so pin both. BERTScore beats n-grams (Kendall τ 0.550 against BLEU's 0.415 at WMT18 segment level, per [Zhang et al.](https://ar5iv.labs.arxiv.org/html/1904.09675)), but on SummEval it reached only **ρ = 0.225**, far below G-Eval's 0.514 ([Liu et al. 2023](https://ar5iv.labs.arxiv.org/html/2303.16634)). Describe it as "better than overlap", not "close to human".

**When to use it.** For paraphrase-tolerant reference scoring when you have good references, with the model and layer pinned.

## Execution, calibration and retrieval metrics: correctness over resemblance

### 9. pass@k

**What it measures.** The probability that at least one of k sampled programs passes the unit tests.

**How it is computed.** Computing it from exactly k samples has high variance. Chen et al. generate **n ≥ k samples (n = 200)**, count the c correct ones and use an unbiased estimator:

$$
\text{pass@}k = \mathbb{E}\left[1 - \frac{\binom{n-c}{k}}{\binom{n}{k}}\right]
$$

The paper gives a numerically stable product form, $1 - \prod_{j=n-c+1}^{n}(1 - k/j)$, and shows that the naive $1 - (1 - \hat{p})^k$ systematically underestimates ([Chen et al. 2021](https://ar5iv.labs.arxiv.org/html/2107.03374)).

**Worked example.** With n = 10 and c = 3, pass@1 = 0.30. pass@5 = $1 - 21/252 \approx 0.917$, while the naive formula gives 0.832.

**Two Codex figures that must stay separate.** HumanEval has 164 problems with an average of 7.7 tests each. For Codex-12B, the paper's **Table 1** reports pass@1 = 28.81% and **pass@100 = 72.31%**. Separately, the paper's **abstract** says repeated sampling solved **70.2%** of problems with 100 samples. The two do not match, and the 70.2% is probably a separate measurement, so cite each in its own context ([Chen et al. 2021](https://ar5iv.labs.arxiv.org/html/2107.03374)).

**Limitations.** pass@k assumes you can check every candidate. That works in a benchmark and is unrealistic for a user who gets one answer. HumanEval itself is now saturated (see the 2026 section below).

**When to use it.** pass@1 for user-facing quality, pass@k for search-and-verify systems. Use the unbiased estimator, never the naive one.

### 10. Calibration: ECE, MCE and Brier score

**What it measures.** Whether a model's stated confidence matches how often it is right: $P(\text{correct} \mid \text{confidence} = p) = p$.

**How it is computed.** Predictions are grouped into bins by confidence (Guo et al. used **M = 15** bins). Expected calibration error (ECE) is the weighted average gap between accuracy and confidence; maximum calibration error (MCE) is the worst bin's gap:

$$
\text{ECE} = \sum_{m=1}^{M} \frac{|B_m|}{n} \left| \text{acc}(B_m) - \text{conf}(B_m) \right|
$$

Guo et al. found that "modern neural networks are no longer well-calibrated" and proposed temperature scaling, a one-parameter fix that leaves accuracy unchanged ([Guo et al. 2017](https://ar5iv.labs.arxiv.org/html/1706.04599)). The Brier score is the mean squared error between predicted probability and outcome:

$$
\text{Brier} = \frac{1}{N}\sum_{i=1}^{N} (f_i - o_i)^2
$$

**Worked example.** Four predictions at mean confidence 0.65 with 2 correct, and six at 0.95 with 5 correct, give ECE = 0.4 × 0.15 + 0.6 × 0.117 ≈ 0.13. Forecasts 0.9, 0.6 and 0.2 with outcomes 1, 0 and 0 give a binary Brier score of (0.01 + 0.36 + 0.04)/3 ≈ 0.137. The harness's multi-class form sums over classes, so it doubles that for binary tasks ([lm-evaluation-harness](https://raw.githubusercontent.com/EleutherAI/lm-evaluation-harness/main/lm_eval/api/metrics.py)).

**Limitations.** Brier is a proper scoring rule that mixes calibration with other components, so it is **not a pure calibration measure**. ECE is sensitive to the number of bins (rank correlation across bin counts is 0.37, against 0.59 for adaptive binning), and over- and under-confidence can cancel inside a bin ([Nixon et al. 2019](https://ar5iv.labs.arxiv.org/html/1904.01685)).

**When to use it.** Whenever a system abstains, escalates or shows confidence to users. It matters for frontier models: HLE reports calibration error alongside accuracy ([HLE paper](https://arxiv.org/abs/2501.14249)), and the SimpleQA authors found models "consistently overstate their confidence" ([Wei et al.](https://arxiv.org/html/2411.04368)).

### 11. Retrieval ranking: precision@k, recall@k, MRR and nDCG

**What it measures.** Whether a retriever puts relevant documents near the top. These classic information-retrieval metrics need relevance labels but no LLM.

**How it is computed.** Precision@k is the number of relevant items in the top k divided by k ([Ragas docs](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_precision/)). Recall@k is the number of relevant items in the top k divided by all relevant items, which matches Ragas's ID-based context recall ([Ragas docs](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_recall/)). Normalized discounted cumulative gain divides the gain of the actual ranking by that of the ideal ranking ([Wikipedia: DCG](https://en.wikipedia.org/wiki/Discounted_cumulative_gain)):

$$
\text{DCG}_p = \sum_{i=1}^{p} \frac{rel_i}{\log_2(i + 1)}, \quad \text{nDCG}_p = \frac{\text{DCG}_p}{\text{IDCG}_p}
$$

lighteval ships `recall_at_k` and `mrr` ([lighteval](https://huggingface.co/docs/lighteval/metric-list)). Mean reciprocal rank (MRR) is conventionally the mean over queries of 1 divided by the rank of the first relevant result. We did not verify that textbook formula against a primary source.

**Worked example.** Binary relevance [1, 0, 1] in the top 3 gives DCG = 1 + 0 + 0.5 = 1.5. The ideal order [1, 1, 0] gives IDCG = 1 + 0.631 = 1.631, so nDCG@3 ≈ 0.92.

**Limitations.** nDCG does not penalize bad documents ([1, 1, 1] and [1, 1, 1, 0] score the same) and handles partial judgments poorly ([Wikipedia: DCG](https://en.wikipedia.org/wiki/Discounted_cumulative_gain)). None of these metrics checks whether the generator actually used what was retrieved.

**When to use it.** To tune retrievers and rerankers when labeled data exists.

## RAG and factuality metrics: claim-level checks

Most retrieval-augmented generation (RAG) and factuality metrics share one recipe: split text into claims, verify each claim against a source and report a ratio. Ragas, DeepEval and TruLens converge on three checks: are the retrieved chunks relevant, is the answer supported by them, and does it answer the question ([TruLens RAG triad](https://www.trulens.org/getting_started/core_concepts/rag_triad/)). The differences hide in how strictly each tool verifies a claim.

### 12. Context precision and context recall (Ragas)

**What it measures.** Retrieval quality without hand labels: an LLM judges which retrieved chunks are relevant.

**How it is computed.** Context precision is effectively average precision over the top K chunks, where $v_k$ is 1 if the chunk at rank k is relevant ([Ragas docs](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_precision/)):

$$
\text{Context Precision@}K = \frac{\sum_{k=1}^{K} \left(\text{Precision@}k \times v_k\right)}{\text{relevant items in the top } K}
$$

Context recall splits the *reference answer* into claims and scores the share supported by the retrieved context ([Ragas docs](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_recall/)).

**Worked example.** Relevance [1, 0, 1] gives $(1 \times 1 + 0 + \tfrac{2}{3} \times 1)/2 \approx 0.833$.

**Limitations.** The variants judge relevance differently: an LLM checking against a reference answer, an LLM checking against the generated response (ContextUtilization), Levenshtein string matching or pure ID matching. That choice changes the number. In the original Ragas paper, context relevance was the hardest dimension for the LLM to judge, with pairwise accuracy against humans of only 0.70 ([Es et al.](https://arxiv.org/html/2309.15217v2)).

**When to use it.** The ID-based variants when you have gold chunk IDs; the LLM variants for quick iteration without labels.

### 13. Faithfulness and groundedness

**What it measures.** Whether every claim in a RAG answer is supported by the retrieved context.

**How it is computed.** An LLM extracts the claims from the response and checks whether each "can be inferred" from the context ([Ragas docs](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness/)):

$$
\text{Faithfulness} = \frac{\text{supported claims}}{\text{total claims}}
$$

Ragas's `FaithfulnesswithHHEM` swaps the LLM verifier for Vectara's T5-based HHEM-2.1-Open classifier. DeepEval uses the same ratio but counts a claim as truthful if it **does not contradict** the context, a looser test than Ragas's inference standard. Its small-model "System One" mode is not directly comparable with its LLM mode ([DeepEval docs](https://deepeval.com/docs/metrics-faithfulness)). TruLens calls the same idea groundedness ([TruLens](https://www.trulens.org/getting_started/core_concepts/rag_triad/)).

**Worked example.** An answer with two claims, one of them supported by the context, scores 1/2 = 0.5.

**Limitations.** On the 50-page WikiEval set, Ragas faithfulness agreed with humans 95% of the time pairwise, against 72% for a GPT-score baseline ([Es et al.](https://arxiv.org/html/2309.15217v2)). But splitting text into finer or coarser claims changes the score, and scores from different tools are not comparable even when the names match. Above all, **groundedness is not truth**: an answer that faithfully repeats a wrong document scores 1.0.

**When to use it.** As the main hallucination guard for RAG, pinned to one tool, version and judge.

### 14. Answer relevancy

**What it measures.** Whether the answer addresses the question that was asked, penalizing off-topic, incomplete or redundant answers.

**How it is computed.** An LLM writes N questions that the response would answer (default 3). The score is the mean cosine similarity between the embeddings of those questions, $E_{g_i}$, and of the user's actual question, $E_o$ ([Ragas docs](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/answer_relevance/)):

$$
\text{score} = \frac{1}{N}\sum_{i=1}^{N} \cos(E_{g_i}, E_o)
$$

The original paper used text-embedding-ada-002 and showed the metric penalizes incomplete or redundant answers ([Es et al.](https://arxiv.org/html/2309.15217v2)).

**Limitations.** By design it **does not check factuality**. Because cosine similarity ranges from −1 to 1, scores outside 0 to 1 are possible.

**When to use it.** Together with faithfulness, never alone. DeepEval notes a useful diagnostic: high relevancy with low faithfulness means the model is answering from its own knowledge rather than the evidence ([DeepEval docs](https://deepeval.com/docs/metrics-faithfulness)).

### 15. Summarization hallucination rate (Vectara HHEM leaderboard)

**What it measures.** How often a model adds unsupported content when asked to summarize a document using only its facts.

**How it is computed.** Each model summarizes documents at temperature 0 where supported. The HHEM-2.3 classifier scores factual consistency, and

$$
\text{hallucination rate} = 100\% - \text{factual consistency rate}
$$

An "answer rate" records how often the model summarized rather than refused ([Vectara leaderboard](https://github.com/vectara/hallucination-leaderboard)).

**Example from the leaderboard.** The board was updated on 22 October 2026 with a private dataset of more than 7,700 articles. The top five range from **1.8% (antgroup/finix_s1_32b) to 4.1% (Llama-3.3-70B-Instruct-Turbo)** ([Vectara leaderboard](https://github.com/vectara/hallucination-leaderboard)).

**Limitations.** The authors list them: results depend on HHEM agreeing with humans; a purely extractive copy would score perfectly, because the benchmark measures consistency, not summary quality; it misses some forms of hallucination; and it is English-only. Those low single-digit rates **apply only to short grounded summaries**, not to hallucination in general.

**When to use it.** To compare models for grounded summarization and document question-answering products.

### 16. FActScore

**What it measures.** The factual precision of long-form text such as biographies.

**How it is computed.** FActScore splits a generation into atomic facts and reports the **percentage supported by a reliable knowledge source**:

$$
\text{FActScore} = \frac{\text{supported atomic facts}}{\text{all atomic facts}}
$$

Its automated estimator has under 2% error against human evaluation ([Min et al., EMNLP 2023](https://arxiv.org/abs/2305.14251)). It is the long-form counterpart of RAG faithfulness: it checks claims against a knowledge base rather than retrieved context. We did not verify the exact length-penalty term or the default knowledge source.

**Example from the paper.** At publication, **ChatGPT scored 58%** on biographies of people ([Min et al.](https://arxiv.org/abs/2305.14251)).

**Limitations.** It measures precision only, so a model can score highly by saying less.

**When to use it.** For biographies, reports and other long factual generations.

### 17. SelfCheckGPT

**What it measures.** Likely hallucinations, without any reference text or access to token probabilities.

**How it is computed.** SelfCheckGPT samples several responses to the same prompt and flags sentences that the samples do not consistently support. The premise is that **known facts recur across samples while hallucinations diverge**. It needs no external database and works at both sentence and passage level ([Manakul et al., EMNLP 2023](https://arxiv.org/abs/2303.08896)). We describe the procedure rather than a single formula.

**Limitations.** It follows from the premise that a model which repeats the same falsehood every time will look consistent. Sampling also multiplies inference cost.

**When to use it.** When there is no reference source and no logit access, for example to monitor the outputs of a closed model.

### 18. SimpleQA: correct, correct given attempted, and F-score

**What it measures.** Short-form factual knowledge stored in the model, and whether the model knows when to abstain.

**How it is computed.** SimpleQA has **4,326 questions, each with a single indisputable answer** (estimated label error about 3%). A prompted classifier grades each answer as correct, incorrect or not attempted. The metrics are overall correct, correct given attempted, and their harmonic mean as an F-score ([Wei et al., arXiv 2411.04368](https://arxiv.org/html/2411.04368)):

$$
F = \frac{2 \cdot \text{correct} \cdot \text{correct given attempted}}{\text{correct} + \text{correct given attempted}}
$$

**Worked example.** 40 correct, 20 incorrect and 40 not attempted out of 100 give overall 0.40, correct given attempted 40/60 ≈ 0.667 and F ≈ 0.50.

**Why abstention matters.** In the paper's table, Claude-3.5 Sonnet had 28.9% correct but 35.0% not attempted, for an F-score of 35.0, while GPT-4o-mini had 8.6% correct ([Wei et al.](https://arxiv.org/html/2411.04368)).

**Limitations.** The authors warn that the **F-score rewards guessing whenever a model is at least 50% confident**. Google DeepMind's **SimpleQA Verified** (1,000 cleaned prompts) addresses noisy labels, topical bias and redundancy; Gemini 2.5 Pro set its state of the art at F1 = 55.6 ([arXiv 2509.07968](https://arxiv.org/abs/2509.07968)). Whether short-form factuality predicts long-form factuality is still an open question.

**When to use it.** Preferably the Verified set, to measure short-form factual recall and abstention behavior.

## Judges and human raters: open-ended quality

### 19. LLM-as-a-judge and G-Eval

**What it measures.** Open-ended quality (helpfulness, coherence, correctness) as rated by a strong model instead of a human.

**How it is computed.** LLM-as-a-judge comes in three forms: **pairwise comparison, single-answer grading and reference-guided grading** ([Zheng et al. 2023](https://arxiv.org/abs/2306.05685)). G-Eval adds three refinements: the judge writes its own evaluation steps from the task criteria, fills in a scores-only form, and reports a probability-weighted score ([Liu et al. 2023](https://arxiv.org/html/2303.16634v3)):

$$
\text{score} = \sum_i p(s_i) \cdot s_i
$$

**Worked example.** If the judge gives probabilities 0.2, 0.5 and 0.3 to scores 3, 4 and 5, the score is 0.6 + 2.0 + 1.5 = 4.1, rather than a tied integer.

**How well it agrees with humans.** G-Eval-4 reached Spearman 0.514 on SummEval, against 0.474 for the best earlier method (UniEval). The often-quoted "over 80% agreement" with humans is the **no-tie setting**. On MT-Bench, GPT-4 agreed with experts 85% of the time without ties and 66% with ties, against human-human figures of 81% and 63% ([Zheng et al., Table 5](https://arxiv.org/abs/2306.05685)).

**Limitations.** The biases are well documented. Under position swapping, GPT-4 was consistent only **65.0%** of the time, and Claude-v1 23.8%. A padded "repetitive list" attack fooled Claude-v1 and GPT-3.5 91.3% of the time, and GPT-4 8.7%. On math questions it could solve itself, GPT-4 still misjudged 14 of 20 graded answers with the default prompt, against 3 of 20 with reference-guided grading ([Zheng et al.](https://arxiv.org/abs/2306.05685)). Models can recognize their own outputs, and self-recognition correlates with self-preference ([Panickssery et al. 2024](https://arxiv.org/abs/2404.13076)). Across 13 judges, Thakur et al. found that only the largest approached human alignment, all were lenient, and percent agreement alone is "insufficient" ([Thakur et al. 2024](https://arxiv.org/abs/2406.12624)). Most of these numbers come from 2023–2024 judges; we found no verified 2026 study that re-measures them on frontier judges.

**When to use it, and how.** For open-ended quality at scale, with each bias's documented mitigation:

- Run both answer orders and declare a win only if they agree.
- Give the judge a reference answer or ask for step-by-step reasoning on reasoning tasks.
- Use explicit rubrics.
- Use a **panel of LLM evaluators (PoLL) from different model families**, which beat a single large judge across six datasets at "over seven times less" cost ([Verga et al. 2024](https://arxiv.org/abs/2404.18796)).
- Re-validate against human labels whenever the judge model or prompt changes (see metric 21).

### 20. Preference ratings: Elo, Bradley-Terry, win rate and length-controlled win rate

**What it measures.** Which of two models people (or a judge) prefer, aggregated into a ranking.

**How it is computed.** Arena leaderboards started with the Elo system ([Wikipedia: Elo](https://en.wikipedia.org/wiki/Elo_rating_system)):

$$
E_A = \frac{1}{1 + 10^{(R_B - R_A)/400}}, \quad R'_A = R_A + K(S_A - E_A)
$$

Because online Elo depends on the order of battles, Chatbot Arena switched in December 2023 to **maximum-likelihood Bradley-Terry** over the full battle history, with bootstrapped confidence intervals ([LMSYS, December 2023](https://lmsys.org/blog/2023-12-07-leaderboard/)):

$$
P(m \text{ beats } m') = \sigma(\beta_m - \beta_{m'})
$$

In August 2024 it added **style control**: covariates for length, headers, bold text and lists. Length had the largest effect (coefficient 0.249), and rankings moved; grok-2-mini fell from 6th to 18th ([LMSYS style control](https://lmsys.org/blog/2024-08-28-style-control/)). AlpacaEval 2.0 applies the same idea to win rate against a GPT-4 Turbo baseline. It fits a model that includes a length term, and the **length-controlled (LC) win rate** sets that term to zero. This cut the swing caused by verbosity prompts from 22.9–64.3% to 41.9–51.6%, and raised correlation with Chatbot Arena from 0.94 to 0.98 ([Dubois et al. 2024](https://arxiv.org/html/2404.04475)).

**Worked example.** A 1600-rated model facing a 1500-rated one has $E \approx 0.64$, so with K = 32 a win adds about 11.5 points.

**Limitations.** Human-vote leaderboards face a validity dispute. "The Leaderboard Illusion" alleges undisclosed private testing (Meta tested 27 variants before Llama 4) and unequal sampling ([Singh et al. 2025](https://arxiv.org/abs/2504.20879)). Arena replied that its policy was public, that the simulated boost is about +11 points in practice, and that a 112% figure came from the static Arena-Hard benchmark, not human votes. It promised "provisional" labels until a model has 2,000 fresh votes ([Arena response](https://arena.ai/blog/our-response)).

**When to use it.** To rank chat models on open-ended quality. Read the ratings as style-sensitive and contested, and check the confidence intervals before treating close ranks as real.

### 21. Inter-rater agreement: Cohen's kappa and Krippendorff's alpha

**What it measures.** How much raters (human or LLM) agree beyond what chance would produce. Raw percent agreement inflates alignment.

**How it is computed.** Cohen's kappa compares observed agreement $p_o$ with the agreement $p_e$ expected by chance from each rater's label frequencies. Fleiss' kappa extends it to more than two raters ([Wikipedia: Cohen's kappa](https://en.wikipedia.org/wiki/Cohen%27s_kappa)). Krippendorff's alpha compares observed disagreement $D_o$ with expected disagreement $D_e$; it handles any number of raters, missing data and ordinal or interval scales ([Wikipedia: Krippendorff's alpha](https://en.wikipedia.org/wiki/Krippendorff%27s_alpha)):

$$
\kappa = \frac{p_o - p_e}{1 - p_e}, \quad \alpha = 1 - \frac{D_o}{D_e}
$$

**Worked example.** Two raters label 100 items. They agree on 40 "yes" and 30 "no"; rater A says yes 50 times and rater B 60 times. Then $p_o = 0.70$, $p_e = 0.5 \times 0.6 + 0.5 \times 0.4 = 0.50$ and $\kappa = 0.40$: only "fair", despite 70% raw agreement.

**Limitations.** α ≥ 0.800 is the usual reliability bar, and data below 0.667 are typically discarded ([Wikipedia: Krippendorff's alpha](https://en.wikipedia.org/wiki/Krippendorff%27s_alpha)). The Landis–Koch bands ("fair", "substantial") are opinion-based, and kappa shifts with how common each label is. Human agreement can itself be very low: on one G-Eval subset it was α = 0.07 ([Liu et al.](https://arxiv.org/html/2303.16634v3)). Vendor guides quote κ > 0.6 against human labels as acceptable and > 0.8 as strong, with human audits of 100–300 samples; these are heuristics, not empirical standards ([koji.so](https://www.koji.so/docs/llm-as-a-judge-vs-human-evaluation)).

**When to use it.** Whenever you use human labels or an LLM judge. Report judge–human kappa or alpha next to human–human agreement.

## Agent, safety and production metrics: reliability and trade-offs

### 22. Agent task success, pass^k and the 50% time horizon

**What it measures.** Whether an agent completes multi-step tasks, how reliably it does so across repeated tries, and how long a task (in human time) it can handle.

**How it is computed.** Agent benchmarks score binary task success with execution checkers. tau-bench checks whether the final database state matches the goal. Terminal-Bench 2.0 is all-or-nothing: a task passes only if every test passes ([Inspect Evals](https://ukgovernmentbeis.github.io/inspect_evals/evals/coding/terminal_bench_2)). Because reliability needs more than a mean, tau-bench introduced **pass^k, the probability that the agent succeeds on all k independent trials** of the same task, the mirror image of pass@k ([tau2-bench paper](https://arxiv.org/abs/2506.07982)). If trials are independent with per-trial success $p$:

$$
\text{pass}^k = p^k
$$

METR's time horizon converts success rates into **the length of task, measured in human-expert time, at which a model succeeds 50% of the time**. It fits a logistic curve of success against the logarithm of human task time ([METR TH1.1](https://metr.org/blog/2026-1-29-time-horizon-1-1)).

**Worked example (assuming independent trials).** An agent with a 50% per-trial success rate on a task has $\text{pass}^4 = 0.5^4 \approx 6\%$. That is why the tau2-bench telecom results drop steeply as k rises ([tau2-bench repo](https://github.com/sierra-research/tau2-bench)).

**Example from METR.** In Time Horizon 1.1 (January 2026), Claude Opus 4.5 reached 320 minutes and GPT-5 214 minutes. The doubling time over the whole period is about **196 days**, shortening to 88.6 days since 2024 ([METR](https://metr.org/blog/2026-1-29-time-horizon-1-1)).

**Limitations.** The caveats are large. Opus 4.5's 95% confidence interval spans 170–729 minutes. Only 5 of 31 tasks longer than 8 hours have measured human baselines. GPT-4o and o3 scored higher under METR's earlier Vivaria infrastructure than under Inspect ([METR](https://metr.org/blog/2026-1-29-time-horizon-1-1)). Scaffolds swing results further: a secondary source reports that SWE-bench Pro vendor runs reach 70–80%, against about 23% under Scale's standard harness at launch ([systems-analysis.ru, secondary](https://systems-analysis.ru/eng/SWE-bench_Pro)).

**When to use it.** For tool use, coding agents and computer use. Report success rate with pass^k, the harness, the number of attempts and who ran the evaluation. Treat the time-horizon trend as more reliable than any single model's point estimate.

### 23. Safety: attack success rate, over-refusal and toxicity

**What it measures.** How often attacks make a model produce harmful output, how often it wrongly refuses harmless requests, and how toxic or biased its output is.

**How it is computed.**

$$
\text{ASR} = \frac{\text{attack test cases that elicit the harmful behavior}}{\text{all attack test cases}}, \quad \text{over-refusal rate} = \frac{\text{refused benign prompts}}{\text{all benign prompts}}
$$

HarmBench (510 behaviors) standardizes on greedy decoding and 512-token outputs, because generation length alone shifted substring-based ASR by up to 30%. Its fine-tuned Llama-2-13B judge agrees with humans 93.19% of the time, against 88.37% for GPT-4 ([HarmBench](https://arxiv.org/html/2402.04249)). Over-refusal is measured on benign prompts that look harmful. XSTest's 250 prompts are now too easy, so OR-Bench supplies 80,000 seemingly toxic prompts plus a hard set of about 1,000 ([OR-Bench](https://arxiv.org/html/2405.20947v2)).

**What the research found.** StrongREJECT finds that earlier evaluations **overstated jailbreak effectiveness** and that successful jailbreaks tend to degrade the model's capabilities ([StrongREJECT, arXiv 2402.10260](https://arxiv.org/abs/2402.10260)). OR-Bench found safety and over-refusal correlated at **Spearman 0.89**: the safest models also refused the most benign requests ([OR-Bench](https://arxiv.org/html/2405.20947v2)). For bias, BBQ contrasts ambiguous and disambiguated contexts; models were up to 3.4 points more accurate when the correct answer matched a stereotype, and over 5 points for gender in most models ([Parrish et al.](https://arxiv.org/abs/2110.08193)).

**Limitations.** ASR depends on the judge, decoding settings, generation length and attack budget, so numbers from different setups are not comparable. For toxicity, **Perspective API stops working after 31 December 2026** ([Perspective API](https://perspectiveapi.com/)). The open-source Detoxify library (v0.5.4, October 2026) is maintained ([PyPI detoxify](https://pypi.org/project/detoxify/)). Teams that switch should re-baseline rather than compare new numbers with old Perspective scores.

**When to use it.** Always pair ASR with over-refusal, and report the judge, decoding settings, generation length and attack budget.

### 24. Latency and throughput: TTFT, ITL, TPS and RPS

**What it measures.** How fast a deployed model responds and how much load it can serve.

**How it is computed.** Using NVIDIA's definitions ([NVIDIA NIM metrics](https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html)):

- **Time to first token (TTFT):** time from the request to the first non-empty token.
- **End-to-end latency** = TTFT + generation time.
- **Inter-token latency (ITL, also TPOT)** = (end-to-end latency − TTFT) / (output tokens − 1).
- **Per-user tokens per second (TPS)** = output tokens / end-to-end latency.
- **System TPS and requests per second (RPS)** divide totals by the window from the first request to the last response, excluding warmup.

$$
\text{ITL} = \frac{e2e - \text{TTFT}}{\text{output tokens} - 1}
$$

**Worked example.** TTFT 0.5 s, end-to-end 5.5 s and 501 output tokens give ITL = 5.0/500 = 10 ms and per-user TPS = 501/5.5 ≈ 91.

**Limitations.** Tools define these metrics differently, so compare numbers across tools only when the definitions match. We did not retrieve a primary source on p95/p99 reporting conventions or cost-per-task methodology.

**When to use it.** For capacity planning and service-level agreements. Track it alongside quality, because a quality gain that triples latency can be a net loss.

### 25. Error bars and prompt-format spread

**What it measures.** How much of a reported score is signal and how much is noise from the question sample, the prompt format and the harness.

**How it is computed.** Evan Miller's "Adding Error Bars to Evals" treats questions as draws from a larger population. It recommends reporting the **standard error of the mean with the question count**, clustering standard errors when questions share a passage, comparing models with **paired question-level differences**, and sizing evals with power analysis ([Miller 2024](https://arxiv.org/abs/2411.00640)). For an accuracy $\hat{p}$ on $n$ questions, the standard binomial standard error and 95% interval are:

$$
\text{SE} = \sqrt{\frac{\hat{p}(1 - \hat{p})}{n}}, \quad \text{95\% CI} \approx \hat{p} \pm 1.96\, \text{SE}
$$

Our guide to [probability and statistics concepts for data science](/articles/probability-and-statistics-concepts-for-data-science) explains standard error and confidence intervals in more depth.

**Worked example.** 80% accuracy on 500 questions has SE = √(0.8 × 0.2 / 500) ≈ 1.8 points, a 95% interval of about **±3.5 points**. Many leaderboard gaps fall inside it.

**Prompt format and harness versions.** Meaning-preserving format changes moved LLaMA-2-13B's few-shot accuracy by **up to 76 points**, and the sensitivity persisted with scale and instruction tuning. FormatSpread reports a performance interval across plausible formats ([Sclar et al. 2023](https://arxiv.org/abs/2310.11324)). Harness versions matter too: lm-evaluation-harness v0.4.13 fixed group standard errors that were up to about 3 times too narrow, and a few-shot leak that "may shift previously reported numbers" ([releases](https://github.com/EleutherAI/lm-evaluation-harness/releases)).

**Limitations.** Error bars cover sampling noise, not a biased benchmark or a contaminated test set.

**When to use it.** Everywhere. A score without an interval and a pinned configuration is an anecdote.

## LLM evaluation in 2026: saturated benchmarks and shifting tools

### Benchmarks saturate in one to two years

The benchmarks these metrics run on changed sharply. Coverage of the **Stanford AI Index 2026** reports that nearly half of leading companies' evaluations show saturation, defined as "loss of reliable discriminative power among top-performing models". It also reports GPQA scores around 93%, above the 81.2% expert baseline, and that hiding test data did not protect against saturation. We read a summary, not the primary report ([CloudTweaks summary, secondary](https://cloudtweaks.com/2026/05/standford-2026-ai-index/)).

- **No longer separating frontier models:** MMLU, GSM8K, HumanEval, MATH and simple needle-in-a-haystack tests. RULER replaced simple needle retrieval with multi-hop and aggregation tasks ([RULER](https://arxiv.org/abs/2404.06654)). SimpleQA Verified's authors describe TriviaQA, Natural Questions and TruthfulQA as saturated ([arXiv 2509.07968](https://arxiv.org/abs/2509.07968)).
- **SWE-bench Verified retired by OpenAI.** On **23 February 2026 OpenAI stopped reporting SWE-bench Verified**. An audit of a frequently failed subset found that at least 59.4% of problems had tests that rejected correct solutions, and contamination from public repositories was also a concern. OpenAI recommends SWE-bench Pro instead ([The Decoder](https://the-decoder.com/openai-wants-to-retire-the-ai-coding-benchmark-that-everyone-has-been-competing-on/)). SWE-bench Pro has 1,865 tasks from copyleft and private codebases ([Harbor hub](https://hub.harborframework.com/datasets/scale-ai/swe-bench-pro)), though a secondary report cites an unverified audit claiming about a third of its trials were mis-graded ([aiweekly](https://aiweekly.co/alerts/openai-drops-swe-bench-verified-backs-pro-after-flaw-audit)).
- **OSWorld human baseline passed.** Agents passed OSWorld's 72.4% human baseline in 2026, with figures that are self-reported or from aggregators that disagree on the leader ([buildmvpfast, secondary](https://www.buildmvpfast.com/blog/osworld-benchmark-ai-agents-passed-human-baseline-2026)).

### The replacements are harder, refreshed or interactive

- **Humanity's Last Exam** (2,500 public questions, published in *Nature* in 2026) now has a rolling version. A FutureHouse investigation found roughly 30% of its chemistry and biology answers questionable, which prompted HLE-Verified ([Wikipedia: HLE](https://en.wikipedia.org/wiki/Humanity%27s_Last_Exam); [HLE-Verified](https://arxiv.org/abs/2602.13964)). Artificial Analysis figures relayed by Wikipedia put the top text-only HLE score at 61.4% (Claude Opus 5.5) as of 23 October 2026; we did not verify that figure at the primary source.
- **ARC-AGI-3** launched on 25 March 2026 as an interactive game benchmark with no stated rules. At launch, humans scored 100% and frontier AI 0.51%. ARC Prize 2026 results are due on 4 December 2026 ([ARC Prize](https://arcprize.org/blog/arc-agi-3-launch)).
- **Terminal-Bench 2.0**'s 89 containerized tasks left frontier agents below 65% ([arXiv 2601.11868](https://arxiv.org/pdf/2601.11868)).
- **LiveBench** replaces about a sixth of its questions each month ([arXiv 2605.17273](https://arxiv.org/pdf/2605.17273)), and **LiveCodeBench** scores only problems published after a model's training cutoff ([LiveCodeBench](https://arxiv.org/abs/2403.07974)).

For background on the models these benchmarks compare, see our guide to [the 20 most important LLMs](/articles/important-llms-explained).

### The tooling map shifted

| Tool | Status in 2026 | Source |
|---|---|---|
| OpenAI Evals (hosted) | Deprecation announced 3 June; read-only from 31 October; **shuts down 30 November 2026**; the migration path is Promptfoo | [OpenAI deprecations](https://developers.openai.com/api/docs/deprecations) |
| Promptfoo | OpenAI announced its acquisition on 9 March 2026; still MIT-licensed; release 0.125.1 (25 October) | [OpenAI](https://openai.com/index/openai-to-acquire-promptfoo/); [GitHub](https://github.com/promptfoo/promptfoo) |
| Perspective API | Active until **31 December 2026**, then discontinued; no migration support | [Perspective API](https://perspectiveapi.com/) |
| Ragas | Repository moved to `vibrantlabsai`; v0.4.3 (13 January); no commits since 24 February 2026; legacy metric API to be removed in 1.0 | [GitHub](https://github.com/vibrantlabsai/ragas); [Ragas docs](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness/) |
| LangSmith SDK | Repository archived 16 October 2026 and split into Python and JavaScript repositories; package names unchanged | [GitHub](https://github.com/langchain-ai/langsmith-sdk) |
| Hugging Face `evaluate` | README recommends LightEval for LLM evaluation | [GitHub](https://github.com/huggingface/evaluate) |
| Inspect (UK AISI) | Very active: v0.3.288 (7 November); inspect_evals offers 200+ evaluations | [GitHub](https://github.com/UKGovernmentBEIS/inspect_ai); [inspect_evals](https://github.com/UKGovernmentBEIS/inspect_evals) |
| lm-evaluation-harness | v0.4.13 (31 August) added chrF++ and fixed standard errors and few-shot leakage | [GitHub](https://github.com/EleutherAI/lm-evaluation-harness) |
| DeepEval, Arize Phoenix, Braintrust, HELM | Active; Phoenix uses the Elastic License 2.0, not Apache | [PyPI deepeval](https://pypi.org/project/deepeval/); [Phoenix LICENSE](https://github.com/Arize-ai/phoenix/blob/main/LICENSE); [PyPI braintrust](https://pypi.org/project/braintrust/); [HELM](https://github.com/stanford-crfm/helm) |
| HarmBench, JailbreakBench, StrongREJECT | Stable artifacts; last updates 2024–2025 | [HarmBench](https://github.com/centerforaisafety/HarmBench); [JailbreakBench](https://github.com/JailbreakBench/jailbreakbench); [strong_reject](https://github.com/dsbowen/strong_reject) |

If you use OpenAI's hosted Evals or Perspective API, plan the migration now and re-baseline your scores on the new tool.

### What is still uncertain

We did not retrieve the primary AI Index 2026 report, the Epoch AI hub or METR's dashboard values after January 2026. Whether the Promptfoo acquisition has closed is unconfirmed. No 2025–2026 study we found re-measures how well BLEU, ROUGE or BERTScore correlate with human judgment on frontier-model outputs, so the correlation figures above date from 2017–2023.

## How to build an LLM evaluation pipeline

The sources above support a handful of concrete practices. How they fit together into a pipeline is our own synthesis, not a single published recommendation.

1. **Build your own versioned test set.** Public benchmark scores date quickly, and labs abandon benchmarks they once championed. A golden set of your real inputs, kept in version control and scored with paired comparisons, outlasts any public leaderboard. Our [advanced prompt engineering guide](/articles/advanced-prompt-engineering-techniques) describes a minimal evaluation set for prompt changes.
2. **Choose metrics by task, using the table above.** Exact match or pass@1 for checkable answers, faithfulness plus answer relevancy for RAG, a validated judge for open-ended text, pass^k for agents, and latency for anything user-facing.
3. **Pair each metric with its counterweight.** Single numbers can be gamed in ways that pairs resist: safety by refusing more, faithfulness by copying the context, win rate by writing longer answers. Report ASR with over-refusal ([OR-Bench](https://arxiv.org/abs/2405.20947)), faithfulness with relevancy, and win rate with length control. These pairings follow from the failure modes documented above; they are not a published standard.
4. **Pin everything.** Fix the judge model and prompt, decoding settings and generation length so results stay comparable, as HarmBench does with greedy decoding and 512-token outputs ([HarmBench](https://arxiv.org/html/2402.04249)). Record the tool and its version: the same metric name from two tools is often two different measurements.
5. **Validate automated judges against people.** Human-validate jailbreak judges, because earlier evaluators overstated jailbreak success ([StrongREJECT](https://arxiv.org/abs/2402.10260)). For quality judges, report judge–human kappa or alpha next to human–human agreement (metric 21).
6. **Report uncertainty.** Give the mean with its standard error and the question count, cluster standard errors for grouped questions, compare models with paired differences, and size the set with a power analysis ([Miller 2024](https://arxiv.org/abs/2411.00640)). Evaluate across several prompt formats rather than one ([Sclar et al. 2023](https://arxiv.org/abs/2310.11324)).
7. **Run it on every change.** A reasonable setup runs the offline set in continuous integration with a test-style framework such as DeepEval, Promptfoo or Inspect, and reports scores with standard errors and paired deltas against the current baseline. In production, add tracing and user feedback (Phoenix, LangSmith or Braintrust) and track TTFT, ITL and TPS with definitions that match across tools ([NVIDIA NIM metrics](https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html)).
8. **Keep eval definitions portable.** Hosted platforms can be retired, as OpenAI Evals shows ([OpenAI deprecations](https://developers.openai.com/api/docs/deprecations)). Keeping tests in code-based form reduces migration risk.

Every reported number should carry a short reporting contract: **tool and version, judge, settings, attempt count, standard error and evaluation date.**

## Key takeaways

The 25 metrics form three layers:

- **Cheap deterministic metrics (1–11)** are reproducible but narrow.
- **Claim-level and judge-based metrics (12–21)** cover open-ended quality and factuality, but they import a judge's biases.
- **Reliability and trade-off metrics (22–25)** decide whether a system can be deployed.

In 2026, the middle and top layers carry most of the weight, and their numbers depend on configuration: judge model, verification threshold, scaffold, decoding length and prompt format. Identical metric names from different tools are not the same measurement. Measure with your own versioned test set, pair every metric with its counterweight, and put an error bar on every number.

## Further reading on BlogAI

- [30 breakthroughs behind modern LLMs](/articles/llm-breakthroughs) explains cross-entropy, attention and the other techniques these metrics evaluate.
- [20 most important LLMs explained](/articles/important-llms-explained) covers the models that appear on today's leaderboards.
- [10 advanced prompt engineering techniques](/articles/advanced-prompt-engineering-techniques) shows how evaluation sets drive prompt optimization.
- [Probability and statistics concepts for data science](/articles/probability-and-statistics-concepts-for-data-science) covers the standard errors and confidence intervals behind metric 25.

## References

Papers, documentation and repositories used for this guide, grouped by topic. Tool statuses are as of 7 November 2026.

**Statistical and reference metrics**

- EleutherAI. [lm-evaluation-harness metrics.py](https://raw.githubusercontent.com/EleutherAI/lm-evaluation-harness/main/lm_eval/api/metrics.py), [release notes](https://github.com/EleutherAI/lm-evaluation-harness/releases) and [blog post on multiple-choice normalization](https://blog.eleuther.ai/multiple-choice-normalization/).
- Hugging Face. [lighteval metric list](https://huggingface.co/docs/lighteval/metric-list).
- Gao et al. (2020). [The Pile](https://ar5iv.labs.arxiv.org/html/2101.00027).
- [MMLU-Redux, arXiv 2406.04127](https://arxiv.org/abs/2406.04127).
- [SQuAD v2.0 official evaluation script](https://raw.githubusercontent.com/rajpurkar/SQuAD-explorer/master/evaluate-v2.0.py).
- Papineni et al. (2002). [BLEU](https://aclanthology.org/P02-1040.pdf); [SacreBLEU](https://github.com/mjpost/sacrebleu).
- Freitag et al. (2022). [WMT22 metrics shared task](https://aclanthology.org/2022.wmt-1.2).
- Lin (2004). [ROUGE](https://aclanthology.org/W04-1013.pdf).
- Banerjee and Lavie (2005). [METEOR](https://aclanthology.org/W05-0909.pdf).
- Popović (2015). [chrF](https://aclanthology.org/W15-3049.pdf).
- Zhang et al. (2019). [BERTScore](https://ar5iv.labs.arxiv.org/html/1904.09675); [bert_score package](https://github.com/Tiiiger/bert_score).

**Execution, calibration and retrieval**

- Chen et al. (2021). [Codex and HumanEval paper](https://ar5iv.labs.arxiv.org/html/2107.03374).
- Guo et al. (2017). [On calibration of modern neural networks](https://ar5iv.labs.arxiv.org/html/1706.04599).
- Nixon et al. (2019). [Measuring calibration in deep learning](https://ar5iv.labs.arxiv.org/html/1904.01685).
- [Humanity's Last Exam paper](https://arxiv.org/abs/2501.14249).
- Wikipedia. [Discounted cumulative gain](https://en.wikipedia.org/wiki/Discounted_cumulative_gain).

**RAG and factuality**

- Es et al. (2023). [Ragas paper](https://arxiv.org/html/2309.15217v2); Ragas documentation for [context precision](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_precision/), [context recall](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_recall/), [faithfulness](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness/) and [answer relevancy](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/answer_relevance/).
- [DeepEval faithfulness documentation](https://deepeval.com/docs/metrics-faithfulness); [TruLens RAG triad](https://www.trulens.org/getting_started/core_concepts/rag_triad/).
- Vectara. [Hallucination leaderboard](https://github.com/vectara/hallucination-leaderboard).
- Min et al. (2023). [FActScore](https://arxiv.org/abs/2305.14251).
- Manakul et al. (2023). [SelfCheckGPT](https://arxiv.org/abs/2303.08896).
- Wei et al. (2024). [SimpleQA, arXiv 2411.04368](https://arxiv.org/html/2411.04368).
- Google DeepMind. [SimpleQA Verified, arXiv 2509.07968](https://arxiv.org/abs/2509.07968).

**Judges and human evaluation**

- Zheng et al. (2023). [MT-Bench and Chatbot Arena judge study](https://arxiv.org/abs/2306.05685).
- Liu et al. (2023). [G-Eval](https://arxiv.org/html/2303.16634v3).
- Panickssery et al. (2024). [Self-recognition and self-preference in LLM evaluators](https://arxiv.org/abs/2404.13076).
- Thakur et al. (2024). [Study of 13 LLM judges](https://arxiv.org/abs/2406.12624).
- Verga et al. (2024). [Panel of LLM evaluators (PoLL)](https://arxiv.org/abs/2404.18796).
- LMSYS. [leaderboard update, December 2023](https://lmsys.org/blog/2023-12-07-leaderboard/) and [style control, August 2024](https://lmsys.org/blog/2024-08-28-style-control/).
- Dubois et al. (2024). [Length-controlled AlpacaEval](https://arxiv.org/html/2404.04475).
- Singh et al. (2025). [The Leaderboard Illusion](https://arxiv.org/abs/2504.20879); Arena. [Response](https://arena.ai/blog/our-response).
- Wikipedia. [Elo rating system](https://en.wikipedia.org/wiki/Elo_rating_system), [Cohen's kappa](https://en.wikipedia.org/wiki/Cohen%27s_kappa) and [Krippendorff's alpha](https://en.wikipedia.org/wiki/Krippendorff%27s_alpha).
- koji.so. [LLM-as-a-judge vs human evaluation](https://www.koji.so/docs/llm-as-a-judge-vs-human-evaluation) (vendor guide).

**Agents, safety and production**

- [tau2-bench paper](https://arxiv.org/abs/2506.07982) and [repository](https://github.com/sierra-research/tau2-bench).
- METR (January 2026). [Time Horizon 1.1](https://metr.org/blog/2026-1-29-time-horizon-1-1).
- UK AISI. [Inspect Evals: Terminal-Bench 2.0](https://ukgovernmentbeis.github.io/inspect_evals/evals/coding/terminal_bench_2).
- [HarmBench paper](https://arxiv.org/html/2402.04249).
- [StrongREJECT, arXiv 2402.10260](https://arxiv.org/abs/2402.10260).
- [OR-Bench paper](https://arxiv.org/html/2405.20947v2).
- Parrish et al. [BBQ](https://arxiv.org/abs/2110.08193).
- [Perspective API](https://perspectiveapi.com/); [Detoxify on PyPI](https://pypi.org/project/detoxify/).
- NVIDIA. [NIM LLM benchmarking metrics](https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html).
- Miller (2024). [Adding Error Bars to Evals](https://arxiv.org/abs/2411.00640).
- Sclar et al. (2023). [Prompt-format sensitivity and FormatSpread](https://arxiv.org/abs/2310.11324).

**Benchmarks and tooling in 2026**

- CloudTweaks. [Summary of the Stanford AI Index 2026](https://cloudtweaks.com/2026/05/standford-2026-ai-index/) (secondary).
- [RULER](https://arxiv.org/abs/2404.06654).
- The Decoder. [OpenAI wants to retire SWE-bench Verified](https://the-decoder.com/openai-wants-to-retire-the-ai-coding-benchmark-that-everyone-has-been-competing-on/); [Harbor hub: SWE-bench Pro](https://hub.harborframework.com/datasets/scale-ai/swe-bench-pro); [aiweekly](https://aiweekly.co/alerts/openai-drops-swe-bench-verified-backs-pro-after-flaw-audit) (secondary); [systems-analysis.ru](https://systems-analysis.ru/eng/SWE-bench_Pro) (secondary); [buildmvpfast](https://www.buildmvpfast.com/blog/osworld-benchmark-ai-agents-passed-human-baseline-2026) (secondary).
- Wikipedia. [Humanity's Last Exam](https://en.wikipedia.org/wiki/Humanity%27s_Last_Exam); [HLE-Verified, arXiv 2602.13964](https://arxiv.org/abs/2602.13964).
- ARC Prize. [ARC-AGI-3 launch](https://arcprize.org/blog/arc-agi-3-launch).
- [Terminal-Bench 2.0, arXiv 2601.11868](https://arxiv.org/pdf/2601.11868); [LiveBench, arXiv 2605.17273](https://arxiv.org/pdf/2605.17273); [LiveCodeBench](https://arxiv.org/abs/2403.07974).
- OpenAI. [API deprecations](https://developers.openai.com/api/docs/deprecations) and [Promptfoo acquisition announcement](https://openai.com/index/openai-to-acquire-promptfoo/).
- Repositories: [Promptfoo](https://github.com/promptfoo/promptfoo), [Ragas](https://github.com/vibrantlabsai/ragas), [LangSmith SDK](https://github.com/langchain-ai/langsmith-sdk), [Hugging Face evaluate](https://github.com/huggingface/evaluate), [Inspect](https://github.com/UKGovernmentBEIS/inspect_ai), [inspect_evals](https://github.com/UKGovernmentBEIS/inspect_evals), [lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness), [Phoenix license](https://github.com/Arize-ai/phoenix/blob/main/LICENSE), [HELM](https://github.com/stanford-crfm/helm), [HarmBench](https://github.com/centerforaisafety/HarmBench), [JailbreakBench](https://github.com/JailbreakBench/jailbreakbench), [strong_reject](https://github.com/dsbowen/strong_reject).
- PyPI: [deepeval](https://pypi.org/project/deepeval/), [braintrust](https://pypi.org/project/braintrust/).
