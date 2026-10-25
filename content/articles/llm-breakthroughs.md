---
title: 30 Key Breakthroughs That Shaped Modern Large Language Models
seoTitle: 30 Key Breakthroughs That Shaped Modern LLMs
description: 30 technical breakthroughs behind modern LLMs, from word2vec and attention to scaling laws, RLHF, LoRA, FlashAttention and RL for reasoning, with key formulas.
author: BlogAI Editors
authorType: Organization
publishedAt: 2026-10-25
updatedAt: 2026-10-25
status: published
categories:
  - Artificial Intelligence
  - Programming and Technology
  - Mathematics
tags:
  - large language models
  - transformers
  - deep learning
  - natural language processing
  - machine learning
  - ai
tocDepth: 2
---

A modern large language model (LLM) is not one invention. It is a stack of ideas, each solving a specific problem: how to represent words, how to handle long text, how to train on trillions of tokens, how to make the model follow instructions, how to run it cheaply and how to make it reason. This guide explains the **30 breakthroughs** that matter most, grouped by the problem they solved. Each entry gives:

- **The problem** it addressed.
- **The idea**, with the key formula where one helps.
- **Where it is used today.**
- **The original source.**

**Who it is for.** Developers, students and curious readers who know roughly what an LLM does and want to understand *how* it works. The formulas are short; if a symbol is unfamiliar, the sentence around it says what it means. For background math, see [linear algebra for machine learning](/articles/linear-algebra-concepts-for-machine-learning), [probability and statistics for data science](/articles/probability-and-statistics-concepts-for-data-science) and [optimization techniques](/articles/mathematical-optimization-techniques).

**How we chose and checked.** We picked techniques that are used in most current LLMs or that directly led to ones that are. Formulas and numbers are taken from the original papers listed under each entry, checked on 25 October 2026. Where the original numbers were later revised, we say so. This article is about methods; for the history of the models themselves, see [25 years of language models](/articles/history-of-language-models) and [20 most important LLMs explained](/articles/important-llms-explained).

<figure>
<img src="/images/articles/llm-breakthroughs/transformer-block.svg" alt="Diagram of a decoder-only Transformer, read bottom to top, with breakthrough numbers from this article attached to each part. Text is split by a subword tokenizer (6) into token embeddings (3, 4). A stack of identical blocks follows. Each block has normalization and a residual connection (10) around masked self-attention with rotary position encoding (9, 11) and grouped-query attention with a key-value cache (13), computed by FlashAttention (25), then normalization and a residual connection around a feed-forward layer or a mixture of experts (12). A final layer predicts next-token probabilities trained with cross-entropy (2). On the right, the training stages: pretraining at scale (14, 16 to 19), instruction tuning (22), preference tuning with RLHF or DPO (23, 24) and reinforcement learning with verifiable rewards (30)." width="720" height="460" loading="lazy" decoding="async" />
<figcaption>Where the breakthroughs sit in a modern decoder-only LLM. Numbers match the entries below.</figcaption>
</figure>

## The 30 breakthroughs at a glance

