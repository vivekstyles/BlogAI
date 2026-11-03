---
title: 20 Powerful AI Prompts for Developers to Write Better Code
seoTitle: 20 AI Prompts for Developers to Write Better Code
description: 20 copy-ready AI prompts for developers, covering planning, debugging, tests, code review, refactoring, SQL, regex, security and coding agent rules.
author: BlogAI Editors
authorType: Organization
publishedAt: 2026-11-03
updatedAt: 2026-11-03
status: published
categories:
  - Programming and Technology
  - Artificial Intelligence
tags:
  - prompt engineering
  - developer tools
  - programming
  - generative ai
  - ai agents
  - ai
tocDepth: 2
---

AI coding assistants are now part of most developers' toolkits, but the gap between "it wrote something" and "it wrote something I would merge" is mostly about the prompt. In the [2025 Stack Overflow Developer Survey](https://survey.stackoverflow.co/2025/ai), 84% of respondents said they use or plan to use AI tools in development, yet more developers distrusted the accuracy of those tools (46%) than trusted it (33%). Better prompts will not close that gap entirely, but they make answers more specific, more testable and easier to review.

This guide gives **20 AI prompts for developers**, each with when to use it, a template you can paste into ChatGPT, Claude, Gemini, Copilot Chat or a coding agent, and why it works.

**The short answer.** Give the model the code, the error and the constraints (language version, framework, style rules), ask for a plan before code on anything non-trivial, ask for tests alongside changes, and review every diff as if a new teammate wrote it.

