---
title: "20 Most Important LLMs Explained: From GPT-1 to Today's AI Models"
seoTitle: "20 Most Important LLMs Explained: GPT-1 to 2026 Models"
description: 20 influential large language models from GPT-1 and BERT to GPT-4, Llama, DeepSeek-R1 and the 2026 frontier, each with its size, release, access and legacy.
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
  - gpt
  - llama
  - generative ai
  - ai
tocDepth: 2
---

Hundreds of large language models (LLMs) have been released since 2018, but a small number shaped everything after them. This guide explains the **20 most important**, in the order they appeared, from OpenAI's 117-million-parameter GPT-1 to the trillion-parameter-scale models of 2026. Each entry has a short **spec line** and answers the same questions:

- **What it is:** the model and who built it.
- **What was new:** the design or result that set it apart.
- **Why it matters:** what later models inherited from it.

**How we chose.** "Important" here means *influential*: a model that introduced a technique, changed how models are used or opened access to new groups of people. It is not a ranking of current capability; for that, test models on your own tasks. Sizes, dates and licenses come from the original papers, model cards and developer announcements, checked on 25 October 2026. Many frontier labs no longer publish parameter counts; where a size is undisclosed we say so rather than repeat outside estimates.

**Key terms.** *Parameters* are the learned weights; more parameters usually means more capacity, but not always better results. *Tokens* are the word pieces models read and write. *Open weights* means the trained parameters can be downloaded; *API-only* means you can use the model only through the developer's service. A *mixture-of-experts (MoE)* model has many parameters in total but uses only a fraction of them (the *active* parameters) for each token.

<figure>
<img src="/images/articles/important-llms-explained/parameter-counts.svg" alt="Scatter chart of published parameter counts on a logarithmic scale from 100 million to 3 trillion, plotted against release date from 2018 to 2026. Dense models rise from GPT-1 at 117 million in 2018 through GPT-2 at 1.5 billion, T5 at 11 billion, GPT-3 at 175 billion and PaLM at 540 billion in 2022, then fall back to LLaMA at 65 billion in 2023 before Llama 3.1 at 405 billion in 2024. Mixture-of-experts models are drawn with a filled dot for total parameters and a hollow dot for active parameters: Mixtral 47 and 13 billion, DeepSeek-V3 671 and 37 billion, and Kimi K3 2.8 trillion and 104 billion in 2026. A note below the chart lists models whose size was not disclosed and are not plotted: ChatGPT, GPT-4, Claude, Gemini, GPT-4o, o1 and the 2026 frontier models." width="720" height="400" loading="lazy" decoding="async" />
<figcaption>Published parameter counts only. Since GPT-4 in 2023, most frontier labs have not disclosed model sizes, so the largest known models are open-weight ones.</figcaption>
</figure>

## The 20 models at a glance

| # | Model | Developer | Released | Size | Access |
|---|---|---|---|---|---|
| 1 | GPT-1 | OpenAI | Jun 2018 | ~117M | Open weights |
| 2 | BERT | Google | Oct 2018 | 110M / 340M | Open weights |
| 3 | GPT-2 | OpenAI | Feb–Nov 2019 | 1.5B | Open weights (staged) |
| 4 | T5 | Google | Oct 2019 | up to 11B | Open weights |
| 5 | GPT-3 | OpenAI | May 2020 | 175B | API-only |
| 6 | Codex | OpenAI | Jul 2021 | 12B (paper) | API-only |
| 7 | Chinchilla | DeepMind | Mar 2022 | 70B | Not released |
| 8 | PaLM | Google | Apr 2022 | 540B | Not released, later API |
| 9 | BLOOM | BigScience | Jul 2022 | 176B | Open weights (RAIL license) |
| 10 | ChatGPT (GPT-3.5) | OpenAI | Nov 2022 | Undisclosed | Free and paid app, API |
| 11 | LLaMA | Meta | Feb 2023 | 7B–65B | Research license |
| 12 | GPT-4 | OpenAI | Mar 2023 | Undisclosed | App and API |
| 13 | Claude | Anthropic | Mar 2023 | Undisclosed | App and API |
| 14 | Mistral 7B and Mixtral | Mistral AI | Sep–Dec 2023 | 7.3B; 46.7B MoE | Open weights (Apache 2.0) |
| 15 | Gemini | Google DeepMind | Dec 2023 | Undisclosed | App and API |
| 16 | Llama 3 and 3.1 | Meta | Apr–Jul 2024 | 8B–405B | Open weights (Llama license) |
| 17 | GPT-4o | OpenAI | May 2024 | Undisclosed | App and API |
| 18 | o1 | OpenAI | Sep 2024 | Undisclosed | App and API |
| 19 | DeepSeek-V3 and R1 | DeepSeek | Dec 2024–Jan 2025 | 671B MoE (37B active) | Open weights (MIT for R1) |
| 20 | The 2026 frontier | Several | 2026 | Mostly undisclosed | Mixed, some gated |

