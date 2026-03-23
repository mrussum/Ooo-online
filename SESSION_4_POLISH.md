# APP_SPECS.md — Detailed specification for each of the 8 apps

## SHARED PATTERNS (all apps must follow)
- Receive: savedState prop + onSave(newState) callback
- On first render: initialise from savedState if it exists
- On every meaningful state change: call onSave()
- Show BMOErrorState on API failure with retry button
- ThinkingDots during all loading states
- App-specific background gradient (see DESIGN_SYSTEM.md)

## BMOErrorState component spec
  BMOFace mood="scared" size=80
  Speech bubble: "Bzzzzt! Something went wrong! BMO is sorry!"
  Retry button: [accent colour], calls the failed function again
  Secondary: "Check your connection?" in small muted text

---

## 1. AppChat — "Talk to BMO"
Accent: #00f5d4

### System prompt key points
BMO personality: childlike, warm, occasionally wise, loves games and imagination.
Knows all AT lore deeply. Under 100 words unless asked for detail.
Phrases: "Ohhh!", "Yes yes yes!", "BMO knows!", "Let BMO think..."

### UI requirements
- Chat bubbles: user right (orange tint), BMO left (teal tint)
- BMO messages have a tiny 20px BMO face avatar on left
- Quick prompt chips below messages (4 suggestions, horizontally scrollable)
- Input: textarea (2 rows), send on Enter, Shift+Enter for newline
- History: keep last 20 messages (10 exchanges) in API calls

### Improvements from audit
- Message avatars (tiny BMO face next to each BMO message)
- Timestamps on messages (HH:MM)
- "BMO is typing..." with animated dots (ThinkingDots)
- Smooth scroll to bottom on new message

---

## 2. AppGame — "Ooo Adventure"  
Accent: #f4a261

### System prompt key points
JSON response ONLY. Keys: narration, choices[3], event, event_value, bmo_aside, location.
Events: damage(1-3hp), heal(1-2hp), item(name), gold(5-30), enemy(name), lore(text), death, victory.
Use real AT: Dungeon of Doom, Ice Kingdom, Fire Kingdom, Candy Kingdom, Nightosphere.
Enemies: Ice King, Lemon Guards, Earclops, Deer, the Lich (final boss).
Items: Demon Blood Sword, Enchiridion, Golden Sword, Red Ruby, Ancient Psychic Tandem War Elephant.
Victory after ~8-12 meaningful turns.

### UI requirements
- Stats bar: HP bar (coloured by %, green>60, orange>30, red below), gold counter, turn number
- Location badge: "📍 [location]" pill
- Inventory: visual item chips with ⚔️ icon
- Narration: Georgia 14px, generous line height
- BMO aside: teal left-border callout box
- Choices: full-width buttons, labelled A/B/C with accent-coloured letter badge
- Event badge: appears above narration on new events, animated in
- Screen flash RED on damage (flashRed animation, 300ms)
- Death screen: BMO scared face (100px) + dramatic message + stats summary
- Victory screen: BMO excited face + confetti + full stats

### Improvements from audit
- Screen flash on damage
- BMO face changes mood per event in the game panel itself (not just header)
- Inventory as visual cards not text
- ASCII dungeon mini-map concept (simple, 2-3 room representation)

---

## 3. AppLore — "Lore Vault"
Accent: #a8dadc

### System prompt key points
Answer with encyclopaedic enthusiasm. Deep knowledge of:
- The Mushroom War (nuclear/biological ~1000 years ago, created Ooo)
- Simon Petrikov / Ice King (crown corruption, Betty)
- The Lich (born from a mutagenic bomb, anti-life)
- GOLB (chaos entity, enemy of order, final season villain)
- Finn (last human, Martin, grass curse, arm)
- Jake (Warren Ampersand alien parentage, stretchy powers)
- Princess Bubblegum (grew Candy Kingdom from biomass)
- Marceline (half-demon, mother died in war, Hunson Abadeer)
- Prismo (Time Room, wish granting, outside of time)
- Catalyst Comets, the Islands, Stakes arc

Format: use paragraph breaks and topic headers in responses.

### UI requirements  
- Aged parchment-tinted background overlay
- Topic shortcut chips (8 topics, 2 rows, horizontally scrollable)
- Responses render with bold headers (parse **text** → <strong>)
- BMO appears as "Librarian BMO" — wise mood, purple tint
- "Lore discovered" toast notifications for particularly deep answers

### Improvements from audit
- Parse markdown bold/headers in responses for better readability
- Topic chips organised by category (Characters, Events, Magic, Places)
- Parchment texture overlay on message area

---

## 4. AppStory — "Story Machine"
Accent: #c77dff

### System prompt key points
Write episodic AT stories, 300-500 words per segment. Full episode structure.
Vivid descriptions, real AT characters, emotional resonance. Include a TITLE.
If user asks to continue, seamlessly extend the story.
Auto-generate a creative title for each story.

