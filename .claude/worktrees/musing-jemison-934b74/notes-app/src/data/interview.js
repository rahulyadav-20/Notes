/* ============================================================
   Interview Prep — Static Data
   All question content lives here. Pages are pure presentational.
   ============================================================ */

export const DIFFICULTY_COLOR = {
  Easy:   { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' },
  Medium: { bg: '#fef9c3', text: '#854d0e', border: '#fef08a' },
  Hard:   { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
}

// ── QUESTIONS ──────────────────────────────────────────────

const questions = {
  /* ─── DSA ─────────────────────────────────────────────── */
  dsa: [
    {
      id: 'dsa-1',
      slug: 'two-sum',
      title: 'Two Sum',
      difficulty: 'Easy',
      companies: ['Google', 'Amazon', 'Meta', 'Microsoft'],
      tags: ['Array', 'Hash Map', 'Two Pointers'],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      description:
        'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
      hints: [
        'Think about what complement you need for each number.',
        'A hash map lets you look up complements in O(1) time.',
        'Iterate once: for each num, check if (target − num) already exists in your map.',
      ],
      answer:
        'Use a hash map to store each number and its index as you iterate. For every element nums[i], compute complement = target − nums[i]. If complement is already in the map, return [map[complement], i]. Otherwise insert nums[i] → i. This gives O(n) time and O(n) space — far better than the O(n²) brute-force nested loop.',
      code: `function twoSum(nums, target) {
  // Map: value → index
  const seen = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    // Found the pair
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }

    seen.set(nums[i], i);
  }

  return []; // guaranteed to have a solution
}`,
    },
    {
      id: 'dsa-2',
      slug: 'merge-intervals',
      title: 'Merge Intervals',
      difficulty: 'Medium',
      companies: ['Google', 'Facebook', 'Amazon', 'Bloomberg'],
      tags: ['Array', 'Sorting', 'Greedy'],
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      description:
        'Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
      hints: [
        'Sort intervals by their start time first.',
        'After sorting, two consecutive intervals overlap if the start of the second ≤ end of the first.',
        'Keep a result list; extend the last interval if overlap, otherwise append a new one.',
      ],
      answer:
        'Sort the intervals by start time. Then iterate, maintaining a "current" interval. If the next interval\'s start is ≤ current end, merge by taking max of the two ends. Otherwise push current to result and advance. Sorting is the dominant O(n log n) step; the merge pass is O(n).',
      code: `function merge(intervals) {
  // Sort by start time
  intervals.sort((a, b) => a[0] - b[0]);

  const result = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    const curr = intervals[i];

    if (curr[0] <= last[1]) {
      // Overlap: extend end if needed
      last[1] = Math.max(last[1], curr[1]);
    } else {
      result.push(curr);
    }
  }

  return result;
}`,
    },
    {
      id: 'dsa-3',
      slug: 'lru-cache',
      title: 'LRU Cache',
      difficulty: 'Hard',
      companies: ['Amazon', 'Google', 'Microsoft', 'Uber'],
      tags: ['Design', 'Hash Map', 'Doubly Linked List'],
      timeComplexity: 'O(1) get & put',
      spaceComplexity: 'O(capacity)',
      description:
        'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class with get(key) and put(key, value) operations — both must run in O(1) average time.',
      hints: [
        'A doubly linked list tracks access order; most-recent at head, least-recent at tail.',
        'A hash map gives O(1) lookup of any node by key.',
        'On every get/put, move the accessed node to the head.',
        'When capacity is exceeded, remove the tail node.',
      ],
      answer:
        'Combine a HashMap and a Doubly Linked List. The map stores key → node for O(1) access. The list maintains order: head = most recently used, tail = least recently used. get: if key exists, move node to head and return value. put: if key exists update and move to head; else insert at head and, if over capacity, evict tail and remove its key from the map.',
      code: `class LRUCache {
  constructor(capacity) {
    this.cap = capacity;
    this.map = new Map();

    // Sentinel head and tail (simplifies edge cases)
    this.head = { key: 0, val: 0, prev: null, next: null };
    this.tail = { key: 0, val: 0, prev: null, next: null };
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _insertFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._remove(node);
    this._insertFront(node);
    return node.val;
  }

  put(key, value) {
    if (this.map.has(key)) {
      this._remove(this.map.get(key));
    }
    const node = { key, val: value, prev: null, next: null };
    this._insertFront(node);
    this.map.set(key, node);

    if (this.map.size > this.cap) {
      // Evict LRU (tail sentinel's prev)
      const lru = this.tail.prev;
      this._remove(lru);
      this.map.delete(lru.key);
    }
  }
}`,
    },
  ],

  /* ─── System Design ───────────────────────────────────── */
  'system-design': [
    {
      id: 'sd-1',
      slug: 'design-url-shortener',
      title: 'Design a URL Shortener (like bit.ly)',
      difficulty: 'Medium',
      companies: ['Amazon', 'Google', 'Uber', 'Airbnb'],
      tags: ['System Design', 'Hashing', 'Database', 'Caching'],
      timeComplexity: 'N/A',
      spaceComplexity: 'N/A',
      description:
        'Design a URL shortening service. Users paste a long URL and receive a short alias (e.g. sho.rt/abc123). The service must redirect short URLs to the original, handle ~100M URLs, and serve ~10K reads/second.',
      hints: [
        'Estimate scale first: reads vs writes, storage needed for 5 years.',
        'For unique short codes, consider Base62 encoding of an auto-increment ID or a hash.',
        'Reads dominate heavily — use a cache (Redis) in front of the DB.',
        'Think about custom aliases, expiry, analytics, and abuse prevention.',
      ],
      answer:
        'API: POST /shorten → returns short code; GET /:code → 301 redirect. Storage: relational DB (id, long_url, short_code, created_at, expires_at). Short code: encode numeric DB ID to Base62 (6 chars = 56B combinations). Caching: Redis with LRU eviction for the hot 20% of URLs. Scalability: read replicas, CDN for redirect, consistent hashing for distributed cache. Analytics: async event queue (Kafka) → analytics DB to avoid slowing redirects.',
      code: null,
    },
    {
      id: 'sd-2',
      slug: 'design-twitter-feed',
      title: 'Design Twitter News Feed',
      difficulty: 'Hard',
      companies: ['Twitter', 'Meta', 'LinkedIn', 'Google'],
      tags: ['System Design', 'Fan-out', 'Cache', 'Message Queue'],
      timeComplexity: 'N/A',
      spaceComplexity: 'N/A',
      description:
        'Design the timeline feature for a social network. When a user opens the app they see the N most recent tweets from people they follow, in reverse-chronological order. Scale to 200M daily active users.',
      hints: [
        'Consider "fan-out on write" vs "fan-out on read" — which is better for celebrities?',
        'A hybrid approach handles both regular users and celebrities.',
        'The feed must be pre-computed and cached for fast reads.',
        'Think about consistency vs availability trade-offs.',
      ],
      answer:
        'Fan-out on write: when a user tweets, push tweet ID to all followers\' feed caches (Redis sorted set by timestamp). Fast reads, expensive writes. For celebrities (10M+ followers) use fan-out on read — merge celebrity tweets at read time. Feed cache stores tweet IDs only; fetch full tweet data from Tweet Service via batch. Pagination via cursor (last seen tweet ID). Firehose queue (Kafka) for async fan-out workers. Redis cluster with ~150 bytes per feed entry = ~30 GB for 200M users × 100 entries.',
      code: null,
    },
    {
      id: 'sd-3',
      slug: 'design-rate-limiter',
      title: 'Design a Rate Limiter',
      difficulty: 'Medium',
      companies: ['Stripe', 'Cloudflare', 'Google', 'Netflix'],
      tags: ['System Design', 'Redis', 'Algorithms', 'API Design'],
      timeComplexity: 'N/A',
      spaceComplexity: 'N/A',
      description:
        'Design a rate limiter that prevents users from making too many API requests in a given time window. Support multiple rate limiting strategies and work correctly in a distributed environment.',
      hints: [
        'Token Bucket allows bursting; Sliding Window Log is accurate but memory-heavy.',
        'Fixed Window Counter is simple but has boundary edge cases.',
        'Redis is the standard choice for distributed rate limiting.',
        'Use Redis Lua scripts for atomic check-and-decrement.',
      ],
      answer:
        'Token Bucket in Redis: store (tokens, last_refill_time) per user key. On each request: refill tokens based on elapsed time, then decrement if tokens > 0 else reject with 429. Use Lua script for atomicity. Sliding Window Counter is a hybrid: count requests in current + previous window, weighted by overlap fraction. Distributed: single Redis instance or Redis Cluster with consistent hashing. Communicate remaining limit via X-RateLimit-Remaining headers.',
      code: null,
    },
  ],

  /* ─── Behavioral ──────────────────────────────────────── */
  behavioral: [
    {
      id: 'beh-1',
      slug: 'tell-me-about-yourself',
      title: 'Tell me about yourself',
      difficulty: 'Easy',
      companies: ['Google', 'Amazon', 'Meta', 'Apple', 'Microsoft'],
      tags: ['Introduction', 'Communication', 'Leadership'],
      timeComplexity: 'N/A',
      spaceComplexity: 'N/A',
      description:
        'This is almost always the first question in any interview. Your answer sets the tone for the entire conversation. Interviewers want to hear your professional narrative — not your life story.',
      hints: [
        'Use the Present → Past → Future structure.',
        'Keep it under 2 minutes — this is your pitch, not your biography.',
        'Tailor the "future" part to align with the specific role.',
        'End with a forward-looking statement that transitions naturally to why you\'re excited about this role.',
      ],
      answer:
        'Structure: (1) Present — your current role and what you do in 1-2 sentences. (2) Past — 1-2 highlights from previous experience that are most relevant to this role. (3) Future — why you\'re looking for a change and specifically why this role/company excites you. Example: "I\'m currently a Senior Engineer at Flipkart where I lead the real-time recommendations platform serving 50M users. Before that I built the data pipeline infrastructure at a Series A startup from scratch. I\'m looking to move into a Staff-level role where I can drive architecture decisions at a larger scale — which is exactly what drew me to this position at Google."',
      code: null,
    },
    {
      id: 'beh-2',
      slug: 'conflict-with-coworker',
      title: 'Tell me about a conflict with a coworker',
      difficulty: 'Medium',
      companies: ['Amazon', 'Meta', 'Google', 'Apple'],
      tags: ['Conflict Resolution', 'Communication', 'STAR Method'],
      timeComplexity: 'N/A',
      spaceComplexity: 'N/A',
      description:
        'Interviewers ask this to assess your emotional intelligence, communication skills, and ability to work in teams under pressure. They want to see that you can handle disagreement professionally and constructively.',
      hints: [
        'Use the STAR method: Situation, Task, Action, Result.',
        'Choose a real example — not a hypothetical.',
        'Focus on a professional disagreement, not a personality clash.',
        'Show that you listened, compromised where reasonable, and reached a good outcome.',
        'Never badmouth the other person.',
      ],
      answer:
        'STAR framework: Situation — briefly set the context. Task — what were you each responsible for? Action — describe how you initiated a conversation, actively listened to their perspective, found common ground, and proposed a solution. Result — quantify the positive outcome if possible. Green flags: you approached them directly (not via manager), you acknowledged their valid points, the solution was a compromise. Red flags to avoid: blaming them entirely, escalating immediately to management, or saying you "won" the argument.',
      code: null,
    },
    {
      id: 'beh-3',
      slug: 'biggest-failure',
      title: 'What is your biggest professional failure?',
      difficulty: 'Hard',
      companies: ['Amazon', 'Google', 'Meta', 'Netflix'],
      tags: ['Self-Awareness', 'Growth Mindset', 'Leadership Principles'],
      timeComplexity: 'N/A',
      spaceComplexity: 'N/A',
      description:
        'This question tests self-awareness, honesty, and growth mindset. Interviewers want to see that you can reflect on your mistakes, take ownership, and learn — rather than deflecting blame or pretending you have no failures.',
      hints: [
        'Pick a real, significant failure — not a fake weakness like "I work too hard".',
        'Own it completely — no blame-shifting.',
        'Spend 50% of the answer on what you learned and what changed.',
        'Connect the lesson to how you operate differently today.',
      ],
      answer:
        'Best structure: (1) What happened — be specific and honest about what went wrong and your role in it. (2) Impact — acknowledge the real consequences on the team/product/business. (3) Root cause — show that you diagnosed WHY it happened, not just what happened. (4) What you changed — the concrete process, habit, or system you put in place. The key is showing that failure led to permanent positive change. Amazon specifically looks for "Dive Deep" and "Learn and Be Curious" in failure stories.',
      code: null,
    },
  ],

  /* ─── JavaScript ──────────────────────────────────────── */
  javascript: [
    {
      id: 'js-1',
      slug: 'event-loop',
      title: 'Explain the JavaScript Event Loop',
      difficulty: 'Medium',
      companies: ['Meta', 'Google', 'Airbnb', 'Shopify'],
      tags: ['JavaScript', 'Async', 'Runtime', 'Concurrency'],
      timeComplexity: 'N/A',
      spaceComplexity: 'N/A',
      description:
        'JavaScript is single-threaded yet handles async operations like network requests and timers without blocking. The event loop is the mechanism that makes this possible. Explain how it works and what the call stack, task queue, and microtask queue are.',
      hints: [
        'Start with the call stack — synchronous code executes here.',
        'Web APIs handle async operations (setTimeout, fetch) off the main thread.',
        'Callbacks go to the task queue (macrotask queue) when complete.',
        'Promises and queueMicrotask go to the microtask queue — it drains before the next task.',
      ],
      answer:
        'The call stack executes synchronous code one frame at a time. When async operations (setTimeout, fetch, I/O) are encountered, the browser/Node delegates them to Web APIs running off the main thread. When they complete, their callbacks are pushed to the task queue (macrotask queue). The event loop\'s job: when the call stack is empty, check the microtask queue first (Promises, MutationObserver), drain it completely, then pick one task from the macrotask queue and push it to the call stack. This is why `Promise.resolve().then(fn)` always runs before `setTimeout(fn, 0)`.',
      code: `console.log('1 - sync');

setTimeout(() => console.log('2 - setTimeout'), 0);

Promise.resolve().then(() => console.log('3 - microtask'));

console.log('4 - sync');

// Output order:
// 1 - sync
// 4 - sync
// 3 - microtask   ← microtask queue drains before macrotask
// 2 - setTimeout`,
    },
    {
      id: 'js-2',
      slug: 'closures',
      title: 'What is a Closure? Give a practical example.',
      difficulty: 'Easy',
      companies: ['Google', 'Meta', 'Amazon', 'Stripe'],
      tags: ['JavaScript', 'Closures', 'Scope', 'Functions'],
      timeComplexity: 'N/A',
      spaceComplexity: 'N/A',
      description:
        'A closure is a function that remembers variables from its outer (enclosing) scope even after that outer function has finished executing. Closures are one of the most fundamental and widely-used patterns in JavaScript.',
      hints: [
        'A closure is created every time a function is defined inside another function.',
        'The inner function "closes over" the outer function\'s variables.',
        'Common uses: data privacy, function factories, memoization, event handlers.',
      ],
      answer:
        'A closure is the combination of a function and its lexical environment (the variables in scope at the time of creation). The inner function retains a live reference to the outer scope, not a copy. Classic use case: a counter factory that keeps a private count variable inaccessible from the outside. This enables encapsulation in JS without classes.',
      code: `// Closure example: private counter
function makeCounter(start = 0) {
  let count = start; // private to this closure

  return {
    increment: () => ++count,
    decrement: () => --count,
    value:     () => count,
  };
}

const c = makeCounter(10);
console.log(c.increment()); // 11
console.log(c.increment()); // 12
console.log(c.decrement()); // 11
console.log(c.value());     // 11
// count is inaccessible directly — only via the returned API`,
    },
    {
      id: 'js-3',
      slug: 'promise-vs-async-await',
      title: 'Promises vs async/await — when to use which?',
      difficulty: 'Medium',
      companies: ['Google', 'Meta', 'Netflix', 'Shopify'],
      tags: ['JavaScript', 'Async', 'Promises', 'ES2017'],
      timeComplexity: 'N/A',
      spaceComplexity: 'N/A',
      description:
        'Both Promises and async/await handle asynchronous operations in JavaScript. async/await is syntactic sugar over Promises. Explain the differences, trade-offs, and when you would choose one over the other.',
      hints: [
        'async/await is more readable for sequential async steps.',
        'Promise.all, Promise.race, Promise.allSettled are hard to replicate cleanly with just await.',
        'Error handling: try/catch vs .catch() — async/await aligns with synchronous error handling patterns.',
        'async functions always return a Promise — await just unwraps it.',
      ],
      answer:
        'async/await is preferred for sequential async logic: easier to read, write, and debug — stack traces are cleaner. Use Promises directly when running concurrent operations (Promise.all for parallel fetches), building reusable utility functions that return promises, or chaining complex pipelines. A common pitfall: awaiting in a loop sequentially when you could use Promise.all for parallelism — e.g. `await Promise.all(ids.map(id => fetch(id)))` vs a slow for-loop with await.',
      code: `// Sequential with async/await
async function getUser(id) {
  try {
    const user    = await fetchUser(id);
    const profile = await fetchProfile(user.profileId);
    return { user, profile };
  } catch (err) {
    console.error('Failed:', err.message);
  }
}

// Parallel with Promise.all
async function getUsersParallel(ids) {
  const users = await Promise.all(ids.map(id => fetchUser(id)));
  return users;
  // All requests fire simultaneously — much faster!
}`,
    },
  ],

  /* ─── SQL ─────────────────────────────────────────────── */
  sql: [
    {
      id: 'sql-1',
      slug: 'nth-highest-salary',
      title: 'Find the Nth Highest Salary',
      difficulty: 'Medium',
      companies: ['Amazon', 'Microsoft', 'Oracle', 'Goldman Sachs'],
      tags: ['SQL', 'Window Functions', 'Ranking', 'Subquery'],
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      description:
        'Write a SQL query to find the Nth highest distinct salary from the Employee table. If there is no Nth highest salary, return null.',
      hints: [
        'DENSE_RANK() assigns the same rank to equal salaries — perfect here.',
        'Wrap in a CTE or subquery to filter by rank = N.',
        'Handle the null case when fewer than N distinct salaries exist.',
      ],
      answer:
        'Use DENSE_RANK() in a CTE to rank salaries in descending order (DENSE_RANK handles ties correctly, unlike ROW_NUMBER). Then select where rank = N. DENSE_RANK is preferred over ROW_NUMBER here because we want the Nth distinct salary — two people with the same salary share the same rank.',
      code: `-- Using DENSE_RANK (handles ties correctly)
WITH RankedSalaries AS (
  SELECT
    salary,
    DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM Employee
)
SELECT
  MAX(salary) AS NthHighestSalary  -- MAX handles null gracefully
FROM RankedSalaries
WHERE rnk = :N;

-- Alternative: LIMIT/OFFSET (MySQL/PostgreSQL)
SELECT DISTINCT salary
FROM Employee
ORDER BY salary DESC
LIMIT 1 OFFSET (:N - 1);`,
    },
    {
      id: 'sql-2',
      slug: 'department-top-salaries',
      title: 'Department Top 3 Salaries',
      difficulty: 'Hard',
      companies: ['Amazon', 'Google', 'Goldman Sachs', 'JPMorgan'],
      tags: ['SQL', 'Window Functions', 'Partitioning', 'Joins'],
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      description:
        'Write a SQL query to find employees who earn the top three unique salaries in each department. Join with the Department table to include department names.',
      hints: [
        'DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) partitions the ranking per department.',
        'Filter where rank <= 3 after the window function.',
        'Join with Department table for the department name.',
      ],
      answer:
        'Partition the DENSE_RANK window by DepartmentId so rankings reset per department. Filter rnk <= 3. The key insight is PARTITION BY — without it you\'d get the top 3 globally. DENSE_RANK ensures that if two people share 2nd place, both appear and the 4th person is not mistakenly included as "3rd".',
      code: `WITH RankedEmployees AS (
  SELECT
    e.Name        AS Employee,
    e.Salary,
    d.Name        AS Department,
    DENSE_RANK() OVER (
      PARTITION BY e.DepartmentId
      ORDER BY e.Salary DESC
    ) AS rnk
  FROM Employee e
  JOIN Department d ON e.DepartmentId = d.Id
)
SELECT Department, Employee, Salary
FROM   RankedEmployees
WHERE  rnk <= 3
ORDER BY Department, Salary DESC;`,
    },
    {
      id: 'sql-3',
      slug: 'consecutive-numbers',
      title: 'Consecutive Numbers',
      difficulty: 'Easy',
      companies: ['Google', 'Microsoft', 'LinkedIn'],
      tags: ['SQL', 'Self-Join', 'LAG/LEAD', 'Pattern Matching'],
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      description:
        'Write a SQL query to find all numbers that appear at least three times consecutively in the Logs table (columns: id, num).',
      hints: [
        'Self-join on consecutive IDs: l1.id + 1 = l2.id AND l2.id + 1 = l3.id.',
        'Or use LAG/LEAD window functions to compare a row to its neighbors.',
        'DISTINCT the result in case the sequence appears multiple times.',
      ],
      answer:
        'Self-join approach: join Logs three times on consecutive IDs. Filter where all three num values are equal. Use DISTINCT to avoid duplicates. The LAG approach is more modern: use LAG(num, 1) and LAG(num, 2) in a CTE, then filter where current = prev1 = prev2.',
      code: `-- Self-join approach
SELECT DISTINCT l1.Num AS ConsecutiveNums
FROM Logs l1
JOIN Logs l2 ON l2.Id = l1.Id + 1 AND l2.Num = l1.Num
JOIN Logs l3 ON l3.Id = l1.Id + 2 AND l3.Num = l1.Num;

-- LAG window approach (cleaner)
WITH Lagged AS (
  SELECT
    Num,
    LAG(Num, 1) OVER (ORDER BY Id) AS prev1,
    LAG(Num, 2) OVER (ORDER BY Id) AS prev2
  FROM Logs
)
SELECT DISTINCT Num AS ConsecutiveNums
FROM Lagged
WHERE Num = prev1 AND Num = prev2;`,
    },
  ],

  /* ─── React ───────────────────────────────────────────── */
  react: [
    {
      id: 'react-1',
      slug: 'react-reconciliation',
      title: 'How does React reconciliation work?',
      difficulty: 'Medium',
      companies: ['Meta', 'Airbnb', 'Shopify', 'Vercel'],
      tags: ['React', 'Virtual DOM', 'Fiber', 'Performance'],
      timeComplexity: 'N/A',
      spaceComplexity: 'N/A',
      description:
        'React\'s reconciliation algorithm determines the minimum number of DOM operations needed to update the UI when state or props change. Explain the algorithm, the role of the virtual DOM, React Fiber, and why keys matter.',
      hints: [
        'React builds a virtual DOM tree and diffs it with the previous one.',
        'Two elements of different types always produce different trees.',
        'Keys help React identify which list items have changed, moved, or been removed.',
        'React Fiber is the reimplementation that enables incremental rendering.',
      ],
      answer:
        'React creates a virtual DOM (a lightweight JS object tree). On state change, React builds a new vDOM and runs the diffing algorithm: (1) Different element type → tear down old tree, build new. (2) Same element type → update only changed attributes. (3) Lists → use keys to match old/new items without reordering everything. React Fiber (v16+) made this process interruptible — work is split into units that can be paused, prioritised, and resumed. This enables Concurrent Mode features like transitions and Suspense.',
      code: null,
    },
    {
      id: 'react-2',
      slug: 'usememo-vs-usecallback',
      title: 'useMemo vs useCallback — what\'s the difference?',
      difficulty: 'Easy',
      companies: ['Meta', 'Airbnb', 'Netflix', 'Google'],
      tags: ['React', 'Hooks', 'Performance', 'Memoization'],
      timeComplexity: 'N/A',
      spaceComplexity: 'N/A',
      description:
        'Both useMemo and useCallback are React hooks used for memoization. Explain the difference between them, when you should use each, and the hidden cost of overusing them.',
      hints: [
        'useMemo caches a computed value; useCallback caches a function reference.',
        'useCallback(fn, deps) === useMemo(() => fn, deps)',
        'Use them only when there\'s a real performance problem — premature optimisation adds complexity.',
        'Common use cases: passing callbacks to memoised child components, expensive computations.',
      ],
      answer:
        'useMemo(fn, deps) runs fn and caches the returned VALUE until deps change. useCallback(fn, deps) caches the FUNCTION REFERENCE itself. Both prevent unnecessary re-computation/re-creation on every render. Use useMemo for expensive calculations (filtering large lists, computing derived data). Use useCallback to stabilise function references passed to child components wrapped in React.memo, or as dependencies in useEffect. The cost: each call adds overhead for dependency comparison — only use them when you\'ve profiled and confirmed a real issue.',
      code: `// useMemo: cache an expensive computed value
const sortedList = useMemo(
  () => items.sort((a, b) => a.price - b.price), // O(n log n)
  [items]  // only recompute when items changes
);

// useCallback: stable function reference for memoised child
const handleClick = useCallback(
  (id) => dispatch({ type: 'SELECT', payload: id }),
  [dispatch]  // dispatch is stable from useReducer
);

// Without useCallback, ChildComponent re-renders on EVERY parent render
// even if nothing relevant changed.
return <ChildComponent onClick={handleClick} />;`,
    },
    {
      id: 'react-3',
      slug: 'custom-hooks',
      title: 'When and why should you create a custom hook?',
      difficulty: 'Medium',
      companies: ['Meta', 'Vercel', 'Shopify', 'Stripe'],
      tags: ['React', 'Custom Hooks', 'Code Reuse', 'Patterns'],
      timeComplexity: 'N/A',
      spaceComplexity: 'N/A',
      description:
        'Custom hooks are one of the most powerful patterns in React for sharing stateful logic between components. Explain when custom hooks are the right tool, how to design them, and demonstrate with a real-world example.',
      hints: [
        'If two components share the same stateful logic, extract it to a custom hook.',
        'Custom hooks are just functions that call other hooks — they start with "use".',
        'They do NOT share state — each component calling the hook gets its own state.',
        'Good candidates: data fetching, form handling, event listeners, local storage sync.',
      ],
      answer:
        'Create a custom hook when (1) the same combination of useState/useEffect/useRef logic appears in multiple components, or (2) a single component has logic complex enough to deserve its own abstraction. Custom hooks let you extract stateful logic without changing your component tree (unlike HOCs or render props). Each consumer gets an independent state instance. The naming convention "useFoo" signals to React\'s linting rules that this function uses hooks inside.',
      code: `// Custom hook: useLocalStorage
function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      setStored(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('localStorage error:', err);
    }
  }, [key]);

  return [stored, setValue];
}

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'light');`,
    },
  ],

  /* ─── Python ──────────────────────────────────────────── */
  python: [
    {
      id: 'py-1',
      slug: 'generators-vs-iterators',
      title: 'Generators vs Iterators in Python',
      difficulty: 'Medium',
      companies: ['Google', 'Amazon', 'Palantir', 'Databricks'],
      tags: ['Python', 'Generators', 'Memory', 'Lazy Evaluation'],
      timeComplexity: 'N/A',
      spaceComplexity: 'N/A',
      description:
        'Explain the difference between iterators and generators in Python, how the yield keyword works, and when you\'d choose a generator over returning a list.',
      hints: [
        'Any object with __iter__ and __next__ is an iterator.',
        'A generator function uses yield — Python automatically creates the iterator protocol.',
        'Generators are lazy — they produce one value at a time, saving memory.',
        'Generator expressions: (x*2 for x in range(n)) vs list comprehensions.',
      ],
      answer:
        'An iterator is any object implementing __iter__ (returns self) and __next__ (returns next value or raises StopIteration). A generator function uses yield to produce values lazily — Python automatically creates the iterator machinery. When a generator function is called, it returns a generator object without executing the body. Execution resumes from the last yield each time next() is called. Memory advantage: a generator producing 1M items uses O(1) memory vs O(n) for a list. Use generators for large data streams, infinite sequences, and pipeline transformations.',
      code: `# Regular function — builds entire list in memory
def squares_list(n):
    return [i ** 2 for i in range(n)]

# Generator — yields one value at a time, O(1) memory
def squares_gen(n):
    for i in range(n):
        yield i ** 2

# Generator expression
squares = (i ** 2 for i in range(1_000_000))

# Pipeline: generators compose naturally
def read_lines(filename):
    with open(filename) as f:
        for line in f:
            yield line.strip()

def filter_errors(lines):
    for line in lines:
        if 'ERROR' in line:
            yield line

# Only one line lives in memory at a time
error_lines = filter_errors(read_lines('app.log'))`,
    },
    {
      id: 'py-2',
      slug: 'gil-python',
      title: 'What is the Python GIL and how do you work around it?',
      difficulty: 'Hard',
      companies: ['Google', 'Databricks', 'Palantir', 'Stripe'],
      tags: ['Python', 'GIL', 'Concurrency', 'Multiprocessing', 'Performance'],
      timeComplexity: 'N/A',
      spaceComplexity: 'N/A',
      description:
        'The Global Interpreter Lock (GIL) is a mutex in CPython that prevents multiple native threads from executing Python bytecode simultaneously. Explain what it is, why it exists, when it hurts you, and how to achieve true parallelism in Python.',
      hints: [
        'The GIL was introduced for memory-safe reference counting.',
        'It only affects CPU-bound tasks — I/O-bound code releases the GIL and benefits from threads.',
        'multiprocessing bypasses the GIL — each process has its own Python interpreter.',
        'asyncio handles concurrency for I/O without threads at all.',
      ],
      answer:
        'The GIL is a global lock in CPython ensuring only one thread executes Python bytecode at a time, even on multi-core machines. It exists because CPython\'s memory management (reference counting) is not thread-safe. Impact: CPU-bound multi-threaded code is effectively serialised. Workarounds: (1) multiprocessing — separate processes, no shared GIL, true CPU parallelism; (2) C extensions (NumPy, etc.) release the GIL for heavy computation; (3) asyncio for I/O-bound concurrency without threads; (4) concurrent.futures.ProcessPoolExecutor for CPU parallelism with a clean API; (5) PyPy or upcoming GIL-free CPython (PEP 703).',
      code: `import concurrent.futures
import multiprocessing

# CPU-bound: use ProcessPoolExecutor (bypasses GIL)
def cpu_heavy(n):
    return sum(i * i for i in range(n))

with concurrent.futures.ProcessPoolExecutor() as ex:
    results = list(ex.map(cpu_heavy, [10**6] * 8))

# I/O-bound: threads are fine (GIL released during I/O)
import urllib.request

def fetch(url):
    with urllib.request.urlopen(url) as r:
        return r.read()

with concurrent.futures.ThreadPoolExecutor(max_workers=10) as ex:
    pages = list(ex.map(fetch, urls))

# Or async I/O (single thread, no GIL concern)
import asyncio, aiohttp

async def fetch_async(session, url):
    async with session.get(url) as r:
        return await r.text()`,
    },
  ],
}

// ── CATEGORIES ─────────────────────────────────────────────

export const INTERVIEW_CATEGORIES = [
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    icon: '🧮',
    color: '#4A90D9',
    desc: 'Arrays, trees, graphs, dynamic programming, sorting, and classic coding patterns asked at top-tier tech companies.',
    totalQuestions: 75,
    freeQuestions: 15,
    difficulties: { Easy: 28, Medium: 32, Hard: 15 },
  },
  {
    id: 'system-design',
    name: 'System Design',
    icon: '🏗️',
    color: '#f5820a',
    desc: 'Design scalable distributed systems: URL shorteners, social feeds, payment systems, message queues, and more.',
    totalQuestions: 40,
    freeQuestions: 8,
    difficulties: { Easy: 5, Medium: 22, Hard: 13 },
  },
  {
    id: 'behavioral',
    name: 'Behavioral (STAR)',
    icon: '🎯',
    color: '#10b981',
    desc: 'Amazon Leadership Principles, conflict resolution, project failures, and cross-functional collaboration stories.',
    totalQuestions: 60,
    freeQuestions: 12,
    difficulties: { Easy: 20, Medium: 28, Hard: 12 },
  },
  {
    id: 'javascript',
    name: 'JavaScript & TypeScript',
    icon: '⚡',
    color: '#f59e0b',
    desc: 'Event loop, closures, prototypes, async/await, TypeScript generics, and advanced JS runtime behaviour.',
    totalQuestions: 55,
    freeQuestions: 11,
    difficulties: { Easy: 18, Medium: 25, Hard: 12 },
  },
  {
    id: 'sql',
    name: 'SQL & Databases',
    icon: '🗄️',
    color: '#8b5cf6',
    desc: 'Window functions, query optimisation, indexing strategies, joins, and classic LeetCode SQL problems.',
    totalQuestions: 45,
    freeQuestions: 9,
    difficulties: { Easy: 18, Medium: 20, Hard: 7 },
  },
  {
    id: 'react',
    name: 'React & Frontend',
    icon: '⚛️',
    color: '#06b6d4',
    desc: 'React internals, hooks, state management, performance optimisation, and modern frontend architecture.',
    totalQuestions: 50,
    freeQuestions: 10,
    difficulties: { Easy: 18, Medium: 22, Hard: 10 },
  },
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    color: '#3b82f6',
    desc: 'Generators, GIL, decorators, metaclasses, concurrency, and idiomatic Python asked at data-heavy companies.',
    totalQuestions: 45,
    freeQuestions: 10,
    difficulties: { Easy: 15, Medium: 20, Hard: 10 },
  },
]

// ── HELPERS ────────────────────────────────────────────────

/** Returns category metadata merged with its questions array */
export function getInterviewCategoryWithQuestions(categoryId) {
  const cat = INTERVIEW_CATEGORIES.find(c => c.id === categoryId)
  if (!cat) return null
  return {
    ...cat,
    questions: questions[categoryId] ?? [],
  }
}

/** Returns a single question by slug, plus its parent category */
export function getQuestionBySlug(categoryId, slug) {
  const cat = INTERVIEW_CATEGORIES.find(c => c.id === categoryId)
  const q   = (questions[categoryId] ?? []).find(q => q.slug === slug)
  if (!cat || !q) return null

  const allQuestions = questions[categoryId] ?? []
  const idx          = allQuestions.findIndex(q => q.slug === slug)

  return {
    question:     q,
    category:     cat,
    prevSlug:     idx > 0                        ? allQuestions[idx - 1].slug : null,
    nextSlug:     idx < allQuestions.length - 1  ? allQuestions[idx + 1].slug : null,
    prevTitle:    idx > 0                        ? allQuestions[idx - 1].title : null,
    nextTitle:    idx < allQuestions.length - 1  ? allQuestions[idx + 1].title : null,
  }
}
