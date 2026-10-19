---
title: 100 Best Machine Learning Datasets for AI Projects, Research, and Practice
seoTitle: 100 Machine Learning Datasets for AI Projects and Research
description: 100 machine learning datasets for tabular, vision, text, audio, time series, recommender and LLM work, with size, uses, access terms and known pitfalls.
author: BlogAI Editors
authorType: Organization
publishedAt: 2026-10-19
updatedAt: 2026-10-19
status: published
categories:
  - Engineering
tags: [machine learning, datasets, ai, data science, deep learning, benchmarks]
tocDepth: 2
---

The dataset you choose decides what your model can learn, how you can evaluate it, and what you are allowed to do with the result. A famous benchmark is convenient but may be solved, mislabeled or restricted; a messy real-world dataset teaches more but needs more work. This guide describes 100 widely used machine learning datasets across tabular data, computer vision, medicine, language, large language models, audio, time series, recommendation, graphs and reinforcement learning.

For each dataset you get:

- **What it is:** the content and the task it supports.
- **Size:** the number of examples, as reported by the provider. Sizes of living datasets change; check the source.
- **Use it for:** the kind of project or research it suits.
- **Watch out for:** known problems such as label errors, leakage, bias, restrictive terms or personal data.
- **Access:** a link to the official source and the main access condition.

**How we checked.** Every entry links to the dataset's official page, its original paper or its maintainer's repository, and the facts were checked against those sources in October 2026. Licenses and access rules change, and many datasets allow research use only, so read the current terms before using one commercially or redistributing it. Nothing here is legal advice.

Looking for a project to use these with? [101 machine learning projects](/articles/machine-learning-projects) pairs many of them with a full project brief, and [101 Python data science projects](/articles/python-data-science-projects) has more analysis-focused ideas.

## How to choose a dataset

<figure>
<img src="/images/articles/machine-learning-datasets/dataset-choice-flow.svg" alt="A decision flow for choosing a dataset. Start with your goal. To learn a technique, use a small, clean, well-documented dataset. To build a portfolio project, use a real, messy dataset close to a problem you care about. To compare with published research, use the standard benchmark and its official splits. To ship a product, check the license allows commercial use and that the data matches your users. Every path ends with the same checks: license, personal data, label quality, and how the data was split." width="720" height="380" loading="lazy" decoding="async" />
<figcaption>Start from your goal, then run the same four checks on any dataset you pick.</figcaption>
</figure>

Before committing to a dataset, answer five questions:

