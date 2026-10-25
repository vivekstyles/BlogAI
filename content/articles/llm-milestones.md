---
title: 15 Major Milestones in the Evolution of Large Language Models (LLMs)
seoTitle: 15 Major Milestones in the Evolution of LLMs
description: 15 turning points in large language models from the 2017 Transformer to 2026 agents, with what changed before and after each one and the lesson it left.
author: BlogAI Editors
authorType: Organization
publishedAt: 2026-10-25
updatedAt: 2026-10-25
status: published
categories:
  - Artificial Intelligence
  - Programming and Technology
tags:
  - large language models
  - llm history
  - chatgpt
  - transformers
  - generative ai
  - ai
tocDepth: 2
---

The evolution of large language models (LLMs) was not a smooth climb. It was a series of **turning points**, moments after which researchers, companies or ordinary users did something they could not do before. This article picks the 15 that changed the field most between the Transformer paper in 2017 and the agentic models of 2026, and for each one answers three questions:

- **What happened**, with the date and the original source.
- **Before and after:** what was different the day after.
- **The lasting lesson** that still shapes how LLMs are built or used.

**How we chose.** A milestone had to change practice, not just set a benchmark record: a new way of building models, a new way of using them, or a change in who could access them. We used the original papers, developer announcements and model cards, checked on 25 October 2026. Benchmark numbers quoted here are the developers' own unless stated otherwise. If you want the longer story starting from 2001 statistical models, read [25 years of language models](/articles/history-of-language-models); for model-by-model profiles, see [20 most important LLMs explained](/articles/important-llms-explained).

<figure>
<img src="/images/articles/llm-milestones/llm-training-stack.svg" alt="The layers of a modern LLM, built bottom to top, each labeled with the milestones in this article that introduced it. Transformer architecture: milestone 1. Pretraining on large text: milestones 2 and 3. Scaling with compute and data: milestones 4 and 8. Instruction tuning and RLHF: milestone 7. Reasoning with reinforcement learning: milestones 13 and 14. Tools, long context and agents: milestones 6, 12 and 15. Chat product and open weights sit to the side as ways the stack reaches people: milestones 9, 10 and 11." width="720" height="380" loading="lazy" decoding="async" />
<figcaption>A modern LLM is built in layers. Most milestones added one layer; a few changed who could reach the result.</figcaption>
</figure>

## The 15 milestones at a glance

| # | Date | Milestone | What it changed |
|---|---|---|---|
| 1 | Jun 2017 | The Transformer | Attention-only architecture that scales on GPUs |
| 2 | Jun–Oct 2018 | GPT-1 and BERT | Pretrain once, fine-tune for every task |
| 3 | Feb 2019 | GPT-2 and staged release | Fluent text, and the first fight over publishing |
| 4 | Jan 2020 | Scaling laws | Progress became predictable and fundable |
| 5 | May 2020 | GPT-3 and few-shot prompting | Tasks set by a prompt, models sold by API |
| 6 | Jun 2021 | Codex and GitHub Copilot | LLMs inside a daily professional tool |
| 7 | Jan–Mar 2022 | InstructGPT and RLHF | Models that follow instructions |
| 8 | Mar 2022 | Chinchilla | Data matters as much as size |
| 9 | Nov 2022 | ChatGPT | LLMs reach the public |
| 10 | Feb 2023 | LLaMA's weights escape | The open-weight era begins |
| 11 | Mar 2023 | GPT-4 | Multimodal, exam-level, and secretive |
| 12 | Feb 2024 | Million-token context | Whole books and codebases in one prompt |
| 13 | Sep 2024 | o1 and test-time reasoning | A second scaling axis: thinking time |
| 14 | Jan 2025 | DeepSeek-R1 | Open reasoning at low reported cost |
| 15 | 2025–2026 | Agentic models and gated releases | Hours-long tasks; access tied to risk |

## 2017–2019: the foundations

### 1. The Transformer (June 2017)

