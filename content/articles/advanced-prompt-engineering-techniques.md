---
title: 10 Advanced Prompt Engineering Techniques for Large Language Models
seoTitle: 10 Advanced Prompt Engineering Techniques for LLMs
description: 10 advanced prompt engineering techniques for LLM apps, including self-consistency, ReAct, structured outputs, context engineering and evals, with code.
author: BlogAI Editors
authorType: Organization
publishedAt: 2026-11-03
updatedAt: 2026-11-03
status: published
categories:
  - Artificial Intelligence
  - Programming and Technology
tags:
  - prompt engineering
  - large language models
  - ai agents
  - generative ai
  - python
  - ai
tocDepth: 2
---

Basic prompting is about writing a clear request. Advanced prompt engineering is about **systems**: several model calls, tools, retrieved documents, structured outputs and tests that together make a large language model (LLM) reliable enough to run inside a product. This guide covers **10 advanced techniques**, where each came from, when it is worth the extra cost, and a minimal implementation pattern.

**The short answer.** For reliability, sample several answers and vote (self-consistency), let the model use tools and code instead of guessing (ReAct, program-aided reasoning), verify and revise drafts in separate steps, constrain outputs with schemas, manage the context window deliberately, and measure every change against an evaluation set. On modern reasoning models, many older "reasoning prompts" matter less, while context, tools and evaluation matter more.

