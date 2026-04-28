/* =====================================================
   COURSES DATA  — single source of truth
   ===================================================== */

export const COURSES_DATA = {
  /* ── Data Engineering ── */
  'kafka-masterclass': {
    name: 'Apache Kafka Masterclass',
    iconSlug: 'kafka', color: '#4A90D9',
    instructor: 'Rahul Yadav', level: 'Intermediate',
    duration: '14h 20m', lessons: 52, modules: 6, freeModules: 1,
    price: 'premium', rating: 4.9, students: 0,
    tagline: 'Go from zero to production — internals, streams, connect & ops',
    highlights: ['Consumer Groups & Offsets', 'ISR & Replication', 'Kafka Streams & ksqlDB', 'Schema Registry', 'Production Tuning'],
    moduleTitles: ['Architecture & Core Concepts', 'Producers & Consumer Groups', 'Brokers, Topics & Replication', 'Kafka Streams', 'Schema Registry & Kafka Connect', 'Production Operations'],
    soon: false,
  },
  'spark-masterclass': {
    name: 'Apache Spark Masterclass',
    iconSlug: 'spark', color: '#E25A1C',
    instructor: 'Rahul Yadav', level: 'Advanced',
    duration: '18h 45m', lessons: 72, modules: 8, freeModules: 1,
    price: 'premium', rating: 4.8, students: 0,
    tagline: 'RDDs to structured streaming — performance, MLlib & cloud deploy',
    highlights: ['Spark Execution Model', 'DataFrame & Spark SQL', 'Structured Streaming', 'Performance Tuning', 'Cloud Deployment'],
    moduleTitles: ['Architecture & Execution Model', 'RDDs, DataFrames & Datasets', 'Spark SQL & Query Optimization', 'Structured Streaming', 'MLlib & Feature Engineering', 'GraphX', 'Performance Tuning', 'Production & Cloud'],
    soon: true,
  },
  'flink-masterclass': {
    name: 'Apache Flink Masterclass',
    iconSlug: 'flink', color: '#E6522C',
    instructor: 'Rahul Yadav', level: 'Advanced',
    duration: '16h 10m', lessons: 60, modules: 7, freeModules: 1,
    price: 'premium', rating: 4.8, students: 0,
    tagline: 'Stateful stream processing — exactly-once, event time & watermarks',
    highlights: ['DataStream API', 'State & Checkpoints', 'Event Time & Watermarks', 'Table API & SQL', 'Production Ops'],
    moduleTitles: ['Architecture & Execution Model', 'DataStream & DataSet APIs', 'State Management & Checkpoints', 'Event Time & Watermarks', 'Windowing & Aggregations', 'Table API & SQL', 'Production Operations'],
    soon: true,
  },
  'gcp-masterclass': {
    name: 'GCP Data & AI Masterclass',
    iconSlug: 'gcp', color: '#4285F4',
    instructor: 'Rahul Yadav', level: 'Intermediate',
    duration: '20h 00m', lessons: 80, modules: 8, freeModules: 1,
    price: 'premium', rating: 4.9, students: 0,
    tagline: 'BigQuery, Dataflow, Pub/Sub, Vertex AI & the full GCP data stack',
    highlights: ['BigQuery Internals', 'Dataflow Pipelines', 'Vertex AI & MLOps', 'Cost Optimization'],
    moduleTitles: ['Core Services Overview', 'BigQuery Deep Dive', 'Dataflow & Apache Beam', 'Cloud Pub/Sub', 'Vertex AI & ML Pipelines', 'Orchestration', 'Networking & IAM', 'Cost & Production'],
    soon: true,
  },
  'sql-masterclass': {
    name: 'SQL Deep Dive',
    iconSlug: 'sql', color: '#336791',
    instructor: 'Rahul Yadav', level: 'Beginner',
    duration: '10h 30m', lessons: 44, modules: 6, freeModules: 2,
    price: 'premium', rating: 4.7, students: 0,
    tagline: 'From basic queries to window functions, CTEs & query optimisation',
    highlights: ['Window Functions', 'CTEs & Subqueries', 'Query Plans & Indexes', 'Transactions'],
    moduleTitles: ['Foundations & Data Types', 'Joins, Subqueries & CTEs', 'Aggregations & Window Functions', 'Indexes & Query Planning', 'Transactions & Concurrency', 'Performance Tuning'],
    soon: true,
  },

  /* ── Data Science ── */
  'ml-masterclass': {
    name: 'Machine Learning Masterclass',
    iconSlug: 'machine-learning', color: '#8B5CF6',
    instructor: 'Rahul Yadav', level: 'Intermediate',
    duration: '22h 00m', lessons: 88, modules: 6, freeModules: 1,
    price: 'premium', rating: 4.9, students: 0,
    tagline: 'From regression to ensembles — theory, code & production MLOps',
    highlights: ['Gradient Boosting & XGBoost', 'Model Evaluation & CV', 'Feature Engineering', 'MLOps & Monitoring'],
    moduleTitles: ['Mathematical Foundations', 'Supervised Learning', 'Unsupervised Learning', 'Ensemble Methods', 'Model Evaluation & Tuning', 'MLOps & Production'],
    soon: true,
  },
  'dl-masterclass': {
    name: 'Deep Learning Masterclass',
    iconSlug: 'deep-learning', color: '#EC4899',
    instructor: 'Rahul Yadav', level: 'Advanced',
    duration: '20h 30m', lessons: 80, modules: 5, freeModules: 1,
    price: 'premium', rating: 4.8, students: 0,
    tagline: 'Neural networks, CNNs, Transformers & deployment at scale',
    highlights: ['Transformers & Attention', 'CNNs & Vision', 'Training at Scale', 'Inference Optimization'],
    moduleTitles: ['Neural Network Fundamentals', 'CNNs & Computer Vision', 'RNNs, LSTMs & Transformers', 'Training at Scale', 'Deployment & Inference'],
    soon: true,
  },

  /* ── AI & LLMs ── */
  'langchain-course': {
    name: 'LangChain Bootcamp',
    iconSlug: 'langchain', color: '#1C7C54',
    instructor: 'Rahul Yadav', level: 'Intermediate',
    duration: '12h 00m', lessons: 48, modules: 5, freeModules: 1,
    price: 'premium', rating: 4.8, students: 0,
    tagline: 'Build production LLM apps — chains, agents, RAG & memory',
    highlights: ['RAG Pipelines', 'AI Agents & Tools', 'Vector Stores', 'Production & Monitoring'],
    moduleTitles: ['LangChain Architecture', 'Chains & Prompt Templates', 'RAG & Vector Stores', 'Agents & Tools', 'Production & Monitoring'],
    soon: true,
  },
  'openai-course': {
    name: 'OpenAI API in Production',
    iconSlug: 'openai-api', color: '#10B981',
    instructor: 'Rahul Yadav', level: 'Beginner',
    duration: '8h 00m', lessons: 32, modules: 3, freeModules: 1,
    price: 'premium', rating: 4.7, students: 0,
    tagline: 'GPT-4, embeddings, fine-tuning & function calling in production',
    highlights: ['GPT-4 Function Calling', 'Embeddings & Search', 'Fine-tuning', 'Cost Optimization'],
    moduleTitles: ['API Fundamentals', 'Embeddings & Semantic Search', 'Fine-tuning & Production'],
    soon: true,
  },

  /* ── DevOps ── */
  'kubernetes-course': {
    name: 'Kubernetes Bootcamp',
    iconSlug: 'kubernetes', color: '#326CE5',
    instructor: 'Rahul Yadav', level: 'Advanced',
    duration: '16h 30m', lessons: 64, modules: 6, freeModules: 1,
    price: 'premium', rating: 4.9, students: 0,
    tagline: 'From pods to production — orchestration, networking & security',
    highlights: ['Control Plane Deep Dive', 'Networking & Ingress', 'RBAC & Security', 'Production Operations'],
    moduleTitles: ['Architecture & Control Plane', 'Pods, Deployments & Services', 'Networking & Ingress', 'Storage & StatefulSets', 'Security & RBAC', 'Production Operations'],
    soon: true,
  },
  'docker-course': {
    name: 'Docker Masterclass',
    iconSlug: 'docker', color: '#2496ED',
    instructor: 'Rahul Yadav', level: 'Beginner',
    duration: '8h 45m', lessons: 36, modules: 4, freeModules: 2,
    price: 'premium', rating: 4.7, students: 0,
    tagline: 'Containers from first principles — images, networking & compose',
    highlights: ['Dockerfile Best Practices', 'Docker Networking', 'Docker Compose', 'CI/CD Integration'],
    moduleTitles: ['Container Fundamentals', 'Images & Dockerfile', 'Networking & Volumes', 'Docker Compose & Production'],
    soon: true,
  },

  /* ── Web Dev ── */
  'react-course': {
    name: 'React.js Masterclass',
    iconSlug: 'react', color: '#0EA5E9',
    instructor: 'Rahul Yadav', level: 'Intermediate',
    duration: '18h 00m', lessons: 72, modules: 6, freeModules: 1,
    price: 'premium', rating: 4.9, students: 0,
    tagline: 'Hooks, patterns, state management & production React apps',
    highlights: ['Hooks In Depth', 'State Management', 'Performance & Profiling', 'Testing'],
    moduleTitles: ['React Fundamentals', 'Hooks In Depth', 'State Management', 'Performance & Optimisation', 'Testing React Apps', 'Production Patterns'],
    soon: true,
  },
  'javascript-course': {
    name: 'JavaScript Masterclass',
    iconSlug: 'javascript', color: '#D97706',
    instructor: 'Rahul Yadav', level: 'Beginner',
    duration: '14h 00m', lessons: 56, modules: 6, freeModules: 2,
    price: 'premium', rating: 4.8, students: 0,
    tagline: 'The language deep-dive — closures, async/await & modern ES',
    highlights: ['Closures & Scope', 'The Event Loop', 'Promises & Async/Await', 'Modern ES Patterns'],
    moduleTitles: ['Language Fundamentals', 'Functions, Scope & Closures', 'Prototypes & Classes', 'Async JavaScript', 'The Event Loop', 'Modern ES Patterns'],
    soon: true,
  },

  /* ── Programming ── */
  'python-course': {
    name: 'Python Masterclass',
    iconSlug: 'python', color: '#3776AB',
    instructor: 'Rahul Yadav', level: 'Beginner',
    duration: '12h 30m', lessons: 50, modules: 5, freeModules: 2,
    price: 'premium', rating: 4.8, students: 0,
    tagline: 'From core features to async, decorators & production packaging',
    highlights: ['Decorators & Generators', 'Async & Concurrency', 'Standard Library', 'Packaging & CLI Tools'],
    moduleTitles: ['Language Fundamentals', 'Functions & OOP', 'Standard Library Deep Dive', 'Async & Concurrency', 'Packaging & Production'],
    soon: true,
  },
  'dsa-course': {
    name: 'DSA Bootcamp',
    iconSlug: 'dsa', color: '#EC4899',
    instructor: 'Rahul Yadav', level: 'Intermediate',
    duration: '20h 00m', lessons: 80, modules: 5, freeModules: 1,
    price: 'premium', rating: 4.9, students: 0,
    tagline: 'Patterns, complexity & interview-ready problem solving',
    highlights: ['Sliding Window & Two Pointers', 'Trees & Graphs', 'Dynamic Programming', 'Contest Strategies'],
    moduleTitles: ['Arrays, Strings & Hash Maps', 'Trees & Graphs', 'Dynamic Programming', 'Sorting & Searching', 'Advanced Data Structures'],
    soon: true,
  },
  'system-design-course': {
    name: 'System Design Masterclass',
    iconSlug: 'system-design', color: '#6366F1',
    instructor: 'Rahul Yadav', level: 'Advanced',
    duration: '16h 00m', lessons: 60, modules: 6, freeModules: 1,
    price: 'premium', rating: 4.9, students: 0,
    tagline: 'Design distributed systems for senior & staff engineer interviews',
    highlights: ['Scalability & CAP Theorem', 'Database Design', 'Caching Strategies', 'Real-world Case Studies'],
    moduleTitles: ['Fundamentals & Trade-offs', 'Databases & Storage', 'Caching Strategies', 'Message Queues & Streaming', 'Microservices & APIs', 'Real-world Case Studies'],
    soon: true,
  },
}

