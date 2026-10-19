---
title: 50 Best Real-World AI Use Cases Across Manufacturing, Retail, and Logistics
seoTitle: 50 AI Use Cases in Manufacturing, Retail and Logistics
description: 50 AI use cases in manufacturing, retail and logistics, each with a real deployment, the metrics to track, a maturity rating and the main risk to plan for.
author: BlogAI Editors
authorType: Organization
publishedAt: 2026-10-20
updatedAt: 2026-10-20
status: published
categories:
  - Engineering
tags: [artificial intelligence, manufacturing, retail, logistics, supply chain, robotics, use cases]
tocDepth: 2
---

Manufacturing, retail and logistics are one connected system: factories make goods, logistics moves them, and retail sells them. AI now works at every step, from cameras that inspect welds to agents that quote freight prices and assistants that answer shoppers' questions. This guide is written for people choosing which AI projects to pursue. It gives 50 use cases, and for each one:

- **The use case:** what AI does and why it matters.
- **Real-world example:** a named deployment with a link, or a pointer to deeper coverage.
- **Measure:** the metrics that show whether it works.
- **Maturity:** our editorial rating of how proven the use case is.
- **Watch for:** the main risk or limitation.

**Maturity ratings** are our own assessment from the public evidence, not a vendor score:

- **Established:** used at scale for years by many companies, with well-understood results.
- **Scaling:** proven at leading companies and spreading, but results vary.
- **Early:** pilots, first deployments or contested results.

**About the numbers.** Most figures come from the companies that run the systems, or from World Economic Forum "Lighthouse" factory profiles, which are self-reported and reviewed by the Forum's partners. We label them as company figures. Sources were checked in October 2026.

For the machine learning methods behind many of these use cases, see [100 machine learning applications across industries](/articles/machine-learning-applications), which covers demand forecasting, predictive maintenance and route optimization in more technical depth. For other sectors, see [25 examples of how AI is transforming industries in 2026](/articles/ai-transforming-industries-examples).

<figure>
<img src="/images/articles/ai-use-cases-manufacturing-retail-logistics/use-case-map.svg" alt="Flow diagram of the 50 use cases along the value chain from left to right. Manufacturing, entries 1 to 16: design and engineering, production and quality, maintenance and robotics. Logistics, entries 35 to 50: warehousing, transport and last mile, planning. Retail, entries 17 to 34: demand and pricing, shopping and discovery, stores and service. Arrows show goods flowing from manufacturing through logistics to retail, and demand data flowing back from retail to logistics and manufacturing." width="720" height="330" loading="lazy" decoding="async" />
<figcaption>The 50 use cases follow the path goods take. Demand data flowing back from stores and websites is what lets forecasting, planning and production respond.</figcaption>
</figure>

## How to choose a use case

Before the list, a quick filter. Good first AI projects in these industries usually have:

1. **High volume:** the task happens thousands of times, so small gains add up.
2. **Measurable outcomes:** defects, minutes, miles, stockouts or returns you already track.
3. **Available data:** images, sensor logs, transaction histories or documents you already collect.
4. **A safe failure mode:** a person or a fallback process catches mistakes before customers or workers are harmed.
5. **An owner:** an operations leader who will change the process, not just install a tool.

## Manufacturing

### 1. Visual quality inspection

**The use case:** cameras and vision models inspect parts, welds, packaging and surfaces on the line and flag defects that humans miss or catch inconsistently.

**Real-world example:** ACG's packaging-materials plant in Shirwal, India, named a World Economic Forum Lighthouse in January 2026, reported 71% fewer defects alongside shorter lead times and lower energy use ([World Economic Forum](https://www.weforum.org/press/2026/01/global-lighthouse-network-recognizes-23-new-sites-launches-ai-platform-for-industrial-transformation/), company figures).

**Measure:** defect escape rate, false reject rate, inspection cost per unit.

**Maturity:** Established.

**Watch for:** models trained on one product, camera or lighting setup often degrade when any of them changes. Rare defects need deliberate data collection.

### 2. Predictive maintenance

**The use case:** models learn from vibration, temperature, current and maintenance logs to predict equipment failures before they stop production.

**Real-world example:** GlobalFoundries' 300 mm fab in Singapore, named a Lighthouse in September 2025, combined machine-learning predictive maintenance and quality control with remote support and reported 40% higher labor productivity ([World Economic Forum](https://www.weforum.org/press/2025/09/global-lighthouse-network-2025-world-economic-forum-recognizes-12-new-sites-driving-holistic-transformation-in-manufacturing/), company figures). See entry 53 of [100 machine learning applications](/articles/machine-learning-applications) for methods.