**How we wrote this.** Each technique is linked to its original paper (all checked on arXiv on 3 November 2026) and to current vendor documentation from [Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices), [OpenAI](https://developers.openai.com/api/docs/guides/prompt-engineering) and [Google](https://aistudio.google.com/docs/prompting-strategies). Benchmark numbers are the papers' own results, mostly on 2022–2023 models; they show that a technique worked, not how much it will help with today's models. The Python examples are provider-agnostic sketches that we syntax-checked but did not run against a live API.

## First, how reasoning models change the picture

Many prompting techniques were invented to make models reason before answering. Current reasoning models do this internally, and vendors now say so directly. OpenAI advises giving reasoning models high-level goals rather than step-by-step instructions ([OpenAI](https://developers.openai.com/api/docs/guides/prompt-engineering)). Google says Gemini's thinking models usually do not need to be asked to reason step by step ([Google](https://aistudio.google.com/docs/prompting-strategies)). Anthropic recommends using its adaptive thinking and the `effort` parameter instead of asking the model to write reasoning in tags ([Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)). A Wharton study found explicit chain-of-thought prompts gave negligible gains on reasoning models while adding latency ([Meincke et al., 2025](https://arxiv.org/abs/2506.07142)).

So the techniques below are grouped by what still pays off: **sampling and search** (1–3), **tools and grounding** (4–6), **verification** (7), **output control** (8), **context management** (9) and **optimization and testing** (10).

| # | Technique | Main benefit | Cost |
|---|---|---|---|
| 1 | Self-consistency | Accuracy on questions with one answer | N× calls |
| 2 | Least-to-most decomposition | Problems harder than your examples | Several calls |
| 3 | Tree of thoughts | Search and planning problems | Many calls |
| 4 | ReAct (reason + act with tools) | Fresh facts, actions | Tool latency |
| 5 | Program-aided reasoning | Exact arithmetic and logic | Sandbox needed |
| 6 | Grounded generation with citations | Fewer unsupported claims | Retrieval pipeline |
| 7 | Verify-and-revise chains | Fewer factual and logic errors | 2–4× calls |
| 8 | Schema-constrained outputs | Parseable, valid outputs | Small |
| 9 | Context engineering | Long tasks, agents | Design effort |
| 10 | Automatic optimization and evals | Measured, repeatable gains | Dataset needed |

The examples assume a helper function that sends a prompt to your provider's SDK and returns text:

```python
def complete(prompt: str, temperature: float = 0.0) -> str:
    """Call your LLM provider here and return the response text."""
    raise NotImplementedError
```

Some newer models ignore or reject sampling parameters such as `temperature` (Google's guide, for example, says to remove them for its latest models), so check your model's documentation and use its supported way of getting varied samples.

## Sampling and search

### 1. Self-consistency: sample several answers and vote

**The idea:** instead of trusting one answer, generate several independent reasoning paths and take the most common final answer. In the original paper this improved chain-of-thought accuracy on the GSM8K math benchmark by 17.9 percentage points ([Wang et al., 2022](https://arxiv.org/abs/2203.11171)).

**When to use it:** questions with a single checkable answer (a number, a label, a yes/no decision) where an error is costly and a few extra calls are affordable. It does not help with open-ended writing, where there is nothing to vote on.

```python
from collections import Counter

def self_consistent_answer(question: str, n: int = 5) -> tuple[str, float]:
    prompt = (
        f"{question}\n\n"
        "Work through the problem, then give the final answer on the last line "
        "in the form: ANSWER: <answer>"
    )
    answers = []
    for _ in range(n):
        text = complete(prompt, temperature=0.8)
        for line in reversed(text.strip().splitlines()):
            if line.startswith("ANSWER:"):
                answers.append(line.removeprefix("ANSWER:").strip())
                break
    if not answers:
        raise ValueError("No parseable answers")
    best, votes = Counter(answers).most_common(1)[0]
    return best, votes / n  # agreement rate doubles as a confidence signal
```

**Production tip:** low agreement is a useful signal. Route questions where fewer than, say, 60% of samples agree to a stronger model or a human.

### 2. Least-to-most decomposition

**The idea:** first ask the model to break a problem into simpler subproblems, then solve them in order, feeding each answer into the next. With 14 examples, least-to-most prompting solved the SCAN compositional generalization benchmark with at least 99% accuracy, against 16% for chain-of-thought ([Zhou et al., 2022](https://arxiv.org/abs/2205.10625)).

**When to use it:** tasks whose test cases are harder or longer than your examples, multi-hop questions, and long documents processed section by section. In applications, the same pattern appears as **prompt chaining**: separate calls for extract → analyze → draft, with code checking each intermediate result. Anthropic recommends chaining when you need to inspect intermediate outputs or enforce a pipeline ([Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)).

```text
Stage 1: List the subquestions that must be answered, in order, to answer:
"{question}". Output one per line. Do not answer them.

Stage 2 (per subquestion): Earlier answers: {previous_answers}
Answer only this subquestion: {subquestion}
```

### 3. Tree of thoughts: search over partial solutions

**The idea:** treat reasoning as a search. Generate several candidate next steps, have the model evaluate each, keep the promising ones and backtrack from dead ends. On the Game of 24 puzzle, GPT-4 with chain-of-thought solved 4% of tasks; with tree of thoughts it solved 74% ([Yao et al., 2023](https://arxiv.org/abs/2305.10601)).

**When to use it:** puzzles, planning and design problems where early choices constrain later ones and a candidate can be scored. It is expensive (dozens of calls per problem), so reserve it for offline or high-value tasks. A lighter version works for everyday product work: generate three to five candidate plans, ask the model (or a cheaper judge model) to score each against explicit criteria, then expand only the best.

## Tools and grounding

### 4. ReAct: interleave reasoning with tool use

**The idea:** let the model alternate between thinking about what it needs, calling a tool (search, a database, an API) and reading the result. On the ALFWorld and WebShop interactive benchmarks, ReAct beat imitation and reinforcement-learning baselines by 34 and 10 percentage points of success rate, using only one or two examples, and it reduced hallucination in question answering by looking facts up ([Yao et al., 2022](https://arxiv.org/abs/2210.03629)).

**Today** this pattern is built into every major API as **tool calling** (function calling), and it is the core of agents, which Anthropic describes simply as LLMs using tools in a loop ([Anthropic, 2025](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)). The prompt engineering work has moved to:

- **Tool descriptions.** Name and describe each tool as you would document a function for a new colleague: what it does, when to use it, what each parameter means and what it returns. Keep the tool set small with little overlap.
- **Stopping conditions.** Tell the agent when to stop and hand back to the user. OpenAI's GPT-5 guide recommends explicit criteria for how much context to gather and when to stop ([OpenAI Cookbook](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide)).
- **Parallel calls.** Independent tool calls can be requested together; Anthropic's guide includes a prompt to encourage or discourage this ([Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)).

### 5. Program-aided reasoning: let code do the arithmetic

**The idea:** ask the model to write a program that solves the problem and run it, instead of computing the answer in text. PAL using Codex beat PaLM-540B with chain-of-thought on GSM8K by 15 percentage points ([Gao et al., 2022](https://arxiv.org/abs/2211.10435)).

**When to use it:** any calculation, date arithmetic, counting, unit conversion or data analysis. Most APIs now offer a hosted code-execution tool; Google's guide recommends enabling it for arithmetic and counting ([Google](https://aistudio.google.com/docs/prompting-strategies)). If you run generated code yourself, use a sandbox with no network or file access to anything sensitive, and a timeout.

```text
Write a Python function solve() that computes the answer to the problem
below and returns it. Use only the standard library. Do not print anything.

Problem: {problem}
```

### 6. Grounded generation with quotes and citations

**The idea:** retrieve relevant documents, put them in the prompt, and require the model to answer only from them, quoting or citing the passages it used. This is retrieval-augmented generation (RAG), introduced as a way to combine a model with an external, updatable knowledge source ([Lewis et al., 2020](https://arxiv.org/abs/2005.11401)).

The prompt engineering that makes RAG reliable:

- **Order:** documents first, question last. Anthropic reports up to 30% better responses with queries at the end on complex multi-document inputs ([Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)).
- **Structure:** wrap each document in tags with its source and date so citations can point to something.
- **Quote first:** ask for the supporting quotes before the answer, then check in code that each quote actually appears in the source.
- **Abstain:** specify the exact response when the documents do not contain the answer.
- **Placement:** models use information at the start and end of a long context more reliably than in the middle ([Liu et al., 2023](https://arxiv.org/abs/2307.03172)), so put the most relevant chunks first and cut weak matches rather than padding the context.

```text
<documents>
<document id="1" source="refund-policy.md" updated="2026-09-01">...</document>
<document id="2" source="faq.md" updated="2026-06-15">...</document>
</documents>

Answer the question using only the documents above.
1. In <quotes>, copy the exact sentences that support your answer, with
   document ids.
2. In <answer>, answer in two to four sentences, citing ids like [1].
If the documents do not answer the question, reply exactly:
"The documents do not cover this."

Question: {question}
```

## Verification

### 7. Verify-and-revise chains

**The idea:** after a draft, run separate steps that check it and fix it. Two well-tested variants:

- **Self-refine:** generate → critique → revise, repeated. It improved task performance by about 20% on average across seven tasks ([Madaan et al., 2023](https://arxiv.org/abs/2303.17651)).
- **Chain-of-verification (CoVe):** draft → plan verification questions → answer each question **independently, without seeing the draft** → write a final answer. Answering independently stops the model from simply repeating its earlier mistake, and the method reduced hallucinations across list, QA and long-form tasks ([Dhuliawala et al., 2023](https://arxiv.org/abs/2309.11495)).

Anthropic calls draft → review against criteria → refine the most common chaining pattern, run as separate calls so you can log and evaluate each step ([Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)).

```python
def draft_review_revise(task: str, criteria: list[str]) -> str:
    draft = complete(task)
    checklist = "\n".join(f"- {c}" for c in criteria)
    review = complete(
        f"<task>\n{task}\n</task>\n<draft>\n{draft}\n</draft>\n"
        f"Review the draft against each criterion:\n{checklist}\n"
        "For each, say PASS or FAIL with a one-line reason. Do not rewrite it."
    )
    if "FAIL" not in review:
        return draft
    return complete(
        f"<task>\n{task}\n</task>\n<draft>\n{draft}\n</draft>\n"
        f"<review>\n{review}\n</review>\n"
        "Revise the draft to fix every FAIL. Keep everything that passed. "
        "Return only the revised draft."
    )
```

**Limits:** a model reviewing its own output shares its blind spots. Where possible, verify with something external: run the code, check the quote exists, recompute the number, or use a different model as the reviewer.

## Output control

### 8. Schema-constrained structured outputs

**The idea:** when code will consume the output, do not rely on "please return JSON". Use the API's **structured outputs** feature, which constrains generation to a JSON Schema you supply, or define a tool whose parameters are the schema. All three major vendors document this ([OpenAI](https://developers.openai.com/api/docs/guides/structured-outputs); [Anthropic](https://platform.claude.com/docs/en/build-with-claude/structured-outputs); [Google](https://aistudio.google.com/docs/structured-output)). Then still validate in code, because a refusal or a response cut off by a length limit can fail the schema.

**The caveat:** strict formats can hurt reasoning. One study found significant drops in reasoning performance under format restrictions, larger with stricter constraints ([Tam et al., 2024](https://arxiv.org/abs/2408.02442)). Two fixes:

- On reasoning models, the reasoning happens before the structured answer, so this matters less.
- On other models, put a free-text `reasoning` field **before** the answer fields in the schema, or run two calls: reason freely, then convert the result to the schema.

```json
{
  "type": "object",
  "properties": {
    "reasoning": {"type": "string"},
    "category": {"type": "string", "enum": ["billing", "bug", "feature_request", "other"]},
    "urgent": {"type": "boolean"}
  },
  "required": ["reasoning", "category", "urgent"],
  "additionalProperties": false
}
```

## Context management

### 9. Context engineering for long tasks and agents

**The idea:** as applications grow from one prompt to long-running agents, the bigger question is not how to phrase instructions but **what to put in the context window at each step**. Anthropic defines context engineering as curating and maintaining the best set of tokens during inference, and notes that models' recall degrades as context grows, which it calls context rot ([Anthropic, 2025](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)). Its recommended techniques:

- **Right-altitude system prompts:** specific enough to guide behaviour, general enough to avoid brittle if-then rules.
- **A few canonical examples** rather than a list of every edge case.
- **Just-in-time retrieval:** keep references (file paths, IDs, queries) and load content only when needed.
- **Compaction:** when a conversation nears the limit, summarize it and continue in a fresh context with the summary.
- **Structured note-taking:** let the agent write progress notes to a file or memory store outside the context and read them back.
- **Sub-agents:** delegate focused subtasks to agents with clean contexts that return short summaries.

**Prompt caching** adds a cost reason to the same discipline: put stable content (instructions, tool definitions, reference documents) at the start of the prompt and variable content at the end, so the provider can reuse the cached prefix ([OpenAI](https://developers.openai.com/api/docs/guides/prompt-engineering)).

## Optimization and testing

### 10. Automatic prompt optimization and evaluation

**The idea:** treat prompts as parameters to optimize against a metric, not as text to polish by feel.

- **APE** had a model propose candidate instructions and kept the one that scored best; its instructions matched or beat human-written ones on 19 of 24 tasks ([Zhou et al., 2022](https://arxiv.org/abs/2211.01910)).
- **OPRO** used an LLM as the optimizer, iterating on prompts with their scores; the best prompts beat human-designed ones by up to 8% on GSM8K and up to 50% on Big-Bench Hard tasks ([Yang et al., 2023](https://arxiv.org/abs/2309.03409)).
- **DSPy** lets you write an LLM pipeline as modules and compiles it, selecting examples and instructions to maximize a metric; compiled pipelines outperformed standard few-shot prompting by over 25% with GPT-3.5 in the paper's case studies ([Khattab et al., 2023](https://arxiv.org/abs/2310.03714)).
- **Metaprompting** is the lightweight version: ask a model to suggest minimal edits to a prompt that would fix a specific failure, as OpenAI's GPT-5 guide recommends ([OpenAI Cookbook](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide)).

All of these need the same foundation: an **evaluation set**. Prompts are fragile in ways intuition misses; formatting changes alone moved one model's few-shot accuracy by up to 76 percentage points, and the best format for one model did not transfer reliably to another ([Sclar et al., 2023](https://arxiv.org/abs/2310.11324)). A minimal evaluation setup:

1. Collect 30–200 real inputs, including edge cases and past failures.
2. Define pass criteria: exact match, a schema check, a rubric scored by a judge model, or human ratings.
3. Run the set on every prompt change and every model upgrade, and track the score over time.
4. Pin production to a specific model snapshot, as OpenAI recommends, and upgrade deliberately ([OpenAI](https://developers.openai.com/api/docs/guides/prompt-engineering)).
5. Keep prompts in version control with the code that builds them; OpenAI now recommends this over storing prompts as separate platform objects ([OpenAI](https://developers.openai.com/api/docs/guides/prompt-engineering)).

## Security: advanced prompts need advanced defences

Every technique that feeds external text into a prompt (retrieval, tools, web pages, emails) creates a path for **prompt injection**: instructions hidden in data that the model then follows. Researchers demonstrated indirect prompt injection against real LLM-integrated applications, including data theft and manipulated tool calls ([Greshake et al., 2023](https://arxiv.org/abs/2302.12173)), and OWASP lists prompt injection as the top risk for LLM applications ([OWASP, LLM01:2025](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)).

OWASP's mitigations translate into prompt and system design rules:

- **Label untrusted content** and tell the model that text inside it is data, never instructions.
- **Validate outputs in code** against the expected format before acting on them.
- **Least privilege:** give the model only the tools and permissions the task needs, enforced in your code, not in the prompt.
- **Human approval** for high-risk actions such as payments, deletions and outbound messages.
- **Adversarial testing:** include injection attempts in your evaluation set.

OWASP notes that prompt injection follows from how generative models work, so these measures reduce the risk rather than eliminate it. No prompt wording alone makes an application safe.

## Choosing the right technique

- **Wrong facts?** Ground with retrieval and quotes (6), add tools (4), verify (7).
- **Wrong arithmetic or logic?** Program-aided reasoning (5), then self-consistency (1) or a reasoning model.
- **Fails on harder inputs than your examples?** Decompose (2).
- **Broken JSON or missing fields?** Structured outputs (8).
- **Agent loses track over long tasks?** Context engineering (9).
- **Not sure whether a change helped?** Build the evaluation set first (10).

## Frequently asked questions

### Are advanced prompting techniques still needed with reasoning models?

Some less than before. Explicit chain-of-thought adds little on reasoning models. Techniques that bring in information or checks the model cannot produce alone (tools, retrieval, code execution, schema validation, independent verification and evaluation sets) remain valuable.

### What is the difference between prompt engineering and context engineering?

Prompt engineering focuses on writing the instructions. Context engineering covers everything that enters the model's context window at each step: instructions, tool definitions, retrieved documents, conversation history, memory and examples ([Anthropic, 2025](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)).

### Should I fine-tune instead of using advanced prompts?

Try prompting, retrieval and evaluation first: they are faster to change and do not require training data. Fine-tuning becomes worth considering when you have a stable task, many high-quality examples and a measured gap that prompting cannot close.

## Related reading

- Start with the fundamentals in our [25 best prompt engineering techniques](/articles/prompt-engineering-techniques).
- Prompts for day-to-day coding are in [20 AI prompts for developers](/articles/ai-prompts-for-developers).
- See these ideas applied to workplace tasks in [30 real-world prompt engineering examples](/articles/prompt-engineering-examples).
- For the research history of chain-of-thought, RAG and tool use, read [30 LLM breakthroughs explained](/articles/llm-breakthroughs).
- To run these techniques on your own hardware, see our [10 open-source LLM families](/articles/open-source-llms).

## References

1. Anthropic. "Prompting best practices." *Claude Platform documentation*. Accessed 3 November 2026. [platform.claude.com](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
2. Anthropic (2025). "Effective context engineering for AI agents." 29 September 2025. [anthropic.com](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
3. OpenAI. "Prompt engineering." *OpenAI API documentation*. Accessed 3 November 2026. [developers.openai.com](https://developers.openai.com/api/docs/guides/prompt-engineering)
4. OpenAI. "GPT-5 prompting guide." *OpenAI Cookbook* (archived). [developers.openai.com](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide)
5. Google. "Prompt design strategies." *Google AI Studio documentation*. Accessed 3 November 2026. [aistudio.google.com](https://aistudio.google.com/docs/prompting-strategies)
6. OWASP GenAI Security Project. "LLM01:2025 Prompt Injection." [genai.owasp.org](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
7. Wang, X. et al. (2022). "Self-Consistency Improves Chain of Thought Reasoning in Language Models." [arXiv:2203.11171](https://arxiv.org/abs/2203.11171)
8. Zhou, D. et al. (2022). "Least-to-Most Prompting Enables Complex Reasoning in Large Language Models." [arXiv:2205.10625](https://arxiv.org/abs/2205.10625)
9. Yao, S. et al. (2023). "Tree of Thoughts: Deliberate Problem Solving with Large Language Models." [arXiv:2305.10601](https://arxiv.org/abs/2305.10601)
10. Yao, S. et al. (2022). "ReAct: Synergizing Reasoning and Acting in Language Models." [arXiv:2210.03629](https://arxiv.org/abs/2210.03629)
11. Gao, L. et al. (2022). "PAL: Program-aided Language Models." [arXiv:2211.10435](https://arxiv.org/abs/2211.10435)
12. Lewis, P. et al. (2020). "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks." [arXiv:2005.11401](https://arxiv.org/abs/2005.11401)
13. Liu, N. F. et al. (2023). "Lost in the Middle: How Language Models Use Long Contexts." [arXiv:2307.03172](https://arxiv.org/abs/2307.03172)
14. Madaan, A. et al. (2023). "Self-Refine: Iterative Refinement with Self-Feedback." [arXiv:2303.17651](https://arxiv.org/abs/2303.17651)
15. Dhuliawala, S. et al. (2023). "Chain-of-Verification Reduces Hallucination in Large Language Models." [arXiv:2309.11495](https://arxiv.org/abs/2309.11495)
16. Tam, Z. R. et al. (2024). "Let Me Speak Freely? A Study on the Impact of Format Restrictions on Performance of Large Language Models." [arXiv:2408.02442](https://arxiv.org/abs/2408.02442)
17. Zhou, Y. et al. (2022). "Large Language Models Are Human-Level Prompt Engineers." [arXiv:2211.01910](https://arxiv.org/abs/2211.01910)
18. Yang, C. et al. (2023). "Large Language Models as Optimizers." [arXiv:2309.03409](https://arxiv.org/abs/2309.03409)
19. Khattab, O. et al. (2023). "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines." [arXiv:2310.03714](https://arxiv.org/abs/2310.03714)
20. Sclar, M. et al. (2023). "Quantifying Language Models' Sensitivity to Spurious Features in Prompt Design." [arXiv:2310.11324](https://arxiv.org/abs/2310.11324)
21. Greshake, K. et al. (2023). "Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection." [arXiv:2302.12173](https://arxiv.org/abs/2302.12173)
22. Meincke, L. et al. (2025). "Prompting Science Report 2: The Decreasing Value of Chain of Thought in Prompting." [arXiv:2506.07142](https://arxiv.org/abs/2506.07142)
