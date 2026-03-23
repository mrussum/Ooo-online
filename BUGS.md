# COMPONENT TREE & STATE MAP — OOO ONLINE

Last updated: Session 0 (pre-rebuild)

---

## Component Hierarchy

```
OooOnline                          ← Root component, owns ALL persistent state
│
├── [Global CSS / Fonts]           ← @import Fredoka One, Nunito; all keyframes
│
├── StarField                      ← CSS-only background stars (no JS)
│
├── BootSequence                   ← Shown before bootDone, then unmounts
│   └── BMOFace (120px, happy)
│
├── Header                         ← Always visible after boot
│   ├── BMOFace (38px, reacts)     ← Small header BMO
│   ├── AppTitle | "OOO ONLINE"    ← Changes when app is open
│   └── BackButton                 ← Only shown when app is open
│
├── HomeScreen                     ← Shown when activeApp === null
│   ├── OooLandscape               ← CSS layered background illustration
│   │   ├── Sky + Stars layer
│   │   ├── Mountains layer
│   │   ├── Candy Kingdom layer
│   │   └── Hills layer
│   ├── BMOFace (120px, floating)  ← Large home BMO with speech bubble
│   │   └── SpeechBubble           ← Cycles through idle phrases
│   └── AppGrid
│       └── AppCard × 8            ← Each app's entry card
│
└── AppPanel                       ← Shown when activeApp !== null
    ├── [app-specific background]
    ├── AppContent                 ← The active app component
    │   ├── AppChat
    │   ├── AppGame
    │   ├── AppLore
    │   ├── AppStory
    │   ├── AppPrismo
    │   ├── AppSong
    │   ├── AppTrivia
    │   └── AppOracle
    └── BMOCompanion (60px)        ← Small BMO in bottom-right corner
        └── SpeechBubble           ← App-specific hints
```

---

## State Ownership

### OooOnline (root) — owns these:

```javascript
// UI state
const [activeApp, setActiveApp] = useState(null);
const [bmoMood, setBmoMood] = useState("happy");
const [bootDone, setBootDone] = useState(false);
const [bmoSpeech, setBmoSpeech] = useState("");

// Persistent app state (useRef — does not trigger re-renders)
const chatHistoryRef   = useRef([]);      // [{role, content}]
const loreHistoryRef   = useRef([]);      // [{role, content}]
const gameStateRef     = useRef(null);    // full GameState object or null
const storyStateRef    = useRef({ text: "", history: [], started: false });
const songStateRef     = useRef({ song: "", style: "folk" });
const prismoStateRef   = useRef({ result: "", history: [], wish: "" });
const triviaStateRef   = useRef({ score: 0, total: 0, streak: 0, bestStreak: 0, phase: "pre-game", currentQ: null });
const oracleStateRef   = useRef({ answers: [], phase: "intro", qData: null, result: null });
```

### Passed down to app components:

```javascript
// Each app receives:
<AppChat
  historyRef={chatHistoryRef}
  onMoodChange={setBmoMood}
  onSpeechChange={setBmoSpeech}
/>

<AppGame
  stateRef={gameStateRef}
  onMoodChange={setBmoMood}
  onSpeechChange={setBmoSpeech}
/>

// etc for all apps
```

### Within each app component:

```javascript
// Local UI state (does NOT need to persist):
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// Local display state (DOES need to persist — read/write from ref):
const [messages, setMessages] = useState(() => historyRef.current.map(toDisplayMsg) || [initialMsg]);

// On every state change that should persist:
useEffect(() => {
  historyRef.current = messages.filter(m => m.role !== "display-only");
}, [messages]);
```

---

## Data Flow

```
User action
    ↓
App component local state update (setLoading, setError, etc.)
    ↓
Claude API call
    ↓
Parse response
    ↓
Update display state (setMessages, setScene, etc.)
    ↓
Sync to persistent ref (historyRef.current = ...)
    ↓
Call onMoodChange(mood) → parent updates bmoMood
    ↓
BMOFace component re-renders with new mood
```

---

## Shared Components

### BMOFace
```
Props:
  mood: string (idle|happy|excited|thinking|scared|singing|wise|gaming|sad|error)
  size: number (default 90)
  pulse: boolean (adds glow pulse animation when true)
  
Internal:
  SVG with conditional eye/mouth rendering based on mood
  CSS transition on fill/stroke (0.3s)
  drop-shadow filter for glow
```

### SpeechBubble
```
Props:
  text: string
  visible: boolean
  position: "above" | "right" | "left"
  accentColor: string (default #00f5d4)
  
Internal:
  Positioned absolutely relative to BMOFace wrapper
  Tail direction based on position prop
  fade-up animation on text change
```

### ChatInput
```
Props:
  onSend: (text: string) => void
  disabled: boolean
  placeholder: string
  accentColor: string (tints send button)
  
Internal:
  Textarea (2 rows) + send button
  Enter = send, Shift+Enter = newline
  Clears on send
```

### MsgBubble
```
Props:
  msg: { role: "user" | "assistant", content: string }
  accentColor: string (used for assistant bubble tint)
  
Internal:
  Right-aligned for user, left-aligned for assistant
  Asymmetric border radius
  Nunito font, 14px, 1.65 line-height
  fade-up on mount
```

### BMOError
```
Props:
  message: string
  onRetry: () => void
  
Internal:
  BMOFace mood="error" at 80px
  Error message in BMO voice
  Retry button with app accent colour
  Centred, full-height within app panel
```

### ThinkingDots
```
Props:
  color: string (default #00f5d4)
  
Internal:
  3 dots, staggered pulse animation
  Appears as BMO "thinking"
```

### EventBadge (game only)
```
Props:
  event: string (damage|heal|gold|item|lore|enemy|victory|death)
  value: string | number
  
Internal:
  Pill shape
  Colour-coded by event type
  fade-up animation
  Icon prefix per event type
```

---

## File Structure (target state after Session 1)

```
src/
└── ooo-online.jsx         ← Single file, all components

The file should be organised in this order:
1. Imports
2. Constants (APPS, CLAUDE fn, prompts)
3. CSS helpers (global style tag content as template literals)
4. BMOFace component
5. SpeechBubble component
6. Shared components (ChatInput, MsgBubble, ThinkingDots, BMOError, EventBadge)
7. App components (AppChat, AppGame, AppLore, AppStory, AppPrismo, AppSong, AppTrivia, AppOracle)
8. HomeScreen component
9. AppPanel wrapper component
10. OooOnline root component (export default)
```

---

## Notes for Claude Code

- The file will be large (~1200-1500 lines when complete). That's fine.
- Don't split into multiple files — this is a single-file React artifact for Claude.ai
- All CSS is in style tags or inline styles — no CSS files
- Tailwind is NOT available — use inline styles only
- Available external libraries: recharts, lucide-react, lodash, d3 (see artifact spec)
- No localStorage/sessionStorage — use React state + useRef only