**What happened:** eight Google researchers published "Attention Is All You Need", an architecture made only of attention and feed-forward layers, with no recurrence ([Vaswani et al., 2017](https://arxiv.org/abs/1706.03762)). Its larger version set a new English–German translation record of 28.4 BLEU while training in 3.5 days on eight GPUs.

**Before and after:** before, the best language and translation models were recurrent networks (LSTMs) that process one word at a time, which makes training on long texts slow. After, every position in a sequence could be processed in parallel, so training scaled with hardware. Within two years almost every state-of-the-art NLP model was a Transformer.

**The lasting lesson:** architectures that make good use of parallel hardware win. Nearly a decade later the Transformer remains the core of every major LLM, with refinements covered in our [30 key breakthroughs](/articles/llm-breakthroughs) article.

### 2. GPT-1 and BERT: pretrain, then fine-tune (June–October 2018)

**What happened:** OpenAI's GPT pretrained a Transformer decoder to predict the next word on books, then fine-tuned it for each task ([Radford et al., 2018](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)). Google's BERT pretrained an encoder to fill in masked words and topped 11 NLP benchmarks ([Devlin et al., 2018](https://arxiv.org/abs/1810.04805)).

**Before and after:** before, each NLP task usually needed its own architecture and a large labeled dataset. After, teams downloaded a pretrained model and fine-tuned it with a small labeled set. Accuracy rose and the cost of building a new NLP system fell.

**The lasting lesson:** most of a language model's knowledge comes from **self-supervised pretraining** on unlabeled text. Labeled data only steers it.

### 3. GPT-2 and staged release (February 2019)

**What happened:** OpenAI trained a 1.5-billion-parameter model on WebText, about 8 million web pages, and showed it writing long, coherent passages and attempting tasks with no fine-tuning ([Radford et al., 2019](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)). Citing the risk of misuse, OpenAI initially withheld the full model and released larger versions in stages through November 2019.

**Before and after:** before, AI labs published models and code as a matter of course. After, "should this model be released, and how?" became a standard question, and release decisions started to involve staged access, partner testing and model cards.

**The lasting lesson:** capability and release policy are linked. The same debate returned with open weights in 2023 and with gated access to cyber-capable models in 2026 (milestone 15).

## 2020–2021: scale and prompting

### 4. Scaling laws (January 2020)

**What happened:** an OpenAI team measured how test loss changes with model size, dataset size and compute, and found smooth power laws across more than seven orders of magnitude of compute ([Kaplan et al., 2020](https://arxiv.org/abs/2001.08361)).

**Before and after:** before, making a model bigger was a gamble. After, a lab could fit a curve on small runs and **predict** the loss of a run 100 times larger, which made very large training budgets easier to justify.

**The lasting lesson:** scaling laws turned LLM building into an engineering and investment problem. Their exact coefficients were later revised (milestone 8), but the method of extrapolating from small runs is used by every frontier lab.

### 5. GPT-3 and few-shot prompting (May 2020)

**What happened:** GPT-3, with 175 billion parameters, could translate, answer questions or do arithmetic from a handful of examples placed in the prompt, without any weight updates ([Brown et al., 2020](https://arxiv.org/abs/2005.14165)). OpenAI offered it through a paid API instead of releasing the weights.

**Before and after:** before, using a model for a new task meant fine-tuning it. After, a developer could **describe the task in text**. "Prompt engineering" appeared, and so did the business of selling model access by the token.

**The lasting lesson:** in-context learning made LLMs general-purpose tools, and the API model created today's LLM industry.

### 6. Codex and GitHub Copilot (June–July 2021)

**What happened:** GitHub launched a technical preview of Copilot, an AI pair programmer, in June 2021, powered by OpenAI's Codex. The Codex paper reported that a 12-billion-parameter version solved 28.8% of the HumanEval programming problems on the first attempt, against 0% for GPT-3 ([Chen et al., 2021](https://arxiv.org/abs/2107.03374)).

**Before and after:** before, LLMs were demos and research tools. After, millions of developers used one inside their editor every day, and code became a central training target for every major model.

**The lasting lesson:** code is where LLMs first showed clear, measurable productivity value, partly because code can be **tested automatically**. That property later powered reasoning training (milestones 13 and 14).

## 2022: from text predictor to assistant

### 7. InstructGPT and RLHF (January–March 2022)

**What happened:** OpenAI fine-tuned GPT-3 on human-written demonstrations, trained a reward model on human rankings of outputs, and optimized the language model against it with reinforcement learning: **reinforcement learning from human feedback (RLHF)**. Labelers preferred outputs from a 1.3-billion-parameter InstructGPT over the 175-billion-parameter GPT-3 ([Ouyang et al., 2022](https://arxiv.org/abs/2203.02155)).

**Before and after:** before, a base model asked "Explain photosynthesis to a child" might continue with more questions instead of answering. After, models reliably did what they were asked, refused some harmful requests and wrote in a consistent style.

**The lasting lesson:** **post-training** is where a model's usefulness and behavior are shaped. Later methods such as Constitutional AI ([Bai et al., 2022](https://arxiv.org/abs/2212.08073)) and DPO ([Rafailov et al., 2023](https://arxiv.org/abs/2305.18290)) refined it, but every assistant model goes through this stage.

### 8. Chinchilla: compute-optimal training (March 2022)

**What happened:** DeepMind trained over 400 models and concluded that, for a fixed compute budget, parameters and training tokens should grow in equal proportion. Its 70-billion-parameter Chinchilla, trained on 1.4 trillion tokens, beat the 280-billion-parameter Gopher that used the same compute ([Hoffmann et al., 2022](https://arxiv.org/abs/2203.15556)).

**Before and after:** before, labs mostly scaled parameters (GPT-3 saw about 300 billion tokens). After, they trained smaller models on far more data, which also made models cheaper to run. A widely used rule of thumb from the paper is about **20 training tokens per parameter**.

**The lasting lesson:** **data is a first-class scaling resource.** Many later models train well beyond the Chinchilla ratio on purpose, because a smaller model trained longer is cheaper to serve to millions of users.

### 9. ChatGPT (30 November 2022)

**What happened:** OpenAI released ChatGPT, a free chat interface to a GPT-3.5 model trained with RLHF ([OpenAI, 2022](https://openai.com/index/chatgpt/)). UBS analysts estimated, from Similarweb data, that it reached about 100 million monthly active users in January 2023 ([Reuters, 2023](https://www.reuters.com/technology/chatgpt-sets-record-fastest-growing-user-base-analyst-note-2023-02-01/)); OpenAI did not publish that figure itself.

**Before and after:** before, LLMs were known mainly to researchers and developers. After, students, office workers and executives used them daily, competitors rushed out their own chatbots, and schools, publishers and regulators had to respond.

**The lasting lesson:** the technology behind ChatGPT was mostly in place by early 2022. The milestone was **packaging**: a free, simple chat interface on top of an instruction-tuned model.

## 2023: the frontier and the open alternative

### 10. LLaMA's weights escape (February–March 2023)

**What happened:** Meta released LLaMA, models from 7 to 65 billion parameters trained on up to 1.4 trillion tokens, to approved researchers; the 13-billion version outperformed GPT-3 on most reported benchmarks ([Touvron et al., 2023](https://arxiv.org/abs/2302.13971)). Within about a week the weights were posted publicly online ([The Verge, 2023](https://www.theverge.com/2023/3/8/23629362/meta-ai-language-model-llama-leak-online-misuse)).

**Before and after:** before, a competitive LLM required a frontier lab. After, hobbyists and start-ups fine-tuned LLaMA on laptops and single GPUs within weeks, helped by LoRA fine-tuning and 4-bit quantization. Meta then released Llama 2 for commercial use in July 2023, and Mistral AI's Apache-licensed Mistral 7B followed in September.

**The lasting lesson:** once capable weights are public, a large community improves them quickly. Open-weight models have trailed the closed frontier by months, not years, ever since. Our list of [open-source LLMs to know in 2026](/articles/open-source-llms) covers where that line stands now.

### 11. GPT-4 (14 March 2023)

**What happened:** GPT-4 accepted images as well as text and, on OpenAI's evaluations, scored around the top 10% of test takers on a simulated bar exam. Its technical report deliberately omitted architecture, model size, hardware, training compute and dataset details ([OpenAI, 2023](https://arxiv.org/abs/2303.08774)).

**Before and after:** before, the leading model papers described how the models were built. After, frontier labs competed on capability and published far less, while independent evaluation of their claims became harder. Anthropic launched Claude the same day and Google followed with Gemini in December 2023.

**The lasting lesson:** "frontier" models became products with system cards rather than research artifacts with papers. Much of what the public knows about them comes from the developers' own evaluations.

## 2024–2026: context, reasoning and agents

### 12. Million-token context (February 2024)

**What happened:** Google's Gemini 1.5 Pro offered a context window of up to 1 million tokens and reported near-perfect retrieval of facts hidden in up to 10 million tokens of text in research tests ([Gemini Team, 2024](https://arxiv.org/abs/2403.05530)). In 2023 the largest commercially offered windows had been around 100,000 to 200,000 tokens.

**Before and after:** before, long documents had to be split into chunks and retrieved piece by piece. After, a model could read a long novel, a full codebase or hours of transcripts in one prompt. Retrieval-augmented generation did not disappear, since long prompts are slower and cost more, but many tasks became simpler.

**The lasting lesson:** context length became a headline feature. By 2026, 1-million-token windows are standard on frontier models and common on large open-weight ones.

### 13. o1 and test-time reasoning (September 2024)

**What happened:** OpenAI's o1 was trained with reinforcement learning to think in a long internal chain of thought before answering. On the 2024 AIME math competition, OpenAI reported about 12% for GPT-4o and 74% for o1 with a single attempt per problem ([OpenAI, 2024](https://openai.com/index/learning-to-reason-with-llms/)). OpenAI also showed that accuracy kept rising with more thinking time.

**Before and after:** before, the main way to improve a model was to train a bigger one. After, labs could also improve answers by **spending more compute at inference time**. Within a year, most frontier and many open models offered a reasoning or "thinking" mode, often with a setting for how much effort to spend.

**The lasting lesson:** reasoning comes from training on problems with checkable answers. That makes it strongest in math, code and science, where answers can be verified, and less reliable on open-ended questions.

### 14. DeepSeek-R1 (20 January 2025)

**What happened:** DeepSeek released R1, a reasoning model whose paper showed that pure reinforcement learning with rule-based rewards could teach a base model to reason at length, and published the weights under the MIT license ([DeepSeek-AI, 2025](https://arxiv.org/abs/2501.12948)). It was built on DeepSeek-V3, whose final training run used 2.788 million H800 GPU hours, which the report priced at about \$5.6 million at an assumed \$2 per GPU hour, excluding earlier research and experiments ([DeepSeek-AI, 2024](https://arxiv.org/abs/2412.19437)).

**Before and after:** before, o1-style reasoning was only available behind a closed API and its training recipe was unpublished. After, anyone could download and study a comparable reasoning model, distill it into smaller ones and reproduce the method. The low reported training cost, often quoted without its caveats, also shook assumptions about how much money frontier-class models require.

**The lasting lesson:** efficiency is a competitive advantage, and reasoning recipes spread fast once published. Chinese labs have released many of the strongest open-weight models since.

### 15. Agentic models and gated frontier releases (2025–2026)

**What happened:** from late 2024 the frontier moved from answering questions to **carrying out tasks**: operating a computer, running code in a terminal, searching and browsing over many steps. Anthropic released computer use for Claude in October 2024 ([Anthropic, 2024](https://www.anthropic.com/news/3-5-models-and-computer-use)), and by 2026 developers routinely describe their models by how well they handle long-horizon agentic work. Capability in cybersecurity grew fast enough that the most capable 2026 models were first released to limited groups: OpenAI's GPT-6 Astra to participants in a cybersecurity program ([CNBC, 2026](https://www.cnbc.com/2026/09/03/open-ai-astra-gpt-6-cyber.html)) and Google's Gemini 4 Argon to trusted cyber defenders ([Google, 2026](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/)).

**Before and after:** before, an LLM produced text and a person acted on it. After, the model takes many actions itself, so reliability over long tasks, permission controls and security matter as much as answer quality. Release decisions are increasingly tied to measured risks rather than made once for everyone.

**The lasting lesson:** the questions from 2019 (milestone 3) are back in a new form: who gets access, when, and with which safeguards. This milestone is still unfolding, so expect the details to change.

## Patterns across the milestones

- **Most milestones combine an idea with scale.** Attention existed before 2017, RLHF before 2022 and chain-of-thought before 2024. Each became a milestone when it was applied to a large enough model.
- **Usability milestones matter as much as capability milestones.** ChatGPT (9) and Copilot (6) changed more lives than any benchmark result, by putting existing models where people already work.
- **Openness swings back and forth.** Open papers (1, 2), staged release (3), API-only models (5, 11), leaked and then open weights (10, 14) and gated access (15) are all responses to the same tension between sharing and control.
- **Verification is a theme.** Code tests (6), math answers (13, 14) and agent tasks (15) are where progress is fastest because results can be checked automatically. When you read a claimed milestone, ask how it was measured and by whom. Our guide to [reading engineering blog posts critically](/articles/read-engineering-blog-posts-critically) applies to model announcements too.

## References

All accessed 25 October 2026.

- Vaswani, A. et al. (2017). [Attention is all you need](https://arxiv.org/abs/1706.03762).
- Radford, A. et al. (2018). [Improving language understanding by generative pre-training](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf). OpenAI.
- Devlin, J. et al. (2018). [BERT](https://arxiv.org/abs/1810.04805).
- Radford, A. et al. (2019). [Language models are unsupervised multitask learners](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf). OpenAI.
- Kaplan, J. et al. (2020). [Scaling laws for neural language models](https://arxiv.org/abs/2001.08361).
- Brown, T. et al. (2020). [Language models are few-shot learners](https://arxiv.org/abs/2005.14165).
- Chen, M. et al. (2021). [Evaluating large language models trained on code](https://arxiv.org/abs/2107.03374).
- Ouyang, L. et al. (2022). [Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155).
- Hoffmann, J. et al. (2022). [Training compute-optimal large language models](https://arxiv.org/abs/2203.15556).
- OpenAI (2022). [Introducing ChatGPT](https://openai.com/index/chatgpt/).
- Reuters (2023). [ChatGPT sets record for fastest-growing user base](https://www.reuters.com/technology/chatgpt-sets-record-fastest-growing-user-base-analyst-note-2023-02-01/), 1 February 2023.
- Touvron, H. et al. (2023). [LLaMA: open and efficient foundation language models](https://arxiv.org/abs/2302.13971).
- OpenAI (2023). [GPT-4 technical report](https://arxiv.org/abs/2303.08774).
- Gemini Team (2024). [Gemini 1.5: unlocking multimodal understanding across millions of tokens of context](https://arxiv.org/abs/2403.05530).
- OpenAI (2024). [Learning to reason with LLMs](https://openai.com/index/learning-to-reason-with-llms/), 12 September 2024.
- DeepSeek-AI (2024, 2025). [DeepSeek-V3 technical report](https://arxiv.org/abs/2412.19437); [DeepSeek-R1](https://arxiv.org/abs/2501.12948).
- Anthropic (2024). [Introducing computer use](https://www.anthropic.com/news/3-5-models-and-computer-use), 22 October 2024.
- CNBC (2026). [OpenAI announces rollout of GPT-6 Astra model](https://www.cnbc.com/2026/09/03/open-ai-astra-gpt-6-cyber.html), 3 September 2026.
- Google (2026). [Gemini 4 Argon](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/), 30 September 2026.
