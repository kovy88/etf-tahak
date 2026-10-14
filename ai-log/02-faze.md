# ai-log – F2 Texty (Claude Code)

Export konverzace z Claude Code (desktop app), převedený do čitelné podoby: zprávy uživatele, odpovědi asistenta a zkrácená volání nástrojů. Úvahy modelu jsou vynechány.

## 👤 Uživatel

jedeme F2

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && sed -n 71,91p docs/PLAN.md; sed -n 117,203p docs/PLAN.md

> ↳ ## 3. Cílová skupina **Primární persona: „Začínající samouk"** - 24–40 let, zaměstnanec nebo OSVČ s příjmem nad mediánem. Má 50–500 tis. Kč na spořicím účtu nebo v bankovním podílovém fondu. - Je na Instagramu a Facebooku, sleduje české i americké finfluencery, čte r/eupersonalfinance nebo FB skupi…

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && sed -n 320,371p docs/PLAN.md; sed -n 408,446p docs/PLAN.md

> ↳ ## 12. Měření (tracking plan) **Nástroje:** - **PostHog Cloud EU:** funnely, breakdowny, session replay, později i experimenty. - Do souhlasu běží bez cookies (`persistence: 'memory'`), po souhlasu přejde na `localStorage+cookie`. - Stub snippet je ve `<head>` (s frontou), aby se zachytily i rychlé…

> 🔧 `Skill` — design:ux-copy

> ↳ Launching skill: design:ux-copy

## 👤 Uživatel

Base directory for this skill: /Users/kovy/Library/Application Support/Claude/local-agent-mode-sessions/1fbbecc0-4527-47b4-b6f4-b2510bdbe092/397e9e60-d599-4f5a-949c-a64d12009098/rpm/plugin_01XXJmxLXPEhPMmnxmrgntNw/skills/ux-copy

# /ux-copy

> If you see unfamiliar placeholders or need to check which tools are connected, see [CONNECTORS.md](../../CONNECTORS.md).

Write or review UX copy for any interface context.

## Usage

```
/ux-copy 
```

## What I Need From You

- **Context**: What screen, flow, or feature?
- **User state**: What is the user trying to do? How are they feeling?
- **Tone**: Formal, friendly, playful, reassuring?
- **Constraints**: Character limits, platform guidelines?

## Principles

1. **Clear**: Say exactly what you mean. No jargon, no ambiguity.
2. **Concise**: Use the fewest words that convey the full meaning.
3. **Consistent**: Same terms for the same things everywhere.
4. **Useful**: Every word should help the user accomplish their goal.
5. **Human**: Write like a helpful person, not a robot.

## Copy Patterns

### CTAs
- Start with a verb: "Start free trial", "Save changes", "Download report"
- Be specific: "Create account" not "Submit"
- Match the outcome to the label

### Error Messages
Structure: What happened + Why + How to fix
- "Payment declined. Your card was declined by your bank. Try a different card or contact your bank."

### Empty States
Structure: What this is + Why it's empty + How to start
- "No projects yet. Create your first project to start collaborating with your team."

### Confirmation Dialogs
- Make the action clear: "Delete 3 files?" not "Are you sure?"
- Describe consequences: "This can't be undone"
- Label buttons with the action: "Delete files" / "Keep files" not "OK" / "Cancel"

### Tooltips
- Concise, helpful, never obvious

### Loading States
- Set expectations, reduce anxiety

### Onboarding
- Progressive disclosure, one concept at a time

## Voice and Tone

Adapt tone to context:
- **Success**: Celebratory but not over the top
- **Error**: Empathetic and helpful
- **Warning**: Clear and actionable
- **Neutral**: Informative and concise

## Output

```markdown
## UX Copy: [Context]

### Recommended Copy
**[Element]**: [Copy]

### Alternatives
| Option | Copy | Tone | Best For |
|--------|------|------|----------|
| A | [Copy] | [Tone] | [When to use] |
| B | [Copy] | [Tone] | [When to use] |
| C | [Copy] | [Tone] | [When to use] |

### Rationale
[Why this copy works — user context, clarity, action-orientation]

### Localization Notes
[Anything translators should know — idioms to avoid, character expansion, cultural context]
```

## If Connectors Available

If **~~knowledge base** is connected:
- Pull your brand voice guidelines and content style guide
- Check for existing copy patterns and terminology standards

If **~~design tool** is connected:
- View the screen context in Figma to understand the full user flow
- Check character limits and layout constraints from the design

## Tips

1. **Be specific about context** — "Error message when payment fails" is better than "error message."
2. **Share your brand voice** — "We're professional but warm" helps me match your tone.
3. **Consider the user's emotional state** — Error messages need empathy. Success messages can celebrate.

