---
title: 30 Best AI Applications Revolutionizing Healthcare, Finance, and Education
seoTitle: 30 AI Applications in Healthcare, Finance and Education
description: 30 AI applications in healthcare, finance and education, from AI scribes and fraud models to AI tutors, with trial results, company claims and known risks.
author: BlogAI Editors
authorType: Organization
publishedAt: 2026-10-20
updatedAt: 2026-10-20
status: published
categories:
  - Engineering
  - Science
tags: [artificial intelligence, healthcare, finance, education, generative ai, case studies]
tocDepth: 2
---

Healthcare, finance and education are where AI touches people's health, money and learning most directly, so they are also where the evidence matters most. This guide covers 30 applications, 10 in each field, chosen because each has a named deployment or a published study behind it. For each one you get:

- **What AI does:** the task it takes on.
- **The evidence:** a trial, evaluation or named deployment, with a link.
- **Limits and risks:** what can go wrong and what the evidence does not show.

**How to read the results.** A randomized controlled trial (RCT), where people are assigned to use AI or not by chance, is the strongest evidence here. Company announcements are weaker; we label their figures as company figures. In all three fields, the trials published in 2024 to 2026 often found smaller or more mixed effects than early marketing suggested, and a few found harm. We include those. Sources were checked in October 2026. Nothing here is medical, financial or legal advice.

This article concentrates on generative AI and newer deployments. For classic machine learning in these fields, such as sepsis alerts, credit scoring and card fraud models, see [100 machine learning applications across industries](/articles/machine-learning-applications). For a cross-industry overview, see [25 examples of how AI is transforming industries in 2026](/articles/ai-transforming-industries-examples).

## Healthcare

Healthcare AI has two very different halves. Administrative AI (notes, messages, coding) is spreading fast because errors are visible to the clinician who signs off. Clinical AI (diagnosis, treatment) moves slower because it needs regulatory clearance and prospective evidence.

### 1. Ambient AI scribes for clinical notes

**What AI does:** listens to a consented doctor-patient visit and drafts the clinical note, which the clinician edits and signs.

**The evidence:** a randomized trial at UCLA assigned 238 physicians in 14 specialties to one of two scribe products or usual care over about 72,000 visits. One product reduced note-writing time by 9.5% more than usual care; the other's effect was not statistically significant; both brought modest improvements in burnout and workload scores ([UCLA Health](https://www.uclahealth.org/news/release/ucla-study-finds-ai-scribes-may-reduce-documentation-time)). At Kaiser Permanente, an analysis of about 2.5 million encounters estimated 15,791 hours saved, and 47% of surveyed patients said their doctor spent less time looking at the computer ([AMA](https://www.ama-assn.org/practice-management/digital-health/ai-scribes-save-15000-hours-and-restore-human-side-medicine)).

**Limits and risks:** clinicians reported occasional clinically significant errors, most often omissions. Notes also tend to get longer, and patients must be told the visit is recorded.

### 2. Drafting replies to patient portal messages

**What AI does:** drafts responses to the messages patients send through their health portal, which clinicians edit before sending.

