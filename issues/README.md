# Issues

A lightweight issue tracker that lives in the repo: one Markdown file per issue. Humans and agents both read and update it.

## File naming
`NNN-short-kebab-title.md`, numbered sequentially (`001`, `002`, …). Never reuse a number.

## Frontmatter
```yaml
---
id: 001
title: Short title
status: open          # open | in-progress | blocked | done | wont-do
labels: [spec]        # see labels below
parent: 001           # optional: the spec or issue this one breaks down
blocked_by: [002]     # optional: issues that must be done before this can start
created: YYYY-MM-DD
---
```

## Labels
- `spec`: a feature spec. It describes the problem, solution, user stories and decisions, and is usually broken into smaller issues.
- `ready-for-agent`: fully specified, so an agent can start without asking further questions.
- `needs-human`: blocked on a decision or asset from the owner.
- `bug`, `chore`, `backlog`: as named.

## Workflow for agents
1. Pick an issue with `status: open` and the `ready-for-agent` label, whose `blocked_by` issues are all `done`. Read its `parent` spec first, if it has one. Tick its acceptance criteria as they pass.
2. Set `status: in-progress` before starting work.
3. If you're blocked on a decision, add a `## Questions` section, set `status: blocked`, add the `needs-human` label and stop.
4. When finished, set `status: done` and append a `## Resolution` section: what changed, and the commit SHAs.
5. To break a spec into smaller issues, create new numbered files with `parent:` set. Don't edit the spec's decisions without the owner's agreement.
