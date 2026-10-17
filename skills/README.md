# Skills

Each folder here is one agent skill with a `SKILL.md`.

| Skill | What it does |
|---|---|
| [vietnam-menu-reader](vietnam-menu-reader/SKILL.md) | Reads restaurant menu photos (Vietnamese, Thai, other), explains dishes, builds an order card for the waiter, and saves dish data and photos to the LocalGuide Supabase library. Needs the LocalGuide Supabase connector. |

## Download a skill

One file:

```bash
mkdir -p vietnam-menu-reader
curl -sSL https://raw.githubusercontent.com/si-thu-ye-yint/localguide/main/skills/vietnam-menu-reader/SKILL.md -o vietnam-menu-reader/SKILL.md
```

All skills (Claude Code, into the user skills folder):

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/si-thu-ye-yint/localguide.git /tmp/localguide
git -C /tmp/localguide sparse-checkout set skills
cp -r /tmp/localguide/skills/*/ ~/.claude/skills/
```

## Add or update a skill

Put it in `skills/<skill-name>/SKILL.md` and add a row to the table above.
