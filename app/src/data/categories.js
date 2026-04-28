/* =====================================================
   NOTES DATA  — single source of truth
   ===================================================== */
export const LEVEL_COLOR = {
  Beginner:     '#10B981',
  Intermediate: '#F59E0B',
  Advanced:     '#EF4444',
}

export const NOTES_DATA = {
  kafka: {
    name: 'Apache Kafka', icon: '⚡', color: '#4A90D9',
    parts: 6, freeUpTo: 2, sections: 22, level: 'Intermediate',
    tagline: 'Distributed event streaming — internals, replication & production ops',
    partTitles: [
      'Architecture & Core Concepts',
      'Producers & Consumer Groups',
      'Brokers, Topics & Replication',
      'Kafka Streams',
      'Schema Registry & Kafka Connect',
      'Production Operations & Tuning',
    ],
  },
  spark: {
    name: 'Apache Spark', icon: '🔥', color: '#E25A1C',
    parts: 8, freeUpTo: 2, sections: 28, level: 'Advanced',
    tagline: 'Unified analytics engine — RDDs to structured streaming at scale',
    partTitles: [
      'Architecture & Execution Model',
      'RDDs, DataFrames & Datasets',
      'Spark SQL & Query Optimization',
      'Structured Streaming',
      'MLlib & Feature Engineering',
      'GraphX & Graph Processing',
      'Performance Tuning',
      'Production Deployment & Cloud',
    ],
  },
  flink: {
    name: 'Apache Flink', icon: '🌊', color: '#E6522C',
    parts: 7, freeUpTo: 2, sections: 24, level: 'Advanced',
    tagline: 'Stateful stream processing — exactly-once semantics & event time',
    partTitles: [
      'Architecture & Execution Model',
      'DataStream & DataSet APIs',
      'State Management & Checkpoints',
      'Event Time & Watermarks',
      'Windowing & Aggregations',
      'Table API & SQL',
      'Production Operations',
    ],
  },
  druid: {
    name: 'Apache Druid', icon: '🐉', color: '#29ABE2',
    parts: 6, freeUpTo: 2, sections: 20, level: 'Advanced',
    tagline: 'Real-time OLAP database — sub-second queries on petabytes',
    partTitles: [
      'Architecture & Data Model',
      'Ingestion & Indexing',
      'Querying & SQL',
      'Segments & Storage',
      'Cluster Configuration',
      'Production Tuning',
    ],
  },
  gcp: {
    name: 'GCP Data & AI', icon: '☁️', color: '#4285F4',
    parts: 8, freeUpTo: 2, sections: 26, level: 'Intermediate',
    tagline: 'BigQuery, Dataflow, Pub/Sub, Vertex AI & full GCP data stack',
    partTitles: [
      'Core Services Overview',
      'BigQuery Deep Dive',
      'Dataflow & Apache Beam',
      'Cloud Pub/Sub & Streaming',
      'Vertex AI & ML Pipelines',
      'Data Pipeline Orchestration',
      'GCP Networking & IAM',
      'Cost Optimization & Production',
    ],
  },
  'data-modeling': {
    name: 'Data Modeling', icon: '🏗️', color: '#7C3AED',
    parts: 5, freeUpTo: 2, sections: 18, level: 'Intermediate',
    tagline: 'Dimensional modeling, data vault & modern lakehouse patterns',
    partTitles: [
      'Relational & ER Modeling',
      'Dimensional Modeling (Kimball)',
      'Data Vault 2.0',
      'Modern Lakehouse Patterns',
      'Schema Evolution & Governance',
    ],
  },
  sql: {
    name: 'SQL Deep Dive', icon: '🗃️', color: '#336791',
    parts: 6, freeUpTo: 2, sections: 20, level: 'Beginner',
    tagline: 'From basic queries to window functions, CTEs & query optimisation',
    partTitles: [
      'Foundations & Data Types',
      'Joins, Subqueries & CTEs',
      'Aggregations & Window Functions',
      'Indexes & Query Planning',
      'Transactions & Concurrency',
      'Performance Tuning',
    ],
  },
  'machine-learning': {
    name: 'Machine Learning', icon: '🤖', color: '#8B5CF6',
    parts: 6, freeUpTo: 2, sections: 24, level: 'Intermediate',
    tagline: 'From regression to ensemble methods — theory, code & production',
    partTitles: [
      'Mathematical Foundations',
      'Supervised Learning',
      'Unsupervised Learning',
      'Ensemble Methods & Boosting',
      'Model Evaluation & Tuning',
      'MLOps & Production Deployment',
    ],
  },
  'deep-learning': {
    name: 'Deep Learning', icon: '🧠', color: '#EC4899',
    parts: 5, freeUpTo: 2, sections: 20, level: 'Advanced', soon: true,
    tagline: 'Neural network architectures, training dynamics & optimisation',
    partTitles: [
      'Neural Network Fundamentals',
      'CNNs & Computer Vision',
      'RNNs, LSTMs & Transformers',
      'Training at Scale',
      'Deployment & Inference',
    ],
  },
  statistics: {
    name: 'Statistics', icon: '📊', color: '#F59E0B',
    parts: 4, freeUpTo: 2, sections: 16, level: 'Beginner', soon: true,
    tagline: 'Probability, inference, A/B testing & Bayesian reasoning',
    partTitles: [
      'Probability & Distributions',
      'Hypothesis Testing',
      'Regression & Correlation',
      'Bayesian Inference',
    ],
  },
  langchain: {
    name: 'LangChain', icon: '🔗', color: '#1C7C54',
    parts: 5, freeUpTo: 2, sections: 20, level: 'Intermediate',
    tagline: 'Build LLM applications — chains, agents, RAG & memory systems',
    partTitles: [
      'LangChain Architecture',
      'Chains & Prompt Templates',
      'RAG & Vector Stores',
      'Agents & Tools',
      'Production & Monitoring',
    ],
  },
  llamaindex: {
    name: 'LlamaIndex', icon: '🦙', color: '#F97316',
    parts: 4, freeUpTo: 2, sections: 16, level: 'Intermediate', soon: true,
    tagline: 'Data framework for LLM applications — indexing, querying & agents',
    partTitles: [
      'Core Architecture',
      'Indexing & Ingestion',
      'Query Engines',
      'Agents & Workflows',
    ],
  },
  'openai-api': {
    name: 'OpenAI API', icon: '✨', color: '#10B981',
    parts: 3, freeUpTo: 2, sections: 12, level: 'Beginner', soon: true,
    tagline: 'GPT-4, embeddings, fine-tuning & function calling in production',
    partTitles: [
      'API Fundamentals',
      'Embeddings & Semantic Search',
      'Fine-tuning & Production',
    ],
  },
  kubernetes: {
    name: 'Kubernetes', icon: '🚀', color: '#326CE5',
    parts: 6, freeUpTo: 2, sections: 22, level: 'Advanced',
    tagline: 'Container orchestration — pods to production-grade cluster ops',
    partTitles: [
      'Architecture & Control Plane',
      'Pods, Deployments & Services',
      'Networking & Ingress',
      'Storage & StatefulSets',
      'Security & RBAC',
      'Production Operations',
    ],
  },
  docker: {
    name: 'Docker', icon: '🐳', color: '#2496ED',
    parts: 4, freeUpTo: 2, sections: 16, level: 'Beginner', soon: true,
    tagline: 'Containers from first principles — images, networking & compose',
    partTitles: [
      'Container Fundamentals',
      'Images & Dockerfile',
      'Networking & Volumes',
      'Docker Compose & Production',
    ],
  },
  cicd: {
    name: 'CI/CD', icon: '🔄', color: '#F59E0B',
    parts: 3, freeUpTo: 2, sections: 12, level: 'Intermediate', soon: true,
    tagline: 'GitHub Actions, pipelines, GitOps & deployment automation',
    partTitles: [
      'CI/CD Fundamentals',
      'GitHub Actions Deep Dive',
      'GitOps & Deployment Patterns',
    ],
  },
  react: {
    name: 'React.js', icon: '⚛️', color: '#0EA5E9',
    parts: 6, freeUpTo: 2, sections: 24, level: 'Intermediate',
    tagline: 'Hooks, patterns, state management & production React apps',
    partTitles: [
      'React Fundamentals',
      'Hooks In Depth',
      'State Management',
      'Performance & Optimisation',
      'Testing React Apps',
      'Production Patterns',
    ],
  },
  javascript: {
    name: 'JavaScript', icon: '🟨', color: '#D97706',
    parts: 6, freeUpTo: 2, sections: 26, level: 'Beginner',
    tagline: 'The language from closures to async/await & modern ES patterns',
    partTitles: [
      'Language Fundamentals',
      'Functions, Scope & Closures',
      'Prototypes & Classes',
      'Async JavaScript',
      'The Event Loop',
      'Modern ES Patterns',
    ],
  },
  typescript: {
    name: 'TypeScript', icon: '🔷', color: '#3178C6',
    parts: 5, freeUpTo: 2, sections: 18, level: 'Intermediate', soon: true,
    tagline: 'Type system mastery — generics, utility types & advanced patterns',
    partTitles: [
      'Type System Fundamentals',
      'Interfaces & Types',
      'Generics',
      'Advanced Types & Utility Types',
      'TypeScript in Production',
    ],
  },
  python: {
    name: 'Python', icon: '🐍', color: '#3776AB',
    parts: 5, freeUpTo: 2, sections: 20, level: 'Beginner', soon: true,
    tagline: 'From core language features to async, decorators & packaging',
    partTitles: [
      'Language Fundamentals',
      'Functions & OOP',
      'Standard Library Deep Dive',
      'Async & Concurrency',
      'Packaging & Production',
    ],
  },
  'system-design': {
    name: 'System Design', icon: '🏛️', color: '#6366F1',
    parts: 6, freeUpTo: 2, sections: 22, level: 'Advanced', soon: true,
    tagline: 'Design distributed systems — scalability, consistency & trade-offs',
    partTitles: [
      'Fundamentals & Trade-offs',
      'Databases & Storage',
      'Caching Strategies',
      'Message Queues & Streaming',
      'Microservices & APIs',
      'Real-world System Case Studies',
    ],
  },
  dsa: {
    name: 'DSA', icon: '📐', color: '#EC4899',
    parts: 5, freeUpTo: 2, sections: 18, level: 'Intermediate', soon: true,
    tagline: 'Data structures & algorithms — patterns, complexity & interviews',
    partTitles: [
      'Arrays, Strings & Hash Maps',
      'Trees & Graphs',
      'Dynamic Programming',
      'Sorting & Searching',
      'Advanced Data Structures',
    ],
  },
}

