---
title: "25 Years of Language Models: From Statistical NLP to Modern LLMs"
seoTitle: "History of Language Models: 25 Years From N-grams to LLMs"
description: History of language models from 2001 to 2026 in 25 dated steps, from n-gram counts and word embeddings to Transformers, ChatGPT, reasoning models and agents.
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
  - natural language processing
  - transformers
  - deep learning
  - ai
tocDepth: 2
---

A **language model** is a system that assigns probabilities to sequences of words, or, put the way it is used today, predicts what text comes next. That one idea has not changed in 25 years. What changed is how the prediction is made: in 2001 the best systems counted short word sequences in a few hundred million words of text; in 2026 they are neural networks with hundreds of billions of parameters, trained on tens of trillions of tokens, that write code, read images and work through multi-step tasks.

This article walks through that history in **25 dated steps** from 2001 to 2026. Each step says what was new, why it mattered and what it led to, with a link to the original paper or announcement. The steps fall into four eras:

1. **Statistical language models (2001–2009):** count word sequences and smooth the counts (steps 1–4).
2. **Neural language models and embeddings (2010–2016):** learn vector representations of words and sequences (steps 5–10).
3. **Transformers and pretraining (2017–2021):** one architecture, trained once on huge text and adapted to many tasks (steps 11–16).
4. **Assistants, reasoning and agents (2022–2026):** align models to follow instructions, make them think before answering and let them act (steps 17–25).

<figure>
<img src="/images/articles/history-of-language-models/language-model-eras.svg" alt="Timeline from 2001 to 2026 divided into four eras. Statistical language models, 2001 to 2009: smoothed n-gram counts, Bengio's neural language model in 2003, Google's 2-trillion-token n-gram models in 2007. Neural language models and embeddings, 2010 to 2016: recurrent language models, word2vec, sequence-to-sequence and attention. Transformers and pretraining, 2017 to 2021: the Transformer, BERT and GPT, scaling laws and GPT-3. Assistants, reasoning and agents, 2022 to 2026: ChatGPT, open-weight models, reasoning models and agentic models." width="720" height="300" loading="lazy" decoding="async" />
<figcaption>The four eras of language modeling covered in this article, with the step numbers in each.</figcaption>
</figure>

**How this was researched.** Dates, sizes and results come from the original papers (mostly on arXiv and the ACL Anthology) and from developers' own announcements and model cards, checked on 25 October 2026. Where a figure is an outside estimate rather than a published number, the text says so. For the companion articles, see [15 major milestones in the evolution of LLMs](/articles/llm-milestones) (the turning points in more depth), [20 most important LLMs explained](/articles/important-llms-explained) (model by model) and [30 key breakthroughs](/articles/llm-breakthroughs) (the techniques).

## The 25 steps at a glance

| # | Year | Step | Why it mattered |
|---|---|---|---|
| 1 | 2001 | Smoothed n-gram models reach their peak | The baseline every later model had to beat |
| 2 | 2003 | Bengio's neural probabilistic language model | Words become learned vectors |
| 3 | 2007 | Google's "large language models" for translation | 2 trillion tokens: data scale pays off |
| 4 | 2008 | Collobert and Weston's unified NLP network | One network, shared word embeddings, many tasks |
| 5 | 2010 | Recurrent neural network language models | Context longer than a few words |
| 6 | 2013 | word2vec | Cheap, useful embeddings for everyone |
| 7 | 2014 | Sequence-to-sequence learning | Read a whole sentence, write a new one |
| 8 | 2014 | Attention | Look back at the relevant input words |
| 9 | 2015 | Subword tokens and pretraining for transfer | Open vocabularies; train first, fine-tune later |
| 10 | 2016 | Neural machine translation in production | Neural models replace statistical ones at scale |
| 11 | 2017 | The Transformer | Attention only, fully parallel training |
| 12 | 2018 | ELMo and ULMFiT | Pretrained language models transfer to new tasks |
| 13 | 2018 | GPT and BERT | Pretrained Transformers set new records |
| 14 | 2019 | GPT-2 and T5 | Bigger models, web-scale data, one text-to-text format |
| 15 | 2020 | Scaling laws and GPT-3 | Loss falls predictably with scale; few-shot prompting |
| 16 | 2021 | Code models and open replications | Copilot; the Pile and open GPT-style models |
| 17 | 2022 | Instruction tuning and RLHF | Models that follow instructions |
| 18 | 2022 | Chinchilla and chain-of-thought | Train on more data; show the reasoning |
| 19 | 2022 | ChatGPT | Language models reach the general public |
| 20 | 2023 | GPT-4, Claude and Gemini | Multimodal frontier models from several labs |
| 21 | 2023 | LLaMA, Llama 2 and Mistral | The open-weight boom |
| 22 | 2024 | Million-token context and native multimodality | Whole codebases and books in one prompt; real-time voice |
| 23 | 2024 | Reasoning models | Spending compute on thinking at answer time |
| 24 | 2025 | DeepSeek-R1 and efficient open models | Open reasoning, mixture-of-experts at scale |
| 25 | 2026 | Agents and staged frontier releases | Long tasks, million-token windows, gated access |

