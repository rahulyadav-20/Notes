/* =====================================================
   BLOG DATA — single source of truth
   ===================================================== */

export const POST_CATEGORIES = [
  { id: 'interview-experience', label: 'Interview Experience', color: '#6366F1', emoji: '🎯' },
  { id: 'tech-article',         label: 'Tech Article',         color: '#10B981', emoji: '📡' },
  { id: 'career',               label: 'Career',               color: '#F59E0B', emoji: '🚀' },
  { id: 'tutorial',             label: 'Tutorial',             color: '#EC4899', emoji: '📖' },
]

export const COMPANY_COLORS = {
  Google:    '#4285F4',
  Amazon:    '#FF9900',
  Meta:      '#0082FB',
  Microsoft: '#00A4EF',
  LinkedIn:  '#0077B5',
  Netflix:   '#E50914',
  Uber:      '#000000',
  Airbnb:    '#FF5A5F',
  Stripe:    '#635BFF',
}

export const BLOG_POSTS = [
  /* ── Interview Experiences ── */
  {
    slug: 'google-l5-data-engineer-interview',
    category: 'interview-experience',
    company: 'Google',
    title: 'My Google L5 Data Engineer Interview Experience — I Got the Offer',
    excerpt: 'Five rounds, three months of prep, and a lot of Kafka. Here\'s exactly what was asked, what tripped me up, and how I finally cracked L5.',
    author: { name: 'Arjun Mehta', initials: 'AM', color: '#6366F1' },
    date: '2026-04-20',
    readTime: '12 min read',
    tags: ['Google', 'Data Engineering', 'Kafka', 'System Design', 'L5'],
    featured: true,
    content: [
      { type: 'p', text: 'After two previous attempts at Google (L4 in 2022, L4→L5 conversion in 2023), I finally cleared the L5 Data Engineer loop in February 2026. This is the complete breakdown — every round, every question I remember, and the things that actually made the difference.' },
      { type: 'h2', text: 'Background' },
      { type: 'p', text: 'I was a Senior Data Engineer at a Series B fintech, 5 years of experience total. Stack: Spark, Kafka, Airflow, BigQuery. I started prep about 3 months out and focused heavily on system design and Kafka internals since those tripped me up in previous loops.' },
      { type: 'h2', text: 'The Interview Structure (5 rounds)' },
      { type: 'list', items: [
        'Round 1 — DSA (45 min): LeetCode Medium/Hard on arrays + graphs',
        'Round 2 — Data Engineering System Design (60 min): Design a real-time pipeline',
        'Round 3 — General System Design (60 min): Design a URL shortener at Google scale',
        'Round 4 — Googliness + Leadership (45 min): Behavioural + project deep dive',
        'Round 5 — Team Match (30 min): Informal chat with potential team lead',
      ]},
      { type: 'h2', text: 'Round 1 — DSA' },
      { type: 'p', text: 'The interviewer was friendly and jumped straight in. First question: find all islands in a grid (BFS/DFS). Easy warm-up. Then: a modified version of merge intervals where intervals could have priority weights. I solved both but the second one took me longer than I\'d like.' },
      { type: 'tip', text: 'Google cares more about how you think than the final answer. Talk through your approach before coding. They want to see structured reasoning.' },
      { type: 'h2', text: 'Round 2 — Data Engineering System Design' },
      { type: 'p', text: 'This was the round I was most nervous about given my past failures here. The prompt: "Design a real-time fraud detection pipeline that processes 500K transactions/sec with sub-100ms latency alerts."' },
      { type: 'p', text: 'I started with clarifying questions: What\'s the tolerance for false positives? Is this global or regional? What\'s the data retention requirement? The interviewer was clearly happy with this — he said most candidates jump straight to architecture.' },
      { type: 'p', text: 'My design: Kafka as the ingestion layer (partitioned by user_id for ordering), Flink for stateful stream processing (feature computation + model scoring), Redis for feature store (low-latency lookups), Cassandra for audit log, PagerDuty/SNS for alert fanout.' },
      { type: 'tip', text: 'For DE system design, always address: exactly-once semantics, late data handling, schema evolution, and operational concerns (monitoring, replay). These are the "hard" parts Google cares about.' },
      { type: 'h2', text: 'Round 3 — General System Design' },
      { type: 'p', text: 'URL shortener. Classic, but Google asks it to see if you can scale to their level. I covered: hash collision handling, multi-region with consistent hashing, read-heavy caching strategy (99:1 read/write ratio), analytics pipeline for click tracking, rate limiting.' },
      { type: 'h2', text: 'Round 4 — Behavioural' },
      { type: 'p', text: 'Questions included: "Tell me about a time you disagreed with your manager", "Describe the most complex system you built end-to-end", "When have you had to make a decision with incomplete information?" I used STAR format throughout and made sure to quantify impact.' },
      { type: 'h2', text: 'The Offer' },
      { type: 'p', text: 'Got the call 12 days after the final interview. L5, Mountain View (remote option). Base + RSUs + bonus. The prep was brutal but worth it. The key things that changed from my previous attempts: I stopped trying to memorise solutions and started truly understanding patterns.' },
      { type: 'tip', text: 'Resources that helped most: Designing Data-Intensive Applications (DDIA), EngiNotes interview section, and doing 5+ mock system design interviews with senior engineers I found on Pramp.' },
    ],
  },
  {
    slug: 'amazon-sde2-after-two-rejections',
    category: 'interview-experience',
    company: 'Amazon',
    title: 'I Failed the Amazon SDE2 Interview Twice. The Third Time I Got In.',
    excerpt: 'Two years, three attempts, six Leadership Principles failures. This is the exact change in approach that finally got me an offer from Amazon.',
    author: { name: 'Priya Sharma', initials: 'PS', color: '#F59E0B' },
    date: '2026-04-10',
    readTime: '9 min read',
    tags: ['Amazon', 'Leadership Principles', 'STAR', 'SDE2', 'Behavioral'],
    featured: false,
    content: [
      { type: 'p', text: 'Most interview blogs only share success stories. This one starts with two rejections.' },
      { type: 'h2', text: 'Attempt 1 (Feb 2024) — Rejected After Onsite' },
      { type: 'p', text: 'I was confident. 4 years of experience, solid DSA prep, strong system design. Bombed all 4 Leadership Principle rounds. The feedback: "Stories were not specific enough and lacked measurable impact." I thought LP was just a formality. It\'s not.' },
      { type: 'h2', text: 'Attempt 2 (Aug 2024) — Rejected After Phone Screen' },
      { type: 'p', text: 'I over-corrected. Made my LP stories too long and rehearsed. The recruiter told me I sounded "like I was reading from a script." Amazon interviewers can spot memorisation from a mile away.' },
      { type: 'h2', text: 'What Actually Changed for Attempt 3' },
      { type: 'p', text: 'I stopped preparing stories and started preparing experiences. There\'s a difference. I wrote down 15 real projects I\'d worked on with full context — the problem, my role, what I decided, what the outcome was numerically. Then I mapped these to LP dimensions, not the other way around.' },
      { type: 'tip', text: 'Build a story bank of 15+ projects first. Then match to LPs. Never do it in reverse (pick an LP then fabricate a story). Interviewers can feel the difference.' },
      { type: 'h2', text: 'Attempt 3 — Passed' },
      { type: 'p', text: 'Same structure, same difficulty of questions. Different feel because the stories were genuine and I could go deep when pushed. Got the offer for SDE2 in Bangalore. Starting March 2026.' },
    ],
  },
  {
    slug: 'meta-e4-data-engineer-what-to-expect',
    category: 'interview-experience',
    company: 'Meta',
    title: 'Meta E4 Data Engineer Interview — What to Expect in 2026',
    excerpt: 'Just completed my Meta E4 Data Engineering loop. The process has changed significantly — here\'s what the rounds look like now and how to prepare.',
    author: { name: 'Rahul Yadav', initials: 'RY', color: '#0082FB' },
    date: '2026-03-28',
    readTime: '8 min read',
    tags: ['Meta', 'Data Engineering', 'E4', 'Spark', 'SQL'],
    featured: false,
    content: [
      { type: 'p', text: 'The Meta DE interview in 2026 is structured differently than what most blog posts from 2023 describe. Here\'s the current structure and what each round actually tests.' },
      { type: 'h2', text: 'Current Interview Structure (4 rounds)' },
      { type: 'list', items: [
        'Product Sense + SQL (45 min) — Heavy SQL, metrics definition',
        'Data Engineering Technical (45 min) — Pipeline design, Spark, warehousing',
        'Coding (45 min) — Python + DSA, usually Medium difficulty',
        'Behavioural (45 min) — Meta\'s values (Move fast, Be bold, Be open)',
      ]},
      { type: 'h2', text: 'What Surprised Me' },
      { type: 'p', text: 'The Product Sense + SQL round was the hardest. They ask you to define metrics for a product feature, spot anomalies in sample data, and write complex SQL on the spot. I wasn\'t expecting to need product intuition for a data engineering role.' },
      { type: 'tip', text: 'Study Meta\'s data culture: understand the difference between data engineering (building pipelines) and data science roles at Meta. They want DE candidates who can think about the "why" of data, not just the "how".' },
    ],
  },
  {
    slug: 'failed-linkedin-interview-lessons',
    category: 'interview-experience',
    company: 'LinkedIn',
    title: 'I Failed My LinkedIn Interview. Here\'s Everything I Learned.',
    excerpt: 'Honest post-mortem on a LinkedIn Senior DE rejection. The mistakes I made, the feedback I got, and what I\'d do differently.',
    author: { name: 'Sneha Reddy', initials: 'SR', color: '#0077B5' },
    date: '2026-03-15',
    readTime: '6 min read',
    tags: ['LinkedIn', 'Post-mortem', 'Senior Engineer', 'Lessons'],
    featured: false,
    content: [
      { type: 'p', text: 'I failed the LinkedIn Senior Data Engineer interview last month. I\'m writing this two weeks after getting the rejection because I think the failure was instructive and I don\'t see enough honest failure posts.' },
      { type: 'h2', text: 'What Went Wrong' },
      { type: 'p', text: 'The system design round. I designed a technically correct solution but never asked about the team structure or existing infra. LinkedIn\'s DE team is heavy on Kafka (obviously — they built it) and I proposed an architecture that would require replacing their core messaging layer. That\'s a non-starter in any real organisation.' },
      { type: 'tip', text: 'System design at companies with known infra (LinkedIn/Kafka, Airbnb/Airflow, Netflix/Flink) — always acknowledge their existing stack and design around it, not against it.' },
    ],
  },

  /* ── Tech Articles ── */
  {
    slug: 'kafka-consumer-groups-production',
    category: 'tech-article',
    company: null,
    title: 'Kafka Consumer Groups: What the Docs Won\'t Tell You',
    excerpt: 'Consumer group rebalancing in production is painful. Here\'s the complete picture — cooperative rebalancing, static membership, and the tuning knobs that actually matter.',
    author: { name: 'Rahul Yadav', initials: 'RY', color: '#4A90D9' },
    date: '2026-04-15',
    readTime: '14 min read',
    tags: ['Kafka', 'Data Engineering', 'Production', 'Consumer Groups'],
    featured: false,
    content: [
      { type: 'p', text: 'If you\'ve run Kafka in production for more than a few months, you\'ve hit the rebalance problem. Consumers pause, lag spikes, dashboards go red, and somewhere an executive is asking why.' },
      { type: 'h2', text: 'What Is a Rebalance?' },
      { type: 'p', text: 'A rebalance is the process by which partition ownership is redistributed among consumers in a group. It happens when: a consumer joins, a consumer leaves or crashes, a heartbeat times out, or the topic partition count changes.' },
      { type: 'h2', text: 'The Stop-the-World Problem' },
      { type: 'p', text: 'By default (Kafka < 2.4), rebalances are "eager" — all consumers stop processing, revoke all their partitions, and wait for the group coordinator to reassign. For a group of 50 consumers processing 10M messages/sec, even a 5-second rebalance is a production incident.' },
      { type: 'tip', text: 'Eager rebalance is the default. If you\'re on Kafka 2.4+, enable cooperative rebalancing with partition.assignment.strategy=CooperativeStickyAssignor. It\'s the single highest-impact change for rebalance-heavy workloads.' },
      { type: 'h2', text: 'Cooperative Rebalancing (Kafka 2.4+)' },
      { type: 'p', text: 'Incremental cooperative rebalancing allows consumers to keep partitions they\'re not being reassigned. Instead of "everyone drops everything", only the partitions that need to move are revoked. Processing continues for all other partitions.' },
      { type: 'h2', text: 'Static Membership' },
      { type: 'p', text: 'Set group.instance.id on each consumer to a stable identifier (e.g., pod hostname). The group coordinator will wait for that exact consumer to come back before triggering a rebalance. This is a game-changer for rolling deployments — a pod restart no longer triggers a full rebalance.' },
    ],
  },
  {
    slug: 'why-we-moved-spark-to-flink',
    category: 'tech-article',
    company: null,
    title: 'Why We Moved Our Real-Time Pipelines From Spark to Flink',
    excerpt: 'We ran Spark Structured Streaming in production for 3 years. Then we migrated to Flink. This is the honest comparison — where Spark wins, where Flink wins, and what the migration actually cost.',
    author: { name: 'Arjun Mehta', initials: 'AM', color: '#6366F1' },
    date: '2026-04-05',
    readTime: '11 min read',
    tags: ['Spark', 'Flink', 'Streaming', 'Architecture', 'Migration'],
    featured: false,
    content: [
      { type: 'p', text: 'We processed 800M events/day on Spark Structured Streaming. It worked. Then it didn\'t scale. Here\'s the honest story.' },
      { type: 'h2', text: 'Why We Chose Spark Originally' },
      { type: 'p', text: 'Familiarity. Our batch pipelines were already on Spark, so adding Structured Streaming felt like a natural extension. The unified API was compelling. The Spark ecosystem (Delta Lake, MLlib) was mature.' },
      { type: 'h2', text: 'The Problems That Appeared at Scale' },
      { type: 'p', text: 'Micro-batch latency became a ceiling. Our SLA required sub-5-second alerts. Spark\'s micro-batch model struggled below 10-second batch intervals at our volume. The trigger latency alone added 2-3 seconds of non-negotiable overhead.' },
      { type: 'tip', text: 'Spark Structured Streaming is excellent for near-real-time (seconds to minutes). If you need genuine sub-second or event-time-accurate processing with complex windowing, Flink\'s native streaming model wins.' },
    ],
  },
  {
    slug: 'sql-window-functions-real-examples',
    category: 'tech-article',
    company: null,
    title: 'SQL Window Functions Explained With Real Production Examples',
    excerpt: 'ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, PARTITION BY — all the window functions with examples drawn from actual analytics queries, not toy datasets.',
    author: { name: 'Priya Sharma', initials: 'PS', color: '#336791' },
    date: '2026-03-22',
    readTime: '10 min read',
    tags: ['SQL', 'Window Functions', 'Analytics', 'Data Engineering'],
    featured: false,
    content: [
      { type: 'p', text: 'Window functions are the most powerful and most misunderstood feature in SQL. Most tutorials show you the syntax. This article shows you when and why to use each one.' },
      { type: 'h2', text: 'What Makes a Window Function Different' },
      { type: 'p', text: 'A window function computes a value for each row using a "window" of related rows — without collapsing the result set. Unlike GROUP BY aggregations, you keep all rows.' },
      { type: 'tip', text: 'If GROUP BY is about "give me one row per group", a window function is about "for each row, tell me something about its group". That mental model makes PARTITION BY click immediately.' },
    ],
  },

  /* ── Career ── */
  {
    slug: 'star-method-that-works-faang',
    category: 'career',
    company: null,
    title: 'The STAR Framework That Actually Works at FAANG',
    excerpt: 'Everyone knows STAR. Nobody teaches you how to make it work under pressure, in real interviews, with an examiner who is actively probing your story.',
    author: { name: 'Sneha Reddy', initials: 'SR', color: '#F59E0B' },
    date: '2026-04-01',
    readTime: '7 min read',
    tags: ['Behavioral', 'STAR', 'FAANG', 'Interview Prep', 'Career'],
    featured: false,
    content: [
      { type: 'p', text: 'I\'ve interviewed over 60 candidates at two FAANG companies. 80% of them fail behavioural rounds not because they have bad experiences, but because they can\'t structure and deliver them under pressure.' },
      { type: 'h2', text: 'The STAR Trap' },
      { type: 'p', text: 'Most candidates learn STAR as a template: Situation, Task, Action, Result. Then they practise filling the template. The problem: it sounds like a template. Interviewers can hear the "Situation: I was working on a team of 5..." opener from a mile away.' },
      { type: 'tip', text: 'Start with the Result first when the impact is strong. "I reduced our pipeline cost by 60% over 3 months. Here\'s how." Immediately hooks the interviewer. The rest of STAR becomes explanation, not recitation.' },
      { type: 'h2', text: 'The Deep-Dive Probe' },
      { type: 'p', text: 'Good FAANG interviewers will probe your story: "Why did you choose that approach over X?", "What would you do differently?", "How did your manager react?" If your story is fabricated or half-remembered, you\'ll stumble here.' },
    ],
  },
  {
    slug: 'negotiate-30-percent-salary-bump',
    category: 'career',
    company: null,
    title: 'How to Negotiate Your First 30% Salary Bump',
    excerpt: 'The step-by-step negotiation playbook I\'ve used across 4 job changes — from research to offer call scripts to handling the "this is our best offer" line.',
    author: { name: 'Rahul Yadav', initials: 'RY', color: '#10B981' },
    date: '2026-03-08',
    readTime: '8 min read',
    tags: ['Career', 'Salary', 'Negotiation', 'Job Search'],
    featured: false,
    content: [
      { type: 'p', text: 'I\'ve negotiated 4 job offers. Average bump over initial offer: 28%. This is not talent — it\'s a repeatable process. Here\'s the full playbook.' },
      { type: 'h2', text: 'The Research Phase (2 weeks before interviews)' },
      { type: 'p', text: 'Use Levels.fyi, Glassdoor, LinkedIn Salary, and Blind to build a compensation band for your target role and location. You want the P50 and P75 for your experience level. This is your anchor.' },
      { type: 'tip', text: 'Never give a number first. "I\'m flexible and open to what you think is fair for this role given my experience" is a complete, professional answer to any salary question before an offer exists.' },
    ],
  },

  /* ── Tutorial ── */
  {
    slug: 'build-kafka-producer-python',
    category: 'tutorial',
    company: null,
    title: 'Build a Production-Grade Kafka Producer in Python (With Error Handling)',
    excerpt: 'A complete tutorial: from `pip install confluent-kafka` to a resilient, monitored producer with retry logic, dead-letter queues, and schema validation.',
    author: { name: 'Rahul Yadav', initials: 'RY', color: '#EC4899' },
    date: '2026-02-20',
    readTime: '15 min read',
    tags: ['Kafka', 'Python', 'Tutorial', 'Data Engineering', 'Production'],
    featured: false,
    content: [
      { type: 'p', text: 'Most Kafka Python tutorials show you a 10-line producer that works on localhost. This tutorial builds something production-worthy.' },
      { type: 'h2', text: 'What We\'re Building' },
      { type: 'p', text: 'A Kafka producer that: handles transient broker failures with exponential backoff, validates messages against a schema before sending, routes invalid messages to a dead-letter topic, and emits metrics to StatsD.' },
      { type: 'tip', text: 'Use confluent-kafka (librdkafka bindings) over kafka-python in production. It\'s significantly faster and has better support for advanced configs like idempotent producers.' },
    ],
  },
]

/* ── Helpers ── */
export function getBlogPostBySlug(slug) {
  return BLOG_POSTS.find(p => p.slug === slug) || null
}

export function getBlogPostsByCategory(categoryId) {
  if (!categoryId || categoryId === 'all') return BLOG_POSTS
  return BLOG_POSTS.filter(p => p.category === categoryId)
}

export function getFeaturedPost() {
  return BLOG_POSTS.find(p => p.featured) || BLOG_POSTS[0]
}

export function getRelatedPosts(slug, limit = 3) {
  const post = getBlogPostBySlug(slug)
  if (!post) return []
  return BLOG_POSTS
    .filter(p => p.slug !== slug && (p.category === post.category || p.tags.some(t => post.tags.includes(t))))
    .slice(0, limit)
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}
