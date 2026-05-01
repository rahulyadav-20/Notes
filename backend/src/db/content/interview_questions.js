/**
 * Interview questions seed data.
 * Each object maps to one row in interview_questions.
 * is_premium: false = shown to free users, true = requires purchase/premium
 */

// All interview topic packs = ₹99 (9900 paise). Admin can override per-topic.
const TOPIC_PRICE = 9900

export const INTERVIEW_TOPICS = [
  { slug: 'dsa',              title: 'DSA & Algorithms',   icon: '📐', color: '#EC4899', price: TOPIC_PRICE, total_questions: 150, free_questions: 10, description: 'Arrays, trees, graphs, dynamic programming — patterns that crack top-tier interviews' },
  { slug: 'system-design',    title: 'System Design',      icon: '🏛️', color: '#6366F1', price: TOPIC_PRICE, total_questions: 60,  free_questions: 10, description: 'Design scalable distributed systems — the make-or-break round for senior engineers' },
  { slug: 'data-engineering', title: 'Data Engineering',   icon: '🗄️', color: '#4A90D9', price: TOPIC_PRICE, total_questions: 80,  free_questions: 10, description: 'Kafka, Spark, pipeline design & data architecture questions from top data teams' },
  { slug: 'sql',              title: 'SQL',                icon: '🗃️', color: '#336791', price: TOPIC_PRICE, total_questions: 70,  free_questions: 10, description: 'Window functions, CTEs, joins & query optimisation — asked everywhere' },
  { slug: 'machine-learning', title: 'Machine Learning',   icon: '🤖', color: '#8B5CF6', price: TOPIC_PRICE, total_questions: 60,  free_questions: 10, description: 'Model evaluation, feature engineering, MLOps & ML system design' },
  { slug: 'behavioral',       title: 'Behavioural',        icon: '💬', color: '#10B981', price: TOPIC_PRICE, total_questions: 50,  free_questions: 10, description: 'Leadership, conflict, impact — behavioural questions for Staff+ roles' },
]