> 🔧 `AskUserQuestion` — {"questions": [{"question": "Jak se jmenujete pro sekci „Kdo za tím stojí“? (jméno se zobrazí na stránce)", "header": "Jméno", "options": [{"label": "Napíšu vl…

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && git status --short | head; ls src src/app; cat tsconfig.json | head -30; python3 -c " import json e=json.load…

> ↳ The user answered: "Jak se jmenujete pro sekci „Kdo za tím stojí“? (jméno se zobrazí na stránce)"="napis klidne Matěj Koval", "Jedna až dvě věty o vás a proč tahák vznikl. Mám je napsat z vašich podkladů, nebo je zadáte sami?"="Navrhněte mi text". Read the answers carefully — they may request clari…

> ↳ src: app data src/app: favicon.ico globals.css layout.tsx page.tsx { "compilerOptions": { "target": "ES2017", "lib": ["dom", "dom.iterable", "esnext"], "allowJs": true, "skipLibCheck": true, "strict": true, "noEmit": true, "esModuleInterop": true, "module": "esnext", "moduleResolution": "bundler", …

Podklady k autorovi mám: Matěj Koval, text navrhnu sám. Nejdřív typografický helper, pak texty v `src/content/`.

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && mkdir -p src/lib src/content && cat > src/lib/format.ts <<'E' /** České formátování čísel, dat a typografie (…

> ↳ done

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer/src/content" && cat > author.ts <<'E' import { typoDeep } from "@/lib/format"; /** * Autor stránky. NÁVRH textu: …

> ↳ ok

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer/src/content" && python3 - <<'E' p='sections.ts';s=open(p).read() s=s.replace('"Daně v ČR: časový test 3 roky, lim…

> ↳ src/content/hero.ts(4,75): error TS1005: ';' expected. src/content/hero.ts(4,76): error TS1128: Declaration or statement expected. src/content/hero.ts(4,78): error TS1109: Expression expected. src/content/hero.ts(4,79): error TS1161: Unterminated regular expression literal.

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && sed -i '' 's#(ads/\*/copy.md)#(ads/A-poplatky a ads/B-voo, copy.md)#' src/content/hero.ts && npx tsc --noEmit…

> ↳ (Bash completed with no output)

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && npm i -D vitest 2>&1 | tail -2 && cat > vitest.config.ts <<'E' import path from "node:path"; import { defineC…

> ↳ npm error /Users/kovy/.npm/_logs/2026-10-14T09_37_13_629Z-eresolve-report.txt npm error A complete log of this run can be found in: /Users/kovy/.npm/_logs/2026-10-14T09_37_13_629Z-debug-0.log at wrapModuleLoad (node:internal/modules/cjs/loader:254:19) at Module.require (node:internal/modules/cjs/lo…

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && npm i -D vitest 2>&1 | grep -v "^npm error A complete" | head -20

> ↳ npm error code ERESOLVE npm error ERESOLVE could not resolve npm error npm error While resolving: vitest@5.0.4 npm error Found: @types/node@20.19.43 npm error node_modules/@types/node npm error dev @types/node@"^20" from the root project npm error peerOptional @types/node@"^20.19.0 || >=22.12.0" fr…

Instalace vitestu naráží na peer závislost `@types/node`. Zvedám ji na verzi 22, ta odpovídá lokálnímu Node 22.

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && npm i -D @types/node@^22 vitest 2>&1 | tail -3; git diff --stat package.json | tail -1; npx vitest run src/li…

> ↳ npm audit fix --force Run `npm audit` for details. 1 file changed, 5 insertions(+), 3 deletions(-) 16| }); 17| it("doplní nezlomitelné mezery po předložkách a u jednotek", () => { 18| expect(typo("Z Česka v 25 letech")).toBe(`Z${NBSP}Česka v${NBSP}25… | ^ 19| expect(typo("a v 5 %")).toBe(`a${NBSP}v…

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && sed -i '' 's/v\${NBSP}25\${NBSP}letech/v${NBSP}25 letech/' src/lib/format.test.ts && npx vitest run src/lib 2…

> ↳ Test Files 1 passed (1) Tests 3 passed (3) Start at 11:37:40 Duration 154ms (tests 42%, transform 35%, import 17%, worker 6%)

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && python3 - <<'E' p='src/content/form.ts';s=open(p).read() s=s.replace('emailSent: (email: string) => `Kopii po…

> ↳ ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯ FAIL src/content/content.test.ts > texty v src/content > každé číslo v hero B pochází z dat AssertionError: expected 'U 4 z 12 ETF existuje evropské dvojče…' to contain '4 z 12' Expected: "4 z 12" Received: "U 4 z 12 ETF existuje evropské dvojče se stejným indexem, u …

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && python3 - <<'E' p='src/content/content.test.ts';s=open(p).read() s=s.replace('const bundle =','const plain = …

> ↳ ⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯ FAIL src/content/content.test.ts > texty v src/content > mají nezlomitelnou mezeru mezi číslem a jednotkou AssertionError: Rozdíl za 9 let: expected true to be false // Object.is equality Tests 1 failed | 13 passed (14)

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && python3 - <<'E' p='src/lib/format.ts';s=open(p).read() s=s.replace(''' if (typeof value === "string") return …

> ↳ Tests 14 passed (14) > etf-tahak@0.1.0 lint > eslint

Typy, testy (14) a lint prochází. Commituju obsah a píšu texty reklam.

## 👤 Uživatel

Your response above was cut off mid-stream. Resume directly from where it stops — no apology, no recap. If none of it survived, answer the request from the start.

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && C="Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" && git add src/lib src/content && git commit -q…

> ↳ (Bash completed with no output)

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && mkdir -p ads/A-poplatky ads/B-voo && rm -f ads/.gitkeep && cat > ads/A-poplatky/copy.md <<'E' # Reklama A: „P…

> ↳ Tests 20 passed (20)

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && python3 - <<'E' p='ads/ads.test.ts';s=open(p).read() s=s.replace('import { N } from "@/content";','import { N…

> ↳ Tests 21 passed (21) > eslint bb66058 docs: mark F2 done dfa1c9e feat(ads): add copy for ads A and B with tests f3f1d9f chore: add vitest and bump @types/node to 22

F2 je hotová, pushnutá a odškrtnutá v PLAN §0. Testy (21 vitest), typecheck i lint procházejí.

## Co je hotové
- **Texty** jsou v `src/content/`: hero obou variant, sekce S2–S7, formulář, děkovný stav, FAQ, cookie lišta, upozornění, autor, e-mail a `variants.ts` s pořadím sekcí.
- **Čísla** se berou ze `src/content/data.ts`, které čte `src/data/*.json`. V textech nejsou natvrdo.
- **Typografie** se aplikuje na všechny texty centrálně přes `src/lib/format.ts` (nezlomitelné mezery, české formáty).
- **Texty bez e-mailu:** při vypnutém `NEXT_PUBLIC_EMAIL_ENABLED` nic neslibují e-mailem, hlídá to test.
- **Reklamy** jsou v `ads/A-poplatky/copy.md` a `ads/B-voo/copy.md`. Číslo v hero, v reklamě i v kalkulačce je stejné (377 000 Kč) a hlídá ho `ads/ads.test.ts`. Test hlídá i limit titulku (≤ 40 znaků), prvních 125 znaků primárního textu a UTM odkazy.

## Změny proti plánu
- **Hero A:** plán měl 1,8 % → 439 000 Kč. Podle F1 dat je to „1,46 % a 0,03 % ročně → 377 000 Kč“. H1: „Rozdíl mezi poplatkem 1,46 % a 0,03 % ročně? Za 25 let 377 000 Kč.“
- **Hero B:** plán sliboval dvojče ke každému ETF. V datech je dvojče se stejným indexem u 4 z 12, podobná alternativa u dalších 6 a u 2 nic. Text říká přesně toto.
- **Vitest:** přidal jsem ho už teď (patří do F4) kvůli testům textů a zvedl `@types/node` na 22.

## Hero: doporučené varianty
U každé varianty jsou v `hero.ts` v poli `alternatives` další 3 alternativy H1. Doporučuju ponechat tyto:
- **A:** „Rozdíl mezi poplatkem 1,46 % a 0,03 % ročně? Za 25 let 377 000 Kč.“ Číslo je v první větě, pochopí se za 3 s.
- **B:** „VOO, SPY, VTI. Z Česka je běžně nekoupíte. Tady je, co místo nich.“

## K vašemu schválení
1. **Text o autorovi je návrh** v `src/content/author.ts`: Matěj Koval, žádné vymyšlené fakty o vás. Je tam věta „Tahák jsem sestavil, protože srovnání ETF z NYSE jsou psaná pro Američany…“. Upravte podle sebe.
2. **Účel e-mailu při vypnutém odesílání:** mikrotext zní „Adresu uložíme pro případné další informace o ETF“. Je to úmyslně opatrné, ale souhlas a znění je třeba před spuštěním projít právně (PLAN §15).
3. **FAQ „Jak často aktualizujete?“** teď říká „pravidelnou aktualizaci zatím neslibujeme“. Pokud máte jiný záměr, napište.
4. **Provozovatel v patičce** je zatím `[doplní zadavatel]`. Je to bod do launch checklistu.

## Otevřené z F1
Vstupní poplatek průměrného fondu a CZ-specifický TER zůstávají nedoložené. Kalkulačka proto říká „průměrný akciový fond v EU (ESMA)“ a že rozdíl je spíš podhodnocený.

Teď je potřeba `/export` tohoto chatu do `ai-log/02-texty.md`. Pak můžete pustit F3, kde nejdřív ukážu 2 směry hero na 375×667 a vyberete.
