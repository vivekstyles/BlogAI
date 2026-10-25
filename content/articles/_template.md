---
# Copy this file, rename it to your-article-slug.md, and fill in the fields.
# Files starting with "_" are ignored by the build.

title: Your Article Title
# Optional. Shorter title for search results and browser tabs (60 characters max); the page heading keeps title.
# seoTitle: Your Shorter Search Title
# Optional. Defaults to the file name. Changing it later breaks existing links.
slug: your-article-slug
# 120-160 characters. Used for the meta description and article cards.
description: One or two sentences that summarize what the reader will learn.
author: BlogAI Editors
# Person for a named writer; Organization for an editorial team such as "BlogAI Editors".
authorType: Organization
# YYYY-MM-DD. Keep publishedAt fixed; bump updatedAt when you make meaningful edits.
publishedAt: 2026-01-01
updatedAt: 2026-01-01
# draft = validated but never published, listed, or added to the sitemap.
status: draft
# One or more of: Artificial Intelligence, Automobile, Engineering, Food and Nutrition, Mathematics, Personal Finance, Physics, Programming and Technology, Science
categories:
  - Engineering
tags:
  - example tag
# Optional featured image. Put files in public/images/articles/ and reference them from the site root.
# image: /images/articles/your-image.png
# imageAlt: Describe what the image shows for screen-reader users.
# Optional. Only set this when the article was first published elsewhere.
# canonical: https://example.com/original-post
# Optional. Defaults to true when the article has 3 or more ## / ### headings.
# toc: true
# Optional. 3 (default) lists ## and ### headings in the table of contents; 2 lists only ##.
# Use 2 for long numbered lists where every item is a ### heading.
# tocDepth: 3
---

Write the introduction here. Use `##` and `###` for section headings; the article title is already the page's only `#` heading.

## A section heading

Paragraphs, **bold**, *italic*, [links](/directory), lists, tables, images, and fenced code blocks are supported.

Math uses KaTeX: inline $a^2 + b^2 = c^2$, or display math on its own lines:

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

Write a literal dollar sign as \$5. Invalid LaTeX fails the build with the file name.

Collapsible blocks (keep the blank lines so the Markdown inside is parsed):

<details>
<summary>Show solution</summary>

The answer, with math if needed: $x = 3$.

</details>