**The evidence:** in a five-week study at Stanford Health Care with 162 clinicians, AI drafts reduced self-reported task load and work exhaustion but did not save time replying ([Garcia et al., *JAMA Network Open*, 2024](https://doi.org/10.1001/jamanetworkopen.2024.3201)). A randomized study at UC San Diego similarly found no reduction in reply time and longer replies ([Stanford Medicine](https://med.stanford.edu/news/all-news/2024/03/ai-patient-messages.html) summarizes the Stanford work).

**Limits and risks:** a reduced feeling of burden is valuable, but it is not the same as time saved. Drafts can sound confident about clinical advice the clinician would not give.

### 3. Diagnostic reasoning support

**What AI does:** suggests possible diagnoses and next tests from a case description.

**The evidence:** in a randomized trial with 50 physicians, giving doctors GPT-4 alongside their usual resources did not significantly improve their diagnostic reasoning, even though the model alone scored higher than both physician groups ([Goh et al., *JAMA Network Open*, 2024](https://doi.org/10.1001/jamanetworkopen.2024.40969)). In June 2025 Microsoft reported that its MAI-DxO orchestrator solved up to 85% of 304 complex *New England Journal of Medicine* case challenges, compared with an average of 20% for 21 physicians who worked without colleagues or reference books ([Microsoft AI](https://microsoft.ai/news/the-path-to-medical-superintelligence/), company research, not peer reviewed at publication).

**Limits and risks:** benchmark cases are not real patients, and the doctors in Microsoft's test were not allowed their usual resources. The Goh trial shows that giving clinicians a strong model does not automatically help; how they use it matters.

### 4. AI-supported cancer screening

**What AI does:** scores screening mammograms for risk, flags suspicious areas, and decides how many radiologists read each exam.

**The evidence:** in Sweden's MASAI randomized trial with more than 105,000 women, AI-supported screening detected 29% more cancers than standard double reading, without more false positives, and cut screen-reading workload by 44% ([Hernström et al., *The Lancet Digital Health*, 2025](https://doi.org/10.1016/S2589-7500(24)00267-X)). England's NHS launched the EDITH trial in 2025 to test AI across around 700,000 screenings ([GOV.UK](https://www.gov.uk/government/news/world-leading-ai-trial-to-tackle-breast-cancer-launched)).

**Limits and risks:** the most important outcome is the rate of cancers that appear between screenings, which takes years to measure. More detection can include more slow-growing cancers that would never have caused harm.

### 5. Matching patients to clinical trials

**What AI does:** reads a patient's record and a trial's eligibility criteria to flag likely matches for a clinician to confirm.

**The evidence:** TrialGPT, developed at the U.S. National Institutes of Health, matched criteria with 87.3% accuracy, close to experts, and in a small pilot cut clinicians' screening time by 42.6% ([Jin et al., *Nature Communications*, 2024](https://doi.org/10.1038/s41467-024-53081-z); [NIH](https://www.nih.gov/news-events/news-releases/nih-developed-ai-algorithm-matches-potential-volunteers-clinical-trials)).

**Limits and risks:** the evaluation used synthetic patient summaries, and the pilot involved only two clinicians. Real records are messier, and missed matches are invisible.

### 6. AI-discovered drugs in clinical trials

**What AI does:** proposes a disease target and designs a molecule to hit it, shortening early discovery.

**The evidence:** in a 71-patient, 12-week randomized phase 2a trial for idiopathic pulmonary fibrosis, Insilico Medicine's AI-discovered drug rentosertib met its safety goal, and in an exploratory analysis the 60 mg group's lung function rose by 98.4 mL while the placebo group's fell by 20.3 mL ([Xu et al., *Nature Medicine*, 2025](https://doi.org/10.1038/s41591-025-03743-2)).

**Limits and risks:** small, short trials often fail to replicate. AI may speed up early discovery, but most of the time and cost of drug development is in clinical trials, which AI has not yet shortened much.

### 7. Protein and molecule structure prediction

**What AI does:** predicts the 3D structure of proteins and how they bind to DNA, RNA and drug-like molecules, which guides lab work.

**The evidence:** AlphaFold 3, published in May 2024, extended structure prediction from single proteins to complexes with other biomolecules ([Abramson et al., *Nature*, 2024](https://doi.org/10.1038/s41586-024-07487-w)). The earlier AlphaFold work earned part of the 2024 Nobel Prize in Chemistry ([Nobel Prize](https://www.nobelprize.org/prizes/chemistry/2024/press-release/)).

**Limits and risks:** predicted structures are hypotheses. Confidence scores vary, and flexible or disordered regions remain hard to predict.

### 8. Mental health chatbots

**What AI does:** delivers structured conversations based on therapy techniques such as cognitive behavioral therapy.

**The evidence:** in the first randomized trial of a generative AI therapy chatbot, Dartmouth's Therabot, 210 adults with depression, anxiety or eating-disorder risk saw symptom reductions of 51%, 31% and 19% respectively over eight weeks compared with a waitlist ([Heinz et al., *NEJM AI*, 2025](https://doi.org/10.1056/AIoa2400802); [MIT Technology Review](https://www.technologyreview.com/2025/03/28/1114001/the-first-trial-of-generative-ai-therapy-shows-it-might-help-with-depression/)). Meanwhile Illinois in August 2025 banned AI from providing therapy or making therapeutic decisions without a licensed clinician ([Healthcare Finance News](https://www.healthcarefinancenews.com/news/illinois-bans-therapeutic-use-ai-without-clinician-input)).

**Limits and risks:** Therabot was built and supervised by clinicians; general-purpose chatbots are not. Crisis handling, dependence and privacy are the major concerns.

### 9. AI in prior authorization

**What AI does:** reviews requests for approval of a test or treatment against coverage rules, which insurers and now governments use to decide what they will pay for.

**The evidence:** Medicare's WISeR model, which started in January 2026 in six U.S. states, uses technology companies with AI tools to review prior authorization for a list of services considered prone to overuse, with licensed clinicians making any denial ([CMS](https://www.cms.gov/priorities/innovation/innovation-models/wiser)).

**Limits and risks:** participants are paid from savings, which critics say rewards denials. Physicians' groups and some members of Congress have opposed the model, and the evidence that AI review reduces waste without blocking needed care is not yet in.

### 10. Patients using chatbots for health information

**What AI does:** answers patients' health questions in plain language, before or after a visit.

**The evidence:** a 2024 KFF poll found 17% of U.S. adults used AI chatbots at least monthly for health information, but 56% of AI users were not confident the information was accurate ([KFF](https://www.kff.org/health-information-trust/poll-finding/kff-health-misinformation-tracking-poll-artificial-intelligence-and-health-information/)).

**Limits and risks:** chatbots can be wrong in convincing ways and may not know a patient's history. They are a starting point for a conversation with a clinician, not a substitute.

## Finance

Finance adopted machine learning early for fraud and credit. The new wave is generative AI for employees, assistants for customers, and agents that can initiate payments. Regulators are now actively testing and policing it.

### 11. Advisor meeting notes and follow-ups

**What AI does:** records client meetings with consent, then drafts notes, CRM entries and follow-up emails for the advisor to review.

**The evidence:** Morgan Stanley's AI @ Morgan Stanley Debrief, rolled out to its financial advisors in 2024, saves around 30 minutes per one-hour client meeting by the firm's account, and advisors review and edit outputs before sending ([OpenAI case study](https://openai.com/index/morgan-stanley/), company figures).

**Limits and risks:** recorded advice creates a record regulators can examine; errors in a summary become compliance risks if they are not caught.

### 12. Firmwide generative AI assistants for employees

**What AI does:** gives bankers and staff a secure chatbot over approved models and internal documents for drafting, summarizing and analysis.

**The evidence:** Goldman Sachs rolled out its GS AI Assistant firmwide in June 2025 after a pilot with about 10,000 employees ([Fox Business](https://www.foxbusiness.com/technology/goldman-sachs-announces-firmwide-launch-ai-assistant)). JPMorgan Chase's LLM Suite reached more than 200,000 employees ([NBC News](https://www.nbcnews.com/business/business-news/jpmorgan-chase-giving-employees-ai-assistant-powered-chatgpt-maker-ope-rcna166045)). Morgan Stanley says 98% of its advisor teams use its AI knowledge assistant ([OpenAI case study](https://openai.com/index/morgan-stanley/)).

**Limits and risks:** banks have not published controlled measures of productivity from these tools. Their effect on junior analyst hiring is an open question.

### 13. Customer-facing banking assistants

**What AI does:** answers balance, payment and card questions and completes routine tasks inside a banking app.

**The evidence:** Bank of America says Erica handled nearly 700 million interactions from 20.6 million users in 2025 ([Bank of America](https://newsroom.bankofamerica.com/content/newsroom/press-releases/2026/03/bofa-ai-and-digital-innovations-fuel-30-billion-client-interacti.html), company figures).

**Limits and risks:** the U.S. Consumer Financial Protection Bureau has warned that poorly designed bank chatbots can trap customers in loops, give wrong answers and fail to recognize disputes that the law requires banks to handle ([CFPB](https://www.consumerfinance.gov/data-research/research-reports/chatbots-in-consumer-finance/)).

### 14. Payment fraud detection with foundation models

**What AI does:** learns patterns from huge numbers of transactions to spot attacks such as card testing, where fraudsters make small charges to check stolen cards.

**The evidence:** Stripe said in May 2025 that its payments foundation model, trained on tens of billions of transactions, raised detection of card-testing attacks on its largest users from 59% to 97% ([TechCrunch](https://techcrunch.com/2025/05/07/stripe-unveils-ai-foundation-model-for-payments-reveals-deeper-partnership-with-nvidia/), company figures).

**Limits and risks:** fraud shifts when one door closes. The cost that matters includes legitimate customers declined by mistake.

### 15. Anti-money-laundering monitoring

**What AI does:** scores accounts and transactions for money-laundering risk so investigators focus on the most suspicious cases.

**The evidence:** HSBC, using Google Cloud's AML AI, reported finding two to four times more suspicious activity than its previous rule-based system while cutting alert volumes by more than 60% ([Google Cloud](https://cloud.google.com/blog/topics/financial-services/how-hsbc-fights-money-launderers-with-artificial-intelligence), company figures).

**Limits and risks:** banks must be able to explain to regulators why accounts were flagged or not. Fewer alerts are only good if real cases are not among the ones dropped.

### 16. Insurance claims triage and settlement

**What AI does:** routes claims to the right handler, estimates liability, and settles simple claims automatically.

**The evidence:** Aviva says it deployed more than 80 AI models across motor claims, which cut the time to assess liability in complex cases by 23 days and saved more than £60 million in 2024 ([McKinsey case study](https://www.mckinsey.com/capabilities/tech-and-ai/how-we-help-clients/rewired-in-action/aviva-rewiring-the-insurance-claims-journey-with-ai), company figures). Allianz Australia uses a seven-agent system to settle small food-spoilage claims after storms, with a human approving payment ([Allianz](https://www.allianz.com/en/mediacenter/news/articles/251103-when-the-storm-clears-so-should-the-claim-queue.html)).

**Limits and risks:** automated denials or low offers can be hard for customers to challenge. Claims models trained on past settlements can carry past unfairness forward.

### 17. Agentic payments

**What AI does:** lets an AI agent pay for something on a customer's behalf, within limits the customer sets.

**The evidence:** Mastercard launched Agent Pay and Visa launched Visa Intelligent Commerce in April 2025, both built on tokenized card credentials issued specifically to AI agents ([Digital Commerce 360](https://www.digitalcommerce360.com/2025/05/06/visa-mastercard-ai-agentic-commerce/)).

**Limits and risks:** consumer uptake is still small, and liability for an agent's mistaken purchase is unsettled. OpenAI's retreat from in-chat checkout in March 2026 shows how hard the shopping side is ([Forrester](https://www.forrester.com/blogs/what-it-means-that-the-leader-in-agentic-commerce-just-pulled-back/)).

### 18. Regulators testing AI with firms

**What AI does:** regulators run supervised test programs so firms can trial AI in live markets with oversight.

**The evidence:** the UK Financial Conduct Authority's AI Live Testing program started with a first cohort including NatWest, Monzo and Santander in late 2025 and named a second cohort in April 2026, with use cases including investment support, credit insights, agentic payments and anti-money-laundering detection ([FinTech Futures](https://www.fintechfutures.com/ai-in-fintech/fca-unveils-eight-new-participants-for-next-phase-of-ai-live-testing-initiative)).

**Limits and risks:** test programs are small and selective by design; they show what is possible with close supervision, not what is safe at scale.

### 19. Enforcement against "AI washing"

**What AI does:** nothing, which is the point: firms claimed AI capabilities they did not have.

**The evidence:** in March 2024, the U.S. Securities and Exchange Commission settled charges against two investment advisers, Delphia and Global Predictions, for false and misleading statements about their use of AI, with combined penalties of \$400,000 ([SEC](https://www.sec.gov/newsroom/press-releases/2024-36)).

**Limits and risks:** for investors and customers, a claim that a product "uses AI" says nothing about whether it works. Ask what the model does and how it was tested.

### 20. Consumer chatbots in financial services

**What AI does:** handles customer conversations in place of human agents in banks, lenders and payment apps.

**The evidence:** the CFPB's 2023 review found that chatbots were in use at all of the top 10 U.S. commercial banks and documented complaints about wrong information, failure to escalate and difficulty reaching a human ([CFPB](https://www.consumerfinance.gov/data-research/research-reports/chatbots-in-consumer-finance/)). Klarna, which said in 2024 that AI handled two-thirds of its chats, began hiring human agents again in 2025 after quality concerns ([Tech.co](https://tech.co/news/klarna-reverses-ai-overhaul)).

**Limits and risks:** legal obligations, such as handling disputed charges, still apply when a chatbot is the first point of contact.

## Education

The education evidence is unusually clear on one point: the same technology can help or harm learning depending on whether it does the thinking for students.

<figure>
<img src="/images/articles/ai-applications-healthcare-finance-education/guardrails-practice-vs-exam.svg" alt="Grouped bar chart from Bastani and colleagues' 2025 PNAS field experiment with Turkish high school math students. During practice sessions with AI access, students using standard GPT-4 (GPT Base) scored 48 percent higher than the control group, and students using a tutor version with guardrails (GPT Tutor) scored 127 percent higher. On the later exam without AI, GPT Base students scored 17 percent lower than control, while GPT Tutor students scored about the same as control, with no statistically significant difference." width="720" height="330" loading="lazy" decoding="async" />
<figcaption>Entry 23: unrestricted GPT-4 boosted practice scores and then hurt exam scores; a tutor designed to give hints instead of answers removed the harm. Source: Bastani et al., PNAS, 2025.</figcaption>
</figure>

### 21. AI tutors designed around how people learn

**What AI does:** guides students through problems step by step, asking questions instead of giving answers.

**The evidence:** in a randomized trial with 194 Harvard physics students, a custom AI tutor built on research-based teaching principles produced larger learning gains than an active-learning class, in less time ([Kestin et al., *Scientific Reports*, 2025](https://doi.org/10.1038/s41598-025-97652-6)).

**Limits and risks:** the study covered two topics at one university, with a tutor built by the course's own instructors. A general chatbot is not the same intervention.

### 22. AI tutoring in low-resource schools

**What AI does:** supports after-school learning where qualified teachers and tutors are scarce.

**The evidence:** a World Bank evaluation in Edo State, Nigeria, gave secondary students six weeks of teacher-guided sessions with Microsoft Copilot (GPT-4) for English. Students improved by 0.31 standard deviations on an assessment of English, AI knowledge and digital skills, which the authors equate to 1.5 to 2 years of typical schooling ([De Simone et al., World Bank, 2025](https://openknowledge.worldbank.org/entities/publication/15e1ff08-15ae-4f7a-b2a8-d146e6c113ee/full)).

**Limits and risks:** teachers were present and guided the sessions, which likely mattered. The program was short, and long-term effects are unknown.

### 23. Guardrails that prevent AI from becoming a crutch

**What AI does:** limits a chatbot to hints and explanations instead of full solutions.

**The evidence:** in a field experiment with about 1,000 Turkish high school students, access to standard GPT-4 raised practice performance by 48% but lowered later exam scores by 17% compared with students who never had access. A version designed to give hints raised practice scores by 127% and removed the exam harm, though it did not produce a measurable exam gain ([Bastani et al., *PNAS*, 2025](https://doi.org/10.1073/pnas.2422633122)).

**Limits and risks:** the design choice, not the model, determined the outcome. Schools that hand out general chatbots without guidance risk the GPT Base result.

### 24. Real-time coaching for human tutors

**What AI does:** suggests teaching moves to a human tutor during a live session, such as asking the student to explain their reasoning.

**The evidence:** in a randomized trial of Stanford's Tutor CoPilot with about 900 tutors and 1,800 elementary students, students were 4 percentage points more likely to master topics, and 9 points more likely when their tutor was lower-rated, at a cost of around \$20 per tutor per year ([Stanford NSSA](https://nssa.stanford.edu/studies/tutor-copilot-human-ai-approach-scaling-real-time-expertise)).

**Limits and risks:** the effect depends on tutors using the suggestions well; the strongest tutors gained least.

### 25. Saving teachers time on planning and paperwork

**What AI does:** drafts lesson plans, quizzes, rubrics, feedback and parent communications.

**The evidence:** a Gallup and Walton Family Foundation survey of more than 2,000 U.S. teachers in April 2025 found that those using AI at least weekly reported saving 5.9 hours a week, but only 32% used it weekly and 40% not at all ([Walton Family Foundation](https://www.waltonfamilyfoundation.org/learning/six-weeks-a-year-how-ai-gives-teachers-time-back)).

**Limits and risks:** time savings are self-reported. Generated materials still need checking for accuracy and fit with the curriculum.

### 26. National AI programs for schools

**What AI does:** gives every student and teacher in a system access to AI tools, with training.

**The evidence:** Estonia's AI Leap (TI-Hüpe) program began in September 2025, starting with about 20,000 upper-secondary students and 3,000 teachers, with teacher training first and tools from AI companies including OpenAI ([Estonian Ministry of Education and Research](https://www.hm.ee/en/news/estonia-announces-groundbreaking-national-initiative-ai-leap-programme-bring-ai-tools-all)).

**Limits and risks:** national rollouts need independent evaluation; the program's design emphasizes teacher training precisely because access alone does not produce learning.

### 27. University-wide AI access

**What AI does:** provides students and staff with a managed version of a chatbot that does not train on their data.

**The evidence:** the California State University system announced ChatGPT Edu for more than 460,000 students and over 63,000 faculty and staff in February 2025, described by OpenAI as its largest deployment at a single organization ([Axios](https://www.axios.com/2025/02/04/california-state-university-chatgpt-openai)). The [2026 AI Index](https://hai.stanford.edu/ai-index/2026-ai-index-report) reports that over 80% of U.S. high school and college students use AI for school tasks.

**Limits and risks:** access is easy; deciding what students should and should not hand to AI in each course is the hard part. The AI Index found only 6% of teachers say their school's AI policies are clear.

### 28. Study modes that withhold answers

**What AI does:** switches a general chatbot into a tutoring style that asks questions and checks understanding.

**The evidence:** Anthropic introduced a learning mode for Claude in April 2025, OpenAI launched study mode in ChatGPT in July 2025, and Google added Guided Learning to Gemini in August 2025 ([Maginative](https://www.maginative.com/article/openai-launches-study-mode-for-chatgpt/)).

**Limits and risks:** students can switch the mode off. These features apply the lesson of entry 23, but they have not yet been tested in published randomized trials.

### 29. AI-generated language courses

**What AI does:** generates course content for many language pairs from a shared base course.

**The evidence:** Duolingo launched 148 new language courses built with generative AI in April 2025, more than doubling its catalog; the company said its first 100 courses took about 12 years to build ([TechCrunch](https://techcrunch.com/2025/04/30/duolingo-launches-148-courses-created-with-ai-after-sharing-plans-to-replace-contractors-with-ai/)). The launch followed a memo saying the company would gradually stop using contractors for work AI can handle.

**Limits and risks:** quality review across many languages is hard, and the shift raised concerns about replacing human content creators.

### 30. AI detection and academic integrity

**What AI does:** detection tools try to tell whether a student's writing was produced by AI.

**The evidence:** a Stanford study found that seven GPT detectors misclassified over half of essays written by non-native English speakers for the TOEFL exam as AI-generated, while correctly classifying essays by U.S. eighth graders ([Liang et al., *Patterns*, 2023](https://doi.org/10.1016/j.patter.2023.100779)).

**Limits and risks:** detector scores are not proof. Many schools have shifted to redesigning assessments, such as in-class writing, oral explanations and drafts, instead of relying on detection.

## What the evidence says across all three fields

- **Administrative AI is ahead of decision-making AI.** Notes, messages, document drafting and claim triage are spreading fastest because a professional reviews every output.
- **Controlled trials find smaller effects than announcements.** The UCLA scribe trial, the Stanford message study and the Goh diagnosis trial all found modest or no time savings.
- **Design matters more than the model.** In education (entries 21 to 23) and diagnosis (entry 3), the same underlying model helped or did not depending on how people used it.
- **Regulation is active.** Medical devices need clearance, Illinois restricts AI therapy, the SEC polices AI claims, and the FCA tests AI with firms.
- **Watch who carries the risk.** Patients with incorrect notes, customers stuck with a chatbot and students who learn less all bear costs that the organization's metrics may not capture.

## Questions to ask before adopting AI in these fields

1. **Is there a randomized or controlled evaluation,** or only before-and-after numbers?
2. **What does a human review,** and how much time does the review take?
3. **What happens when the AI is wrong?** Who notices, and how is it corrected?
4. **Does it work for the people you serve?** Results from one hospital, bank or university may not transfer.
5. **What data does it use, and who can see it?** Health records, financial data and student work carry legal protections.
6. **What does it replace?** If it replaces thinking that people need to practice, such as student problem-solving, it may cause harm.

## Where to go next

- Compare these with other sectors in [25 examples of how AI is transforming industries in 2026](/articles/ai-transforming-industries-examples).
- See what these changes mean for jobs in [75 examples of how AI is changing the future of work](/articles/ai-future-of-work-examples).
- For the established machine learning behind fraud, credit and imaging, read [100 machine learning applications across industries](/articles/machine-learning-applications).
- Learn the statistics behind trial results in [probability and statistics concepts for data science](/articles/probability-and-statistics-concepts-for-data-science).

## References

Sources are linked in each entry. Key studies:

1. Garcia, P., et al. (2024). "Artificial Intelligence-Generated Draft Replies to Patient Inbox Messages." *JAMA Network Open*, 7(3). [doi.org/10.1001/jamanetworkopen.2024.3201](https://doi.org/10.1001/jamanetworkopen.2024.3201)
2. Goh, E., et al. (2024). "Large Language Model Influence on Diagnostic Reasoning: A Randomized Clinical Trial." *JAMA Network Open*, 7(10). [doi.org/10.1001/jamanetworkopen.2024.40969](https://doi.org/10.1001/jamanetworkopen.2024.40969)
3. Hernström, V., et al. (2025). "Screening performance and characteristics of breast cancer detected in the Mammography Screening with Artificial Intelligence trial (MASAI)." *The Lancet Digital Health*. [doi.org/10.1016/S2589-7500(24)00267-X](https://doi.org/10.1016/S2589-7500(24)00267-X)
4. Jin, Q., et al. (2024). "Matching patients to clinical trials with large language models." *Nature Communications*, 15. [doi.org/10.1038/s41467-024-53081-z](https://doi.org/10.1038/s41467-024-53081-z)
5. Xu, Z., et al. (2025). "A generative AI-discovered TNIK inhibitor for idiopathic pulmonary fibrosis: a randomized phase 2a trial." *Nature Medicine*. [doi.org/10.1038/s41591-025-03743-2](https://doi.org/10.1038/s41591-025-03743-2)
6. Abramson, J., et al. (2024). "Accurate structure prediction of biomolecular interactions with AlphaFold 3." *Nature*, 630. [doi.org/10.1038/s41586-024-07487-w](https://doi.org/10.1038/s41586-024-07487-w)
7. Heinz, M. V., et al. (2025). "Randomized Trial of a Generative AI Chatbot for Mental Health Treatment." *NEJM AI*, 2(4). [doi.org/10.1056/AIoa2400802](https://doi.org/10.1056/AIoa2400802)
8. Kestin, G., Miller, K., et al. (2025). "AI tutoring outperforms in-class active learning." *Scientific Reports*, 15. [doi.org/10.1038/s41598-025-97652-6](https://doi.org/10.1038/s41598-025-97652-6)
9. De Simone, M. E., et al. (2025). *From Chalkboards to Chatbots: Evaluating the Impact of Generative AI on Learning Outcomes in Nigeria*. World Bank Policy Research Working Paper 11125. [openknowledge.worldbank.org](https://openknowledge.worldbank.org/entities/publication/15e1ff08-15ae-4f7a-b2a8-d146e6c113ee/full)
10. Bastani, H., et al. (2025). "Generative AI without guardrails can harm learning: Evidence from high school mathematics." *PNAS*, 122(26). [doi.org/10.1073/pnas.2422633122](https://doi.org/10.1073/pnas.2422633122)
11. Wang, R. E., et al. (2024). "Tutor CoPilot: A Human-AI Approach for Scaling Real-Time Expertise." [nssa.stanford.edu](https://nssa.stanford.edu/studies/tutor-copilot-human-ai-approach-scaling-real-time-expertise)
12. Liang, W., et al. (2023). "GPT detectors are biased against non-native English writers." *Patterns*, 4(7). [doi.org/10.1016/j.patter.2023.100779](https://doi.org/10.1016/j.patter.2023.100779)
13. Consumer Financial Protection Bureau (2023). *Chatbots in consumer finance*. [consumerfinance.gov](https://www.consumerfinance.gov/data-research/research-reports/chatbots-in-consumer-finance/)