| # | Breakthrough | Year | Problem solved |
|---|---|---|---|
| 1 | Smoothed n-gram models | 1995 | Unseen word sequences |
| 2 | Cross-entropy and perplexity | 1948 / 1990s | Measuring a language model |
| 3 | Neural language models | 2003 | Generalizing across similar words |
| 4 | word2vec embeddings | 2013 | Cheap, reusable word meaning |
| 5 | LSTM language models | 1997 / 2010 | Long-range context |
| 6 | Subword tokenization (BPE) | 2015 | Rare and unknown words |
| 7 | Sequence-to-sequence | 2014 | Generating whole outputs |
| 8 | Attention | 2014 | Bottleneck of one summary vector |
| 9 | Self-attention Transformer | 2017 | Slow sequential training |
| 10 | Residual connections and normalization | 2015–2019 | Training very deep networks |
| 11 | Rotary position embeddings | 2021 | Word order and length extension |
| 12 | Mixture of experts | 2017 / 2021 | More capacity without more compute per token |
| 13 | KV cache, multi-query and grouped-query attention | 2019 / 2023 | Memory and speed of generation |
| 14 | Self-supervised pretraining | 2018 | Learning from unlabeled text |
| 15 | Transfer learning by fine-tuning | 2018 | Adapting to tasks with little data |
| 16 | Scaling laws | 2020 | Predicting the payoff of scale |
| 17 | Compute-optimal training | 2022 | Balancing size and data |
| 18 | Data curation and deduplication | 2019–2024 | Quality of web-scale data |
| 19 | Mixed precision and parallel training | 2017–2020 | Fitting models across thousands of chips |
| 20 | In-context learning | 2020 | New tasks without training |
| 21 | Chain-of-thought prompting | 2022 | Multi-step reasoning |
| 22 | Instruction tuning | 2021 | Following natural-language instructions |
| 23 | RLHF and RLAIF | 2017 / 2022 | Matching human preferences |
| 24 | Direct preference optimization | 2023 | Simpler preference training |
| 25 | FlashAttention | 2022 | Memory-bound attention |
| 26 | Quantization | 2022 | Running large models on less hardware |
| 27 | LoRA and QLoRA | 2021 / 2023 | Cheap fine-tuning |
| 28 | Speculative decoding | 2022 | Slow token-by-token generation |
| 29 | Retrieval and tool use | 2020–2023 | Stale knowledge and inability to act |
| 30 | Reinforcement learning with verifiable rewards | 2024–2025 | Reliable reasoning |

## Foundations: predicting and representing words

### 1. Smoothed n-gram models

**The problem:** a language model estimates the probability of the next word. Counting how often word sequences occur works, except that most sequences never appear in training text and would get probability zero.

