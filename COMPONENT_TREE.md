# Ooo Online — Claude Code Handover Pack

## Quick Start

1. Open this folder in your terminal
2. Run: claude
3. Say: "Please read CLAUDE.md and docs/BUGS.md before we start"
4. Then paste the Session 1 prompt from prompts/SESSION_PROMPTS.md

## What's in this pack

| File | What it is |
|------|-----------|
| CLAUDE.md | Master context — Claude Code reads this every session |
| docs/DESIGN_SYSTEM.md | Colours, fonts, animations, component patterns |
| docs/AT_LORE.md | Adventure Time canon for accurate AI prompts |
| docs/APP_SPECS.md | Per-app UX flows and feature specs |
| docs/BUGS.md | Full bug tracker (21 issues documented) |
| prompts/SESSION_PROMPTS.md | 8 ready-to-paste session prompts |
| prompts/AI_PROMPTS.md | All 8 Claude API system prompts |
| architecture/COMPONENT_TREE.md | Component hierarchy + state ownership map |
| src/ooo-online.jsx | Current v0.1 prototype (reference only — full rebuild planned) |

## The 8 Sessions

1. Foundation + Home Screen (landscape, boot, fonts)
2. BMO Face System + Navigation
3. Talk to BMO + Lore Vault
4. Ooo Adventure Game
5. Story Machine + Song Writer
6. Prismo + Oracle + Trivia
7. State Persistence + Error Handling
8. Mobile + Polish + Final QA

## Key Design Rules

- The site IS BMO's OS — not a website, a device
- Home screen is a painted Ooo landscape, not a grid
- Every app looks like a different location in Ooo
- BMO must always be visible and reacting
- Three fonts: Fredoka One (display) + Nunito (body) + Courier New (system)
- All state persists across navigation

See CLAUDE.md for the full spec.
