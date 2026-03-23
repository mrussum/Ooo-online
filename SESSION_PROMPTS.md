# DESIGN_SYSTEM.md — Ooo Online Visual Language

## CORE CONCEPT
The site IS BMO's OS. Visual language = retro CRT + hand-painted AT world + playful children's OS.
The one thing users remember: BMO is alive here.

## COLOUR PALETTE

### Primary surfaces
  bmo-teal:    #00f5d4   (BMO screen, primary CTA)
  bmo-green:   #2a9d8f   (BMO body)
  dark-bg:     #0d1b2a   (root background)
  mid-bg:      #0a0f1a   (panels, header)
  card-bg:     rgba(255,255,255,0.06)
  border:      rgba(255,255,255,0.08) subtle / rgba(255,255,255,0.16) visible

### Per-app accent colours
  chat:    #00f5d4
  game:    #f4a261
  lore:    #a8dadc
  story:   #c77dff
  prismo:  #ffd700
  song:    #ff6b9d
  trivia:  #2dc653
  oracle:  #ff9f1c

### Semantic
  damage:   #e63946
  health:   #2dc653
  treasure: #ffd700

## TYPOGRAPHY

Import: @import url('https://fonts.googleapis.com/css2?family=Lilita+One&display=swap');

  Display (h1/h2/scores):  'Lilita One', cursive
  System/UI (buttons/nav): 'Courier New', monospace
  Body (chat/story/lore):  'Georgia', serif

Size scale: 10, 11, 12, 13, 14, 16, 20, 24, 32, 48px

## BMO FACE SIZES
  Home screen:    140px + speech bubble (animated idle messages)
  Boot screen:    120px
  App header:     36px (no bubble)
  Error state:    80px + apology bubble
  Death/victory:  100px + contextual bubble

## HOME SCREEN LAYOUT
  Top:    Header bar (52px)
  Middle: Ooo landscape SVG (hills, Tree Fort silhouette, stars, sky gradient)
  Center: BMO face (140px, floating, speech bubble)
  Bottom: App cartridge grid (4 col desktop, 2 col mobile)

## APP CARTRIDGE CARD
  Size: ~150px wide
  Hover: translateY(-4px), border glows with app accent, box-shadow
  Bottom: 4px accent colour bar
  Active indicator: small green dot if app has saved state

## APP BACKGROUND THEMES
  game:   radial-gradient orange tint + subtle stone pattern
  lore:   radial-gradient blue tint + aged paper texture  
  story:  radial-gradient purple + floating star particles
  prismo: radial-gradient gold + pulsing rings
  song:   radial-gradient pink + spotlight cone
  trivia: radial-gradient green + grid lines
  oracle: radial-gradient amber + shimmer

## TRANSITIONS
  Home→App: home slides left out, app slides in from right
  App→Home: app slides right out, home slides in from left
  Duration: 250ms ease

## KEY ANIMATIONS TO DEFINE (in root style tag)
  fadeUp, fadeIn, float, pulse, glow, starTwink, scanH, bootBlink,
  panelIn, slideOutL, slideInR, shake, spin, bounce,
  flashRed (game damage), confetti (victory), zoomReveal (boot)

## CRT SCANLINE
Subtle horizontal lines across all surfaces:
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)

## RESPONSIVE
  Mobile  <480px:  2-col grid, BMO 100px, 44px tap targets
  Tablet  480-768: 2-col grid, BMO 120px
  Desktop >768px:  4-col grid, BMO 140px, max-width 900px