**The idea:** an n-gram model approximates $P(w_t \mid w_1,\dots,w_{t-1}) \approx P(w_t \mid w_{t-n+1},\dots,w_{t-1})$ and estimates it from counts. **Smoothing** reserves some probability for unseen sequences. Kneser–Ney smoothing, the most effective, backs off to how many *different contexts* a word appears in, not just how often it appears ([Kneser and Ney, 1995](https://doi.org/10.1109/ICASSP.1995.479394); [Chen and Goodman, 1999](https://doi.org/10.1006/csla.1999.0128)).

**Where it is used today:** n-grams are still used for fast autocomplete, spelling correction and as features, and they are the baseline every neural model was measured against. The data-scale lesson came from them too: Google trained n-gram models on 2 trillion tokens in 2007 ([Brants et al., 2007](https://aclanthology.org/D07-1090/)).

### 2. Cross-entropy and perplexity

**The problem:** you need one number that says how good a language model is, and one loss function to train it.

**The idea:** train the model to minimize the **cross-entropy**, the average negative log-probability it assigns to each actual next token:

$$
\mathcal{L} = -\frac{1}{T}\sum_{t=1}^{T} \log P_\theta(w_t \mid w_{<t})
$$

**Perplexity** is $e^{\mathcal{L}}$ (or $2^{\mathcal{L}}$ with base-2 logs): roughly the number of equally likely choices the model is "torn between" at each step. Lower is better. The connection between prediction and information comes from Shannon's work on the entropy of English ([Shannon, 1951](https://doi.org/10.1002/j.1538-7305.1951.tb01366.x)).

**Where it is used today:** every LLM is pretrained by minimizing exactly this loss, and scaling laws (16, 17) are written in terms of it.

### 3. Neural language models

**The problem:** an n-gram model treats "cat" and "dog" as unrelated symbols, so what it learns about one says nothing about the other.

**The idea:** map each word to a learned vector (an **embedding**) and predict the next word with a neural network from the vectors of the previous words. Similar words get similar vectors, so the model generalizes ([Bengio et al., 2003](https://www.jmlr.org/papers/v3/bengio03a.html)).

**Where it is used today:** the first layer of every LLM is an embedding table that turns each token into a vector, and the final layer turns a vector back into probabilities over the vocabulary.

### 4. word2vec embeddings

**The problem:** neural language models were too slow to train on very large text in 2003–2012.

**The idea:** drop the deep network and train a very shallow model to predict nearby words (skip-gram) or a word from its neighbors (continuous bag-of-words), with tricks such as negative sampling ([Mikolov et al., 2013](https://arxiv.org/abs/1301.3781); [Mikolov et al., 2013b](https://arxiv.org/abs/1310.4546)). The resulting vectors capture relationships such as $\vec{\text{king}} - \vec{\text{man}} + \vec{\text{woman}} \approx \vec{\text{queen}}$.

**Where it is used today:** directly in lightweight search and recommendation systems, and conceptually in every **embedding model** used for semantic search and retrieval-augmented generation (29).

### 5. LSTM language models

**The problem:** fixed-window models see only the last few words, and plain recurrent networks forget quickly because gradients vanish over long sequences.

**The idea:** the **long short-term memory (LSTM)** cell adds a memory with gates that decide what to keep, write and output, so information can survive many steps ([Hochreiter and Schmidhuber, 1997](https://doi.org/10.1162/neco.1997.9.8.1735)). Recurrent language models beat n-grams by a wide margin from 2010 ([Mikolov et al., 2010](https://www.isca-archive.org/interspeech_2010/mikolov10_interspeech.html)).

**Where it is used today:** LSTMs were replaced by Transformers for LLMs, but the idea of a compact recurrent state returned in **state-space and linear-attention models** such as Mamba ([Gu and Dao, 2023](https://arxiv.org/abs/2312.00752)), which several 2026 open models mix with attention layers to handle long contexts cheaply.

### 6. Subword tokenization (BPE)

**The problem:** a word-level vocabulary cannot cover every name, typo, new term, programming identifier or language, and character-level models are slow.

**The idea:** **byte-pair encoding** starts from characters and repeatedly merges the most frequent adjacent pair into a new symbol until the vocabulary reaches a target size, so common words are single tokens and rare words split into pieces ([Sennrich et al., 2015](https://arxiv.org/abs/1508.07909)). Byte-level BPE, used since GPT-2, starts from bytes so any text can be encoded.

**Where it is used today:** almost every LLM uses BPE or a close relative such as SentencePiece. Tokenization explains many quirks, such as trouble counting letters in a word or higher costs for languages that split into more tokens.

## Architecture: the Transformer and its refinements

### 7. Sequence-to-sequence learning

**The problem:** translation, summarization and dialogue need a model that reads an input of one length and writes an output of another.

**The idea:** an **encoder** network reads the input into a representation and a **decoder** network generates the output one token at a time, conditioned on that representation ([Sutskever et al., 2014](https://arxiv.org/abs/1409.3215); [Cho et al., 2014](https://arxiv.org/abs/1406.1078)).

**Where it is used today:** the original Transformer and T5 are encoder–decoders. Most chat LLMs are **decoder-only**, which treats the prompt and the answer as one continuous sequence, but the "text in, text out" framing comes from here.

### 8. Attention

**The problem:** compressing a whole input sentence into one vector loses detail, especially for long inputs.

**The idea:** at each output step, compute a relevance score between the decoder state and every input position, turn the scores into weights with a softmax and take the weighted average of the input representations ([Bahdanau et al., 2014](https://arxiv.org/abs/1409.0473)). The model learns where to look.

**Where it is used today:** attention is the core operation of every Transformer.

### 9. The self-attention Transformer

**The problem:** recurrent networks process tokens one after another, so training cannot be parallelized across a sequence.

**The idea:** let every token attend to every other token in the same sequence (**self-attention**). Each token produces a query $Q$, a key $K$ and a value $V$, and

$$
\operatorname{Attention}(Q, K, V) = \operatorname{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$

where $d_k$ is the key dimension (dividing by $\sqrt{d_k}$ keeps the scores in a range where the softmax trains well). Several **heads** run in parallel to capture different relationships, and a feed-forward network follows ([Vaswani et al., 2017](https://arxiv.org/abs/1706.03762)). In a decoder, a causal mask stops each token from attending to later tokens.

**Where it is used today:** every major LLM. The cost of attention grows with the square of the sequence length, which motivated entries 13 and 25.

### 10. Residual connections and normalization

**The problem:** very deep networks are hard to train because signals and gradients shrink or explode as they pass through many layers.

**The idea:** **residual connections** add each layer's input to its output, $x_{l+1} = x_l + f(x_l)$, giving gradients a direct path ([He et al., 2015](https://arxiv.org/abs/1512.03385)). **Layer normalization** rescales activations to a stable range ([Ba et al., 2016](https://arxiv.org/abs/1607.06450)). Modern LLMs normalize *before* each sub-layer ("pre-norm"), which trains more stably at depth ([Xiong et al., 2020](https://arxiv.org/abs/2002.04745)), often with the cheaper RMSNorm ([Zhang and Sennrich, 2019](https://arxiv.org/abs/1910.07467)).

**Where it is used today:** every Transformer block, which is why models with a hundred or more layers can be trained at all.

### 11. Rotary position embeddings (RoPE)

**The problem:** self-attention by itself ignores word order; "dog bites man" and "man bites dog" look the same. The original Transformer added fixed sine-wave position vectors, which do not extend well beyond the training length.

**The idea:** **rotate** each query and key vector by an angle proportional to its position. The dot product between a query at position $m$ and a key at position $n$ then depends only on their distance $m - n$, so the model learns relative positions ([Su et al., 2021](https://arxiv.org/abs/2104.09864)).

**Where it is used today:** RoPE is used by Llama, Qwen, Mistral, DeepSeek and most other open models. Rescaling the rotation frequencies is a common way to extend a trained model's context window, and it is one ingredient in today's million-token windows.

### 12. Mixture of experts (MoE)

**The problem:** a bigger model knows more, but in a dense model every parameter is used for every token, so compute grows with size.

**The idea:** replace a feed-forward layer with many **expert** sub-networks and a small **router** that sends each token to only the top $k$ of them:

$$
y = \sum_{i \in \operatorname{TopK}(g(x))} g_i(x)\, E_i(x)
$$

where $g(x)$ gives the router's weights and $E_i$ is expert $i$ ([Shazeer et al., 2017](https://arxiv.org/abs/1701.06538); [Fedus et al., 2021](https://arxiv.org/abs/2101.03961)). Total parameters can be very large while the **active** parameters per token stay small.

**Where it is used today:** Mixtral, DeepSeek-V3 (671B total, 37B active), gpt-oss, Kimi, Qwen and most large 2026 open models use MoE. The trade-off is memory: all experts must be stored even though few are used per token.

### 13. KV cache, multi-query and grouped-query attention

**The problem:** a decoder generates one token at a time. Recomputing attention over the whole prefix for every new token is wasteful, and storing everything needed is memory-hungry.

**The idea:** keep the keys and values of earlier tokens in a **KV cache**, so each new token only computes its own. To shrink that cache, **multi-query attention** shares one set of keys and values across all heads ([Shazeer, 2019](https://arxiv.org/abs/1911.02150)), and **grouped-query attention (GQA)** shares them within groups of heads, keeping most of the quality ([Ainslie et al., 2023](https://arxiv.org/abs/2305.13245)). Paged memory management, introduced in vLLM, stores the cache in blocks like an operating system's virtual memory ([Kwon et al., 2023](https://arxiv.org/abs/2309.06180)).

**Where it is used today:** every serving system uses a KV cache, and GQA or a further compressed variant (such as DeepSeek's multi-head latent attention) appears in most current models. Long contexts are largely a KV-cache memory problem.

## Training: pretraining, scaling and data

### 14. Self-supervised pretraining

**The problem:** labeled data is scarce and expensive, while unlabeled text is nearly unlimited.

**The idea:** make the text its own label. **Causal language modeling** predicts the next token (GPT); **masked language modeling** hides tokens and predicts them from both sides (BERT) ([Radford et al., 2018](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf); [Devlin et al., 2018](https://arxiv.org/abs/1810.04805)). Learning to predict text well forces the model to learn grammar, facts and some reasoning.

**Where it is used today:** pretraining on trillions of tokens is the first and by far the most expensive stage of building any LLM.

### 15. Transfer learning by fine-tuning

**The problem:** a model pretrained on general text still needs to be adapted to specific tasks, often with only a few thousand examples.

**The idea:** start from the pretrained weights and continue training on the task data with a small learning rate. ULMFiT showed practical recipes such as gradually unfreezing layers ([Howard and Ruder, 2018](https://arxiv.org/abs/1801.06146)); ELMo showed that contextual representations from a language model transfer across tasks ([Peters et al., 2018](https://arxiv.org/abs/1802.05365)).

**Where it is used today:** every post-training stage (22–24, 30) is a form of fine-tuning, and companies fine-tune open models on their own data, usually with LoRA (27).

### 16. Scaling laws

**The problem:** training runs cost millions of dollars, and it was unclear how much a bigger model or more data would help.

**The idea:** measure the loss of many smaller models and fit **power laws**. Kaplan et al. found that loss falls smoothly with parameters $N$, data $D$ and compute $C$, for example $L(N) \approx (N_c / N)^{\alpha_N}$ with $\alpha_N \approx 0.076$, over more than seven orders of magnitude of compute ([Kaplan et al., 2020](https://arxiv.org/abs/2001.08361)).

**Where it is used today:** labs plan every large run by extrapolating from small ones. The specific advice to spend most extra compute on parameters was revised by entry 17.

### 17. Compute-optimal training (Chinchilla)

**The problem:** for a fixed budget, should you train a bigger model on less data or a smaller model on more?

**The idea:** fitting over 400 training runs, Hoffmann et al. modeled loss as

$$
L(N, D) = E + \frac{A}{N^{\alpha}} + \frac{B}{D^{\beta}}
$$

with fitted values $E = 1.69$, $A = 406.4$, $B = 410.7$, $\alpha = 0.34$ and $\beta = 0.28$ in one of their three approaches. All three approaches concluded that parameters and tokens should be scaled in roughly **equal proportion**; their 70B Chinchilla, trained on 1.4 trillion tokens (about 20 tokens per parameter), beat the 280B Gopher at the same compute ([Hoffmann et al., 2022](https://arxiv.org/abs/2203.15556)).

**Where it is used today:** the "about 20 tokens per parameter" rule of thumb is widely quoted. In practice most models now train far *beyond* it, for example Llama 3 8B on over 15 trillion tokens, because a smaller model trained longer is cheaper to serve.

### 18. Data curation and deduplication

**The problem:** raw web text is full of duplicates, spam, boilerplate and low-quality pages, and a model that sees the same text many times memorizes it.

**The idea:** filter and clean training data carefully. Key steps include large curated mixtures such as C4 and the Pile ([Raffel et al., 2019](https://arxiv.org/abs/1910.10683); [Gao et al., 2020](https://arxiv.org/abs/2101.00027)), **deduplication**, which reduces memorization and improves efficiency ([Lee et al., 2021](https://arxiv.org/abs/2107.06499)), and quality classifiers that keep educational content, as in the open FineWeb-Edu dataset ([Penedo et al., 2024](https://arxiv.org/abs/2406.17557)).

**Where it is used today:** data quality is one of the main differences between models of the same size, and most labs treat their data recipe as a trade secret. Fully open projects such as OLMo publish theirs.

### 19. Mixed precision and parallel training

**The problem:** a large model does not fit on one accelerator, and training in 32-bit floating point is slow.

**The idea:** train with 16-bit numbers while keeping a 32-bit master copy of the weights and scaling the loss to avoid underflow (**mixed precision**, [Micikevicius et al., 2017](https://arxiv.org/abs/1710.03740)). Split the model across chips with **tensor and pipeline parallelism** ([Shoeybi et al., 2019](https://arxiv.org/abs/1909.08053)) and split optimizer state across data-parallel workers with **ZeRO** ([Rajbhandari et al., 2019](https://arxiv.org/abs/1910.02054)).

**Where it is used today:** every frontier model is trained this way on thousands to tens of thousands of GPUs or TPUs, increasingly with 8-bit (FP8) formats, which DeepSeek-V3 used for most of its training ([DeepSeek-AI, 2024](https://arxiv.org/abs/2412.19437)).

## Using and aligning the model

### 20. In-context learning

**The problem:** fine-tuning a separate model for every task is slow and needs labeled data.

**The idea:** put a task description and a few examples **in the prompt** and let the model continue the pattern. GPT-3 showed this ability grows with scale ([Brown et al., 2020](https://arxiv.org/abs/2005.14165)).

**Where it is used today:** every prompt you write relies on it, and so do system prompts, few-shot examples and the long instructions that drive agents.

### 21. Chain-of-thought prompting

**The problem:** models answering immediately often fail multi-step arithmetic and logic problems.

**The idea:** show or ask for **intermediate reasoning steps** before the answer. With large enough models, this sharply improves math and reasoning benchmarks ([Wei et al., 2022](https://arxiv.org/abs/2201.11903)); even adding "Let's think step by step" helps ([Kojima et al., 2022](https://arxiv.org/abs/2205.11916)).

**Where it is used today:** reasoning models (30) are trained to produce long chains of thought by themselves, often hidden from the user.

### 22. Instruction tuning

**The problem:** a pretrained model continues text; it does not reliably *do what you ask*.

**The idea:** fine-tune on many tasks written as natural-language instructions with good responses. FLAN and T0 showed this generalizes to new, unseen instructions ([Wei et al., 2021](https://arxiv.org/abs/2109.01652); [Sanh et al., 2021](https://arxiv.org/abs/2110.08207)).

**Where it is used today:** the supervised fine-tuning (SFT) stage of every assistant model, usually with a mix of human-written and model-generated examples.

### 23. RLHF and RLAIF

**The problem:** "good" answers are hard to define with a formula, and instruction data alone does not capture what people prefer.

**The idea:** collect human comparisons of model outputs, train a **reward model** to predict which output people prefer, then optimize the language model to maximize that reward with reinforcement learning, while a penalty keeps it close to the original model ([Christiano et al., 2017](https://arxiv.org/abs/1706.03741); [Ouyang et al., 2022](https://arxiv.org/abs/2203.02155)). **RLAIF** replaces some human labels with AI feedback guided by written principles, as in Constitutional AI ([Bai et al., 2022](https://arxiv.org/abs/2212.08073)).

**Where it is used today:** RLHF made ChatGPT possible and, with its variants, is part of post-training at every major lab. Its known weakness is "reward hacking": the model learns to please the reward model in ways people did not intend, such as excessive length or flattery.

### 24. Direct preference optimization (DPO)

**The problem:** RLHF is complex and unstable: it needs a separate reward model and a reinforcement learning loop.

**The idea:** DPO shows that the same objective can be optimized directly from preference pairs with a simple classification-style loss. For a prompt $x$ with a preferred answer $y_w$ and a rejected answer $y_l$:

$$
\mathcal{L}_{\text{DPO}} = -\log \sigma\!\left(\beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_{\text{ref}}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_{\text{ref}}(y_l \mid x)}\right)
$$

where $\pi_\theta$ is the model being trained, $\pi_{\text{ref}}$ the starting model, $\sigma$ the logistic function and $\beta$ controls how far the model may move ([Rafailov et al., 2023](https://arxiv.org/abs/2305.18290)).

**Where it is used today:** DPO and its variants are widely used, especially for open models, because they need far less infrastructure than RLHF.

## Efficiency: training and running models cheaply

### 25. FlashAttention

**The problem:** attention on GPUs is limited less by arithmetic than by moving the large $n \times n$ score matrix in and out of slow memory.

**The idea:** compute attention in **tiles** that fit in the GPU's fast on-chip memory and never write the full score matrix out, giving the same result exactly but much faster and with memory that grows linearly with sequence length ([Dao et al., 2022](https://arxiv.org/abs/2205.14135)).

**Where it is used today:** FlashAttention and its successors are the default attention implementation in PyTorch and in most training and serving systems. Long contexts would be impractical without it.

### 26. Quantization

**The problem:** a 70-billion-parameter model in 16-bit precision needs about 140 GB just for its weights, more than most single GPUs hold.

**The idea:** store weights with fewer bits. LLM.int8() handles the few large "outlier" features in higher precision so 8-bit inference loses little quality ([Dettmers et al., 2022](https://arxiv.org/abs/2208.07339)); GPTQ quantizes weights to 3 or 4 bits using approximate second-order information ([Frantar et al., 2022](https://arxiv.org/abs/2210.17323)).

**Where it is used today:** 4-bit and 8-bit models are how people run LLMs on laptops and single GPUs with tools such as llama.cpp, and several 2026 open models are trained or released in 4-bit or 8-bit formats from the start.

### 27. LoRA and QLoRA

**The problem:** fully fine-tuning a large model means updating and storing billions of parameters for every variant.

**The idea:** freeze the pretrained weight matrix $W_0$ and learn a **low-rank** update: $W = W_0 + BA$, where $B$ and $A$ are thin matrices of rank $r$ much smaller than the layer's size, so only a tiny fraction of parameters is trained ([Hu et al., 2021](https://arxiv.org/abs/2106.09685)). **QLoRA** does the same on top of a 4-bit quantized model, so a 65B model can be fine-tuned on a single 48 GB GPU ([Dettmers et al., 2023](https://arxiv.org/abs/2305.14314)).

**Where it is used today:** most custom fine-tunes of open models are LoRA adapters, small files that can be swapped on top of one base model.

### 28. Speculative decoding

**The problem:** generation is sequential, one token per full forward pass of a large model, and each pass leaves the hardware underused.

**The idea:** a small, fast **draft** model proposes several tokens; the large model checks them all in one pass and accepts the longest correct prefix. A careful acceptance rule keeps the output distribution exactly the same as the large model's ([Leviathan et al., 2022](https://arxiv.org/abs/2211.17192); [Chen et al., 2023](https://arxiv.org/abs/2302.01318)).

**Where it is used today:** most serving systems, often with drafters built into the model itself (multi-token prediction heads). Many 2026 open model cards ship a dedicated drafter.

## Capabilities: knowledge, tools and reasoning

### 29. Retrieval and tool use

**The problem:** a model's knowledge stops at its training data, it cannot see private documents, and it is unreliable at exact arithmetic or looking things up.

**The idea:** **retrieval-augmented generation (RAG)** fetches relevant documents and adds them to the prompt ([Lewis et al., 2020](https://arxiv.org/abs/2005.11401)). **Tool use** trains or prompts the model to call functions, such as search, a calculator or code execution, and use the results; ReAct interleaved reasoning and actions ([Yao et al., 2022](https://arxiv.org/abs/2210.03629)) and Toolformer taught a model to decide when to call APIs ([Schick et al., 2023](https://arxiv.org/abs/2302.04761)).

**Where it is used today:** RAG is the standard pattern for company chatbots over internal documents, and tool calling is the basis of agents that browse, write and run code, and operate computers.

### 30. Reinforcement learning with verifiable rewards

**The problem:** chain-of-thought prompting helps, but models still make reasoning errors, and human feedback is too slow and costly to supervise long reasoning.

**The idea:** train with reinforcement learning on problems whose answers can be **checked automatically**, such as math with known answers and code with unit tests, and reward correct final results. OpenAI's o1 showed accuracy rising with both training compute and thinking time ([OpenAI, 2024](https://openai.com/index/learning-to-reason-with-llms/)). DeepSeek published a recipe: its R1-Zero model learned long reasoning from rule-based rewards alone using Group Relative Policy Optimization (GRPO), which compares a group of sampled answers to each other instead of training a separate value model ([Shao et al., 2024](https://arxiv.org/abs/2402.03300); [DeepSeek-AI, 2025](https://arxiv.org/abs/2501.12948)).

**Where it is used today:** almost every frontier and leading open model in 2026 has a reasoning mode trained this way, often with a setting for reasoning effort. The approach is strongest where answers can be verified and is now being extended to agentic tasks graded by tests or by other models.

## What the breakthroughs have in common

- **Most solve a bottleneck.** Attention removed the one-vector bottleneck, FlashAttention the memory bottleneck, LoRA the fine-tuning bottleneck. When a new technique appears, ask which bottleneck it removes.
- **Simple ideas at scale win.** Next-token prediction, attention and low-rank updates are simple. Their impact came from applying them to very large models and datasets.
- **Measurement drives progress.** Perplexity, scaling laws, unit tests and verifiable rewards all turn "is this better?" into a number. Areas without good measures, such as open-ended writing quality, improve more slowly and more contentiously.
- **Old ideas return.** Recurrence (5) is back in hybrid state-space models, mixture of experts (12) dates to the 1990s, and reinforcement learning (23, 30) predates LLMs by decades.

To see these techniques in context, read [15 major milestones in the evolution of LLMs](/articles/llm-milestones). To try models yourself, our guide to [open-source LLMs to know in 2026](/articles/open-source-llms) lists ones you can download and run.

## References

All accessed 25 October 2026. Listed in order of first use.

- Kneser, R. and Ney, H. (1995). [Improved backing-off for M-gram language modeling](https://doi.org/10.1109/ICASSP.1995.479394). ICASSP.
- Chen, S. F. and Goodman, J. (1999). [An empirical study of smoothing techniques for language modeling](https://doi.org/10.1006/csla.1999.0128). *Computer Speech and Language* 13(4).
- Shannon, C. E. (1951). [Prediction and entropy of printed English](https://doi.org/10.1002/j.1538-7305.1951.tb01366.x). *Bell System Technical Journal*.
- Bengio, Y. et al. (2003). [A neural probabilistic language model](https://www.jmlr.org/papers/v3/bengio03a.html). *JMLR*.
- Mikolov, T. et al. (2013). [Efficient estimation of word representations in vector space](https://arxiv.org/abs/1301.3781).
- Hochreiter, S. and Schmidhuber, J. (1997). [Long short-term memory](https://doi.org/10.1162/neco.1997.9.8.1735). *Neural Computation*.
- Sennrich, R. et al. (2015). [Neural machine translation of rare words with subword units](https://arxiv.org/abs/1508.07909).
- Bahdanau, D. et al. (2014). [Neural machine translation by jointly learning to align and translate](https://arxiv.org/abs/1409.0473).
- Vaswani, A. et al. (2017). [Attention is all you need](https://arxiv.org/abs/1706.03762).
- Su, J. et al. (2021). [RoFormer: enhanced Transformer with rotary position embedding](https://arxiv.org/abs/2104.09864).
- Shazeer, N. et al. (2017). [Outrageously large neural networks: the sparsely-gated mixture-of-experts layer](https://arxiv.org/abs/1701.06538).
- Ainslie, J. et al. (2023). [GQA: training generalized multi-query Transformer models](https://arxiv.org/abs/2305.13245).
- Kaplan, J. et al. (2020). [Scaling laws for neural language models](https://arxiv.org/abs/2001.08361).
- Hoffmann, J. et al. (2022). [Training compute-optimal large language models](https://arxiv.org/abs/2203.15556).
- Lee, K. et al. (2021). [Deduplicating training data makes language models better](https://arxiv.org/abs/2107.06499).
- Micikevicius, P. et al. (2017). [Mixed precision training](https://arxiv.org/abs/1710.03740).
- Wei, J. et al. (2022). [Chain-of-thought prompting elicits reasoning in large language models](https://arxiv.org/abs/2201.11903).
- Ouyang, L. et al. (2022). [Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155).
- Rafailov, R. et al. (2023). [Direct preference optimization](https://arxiv.org/abs/2305.18290).
- Dao, T. et al. (2022). [FlashAttention](https://arxiv.org/abs/2205.14135).
- Frantar, E. et al. (2022). [GPTQ](https://arxiv.org/abs/2210.17323).
- Hu, E. et al. (2021). [LoRA: low-rank adaptation of large language models](https://arxiv.org/abs/2106.09685); Dettmers, T. et al. (2023). [QLoRA](https://arxiv.org/abs/2305.14314).
- Leviathan, Y. et al. (2022). [Fast inference from Transformers via speculative decoding](https://arxiv.org/abs/2211.17192).
- Lewis, P. et al. (2020). [Retrieval-augmented generation for knowledge-intensive NLP tasks](https://arxiv.org/abs/2005.11401).
- Shao, Z. et al. (2024). [DeepSeekMath (introduces GRPO)](https://arxiv.org/abs/2402.03300); DeepSeek-AI (2025). [DeepSeek-R1](https://arxiv.org/abs/2501.12948).