/* =====================================================
   CATEGORIES  — reference note slugs
   A slug can appear in multiple categories (cross-link)
   ===================================================== */
export const CATEGORIES = [
  {
    id: 'data-engineer',
    name: 'Data Engineering',
    icon: '🗄️',
    color: '#4A90D9',
    desc: 'Streaming, batch processing, warehousing & cloud platforms',
    notes: ['kafka', 'spark', 'flink', 'druid', 'gcp', 'data-modeling', 'sql'],
  },
  {
    id: 'data-science',
    name: 'Data Science',
    icon: '🔬',
    color: '#8B5CF6',
    desc: 'Machine learning, deep learning & statistical analysis',
    notes: ['machine-learning', 'deep-learning', 'statistics'],
  },
  {
    id: 'ai',
    name: 'AI & LLMs',
    icon: '🤖',
    color: '#1C7C54',
    desc: 'Large language models, agents, RAG & AI engineering',
    notes: ['langchain', 'llamaindex', 'openai-api', 'gcp'],   // gcp cross-linked
  },
  {
    id: 'devops',
    name: 'DevOps & Cloud',
    icon: '⚙️',
    color: '#326CE5',
    desc: 'Containers, orchestration, CI/CD & infrastructure',
    notes: ['kubernetes', 'docker', 'cicd'],
  },
  {
    id: 'frontend',
    name: 'Web Development',
    icon: '🌐',
    color: '#0EA5E9',
    desc: 'React, JavaScript, TypeScript & modern web patterns',
    notes: ['react', 'javascript', 'typescript'],
  },
  {
    id: 'programming',
    name: 'Programming',
    icon: '💻',
    color: '#F59E0B',
    desc: 'Python, algorithms, system design & CS fundamentals',
    notes: ['python', 'system-design', 'dsa'],
  },
]

/* =====================================================
   HELPERS
   ===================================================== */

/** Get full note list for a category, including cross-link info */
export function getCategoryWithNotes(categoryId) {
  const cat = CATEGORIES.find(c => c.id === categoryId)
  if (!cat) return null
  const notes = cat.notes.map(slug => {
    const note = NOTES_DATA[slug]
    const crossLinks = CATEGORIES
      .filter(c => c.id !== categoryId && c.notes.includes(slug))
      .map(c => ({ id: c.id, name: c.name, icon: c.icon }))
    return { ...note, slug, crossLinks, soon: note?.soon ?? false }
  })
  return { ...cat, notes }
}

/** Get a single note with all its category memberships */
export function getNoteWithCategories(slug) {
  const note = NOTES_DATA[slug]
  if (!note) return null
  const categories = CATEGORIES
    .filter(c => c.notes.includes(slug))
    .map(c => ({ id: c.id, name: c.name, icon: c.icon, color: c.color }))
  return { ...note, slug, categories }
}
