# CLAUDE.md — Ooo Online Project Memory
# ════════════════════════════════════════════════════════════════════════════
# Claude Code reads this file automatically at the start of every session.
# It is the single source of truth for what this project is, where it stands,
# and what to do next. UPDATE the SESSION LOG and CURRENT STATUS sections
# at the end of every session before closing.
# ════════════════════════════════════════════════════════════════════════════

## WHAT IS THIS PROJECT?

**Ooo Online** — A fully featured Adventure Time fan portal built as a single
React JSX artifact. The entire site IS BMO's operating system. Users are
"looking at BMO's screen." Every feature is an app cartridge. BMO is alive,
central, and reacts to everything.

**Vision:** When someone opens this, they should immediately feel like they've
been transported into the Land of Ooo. BMO greets them. The home screen shows
the Ooo landscape. Apps have individual visual identities. It's alive.

**Stack:**
- Single `.jsx` file (React hooks: useState, useEffect, useRef, useCallback)
- Anthropic Claude API — model `claude-sonnet-4-20250514`
- Tailwind core utility classes only (no compiler, pre-built classes only)
- Google Fonts via @import in style tag
- No router, no build tooling, no localStorage, no external CSS files
- Runs inside claude.ai artifact renderer

---

## THE 15 PROBLEMS — AUDIT RESULTS

Ranked by impact. Check off as fixed.

### CRITICAL
- [ ] **1. Home screen is a flat generic grid** — needs Ooo landscape, BMO large
      and central, apps as cartridges not buttons
- [ ] **2. BMO face is 38px and irrelevant** — needs to be 140px+ on home,
      with speech bubbles that actually talk to the user
- [ ] **3. No visual identity between apps** — every app looks identical.
      Needs per-app theming (Lore=parchment, Game=dungeon, Song=stage, etc.)
- [ ] **4. Boot sequence has no payoff** — needs cinematic reveal: boot screen
      zooms out to BECOME the home page. Currently just cuts.
- [ ] **5. Song Writer style selector broken** — fragile emoji-stripping
      comparison means active state never fires correctly

### HIGH
- [ ] **6. Double title bar** — main header + app sub-header both show app name
- [ ] **7. Game/chat state lost on navigation** — apps remount and wipe state.
      Need top-level useRef state store passed as props
- [ ] **8. No error handling** — CLAUDE() has no try/catch. Silent failures.
      No friendly BMO error state with retry button
- [ ] **9. Stars are position:fixed** — causes scroll glitching
- [ ] **10. Mobile layout broken** — overflow:hidden + 100vh breaks small screens

### MEDIUM
- [ ] **11. Typography is flat** — Courier New for everything. Need Lilita One
      for display headings, Courier for system UI, Georgia for body text
- [ ] **12. App cards have no personality** — no preview, no invitation,
      look like settings toggles
- [ ] **13. Navigation is clunky** — no back arrow, no breadcrumb, no place sense
- [ ] **14. No AT atmosphere on home** — no Ooo hills, Tree Fort, no sense of
      magical place. CSS/SVG landscape scene needed.
- [ ] **15. No API key UX** — first-time users get silent crashes

---

## CURRENT STATUS

**Phase:** Audit complete. Handover pack created. Ready for Session 1.
**Main file:** `src/ooo-online.jsx` (917 lines)

### Working features:
- Boot sequence (basic, no cinematic payoff)
- Home app grid (flat, needs redesign)
- BMO face SVG with 8 moods
- Talk to BMO (chat — functional)
- Ooo Adventure (game — HP/gold/inventory, functional)
- Lore Vault (Q&A — functional)
- Story Machine (generate + continue — functional)
- Prismo's Wishes (monkey's paw — functional)
- Song Writer (6 styles — style selector broken)
- Trivia Arena (adaptive difficulty — functional)
- Which Character (5-question quiz — functional)

### Broken/missing:
- Home screen visual identity
- Per-app visual theming
- BMO as central character
- State persistence across navigation
- Error handling
- Typography system
- Mobile layout
- Cinematic boot reveal
- AT atmosphere / landscape

---

## SESSION LOG

### Session 0 — Initial build + design audit
- Built full 8-app portal in claude.ai
- Conducted honest design audit, found 15 specific problems
- Created this handover pack for Claude Code
- **Next session:** Fix issues 1, 2, 4 — home screen redesign + cinematic boot

### Session 1 — [DATE TBD]
_Fill in after session. Note: what was changed, what files were touched,
what new issues were discovered, what to tackle next._

### Session 2 — [DATE TBD]
_Fill in after session._

---

## FILE STRUCTURE

```
ooo-online/
├── CLAUDE.md                    ← YOU ARE HERE (read every session)
├── src/
│   └── ooo-online.jsx           ← The entire app (single file)
├── docs/
│   ├── ARCHITECTURE.md          ← Component tree, state patterns
│   ├── DESIGN_SYSTEM.md         ← Colours, fonts, spacing, per-app themes
│   ├── APP_SPECS.md             ← Detailed spec for each of the 8 apps
│   └── AT_LORE_REFERENCE.md     ← Adventure Time lore for AI prompts
├── prompts/
│   ├── SESSION_1_HOME_SCREEN.md ← Copy-paste prompt for Session 1
│   ├── SESSION_2_APP_THEMING.md ← Copy-paste prompt for Session 2
│   ├── SESSION_3_STATE_ERRORS.md← Copy-paste prompt for Session 3
│   ├── SESSION_4_POLISH.md      ← Copy-paste prompt for Session 4
│   └── FEATURE_REQUESTS.md     ← Queue of future features
└── specs/
    └── AUDIT_REPORT.md          ← Full 15-issue audit with evidence
```

