# Safety, robustness, bias and production evaluation of LLMs, plus the eval tooling ecosystem (as of 7 Nov 2026)

## How is each metric defined and computed?

### Takeaway
Safety metrics are mostly classifier- or judge-based rates: toxicity probability, refusal rate on benign prompts (over-refusal), and attack success rate (ASR) on harmful prompts. Because the number depends on the judge, generation length and decoding settings, ASR figures from different benchmarks cannot be compared directly. Bias benchmarks compare model behaviour across demographic groups. Robustness work shows that changing only the prompt format can move accuracy by tens of points, so a single-prompt score is fragile. Latency metrics such as TTFT, ITL and TPS have precise formulas, but tools define them differently.

### Cited Findings

**Toxicity scoring**
- Perspective API (Google Jigsaw) is shutting down. It stays active until 31 Dec 2026 and will not be in service after 2026. Usage and quota requests were accepted only until February 2026. Jigsaw offers no direct migration support. — [Perspective API](https://perspectiveapi.com/)
- Jigsaw's stated reason, as reported by a vendor blog, is lower demand for a standalone tool in this area. — [GetStream blog](https://getstream.io/blog/perspective-api-alternative/) (vendor source promoting its own alternative; treat with caution)
- An April 2026 arXiv paper, "Bye Bye Perspective API", argues that the closure removes the de facto standard for automated toxicity measurement in NLP, computational social science and LLM evaluation research. — [arXiv 2604.25580](https://arxiv.org/abs/2604.25580) (seen only in a search snippet; not fetched)
- Detoxify (Unitary), an open-source toxicity classifier, is maintained: v0.5.4 was released 14 Oct 2026, under Apache-2.0, with about 1.3k GitHub stars. — [GitHub API: unitaryai/detoxify](https://github.com/unitaryai/detoxify), [PyPI detoxify](https://pypi.org/project/detoxify/)

**Refusal and over-refusal**
- XSTest contains 250 hand-written safe prompts built to look like toxic ones. It is now too easy for strong models: Llama-3-70b answers nearly all of them properly. — [OR-Bench paper, arXiv 2405.20947](https://arxiv.org/abs/2405.20947)
- OR-Bench (Cui et al., ICML 2025) has three parts: 80,000 "seemingly toxic" over-refusal prompts across 10 rejection categories, OR-Bench-Hard with about 1,000 prompts, and 600 genuinely toxic prompts. The metric is the refusal rate on benign prompts, paired with the refusal rate on toxic prompts. Safety and over-refusal are strongly correlated (Spearman 0.89). In the preprint's evaluation, Claude models were the safest but also over-refused the most, while Mistral models accepted most prompts. — [arXiv 2405.20947](https://arxiv.org/html/2405.20947v2)
- A 2026 domain extension, Health-ORSC-Bench, has 31,920 benign boundary prompts across 7 health categories. It cites OR-Bench, XSTest and SORRY-Bench as the main general-domain over-refusal benchmarks. — [ACL 2026 Findings](https://aclanthology.org/2026.findings-acl.1177.pdf)

**Jailbreak robustness and ASR**
- HarmBench has 510 unique harmful behaviors: 400 text and 110 multimodal, split into 100 validation and 410 test.
  - Functional categories: standard (200), copyright (100), contextual (100), multimodal (110).
  - Semantic categories (7): cybercrime and intrusion; chemical/biological weapons and drugs; copyright; misinformation; harassment; illegal activities; general harm.
  - ASR is the percentage of a method's test cases that elicit the behavior. Completions use greedy decoding and are standardized to 512 tokens. The authors found that generation length alone can shift substring-matching ASR by up to 30%.
  - The judge is a fine-tuned Llama 2 13B classifier. It agrees with humans 93.19% of the time on average, against 88.37% for GPT-4. Copyright behaviors are judged by a hashing-based classifier.
  - The paper compares 18 red-teaming methods against 33 target LLMs and defenses.
  - — [HarmBench, arXiv 2402.04249](https://arxiv.org/html/2402.04249)
- JailbreakBench defines ASR as the percentage of jailbreak attempts that its JUDGE function marks successful. It also reports query efficiency and the judge's false-negative rate. — [JailbreakBench review](https://themoonlight.io/review/jailbreakbench-an-open-robustness-benchmark-for-jailbreaking-large-language-models) (secondary)
- StrongREJECT finds that existing jailbreak evaluations significantly overstate jailbreak effectiveness compared with human judgment, and that jailbreaks which bypass safety tuning tend to reduce the model's capabilities. Its autograder measures how much useful information a response gives for a forbidden prompt. — [arXiv 2402.10260](https://arxiv.org/abs/2402.10260)
- How StrongREJECT scores a response, according to a secondary summary: a refusal scores 0, and a fully specific, convincing answer scores 1. A binary success rate can then be computed at a threshold τ. — [EmergentMind topic page](https://www.emergentmind.com/topics/strongreject-benchmark) (secondary; the exact formula is not verified)
- Judges disagree. A 2026 evaluation framework, JailMeter, reports that StrongREJECT's judge has low recall (25.71%) because it is conservative, and that HarmBench's LLM-judge setup does slightly worse than a fine-tuned Llama classifier. So ASR depends on the judge. — [JailMeter, arXiv 2607.19424](https://arxiv.org/pdf/2607.19424) (search snippet only)
- Repository activity (GitHub API, 7 Nov 2026):
  - HarmBench: last push Aug 2024.
  - JailbreakBench: last release v1.0.0 (Jun 2024), last push Apr 2025.
  - strong_reject: last push Jul 2025.
  - These are stable benchmark artifacts, not actively developed tools. — [centerforaisafety/HarmBench](https://github.com/centerforaisafety/HarmBench), [JailbreakBench](https://github.com/JailbreakBench/jailbreakbench), [dsbowen/strong_reject](https://github.com/dsbowen/strong_reject)

**Bias and fairness**
- BBQ (Parrish et al., ACL Findings 2022) is a hand-built QA bias benchmark covering 9 social dimensions relevant to US English contexts. Each item has two context types:
  - An ambiguous (under-informative) context, which tests whether the model falls back on stereotypes.
  - A disambiguated context, which tests whether bias overrides the correct answer.
  - With disambiguated contexts, accuracy averages up to 3.4 points higher when the correct answer matches a stereotype, and more than 5 points higher for gender items in most models.
  - — [arXiv 2110.08193](https://arxiv.org/abs/2110.08193)
- BOLD (Dhamala et al., 2021) has 23,679 English generation prompts across 5 domains: profession, gender, race, religion and political ideology. It proposes automated metrics for toxicity, psycholinguistic norms and text gender polarity in open-ended generations. — [arXiv 2101.11718](https://arxiv.org/abs/2101.11718)
- HELM reports fairness and bias alongside accuracy, calibration and robustness on a fixed task suite. — [inference.net comparison](https://inference.net/content/llm-evaluation-tools-comparison/) (secondary)

**Robustness and consistency**
- Sclar et al. (2023) found that meaning-preserving prompt-format changes in few-shot settings caused accuracy differences of up to 76 points for LLaMA-2-13B.
  - The sensitivity persists as model size and the number of shots grow, and after instruction tuning.
  - A format's performance on one model correlates only weakly with its performance on another.
  - Their FormatSpread method samples plausible formats and reports an interval of expected performance. It works on API-only models.
  - — [arXiv 2310.11324](https://arxiv.org/abs/2310.11324)

**Operational metrics** (NVIDIA AIPerf/NIM definitions)
- TTFT is the time from request submission to the first non-empty token.
- End-to-end latency = TTFT + generation time.
- ITL (also called TPOT) = (e2e − TTFT) / (output tokens − 1).
- Per-user TPS = output length / e2e latency. It approaches 1/ITL for long outputs.
- System TPS = total output tokens / (Ty − Tx), where Tx is the first request's start, Ty is the last response's end, and warmup is excluded.
- RPS = completed requests / (Ty − Tx).
- Tools define these metrics differently, so compare results only when the definitions match.
- — [NVIDIA NIM benchmarking metrics](https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html)

**Statistical rigor**
- Evan Miller (Anthropic), "Adding Error Bars to Evals", arXiv 2411.00640 (Nov 2024):
  - Treat eval questions as drawn from a super-population.
  - Report the standard error of the mean (CLT-based, which is enough for simple Bernoulli-scored evals without bootstrapping) together with the number of questions.
  - Use clustered standard errors when questions come in related groups, such as several questions on one passage.
  - Compare two models with paired, question-level differences.
  - Use power analysis when planning an eval.
  - The paper argues that the Llama 3 report's confidence intervals are too narrow in some cases and too wide in others.
  - — [arXiv 2411.00640](https://arxiv.org/abs/2411.00640) (details are from search-result summaries of the paper)

### Inferences
- With Perspective API gone after 2026, toxicity results from old papers that used it cannot be reproduced exactly. Teams will need to switch to open classifiers such as Detoxify or LLM-judge or guard models, and should re-baseline rather than compare new numbers to old Perspective numbers.
- Report safety as a pair: harmful-prompt ASR or refusal together with benign-prompt over-refusal. OR-Bench's 0.89 correlation shows that either number alone can be gamed.
- When reporting ASR, state the judge, decoding settings, generation length and attack budget. Otherwise the numbers cannot be compared.

### Gaps
- The exact StrongREJECT formula and its prompt count (believed to be about 313 prompts) were not verified from the primary paper.
- The BBQ question count, its bias-score formulas (separate ambiguous and disambiguated scores) and the full list of dimensions were not on the fetched abstract page.
- I found no primary source defining "demographic parity" for LLMs. Counterfactual or demographic-swap evaluations are common, but no source for them was fetched.
- I fetched no primary source on self-consistency, the multi-sample agreement metric (Wang et al. 2022, arXiv 2203.11171).
- I found no source on p95/p99 latency reporting conventions or on cost-per-task methodology.
- I did not fetch the NIST AI RMF or the NIST GenAI Profile (AI 600-1) for this note.

## What tools are actively maintained in 2026 and what do they offer?

### Takeaway
Most major frameworks are active as of November 2026. Five status changes matter most:
- OpenAI's hosted Evals platform became read-only on 31 Oct 2026 and shuts down on 30 Nov 2026, with Promptfoo as the official migration target.
- OpenAI announced its acquisition of Promptfoo in March 2026.
- Perspective API ends on 31 Dec 2026.
- The LangSmith SDK repository was split and archived in October 2026; the packages themselves are unchanged.
- RAGAS's GitHub repo moved to the vibrantlabsai organization and has had no commits since February 2026.

### Cited Findings
- **OpenAI Evals (hosted platform):** OpenAI announced the deprecation on 3 Jun 2026. Existing evals become read-only on 31 Oct 2026, and the Evals dashboard and API are scheduled to shut down on 30 Nov 2026. The migration path is Promptfoo, via the cookbook guide "Moving from OpenAI Evals to Promptfoo". Agent Builder shuts down on the same date. — [OpenAI deprecations](https://developers.openai.com/api/docs/deprecations)
- **openai/evals (open-source repo):** not archived. Last push was 14 Apr 2026, there are no GitHub releases, and it has about 19.7k stars. — [GitHub openai/evals](https://github.com/openai/evals)
- **Promptfoo:** OpenAI announced on 9 Mar 2026 that it would acquire Promptfoo and integrate it into OpenAI Frontier. Terms were not disclosed, and the deal was subject to closing conditions. — [OpenAI announcement](https://openai.com/index/openai-to-acquire-promptfoo/), [Security Boulevard](https://securityboulevard.com/2026/03/openai-acquires-security-startup-promptfoo-to-fortify-ai-agents)
  - The repo is still MIT licensed and active: release 0.125.1 on 25 Oct 2026, about 26.9k stars, last push 7 Nov 2026. It is a CLI for evaluating, comparing and red-teaming LLM apps. — [GitHub promptfoo/promptfoo](https://github.com/promptfoo/promptfoo)
  - Some outlets reported it would stay open source; others called that unclear. — [Yahoo Finance](https://finance.yahoo.com/news/openai-acquires-promptfoo-secure-ai-174904138.html)
- **UK AISI Inspect (inspect_ai):** MIT licensed and very active. Version 0.3.288 was released 7 Nov 2026 on both PyPI and GitHub. — [GitHub UKGovernmentBEIS/inspect_ai](https://github.com/UKGovernmentBEIS/inspect_ai), [PyPI](https://pypi.org/project/inspect-ai/)
  - The companion **inspect_evals** package reached v0.27.0 on 30 Oct 2026 and is described as offering over 200 pre-built evaluations. — [GitHub inspect_evals](https://github.com/UKGovernmentBEIS/inspect_evals), [PyPI listing via CERN mirror](https://simple-repository.app.cern.ch/project/inspect_ai)
- **EleutherAI lm-evaluation-harness:** MIT licensed. v0.4.13 was released 31 Aug 2026, the repo was last pushed 4 Nov 2026, and it has about 14.4k stars. It covers many academic benchmarks and is model-agnostic. — [GitHub](https://github.com/EleutherAI/lm-evaluation-harness), [PyPI lm-eval](https://pypi.org/project/lm-eval/)
- **Stanford HELM (crfm-helm):** Apache-2.0. v0.5.16 was released 30 Apr 2026, last pushed 1 Sep 2026. It is a holistic harness covering accuracy, calibration, robustness, fairness, bias and toxicity. — [GitHub stanford-crfm/helm](https://github.com/stanford-crfm/helm)
- **DeepEval (Confident AI):** Apache-2.0, pytest-style LLM unit testing. PyPI version 4.3.3 was released 4 Nov 2026, and the repo has about 19.4k stars. — [PyPI deepeval](https://pypi.org/project/deepeval/), [GitHub](https://github.com/confident-ai/deepeval)
- **RAGAS:** Apache-2.0, focused on RAG evaluation. The repo now resolves to `vibrantlabsai/ragas` (about 16.3k stars). The latest release, v0.4.3, came out 13 Jan 2026, and the last commit was 24 Feb 2026. — [GitHub vibrantlabsai/ragas](https://github.com/vibrantlabsai/ragas), [PyPI ragas](https://pypi.org/project/ragas/)
- **Arize Phoenix:** licensed under Elastic License 2.0, which is source-available. Some comparison guides wrongly call it Apache-2.0. arize-phoenix 21.0.0 was released 30 Oct 2026, and the repo was pushed 7 Nov 2026, with about 12.2k stars. It is an observability, tracing and eval tool. — [Phoenix LICENSE](https://github.com/Arize-ai/phoenix/blob/main/LICENSE), [PyPI](https://pypi.org/project/arize-phoenix/); the Apache claim appears in [vdf.ai](https://vdf.ai/blog/llm-evaluation-tools/)
- **LangSmith:** hosted platform with MIT-licensed SDKs. On 16 Oct 2026 the `langchain-ai/langsmith-sdk` repo was archived and split into `langsmith-python` and `langsmith-javascript`. Package names are unchanged, and `langsmith` 0.14.17 was released on PyPI on 2 Nov 2026. — [GitHub langsmith-sdk README](https://github.com/langchain-ai/langsmith-sdk), [PyPI langsmith](https://pypi.org/project/langsmith/)
- **Braintrust:** hosted eval and observability platform with open SDKs. The Python `braintrust` package 0.49.3 was released 6 Nov 2026. The JS SDK repo was renamed `braintrust-sdk-javascript`, with release 3.43.0 on 5 Nov 2026. — [PyPI braintrust](https://pypi.org/project/braintrust/), [GitHub](https://github.com/braintrustdata/braintrust-sdk-javascript)
  - Pricing in third-party guides (Braintrust Pro $249/mo, LangSmith Plus $39/seat/mo) is unverified. — [inference.net](https://inference.net/content/llm-evaluation-tools-comparison/)

### Inferences
- Teams on OpenAI's hosted Evals must migrate before 30 Nov 2026. The official path points to Promptfoo, which OpenAI now owns.
- RAGAS's commit gap since February 2026 is worth checking before adopting it as a long-term dependency. This is an observation from repository activity, not a confirmed deprecation.
- Phoenix's ELv2 license limits offering it as a managed service. Check the license before redistributing or hosting it.

### Gaps
- I did not confirm whether the Promptfoo acquisition has closed, or OpenAI's formal open-source commitment for it.
- I did not check whether the RAGAS maintainers announced a pause, a fork, or new hosting (the repo is under the vibrantlabsai organization).
- I did not fetch feature lists from each tool's official docs. Capability descriptions above come from READMEs and comparison guides.

## What are recommended best practices for building an evaluation pipeline (offline + online)?

### Takeaway
The sources I verified support five practices:
- Report uncertainty: standard errors, clustered standard errors when questions are grouped, and paired model comparisons.
- Evaluate across several prompt formats instead of one.
- Pair safety scores with over-refusal scores.
- Pin judge, decoding settings and generation length so results stay comparable.
- Use precisely defined latency and throughput metrics.

I did not verify primary vendor guidance on golden datasets, CI regression gates or online A/B testing in this pass.

### Cited Findings
- Report the mean with its standard error and the number of questions. Use clustered standard errors for grouped questions and paired differences for model comparisons, and run a power analysis to size the eval set. — [Miller 2024, arXiv 2411.00640](https://arxiv.org/abs/2411.00640)
- Report a range of performance across plausible prompt formats, using FormatSpread, rather than a single format. — [Sclar et al., arXiv 2310.11324](https://arxiv.org/abs/2310.11324)
- Standardize decoding (greedy) and generation length (512 tokens), and use a validated classifier judge. Length alone shifted substring-based ASR by up to 30%. — [HarmBench](https://arxiv.org/html/2402.04249)
- Human-validate automated jailbreak judges, because prior evaluators overstated jailbreak success. — [StrongREJECT](https://arxiv.org/abs/2402.10260)
- Measure safety and over-refusal together, because the two trade off. — [OR-Bench](https://arxiv.org/abs/2405.20947)
- Compare latency numbers across tools only when the metric definitions align, and exclude warmup from throughput windows. — [NVIDIA NIM metrics](https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html)
- Hosted eval platforms can be retired, as OpenAI Evals shows. Keeping eval definitions in portable, code-based form reduces migration risk. — [OpenAI deprecations](https://developers.openai.com/api/docs/deprecations)

### Inferences
- A reasonable pipeline based on the above:
  - Offline: a versioned golden set, run in CI with a pytest-style framework (DeepEval, Promptfoo or Inspect). Each run reports scores with standard errors and paired deltas against the baseline. It covers multiple prompt formats, includes safety and over-refusal suites, and pins judges and decoding settings.
  - Online: tracing and feedback (Phoenix, LangSmith or Braintrust) plus A/B tests with significance testing. Track TTFT, ITL and TPS at percentiles and cost per task.
  - This synthesis is my inference, not a single cited recommendation.

### Gaps
- I did not fetch Anthropic's "Define success criteria / create strong empirical evaluations" docs, OpenAI's eval best-practices guide, or Google's evaluation guidance. Recommendations from them on golden datasets, LLM-as-judge calibration and regression testing are not cited here.
- I found no source in this pass on online evaluation methodology (A/B test design, implicit or explicit user feedback, task-completion rate definitions).
- The NIST AI RMF and NIST GenAI (AI 600-1) recommendations were not retrieved.
