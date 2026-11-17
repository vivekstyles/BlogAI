# Reference-based, statistical and task-accuracy metrics for LLM evaluation (as of November 2026)

Scope: perplexity / cross-entropy / bits-per-byte; exact match, accuracy, SQuAD token F1; BLEU (brevity penalty, SacreBLEU), ROUGE-1/2/L, METEOR, chrF; BERTScore and embedding cosine similarity; pass@k; calibration (ECE, Brier). The formulas below were checked against the original papers, either as text extracted from the ACL Anthology PDFs or through the ar5iv HTML versions of the arXiv papers, and against the official code. The worked examples are my own arithmetic using those formulas. They are labelled "worked example" and are not quoted from any source.

## What are the precise definitions and formulas (with original papers)?

### Takeaway
Every metric here has a precise, verifiable definition. Many "gotchas" come from implementation details rather than the headline formula: BLEU's corpus-level brevity penalty and clipping, ROUGE-L's beta, chrF's beta (3 in the original paper, 2 in SacreBLEU), SQuAD's answer normalization, perplexity's dependence on the tokenizer, and the unbiased form of pass@k.

### Cited Findings

#### 1. Perplexity, cross-entropy, bits-per-byte
- In lm-evaluation-harness, perplexity is aggregated as `math.exp(-mean(items))`, where the items are per-example log-likelihoods. This is exp of the mean negative log-likelihood, i.e. exp(cross-entropy in nats). The harness marks it `higher_is_better=False`. — [lm-evaluation-harness metrics.py](https://raw.githubusercontent.com/EleutherAI/lm-evaluation-harness/main/lm_eval/api/metrics.py)
- The harness also has `word_perplexity` and `byte_perplexity`, both using a "weighted_perplexity" aggregation, `math.exp(-weighted_mean(items))`. The log-likelihood is normalized by the number of words or bytes rather than tokens. `bits_per_byte` is `-weighted_mean(items) / math.log(2)`. All three use the `loglikelihood_rolling` output type, i.e. full-document scoring. — [lm-evaluation-harness metrics.py](https://raw.githubusercontent.com/EleutherAI/lm-evaluation-harness/main/lm_eval/api/metrics.py)
- The Pile paper (Gao et al. 2020) defines bits per UTF-8 byte as bpb = (L_T / L_B) · log₂(e^ℓ) = (L_T / L_B) · ℓ / ln 2. Here ℓ is the per-token NLL loss in nats, L_T is the length in tokens and L_B the length in UTF-8 bytes. It reports L_T/L_B = 0.29335 GPT-2 tokens per byte on the Pile. The authors chose bpb because it is independent of the tokenizer, and because counting Unicode "characters" is ambiguous. — [Gao et al. 2020, The Pile (arXiv 2101.00027)](https://ar5iv.labs.arxiv.org/html/2101.00027)
- lighteval exposes `word_perplexity`, `byte_perplexity`, `bits_per_byte`, `log_prob` and `target_perplexity`, the last being perplexity over the multiple-choice options. — [lighteval metric list](https://huggingface.co/docs/lighteval/metric-list)
- **Worked example (own arithmetic):** a model assigns probabilities 0.5, 0.25, 0.5 and 0.125 to the 4 tokens of a text. Total log₂-loss = 1+2+1+3 = 7 bits, so cross-entropy = 1.75 bits/token, or 1.213 nats/token. Perplexity = 2^1.75 = e^1.213 ≈ 3.36, which equals 1 / the geometric mean of the token probabilities. If those 4 tokens cover 10 UTF-8 bytes, bpb = 7 / 10 = 0.70.

#### 2. Exact match, accuracy, token-level F1 (SQuAD)
- The official SQuAD v2.0 script's `normalize_answer` lowercases the text, removes punctuation, removes the articles a/an/the (regex `\b(a|an|the)\b`) and collapses whitespace. `compute_exact` returns `int(normalize_answer(a_gold) == normalize_answer(a_pred))`. — [SQuAD evaluate-v2.0.py](https://raw.githubusercontent.com/rajpurkar/SQuAD-explorer/master/evaluate-v2.0.py)
- `compute_f1` computes F1 over the overlap of the normalized token bags of prediction and gold. If either answer is empty (no-answer), F1 is 1 when both are empty and 0 otherwise. Each question's EM and F1 is the **max over all gold answers**. Unanswerable questions have gold `['']`. — [SQuAD evaluate-v2.0.py](https://raw.githubusercontent.com/rajpurkar/SQuAD-explorer/master/evaluate-v2.0.py)
  - Formula as implemented: common = multiset intersection of tokens; P = |common| / |pred tokens|; R = |common| / |gold tokens|; F1 = 2PR/(P+R). The fetch confirmed the structure and the no-answer branch. The exact Counter-intersection lines were not quoted back to me, but this is the standard script.
- In lm-evaluation-harness, `exact_match` is a `generate_until` metric aggregated by mean, wrapping the HF-evaluate exact_match logic (`predictions == references`, then `np.mean`). Its `f1` metric is a corpus-level sklearn `f1_score` for **multiple-choice** tasks, not SQuAD token F1. — [lm-evaluation-harness metrics.py](https://raw.githubusercontent.com/EleutherAI/lm-evaluation-harness/main/lm_eval/api/metrics.py)
- In the harness, `acc` is the passthrough mean of per-item correctness for `loglikelihood` / `multiple_choice` tasks. The registered metrics also include `acc_norm`, `acc_mutual_info`, `acc_bytes`, `acc_all`, `mcc`, `brier_score`, `bleu`, `chrf`, `chrf++` and `ter`. — [lm-evaluation-harness metrics.py](https://raw.githubusercontent.com/EleutherAI/lm-evaluation-harness/main/lm_eval/api/metrics.py)
- How multiple-choice accuracy is computed:
  - `acc` picks the option with the highest summed continuation log-probability. This biases selection toward shorter options.
  - `acc_norm` divides that sum by the continuation's **byte length**, which is tokenizer-agnostic. EleutherAI says the harness uses this in all multiple-choice tasks.
  - Token-length normalization is what GPT-3 used. The harness does not report it.
  - Unconditional-likelihood normalization (GPT-3 used it for ARC, OpenBookQA and RACE) needs an extra LM call.
  - Source for all of the above: [EleutherAI blog, Multiple Choice Normalization in LM Evaluation](https://blog.eleuther.ai/multiple-choice-normalization/)
- lighteval's `exact_match` is parametrized: it can normalize whitespace, articles and capitalization, and can compare the full string or a prefix or suffix. lighteval also provides `maj_at_k`, a majority vote over k samples, and a word-overlap `f1_score`. For math, both `exact_match` and `maj_at_k` take math-specific normalization that strips LaTeX. — [lighteval metric list](https://huggingface.co/docs/lighteval/metric-list)
- **Worked example (own arithmetic):** gold "the Eiffel Tower", prediction "Eiffel Tower in Paris". After normalization the gold is [eiffel, tower] and the prediction is [eiffel, tower, in, paris]. EM = 0. common = 2, P = 2/4 = 0.5, R = 2/2 = 1.0, F1 = 2·0.5·1/(1.5) ≈ 0.667.

#### 3. BLEU (Papineni et al. 2002)
- **Modified (clipped) n-gram precision.** Count_clip = min(Count, Max_Ref_Count): each candidate n-gram's count is truncated to "the largest count observed in any single reference for that word". The paper's example: candidate "the the the the the the the" against references "The cat is on the mat." and "There is a cat on the mat." gets modified unigram precision **2/7**, even though its standard unigram precision is 7/7. — [Papineni et al. 2002, ACL](https://aclanthology.org/P02-1040.pdf)
- **Brevity penalty.** BP = 1 if c > r; BP = e^(1 − r/c) if c ≤ r. Here c is the total candidate length and r is the **effective reference length**, the sum over the corpus of each segment's "best match length" (the reference length closest to the candidate). BP is computed **over the whole corpus**, not averaged per sentence, because per-sentence averaging would punish short sentences too harshly. — [Papineni et al. 2002](https://aclanthology.org/P02-1040.pdf)
- **BLEU = BP · exp(Σ_{n=1}^{N} w_n log p_n).** In log form, log BLEU = min(1 − r/c, 0) + Σ w_n log p_n. The baseline uses **N = 4 and uniform weights w_n = 1/N**. Scores range from 0 to 1. More references raise the score: on about 500 sentences, one human translator scored 0.3468 against four references and 0.2571 against two. — [Papineni et al. 2002](https://aclanthology.org/P02-1040.pdf)
- **SacreBLEU (Post 2018)** provides "shareable, comparable, and reproducible BLEU scores". It computes on **detokenized** text and prints a signature such as `BLEU|nrefs:1|case:mixed|eff:no|tok:13a|smooth:exp|version:2.0.0`. The default BLEU tokenizer is `13a`, which mimics Moses' mteval-v13a. From v2.0.0 the default output format is JSON. It also implements chrF, chrF++ and TER, with TER compatible with TERCOM and case-insensitive by default. — [sacrebleu GitHub](https://github.com/mjpost/sacrebleu)
- lm-evaluation-harness computes BLEU, chrF and TER through `sacrebleu.corpus_bleu / corpus_chrf / corpus_ter`. These are corpus-level, not averages of sentence scores. — [lm-evaluation-harness metrics.py](https://raw.githubusercontent.com/EleutherAI/lm-evaluation-harness/main/lm_eval/api/metrics.py)
- lighteval's `bleu` is corpus-level SacreBLEU. Its `bleu_1` and `bleu_4` are averaged **sentence-level** NLTK BLEU, which is a different quantity. — [lighteval metric list](https://huggingface.co/docs/lighteval/metric-list)
- **Worked example (own arithmetic):** for a corpus with c = 12 candidate words and effective reference length r = 15, BP = e^(1−15/12) = e^(−0.25) ≈ 0.779. All n-gram precisions are scaled by about 22%.

#### 4. ROUGE-1/2/L (Lin 2004)
- **ROUGE-N** = Σ_{S∈Refs} Σ_{gram_n∈S} Count_match(gram_n) / Σ_{S∈Refs} Σ_{gram_n∈S} Count(gram_n). Count_match is the maximum number of n-grams co-occurring in the candidate and the reference set. Lin calls it "a recall-related measure because the denominator ... is the total sum of the number of n-grams occurring at the reference summary side". With multiple references, the original takes the max pairwise score and uses jackknifing. — [Lin 2004, Text Summarization Branches Out](https://aclanthology.org/W04-1013.pdf)
- **ROUGE-L** uses the sentence-level LCS. R_lcs = LCS(X,Y)/m, P_lcs = LCS(X,Y)/n and F_lcs = (1+β²)·R_lcs·P_lcs / (R_lcs + β²·P_lcs), with reference X of length m and candidate Y of length n. Lin notes β = P_lcs/R_lcs and that "in DUC, β is set to a very big number (→ ∞). Therefore, only R_lcs is considered." The summary level uses a union-LCS over sentences, which is what modern `rougeLsum` refers to. ROUGE-L only credits in-sequence matches. In his example, "the gunman police killed" gets the same ROUGE-L as a worse sentence because LCS counts only one of the two matching chunks, while ROUGE-2 tells them apart. — [Lin 2004](https://aclanthology.org/W04-1013.pdf)
- Modern libraries usually report the F-measure with β = 1. lighteval reports `rouge1`, `rouge2`, `rougeL`, `rougeLsum` and BigBench's `rouge_t5`, plus summarization faithfulness (SummaC) and extractiveness (coverage, density, compression). — [lighteval metric list](https://huggingface.co/docs/lighteval/metric-list)
- **Worked example (own arithmetic, β = 1):** reference "the cat sat on the mat" (6 words), candidate "the cat on the mat" (5 words).
  - ROUGE-1: 5 matches, so R = 5/6 = 0.833, P = 1.0, F1 ≈ 0.909.
  - ROUGE-2: 3 of the reference's 5 bigrams match (the cat, on the, the mat), and the candidate has 4 bigrams. R = 0.60, P = 0.75, F1 ≈ 0.667.
  - ROUGE-L: LCS = 5, so R = 0.833, P = 1.0, F1 ≈ 0.909.

#### 5. METEOR (Banerjee & Lavie 2005)
- METEOR aligns unigrams in stages: "exact", then "porter stem", then "WN synonymy" (WordNet) by default. Among candidate alignments it picks the one with the fewest crossings. It then computes unigram P and R and **Fmean = 10PR / (R + 9P)**, "a harmonic mean of P and 9R", which puts most of the weight on recall. — [Banerjee & Lavie 2005, ACL MT/Summarization workshop](https://aclanthology.org/W05-0909.pdf)
- **Penalty = 0.5 · (#chunks / #unigrams_matched)³.** A chunk is a maximal run of matched unigrams that are adjacent in both strings. **Score = Fmean · (1 − Penalty).** The penalty cuts Fmean by at most 50% when there are no bigram or longer matches. With multiple references the best score is taken. The authors say the parameters were set by experiment and "have not yet been trained to be optimal". — [Banerjee & Lavie 2005](https://aclanthology.org/W05-0909.pdf)
- In the paper's system-level comparison, Pearson correlation with human judgments was recall 0.941, F1 0.948, Fmean 0.952 and METEOR 0.964. — [Banerjee & Lavie 2005](https://aclanthology.org/W05-0909.pdf). This is from the extracted table; the dataset context was DARPA/TIDES 2003 Arabic-to-English and Chinese-to-English.
- **Worked example (own arithmetic, the paper's sentence pair):** system "the president spoke to the audience" (6 words), reference "the president then spoke to the audience" (7 words). There are 6 matches and 2 chunks ("the president" and "spoke to the audience"). P = 1, R = 6/7 ≈ 0.857, Fmean = 10·0.857/(0.857+9) ≈ 0.870. Penalty = 0.5·(2/6)³ ≈ 0.0185, so Score ≈ 0.853.

#### 6. chrF (Popović 2015)
- **chrF_β = (1+β²) · chrP · chrR / (β² · chrP + chrR).** chrP and chrR are character n-gram precision and recall, "arithmetically averaged over all n-grams". The paper found the best correlations with **6-gram** character n-grams. It tested β = 1 (chrF) and **β = 3 (chrF3)**, calling the 3 "taken arbitrarily as a preliminary value". chrF3 came out the most promising and was close to the top WMT14 metrics (DISCOTKPARTY, BEER). — [Popović 2015, WMT](https://aclanthology.org/W15-3049.pdf)
- **SacreBLEU defaults differ from the original paper:** char order 6, word order 0, **β = 2** (chrF2). Setting word order to 2 gives **chrF++**. — [sacrebleu GitHub](https://github.com/mjpost/sacrebleu). I did not fetch the source for why the default became β = 2 (I believe it was Popović's later work); see Gaps.
- **Worked example (own arithmetic):** with chrP = 0.6, chrR = 0.8 and β = 2: (1+4)·0.48 / (4·0.6 + 0.8) = 2.4/3.2 = 0.75.

#### 7. BERTScore (Zhang et al. 2019 arXiv / ICLR 2020) and embedding cosine similarity
- Tokens of reference x and candidate x̂ are embedded with a contextual model, the vectors are pre-normalized so that cosine reduces to an inner product, and each token is greedily matched:
  - **R_BERT** = (1/|x|) Σ_{x_i∈x} max_{x̂_j∈x̂} x_iᵀx̂_j
  - **P_BERT** = (1/|x̂|) Σ_{x̂_j∈x̂} max_{x_i∈x} x_iᵀx̂_j
  - **F_BERT** = 2·P·R/(P+R)
  - Source: [Zhang et al., BERTScore (arXiv 1904.09675)](https://ar5iv.labs.arxiv.org/html/1904.09675)
- **Optional IDF weighting:** idf(w) = −log((1/M) Σ_{i=1}^{M} 𝕀[w ∈ x^(i)]) over M reference sentences, with plus-one smoothing. Weighted recall = Σ idf(x_i)·max(...) / Σ idf(x_i). **Baseline rescaling:** R̂ = (R − b)/(1 − b), where b is the empirical score of random Common Crawl sentence pairs. Rescaling changes only readability, not ranking or correlation. — [Zhang et al.](https://ar5iv.labs.arxiv.org/html/1904.09675)
- The paper recommends F1 for MT, 24-layer RoBERTa-large for English (with the MNLI-fine-tuned variant as the final pick) and multilingual BERT for other languages. Intermediate layers work best: roberta-large layer 17, roberta-large-mnli layer 19. — [Zhang et al.](https://ar5iv.labs.arxiv.org/html/1904.09675)
- In the `bert_score` package the default English model is `roberta-large`. The README says "Currently, the best model is `microsoft/deberta-xlarge-mnli`." `rescale_with_baseline` (added in v0.3.0) "makes the range of the scores larger and more human-readable"; in the README's example, F1 goes from 0.959 unrescaled to 0.759 rescaled. The latest version listed is 0.3.13. — [bert_score GitHub](https://github.com/Tiiiger/bert_score)
- **Worked example (own illustrative numbers):** a reference has 2 tokens and a candidate has 3, with cosine rows r1 = [0.9, 0.2, 0.3] and r2 = [0.1, 0.8, 0.4]. R = (0.9+0.8)/2 = 0.85. P = (0.9+0.8+0.4)/3 = 0.70. F1 = 2·0.85·0.70/1.55 ≈ 0.768.
- **Sentence-embedding cosine similarity** is cos(a, b) = a·b / (‖a‖‖b‖), the standard definition with nothing paper-specific about it. Worked example (own arithmetic): a = (1,2,2) and b = (2,1,2) give 8/(3·3) ≈ 0.889. BERTScore is the token-level, greedy-matched version of this idea.

#### 8. pass@k (Chen et al. 2021, Codex/HumanEval)
- pass@k is the fraction of problems solved when k samples are drawn per problem, where a problem counts as solved if any sample passes its unit tests. Because computing it directly from k samples "can have high variance", the paper generates **n ≥ k samples** (n = 200, k ≤ 100), counts the c correct ones and uses the **unbiased estimator pass@k = E_problems[1 − C(n−c, k) / C(n, k)]**. — [Chen et al. 2021 (arXiv 2107.03374)](https://ar5iv.labs.arxiv.org/html/2107.03374)
- The naive estimate 1 − (1 − p̂)^k, with p̂ the empirical pass@1, is shown to underestimate systematically, even when n > 5k. The paper gives a numerically stable NumPy version (Figure 3): return 1.0 if n − c < k, otherwise 1 − ∏_{j=n−c+1}^{n} (1 − k/j). This avoids the huge binomial coefficients. — [Chen et al. 2021](https://ar5iv.labs.arxiv.org/html/2107.03374)
- HumanEval has **164** hand-written problems, averaging 7.7 unit tests each. In Table 1, Codex-12B scores pass@1 = 28.81% and pass@100 = 72.31%. The abstract says "70.2%" of problems were solved with 100 samples, so the abstract and the table differ. The 70.2% is probably a separate measurement and should not be mixed with the Table 1 figures. — [Chen et al. 2021](https://ar5iv.labs.arxiv.org/html/2107.03374)
- **Worked example (own arithmetic):** n = 10 samples, c = 3 correct.
  - pass@1 = 1 − C(7,1)/C(10,1) = 1 − 7/10 = 0.30.
  - pass@5 = 1 − C(7,5)/C(10,5) = 1 − 21/252 ≈ 0.917.
  - The naive 1 − 0.7⁵ ≈ 0.832 underestimates, as the paper describes.

#### 9. Calibration: ECE, MCE, Brier score
- **Perfect calibration** means P(Ŷ = Y | P̂ = p) = p for all p ∈ [0,1].
- **Binning.** Bins are B_m = {i : p̂_i ∈ ((m−1)/M, m/M]}, with acc(B_m) = (1/|B_m|) Σ 1(ŷ_i = y_i) and conf(B_m) = (1/|B_m|) Σ p̂_i.
- **ECE** = Σ_{m=1}^{M} (|B_m|/n)·|acc(B_m) − conf(B_m)|.
- **MCE** = max_m |acc(B_m) − conf(B_m)|.
- Guo et al. used **M = 15**. Their headline finding: "modern neural networks are no longer well-calibrated".
- **Temperature scaling** divides the logits by a scalar T fitted on validation NLL. It leaves accuracy unchanged and is "a single-parameter variant of Platt Scaling".
- Source: [Guo et al. 2017, On Calibration of Modern Neural Networks (arXiv 1706.04599)](https://ar5iv.labs.arxiv.org/html/1706.04599)
- **Brier score** in lm-evaluation-harness (multiple-choice) is `np.mean(np.sum((predictions - gold_one_hot) ** 2, axis=1))`, the multi-class sum-over-classes form, with lower being better. — [lm-evaluation-harness metrics.py](https://raw.githubusercontent.com/EleutherAI/lm-evaluation-harness/main/lm_eval/api/metrics.py)
- Nixon et al. describe Brier as a classic proper scoring rule, the mean squared difference between predicted probability and outcome. It decomposes into components that include calibration, so it is **not a pure calibration measure**. — [Nixon et al. 2019, Measuring Calibration in Deep Learning (arXiv 1904.01685)](https://ar5iv.labs.arxiv.org/html/1904.01685)
- **Worked example, ECE (own arithmetic):** 10 predictions.
  - 4 fall in bin (0.6, 0.7], with mean confidence 0.65 and 2 correct, so acc = 0.50 and gap = 0.15.
  - 6 fall in bin (0.9, 1.0], with mean confidence 0.95 and 5 correct, so acc ≈ 0.833 and gap ≈ 0.117.
  - ECE = 0.4·0.15 + 0.6·0.117 ≈ 0.13.
- **Worked example, binary Brier (own arithmetic):** forecasts 0.9, 0.6 and 0.2 with outcomes 1, 0 and 0 give (0.01 + 0.36 + 0.04)/3 ≈ 0.137. The harness's multi-class form sums over both classes and so gives twice this value for binary.

### Inferences
- Two tools can report the same metric name for different quantities:
  - lighteval `bleu` (corpus SacreBLEU) vs. `bleu_4` (mean sentence NLTK BLEU).
  - Harness `f1` (multiple-choice sklearn F1) vs. SQuAD token F1.
  - chrF β = 3 (original paper) vs. β = 2 (SacreBLEU).
  - Brier binary vs. multi-class.

  Any article table should name the implementation and settings. A SacreBLEU signature does this for BLEU and chrF.
- Perplexity is only comparable between models that share a tokenizer and evaluation text. Bits-per-byte and byte-normalized accuracy (`acc_norm`) exist specifically to remove the tokenizer dependence.

### Gaps
- I did not fetch Brier (1950) itself. The Brier definition above is sourced from the harness code and Nixon et al.
- I did not verify the parameters of modern METEOR variants: METEOR 1.3/Universal (Denkowski & Lavie), with tunable α, β, γ and paraphrase tables, or NLTK `meteor_score` defaults. Only the 2005 formula is verified.
- I did not verify the source for SacreBLEU's choice of β = 2 for chrF.
- The exact Counter-intersection lines of SQuAD `compute_f1` were not quoted back verbatim. The P/R/F1 formula given is the standard one and matches the script's structure.

## How well do these metrics correlate with human judgment for open-ended LLM output?

### Takeaway
They correlate weakly. n-gram overlap metrics (BLEU, ROUGE, chrF) correlate poorly with human ratings of open-ended or creative output, especially at the segment level. Embedding metrics such as BERTScore do somewhat better. Learned neural metrics (COMET-style, the WMT22 winners) and LLM-as-judge methods (G-Eval) correlate considerably better. Overlap metrics are more trustworthy at the system level than for individual outputs.

### Cited Findings
- **Novikova et al. 2017 (EMNLP), "Why We Need New Evaluation Metrics for NLG":** word-based and grammar-based metrics "only weakly reflect human judgements of system outputs" for end-to-end data-driven NLG, and how well a metric works depends on the data and system. The authors also found metrics reliable at the **system level**, where they can help spot poorly performing systems. — [Novikova et al. 2017](https://aclanthology.org/D17-1238/)
- **WMT22 Metrics Shared Task (Freitag et al. 2022), "Stop Using BLEU – Neural Metrics Are Better and More Robust":** the task used expert MQM human ratings. It found that neural learned metrics beat overlap metrics, which "correlate poorly with human ratings". The overlap metrics named are BLEU, spBLEU and chrF. Neural metrics were also more robust across domains and challenge sets. — [Freitag et al. 2022, WMT](https://aclanthology.org/2022.wmt-1.2); [Google Research page](https://research.google/pubs/results-of-wmt22-metrics-shared-task-stop-using-bleu-neural-metrics-are-better-and-more-robust/)
- **G-Eval (Liu et al. 2023):** on SummEval, averaged Spearman ρ with human judgments was:

  | Metric | Spearman ρ |
  |---|---|
  | ROUGE-1 | 0.192 |
  | ROUGE-2 | 0.205 |
  | ROUGE-L | 0.165 |
  | MoverScore | 0.191 |
  | BERTScore | 0.225 |
  | BARTScore | 0.385 |
  | UniEval | 0.474 |
  | G-Eval-4 (GPT-4 judge) | 0.514 |

  The paper calls BLEU and ROUGE "relatively low correlation with human judgments, especially for tasks that require creativity and diversity". — [Liu et al. 2023, G-Eval (arXiv 2303.16634)](https://ar5iv.labs.arxiv.org/html/2303.16634)
- **BERTScore paper:** at WMT18 segment level, Kendall τ for de-en was F_BERT 0.550 vs. BLEU 0.415. On COCO 2015 captioning, Pearson was R_BERT+idf 0.917/0.889 vs. SPICE 0.759/0.750, with BLEU "near zero". On the adversarial paraphrase set PAWS-QQP, AUC was F_BERT+idf 0.693 vs. BLEU 0.527. — [Zhang et al.](https://ar5iv.labs.arxiv.org/html/1904.09675)
- **Code (Chen et al. 2021):** "improvements in BLEU score may not indicate improved rates of functional correctness in practice". BLEU distributions for correct and incorrect solutions overlap, which is why execution-based pass@k is used. — [Chen et al. 2021](https://ar5iv.labs.arxiv.org/html/2107.03374)
- **Calibration-metric reliability (Nixon et al. 2019):**
  - ECE uses only the top-label probability.
  - Equal-width bins are dominated by one or two bins, because confidences cluster near 0 and 1.
  - The result is sensitive to bin count: rank correlation across bin counts is 0.37 for ECE vs. 0.59 for the adaptive variant.
  - Over- and under-confidence can cancel inside a bin, as in a pathological example with ECE ≈ 0.003 despite extreme miscalibration.
  - The authors propose static and adaptive calibration error (SCE, ACE), thresholding (TACE) and a general GCE framework.
  - Source: [Nixon et al. 2019](https://ar5iv.labs.arxiv.org/html/1904.01685)
- **METEOR (2005):** recall-weighted Fmean plus the fragmentation penalty correlated better with human judgments than BLEU-style precision-only scoring in the authors' experiments (system-level Pearson 0.964). The authors argue BLEU's brevity penalty "does not adequately compensate for the lack of recall". — [Banerjee & Lavie 2005](https://aclanthology.org/W05-0909.pdf)

### Inferences
- For open-ended LLM output such as chat answers, long-form generation or creative writing, a single reference cannot cover the space of good answers. Overlap metrics then penalize valid paraphrases and reward surface copying, which matches the low correlations above. In practice this is why reference-based metrics are reserved for tasks with constrained outputs (MT, extractive QA, short-answer math, code via execution), while open-ended quality goes to learned metrics, LLM judges or human evaluation.
- BERTScore's gains are real but modest on summarization: 0.225 vs. ROUGE's roughly 0.19 in G-Eval's table. It should be described as "better than n-gram overlap", not "close to human".
- Every correlation figure above comes from 2017–2023 benchmarks (SummEval, WMT18/22, COCO 2015). They are the standard citations, but they predate 2026 frontier models.

### Gaps
- I found no 2025–2026 meta-evaluation re-measuring BLEU, ROUGE or BERTScore correlation on current frontier-model outputs. I did not retrieve WMT23–WMT25 metrics-task results.
- I did not retrieve the WMT22 full tables (which metric ranked first, with what τ). Only the abstract-level conclusion is cited.
- I did not research calibration-specific LLM work, such as verbalized vs. token-probability confidence, or the effect of RLHF on calibration.

## Which metrics are still standard in 2026 evaluation harnesses?

### Takeaway
As of the current main branches, lm-evaluation-harness and lighteval both still ship perplexity, word- and byte-perplexity, bits-per-byte, accuracy (acc / acc_norm), exact match, F1, BLEU, chrF/chrF++ and TER (via SacreBLEU) and Brier score. lighteval also ships ROUGE, BERTScore, maj@k and LLM-as-judge metrics. Hugging Face itself now points LLM evaluation users from `evaluate` to lighteval.

### Cited Findings
- lm-evaluation-harness registers 19 metrics: bypass, brier_score, acc, acc_norm, acc_mutual_info, acc_bytes, exact_match, perplexity, likelihood, word_perplexity, byte_perplexity, bits_per_byte, mcc, f1, bleu, chrf, chrf++, ter, acc_all. There is no built-in pass@k in `metrics.py`; code tasks implement it elsewhere, if at all (not verified). — [lm-evaluation-harness metrics.py (main)](https://raw.githubusercontent.com/EleutherAI/lm-evaluation-harness/main/lm_eval/api/metrics.py)
- Recent harness releases:

  | Version | Date shown | Metric-related changes |
  |---|---|---|
  | v0.4.13 (latest) | 31 Aug | Added chrF++ (`word_order=2`), corrected TER's direction, fixed group stderr that was up to ~3× too narrow, fixed few-shot leakage that "may shift previously reported numbers" |
  | v0.4.12 | 11 May | |
  | v0.4.11 | 13 Feb | Task version bumps, so results are not directly comparable across versions |
  | v0.4.10 | 27 Jan | |
  | v0.4.9.2 | 26 Nov | Added `acc_norm_bytes` |

  The page shows dates without years. Given that today is 2026-11-07, v0.4.13 is most likely August 2026, but that is an inference. — [lm-evaluation-harness releases](https://github.com/EleutherAI/lm-evaluation-harness/releases)
- lighteval's metric list groups its metrics as follows. — [lighteval metric list](https://huggingface.co/docs/lighteval/metric-list)
  - **Log-likelihood:** `loglikelihood_acc` (length normalization recommended), `loglikelihood_f1`, `mcc`, `recall_at_k`, `mrr`, `target_perplexity`.
  - **Language modeling:** `word_perplexity`, `byte_perplexity`, `bits_per_byte`, `log_prob`.
  - **Generative:** `exact_match` variants, `maj_at_k`, `f1_score`, `rouge1/2/L/Lsum`, `bert_score`, `bleu` (SacreBLEU), `bleu_1/4` (NLTK), `chrf`, `ter`, copyright metrics (edit distance, longest common prefix) and summarization faithfulness and extractiveness.
  - **LLM-as-judge:** GPT-3.5 and Llama-3-405B judges, including multi-turn for MT-Bench.
- The Hugging Face `evaluate` README says: "we recommend our newer and more actively maintained library LightEval" for evaluating LLMs. No explicit deprecation notice was found. — [huggingface/evaluate GitHub](https://github.com/huggingface/evaluate)
- SacreBLEU remains the reference implementation that both harnesses call for BLEU, chrF and TER. — [sacrebleu GitHub](https://github.com/mjpost/sacrebleu); [lm-evaluation-harness metrics.py](https://raw.githubusercontent.com/EleutherAI/lm-evaluation-harness/main/lm_eval/api/metrics.py)
- pass@k with the Chen et al. unbiased estimator is the standard metric for HumanEval-style code benchmarks. — [Chen et al. 2021](https://ar5iv.labs.arxiv.org/html/2107.03374)

### Inferences
- **2026 practice:**
  - Accuracy, `acc_norm` and exact match (with task-specific normalization, e.g. math answer extraction) dominate benchmark leaderboards.
  - Perplexity and bits-per-byte remain the standard for pre-training and language-modeling evaluation.
  - BLEU, chrF and ROUGE persist mainly for MT and summarization benchmarks and for backward comparability. The WMT community itself recommends neural metrics over BLEU.
  - pass@k is standard for code.
  - ECE and Brier appear in calibration and reliability analyses rather than headline leaderboards.
- **Flag as older practice:**
  - Reporting BLEU or ROUGE as the main quality signal for open-ended chat output. Post-2022 literature argues against it.
  - Computing BLEU with ad-hoc tokenization instead of SacreBLEU. This is pre-2018 practice.
  - Reporting the naive 1−(1−p)^k for pass@k.
  - Comparing raw perplexity across models with different tokenizers.

### Gaps
- I did not verify where (or whether) lm-evaluation-harness implements pass@k for its code tasks. I also did not check whether lighteval ships a dedicated pass@k or ECE metric beyond the published list; the fetched list does not include ECE.
- The release years on the harness releases page were not displayed, so the dating above is inferred.
- I did not survey other 2026 harnesses (OpenAI simple-evals, HELM, Inspect) for their metric sets.
