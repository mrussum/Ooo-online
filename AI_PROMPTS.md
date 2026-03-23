# ARCHITECTURE.md — Component Structure & Patterns

## COMPONENT TREE

OooOnline (root)
  State: activeApp, bmoMood, bootDone, bootPhase, transition, apiKey
  Ref:   appStates (persistent state store for all 8 apps)
  │
  ├── BMOFace(mood, size, pulse)
  │     SVG component. 8 moods. Never fetches. Pure display.
  │
  ├── BootScreen
  │     Phases 0-3. Cinematic BMO zoom-in reveals home.
  │     Self-destructs via setBootDone(true) after phase 3.
  │
  ├── HomeScreen
  │     OooLandscape (SVG background)
  │     BMOHero (140px BMO + SpeechBubble cycling IDLE_MESSAGES)
  │     AppGrid (8 AppCard components)
  │     Each AppCard: icon, label, desc, accent bar, resume dot
  │
  ├── AppShell (when activeApp !== null)
  │     Applies per-app background theme
  │     Handles transition animation
  │     Renders active app component
  │
  └── Shared components
        ChatInput     — textarea + send button, Enter to submit
        MsgBubble     — user (right, orange) or BMO (left, teal + avatar)
        ThinkingDots  — 3 pulsing dots
        BMOErrorState — scared BMO + message + retry button
        SpeechBubble  — BMO speech bubble with tail

## STATE PATTERNS

### Root appStates ref (Session 3)
Each app reads from and writes to appStates.current[appId].
This ref persists across app unmounts/remounts.
Pattern:
  Props in:  savedState={appStates.current.chat}
  Props in:  onSave={(s) => { appStates.current.chat = s; }}
  Init:      useState(savedState?.messages || DEFAULT)
  On change: onSave({ messages: newMessages, history: hist.current })

### Conversation history
Each chat/lore app maintains a hist = useRef([]) for API calls.
History is trimmed to last 20 messages (10 exchanges) before each call.
History is saved to appStates so it persists navigation.

### API calling pattern
async function callAPI(userMessage) {
  hist.current = [...hist.current, {role:"user", content: userMessage}];
  setLoading(true);
  onMoodChange("thinking");
  try {
    const reply = await CLAUDE(SYSTEM, hist.current, maxTokens);
    hist.current = [...hist.current, {role:"assistant", content: reply}];
    if (hist.current.length > 20) hist.current = hist.current.slice(-20);
    // update UI state
    onMoodChange("happy");
    onSave({ messages: [...messages, {role:"assistant", content:reply}], history: hist.current });
  } catch (err) {
    setError(err.message);
    onMoodChange("scared");
  } finally {
    setLoading(false);
  }
}

## FILE ORGANISATION (keep sections clearly delimited)

// ════ CONSTANTS & CONFIG ════
// ════ API ════
// ════ SHARED COMPONENTS ════
// ════ BMO FACE ════
// ════ BOOT SCREEN ════
// ════ HOME SCREEN ════
// ════ APP: CHAT ════
// ════ APP: GAME ════
// ════ APP: LORE ════
// ════ APP: STORY ════
// ════ APP: PRISMO ════
// ════ APP: SONG ════
// ════ APP: TRIVIA ════
// ════ APP: ORACLE ════
// ════ ROOT COMPONENT ════

## TECHNICAL CONSTRAINTS (never violate)
1. Single .jsx file — no imports except react hooks and listed libraries
2. No localStorage — use React state/useRef only
3. No Tailwind arbitrary values — use inline styles for custom colours
4. Google Fonts via @import at TOP of style tag
5. All @keyframes names must be unique
6. position:absolute not fixed for decorative elements
7. Root layout: height:100dvh, flex column, flex:1 overflow-y:auto children
8. JSON parse always: raw.replace(/```json|```/g,'').trim() then try/catch
9. React keys: never use array index, use content hash or timestamp
10. BMOFace: wrap Eyes/Mouth as const inside the function (not outer scope)
