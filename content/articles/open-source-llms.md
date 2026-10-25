---
title: "10 Best Open-Source LLMs to Know in 2026: From Early Models to Modern AI"
seoTitle: "10 Best Open-Source LLMs to Know in 2026"
description: 10 open-source and open-weight LLM families in 2026, from Llama and Mistral to Qwen, DeepSeek, Gemma, gpt-oss, OLMo and Kimi, with sizes, licenses and uses.
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
  - open source
  - open-weight models
  - llama
  - generative ai
  - ai
tocDepth: 2
---

An **open LLM** is a large language model whose trained weights you can download, run on your own hardware and fine-tune. In 2026 the best of them are close to the closed frontier on many tasks, and they come in every size, from models that run on a laptop to trillion-parameter systems for data centers. This guide covers **10 open model families worth knowing**, with each family's history from its first release to its current models, so you can see where today's options came from and which one fits your needs.

**The short answer.** For a permissive license and a model that fits on one GPU, start with **Qwen3.8-27B**, **Gemma 4** or **gpt-oss-20b**. For the strongest open models on servers, look at **DeepSeek-V4**, **Kimi K3**, **GLM-5.3** and Meta's **Muse Spark Open**, and read their licenses first. For research where you need the training data and code too, use **OLMo**.

**How we chose and checked.** Each family had to have downloadable weights, a current release in 2025 or 2026, real adoption (we looked at Hugging Face downloads and community use) and something distinctive. Sizes, context windows, licenses and dates come from each model's own card on Hugging Face or the developer's announcement, read on 25 October 2026. We did **not** run our own benchmarks, and we do not rank the families against each other, because public leaderboards disagree and many scores are self-reported. We have no commercial relationship with any developer listed. Open models are released every few weeks, so check the linked model cards for newer versions.

## Open source or open weight?

The two terms are often used interchangeably, but they are not the same.

- **Open weights:** you can download the trained parameters. The license may still restrict use, require attribution or set revenue thresholds, and the training data and code are usually not published.
- **Open source**, in the sense of the Open Source Initiative's **Open Source AI Definition 1.0** (October 2024), requires the parameters *and* the full training and data-processing code under OSI-approved terms, plus enough information about the training data that a skilled person could build a substantially equivalent system ([OSI](https://opensource.org/ai/open-source-ai-definition)).

By that definition most models in this list are **open-weight**, not open source. Only a few projects, such as Ai2's OLMo, publish their data, code and checkpoints. We use "open-source LLMs" in the title because that is how most people search for them, and we state each model's license so you can judge for yourself.

<figure>
<img src="/images/articles/open-source-llms/openness-spectrum.svg" alt="A spectrum of openness in four columns from left to right. API only: weights not downloadable, for example GPT-6, Claude and Gemini. Open weights with a custom license that adds conditions such as attribution or revenue thresholds: Muse Spark Open, Kimi K3, GLM-5.3, Qwen3.8 flagship, Mistral Medium 3.5 and Nemotron 3.5 under OpenMDW. Open weights with a standard permissive license, Apache 2.0 or MIT: Qwen3.8-27B, Qwen3.6, Gemma 4, gpt-oss, Mistral Small 4, DeepSeek-V4, GLM-5.3-Flash and Muse Glimmer. Fully open, with weights, training data and code: OLMo." width="720" height="340" loading="lazy" decoding="async" />
<figcaption>How open is "open"? The same family can sit in two columns: Qwen's and GLM's smaller models use standard licenses while their flagships use custom ones.</figcaption>
</figure>

## Where open LLMs came from

