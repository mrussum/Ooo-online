# SESSION PROMPTS FOR CLAUDE CODE

Copy and paste the relevant session prompt at the start of each Claude Code session.
Always open CLAUDE.md first so Claude Code has full context.

---

## HOW TO START EACH SESSION

1. Open your terminal in the ooo-online project directory
2. Run: claude
3. Say: "Please read CLAUDE.md and then read docs/BUGS.md before we start"
4. Wait for confirmation it has read both
5. Then paste the session prompt below

---

## SESSION 1 — Foundation + Home Screen

```
We're rebuilding Ooo Online from scratch. I've read CLAUDE.md and understand the full spec.

Today's session: Foundation + Home Screen.

Goals:
1. Set up the file structure — single React file at src/ooo-online.jsx
2. Load Google Fonts: Fredoka One + Nunito (via @import in style tag)
3. Implement the global CSS variables and keyframe animations from DESIGN_SYSTEM.md
4. Build the Ooo night-sky landscape home screen:
   - Layered CSS background: deep sky, stars, mountains, Candy Kingdom glow, hills
   - Large BMO face (120px) floating in foreground with speech bubble
   - BMO speech bubble cycles through idle phrases (see DESIGN_SYSTEM.md)
   - App icons as glowing portal cards arranged in the landscape
   - App cards: large emoji (40px), Fredoka One label, Nunito description
   - Hover: card lifts, border glows in app accent colour
5. Boot sequence:
   - Terminal lines appear one by one (AT-flavoured text)
   - After final line, BMO face grows from small to full size (CSS scale animation)
   - Then transitions to home screen
6. Fix BUG-009: stars are CSS background elements, NOT position:fixed div elements
7. Fix BUG-010: Fredoka One for titles, Nunito for body, Courier New only for system labels

Do NOT build any app content yet — just the home screen and boot sequence.
When complete, verify the home screen looks like a location in Ooo, not a grid.
Check DESIGN_SYSTEM.md for the landscape colour palette and layer spec.
```

---

## SESSION 2 — BMO Face System + Navigation

```
Read CLAUDE.md. Continuing Ooo Online rebuild. Session 2: BMO Face System + Navigation.

Goals:
1. BMO Face component — full spec in DESIGN_SYSTEM.md:
   - All mood states: idle, happy, excited, thinking, scared, singing, wise, gaming, sad, error
   - CSS transitions on colour changes (0.3s on fill/stroke)
   - drop-shadow glow filter on the face SVG
   - bmo-float animation (see DESIGN_SYSTEM.md animation library)
   - Pulse on "thinking" mood
2. Speech bubble component:
   - Positions above/beside BMO (responsive)
   - Tail pointing toward BMO face
   - Cycles through phrases on home screen (4-6 second interval)
   - Shows contextual text in apps
3. Navigation system:
   - Fix BUG-006: single title bar only
   - When in an app: header shows "← OOO HOME" button + app name + app colour tint
   - Smooth panel-open animation when entering an app
   - App state refs at top level — all 8 apps have persistent state objects
4. App companion BMO:
   - When inside any app, BMO appears at 60px in bottom-right corner
   - Reacts to events (called with setBmoMood from each app)
   - Has its own small speech bubble showing app-specific hints
5. Fix BUG-015: "LOADING CARTRIDGE..." transition when opening an app
6. Fix BUG-019: back button label is "← OOO HOME"
7. Fix BUG-020: keyboard navigation on app icons (tabIndex + Enter handler)

Verify: mood transitions are smooth and VISIBLE. The BMO face must react
noticeably enough that a user would notice and comment on it.
```

---

## SESSION 3 — Talk to BMO + Lore Vault

