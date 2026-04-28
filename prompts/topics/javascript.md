# Topic Block — JavaScript Deep Dive

FILE:           src/pages/notes/frontend/JavaScript.jsx
PRIMARY_COLOR:  #D97706
GRAD_START:     #D97706
GRAD_END:       #FBBF24
ICON_LETTER:    J
BRAND:          JavaScript
EDITION:        ECMAScript 2024 · Modern JS Reference · Production Patterns 2025

COVER:
  title:    "JavaScript"
  subtitle: "The Language, From First Principles"
  tagline:  "Closures, prototype chain, async/await, the event loop,
             modern ES patterns, and production JavaScript engineering"
  stats:    6 Parts · 26 Sections · 240+ Concepts

FRESHER ANALOGY:
  JavaScript is like a single chef in a kitchen (single-threaded). They cook one dish
  at a time but can put things in the oven (async tasks) and serve another table while
  waiting. The event loop is the chef checking if the oven timer has gone off before
  picking the next task.

CODE LANGUAGES: JavaScript / ES2024 (primary) · Node.js runtime context

---

## Parts & Sections

Part 1 — Language Fundamentals
  1 — Types and Coercion
    1.1 Primitive Types and typeof
    1.2 Type Coercion: == vs ===
    1.3 Truthy and Falsy Values
    1.4 Symbol and BigInt
  2 — Variables and Scope
    2.1 var vs let vs const: Hoisting and TDZ
    2.2 Lexical Scope and Scope Chain
    2.3 Block Scope and Loop Variables
    2.4 Module Scope (ESModules)

Part 2 — Functions, Scope & Closures
  3 — Functions In Depth
    3.1 Function Declarations vs Expressions vs Arrow Functions
    3.2 this Binding: call, apply, bind
    3.3 Default Parameters and Rest/Spread
    3.4 Arguments Object vs Rest Parameters
  4 — Closures
    4.1 What a Closure Is (with analogy)
    4.2 Closure in Callbacks and Loops
    4.3 Module Pattern via Closures
    4.4 Memory Leaks from Closures

Part 3 — Prototypes & Classes
  5 — Prototype Chain
    5.1 [[Prototype]] and __proto__
    5.2 Object.create and Prototype Inheritance
    5.3 hasOwnProperty vs in operator
    5.4 Prototype Pollution Security Issue
  6 — Classes (ES6+)
    6.1 Class Syntax as Syntactic Sugar
    6.2 Constructor, Methods, Static Methods
    6.3 Private Fields (#field)
    6.4 Mixins and Multiple Inheritance Patterns

Part 4 — Async JavaScript
  7 — Callbacks and Promises
    7.1 Callback Hell and Inversion of Control
    7.2 Promise States: Pending, Fulfilled, Rejected
    7.3 Promise Chaining: .then, .catch, .finally
    7.4 Promise Combinators: all, allSettled, race, any
  8 — Async/Await
    8.1 Async Functions and Await Semantics
    8.2 Error Handling: try/catch vs .catch()
    8.3 Sequential vs Parallel Async Patterns
    8.4 Top-Level Await

Part 5 — The Event Loop
  9 — Concurrency Model
    9.1 Call Stack, Heap, and Message Queue
    9.2 Macro-Tasks vs Micro-Tasks (Promises)
    9.3 setImmediate, setTimeout, queueMicrotask
    9.4 requestAnimationFrame in Browsers
  10 — Web Workers and SharedArrayBuffer
    10.1 Dedicated Workers
    10.2 Shared Workers
    10.3 Atomics and Lock-Free Concurrency

Part 6 — Modern ES Patterns
  11 — ES2020–2024 Features
    11.1 Optional Chaining (?.) and Nullish Coalescing (??)
    11.2 Logical Assignment Operators
    11.3 Array: at(), findLast(), toSorted()
    11.4 Object.groupBy and Map.groupBy
  12 — Modules and Build Tools
    12.1 ESModules vs CommonJS
    12.2 Dynamic import()
    12.3 Tree Shaking Mechanics
    12.4 Vite vs Webpack Mental Model
  13 — Patterns and Best Practices
    13.1 Immutability with structuredClone
    13.2 Proxy and Reflect for Meta-Programming
    13.3 Iterators and Generators
    13.4 Tagged Template Literals

---

## Required Diagrams

1. Part 5 — Event Loop (Flat SVG): Call Stack + Micro-task Queue + Macro-task Queue + Event Loop arrow
2. Part 2 — Closure Scope Chain (Flat SVG): nested boxes showing lexical scope lookup
3. Part 3 — Prototype Chain (Flat SVG): object → prototype → Object.prototype → null chain
4. Part 4 — Promise State Machine (Flat SVG): Pending → Fulfilled / Rejected state diagram
5. Part 4 — Async Patterns Comparison (Flat SVG table): callbacks vs promises vs async/await
6. Part 6 — ESModule Tree Shaking (Flat SVG): bundler dead code elimination visual
