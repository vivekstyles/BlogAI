---
title: "100 Best Machine Learning Applications Across Industries: A Complete Guide"
seoTitle: 100 Machine Learning Applications Across Industries
description: 100 real machine learning applications in healthcare, finance, retail, transport, energy, farming and science, with the methods behind them and their limits.
author: BlogAI Editors
authorType: Organization
publishedAt: 2026-10-19
updatedAt: 2026-10-19
status: published
categories:
  - Artificial Intelligence
  - Engineering
  - Science
tags: [machine learning, ai, applications, industry, case studies, data science]
tocDepth: 2
---

Machine learning is now part of how hospitals read scans, banks stop fraud, retailers stock shelves, utilities balance the grid and scientists predict protein structures. It is also part of some well-documented failures. This guide describes 100 applications across 13 industries. For each one you get:

- **What machine learning does:** the prediction or decision it supports.
- **How it works:** the main techniques, with links to [100 machine learning algorithms explained](/articles/machine-learning-algorithms-explained) where useful.
- **In practice:** a named, sourced example where one is publicly documented.
- **Limits and risks:** what can go wrong, and what the evidence does not show.

**How to read the results.** Many figures below come from the organizations that built the systems: company blogs, press releases or papers by their own researchers. We label them as such. A company reporting "up to 40%" is describing its best case, not an independently audited average. Where independent evaluations exist, especially ones that found weaker results, we include them. Sources were checked in October 2026.

<figure>
<img src="/images/articles/machine-learning-applications/applications-by-industry.svg" alt="Grid of the 13 industries covered and their entry numbers: healthcare and life sciences 1 to 14, finance and insurance 15 to 23, retail and e-commerce 24 to 33, media and entertainment 34 to 41, transportation and logistics 42 to 51, manufacturing and industry 52 to 59, energy and utilities 60 to 66, agriculture and food 67 to 72, climate and environment 73 to 79, science and research 80 to 85, public sector, legal and security 86 to 92, education and work 93 to 96, and technology and communication 97 to 100. Each box lists the most common machine learning tasks in that industry." width="720" height="430" loading="lazy" decoding="async" />
<figcaption>The 13 industries in this guide, with the machine learning tasks that appear most often in each.</figcaption>
</figure>

## What successful applications have in common

Across industries, the applications that work share a pattern, and the failures usually break one part of it:

1. **A narrow, well-defined prediction.** "Does this retinal image show referable diabetic retinopathy?" is a good machine learning problem. "Is this person a good employee?" is not.
2. **Plenty of relevant, labeled data** that looks like the data the model will see in use.
3. **A decision that the prediction actually improves,** with a clear cost for each kind of error.
4. **A human or system that acts on the output,** and a feedback loop to learn from outcomes.
5. **Monitoring after launch,** because the world changes and models degrade.

<figure>
<img src="/images/articles/machine-learning-applications/ml-in-production-loop.svg" alt="A loop showing machine learning in production. Data flows into a model, which produces a prediction. A decision policy, such as a threshold or a human reviewer, turns the prediction into an action. The action leads to an outcome, which is logged as new data. Monitoring watches the data, predictions and outcomes for drift and errors and triggers retraining." width="720" height="300" loading="lazy" decoding="async" />
<figcaption>A model is one box in a larger system. Most of the value, and most of the risk, comes from how predictions turn into actions and how outcomes feed back.</figcaption>
</figure>

## Healthcare and life sciences

Health care has some of the most rigorous evidence for machine learning and some of the clearest cautionary tales. In the United States, the Food and Drug Administration maintains a public [list of AI-enabled medical devices](https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-enabled-medical-devices) it has authorized; analyses of the list counted about 1,450 devices through the end of 2025, roughly three-quarters of them in radiology. The FDA notes the list is not exhaustive. Nothing in this section is medical advice.

### 1. Diabetic retinopathy screening

**What machine learning does:** detects diabetic eye disease in retinal photographs, so screening can happen in a primary-care office instead of requiring an eye specialist.

**How it works:** convolutional neural networks trained on graded retinal images.