```
Read CLAUDE.md. Session 3: Talk to BMO + Lore Vault apps.

Both are conversation apps but must look and feel completely different.

TALK TO BMO:
1. Visual atmosphere: Tree Fort interior
   - Background: warm dark amber-brown gradient (not the default night blue)
   - Subtle string light effect at top (CSS radial gradients or dots)
   - Panel borders in warm wood tones
2. Chat UI:
   - BMO messages: Nunito 14px, teal bubble, 1.65 line-height
   - User messages: right-aligned, amber bubble
   - Quick prompt chips: always visible, all 6 chips from APP_SPECS.md
   - Chips wrap on mobile
3. Fix BUG-017: scroll-to-bottom works reliably (messages.length in useEffect dep array)
4. Fix BUG-001: wrap API call in try/catch, show BMO scared face + error message + retry
5. State persistence: chat history in top-level ref, survives navigation

LORE VAULT:
1. Visual atmosphere: ancient library / candlelight
   - Background: warm amber-brown dark tones (different hue from Tree Fort — more ochre)
   - Subtle decorative border on the panel (CSS border patterns, rune-adjacent)
   - Slightly parchment-tinted message background for BMO responses
2. Topic chips: 2 rows of 4, slightly aged/sepia styled
3. Same error handling as Talk to BMO
4. Deeper AI responses — use LORE_KEEPER prompt from AI_PROMPTS.md
5. State persistence: lore chat history survives navigation

SHARED:
- Both use the same ChatInput and MsgBubble base components
- But apply different colour schemes via CSS variables or style props
- Both apps: BMO companion (60px) in bottom-right reacts to conversation
```

---

## SESSION 4 — Ooo Adventure Game

```
Read CLAUDE.md. Session 4: Ooo Adventure game app.

This is the most complex app. Full spec in docs/APP_SPECS.md.

VISUAL ATMOSPHERE — Dungeon:
1. Background: near-black (#050508) with subtle orange radial glow at bottom
   (torch-flicker animation — very subtle, 15% opacity, slow)
2. Stone-wall texture suggestion via CSS (repeating subtle border patterns or bg gradient)
3. Choice buttons: amber accent, stone-grey background
4. Event badges: coloured pills per event type
5. Location header in Courier New

GAME STATE (fix BUG-002 for this app):
All game state must live in a top-level ref passed to AppGame:
```
gameStateRef = {
  hp, maxHp, gold, inventory, location, turn,
  phase, currentScene, history
}
```
When AppGame unmounts and remounts, restore from this ref.
The player's run must survive pressing HOME and returning.

GAMEPLAY:
1. Menu screen: rules panel + START button
2. START calls API with dungeon intro (random dungeon from 6 options)
3. Scene display: narration → event badge (animated) → BMO aside → choices
4. Choice interaction: fix BUG-016 (selected button highlights immediately, others grey out)
5. HP bar: fix BUG-018 animation, green → amber → red transitions
6. Inventory display: pill badges below HP bar
7. Fix BUG-001 for game: API errors show "BMO's game brain crashed" error state
8. Death screen: stats, TRY AGAIN button (resets state)
9. Victory screen: stats celebration, NEW ADVENTURE button

Use GAME_MASTER prompt from AI_PROMPTS.md.
Verify: a full game loop (start → 3 choices → death) works without errors.
```

---

## SESSION 5 — Story Machine + Song Writer

```
Read CLAUDE.md. Session 5: Story Machine and Song Writer apps.

STORY MACHINE:
1. Visual atmosphere: Storybook / light theme
   - THIS IS THE ONE LIGHT-THEMED APP
   - Background: #f5f0e8 (cream/off-white)
   - Text: #2d1810 (dark ink)
   - Panels: slightly warmer white with subtle drop shadows
   - Font: Nunito for story body text (generous line-height 1.9)
   - Story titles: Fredoka One
   - Chapter headers: Fredoka One with ink-line decorators
2. Prompt cards: 6 cards in grid, illustrated feel (icons + text), cream with shadow
3. Custom input: styled to match light theme
4. Story display: clean, generous margins, readable
5. Continue/New Story buttons at bottom of story
6. Chapter numbering on continuation ("— Chapter 2 —")
7. State persistence: current story text + history survives navigation

SONG WRITER:
1. Visual atmosphere: Music stage / spotlight
   - Background: very dark with spotlight (radial gradient white cone from top-centre)
   - Floating music notes: ♪ ♫ ♩ positioned absolutely, float-note animation, staggered
   - Subtle curtain-red colour at left/right edges (very faint)
2. Style selector: fix BUG-008 completely
   - Use STYLES array with {id, label, emoji} objects
   - Compare by id, never by label string
   - Active style gets accent colour border + background tint
3. Topic grid: 6 tiles, stage-themed styling
4. Song display:
   - Title: Fredoka One, large, pink glow
   - Section headers (VERSE, CHORUS, BRIDGE): Fredoka One, smaller, spaced
   - Lyrics: Nunito italic
   - Chord annotations [C] [Am] etc: teal pill badges inline with text
     (parse song text and wrap [CHORD] patterns in styled spans)
5. "Write Another" resets to style/topic selection

Use STORY_TELLER and SONG_WRITER prompts from AI_PROMPTS.md.
```

