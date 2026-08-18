---
# Quoted because an unquoted `#` starts a YAML comment.
title: "Tokyo Vibe Coders #2"
date: 2025-12-17
meta: WED, DEC 17 · 6-8PM · GOOGLE SHIBUYA
chapter: tokyo
flavor: red-tint
tags:
  - Shareouts
  - Discussion
blurb: An in-person vibe coding showcase and discussion on efficient workflows.
---

It was amazing to see familiar faces and meet so many new builders. A huge thank you to our speakers and everyone who joined the discussions. 

[Full slides](https://www.linkedin.com/feed/update/urn:li:activity:7407304164378288129)

Top tips

- 🥳The "Two-Strike" Rule: If the AI fails to fix a bug twice, stop. Don't just say "fix it" again. Ask it to review the files, trace the data flow, or add console.log statements to self-diagnose.

- 🥳 Never start coding without a plan. Ask the AI to summarize your architectural discussion into a rule file. This keeps the agent grounded and prevents hallucinations.

- 🥳 Prompt Auditing: Occasionally export your chat logs and ask a high-reasoning model (like Claude Opus) to critique your prompting style. It can identify bad habits (like lazy instructions) that lead to bugs.

- 🥳 Parallel Processing: If using multiple agents, assign them to completely different projects to avoid merge conflicts.

- 🥳 Use Git Worktrees: Instead of git stashing and changing branches (which ruins your AI's context), use worktrees to check out branches into new folders.