**In practice:** in April 2018 the FDA authorized IDx-DR (now LumineticsCore), the first autonomous AI diagnostic system, which gives a screening result without a clinician interpreting the image. Its pivotal trial enrolled 900 people with diabetes at 10 primary-care sites ([Abràmoff et al., 2018](https://doi.org/10.1038/s41746-018-0040-6)).

**Limits and risks:** image quality and camera type affect performance, and a screening result still needs a pathway to specialist care.

### 2. Breast cancer screening support

**What machine learning does:** scores mammograms for cancer risk, to flag suspicious areas and to decide which exams need two radiologists.

**How it works:** deep learning models trained on large sets of screening mammograms with confirmed outcomes.

**In practice:** the MASAI randomized trial in Sweden's national screening program compared AI-supported screening with standard double reading. The 2025 results in *The Lancet Digital Health* reported 29% more cancers detected without more false positives, and a 44% lower screen-reading workload ([Hernström et al., 2025](https://doi.org/10.1016/S2589-7500(24)00267-X)).

<figure>
<img src="/images/articles/machine-learning-applications/ai-triage-workflow.svg" alt="Flow diagram of AI-supported mammography screening as tested in the MASAI trial. Each screening exam receives an AI risk score from 1 to 10. Exams scored 1 to 9 are read by one radiologist; exams scored 10, the highest risk, are read by two radiologists. AI marks on suspicious areas are shown to the readers. Readers decide on recall, and the combined decision follows normal clinical practice." width="720" height="300" loading="lazy" decoding="async" />
<figcaption>Entry 2: in the MASAI design, AI does not make the diagnosis. It decides how much human attention each exam gets, and radiologists make every recall decision.</figcaption>
</figure>

**Limits and risks:** the key safety measure is the rate of cancers that appear between screenings; follow-up results published in 2026 reported that this interval-cancer rate was not worse with AI support. Results from one country's program and one product may not transfer to other settings.

### 3. Radiology triage and detection

**What machine learning does:** flags urgent findings such as intracranial hemorrhage or pulmonary embolism so those scans are read first, and highlights possible fractures or nodules.

**How it works:** CNNs and vision transformers for classification and detection on CT, X-ray and MRI.

**In practice:** radiology accounts for most devices on the FDA's AI-enabled device list, and many are triage or detection aids that run alongside the radiologist rather than replacing one.

**Limits and risks:** benefits depend on the workflow; a flag that arrives after the scan has been read changes nothing. Performance can drop on scanners and populations not represented in training data.

### 4. Sepsis early warning

**What machine learning does:** predicts which hospitalized patients are developing sepsis, a life-threatening response to infection, so treatment can start earlier.

**How it works:** models on vital signs, lab results and other electronic health record data, updated as new measurements arrive.

**In practice:** this application is best known for an external check. A University of Michigan study of a widely deployed proprietary sepsis model found an area under the ROC curve of 0.63, much lower than reported by the developer, and that the model missed about two-thirds of sepsis cases while alerting on 18% of all hospitalized patients ([Wong et al., 2021](https://doi.org/10.1001/jamainternmed.2021.2626)). The vendor disputed the configuration used.

**Limits and risks:** labels such as "sepsis onset" are hard to define; alert fatigue is real; models must be validated locally before use.

### 5. Digital pathology

**What machine learning does:** finds regions of biopsy slides most likely to contain cancer, so pathologists review them first.

**How it works:** CNNs trained on very large, scanned whole-slide images, often with weak, slide-level labels.

**In practice:** in September 2021 the FDA granted de novo authorization to Paige Prostate, which the company described as the first AI product authorized for digital pathology. In the study submitted to the FDA, 16 pathologists reviewing 527 slide images detected more cancers with the tool than without it.

**Limits and risks:** scanners, staining and slide preparation vary between labs; the study measured detection on slide images, not final patient outcomes.

### 6. Skin lesion assessment

**What machine learning does:** classifies photographs of skin lesions by the likelihood of melanoma or other cancers.

**How it works:** CNNs fine-tuned on dermoscopic and clinical images.

**In practice:** a 2017 study trained a CNN on about 129,000 clinical images and reported performance comparable to 21 board-certified dermatologists on two classification tasks ([Esteva et al., 2017](https://doi.org/10.1038/nature21056)).

**Limits and risks:** training images overwhelmingly show lighter skin, and models perform worse on darker skin tones ([Groh et al., 2021](https://arxiv.org/abs/2104.09957)); lab benchmarks do not show benefit in real clinical use.

### 7. ECG analysis

**What machine learning does:** detects heart conditions from electrocardiograms, including some that cardiologists cannot see by eye.

**How it works:** deep networks on raw ECG waveforms.

**In practice:** Mayo Clinic researchers trained a network to detect weak heart pumping (low ejection fraction) from a standard 12-lead ECG and reported an AUC of 0.93 on a held-out test set ([Attia et al., 2019](https://doi.org/10.1038/s41591-018-0240-2)); consumer smartwatches have FDA-cleared algorithms that flag possible atrial fibrillation.

**Limits and risks:** screening healthy populations produces many false positives; a flag needs confirmation by conventional tests.

### 8. Protein structure prediction

**What machine learning does:** predicts a protein's 3-D shape from its amino-acid sequence.

**How it works:** AlphaFold 2 uses attention-based neural networks trained on structures from the Protein Data Bank and on evolutionary information from related sequences ([Jumper et al., 2021](https://doi.org/10.1038/s41586-021-03819-2)).

**In practice:** the AlphaFold Protein Structure Database, run with EMBL's European Bioinformatics Institute, offers predictions for over 200 million proteins. Demis Hassabis and John Jumper shared half of the 2024 Nobel Prize in Chemistry for protein structure prediction ([Nobel Prize](https://www.nobelprize.org/prizes/chemistry/2024/summary/)).

**Limits and risks:** predicted structures come with per-residue confidence scores; low-confidence regions, protein dynamics and some complexes remain hard.

### 9. Drug discovery

**What machine learning does:** screens huge chemical libraries for promising molecules, proposes new ones and predicts properties such as toxicity.

**How it works:** graph neural networks on molecular structures, generative models and property-prediction models.

**In practice:** MIT researchers used a deep learning model to identify halicin, a molecule with antibacterial activity against several drug-resistant bacteria in lab and mouse studies ([Stokes et al., 2020](https://doi.org/10.1016/j.cell.2020.01.021)). Insilico Medicine's rentosertib, whose target and molecule were identified with generative AI, reported phase 2a results in 71 patients with idiopathic pulmonary fibrosis in *Nature Medicine* in 2025.

**Limits and risks:** most candidates fail in later trials, as in all drug development; claims about speed often compare favorable cases.

### 10. Clinical documentation

**What machine learning does:** drafts clinical notes from a recorded doctor–patient conversation, so clinicians spend less time typing.

**How it works:** speech recognition followed by large language models that summarize the conversation into a structured note.

**In practice:** many health systems have piloted "ambient scribe" tools since 2023, and early studies report less time spent on documentation; the size of the effect varies between studies and sites.

**Limits and risks:** language models can introduce errors or omissions into the medical record, so clinicians must review every note; patient consent and privacy rules apply.

### 11. Hospital operations

**What machine learning does:** forecasts admissions, bed occupancy, emergency department arrivals and no-shows, so staff and beds can be planned.

**How it works:** time-series forecasting and gradient-boosted models on historical activity, calendars and local events.

**In practice:** demand forecasting is one of the most common operational uses of machine learning in hospitals, because errors are cheap to correct and outcomes are measured automatically.

**Limits and risks:** pandemics and policy changes break historical patterns; no-show models can steer worse service toward groups who already face barriers if used for overbooking.

### 12. Genomic variant calling

**What machine learning does:** identifies genetic variants from DNA sequencing reads.

**How it works:** Google's DeepVariant turns aligned reads into images and classifies candidate variants with a CNN ([Poplin et al., 2018](https://doi.org/10.1038/nbt.4235)).

**In practice:** DeepVariant is open source and widely used in research pipelines; it won awards in the U.S. FDA's precisionFDA Truth Challenge.

**Limits and risks:** accuracy depends on sequencing technology and coverage; difficult genome regions remain error-prone.

### 13. Radiotherapy planning

**What machine learning does:** outlines tumors and nearby organs on CT and MRI scans ("contouring"), a step that otherwise takes clinicians hours.

**How it works:** U-Net-style segmentation networks ([entry 77 in our algorithms guide](/articles/machine-learning-algorithms-explained)).

**In practice:** auto-contouring tools are commercially available and in clinical use; clinicians edit the proposed outlines rather than drawing them from scratch.

**Limits and risks:** small contouring errors can change radiation doses; every contour must be reviewed.

### 14. Epidemic forecasting

**What machine learning does:** forecasts influenza and other disease activity weeks ahead to help public-health planning.

**How it works:** ensembles that combine many statistical, mechanistic and machine learning forecasts.

**In practice:** the U.S. Centers for Disease Control and Prevention runs FluSight, which collects forecasts from many teams and publishes an ensemble ([FluSight forecast hub](https://github.com/cdcepi/FluSight-forecast-hub)); ensembles have typically been among the most reliable forecasts in these collaborations.

**Limits and risks:** forecasts are least reliable exactly when they matter most, at turning points and during new outbreaks.

## Finance and insurance

### 15. Card fraud detection

**What machine learning does:** scores each card transaction for fraud in milliseconds, so suspicious ones can be blocked or challenged.

**How it works:** gradient-boosted trees and neural networks on transaction features, device signals and the history of the card and merchant; aggregates and recency features matter most (see [feature engineering techniques](/articles/feature-engineering-techniques)).

**In practice:** payment processors run such models on every transaction; Stripe, for example, documents how its Radar system scores payments using signals from across its network ([Stripe Radar documentation](https://docs.stripe.com/radar)).

**Limits and risks:** fraud is rare, so the threshold sets the trade-off between missed fraud and blocked legitimate customers (see the chart below); fraudsters adapt, so models need frequent retraining.

<figure>
<img src="/images/articles/machine-learning-applications/fraud-threshold-tradeoff.svg" alt="Line chart for a gradient-boosting fraud model on 100,000 synthetic test transactions, about 0.55% of them fraudulent. As the alert threshold rises from 0.01 to 0.9, recall falls from about 0.75 to 0.48, precision rises from about 0.2 to 0.75, and alerts fall from about 200 to 35 per 10,000 transactions. At a threshold of 0.05 the model catches 68% of fraud with 37% of alerts being fraud and about 101 alerts per 10,000 transactions; at 0.5 it catches 55% with 66% precision and about 46 alerts." width="720" height="330" loading="lazy" decoding="async" />
<figcaption>Entries 15 and 17, on synthetic data: the model is the same along each curve; only the alert threshold changes. Where to set it is a business decision about review capacity and the cost of each kind of error.</figcaption>
</figure>

### 16. Credit scoring

**What machine learning does:** estimates the probability that a borrower will default, to approve, price or limit credit.

**How it works:** logistic-regression scorecards have long been the standard; gradient-boosted models are increasingly used, often with explanation methods.

**In practice:** in the United States, lenders must give specific reasons when they deny credit; the Consumer Financial Protection Bureau stated in 2022 that this requirement applies even when decisions come from complex algorithms ([CFPB Circular 2022-03](https://www.consumerfinance.gov/compliance/circulars/circular-2022-03-adverse-action-notification-requirements-in-connection-with-credit-decisions-based-on-complex-algorithms/)).

**Limits and risks:** historical lending data reflects past discrimination; features that proxy for protected attributes can produce unlawful disparities.

### 17. Anti-money laundering

**What machine learning does:** prioritizes suspicious patterns of transactions and accounts for investigators.

**How it works:** anomaly detection, graph analysis of money flows and supervised models trained on past investigation outcomes.

**In practice:** the Financial Action Task Force has described how machine learning can reduce the very high false-positive rates of rule-based monitoring systems ([FATF, 2021](https://www.fatf-gafi.org/en/publications/digitaltransformation/digital-transformation.html)).

**Limits and risks:** confirmed money-laundering labels are scarce; regulators expect decisions to be explainable and auditable.

### 18. Algorithmic trading and market making

**What machine learning does:** predicts very short-term price movements, optimizes how large orders are split and executed, and estimates trading costs.

**How it works:** time-series models, gradient boosting and reinforcement learning on market data.

**In practice:** quantitative trading firms use machine learning extensively, but most methods are proprietary and unpublished, so outside claims about returns cannot be verified.

**Limits and risks:** financial data is noisy and non-stationary, so overfitting to the past is the central risk; this guide does not offer investment advice.

### 19. Insurance pricing

**What machine learning does:** estimates how often a policyholder will claim and how much claims will cost.

**How it works:** Poisson and Gamma generalized linear models are the industry standard, increasingly complemented by gradient-boosted models (see entry 8 of the [algorithms guide](/articles/machine-learning-algorithms-explained)).

**In practice:** scikit-learn's documentation reproduces this workflow on a French motor-insurance dataset ([scikit-learn example](https://scikit-learn.org/stable/auto_examples/linear_model/plot_tweedie_regression_insurance_claims.html)).

**Limits and risks:** pricing rules are regulated and some characteristics cannot be used; more granular pricing can make insurance unaffordable for high-risk groups.

### 20. Insurance claims triage

**What machine learning does:** routes claims: fast-tracks simple ones, flags possible fraud and estimates repair costs from photos.

**How it works:** text classification of claim descriptions, image models for vehicle damage, and anomaly detection.

**In practice:** photo-based damage estimation is offered by several insurers and claims-software vendors, with human adjusters handling complex or disputed cases.

**Limits and risks:** automated denials raise fairness and consumer-protection concerns; customers should be able to reach a human.

### 21. Document processing and identity checks

**What machine learning does:** extracts fields from invoices, statements and identity documents, and checks that a selfie matches an ID photo.

**How it works:** OCR, layout-aware document models and face-matching networks.

**In practice:** banks and fintech companies use these tools for "know your customer" onboarding and back-office automation.

**Limits and risks:** face matching can perform unevenly across demographic groups; NIST's evaluations measure these differences across algorithms ([NIST FRTE](https://pages.nist.gov/frvt/html/frvt_demographics.html)).

### 22. Customer service assistants

**What machine learning does:** answers routine questions, routes requests and drafts replies for human agents.

**How it works:** intent classification, retrieval over help articles and large language models.

**In practice:** most large banks run virtual assistants in their apps; generative assistants are increasingly used to draft agent replies rather than answer customers unsupervised.

**Limits and risks:** wrong answers about fees or rights can harm customers; the CFPB has warned about poorly designed chatbots in banking ([CFPB, 2023](https://www.consumerfinance.gov/data-research/research-reports/chatbots-in-consumer-finance/)).

### 23. Credit risk early warning

**What machine learning does:** spots borrowers whose risk is rising, from changes in account behavior, so lenders can intervene early.

**How it works:** survival models and gradient boosting on time-varying features such as balances, payments and utilization.

**In practice:** a standard part of loan portfolio monitoring in banks.

**Limits and risks:** economic shocks shift every borrower at once, which historical models handle poorly.

## Retail and e-commerce

### 24. Product recommendations

**What machine learning does:** suggests products a customer is likely to want.

**How it works:** collaborative filtering, matrix factorization, embeddings and deep ranking models.

**In practice:** Amazon described its item-to-item collaborative filtering, behind "customers who bought this item also bought", in a 2003 paper ([Linden, Smith and York, 2003](https://doi.org/10.1109/MIC.2003.1167344)).

**Limits and risks:** recommendations can create feedback loops that keep promoting already-popular items; offline accuracy often fails to predict online impact, so A/B tests decide.

### 25. Product search ranking

**What machine learning does:** orders search results by how likely each product is to satisfy the query.

**How it works:** learning-to-rank models such as LambdaMART on query, product and behavior features, increasingly combined with dense retrieval.

**In practice:** Airbnb published a detailed account of moving its search ranking from gradient-boosted trees to neural networks ([Haldar et al., 2019](https://doi.org/10.1145/3292500.3330658)).

**Limits and risks:** ranking on clicks rewards clickbait; marketplaces must balance relevance with fairness to sellers.

### 26. Demand forecasting

**What machine learning does:** forecasts how many units of each product each store will sell, to plan orders and stock.

**How it works:** global gradient-boosting models across many products with lags, prices, promotions and calendars; deep forecasting models at large scale.

**In practice:** in the M5 competition on Walmart sales data, LightGBM-based methods dominated the top ranks, and the organizers concluded that machine learning methods outperformed statistical benchmarks there ([Makridakis, Spiliotis and Assimakopoulos, 2022](https://doi.org/10.1016/j.ijforecast.2021.11.013)).

**Limits and risks:** new products, stock-outs (which hide true demand) and sudden events like a pandemic break forecasts.

### 27. Dynamic pricing and markdowns

**What machine learning does:** estimates how demand responds to price, to set prices and clearance discounts.

**How it works:** demand models with price elasticity, causal inference and bandit-style experimentation.

**In practice:** airlines, hotels, ride-hailing and online retailers adjust prices with such models.

**Limits and risks:** pricing algorithms can raise competition concerns, and personalized pricing can erode customer trust and attract regulatory scrutiny.

### 28. Visual search

**What machine learning does:** lets shoppers search with a photo instead of words.

**How it works:** image embeddings and nearest-neighbor search over the catalog.

**In practice:** Pinterest described its visual search system, built on deep image embeddings, in a KDD paper ([Jing et al., 2015](https://arxiv.org/abs/1505.07647)).

**Limits and risks:** works best for visually distinctive products; lighting and backgrounds in user photos differ from catalog images.

### 29. Customer churn and lifetime value

**What machine learning does:** predicts which customers will leave and how much each is worth over time, to target retention offers.

**How it works:** classification and survival models on usage, billing and support data; uplift models to target customers whom an offer would actually change.

**In practice:** a standard application in subscription businesses, telecoms and banking.

**Limits and risks:** predicting churn is not the same as preventing it; offering discounts to customers who would have stayed anyway wastes money, which is why uplift modeling exists.

### 30. Supply chain and inventory optimization

**What machine learning does:** combines demand forecasts with lead times and costs to decide how much stock to hold where.

**How it works:** probabilistic forecasts (quantiles) feed optimization models.

**In practice:** large retailers and manufacturers forecast at the level of product, location and day.

**Limits and risks:** forecasting errors compound through the supply chain; optimizing for a narrow metric can remove the slack needed in a crisis.

### 31. Returns and promotion abuse detection

**What machine learning does:** flags fraudulent returns, fake accounts and coupon abuse.

**How it works:** anomaly detection and graph models linking accounts, devices and addresses.

**In practice:** used by large online retailers and marketplaces.

**Limits and risks:** false positives punish legitimate customers; decisions should be explainable and appealable.

### 32. Product categorization and catalog quality

**What machine learning does:** assigns products to categories, extracts attributes from descriptions and detects duplicate listings.

**How it works:** text and image classifiers, and multimodal models.

**In practice:** marketplaces with millions of third-party listings rely on automatic categorization.

**Limits and risks:** category errors hide products from search; sellers may game the classifier.

### 33. Review analysis and summarization

**What machine learning does:** summarizes what customers say about a product and detects fake reviews.

**How it works:** sentiment and aspect extraction, large language models for summaries, and anomaly detection for review fraud.

**In practice:** several large e-commerce sites now display AI-generated summaries of customer reviews.

**Limits and risks:** summaries can misstate or overweight minority opinions; the U.S. Federal Trade Commission's 2024 rule bans fake reviews, including AI-generated ones ([FTC](https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials)).

## Media and entertainment

### 34. Streaming recommendations

**What machine learning does:** chooses which titles to show each member and in what order.

**How it works:** many models for different rows of the home page, evaluated by A/B tests on retention and engagement.

**In practice:** Netflix executives described their recommender system and its business role in a 2015 paper, estimating that personalization and recommendations save the company more than \$1 billion a year in reduced churn ([Gomez-Uribe and Hunt, 2015](https://doi.org/10.1145/2843948)). That figure is the company's own estimate.

**Limits and risks:** optimizing for watch time can narrow what people see.

### 35. Personalized artwork

**What machine learning does:** picks which thumbnail image to show each member for a title.

**How it works:** contextual bandits that learn which artwork leads to plays for which kinds of members.

**In practice:** Netflix described the approach in a 2017 engineering blog post ([Netflix Technology Blog](https://netflixtechblog.com/artwork-personalization-c589f074ad76)).

**Limits and risks:** artwork that misrepresents a title may win clicks but disappoint viewers.

### 36. Video recommendations

**What machine learning does:** selects candidate videos from a huge catalog and ranks them for each user.

**How it works:** a two-stage system: deep candidate generation, then a deep ranking model.

**In practice:** YouTube published its two-stage deep neural network design in 2016 ([Covington, Adams and Sargin, 2016](https://doi.org/10.1145/2959100.2959190)).

**Limits and risks:** concerns about recommendations amplifying harmful content have led to policy changes and external research; evidence on how much algorithms drive radicalization is mixed.

### 37. Content moderation

**What machine learning does:** detects spam, nudity, violence, hate speech and other policy violations in posts, images and videos, often before anyone reports them.

**How it works:** text, image and video classifiers, hash matching for known illegal content, and large language models for policy reasoning.

**In practice:** major platforms publish transparency reports on how much violating content their systems detect proactively; human reviewers handle appeals and borderline cases.

**Limits and risks:** context, sarcasm and minority languages cause errors; over-removal and under-removal both cause harm.

### 38. Speech recognition and captioning

**What machine learning does:** transcribes speech into text for captions, meeting notes and voice interfaces.

**How it works:** transformer models trained on large amounts of transcribed audio.

**In practice:** OpenAI's Whisper was trained on 680,000 hours of multilingual audio from the web and released as open source ([Radford et al., 2022](https://arxiv.org/abs/2212.04356)).

**Limits and risks:** accuracy is lower for accents, languages and audio conditions underrepresented in training; speech models can also "hallucinate" words that were not said.

### 39. Machine translation

**What machine learning does:** translates text and speech between languages.

**How it works:** neural sequence-to-sequence models, now transformers and large language models.

**In practice:** Google switched Google Translate to neural machine translation in 2016, using deep LSTM networks ([Wu et al., 2016](https://arxiv.org/abs/1609.08144)), before transformers became standard.

**Limits and risks:** quality is much lower for languages with little training data; errors in medical, legal or asylum contexts can have serious consequences.

### 40. Image and video generation

**What machine learning does:** creates images, video, music and voices from text prompts.

**How it works:** diffusion models and transformers trained on very large datasets of captioned media ([Rombach et al., 2022](https://arxiv.org/abs/2112.10752)).

**In practice:** used for concept art, advertising, design drafts and visual effects.

**Limits and risks:** copyright disputes over training data, deepfakes and non-consensual imagery; provenance standards such as [C2PA](https://c2pa.org/) aim to label generated content.

### 41. Game AI and testing

**What machine learning does:** creates opponents that adapt, tests games automatically and balances matchmaking.

**How it works:** reinforcement learning, imitation learning and skill-rating models.

**In practice:** DeepMind's AlphaStar reached the top level (Grandmaster) in the game StarCraft II in online play against human players ([Vinyals et al., 2019](https://doi.org/10.1038/s41586-019-1724-z)).

**Limits and risks:** research systems need enormous compute; most commercial games still use hand-designed AI for predictability.

## Transportation and logistics

### 42. Driverless ride-hailing

**What machine learning does:** perceives the road, predicts what other road users will do and plans the vehicle's path.

**How it works:** deep networks on camera, lidar and radar data, combined with prediction and planning models and extensive simulation.

**In practice:** Waymo operates paid rides with no safety driver in several U.S. cities and publishes peer-reviewed comparisons of its crash rates with human benchmarks ([Waymo Safety Impact](https://waymo.com/safety/impact/)).

**Limits and risks:** safety evidence comes largely from the operator; rare situations ("edge cases"), weather and expansion to new cities remain challenges, and regulators investigate incidents.

### 43. Travel-time prediction

**What machine learning does:** predicts how long a trip will take.

**How it works:** graph neural networks over road segments ([entry 89 in the algorithms guide](/articles/machine-learning-algorithms-explained)), and transformers on trip features.

**In practice:** DeepMind and Google Maps reported that graph neural networks reduced ETA errors by up to 50% in some cities ([Derrow-Pinion et al., 2021](https://arxiv.org/abs/2108.11482)); Uber described its DeepETA transformer model in 2022 ([Uber Engineering](https://www.uber.com/blog/deepeta-how-uber-predicts-arrival-times/)).

**Limits and risks:** accidents and events cause errors no model can foresee; "up to" figures describe the best cities.

### 44. Route optimization

**What machine learning does:** forecasts demand and service times that feed vehicle-routing optimization.

**How it works:** the routing itself is usually operations research (mathematical optimization); machine learning supplies the inputs and, in research, learns heuristics. See [optimization techniques](/articles/mathematical-optimization-techniques).

**In practice:** UPS's ORION routing system is often cited as AI, but it is primarily an optimization system; this distinction matters when evaluating claims.

**Limits and risks:** drivers' local knowledge is hard to capture; optimized routes can create unrealistic workloads.

### 45. Ride-hailing dispatch and pricing

**What machine learning does:** forecasts demand by area and time, matches riders with drivers and sets surge prices.

**How it works:** spatio-temporal forecasting, matching optimization and reinforcement learning research.

**In practice:** ride-hailing and food-delivery platforms publish extensively about their forecasting and dispatch systems on engineering blogs.

**Limits and risks:** pricing and dispatch algorithms affect drivers' earnings, which has drawn regulatory and labor attention.

### 46. Aircraft and rail predictive maintenance

**What machine learning does:** predicts component failures from sensor data so parts can be replaced before they fail.

**How it works:** anomaly detection and remaining-useful-life regression on engine, wheel and track sensor data.

**In practice:** aircraft engine makers and airlines monitor engine health continuously; NASA's C-MAPSS turbofan simulation data is the standard research benchmark ([NASA](https://data.nasa.gov/dataset/cmapss-jet-engine-simulated-data)).

**Limits and risks:** failures are rare, so training data is limited; maintenance decisions stay within certified safety procedures.

### 47. Traffic signal timing

**What machine learning does:** recommends signal-timing changes to reduce stops and delays.

**How it works:** models of traffic patterns from aggregated driving data.

**In practice:** Google's Project Green Light gives cities timing recommendations based on Google Maps driving trends; Google reports early estimates of up to 30% fewer stops and up to 10% lower emissions at intersections ([Google](https://sites.research.google/gr/greenlight/)). These are Google's own estimates.

**Limits and risks:** smoother traffic can attract more traffic over time, offsetting emission gains.

### 48. Warehouse robotics and picking

**What machine learning does:** lets robots recognize and grasp varied items, and plans the movement of goods in warehouses.

**How it works:** computer vision for detection and grasping, reinforcement and imitation learning, and fleet optimization.

**In practice:** large e-commerce warehouses use mobile robots and increasingly robotic picking arms.

**Limits and risks:** picking arbitrary objects reliably is still hard; workplace safety and job quality are ongoing concerns.

### 49. Maritime monitoring and fuel efficiency

**What machine learning does:** tracks vessels, detects illegal fishing and optimizes ship speed and routes for fuel use.

**How it works:** classification of vessel movement patterns from satellite and AIS position data.

**In practice:** Global Fishing Watch uses machine learning on vessel tracking data to map fishing activity worldwide ([Kroodsma et al., 2018](https://doi.org/10.1126/science.aao5646)); a 2024 study combining satellite imagery with deep learning estimated that about 75% of the world's industrial fishing vessels are not publicly tracked ([Paolo et al., 2024](https://doi.org/10.1038/s41586-023-06825-8)).

**Limits and risks:** vessels can switch off transponders; satellite coverage varies.

### 50. Public transit demand forecasting

**What machine learning does:** forecasts ridership by line and stop, to plan schedules and capacity.

**How it works:** time-series models with calendar, weather and event features.

**In practice:** transit agencies use smart-card and ticketing data for forecasting and planning.

**Limits and risks:** travel patterns shifted sharply after 2020, making older data less useful.

### 51. Driver monitoring

**What machine learning does:** detects driver drowsiness and distraction from in-cabin cameras or steering patterns.

**How it works:** computer vision on eye and head movements, and models of driving behavior.

**In practice:** the European Union's General Safety Regulation requires drowsiness and attention warning systems in new vehicles, phased in from 2022 ([Regulation (EU) 2019/2144](https://eur-lex.europa.eu/eli/reg/2019/2144/oj)).

**Limits and risks:** in-cabin cameras raise privacy questions; false alarms lead drivers to ignore warnings.

## Manufacturing and industry

### 52. Visual quality inspection

**What machine learning does:** spots defects in products on production lines (scratches, misalignments, missing parts).

**How it works:** CNNs for classification and segmentation; anomaly detection trained only on good parts when defects are rare.

**In practice:** one of the most widespread industrial uses of computer vision, in electronics, automotive, food and textiles.

**Limits and risks:** new defect types and changes in lighting or products require retraining; a missed safety-critical defect is costly.

### 53. Predictive maintenance of machines

**What machine learning does:** predicts failures of pumps, motors, bearings and compressors from vibration, temperature and current data.

**How it works:** frequency-domain features and anomaly detection or supervised models (see techniques 69–70 in [feature engineering](/articles/feature-engineering-techniques)).

**In practice:** common in process industries, wind turbines and facilities management.

**Limits and risks:** failure labels are scarce and maintenance records are messy; the business case depends on the cost of unplanned downtime.

### 54. Process control and energy optimization

**What machine learning does:** recommends settings that keep a process efficient: cooling, mixing, heating, pressure.

**How it works:** models of the process from sensor history, combined with optimization and safety constraints.

**In practice:** in 2016 Google and DeepMind reported that machine learning recommendations reduced the energy used for cooling in a Google data center by up to 40% ([DeepMind, 2016](https://deepmind.google/blog/deepmind-ai-reduces-google-data-centre-cooling-bill-40/)). That is a company-reported figure for cooling energy, not total energy.

**Limits and risks:** recommendations must respect hard safety limits; models trained on normal operation may misbehave in unusual conditions.

### 55. Surrogate models for simulation

**What machine learning does:** approximates slow physics simulations (fluid flow, stress, heat) so designs can be explored in seconds instead of hours.

**How it works:** neural networks and Gaussian processes trained on simulation results; physics-informed neural networks add physical equations to the loss.

**In practice:** used in aerospace, automotive and chip design to search large design spaces.

**Limits and risks:** surrogates can be confidently wrong outside the range of their training simulations; final designs still need full simulation and testing.

### 56. Chip design

**What machine learning does:** helps place components on a chip and optimize layouts.

**How it works:** reinforcement learning and graph neural networks.

**In practice:** Google researchers reported using reinforcement learning for chip floorplanning ([Mirhoseini et al., 2021](https://doi.org/10.1038/s41586-021-03544-w)). The work is disputed: independent researchers reported that conventional methods matched or beat it in their evaluation ([Cheng et al., 2023](https://arxiv.org/abs/2302.11014)), and debate over the claims continued.

**Limits and risks:** results are hard to reproduce without access to proprietary designs and tools.

### 57. Semiconductor yield optimization

**What machine learning does:** finds the causes of defective chips and predicts yield from process and test data.

**How it works:** pattern recognition on wafer maps, anomaly detection and root-cause analysis on thousands of process variables.

**In practice:** widely used in semiconductor fabs, where small yield gains are worth a great deal.

**Limits and risks:** data is confidential and highly specific to each fab and process.

### 58. Robotic assembly and handling

**What machine learning does:** lets robots handle variable parts and adapt to positions that change.

**How it works:** vision-guided picking, imitation learning from demonstrations and reinforcement learning in simulation.

**In practice:** vision-guided robots are common in logistics and assembly; learned manipulation is spreading but still less common than programmed motion.

**Limits and risks:** reliability requirements in factories are very high; learned behaviors are harder to certify.

### 59. Demand sensing in manufacturing

**What machine learning does:** adjusts short-term production plans using recent orders, shipments and external signals.

**How it works:** short-horizon forecasting with many features.

**In practice:** consumer-goods manufacturers use demand sensing to adjust production and distribution weekly or daily.

**Limits and risks:** reacting to noise can amplify swings through the supply chain (the bullwhip effect).

## Energy and utilities

### 60. Wind power forecasting

**What machine learning does:** forecasts wind-farm output a day or more ahead, so the power can be committed to the grid in advance.

**How it works:** neural networks on weather forecasts and turbine history.

**In practice:** DeepMind and Google reported in 2019 that machine learning forecasts 36 hours ahead raised the value of the wind energy from 700 megawatts of their capacity by roughly 20%, compared with no advance commitments ([DeepMind, 2019](https://deepmind.google/discover/blog/machine-learning-can-boost-the-value-of-wind-energy/)). That is a company-reported figure.

**Limits and risks:** forecast errors still need backup generation; value depends on market rules.

### 61. Solar nowcasting

**What machine learning does:** predicts solar output minutes to hours ahead, especially when clouds move over panels.

**How it works:** satellite and sky-camera images with CNNs and optical-flow methods.

**In practice:** grid operators and solar farm owners use nowcasts to manage fluctuations.

**Limits and risks:** rapidly forming clouds remain hard to predict.

### 62. Electricity load forecasting

**What machine learning does:** forecasts electricity demand hours to days ahead.

**How it works:** gradient boosting and neural networks on weather, calendar and historical load, often as global models over many regions.

**In practice:** grid operators publish day-ahead forecasts, and load forecasting competitions such as the GEFCom series have tracked methods for years ([Hong et al., 2016](https://doi.org/10.1016/j.ijforecast.2016.02.001)).

**Limits and risks:** heat waves, cold snaps and growth in electric vehicles and heat pumps change patterns.

### 63. Grid fault and outage prediction

**What machine learning does:** predicts where equipment failures and storm outages are likely, to pre-position crews and prioritize maintenance.

**How it works:** models combining weather forecasts, vegetation, asset age and outage history.

**In practice:** utilities use outage prediction models before major storms.

**Limits and risks:** extreme events are rare in the training data; wildfire-risk decisions such as power shutoffs have major public consequences.

### 64. Fusion plasma control

**What machine learning does:** controls the magnetic coils that shape the plasma in a fusion reactor.

**How it works:** deep reinforcement learning trained in a simulator, then deployed on hardware.

**In practice:** DeepMind and the Swiss Plasma Center at EPFL used reinforcement learning to control plasma shapes in the TCV tokamak ([Degrave et al., 2022](https://doi.org/10.1038/s41586-021-04301-9)).

**Limits and risks:** a research demonstration on one experimental reactor; commercial fusion remains a separate challenge.

### 65. Subsurface interpretation

**What machine learning does:** interprets seismic surveys to map rock layers and faults, for geothermal, carbon storage and oil and gas projects.

**How it works:** 3-D segmentation networks on seismic volumes.

**In practice:** used by energy companies and geoscience researchers to speed up interpretation that once took experts weeks.

**Limits and risks:** labeled data is scarce and interpretation is uncertain; geological ground truth comes only from drilling.

### 66. Battery and materials research

**What machine learning does:** predicts battery health and lifetime, and screens candidate materials for new batteries and solar cells.

**How it works:** regression on early cycling data; graph neural networks on crystal structures.

**In practice:** researchers predicted battery cycle life from data on the first 100 cycles ([Severson et al., 2019](https://doi.org/10.1038/s41560-019-0356-8)); materials discovery is covered in entry 80.

**Limits and risks:** lab conditions differ from real-world use.

## Agriculture and food

### 67. Targeted weed spraying

**What machine learning does:** detects weeds in camera images from a moving sprayer and sprays only the weeds.

**How it works:** real-time computer vision on boom-mounted cameras.

**In practice:** John Deere reported that farmers using its See & Spray technology in 2024 saved an average of 59% of herbicide across about one million acres; an independent Iowa State University trial on five soybean fields reported 76% savings, with large variation by weed pressure ([John Deere, 2024](https://www.deere.com/en/news/all-news/see-spray-herbicide-savings/); [Iowa State, 2024](https://crops.extension.iastate.edu/cropnews/2024/08/precision-spraying-technology)).

**Limits and risks:** savings depend on weed density; the equipment is expensive.

### 68. Crop disease detection

**What machine learning does:** identifies plant diseases from photos taken with a phone.

**How it works:** CNNs trained on labeled leaf images, sometimes running offline on the phone.

**In practice:** the PlantVillage project's Nuru app helps farmers in East Africa diagnose cassava and other crop diseases ([Mrisho et al., 2020](https://doi.org/10.3389/fpls.2020.590889)).

**Limits and risks:** models trained on lab images do worse on field photos; a diagnosis is only useful with access to treatment.

### 69. Crop yield estimation from satellites

**What machine learning does:** estimates crop area and yield across regions before harvest.

**How it works:** models on time series of satellite images, weather and soil data.

**In practice:** used for food-security monitoring and commodity market forecasts.

**Limits and risks:** smallholder farms and mixed cropping are hard to resolve; ground truth data is limited in many countries.

### 70. Livestock monitoring

**What machine learning does:** detects illness, lameness and calving from sensors and cameras.

**How it works:** activity data from collars and ear tags, and computer vision in barns.

**In practice:** commercial dairy farms use activity sensors to detect heat and health problems.

**Limits and risks:** alerts need follow-up by farm staff; sensors can fail.

### 71. Food sorting and quality grading

**What machine learning does:** sorts fruit, vegetables, nuts and grain by quality, removing defective items.

**How it works:** high-speed cameras and classifiers, sometimes with near-infrared spectroscopy.

**In practice:** optical sorters are standard equipment in food processing plants.

**Limits and risks:** natural variation in produce makes grading subjective; models need regular recalibration.

### 72. Irrigation and farm management

**What machine learning does:** recommends when and how much to irrigate and fertilize.

**How it works:** soil-moisture sensors, weather forecasts and crop models, with machine learning filling gaps between sensors.

**In practice:** precision-agriculture platforms offer such recommendations, especially in water-scarce regions.

**Limits and risks:** evidence of yield and water savings varies widely by crop and region.

## Climate, environment and Earth science

### 73. Weather forecasting

**What machine learning does:** forecasts the global weather days ahead, much faster than traditional physics-based models.

**How it works:** graph neural networks and transformers trained on decades of reanalysis data.

**In practice:** DeepMind's GraphCast was more accurate than the European Centre for Medium-Range Weather Forecasts' high-resolution forecast on 89.3% of the 2,760 variable and lead-time combinations evaluated ([Lam et al., 2023](https://doi.org/10.1126/science.adi2336)). ECMWF made its own machine learning forecasting system, AIFS, operational in February 2025, running alongside its physics-based model ([ECMWF, 2025](https://www.ecmwf.int/en/about/media-centre/news/2025/ecmwfs-ai-forecasts-become-operational)).

**Limits and risks:** models learn from reanalysis produced by physics-based systems, and extreme, unprecedented events are a concern.

### 74. Flood forecasting

**What machine learning does:** forecasts river floods days in advance, including where there are no river gauges.

**How it works:** LSTM-based hydrological models trained on weather and watershed data across thousands of basins.

**In practice:** Google researchers reported in *Nature* that their model provided reliable forecasts of extreme floods in ungauged basins with lead times of up to five days, comparable to or better than the global benchmark system ([Nearing et al., 2024](https://doi.org/10.1038/s41586-024-07145-1)); Google says its Flood Hub covers more than 100 countries.

**Limits and risks:** coverage claims come from Google; forecasts only help when warnings reach people in time.

### 75. Wildfire detection

**What machine learning does:** detects smoke in camera feeds and satellite images early.

**How it works:** image classification and object detection on networks of mountaintop cameras, plus satellite fire detection.

**In practice:** the ALERTCalifornia program at UC San Diego runs AI smoke detection on its statewide camera network in partnership with CAL FIRE ([ALERTCalifornia](https://alertcalifornia.org/)).

**Limits and risks:** false alarms from clouds and dust; detection does not replace suppression resources.

### 76. Wildlife monitoring

**What machine learning does:** finds animals in camera-trap photos, drone images and audio recordings.

**How it works:** object detection to find animals and classifiers to identify species; bioacoustic models for birds and whales.

**In practice:** Microsoft's open MegaDetector model detects animals, people and vehicles in camera-trap images, removing the many empty frames before ecologists review them ([Beery, Morris and Yang, 2019](https://arxiv.org/abs/1907.06772)).

**Limits and risks:** rare species and unusual viewpoints are hard; detection locations of endangered species must be protected from poachers.

### 77. Deforestation monitoring

**What machine learning does:** detects forest loss in satellite images within days.

**How it works:** classification of satellite time series.

**In practice:** the GLAD alerts from the University of Maryland flag forest loss in the humid tropics from Landsat data and are published on Global Forest Watch ([Hansen et al., 2016](https://doi.org/10.1088/1748-9326/11/3/034008)).

**Limits and risks:** clouds delay detection; alerts need enforcement to have an effect.

### 78. Earthquake detection

**What machine learning does:** detects small earthquakes and picks the arrival times of seismic waves in continuous recordings.

**How it works:** deep networks on seismic waveforms.

**In practice:** models such as EQTransformer detect many more small earthquakes than traditional methods, producing richer catalogs for research ([Mousavi et al., 2020](https://doi.org/10.1038/s41467-020-17591-w)).

**Limits and risks:** detecting earthquakes is not predicting them; no method reliably predicts when large earthquakes will occur.

### 79. Disaster damage assessment

**What machine learning does:** maps damaged buildings from satellite images after earthquakes, storms and floods.

**How it works:** change detection and segmentation on before-and-after images.

**In practice:** the xBD dataset and xView2 challenge produced open models for building-damage classification ([Gupta et al., 2019](https://arxiv.org/abs/1911.09296)).

**Limits and risks:** damage that is not visible from above (interior collapse, flooding inside buildings) is missed; outputs need ground verification.

## Science and research

### 80. Materials discovery

**What machine learning does:** predicts which new crystal structures would be stable, to guide experiments.

**How it works:** graph neural networks trained on quantum-mechanics calculations.

**In practice:** DeepMind's GNoME predicted about 2.2 million new crystals, including about 380,000 it rated most stable; at publication, 736 had been made independently by outside researchers ([Merchant et al., 2023](https://doi.org/10.1038/s41586-023-06735-9)).

**Limits and risks:** predicted stability is not the same as being synthesizable or useful; independent chemists have questioned how novel some predictions are.

### 81. Exoplanet discovery

**What machine learning does:** separates real planet transits from false signals in telescope light curves.

**How it works:** CNNs on light-curve data.

**In practice:** Google and University of Texas researchers used a neural network on Kepler data to identify two new planets, including an eighth planet around the star Kepler-90 ([Shallue and Vanderburg, 2018](https://doi.org/10.3847/1538-3881/aa9e09)).

**Limits and risks:** candidates still require statistical validation or follow-up observations.

### 82. Particle physics

**What machine learning does:** identifies particles and rare events in collider data, and decides in microseconds which collisions to keep.

**How it works:** boosted decision trees for decades, now deep networks and graph networks; some run on custom hardware in the trigger systems.

**In practice:** experiments at CERN's Large Hadron Collider use machine learning throughout their data analysis, including in the work that led to the 2012 Higgs boson discovery, where boosted decision trees were among the methods used.

**Limits and risks:** models trained on simulations must be checked carefully against real data.

### 83. Discovering faster algorithms

**What machine learning does:** searches for new algorithms, such as faster ways to multiply matrices.

**How it works:** reinforcement learning formulated as a game of finding decompositions.

**In practice:** DeepMind's AlphaTensor found matrix-multiplication algorithms that improved on the best known for some matrix sizes ([Fawzi et al., 2022](https://doi.org/10.1038/s41586-022-05172-4)).

**Limits and risks:** practical speed-ups depend on hardware; some records were soon improved by human mathematicians.

### 84. Mathematics and theorem proving

**What machine learning does:** suggests conjectures, proves theorems in formal systems and solves competition problems.

**How it works:** language models combined with formal proof checkers such as Lean, and search.

**In practice:** in 2024 DeepMind reported that its AlphaProof and AlphaGeometry 2 systems together solved four of six problems from that year's International Mathematical Olympiad, with proofs checked formally ([DeepMind, 2024](https://deepmind.google/discover/blog/ai-solves-imo-problems-at-silver-medal-level/)).

**Limits and risks:** competition problems differ from research mathematics; formal verification guards against wrong proofs, but informal model outputs can be confidently wrong.

### 85. Scientific literature search

**What machine learning does:** finds, summarizes and connects research papers.

**How it works:** semantic search with embeddings and language models.

**In practice:** tools such as Semantic Scholar use machine learning to recommend and summarize papers ([Semantic Scholar](https://www.semanticscholar.org/)).

**Limits and risks:** language models can invent citations, so every reference must be checked.

## Public sector, legal and security

### 86. Tax and benefits fraud detection, and its dangers

**What machine learning does:** risk-scores tax returns and benefit claims for investigation.

**How it works:** supervised models and anomaly detection on administrative data.

**In practice:** the Dutch childcare benefits scandal is a defining cautionary case: tax authorities wrongly accused thousands of families of fraud, and a risk-classification model that used nationality as a factor contributed to the discrimination, according to Amnesty International's analysis ([Amnesty International, 2021](https://www.amnesty.org/en/documents/eur35/4686/2021/en/)). The scandal led the Dutch government to resign in January 2021.

**Limits and risks:** errors fall on people with the least power to contest them; risk scores must not become automatic accusations.

### 87. Technology-assisted review in law

**What machine learning does:** ranks documents in litigation by their likely relevance, so lawyers review the important ones first.

**How it works:** active learning with text classifiers (see project 58 in [machine learning projects](/articles/machine-learning-projects)).

**In practice:** a U.S. federal court accepted technology-assisted review in *Da Silva Moore v. Publicis Groupe* (2012), and an influential study found it could be more effective and more efficient than exhaustive manual review ([Grossman and Cormack, 2011](https://jolt.richmond.edu/jolt-archive/v17i3/article11.pdf)).

**Limits and risks:** recall must be validated statistically; generative AI has caused sanctions when lawyers filed briefs with invented case citations.

### 88. Email security

**What machine learning does:** filters spam, phishing and malware.

**How it works:** text classifiers, URL and sender reputation models, and attachment analysis.

**In practice:** Google said in 2017 that machine learning helped Gmail block more than 99.9% of spam and phishing messages ([Google, 2017](https://blog.google/products/g-suite/keeping-your-company-data-safe-new-security-updates-gmail/)).

**Limits and risks:** targeted phishing still gets through; attackers now use generative AI to write convincing messages.

### 89. Cyber threat detection

**What machine learning does:** detects malware, intrusions and account takeovers from logs, network traffic and endpoint behavior.

**How it works:** anomaly detection, classification of files and behaviors, and graph analysis of activity.

**In practice:** security products and cloud providers use machine learning across detection and response; analysts handle triage.

**Limits and risks:** attackers adapt to models; high false-positive rates cause alert fatigue.

### 90. Predictive policing, and why it is contested

**What machine learning does:** forecasts where crimes may occur, or scores individuals' risk.

**How it works:** models trained on historical crime and arrest data.

**In practice:** researchers showed that a predictive policing algorithm trained on drug arrest records in Oakland would have concentrated policing in minority neighborhoods, even though public health survey data suggested drug use was spread across the city ([Lum and Isaac, 2016](https://doi.org/10.1111/j.1740-9713.2016.00960.x)). Several U.S. cities have since ended predictive policing programs.

**Limits and risks:** arrest data reflects where police already patrol, so models can create feedback loops; the EU AI Act prohibits predicting individuals' risk of committing crimes based solely on profiling ([EU AI Act, Article 5](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)).

### 91. Public-service assistants and translation

**What machine learning does:** answers citizens' questions, translates documents and helps staff process applications.

**How it works:** retrieval-augmented language models and machine translation.

**In practice:** many governments are piloting assistants for benefits, tax and immigration questions.

**Limits and risks:** wrong answers about legal rights are harmful; accuracy in minority languages is lower.

### 92. Archive digitization

**What machine learning does:** transcribes handwritten historical documents and makes them searchable.

**How it works:** handwritten text recognition models trained on transcribed pages.

**In practice:** platforms such as Transkribus have been used by archives to transcribe large collections of historical manuscripts ([Transkribus](https://www.transkribus.org/)).

**Limits and risks:** old scripts and languages need specific training data; transcriptions should be marked as machine-generated.

## Education and work

### 93. Adaptive learning

**What machine learning does:** decides which exercise each learner should see next and when to review material.

**How it works:** models of memory and skill, such as spaced-repetition models.

**In practice:** Duolingo published its half-life regression model of forgetting and reported that it improved engagement in an A/B test ([Settles and Meeder, 2016](https://aclanthology.org/P16-1174/)).

**Limits and risks:** engagement is not the same as learning; evidence that AI tutoring improves outcomes at scale is still developing.

### 94. Automated essay scoring

**What machine learning does:** scores written responses on standardized tests.

**How it works:** models on linguistic features, and increasingly language models.

**In practice:** ETS uses its e-rater engine alongside human raters to score essays in exams such as the GRE ([ETS](https://www.ets.org/erater.html)).

**Limits and risks:** systems can reward length and vocabulary over reasoning; using them as the only scorer is risky.

### 95. Hiring tools, and a well-known failure

**What machine learning does:** screens résumés, matches candidates to jobs and schedules interviews.

**How it works:** text classification and matching models trained on past hiring decisions.

**In practice:** Reuters reported in 2018 that Amazon had scrapped an experimental résumé-screening tool after finding it penalized résumés that included the word "women's", because it had learned from a decade of male-dominated hiring ([Dastin, Reuters, 2018](https://www.reuters.com/article/us-amazon-com-jobs-automation-insight-idUSKCN1MK08G)).

**Limits and risks:** past decisions encode past bias; New York City requires bias audits of automated employment decision tools ([NYC Local Law 144](https://www.nyc.gov/site/dca/about/automated-employment-decision-tools.page)), and the EU AI Act classifies hiring systems as high risk.

### 96. Workforce planning

**What machine learning does:** forecasts staffing needs for call centers, stores and hospitals, and builds schedules.

**How it works:** demand forecasting combined with scheduling optimization.

**In practice:** standard in contact centers and retail.

**Limits and risks:** schedules optimized for cost alone can make workers' hours unpredictable; some cities have "fair workweek" laws.

## Technology and communication

### 97. Network operations

**What machine learning does:** predicts network faults, detects anomalies and optimizes capacity in telecom and cloud networks.

**How it works:** anomaly detection on network telemetry and forecasting of traffic.

**In practice:** telecom operators use machine learning for fault prediction and radio network optimization.

**Limits and risks:** network topologies change constantly, so models need maintenance; automated changes can cascade.

### 98. Code assistants

**What machine learning does:** suggests code, explains it and writes tests.

**How it works:** large language models trained on code.

**In practice:** in a controlled experiment, developers with GitHub Copilot completed a JavaScript programming task 55.8% faster than a control group ([Peng et al., 2023](https://arxiv.org/abs/2302.06590)). A 2025 randomized trial by METR found that experienced open-source developers working on their own repositories took 19% longer with AI tools, even though they believed they were faster ([Becker et al., 2025](https://arxiv.org/abs/2507.09089)); the authors caution that newer tools and other settings may give different results.

**Limits and risks:** results depend strongly on the task and the developer's experience; generated code can contain bugs and security flaws.

### 99. Accessibility

**What machine learning does:** describes images for blind and low-vision people, captions speech for deaf and hard-of-hearing people, and helps people with limited mobility control devices by voice.

**How it works:** image captioning and vision-language models, speech recognition and text-to-speech.

**In practice:** phone operating systems include live captions and image descriptions; Be My Eyes added an AI image-description assistant built on OpenAI's GPT-4 ([Be My Eyes](https://www.bemyeyes.com/)).

**Limits and risks:** wrong descriptions can mislead users who cannot check them visually.

### 100. Web search

**What machine learning does:** understands queries and ranks pages, and now generates summarized answers.

**How it works:** learning-to-rank models, transformer language models and retrieval-augmented generation.

**In practice:** Google said in 2019 that it had started using BERT to better understand search queries, initially affecting about one in ten English searches in the U.S. ([Google, 2019](https://blog.google/products/search/search-language-understanding-bert/)).

**Limits and risks:** generated answers can be wrong; summaries may reduce traffic to the sites whose content they use.

## Lessons from 100 applications

- **Narrow tasks with measurable outcomes succeed most often.** Screening images, forecasting demand and filtering spam work because the right answer is eventually known and errors can be counted.
- **External validation is where weak claims are found.** The sepsis model (entry 4), chip design (entry 56) and code assistants (entry 98) all have independent evaluations that changed the picture.
- **The decision around the model matters as much as the model.** MASAI's gains came from how the AI score routed human attention (entry 2); fraud models are only as good as the threshold and review process (entry 15).
- **Historical data encodes historical decisions.** Hiring (entry 95), policing (entry 90) and welfare fraud (entry 86) show how models can automate past bias at scale.
- **Company-reported numbers are a starting point, not proof.** Look for peer-reviewed or independent evaluations, the baseline being compared against, and whether the figure is an average or a best case.

## How to evaluate a machine learning claim

1. **What is the baseline?** A 40% reduction compared with what: the old system, a human, or doing nothing?
2. **Who measured it?** The developer, a customer, or an independent group?
3. **On what data?** The same hospital, store or period it was trained on, or new ones?
4. **Average or best case?** "Up to" describes the best case.
5. **What happened to errors?** More detections can mean more false alarms.
6. **Was it a randomized trial or a before-and-after comparison?** Many other things change over time.
7. **Who bears the risk when it is wrong?**

## Where to go next

- Learn how these systems work in [100 machine learning algorithms explained](/articles/machine-learning-algorithms-explained).
- Build a smaller version of one with [101 machine learning projects](/articles/machine-learning-projects).
- Find data for it in [100 machine learning datasets](/articles/machine-learning-datasets).
- Learn the input design that most applications depend on in [101 feature engineering techniques](/articles/feature-engineering-techniques).
- For newer generative AI and agent deployments, see [25 examples of how AI is transforming industries in 2026](/articles/ai-transforming-industries-examples), and for the effect on jobs, [75 examples of how AI is changing the future of work](/articles/ai-future-of-work-examples).
- For applications of the underlying science, see [applications of science in everyday life](/articles/applications-of-science-in-everyday-life) and [applications of physics in everyday life](/articles/applications-of-physics-in-everyday-life).

## References

Sources are linked in each entry. Broader references:

1. Stanford Institute for Human-Centered AI. *AI Index Report*. Published annually. [hai.stanford.edu/ai-index](https://hai.stanford.edu/ai-index)
2. U.S. Food and Drug Administration. "Artificial Intelligence-Enabled Medical Devices." [fda.gov](https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-enabled-medical-devices)
3. Regulation (EU) 2024/1689 (Artificial Intelligence Act). *Official Journal of the European Union*. [eur-lex.europa.eu/eli/reg/2024/1689/oj](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)
4. National Institute of Standards and Technology (2023). *AI Risk Management Framework (AI RMF 1.0)*. [nist.gov/itl/ai-risk-management-framework](https://www.nist.gov/itl/ai-risk-management-framework)
5. Sculley, D., et al. (2015). "Hidden Technical Debt in Machine Learning Systems." *NeurIPS 2015*. [papers.nips.cc](https://papers.nips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems)
6. Kapoor, S., & Narayanan, A. (2023). "Leakage and the reproducibility crisis in machine-learning-based science." *Patterns*, 4(9). [doi.org/10.1016/j.patter.2023.100804](https://doi.org/10.1016/j.patter.2023.100804)
7. Obermeyer, Z., Powers, B., Vogeli, C., & Mullainathan, S. (2019). "Dissecting racial bias in an algorithm used to manage the health of populations." *Science*, 366(6464). [doi.org/10.1126/science.aax2342](https://doi.org/10.1126/science.aax2342)