Open models did not start with Llama. Google released BERT's weights in 2018 and OpenAI released GPT-2 in 2019. After GPT-3 went API-only in 2020, community groups rebuilt open alternatives: EleutherAI trained GPT-Neo, GPT-J and the Pythia research suite on its open Pile dataset ([Biderman et al., 2023](https://arxiv.org/abs/2304.01373)), and the BigScience collaboration released the 176-billion-parameter multilingual BLOOM in 2022 ([BigScience Workshop, 2022](https://arxiv.org/abs/2211.05100)). The turning point was Meta's LLaMA in February 2023, whose weights spread publicly within about a week and showed that a well-trained 13-billion-parameter model could beat GPT-3 on many benchmarks ([Touvron et al., 2023](https://arxiv.org/abs/2302.13971)). The families below are what that boom became. For the full history, see [25 years of language models](/articles/history-of-language-models).

## The 10 families at a glance

| # | Family | Developer | Current open models (Oct 2026) | Largest size (total / active) | Max context | License |
|---|---|---|---|---|---|---|
| 1 | Llama → Muse | Meta | Muse Glimmer 30B; Muse Spark Open | 816B / 42B | 1M | Apache 2.0 (Glimmer); Muse Model License (Spark Open) |
| 2 | Mistral | Mistral AI | Mistral Small 4; Mistral Medium 3.5 | 128B dense | 256K | Apache 2.0 (Small 4); custom (Medium 3.5) |
| 3 | Qwen | Alibaba | Qwen3.8-27B; Qwen3.6-35B-A3B; Qwen3.8 2.4T-A95B | 2.4T / 95B | 262K native, up to ~1M | Apache 2.0 (smaller); custom (flagship) |
| 4 | DeepSeek | DeepSeek | DeepSeek-V4.1-Flash; DeepSeek-V4-Pro | 1.6T / 49B | 1M | MIT |
| 5 | Gemma | Google DeepMind | Gemma 4 (E2B, E4B, 12B, 26B A4B, 31B) | 31B dense | 256K | Apache 2.0 |
| 6 | gpt-oss | OpenAI | gpt-oss-120b; gpt-oss-20b | 117B / 5.1B | 128K | Apache 2.0 |
| 7 | OLMo | Ai2 | Olmo 3.1 (7B, 32B) | 32B dense | 64K | Apache 2.0, data and code open |
| 8 | Kimi | Moonshot AI | Kimi K3 | 2.8T / 104B | 1M | Kimi K3 License (modified MIT) |
| 9 | GLM | Z.ai | GLM-5.3; GLM-5.3-Flash | ~750B MoE; 320B / 18B (Flash) | 1M | GLM-5.3 License; MIT (Flash) |
| 10 | Nemotron | NVIDIA | Nemotron 3.5 (Super VL 120B-A12B and others) | 120B / 12B | 1M | OpenMDW 1.1, with open data and recipes |

Sizes and licenses are from each model card. "Active" parameters apply to mixture-of-experts (MoE) models, which use only part of their weights for each token; they run faster than their total size suggests but still need memory for all the weights.

## 1. Meta: Llama, and now Muse

**Lineage:** LLaMA (February 2023, research only) → Llama 2 (July 2023, commercial use) → Llama 3 and 3.1 (2024, up to 405B) → Llama 4 Scout and Maverick (April 2025, MoE) → Muse Glimmer (August 2026) and Muse Spark Open (October 2026).

**What it is today:** Meta's open line now carries the **Muse** name. **Muse Glimmer** is a 29.6-billion-parameter multimodal model, distilled from Meta's closed Muse Spark, built for agentic tasks on consumer hardware, released under **Apache 2.0** with a 131K context ([model card](https://huggingface.co/meta-models/Muse-Glimmer-30B)). **Muse Spark Open**, released on 15 October 2026, is an 816-billion-parameter MoE model with 42 billion active parameters and a 1-million-token context ([Meta, 2026](https://research.meta.ai/blog/muse-spark-open)). Its Muse Model License requires a "Built with Muse Spark Open" notice and a separate agreement for model-as-a-service providers above a revenue threshold. Llama 4 Scout (17B active, 109B total, 16 experts) and Maverick (17B active, 400B total, 128 experts) remain available under the Llama 4 Community License ([Meta, 2025](https://ai.meta.com/blog/llama-4-multimodal-intelligence/)).

**Why it matters:** Llama created the open-weight ecosystem; most fine-tuning tools, quantization formats and local runners were first built for it. The move from Llama to Muse is also a lesson: Meta's 2026 frontier model, Muse Spark, is closed, and the open versions arrived later.

**Best for:** Muse Glimmer for capable local agents under a permissive license; Llama 3.1 8B and 70B for the widest tool and tutorial support.

## 2. Mistral AI: Mistral and Mixtral

**Lineage:** Mistral 7B (September 2023, Apache 2.0) → Mixtral 8x7B (December 2023, the first popular open MoE) → Mixtral 8x22B (2024) → Mistral Small 3 (2025) → **Mistral Small 4** and **Mistral Medium 3.5** (2026).

**What it is today:** Mistral Small 4 is a 119-billion-parameter MoE model with 128 experts, 4 active per token and about **6.5 billion active parameters**, a 256K context, adjustable reasoning effort and an **Apache 2.0** license ([model card](https://huggingface.co/mistralai/Mistral-Small-4-119B-2603)). Mistral Medium 3.5 is a 128-billion-parameter model under a custom license ([model card](https://huggingface.co/mistralai/Mistral-Medium-3.5-128B)).

**Why it matters:** Mistral showed in 2023 that a small, permissively licensed model could beat larger ones, and it popularized MoE in open models. It is also the leading European developer, which matters to some organizations for data-residency and supply-chain reasons.

**Best for:** companies that want a permissive license from a European vendor, and efficient serving thanks to the small active size.

## 3. Alibaba: Qwen

**Lineage:** Qwen 7B (2023) → Qwen2 and Qwen2.5 (2024) → Qwen3 (April 2025, Apache 2.0, dense and MoE) → Qwen3.5 (February 2026) → Qwen3.6 (April 2026) → **Qwen3.8** (August 2026).

**What it is today:** the smaller models are among the most downloaded open LLMs. **Qwen3.8-27B** is a dense 27-billion-parameter model with 262K native context, extensible to about 1 million tokens, and thinking mode on by default ([model card](https://huggingface.co/Qwen/Qwen3.8-27B)). **Qwen3.6-35B-A3B** is an MoE model with only 3 billion active parameters, so it runs quickly on modest hardware ([model card](https://huggingface.co/Qwen/Qwen3.6-35B-A3B)). Both are **Apache 2.0**. The flagship **Qwen3.8-2.4T-A95B** has open weights under a custom license ([model card](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B)).

**Why it matters:** Qwen covers every size from tiny to huge, is strong in many languages and in code, and is the most common base for community fine-tunes in 2026.

**Best for:** a default choice for local and single-GPU use, multilingual products and fine-tuning.

## 4. DeepSeek

**Lineage:** DeepSeek LLM and DeepSeek-Coder (2023) → DeepSeek-V2 (2024, multi-head latent attention) → **DeepSeek-V3** (December 2024, 671B / 37B active) → **DeepSeek-R1** (January 2025, open reasoning) → DeepSeek-V4 (2026) → **DeepSeek-V4.1-Flash** (September 2026).

**What it is today:** DeepSeek-V4.1-Flash is a multimodal MoE model with 552 billion backbone parameters, 8 to 16 billion active, trained on 45 trillion tokens with a **1-million-token** context ([model card](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash)). The larger DeepSeek-V4-Pro has 1.6 trillion backbone parameters and 49 billion active, per the same card's comparison table. Both are released under the **MIT** license.

**Why it matters:** DeepSeek's detailed technical reports, especially for V3 and R1 ([DeepSeek-AI, 2024](https://arxiv.org/abs/2412.19437); [DeepSeek-AI, 2025](https://arxiv.org/abs/2501.12948)), taught the field how to train large MoE and reasoning models efficiently, and its MIT license is among the most permissive at the top end.

**Best for:** teams with multi-GPU servers that want frontier-class open models, long context and a simple license.

## 5. Google DeepMind: Gemma

**Lineage:** Gemma 2B and 7B (February 2024, custom Gemma terms) → Gemma 2 (2024) → Gemma 3 (2025, multimodal) → **Gemma 4** (2026, Apache 2.0).

**What it is today:** Gemma 4 comes in five sizes: E2B and E4B for phones and laptops (the "E" means *effective* parameters, using per-layer embeddings), a 12B, a 26B MoE with 3.8 billion active parameters, and a dense 31B. All accept text and images, E2B, E4B and 12B also accept audio, and context is 128K for the small models and 256K for the larger ones ([model card](https://huggingface.co/google/gemma-4-31B-it)). Gemma 4 is released under **Apache 2.0**, a change from the custom terms of earlier Gemma versions.

**Why it matters:** Gemma is built from Google's Gemini research and is designed for on-device and single-accelerator use, with official quantized versions.

**Best for:** on-device and edge applications, and products that need a small multimodal model under a standard license.

## 6. OpenAI: gpt-oss

**Lineage:** GPT-2 (2019, OpenAI's last open language model for six years) → **gpt-oss-120b and gpt-oss-20b** (August 2025).

**What it is today:** two reasoning models under **Apache 2.0**. gpt-oss-120b has 117 billion parameters with 5.1 billion active and fits on a single 80 GB GPU; gpt-oss-20b has 21 billion with 3.6 billion active and suits local use ([model card](https://huggingface.co/openai/gpt-oss-120b)). Both support adjustable reasoning effort and tool use (browsing and Python), and must be used with OpenAI's "harmony" response format.

**Why it matters:** it marked OpenAI's return to open weights and became a popular, efficient baseline. It is older than most models here, so newer families have overtaken it on many benchmarks.

**Best for:** a well-documented, permissively licensed reasoning model that runs on one GPU (120b) or a well-equipped laptop (20b).

## 7. Ai2: OLMo, the fully open option

**Lineage:** OLMo 7B (February 2024, with the Dolma dataset) → OLMo 2 (late 2024) → Olmo 3 (2025) → **Olmo 3.1** (December 2025).

**What it is today:** Olmo 3.1 includes 7B and 32B models in *Think* (reasoning) and *Instruct* versions. Ai2 releases the pretraining data (Dolma 3), the post-training datasets (Dolci), the training code, intermediate checkpoints and logs, all under **Apache 2.0** ([model card](https://huggingface.co/allenai/Olmo-3.1-32B-Think); [Groeneveld et al., 2024](https://arxiv.org/abs/2402.00838)).

**Why it matters:** OLMo is one of the few model families that fits the OSI's open-source definition in full. You can study exactly what it learned from, reproduce its training and test ideas at every stage. It trails the largest open-weight models in raw capability.

**Best for:** research, teaching and any use where you need to audit the training data.

## 8. Moonshot AI: Kimi

**Lineage:** Kimi K2 (July 2025, 1 trillion total and 32 billion active parameters) → K2 Thinking (November 2025) → K2.5 and K2.6 (2026) → **Kimi K3** (June 2026).

**What it is today:** Kimi K3 is a natively multimodal agentic model with **2.8 trillion total and 104 billion active parameters** and a 1-million-token context, using Moonshot's Kimi Delta Attention ([model card](https://huggingface.co/moonshotai/Kimi-K3)). The Kimi K3 License is MIT-style but adds two conditions: model-as-a-service businesses with over \$20 million in revenue in any 12 months need a separate agreement for commercial use, and products with over 100 million monthly users or \$20 million in monthly revenue must display "Kimi K3".

**Why it matters:** at release it was the largest open-weight model, and several independent leaderboards in October 2026 place it at or near the top of open models for agentic coding. Running it needs a multi-node GPU cluster, so most people use it through hosted APIs.

**Best for:** organizations that want frontier-level open weights for agentic work and can host very large models, or that want an open model available from many API providers.

## 9. Z.ai: GLM

**Lineage:** GLM-130B (2022, Tsinghua University) → ChatGLM (2023) → GLM-4.5 (2025, MIT) → GLM-5 (February 2026) → **GLM-5.3** (August 2026).

**What it is today:** GLM-5.3 is Z.ai's flagship open model, a mixture-of-experts model with about 750 billion parameters in its weight files (256 routed experts, 8 used per token) and a 1-million-token context, focused on long-horizon coding and agentic tasks; it shares GLM-5.2's base model and gains through post-training ([model card](https://huggingface.co/zai-org/GLM-5.3)). Its GLM-5.3 License is MIT-style but requires model-as-a-service businesses with more than \$10 billion in annual revenue to pass a Z.ai security review. **GLM-5.3-Flash**, with 320 billion total and 18 billion active parameters and hybrid sparse and linear attention, is the first natively multimodal GLM-5 model and uses the plain **MIT** license ([model card](https://huggingface.co/zai-org/GLM-5.3-Flash)).

**Why it matters:** GLM models consistently rank among the strongest open coding models, and the Flash version offers much of that quality at lower cost.

**Best for:** coding agents and long-running tool use; GLM-5.3-Flash when you want an MIT license.

## 10. NVIDIA: Nemotron

**Lineage:** Nemotron-4 340B (2024) → Llama-Nemotron (2025, built on Llama) → Nemotron 3 (late 2025) → **Nemotron 3.5** (October 2026).

**What it is today:** the Nemotron 3.5 family mixes Mamba-2 state-space layers, mixture-of-experts and attention for efficient long-context processing. Nemotron 3.5 Super VL has 120 billion total and 12 billion active parameters, image input and up to 1 million tokens of context ([model card](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-BF16)). NVIDIA describes Nemotron as a family with **open weights, training data and recipes**, and releases it under the OpenMDW 1.1 license, a permissive model license that places no restrictions on outputs and mainly requires keeping license and attribution notices ([OpenMDW 1.1](https://openmdw.ai/license/1-1/)).

**Why it matters:** besides the models, NVIDIA publishes large training datasets and recipes, which many other open models use, and it optimizes the models for its own hardware.

**Best for:** teams on NVIDIA hardware that want efficient long-context models with documented data, and builders of specialized agents.

## Also worth knowing

- **Microsoft Phi:** small models trained heavily on curated and synthetic data; good for very constrained hardware (MIT license).
- **IBM Granite 4.2:** 3B, 8B and 30B models under Apache 2.0, aimed at enterprise use ([model card](https://huggingface.co/ibm-granite/granite-4.2-30b)).
- **Xiaomi MiMo:** MiMo-V2.6 models are MIT-licensed, and the 1-trillion-parameter Pro version scores near the top of open models on some October 2026 leaderboards ([model card](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Pro-RL)).
- **Falcon (TII), BLOOM (BigScience) and Pythia (EleutherAI):** important early open models, now mostly of historical or research interest.

## How to choose an open model

1. **Start with your hardware.** As a rough guide, a model needs about 2 bytes per parameter at 16-bit precision and about 0.5 to 0.6 bytes per parameter at 4-bit, plus memory for the context (the KV cache). So a 27B dense model needs roughly 15–17 GB at 4-bit before context, and a MoE model must fit *all* its experts in memory, not just the active ones.
2. **Read the license, not the label.** Apache 2.0 and MIT allow almost any use. Custom licenses may require attribution, set revenue or user thresholds, or ban certain uses. Check what applies to your product and ask a lawyer when the stakes are high.
3. **Match the model to the task.** Reasoning modes help with math, code and planning but add latency and tokens. Smaller MoE models are fast for chat and extraction. Multilingual needs favor Qwen and Gemma.
4. **Test on your own data.** Leaderboard positions disagree with each other and many scores are self-reported. Build a set of 50–100 real examples and compare two or three candidates on quality, speed and cost.
5. **Plan for updates.** Most families above released a new version within the last six months. Choose tooling, such as vLLM, SGLang, llama.cpp or Ollama, that makes switching models easy.

To understand the techniques these models use, such as mixture of experts, quantization, LoRA fine-tuning and reasoning training, read [30 key breakthroughs that shaped modern LLMs](/articles/llm-breakthroughs). For how open and closed models compare over time, see [20 most important LLMs explained](/articles/important-llms-explained). And if you plan to fine-tune, our [Python libraries for machine learning](/articles/python-libraries-for-machine-learning) guide covers PyTorch and Hugging Face.

## References

All accessed 25 October 2026. Model cards are the primary source for sizes, context lengths and licenses.

- Open Source Initiative. [The Open Source AI Definition 1.0](https://opensource.org/ai/open-source-ai-definition).
- Meta. [Introducing Muse Spark Open](https://research.meta.ai/blog/muse-spark-open), 15 October 2026; [Muse Glimmer 30B model card](https://huggingface.co/meta-models/Muse-Glimmer-30B); [The Llama 4 herd](https://ai.meta.com/blog/llama-4-multimodal-intelligence/), 5 April 2025.
- Mistral AI. [Mistral Small 4 model card](https://huggingface.co/mistralai/Mistral-Small-4-119B-2603); [Mistral Medium 3.5 model card](https://huggingface.co/mistralai/Mistral-Medium-3.5-128B).
- Alibaba Qwen. [Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B); [Qwen3.6-35B-A3B](https://huggingface.co/Qwen/Qwen3.6-35B-A3B); [Qwen3.8-2.4T-A95B](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B) model cards.
- DeepSeek-AI. [DeepSeek-V4.1-Flash model card](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash); [DeepSeek-V3 technical report](https://arxiv.org/abs/2412.19437); [DeepSeek-R1](https://arxiv.org/abs/2501.12948).
- Google DeepMind. [Gemma 4 31B model card](https://huggingface.co/google/gemma-4-31B-it).
- OpenAI. [gpt-oss-120b model card](https://huggingface.co/openai/gpt-oss-120b).
- Ai2. [Olmo 3.1 32B Think model card](https://huggingface.co/allenai/Olmo-3.1-32B-Think); Groeneveld, D. et al. (2024). [OLMo: accelerating the science of language models](https://arxiv.org/abs/2402.00838).
- Moonshot AI. [Kimi K3 model card and license](https://huggingface.co/moonshotai/Kimi-K3).
- Z.ai. [GLM-5.3](https://huggingface.co/zai-org/GLM-5.3) and [GLM-5.3-Flash](https://huggingface.co/zai-org/GLM-5.3-Flash) model cards.
- NVIDIA. [Nemotron 3.5 Super VL model card](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-BF16); [OpenMDW License 1.1](https://openmdw.ai/license/1-1/).
- Biderman, S. et al. (2023). [Pythia: a suite for analyzing large language models across training and scaling](https://arxiv.org/abs/2304.01373).
- BigScience Workshop (2022). [BLOOM](https://arxiv.org/abs/2211.05100).
- Touvron, H. et al. (2023). [LLaMA](https://arxiv.org/abs/2302.13971).
