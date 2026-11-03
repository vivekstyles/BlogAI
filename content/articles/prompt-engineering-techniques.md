---
title: 25 Best Prompt Engineering Techniques to Get Better AI Responses
seoTitle: 25 Prompt Engineering Techniques for Better AI Responses
description: 25 prompt engineering techniques that work with ChatGPT, Claude and Gemini, from clear instructions and examples to reasoning, self-checks and testing.
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
  - generative ai
  - chatgpt
  - ai tools
  - ai
tocDepth: 2
---

Most weak AI answers come from weak requests, not weak models. A prompt that leaves out the goal, the audience, the source material or the format forces the model to guess, and it usually guesses "generic". This guide collects **25 prompt engineering techniques** that work across today's chat assistants and APIs (ChatGPT, Claude, Gemini and open models), explains why each one works, and shows a short example.

**The short answer.** Say exactly what you want and why, give the model the material it needs, show an example of a good result, ask for a specific format, and check the output. Everything else in this list refines one of those five habits.

**How we wrote this.** The techniques come from the official prompting guides published by [Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices), [OpenAI](https://developers.openai.com/api/docs/guides/prompt-engineering) and [Google](https://aistudio.google.com/docs/prompting-strategies), all read on 3 November 2026, and from peer-reviewed or widely cited research papers linked in each section. Where research results come from older models, we say so. We did not run our own benchmark for this article.

## Prompt engineering techniques at a glance

| # | Technique | Best for |
|---|---|---|
| 1 | Lead with the outcome | Every prompt |
| 2 | Explain why | Rules and constraints |
| 3 | Name the audience | Explanations, writing |
| 4 | Specify format and length | Anything you will reuse |
| 5 | Say what to do, not what to avoid | Style and formatting |
| 6 | Use a role for tone, not for accuracy | Writing, perspective |
| 7 | Show 3–5 examples | Format, tone, classification |
| 8 | Try zero-shot first | Saving effort |
| 9 | Separate instructions from data | Any prompt with pasted text |
| 10 | Long documents first, question last | Long inputs |
| 11 | Ask for quotes before answers | Document Q&A |
| 12 | Supply the facts yourself | Company or recent information |
| 13 | Put standing rules in the system prompt | Repeated tasks, apps |
| 14 | Start the answer for it | Fixed patterns |
| 15 | Ask for step-by-step reasoning (older models) | Math, logic |
| 16 | Use reasoning effort on reasoning models | Hard problems |
| 17 | Break the task into steps | Multi-part work |
| 18 | Chain prompts | Pipelines, long documents |
| 19 | Step back to principles | Science, policy questions |
| 20 | Allow "I don't know" | Factual questions |
| 21 | Ask it to check its work | Drafts, facts, code |
| 22 | Let it ask clarifying questions | Vague or high-stakes tasks |
| 23 | Generate options, then choose | Ideas, hard answers |
| 24 | Remove contradictions and shouting | Long prompts |
| 25 | Test prompts on real examples | Anything you reuse |

## Foundations: say what you actually want

### 1. Lead with the outcome you want

Start with the result, not the backstory. "Write a 150-word product update for customers explaining the new export button" gives the model a target; "I need help with some product stuff" does not. Anthropic's guide suggests a useful test: show your prompt to a colleague with no context, and if they would be confused, the model will be too ([Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)).

```text
Less effective: Help me with an email about the delay.
More effective: Write a short email to a customer explaining that their order
will ship on 12 November instead of 5 November because a part is back-ordered.
Apologize once, offer free express shipping, and keep it under 120 words.
```

### 2. Explain why a rule matters

Models follow instructions better when they know the reason, because they can apply the reason to cases you did not list. Anthropic's example: instead of "NEVER use ellipses", say the response will be read aloud by a text-to-speech engine that cannot pronounce them ([Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)). The model then also avoids other symbols a speech engine would stumble on.

### 3. Name the audience

"Explain vector databases" produces a different answer for a CTO, a first-year student and a sales team. Say who will read the output and what they already know: "for a product manager who knows SQL but has never used embeddings".

### 4. Specify the format and length

Ask for the shape you need: a table with named columns, five bullet points, a 200-word summary, JSON with given keys. Google's guide lists format and constraints among the first things to state ([Google](https://aistudio.google.com/docs/prompting-strategies)). Length targets are approximate, so ask for a range ("150–200 words") and trim afterwards if it matters.

### 5. Tell the model what to do instead of what not to do

Negative instructions name the thing you do not want and leave the alternative open. Anthropic recommends replacing "Do not use markdown" with a positive description, such as "write in smoothly flowing prose paragraphs" ([Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)). The same guide notes that **the style of your prompt influences the style of the answer**: a prompt full of bullet points tends to get bullet points back.

### 6. Use a role for tone and perspective, not for accuracy

"You are a senior tax accountant" is one of the most common prompt openers. Roles do change tone, vocabulary and what the model pays attention to, and vendors recommend them for that ([Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)). But a study of 162 personas across 2,410 factual questions found that **adding a persona did not improve accuracy** on average, and the effect of a given persona was largely random ([Zheng et al., 2023](https://arxiv.org/abs/2311.10054)). Use roles to set the voice and the point of view; supply facts and criteria separately.

## Examples: show, don't just tell

### 7. Show 3–5 good examples (few-shot prompting)

Examples are the most reliable way to fix format, tone and labels. GPT-3's paper showed that models can pick up a task from a few examples in the prompt ([Brown et al., 2020](https://arxiv.org/abs/2005.14165)), and current vendor guides still recommend it: Anthropic suggests 3–5 examples wrapped in `<example>` tags, and Google says to include few-shot examples whenever you can ([Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices); [Google](https://aistudio.google.com/docs/prompting-strategies)).

Three details matter:

- **Vary the examples.** If all your examples are short and positive, outputs will be too. Cover the range of real inputs.
- **Keep formatting identical** across examples. Research found that much of the benefit comes from showing the label set, the kind of input and the output format, even more than from the labels being correct ([Min et al., 2022](https://arxiv.org/abs/2202.12837)).
- **Watch the order.** In older models, the order of examples and the label of the last example could swing accuracy from near chance to near state of the art ([Zhao et al., 2021](https://arxiv.org/abs/2102.09690)). Shuffle examples and balance labels.

```text
Classify each support message as billing, bug, or feature request.

<examples>
<example>Message: I was charged twice this month. → billing</example>
<example>Message: The export button does nothing on Safari. → bug</example>
<example>Message: Could you add dark mode to the dashboard? → feature request</example>
</examples>

Message: My invoice shows the wrong company name. →
```

### 8. Try zero-shot first, then add examples

Writing good examples takes time, and modern models handle many tasks without them. Start with a clear instruction (zero-shot). Add examples only when the format drifts, the tone is off or labels are inconsistent. This also tells you which examples you actually need: the ones that fix the failures you saw.

## Structure: make the prompt easy to parse

### 9. Separate instructions from data with tags or delimiters

When a prompt mixes instructions, pasted text and examples, the model can confuse them. Wrap each part in its own labelled block, such as XML-style tags or Markdown headings. Anthropic, OpenAI and Google all recommend this ([Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices); [OpenAI](https://developers.openai.com/api/docs/guides/prompt-engineering); [Google](https://aistudio.google.com/docs/prompting-strategies)). Pick one style and use it consistently.

```text
<instructions>
Summarize the contract below for a non-lawyer in five bullet points.
Flag any automatic renewal or termination fee.
</instructions>

<contract>
...pasted text...
</contract>
```

Separation also helps security: text inside a pasted document should be treated as data, not as instructions (see technique 24 and our [advanced techniques guide](/articles/advanced-prompt-engineering-techniques) on prompt injection).

### 10. Put long documents first and your question last

With long inputs, order matters. Anthropic advises placing long documents at the top and the query at the end, and reports that this **improved response quality by up to 30 percent in its tests**, especially with several documents ([Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)). Google gives the same advice for Gemini: context first, then instructions, introduced with a phrase like "Based on the information above" ([Google](https://aistudio.google.com/docs/prompting-strategies)). Research on long contexts also found that models use information at the beginning or end of the input more reliably than information buried in the middle ([Liu et al., 2023](https://arxiv.org/abs/2307.03172)).

### 11. Ask for relevant quotes before the answer

For questions about a long document, ask the model to first extract the passages that matter and then answer from those passages. Anthropic recommends this "ground in quotes" pattern because it focuses the model on relevant text ([Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)). It also makes the answer easy to check: you can search the document for each quote.

### 12. Supply the facts instead of relying on the model's memory

A model's built-in knowledge stops at its training cutoff and is patchy on niche or internal topics. If the answer depends on your company policy, this quarter's numbers or a product released last month, paste the source or let the assistant search. Google's guide makes the same point: give the model the troubleshooting guide rather than relying on general knowledge ([Google](https://aistudio.google.com/docs/prompting-strategies)).

### 13. Put standing rules in the system prompt or custom instructions

Rules that apply to every request (your role, tone, banned claims, output format) belong in the **system prompt** (called developer messages or system instructions in some APIs) or, in chat apps, in custom instructions or project instructions. OpenAI describes developer messages as carrying the application's rules, which take priority over user messages ([OpenAI](https://developers.openai.com/api/docs/guides/prompt-engineering)). This keeps each user message short and the rules consistent. Our [ChatGPT tips for beginners](/articles/chatgpt-prompt-tips-for-beginners) shows where to set these in the app.

### 14. Start the answer for the model (when the tool allows it)

Some APIs let you begin the response, and the model continues the pattern: start a list with "1." or a JSON object with `{`. Google calls these **prefixes** ([Google](https://aistudio.google.com/docs/prompting-strategies)). Check your model's documentation first: Anthropic notes that prefilling the final assistant turn is **no longer supported** on its newer models and recommends structured outputs or direct instructions instead ([Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)). In a chat app, the equivalent is to write the first line you want and ask the model to continue.

## Reasoning: help the model think

### 15. Ask for step-by-step reasoning on non-reasoning models

**Chain-of-thought prompting** asks the model to show intermediate steps before the answer. On older models the effect was dramatic: adding "Let's think step by step" raised one model's accuracy on the MultiArith benchmark from 17.7% to 78.7% ([Kojima et al., 2022](https://arxiv.org/abs/2205.11916); see also [Wei et al., 2022](https://arxiv.org/abs/2201.11903)).

Two caveats from later research:

- A meta-analysis of over 100 papers found that chain-of-thought helps **mainly on math and symbolic logic**, with much smaller gains elsewhere ([Sprague et al., 2024](https://arxiv.org/abs/2409.12183)).
- Wharton researchers found the benefit shrinking on newer models and negligible on reasoning models, while responses took noticeably longer ([Meincke et al., 2025](https://arxiv.org/abs/2506.07142)).

So use it for calculations, logic puzzles and multi-step decisions on fast, non-reasoning models, and ask for the final answer on a separate, clearly marked line.

### 16. On reasoning models, set the thinking effort instead

Reasoning models (OpenAI's reasoning series, Claude with thinking, Gemini thinking models) already reason internally before answering. OpenAI's guide compares them to a senior colleague who needs the goal, not step-by-step instructions ([OpenAI](https://developers.openai.com/api/docs/guides/prompt-engineering)). Google says Gemini's thinking models usually do not need to be told to reason step by step ([Google](https://aistudio.google.com/docs/prompting-strategies)), and Anthropic notes that on some of its newest models, a prompt asking the model to write its reasoning out in tags may be declined; you should rely on the built-in thinking and adjust the **effort** setting instead ([Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)). In a chat app, this means choosing the "thinking" or "reasoning" mode for hard problems rather than adding "think step by step".

### 17. Break a big task into smaller steps

Ask for one thing at a time, or list the steps in order. "Research, outline, draft, edit and format a white paper" in one prompt invites shallow work at every stage. Research on **least-to-most prompting** showed that solving simpler subproblems first and feeding the answers forward improves results on problems harder than the examples ([Zhou et al., 2022](https://arxiv.org/abs/2205.10625)). Numbered steps also make it obvious when the model skipped one.

### 18. Chain prompts: feed one output into the next prompt

**Prompt chaining** splits a workflow into separate requests: extract → analyze → draft → review. Each step gets a focused prompt, and you can inspect or fix the output between steps. Anthropic says that even with built-in reasoning, chaining is still useful when you need to check intermediate results, and that the most common chain is **draft → review against criteria → revise** ([Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)). Google recommends the same for multi-instruction prompts ([Google](https://aistudio.google.com/docs/prompting-strategies)).

### 19. Step back to the general principle first

For questions that depend on a principle (physics, law, policy, finance), first ask the model what general concept applies, then ask it to answer the specific question using that concept. **Step-back prompting** improved PaLM-2L on MMLU physics and chemistry by 7% and 11% and on the TimeQA benchmark by 27% ([Zheng et al., 2023](https://arxiv.org/abs/2310.06117)).

```text
Before answering, state the general principle that governs this situation.
Then apply it to the question: If I double the length of a pendulum,
what happens to its period?
```

## Reliability: get answers you can trust

### 20. Give the model permission to say "I don't know"

Models tend to produce an answer even when they lack the information. Tell them what to do instead: "If the document does not contain the answer, say 'Not stated in the document'." PCWorld's summary of OpenAI's GPT-5.5 guidance reports a related tip for creative requests: state what the model may and may not make up ([PCWorld, 2026](https://www.pcworld.com/article/3127982/your-old-prompts-wont-work-with-gpt-5-5-try-these-instead.html)). For factual work, ask it to mark claims it is unsure about.

### 21. Ask the model to check its own work

A second pass catches a surprising number of errors. Two research-backed patterns:

- **Self-refine:** generate, critique, revise. Across seven tasks it improved results by about 20% on average in the original study ([Madaan et al., 2023](https://arxiv.org/abs/2303.17651)).
- **Chain-of-verification:** draft an answer, list questions that would check its facts, answer those questions independently, then write the final answer. This reduced hallucinations in the authors' tests ([Dhuliawala et al., 2023](https://arxiv.org/abs/2309.11495)).

A practical version: "Before you finish, check every number against the table above and list any you could not verify." For anything important, still check yourself; a model can confidently confirm its own mistake.

### 22. Let the model ask clarifying questions first

When a request is vague or high-stakes, add: "Before you start, ask me up to five questions that would most improve the result." This surfaces assumptions you did not know you were making (audience, budget, constraints). Skip it for simple tasks, where it just adds a round trip.

### 23. Generate several options, then pick or combine

For creative work, ask for three to five distinct options with different angles, then choose or ask for a combination. For hard questions with one right answer, the research version is **self-consistency**: sample several reasoning paths and take the most common answer, which raised accuracy on the GSM8K math benchmark by 17.9 points ([Wang et al., 2022](https://arxiv.org/abs/2203.11171)). Our [advanced techniques guide](/articles/advanced-prompt-engineering-techniques) shows how to automate it.

### 24. Remove contradictions and drop the shouting

Long prompts collect conflicting rules over time ("be concise" in one place, "be thorough" in another). OpenAI's GPT-5 guide warns that the model spends effort trying to reconcile contradictions, which degrades results, and recommends reviewing prompts for them ([OpenAI Cookbook](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide)). Anthropic notes that newer models are more responsive to instructions, so aggressive wording like "CRITICAL: You MUST" can cause over-use; plain wording works better ([Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)).

Folk tricks fall in the same category. A Wharton study tested offering tips and making threats and found **no significant improvement** on hard benchmarks, though individual questions moved in both directions ([Meincke et al., 2025](https://arxiv.org/abs/2508.00614)).

### 25. Test your prompt on real examples before relying on it

Models are sensitive to details that look harmless. One study found accuracy differences of up to **76 percentage points** from formatting changes alone (spacing, separators, capitalization) in a few-shot setting with LLaMA-2-13B ([Sclar et al., 2023](https://arxiv.org/abs/2310.11324)). The lesson is not to fear formatting but to **test**: collect 10–20 real inputs, including awkward ones, write down what a good answer looks like, and rerun them whenever you change the prompt or switch models. OpenAI recommends exactly this, plus pinning production apps to a specific model snapshot ([OpenAI](https://developers.openai.com/api/docs/guides/prompt-engineering)).

## Putting the techniques together: a reusable template

Most good prompts combine six or seven of the techniques above. This template covers them:

```text
<goal>
[What you want produced, in one or two sentences, and what it will be used for.]
</goal>

<audience>
[Who will read or use it and what they already know.]
</audience>

<context>
[Background, source documents, data. Put long material here, before the request.]
</context>

<requirements>
- Format: [table / bullets / email / JSON with keys ...]
- Length: [range]
- Tone: [e.g. plain, friendly, no jargon]
- If information is missing, [say so / ask me / mark it as an assumption].
</requirements>

<example>
[Optional: one short example of a good output.]
</example>

Based on the context above, [restate the request].
```

## Common prompting mistakes

- **Asking for everything at once.** Split research, drafting and editing (techniques 17–18).
- **Giving no source material** and then trusting specific facts, figures or citations in the answer.
- **Changing several things at a time** when a prompt fails, so you cannot tell which change helped.
- **Copying "magic" prompt templates** without adapting them to your task, audience and model.
- **Keeping a prompt after switching models.** Newer models often follow instructions more literally; re-test old prompts (technique 25).
- **Not reading the output critically.** Fluent text is not the same as correct text.

## Frequently asked questions

### What is prompt engineering?

Prompt engineering is the practice of designing the instructions, context and examples you give an AI model so that it produces useful, reliable output. It ranges from writing a clearer chat message to designing and testing the system prompts that run inside software products.

### Which prompt engineering technique matters most?

Being clear and specific about the goal, audience, context and format. A systematic survey of prompting research found few-shot examples and chain-of-thought to be the most widely used techniques ([Schulhoff et al., 2024](https://arxiv.org/abs/2406.06608)), but both build on a clear instruction.

### Do these techniques work the same on every model?

Mostly, but not exactly. Clear instructions, context, examples and structure help across models. Reasoning-related techniques differ: step-by-step prompts help non-reasoning models more than reasoning models, and some features, such as prefilling the answer, are model-specific. Check the vendor's prompting guide and test.

### Is prompt engineering still useful as models improve?

Yes, though its focus is shifting. Models need fewer tricks, but they still cannot read your mind about goals, audience or facts they were never given. Anthropic describes the next step as **context engineering**: choosing everything that goes into the model's context, not just the wording of the instructions ([Anthropic, 2025](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)).

## Related reading

- New to ChatGPT? Start with our [15 ChatGPT prompt engineering tips for beginners](/articles/chatgpt-prompt-tips-for-beginners).
- Writing code with AI? See our [20 AI prompts for developers](/articles/ai-prompts-for-developers).
- Building LLM applications? Read our [10 advanced prompt engineering techniques for large language models](/articles/advanced-prompt-engineering-techniques).
- Looking for ready-to-use workplace prompts? See our [30 real-world prompt engineering examples for business](/articles/prompt-engineering-examples).
- For where chain-of-thought and in-context learning came from, see our [30 LLM breakthroughs explained](/articles/llm-breakthroughs).

## References

1. Anthropic. "Prompting best practices." *Claude Platform documentation*. Accessed 3 November 2026. [platform.claude.com](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
2. OpenAI. "Prompt engineering." *OpenAI API documentation*. Accessed 3 November 2026. [developers.openai.com](https://developers.openai.com/api/docs/guides/prompt-engineering)
3. OpenAI. "GPT-5 prompting guide." *OpenAI Cookbook* (archived). [developers.openai.com](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide)
4. Google. "Prompt design strategies." *Google AI Studio documentation*. Accessed 3 November 2026. [aistudio.google.com](https://aistudio.google.com/docs/prompting-strategies)
5. Anthropic (2025). "Effective context engineering for AI agents." 29 September 2025. [anthropic.com](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
6. Brown, T. et al. (2020). "Language Models are Few-Shot Learners." [arXiv:2005.14165](https://arxiv.org/abs/2005.14165)
7. Zhao, T. Z. et al. (2021). "Calibrate Before Use: Improving Few-Shot Performance of Language Models." [arXiv:2102.09690](https://arxiv.org/abs/2102.09690)
8. Min, S. et al. (2022). "Rethinking the Role of Demonstrations: What Makes In-Context Learning Work?" [arXiv:2202.12837](https://arxiv.org/abs/2202.12837)
9. Wei, J. et al. (2022). "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models." [arXiv:2201.11903](https://arxiv.org/abs/2201.11903)
10. Kojima, T. et al. (2022). "Large Language Models are Zero-Shot Reasoners." [arXiv:2205.11916](https://arxiv.org/abs/2205.11916)
11. Wang, X. et al. (2022). "Self-Consistency Improves Chain of Thought Reasoning in Language Models." [arXiv:2203.11171](https://arxiv.org/abs/2203.11171)
12. Zhou, D. et al. (2022). "Least-to-Most Prompting Enables Complex Reasoning in Large Language Models." [arXiv:2205.10625](https://arxiv.org/abs/2205.10625)
13. Liu, N. F. et al. (2023). "Lost in the Middle: How Language Models Use Long Contexts." [arXiv:2307.03172](https://arxiv.org/abs/2307.03172)
14. Madaan, A. et al. (2023). "Self-Refine: Iterative Refinement with Self-Feedback." [arXiv:2303.17651](https://arxiv.org/abs/2303.17651)
15. Dhuliawala, S. et al. (2023). "Chain-of-Verification Reduces Hallucination in Large Language Models." [arXiv:2309.11495](https://arxiv.org/abs/2309.11495)
16. Zheng, H. S. et al. (2023). "Take a Step Back: Evoking Reasoning via Abstraction in Large Language Models." [arXiv:2310.06117](https://arxiv.org/abs/2310.06117)
17. Sclar, M. et al. (2023). "Quantifying Language Models' Sensitivity to Spurious Features in Prompt Design." [arXiv:2310.11324](https://arxiv.org/abs/2310.11324)
18. Zheng, M. et al. (2023). "When 'A Helpful Assistant' Is Not Really Helpful: Personas in System Prompts Do Not Improve Performances of Large Language Models." [arXiv:2311.10054](https://arxiv.org/abs/2311.10054)
19. Schulhoff, S. et al. (2024). "The Prompt Report: A Systematic Survey of Prompt Engineering Techniques." [arXiv:2406.06608](https://arxiv.org/abs/2406.06608)
20. Sprague, Z. et al. (2024). "To CoT or not to CoT? Chain-of-thought helps mainly on math and symbolic reasoning." [arXiv:2409.12183](https://arxiv.org/abs/2409.12183)
21. Meincke, L., Mollick, E., Mollick, L. and Shapiro, D. (2025). "Prompting Science Report 2: The Decreasing Value of Chain of Thought in Prompting." [arXiv:2506.07142](https://arxiv.org/abs/2506.07142)
22. Meincke, L., Mollick, E., Mollick, L. and Shapiro, D. (2025). "Prompting Science Report 3: I'll pay you or I'll kill you — but will you care?" [arXiv:2508.00614](https://arxiv.org/abs/2508.00614)
23. Patterson, B. (2026). "Your old prompts won't work with GPT-5.5. Try these instead." *PCWorld*, 29 April 2026. [pcworld.com](https://www.pcworld.com/article/3127982/your-old-prompts-wont-work-with-gpt-5-5-try-these-instead.html)