## Era 1: statistical language models (2001–2009)

Before neural networks, the standard language model was the **n-gram model**: estimate the probability of a word from the previous $n-1$ words by counting how often those sequences appear in a large text collection. A trigram model, for example, uses $P(w_t \mid w_{t-2}, w_{t-1})$. These models powered speech recognition, machine translation and spelling correction. The idea goes back to Claude Shannon, who in 1948 generated increasingly English-like text by sampling from letter and word statistics ([Shannon, 1948](https://doi.org/10.1002/j.1538-7305.1948.tb01338.x)).

### 1. 2001: smoothed n-gram models reach their peak

The weakness of counting is that most word sequences never appear in the training text, so a raw count gives them probability zero. **Smoothing** methods move a little probability to unseen sequences; Kneser–Ney smoothing ([Kneser and Ney, 1995](https://doi.org/10.1109/ICASSP.1995.479394)) was the most effective. In 2001 Joshua Goodman of Microsoft Research published a thorough study combining smoothing, caching, clustering and other tricks, reporting **perplexity reductions of 38–50%** over a Katz-smoothed trigram baseline and an **8.9% word error rate reduction** in speech recognition ([Goodman, 2001](https://arxiv.org/abs/cs/0108005)).

**Why it matters:** this was the carefully tuned baseline that neural models had to beat for the next decade. Goodman also observed that most of these combined tricks were hard to use in practice, which helps explain why plain smoothed n-grams stayed the industry default.

### 2. 2003: the neural probabilistic language model

Yoshua Bengio and colleagues proposed learning a **vector for every word** (a word embedding) together with a neural network that predicts the next word from the vectors of the previous ones ([Bengio et al., 2003](https://www.jmlr.org/papers/v3/bengio03a.html)). Because similar words end up with similar vectors, the model can generalize: having seen "the cat is walking in the bedroom", it gives sensible probability to "a dog was running in a room".

**Why it matters:** this is the direct ancestor of every modern LLM. It beat strong n-gram models on perplexity but was slow to train with the hardware of the time, so it took years to become practical.

### 3. 2007: Google's "large language models" for translation

The phrase "large language models" appears in the title of a 2007 Google paper about machine translation. Thorsten Brants, Jeffrey Dean and colleagues trained n-gram models on **up to 2 trillion tokens**, producing models with **up to 300 billion n-grams**, and introduced a cheap smoothing method called **Stupid Backoff** that approaches Kneser–Ney quality as data grows ([Brants et al., 2007](https://aclanthology.org/D07-1090/)). Google had released its Web 1T 5-gram corpus, counts from about one trillion words of web text, through the Linguistic Data Consortium the year before ([LDC2006T13](https://catalog.ldc.upenn.edu/LDC2006T13)).

**Why it matters:** it showed that **more data could beat cleverer methods**, a lesson that returned with full force in the neural era (steps 15 and 18).

### 4. 2008: one network for many NLP tasks

Ronan Collobert and Jason Weston trained a single convolutional network for part-of-speech tagging, chunking, named-entity recognition, semantic role labeling and language modeling, with **shared word embeddings** learned partly from unlabeled Wikipedia text ([Collobert and Weston, 2008](https://doi.org/10.1145/1390156.1390177)).

**Why it matters:** it introduced the pattern of learning general representations from unlabeled text and reusing them across tasks, which became the pretraining recipe ten years later.

## Era 2: neural language models and embeddings (2010–2016)

### 5. 2010: recurrent neural network language models

Tomáš Mikolov and colleagues used a **recurrent neural network (RNN)**, which keeps a hidden state that is updated word by word, so the context is not limited to a fixed window. A mixture of RNN language models gave **around 50% lower perplexity** than a state-of-the-art backoff model and **about 18% lower word error rate** on a Wall Street Journal speech task ([Mikolov et al., 2010](https://www.isca-archive.org/interspeech_2010/mikolov10_interspeech.html)). Later work used long short-term memory (LSTM) networks ([Hochreiter and Schmidhuber, 1997](https://doi.org/10.1162/neco.1997.9.8.1735)), which hold information over longer spans.

**Why it matters:** neural language models now clearly beat n-grams, and GPU training made them feasible. RNNs and LSTMs dominated language modeling until 2017.

### 6. 2013: word2vec

Mikolov's team at Google released **word2vec**, two very simple models (skip-gram and continuous bag-of-words) that learn word vectors from huge text quickly ([Mikolov et al., 2013a](https://arxiv.org/abs/1301.3781); [2013b](https://arxiv.org/abs/1310.4546)). The vectors captured analogies: the vector for *king* minus *man* plus *woman* lands near *queen*. Stanford's GloVe followed in 2014 ([Pennington et al., 2014](https://aclanthology.org/D14-1162/)).

**Why it matters:** pretrained embeddings became a standard input for almost every NLP system, and the idea that a model learns meaning from **predicting context** went mainstream. Their limit: each word gets one vector, so *bank* means the same in "river bank" and "bank loan".

### 7. 2014: sequence-to-sequence learning

Ilya Sutskever, Oriol Vinyals and Quoc Le showed that one LSTM can read a whole input sentence into a vector and a second LSTM can write an output sentence from it, reaching strong English–French translation results ([Sutskever et al., 2014](https://arxiv.org/abs/1409.3215)). Kyunghyun Cho and colleagues proposed a similar encoder–decoder and the gated recurrent unit (GRU) the same year ([Cho et al., 2014](https://arxiv.org/abs/1406.1078)).

**Why it matters:** translation, summarization and dialogue could all be framed as **text in, text out**, learned end to end.

### 8. 2014: attention

Squeezing a whole sentence into one vector loses information. Dzmitry Bahdanau, Kyunghyun Cho and Yoshua Bengio let the decoder **attend** to every input word, computing a weighted average of the encoder states at each output step ([Bahdanau et al., 2014](https://arxiv.org/abs/1409.0473)).

**Why it matters:** attention is the mechanism that, three years later, replaced recurrence entirely.

### 9. 2015: subword tokens and pretraining for transfer

Two quieter ideas from 2015 became essential. Rico Sennrich and colleagues adapted **byte-pair encoding (BPE)** to split rare words into frequent pieces, so a model can handle any word, including names and new terms, with a fixed vocabulary ([Sennrich et al., 2015](https://arxiv.org/abs/1508.07909)). Andrew Dai and Quoc Le showed that **pretraining** an LSTM as a language model or autoencoder on unlabeled text, then fine-tuning it, improved text classification ([Dai and Le, 2015](https://arxiv.org/abs/1511.01432)).

**Why it matters:** almost every LLM today uses a subword tokenizer descended from BPE, and the pretrain-then-fine-tune recipe became the dominant one in 2018.

### 10. 2016: neural machine translation in production

Google described **GNMT**, a deep LSTM encoder–decoder with attention and subword units, and reported that it reduced translation errors by about 60% on average compared with its phrase-based production system in side-by-side human evaluations ([Wu et al., 2016](https://arxiv.org/abs/1609.08144)). The same year, Google Brain trained large LSTM language models on the One Billion Word benchmark, cutting perplexity sharply and showing that bigger neural language models kept improving ([Jozefowicz et al., 2016](https://arxiv.org/abs/1602.02410)).

**Why it matters:** neural sequence models moved from papers into products used by hundreds of millions of people, and scale was already visibly helping.

## Era 3: Transformers and pretraining (2017–2021)

### 11. 2017: the Transformer

"Attention Is All You Need" removed recurrence and built an encoder–decoder entirely from **self-attention** and feed-forward layers ([Vaswani et al., 2017](https://arxiv.org/abs/1706.03762)). Every position attends to every other position in one step, so training parallelizes across the whole sequence on GPUs and TPUs. The larger model reached 28.4 BLEU on WMT 2014 English–German, a new best at the time, at a fraction of previous training costs.

**Why it matters:** every LLM in the rest of this list is a Transformer or a close variant. The [30 key breakthroughs](/articles/llm-breakthroughs) article explains self-attention, positional encodings and the later refinements in more detail.

### 12. 2018: ELMo and ULMFiT

Early 2018 brought two demonstrations that a pretrained **language model** transfers to other tasks. ELMo produced **contextual** word vectors from a bidirectional LSTM language model, so *bank* gets different vectors in different sentences ([Peters et al., 2018](https://arxiv.org/abs/1802.05365)). ULMFiT showed how to fine-tune a pretrained LSTM language model for text classification with very few labeled examples ([Howard and Ruder, 2018](https://arxiv.org/abs/1801.06146)).

**Why it matters:** "pretrain a language model, then adapt it" stopped being a trick and became the default way to build NLP systems.

### 13. 2018: GPT and BERT

OpenAI combined the Transformer with generative pretraining. **GPT** (later called GPT-1) was a 12-layer Transformer decoder with about 117 million parameters, pretrained to predict the next token on the BooksCorpus collection of unpublished books and then fine-tuned for each task ([Radford et al., 2018](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)). Four months later Google released **BERT**, a Transformer encoder pretrained by predicting masked-out words using context on both sides, which set new records on 11 NLP tasks ([Devlin et al., 2018](https://arxiv.org/abs/1810.04805)). In 2019 Google said BERT was helping it understand about one in ten English search queries in the US ([Google, 2019](https://blog.google/products/search/search-language-understanding-bert/)).

**Why it matters:** these two models defined the two main branches: **decoder-only** models that generate text (the GPT line, which became today's chat models) and **encoder** models that understand text (BERT and its descendants, still widely used for search, classification and embeddings).

### 14. 2019: GPT-2 and T5

**GPT-2** scaled the GPT recipe to 1.5 billion parameters, trained on WebText, a corpus of about 8 million web pages linked from Reddit ([Radford et al., 2019](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)). It could write coherent paragraphs and do some tasks **zero-shot**, without fine-tuning. OpenAI released it in stages over 2019, citing misuse concerns, which started a lasting debate about how to publish powerful models. Google's **T5** cast every task, from translation to classification, as text-to-text, and was trained on the new C4 web corpus with up to 11 billion parameters ([Raffel et al., 2019](https://arxiv.org/abs/1910.10683)).

**Why it matters:** web-scale data and a single text-in, text-out format made one model useful for many tasks.

### 15. 2020: scaling laws and GPT-3

In January 2020 Jared Kaplan and colleagues at OpenAI reported that language model loss falls as a smooth **power law** in model size, data and compute over many orders of magnitude ([Kaplan et al., 2020](https://arxiv.org/abs/2001.08361)). That made scale a predictable investment. In May, **GPT-3**, with 175 billion parameters, showed **in-context learning**: given a few examples in the prompt, it could do a new task with no weight updates ([Brown et al., 2020](https://arxiv.org/abs/2005.14165)). OpenAI offered it through an API rather than releasing the weights.

**Why it matters:** "prompting" was born, and so was the model-as-a-service business. The paper also documented biases and misuse risks, which stayed central to the field.

### 16. 2021: code models and open replications

OpenAI's **Codex**, a GPT model fine-tuned on public code, solved 28.8% of the HumanEval programming problems with one attempt, against 0% for GPT-3 ([Chen et al., 2021](https://arxiv.org/abs/2107.03374)); it powered the first GitHub Copilot preview. Meanwhile the grassroots group EleutherAI released **the Pile**, an 825 GiB open training dataset ([Gao et al., 2020](https://arxiv.org/abs/2101.00027)), and open GPT-style models such as GPT-Neo and GPT-J trained on it.

**Why it matters:** code became one of the most valuable uses of LLMs, and open research groups showed that frontier-style models were not only for the largest labs.

## Era 4: assistants, reasoning and agents (2022–2026)

### 17. 2022: instruction tuning and RLHF

Base language models continue text; they do not reliably follow instructions. Google's **FLAN** fine-tuned a model on many tasks phrased as instructions and found it generalized to unseen instructions ([Wei et al., 2021](https://arxiv.org/abs/2109.01652)). OpenAI's **InstructGPT** added **reinforcement learning from human feedback (RLHF)**: people ranked model outputs, a reward model learned their preferences, and the language model was optimized against it. Human raters preferred the outputs of a 1.3-billion-parameter InstructGPT over those of the 175-billion-parameter GPT-3 ([Ouyang et al., 2022](https://arxiv.org/abs/2203.02155)), building on earlier RLHF work ([Christiano et al., 2017](https://arxiv.org/abs/1706.03741)).

**Why it matters:** alignment training, not just scale, turned a text predictor into a usable assistant.

### 18. 2022: Chinchilla and chain-of-thought

DeepMind's **Chinchilla** paper found that most large models were undertrained: for a fixed compute budget, model size and training tokens should grow together. Chinchilla, with 70 billion parameters trained on 1.4 trillion tokens, outperformed the 280-billion-parameter Gopher trained with the same compute ([Hoffmann et al., 2022](https://arxiv.org/abs/2203.15556)). The same year, **chain-of-thought prompting** showed that asking a large model to write intermediate reasoning steps sharply improves arithmetic and logic results ([Wei et al., 2022](https://arxiv.org/abs/2201.11903)).

**Why it matters:** data became as important as parameters, and "let the model think step by step" became the seed of later reasoning models (step 23).

### 19. 2022: ChatGPT

On 30 November 2022 OpenAI released **ChatGPT**, a chat interface to a GPT-3.5 model trained with RLHF ([OpenAI, 2022](https://openai.com/index/chatgpt/)). UBS analysts, using Similarweb data, estimated it reached about 100 million monthly active users in January 2023, which would make it the fastest-growing consumer app to that point ([Reuters, 2023](https://www.reuters.com/technology/chatgpt-sets-record-fastest-growing-user-base-analyst-note-2023-02-01/)). That is an outside estimate, not an OpenAI figure.

**Why it matters:** language models went from a research topic to a mass-market product in weeks, and every large technology company reorganized around them.

### 20. 2023: GPT-4, Claude and Gemini

**GPT-4** arrived in March 2023, accepting images as well as text and scoring around the top 10% of test takers on a simulated bar exam; its technical report withheld the architecture, size and training data, citing competition and safety ([OpenAI, 2023](https://arxiv.org/abs/2303.08774)). Anthropic launched **Claude** the same day ([Anthropic, 2023](https://www.anthropic.com/news/introducing-claude)), and Google DeepMind introduced **Gemini** in December as a natively multimodal family ([Gemini Team, 2023](https://arxiv.org/abs/2312.11805)).

**Why it matters:** the frontier became a race between several labs, and the most capable models stopped publishing their sizes, which is why later parameter counts in this history are mostly for open models.

### 21. 2023: LLaMA, Llama 2 and Mistral

Meta's **LLaMA** (February 2023) showed that smaller models trained on more data could compete: LLaMA-13B outperformed GPT-3 on most benchmarks reported ([Touvron et al., 2023](https://arxiv.org/abs/2302.13971)). Its weights were meant for researchers only but leaked online within about a week. **Llama 2** (July 2023) allowed commercial use under Meta's own license ([Touvron et al., 2023b](https://arxiv.org/abs/2307.09288)), and the French start-up **Mistral AI** released Mistral 7B under the Apache 2.0 license ([Jiang et al., 2023](https://arxiv.org/abs/2310.06825)), followed by the mixture-of-experts model Mixtral 8x7B ([Jiang et al., 2024](https://arxiv.org/abs/2401.04088)).

**Why it matters:** anyone could now download, fine-tune and run a capable model on their own hardware. Techniques such as LoRA fine-tuning and 4-bit quantization made that practical on a single GPU. Our guide to [open-source LLMs in 2026](/articles/open-source-llms) follows this line to today.

### 22. 2024: million-token context and native multimodality

In February 2024 Google's **Gemini 1.5 Pro** offered a context window of up to 1 million tokens, enough for long books, hours of video or large codebases in one prompt, and reported near-perfect retrieval in tests of up to 10 million tokens in research settings ([Gemini Team, 2024](https://arxiv.org/abs/2403.05530)). In May, OpenAI's **GPT-4o** handled text, images and audio in one model, responding to speech in about 320 milliseconds on average ([OpenAI, 2024](https://openai.com/index/hello-gpt-4o/)).

**Why it matters:** long context reduced the need to chop documents into pieces, and real-time voice made language models feel like conversation partners.

### 23. 2024: reasoning models

In September 2024 OpenAI released **o1**, trained with reinforcement learning to produce a long hidden chain of thought before answering. On the 2024 AIME math competition, OpenAI reported that GPT-4o solved about 12% of problems while o1 solved 74% with one attempt and 83% with a consensus of 64 attempts ([OpenAI, 2024](https://openai.com/index/learning-to-reason-with-llms/)).

**Why it matters:** it opened a second scaling axis. Besides training bigger models, you can let a model **spend more computation at answer time**, and accuracy rises on math, science and coding problems.

### 24. 2025: DeepSeek-R1 and efficient open models

In December 2024 the Chinese lab DeepSeek released **DeepSeek-V3**, a mixture-of-experts model with 671 billion total parameters but only 37 billion active per token, trained on 14.8 trillion tokens using 2.788 million H800 GPU hours ([DeepSeek-AI, 2024](https://arxiv.org/abs/2412.19437)). In January 2025 **DeepSeek-R1** showed that reinforcement learning with automatically checkable rewards could produce o1-style reasoning, and released the weights under the MIT license ([DeepSeek-AI, 2025](https://arxiv.org/abs/2501.12948)). OpenAI released its first open-weight language models since GPT-2, **gpt-oss-120b and gpt-oss-20b**, under Apache 2.0 in August 2025 ([OpenAI model card](https://huggingface.co/openai/gpt-oss-120b)).

**Why it matters:** the gap between open and closed models narrowed, mixture-of-experts became the standard design for large models, and training efficiency became a competitive weapon.

### 25. 2026: agents and staged frontier releases

The 2026 story is about **duration and autonomy**. Frontier models are marketed and evaluated on long-running agentic work: coding in a terminal for hours, operating a computer and doing multi-step research. One-million-token context windows are now common: Anthropic lists 1 million tokens for every current Claude model ([Anthropic docs](https://platform.claude.com/docs/en/about-claude/models/overview)), and open-weight models such as DeepSeek-V4.1-Flash and Kimi K3 advertise the same ([DeepSeek model card](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash); [Kimi K3 model card](https://huggingface.co/moonshotai/Kimi-K3)).

A newer pattern is **staged access for the most capable models**, especially where cybersecurity capability is high. OpenAI's GPT-6 Astra (September 2026) went first to participants in a cybersecurity program ([CNBC, 2026](https://www.cnbc.com/2026/09/03/open-ai-astra-gpt-6-cyber.html)), and Google's Gemini 4 Argon (30 September 2026) first went to trusted cyber defenders before a wider rollout ([Google, 2026](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/)). At the same time, open weights kept spreading: Meta, which had not released a new Llama since April 2025, published the 816-billion-parameter Muse Spark Open on 15 October 2026 under a custom license ([Meta, 2026](https://research.meta.ai/blog/muse-spark-open)).

**Why it matters:** what a model can *do* over a long task, and who is allowed to use it, now matters as much as benchmark scores. These details are recent and will date quickly; check the developers' pages for the current state.

## What 25 years of language models teach

- **The objective barely changed.** Predicting the next word was the training goal in 2001 and still is for pretraining today. What changed is the model, the data and the compute.
- **Data scale kept winning.** Google's 2-trillion-token n-gram models (step 3), GPT-2's WebText (step 14) and Chinchilla's data-heavy recipe (step 18) all made the same point in different decades.
- **Representation was the key idea.** Word vectors (steps 2 and 6), contextual vectors (step 12) and Transformer layers (step 11) are successive answers to the question of how to represent meaning.
- **Usability came from post-training.** Instruction tuning and RLHF (step 17), not raw size, turned GPT-3 into ChatGPT.
- **Openness moves in waves.** Results were mostly published openly until 2019, closed at the frontier after GPT-4 and reopened through open-weight releases from Meta, Mistral, DeepSeek, Alibaba, Google, OpenAI and others.
- **Benchmarks are a weak guide.** Many of the scores above were reported by the developers themselves on their chosen tests. Use them to see the direction of progress, and test models on your own tasks before choosing one.

If you want the mathematics behind these models, start with [linear algebra concepts for machine learning](/articles/linear-algebra-concepts-for-machine-learning) and [optimization techniques](/articles/mathematical-optimization-techniques). For practitioner writing on today's LLMs, the [Artificial Intelligence category](/category/artificial-intelligence) of our blog directory lists researchers' and engineers' blogs worth following.

## References

All accessed 25 October 2026. Papers are listed in the order they appear.

- Shannon, C. E. (1948). [A mathematical theory of communication](https://doi.org/10.1002/j.1538-7305.1948.tb01338.x). *Bell System Technical Journal*.
- Kneser, R. and Ney, H. (1995). [Improved backing-off for M-gram language modeling](https://doi.org/10.1109/ICASSP.1995.479394). ICASSP.
- Goodman, J. (2001). [A bit of progress in language modeling](https://arxiv.org/abs/cs/0108005). Microsoft Research.
- Bengio, Y. et al. (2003). [A neural probabilistic language model](https://www.jmlr.org/papers/v3/bengio03a.html). *JMLR* 3.
- Brants, T. et al. (2007). [Large language models in machine translation](https://aclanthology.org/D07-1090/). EMNLP-CoNLL.
- Collobert, R. and Weston, J. (2008). [A unified architecture for natural language processing](https://doi.org/10.1145/1390156.1390177). ICML.
- Mikolov, T. et al. (2010). [Recurrent neural network based language model](https://www.isca-archive.org/interspeech_2010/mikolov10_interspeech.html). Interspeech.
- Mikolov, T. et al. (2013). [Efficient estimation of word representations in vector space](https://arxiv.org/abs/1301.3781).
- Sutskever, I., Vinyals, O. and Le, Q. (2014). [Sequence to sequence learning with neural networks](https://arxiv.org/abs/1409.3215).
- Bahdanau, D., Cho, K. and Bengio, Y. (2014). [Neural machine translation by jointly learning to align and translate](https://arxiv.org/abs/1409.0473).
- Sennrich, R., Haddow, B. and Birch, A. (2015). [Neural machine translation of rare words with subword units](https://arxiv.org/abs/1508.07909).
- Wu, Y. et al. (2016). [Google's neural machine translation system](https://arxiv.org/abs/1609.08144).
- Vaswani, A. et al. (2017). [Attention is all you need](https://arxiv.org/abs/1706.03762).
- Devlin, J. et al. (2018). [BERT: pre-training of deep bidirectional Transformers](https://arxiv.org/abs/1810.04805).
- Radford, A. et al. (2018, 2019). [Improving language understanding by generative pre-training](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf); [Language models are unsupervised multitask learners](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf).
- Kaplan, J. et al. (2020). [Scaling laws for neural language models](https://arxiv.org/abs/2001.08361).
- Brown, T. et al. (2020). [Language models are few-shot learners](https://arxiv.org/abs/2005.14165).
- Ouyang, L. et al. (2022). [Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155).
- Hoffmann, J. et al. (2022). [Training compute-optimal large language models](https://arxiv.org/abs/2203.15556).
- Touvron, H. et al. (2023). [LLaMA: open and efficient foundation language models](https://arxiv.org/abs/2302.13971).
- DeepSeek-AI (2024, 2025). [DeepSeek-V3 technical report](https://arxiv.org/abs/2412.19437); [DeepSeek-R1](https://arxiv.org/abs/2501.12948).
- Anthropic. [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) (Claude documentation).
- Google. [Gemini 4 Argon](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/), 30 September 2026.
- Meta. [Introducing Muse Spark Open](https://research.meta.ai/blog/muse-spark-open), 15 October 2026.