1. **Does it match the decision you care about?** A model trained on studio product photos may fail on phone photos taken in a shop. Data collected in one country, time period or hospital may not transfer to another.
2. **What may you do with it?** Look for the license (CC BY, CC BY-NC, ODC-By, custom research terms) and any data use agreement. "Publicly downloadable" does not mean "free to use commercially".
3. **Does it contain personal data?** Faces, voices, medical records, emails and location traces carry legal and ethical obligations even when public.
4. **How good are the labels?** Many benchmarks contain label errors; one study estimated an average of at least 3.3% errors across the test sets of ten popular datasets ([Northcutt, Athalye and Mueller, 2021](https://arxiv.org/abs/2103.14749)).
5. **How should it be split?** Use the official split when comparing with published work. Otherwise split by time, user, patient or location when rows are related, so the test set represents genuinely new cases.

<figure>
<img src="/images/articles/machine-learning-datasets/data-splits.svg" alt="Three ways to split the same 24 rows into training and test sets. A random split scatters test rows everywhere. A group split keeps all rows from the same patient or user together, so whole groups are held out. A time split trains on earlier rows and tests on the latest rows." width="720" height="300" loading="lazy" decoding="async" />
<figcaption>Random splits are only safe when rows are independent. For data with repeated users, patients or locations, hold out whole groups; for anything you will forecast, hold out the latest period.</figcaption>
</figure>

A quick audit catches many problems before you train anything. This snippet runs offline on a dataset bundled with scikit-learn and checks the label balance, missing values, duplicate rows and exact duplicates shared between the training and test sets:

```python
import numpy as np
import pandas as pd
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split

X, y = load_digits(return_X_y=True, as_frame=True)
print("rows, columns:", X.shape)
print("class balance (min, max share):", round(y.value_counts(normalize=True).min(), 3), round(y.value_counts(normalize=True).max(), 3))
print("missing values:", int(X.isna().sum().sum()))
print("duplicate rows:", int(X.duplicated().sum()))
X_train, X_test = train_test_split(X, random_state=0)
shared = pd.merge(X_train.drop_duplicates(), X_test.drop_duplicates(), how="inner")
print("test rows that also appear in training:", len(shared))
```

```text
rows, columns: (1797, 64)
class balance (min, max share): 0.097 0.102
missing values: 0
duplicate rows: 0
test rows that also appear in training: 0
```

## Where to find datasets

These repositories are good starting points, and most datasets below are also mirrored on one or more of them:

- **[UCI Machine Learning Repository](https://archive.ics.uci.edu/):** hundreds of classic, mostly tabular datasets with documentation.
- **[OpenML](https://www.openml.org/):** thousands of datasets with standardized tasks, splits and benchmark results, accessible from Python with `sklearn.datasets.fetch_openml`.
- **[Hugging Face Datasets](https://huggingface.co/datasets):** text, audio, vision and LLM datasets with dataset cards and a common loading API.
- **[Kaggle Datasets](https://www.kaggle.com/datasets):** community-uploaded datasets and competitions; check each upload's provenance and license carefully.
- **[Google Dataset Search](https://datasetsearch.research.google.com/):** a search engine over dataset metadata published across the web.
- **Government open data portals** such as [data.gov](https://data.gov/), [data.europa.eu](https://data.europa.eu/) and [data.gov.in](https://www.data.gov.in/), for public statistics and administrative data.
- **[Registry of Open Data on AWS](https://registry.opendata.aws/):** large scientific and public datasets hosted in the cloud.

Papers with Code, long a popular index of benchmarks and leaderboards, was shut down in July 2025; its data is archived on GitHub, and Hugging Face launched a "Trending Papers" page in its place.

<figure>
<img src="/images/articles/machine-learning-datasets/dataset-sizes-log-scale.svg" alt="Horizontal bar chart on a logarithmic scale of the sizes of 13 datasets: Iris 150 flowers, Breast Cancer Wisconsin 569 cases, CIFAR-10 60,000 images, MNIST 70,000 images, Credit Card Fraud 284,807 transactions, COCO about 330,000 images, Covertype 581,012 rows, ImageNet-1k training set 1.3 million images, iNaturalist 2021 training set 2.7 million images, HIGGS 11 million rows, MovieLens 32M 32 million ratings, Netflix Prize 100.5 million ratings and Amazon Reviews 2023 571.5 million reviews." width="720" height="400" loading="lazy" decoding="async" />
<figcaption>Dataset sizes span seven orders of magnitude, so the axis is logarithmic: each gridline is ten times the one before. Units differ by dataset (rows, images or ratings), as labeled.</figcaption>
</figure>

## Tabular datasets

Tables of rows and columns are what most business and scientific machine learning runs on. Small classic datasets are good for learning; for a portfolio or research, prefer larger, messier ones.

### 1. Iris

- **What it is:** measurements of sepals and petals for three iris species, introduced in [Fisher (1936)](https://doi.org/10.1111/j.1469-1809.1936.tb02137.x).
- **Size:** 150 flowers, 4 features, 3 balanced classes.
- **Use it for:** a first classification or clustering exercise; it is bundled with scikit-learn as `load_iris`.
- **Watch out for:** it is too small and too easy to show differences between serious models.
- **Access:** [UCI](https://archive.ics.uci.edu/dataset/53/iris), CC BY 4.0.

### 2. Palmer Penguins

- **What it is:** body measurements of three penguin species near Palmer Station, Antarctica, collected by Dr. Kristen Gorman, offered as a modern alternative to Iris.
- **Size:** 344 penguins, with some missing values.
- **Use it for:** teaching cleaning, plotting and classification with a realistic amount of messiness.
- **Watch out for:** small sample; species are easy to separate.
- **Access:** [palmerpenguins](https://allisonhorst.github.io/palmerpenguins/), CC0.

### 3. Titanic

- **What it is:** passenger records from the Titanic with whether each passenger survived; Kaggle's introductory competition.
- **Size:** 891 training rows and 418 test rows without labels.
- **Use it for:** learning feature engineering (titles from names, family size) and the Kaggle workflow.
- **Watch out for:** so widely used that it adds little to a portfolio; the full passenger list is public, so leaderboard scores near 100% are not credible.
- **Access:** [Kaggle Titanic competition](https://www.kaggle.com/c/titanic), free account.

### 4. Wine

- **What it is:** results of a chemical analysis of wines from three grape cultivars grown in the same region of Italy.
- **Size:** 178 wines, 13 features, 3 classes.
- **Use it for:** demonstrating why feature scaling matters for distance-based models; bundled with scikit-learn as `load_wine`.
- **Watch out for:** too small and easy for model comparisons. (The larger [Wine Quality](https://archive.ics.uci.edu/dataset/186/wine+quality) dataset, with 6,497 wines rated by tasters, is a different dataset.)
- **Access:** [UCI](https://archive.ics.uci.edu/dataset/109/wine), CC BY 4.0.

### 5. Breast Cancer Wisconsin (Diagnostic)

- **What it is:** features computed from images of breast-mass cell nuclei, labeled malignant or benign.
- **Size:** 569 cases, 30 features.
- **Use it for:** binary classification, threshold selection and calibration exercises; bundled with scikit-learn as `load_breast_cancer`.
- **Watch out for:** a small, single-institution dataset from the early 1990s; results say nothing about modern diagnostic performance.
- **Access:** [UCI](https://archive.ics.uci.edu/dataset/17/breast+cancer+wisconsin+diagnostic), CC BY 4.0.

### 6. Adult (Census Income)

- **What it is:** person records extracted from the 1994 U.S. Census, labeled by whether income exceeded \$50,000.
- **Size:** 48,842 rows, 14 attributes.
- **Use it for:** classification with mixed feature types, and as a classic fairness benchmark.
- **Watch out for:** the income threshold is not adjusted for inflation and the data is three decades old; researchers have argued it should be retired as a fairness benchmark ([Ding et al., 2021](https://arxiv.org/abs/2108.04884)).
- **Access:** [UCI](https://archive.ics.uci.edu/dataset/2/adult), CC BY 4.0.

### 7. Folktables (American Community Survey tasks)

- **What it is:** a Python package that builds prediction tasks (income, employment, health coverage, commute time) from U.S. Census Bureau American Community Survey microdata, proposed as a replacement for Adult.
- **Size:** millions of person records, selectable by state and year.
- **Use it for:** fairness research and studying distribution shift across states and years.
- **Watch out for:** you must define the task carefully; results vary by state and year, which is the point.
- **Access:** [folktables on GitHub](https://github.com/socialfoundations/folktables), with ACS data from the Census Bureau.

### 8. California Housing

- **What it is:** median house values for California census block groups from the 1990 census, with income, house age, rooms, population and location ([Pace and Barry, 1997](https://doi.org/10.1016/S0167-7152(96)00140-X)).
- **Size:** 20,640 block groups, 8 features.
- **Use it for:** regression and spatial error analysis; available through `sklearn.datasets.fetch_california_housing`.
- **Watch out for:** the target is capped at \$500,000, so the most expensive areas are censored; the data is from 1990.
- **Access:** via scikit-learn (downloads from its mirror on first use).

### 9. Ames Housing

- **What it is:** sales of individual homes in Ames, Iowa, from 2006 to 2010, compiled as a teaching replacement for the Boston Housing data ([De Cock, 2011](https://doi.org/10.1080/10691898.2011.11889627)).
- **Size:** 2,930 sales, about 80 variables.
- **Use it for:** realistic regression with many categorical and missing values; Kaggle's "House Prices" competition uses it.
- **Watch out for:** a few very large houses are outliers that the author recommends removing. Avoid the older Boston Housing dataset: scikit-learn removed it in version 1.2 because one feature was constructed on a racist assumption.
- **Access:** [Journal of Statistics Education data archive](https://jse.amstat.org/v19n3/decock.pdf) (paper with data links), or `fetch_openml(name="house_prices")`.

### 10. Bank Marketing

- **What it is:** phone marketing campaigns of a Portuguese bank, labeled by whether the client subscribed to a term deposit ([Moro, Cortez and Rita, 2014](https://doi.org/10.1016/j.dss.2014.03.001)).
- **Size:** 45,211 calls in the full version.
- **Use it for:** imbalanced classification and campaign targeting.
- **Watch out for:** the `duration` column (call length) is known only after the call ends; the dataset's own documentation says to drop it for a realistic model. Keeping it is a classic leak.
- **Access:** [UCI](https://archive.ics.uci.edu/dataset/222/bank+marketing), CC BY 4.0.

### 11. Credit Card Fraud Detection

- **What it is:** two days of card transactions by European cardholders in September 2013, released by the Machine Learning Group of the Université Libre de Bruxelles.
- **Size:** 284,807 transactions, of which 492 (about 0.17%) are fraud.
- **Use it for:** extreme class imbalance and precision–recall evaluation.
- **Watch out for:** 28 of the 30 features are anonymized principal components, so feature engineering and explanation are limited; accuracy is meaningless here (see the chart below).
- **Access:** [Kaggle](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud), Open Database License.

<figure>
<img src="/images/articles/machine-learning-datasets/class-imbalance-fraud.svg" alt="A horizontal bar representing 284,807 card transactions: 284,315 legitimate (99.83%) and 492 frauds (0.17%), with the fraud slice drawn 20 times wider than scale so it is visible. Below, a note says a model that always predicts legitimate is 99.83% accurate but catches none of the 492 frauds." width="720" height="250" loading="lazy" decoding="async" />
<figcaption>Dataset 11: with 492 frauds among 284,807 transactions, a model that never flags fraud is 99.83% accurate and useless. Use precision, recall and the precision–recall curve instead.</figcaption>
</figure>

### 12. Statlog (German Credit Data)

- **What it is:** 1970s–80s loan applicants from a German bank, classified as good or bad credit risks, with a published cost matrix that makes misclassifying a bad applicant five times as costly as the reverse.
- **Size:** 1,000 applicants, 20 attributes.
- **Use it for:** cost-sensitive classification and explainability exercises.
- **Watch out for:** small and old; one attribute mixes sex with marital status, which complicates fairness analysis.
- **Access:** [UCI](https://archive.ics.uci.edu/dataset/144/statlog+german+credit+data), CC BY 4.0.

### 13. Covertype

- **What it is:** forest cover type of 30 × 30 meter cells in the Roosevelt National Forest, Colorado, from cartographic variables.
- **Size:** 581,012 cells, 54 features, 7 classes.
- **Use it for:** a large multiclass problem for benchmarking tree ensembles and tuning strategies; available as `sklearn.datasets.fetch_covtype`.
- **Watch out for:** strong class imbalance; spatial autocorrelation means random splits are optimistic.
- **Access:** [UCI](https://archive.ics.uci.edu/dataset/31/covertype), CC BY 4.0.

### 14. HIGGS

- **What it is:** simulated particle collisions, labeled as Higgs boson signal or background ([Baldi, Sadowski and Whiteson, 2014](https://doi.org/10.1038/ncomms5308)).
- **Size:** 11 million events, 28 features (21 low-level and 7 physicist-designed).
- **Use it for:** scaling experiments for boosting and neural networks.
- **Watch out for:** simulated data; the last 500,000 rows are the conventional test set.
- **Access:** [UCI](https://archive.ics.uci.edu/dataset/280/higgs), CC BY 4.0.

### 15. Online Retail II

- **What it is:** all transactions of a UK-based online gift retailer from December 2009 to December 2011, including returns.
- **Size:** about one million transaction lines.
- **Use it for:** customer lifetime value, segmentation, basket analysis and demand forecasting.
- **Watch out for:** cancellations are coded in the invoice number, some rows lack a customer ID, and many customers are wholesalers.
- **Access:** [UCI](https://archive.ics.uci.edu/dataset/502/online+retail+ii), CC BY 4.0.

### 16. Diabetes 130-US Hospitals

- **What it is:** hospital encounters of diabetic patients at 130 U.S. hospitals from 1999 to 2008, with whether the patient was readmitted ([Strack et al., 2014](https://doi.org/10.1155/2014/781670)).
- **Size:** 101,766 encounters, about 50 features.
- **Use it for:** readmission prediction with realistic healthcare data issues.
- **Watch out for:** many patients have several encounters, so split by patient; missing values are coded as "?"; diagnosis codes need grouping.
- **Access:** [UCI](https://archive.ics.uci.edu/dataset/296/diabetes+130-us+hospitals+for+years+1999-2008), CC BY 4.0.

### 17. Mushroom

- **What it is:** descriptions of hypothetical samples of 23 species of gilled mushrooms from a field guide, labeled edible or poisonous.
- **Size:** 8,124 samples, 22 categorical attributes.
- **Use it for:** learning rule-based and tree models on categorical data.
- **Watch out for:** perfect accuracy is easy, so it cannot separate models; never use any model to decide what is safe to eat.
- **Access:** [UCI](https://archive.ics.uci.edu/dataset/73/mushroom), CC BY 4.0.

### 18. OpenML-CC18 benchmark suite

- **What it is:** a curated suite of 72 classification datasets with standardized tasks and splits ([Bischl et al., 2021](https://arxiv.org/abs/1708.03731)).
- **Size:** datasets from hundreds to about 100,000 rows.
- **Use it for:** fair comparisons of tabular methods across many datasets rather than one.
- **Watch out for:** conclusions depend on the tuning budget you give each method; report it.
- **Access:** [OpenML](https://www.openml.org/search?type=study&study_type=task&id=99), with the `openml` Python package.

## Computer vision datasets

### 19. MNIST

- **What it is:** grayscale images of handwritten digits, 28 × 28 pixels, built from NIST data ([LeCun et al., 1998](https://doi.org/10.1109/5.726791)).
- **Size:** 60,000 training and 10,000 test images.
- **Use it for:** a first neural network; testing that a training loop works.
- **Watch out for:** effectively solved (well-tuned models make only a handful of errors per thousand), so it no longer separates modern methods.
- **Access:** available through `torchvision.datasets.MNIST`, Keras and OpenML.

### 20. Fashion-MNIST

- **What it is:** Zalando product images of 10 clothing types, in the same format as MNIST so it can be dropped in as a harder replacement ([Xiao, Rasul and Vollgraf, 2017](https://arxiv.org/abs/1708.07747)).
- **Size:** 60,000 training and 10,000 test images.
- **Use it for:** quick experiments with CNNs, autoencoders and GANs.
- **Watch out for:** still small and low-resolution; some classes (shirt, T-shirt, pullover) are genuinely ambiguous.
- **Access:** [GitHub](https://github.com/zalandoresearch/fashion-mnist), MIT license.

### 21. EMNIST

- **What it is:** handwritten letters and digits from NIST Special Database 19, converted to MNIST's format ([Cohen et al., 2017](https://arxiv.org/abs/1702.05373)).
- **Size:** 814,255 characters in the full "ByClass" split, with balanced and letters-only subsets.
- **Use it for:** a step up from MNIST with 26 or 62 classes.
- **Watch out for:** upper- and lower-case letters such as "c" and "C" are hard to tell apart even for people.
- **Access:** [NIST](https://www.nist.gov/itl/products-and-services/emnist-dataset); also in `torchvision.datasets.EMNIST`.

### 22. CIFAR-10 and CIFAR-100

- **What it is:** small color photos (32 × 32) of everyday objects collected by Alex Krizhevsky, Vinod Nair and Geoffrey Hinton.
- **Size:** 60,000 images each; CIFAR-10 has 10 classes of 6,000 images, CIFAR-100 has 100 classes of 600.
- **Use it for:** training CNNs and vision transformers from scratch on modest hardware, and ablation studies.
- **Watch out for:** the images come from the 80 Million Tiny Images collection, which was withdrawn in 2020 over offensive labels and images; CIFAR itself was hand-filtered, but know its origin.
- **Access:** [University of Toronto](https://www.cs.toronto.edu/~kriz/cifar.html).

### 23. SVHN (Street View House Numbers)

- **What it is:** digits cropped from house-number photos in Google Street View ([Netzer et al., 2011](http://ufldl.stanford.edu/housenumbers/nips2011_housenumbers.pdf)).
- **Size:** 73,257 training, 26,032 test and 531,131 extra digit images.
- **Use it for:** a real-world digit task with blur, lighting changes and distracting neighboring digits.
- **Watch out for:** non-commercial use only.
- **Access:** [Stanford](http://ufldl.stanford.edu/housenumbers/).

### 24. ImageNet (ILSVRC 2012)

- **What it is:** the image classification benchmark that drove the deep learning revolution, organized by WordNet categories ([Russakovsky et al., 2015](https://arxiv.org/abs/1409.0575)).
- **Size:** about 1.28 million training images, 50,000 validation images, 1,000 classes.
- **Use it for:** pretraining and benchmarking image models; most pretrained vision models report ImageNet accuracy.
- **Watch out for:** access requires agreeing to non-commercial research terms; images may be copyrighted; the dataset has label errors and multi-object images; its curators later blurred faces in the benchmark images over privacy concerns ([Yang et al., 2021](https://arxiv.org/abs/2103.06191)).
- **Access:** [image-net.org](https://www.image-net.org/), registration required.

### 25. ImageNetV2

- **What it is:** a new test set built by following ImageNet's original collection process a decade later ([Recht et al., 2019](https://arxiv.org/abs/1902.10811)).
- **Size:** 10,000 images in three variants.
- **Use it for:** checking whether a model generalizes beyond the original test set.
- **Watch out for:** the authors found accuracy drops of 11–14 percentage points for ImageNet models on the new test set, a reminder that benchmark scores overstate real-world performance.
- **Access:** [GitHub](https://github.com/modestyachts/ImageNetV2), also on Hugging Face.

### 26. COCO (Common Objects in Context)

- **What it is:** everyday scenes with multiple objects, annotated for detection, segmentation, keypoints and captions ([Lin et al., 2014](https://arxiv.org/abs/1405.0312)).
- **Size:** about 330,000 images, over 200,000 labeled, with 1.5 million object instances in 80 object categories and five captions per image.
- **Use it for:** object detection, instance segmentation, pose estimation and image captioning; the standard detection benchmark.
- **Watch out for:** images come from Flickr under various Creative Commons licenses; small objects and crowds have noisier annotations.
- **Access:** [cocodataset.org](https://cocodataset.org/), annotations CC BY 4.0.

### 27. PASCAL VOC

- **What it is:** the main detection and segmentation benchmark before COCO, from the PASCAL Visual Object Classes challenge that ran from 2005 to 2012 ([Everingham et al., 2010](https://doi.org/10.1007/s11263-009-0275-4)).
- **Size:** VOC 2012 has 11,530 images with 27,450 annotated objects in 20 classes for detection.
- **Use it for:** learning detection and segmentation on a manageable dataset.
- **Watch out for:** only 20 classes, and the official evaluation server is no longer the main way results are compared.
- **Access:** [PASCAL VOC](http://host.robots.ox.ac.uk/pascal/VOC/), also in `torchvision.datasets`.

### 28. Open Images

- **What it is:** a large, diverse dataset from Google with image-level labels, bounding boxes, segmentation masks, visual relationships and localized narratives ([Kuznetsova et al., 2020](https://arxiv.org/abs/1811.00982)).
- **Size:** about 9 million images; 16 million bounding boxes for 600 classes on 1.9 million of them.
- **Use it for:** large-scale detection and multi-label classification.
- **Watch out for:** images are Flickr links that can disappear; machine-generated labels are mixed with human-verified ones, so check which you are using.
- **Access:** [Google Open Images](https://storage.googleapis.com/openimages/web/index.html), annotations CC BY 4.0.

### 29. Cityscapes

- **What it is:** street scenes from cars driving in 50 cities, mostly in Germany, annotated pixel by pixel ([Cordts et al., 2016](https://arxiv.org/abs/1604.01685)).
- **Size:** 5,000 images with fine annotations and 20,000 with coarse annotations.
- **Use it for:** semantic and instance segmentation for driving.
- **Watch out for:** limited geographic and weather diversity; registration and non-commercial terms.
- **Access:** [cityscapes-dataset.com](https://www.cityscapes-dataset.com/), registration required.

### 30. KITTI

- **What it is:** driving data from Karlsruhe, Germany, with stereo cameras, LiDAR and GPS, and benchmarks for stereo, optical flow, odometry and 3-D detection ([Geiger, Lenz and Urtasun, 2012](https://www.cvlibs.net/publications/Geiger2012CVPR.pdf)).
- **Size:** a few hours of driving split across many benchmark tasks.
- **Use it for:** 3-D object detection, depth estimation and visual odometry.
- **Watch out for:** small by modern standards and recorded in one city in good weather; CC BY-NC-SA.
- **Access:** [cvlibs.net/datasets/kitti](https://www.cvlibs.net/datasets/kitti/).

### 31. nuScenes

- **What it is:** a full autonomous-vehicle sensor suite (six cameras, LiDAR, radar) recorded in Boston and Singapore, with 3-D boxes ([Caesar et al., 2020](https://arxiv.org/abs/1903.11027)).
- **Size:** 1,000 driving scenes of 20 seconds each.
- **Use it for:** multi-sensor 3-D detection, tracking and prediction.
- **Watch out for:** non-commercial license; large download.
- **Access:** [nuscenes.org](https://www.nuscenes.org/), registration required.

### 32. ADE20K

- **What it is:** scenes annotated densely with objects and object parts, used for the MIT Scene Parsing benchmark ([Zhou et al., 2017](https://arxiv.org/abs/1608.05442)).
- **Size:** the scene-parsing benchmark has 20,210 training and 2,000 validation images with 150 classes.
- **Use it for:** semantic segmentation of indoor and outdoor scenes.
- **Watch out for:** a long tail of rare classes; check the terms on the official site.
- **Access:** [ADE20K](https://groups.csail.mit.edu/vision/datasets/ADE20K/), registration required for the full dataset.

### 33. CelebA

- **What it is:** celebrity face images with 40 binary attribute labels and facial landmarks ([Liu et al., 2015](https://arxiv.org/abs/1411.7766)).
- **Size:** 202,599 images of 10,177 people.
- **Use it for:** research on face attributes and generative models.
- **Watch out for:** non-commercial research only; attributes such as "attractive" are subjective and biased; it contains biometric data of real people.
- **Access:** [CUHK MMLab](https://mmlab.ie.cuhk.edu.hk/projects/CelebA.html).

### 34. Labeled Faces in the Wild (LFW)

- **What it is:** face photographs of public figures collected from news images, for face verification (Huang et al., 2007).
- **Size:** 13,233 images of 5,749 people, of whom 1,680 have two or more images.
- **Use it for:** teaching face verification and PCA "eigenfaces"; loadable with `sklearn.datasets.fetch_lfw_people`.
- **Watch out for:** it is not representative of the general population: it skews heavily toward men and lighter-skinned public figures, and benchmark accuracy is close to saturated.
- **Access:** the University of Massachusetts Amherst project site, mirrored by [TensorFlow Datasets](https://www.tensorflow.org/datasets/catalog/lfw) and scikit-learn's loader.

### 35. Oxford-IIIT Pet

- **What it is:** photos of 37 cat and dog breeds with breed labels, head boxes and pixel-level trimaps ([Parkhi et al., 2012](https://www.robots.ox.ac.uk/~vgg/publications/2012/parkhi12a/parkhi12a.pdf)).
- **Size:** about 7,400 images, roughly 200 per breed.
- **Use it for:** fine-grained classification and segmentation with transfer learning.
- **Watch out for:** CC BY-SA 4.0; breeds that look alike are hard even for people.
- **Access:** [Oxford VGG](https://www.robots.ox.ac.uk/~vgg/data/pets/).

### 36. Food-101

- **What it is:** food photos from the website foodspotting.com in 101 dish categories ([Bossard, Guillaumin and Van Gool, 2014](https://data.vision.ee.ethz.ch/cvl/datasets_extra/food-101/)).
- **Size:** 101,000 images: 750 training and 250 test images per class.
- **Use it for:** fine-grained recognition and studying noisy labels.
- **Watch out for:** the training images were deliberately not cleaned and contain some label noise; only the test images were checked by hand.
- **Access:** [ETH Zurich](https://data.vision.ee.ethz.ch/cvl/datasets_extra/food-101/); also in `torchvision.datasets.Food101`.

### 37. iNaturalist 2021

- **What it is:** photos of plants, animals and fungi from the iNaturalist citizen-science platform, labeled to species ([Van Horn et al., 2021](https://arxiv.org/abs/2103.16483)).
- **Size:** 2.7 million training images of 10,000 species.
- **Use it for:** long-tailed, fine-grained classification and biodiversity research.
- **Watch out for:** heavy class imbalance and geographic bias toward regions with many observers.
- **Access:** [GitHub](https://github.com/visipedia/inat_comp/tree/master/2021).

### 38. Places365

- **What it is:** scene photographs (kitchens, beaches, stadiums) for scene recognition ([Zhou et al., 2017](https://doi.org/10.1109/TPAMI.2017.2723009)).
- **Size:** about 1.8 million training images in 365 scene categories in the standard version.
- **Use it for:** scene classification and pretraining for scene understanding.
- **Watch out for:** non-commercial research terms; images are web-collected.
- **Access:** [MIT](http://places2.csail.mit.edu/).

### 39. EuroSAT

- **What it is:** Sentinel-2 satellite image patches labeled with 10 land-use and land-cover classes ([Helber et al., 2019](https://arxiv.org/abs/1709.00029)).
- **Size:** 27,000 patches, with all 13 spectral bands available.
- **Use it for:** remote-sensing classification and multispectral deep learning.
- **Watch out for:** random splits overestimate performance because neighboring patches are similar.
- **Access:** [GitHub](https://github.com/phelber/EuroSAT); Copernicus Sentinel data terms apply.

### 40. Kinetics-700

- **What it is:** YouTube video clips of about 10 seconds, each labeled with one of 700 human actions ([Carreira et al., 2019](https://arxiv.org/abs/1907.06987)).
- **Size:** roughly 650,000 clips.
- **Use it for:** video classification and pretraining video models.
- **Watch out for:** the dataset is distributed as YouTube links, and clips are removed over time, so everyone's copy differs slightly.
- **Access:** [Google DeepMind on GitHub](https://github.com/google-deepmind/kinetics-i3d) and the [Kinetics dataset tools](https://github.com/cvdfoundation/kinetics-dataset).

## Medical and health datasets

Health data is among the most valuable and the most sensitive. Expect credentialing, data use agreements and strict rules against re-identification, and never treat a research model as a diagnostic tool.

### 41. MIMIC-IV

- **What it is:** de-identified electronic health records of patients admitted to the Beth Israel Deaconess Medical Center in Boston, including ICU stays, labs, medications and notes in linked modules ([Johnson et al., 2023](https://doi.org/10.1038/s41597-022-01899-x)).
- **Size:** hundreds of thousands of hospital admissions from 2008 to 2019.
- **Use it for:** clinical prediction (mortality, length of stay, deterioration) and clinical NLP.
- **Watch out for:** access requires credentialing on PhysioNet, completion of human-subjects research training and signing a data use agreement; sharing the data or sending it to third-party services is prohibited.
- **Access:** [PhysioNet](https://physionet.org/content/mimiciv/), credentialed access.

### 42. NIH ChestX-ray14

- **What it is:** frontal chest X-rays from the NIH Clinical Center with 14 disease labels mined from radiology reports by natural language processing ([Wang et al., 2017](https://arxiv.org/abs/1705.02315)).
- **Size:** 112,120 images from 30,805 patients.
- **Use it for:** multi-label medical image classification research.
- **Watch out for:** labels were extracted automatically and independent reviews found many are inaccurate; split by patient, never by image.
- **Access:** [NIH Clinical Center](https://nihcc.app.box.com/v/ChestXray-NIHCC).

### 43. CheXpert

- **What it is:** chest radiographs from Stanford Hospital with 14 observations labeled from reports, including explicit "uncertain" labels ([Irvin et al., 2019](https://arxiv.org/abs/1901.07031)).
- **Size:** 224,316 radiographs of 65,240 patients.
- **Use it for:** chest X-ray classification, especially methods for uncertain labels.
- **Watch out for:** research-use agreement; the validation and test labels come from radiologist panels, but training labels are automatic.
- **Access:** [Stanford AIMI](https://stanfordmlgroup.github.io/competitions/chexpert/), registration required.

### 44. ISIC skin lesion archive

- **What it is:** dermoscopic images of skin lesions from the International Skin Imaging Collaboration, used in annual melanoma-detection challenges.
- **Size:** tens of thousands of images; the 2020 challenge alone released 33,126 training images.
- **Use it for:** lesion classification and segmentation research.
- **Watch out for:** most images are of lighter skin, and models can learn artifacts such as rulers and ink markings instead of the lesion.
- **Access:** [ISIC Archive](https://www.isic-archive.com/), mostly CC BY-NC or CC0 depending on the collection.

### 45. BraTS (Brain Tumor Segmentation)

- **What it is:** multi-parametric MRI scans of brain tumors with expert segmentations, from the annual BraTS challenge that began in 2012 ([Menze et al., 2015](https://doi.org/10.1109/TMI.2014.2377694)).
- **Size:** varies by year; recent editions include over a thousand cases.
- **Use it for:** 3-D medical image segmentation with U-Net-style models.
- **Watch out for:** data and terms differ by challenge year; access is through the challenge platform.
- **Access:** [BraTS challenge information](https://www.synapse.org/brats), registration required.

### 46. MIT-BIH Arrhythmia Database

- **What it is:** two-channel ambulatory ECG recordings annotated beat by beat by cardiologists, a standard reference since 1980 ([Moody and Mark, 2001](https://doi.org/10.1109/51.932724)).
- **Size:** 48 half-hour recordings from 47 subjects.
- **Use it for:** heartbeat classification and signal-processing research.
- **Watch out for:** beats from the same patient appear in both training and test sets in many published papers, which inflates results; use the inter-patient split.
- **Access:** [PhysioNet](https://physionet.org/content/mitdb/), open access.

## Text and natural language processing datasets

### 47. IMDb Large Movie Review Dataset

- **What it is:** movie reviews labeled positive or negative ([Maas et al., 2011](https://aclanthology.org/P11-1015/)).
- **Size:** 50,000 labeled reviews split evenly into training and test sets, plus 50,000 unlabeled reviews.
- **Use it for:** binary sentiment classification and text classification baselines.
- **Watch out for:** near-saturated; reviews are long, so check truncation in transformer models.
- **Access:** [Stanford AI Lab](https://ai.stanford.edu/~amaas/data/sentiment/).

### 48. Stanford Sentiment Treebank (SST)

- **What it is:** movie-review sentences with sentiment labels for every phrase in their parse trees ([Socher et al., 2013](https://aclanthology.org/D13-1170/)).
- **Size:** 11,855 sentences and 215,154 labeled phrases; SST-2 is the binary version used in GLUE.
- **Use it for:** fine-grained (five-class) and binary sentiment, and studying compositional meaning.
- **Watch out for:** short sentences from one domain.
- **Access:** [Stanford NLP](https://nlp.stanford.edu/sentiment/); SST-2 in GLUE.

### 49. AG News

- **What it is:** news headlines and descriptions in four topics (world, sports, business, science/technology), as prepared by [Zhang, Zhao and LeCun (2015)](https://arxiv.org/abs/1509.01626).
- **Size:** 120,000 training and 7,600 test articles.
- **Use it for:** a balanced, mid-sized topic classification benchmark.
- **Watch out for:** older news; a strong linear baseline already scores highly.
- **Access:** loaders in Hugging Face Datasets and TorchText; the [original AG corpus](http://groups.di.unipi.it/~gulli/AG_corpus_of_news_articles.html) was collected by the ComeToMyHead academic news search engine.

### 50. 20 Newsgroups

- **What it is:** Usenet posts from 20 discussion groups in the 1990s.
- **Size:** about 18,846 posts in scikit-learn's version.
- **Use it for:** text classification and clustering; available as `sklearn.datasets.fetch_20newsgroups`.
- **Watch out for:** headers, signatures and quoted replies leak the label; use `remove=("headers", "footers", "quotes")` for a realistic task.
- **Access:** via scikit-learn, or the [original page](http://qwone.com/~jason/20Newsgroups/).

### 51. Yelp Open Dataset

- **What it is:** a subset of Yelp's businesses, reviews, tips and user data, released for academic and personal use.
- **Size:** millions of reviews of businesses in several metropolitan areas.
- **Use it for:** review rating prediction, aspect-based sentiment, recommendation and local business analytics.
- **Watch out for:** Yelp's own dataset terms restrict use and redistribution; reviews are not a random sample of customers.
- **Access:** [Yelp](https://business.yelp.com/data/resources/open-dataset/), terms acceptance required.

### 52. Amazon Reviews 2023

- **What it is:** product reviews and metadata from Amazon collected by Julian McAuley's lab at UC San Diego, with user–item interaction graphs ([Hou et al., 2024](https://arxiv.org/abs/2403.03952)).
- **Size:** about 571 million reviews across 33 product categories, from 1996 to 2023.
- **Use it for:** recommendation, sentiment, and language-model research on product text.
- **Watch out for:** reviews are skewed toward five stars; use one category to start, since the full dataset is very large.
- **Access:** [project page](https://amazon-reviews-2023.github.io/) and [Hugging Face](https://huggingface.co/datasets/McAuley-Lab/Amazon-Reviews-2023).

### 53. SNLI (Stanford Natural Language Inference)

- **What it is:** pairs of sentences labeled as entailment, contradiction or neutral, written by crowd workers from image captions ([Bowman et al., 2015](https://arxiv.org/abs/1508.05326)).
- **Size:** about 570,000 sentence pairs.
- **Use it for:** training and evaluating natural language inference, and sentence-embedding models.
- **Watch out for:** annotation artifacts let a model guess the label from the hypothesis alone, for example negation words signaling contradiction ([Gururangan et al., 2018](https://arxiv.org/abs/1803.02324)).
- **Access:** [Stanford NLP](https://nlp.stanford.edu/projects/snli/), CC BY-SA 4.0.

### 54. MultiNLI

- **What it is:** natural language inference pairs across ten genres of written and spoken English ([Williams, Nangia and Bowman, 2018](https://arxiv.org/abs/1704.05426)).
- **Size:** about 433,000 sentence pairs, with matched and mismatched genre test sets.
- **Use it for:** testing whether inference models generalize across genres; part of GLUE.
- **Watch out for:** shares SNLI's hypothesis-only artifacts.
- **Access:** [NYU](https://cims.nyu.edu/~sbowman/multinli/).

### 55. SQuAD 2.0

- **What it is:** reading-comprehension questions about Wikipedia paragraphs, where the answer is a span of text; version 2.0 adds unanswerable questions ([Rajpurkar, Jia and Liang, 2018](https://arxiv.org/abs/1806.03822)).
- **Size:** over 100,000 answerable and about 50,000 unanswerable questions.
- **Use it for:** extractive question answering and learning when to abstain.
- **Watch out for:** questions were written while looking at the paragraph, so they overlap lexically with the answer text more than real user questions do.
- **Access:** [SQuAD explorer](https://rajpurkar.github.io/SQuAD-explorer/), CC BY-SA 4.0.

### 56. Natural Questions

- **What it is:** real, anonymized Google search queries paired with Wikipedia pages, annotated with long and short answers ([Kwiatkowski et al., 2019](https://aclanthology.org/Q19-1026/)).
- **Size:** 307,373 training examples, plus development and test sets of about 7,800 each.
- **Use it for:** open-domain question answering and retrieval-augmented generation.
- **Watch out for:** many questions have no short answer; evaluation requires care with the official script.
- **Access:** [Google AI](https://ai.google.com/research/NaturalQuestions), CC BY-SA 3.0.

### 57. CoNLL-2003 named-entity recognition

- **What it is:** English and German news text tagged with person, location, organization and miscellaneous entities ([Tjong Kim Sang and De Meulder, 2003](https://aclanthology.org/W03-0419/)).
- **Size:** about 300,000 English tokens in training, development and test sets.
- **Use it for:** the standard NER benchmark.
- **Watch out for:** the English text comes from the Reuters RCV1 corpus, which has its own license; studies have found label errors in the test set.
- **Access:** annotations are described in the shared-task paper; the English text requires the Reuters RCV1 corpus, distributed by NIST under its own agreement. Many libraries, including Hugging Face Datasets, provide loaders.

### 58. WikiText-103

- **What it is:** over 100 million tokens from verified Good and Featured Wikipedia articles, kept with original case and punctuation for language modeling ([Merity et al., 2016](https://arxiv.org/abs/1609.07843)).
- **Size:** 103 million training tokens.
- **Use it for:** training and evaluating small language models and tokenizers.
- **Watch out for:** small by today's standards and now likely present in large models' training data.
- **Access:** [Hugging Face](https://huggingface.co/datasets/Salesforce/wikitext), CC BY-SA.

### 59. GLUE and SuperGLUE

- **What it is:** benchmark suites for general language understanding: nine tasks in GLUE ([Wang et al., 2018](https://arxiv.org/abs/1804.07461)) and eight harder ones in SuperGLUE ([Wang et al., 2019](https://arxiv.org/abs/1905.00537)).
- **Size:** a few hundred to several hundred thousand examples per task.
- **Use it for:** evaluating pretrained text encoders across tasks.
- **Watch out for:** both are saturated by modern models, so use them for learning and smaller models, not to rank frontier systems.
- **Access:** [gluebenchmark.com](https://gluebenchmark.com/) and [super.gluebenchmark.com](https://super.gluebenchmark.com/).

### 60. MS MARCO

- **What it is:** real Bing search queries with passages judged relevant by human annotators ([Bajaj et al., 2016](https://arxiv.org/abs/1611.09268)).
- **Size:** about 8.8 million passages and roughly a million queries in the passage-ranking task.
- **Use it for:** training retrieval and reranking models; the default training set for dense retrievers.
- **Watch out for:** most queries have only one labeled relevant passage, so many unlabeled passages are also relevant; non-commercial research terms.
- **Access:** [microsoft.github.io/msmarco](https://microsoft.github.io/msmarco/).

### 61. BEIR

- **What it is:** a benchmark of 18 retrieval datasets across domains such as science, finance, biomedicine and argument retrieval, for testing zero-shot retrieval ([Thakur et al., 2021](https://arxiv.org/abs/2104.08663)).
- **Size:** varies from a few thousand to millions of documents per dataset.
- **Use it for:** checking whether a retriever generalizes beyond its training domain.
- **Watch out for:** component datasets have different licenses; some require separate download.
- **Access:** [GitHub](https://github.com/beir-cellar/beir).

### 62. FEVER

- **What it is:** claims written by modifying Wikipedia sentences, labeled supported, refuted or not enough information, with evidence sentences ([Thorne et al., 2018](https://arxiv.org/abs/1803.05355)).
- **Size:** 185,445 claims.
- **Use it for:** fact verification and evidence retrieval.
- **Watch out for:** claim-only models score well above chance because of writing artifacts ([Schuster et al., 2019](https://arxiv.org/abs/1908.05267)).
- **Access:** [fever.ai](https://fever.ai/dataset/fever.html).

## Datasets for large language models

These datasets are used to pretrain, instruction-tune and evaluate large language models. Pretraining corpora are measured in tokens (pieces of words) rather than rows.

### 63. Common Crawl

- **What it is:** a nonprofit's open repository of web crawl data, collected since 2008 and released as monthly crawls.
- **Size:** petabytes of raw web pages in total; each crawl holds billions of pages.
- **Use it for:** the raw material for most open web-text corpora, including C4, FineWeb and many others.
- **Watch out for:** unfiltered web text includes spam, duplicates, toxic content, personal data and copyrighted material; use a filtered derivative unless you are studying filtering.
- **Access:** [commoncrawl.org](https://commoncrawl.org/), free, with its terms of use.

### 64. C4 (Colossal Clean Crawled Corpus)

- **What it is:** English web text filtered from one Common Crawl snapshot, created to train the T5 model ([Raffel et al., 2020](https://arxiv.org/abs/1910.10683)).
- **Size:** about 750 GB of text in the English version; multilingual mC4 also exists.
- **Use it for:** pretraining small and medium language models.
- **Watch out for:** an audit found that its blocklist filtering removed disproportionately more text about and by minority groups ([Dodge et al., 2021](https://arxiv.org/abs/2104.08758)).
- **Access:** [Hugging Face (allenai/c4)](https://huggingface.co/datasets/allenai/c4), ODC-By.

### 65. The Pile

- **What it is:** an 825 GiB English corpus combining 22 sources, such as academic papers, code, books and web text, released by EleutherAI ([Gao et al., 2020](https://arxiv.org/abs/2101.00027)).
- **Size:** 825 GiB.
- **Use it for:** understanding how mixed-source corpora are built; many early open models were trained on it.
- **Watch out for:** its Books3 component was taken down in 2023 following copyright complaints, and the original distribution is no longer officially hosted; check what any copy you find contains.
- **Access:** the [paper](https://arxiv.org/abs/2101.00027) documents the components; use maintained alternatives for new work.

### 66. FineWeb and FineWeb-Edu

- **What it is:** cleaned and deduplicated English web text from 96 Common Crawl snapshots, released by Hugging Face with a detailed account of its filtering choices ([Penedo et al., 2024](https://arxiv.org/abs/2406.17557)). FineWeb-Edu is a subset filtered for educational content.
- **Size:** about 15 trillion tokens; sample subsets of 10 billion to 350 billion tokens.
- **Use it for:** pretraining language models and studying data-quality ablations.
- **Watch out for:** web text still contains personal and copyrighted material; use is also subject to Common Crawl's terms.
- **Access:** [Hugging Face (HuggingFaceFW/fineweb)](https://huggingface.co/datasets/HuggingFaceFW/fineweb), ODC-By 1.0.

### 67. Dolma

- **What it is:** an open pretraining corpus from the Allen Institute for AI, built to train the OLMo models, with web text, scientific papers, code, books, social media and encyclopedic content ([Soldaini et al., 2024](https://arxiv.org/abs/2402.00159)).
- **Size:** about 3 trillion tokens in its first release.
- **Use it for:** fully open language-model research, where the training data can be inspected.
- **Watch out for:** check the license of each version and its component sources.
- **Access:** [Hugging Face (allenai/dolma)](https://huggingface.co/datasets/allenai/dolma), ODC-By.

### 68. Wikipedia dumps

- **What it is:** complete database dumps of every Wikipedia language edition, published regularly by the Wikimedia Foundation.
- **Size:** English Wikipedia alone has several million articles.
- **Use it for:** language modeling, retrieval corpora, entity linking and multilingual NLP.
- **Watch out for:** text is CC BY-SA, which requires attribution and share-alike; parse the wiki markup carefully, or use preprocessed versions.
- **Access:** [dumps.wikimedia.org](https://dumps.wikimedia.org/) and [Hugging Face (wikimedia/wikipedia)](https://huggingface.co/datasets/wikimedia/wikipedia).

### 69. databricks-dolly-15k

- **What it is:** instruction–response pairs written by Databricks employees across categories such as brainstorming, classification, closed question answering and summarization.
- **Size:** about 15,000 records.
- **Use it for:** instruction-tuning small open models with data licensed for commercial use.
- **Watch out for:** written by one company's employees in a short period; some responses copy Wikipedia text.
- **Access:** [Hugging Face](https://huggingface.co/datasets/databricks/databricks-dolly-15k), CC BY-SA 3.0.

### 70. OpenAssistant Conversations (OASST1)

- **What it is:** human-written, human-ranked assistant conversations collected by the OpenAssistant project through crowd-sourcing ([Köpf et al., 2023](https://arxiv.org/abs/2304.07327)).
- **Size:** about 161,000 messages in 35 languages, organized into conversation trees with quality ratings.
- **Use it for:** supervised fine-tuning and preference modeling.
- **Watch out for:** volunteer contributors are not representative of all users; quality varies across languages.
- **Access:** [Hugging Face (OpenAssistant/oasst1)](https://huggingface.co/datasets/OpenAssistant/oasst1), Apache 2.0.

### 71. MMLU

- **What it is:** multiple-choice questions across 57 subjects, from elementary mathematics to law and medicine, for measuring knowledge and reasoning ([Hendrycks et al., 2020](https://arxiv.org/abs/2009.03300)).
- **Size:** 15,908 questions, of which 14,042 are in the test set.
- **Use it for:** a broad first check of a language model's knowledge.
- **Watch out for:** near-saturated by frontier models, contains some wrong answer keys, and is likely present in training data; harder successors exist.
- **Access:** [GitHub](https://github.com/hendrycks/test), MIT license.

### 72. HumanEval

- **What it is:** hand-written Python programming problems with unit tests, introduced with OpenAI's Codex model ([Chen et al., 2021](https://arxiv.org/abs/2107.03374)).
- **Size:** 164 problems.
- **Use it for:** measuring functional correctness of generated code with the pass@k metric.
- **Watch out for:** small, mostly simple problems; run generated code in a sandbox.
- **Access:** [GitHub (openai/human-eval)](https://github.com/openai/human-eval), MIT license.

### 73. GSM8K

- **What it is:** grade-school math word problems that need two to eight steps of arithmetic reasoning, with worked solutions ([Cobbe et al., 2021](https://arxiv.org/abs/2110.14168)).
- **Size:** 8,500 problems: 7,473 for training and 1,319 for testing.
- **Use it for:** evaluating and training step-by-step reasoning.
- **Watch out for:** contamination is widespread; perturbed versions with changed numbers often reveal lower scores.
- **Access:** [GitHub (openai/grade-school-math)](https://github.com/openai/grade-school-math), MIT license.

## Speech and audio datasets

### 74. LibriSpeech

- **What it is:** read English speech from LibriVox public-domain audiobooks, aligned with text ([Panayotov et al., 2015](https://doi.org/10.1109/ICASSP.2015.7178964)).
- **Size:** about 1,000 hours at 16 kHz.
- **Use it for:** training and benchmarking speech recognition; "test-clean" and "test-other" are standard test sets.
- **Watch out for:** read speech is far easier than conversational or noisy speech.
- **Access:** [OpenSLR](https://www.openslr.org/12), CC BY 4.0.

### 75. Mozilla Common Voice

- **What it is:** crowd-sourced recordings of volunteers reading sentences, validated by other volunteers, in a very large number of languages.
- **Size:** the dataset repository listed release 26.0 (June 2026) covering 294 languages for scripted speech; hours per language vary from minutes to thousands.
- **Use it for:** speech recognition for languages with little other data, and accent studies.
- **Watch out for:** audio quality and speaker balance vary; you must agree not to try to identify speakers.
- **Access:** [Common Voice datasets](https://commonvoice.mozilla.org/en/datasets), CC0.

### 76. Speech Commands

- **What it is:** one-second recordings of short spoken words such as "yes", "no", "up" and digits, for keyword spotting ([Warden, 2018](https://arxiv.org/abs/1804.03209)).
- **Size:** 105,829 utterances of 35 words in version 2.
- **Use it for:** small on-device audio models.
- **Watch out for:** use the official speaker-separated split lists.
- **Access:** via `torchaudio.datasets.SPEECHCOMMANDS` and TensorFlow Datasets, CC BY 4.0.

### 77. VoxCeleb

- **What it is:** speech of celebrities extracted from YouTube interview videos, for speaker identification and verification ([Nagrani, Chung and Zisserman, 2017](https://arxiv.org/abs/1706.08612)).
- **Size:** VoxCeleb1 has over 100,000 utterances from 1,251 people; VoxCeleb2 has over a million from 6,112.
- **Use it for:** speaker recognition research.
- **Watch out for:** distributed as links and metadata, with videos disappearing over time; it is biometric data.
- **Access:** [Oxford VGG](https://www.robots.ox.ac.uk/~vgg/data/voxceleb/).

### 78. AudioSet

- **What it is:** 10-second YouTube clips labeled with sound events from a hierarchical ontology of 632 classes ([Gemmeke et al., 2017](https://research.google/pubs/audio-set-an-ontology-and-human-labeled-dataset-for-audio-events/)).
- **Size:** about 2.1 million clips with 527 labels in the released data.
- **Use it for:** pretraining audio classifiers and sound event detection.
- **Watch out for:** released as features and YouTube IDs, and many videos are no longer available; labels are weak (clip level, not time-stamped).
- **Access:** [research.google.com/audioset](https://research.google.com/audioset/), CC BY 4.0 for the labels.

### 79. ESC-50

- **What it is:** environmental sound recordings (dog barks, rain, chainsaws) from Freesound, in 50 balanced classes ([Piczak, 2015](https://doi.org/10.1145/2733373.2806390)).
- **Size:** 2,000 five-second clips, 40 per class, in five predefined folds.
- **Use it for:** a clean, small benchmark for audio classification.
- **Watch out for:** use the provided folds; clips cut from the same original recording are kept within one fold.
- **Access:** [GitHub (karolpiczak/ESC-50)](https://github.com/karolpiczak/ESC-50), CC BY-NC.

### 80. GTZAN genre collection

- **What it is:** 30-second music clips in 10 genres, collected by George Tzanetakis around 2000 ([Tzanetakis and Cook, 2002](https://doi.org/10.1109/TSA.2002.800560)).
- **Size:** 1,000 clips.
- **Use it for:** studying how dataset faults distort results.
- **Watch out for:** Sturm documented repeated clips, mislabelings and distortions, and showed that many published results are unreliable ([Sturm, 2013](https://arxiv.org/abs/1306.1461)); use FMA for serious work.
- **Access:** available on Kaggle and Hugging Face mirrors; the original host is unreliable.

## Time series and forecasting datasets

### 81. M4 competition

- **What it is:** 100,000 real time series (business, finance, demographics, industry) at yearly to hourly frequencies, from the fourth Makridakis forecasting competition ([Makridakis, Spiliotis and Assimakopoulos, 2020](https://doi.org/10.1016/j.ijforecast.2019.04.014)).
- **Size:** 100,000 series.
- **Use it for:** benchmarking univariate forecasting methods across frequencies.
- **Watch out for:** series have no dates or context; use the official horizons and metrics.
- **Access:** [GitHub (Mcompetitions/M4-methods)](https://github.com/Mcompetitions/M4-methods).

### 82. M5 competition (Walmart sales)

- **What it is:** daily unit sales of Walmart products in three U.S. states, organized in a hierarchy of items, departments, categories and stores, with prices and events ([Makridakis, Spiliotis and Assimakopoulos, 2022](https://doi.org/10.1016/j.ijforecast.2021.11.013)).
- **Size:** 42,840 hierarchical series built from 30,490 item-store series over about five years.
- **Use it for:** hierarchical and intermittent demand forecasting with external variables.
- **Watch out for:** many zero-sales days; the official metric weights series by dollar sales.
- **Access:** [Kaggle M5 Forecasting – Accuracy](https://www.kaggle.com/c/m5-forecasting-accuracy).

### 83. Electricity Load Diagrams 2011–2014

- **What it is:** electricity consumption of 370 customers in Portugal, recorded every 15 minutes.
- **Size:** 370 series over four years.
- **Use it for:** global forecasting models across many series; a common benchmark in deep forecasting papers.
- **Watch out for:** customers joined at different times, so early zeros are not real consumption; daylight saving changes appear in the data.
- **Access:** [UCI](https://archive.ics.uci.edu/dataset/321/electricityloaddiagrams20112014), CC BY 4.0.

### 84. ETT (Electricity Transformer Temperature)

- **What it is:** oil temperature and load readings from electricity transformers in China, released with the Informer model ([Zhou et al., 2021](https://arxiv.org/abs/2012.07436)).
- **Size:** two years from two stations, at hourly and 15-minute resolution.
- **Use it for:** long-horizon multivariate forecasting benchmarks.
- **Watch out for:** small and heavily used; critics have shown that simple linear models match many complex architectures on it ([Zeng et al., 2022](https://arxiv.org/abs/2205.13504)).
- **Access:** [GitHub (zhouhaoyi/ETDataset)](https://github.com/zhouhaoyi/ETDataset), CC BY-ND 4.0.

### 85. Jena Climate

- **What it is:** weather measurements (temperature, pressure, humidity, wind) recorded every 10 minutes at the Max Planck Institute for Biogeochemistry in Jena, Germany.
- **Size:** 14 variables over many years; the commonly used extract covers 2009–2016.
- **Use it for:** multivariate forecasting tutorials and comparing neural networks with boosting.
- **Watch out for:** sensor errors and gaps; check for physically impossible values.
- **Access:** [MPI-BGC Wetterstation](https://www.bgc-jena.mpg.de/wetter/).

### 86. NYC Taxi and Limousine Commission trip records

- **What it is:** trip-level records of New York City yellow taxis, green taxis and for-hire vehicles, with pickup and drop-off times and zones, fares and tips.
- **Size:** billions of trips since 2009, released monthly as Parquet files.
- **Use it for:** demand forecasting, fare and duration prediction, and large-scale data engineering practice.
- **Watch out for:** schemas and location coding changed over the years; the records contain obvious errors such as negative fares.
- **Access:** [NYC TLC](https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page).

### 87. Numenta Anomaly Benchmark (NAB)

- **What it is:** real and artificial time series with labeled anomalies, plus a scoring system that rewards early detection ([Lavin and Ahmad, 2015](https://arxiv.org/abs/1510.03336)).
- **Size:** 58 series.
- **Use it for:** streaming anomaly detection.
- **Watch out for:** researchers have argued that many time-series anomaly benchmarks, including parts of this one, have trivial or mislabeled anomalies ([Wu and Keogh, 2021](https://arxiv.org/abs/2009.13807)).
- **Access:** [GitHub (numenta/NAB)](https://github.com/numenta/NAB), AGPL.

### 88. UCR Time Series Classification Archive

- **What it is:** a collection of univariate time-series classification datasets from many domains (ECG, motion, sensors, shapes) with fixed train and test splits ([Dau et al., 2019](https://arxiv.org/abs/1810.07758)).
- **Size:** 128 datasets in the 2018 version; a companion archive covers multivariate series.
- **Use it for:** benchmarking time-series classifiers such as DTW nearest neighbors, ROCKET and deep models.
- **Watch out for:** many datasets are small; compare across the whole archive rather than on a few datasets.
- **Access:** [UCR archive](https://www.cs.ucr.edu/~eamonn/time_series_data_2018/) and [timeseriesclassification.com](https://www.timeseriesclassification.com/).

## Recommendation and ranking datasets

### 89. MovieLens

- **What it is:** movie ratings collected by the GroupLens research lab's MovieLens website, in several sizes ([Harper and Konstan, 2015](https://doi.org/10.1145/2827872)).
- **Size:** from 100,000 ratings up to MovieLens 32M: 32 million ratings and 2 million tags of 87,585 movies by 200,948 users, released in May 2024.
- **Use it for:** the standard dataset for learning and benchmarking recommender systems.
- **Watch out for:** every user rated at least 20 movies, so it understates cold start; GroupLens does not permit public redistribution.
- **Access:** [grouplens.org](https://grouplens.org/datasets/movielens/).

### 90. Netflix Prize

- **What it is:** movie ratings released for Netflix's 2006–2009 \$1 million recommendation competition.
- **Size:** 100,480,507 ratings by 480,189 users of 17,770 movies.
- **Use it for:** historical interest and reading about matrix factorization's rise.
- **Watch out for:** researchers showed that some users could be re-identified by matching their ratings with public IMDb profiles ([Narayanan and Shmatikov, 2008](https://arxiv.org/abs/cs/0610105)); the dataset is no longer officially distributed, and a planned second competition was canceled after a privacy lawsuit. Use MovieLens instead.
- **Access:** not officially available.

### 91. Criteo 1TB Click Logs

- **What it is:** 24 days of display-advertising click logs released by Criteo AI Lab, with 13 numeric and 26 hashed categorical features.
- **Size:** about one terabyte of data, billions of impressions.
- **Use it for:** large-scale click-through-rate prediction; the MLPerf recommendation benchmark has used it.
- **Watch out for:** features are anonymized and hashed; the full dataset needs distributed processing.
- **Access:** [Criteo AI Lab](https://ailab.criteo.com/criteo-1tb-click-logs-dataset/) and [Hugging Face](https://huggingface.co/datasets/criteo/CriteoClickLogs).

### 92. Open Bandit Dataset

- **What it is:** logged fashion recommendations from the ZOZOTOWN e-commerce platform, collected under two known policies (uniform random and Bernoulli Thompson sampling) ([Saito et al., 2020](https://arxiv.org/abs/2008.07146)).
- **Size:** over 26 million logged interactions.
- **Use it for:** off-policy evaluation and contextual bandit research with real logged data.
- **Watch out for:** the logging policies' probabilities are what make off-policy evaluation possible, so keep them.
- **Access:** [GitHub (st-tech/zr-obp)](https://github.com/st-tech/zr-obp), CC BY 4.0.

### 93. Microsoft Learning to Rank (MSLR-WEB10K and WEB30K)

- **What it is:** query–document pairs from a commercial search engine with relevance labels from 0 to 4 and 136 numeric features ([Qin and Liu, 2013](https://arxiv.org/abs/1306.2597)).
- **Size:** 10,000 or 30,000 queries.
- **Use it for:** training and evaluating learning-to-rank algorithms such as LambdaMART.
- **Watch out for:** features are precomputed, so you cannot study text representations.
- **Access:** [Microsoft Research](https://www.microsoft.com/en-us/research/project/mslr/).

## Graph, chemistry and science datasets

### 94. Cora, CiteSeer and PubMed (Planetoid)

- **What it is:** citation networks where nodes are papers with bag-of-words features and edges are citations, labeled by topic ([Sen et al., 2008](https://doi.org/10.1609/aimag.v29i3.2157)).
- **Size:** Cora has 2,708 papers, CiteSeer 3,327 and PubMed 19,717.
- **Use it for:** a first graph neural network.
- **Watch out for:** tiny and noisy; results vary a lot with random seeds and splits, so report averages over many runs.
- **Access:** via PyTorch Geometric's `Planetoid` and DGL.

### 95. Open Graph Benchmark (OGB)

- **What it is:** realistic, large graph datasets with standardized splits and evaluators for node, link and graph prediction ([Hu et al., 2020](https://arxiv.org/abs/2005.00687)).
- **Size:** from thousands to over a hundred million nodes.
- **Use it for:** graph learning research where small benchmarks such as Cora are not convincing.
- **Watch out for:** use the official evaluators and splits, which are often by time or by scaffold.
- **Access:** [ogb.stanford.edu](https://ogb.stanford.edu/).

### 96. QM9

- **What it is:** small organic molecules with up to nine heavy atoms (carbon, oxygen, nitrogen, fluorine), with geometries and properties computed by density functional theory ([Ramakrishnan et al., 2014](https://doi.org/10.1038/sdata.2014.22)).
- **Size:** about 134,000 molecules.
- **Use it for:** molecular property prediction and equivariant neural networks.
- **Watch out for:** the properties are computed, not measured, and the molecules are much smaller than drug-like ones.
- **Access:** [Figshare](https://doi.org/10.6084/m9.figshare.c.978904.v5); also in PyTorch Geometric.

### 97. MoleculeNet

- **What it is:** a benchmark collection of molecular datasets covering quantum mechanics, physical chemistry (such as solubility), biophysics and physiology (such as toxicity) ([Wu et al., 2018](https://doi.org/10.1039/C7SC02664A)).
- **Size:** from hundreds to hundreds of thousands of molecules per dataset.
- **Use it for:** comparing fingerprints, descriptors and graph neural networks for chemistry.
- **Watch out for:** random splits leak similar molecules into the test set; use scaffold splits.
- **Access:** [moleculenet.org](https://moleculenet.org/datasets-1); loaders in DeepChem.

### 98. Protein Data Bank (PDB)

- **What it is:** the global archive of experimentally determined 3-D structures of proteins, nucleic acids and complexes, maintained by the Worldwide PDB since 1971.
- **Size:** more than 200,000 structures.
- **Use it for:** protein structure prediction, docking and design; AlphaFold was trained on PDB structures.
- **Watch out for:** structures vary in resolution and quality, and the archive overrepresents proteins that are easy to crystallize.
- **Access:** [RCSB PDB](https://www.rcsb.org/), free and unrestricted.

## Reinforcement learning environments and datasets

### 99. Arcade Learning Environment (Atari)

- **What it is:** an interface to Atari 2600 games for evaluating reinforcement learning agents from pixels ([Bellemare et al., 2013](https://arxiv.org/abs/1207.4708)); the "Atari 57" games are a standard benchmark.
- **Size:** 57 games in the common benchmark; data is generated by playing.
- **Use it for:** deep RL algorithms such as DQN and its successors.
- **Watch out for:** results depend heavily on evaluation details such as sticky actions and frame limits ([Machado et al., 2018](https://arxiv.org/abs/1709.06009)).
- **Access:** [ALE on GitHub](https://github.com/Farama-Foundation/Arcade-Learning-Environment), used through Gymnasium.

### 100. D4RL and Minari offline RL datasets

- **What it is:** fixed datasets of logged agent behavior for offline reinforcement learning, first standardized by D4RL ([Fu et al., 2020](https://arxiv.org/abs/2004.07219)) and now maintained by the Farama Foundation in the Minari format.
- **Size:** from thousands to millions of transitions per dataset, across locomotion, manipulation and navigation tasks.
- **Use it for:** training agents without interacting with the environment, as in robotics or healthcare where exploration is costly.
- **Watch out for:** dataset quality (random, medium, expert) changes which methods win; report results on several.
- **Access:** [minari.farama.org](https://minari.farama.org/).

## Responsible use checklist

- **Read the license and terms** before downloading, and again before publishing a model or derived data. Research-only and non-commercial terms are common, especially for images, faces and medical data.
- **Respect personal data.** Do not try to re-identify people, combine datasets to reveal identities, or upload restricted data to third-party tools.
- **Document what you used.** Record the version, download date, split and any filtering, so others can reproduce your results. A datasheet ([Gebru et al., 2021](https://arxiv.org/abs/1803.09010)) is a good template.
- **Check for contamination.** Popular test sets, especially for language models, may already be in a pretrained model's training data.
- **Be honest about representativeness.** State who and what the data covers, and who it leaves out.
- **Cite the dataset creators** using the citation they request.

## Where to go next

- Put these datasets to work with [101 machine learning projects](/articles/machine-learning-projects).
- Choose the right model with [100 machine learning algorithms explained](/articles/machine-learning-algorithms-explained).
- Turn raw columns into better inputs with [101 feature engineering techniques](/articles/feature-engineering-techniques).
- See how organizations use similar data in [100 machine learning applications across industries](/articles/machine-learning-applications).
- Clean and explore data faster with [100 pandas tips and tricks](/articles/pandas-tips-and-tricks-for-data-analysis).

## References

1. Kelly, M., Longjohn, R., & Nottingham, K. *The UCI Machine Learning Repository*. [archive.ics.uci.edu](https://archive.ics.uci.edu/)
2. Vanschoren, J., van Rijn, J. N., Bischl, B., & Torgo, L. (2014). "OpenML: networked science in machine learning." *SIGKDD Explorations*, 15(2). [arxiv.org/abs/1407.7722](https://arxiv.org/abs/1407.7722)
3. Gebru, T., et al. (2021). "Datasheets for Datasets." *Communications of the ACM*, 64(12). [arxiv.org/abs/1803.09010](https://arxiv.org/abs/1803.09010)
4. Northcutt, C. G., Athalye, A., & Mueller, J. (2021). "Pervasive Label Errors in Test Sets Destabilize Machine Learning Benchmarks." [arxiv.org/abs/2103.14749](https://arxiv.org/abs/2103.14749)
5. Paullada, A., Raji, I. D., Bender, E. M., Denton, E., & Hanna, A. (2021). "Data and its (dis)contents: A survey of dataset development and use in machine learning research." *Patterns*, 2(11). [doi.org/10.1016/j.patter.2021.100336](https://doi.org/10.1016/j.patter.2021.100336)
6. Recht, B., Roelofs, R., Schmidt, L., & Shankar, V. (2019). "Do ImageNet Classifiers Generalize to ImageNet?" *ICML 2019*. [arxiv.org/abs/1902.10811](https://arxiv.org/abs/1902.10811)
7. Kapoor, S., & Narayanan, A. (2023). "Leakage and the reproducibility crisis in machine-learning-based science." *Patterns*, 4(9). [doi.org/10.1016/j.patter.2023.100804](https://doi.org/10.1016/j.patter.2023.100804)
8. Longpre, S., et al. (2024). "A large-scale audit of dataset licensing and attribution in AI." *Nature Machine Intelligence*, 6. [doi.org/10.1038/s42256-024-00878-8](https://doi.org/10.1038/s42256-024-00878-8)
