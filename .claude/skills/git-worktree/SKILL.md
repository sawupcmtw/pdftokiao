---
name: git-worktree
description: |
  Git worktree workflow for parallel development and isolated feature work.
  Use when starting new features, working on multiple branches simultaneously,
  or needing isolated development environments.
---

# Git Worktree

## When to Use

- Starting a new feature while keeping main clean
- Working on multiple features simultaneously
- Reviewing PRs while working on your own code
- Experimenting without affecting main checkout

## Commands

### Create Worktree

```bash
# New branch from current HEAD
git worktree add ../.[project-name]-worktrees/[(branch/feature)-name] -b feature/name

# From existing branch
git worktree add ../.[project-name]-worktrees/[(branch/feature)-name] feature/existing

# From specific commit/tag
git worktree add ../.[project-name]-worktrees/hotfix-v1 -b hotfix/v1 v1.0.0
```

### List & Remove

```bash
git worktree list
git worktree remove ../.[project-name]-worktrees/[(branch/feature)-name]
git worktree remove --force ../.[project-name]-worktrees/[(branch/feature)-name]  # if dirty
```

## Best Practices

1. **Naming**: `../.<project-name>-worktrees/<branch|feature-name>`
2. **One branch per worktree**: Never checkout same branch twice
3. **Cleanup after merge**: Remove worktrees promptly
4. **Shared git objects**: All worktrees share .git, so commits are available everywhere
