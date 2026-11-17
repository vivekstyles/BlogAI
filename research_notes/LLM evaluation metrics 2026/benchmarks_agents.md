# LLM capability benchmarks and agent evaluation (as of November 2026)

Research date: 2026-11-07. Source note: items marked "(paper, not re-fetched)" cite the benchmark's original arXiv paper for basic design facts (size, format, metric) that are long-established; they were not re-opened in this session, so the report writer should spot-check any exact number before publishing. Items from aggregators/blogs are labelled as such. Model scores are given only where dated, and most are secondary.

## What does each benchmark measure, its size/format, and its scoring metric?

### Takeaway
The 2026 "benchmark stack" is: hard expert QA (GPQA Diamond, Humanity's Last Exam), novel-reasoning puzzles (ARC-AGI-2 and the interactive ARC-AGI-3), competition math (AIME, FrontierMath), repo-level and terminal coding (SWE-bench Pro, Terminal-Bench 2.0, LiveCodeBench), agentic tool use (tau2-bench, OSWorld-Verified, GAIA, WebArena) and METR's time-horizon metric. Most report accuracy or task success rate; agent benchmarks add reliability metrics (pass^k) or task-length metrics (50% time horizon).

### Cited Findings

**Knowledge / reasoning**
- MMLU: 57 subjects (STEM, humanities, social sciences), 4-option multiple choice, accuracy metric; ~14k test questions — [MMLU paper, Hendrycks et al. 2020 (paper, not re-fetched)](https://arxiv.org/abs/2009.03300)
- MMLU-Pro: harder, reasoning-focused successor with 10 answer options instead of 4 (lowers chance-guessing) and ~12k questions; designed to be less prompt-sensitive than MMLU — [MMLU-Pro paper (paper, not re-fetched)](https://arxiv.org/abs/2406.01574)
- GPQA Diamond: the 198-question highest-quality subset of GPQA, graduate-level "Google-proof" multiple-choice questions in biology, physics and chemistry written by domain experts; accuracy metric — [GPQA paper (paper, not re-fetched)](https://arxiv.org/abs/2311.12022)
- Humanity's Last Exam (HLE): created by Center for AI Safety and Scale AI; publicly released January 2025; 2,500 public questions; ~24% multiple choice, rest short-answer exact match; ~14% multimodal (text+image); private held-out set kept to detect overfitting; subject mix: math 41%, biology/medicine 11%, CS/AI 10%, physics 9%, humanities/social science 9%, chemistry 7%, engineering 4%, other 9%; published in Nature vol. 649 (2026) — [Wikipedia: Humanity's Last Exam](https://en.wikipedia.org/wiki/Humanity%27s_Last_Exam)
- HLE reports accuracy, and the original paper also reports calibration error (models' stated confidence vs. correctness) — [HLE paper (paper, not re-fetched)](https://arxiv.org/abs/2501.14249)
- HLE-Rolling: a version "regularly updated to address community feedback and integrate new questions" — [Wikipedia: Humanity's Last Exam](https://en.wikipedia.org/wiki/Humanity%27s_Last_Exam)
- ARC-AGI-3 launched 25 March 2026 as the first fully interactive ARC benchmark: turn-based game-style environments with no instructions, rules or stated goals; agent must discover mechanics and the win condition and carry learning to harder levels; "hundreds" of environments and "thousands" of levels handcrafted by human game designers; humans 100%, frontier AI 0.51% at launch — [ARC Prize: ARC-AGI-3 launch](https://arcprize.org/blog/arc-agi-3-launch)
- ARC Prize 2026: >$2M in prizes across an ARC-AGI-3 Kaggle agent competition and an ARC-AGI-2 Grand Prize for the best open-source solution; a banner on the launch page says ARC Prize 2026 has finished and results will be announced 4 December 2026 — [ARC Prize: ARC-AGI-3 launch](https://arcprize.org/blog/arc-agi-3-launch)
- ARC-AGI-3 developer access via SDK (`pip install arc-agi`) or REST API — [DataCamp: ARC-AGI-3 (secondary)](https://www.datacamp.com/ja/blog/arc-agi-3)
- ARC-AGI-2 (2025): static grid-transformation puzzles scored by exact-match on the output grid, calibrated so tasks are solvable by humans but hard for AI, with efficiency (cost per task) reported alongside accuracy — [ARC-AGI-2 paper (paper, not re-fetched)](https://arxiv.org/abs/2505.11831)

**Math**
- GSM8K: ~8.5k grade-school word problems (1,319 test), final-answer accuracy — [GSM8K paper (paper, not re-fetched)](https://arxiv.org/abs/2110.14168)
- MATH: 12,500 competition problems (5,000 test) across 7 subjects and 5 difficulty levels; exact-match on final boxed answer; MATH-500 subset is common in reporting — [MATH paper (paper, not re-fetched)](https://arxiv.org/abs/2103.03874)
- AIME: 30 problems per year (AIME I + II, 15 each), integer answers 0–999; labs report the newest year's set to limit contamination. (Format is from the official competition; no source fetched this session — see Gaps.)
- FrontierMath (Epoch AI) is cited in AI Index 2026 coverage as designed by mathematicians to resist saturation, with no model above 30% — [CloudTweaks summary of AI Index 2026 (secondary)](https://cloudtweaks.com/2026/05/standford-2026-ai-index/)

**Coding**
- HumanEval: 164 hand-written Python function problems with unit tests; metric pass@k (introduced in this paper) — [Codex/HumanEval paper (paper, not re-fetched)](https://arxiv.org/abs/2107.03374)
- SWE-bench: real GitHub issues from Python repos; model must produce a patch that makes FAIL_TO_PASS tests pass without breaking PASS_TO_PASS tests; metric % resolved — [SWE-bench paper (paper, not re-fetched)](https://arxiv.org/abs/2310.06770). SWE-bench Verified is the 500-task human-validated subset (OpenAI, 2024) — see criticisms section.
- SWE-bench Pro (Scale AI): 1,865 human-verified tasks from copyleft (e.g., GPL) public repos plus private commercial codebases from startup partners; public, held-out and private subsets — [Harbor hub: SWE-bench Pro](https://hub.harborframework.com/datasets/scale-ai/swe-bench-pro); [systems-analysis.ru summary (secondary)](https://systems-analysis.ru/eng/SWE-bench_Pro)
- LiveCodeBench: continuously collects new problems from LeetCode, AtCoder and Codeforces with release dates, so models can be scored only on problems published after their training cutoff; covers generation, self-repair, code execution and test-output prediction; pass@1 — [LiveCodeBench paper (paper, not re-fetched)](https://arxiv.org/abs/2403.07974)
- Terminal-Bench 2.0: 89 real-world multi-step terminal tasks in containers, run through the Harbor harness (`harbor run -d terminal-bench@2.0 ...`); paper reports frontier agents resolve <65%, smaller models ~15% — [Terminal-Bench 2.0 paper, arXiv 2601.11868](https://arxiv.org/pdf/2601.11868); [VentureBeat on launch with Harbor (Nov 2025)](https://venturebeat.com/ai/terminal-bench-2-0-launches-alongside-harbor-a-new-framework-for-testing)
- Terminal-Bench scoring is all-or-nothing per task: pass only if every test in the task's test script succeeds — [Inspect Evals: Terminal-Bench 2.0](https://ukgovernmentbeis.github.io/inspect_evals/evals/coding/terminal_bench_2)

**Agentic / tool use**
- tau-bench (Sierra, 2024): simulated customer-service conversations (retail, airline) where an LLM-simulated user interacts with an agent that has domain API tools and a policy document; success = final database state matches the goal state; introduced pass^k — [tau-bench paper (paper, not re-fetched)](https://arxiv.org/abs/2406.12045)
- tau2-bench (Barres et al., June 2025) adds a telecom "dual-control" domain where both agent and user use tools in a shared environment; telecom is markedly harder than retail/airline — [tau2-bench paper, arXiv 2506.07982](https://arxiv.org/abs/2506.07982); official repo [sierra-research/tau2-bench](https://github.com/sierra-research/tau2-bench)
- GAIA: 466 real-world assistant questions needing browsing, multimodality and tool use, with short unambiguous answers; three difficulty levels; exact-match scoring; humans ~92% vs GPT-4 with plugins ~15% at release — [GAIA paper (paper, not re-fetched)](https://arxiv.org/abs/2311.12983)
- WebArena: 812 tasks on self-hosted functional websites (e-commerce, forum, GitLab, CMS, maps); functional-correctness success rate — [WebArena paper (paper, not re-fetched)](https://arxiv.org/abs/2307.13854)
- OSWorld: 369 tasks on real Ubuntu/Windows desktops with execution-based checkers; original human baseline 72.36% vs 12.24% best model at release — [OSWorld paper (paper, not re-fetched)](https://arxiv.org/abs/2404.07972); human/model baseline figures repeated in [buildmvpfast (secondary)](https://www.buildmvpfast.com/blog/osworld-benchmark-ai-agents-passed-human-baseline-2026). OSWorld-Verified is the maintainers' revised version with fixed tasks; leaderboard at os-world.github.io.
- METR time horizon: "the task length (measured by human expert completion time) at which a model succeeds about 50% of the time"; original method fits a logistic curve of success vs. log human time — [METR paper, Kwa et al. 2025 (paper, not re-fetched)](https://arxiv.org/abs/2503.14499); [METR Time Horizon 1.1 post, 29 Jan 2026](https://metr.org/blog/2026-1-29-time-horizon-1-1)

**Contamination-resistant / live**
- LiveBench: adds/updates questions monthly from recent sources, replacing ~1/6 per update (fully refreshed about every six months), objective ground-truth scoring (no LLM judge) — [Position paper arXiv 2605.17273 describing LiveBench](https://arxiv.org/pdf/2605.17273); [LiveBench paper (paper, not re-fetched)](https://arxiv.org/abs/2406.19314)

**Long context**
- RULER (NVIDIA): synthetic tasks beyond single needle retrieval (multi-key/multi-value needles, multi-hop variable tracking, aggregation, QA) at configurable lengths; showed many models claiming 32k+ context degrade well before their claimed length — [RULER paper (paper, not re-fetched)](https://arxiv.org/abs/2404.06654)
- Needle-in-a-haystack: inserts one fact into long filler text at varying depths/lengths and asks the model to retrieve it; RULER was created partly because vanilla NIAH is near-saturated and only tests shallow retrieval — [RULER paper (paper, not re-fetched)](https://arxiv.org/abs/2404.06654)

**Instruction following**
- IFEval: ~500 prompts with 25 types of "verifiable instructions" (e.g., word counts, no commas, JSON format) checked programmatically; reports prompt-level and instruction-level strict/loose accuracy — [IFEval paper (paper, not re-fetched)](https://arxiv.org/abs/2311.07911)

### Inferences
- The trend is from static multiple-choice to (a) expert-written hard QA, (b) dynamic/refreshing sets, and (c) execution-graded agent tasks in containers or VMs. Containerised harnesses (Harbor, Inspect) are becoming the standard way to run agent evals.

### Gaps
- No official AIME source fetched; ARC-AGI-3's exact scoring formula (e.g., action-efficiency relative to humans) was not described on the launch page fetched.
- Did not fetch Epoch AI Benchmarking Hub or Stanford HELM pages directly.

## Which are considered saturated by 2026 and what replaced them?

### Takeaway
MMLU, GSM8K, HumanEval, MATH (and largely MMLU-Pro, GPQA Diamond, vanilla needle-in-a-haystack, original OSWorld human baseline and SWE-bench Verified) no longer separate frontier models. Replacements: HLE, FrontierMath, ARC-AGI-2/3, SWE-bench Pro, Terminal-Bench 2.0, OSWorld-Verified / OSWorld 2.0, tau2-bench, LiveBench/LiveCodeBench, and METR time horizons.

### Cited Findings
- Stanford AI Index 2026 coverage: nearly half of evaluations from leading AI companies show saturation, defined as "loss of reliable discriminative power among top-performing models"; hiding test data showed no protective effect against saturation — [CloudTweaks summary of AI Index 2026 (secondary; primary not fetched)](https://cloudtweaks.com/2026/05/standford-2026-ai-index/)
- Same coverage cites ~93% GPQA, above the 81.2% human-expert baseline, and near-ceiling SWE-bench Verified; HLE scores reported inconsistently (38.3% vs. "over 50%") across secondary outlets — [CloudTweaks (secondary)](https://cloudtweaks.com/2026/05/standford-2026-ai-index/); [ai2.work on HLE (secondary)](https://ai2.work/blog/stanford-ai-index-reveals-models-now-ace-half-of-humanity-s-last-exam)
- HLE text-only top scores per Artificial Analysis, dated 23 Oct 2026: Claude Opus 5.5 61.4%, Gemini 4 Argon 57.1%, GPT-6 Astra 54.7% (as relayed by Wikipedia; not verified on Artificial Analysis directly) — [Wikipedia: Humanity's Last Exam](https://en.wikipedia.org/wiki/Humanity%27s_Last_Exam)
- OpenAI (23 Feb 2026) stopped reporting SWE-bench Verified and recommends SWE-bench Pro until new uncontaminated evals exist — [OpenAI: Why we no longer evaluate SWE-bench Verified](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/) (page returned 403 to fetcher; content via [The Decoder](https://the-decoder.com/openai-wants-to-retire-the-ai-coding-benchmark-that-everyone-has-been-competing-on/) and [Gigazine, 29 Apr 2026](https://gigazine.net/gsc_news/en/20260429-swe-bench-verified))
- SWE-bench Pro: top models ~23% on public set at launch versus 70%+ on Verified; vendor-scaffold results run much higher (70–80%) than Scale's standardized harness — [systems-analysis.ru (secondary)](https://systems-analysis.ru/eng/SWE-bench_Pro)
- OSWorld human baseline (72.4%) passed in 2026: GPT-5.4 self-reported 75.0% on OSWorld-Verified (5 Mar 2026); later aggregator snapshots report 85% (July 2026) and a 90.19% top official entry (1 Oct 2026); successor OSWorld 2.0 reportedly has best entries ~44% — [buildmvpfast (secondary)](https://www.buildmvpfast.com/blog/osworld-benchmark-ai-agents-passed-human-baseline-2026); [gentic.news computer-use (secondary)](https://gentic.news/computer-use); [cryptobriefing (secondary)](https://cryptobriefing.com/computer-use-agents-85-percent-osworld-benchmark/) — sources disagree on leaders; verify at os-world.github.io
- ARC-AGI-3 at launch: frontier AI 0.51% vs. humans 100% — [ARC Prize](https://arcprize.org/blog/arc-agi-3-launch)
- ARC-AGI-2: tracker articles claim top scores ~77% (Gemini 3.1 Pro) and 68.8% (Claude Opus 4.6), with "notable variance between trackers"; not confirmed on arcprize.org — [agentmarketcap / aggregator (secondary, unverified)](https://agentmarketcap.ai/blog/2026/04/09/livebench-2026-contamination-proof-benchmark-monthly-updates)
- METR itself flags ceiling risk: few tasks are long enough for latest models, and METR is "raising the ceiling" to avoid saturating its suite — [METR TH1.1](https://metr.org/blog/2026-1-29-time-horizon-1-1)
- Original vanilla NIAH is near-saturated; RULER introduced as harder — [RULER paper (paper, not re-fetched)](https://arxiv.org/abs/2404.06654)

### Inferences
- Benchmark half-lives are now 1–2 years: ARC-AGI-2 (2025) appears to have gone from low single digits to the high range within about a year per trackers, prompting ARC-AGI-3; OSWorld went from 12% to past human in about two years.
- Even "hard" replacements (HLE, OSWorld-Verified) were near or above 50%/human-level by late 2026, so live/interactive designs (LiveBench, ARC-AGI-3, METR long tasks) are the main hedge.

### Gaps
- Could not access Stanford AI Index 2026 primary report, nor Epoch AI hub; specific saturation numbers for MMLU/GSM8K/HumanEval in 2026 not sourced this session (widely known to be >90%, but no dated figure fetched).
- No official ARC-AGI-2 2026 leaderboard figure verified.

## What are the main criticisms (contamination, label errors, SWE-bench validity)?

### Takeaway
Key criticisms: label noise (MMLU ~6.5% errors, HLE ~30% of bio/chem answers disputed), contamination of public-repo benchmarks (SWE-bench Verified), flawed/overly narrow tests (59.4% of audited hard SWE-bench Verified problems), harness/scaffold dependence, and wide confidence intervals in agent metrics.

### Cited Findings
- MMLU-Redux: 14 experts re-annotated 5,700 MMLU questions; estimated 6.49% of MMLU questions contain errors; Virology subset 57% erroneous (wrong ground truth 33%, multiple correct 4%, unclear 14%); >20% errors in Logical Fallacies and College Chemistry; corrected labels change model rankings (e.g., Palmyra X v3 moves from 4th to 1st on Virology) — [Are We Done with MMLU? arXiv 2406.04127](https://arxiv.org/abs/2406.04127)
- HLE: July 2025 FutureHouse investigation suggested ~30% (the-decoder reports ~29%) of text-only chemistry/biology answers may be wrong; HLE team partly replicated and moved toward continuous revision — [Wikipedia](https://en.wikipedia.org/wiki/Humanity%27s_Last_Exam); [The Decoder](https://the-decoder.com/nearly-29-percent-of-humanitys-last-exam-questions-are-wrong-or-misleading/)
- HLE-Verified (arXiv 2602.13964, Feb 2026) audits HLE with a 19-category defect taxonomy and reports a significant portion of model "errors" are attributable to benchmark defects — [HLE-Verified, arXiv 2602.13964](https://arxiv.org/abs/2602.13964)
- SWE-bench Verified (OpenAI, Feb 2026): audit of a 27.6% subset that models often failed found at least 59.4% of audited problems had flawed tests rejecting functionally correct solutions; problems come from widely used open-source repos, so gains increasingly reflect training exposure — [OpenAI post](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/) via [The Decoder](https://the-decoder.com/openai-wants-to-retire-the-ai-coding-benchmark-that-everyone-has-been-competing-on/); [aiweekly](https://aiweekly.co/alerts/openai-drops-swe-bench-verified-backs-pro-after-flaw-audit)
- Underspecified SWE-bench task statements admit multiple valid interpretations while tests check only one — [The Decoder](https://the-decoder.com/openai-wants-to-retire-the-ai-coding-benchmark-that-everyone-has-been-competing-on/)
- SWE-bench Pro is not immune: a secondary report cites a May 2026 Datacurve audit claiming Pro graders mis-graded roughly a third of trials (unverified) — [aiweekly (secondary)](https://aiweekly.co/alerts/openai-drops-swe-bench-verified-backs-pro-after-flaw-audit); SWE-bench Pro's contamination resistance rests on Scale's design rationale (copyleft licences, private repos) rather than an independent audit — [Harbor hub](https://hub.harborframework.com/datasets/scale-ai/swe-bench-pro)
- Fewer organizations disclose training code, parameter counts or dataset sizes, which hinders contamination auditing (AI Index 2026 coverage) — [CloudTweaks (secondary)](https://cloudtweaks.com/2026/05/standford-2026-ai-index/)
- METR's time-horizon: only 5 of 31 long (8h+) tasks have measured human baselines; Opus 4.5's 95% CI spans 170–729 min around a 320-min estimate; results sensitive to task composition — [METR TH1.1](https://metr.org/blog/2026-1-29-time-horizon-1-1)

**Contamination detection/mitigation approaches (from sources above)**
- Date-stamped problems scored only after model cutoff (LiveCodeBench) — [LiveCodeBench (paper, not re-fetched)](https://arxiv.org/abs/2403.07974)
- Monthly refresh plus private held-back questions (LiveBench) — [arXiv 2605.17273](https://arxiv.org/pdf/2605.17273)
- Private held-out sets to detect overfitting (HLE; SWE-bench Pro private subset) — [Wikipedia HLE](https://en.wikipedia.org/wiki/Humanity%27s_Last_Exam); [Harbor hub](https://hub.harborframework.com/datasets/scale-ai/swe-bench-pro)
- Licence-based deterrence (GPL repos less likely in training corpora) — [Harbor hub](https://hub.harborframework.com/datasets/scale-ai/swe-bench-pro)
- Novel/interactive environments with no stated goals (ARC-AGI-3) — [ARC Prize](https://arcprize.org/blog/arc-agi-3-launch)
- Note: AI Index 2026 coverage reports that hiding test data did not protect against saturation — [CloudTweaks (secondary)](https://cloudtweaks.com/2026/05/standford-2026-ai-index/)

### Inferences
- Label error and contamination interact: once a benchmark's ceiling is set by noise (e.g., MMLU ~93–94% effective max given 6.5% errors), remaining "progress" is mostly noise-fitting or memorization.

### Gaps
- Did not fetch dedicated contamination-detection literature (n-gram overlap, membership inference, perturbation/rephrase tests like GSM1k); no sourced figures on those methods in this session.

## How do agent evaluations score success, and what reproducibility issues exist?

### Takeaway
Agents are scored by binary task success (execution-based checkers, database state match, all-tests-pass), aggregated as success rate; tau-bench adds pass^k for consistency; METR converts success vs. human task length into a 50% (and 80%) time horizon. Scores depend heavily on scaffold, harness and infrastructure.

### Cited Findings
- pass^k = probability an agent succeeds on all k independent trials of the same task (pass^1 = expected success rate); contrasts with pass@k (at least one of k succeeds); tau2-bench leaderboard shows pass^k for k=1–4; some models ~50% pass^1 in telecom but pass^k falls faster as k rises — [tau2-bench paper](https://arxiv.org/abs/2506.07982); [tau2-bench repo](https://github.com/sierra-research/tau2-bench)
- In tau2-bench, moving from no-user mode to dual-control drops pass@1 by 18% (gpt-4.1) and 25% (o4-mini), showing user-coordination is a major failure source — [Liner review of tau2-bench paper (secondary)](https://liner.com/review/τ2bench-evaluating-conversational-agents-in-dualcontrol-environment)
- Terminal-Bench: all-or-nothing per task, single attempt in Inspect implementation; Harbor runs allow multiple attempts (`--n-attempts 5`) — [Inspect Evals](https://ukgovernmentbeis.github.io/inspect_evals/evals/coding/terminal_bench_2); [Terminal-Bench 2.0 paper](https://arxiv.org/pdf/2601.11868)
- METR TH1.1 (29 Jan 2026): suite grew 170 → 228 tasks (73 new from HCAST; 15 removed, 53 updated to fix unclear descriptions, reward-hackable tasks, scoring errors); 8h+ tasks 14 → 31; infra moved from Vivaria to UK AISI's open-source Inspect; CIs via bootstrap over task families, tasks and runs — [METR TH1.1](https://metr.org/blog/2026-1-29-time-horizon-1-1)
- METR doubling times: whole-period ~196 days (~7 months) under both TH1 and TH1.1; since 2023: 165.3 → 130.8 days; since 2024: 108.9 → 88.6 days — [METR TH1.1](https://metr.org/blog/2026-1-29-time-horizon-1-1)
- METR TH1.1 50% horizons (minutes, TH1 → TH1.1): Claude Opus 4.5 289 → 320; GPT-5 138 → 214; o3 94 → 121; Claude Opus 4 86 → 101; GPT-4 (1106) 8.5 → 3.6 — [METR TH1.1](https://metr.org/blog/2026-1-29-time-horizon-1-1)
- Later 2026 METR figures are only available via secondary sources: Wikipedia snapshot (21 Feb 2026) lists Claude Opus 4.6 at ~14.5 h; a May 2026 snapshot cites Claude Mythos (Preview evaluated March 2026) at likely ≥16 h — [Wikipedia: METR](https://en.wikipedia.org/wiki/METR) (unverified on METR dashboard)
- Reproducibility (infrastructure): GPT-4o and o3 scored significantly higher under Vivaria than under Inspect — [METR TH1.1](https://metr.org/blog/2026-1-29-time-horizon-1-1)
- Reproducibility (scaffold): SWE-bench Pro vendor-scaffold scores (70–80%) far exceed Scale's standardized harness results (~23% public set at launch) — [systems-analysis.ru (secondary)](https://systems-analysis.ru/eng/SWE-bench_Pro)
- Reproducibility (self-reporting): GPT-5.4's 75.0% OSWorld-Verified was self-reported pending independent verification; aggregators disagree on the leader — [buildmvpfast (secondary)](https://www.buildmvpfast.com/blog/osworld-benchmark-ai-agents-passed-human-baseline-2026)
- Prompt-format sensitivity: MMLU-Pro reports reduced score variance across prompt styles versus MMLU (~2% vs ~4–5%) — [MMLU-Pro paper (paper, not re-fetched)](https://arxiv.org/abs/2406.01574)
- A 2026 position paper argues "state-of-the-art claims require state-of-the-art evidence" (reporting standards for benchmark claims) — [arXiv 2605.17273](https://arxiv.org/pdf/2605.17273)

### Inferences
- When comparing agent results, the evaluator (vendor vs. independent), harness (Harbor/Inspect/vendor), number of attempts (pass@1 vs pass@k vs pass^k), and date must be stated, or numbers are not comparable.
- The time-horizon metric's headline is the trend (doubling time), not single-model values, given CIs that span ~2x+.

### Gaps
- METR's 2026 dashboard values after January were not verified from METR itself.
- No primary source fetched on HELM's 2026 methodology or Epoch AI's benchmarking-hub standardization (both would strengthen the reproducibility section).
- GAIA/WebArena 2026 status (saturation, successors like WebArena-Verified or BrowseComp) not researched this session.
