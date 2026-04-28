# Topic Block — LangChain

FILE:           src/pages/notes/ai/LangChain.jsx
PRIMARY_COLOR:  #1C7C54
GRAD_START:     #1C7C54
GRAD_END:       #2ECC71
ICON_LETTER:    L
BRAND:          LangChain
EDITION:        LangChain 0.3 · Python · Production LLM Reference 2025

COVER:
  title:    "LangChain"
  subtitle: "Building LLM-Powered Applications"
  tagline:  "Chains, agents, RAG pipelines, memory systems, tools, and production
             deployment of large language model applications"
  stats:    5 Parts · 20 Sections · 180+ Concepts

FRESHER ANALOGY:
  LangChain is like LEGO for AI applications. Each block (chain, tool, memory) does
  one job and snaps together. You build a complex assistant the same way you build a
  LEGO robot — link blocks in sequence and the whole system works together.

CODE LANGUAGES: Python (primary) · LangChain Expression Language (LCEL)

---

## Parts & Sections

Part 1 — LangChain Architecture
  1 — Core Concepts
    1.1 Why LangChain Exists
    1.2 The LCEL (LangChain Expression Language) Paradigm
    1.3 Runnables: Invoke, Stream, Batch
    1.4 LangSmith: Tracing and Evaluation
  2 — Models and Prompts
    2.1 Chat Models vs LLMs vs Embeddings
    2.2 Prompt Templates: String, Chat, FewShot
    2.3 Output Parsers: Pydantic, JSON, Structured
    2.4 Model Fallbacks and Retry Logic

Part 2 — Chains & Prompt Templates
  3 — Building Chains with LCEL
    3.1 Simple Chain: Prompt | LLM | Parser
    3.2 Sequential Chains and Branching
    3.3 Parallel Execution with RunnableParallel
    3.4 Dynamic Routing with RunnableBranch
  4 — Retrieval Chains
    4.1 RetrievalQA Chain Architecture
    4.2 Stuff, Map-Reduce, and Refine Strategies
    4.3 Conversational Retrieval Chain
    4.4 Multi-Query Retriever

Part 3 — RAG & Vector Stores
  5 — RAG Architecture
    5.1 Document Loading: PDF, Web, Database
    5.2 Text Splitting: RecursiveCharacterTextSplitter
    5.3 Embedding Models: OpenAI, HuggingFace, Local
    5.4 Indexing Pipeline
  6 — Vector Stores
    6.1 FAISS, Chroma, Pinecone, Weaviate
    6.2 Similarity Search vs MMR
    6.3 Hybrid Search: Dense + Sparse
    6.4 Re-Ranking with Cross-Encoders
  7 — Advanced RAG Patterns
    7.1 Contextual Compression
    7.2 Parent-Child Chunking
    7.3 Self-Query Retriever
    7.4 Knowledge Graph RAG

Part 4 — Agents & Tools
  8 — Agent Architecture
    8.1 ReAct: Reasoning + Acting Loop
    8.2 Tool Calling (OpenAI Function Calling)
    8.3 Custom Tool Creation
    8.4 Agent Executors and Callbacks
  9 — Memory Systems
    9.1 Buffer Memory vs Summary Memory
    9.2 Entity Memory
    9.3 VectorStore Memory for Long-Term Context
    9.4 Memory in Production: Redis Backend
  10 — Multi-Agent Systems
    10.1 LangGraph Introduction
    10.2 Supervisor Pattern
    10.3 Human-in-the-Loop

Part 5 — Production & Monitoring
  11 — Deployment Patterns
    11.1 LangServe: FastAPI Deployment
    11.2 Streaming Responses
    11.3 Caching: InMemory and Redis
    11.4 Rate Limiting and Cost Control
  12 — Evaluation & Observability
    12.1 LangSmith Evaluation Datasets
    12.2 G-Eval and Custom Metrics
    12.3 Hallucination Detection
    12.4 Production Monitoring Dashboard

---

## Required Diagrams

1. Part 1 — LCEL Chain Pipeline (Flat SVG): Input → Prompt | LLM | OutputParser → Output
2. Part 3 — RAG Architecture (3D IsoBox): Documents → Splitter → Embedder → VectorStore → Retriever → LLM
3. Part 3 — Hybrid Search (Flat SVG): Dense vector path + BM25 sparse path → Fusion → Ranked results
4. Part 4 — ReAct Agent Loop (Flat SVG): Thought → Action → Observation cycle
5. Part 5 — LangServe Architecture (3D IsoBox): Client → FastAPI → Chain → LLM + Cache + Tracing
6. Part 1 — LangChain Ecosystem Map (3D IsoBox): central chain, tools/memory/retriever/agent nodes