---

## SESSION 6 — Prismo + Oracle + Trivia

```
Read CLAUDE.md. Session 6: Prismo's Wishes, Which Character, and Trivia Arena.

PRISMO'S WISHES:
1. Visual atmosphere: Time Room / cosmic void
   - Near-black background (#050510)
   - 3-4 floating golden orbs (CSS circles, orb-drift animation, blur filter)
   - Golden text glow on wish results
2. Prismo quote at top (styled)
3. Example chips (4)
4. Input + grant button
5. Wish result: structured format matching PRISMO prompt output
6. Wish history: last 4 shown below, dimmed
7. Fix BUG-013: constrained height, scroll on history
8. State: last wish + history persists across navigation

WHICH CHARACTER:
1. Visual atmosphere: Fortune teller tent
   - Dark purple-maroon background
   - Crystal ball element (CSS: glowing circle with inner radial gradient)
   - Denser star field than other apps
   - Warm orange tent-edge accents at left/right
2. Intro screen: crystal ball, mystical copy, BEGIN button
3. Question flow: single question at a time, 4 options, progress dots (5 dots)
4. Transition between questions: fade-up animation
5. Fix BUG-014: manual question_number tracking in React state (don't rely on API)
6. Loading state after 5th answer: "The oracle is reading your soul..." with orb pulse
7. Result reveal: dramatic, character colour glow, large character name in Fredoka One
8. Try Again resets all oracle state

TRIVIA ARENA:
1. Visual atmosphere: Arena / competitive
   - Dark green-tinted background
   - Electric border pulse on answer reveal (box-shadow animation)
2. Pre-game: score stats if returning, START button
3. Question: difficulty badge + category tag, question text, 2x2 option grid
4. Answer reveal: fix BUG-018 (fade-up animation on explanation)
5. Correct: button turns green with checkmark. Wrong: selected goes red, correct goes green
6. Next question loads with fresh animation
7. Fix BUG-012: trivia app has internal scroll, never overflows panel
8. Score state persists across navigation (score, total, streak, bestStreak)

Use CHARACTER_ORACLE and TRIVIA_HOST prompts from AI_PROMPTS.md.
```

---

## SESSION 7 — State Persistence + Error Handling

```
Read CLAUDE.md. Session 7: State persistence audit + Error handling pass.

This session is about reliability and robustness. No new features.

STATE PERSISTENCE AUDIT (fix BUG-002):
1. Audit every app — does its state survive:
   a. Going HOME and returning?
   b. Opening a different app and coming back?
   c. Multiple round trips?
2. All persistent state must live in top-level useRef objects in OooOnline component
3. State refs to create at top level:
   - chatHistoryRef (Talk to BMO conversation)
   - loreHistoryRef (Lore Vault conversation)
   - gameStateRef (full game state object — see SESSION 4 spec)
   - storyStateRef (story text + history)
   - songStateRef (last song + selected style)
   - prismoHistoryRef (wish + history)
   - triviaStateRef (score, total, streak, phase, currentQ)
   - oracleStateRef (answers, phase, qData)
4. Pass refs as props to each app component
5. Each app restores from ref on mount, updates ref on state change

ERROR HANDLING PASS (fix BUG-001):
Ensure EVERY Claude API call in every app has:
1. try/catch wrapping
2. setLoading(false) in finally block
3. Visible error state: BMO scared face + error message in BMO voice + retry button
4. Retry button calls the same function again (clears error first)

Create a shared ErrorState component:
```jsx
function BMOError({ message, onRetry }) {
  return (
    <div style={{ /* centred, full height, scary vibes */ }}>
      <BMOFace mood="error" size={80}/>
      <p>{message || "Bzzzzt! BMO's brain got confused!"}</p>
      <button onClick={onRetry}>Try Again</button>
    </div>
  );
}
```

MOBILE LAYOUT AUDIT (fix BUG-003):
1. Test all apps at 375px width in browser devtools
2. Identify any overflow or hidden content
3. Fix: each app manages its own overflow, no fixed heights that break on mobile
4. Chat input: stays at bottom of screen on mobile
5. Game choices: full width on mobile
6. Home screen app grid: 2 columns on mobile, 4 on desktop
```