export const INTERVIEW_QUESTIONS = [

  // ═══════════════════════════════════════════
  // DSA — 10 sample questions (mix free/premium)
  // ═══════════════════════════════════════════
  {
    topic_id: 'dsa', slug: 'two-sum', order_index: 1, is_premium: false,
    title: 'Two Sum',
    difficulty: 'Easy',
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft'],
    tags: ['arrays', 'hash-map'],
    acceptance: '49%',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers that add up to `target`. You may assume each input has exactly one solution and you may not use the same element twice.',
    answer: `Use a hash map to store each number's index as you iterate. For each number, check if (target - num) already exists in the map. If yes, return both indices. If no, store the current number and its index.\n\nTime complexity: O(n) — single pass.\nSpace complexity: O(n) — hash map stores up to n elements.\n\nKey insight: instead of the brute-force O(n²) nested loop, we trade space for time using the hash map for O(1) lookups.`,
    code: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}                          # value → index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    hints: ['Try using a hash map', 'Think about what you need to look up for each element', 'complement = target - current_number'],
    time_complexity: 'O(n)',
    space_complexity: 'O(n)',
  },

  {
    topic_id: 'dsa', slug: 'valid-parentheses', order_index: 2, is_premium: false,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    companies: ['Amazon', 'Microsoft', 'Goldman Sachs'],
    tags: ['stack', 'strings'],
    acceptance: '40%',
    description: 'Given a string containing just `(`, `)`, `{`, `}`, `[`, `]`, determine if the input string is valid. Open brackets must be closed by the same type and in the correct order.',
    answer: `Use a stack. For each character: if it's an opening bracket, push it. If it's a closing bracket, check if the stack top is the matching opener — if yes, pop; if no or stack empty, return false. At the end, the stack must be empty.`,
    code: `def is_valid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:                        # closing bracket
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)                     # opening bracket
    return len(stack) == 0`,
    hints: ['Use a stack for LIFO ordering', 'Map each closing bracket to its opening pair'],
    time_complexity: 'O(n)',
    space_complexity: 'O(n)',
  },

  {
    topic_id: 'dsa', slug: 'merge-intervals', order_index: 3, is_premium: false,
    title: 'Merge Intervals',
    difficulty: 'Medium',
    companies: ['Google', 'Facebook', 'Amazon', 'Bloomberg'],
    tags: ['arrays', 'sorting'],
    acceptance: '46%',
    description: 'Given an array of intervals where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals and return the non-overlapping result.',
    answer: `Sort intervals by start time. Then iterate: if current interval overlaps the last merged interval (current.start ≤ last.end), merge by extending the end. Otherwise append as new interval.\n\nTwo intervals overlap if and only if: start_b ≤ end_a (when sorted by start).`,
    code: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])     # sort by start time
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        last = merged[-1]
        if start <= last[1]:               # overlaps — extend
            last[1] = max(last[1], end)
        else:
            merged.append([start, end])    # no overlap — new interval
    return merged`,
    hints: ['Sort first by start time', 'Two intervals overlap if current.start ≤ previous.end'],
    time_complexity: 'O(n log n)',
    space_complexity: 'O(n)',
  },

  {
    topic_id: 'dsa', slug: 'lru-cache', order_index: 4, is_premium: false,
    title: 'LRU Cache',
    difficulty: 'Medium',
    companies: ['Amazon', 'Microsoft', 'Google', 'Uber'],
    tags: ['design', 'hash-map', 'linked-list'],
    acceptance: '41%',
    description: 'Design a data structure that follows the Least Recently Used (LRU) cache constraint. Implement `LRUCache(capacity)`, `get(key)` and `put(key, value)` — both in O(1) time.',
    answer: `Combine a doubly-linked list (for O(1) insertion/deletion anywhere) with a hash map (for O(1) key lookup). The list maintains access order: most recently used at head, least recently used at tail.\n\nget: look up in map, move node to head, return value.\nput: if key exists update and move to head. If new, add to head. If at capacity, remove tail node and its map entry.`,
    code: `class Node:
    def __init__(self, key=0, val=0):
        self.key, self.val = key, val
        self.prev = self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}                        # key → node
        self.head, self.tail = Node(), Node()  # dummy sentinels
        self.head.next, self.tail.prev = self.tail, self.head

    def _remove(self, node):
        node.prev.next, node.next.prev = node.next, node.prev

    def _insert_front(self, node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        if key not in self.cache: return -1
        node = self.cache[key]
        self._remove(node)
        self._insert_front(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self.cache[key] = node
        self._insert_front(node)
        if len(self.cache) > self.cap:
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]`,
    hints: ['Doubly linked list gives O(1) move-to-front', 'Hash map gives O(1) key lookup', 'Use dummy head/tail sentinels to simplify edge cases'],
    time_complexity: 'O(1) for both get and put',
    space_complexity: 'O(capacity)',
  },

  {
    topic_id: 'dsa', slug: 'number-of-islands', order_index: 5, is_premium: false,
    title: 'Number of Islands',
    difficulty: 'Medium',
    companies: ['Amazon', 'Google', 'Bloomberg', 'Salesforce'],
    tags: ['graphs', 'bfs', 'dfs', 'matrix'],
    acceptance: '56%',
    description: 'Given an m×n 2D binary grid where `"1"` is land and `"0"` is water, return the number of islands. An island is surrounded by water and is formed by connecting adjacent land cells horizontally or vertically.',
    answer: `DFS/BFS flood-fill. Iterate every cell. When you find a "1", increment the count and do DFS to mark all connected land cells as visited (change to "0"). This ensures you count each island exactly once.`,
    code: `def num_islands(grid: list[list[str]]) -> int:
    if not grid: return 0
    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0'                       # mark visited
        dfs(r+1, c); dfs(r-1, c)
        dfs(r, c+1); dfs(r, c-1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count`,
    hints: ['Flood-fill from every unvisited land cell', 'Mark visited cells to avoid double counting'],
    time_complexity: 'O(m×n)',
    space_complexity: 'O(m×n) recursion stack',
  },

  {
    topic_id: 'dsa', slug: 'word-break', order_index: 6, is_premium: true,
    title: 'Word Break',
    difficulty: 'Medium',
    companies: ['Amazon', 'Google', 'Facebook', 'Apple'],
    tags: ['dynamic-programming', 'strings', 'trie'],
    acceptance: '45%',
    description: 'Given a string `s` and a dictionary `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.',
    answer: 'DP. dp[i] = true if s[0..i] can be segmented. For each position i, check all substrings s[j..i] where dp[j] is true — if the substring is in the word set, set dp[i] = true.',
    code: `def word_break(s: str, wordDict: list[str]) -> bool:
    word_set = set(wordDict)
    dp = [False] * (len(s) + 1)
    dp[0] = True                               # empty string is always valid
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:   # s[j..i] is a valid word
                dp[i] = True
                break
    return dp[len(s)]`,
    hints: ['dp[i] means s[0..i] is breakable', 'For each i, check all possible last words s[j..i]'],
    time_complexity: 'O(n²)',
    space_complexity: 'O(n)',
  },

  {
    topic_id: 'dsa', slug: 'find-median-two-sorted-arrays', order_index: 7, is_premium: true,
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    companies: ['Google', 'Amazon', 'Microsoft', 'Adobe'],
    tags: ['binary-search', 'arrays', 'divide-and-conquer'],
    acceptance: '38%',
    description: 'Given two sorted arrays `nums1` and `nums2` of size m and n, return the median. The solution must run in O(log(m+n)).',
    answer: `Binary search on the smaller array. Partition both arrays such that the left half has (m+n)/2 elements. For each partition of nums1, compute the corresponding partition of nums2. Check if the partition is valid (left max ≤ right min on both sides). Adjust binary search based on comparison.`,
    code: `def find_median(nums1, nums2):
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1         # ensure nums1 is smaller
    m, n = len(nums1), len(nums2)
    lo, hi = 0, m
    while lo <= hi:
        px = (lo + hi) // 2                 # partition nums1
        py = (m + n + 1) // 2 - px         # partition nums2
        maxL1 = nums1[px-1] if px > 0 else float('-inf')
        minR1 = nums1[px]   if px < m else float('inf')
        maxL2 = nums2[py-1] if py > 0 else float('-inf')
        minR2 = nums2[py]   if py < n else float('inf')
        if maxL1 <= minR2 and maxL2 <= minR1:
            if (m + n) % 2 == 1:
                return max(maxL1, maxL2)
            return (max(maxL1, maxL2) + min(minR1, minR2)) / 2
        elif maxL1 > minR2:
            hi = px - 1
        else:
            lo = px + 1`,
    hints: ['Binary search on the smaller array', 'Think in terms of partitions not indices'],
    time_complexity: 'O(log(min(m,n)))',
    space_complexity: 'O(1)',
  },

  // ═══════════════════════════════════════════
  // SYSTEM DESIGN
  // ═══════════════════════════════════════════
  {
    topic_id: 'system-design', slug: 'design-url-shortener', order_index: 1, is_premium: false,
    title: 'Design a URL Shortener (like bit.ly)',
    difficulty: 'Medium',
    companies: ['Amazon', 'Google', 'Microsoft', 'Twitter'],
    tags: ['hashing', 'database', 'caching', 'api'],
    description: 'Design a URL shortening service. Users submit a long URL and get a short 7-character alias. Requirements: 100M URLs/day write, 1B reads/day, URLs expire after 5 years.',
    answer: `## Key Numbers
- Write QPS: 100M/86400 ≈ 1,160/s
- Read QPS: 1B/86400 ≈ 11,600/s (10:1 read:write ratio)
- Storage: 100M × 500B avg URL size × 365 × 5 ≈ 90 TB over 5 years

## URL Encoding
Generate a unique 7-character base62 string (62^7 = 3.5T unique URLs). Options:
1. **Counter + Base62**: global auto-increment counter → encode to base62. Simple but single point of failure.
2. **MD5/SHA256 hash + truncate**: hash the long URL, take first 7 chars. Risk: collisions (handle with retry).
3. **Pre-generated key service**: dedicated service generates keys in batches, stores unused keys in a pool. Eliminates contention.

## Database
- Write path: short_url → long_url, created_at, expires_at, user_id
- Read path: 99% cache hits → Redis (TTL = URL expiry)
- DB: Cassandra or DynamoDB (high write throughput, simple key-value access pattern)

## API
- POST /api/v1/urls → { longUrl } → { shortUrl, expiresAt }
- GET /{shortCode} → 301/302 redirect to longUrl

## Scaling
- CDN + multiple read replicas for 301 redirect serving
- Rate limiting per user (100 URLs/day free tier)
- Analytics: Kafka stream → ClickHouse for click tracking`,
    hints: ['Calculate QPS and storage first', 'Read:write ratio is 10:1 — optimize for reads', 'Cache the most popular short URLs in Redis'],
    time_complexity: null, space_complexity: null, code: null,
  },

  {
    topic_id: 'system-design', slug: 'design-notification-system', order_index: 2, is_premium: false,
    title: 'Design a Notification System',
    difficulty: 'Medium',
    companies: ['Meta', 'Uber', 'LinkedIn', 'Airbnb'],
    tags: ['message-queue', 'push', 'email', 'sms', 'scalability'],
    description: 'Design a notification system that sends 10M push notifications, 1M emails, and 500K SMS messages per day across iOS, Android, and Web. Latency requirement: under 10 minutes for delivery.',
    answer: `## Components
1. **Notification Service API**: accepts notification requests, validates, routes to queues
2. **Message Queues**: separate Kafka topics per channel (push_notifications, emails, sms)
3. **Channel Workers**: separate services per channel (APNs for iOS, FCM for Android, SendGrid for email, Twilio for SMS)
4. **User Preference Service**: stores per-user notification preferences and device tokens
5. **Retry Service**: handles failed deliveries with exponential backoff

## Flow
Producer → Notification Service → validate → enrich (add device tokens, preferences) → Kafka queue per channel → Channel Worker → Third-party API (APNs/FCM/SendGrid)

## Key Design Decisions
- **Idempotency**: each notification has a UUID; third-party APIs are called with idempotency keys
- **Priority queues**: critical alerts (password reset) vs marketing in separate queues
- **Rate limiting**: per-user rate limits to prevent spam
- **Failure handling**: DLQ for failed messages → alerting → manual retry

## Database
- users_devices: user_id, device_token, platform, active
- notification_log: id, user_id, channel, status, sent_at, delivered_at`,
    hints: ['Separate queues per channel (push/email/SMS)', 'Device token management is the core complexity', 'Rate limit per user to prevent spam'],
    time_complexity: null, space_complexity: null, code: null,
  },

  {
    topic_id: 'system-design', slug: 'design-kafka-like-system', order_index: 3, is_premium: true,
    title: 'Design a Distributed Message Queue (like Kafka)',
    difficulty: 'Hard',
    companies: ['LinkedIn', 'Uber', 'Netflix', 'Confluent'],
    tags: ['distributed-systems', 'messaging', 'kafka', 'replication'],
    description: 'Design a distributed, fault-tolerant message queue that can handle 1M messages/second, guarantees at-least-once delivery, supports multiple consumer groups, and retains messages for 7 days.',
    answer: `## Core Concepts
- **Append-only log**: messages written sequentially to disk files (segments)
- **Partitions**: unit of parallelism; each partition is an independent ordered log
- **Consumer groups**: each group maintains its own offset; multiple groups can read independently

## Storage
- Partition stored as sequence of segment files on disk
- Sparse index: offset → byte position for O(log n) seek
- sendfile() syscall for zero-copy consumer reads

## Replication
- Leader-follower per partition (RF=3 in production)
- ISR (In-Sync Replicas): followers within replica.lag.time.max.ms of leader LEO
- acks=all: producer waits for all ISR members to confirm

## Consumer Offset
- Stored in dedicated internal topic (__consumer_offsets)
- Group coordinator broker manages rebalances

## Fault Tolerance
- Leader crash → controller elects new leader from ISR
- Broker crash → controller reassigns leadership
- ZooKeeper/KRaft for cluster metadata`,
    hints: ['Focus on the append-only log design', 'Explain ISR and why consumers only read up to HW', 'Partition count = consumer parallelism ceiling'],
    time_complexity: null, space_complexity: null, code: null,
  },

  // ═══════════════════════════════════════════
  // DATA ENGINEERING
  // ═══════════════════════════════════════════
  {
    topic_id: 'data-engineering', slug: 'kafka-consumer-lag', order_index: 1, is_premium: false,
    title: 'What is consumer lag and how do you fix it?',
    difficulty: 'Easy',
    companies: ['Uber', 'LinkedIn', 'Spotify', 'Netflix'],
    tags: ['kafka', 'consumers', 'monitoring'],
    description: 'A Kafka consumer group is lagging behind the producers. Explain what consumer lag is, how to measure it, and the strategies to fix it.',
    answer: `**Consumer lag** = (Latest partition offset) − (Last committed consumer offset). It represents the number of messages the consumer has not yet processed.

## Measuring Lag
\`kafka-consumer-groups.sh --bootstrap-server kafka:9092 --describe --group my-group\`
This shows per-partition lag. Also expose via JMX or use Burrow/kafka-consumer-groups.

## Causes
1. **Processing too slow**: consumer processing logic is the bottleneck
2. **Insufficient consumers**: fewer consumers than partitions
3. **Large batches**: max.poll.records too high, causing max.poll.interval.ms to be exceeded
4. **External service slow**: consumer calls a slow downstream API

## Fixes (in priority order)
1. **Add consumers** (up to partition count) for horizontal scaling
2. **Reduce max.poll.records** if processing is slow — process smaller batches
3. **Increase partitions** to allow more consumers
4. **Async processing**: poll records, submit to thread pool, commit after pool drains
5. **Profile the consumer**: find the slow operation and optimize or cache it`,
    hints: ['Lag = latest_offset - committed_offset', 'Consumer count cannot exceed partition count', 'Check if downstream services are the bottleneck'],
    time_complexity: null, space_complexity: null, code: null,
  },

  {
    topic_id: 'data-engineering', slug: 'spark-data-skew', order_index: 2, is_premium: false,
    title: 'How do you handle data skew in Spark?',
    difficulty: 'Medium',
    companies: ['Databricks', 'LinkedIn', 'Airbnb', 'Spotify'],
    tags: ['spark', 'performance', 'skew', 'joins'],
    description: 'Your Spark job has 99 tasks completing in 2 minutes but 1 task running for 45 minutes. Diagnose the root cause and explain 3 strategies to fix data skew.',
    answer: `## Diagnosis
Check Spark UI → Stages tab → look for tasks with significantly longer duration. The skewed key is usually visible in the task description or by running \`df.groupBy("key").count().orderBy(desc("count")).show()\`.

## Strategy 1 — Salting (for group-by and aggregations)
Add a random "salt" (0-9) to the skewed key, perform the aggregation, then re-aggregate without the salt to get final results. This spreads one heavy key across 10 partitions.

## Strategy 2 — Broadcast Join (for small lookup tables)
If one side of the join is small (<= spark.sql.autoBroadcastJoinThreshold), broadcast it to all executors. This eliminates the shuffle entirely.
\`from pyspark.sql.functions import broadcast\`
\`df1.join(broadcast(df2), "key")\`

## Strategy 3 — AQE (Adaptive Query Execution)
In Spark 3+, enable \`spark.sql.adaptive.enabled=true\` and \`spark.sql.adaptive.skewJoin.enabled=true\`. AQE detects skewed partitions at runtime and automatically splits them into smaller tasks.

## Strategy 4 — Repartition on a different key
If the skew is in a specific column, repartition on a higher-cardinality composite key before the heavy operation.`,
    hints: ['Check Spark UI for one long-running task', 'Salting adds entropy to skewed keys', 'AQE handles skew automatically in Spark 3+'],
    time_complexity: null, space_complexity: null, code: null,
  },

  {
    topic_id: 'data-engineering', slug: 'exactly-once-kafka-streams', order_index: 3, is_premium: true,
    title: 'Explain exactly-once semantics in Kafka Streams',
    difficulty: 'Hard',
    companies: ['Confluent', 'LinkedIn', 'Stripe', 'Robinhood'],
    tags: ['kafka', 'exactly-once', 'transactions', 'streams'],
    description: 'Explain how Kafka Streams achieves exactly-once processing semantics end-to-end, including the role of the idempotent producer, transactions, and read_committed isolation.',
    answer: `Exactly-once in Kafka Streams (EOS v2, Kafka 2.5+) requires all three components working together:

**1. Idempotent Producer**
The broker assigns each producer a PID (Producer ID) + sequence number per partition. Retried batches with the same (PID, partition, seq) are silently deduplicated. Prevents duplicate writes on retry.

**2. Transactions**
\`producer.sendOffsetsToTransaction()\` atomically commits the output records AND the input consumer offsets in a single transaction. Either both commit together or both abort — no partial state.

**3. read_committed Consumer**
Consumers with \`isolation.level=read_committed\` only see records from committed transactions. Aborted transaction records are never visible.

**Flow for each processing batch:**
1. beginTransaction()
2. poll() records from input topic
3. process() each record → send() to output topic
4. sendOffsetsToTransaction(currentOffsets, groupMetadata)
5. commitTransaction() → output records AND input offsets committed atomically

**Configure in Kafka Streams:**
\`props.put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.EXACTLY_ONCE_V2)\`

This internally manages transactions for each task/partition.`,
    code: `// Manual exactly-once pipeline (without Kafka Streams)
producer.initTransactions();
while (true) {
    var records = consumer.poll(Duration.ofMillis(100));
    producer.beginTransaction();
    try {
        for (var r : records) {
            producer.send(new ProducerRecord<>("output", r.key(), transform(r.value())));
        }
        producer.sendOffsetsToTransaction(getOffsets(records), consumer.groupMetadata());
        producer.commitTransaction();
    } catch (KafkaException e) {
        producer.abortTransaction();
    }
}`,
    hints: ['Three components: idempotent producer + transactions + read_committed', 'sendOffsetsToTransaction ties input and output together atomically'],
    time_complexity: null, space_complexity: null,
  },

  // ═══════════════════════════════════════════
  // SQL
  // ═══════════════════════════════════════════
  {
    topic_id: 'sql', slug: 'nth-highest-salary', order_index: 1, is_premium: false,
    title: 'Nth Highest Salary',
    difficulty: 'Medium',
    companies: ['Google', 'Amazon', 'Facebook', 'Microsoft'],
    tags: ['window-functions', 'subquery', 'ranking'],
    description: 'Write a SQL query to find the Nth highest salary from a `Employee` table with columns `id` and `salary`. Return NULL if there are fewer than N employees.',
    answer: `Two approaches:\n\n**1. DENSE_RANK (cleaner)**\nUse DENSE_RANK() to handle ties — employees with the same salary get the same rank.\n\n**2. LIMIT + OFFSET (simpler but may miss ties)**`,
    code: `-- Using DENSE_RANK (handles ties correctly)
WITH ranked AS (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM Employee
)
SELECT MAX(salary) AS NthHighestSalary  -- MAX to return NULL if no rows
FROM ranked
WHERE rnk = N;

-- Using LIMIT/OFFSET (N=3 example)
SELECT DISTINCT salary
FROM Employee
ORDER BY salary DESC
LIMIT 1 OFFSET N-1;`,
    hints: ['DENSE_RANK handles ties (two employees same salary = same rank)', 'Use MAX() in outer query so it returns NULL instead of empty result'],
    time_complexity: 'O(n log n)',
    space_complexity: 'O(n)',
  },

  {
    topic_id: 'sql', slug: 'window-functions-running-total', order_index: 2, is_premium: false,
    title: 'Running Total and Moving Average',
    difficulty: 'Medium',
    companies: ['Amazon', 'Netflix', 'Uber', 'Stripe'],
    tags: ['window-functions', 'aggregation', 'analytics'],
    description: 'Given a `sales` table with columns `date`, `amount`, compute: (1) a running total, (2) a 7-day moving average, (3) the percentage of total each day represents.',
    answer: `Window functions are the key to all three. The OVER() clause defines the window (partition + ordering + frame).`,
    code: `SELECT
  date,
  amount,

  -- Running total (all rows from start up to current)
  SUM(amount) OVER (ORDER BY date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)   AS running_total,

  -- 7-day moving average (current + 6 previous days)
  AVG(amount) OVER (ORDER BY date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)           AS moving_avg_7d,

  -- % of grand total (no ORDER BY = entire partition)
  ROUND(100.0 * amount / SUM(amount) OVER (), 2)        AS pct_of_total

FROM sales
ORDER BY date;`,
    hints: ['ROWS BETWEEN defines the window frame', 'No ORDER BY in OVER() means the full partition', 'UNBOUNDED PRECEDING = from the very first row'],
    time_complexity: 'O(n)', space_complexity: 'O(n)', acceptance: '62%',
  },

  {
    topic_id: 'sql', slug: 'find-duplicate-rows', order_index: 3, is_premium: false,
    title: 'Find and Delete Duplicate Rows',
    difficulty: 'Easy',
    companies: ['Amazon', 'Microsoft', 'Oracle'],
    tags: ['duplicates', 'cte', 'row-number'],
    description: 'Given a `users` table, write SQL to: (1) find all duplicate emails, (2) delete duplicates keeping only the row with the lowest `id`.',
    code: `-- 1. Find duplicate emails
SELECT email, COUNT(*) AS cnt
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- 2. Delete duplicates — keep lowest id per email (PostgreSQL)
DELETE FROM users
WHERE id NOT IN (
  SELECT MIN(id)
  FROM users
  GROUP BY email
);

-- 2. Alternative using ROW_NUMBER (more portable)
WITH ranked AS (
  SELECT id,
    ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
  FROM users
)
DELETE FROM users
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);`,
    answer: `Group by the duplicate column and use HAVING COUNT > 1 to find duplicates. To delete, keep only MIN(id) per group — or use ROW_NUMBER() PARTITION BY the duplicate column, then delete rows where rn > 1.`,
    hints: ['GROUP BY + HAVING COUNT > 1 finds duplicates', 'ROW_NUMBER() PARTITION BY is the cleanest delete approach'],
    time_complexity: 'O(n log n)', space_complexity: 'O(n)',
  },

  // ═══════════════════════════════════════════
  // MACHINE LEARNING
  // ═══════════════════════════════════════════
  {
    topic_id: 'machine-learning', slug: 'overfitting-underfitting', order_index: 1, is_premium: false,
    title: 'How do you handle overfitting and underfitting?',
    difficulty: 'Easy',
    companies: ['Google', 'Meta', 'Apple', 'Spotify'],
    tags: ['regularization', 'bias-variance', 'model-selection'],
    description: 'Explain the bias-variance tradeoff. How do you diagnose and fix overfitting and underfitting in a machine learning model?',
    answer: `**Bias-variance tradeoff**: total error = bias² + variance + irreducible noise.
- **High bias (underfitting)**: model too simple, misses patterns in training data. Low train accuracy AND low test accuracy.
- **High variance (overfitting)**: model memorizes training data, fails to generalize. High train accuracy but low test accuracy.

## Diagnosing
- Plot learning curves: train vs validation error vs training set size
- Overfitting: training error ≪ validation error (large gap)
- Underfitting: both errors are high

## Fixing Overfitting
1. **Regularization**: L1 (Lasso — drives weights to zero, feature selection), L2 (Ridge — penalizes large weights), ElasticNet (both)
2. **Dropout** (neural networks): randomly zero out neurons during training
3. **Early stopping**: stop training when validation error stops improving
4. **More training data**: always the best fix if available
5. **Reduce model complexity**: fewer layers, smaller trees, lower polynomial degree
6. **Cross-validation**: k-fold CV for robust performance estimates

## Fixing Underfitting
1. **More complex model**: add layers, increase tree depth, add features
2. **Feature engineering**: add interaction terms, polynomial features
3. **Reduce regularization**: lower λ
4. **Train longer**: more epochs (for neural networks)`,
    hints: ['Check train vs validation error gap', 'L1 regularization does feature selection', 'More data almost always helps overfitting'],
    time_complexity: null, space_complexity: null, code: null,
  },

  // ═══════════════════════════════════════════
  // BEHAVIORAL
  // ═══════════════════════════════════════════
  {
    topic_id: 'behavioral', slug: 'tell-me-about-yourself', order_index: 1, is_premium: false,
    title: 'Tell me about yourself',
    difficulty: 'Easy',
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Uber'],
    tags: ['introduction', 'narrative', 'positioning'],
    description: 'The most common interview opener. How do you craft a 90-second introduction that positions you well for the role?',
    answer: `## The Formula: Present → Past → Future

**Present** (20 sec): Your current role and what you own. Start with the most impressive or relevant thing.
> "I'm a Senior Data Engineer at [Company], where I own the real-time data platform — a Kafka + Flink system that processes 50M events/day for our fraud detection and personalization teams."

**Past** (30 sec): Career trajectory that led here. 1-2 highlights with impact numbers.
> "Before that I was at [Previous Company] as a data engineer, where I built the ETL pipeline that reduced data latency from 4 hours to 15 minutes. I started as a backend engineer, so I bring strong software engineering fundamentals to data work."

**Future** (20 sec): Why this role, why now. Shows intentionality.
> "I'm looking for a [Staff/Principal] level role where I can work on higher-leverage infrastructure problems — specifically around streaming systems at Google's scale. The data platform role here is exactly that."

**Closing** (10 sec): Invite the conversation.
> "Happy to go deeper on any of that — where would you like to start?"

## Key Rules
- Lead with impact, not job titles
- Include one impressive number in the first 30 seconds
- Tailor the "future" section to the specific company and role
- Practice until it's 90 seconds without rushing`,
    hints: ['Present → Past → Future structure', 'Lead with impact, not titles', 'Include one number in the first 30 seconds'],
    code: null, time_complexity: null, space_complexity: null,
  },

  {
    topic_id: 'behavioral', slug: 'tell-me-failure', order_index: 2, is_premium: false,
    title: 'Tell me about a time you failed',
    difficulty: 'Medium',
    companies: ['Amazon', 'Google', 'Meta', 'Stripe'],
    tags: ['failure', 'growth', 'learning', 'star-method'],
    description: 'Interviewers ask this to assess self-awareness and learning ability. How do you answer authentically without disqualifying yourself?',
    answer: `## What Interviewers Are Actually Testing
1. **Self-awareness**: Can you honestly identify a real failure?
2. **Accountability**: Do you take ownership or blame others?
3. **Growth**: What did you learn and how did you change?

## The STAR + L Framework (Situation, Task, Action, Result + Learning)

**Choose the right story**: Pick a real, non-trivial failure that had a clear lesson. Avoid: blaming others, picking something trivial ("I once missed a small deadline"), picking something that disqualifies you for the role.

**Example Structure**:
- **Situation**: "In 2023 I was the tech lead for a migration from our legacy data warehouse to BigQuery."
- **Task**: "I was responsible for ensuring zero downtime during the cutover."
- **Action**: "I underestimated the query pattern differences between systems and didn't do enough load testing. We had a 4-hour production incident."
- **Result**: "We rolled back, fixed the query patterns, and the second attempt succeeded — but we lost customer trust and SLA credits."
- **Learning**: "Since then I run shadow mode for 2 weeks minimum before any data platform cutover, and I involve the SRE team earlier in the process."

## What NOT to do
- Don't say "I work too hard" or "I'm a perfectionist"
- Don't blame teammates or external factors
- Don't pick a failure that's disqualifying for the role`,
    hints: ['STAR + Learning framework', 'Pick a real failure with a clear lesson', 'End with concrete change in behavior'],
    code: null, time_complexity: null, space_complexity: null,
  },
]