## 2018–2019: the first pretrained Transformers

### 1. GPT-1 (OpenAI, June 2018)

**Spec:** about 117 million parameters · 12-layer Transformer decoder · trained on BooksCorpus · weights released.

**What it is:** the first "Generative Pre-trained Transformer". OpenAI pretrained it to predict the next token on about 7,000 unpublished books, then fine-tuned it separately for tasks such as question answering and textual entailment ([Radford et al., 2018](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)).

**What was new:** combining the then-new Transformer with generative pretraining. It improved the state of the art on 9 of the 12 tasks studied.

**Why it matters:** every GPT model, and the decoder-only design used by almost all chat models today, descends from it.

### 2. BERT (Google, October 2018)

**Spec:** BERT-Base 110M and BERT-Large 340M parameters · Transformer encoder · English Wikipedia and BooksCorpus · weights released.

**What it is:** a model that reads text in both directions at once. It was pretrained by hiding 15% of tokens and predicting them from the surrounding words, and by predicting whether two sentences follow each other ([Devlin et al., 2018](https://arxiv.org/abs/1810.04805)).

**What was new:** deep **bidirectional** context. BERT set new records on 11 NLP tasks, including the GLUE benchmark and SQuAD question answering.

**Why it matters:** BERT is not a text generator, but it became the most widely fine-tuned model of its era, and in 2019 Google said it was helping with about one in ten English searches in the US ([Google, 2019](https://blog.google/products/search/search-language-understanding-bert/)). BERT-style encoders still power search ranking, classification and the embedding models behind retrieval-augmented generation.

### 3. GPT-2 (OpenAI, February–November 2019)

**Spec:** up to 1.5 billion parameters · decoder-only · WebText (about 8 million web pages) · released in four stages.

**What it is:** GPT-1 scaled up about tenfold and trained on a much larger and more varied web corpus ([Radford et al., 2019](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)).

**What was new:** strikingly fluent multi-paragraph text and **zero-shot** task performance, such as summarizing when the prompt ended with "TL;DR:". OpenAI held back the full model at first because of misuse concerns and released it in November 2019.

**Why it matters:** it showed that scale alone produced new abilities, and it started the debate about responsible release that still continues. Its small versions remain popular teaching models.

### 4. T5 (Google, October 2019)

**Spec:** 60M to 11B parameters · encoder–decoder Transformer · C4 web corpus · weights released.

**What it is:** the "Text-to-Text Transfer Transformer", which treats every task as turning input text into output text, for example "translate English to German: …" or "summarize: …" ([Raffel et al., 2019](https://arxiv.org/abs/1910.10683)).

**What was new:** one format for all tasks, and a large systematic study comparing pretraining objectives, architectures and datasets. It also introduced the Colossal Clean Crawled Corpus (C4).

**Why it matters:** the text-to-text idea is how every chat model works today. T5 and its instruction-tuned version, Flan-T5, are still common for fine-tuning on specific tasks.

## 2020–2022: scale, code and compute-optimal training

### 5. GPT-3 (OpenAI, May 2020)

**Spec:** 175 billion parameters · decoder-only · about 300 billion training tokens · API-only.

**What it is:** a GPT-2-style model more than 100 times larger ([Brown et al., 2020](https://arxiv.org/abs/2005.14165)).

**What was new:** **in-context learning**. Given a task description and a few examples in the prompt, GPT-3 could perform new tasks with no fine-tuning. It was offered through a commercial API rather than as downloadable weights.

**Why it matters:** it created prompting as a way of programming, the API business model and the start-up ecosystem built on top of it. It also showed the limits that later models worked on: confident factual errors, inconsistent instruction following and biased outputs, all discussed in the paper itself.

### 6. Codex (OpenAI, July 2021)

**Spec:** 12B parameters in the paper's main version · GPT fine-tuned on public GitHub code · API and GitHub Copilot.

**What it is:** a GPT model specialized for code. The paper introduced the **HumanEval** benchmark of 164 hand-written programming problems checked by unit tests; Codex solved 28.8% on the first try, GPT-3 0% ([Chen et al., 2021](https://arxiv.org/abs/2107.03374)).

**What was new:** natural-language-to-code generation good enough for daily use, delivered through GitHub Copilot in developers' editors.

**Why it matters:** coding became the most important commercial use of LLMs, and HumanEval-style testing with unit tests set the pattern for verifiable evaluation.

### 7. Chinchilla (DeepMind, March 2022)

**Spec:** 70 billion parameters · 1.4 trillion training tokens · not released.

**What it is:** a model trained to test DeepMind's finding that for a given compute budget, parameters and training data should be scaled equally ([Hoffmann et al., 2022](https://arxiv.org/abs/2203.15556)).

**What was new:** with the same compute as the 280-billion-parameter Gopher, the four-times-smaller Chinchilla trained on four times more data and outperformed it on a wide range of benchmarks.

**Why it matters:** Chinchilla is rarely used but hugely influential. It is why LLaMA, Mistral and almost every later model trained smaller networks on far more tokens. The [30 key breakthroughs](/articles/llm-breakthroughs) article shows the scaling formula.

### 8. PaLM (Google, April 2022)

**Spec:** 540 billion parameters · dense decoder-only · 780 billion training tokens · trained on 6,144 TPU v4 chips.

**What it is:** Google's largest dense language model of its time, trained with its Pathways system across two TPU v4 pods ([Chowdhery et al., 2022](https://arxiv.org/abs/2204.02311)).

**What was new:** strong multi-step reasoning when prompted with chain-of-thought examples, and joke and logic explanations that surprised many readers. Its paper reported that some abilities improved sharply rather than smoothly as models grew from 8B to 62B to 540B.

**Why it matters:** PaLM was the high point of the "bigger dense model" approach before Chinchilla's lesson took over, and it led to PaLM 2, which powered Google's Bard before Gemini replaced it.

### 9. BLOOM (BigScience, July 2022)

**Spec:** 176 billion parameters · 46 natural languages and 13 programming languages · open weights under the BigScience RAIL license.

**What it is:** a model built by BigScience, an open collaboration of more than 1,000 researchers coordinated by Hugging Face, and trained on the French public Jean Zay supercomputer ([BigScience Workshop, 2022](https://arxiv.org/abs/2211.05100)).

**What was new:** the first open model of GPT-3 scale, with a documented, multilingual training set and a license that allowed broad use while banning listed harmful uses.

**Why it matters:** BLOOM proved that open, international collaboration could train a frontier-scale model and set an early standard for documenting data and governance. It was soon overtaken in quality, but its openness influenced later projects such as OLMo.

### 10. ChatGPT, GPT-3.5 (OpenAI, November 2022)

**Spec:** fine-tuned from a GPT-3.5 series model · trained with RLHF · size undisclosed · free web app, later API.

**What it is:** a conversational model built with the instruction-tuning and **reinforcement learning from human feedback** methods of InstructGPT ([Ouyang et al., 2022](https://arxiv.org/abs/2203.02155); [OpenAI, 2022](https://openai.com/index/chatgpt/)).

**What was new:** not a new architecture but a usable product: a chat interface that remembered the conversation, admitted some mistakes and declined some inappropriate requests. UBS analysts estimated it reached about 100 million monthly users two months after launch ([Reuters, 2023](https://www.reuters.com/technology/chatgpt-sets-record-fastest-growing-user-base-analyst-note-2023-02-01/)).

**Why it matters:** it brought LLMs to the general public and triggered the industry-wide race that followed.

## 2023: frontier models and the open-weight boom

### 11. LLaMA (Meta, February 2023)

**Spec:** 7B, 13B, 33B and 65B parameters · up to 1.4 trillion tokens of public data · noncommercial research license.

**What it is:** a family of efficient models trained longer than Chinchilla's ratio on publicly available data only ([Touvron et al., 2023](https://arxiv.org/abs/2302.13971)).

**What was new:** LLaMA-13B outperformed the 175B GPT-3 on most benchmarks reported, and LLaMA-65B was competitive with Chinchilla and PaLM. The weights, meant for approved researchers, leaked publicly within about a week.

**Why it matters:** it set off the open-weight boom. Projects such as Stanford's Alpaca, Vicuna and llama.cpp made it possible to fine-tune and run capable models on consumer hardware, and Meta's Llama 2 (July 2023) allowed commercial use ([Touvron et al., 2023b](https://arxiv.org/abs/2307.09288)).

### 12. GPT-4 (OpenAI, March 2023)

**Spec:** size, architecture and training data undisclosed · text and image input · app and API.

**What it is:** OpenAI's flagship model of 2023 ([OpenAI, 2023](https://arxiv.org/abs/2303.08774)).

**What was new:** a large jump in reliability and reasoning, with image understanding. On OpenAI's evaluations it scored around the top 10% of test takers on a simulated bar exam, where GPT-3.5 scored around the bottom 10%. The report explicitly withheld technical details.

**Why it matters:** GPT-4 was the reference point for "frontier capability" for more than a year, and its secrecy set the norm for closed frontier models.

### 13. Claude (Anthropic, March 2023)

**Spec:** sizes undisclosed · app and API · later versions with 200K and 1M-token context.

**What it is:** Anthropic's assistant family, launched on the same day as GPT-4 ([Anthropic, 2023](https://www.anthropic.com/news/introducing-claude)). Anthropic was founded in 2021 by former OpenAI researchers with a focus on AI safety.

**What was new:** training with **Constitutional AI**, where the model critiques and revises its own outputs against a written set of principles, reducing reliance on human labels for harmlessness ([Bai et al., 2022](https://arxiv.org/abs/2212.08073)). Claude 2 brought a 100K-token context window in 2023, and later Claude models became widely used for coding and agentic work, including the first public computer-use capability in October 2024 ([Anthropic, 2024](https://www.anthropic.com/news/3-5-models-and-computer-use)).

**Why it matters:** Claude made Anthropic one of the three leading frontier developers and pushed long context, coding agents and published safety practices forward. In 2026 the Claude line is the Claude 5 family (see entry 20).

### 14. Mistral 7B and Mixtral 8x7B (Mistral AI, September and December 2023)

**Spec:** Mistral 7B, 7.3B parameters; Mixtral 8x7B, 46.7B total and 12.9B active parameters · Apache 2.0 license.

**What it is:** the first models from a Paris start-up founded in 2023 ([Jiang et al., 2023](https://arxiv.org/abs/2310.06825); [Jiang et al., 2024](https://arxiv.org/abs/2401.04088)).

**What was new:** Mistral 7B outperformed Llama 2 13B on every benchmark the authors tested, using grouped-query and sliding-window attention for speed. Mixtral brought a **sparse mixture-of-experts** design to open models: each token is routed to 2 of 8 expert blocks, so it runs at the cost of a much smaller model.

**Why it matters:** a truly permissive license plus strong quality made Mistral the default for many companies, and Mixtral popularized MoE, which most large models now use.

### 15. Gemini (Google DeepMind, December 2023)

**Spec:** Ultra, Pro and Nano sizes, parameters undisclosed except the small Nano models · natively multimodal · app and API.

**What it is:** Google's flagship model family, built after the merger of Google Brain and DeepMind and trained from the start on text, images, audio and video ([Gemini Team, 2023](https://arxiv.org/abs/2312.11805)).

**What was new:** native multimodality, and with Gemini 1.5 Pro in February 2024 a context window of up to 1 million tokens ([Gemini Team, 2024](https://arxiv.org/abs/2403.05530)).

**Why it matters:** Gemini made long context a standard feature and put a frontier model into Google Search, Android and Workspace. Its 2026 successor is Gemini 4 Argon (entry 20).

## 2024–2025: open frontiers and reasoning

### 16. Llama 3 and Llama 3.1 (Meta, April and July 2024)

**Spec:** 8B and 70B (April), plus 405B (July) · trained on over 15 trillion tokens · 128K context in 3.1 · Llama community license.

**What it is:** Meta's third generation of open-weight models ([Llama Team, 2024](https://arxiv.org/abs/2407.21783)).

**What was new:** Llama 3.1 405B was the first openly downloadable model that its developer evaluated as comparable to leading closed models such as GPT-4 across many benchmarks. The 8B model, trained on vastly more data than Chinchilla's ratio suggests, became one of the most fine-tuned models on Hugging Face.

**Why it matters:** it showed that open weights could reach the frontier, and its detailed paper became a reference for how modern LLMs are trained. Meta's next open release, Llama 4 in April 2025, moved to mixture-of-experts; in 2026 Meta's open models are branded Muse (see our [open-source LLMs](/articles/open-source-llms) guide).

### 17. GPT-4o (OpenAI, May 2024)

**Spec:** size undisclosed · one model for text, images and audio · app and API.

**What it is:** "o" for *omni*: a single network trained end to end across text, vision and audio ([OpenAI, 2024](https://openai.com/index/hello-gpt-4o/)).

**What was new:** real-time spoken conversation. OpenAI reported responses to audio in about 320 milliseconds on average, close to human conversational timing, with the model hearing tone and producing expressive speech instead of passing text between separate systems.

**Why it matters:** it made voice and vision ordinary parts of chat assistants and became ChatGPT's default model for over a year.

### 18. o1 (OpenAI, September 2024)

**Spec:** size undisclosed · reasoning model trained with reinforcement learning · app and API.

**What it is:** the first widely available **reasoning model**, which writes a long hidden chain of thought before answering ([OpenAI, 2024](https://openai.com/index/learning-to-reason-with-llms/)).

**What was new:** accuracy that improves with thinking time. On the 2024 AIME math exam, OpenAI reported 74% for o1 with a single attempt versus about 12% for GPT-4o.

**Why it matters:** it added test-time compute as a new way to scale, and reasoning modes became standard across frontier and open models within a year.

### 19. DeepSeek-V3 and DeepSeek-R1 (DeepSeek, December 2024 and January 2025)

**Spec:** 671B total and 37B active parameters (MoE) · 14.8 trillion training tokens · R1 weights under the MIT license.

**What it is:** DeepSeek-V3 is a large mixture-of-experts model with multi-head latent attention and multi-token prediction, trained with 2.788 million H800 GPU hours ([DeepSeek-AI, 2024](https://arxiv.org/abs/2412.19437)). DeepSeek-R1 adds o1-style reasoning trained mainly with reinforcement learning ([DeepSeek-AI, 2025](https://arxiv.org/abs/2501.12948)).

**What was new:** reasoning performance close to o1 on DeepSeek's reported math and coding benchmarks, with open weights, a published recipe and distilled smaller versions from 1.5B to 70B parameters.

**Why it matters:** it made frontier-style reasoning available to everyone, drew global attention to training efficiency and established Chinese labs as leaders in open-weight models.

## 2026: today's models

### 20. The 2026 frontier: GPT-6, Claude 5, Gemini 4 and open challengers

This last entry is a group, because no single model defines 2026. The state of play on 25 October 2026:

- **OpenAI:** GPT-6 Astra, released from 3 September 2026 first to participants in a cybersecurity program ([CNBC](https://www.cnbc.com/2026/09/03/open-ai-astra-gpt-6-cyber.html)), followed by the smaller GPT-6 Sol and Luna later that month ([TechCrunch](https://techcrunch.com/2026/09/22/openai-launches-gpt-6-sol-and-luna/)).
- **Anthropic:** the Claude 5 family. Its current documentation lists Claude Fable 5.1 for demanding reasoning and long-horizon agentic work, Claude Opus 5.5, Claude Sonnet 5.5 and Claude Haiku 5.5, all with 1-million-token context windows ([Anthropic docs](https://platform.claude.com/docs/en/about-claude/models/overview)).
- **Google:** Gemini 4 Argon, announced 30 September 2026 for coding, enterprise knowledge work and cyber defense, with a phased rollout that began with trusted cyber defenders ([Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/)).
- **Open weights:** very large mixture-of-experts models such as Moonshot AI's Kimi K3 (2.8 trillion total, 104 billion active parameters), Z.ai's GLM-5.3, DeepSeek-V4 and Meta's Muse Spark Open, plus strong small models such as Qwen3.8-27B and Gemma 4 ([Kimi K3 model card](https://huggingface.co/moonshotai/Kimi-K3); [Meta](https://research.meta.ai/blog/muse-spark-open)).

**What is new:** the common themes are 1-million-token context, adjustable reasoning effort, native image and often audio or video input, and training aimed at agentic tasks that run for hours. The most capable closed models are now released in stages, with early access tied to cybersecurity risk.

**Why it matters:** sizes are mostly secret on the closed side, benchmarks change every few months and many published scores come from the developers themselves. The practical advice has not changed since GPT-3: pick two or three candidates and test them on your own tasks, costs and privacy requirements. Expect this entry to date fastest.

## How the models connect

- **Two families from 2018.** Decoder models (GPT-1 → GPT-3 → ChatGPT → today's assistants) generate text; encoder models (BERT and its successors) understand and embed it. Most "LLMs" today are decoders, while encoders quietly power search and retrieval.
- **Three ways to get better.** Scale parameters (GPT-3, PaLM), scale data (Chinchilla, LLaMA, Llama 3) and scale thinking time (o1, DeepSeek-R1). Modern models do all three, plus mixture-of-experts to keep running costs down.
- **Two routes to the public.** Closed models (GPT-4, Claude, Gemini) lead on many benchmarks; open-weight models (LLaMA, Mistral, DeepSeek, Qwen, Kimi) follow months behind and can be run, inspected and fine-tuned by anyone.

For the story in time order, read [25 years of language models](/articles/history-of-language-models); for the events that changed the field, read [15 major milestones in LLM evolution](/articles/llm-milestones). If you want to build with machine learning yourself, our [Python libraries for machine learning](/articles/python-libraries-for-machine-learning) guide covers PyTorch and Hugging Face Transformers.

## References

All accessed 25 October 2026.

- Radford, A. et al. (2018). [Improving language understanding by generative pre-training](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf). OpenAI.
- Devlin, J. et al. (2018). [BERT](https://arxiv.org/abs/1810.04805).
- Radford, A. et al. (2019). [Language models are unsupervised multitask learners](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf). OpenAI.
- Raffel, C. et al. (2019). [Exploring the limits of transfer learning with a unified text-to-text Transformer](https://arxiv.org/abs/1910.10683).
- Brown, T. et al. (2020). [Language models are few-shot learners](https://arxiv.org/abs/2005.14165).
- Chen, M. et al. (2021). [Evaluating large language models trained on code](https://arxiv.org/abs/2107.03374).
- Hoffmann, J. et al. (2022). [Training compute-optimal large language models](https://arxiv.org/abs/2203.15556).
- Chowdhery, A. et al. (2022). [PaLM: scaling language modeling with Pathways](https://arxiv.org/abs/2204.02311).
- BigScience Workshop (2022). [BLOOM: a 176B-parameter open-access multilingual language model](https://arxiv.org/abs/2211.05100).
- Ouyang, L. et al. (2022). [Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155).
- Bai, Y. et al. (2022). [Constitutional AI: harmlessness from AI feedback](https://arxiv.org/abs/2212.08073).
- Touvron, H. et al. (2023). [LLaMA](https://arxiv.org/abs/2302.13971); [Llama 2](https://arxiv.org/abs/2307.09288).
- OpenAI (2023). [GPT-4 technical report](https://arxiv.org/abs/2303.08774).
- Jiang, A. et al. (2023, 2024). [Mistral 7B](https://arxiv.org/abs/2310.06825); [Mixtral of experts](https://arxiv.org/abs/2401.04088).
- Gemini Team (2023, 2024). [Gemini](https://arxiv.org/abs/2312.11805); [Gemini 1.5](https://arxiv.org/abs/2403.05530).
- Llama Team, Meta (2024). [The Llama 3 herd of models](https://arxiv.org/abs/2407.21783).
- OpenAI (2024). [Hello GPT-4o](https://openai.com/index/hello-gpt-4o/); [Learning to reason with LLMs](https://openai.com/index/learning-to-reason-with-llms/).
- DeepSeek-AI (2024, 2025). [DeepSeek-V3](https://arxiv.org/abs/2412.19437); [DeepSeek-R1](https://arxiv.org/abs/2501.12948).
- Anthropic. [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview).
- Moonshot AI. [Kimi K3 model card](https://huggingface.co/moonshotai/Kimi-K3).