**Measure:** unplanned downtime, mean time between failures, maintenance cost, false alarm rate.

**Maturity:** Established.

**Watch for:** failures are rare, so models have few examples to learn from. Too many false alarms and technicians stop trusting the system.

### 3. Process and energy optimization

**The use case:** models recommend or automatically set temperatures, flows, speeds and other settings that reduce energy, scrap or cycle time in continuous processes.

**Real-world example:** the same ACG Lighthouse site reported 31% lower energy consumption ([World Economic Forum](https://www.weforum.org/press/2026/01/global-lighthouse-network-recognizes-23-new-sites-launches-ai-platform-for-industrial-transformation/)). An early landmark: in 2016 Google DeepMind reported that machine learning reduced the energy used to cool Google's data centers by up to 40% ([Google DeepMind](https://deepmind.google/discover/blog/deepmind-ai-reduces-google-data-centre-cooling-bill-by-40/)).

**Measure:** energy per unit, yield, scrap rate, process stability.

**Maturity:** Scaling.

**Watch for:** recommendations must stay within safe operating limits. Start in advisory mode, with operators approving changes, before closing the loop.

### 4. Digital twins for factory planning

**The use case:** a detailed virtual model of a factory is used to test layouts, robot paths and line changes before anything is built.

**Real-world example:** BMW's Virtual Factory, built on NVIDIA Omniverse and covering more than 30 production sites, is projected to reduce production planning costs by up to 30%, and BMW plans to validate more than 40 new or updated models virtually before production ([BMW Group](https://www.press.bmwgroup.com/global/article/detail/T0450699EN/bmw-group-scales-virtual-factory), company projection).

**Measure:** planning time, late engineering changes, ramp-up time for new models.

**Maturity:** Scaling.

**Watch for:** a twin is only as accurate as its data. Keeping it synchronized with the real plant is ongoing work.

### 5. Generative design of parts

**The use case:** engineers set goals and constraints (loads, materials, weight) and software generates and tests many candidate shapes.

**Real-world example:** General Motors and Autodesk produced a seat bracket that was 40% lighter and 20% stronger than the original, consolidating eight welded parts into one 3D-printed piece, chosen from more than 150 generated designs ([Autodesk](https://www.autodesk.com/customer-stories/general-motors-generative-design)).

**Measure:** part weight, part count, strength, cost to manufacture.

**Maturity:** Established for prototypes and low-volume parts; early for mass production.

**Watch for:** organic shapes often require additive manufacturing, which costs more per part at high volume.

### 6. Generative AI for automation code

**The use case:** engineers describe control logic in natural language and an assistant generates code for programmable logic controllers (PLCs), which run machines.

**Real-world example:** Schaeffler uses the Siemens Industrial Copilot, connected to Siemens' TIA Portal engineering software, to help its automation engineers generate PLC code ([Automation World](https://www.automationworld.com/factory/digital-transformation/news/55235167/schaeffler-brings-siemens-industrial-copilot-to-its-shop-floor)). Siemens and Schaeffler say it reduces time and errors; independent measurements have not been published.

**Measure:** engineering hours per project, commissioning defects, time to modify a line.

**Maturity:** Early.

**Watch for:** errors in control code can damage equipment or injure people. Every generated program needs simulation and review.

### 7. Troubleshooting assistants for maintenance teams

**The use case:** a chatbot grounded in machine manuals, error codes and past work orders tells technicians the likely cause of a fault and the steps to fix it.

**Real-world example:** the Siemens Industrial Copilot deployment at Schaeffler also gives shop-floor staff access to documentation and guidelines to diagnose errors faster ([Automation World](https://www.automationworld.com/factory/digital-transformation/news/55235167/schaeffler-brings-siemens-industrial-copilot-to-its-shop-floor)).

**Measure:** mean time to repair, first-time fix rate, escalations to experts.

**Maturity:** Early.

**Watch for:** outdated or missing documents produce confident wrong answers. Link every answer to its source page.

### 8. Industrial AI across a whole site

**The use case:** large operators combine dozens of AI tools, from analytics and digital twins to in-house language models, across one facility.

**Real-world example:** Aramco's North Ghawar oil complex, named a Lighthouse in September 2025, uses more than 65 solutions, including AI-powered digital twins and Aramco's own large language model ([World Economic Forum](https://www.weforum.org/press/2025/09/global-lighthouse-network-2025-world-economic-forum-recognizes-12-new-sites-driving-holistic-transformation-in-manufacturing/)).

**Measure:** site-level throughput, uptime, safety incidents, cost per unit.

**Maturity:** Scaling at leading companies.

**Watch for:** the Forum notes that generative AI made up about 23% of top Lighthouse solutions in 2025, up from a much smaller share; most value still came from analytical AI.

### 9. Faster product configuration and order lead times

**The use case:** AI helps sales and engineering configure complex, customizable products and plan their production faster.

**Real-world example:** Mettler-Toledo's Changzhou site, a 2025 Lighthouse, used AI-accelerated product configuration and machine-learning weld inspection and reported 98.4% on-time delivery and 22% shorter lead times ([Mettler-Toledo](https://www.mt.com/au/en/home/supportive_content/news/mt_changzhou.html), company figures).

**Measure:** quote-to-order time, configuration errors, on-time delivery.

**Maturity:** Scaling.

**Watch for:** configuration rules change often; the AI's rules must be updated with them.

### 10. Humanoid robots on production lines

**The use case:** general-purpose humanoid robots take on tasks designed for human workers, such as loading parts into fixtures.

**Real-world example:** Figure AI says its Figure 02 robots worked 10-hour shifts at BMW's Spartanburg plant for 11 months, loading more than 90,000 sheet-metal parts and contributing to more than 30,000 BMW X3s ([Figure AI](https://www.figure.ai/news/production-at-bmw), company figures).

**Measure:** cycle time, uptime, intervention rate, cost per task compared with a fixed robot or a person.

**Maturity:** Early.

**Watch for:** one task in one plant is not a business case. Safety standards for humanoids working near people are still being developed.

### 11. Robot foundation models

**The use case:** a single AI model that understands language and vision controls robots across many tasks, instead of programming each task separately.

**Real-world example:** Google DeepMind introduced Gemini Robotics, a vision-language-action model, in March 2025 and is working with humanoid maker Apptronik ([Google DeepMind](https://deepmind.google/discover/blog/gemini-robotics-brings-ai-into-the-physical-world/)).

**Measure:** task success rate on new tasks, setup time for a new task.

**Maturity:** Early.

**Watch for:** lab demonstrations are far from the reliability factories need (often above 99%).

### 12. Chip design and layout

**The use case:** reinforcement learning and other methods help place components on chips and tune designs.

**Real-world example:** Google has used AI-generated layouts in its TPU chips; the original 2021 *Nature* paper drew independent criticism over its benchmarks. Entry 56 of [100 machine learning applications](/articles/machine-learning-applications) covers the dispute.

**Measure:** power, performance and area of the chip; design time.

**Maturity:** Early and contested.

**Watch for:** compare against strong commercial tools and expert designers, not weak baselines.

### 13. Automating R&D and engineering workflows

**The use case:** AI handles routine steps in product development: drafting specifications, checking test data and moving documents through approvals.

**Real-world example:** electric-car maker NIO says its Factory Two, named a Lighthouse in June 2026, automated 90% of R&D workflows and accelerated speed to market by 44% by connecting in-vehicle data, battery-swap networks and a digital twin ([NIO](https://www-global-eu.nio.com/news/20260622001), company figures).

**Measure:** development cycle time, engineering change turnaround, defects found late.

**Maturity:** Early.

**Watch for:** "automated workflows" can mean very different things. Ask which steps were removed and which still need sign-off.

### 14. Demand sensing for production planning

**The use case:** short-term forecasts from orders, point-of-sale data and external signals adjust production schedules.

**Real-world example:** see entry 59 of [100 machine learning applications](/articles/machine-learning-applications).

**Measure:** forecast error, schedule changes, finished-goods inventory, service level.

**Maturity:** Established.

**Watch for:** better forecasts help only if the factory can change its schedule in time.

### 15. Surrogate models for engineering simulation

**The use case:** neural networks trained on physics simulations predict results in seconds instead of hours, so engineers can test many more designs.

**Real-world example:** see entry 55 of [100 machine learning applications](/articles/machine-learning-applications).

**Measure:** simulation time, number of designs evaluated, accuracy against full simulation.

**Maturity:** Scaling.

**Watch for:** surrogates can be wrong outside the range they were trained on. Verify final designs with full simulation.

### 16. Scaling AI from one site to many

**The use case:** standardizing data, platforms and playbooks so a use case proven in one plant can be copied to others.

**Real-world example:** the World Economic Forum's Global Lighthouse Network reached 238 sites in June 2026 and launched a shared AI platform for members in January 2026 ([World Economic Forum](https://www.weforum.org/press/2026/01/global-lighthouse-network-recognizes-23-new-sites-launches-ai-platform-for-industrial-transformation/)).

**Measure:** time to deploy a proven use case at a new site; share of sites using it.

**Maturity:** Scaling.

**Watch for:** older plants often lack the sensors and data infrastructure that a showcase site has.

## Retail

### 17. Demand forecasting and replenishment

**The use case:** forecasts at the level of each product in each store set orders and stock levels.

**Real-world example:** see entry 26 of [100 machine learning applications](/articles/machine-learning-applications).

**Measure:** forecast error, stockouts, waste (especially for fresh food), inventory days.

**Maturity:** Established.

**Watch for:** promotions, weather and local events cause large errors if they are not in the model.

### 18. Personalized recommendations

**The use case:** models suggest products based on browsing, purchase history and similar shoppers.

**Real-world example:** see entry 24 of [100 machine learning applications](/articles/machine-learning-applications).

**Measure:** conversion rate, basket size, measured through holdout tests.

**Maturity:** Established.

**Watch for:** recommendations can narrow choices and favor high-margin products over what shoppers need.

### 19. Shopping assistants in the retailer's own app

**The use case:** a conversational assistant answers product questions, compares options and helps shoppers decide.

**Real-world example:** Amazon said about 250 million customers used its Rufus assistant in 2025, that users were 60% more likely to complete a purchase, and that Rufus was on track for more than \$10 billion in incremental annualized sales by its own attribution ([Fortune](https://fortune.com/2025/11/02/amazon-rufus-ai-shopping-assistant-chatbot-10-billion-sales-monetization/), company figures).

**Measure:** conversion of assistant users versus a randomized holdout, wrong answers per thousand questions, returns.

**Maturity:** Scaling.

**Watch for:** shoppers who use an assistant may already be keen buyers. Hold out a control group.

### 20. Assistants that plan purchases

**The use case:** the assistant turns a goal ("dinner for a week", "a birthday party") into a cart.

**Real-world example:** Walmart launched its Sparky assistant in its app in June 2025, summarizing reviews and giving occasion-based suggestions, with reordering and service booking announced as future features ([Retail TouchPoints](https://www.retailtouchpoints.com/features/news-briefs/walmart-introduces-gen-ai-powered-assistant-in-mobile-app)).

**Measure:** cart completion, repeat use, substitution acceptance.

**Maturity:** Early.

**Watch for:** substitutions and dietary needs. A wrong item in a meal plan is a bigger failure than a wrong search result.

### 21. Shoppers arriving from AI chatbots

**The use case:** shoppers ask general chatbots for recommendations, then click through to retailers.

**Real-world example:** Adobe Analytics reported a 693% year-over-year increase in traffic from generative AI tools to U.S. retail sites in the 2025 holiday season, from a small base ([Adobe](https://news.adobe.com/news/2026/01/adobe-holiday-shopping-season)).

**Measure:** AI-referred sessions, conversion, revenue per visit.

**Maturity:** Early.

**Watch for:** you cannot buy placement in most chatbot answers. Accurate product data and reviews matter most.

### 22. Agentic checkout

**The use case:** an AI agent completes a purchase for the shopper, for example when a price drops.

**Real-world example:** Google announced agentic checkout in AI Mode in May 2025 ([Google](https://blog.google/products/shopping/google-shopping-ai-mode-virtual-try-on-update/)). OpenAI scaled back its in-chat Instant Checkout in March 2026 after limited merchant uptake ([Forrester](https://www.forrester.com/blogs/what-it-means-that-the-leader-in-agentic-commerce-just-pulled-back/)).

**Measure:** completed agent purchases, error and return rates, chargebacks.

**Maturity:** Early.

**Watch for:** liability for mistaken purchases and loss of the direct customer relationship.

### 23. Virtual try-on

**The use case:** generative image models show how clothes would look on the shopper's own photo.

**Real-world example:** Google launched a try-on feature in May 2025 that lets shoppers upload a full-length photo to preview apparel from billions of listings ([Google](https://blog.google/products/shopping/google-shopping-ai-mode-virtual-try-on-update/)).

**Measure:** conversion and size-related return rates, compared with shoppers who did not use try-on.

**Maturity:** Early.

**Watch for:** images show drape and style, not exact fit. Handle uploaded photos as sensitive personal data.

### 24. Visual search

**The use case:** shoppers search with a photo instead of words.

**Real-world example:** see entry 28 of [100 machine learning applications](/articles/machine-learning-applications).

**Measure:** search-to-purchase rate, zero-result searches.

**Maturity:** Established.

**Watch for:** visual similarity is not the same as the right product; show key attributes.

### 25. Product content at catalog scale

**The use case:** language models write and correct product titles, descriptions and attributes.

**Real-world example:** Walmart said it used large language models to create or improve more than 850 million catalog data points, work it estimated would otherwise have needed nearly 100 times the headcount ([Retail Dive](https://www.retaildive.com/news/walmart-generative-ai-product-data-points/724782/), company figures).

**Measure:** attribute accuracy from audits, search conversion, returns for "not as described."

**Maturity:** Scaling.

**Watch for:** invented specifications such as dimensions or materials. Audit samples by category.

### 26. Review summaries

**The use case:** AI condenses many reviews into a short summary of common praise and complaints.

**Real-world example:** Amazon began showing AI-generated review highlights in 2023 ([Amazon](https://www.aboutamazon.com/news/amazon-ai/amazon-improves-customer-reviews-with-generative-ai)).

**Measure:** time to purchase decision, returns, summary accuracy.

**Maturity:** Scaling.

**Watch for:** rare but serious complaints, such as safety issues, can disappear in a summary.

### 27. Customer service bots, with staff moved to higher-value work

**The use case:** a bot answers routine questions; human agents handle complex cases and sales.

**Real-world example:** IKEA's operator Ingka said its AI bot Billie handled 47% of customer queries to its call centers in its first two years, and that it had retrained 8,500 call-center workers as remote interior design advisers since 2021 ([Retail Gazette](https://www.retailgazette.co.uk/blog/2023/06/ikea-remote-interior-design/)).

**Measure:** resolution without repeat contact, satisfaction, revenue from redeployed staff.

**Maturity:** Scaling.

**Watch for:** the IKEA approach redeployed workers into a new revenue stream; cost-only automation risks the reversals seen at Klarna.

### 28. Checkout-free stores

**The use case:** cameras and sensors track what shoppers take so they can leave without scanning.

**Real-world example:** Amazon removed its Just Walk Out technology from most of its U.S. Amazon Fresh grocery stores in 2024, replacing it with Dash Carts that shoppers scan themselves, while keeping it in smaller stores and selling it to third-party venues ([Retail Dive](https://www.retaildive.com/news/amazon-removes-just-walk-out-tech-amazon-fresh-stores-dash-carts/712150/)).

**Measure:** accuracy of charges, cost per store, throughput at peak times.

**Maturity:** Early for large stores; scaling for small venues such as stadiums and airports.

**Watch for:** large stores with many products and shoppers are much harder than small kiosks.

### 29. Checkout loss prevention

**The use case:** cameras at checkouts detect items that pass the scanner without being scanned and alert staff.

**Real-world example:** Walmart deployed Missed Scan Detection cameras in more than 1,000 stores and said shrink fell where they were installed, without publishing figures ([Engadget](https://www.engadget.com/2019-06-22-walmart-computer-vision-checkout-theft.html)).

**Measure:** shrink rate, alert precision, customer complaints.

**Maturity:** Scaling.

**Watch for:** most missed scans are honest mistakes. Treat alerts as prompts for help, not accusations, and set clear rules for video retention.

### 30. Pricing with digital shelf labels

**The use case:** electronic shelf labels let stores change prices quickly, enabling markdowns of expiring food and price changes driven by models.

**Real-world example:** Walmart announced in 2024 that it would roll out digital shelf labels from VusionGroup to 2,300 U.S. stores by 2026 ([Talk Business & Politics](https://talkbusiness.net/2024/06/walmart-to-use-more-digital-shelf-labels-expand-inhome-delivery-service/)). For markdown models, see entry 27 of [100 machine learning applications](/articles/machine-learning-applications).

**Measure:** waste, margin, labor hours spent changing labels.

**Maturity:** Scaling.

**Watch for:** shoppers and regulators worry about "surge pricing" in stores. Be transparent about how and when prices change.

### 31. Returns and promotion abuse detection

**The use case:** models flag likely fraudulent returns and coupon or promotion abuse.

**Real-world example:** see entry 31 of [100 machine learning applications](/articles/machine-learning-applications).

**Measure:** fraud losses, false accusations, refund processing time.

**Maturity:** Established.

**Watch for:** blocking legitimate customers' returns damages loyalty. Review borderline cases.

### 32. Supplier negotiation bots

**The use case:** a chatbot negotiates price and payment terms with many small suppliers.

**Real-world example:** Walmart's pilot with Pactum closed deals with 64% of the suppliers it invited, with average savings of 1.5% and extended payment terms ([Harvard Business Review](https://hbr.org/2022/11/how-walmart-automated-supplier-negotiations)).

**Measure:** savings, deal closure rate, supplier satisfaction.

**Maturity:** Scaling.

**Watch for:** use it for many small, similar contracts, not strategic suppliers.

### 33. Generative AI for marketing images and copy

**The use case:** image generators and AI copywriting produce campaign assets faster and cheaper.

**Real-world example:** Klarna said generative AI cut its image production costs by about \$6 million a year and its spending on external marketing agencies by 25% ([Marketing Dive](https://www.marketingdive.com/news/klarna-gen-ai-openai-cut-marketing-spend-efficiency/717332/), company figures).

**Measure:** cost and time per asset, campaign results.

**Maturity:** Scaling.

**Watch for:** more assets is not better marketing; brand consistency and audience reaction matter.

### 34. Rules against AI-generated fake reviews

**The use case:** a compliance requirement rather than a tool: retailers and sellers must not post or buy fake reviews, including AI-written ones.

**Real-world example:** the U.S. Federal Trade Commission finalized a rule in August 2024 banning fake reviews and testimonials, explicitly including AI-generated ones ([TechCrunch](https://techcrunch.com/2024/08/14/ftc-finalizes-rule-banning-fake-reviews/)).

**Measure:** removed fake reviews, compliance audits of sellers.

**Maturity:** Established as a legal requirement.

**Watch for:** marketplace operators also need detection for sellers who game reviews.

## Logistics

### 35. Delivery route optimization

**The use case:** algorithms plan the order and route of each driver's stops, adjusting for packages, time windows and traffic.

**Real-world example:** UPS credits its ORION routing system with saving around 9 million gallons of fuel a year ([Trellis](https://trellis.net/article/how-ups-navigates-logistics-clean-tech-valley-death/), company figures).

**Measure:** miles per stop, stops per hour, fuel, on-time delivery.

**Maturity:** Established.

**Watch for:** drivers know things the model does not, such as loading docks and gate codes. Let them flag problems.

### 36. Coordinating warehouse robot fleets

**The use case:** a model plans the movement of thousands of mobile robots to avoid congestion and shorten trips.

**Real-world example:** Amazon deployed its millionth robot in July 2025 and introduced DeepFleet, a generative AI model it says improves robot fleet travel efficiency by 10% ([Amazon](https://www.aboutamazon.com/news/operations/amazon-million-robots-ai-foundation-model), company figures).

**Measure:** robot travel time, throughput per hour, congestion events.

**Maturity:** Scaling.

**Watch for:** gains depend on a highly standardized facility design.

### 37. Robotic picking with a sense of touch

**The use case:** robot arms with force sensors pick and stow varied items from storage bins.

**Real-world example:** Amazon introduced its Vulcan robot in May 2025, which uses touch sensing to handle about three-quarters of the item types stored in its fulfillment centers' storage pods, and hands harder picks to people ([Fortune](https://fortune.com/2025/05/07/amazon-robot-sense-of-touch/)).

**Measure:** picks per hour, pick success rate, damaged items, ergonomic injuries.

**Maturity:** Early.

**Watch for:** the remaining quarter of items are often the hardest; plan for human work alongside robots.

### 38. Truck and container unloading

**The use case:** mobile robots unload boxes from trailers and containers, a physically demanding job in hot or cold conditions.

**Real-world example:** DHL signed an agreement in May 2025 with Boston Dynamics to deploy more than 1,000 additional Stretch robots, which have reached unloading rates of up to 700 cases an hour ([Supply Chain Digital](https://supplychaindigital.com/news/dhl-deploy-1-000-boston-dynamics-robots-warehouses)).

**Measure:** cases per hour, trailer turn time, injury rates.

**Maturity:** Scaling.

**Watch for:** mixed, poorly stacked loads still slow robots down.

### 39. Humanoid robots in warehouses

**The use case:** humanoid robots move totes between conveyors and mobile robots, fitting into spaces built for people.

**Real-world example:** GXO signed a multi-year robots-as-a-service agreement with Agility Robotics after a pilot in which its Digit humanoid moved totes at a Spanx facility in Georgia ([The Robot Report](https://www.therobotreport.com/agility-robotics-digit-humanoid-lands-first-official-job/)).

**Measure:** totes per hour, uptime, interventions per shift.

**Maturity:** Early.

**Watch for:** neither company disclosed the number of robots. Compare against conventional conveyors and carts.

### 40. Freight quoting and order-entry agents

**The use case:** AI agents read customer emails, return price quotes, create orders and book appointments.

**Real-world example:** C.H. Robinson said in April 2025 that its AI agents had performed over 3 million shipping tasks, including well over 1 million price quotes and 1 million orders ([C.H. Robinson](https://www.chrobinson.com/en-us/about-us/newsroom/press-releases/2025/ai-performs-over-three-million-shipping-tasks/), company figures).

**Measure:** quote response time, win rate, order errors, shipments per employee.

**Maturity:** Scaling.

**Watch for:** mispriced quotes are repeated at machine speed; set guardrails on margins.

### 41. Autonomous trucks

**The use case:** driverless heavy trucks carry freight on highway routes between hubs.

**Real-world example:** Aurora began commercial driverless trucking between Dallas and Houston in May 2025 ([TechCrunch](https://techcrunch.com/2025/05/01/aurora-launches-commercial-self-driving-truck-service-in-texas/)) and later extended routes toward El Paso and Phoenix.

**Measure:** cost per mile, on-time arrival, safety incidents, hours of operation per truck.

**Maturity:** Early.

**Watch for:** routes are limited, and hubs still need human drivers for the first and last miles.

### 42. Drone delivery

**The use case:** drones deliver small orders from stores directly to homes in minutes.

**Real-world example:** Wing and Walmart announced in June 2025 an expansion of drone delivery to 100 more stores in five metro areas, reporting average delivery times under 19 minutes in existing service ([Wing](https://wing.com/news/wing-and-walmart-announce-world-s-largest-drone-delivery-expansion-ever)).

**Measure:** cost per delivery, delivery time, order size, noise complaints.

**Maturity:** Early.

**Watch for:** weather, airspace rules and payload limits restrict what drones can carry.

### 43. Flight route and fuel optimization

**The use case:** AI suggests flight paths that avoid weather and congestion and reduce fuel burn, for passenger and cargo flights.

**Real-world example:** Alaska Airlines says routes optimized with the Flyways AI platform saved more than 1.2 million gallons of fuel in a year ([Alaska Airlines](https://news.alaskaair.com/sustainability/how-ai-is-helping-alaska-airlines-plan-better-flight-routes-and-lower-emissions/), company figures).

**Measure:** fuel per flight, flight time, dispatcher acceptance rate.

**Maturity:** Scaling.

**Watch for:** dispatchers and air traffic control keep final authority.

### 44. Arrival-time prediction

**The use case:** models predict when shipments and deliveries will arrive, so customers and warehouses can plan.

**Real-world example:** see entry 43 of [100 machine learning applications](/articles/machine-learning-applications).

**Measure:** prediction error, customer contacts asking "where is my order?"

**Maturity:** Established.

**Watch for:** overly optimistic estimates frustrate customers more than honest delays.

### 45. Fleet predictive maintenance

**The use case:** sensor data from trucks, aircraft and trains predicts component failures.

**Real-world example:** see entry 46 of [100 machine learning applications](/articles/machine-learning-applications).

**Measure:** road calls, unplanned downtime, maintenance cost per mile.

**Maturity:** Established.

**Watch for:** safety-critical maintenance still follows regulated schedules; predictions add to them, not replace them.

### 46. Maritime efficiency and monitoring

**The use case:** models optimize ship speed and routes for fuel and monitor vessel activity from satellite and transponder data.

**Real-world example:** see entry 49 of [100 machine learning applications](/articles/machine-learning-applications).

**Measure:** fuel per voyage, emissions, schedule reliability.

**Maturity:** Scaling.

**Watch for:** port congestion and weather often matter more than route choice.

### 47. Dispatch and dynamic pricing for delivery networks

**The use case:** algorithms match drivers to jobs and set prices in real time.

**Real-world example:** see entry 45 of [100 machine learning applications](/articles/machine-learning-applications).

**Measure:** wait time, utilization, driver earnings per hour.

**Maturity:** Established.

**Watch for:** opaque algorithmic pay and assignment draw regulatory scrutiny, including under the EU's platform work rules.

### 48. Weather-aware planning

**The use case:** better medium-range forecasts help plan routes, staffing and inventory ahead of storms and heat.

**Real-world example:** the European Centre for Medium-Range Weather Forecasts made its AI forecasting system operational in February 2025 and an AI ensemble operational in July 2025 ([ECMWF](https://www.ecmwf.int/en/about/media-centre/news/2025/ecmwfs-ensemble-ai-forecasts-become-operational)).

**Measure:** weather-related delays, emergency shipping costs, stockouts before storms.

**Maturity:** Scaling.

**Watch for:** forecasts are probabilities; plans need thresholds for acting on them.

### 49. Reading shipping documents

**The use case:** AI extracts data from bills of lading, invoices, customs forms and emails, which are still often PDFs or free text.

**Real-world example:** freight brokers such as C.H. Robinson use generative AI to read emailed orders and create shipments automatically (entry 40). Document extraction is one of the most common first generative AI projects in logistics.

**Measure:** documents processed without human touch, extraction error rate, customs delays.

**Maturity:** Scaling.

**Watch for:** customs and invoicing errors carry fines and payment disputes; keep human review for exceptions.

### 50. Planning for warehouse workforce change

**The use case:** not a tool but a consequence: automation changes how many and which people warehouses need.

**Real-world example:** internal Amazon documents reported by the *New York Times* in October 2025 projected that automation could let the company avoid hiring more than 600,000 U.S. workers by 2033 while sales grow; Amazon said the documents reflected one team's view, not its overall hiring strategy ([Computerworld](https://www.computerworld.com/article/4076455/data-amazon-to-replace-600000-workers-with-robots.html)).

**Measure:** injury rates, retention, internal promotions into technical roles, headcount per unit shipped.

**Maturity:** Scaling.

**Watch for:** fewer injuries and new technician roles are real benefits, but they rarely match the number of roles automated. Training and redeployment need a plan.

## What the 50 use cases have in common

- **Established use cases are predictive, not generative.** Forecasting, inspection, maintenance and routing have years of evidence. Generative AI is newest in catalog content, customer service and freight paperwork.
- **Robotics is moving fastest and remains early.** Warehouse fleets are scaling; humanoids and general robot models are still at the pilot stage.
- **Leading companies report big numbers; check them.** Most figures here are company-reported or from Lighthouse profiles. Ask for the baseline and whether the result held for a year.
- **Retreats are informative.** Amazon's checkout-free grocery stores and OpenAI's in-chat checkout show that impressive technology still has to beat simpler alternatives on cost and customer preference.
- **People stay in the loop.** Technicians, dispatchers, store staff and claims handlers review AI outputs in nearly every successful case.

## A one-page plan for your first AI use case

1. **Choose from the "Established" or "Scaling" list** unless you have a strong reason to pilot an "Early" one.
2. **Write the metric you will move** and its current baseline.
3. **List the data you have,** and how much is labeled.
4. **Decide the human checkpoint:** who reviews outputs, and how often.
5. **Pilot in one site or category with a comparison group** for at least one full business cycle.
6. **Plan for drift:** retraining when products, suppliers, cameras or seasons change.
7. **Plan for people:** which roles change, what training they need, and how you will communicate it.

## Where to go next

- Read the methods behind forecasting, inspection and routing in [100 machine learning applications across industries](/articles/machine-learning-applications) and [100 machine learning algorithms explained](/articles/machine-learning-algorithms-explained).
- See how AI changes marketing, sales and back-office work in [40 ways AI is changing business operations, marketing and sales](/articles/ai-in-business-operations-marketing-sales).
- For workforce effects, read [75 examples of how AI is changing the future of work](/articles/ai-future-of-work-examples).
- Try a small forecasting or inspection model yourself with [101 machine learning projects](/articles/machine-learning-projects).

## References

Sources are linked in each entry. Broader references:

1. World Economic Forum. Global Lighthouse Network announcements, September 2025 and January 2026. [weforum.org](https://www.weforum.org/press/2025/09/global-lighthouse-network-2025-world-economic-forum-recognizes-12-new-sites-driving-holistic-transformation-in-manufacturing/)
2. BMW Group (2025). "BMW Group scales Virtual Factory." [press.bmwgroup.com](https://www.press.bmwgroup.com/global/article/detail/T0450699EN/bmw-group-scales-virtual-factory)
3. Amazon (July 2025). "Amazon deploys its 1 millionth robot and launches a new AI foundation model." [aboutamazon.com](https://www.aboutamazon.com/news/operations/amazon-million-robots-ai-foundation-model)
4. Van Hoek, R., DeWitt, M., Lacity, M., et al. (2022). "How Walmart Automated Supplier Negotiations." *Harvard Business Review*. [hbr.org](https://hbr.org/2022/11/how-walmart-automated-supplier-negotiations)
5. European Centre for Medium-Range Weather Forecasts (2025). "ECMWF's ensemble AI forecasts become operational." [ecmwf.int](https://www.ecmwf.int/en/about/media-centre/news/2025/ecmwfs-ensemble-ai-forecasts-become-operational)
