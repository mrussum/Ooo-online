# Quick Reference — Ooo Online

Paste this at the start of any Claude Code session as a fast context reminder.

---

## What is this?

Adventure Time fan portal. Single React JSX file. BMO's OS aesthetic.
8 AI-powered apps. All Claude API via the `CLAUDE()` helper.

## Key Rules
1. Single .jsx file only
2. No localStorage (use useRef for persistence)
3. Fonts: Fredoka One (headings), Nunito (body), Courier New (system)
4. Every app needs: loading state, error state, onMoodChange, onSpeak props
5. All API calls through `CLAUDE(system, messages, max_tokens)`

## Colour Quick Reference
```
BMO teal:    #00f5d4    Chat colour
Game orange: #f4a261    
Lore ice:    #a8dadc    
Story purple:#c77dff    
Prismo gold: #ffd700    
Song pink:   #ff6b9d    
Trivia green:#2dc653    
Oracle amber:#ff9f1c    
Damage red:  #e63946    
Heal green:  #2dc653    
Background:  #0a0e1a    
Surface:     #131929    
```

## App IDs
chat | game | lore | story | prismo | song | trivia | oracle

## Files to read each session
- CLAUDE.md (always)
- docs/current-issues.md (always)  
- The relevant session prompt file
- docs/app-specs.md (if touching AI prompts)
- docs/design-system.md (if touching visuals)
- docs/at-lore-reference.md (if touching AT content)
