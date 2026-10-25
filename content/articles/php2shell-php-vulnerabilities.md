---
title: "PHP2Shell Explained: Critical PHP Security Vulnerabilities, CVEs, and How to Fix Them (2026)"
seoTitle: "PHP2Shell Explained: CVEs, Affected Versions and Fixes"
description: What PHP2Shell (CVE-2026-109618 and CVE-2026-109619) is, which PHP versions and setups are affected, and how to patch, mitigate and check for compromise.
author: BlogAI Editors
authorType: Organization
publishedAt: 2026-10-26
updatedAt: 2026-10-26
status: published
categories:
  - Programming and Technology
tags:
  - php
  - cybersecurity
  - vulnerabilities
  - web servers
  - patch management
tocDepth: 2
---

**PHP2Shell** is the name for two critical flaws in the PHP engine itself, **CVE-2026-109618** and **CVE-2026-109619**, disclosed on 21 October 2026. Either one can let an attacker with no login run code on a web server that uses PHP. Both are rated **9.2 on CVSS v4.0**. Because the bugs are in PHP and not in any one application, WordPress, Drupal, Joomla, Magento and custom sites are all exposed when they run on an unpatched PHP build.

**The short answer.** Update to **PHP 8.5.12, 8.4.27, 8.3.36 or 8.2.35** (or your distribution's patched package), then **restart every PHP worker**. PHP's maintainers say updating is the only complete fix. If you cannot patch today, turn off `session.upload_progress.enabled`, tighten request limits, and consider taking the site offline, as the UK's NCSC and CISA advise. Then check the server for signs of compromise, because exploitation attempts were seen before the patch existed.

**How we checked.** This guide is based on PHP's own security announcement and the two GitHub security advisories, the PHP Foundation's post, and reports from Amazon Threat Intelligence, the UK NCSC, Wiz, Akamai, watchTowr, Huntress, Tenable and CloudLinux, all read on 26 October 2026. We did not run any exploit or test the flaws ourselves, and this article contains no exploit code. The situation is still moving, so check the linked advisories for changes after this date.

## PHP2Shell at a glance

| | CVE-2026-109618 | CVE-2026-109619 |
|---|---|---|
| PHP's title | RCE via OOM corruption | RCE via stale global state |
| Advisory | [GHSA-w8hw-w9fx-j79w](https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w) | [GHSA-6wmf-4rv5-p3rp](https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp) |
| CVSS v4.0 | 9.2 Critical | 9.2 Critical |
| Bug type | Out-of-memory handling leaves request data half built (CWE-416, CWE-824 and others) | Global state outlives the request memory it points to: a use-after-free (CWE-416) |
| Authentication needed | None | None |
| Confirmed RCE | Apache mod_php with default limits; PHP-FPM through application code paths | Apache mod_php; session path also validated on PHP-FPM |
| Fixed in | 8.5.12, 8.4.27, 8.3.36, 8.2.35 | 8.5.12, 8.4.27, 8.3.36, 8.2.35 |

Both advisories use the vector `CVSS:4.0/AV:N/AC:H/AT:P/PR:N/UI:N/VC:H/VI:H/VA:H`: reachable over the network, no privileges or user interaction, high impact on confidentiality, integrity and availability, but with high attack complexity and some preconditions ([GHSA-w8hw](https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w)). That "high complexity" is why the score is 9.2 and not 10. A leaked score of 10.0 that circulated before disclosure was wrong, according to the [PHP Foundation](https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/).

The name "PHP2Shell" comes from Wiz and refers to turning a PHP request into a shell on the server ([Wikipedia](https://en.wikipedia.org/wiki/PHP2Shell)).

## Which PHP versions are affected

PHP lists every release before the fixed versions as vulnerable ([PHP announcement](https://www.php.net/archive/2026.php#2026-10-21-5)). Wiz and Calif report that the flaws go back to PHP 5.4, released in 2012 ([Wiz](https://www.wiz.io/blog/php2shell-php-rce)).

| PHP branch | Status | What to do |
|---|---|---|
| 8.5 | Fixed in **8.5.12** | Update |
| 8.4 | Fixed in **8.4.27** | Update |
| 8.3 | Fixed in **8.3.36** | Update |
| 8.2 | Fixed in **8.2.35** | Update |
| 8.6 (pre-release) | Fixed in 8.6.0 RC4 | Not for production; update test builds |
| 7.4, 8.0, 8.1 | End of life; no official release | Use a vendor or distribution backport, PHP's minimal source patches, or upgrade to 8.2+ |
| 7.3 and older, PHP 5 | End of life; no PHP.net fix | Upgrade, or use a commercial backport where one exists |

For the end-of-life branches 7.4, 8.0 and 8.1, PHP's security team published minimal source backports for people who build PHP themselves, but no official binaries ([PHP announcement](https://www.php.net/archive/2026.php#2026-10-21-5)).

**Distribution packages may keep the old version number.** Linux distributions and long-term support vendors received the fix before the public release ([PHP announcement](https://www.php.net/archive/2026.php#2026-10-21-5)). Many of them backport the patch into their existing package, so `php -v` can show something like 8.3.6 or 8.5.11 on a server that is already fixed. CloudLinux, for example, shipped the fix in alt-php85 8.5.11-5 and covers alt-php 5.2 through 8.5 ([CloudLinux](https://blog.cloudlinux.com/php-cve-2026-109618-and-cve-2026-109619/)). Check the package changelog or your distribution's security tracker, not just the version string.

## Who is most at risk

PHP says **any installation that serves web requests** is in scope, naming PHP-FPM, Apache with mod_php, php-cgi, FrankenPHP and LiteSpeed ([PHP announcement](https://www.php.net/archive/2026.php#2026-10-21-5)). The risk is not equal across setups:

- **Apache with mod_php: highest.** PHP says it has a demonstrated exploit in which an unauthenticated request triggers the attack before any application code runs. Your own code cannot block it.
- **PHP-FPM: high.** The OOM advisory calls FPM susceptible from source analysis. The PHP Foundation reports RCE on FPM through application-level code paths, and the stale-state advisory says the session upload progress path was validated on FPM ([PHP Foundation](https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/); [GHSA-6wmf](https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp)).
- **FrankenPHP and LiteSpeed (LSAPI):** likely susceptible but not validated, per the advisory.
- **Command-line PHP** (cron jobs, Composer, artisan commands) is not named in the advisories. It does not accept web requests, so the remote attack does not apply, but the same binary should still be updated.

**Hidden PHP counts too.** Many products bundle their own PHP: control panels, network appliances, monitoring tools and on-premises software. Tenable, for example, shipped an update to its Security Center to move its bundled PHP to 8.2.35 ([Tenable](https://www.tenable.com/blog/php2shell-cve-2026-109618-cve-2026-109619-frequently-asked-questions-about-critical-php-remote)). The NCSC tells organisations to watch for vendor updates for products that include PHP ([NCSC](https://www.ncsc.gov.uk/news/critical-security-issue-affecting-php)).

## How the two flaws work

You do not need these details to patch, but they explain why configuration changes only reduce the risk. The descriptions below are summarized from PHP's advisories and the Akamai and Wiz write-ups; we leave out exploitation steps.

### CVE-2026-109618: out-of-memory corruption

When a request goes over `memory_limit`, PHP aborts it with `longjmp()`, jumping straight to request shutdown. Some request memory is reachable before it is fully initialized, so if an allocation fails at that moment, shutdown code can read or branch on invalid data. PHP says multipart parsing (the format used for file uploads) can trigger this out-of-memory condition while staying within PHP's normal limits ([GHSA-w8hw](https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w)). Akamai describes attackers first filling memory with forged structures and then forcing the out-of-memory error, so that shutdown follows an attacker-controlled function pointer ([Akamai](https://www.akamai.com/blog/security-research/understanding-php2shell-everything-you-need-to-know)).

The fix replaces the `longjmp()` path with a "soft" out-of-memory error at the next safe point in the engine, plus an immediate hard exit at a higher threshold.

According to the PHP Foundation, a core developer first saw signs of this problem in 2024, while fixing an issue from an external audit funded by the Sovereign Tech Agency and carried out by Quarkslab. No concrete attack was found then, and the team could not agree on a fix. The Foundation calls the delay a "structural failure" in its decision process ([PHP Foundation](https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/)).

### CVE-2026-109619: stale global state

A PHP worker keeps some global state (error, session, object and extension state) between requests. If a request ends in a fatal error, an out-of-memory error or a timeout, that state can still point to memory that has been freed. A later operation on the same worker that runs *before* normal request setup can then use the freed memory ([GHSA-6wmf](https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp)).

The advisory names two main ways this freed memory gets used:

1. **Session upload progress.** This feature, on by default, writes upload progress into the session when a POST includes a `PHP_SESSION_UPLOAD_PROGRESS` field. It runs before your code, on any endpoint that accepts a multipart POST, even one that ignores uploads ([Akamai](https://www.akamai.com/blog/security-research/understanding-php2shell-everything-you-need-to-know)).
2. **INI warnings before request setup**, such as invalid `php_value` lines in `.htaccess` under mod_php. Hiding warnings with `error_reporting`, `display_errors` or `@` does not help.

On PHP 8.5, the `fatal_error_backtraces` feature gave a confirmed path to RCE against mod_php.

Wiz adds that the same family of bugs allows a **memory disclosure**: an attacker can read part of a worker's memory, which may hold passwords, tokens and API keys from other requests, even on sites that never start a session ([Wiz](https://www.wiz.io/blog/php2shell-php-rce)). A patched server that was exposed before the update may therefore need its secrets rotated (see the checklist below).

## How to check if you are vulnerable

The version that matters is the one your **web server** runs, which may differ from the command-line version. Check both.

**Command-line PHP and packages (Debian, Ubuntu):**

```bash
php -v
dpkg -l | grep -E '^ii +(libapache2-mod-)?php[0-9.]*(-fpm|-common|-cli)? '
```

**RHEL, Rocky, AlmaLinux, Fedora:**

```bash
php -v
rpm -qa | grep -E '^(php|alt-php)'
```

**PHP-FPM binary** (the name depends on your distribution, for example `php-fpm8.3` on Debian and Ubuntu or `php-fpm` on RHEL):

```bash
php-fpm8.3 -v
php-fpm8.3 -i | grep -E 'session.upload_progress.enabled|memory_limit'
```

**Apache mod_php** runs inside Apache, so the only reliable check is a temporary `phpinfo()` page on that server. Put it behind authentication or an IP allowlist, read the version and settings, and delete it straight away.

**If the version number looks old,** look for the CVE IDs in the package changelog. A backported fix keeps the old version number:

```bash
apt changelog php8.3-common | grep -E 'CVE-2026-10961[89]'
rpm -q --changelog php-common | grep -E 'CVE-2026-10961[89]'
```

You can also look the CVEs up in your distribution's tracker, such as the [Debian security tracker](https://security-tracker.debian.org/tracker/CVE-2026-109618) or [Ubuntu CVE pages](https://ubuntu.com/security/CVE-2026-109618).

**Containers:** check the PHP version inside each image, not only on the host:

```bash
docker run --rm --entrypoint php your-image:tag -v
```

## How to fix PHP2Shell

### 1. Patch

Install the fixed release or your vendor's patched package. Typical commands:

```bash
# Debian / Ubuntu
sudo apt update && sudo apt install --only-upgrade 'php*'

# RHEL family
sudo dnf upgrade 'php*'

# CloudLinux alt-php (CloudLinux 8, 9 and 10)
sudo dnf clean all && sudo dnf upgrade 'alt-php*'
```

The CloudLinux command comes from its own guidance, which also asks you to keep the `php-els` repository enabled ([CloudLinux](https://blog.cloudlinux.com/php-cve-2026-109618-and-cve-2026-109619/)). On Windows, install the new build from [windows.php.net](https://windows.php.net/download/), and remember that bundles such as XAMPP and Laragon ship their own copy of PHP.

**Docker and Kubernetes:** rebuild images with a fresh base image (for example `docker build --pull`), push them and redeploy. A running container does not pick up a patched host package. Pinned tags like `php:8.3.30-fpm` will not update themselves; move them to the fixed patch release.

**Shared hosting:** the host controls PHP. Check your provider's status page or ask support whether the fix is in place, and select a supported PHP version (8.2 or newer) in the control panel if you are on 8.1 or older.

### 2. Restart every PHP worker

The old code stays in memory until the process restarts. Restart PHP-FPM pools, Apache, LiteSpeed and any long-running PHP application servers:

```bash
sudo systemctl restart php8.3-fpm
sudo systemctl restart apache2   # or httpd on RHEL
```

watchTowr and PHP both stress the restart ([watchTowr](https://watchtowr.com/intelligence/php-cve-2026-109618-faq/)). After restarting, confirm the version again through the web server, not only on the command line.

### 3. Patch internet-facing servers first

The NCSC's order is: find PHP systems, starting with internet-facing ones; update them; apply PHP's temporary mitigations where you cannot update; and if you cannot do either quickly, consider taking the system offline ([NCSC](https://www.ncsc.gov.uk/news/critical-security-issue-affecting-php)). CISA's 21 October alert also recommends taking PHP systems offline if they cannot be updated right away or still run PHP 8.1 or earlier, as summarized by [Tenable](https://www.tenable.com/blog/php2shell-cve-2026-109618-cve-2026-109619-frequently-asked-questions-about-critical-php-remote).

## Temporary mitigations if you cannot patch yet

PHP is clear that **only an update is a complete solution**. These steps, taken from its announcement and advisories, reduce exposure but do not make a server safe ([PHP announcement](https://www.php.net/archive/2026.php#2026-10-21-5)).

**For CVE-2026-109619 (stale state):**

- Set `session.upload_progress.enabled=0` in `php.ini`, the FPM pool or the server configuration, then restart all workers. Do **not** rely on `ini_set()` or an FPM `.user.ini` file, because those apply too late. PHP recommends leaving this off even after patching if you do not use the feature.
- On PHP 8.5, set `fatal_error_backtraces=0` and restart workers. This blocks only the confirmed backtrace path.
- Remove invalid or deprecated per-directory settings (for example in `.htaccess`) that produce warnings before a request starts.
- Fix fatal errors and timeouts that an attacker can trigger. The advisory also suggests `pm.max_requests=1` for PHP-FPM if you can afford the performance cost, so each worker handles only one request.

**For CVE-2026-109618 (out of memory):**

- Set `memory_limit=-1` administratively (for example with `php_admin_value` in the FPM pool), so PHP's own limit cannot be hit, and add a container or cgroup memory limit that kills only the affected worker. Do not use `RLIMIT_AS` or `RLIMIT_DATA`. Without an outer limit, an unlimited `memory_limit` invites memory exhaustion, so treat this as a short-term measure.
- Keep `post_max_size` small: PHP suggests `8M` if you do not accept uploads or `32M` if you do, with `upload_max_filesize` below it.
- At the web server or proxy, cap request size, field count, multipart parts, headers and nesting depth. If the site does not need uploads, block multipart requests entirely.

A minimal php.ini fragment for an FPM pool that does not take uploads might look like this:

```ini
; /etc/php/8.3/fpm/pool.d/www.conf (example path)
php_admin_value[session.upload_progress.enabled] = 0
php_admin_value[post_max_size] = 8M
php_admin_value[upload_max_filesize] = 2M
```

**WAF rules** from providers such as Cloudflare, Fastly, Vercel, Google and AWS can block known exploit patterns while you patch ([Wiz](https://www.wiz.io/blog/php2shell-php-rce); [AWS](https://aws.amazon.com/blogs/security/amazon-threat-intelligence-identifies-php2shell-exploitation-prior-to-public-disclosure-in-madpot/)). They are a stopgap; variants can get past signature rules.

One trap that comes up often in community discussion: the command-line and FPM versions of PHP usually read different `php.ini` files, so a setting can look off with `php -i` while still on in FPM. Check the effective value through `php-fpm -i` or a protected `phpinfo()` page ([Hacker News discussion](https://news.ycombinator.com/item?id=50167754)).

## Is PHP2Shell being exploited?

Sources disagree on how much, so here is what each one says:

- **Amazon Threat Intelligence** saw an exploitation attempt against its MadPot honeypots on **17 October 2026**, four days before disclosure, and several more from apparently different actors on 21 October, before the patch. It is not known whether those attempts would have worked against real systems. Amazon later described the flaws as broadly exploited in the wild ([AWS](https://aws.amazon.com/blogs/security/amazon-threat-intelligence-identifies-php2shell-exploitation-prior-to-public-disclosure-in-madpot/)).
- **watchTowr** reports exploitation attempts through its honeypot network since 21 October ([watchTowr](https://watchtowr.com/intelligence/php-cve-2026-109618-faq/)).
- **Cloudflare** reported "early attacks emerging," as quoted by [Tenable](https://www.tenable.com/blog/php2shell-cve-2026-109618-cve-2026-109619-frequently-asked-questions-about-critical-php-remote).
- **The PHP Foundation** said the proof-of-concept code it inspected around release time was not functional ([PHP Foundation](https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/)). Other researchers, including Wiz and Calif, have since published working attack demonstrations against WordPress, Drupal and Joomla.
- **CISA** said on 21 October that it had not yet observed exploitation, and the flaws were not in its Known Exploited Vulnerabilities catalog as of 23 October, per Tenable. Check the [KEV catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) for the current status.

The practical reading: attempts are real and started before the patch, so assume any exposed, unpatched server may have been targeted.

## How to check for compromise

Patching closes the hole but does not remove anything an attacker left behind. The NCSC specifically advises checking for backdoors ([NCSC](https://www.ncsc.gov.uk/news/critical-security-issue-affecting-php)). Start your review from **17 October 2026**, the earliest known attempt, not the disclosure date, as Amazon recommends.

**In web server logs:**

- POST requests containing `PHP_SESSION_UPLOAD_PROGRESS`, especially to pages that do not take uploads ([AWS](https://aws.amazon.com/blogs/security/amazon-threat-intelligence-identifies-php2shell-exploitation-prior-to-public-disclosure-in-madpot/)).
- Unusual multipart requests followed by memory-limit errors, bursts of HTTP 500 responses, oversized or malformed `PHPSESSID` cookies in responses, and unexplained worker crashes or restarts ([Wiz](https://www.wiz.io/blog/php2shell-php-rce)).

A quick first search of Apache or Nginx logs:

```bash
grep -l 'PHP_SESSION_UPLOAD_PROGRESS' /var/log/apache2/*access* /var/log/nginx/*access* 2>/dev/null
grep -E 'Allowed memory size|zend_mm_heap corrupted|SIGSEGV' /var/log/php*fpm*.log /var/log/apache2/error*.log 2>/dev/null
```

Access logs usually record only the URL, not the POST body, so an empty result is not proof that nothing happened.

**On the server** (from [Huntress](https://www.huntress.com/blog/php2shell-leaked-critical-php-vulnerabilities)):

- PHP or web server processes (`php-fpm`, `php-cgi`, `httpd`, `apache2`) starting shells (`sh`, `bash`, `cmd.exe`, `powershell.exe`), interpreters (`python`, `perl`) or download tools (`curl`, `wget`, `nc`, `certutil.exe`).
- Reconnaissance commands such as `whoami`, `id` or `uname -a` run by the web user, and command lines containing `/dev/tcp/`, `mkfifo` or `fsockopen`, which suggest reverse shells.
- New or changed PHP files in the web root and upload folders, new cron jobs or scheduled tasks, and new user accounts.

To list PHP files changed since the earliest known attempt:

```bash
find /var/www -name '*.php' -newermt '2026-10-17' -type f
```

Legitimate updates will show up too, so compare against your deployments or a known-good copy.

**If you find signs of compromise,** isolate the host, preserve logs, rebuild from a clean source rather than cleaning in place, and rotate secrets the PHP process could read: database passwords, API keys, session secrets and cloud credentials. Because of the memory disclosure path, rotating secrets on any server that was exposed and unpatched is a reasonable precaution even without other signs.

## Timeline

| Date (2026, UTC) | Event |
|---|---|
| 11 August | Calif reports the full impact to PHP (the OOM issue had first been noticed in 2024) |
| 17 October | Earliest exploitation attempt seen by Amazon's honeypots |
| 20 October | CVE IDs leak; PHP announces an emergency release for 21 October |
| 21 October, 07:41 | Chainguard publishes fixed images about six hours before the coordinated release |
| 21 October, 14:00 | PHP 8.5.12, 8.4.27, 8.3.36 and 8.2.35 released; advisories published |
| 21 October | NCSC and CISA alerts; Wiz, Calif and others publish technical details |
| 23 October | PHP publishes an informational note on a related session issue (CVE-2026-115560) |

Sources: [PHP Foundation](https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/), [PHP archive](https://www.php.net/archive/2026.php), [AWS](https://aws.amazon.com/blogs/security/amazon-threat-intelligence-identifies-php2shell-exploitation-prior-to-public-disclosure-in-madpot/), [NCSC](https://www.ncsc.gov.uk/news/critical-security-issue-affecting-php).

## A follow-up issue to watch: CVE-2026-115560

On 23 October PHP published an informational note about a further, less likely code-execution path in session upload progress. It needs an unusual setup: `session.serialize_handler` set to `php_binary` or `php_serialize` in configuration and then switched to `php` with `ini_set()` before `session_start()`, while upload progress is enabled. Until the next regular release, PHP suggests keeping `session.upload_progress.enabled=0`. Applications that never change the serialize handler at runtime can keep the feature on. A full advisory for **CVE-2026-115560** is due with the next release ([PHP archive](https://www.php.net/archive/2026.php)).

## How PHP2Shell compares with earlier PHP flaws

PHP2Shell is unusual because it sits in the core engine and needs no particular application or OS. The last widely exploited PHP flaw, **CVE-2024-4577**, was narrower: an argument-injection bug in PHP-CGI on **Windows** with certain Asian-language code pages, where a soft-hyphen character was mapped to a normal hyphen and slipped past an older fix for CVE-2012-1823. It was fixed in PHP 8.3.8, 8.2.20 and 8.1.29 ([GHSA-3qgc-jrrr-25jv](https://github.com/php/php-src/security/advisories/GHSA-3qgc-jrrr-25jv)). Most PHP security problems are still in applications and plugins, not PHP itself, which is why PHP2Shell drew so much attention.

The common lesson from both: end-of-life PHP versions stop getting fixes, and when a core flaw arrives, sites on old branches have the hardest path. If you are on 8.1 or older, plan the upgrade to 8.2 or newer now, even if a backport covers you this time.

## PHP2Shell response checklist

1. **Inventory** every PHP install: servers, containers, control panels, appliances and vendor software.
2. **Check** the web server's PHP version and the package changelog for the two CVE IDs.
3. **Patch** to 8.5.12, 8.4.27, 8.3.36 or 8.2.35, or a vendor backport; rebuild container images.
4. **Restart** every PHP-FPM pool, Apache and LiteSpeed process, then confirm the version through the web server.
5. **Mitigate** what you cannot patch: disable session upload progress, cap request sizes, add WAF rules, or take it offline.
6. **Hunt** for compromise from 17 October onward: logs, child processes, new files, cron jobs and accounts.
7. **Rotate** secrets on servers that were exposed while unpatched.
8. **Upgrade** off end-of-life branches and subscribe to PHP's security announcements.

## FAQ

### Does PHP2Shell affect WordPress sites?

Yes, if the server's PHP is unpatched. The flaw is in PHP, not WordPress, so updating WordPress or its plugins does not fix it. Wiz demonstrated unauthenticated code execution against WordPress, Drupal and Joomla ([Wiz](https://www.wiz.io/blog/php2shell-php-rce)). On managed or shared hosting, your host has to update PHP; check with them.

### Is disabling session.upload_progress enough?

No. It blocks one known path for CVE-2026-109619, but it does nothing for CVE-2026-109618, and PHP says no configuration change fully mitigates either flaw ([GHSA-6wmf](https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp)). Use it as a stopgap and keep it off after patching if you do not need upload progress.

### My server shows an older PHP version. Am I vulnerable?

Not necessarily. Distribution packages often backport the fix without changing the upstream version number. Check the package changelog or your distribution's security tracker for CVE-2026-109618 and CVE-2026-109619.

### Do I need to restart after updating?

Yes. Running PHP-FPM pools and Apache processes keep the old code in memory until they restart.

### Is PHP 7.4 or 8.1 still safe to run?

They are end of life, so PHP.net does not ship fixed releases for them. Minimal source patches and some vendor backports exist, but the long-term fix is upgrading to a supported branch (8.2 or newer).

## Stay up to date

The fastest way to hear about the next PHP security release is the [php.announce mailing list](https://www.php.net/mailing-lists.php) or the [PHP-src security advisories page](https://github.com/php/php-src/security/advisories). You can follow both, along with security research blogs, in a feed reader; our guide on [following technical blogs with RSS](/articles/follow-technical-blogs-with-rss) shows how. For more engineering and security blogs, browse the [Programming and Technology section of the directory](/category/programming-and-technology).

*This article is general information for administrators and developers, not a substitute for your vendor's guidance or professional incident response. Last checked against the sources below on 26 October 2026.*

## References

**Primary sources**

- PHP Group. Security release announcement for PHP 8.5.12, 8.4.27, 8.3.36 and 8.2.35, 21 October 2026, and related October 2026 news entries. [php.net/archive/2026.php](https://www.php.net/archive/2026.php#2026-10-21-5)
- PHP security team. "RCE via OOM corruption," GHSA-w8hw-w9fx-j79w (CVE-2026-109618), 21 October 2026. [GitHub](https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w)
- PHP security team. "RCE via stale global state," GHSA-6wmf-4rv5-p3rp (CVE-2026-109619), 21 October 2026. [GitHub](https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp)
- The PHP Foundation. "Today's PHP security release and how we're strengthening PHP security," 21 October 2026. [thephp.foundation](https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/)
- UK National Cyber Security Centre. "Critical security issue affecting PHP," 21 October 2026, updated 23 October. [ncsc.gov.uk](https://www.ncsc.gov.uk/news/critical-security-issue-affecting-php)
- PHP security team. "PHP RCE: A Bypass of CVE-2012-1823, Argument Injection in PHP-CGI," GHSA-3qgc-jrrr-25jv (CVE-2024-4577). [GitHub](https://github.com/php/php-src/security/advisories/GHSA-3qgc-jrrr-25jv)

**Independent analysis**

- CJ Moses, Amazon Threat Intelligence. "Amazon Threat Intelligence identifies PHP2Shell exploitation prior to public disclosure in MadPot," 21 October 2026. [AWS Security Blog](https://aws.amazon.com/blogs/security/amazon-threat-intelligence-identifies-php2shell-exploitation-prior-to-public-disclosure-in-madpot/)
- Wiz Research. PHP2Shell technical write-up, 21 October 2026. [wiz.io](https://www.wiz.io/blog/php2shell-php-rce)
- Akamai Security Intelligence Group. "Understanding PHP2Shell: Everything You Need to Know," 22 October 2026. [akamai.com](https://www.akamai.com/blog/security-research/understanding-php2shell-everything-you-need-to-know)
- watchTowr. "Frequently Asked Questions About PHP Remote Code Execution (PHP2Shell)," 20 October 2026, updated 23 October. [watchtowr.com](https://watchtowr.com/intelligence/php-cve-2026-109618-faq/)
- Huntress. PHP2Shell detection guidance, 21 October 2026. [huntress.com](https://www.huntress.com/blog/php2shell-leaked-critical-php-vulnerabilities)
- Tenable. "php2shell (CVE-2026-109618, CVE-2026-109619): Critical PHP RCE FAQ," 21 October 2026, updated 23 October. [tenable.com](https://www.tenable.com/blog/php2shell-cve-2026-109618-cve-2026-109619-frequently-asked-questions-about-critical-php-remote)
- CloudLinux. alt-php update notes for CVE-2026-109618 and CVE-2026-109619, updated 23 October 2026. [blog.cloudlinux.com](https://blog.cloudlinux.com/php-cve-2026-109618-and-cve-2026-109619/)

**Background and community**

- Wikipedia. "PHP2Shell," accessed 26 October 2026. [en.wikipedia.org](https://en.wikipedia.org/wiki/PHP2Shell)
- Hacker News discussion of the PHP security release, October 2026 (individual practitioners' views). [news.ycombinator.com](https://news.ycombinator.com/item?id=50167754)
