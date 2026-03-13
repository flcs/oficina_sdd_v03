<!--
SYNC IMPACT REPORT
==================
Version change: [CONSTITUTION_VERSION] → 1.0.0 (Initial ratification — all placeholders replaced)

Modified principles:
  [PRINCIPLE_1_NAME] → I. Object-Oriented Design
  [PRINCIPLE_2_NAME] → II. SOLID Principles
  [PRINCIPLE_3_NAME] → III. Object Calisthenics
  [PRINCIPLE_4_NAME] → IV. Strict TypeScript Typing (NON-NEGOTIABLE)
  [PRINCIPLE_5_NAME] → V. Test-Driven Development (NON-NEGOTIABLE)

Added sections:
  "TypeScript & Technology Standards" (replaces [SECTION_2_NAME])
  "Development Workflow" (replaces [SECTION_3_NAME])

Removed sections: none

Templates reviewed:
  ✅ .specify/templates/plan-template.md — Constitution Check gate compatible; no edits required
  ✅ .specify/templates/spec-template.md — compatible; no mandatory section changes required
  ✅ .specify/templates/tasks-template.md — test task ordering format compatible with TDD mandate

Deferred TODOs: none
-->

# Oficina SDD v03 Constitution

## Core Principles

### I. Object-Oriented Design

All code MUST be organized into classes and objects. Procedural code at the module top-level is
prohibited. Each class MUST have a single, clearly named purpose. Encapsulation is non-negotiable:
data and the behavior that operates on it MUST reside in the same class.

Raw data structures (plain objects, untyped records) are prohibited as feature boundaries; all
domain data MUST be wrapped in typed value objects or entities. No domain logic may leak into
React components — components are strictly presentational adapters.

### II. SOLID Principles

All design decisions MUST comply with SOLID:

- **S — Single Responsibility**: Each class and module MUST have exactly one axis of change.
  Mixing UI, business logic, and data access in one class is prohibited.
- **O — Open/Closed**: Classes MUST be open for extension and closed for modification. Behavior
  changes are introduced via new classes, not by editing existing stable code.
- **L — Liskov Substitution**: Every subtype MUST be substitutable for its declared base type
  without altering program correctness. Violations invalidate the inheritance hierarchy.
- **I — Interface Segregation**: Interfaces MUST be narrow and role-specific. No class may be
  forced to implement methods it does not use.
- **D — Dependency Inversion**: High-level modules MUST depend on abstractions (interfaces/types),
  never on concrete implementations. Concretions are injected, not instantiated internally.

### III. Object Calisthenics

All code MUST follow the nine Object Calisthenics rules without exception:

1. One level of indentation per method.
2. No use of the `else` keyword — use early returns or polymorphism instead.
3. Wrap all primitives and strings in domain value objects.
4. First-class collections: a class wrapping a collection MUST have no other instance variables.
5. One dot per line (no chaining across object boundaries).
6. No abbreviations: names MUST be full, intention-revealing words.
7. Keep entities small: max 50 lines per class, max 5 methods, max 5 instance variables.
8. No classes with more than two instance variables.
9. No getters or setters: expose behavior, not data.

### IV. Strict TypeScript Typing (NON-NEGOTIABLE)

`"strict": true` MUST be enabled in `tsconfig.json` at all times. The following are
unconditionally prohibited:

- The `any` type in any form.
- Unnarrowed `unknown` — every `unknown` MUST be narrowed before use.
- Unsafe type assertions (`as SomeType`) without a documented justification in a code comment.
- Implicit `void` or untyped return signatures on exported functions.

Every exported function, method, and React component prop MUST carry explicit TypeScript type
annotations. Type inference is permitted exclusively for local variables where the type is
unambiguous at the declaration site.

### V. Test-Driven Development (NON-NEGOTIABLE)

TDD MUST be followed for every unit of production code. The Red-Green-Refactor cycle is strictly
enforced:

1. **Red**: Write a failing test that defines the expected behavior. No production code may be
   written until at least one failing test exists for the targeted behavior.
2. **Green**: Write the minimum production code required to make the failing test pass. No more.
3. **Refactor**: Clean up structure and readability without changing behavior. All tests MUST
   remain green throughout.

No PR adding or modifying production behavior is accepted without a corresponding test. Tests
serve as living documentation and MUST be as readable and maintainable as the production code
they verify.

## TypeScript & Technology Standards

The following technology constraints are non-negotiable for this project:

- **Language**: TypeScript (`.ts` / `.tsx`) exclusively. No raw `.js` files under `src/`.
- **UI Framework**: React 18+ using strict functional components and custom hooks.
  Class-based React components are prohibited.
- **Build Tool**: Vite.
- **Test Runner**: Vitest with `jsdom` environment.
- **Component Testing**: React Testing Library. Direct DOM manipulation in tests is prohibited.
- **Type configuration**: `tsconfig.json` MUST include `"strict": true`, `"noImplicitAny": true`,
  and `"strictNullChecks": true`.

## Development Workflow

The development workflow enforces the constitution at every stage:

- **Feature start**: A failing test (Red phase) MUST exist before any implementation work begins.
- **PR gate**: All tests MUST pass (`vitest run`) and TypeScript MUST compile without errors
  (`tsc --noEmit`) before a PR is opened.
- **Code review checklist** (MUST be verified for every PR):
  - [ ] All new classes respect Object Calisthenics rules (Rules 1–9).
  - [ ] SOLID principles are demonstrably satisfied in the proposed design.
  - [ ] No `any` type or unsafe type assertions introduced without documented justification.
  - [ ] Every exported API carries explicit TypeScript annotations.
  - [ ] Tests were written before implementation (TDD cycle evident in commit history).
  - [ ] All tests are green and no coverage regression exists.
- **Refactoring**: MUST occur only while all tests are green. Refactoring commits MUST NOT
  mix in behavioral changes.

## Governance

This constitution supersedes all other coding practices, style guides, and individual preferences.
Compliance is mandatory for every contributor.

**Amendment procedure**:

1. Propose the amendment in writing, stating the reason and the affected principles.
2. Obtain consensus approval from the team.
3. Update this file with an incremented version and record the change in the Sync Impact Report.
4. Update all dependent templates and guidance documents accordingly.

**Versioning policy** (Semantic Versioning):

- **MAJOR**: Backward-incompatible change — removal or fundamental redefinition of a principle.
- **MINOR**: New principle or section added, or material expansion of existing guidance.
- **PATCH**: Clarifications, wording improvements, typo fixes, non-semantic refinements.

**Compliance review**: All PRs MUST be verified against the Development Workflow checklist above.
Complexity violations MUST be documented in the plan's Complexity Tracking table with justification.

**Version**: 1.0.0 | **Ratified**: 2026-03-13 | **Last Amended**: 2026-03-13
