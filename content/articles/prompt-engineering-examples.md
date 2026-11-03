---
title: 30 Real-World Prompt Engineering Examples for Business and Productivity
seoTitle: 30 Prompt Engineering Examples for Business and Productivity
description: 30 real-world prompt examples for email, meetings, marketing, sales, support, HR, finance and strategy, each with a reusable template and what to check.
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
  - productivity
  - generative ai
  - chatgpt
  - business operations
  - marketing
tocDepth: 2
---

Generic prompts produce generic business writing. The prompts that save real time at work share a pattern: they say what the output is for, include the actual material (notes, data, policy), set the format, and leave room for the model to flag what it does not know. This guide gives **30 real-world prompt engineering examples** for common business and productivity tasks, each with a template you can adapt and what to check before you use the result.

**The short answer.** Paste your own source material, name the audience and the decision the output supports, ask for a specific format, and tell the assistant to mark gaps instead of filling them. Then review the output: AI drafts well, but it does not know your customers, your numbers or your commitments unless you tell it.

**How we wrote this.** The templates are our own, built on the prompting guidance published by [Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices), [OpenAI](https://developers.openai.com/api/docs/guides/prompt-engineering) and [Google](https://aistudio.google.com/docs/prompting-strategies) (read on 3 November 2026). They work in ChatGPT, Claude, Gemini, Microsoft Copilot and similar assistants. We did not measure time savings for these specific prompts. Replace the square brackets with your details.

## What the evidence says about AI at work

Two widely cited field studies give a realistic picture:

- In a call centre with over 5,000 agents, access to an AI assistant raised issues resolved per hour by **14% on average** and by about **34% for novice and low-skilled workers**, with little effect for the most experienced ([Brynjolfsson, Li and Raymond, NBER](https://www.nber.org/papers/w31161)).
- In a preregistered experiment with 758 Boston Consulting Group consultants, those using GPT-4 on tasks within the AI's capabilities completed **12.2% more tasks** and worked **25.1% faster**. But on a task outside those capabilities, AI users were **less likely to reach the correct answer** than those without it ([Dell'Acqua et al.](https://papers.ssrn.com/abstract=4573321)).

The lesson for prompting: AI helps most on drafting, summarizing and structuring, and can mislead on tasks that need facts or judgment it does not have. The "Check" notes below exist for that reason.

## A reusable business prompt pattern

```text
<task>What you need, and what it will be used for.</task>
<audience>Who reads it and what they care about.</audience>
<material>Your notes, data, policy, previous examples. Long material goes here.</material>
<format>Length, structure, tone.</format>
<rules>
- Use only facts from the material. Mark anything you had to assume as [ASSUMPTION].
- If something important is missing, list it at the end instead of inventing it.
</rules>
```

The 30 examples below are shorter variations of this pattern. For the reasoning behind each element, see our [25 best prompt engineering techniques](/articles/prompt-engineering-techniques).

## Email and communication

### 1. Reply to a difficult customer email

```text
Draft a reply to the customer email below. Our position: [refund not possible
because X; we can offer Y]. Tone: calm, direct, no corporate filler. Acknowledge
their frustration once, explain the decision in plain words, offer Y with a
clear next step. Under 150 words.

<email>[paste]</email>
```

**Check:** that the offer and any dates match what you can actually deliver.

### 2. Turn rough notes into a clear update email

```text
Turn these notes into a status email for [stakeholders]. Structure: one-line
summary, what's done, what's next, risks and what I need from them. Keep my
facts; don't add any. Bullet points, under 200 words.

<notes>[paste]</notes>
```

**Check:** nothing in "what I need from them" was invented.

### 3. Rewrite a message for a different audience

```text
Rewrite the technical explanation below for [executives / customers / new
hires]. Keep it accurate, remove jargon, and lead with what it means for them.
Give two versions: one in three sentences, one in a short paragraph.

[paste]
```

**Check:** simplification did not change the meaning.

### 4. Say no politely

```text
Write a short, friendly message declining [request] from [person/relationship].
Reason: [real reason]. Offer [alternative, if any]. Don't over-apologize.
Give me two versions: warmer and more direct.
```

**Check:** the tone suits your relationship; edit names and details.

### 5. Inbox triage from a batch of emails

```text
Below are [N] emails. For each, give: sender, one-line summary, category
(needs reply today / needs reply this week / FYI / can ignore), and a
suggested one-sentence reply where useful. Output as a table.

[paste emails]
```

**Check:** only paste emails you are allowed to share with the tool; spot-check the "can ignore" row.

## Meetings and documents

### 6. Meeting notes into decisions and actions

```text
From the transcript below, extract:
1. Decisions made (with who made them)
2. Action items: task, owner, due date (write "no date" if none was said)
3. Open questions
Only include items that were actually said. Quote the line for any action
item whose owner is unclear.

<transcript>[paste]</transcript>
```

**Check:** owners and dates against your memory of the meeting; transcripts mishear names.

### 7. Prepare a meeting agenda

```text
Create a [30]-minute agenda for a meeting to decide [decision]. Attendees:
[roles]. Background: [paste]. Include time per item, the question each item
must answer, and what to send attendees beforehand.
```

**Check:** the time adds up and the decision is actually on the agenda.

### 8. Summarize a long report for a decision-maker

```text
<report>[paste or upload]</report>

Based on the report above, write a one-page brief for [role] who must decide
[decision]. Include: the recommendation (if the report has one), three key
findings with page or section references, risks, and what the report does
not cover. Don't add information that isn't in the report.
```

**Check:** follow the section references for the findings you will repeat.

### 9. Draft a standard operating procedure

```text
Write a standard operating procedure for [process] based on how we do it
now (notes below). Format: purpose, scope, roles, numbered steps, common
mistakes, and when to escalate. Where my notes are unclear, add a
[QUESTION] marker instead of guessing.

<notes>[paste]</notes>
```

**Check:** walk through the steps with someone who does the job.

## Marketing and content

### 10. Product description from a specification

```text
Write a product description for [channel: website / marketplace] from the
spec below, for [target customer]. Lead with the main benefit, then three
supporting points tied to specific features. 80–120 words. Use only
features in the spec; no superlatives we can't back up.

<spec>[paste]</spec>
```

**Check:** every claim against the spec, especially anything regulated (health, safety, environmental claims).

### 11. Social media posts in your brand voice

```text
Here are three of our past posts that performed well:
<examples>[paste]</examples>

Write five [LinkedIn / Instagram] posts announcing [news], matching the tone,
length and structure of the examples. Vary the opening line. No hashtags
unless the examples use them.
```

**Check:** facts, links and dates; delete anything that sounds unlike you.

### 12. Blog outline from a customer question

```text
Our customers often ask: "[question]". Create an outline for a helpful
article answering it for [audience]. Give the answer in the first section,
then H2 sections for the details, examples and common mistakes. Note where
we should add our own data or screenshots.
```

**Check:** that you can actually supply the expert detail; an outline is not research. Our guide to [reading engineering blog posts critically](/articles/read-engineering-blog-posts-critically) covers how to judge sources.

### 13. Repurpose one piece into several formats

```text
Turn the article below into: (1) a 100-word newsletter blurb, (2) three
social posts, (3) five bullet points for a sales one-pager. Keep all facts
identical to the article.

<article>[paste]</article>
```

**Check:** numbers survived the rewriting unchanged.

### 14. A/B test ideas for a landing page

```text
Here is our landing page copy and its current conversion rate of [X%]:
<page>[paste]</page>

Suggest five A/B test ideas. For each: the change, the hypothesis behind it,
and which metric would show it worked. Rank by expected impact and ease.
```

**Check:** the ideas are hypotheses; only a test tells you what works.

## Sales

### 15. Research brief before a sales call

```text
I'm meeting [company] about [product]. Here is what I know:
<notes>[paste public information you gathered]</notes>

Summarize their likely priorities, three questions I should ask, possible
objections and how our product addresses each. Separate what comes from my
notes from what is your inference.
```

**Check:** treat inferences as guesses; verify anything you will say to the customer.

### 16. Personalized follow-up after a call

```text
Write a follow-up email after a sales call. Call notes: [paste]. Recap their
two main concerns in their words, show how we address each, propose a
specific next step with two time options. Under 150 words, no hype.
```

**Check:** it reflects what the customer actually said.

### 17. Handle a common objection

```text
Customers often say "[objection]". Give me three ways to respond, each in
two or three sentences: one acknowledging and reframing, one with a
question, one with a proof point (use only these proof points: [list]).
```

**Check:** proof points are real and current.

### 18. Proposal executive summary

```text
Write a one-page executive summary for a proposal to [client]. Their
problem: [paste]. Our solution: [paste]. Price and timeline: [paste].
Structure: their situation, what we'll do, outcomes, investment, next steps.
Plain language, no buzzwords.
```

**Check:** pricing, scope and timelines exactly match the full proposal.

## Customer support

### 19. Draft a help-centre article from support tickets

```text
Below are [N] tickets about the same issue. Write a help article that
solves it: a title phrased as the customer's question, the short answer
first, numbered steps, and a "still not working?" section. Use our product's
terms exactly as they appear in the tickets.

<tickets>[paste, with personal details removed]</tickets>
```

**Check:** follow the steps yourself in the product.

### 20. Classify and route incoming messages

```text
Classify each message as one of: billing, bug, how-to, feature request,
account access, other. Also mark urgent: yes/no (urgent = can't use the
product, or payment problem). Output a table: message number, category,
urgent, one-line reason.

<examples>
Message: "I was charged twice." → billing, urgent: yes
Message: "Can you add CSV export?" → feature request, urgent: no
</examples>

<messages>[paste]</messages>
```

**Check:** sample a batch by hand before automating; examples matter more than the category list.

### 21. Response that follows your policy

```text
<policy>[paste refund/returns policy]</policy>
<customer_message>[paste]</customer_message>

Using only the policy above, draft a reply. Quote the policy clause you're
relying on in a note to me (not in the reply). If the policy doesn't cover
this case, say so instead of drafting a reply.
```

**Check:** the quoted clause really applies.

## HR and people

### 22. Write an inclusive job description

```text
Write a job description for [role] from these notes: [paste]. Separate
must-have from nice-to-have requirements and keep must-haves to what the
job truly needs. Use plain, gender-neutral language. Include
responsibilities, the team, pay range [range] and how to apply.
```

**Check:** requirements with your hiring manager, and local employment-law rules on what job ads must or must not include.

### 23. Structured interview questions

```text
Create [8] structured interview questions for [role] that assess [skills].
For each: the question, what a strong answer includes, and a follow-up
probe. Avoid questions about personal life, age, family or health.
```

**Check:** with HR. Use AI to prepare interviews, not to score or reject candidates; automated hiring decisions raise fairness and legal risks.

### 24. Onboarding plan for a new hire

```text
Create a 30-60-90-day onboarding plan for a [role] joining [team]. Include
weekly goals for the first month, people to meet, systems to learn, and
how we'll know they're on track. Our tools: [list].
```

**Check:** that the plan matches what your team can actually support.

## Finance and operations

### 25. Explain a variance in plain language

```text
<data>[paste budget vs actual table]</data>

Identify the three largest variances, calculate each in amount and percent,
and suggest possible explanations I should check. Show the calculation for
each. Label explanations as hypotheses.
```

**Check:** recompute the numbers in your spreadsheet. Better still, use an assistant that runs code for calculations, as Google's guide recommends for arithmetic ([Google](https://aistudio.google.com/docs/prompting-strategies)).

### 26. Write spreadsheet formulas

```text
In [Excel / Google Sheets], column A has [dates], column B [customer IDs],
column C [amounts]. Write a formula for [result]. Explain each part, and
give one example row with the expected output so I can test it.
```

**Check:** test on a few rows where you know the right answer.

### 27. Draft a vendor comparison

```text
Compare these [3] vendor quotes for [service]:
<quotes>[paste]</quotes>

Make a table: price, what's included, contract length, cancellation terms,
support, risks. Then list questions to ask each vendor about anything
unclear. Don't recommend one; I'll decide.
```

**Check:** terms against the original quotes before you negotiate.

### 28. Turn a process into a checklist

```text
Convert this process description into a checklist someone can follow under
time pressure. One action per line, starting with a verb. Mark steps that
must not be skipped. Add a "before you start" section for prerequisites.

<process>[paste]</process>
```

**Check:** run it once with the person who will use it.

## Strategy and research

### 29. Structured pros and cons for a decision

```text
We're deciding whether to [decision]. Context: [paste]. Give the strongest
case for and against, the key assumptions each side depends on, what
information would change the answer, and a cheap way to test the riskiest
assumption. Don't tell me what to decide.
```

**Check:** the assumptions list is the valuable part; validate the ones that matter.

### 30. First-pass market or competitor scan

```text
Search the web and summarize [competitor / market] for [purpose]: products,
pricing (with dates), target customers and recent announcements. Cite a
source for every fact and say when a source is older than 12 months.
Separate facts from your interpretation.
```

**Check:** open the cited sources. Use an assistant with web search for this, since built-in knowledge is out of date; even then, citations can be wrong.

## Rules for using AI prompts at work

- **Follow your company's AI policy** on which tools are approved and what data may be shared. Remove personal and confidential details where you can.
- **Own the output.** You are responsible for what you send, publish or decide.
- **Verify facts, figures and commitments** before anything leaves your hands.
- **Keep humans in decisions about people,** such as hiring, performance and customer disputes.
- **Save prompts that work** as templates for your team, and improve them when they fail.

## Frequently asked questions

### Which business tasks are AI prompts best for?

Drafting, rewriting, summarizing, extracting structure from messy notes, brainstorming and preparing for conversations. These are tasks where you can quickly judge the result. Be more careful with tasks that depend on facts, calculations or judgment the assistant cannot verify.

### How do I get AI to write in my company's voice?

Paste two or three real examples of your best writing and ask it to match their tone, length and structure. Examples work better than adjectives like "professional but friendly". In ChatGPT, you can save the examples in project instructions or files so every chat uses them; see our [ChatGPT tips for beginners](/articles/chatgpt-prompt-tips-for-beginners).

### Can I paste confidential business data into AI tools?

Only into tools your organization has approved for that data, under the agreed terms. Consumer accounts may have different data handling from business plans, so check with your IT or legal team.

## Related reading

- Learn the techniques behind these templates in our [25 best prompt engineering techniques](/articles/prompt-engineering-techniques).
- New to AI assistants? Read [15 ChatGPT prompt engineering tips for beginners](/articles/chatgpt-prompt-tips-for-beginners).
- Automating these workflows in software? See [10 advanced prompt engineering techniques for LLMs](/articles/advanced-prompt-engineering-techniques) and [20 AI prompts for developers](/articles/ai-prompts-for-developers).
- For where AI fits in business functions, see [AI in business operations, marketing and sales](/articles/ai-in-business-operations-marketing-sales).

## References

1. Brynjolfsson, E., Li, D. and Raymond, L. (2023). "Generative AI at Work." NBER Working Paper 31161. [nber.org](https://www.nber.org/papers/w31161)
2. Dell'Acqua, F. et al. (2023). "Navigating the Jagged Technological Frontier: Field Experimental Evidence of the Effects of AI on Knowledge Worker Productivity and Quality." Harvard Business School Working Paper 24-013. [ssrn.com](https://papers.ssrn.com/abstract=4573321)
3. Anthropic. "Prompting best practices." *Claude Platform documentation*. Accessed 3 November 2026. [platform.claude.com](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
4. OpenAI. "Prompt engineering." *OpenAI API documentation*. Accessed 3 November 2026. [developers.openai.com](https://developers.openai.com/api/docs/guides/prompt-engineering)
5. Google. "Prompt design strategies." *Google AI Studio documentation*. Accessed 3 November 2026. [aistudio.google.com](https://aistudio.google.com/docs/prompting-strategies)