**How we wrote this.** The prompts apply guidance from the official prompting guides of [Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices), [OpenAI](https://developers.openai.com/api/docs/guides/prompt-engineering) and [Google](https://aistudio.google.com/docs/prompting-strategies), read on 3 November 2026. The templates are our own. We did not benchmark them; treat them as starting points and adjust them to your codebase.

## Before you prompt: context beats cleverness

Three habits make every prompt below work better:

1. **Paste the real thing.** The actual function, the full stack trace, the schema, the failing test. A model that has not seen the code will guess, and Anthropic's guide explicitly recommends telling coding models never to speculate about code they have not opened ([Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)).
2. **State the environment.** Language and version, framework and version, runtime, OS, and any libraries you cannot add. "Python 3.12, Django 5, no new dependencies" prevents half the bad suggestions.
3. **Say what "done" means.** Tests pass, no public API change, under N lines, follows the existing style.

In the templates, replace text in square brackets. Long code goes in the tagged blocks, before the request.

## Understand and plan

### 1. Explain unfamiliar code

**Use when:** you inherit code, review a PR in an unfamiliar area, or read a library's source.

```text
<code language="[language]">
[paste code]
</code>

Explain what this code does for a developer who knows [language] but not this
codebase. Cover: its purpose, inputs and outputs, side effects (I/O, global
state, network), and anything surprising or risky. Refer to line numbers.
If something depends on code that isn't shown, say what you'd need to see
instead of guessing.
```

**Why it works:** it names the audience, asks for specific aspects instead of a narration of every line, and gives the model permission to say "not shown".

### 2. Plan before writing any code

**Use when:** a feature touches several files or you are unsure of the approach.

```text
I need to [feature] in a [framework/version] app. Relevant files:

<files>
[paste or describe key files]
</files>

Don't write code yet. Propose a plan: the files to change, the new functions
or classes with signatures, data model changes, edge cases, and how we'll
test it. List assumptions and open questions at the end.
```

**Why it works:** separating planning from implementation lets you catch a wrong approach in a minute instead of after 300 lines. This is the prompt-chaining idea from vendor guides: inspect the intermediate output before the next step ([Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)).

### 3. Design an API or data model with trade-offs

**Use when:** you need to choose between designs, not just get one.

```text
I'm designing [API / schema] for [use case]. Requirements: [list].
Expected scale: [requests/rows]. Constraints: [DB, auth, backwards compatibility].

Give me two or three different designs. For each: a sketch (endpoints or
tables), pros, cons, and what would make me regret it in a year.
Then recommend one for my constraints and explain why.
```

**Why it works:** asking for alternatives and failure modes avoids the model's tendency to present its first idea as the only one.

## Write code

### 4. Implement a function from a precise specification

```text
Write a [language] function with this signature:

[signature]

Behaviour:
- [rule 1]
- [rule 2]
- Invalid input: [raise X / return None / ...]

Constraints: [language version], standard library only, no global state,
type hints, docstring. Follow this style:

<style_example>
[paste a short function from your codebase]
</style_example>

After the code, list the edge cases you handled.
```

**Why it works:** the signature and rules remove ambiguity, the style example is a one-shot example (examples steer format and style better than descriptions), and the edge-case list makes gaps visible.

### 5. Write the tests first, then the code

```text
Here is the spec for [function]:
[spec]

Step 1: write [pytest / Jest / JUnit] tests covering normal cases, boundaries,
invalid input and at least one property that must always hold.
Stop after the tests so I can review them.
```

Then, in the next message: "The tests look right. Now implement the function so they pass."

**Why it works:** you review the definition of correct before any implementation exists, and the model cannot quietly shape tests around its own code.

### 6. Ask for a general solution, not one that games the tests

**Use when:** a coding agent is iterating against a test suite.

```text
Implement a general solution that works for all valid inputs, not just the
test cases. Do not hard-code expected values or special-case test inputs.
If a test looks wrong, or the task can't be done as specified, tell me
instead of working around it.
```

**Why it works:** models working towards passing tests sometimes special-case the tests. Anthropic's guide recommends almost exactly this instruction for that reason ([Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)).

### 7. Write a safe shell or automation script

```text
Write a [bash / PowerShell / Python] script that [task] on [OS].
Requirements:
- A --dry-run flag that prints what would happen without changing anything.
- Stop on the first error and print a clear message.
- Never delete files outside [directory].
- Comment each non-obvious command.
List anything the script assumes about my environment.
```

**Why it works:** scripts that touch files or servers are where a confident wrong answer does real damage. Dry-run, fail-fast and explicit boundaries make the result safe to try. Our [Python automation scripts](/articles/python-automation-scripts) article has more patterns.

## Debug

### 8. Debug with the full picture

```text
<error>
[full error message and stack trace]
</error>

<code>
[the relevant code, including the function named in the trace]
</code>

Environment: [language/version, framework/version, OS].
Expected: [what should happen]. Actual: [what happens].
Already tried: [list].

Find the most likely cause. Explain the reasoning briefly, then give the
smallest fix. If you need more information to be sure, say what to check.
```

**Why it works:** "already tried" stops the model repeating your failed fixes, and asking for the smallest fix discourages unrelated rewrites.

### 9. Rank root-cause hypotheses for a heisenbug

**Use when:** the bug is intermittent, environment-specific or performance-related.

```text
Symptom: [describe], happens [frequency / conditions]. Doesn't happen when
[conditions]. Relevant code and logs below.

List the five most likely root causes, ranked. For each, give the evidence
for and against from what I've shown, and one cheap experiment that would
confirm or rule it out.
```

**Why it works:** it turns the model into a hypothesis generator and gives you experiments to run, instead of one confident guess. It also suits reasoning models, which do well with a clear goal and room to think ([OpenAI](https://developers.openai.com/api/docs/guides/prompt-engineering)).

### 10. Explain an error message you have never seen

```text
Explain this error in plain terms: what it means, the three most common
causes in [framework/version], and how to tell which one applies to me.

[error]
```

**Why it works:** short and specific. For errors from recently released library versions, paste the relevant docs or changelog, since the model's training data may predate them.

## Review and improve

### 11. Code review with severity levels

```text
Review this diff as a senior [language] engineer.

<diff>
[git diff]
</diff>

Report issues in a table: severity (blocker / should fix / nit), file:line,
problem, suggested fix. Focus on correctness, error handling, security,
concurrency and performance, in that order. Skip pure formatting. If the diff
looks good, say so; don't invent issues to fill the table.
```

**Why it works:** severities let you triage, the ordering focuses attention, and the last sentence counters the tendency to produce something for every row.

### 12. Refactor without changing behaviour

```text
Refactor the code below to [goal: e.g. remove duplication, split the 200-line
function, improve names]. Rules:
- Behaviour and public interfaces must not change.
- No new dependencies.
- Keep changes small enough to review.
Show the refactored code, then a list of every change and why it's safe.
If tests would be needed to be confident, write them.
```

**Why it works:** "behaviour must not change" is the definition of a refactor, and the change list makes review possible.

### 13. Improve performance with evidence

```text
This [function / query] takes [time] on [input size]. Profile output:

<profile>
[paste]
</profile>

Identify the bottleneck from the profile, propose up to three optimizations
ranked by expected impact, and estimate the complexity before and after.
Don't optimize code the profile shows is not hot.
```

**Why it works:** grounding the request in profiler output stops speculative micro-optimizations.

### 14. Security review against common weaknesses

```text
Review this [endpoint / module] for security issues: injection, broken
access control, authentication flaws, sensitive data exposure, insecure
deserialization, SSRF and secrets in code. Treat all request data as
attacker-controlled.

For each finding: the vulnerable line, how it could be exploited, severity,
and a fix. Say explicitly which categories you checked and found nothing.
```

**Why it works:** naming categories, loosely based on the [OWASP Top 10](https://owasp.org/Top10/), makes the review systematic, and "found nothing" lists show coverage. An AI review is a supplement to, not a replacement for, static analysis tools and human security review.

## Data, text and glue code

### 15. Write SQL from your actual schema

```text
<schema>
[CREATE TABLE statements, or table and column list with types]
</schema>

Database: [PostgreSQL 17 / MySQL 8 / SQLite / ...]

Write a query that returns [result]. Explain any join or window function.
Note how it handles NULLs and duplicates. If an index would help, suggest it.
```

**Why it works:** without the schema, the model invents column names. Naming the dialect avoids syntax that only works elsewhere. See our [SQL queries for data analysts](/articles/sql-queries-for-data-analysts) for patterns to check the result against.

### 16. Build a regular expression with test cases

```text
Write a [language / engine] regular expression that matches [description].

Must match:
[examples]

Must not match:
[examples]

Explain each part of the pattern, and give code that runs it against all
the examples above so I can verify it.
```

**Why it works:** examples define the pattern better than prose, and the generated test code lets you check the claim immediately.

### 17. Migrate code between languages or framework versions

```text
Convert this code from [source: e.g. Python 2 / React class components /
Express 4] to [target and version]. Keep behaviour identical. Use idiomatic
[target] rather than a line-by-line translation. List any behaviour that
can't be preserved exactly and any API you weren't sure about in the
target version.
```

**Why it works:** "idiomatic" prevents literal translations, and asking for uncertain APIs flags the places where the model may be relying on outdated knowledge. Paste the target framework's migration guide if it was released recently.

## Document and ship

### 18. Write documentation people will read

```text
Write a [README section / docstring / ADR] for the code below, for
[new team members / API consumers]. Include: what it does, a minimal usage
example that actually matches the code, configuration options and common
errors. Don't describe features that aren't in the code.
```

**Why it works:** the audience shapes the depth, and the last sentence guards against invented features, a common failure in generated docs.

### 19. Write a commit message or pull request description from the diff

```text
<diff>
[git diff --staged]
</diff>

Write a commit message: a summary line under 72 characters in the imperative
mood, a blank line, then a short body explaining why the change was made,
not just what changed. Then write a PR description with: summary, testing
done (leave a placeholder if unknown), and risks.
```

**Why it works:** the format rules match common Git conventions, and asking for "why" pushes beyond restating the diff. Fill in the reason yourself if the diff cannot show it.

### 20. Give your coding agent a project rules file

**Use when:** you use an agent (Claude Code, Codex, Cursor, Copilot agent mode and similar) on the same repository repeatedly.

Agents read a standing instructions file at the start of each session, such as [AGENTS.md](https://agents.md/) or tool-specific files like `CLAUDE.md`. Ask the model to draft one, then edit it yourself:

```text
Based on the repository files below, draft a concise AGENTS.md for coding
agents. Include: how to install, build, test and lint (exact commands);
code style rules that aren't enforced by tooling; directories not to touch;
and how to verify a change before calling it done. Keep it under 60 lines.
Only include facts you can see in these files.

[paste package.json / pyproject.toml / Makefile / CONTRIBUTING.md]
```

**Why it works:** it moves repeated instructions into context that is loaded automatically, which is what Anthropic calls context engineering ([Anthropic, 2025](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)). Keep it short and factual; a long file of vague rules costs context on every task.

## Rules for using AI-generated code safely

- **Read every line before you commit it.** You are the author of record.
- **Run it.** Run the tests, run the linter, try the edge cases. A model's claim that code "should work" is not evidence.
- **Check every dependency it adds.** Confirm the package exists, is maintained and is the one you meant; models can suggest packages that do not exist. A study of 576,000 generated code samples found hallucinated package names in at least 5.2% of cases for commercial models and 21.7% for open-source models, and attackers can register those names ([Spracklen et al., 2024](https://arxiv.org/abs/2406.10279)).
- **Keep secrets out of prompts.** Do not paste API keys, credentials or customer data, and follow your employer's policy on which tools may see proprietary code.
- **Watch for outdated APIs.** Training data lags behind releases. When a library changed recently, paste its current documentation.
- **Prefer small, reviewable changes.** Ask for one function or one file at a time unless you are using an agent with tests.

## Frequently asked questions

### Which AI model is best for coding?

It changes every few months and depends on the task, language and tool. Rather than relying on leaderboards, try two or three assistants on a handful of real tasks from your own codebase and compare the diffs you would actually merge.

### Should I use a chat assistant or a coding agent?

Chat is good for explanations, small functions and reviewing snippets. Agents that can read the repository, run commands and tests are better for multi-file changes, but need clearer instructions, a rules file and careful review of their diffs.

### Do I still need to learn to code if AI writes code?

Yes. You need to specify the problem, judge whether the output is correct and secure, and debug it when it is not. All of the prompts above assume you can read the code that comes back. Our [Python projects for beginners](/articles/python-projects-for-beginners) is a good place to build that foundation.

## Related reading

- The techniques behind these prompts are explained in our [25 best prompt engineering techniques](/articles/prompt-engineering-techniques).
- Building an LLM feature into your product? See [10 advanced prompt engineering techniques for large language models](/articles/advanced-prompt-engineering-techniques).
- New to AI assistants? Start with [15 ChatGPT prompt engineering tips for beginners](/articles/chatgpt-prompt-tips-for-beginners).
- For workplace tasks beyond code, see [30 real-world prompt engineering examples for business](/articles/prompt-engineering-examples).
- Preparing for interviews? See our [Python interview questions](/articles/python-interview-questions).

## References

1. Stack Overflow (2025). "AI." *2025 Developer Survey*. [survey.stackoverflow.co](https://survey.stackoverflow.co/2025/ai)
2. Anthropic. "Prompting best practices." *Claude Platform documentation*. Accessed 3 November 2026. [platform.claude.com](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
3. Anthropic (2025). "Effective context engineering for AI agents." 29 September 2025. [anthropic.com](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
4. OpenAI. "Prompt engineering." *OpenAI API documentation*. Accessed 3 November 2026. [developers.openai.com](https://developers.openai.com/api/docs/guides/prompt-engineering)
5. Google. "Prompt design strategies." *Google AI Studio documentation*. Accessed 3 November 2026. [aistudio.google.com](https://aistudio.google.com/docs/prompting-strategies)
6. OWASP Foundation. "OWASP Top 10." [owasp.org](https://owasp.org/Top10/)
7. AGENTS.md. "A simple, open format for guiding coding agents." [agents.md](https://agents.md/)
8. Spracklen, J. et al. (2024). "We Have a Package for You! A Comprehensive Analysis of Package Hallucinations by Code Generating LLMs." [arXiv:2406.10279](https://arxiv.org/abs/2406.10279)
