# MatchDay Co-Pilot: FIFA World Cup 2026 Operations

### Google Prompt Wars — Challenge 4: Smart Stadiums & Tournament Operations

A light-theme web application that turns live crowd telemetry into safe, actionable, multilingual operational guidance for stadium staff and volunteers during the FIFA World Cup 2026.

---

### 1. Challenge Vertical

**Challenge 4 — Smart Stadiums & Tournament Operations.**
The application targets the operational coordination gap during major crowd events: when 80,000+ fans pack a stadium, operations coordinators need a fast way to interpret sensor data and dispatch clear instructions to on-the-ground volunteer teams.

### 2. User Persona

- **Operations Coordinator:** Monitors crowd telemetry on the dashboard, reviews AI-generated directives, and authorizes crowd guidance.
- **Volunteer Steward:** Receives translated announcement scripts and follows directed crowd flow actions in their assigned sector.

### 3. Operational Workflow

The application drives one continuous cycle:

1. **Telemetry Intake** — Crowd sensor data (density %, noise dB, congestion ratio, anomaly flags) arrives via Firestore. In demo mode, operators trigger simulated scenarios.
2. **AI Directive Generation** — A Next.js server action sends the telemetry to Gemini, which runs a 4-stage pipeline (normalize → classify → directive → broadcast) and returns a structured operational directive.
3. **Operator Review & Acknowledgment** — The coordinator reviews the directive's severity, action steps, recommended routes, and AI reasoning, then acknowledges it. The acknowledgment is logged to Firestore with operator identity.
4. **Multilingual Announcements** — Gemini generates crowd-guidance scripts in English, Spanish, and Portuguese. A zone selector lets stewards tailor scripts to specific stadium sectors.
5. **Incident Reporting** — Operators log crowd flow or equipment issues directly to Firestore, with input sanitization applied before writes.
6. **Shift Off-Ramp** — The volunteer returns equipment (checklist), then slides to purge local session state and sign out securely.

### 4. How Gemini Is Used

Gemini is the productive core of the application — not a background feature. The server action (`apps/web/src/app/actions/directives.ts`) calls `@google/genai` with `gemini-3.1-flash-lite` through a 4-stage structured-output pipeline:

| Stage | Purpose | Output |
|-------|---------|--------|
| 1. Normalize | Sanitize and restructure raw telemetry | Clean JSON telemetry object |
| 2. Classify | Assign severity (LOW / MEDIUM / HIGH / CRITICAL) | Severity level + one-sentence reason |
| 3. Directive | Generate actionable operational guidance | Headline, action steps, route, reasoning |
| 4. Broadcast | Create multilingual crowd announcements | EN / ES / PT announcement scripts |

Each stage uses `responseMimeType: 'application/json'` with a strict `responseSchema` to enforce structured output. The response is validated after each stage. If any stage fails or returns malformed data, the system falls back to a safe local mock directive.

### 5. Guardrails & Safety

- **Server-side API isolation:** The Gemini API key is only accessed in the `'use server'` action. It never reaches the client.
- **Input clamping:** All numeric telemetry values are clamped to valid ranges (density 0–1, noise 0–150 dB, coordinates 0–1) before being sent to Gemini.
- **Prompt injection redaction:** The anomaly description field is scanned for common injection patterns (`ignore previous`, `system prompt`, `override`, `bypass`, `you are now`, `act as`, `<script>`, etc.). Matches are redacted before the AI sees them.
- **Schema validation:** Each Gemini response is parsed and validated for required fields, correct types, and non-empty values. Invalid responses trigger the safe fallback.
- **Report sanitization:** Incident report text is stripped of `<script>`, `<iframe>`, `<img>`, `<object>` tags, `javascript:` protocols, and inline event handlers before Firestore writes.
- **Identity audit guard:** A centralized `getOperatorIdentity()` helper ensures every Firestore write carries a valid identifier — Google email, display name, or a `DEMO_Steward_` prefix for anonymous users. Null identities are never written.
- **Destructive action gating:** The off-ramp purge requires completing an equipment return checklist before the slide-to-sign-out gesture is enabled.

### 6. Google Services Used

| Service | How It's Used |
|---------|--------------|
| **Firebase Authentication** | Google OAuth sign-in and anonymous demo mode. Determines `isDemo` flag for UI behavior. |
| **Cloud Firestore** | Real-time storage for telemetry, directives, acknowledgments, and incident reports. `onSnapshot` listeners provide live updates. |
| **Gemini API (`@google/genai`)** | 4-stage structured-output pipeline for directive generation. Called exclusively server-side via Next.js server actions. |
| **Firebase Remote Config** | Initialized with defaults for anomaly thresholds and model selection. Available for runtime configuration. |

### 7. Architecture

Monorepo managed with `pnpm`:

- **`apps/web`** — Next.js 16 frontend (App Router). Handles UI, Firebase client SDK, and server actions.
- **`packages/core`** — Shared library with Zod schemas, TypeScript types, and the Gemini service wrapper.

```
Simulated Telemetry ──► Firestore
                           │
                    Next.js Dashboard
                           │
                    Server Action (use server)
                           │
                    ┌──────┴──────┐
                    │ API Key?    │
                    ├─── Yes ─────┤
                    │  Gemini     │
                    │  4-Stage    │
                    │  Pipeline   │
                    ├─── No ──────┤
                    │  Local Safe │
                    │  Fallback   │
                    └──────┬──────┘
                           │
                    Schema Validation
                           │
                    Dashboard Update
```

### 8. What Is Prototype vs Production

| Aspect | Status | Notes |
|--------|--------|-------|
| Firebase Auth | Production | Real Google OAuth + anonymous auth |
| Firestore reads/writes | Production | Real database with security rules |
| Gemini API calls | Production | Real API calls with structured output |
| Telemetry data | Simulated | Three scenario buttons generate test data |
| Crowd heatmap | Prototype | Static SVG with anomaly dot overlay |
| Equipment checklist | Prototype | Local state, not persisted |
| Multilingual UI | Production | 6 languages (EN, ES, FR, PT, AR, ZH) for interface; 3 for announcements |

### 9. Demo Mode

When a user clicks "Launch Demo Session", the app signs in anonymously via Firebase Auth. The `isDemo` flag is set, and a subtle banner indicates simulation mode. All Firestore writes are tagged with `DEMO_Steward_` identity prefixes. The experience is functionally identical to a real session — telemetry scenarios, AI directives, acknowledgments, incident reports, and off-ramp all work the same way.

### 10. How to Run

```bash
# 1. Install dependencies
pnpm install

# 2. Create apps/web/.env.local with your credentials
NEXT_PUBLIC_FIREBASE_API_KEY="your-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
GEMINI_API_KEY="your-gemini-key"

# 3. Run development server
pnpm dev

# 4. Build (compiles core library + Next.js app)
pnpm build

# 5. Run tests
pnpm test

# 6. Open the app
# Navigate to http://localhost:3000
```

### 11. Tech Stack

- **Framework:** Next.js 16.2.10 (App Router)
- **Database & Auth:** Cloud Firestore, Firebase Authentication
- **AI:** Google GenAI SDK (`gemini-3.1-flash-lite`)
- **Styling:** Tailwind CSS v4, light-theme palette, Outfit + JetBrains Mono fonts
- **Validation:** Zod schemas for telemetry and directive types
- **Tests:** Node.js native test runner (`node --test`)