---

## SESSION 8 — Polish + Final QA

```
Read CLAUDE.md. Session 8: Final polish pass and QA sweep.

ANIMATION POLISH:
1. Verify all animations from DESIGN_SYSTEM.md are implemented and smooth:
   - Boot sequence has dramatic BMO reveal at the end
   - App transitions feel snappy (panel-open 0.2s)
   - Message bubbles fade up (0.3s)
   - Trivia answer reveal has the right animation
   - Event badges in game animate in
   - BMO mood transitions are smooth and visible
2. Check for any janky or stuttering animations
3. Ensure no layout shift on load (Google Fonts loaded with display=swap)

TYPOGRAPHY AUDIT:
1. Check every piece of text in every app:
   - Is the right font being used? (display/body/system rules from DESIGN_SYSTEM.md)
   - Is the size appropriate?
   - Is the line height readable?
2. Fredoka One should appear in: all titles, app names, nav labels
3. Nunito should appear in: all chat text, story text, descriptions, button labels
4. Courier New should appear in: stat labels (HP/Gold/Turn), OS chrome, system text only

VISUAL ATMOSPHERE AUDIT:
1. Open each of the 8 apps and verify they look visually distinct
2. Each app should feel like a different location:
   - Chat: warm, wood tones
   - Game: dark, dungeon, torch
   - Lore: candlelight, parchment
   - Story: LIGHT THEME, cream, ink
   - Prismo: void, gold orbs
   - Song: spotlight, music notes
   - Trivia: electric green, arena energy
   - Oracle: dark purple, crystal ball, stars
3. If any two apps look too similar, differentiate them

BUG SWEEP:
Go through docs/BUGS.md and verify every bug is marked FIXED.
For any remaining OPEN bugs, fix them or mark WONT FIX with reason.

FINAL CHECKS:
1. All 8 apps load and function without errors
2. All state persists across navigation
3. All error states work (test by temporarily breaking API call)
4. Home screen looks like a place in Ooo, not a menu
5. BMO face is visible, large, and reacts noticeably to events
6. Boot sequence is satisfying and dramatic
7. Mobile at 375px: no broken layouts, no hidden content
8. Single title bar (no double headers anywhere)

Update CLAUDE.md with final status and version number.
```

---

## AD HOC PROMPTS

### Add a new app
```
Read CLAUDE.md. I want to add a new app called [NAME] to Ooo Online.

App spec:
- ID: [id]
- Icon: [emoji]
- Accent colour: [hex]
- Description: [one line]
- Atmosphere: [location/feel]
- Feature: [what it does]

Please:
1. Add it to the APPS array
2. Create the AppXxx component following the same patterns as existing apps
3. Add it to the main render switch
4. Add it to the home screen grid
5. Document it in docs/APP_SPECS.md
6. Add its AI prompt to prompts/AI_PROMPTS.md
```

### Fix a specific bug
```
Read CLAUDE.md. I want to fix BUG-[ID] from docs/BUGS.md.

Please:
1. Read the bug description carefully
2. Find the relevant code
3. Implement the fix
4. Mark the bug as FIXED in docs/BUGS.md with today's date
5. Describe what you changed and why
```

### Improve an existing app
```
Read CLAUDE.md. I want to improve the [APP NAME] app.

Specific improvements:
- [list what you want changed]

Please keep changes consistent with the design system and existing patterns.
Update docs/APP_SPECS.md if the spec changes.
```

### Performance investigation
```
Read CLAUDE.md. The [describe symptom] is happening in Ooo Online.

Please:
1. Identify the cause
2. Propose a fix
3. Implement it
4. Verify it doesn't break anything else
```