---

## ARCHITECTURE

### Component tree (current → target)
```
OooOnline (root)
├── appStates: useRef({})        ← PERSISTENT STATE STORE (to implement)
├── BMOFace                      ← SVG, 8 moods, sizes: 36/120/140px
├── BootScreen                   ← Cinematic, zooms out to home
├── HomeScreen                   ← Ooo landscape + cartridge grid
├── AppShell                     ← Navigation wrapper, per-app theming
│   ├── AppChat
│   ├── AppGame
│   ├── AppLore
│   ├── AppStory
│   ├── AppPrismo
│   ├── AppSong
│   ├── AppTrivia
│   └── AppOracle
└── Shared: ChatInput, MsgBubble, ThinkingDots, BMOErrorState
```

### Persistent state pattern (implement in Session 3)
```js
// Root component holds all app state in a ref (survives re-renders, no remount wipe)
const appStates = useRef({
  chat:   { messages: [INITIAL_MSG], history: [] },
  game:   { phase: "menu", hp: 10, gold: 0, inv: [], scene: null, history: [] },
  lore:   { messages: [INITIAL_MSG], history: [] },
  story:  { content: "", history: [], started: false, title: "" },
  prismo: { result: "", pastWishes: [] },
  song:   { song: "", style: "BMO folk" },
  trivia: { score: 0, total: 0, streak: 0, q: null },
  oracle: { phase: "start", answers: [], result: null },
});
// Pass as: <AppChat savedState={appStates.current.chat} onSave={s => appStates.current.chat = s} />
```

### CLAUDE() wrapper (use this version — has error handling)
```js
const CLAUDE = async (system, messages, max_tokens = 600) => {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens,
      system,
      messages,
    }),
  });
  if (!r.ok) throw new Error(`API error ${r.status}`);
  const d = await r.json();
  if (d.error) throw new Error(d.error.message);
  return d.content?.[0]?.text || "";
};
```

---

## DESIGN SYSTEM QUICK REFERENCE

### Colours (never deviate)
```
BMO teal:    #00f5d4    primary accent, BMO screen
BMO green:   #2a9d8f    BMO body colour
Dark bg:     #0d1b2a    deep background
Mid bg:      #0a0f1a    panels, header
Ooo orange:  #f4a261    game, warm, adventure
Ooo red:     #e63946    danger, damage, enemies
Ooo purple:  #c77dff    magic, story, mystery
Ooo yellow:  #ffd700    gold, wishes, treasure
Ooo pink:    #ff6b9d    song, fun, music
Ooo green:   #2dc653    health, trivia, good outcomes
Ooo blue:    #a8dadc    lore, calm, ancient
Ooo amber:   #ff9f1c    oracle, crystal, warm magic
```

### Typography
```
Display (h1/h2):  'Lilita One', cursive      ← chunky, adventurous
System/UI:        'Courier New', monospace   ← terminal, BMO OS feel
Body/chat:        'Georgia', serif           ← readable, warm
```
Import: `@import url('https://fonts.googleapis.com/css2?family=Lilita+One&display=swap');`

### Per-app themes
| App     | Accent  | Background                   | Font flavour |
|---------|---------|------------------------------|--------------|
| chat    | #00f5d4 | Dark, warm, clean            | Georgia body |
| game    | #f4a261 | Stone texture, dark dungeon  | Courier bold |
| lore    | #a8dadc | Aged parchment overlay       | Georgia serif|
| story   | #c77dff | Deep purple, starfield       | Georgia serif|
| prismo  | #ffd700 | Golden glow, Time Room       | Lilita display|
| song    | #ff6b9d | Stage lights, warm spotlight | Georgia italic|
| trivia  | #2dc653 | Arena, competitive, sharp    | Courier bold |
| oracle  | #ff9f1c | Crystal shimmer, mystical    | Lilita display|

### Spacing scale
4, 8, 12, 16, 20, 24, 32, 40, 48px

### Border radius
4px (sharp), 8px (default), 12px (cards), 16px (large cards), 9999px (pills)

---

## KNOWN TECHNICAL GOTCHAS

1. `position: fixed` inside scrollable containers → use `position: absolute`
   with `position: relative` on the parent
2. Root layout: use `height: 100vh; display: flex; flex-direction: column`
   then `flex: 1; overflow-y: auto` on scrollable children — never `overflow: hidden`
3. React keys on messages must be stable — use timestamp or uuid, NOT array index
4. `@keyframes` names must be unique across the whole file (no conflicts)
5. Google Fonts @import must be the FIRST rule in `<style>` tags
6. Tailwind: NO arbitrary values like `bg-[#hex]` — use inline styles for custom colours
7. JSON.parse LLM responses: ALWAYS strip ` ```json ``` ` fences first, ALWAYS try/catch
8. The artifact renderer clips at viewport — test at ~600px height
9. No localStorage in artifacts — use React state and refs only
10. Large single files are fine — keep organised with === section comments ===