### UI requirements
- Story prompt selection: visual cards not a list
- Story text: Georgia serif, 15px, generous line height (1.85)
- Auto-generated story TITLE displayed prominently above text (Lilita One)
- Chapter counter: "Chapter 1", "Chapter 2" as user continues
- Continue button: subtle, bottom of text
- New story: prompts user to confirm if story in progress
- Background: deep purple with very subtle star particles

### Story prompt options (replace current list)
  "Finn discovers a door beneath the Tree Fort that wasn't there yesterday"
  "Marceline finds her mother's old journal in the ruins of a human city"
  "BMO becomes King of Ooo for one day while Finn and Jake are away"
  "Ice King accidentally performs an act of genuine heroism"  
  "Princess Bubblegum's greatest experiment wakes up and starts asking questions"
  "A new Catalyst Comet arrives, but this one is small, confused, and scared"
  "Jake's children discover a part of Ooo no adult has ever seen"
  "The Lich is gone. Something is growing where he used to be."

---

## 5. AppPrismo — "Prismo's Wishes"
Accent: #ffd700

### System prompt key points
Prismo: chill, friendly, genuinely wants to help — but wishes go wrong literally.
Format response as:
  🌀 WISH GRANTED: [proclamation]
  [2-3 paragraphs: what happens, the twist, consequences]
  📝 PRISMO'S NOTE: [how to rephrase it]
Reference AT world. Be funny and occasionally profound.

### UI requirements
- Central golden glow orb (CSS animation, pulsing)
- Wish input styled as a golden scroll / parchment input
- "I wish..." placeholder, gold text on dark
- Wish history: last 3 wishes as collapsed cards
- Result displayed in a golden scroll container
- Prismo quote at top: "Every wish has a price, buddy." in italics
- Time Room aesthetic: golden rings, cosmic feel

---

## 6. AppSong — "Song Writer"
Accent: #ff6b9d

### System prompt key points
Write AT-style songs: whimsical, heartfelt, sometimes unexpectedly deep.
Always include TITLE, VERSE 1, CHORUS, VERSE 2, optional BRIDGE.
Include chord suggestions: [C] [Am] [F] [G] etc.
Styles: BMO folk, Marceline blues-rock, Epic ballad, LSP drama anthem, Jake jazz rap, Ice King lament.

### Style selector FIX
Current broken code:
  style === s.split(" ").slice(0,-1).join(" ")
Fix: use the full string including emoji as the key, or use an id:
  const STYLES = [
    { id: "bmo-folk",     label: "BMO Folk",      emoji: "🎵" },
    { id: "marc-blues",   label: "Marceline Blues", emoji: "🎸" },
    ...
  ]
  const [style, setStyle] = useState("bmo-folk");
  // compare: style === s.id

### UI requirements
- Stage spotlight aesthetic (radial gradient from top)
- Style buttons: clear active/inactive state using id comparison (see fix above)
- Song output: Georgia italic, generous spacing, chord markers in teal
- Musical note decorations (CSS/unicode: ♩ ♪ ♫ ♬)
- Each section (VERSE, CHORUS) gets a header label
- Print/copy button for sharing songs

---

## 7. AppTrivia — "Trivia Arena"
Accent: #2dc653

### System prompt key points
Generate varied trivia, return JSON only:
{ question, options[4], correct("A"/"B"/"C"/"D"), explanation, difficulty("easy"/"medium"/"hard"), category }
Categories: Characters, Lore/History, Magic/Items, Episodes, Relationships, Places.
Difficulty ramp: easy for Q1-3, medium for Q4-7, hard for Q8+.
Questions must be genuinely challenging AT knowledge, not trivia-trivial.

### UI requirements
- Difficulty progress bar: 5 dots that fill as questions progress
- Score, streak, accuracy stats at top
- Streak fire animation at 5+ (🔥 emoji bounces)
- Answer buttons: 2x2 grid, turn green(correct) or red(wrong) on answer
- Wrong answer: correct answer highlighted green even if not selected
- Explanation box: slides in below answers
- Category badge and difficulty badge on each question
- Leaderboard: top 5 scores stored in component state (within session)

---

## 8. AppOracle — "Which Character?"
Accent: #ff9f1c

### System prompt key points
Ask 5 personality questions, then reveal AT character match.
Questions should be genuinely personality-revealing, not AT trivia.
Return JSON per question: { type:"question", question, options[4], question_number }
Return JSON for result: { type:"result", character, reason(3-4 sentences), emoji, traits[3] }
Characters to assign: Finn, Jake, Marceline, Princess Bubblegum, Ice King/Simon, BMO, LSP, Flame Princess, Peppermint Butler, Tree Trunks, Prismo.

### UI requirements
- 5 progress dots (fill with amber as questions answered)
- Questions: large, centered, clear visual hierarchy
- 2x2 option grid, amber accent on hover
- Result screen: DRAMATIC reveal
  - Large character emoji (80px)
  - Character name in Lilita One, very large
  - 3 trait chips (e.g. "Adventurous", "Loyal", "Reckless")
  - Reason paragraph in Georgia
  - Character accent colour backgrounds the whole result
  - "Share result" button: copies "I'm [Character] from Adventure Time!" to clipboard
  - "Try again" button

