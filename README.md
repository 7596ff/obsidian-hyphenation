# Hyphenation

Enables justified text and hyphenation in Obsidian.

Uses `navigator.language` to determine the primary langauge for hyphenation.
This can be altered per-file by adding a `lang` key to a file's frontmatter:

```md
---
lang: de
---
```

The plugin's CSS applies rules to `p`, `ol`, and `ul` elements in preview mode,
except for external links, which in my opinion look ugly when hyphenated.
