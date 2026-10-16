---
title: How to Follow Technical Blogs with RSS and OPML
description: Set up a feed reader, import the BlogAI OPML file, and build a reading routine that keeps you current without endless tabs or algorithmic timelines.
author: BlogAI Editors
authorType: Organization
publishedAt: 2026-10-14
updatedAt: 2026-10-14
status: published
categories:
  - Engineering
tags:
  - rss
  - opml
  - developer tools
  - productivity
---

Most of the best technical writing on the web still lives on independent blogs. Their authors publish when they have something worth saying, which is exactly why checking them by hand does not work: you visit ten sites, nine have nothing new, and you stop visiting. RSS solves this by letting the blogs come to you.

## What RSS and OPML actually are

**RSS** (and its close relative **Atom**) is a small XML file a website publishes alongside its pages. Each entry lists a post's title, link, date, and usually a summary. A feed reader polls these files and shows you only what is new.

**OPML** is a list of feeds. It is how you move a whole set of subscriptions between readers in one step. A minimal OPML file looks like this:

```xml
<opml version="2.0">
  <head><title>My Feeds</title></head>
  <body>
    <outline text="Engineering">
      <outline type="rss" text="Example Blog"
               xmlUrl="https://example.com/feed.xml"
               htmlUrl="https://example.com" />
    </outline>
  </body>
</opml>
```

Each nested `outline` becomes a folder in most readers, so the categories in a well-made OPML file carry straight over into your reader.

## Step 1: Choose a feed reader

Any reader that can import OPML will work. When comparing them, these are the features that matter for technical reading:

| Feature | Why it matters |
| --- | --- |
| OPML import and export | Lets you start from a curated list and leave without lock-in |
| Folders or tags | Keeps engineering, maths, and science feeds separate |
| Full-text view | Long posts are easier to read without the site's layout |
| Keyboard shortcuts | Triage fifty items in a few minutes |
| Sync across devices | Read on the phone, save for the desk |

Self-hosted readers are a good option if you already run a home server; hosted readers are simpler if you do not.

## Step 2: Import the BlogAI collection

1. Download the [BlogAI OPML file](/feed.opml). It contains every blog in the [community directory](/directory) that publishes a feed, grouped by category.
2. In your reader, find the import option (usually under settings or subscriptions) and choose the downloaded file.
3. Delete the folders you do not care about. A smaller list you actually read beats a large one you ignore.

You can also subscribe to a single blog: every listing in the directory with a feed shows an **RSS** button that copies or opens its feed URL.

## Step 3: Build a reading routine

Feeds only help if you have a habit for clearing them:

- **Triage, then read.** Skim headlines once a day and save only what is worth a full read.
- **Separate fast and slow feeds.** News-style sites post daily; personal blogs post monthly. Put them in different folders so the slow, high-signal posts are not buried.
- **Mark all as read without guilt.** If a folder overflows after a holiday, clear it. The important posts will be referenced again.

## Troubleshooting common feed problems

**The site has no feed link.** Try common paths such as `/feed`, `/rss`, `/feed.xml`, or `/atom.xml`. Many readers also discover feeds automatically when you paste the site's home page URL.

**The feed only shows summaries.** That is the publisher's choice. Use your reader's full-text option if it has one, or open the post in the browser.

**A feed stopped updating.** Sites move platforms and feed URLs change. Check the site's footer for a new feed link, and if a directory listing is out of date, [submit a correction](/submit).

## Where to go next

Browse the [Engineering category](/category/engineering) for systems and infrastructure writing, or explore the full [blog directory](/directory) by topic. Once the posts start arriving, [How to Read an Engineering Blog Post Critically](/articles/read-engineering-blog-posts-critically) shows how to separate the lessons that transfer to your own systems from the ones that only made sense at the author's scale.
