# Contributing to MatchDay Co-Pilot

Thank you for contributing to the **MatchDay Co-Pilot** operations engine for the **Google Prompt Wars Virtual Challenge 4**. We welcome contributions from developers, volunteers, and UX designers to make stadium crowd coordination safer and more accessible.

---

## 🛠️ Development Guidelines

### 1. Code Standards
* **Language:** Use TypeScript for all packages and web apps. Ensure strict type-checking is clean before submitting PRs. Explicit `any` casts are strictly prohibited; cast global configurations securely (e.g., using `FirebaseOptions` or `Record<string, unknown>`).
* **Styling:** Standardize on Tailwind CSS using Google Material Design 3 light-theme principles (warm colors, accessible contrast focus borders, and Outfit sans-serif fonts).
* **Animations:** Keep transitions smooth and static (e.g., standard fade-in). High-frequency blinking light elements are prohibited to prevent distraction during operations.
* **React Rendering Lifecycle:** To prevent React warning loops during rendering, avoid triggering synchronous state updates inside `useEffect` or other lifecycle hooks. Use:
  * **Lazy state initialization:** Initialize state directly using function constructor forms (e.g., `useState(() => loadInitialState())`).
  * **Deferred execution:** Wrap camera operations and telemetry triggers in `useCallback` hooks, and defer their initial invocation using `setTimeout(..., 0)`.
  * **ARIA and Accessibility:** Strictly adhere to the W3C ARIA guidelines for navigation elements. For mobile navigation menus, configure `role="tablist"` on the nav container and apply `role="tab"`, `aria-selected`, and clear focus border visual rings (e.g., `focus:ring-2 focus:ring-[#137333]`) to all tabs.

### 2. Google Services Architecture
* **Gemini Adapter:** All generative AI calls must reside on the server-side (Next.js Server Actions) and pass through the `@fifa/core` engine.
* **Schema Validation:** Every parsed AI JSON response must be strictly checked for keys and types inside `packages/core/src/gemini/index.ts`. If verification fails, it must trigger the default offline fallback.
* **Audit Logs:** Never write raw `null` identifiers to Firestore collections. Always use the standard `getOperatorIdentity()` helper.
* **API Sanitization:** Sanitize all user-controlled text fields in reports using the safety sanitizer helper to filter out malicious injection statements.

---

## 🧪 Testing Protocol

Before committing or pushing any code changes, ensure all tests compile and execute successfully.

1. Compile the shared core library packages (prerequisite for the test runner):
   ```bash
   pnpm --filter @fifa/core build
   ```
2. Run the monorepo test suite from the root directory:
   ```bash
   pnpm test
   ```
3. Confirm the typechecker runs clean:
   ```bash
   pnpm typecheck
   ```
4. Run code style linting checks:
   ```bash
   pnpm lint
   ```
5. Run the Next.js production compiler to assert build stability:
   ```bash
   pnpm --filter @fifa/web build
   ```

---

## 🚀 Submitting Changes

1. **Fork the Repository:** Create a feature branch off of the main development line:
   ```bash
   git checkout -b feature/your-awesome-upgrade
   ```
2. **Commit Messages:** Follow clean, conventional commit prefixes:
   * `feat: ...` (new operational feature)
   * `fix: ...` (bug resolution or security hardening)
   * `docs: ...` (README or documentation updates)
   * `test: ...` (extending test coverage)
3. **Verify:** Ensure all test runs, linting steps, and TS compiler typechecks are passing before pushing to remote.
