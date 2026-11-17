# Evaluation metrics for RAG, factuality and hallucination in LLMs (as of November 2026)

Scope: RAGAS metrics, classic retrieval metrics, groundedness/attribution (TruLens RAG triad, DeepEval), hallucination-rate measurement (Vectara HHEM leaderboard, FActScore, SelfCheckGPT, SimpleQA, TruthfulQA), and claim-level verification. Research date: 2026-11-07. Pages that could not be fetched are listed under Gaps.

## How is each metric computed (formulas, steps, which parts use an LLM)?

### Takeaway
Most "RAG quality" metrics follow one recipe: an LLM splits text into claims or statements, an LLM or NLI classifier checks each claim against a text source, and the score is a simple ratio. Answer relevancy is the exception: an LLM writes reverse questions, then embeddings and cosine similarity do the scoring. The classic IR metrics (precision@k, recall@k, MRR, nDCG, hit rate) need no LLM, only relevance labels.

### Cited Findings

**RAGAS: original paper (Es, James, Espinosa-Anke, Schockaert; arXiv 2309.15217, v1 26 Sep 2023, v2 28 Apr 2025)**
- The paper presents Ragas as "a framework for reference-free evaluation of Retrieval Augmented Generation (RAG) pipelines". — [arXiv abstract](https://arxiv.org/abs/2309.15217)
- Faithfulness in the paper: an LLM splits the answer into statements S, an LLM checks each statement against the retrieved context, and F = |V| / |S|, where V is the set of supported statements. — [Ragas paper HTML](https://arxiv.org/html/2309.15217v2)
- Answer relevance in the paper: an LLM generates n questions q_i from the answer. These and the original question q are embedded with OpenAI text-embedding-ada-002. AR = (1/n) Σ sim(q, q_i), using cosine similarity. It does not check factuality. It penalises incomplete or redundant answers. — [Ragas paper HTML](https://arxiv.org/html/2309.15217v2)
- Context relevance in the paper: an LLM extracts the context sentences needed to answer the question. CR = extracted sentences / total sentences in the context. — [Ragas paper HTML](https://arxiv.org/html/2309.15217v2)
- The paper's prompts all used gpt-3.5-turbo-16k. — [Ragas paper HTML](https://arxiv.org/html/2309.15217v2)

**RAGAS: current documentation (docs.ragas.io, stable)**
- Faithfulness = (claims in the response supported by the retrieved context) / (total claims in the response), in the range 0 to 1. Steps: (1) identify the claims in the response, (2) check whether each can be inferred from the context, (3) take the ratio. Worked example: 1 of 2 statements supported gives 0.5. — [Ragas docs: Faithfulness](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness/)
- Variant `FaithfulnesswithHHEM` replaces the LLM verification step (step 2) with Vectara's HHEM-2.1-Open, a T5-based hallucination classifier. It runs on CPU by default with a batch size of 10, both configurable. — [Ragas docs: Faithfulness](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness/)
- Response (answer) relevancy: an LLM generates N artificial questions from the response (default 3, set with `strictness`). Each question is embedded and compared with the user input by cosine similarity: score = (1/N) Σ cos(E_gi, E_o). Only question generation uses the LLM. The docs note that cosine similarity can fall in [-1, 1], so a score outside 0 to 1 is not strictly impossible. — [Ragas docs: Response Relevancy](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/answer_relevance/)
- Context Precision@K = Σ_{k=1..K} (Precision@k × v_k) / (number of relevant items in the top K). Precision@k = TP@k / (TP@k + FP@k), where v_k ∈ {0, 1} marks whether the chunk at rank k is relevant, and K is the number of retrieved chunks. It is a rank-weighted score, similar to average precision. — [Ragas docs: Context Precision](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_precision/)
- Context precision variants:
  - `ContextPrecision` / `LLMContextPrecisionWithReference`: an LLM judges relevance against a reference answer.
  - `LLMContextPrecisionWithoutReference` / `ContextUtilization`: an LLM judges relevance against the generated response.
  - `NonLLMContextPrecisionWithReference`: string similarity (for example Levenshtein via rapidfuzz) against reference contexts.
  - `IDBasedContextPrecision`: share of retrieved IDs found in the reference IDs, with no rank weighting.
  — [Ragas docs: Context Precision](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_precision/)
- Context recall (LLM): the reference answer is split into claims, and each claim is checked for support in the retrieved context. Score = supported reference claims / total reference claims. The reference answer stands in for annotated reference contexts. Non-LLM variant: retrieved contexts that match reference contexts by string distance / total reference contexts. ID-based variant: reference IDs found among retrieved IDs / total reference IDs. — [Ragas docs: Context Recall](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_recall/)

**Retrieval (IR) metrics**
- DCG_p = Σ_{i=1..p} rel_i / log2(i+1). An alternative form, common in industry and on Kaggle, is Σ (2^rel_i − 1) / log2(i+1). The two forms are equal for binary relevance. IDCG_p is the DCG of the ideal ordering, and nDCG_p = DCG_p / IDCG_p, so a perfect ranking scores 1.0. — [Wikipedia: Discounted cumulative gain](https://en.wikipedia.org/wiki/Discounted_cumulative_gain)
- Precision@k as Ragas defines it: TP@k / (TP@k + FP@k), i.e. relevant items in the top k divided by k. — [Ragas docs: Context Precision](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_precision/)
- Recall@k (relevant items retrieved in the top k / all relevant items) matches the ID-based context recall in Ragas: reference IDs found among retrieved IDs / total reference IDs. — [Ragas docs: Context Recall](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_recall/)

**Groundedness and attribution tools**
- TruLens "RAG triad":
  - Context relevance: the retrieved context compared with the query, chunk by chunk.
  - Groundedness: the response is split into individual claims, and the retrieved context is searched for evidence supporting each one.
  - Answer relevance: the response compared with the user input.
  The page does not document the scoring mechanics. — [TruLens: RAG Triad](https://www.trulens.org/getting_started/core_concepts/rag_triad/)
- DeepEval faithfulness = truthful claims / total claims. An LLM extracts the claims from `actual_output`, and the same LLM gives a verdict on each claim against `retrieval_context`. A claim counts as truthful "if it does not contradict any facts" in the context, so only contradiction counts against it. This is looser than the Ragas "can be inferred" test. Options: `truths_extraction_limit` caps how many facts are taken from the context (ordered by importance; default None), and `penalize_ambiguous_claims` (default False) stops ambiguous claims from counting as faithful. — [DeepEval docs: Faithfulness](https://deepeval.com/docs/metrics-faithfulness)
- DeepEval also offers "Hybrid" and "System One" modes that use a small model called "Jev" to answer yes/no per claim. In Hybrid mode, P(yes) > 0.65 counts as truthful and < 0.35 as contradictory. The docs warn that System One scores are not directly comparable with the LLM-equation scores, so keep a metric on one mode when comparing runs. — [DeepEval docs: Faithfulness](https://deepeval.com/docs/metrics-faithfulness)

**Hallucination-rate and factuality measures**
- Vectara Hallucination Leaderboard:
  - Each LLM summarises every document under a prompt that limits it to the passage's facts, with no preamble and summaries capped at 20% of the source length. Temperature is 0 where supported.
  - HHEM-2.3, Vectara's commercial model, scores factual consistency. Hallucination rate = 100 − factual consistency rate.
  - "Answer rate" is the share of documents summarised rather than refused. Refusals and very short answers are filtered out, and the final evaluation uses only documents every model summarised.
  - The current dataset has over 7,700 articles of about 50 to 24K words and is kept private to limit overfitting.
  — [Vectara hallucination-leaderboard GitHub](https://github.com/vectara/hallucination-leaderboard)
- FActScore (Min et al., EMNLP 2023 main conference): long-form text is split into atomic facts, and the score is the percentage of those facts supported by a reliable knowledge source. The automated estimator has less than a 2% error rate against human evaluation. ChatGPT scored 58% on people biographies. — [arXiv 2305.14251](https://arxiv.org/abs/2305.14251)
- SelfCheckGPT (Manakul, Liusie, Gales; EMNLP 2023): a zero-resource, black-box method. It samples several responses from the same model and measures their consistency. If the model knows a fact, the samples tend to agree; hallucinated facts tend to diverge or contradict each other. It needs no external database and no token probabilities. It works at sentence level (flagging non-factual sentences) and passage level (ranking passages by factuality). It was evaluated on GPT-3 WikiBio passages with manual factuality labels. — [arXiv 2303.08896](https://arxiv.org/abs/2303.08896)
- SimpleQA (Wei et al., OpenAI, arXiv 2411.04368):
  - 4,326 short fact-seeking questions, each with a single indisputable answer, checked by two independent AI trainers. Estimated label error is about 3%.
  - A prompted ChatGPT classifier grades each answer as correct, incorrect or not attempted.
  - Metrics: overall correct; correct given attempted (correct / attempted); and F-score, the harmonic mean of the two. The authors note that the F-score rewards guessing whenever the model is at least 50% confident.
  — [SimpleQA paper HTML](https://arxiv.org/html/2411.04368)
- SimpleQA Table 3 results (correct % / not attempted % / F-score): o1-preview 42.7 / 9.2 / 44.8; GPT-4o 38.2 / 1.0 / 38.4; Claude-3.5 Sonnet 28.9 / 35.0 / 35.0; GPT-4o-mini 8.6 / 0.9 / 8.6. — [SimpleQA paper HTML](https://arxiv.org/html/2411.04368)
- SimpleQA calibration finding: stated confidence and answer frequency over 100 samples both correlate positively with accuracy, but models consistently overstate their confidence. o1-preview was the best calibrated model. — [SimpleQA paper HTML](https://arxiv.org/html/2411.04368)

### Inferences
- "Faithfulness", "groundedness" and DeepEval's faithfulness all use the same claim-decomposition and verification pattern, but their verification thresholds differ. Ragas asks whether a claim can be inferred from the context; DeepEval only asks whether it contradicts the context. Scores from different tools are therefore not comparable even when the metric names match.
- Ragas Context Precision@K is, in effect, average precision over the retrieved list, with an LLM supplying the relevance labels in the LLM variants.
- FActScore, Ragas faithfulness and TruLens groundedness are claim-level fact verification against a source: Wikipedia for FActScore, the retrieved context for the RAG tools. SelfCheckGPT is the reference-free counterpart, checking a model against its own samples.

### Gaps
- MRR and hit rate: the Manning/Raghavan/Schütze IR book page refused connection, so I could not verify these formulas from a primary source. The standard definitions are MRR = (1/|Q|) Σ 1/rank_i, where rank_i is the position of the first relevant result, and hit rate@k = the share of queries with at least one relevant item in the top k. They are textbook-standard but unverified in this session.
- FActScore details: the exact formula notation, the length penalty (the γ term in the paper), the default Wikipedia knowledge source and the retrieve+LM estimator setup were not in the abstract I fetched. Check the full paper or the GitHub repo.
- SelfCheckGPT variants: the paper's specific scorers (BERTScore, question answering, n-gram, NLI, LLM prompting) and their numeric AUC-PR results were not in the abstract I fetched.
- The OpenAI SimpleQA blog returned HTTP 403, so I used the arXiv paper instead. A small oddity in the table: GPT-4o shows 38.2% correct and 1.0% not attempted but 38.0% correct given attempted, which does not reconcile exactly. It is reported as given in the paper.
- TruthfulQA's metric definitions (MC1/MC2, the GPT-judge "truthful × informative" score) were not fetched in this session.

## What are their known limitations?

### Takeaway
LLM-judged metrics depend on the judge model and the prompt. They are validated on small or synthetic data, and the number of claims depends on how the text is split. Leaderboard-style hallucination rates measure only consistency with a source document, not usefulness. The IR metrics ignore whether retrieved text was actually used.

### Cited Findings
- Ragas was validated on WikiEval: 50 Wikipedia pages about events since early 2022, with questions and answers generated by ChatGPT and labelled by two annotators (about 95% raw agreement for faithfulness and context relevance, about 90% for answer relevance). — [Ragas paper HTML](https://arxiv.org/html/2309.15217v2)
- Pairwise accuracy against human judgments (Ragas / GPT Score / GPT Ranking): faithfulness 0.95 / 0.72 / 0.54; answer relevance 0.78 / 0.52 / 0.40; context relevance 0.70 / 0.63 / 0.52. Context relevance was the hardest dimension, and ChatGPT struggled with longer contexts. — [Ragas paper HTML](https://arxiv.org/html/2309.15217v2)
- The Ragas paper notes sensitivity to prompt design. The evaluation relied on a closed model (gpt-3.5-turbo-16k), and the quality of statement extraction was not evaluated separately. — [Ragas paper HTML](https://arxiv.org/html/2309.15217v2)
- Ragas answer relevancy does not check factuality, by design. — [Ragas paper HTML](https://arxiv.org/html/2309.15217v2)
- The Vectara leaderboard authors list these limitations:
  - The results depend on HHEM agreeing with human judgment.
  - The benchmark measures factual consistency, not summary quality, so a purely extractive copy of the source would score perfectly.
  - It does not capture all forms of hallucination.
  - It covers English only.
  — [Vectara leaderboard GitHub](https://github.com/vectara/hallucination-leaderboard)
- SimpleQA covers only short single-answer queries. Whether short-form factuality predicts long-form factuality is an open question. Its F-score rewards guessing above 50% confidence. — [SimpleQA paper HTML](https://arxiv.org/html/2411.04368)
- SimpleQA Verified was created because the original SimpleQA had noisy and incorrect labels, topical biases and redundant questions. — [SimpleQA Verified, arXiv 2509.07968](https://arxiv.org/abs/2509.07968)
- nDCG limitations:
  - It does not penalise bad documents (1,1,1 and 1,1,1,0 score the same).
  - It does not penalise missing documents when IDCG is computed at different ranks.
  - It fits poorly when many results are equally good at small cutoffs.
  - IDCG is hard to compute when relevance judgments are partial.
  — [Wikipedia: DCG](https://en.wikipedia.org/wiki/Discounted_cumulative_gain)
- DeepEval warns that scores from different evaluation modes (LLM vs System One) are not directly comparable. — [DeepEval docs](https://deepeval.com/docs/metrics-faithfulness)

### Inferences
- Because faithfulness is a ratio of claims, splitting the same answer more finely or more coarsely changes the score. Compare scores only within a fixed tool, version and judge model.
- A faithfulness score of 1.0 can coexist with a wrong answer when the retrieved context itself is wrong. Groundedness is not truth; it only means the answer matches its sources.
- SelfCheckGPT's consistency idea implies that a model that hallucinates the same thing every time will look "consistent". This follows from the method's premise rather than from a cited statement.

### Gaps
- I found no 2026 peer-reviewed meta-evaluation that compares Ragas, DeepEval and TruLens agreement with human judgments.

## What do current tools (RAGAS, DeepEval, TruLens "RAG triad") implement in 2026?

### Takeaway
Ragas now has a "collections" API (the legacy metric API will be deprecated in 0.4 and removed in 1.0), adds non-LLM and ID-based variants, and offers HHEM-based faithfulness. DeepEval offers faithfulness, answer relevancy, contextual precision, recall and relevancy, plus a hallucination metric, with LLM and small-model judge modes. TruLens frames evaluation as the RAG triad of context relevance, groundedness and answer relevance.

### Cited Findings
- Ragas recommends the collections-based API for new projects. The legacy metrics API "will be deprecated in version 0.4 and removed in version 1.0". — [Ragas docs: Faithfulness](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness/)
- Ragas metric families currently documented:
  - Faithfulness, and `FaithfulnesswithHHEM`.
  - Response Relevancy.
  - Context Precision: LLM with or without a reference, ContextUtilization, non-LLM, and ID-based.
  - Context Recall: LLM, non-LLM, and ID-based.
  — [Faithfulness](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness/), [Context Precision](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_precision/), [Context Recall](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_recall/)
- DeepEval RAG metrics: Faithfulness, Answer Relevancy, Contextual Precision, Contextual Recall, and a Hallucination metric that compares output against a ground-truth `context` rather than retrieved context. It also has eval modes LLM, Hybrid and System One (the "Jev" model). — [DeepEval docs](https://deepeval.com/docs/metrics-faithfulness)
- DeepEval docs suggest that high answer relevancy combined with low faithfulness means the model relies on its own knowledge rather than the retrieved evidence. — [DeepEval docs](https://deepeval.com/docs/metrics-faithfulness)
- TruLens RAG triad: context relevance (query↔context), groundedness (response↔context, claim by claim), answer relevance (response↔query). — [TruLens docs](https://www.trulens.org/getting_started/core_concepts/rag_triad/)

### Inferences
- All three tools converge on the same three checks: are retrieved chunks relevant, is the answer supported by them, and does it answer the question. Ragas and DeepEval add reference-based retrieval recall and precision when ground truth exists.

### Gaps
- I did not confirm the current Ragas release number (whether 0.4 or 1.0 has shipped by November 2026), the TruLens feedback-function implementation details (judge prompts, chain-of-thought variants), or the DeepEval contextual-metric formulas. Those pages were not fetched within the tool budget.

## What benchmarks are used for factuality in 2026, and are any saturated or deprecated?

### Takeaway
Active factuality measures in 2026 include the Vectara HHEM leaderboard (updated 22 Oct 2026, with a new private dataset), SimpleQA and its cleaned 1,000-prompt successor SimpleQA Verified, FActScore-style long-form atomic-fact scoring, and the FACTS leaderboard (Dec 2025). TriviaQA, Natural Questions and TruthfulQA are described as saturated for frontier models.

### Cited Findings
- The Vectara leaderboard was last updated October 22, 2026. It uses HHEM-2.3 (commercial) on a new private dataset of over 7,700 articles. Earlier leaderboard versions based on HHEM-1.0, and on HHEM-2.3 with the previous dataset, are archived. — [Vectara leaderboard GitHub](https://github.com/vectara/hallucination-leaderboard)
- Top five on the current Vectara board (hallucination rate / answer rate): antgroup/finix_s1_32b 1.8% / 99.5%; openai/gpt-5.4-nano-2026-03-17 3.1% / 100%; google/gemini-2.5-flash-lite 3.3% / 99.5%; microsoft/Phi-4 3.7% / 80.7%; meta-llama/Llama-3.3-70B-Instruct-Turbo 4.1% / 99.5%. — [Vectara leaderboard GitHub](https://github.com/vectara/hallucination-leaderboard)
- The SimpleQA Verified paper (Google DeepMind) states that TriviaQA, Natural Questions and TruthfulQA "have become saturated" by modern LLMs, limiting their signal on frontier models. — [SimpleQA Verified, arXiv 2509.07968](https://arxiv.org/abs/2509.07968)
- SimpleQA Verified is a set of 1,000 prompts filtered and modified from the original SimpleQA. On it, Gemini 2.5 Pro reached an F1 of 55.6, which the paper reports as state of the art, ahead of GPT-5. One secondary summary claims 1,218 questions, which contradicts the paper's 1,000. — [arXiv 2509.07968](https://arxiv.org/abs/2509.07968); conflicting figure from [Liner review](https://liner.com/review/simpleqa-verified-reliable-factuality-benchmark-to-measure-parametric-knowledge)
- The original SimpleQA was released in late 2024 and quickly became an industry standard for short-form parametric factuality. — [SimpleQA Verified, arXiv 2509.07968](https://arxiv.org/html/2509.07968)
- "The FACTS Leaderboard: A Comprehensive Benchmark for Large Language Model Factuality" (Cheng et al.) was posted to arXiv in December 2025. I did not obtain details of its scope or scores. — [papers.lunadong.com listing](https://papers.lunadong.com/paper/4441)

### Inferences
- For a 2026 article, the clearest framing is that short-form parametric factuality is measured with SimpleQA or SimpleQA Verified, grounded summarisation faithfulness with the Vectara HHEM leaderboard, and long-form factuality with FActScore-style atomic-fact precision. TruthfulQA is mainly of historical interest for frontier models.
- The low Vectara leaderboard rates (1.8% to 4.1%) apply only to short summaries of the source document and should not be read as general hallucination rates.

### Gaps
- I did not verify the FACTS leaderboard's components, metrics or results.
- I did not check whether OpenAI or others formally deprecated SimpleQA. I found only the "noisy labels" critique that motivated SimpleQA Verified.
- I did not find an explicit deprecation notice for TruthfulQA. Its saturation claim comes from the SimpleQA Verified paper, not from the TruthfulQA authors.
- I could not verify any 2026 frontier-model SimpleQA scores.