/* ── Course Categories ── */
export const COURSE_CATEGORIES = [
  {
    id: 'data-engineer',
    name: 'Data Engineering',
    icon: '🗄️',
    color: '#4A90D9',
    desc: 'Stream processing, batch pipelines, cloud warehouses & real-time analytics',
    courses: ['kafka-masterclass', 'spark-masterclass', 'flink-masterclass', 'gcp-masterclass', 'sql-masterclass'],
  },
  {
    id: 'data-science',
    name: 'Data Science',
    icon: '🔬',
    color: '#8B5CF6',
    desc: 'Machine learning, deep learning & statistical analysis from theory to production',
    courses: ['ml-masterclass', 'dl-masterclass'],
  },
  {
    id: 'ai',
    name: 'AI & LLMs',
    icon: '🤖',
    color: '#1C7C54',
    desc: 'Build production LLM applications — RAG, agents & cloud-native AI engineering',
    courses: ['langchain-course', 'openai-course'],
  },
  {
    id: 'devops',
    name: 'DevOps & Cloud',
    icon: '⚙️',
    color: '#326CE5',
    desc: 'Containers, orchestration, CI/CD & infrastructure automation at scale',
    courses: ['kubernetes-course', 'docker-course'],
  },
  {
    id: 'frontend',
    name: 'Web Development',
    icon: '🌐',
    color: '#0EA5E9',
    desc: 'React, JavaScript & modern web development from beginner to production',
    courses: ['react-course', 'javascript-course'],
  },
  {
    id: 'programming',
    name: 'Programming',
    icon: '💻',
    color: '#F59E0B',
    desc: 'Python, DSA patterns & system design for engineering interviews',
    courses: ['python-course', 'dsa-course', 'system-design-course'],
  },
]

/* ── Helpers ── */
export function getCourseCategoryWithCourses(categoryId) {
  const cat = COURSE_CATEGORIES.find(c => c.id === categoryId)
  if (!cat) return null
  const courses = cat.courses.map(slug => ({ ...COURSES_DATA[slug], slug }))
  return { ...cat, courses }
}

export function getCourseBySlug(slug) {
  const course = COURSES_DATA[slug]
  if (!course) return null
  const category = COURSE_CATEGORIES.find(c => c.courses.includes(slug))
  return { ...course, slug, category }
}
