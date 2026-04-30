--
-- PostgreSQL database dump
--

\restrict QNVDOGKet2aohUUkagNCyivjcLvnesTQlW9ibFdKz4WZKhETTvVCIPzplq5pi8n

-- Dumped from database version 16.13
-- Dumped by pg_dump version 16.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    admin_id uuid,
    action text NOT NULL,
    target_user_id uuid,
    old_value jsonb,
    new_value jsonb,
    ip_address inet,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    description text,
    thumbnail_url text,
    price integer DEFAULT 0 NOT NULL,
    is_published boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- Name: enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enrollments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    course_id uuid NOT NULL,
    enrolled_at timestamp with time zone DEFAULT now() NOT NULL,
    payment_id text
);


ALTER TABLE public.enrollments OWNER TO postgres;

--
-- Name: interview_questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.interview_questions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    topic_id text NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    description text,
    answer text,
    code text,
    difficulty text NOT NULL,
    companies text[],
    tags text[],
    hints text[],
    time_complexity text,
    space_complexity text,
    acceptance text,
    is_premium boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT interview_questions_difficulty_check CHECK ((difficulty = ANY (ARRAY['Easy'::text, 'Medium'::text, 'Hard'::text])))
);


ALTER TABLE public.interview_questions OWNER TO postgres;

--
-- Name: lessons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lessons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    section_id uuid NOT NULL,
    title text NOT NULL,
    video_url text,
    duration_seconds integer,
    is_preview boolean DEFAULT false NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.lessons OWNER TO postgres;

--
-- Name: note_parts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.note_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    note_slug text NOT NULL,
    part_index integer NOT NULL,
    title text NOT NULL,
    blocks jsonb DEFAULT '[]'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.note_parts OWNER TO postgres;

--
-- Name: notes_metadata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notes_metadata (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    category text NOT NULL,
    title text NOT NULL,
    is_premium boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notes_metadata OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    course_id uuid,
    razorpay_order_id text,
    razorpay_payment_id text,
    amount integer NOT NULL,
    currency text DEFAULT 'INR'::text NOT NULL,
    status text DEFAULT 'created'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT payments_status_check CHECK ((status = ANY (ARRAY['created'::text, 'paid'::text, 'failed'::text, 'refunded'::text])))
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: premium_subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.premium_subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    plan text NOT NULL,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone,
    payment_id text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT premium_subscriptions_plan_check CHECK ((plan = ANY (ARRAY['monthly'::text, 'yearly'::text, 'lifetime'::text])))
);


ALTER TABLE public.premium_subscriptions OWNER TO postgres;

--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    token_hash text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- Name: sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id uuid NOT NULL,
    title text NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sections OWNER TO postgres;

--
-- Name: user_note_bookmarks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_note_bookmarks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    note_slug text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_note_bookmarks OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password_hash text,
    google_id text,
    avatar_url text,
    role text DEFAULT 'user'::text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT users_role_check CHECK ((role = ANY (ARRAY['user'::text, 'premium'::text, 'admin'::text])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, admin_id, action, target_user_id, old_value, new_value, ip_address, created_at) FROM stdin;
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (id, slug, title, description, thumbnail_url, price, is_published, created_at, updated_at) FROM stdin;
291272e2-9ac0-4f12-bb46-34d3cc8f9103	apache-kafka-mastery	Apache Kafka Mastery	Deep-dive into Kafka internals, consumers, producers and stream processing.	\N	49900	t	2026-04-29 09:10:48.208512+00	2026-04-29 13:55:14.92418+00
1ade7c1d-eb2c-4792-be21-cb596769b092	system-design-fundamentals	System Design Fundamentals	Learn to design scalable distributed systems from scratch.	\N	49900	t	2026-04-29 09:10:48.208512+00	2026-04-29 13:55:14.92418+00
9287cb53-b708-4b0f-b7f2-b01eb9b21b4d	data-engineering-bootcamp	Data Engineering Bootcamp	Spark, Flink, Druid and modern data pipeline design.	\N	59900	f	2026-04-29 09:10:48.208512+00	2026-04-29 13:55:14.92418+00
\.


--
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enrollments (id, user_id, course_id, enrolled_at, payment_id) FROM stdin;
\.


--
-- Data for Name: interview_questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.interview_questions (id, topic_id, slug, title, description, answer, code, difficulty, companies, tags, hints, time_complexity, space_complexity, acceptance, is_premium, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lessons (id, section_id, title, video_url, duration_seconds, is_preview, order_index, created_at) FROM stdin;
e4f2285a-18f2-473e-90cc-64560ca74df9	e45c8c19-8ae2-4c61-9b9e-5c5197ca526e	Lesson 1 — Topic 1	\N	360	t	0	2026-04-29 09:10:48.208512+00
1b022ea5-5b55-4342-971b-496e1032abbb	e45c8c19-8ae2-4c61-9b9e-5c5197ca526e	Lesson 2 — Topic 2	\N	420	f	1	2026-04-29 09:10:48.208512+00
9eb9fd31-7226-4368-bf75-6747885ab66c	e45c8c19-8ae2-4c61-9b9e-5c5197ca526e	Lesson 3 — Topic 3	\N	480	f	2	2026-04-29 09:10:48.208512+00
6c246118-158b-45de-b084-327fb5ec12f8	e95561e0-84d9-49e7-bbdb-3b09d720b37c	Lesson 1 — Topic 1	\N	360	t	0	2026-04-29 09:10:48.208512+00
da443edb-d84a-4b06-a7b8-06eaf31c34b0	e95561e0-84d9-49e7-bbdb-3b09d720b37c	Lesson 2 — Topic 2	\N	420	f	1	2026-04-29 09:10:48.208512+00
baf6152f-74bf-4b3c-97df-080f79016421	e95561e0-84d9-49e7-bbdb-3b09d720b37c	Lesson 3 — Topic 3	\N	480	f	2	2026-04-29 09:10:48.208512+00
366e3978-e239-4edf-81a1-2d657654aa5b	b35039e7-82c8-46b3-a38c-2e3cbe812262	Lesson 1 — Topic 1	\N	360	t	0	2026-04-29 09:10:48.208512+00
f7d61f67-def0-4e54-bcb5-6a4527e2e5d7	b35039e7-82c8-46b3-a38c-2e3cbe812262	Lesson 2 — Topic 2	\N	420	f	1	2026-04-29 09:10:48.208512+00
e7337de1-1bbe-4a33-84d9-b3b81308cd09	b35039e7-82c8-46b3-a38c-2e3cbe812262	Lesson 3 — Topic 3	\N	480	f	2	2026-04-29 09:10:48.208512+00
6e668b1e-b331-4568-ae67-d82ba087afaf	79e0bb3f-72d6-434c-ab39-a815825ccade	Lesson 1 — Topic 1	\N	360	t	0	2026-04-29 09:10:48.208512+00
e19ea409-2c77-4c9d-9fb0-bba003505e8d	79e0bb3f-72d6-434c-ab39-a815825ccade	Lesson 2 — Topic 2	\N	420	f	1	2026-04-29 09:10:48.208512+00
bdca4ed9-b756-45d3-8621-db072fa18521	79e0bb3f-72d6-434c-ab39-a815825ccade	Lesson 3 — Topic 3	\N	480	f	2	2026-04-29 09:10:48.208512+00
423c443c-028b-40cb-82d9-f4716905cb17	91724cd5-2a40-441f-ac4c-e636558e9dda	Lesson 1 — Topic 1	\N	360	t	0	2026-04-29 13:55:14.92418+00
04949abb-af01-4929-9368-6f41d954898a	91724cd5-2a40-441f-ac4c-e636558e9dda	Lesson 2 — Topic 2	\N	420	f	1	2026-04-29 13:55:14.92418+00
bce5792f-d880-4012-9053-c344ed3979bb	91724cd5-2a40-441f-ac4c-e636558e9dda	Lesson 3 — Topic 3	\N	480	f	2	2026-04-29 13:55:14.92418+00
81c6c537-a258-4785-a85d-3e0fcab3d397	133fb69e-9ef1-4671-8c8f-32ca62d86f0c	Lesson 1 — Topic 1	\N	360	t	0	2026-04-29 13:55:14.92418+00
2f9af8da-5308-4536-b646-8685e8a9e10b	133fb69e-9ef1-4671-8c8f-32ca62d86f0c	Lesson 2 — Topic 2	\N	420	f	1	2026-04-29 13:55:14.92418+00
e88681bc-0fd4-4d34-87e7-5f0c1bc5e279	133fb69e-9ef1-4671-8c8f-32ca62d86f0c	Lesson 3 — Topic 3	\N	480	f	2	2026-04-29 13:55:14.92418+00
01bc70db-8f58-4ef0-925b-7785b0225551	88b50b98-1038-4272-8d01-34b5bc17929f	Lesson 1 — Topic 1	\N	360	t	0	2026-04-29 13:55:14.92418+00
a08ca42c-e454-480a-b924-f1f5f15e8244	88b50b98-1038-4272-8d01-34b5bc17929f	Lesson 2 — Topic 2	\N	420	f	1	2026-04-29 13:55:14.92418+00
d956d220-e9b6-44ac-98a4-34022bb7471e	88b50b98-1038-4272-8d01-34b5bc17929f	Lesson 3 — Topic 3	\N	480	f	2	2026-04-29 13:55:14.92418+00
f8f9c193-54c2-40cd-a875-28d4401b7ed6	107e49b2-48ca-4289-ae00-02d425792809	Lesson 1 — Topic 1	\N	360	t	0	2026-04-29 13:55:14.92418+00
3030fb20-25a8-4682-a425-90c976ce8544	107e49b2-48ca-4289-ae00-02d425792809	Lesson 2 — Topic 2	\N	420	f	1	2026-04-29 13:55:14.92418+00
d5e8e8b7-00b8-4bee-ad1e-4bafbde94d32	107e49b2-48ca-4289-ae00-02d425792809	Lesson 3 — Topic 3	\N	480	f	2	2026-04-29 13:55:14.92418+00
\.


--
-- Data for Name: note_parts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.note_parts (id, note_slug, part_index, title, blocks, created_at, updated_at) FROM stdin;
53103abf-6c9b-4b0e-be7b-afbc6d4e6af8	kafka	0	Architecture & Core Concepts	[{"type": "ph", "label": "Part 1", "title": "Architecture & Core Concepts", "subtitle": "Why Kafka exists, how the commit log works, on-disk storage anatomy, and how the cluster manages itself without ZooKeeper"}, {"type": "section", "title": "1 — Why Apache Kafka Exists", "blocks": [{"type": "ss", "title": "1.1 The Event Streaming Problem", "blocks": [{"md": "Modern applications generate **billions of events daily** — user clicks, financial transactions, IoT sensor readings, application logs, database state changes, and microservice communications. These events represent the pulse of every digital business. The fundamental challenge is capturing them reliably, transporting them between systems in real-time, processing them both as they arrive and retrospectively, and storing them durably for replay.", "type": "p"}, {"md": "Traditional systems fail at this challenge for distinct reasons. Relational databases are not designed for high-throughput append-only writes — a single PostgreSQL node handles ~10K inserts/sec before degrading. HTTP-based microservice communication creates tight coupling: if Service B is down, Service A's write is lost. File-based log aggregation (rsync, batch ETL) introduces minutes-to-hours of delay, making real-time analytics impossible.", "type": "p"}, {"md": "The requirement is a system that can: ingest millions of events per second from thousands of producers, deliver them to hundreds of consumers independently, retain the complete history for days or weeks, and do all of this with sub-10ms end-to-end latency. This is precisely what Apache Kafka was designed to do.", "type": "p"}]}, {"type": "ss", "title": "1.2 Traditional Messaging Systems and Their Limitations", "blocks": [{"md": "The generation of messaging systems before Kafka — RabbitMQ, ActiveMQ, IBM MQ — solved the problem of **reliable point-to-point and publish-subscribe messaging** within a single application domain. They introduced concepts like durable queues, dead letter queues, message acknowledgements, and routing rules (exchanges in AMQP) that remain valuable today.", "type": "p"}, {"md": "However, they were designed for message **delivery**, not data **retention**. The core assumption of AMQP-style brokers is that a message exists to be delivered and then deleted. This creates three fundamental problems at scale: **fan-out requires duplication** (each consumer type needs its own queue, so a producer must write N times for N consumer types); **no replay** (once a message is ACKed, the data is gone — there is no way to re-process historical data without a separate archive); and **throughput ceiling** (~50K msg/s per queue on commodity hardware).", "type": "p"}, {"md": "The fan-out problem is particularly insidious. In a microservices architecture with 50 services, an \\"Order Placed\\" event might need to trigger inventory reservation, payment processing, email notification, analytics recording, fraud detection, and supply chain updates. With RabbitMQ, this requires either 6 separate queues (with the producer writing to each) or a single queue consumed by a router service — both architectures add coupling and complexity that grows with every new consumer type.", "type": "p"}, {"svg": "<svg viewBox=\\"0 0 860 420\\" xmlns=\\"http://www.w3.org/2000/svg\\" font-family=\\"Segoe UI,sans-serif\\">\\n  <defs><marker id=\\"ah\\" markerWidth=\\"8\\" markerHeight=\\"6\\" refX=\\"8\\" refY=\\"3\\" orient=\\"auto\\"><polygon points=\\"0 0,8 3,0 6\\" fill=\\"#555\\"/></marker></defs>\\n  <rect width=\\"860\\" height=\\"420\\" rx=\\"12\\" fill=\\"#F8F9FA\\"/>\\n  <text x=\\"430\\" y=\\"30\\" text-anchor=\\"middle\\" font-size=\\"16\\" font-weight=\\"700\\" fill=\\"#0f0f23\\">Traditional Queue vs Apache Kafka — Core Architectural Difference</text>\\n\\n  <!-- Traditional Queue (left) -->\\n  <rect x=\\"20\\" y=\\"50\\" width=\\"390\\" height=\\"350\\" rx=\\"10\\" fill=\\"#fff\\" stroke=\\"#E74C3C\\" stroke-width=\\"2\\"/>\\n  <text x=\\"215\\" y=\\"78\\" text-anchor=\\"middle\\" font-size=\\"13\\" font-weight=\\"700\\" fill=\\"#E74C3C\\">Traditional Message Queue (RabbitMQ)</text>\\n\\n  <!-- Producer -->\\n  <rect x=\\"40\\" y=\\"100\\" width=\\"90\\" height=\\"40\\" rx=\\"6\\" fill=\\"#fde0d0\\" stroke=\\"#E74C3C\\"/>\\n  <text x=\\"85\\" y=\\"124\\" text-anchor=\\"middle\\" font-size=\\"10\\" font-weight=\\"600\\">Producer</text>\\n\\n  <!-- Queue box -->\\n  <rect x=\\"155\\" y=\\"90\\" width=\\"110\\" height=\\"60\\" rx=\\"6\\" fill=\\"#E74C3C\\"/>\\n  <text x=\\"210\\" y=\\"117\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"11\\" font-weight=\\"700\\">Message Queue</text>\\n  <text x=\\"210\\" y=\\"134\\" text-anchor=\\"middle\\" fill=\\"#ffcccc\\" font-size=\\"9\\">deleted after ACK</text>\\n\\n  <!-- Single consumer -->\\n  <rect x=\\"295\\" y=\\"100\\" width=\\"90\\" height=\\"40\\" rx=\\"6\\" fill=\\"#fde0d0\\" stroke=\\"#E74C3C\\"/>\\n  <text x=\\"340\\" y=\\"124\\" text-anchor=\\"middle\\" font-size=\\"10\\" font-weight=\\"600\\">Consumer A</text>\\n\\n  <!-- Arrow -->\\n  <line x1=\\"130\\" y1=\\"120\\" x2=\\"155\\" y2=\\"120\\" stroke=\\"#555\\" stroke-width=\\"1.5\\" marker-end=\\"url(#ah)\\"/>\\n  <line x1=\\"265\\" y1=\\"120\\" x2=\\"295\\" y2=\\"120\\" stroke=\\"#555\\" stroke-width=\\"1.5\\" marker-end=\\"url(#ah)\\"/>\\n\\n  <!-- Problem annotation -->\\n  <text x=\\"210\\" y=\\"180\\" text-anchor=\\"middle\\" font-size=\\"10\\" fill=\\"#E74C3C\\" font-weight=\\"600\\">⚠ Consumer B wants same data?</text>\\n  <text x=\\"210\\" y=\\"197\\" text-anchor=\\"middle\\" font-size=\\"10\\" fill=\\"#666\\">Must duplicate the queue</text>\\n  <rect x=\\"155\\" y=\\"215\\" width=\\"110\\" height=\\"50\\" rx=\\"6\\" fill=\\"#E74C3C\\" opacity=\\".7\\"/>\\n  <text x=\\"210\\" y=\\"237\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"10\\">Duplicate Queue</text>\\n  <text x=\\"210\\" y=\\"254\\" text-anchor=\\"middle\\" fill=\\"#ffcccc\\" font-size=\\"9\\">separate write needed</text>\\n  <rect x=\\"295\\" y=\\"220\\" width=\\"90\\" height=\\"35\\" rx=\\"6\\" fill=\\"#fde0d0\\" stroke=\\"#E74C3C\\"/>\\n  <text x=\\"340\\" y=\\"242\\" text-anchor=\\"middle\\" font-size=\\"10\\" font-weight=\\"600\\">Consumer B</text>\\n  <line x1=\\"265\\" y1=\\"240\\" x2=\\"295\\" y2=\\"240\\" stroke=\\"#555\\" stroke-width=\\"1.5\\" stroke-dasharray=\\"4,2\\" marker-end=\\"url(#ah)\\"/>\\n\\n  <text x=\\"215\\" y=\\"300\\" text-anchor=\\"middle\\" font-size=\\"10\\" fill=\\"#666\\">✗ No replay — data gone after ACK</text>\\n  <text x=\\"215\\" y=\\"318\\" text-anchor=\\"middle\\" font-size=\\"10\\" fill=\\"#666\\">✗ Coupling — each consumer needs own queue</text>\\n  <text x=\\"215\\" y=\\"336\\" text-anchor=\\"middle\\" font-size=\\"10\\" fill=\\"#666\\">✗ Throughput: ~50K msg/s ceiling</text>\\n  <text x=\\"215\\" y=\\"378\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#888\\" font-style=\\"italic\\">RabbitMQ, ActiveMQ, SQS</text>\\n\\n  <!-- Kafka (right) -->\\n  <rect x=\\"450\\" y=\\"50\\" width=\\"390\\" height=\\"350\\" rx=\\"10\\" fill=\\"#fff\\" stroke=\\"#5DB85B\\" stroke-width=\\"2\\"/>\\n  <text x=\\"645\\" y=\\"78\\" text-anchor=\\"middle\\" font-size=\\"13\\" font-weight=\\"700\\" fill=\\"#5DB85B\\">Apache Kafka — Distributed Commit Log</text>\\n\\n  <!-- Producer -->\\n  <rect x=\\"470\\" y=\\"100\\" width=\\"90\\" height=\\"40\\" rx=\\"6\\" fill=\\"#d4f5d4\\" stroke=\\"#5DB85B\\"/>\\n  <text x=\\"515\\" y=\\"124\\" text-anchor=\\"middle\\" font-size=\\"10\\" font-weight=\\"600\\">Producer</text>\\n\\n  <!-- Kafka log -->\\n  <rect x=\\"580\\" y=\\"85\\" width=\\"160\\" height=\\"70\\" rx=\\"6\\" fill=\\"#5DB85B\\"/>\\n  <text x=\\"660\\" y=\\"110\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"11\\" font-weight=\\"700\\">Kafka Topic Partition</text>\\n  <text x=\\"660\\" y=\\"128\\" text-anchor=\\"middle\\" fill=\\"#d4f5d4\\" font-size=\\"9\\">append-only log — retained 7 days</text>\\n  <text x=\\"660\\" y=\\"145\\" text-anchor=\\"middle\\" fill=\\"#d4f5d4\\" font-size=\\"9\\">offset: 0 1 2 3 4 5 6 …</text>\\n\\n  <line x1=\\"560\\" y1=\\"120\\" x2=\\"580\\" y2=\\"120\\" stroke=\\"#555\\" stroke-width=\\"1.5\\" marker-end=\\"url(#ah)\\"/>\\n\\n  <!-- Multiple consumers with own offsets -->\\n  <rect x=\\"775\\" y=\\"93\\" width=\\"55\\" height=\\"30\\" rx=\\"4\\" fill=\\"#d4f5d4\\" stroke=\\"#5DB85B\\"/>\\n  <text x=\\"802\\" y=\\"112\\" text-anchor=\\"middle\\" font-size=\\"9\\" font-weight=\\"600\\">Group A</text>\\n  <text x=\\"802\\" y=\\"124\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#5DB85B\\">offset=6</text>\\n\\n  <rect x=\\"775\\" y=\\"133\\" width=\\"55\\" height=\\"30\\" rx=\\"4\\" fill=\\"#d4f5d4\\" stroke=\\"#5DB85B\\"/>\\n  <text x=\\"802\\" y=\\"152\\" text-anchor=\\"middle\\" font-size=\\"9\\" font-weight=\\"600\\">Group B</text>\\n  <text x=\\"802\\" y=\\"164\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#5DB85B\\">offset=3</text>\\n\\n  <line x1=\\"740\\" y1=\\"108\\" x2=\\"775\\" y2=\\"108\\" stroke=\\"#555\\" stroke-width=\\"1.5\\" marker-end=\\"url(#ah)\\"/>\\n  <line x1=\\"740\\" y1=\\"148\\" x2=\\"775\\" y2=\\"148\\" stroke=\\"#555\\" stroke-width=\\"1.5\\" marker-end=\\"url(#ah)\\"/>\\n\\n  <text x=\\"645\\" y=\\"195\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#5DB85B\\" font-weight=\\"600\\">Each group reads independently at its own offset</text>\\n\\n  <text x=\\"645\\" y=\\"225\\" text-anchor=\\"middle\\" font-size=\\"10\\" fill=\\"#5DB85B\\" font-weight=\\"600\\">✓ Unlimited fan-out — any number of consumers</text>\\n  <text x=\\"645\\" y=\\"243\\" text-anchor=\\"middle\\" font-size=\\"10\\" fill=\\"#5DB85B\\" font-weight=\\"600\\">✓ Replay — seek to offset 0 and re-read</text>\\n  <text x=\\"645\\" y=\\"261\\" text-anchor=\\"middle\\" font-size=\\"10\\" fill=\\"#5DB85B\\" font-weight=\\"600\\">✓ 1–2 M msg/s per broker</text>\\n  <text x=\\"645\\" y=\\"279\\" text-anchor=\\"middle\\" font-size=\\"10\\" fill=\\"#666\\">✓ Decoupled — producers don't know consumers</text>\\n  <text x=\\"645\\" y=\\"378\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#888\\" font-style=\\"italic\\">Apache Kafka, Apache Pulsar, Redpanda</text>\\n</svg>", "type": "rawsvg"}]}, {"type": "ss", "title": "1.3 Kafka's Core Philosophy — The Commit Log", "blocks": [{"md": "Jay Kreps, the primary author of Kafka's original design at LinkedIn, described the fundamental insight in his 2013 post \\"The Log: What every software engineer should know about real-time data's unifying abstraction\\": **a log is the most natural data structure for a distributed system**. A log is an append-only, totally-ordered sequence of records indexed by time. This is how databases record changes (the write-ahead log), how version control systems track commits, and how filesystems journal modifications.", "type": "p"}, {"md": "Kafka is, at its core, a **distributed commit log as a service**. A Kafka topic partition is literally an append-only log stored on disk. Records are written sequentially, assigned a monotonically increasing **offset** (a 64-bit integer), and never modified. The broker never needs to locate a record by content — consumers fetch by offset, and the log is immutable. This design gives Kafka three properties that no traditional queue can match: **replay** (seek to offset 0 and re-read all history), **fan-out** (each consumer group maintains its own offset and reads independently), and **linear write throughput** (sequential disk writes are 10–100× faster than random writes).", "type": "p"}, {"md": "The analogy to understand this intuitively: Kafka is like a **newspaper archive**. The New York Times does not discard yesterday's newspaper when you finish reading it. The archive stores every edition, forever. Any subscriber can start reading from any edition at any time. Starting a new subscriber does not affect any existing subscriber. Kafka is the archive; topics are newspaper titles; partitions are physical print runs; consumer groups are subscribers.", "type": "p"}, {"svg": "<svg viewBox=\\"0 0 860 340\\" xmlns=\\"http://www.w3.org/2000/svg\\" font-family=\\"Segoe UI,sans-serif\\">\\n  <defs><marker id=\\"ah\\" markerWidth=\\"8\\" markerHeight=\\"6\\" refX=\\"8\\" refY=\\"3\\" orient=\\"auto\\"><polygon points=\\"0 0,8 3,0 6\\" fill=\\"#555\\"/></marker></defs>\\n  <rect width=\\"860\\" height=\\"340\\" rx=\\"12\\" fill=\\"#F8F9FA\\"/>\\n  <text x=\\"430\\" y=\\"28\\" text-anchor=\\"middle\\" font-size=\\"16\\" font-weight=\\"700\\" fill=\\"#0f0f23\\">Kafka Commit Log — Immutable Append-Only Structure</text>\\n\\n  <!-- Log cells -->\\n  <text x=\\"40\\" y=\\"75\\" font-size=\\"11\\" font-weight=\\"700\\" fill=\\"#333\\">Topic: orders  /  Partition 0</text>\\n  <text x=\\"40\\" y=\\"92\\" font-size=\\"10\\" fill=\\"#888\\">← older records                                                    newer records →</text>\\n\\n  <g>\\n      <rect x=\\"40\\" y=\\"105\\" width=\\"70\\" height=\\"70\\" rx=\\"6\\" fill=\\"#d4f5d4\\" stroke=\\"#ccc\\" stroke-width=\\"1\\"/>\\n      <text x=\\"75\\" y=\\"126\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#333\\" font-weight=\\"700\\">offset 0</text>\\n      <text x=\\"75\\" y=\\"145\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#555\\">order</text>\\n      <text x=\\"75\\" y=\\"158\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#555\\">created</text>\\n    </g><g>\\n      <rect x=\\"118\\" y=\\"105\\" width=\\"70\\" height=\\"70\\" rx=\\"6\\" fill=\\"#d4f5d4\\" stroke=\\"#ccc\\" stroke-width=\\"1\\"/>\\n      <text x=\\"153\\" y=\\"126\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#333\\" font-weight=\\"700\\">offset 1</text>\\n      <text x=\\"153\\" y=\\"145\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#555\\">payment</text>\\n      <text x=\\"153\\" y=\\"158\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#555\\">pending</text>\\n    </g><g>\\n      <rect x=\\"196\\" y=\\"105\\" width=\\"70\\" height=\\"70\\" rx=\\"6\\" fill=\\"#d4f5d4\\" stroke=\\"#ccc\\" stroke-width=\\"1\\"/>\\n      <text x=\\"231\\" y=\\"126\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#333\\" font-weight=\\"700\\">offset 2</text>\\n      <text x=\\"231\\" y=\\"145\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#555\\">payment</text>\\n      <text x=\\"231\\" y=\\"158\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#555\\">ok</text>\\n    </g><g>\\n      <rect x=\\"274\\" y=\\"105\\" width=\\"70\\" height=\\"70\\" rx=\\"6\\" fill=\\"#cce5ff\\" stroke=\\"#ccc\\" stroke-width=\\"1\\"/>\\n      <text x=\\"309\\" y=\\"126\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#333\\" font-weight=\\"700\\">offset 3</text>\\n      <text x=\\"309\\" y=\\"145\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#555\\">item</text>\\n      <text x=\\"309\\" y=\\"158\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#555\\">picked</text>\\n    </g><g>\\n      <rect x=\\"352\\" y=\\"105\\" width=\\"70\\" height=\\"70\\" rx=\\"6\\" fill=\\"#cce5ff\\" stroke=\\"#ccc\\" stroke-width=\\"1\\"/>\\n      <text x=\\"387\\" y=\\"126\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#333\\" font-weight=\\"700\\">offset 4</text>\\n      <text x=\\"387\\" y=\\"145\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#555\\">item</text>\\n      <text x=\\"387\\" y=\\"158\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#555\\">shipped</text>\\n    </g><g>\\n      <rect x=\\"430\\" y=\\"105\\" width=\\"70\\" height=\\"70\\" rx=\\"6\\" fill=\\"#cce5ff\\" stroke=\\"#ccc\\" stroke-width=\\"1\\"/>\\n      <text x=\\"465\\" y=\\"126\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#333\\" font-weight=\\"700\\">offset 5</text>\\n      <text x=\\"465\\" y=\\"145\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#555\\">delivered</text>\\n      <text x=\\"465\\" y=\\"158\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#555\\"></text>\\n    </g><g>\\n      <rect x=\\"508\\" y=\\"105\\" width=\\"70\\" height=\\"70\\" rx=\\"6\\" fill=\\"#fff3cd\\" stroke=\\"#ccc\\" stroke-width=\\"1\\"/>\\n      <text x=\\"543\\" y=\\"126\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#333\\" font-weight=\\"700\\">offset 6</text>\\n      <text x=\\"543\\" y=\\"145\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#555\\">review</text>\\n      <text x=\\"543\\" y=\\"158\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#555\\">request</text>\\n    </g><g>\\n      <rect x=\\"586\\" y=\\"105\\" width=\\"70\\" height=\\"70\\" rx=\\"6\\" fill=\\"#fff3cd\\" stroke=\\"#ccc\\" stroke-width=\\"1\\"/>\\n      <text x=\\"621\\" y=\\"126\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#333\\" font-weight=\\"700\\">offset 7</text>\\n      <text x=\\"621\\" y=\\"145\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#555\\">review</text>\\n      <text x=\\"621\\" y=\\"158\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#555\\">received</text>\\n    </g><g>\\n      <rect x=\\"664\\" y=\\"105\\" width=\\"70\\" height=\\"70\\" rx=\\"6\\" fill=\\"#fde0d0\\" stroke=\\"#ccc\\" stroke-width=\\"1\\"/>\\n      <text x=\\"699\\" y=\\"126\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#333\\" font-weight=\\"700\\">offset 8</text>\\n      <text x=\\"699\\" y=\\"145\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#555\\">refund</text>\\n      <text x=\\"699\\" y=\\"158\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#555\\">request</text>\\n    </g><g>\\n      <rect x=\\"742\\" y=\\"105\\" width=\\"70\\" height=\\"70\\" rx=\\"6\\" fill=\\"#fde0d0\\" stroke=\\"#ccc\\" stroke-width=\\"1\\"/>\\n      <text x=\\"777\\" y=\\"126\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#333\\" font-weight=\\"700\\">offset 9</text>\\n      <text x=\\"777\\" y=\\"145\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#555\\">refund</text>\\n      <text x=\\"777\\" y=\\"158\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#555\\">ok</text>\\n    </g>\\n\\n  <!-- Append arrow -->\\n  <line x1=\\"820\\" y1=\\"140\\" x2=\\"845\\" y2=\\"140\\" stroke=\\"#5DB85B\\" stroke-width=\\"2\\" marker-end=\\"url(#ah)\\"/>\\n  <text x=\\"840\\" y=\\"160\\" font-size=\\"9\\" fill=\\"#5DB85B\\" font-weight=\\"600\\">append</text>\\n  <text x=\\"835\\" y=\\"173\\" font-size=\\"8\\" fill=\\"#5DB85B\\">only</text>\\n\\n  <!-- Consumer A offset pointer -->\\n  <line x1=\\"431\\" y1=\\"175\\" x2=\\"431\\" y2=\\"205\\" stroke=\\"#4A90D9\\" stroke-width=\\"2\\" marker-end=\\"url(#ah)\\"/>\\n  <rect x=\\"370\\" y=\\"210\\" width=\\"120\\" height=\\"28\\" rx=\\"5\\" fill=\\"#4A90D9\\"/>\\n  <text x=\\"430\\" y=\\"228\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"10\\" font-weight=\\"600\\">Group A  offset=5</text>\\n\\n  <!-- Consumer B offset pointer -->\\n  <line x1=\\"275\\" y1=\\"175\\" x2=\\"275\\" y2=\\"255\\" stroke=\\"#9B59B6\\" stroke-width=\\"2\\" marker-end=\\"url(#ah)\\"/>\\n  <rect x=\\"214\\" y=\\"260\\" width=\\"120\\" height=\\"28\\" rx=\\"5\\" fill=\\"#9B59B6\\"/>\\n  <text x=\\"274\\" y=\\"278\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"10\\" font-weight=\\"600\\">Group B  offset=3</text>\\n\\n  <!-- Replay annotation -->\\n  <rect x=\\"40\\" y=\\"260\\" width=\\"140\\" height=\\"50\\" rx=\\"6\\" fill=\\"#fff3cd\\" stroke=\\"#F5A623\\" stroke-width=\\"1.5\\"/>\\n  <text x=\\"110\\" y=\\"280\\" text-anchor=\\"middle\\" font-size=\\"10\\" font-weight=\\"600\\" fill=\\"#856404\\">Replay: seek to 0</text>\\n  <text x=\\"110\\" y=\\"297\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#856404\\">re-read all history</text>\\n\\n  <!-- Retention annotation -->\\n  <rect x=\\"650\\" y=\\"260\\" width=\\"190\\" height=\\"50\\" rx=\\"6\\" fill=\\"#d4f5d4\\" stroke=\\"#5DB85B\\" stroke-width=\\"1.5\\"/>\\n  <text x=\\"745\\" y=\\"278\\" text-anchor=\\"middle\\" font-size=\\"10\\" font-weight=\\"600\\" fill=\\"#1a5c1a\\">Retention: 7 days default</text>\\n  <text x=\\"745\\" y=\\"296\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#1a5c1a\\">or size-based (e.g. 100 GB)</text>\\n</svg>", "type": "rawsvg"}, {"md": "The commit log design means Kafka's write path is extremely simple: open(file), write(bytes), close. No index maintenance, no row locking, no MVCC overhead. This is why a single Kafka broker can sustain 1–2 million writes/sec on commodity hardware — it is almost as fast as the raw disk bandwidth.", "type": "callout", "label": "Engineering Insight", "variant": "info"}]}, {"type": "ss", "title": "1.4 Kafka's Four Core Guarantees", "blocks": [{"md": "**Durability**: With `acks=all` and `min.insync.replicas=2`, a write is not acknowledged until at least 2 replicas have persisted the record to disk. A single broker crash cannot lose a committed record. Kafka never calls `fsync()` per message — instead it relies on OS page cache durability plus replication. The practical durability guarantee is: your data survives any single node failure.", "type": "p"}, {"md": "**Ordering**: Kafka guarantees total ordering **within a partition**. All records with the same key are hashed to the same partition (by default using murmur2 hash), giving you ordered history for any given entity. This is sufficient for most real-world requirements: all events for `user_id=42` arrive in chronological order; all events for `order_id=XYZ` arrive in order. Cross-partition ordering is not guaranteed and not needed in practice.", "type": "p"}, {"md": "**Scalability**: Kafka scales horizontally by adding brokers and increasing partition count. A partition is the unit of parallelism — 100 partitions can be processed by 100 consumers concurrently. Adding a broker to a running cluster is live and transparent to producers and consumers. A single cluster has been tested at **1 million partitions** (with KRaft mode) and **multi-GB/s throughput**.", "type": "p"}, {"md": "**Delivery semantics**: Kafka supports configurable delivery guarantees. At-most-once (fastest, potential loss), at-least-once (default, potential duplicates), and exactly-once (via idempotent producers + transactions, highest latency). The right choice depends on whether your consumers are idempotent by nature.", "type": "p"}, {"rows": [["At-most-once", "acks=0", "Auto-commit before processing", "Possible data loss; lowest latency"], ["At-least-once", "acks=all, retries=MAX", "Manual commit after processing", "Possible duplicates; standard choice"], ["Exactly-once", "enable.idempotence=true, transactional.id set", "isolation.level=read_committed", "Highest latency, no duplicates ever"]], "type": "table", "headers": ["Guarantee", "Producer config", "Consumer config", "Trade-off"]}]}, {"type": "ss", "title": "1.5 Kafka vs the Ecosystem", "blocks": [{"md": "**Kafka vs RabbitMQ**: Use Kafka when you need replay, fan-out to many consumer types, high throughput (>50K msg/s), or stream processing. Use RabbitMQ when you need message routing by content (exchanges/bindings), per-message TTL, message priorities, or a simpler operational footprint for low-throughput workloads.", "type": "p"}, {"md": "**Kafka vs Apache Pulsar**: Pulsar separates storage (Apache BookKeeper) from compute (brokers), enabling **instant topic scaling** without partition reassignment. Kafka's coupled storage model makes partition reassignment slower but simpler to operate. Pulsar has built-in multi-tenancy and geo-replication, making it compelling for large multi-team organizations. Kafka's richer ecosystem (Kafka Streams, Kafka Connect, Confluent Platform) makes it the default choice for most teams.", "type": "p"}, {"md": "**Kafka vs AWS Kinesis**: Kinesis is the zero-ops managed choice for AWS-native teams. It lacks Kafka's ecosystem depth (no Streams equivalent, limited connector library) and has harder limits (1 MB/s per shard). Kafka on MSK (Managed Streaming for Kafka) gives you Kafka's power with managed infrastructure. For teams not on AWS, Kafka with Confluent Cloud or self-hosted clusters is the standard.", "type": "p"}, {"svg": "<svg viewBox=\\"0 0 860 360\\" xmlns=\\"http://www.w3.org/2000/svg\\" font-family=\\"Segoe UI,sans-serif\\">\\n  <rect width=\\"860\\" height=\\"360\\" rx=\\"12\\" fill=\\"#F8F9FA\\"/>\\n  <text x=\\"430\\" y=\\"28\\" text-anchor=\\"middle\\" font-size=\\"16\\" font-weight=\\"700\\" fill=\\"#0f0f23\\">Kafka vs Competitors — Feature Comparison Matrix</text>\\n\\n  <!-- Header row -->\\n  <rect x=\\"20\\" y=\\"45\\" width=\\"820\\" height=\\"35\\" rx=\\"6\\" fill=\\"#12123a\\"/>\\n  <text x=\\"130\\" y=\\"67\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"11\\" font-weight=\\"700\\">Feature</text>\\n  <text x=\\"290\\" y=\\"67\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"11\\" font-weight=\\"700\\">Kafka</text>\\n  <text x=\\"430\\" y=\\"67\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"11\\" font-weight=\\"700\\">RabbitMQ</text>\\n  <text x=\\"570\\" y=\\"67\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"11\\" font-weight=\\"700\\">Apache Pulsar</text>\\n  <text x=\\"730\\" y=\\"67\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"11\\" font-weight=\\"700\\">AWS Kinesis</text>\\n\\n  <rect x=\\"20\\" y=\\"90\\" width=\\"820\\" height=\\"28\\" rx=\\"0\\" fill=\\"#fff\\"/>\\n    <text x=\\"130\\" y=\\"108\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#333\\" font-weight=\\"600\\">Max throughput</text>\\n    <text x=\\"290\\" y=\\"108\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#1a5c1a\\">1–2M msg/s/node</text>\\n    <text x=\\"430\\" y=\\"108\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#555\\">50K msg/s</text>\\n    <text x=\\"570\\" y=\\"108\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#555\\">1M+ msg/s</text>\\n    <text x=\\"730\\" y=\\"108\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#555\\">~1M msg/s (managed)</text><rect x=\\"20\\" y=\\"120\\" width=\\"820\\" height=\\"28\\" rx=\\"0\\" fill=\\"#f5f7ff\\"/>\\n    <text x=\\"130\\" y=\\"138\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#333\\" font-weight=\\"600\\">Message replay</text>\\n    <text x=\\"290\\" y=\\"138\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#1a5c1a\\">✓ Retain & seek</text>\\n    <text x=\\"430\\" y=\\"138\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#555\\">✗ Deleted after ACK</text>\\n    <text x=\\"570\\" y=\\"138\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#555\\">✓ Cursor rewind</text>\\n    <text x=\\"730\\" y=\\"138\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#555\\">✓ 365-day retention</text><rect x=\\"20\\" y=\\"150\\" width=\\"820\\" height=\\"28\\" rx=\\"0\\" fill=\\"#fff\\"/>\\n    <text x=\\"130\\" y=\\"168\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#333\\" font-weight=\\"600\\">Consumer model</text>\\n    <text x=\\"290\\" y=\\"168\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#1a5c1a\\">Pull (offset-based)</text>\\n    <text x=\\"430\\" y=\\"168\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#555\\">Push (queue)</text>\\n    <text x=\\"570\\" y=\\"168\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#555\\">Pull (cursor)</text>\\n    <text x=\\"730\\" y=\\"168\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#555\\">Pull (shard)</text><rect x=\\"20\\" y=\\"180\\" width=\\"820\\" height=\\"28\\" rx=\\"0\\" fill=\\"#f5f7ff\\"/>\\n    <text x=\\"130\\" y=\\"198\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#333\\" font-weight=\\"600\\">Ordering guarantee</text>\\n    <text x=\\"290\\" y=\\"198\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#1a5c1a\\">Per-partition</text>\\n    <text x=\\"430\\" y=\\"198\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#555\\">Per-queue</text>\\n    <text x=\\"570\\" y=\\"198\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#555\\">Per-topic partition</text>\\n    <text x=\\"730\\" y=\\"198\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#555\\">Per-shard</text><rect x=\\"20\\" y=\\"210\\" width=\\"820\\" height=\\"28\\" rx=\\"0\\" fill=\\"#fff\\"/>\\n    <text x=\\"130\\" y=\\"228\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#333\\" font-weight=\\"600\\">Horizontal scale</text>\\n    <text x=\\"290\\" y=\\"228\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#1a5c1a\\">Native (add brokers)</text>\\n    <text x=\\"430\\" y=\\"228\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#555\\">Limited</text>\\n    <text x=\\"570\\" y=\\"228\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#555\\">Native</text>\\n    <text x=\\"730\\" y=\\"228\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#555\\">Auto (managed)</text><rect x=\\"20\\" y=\\"240\\" width=\\"820\\" height=\\"28\\" rx=\\"0\\" fill=\\"#f5f7ff\\"/>\\n    <text x=\\"130\\" y=\\"258\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#333\\" font-weight=\\"600\\">Geo-replication</text>\\n    <text x=\\"290\\" y=\\"258\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#1a5c1a\\">MirrorMaker 2</text>\\n    <text x=\\"430\\" y=\\"258\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#555\\">Federation plugins</text>\\n    <text x=\\"570\\" y=\\"258\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#555\\">Built-in native</text>\\n    <text x=\\"730\\" y=\\"258\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#555\\">Cross-region stream</text><rect x=\\"20\\" y=\\"270\\" width=\\"820\\" height=\\"28\\" rx=\\"0\\" fill=\\"#fff\\"/>\\n    <text x=\\"130\\" y=\\"288\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#333\\" font-weight=\\"600\\">Stream processing</text>\\n    <text x=\\"290\\" y=\\"288\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#1a5c1a\\">Kafka Streams native</text>\\n    <text x=\\"430\\" y=\\"288\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#555\\">Limited</text>\\n    <text x=\\"570\\" y=\\"288\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#555\\">Pulsar Functions</text>\\n    <text x=\\"730\\" y=\\"288\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#555\\">Kinesis Analytics</text><rect x=\\"20\\" y=\\"300\\" width=\\"820\\" height=\\"28\\" rx=\\"0\\" fill=\\"#f5f7ff\\"/>\\n    <text x=\\"130\\" y=\\"318\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#333\\" font-weight=\\"600\\">Operational cost</text>\\n    <text x=\\"290\\" y=\\"318\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#1a5c1a\\">Medium-high</text>\\n    <text x=\\"430\\" y=\\"318\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#555\\">Low</text>\\n    <text x=\\"570\\" y=\\"318\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#555\\">High (BookKeeper)</text>\\n    <text x=\\"730\\" y=\\"318\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#555\\">Zero (managed)</text>\\n\\n  <!-- border -->\\n  <rect x=\\"20\\" y=\\"45\\" width=\\"820\\" height=\\"295\\" rx=\\"6\\" fill=\\"none\\" stroke=\\"#e2e5f0\\" stroke-width=\\"1.5\\"/>\\n  <line x1=\\"215\\" y1=\\"45\\" x2=\\"215\\" y2=\\"340\\" stroke=\\"#e2e5f0\\"/>\\n  <line x1=\\"360\\" y1=\\"45\\" x2=\\"360\\" y2=\\"340\\" stroke=\\"#e2e5f0\\"/>\\n  <line x1=\\"505\\" y1=\\"45\\" x2=\\"505\\" y2=\\"340\\" stroke=\\"#e2e5f0\\"/>\\n  <line x1=\\"655\\" y1=\\"45\\" x2=\\"655\\" y2=\\"340\\" stroke=\\"#e2e5f0\\"/>\\n</svg>", "type": "rawsvg"}, {"type": "callout", "items": ["Kafka is a distributed commit log, not a message queue — this distinction drives every design decision", "Fan-out and replay are impossible in traditional queues without duplication; trivial in Kafka", "Order is guaranteed per-partition — use consistent keys to maintain per-entity ordering", "Choose exactly-once only when your downstream cannot tolerate duplicates; at-least-once with idempotent consumers is sufficient for 95% of use cases"], "label": "Key Takeaways — Section 1", "variant": "note"}]}]}, {"type": "divider"}, {"type": "section", "title": "2 — Topics, Partitions & On-Disk Storage", "blocks": [{"type": "ss", "title": "2.1 Topics as Logical Feeds", "blocks": [{"md": "A **topic** is Kafka's fundamental unit of organization — a named, durable, ordered stream of records. Think of a topic like a database table name: it has a schema (implicit or enforced via Schema Registry), a retention policy, and belongs to a cluster. Unlike a database table, a topic has no primary key, no unique constraint, and no secondary index. It is a pure sequential log.", "type": "p"}, {"md": "Topics are organized internally into **partitions**. When you create a topic with `--partitions 12`, Kafka creates 12 independent log files, distributed across brokers. Each partition is a totally-ordered, immutable sequence of records. The partition count is the most consequential topic configuration decision — it sets the ceiling for consumer parallelism and is **not decreasable** without recreating the topic.", "type": "p"}, {"md": "Topic names follow a convention: `{team}.{domain}.{entity}.{version}` — for example `payments.orders.created.v1`. This convention enables topic-level ACLs, monitoring dashboards, and Schema Registry subject naming. Enforce naming conventions via Kafka AdminClient validation or Confluent Platform cluster policies.", "type": "p"}, {"rows": [["num.partitions", "1", "6–48 depending on throughput", "Cannot be decreased; only increased"], ["replication.factor", "1", "3", "Always 3 in production"], ["min.insync.replicas", "1", "2", "Set at topic level or broker default"], ["retention.ms", "604800000 (7d)", "86400000–604800000 (1–7d)", "Tune per topic business requirement"], ["segment.bytes", "1073741824 (1GB)", "268435456 (256 MB)", "Smaller segments = faster retention cleanup"], ["compression.type", "producer", "lz4 or zstd", "Match producer compression to avoid re-compress"]], "type": "table", "headers": ["Parameter", "Default", "Production Recommendation", "Notes"]}]}, {"type": "ss", "title": "2.2 Partition Internals — Segments, Index Files", "blocks": [{"md": "On the broker's filesystem, each partition maps to a directory: `/kafka-data/{topic}-{partition}/`. Inside, the log is split into **segment files**. A segment is a fixed-size (controlled by `log.segment.bytes`, default 1 GB) chunk of the log. When a segment is full, Kafka creates a new one. The old segment becomes **closed** (read-only) and is eventually deleted when it falls outside the retention window.", "type": "p"}, {"md": "Each segment consists of three files. The **`.log` file** contains the raw message bytes in Kafka's message format (header + key + value + attributes + timestamps). The **`.index` file** is a sparse offset index: it stores one entry every `log.index.interval.bytes` (4 KB default) mapping logical offset → byte position in the `.log` file. The **`.timeindex` file** similarly maps timestamps → offsets, enabling time-based seeking (`seekToBeginning` / `offsetsForTimes`).", "type": "p"}, {"md": "When a consumer fetches from offset 5,000, the broker does: (1) binary search the `.index` to find the nearest entry ≤ 5,000; (2) seek to that byte position in `.log`; (3) scan forward record-by-record until reaching offset 5,000; (4) read forward from there. This is O(log N) for the index search + O(1) for the sequential scan — extremely fast even for billions of records.", "type": "p"}, {"svg": "<svg viewBox=\\"0 0 860 380\\" xmlns=\\"http://www.w3.org/2000/svg\\" font-family=\\"Segoe UI,sans-serif\\">\\n  <defs><marker id=\\"ah\\" markerWidth=\\"8\\" markerHeight=\\"6\\" refX=\\"8\\" refY=\\"3\\" orient=\\"auto\\"><polygon points=\\"0 0,8 3,0 6\\" fill=\\"#555\\"/></marker></defs>\\n  <rect width=\\"860\\" height=\\"380\\" rx=\\"12\\" fill=\\"#F8F9FA\\"/>\\n  <text x=\\"430\\" y=\\"28\\" text-anchor=\\"middle\\" font-size=\\"16\\" font-weight=\\"700\\" fill=\\"#0f0f23\\">Partition On-Disk Layout — Segments, Indexes, and Log Files</text>\\n\\n  <!-- Directory label -->\\n  <rect x=\\"30\\" y=\\"50\\" width=\\"800\\" height=\\"50\\" rx=\\"8\\" fill=\\"#e8eeff\\" stroke=\\"#4A90D9\\" stroke-width=\\"1.5\\"/>\\n  <text x=\\"430\\" y=\\"72\\" text-anchor=\\"middle\\" font-size=\\"12\\" font-weight=\\"700\\" fill=\\"#4A90D9\\">/kafka-data/orders-0/  (partition 0 of topic \\"orders\\")</text>\\n  <text x=\\"430\\" y=\\"90\\" text-anchor=\\"middle\\" font-size=\\"10\\" fill=\\"#666\\">One directory per partition per broker — contains all segment files for this partition</text>\\n\\n  <!-- Segment 1 (older, closed) -->\\n  <rect x=\\"30\\" y=\\"120\\" width=\\"240\\" height=\\"120\\" rx=\\"8\\" fill=\\"#fff\\" stroke=\\"#999\\" stroke-width=\\"1.5\\"/>\\n  <text x=\\"150\\" y=\\"142\\" text-anchor=\\"middle\\" font-size=\\"11\\" font-weight=\\"700\\" fill=\\"#333\\">Segment 1 (closed)</text>\\n  <text x=\\"150\\" y=\\"158\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#888\\">base offset = 0</text>\\n\\n  <rect x=\\"50\\" y=\\"168\\" width=\\"200\\" height=\\"22\\" rx=\\"3\\" fill=\\"#d4f5d4\\" stroke=\\"#5DB85B\\"/>\\n  <text x=\\"150\\" y=\\"183\\" text-anchor=\\"middle\\" font-size=\\"9\\">00000000000000000000.log (256 MB)</text>\\n\\n  <rect x=\\"50\\" y=\\"195\\" width=\\"200\\" height=\\"22\\" rx=\\"3\\" fill=\\"#cce5ff\\" stroke=\\"#4A90D9\\"/>\\n  <text x=\\"150\\" y=\\"210\\" text-anchor=\\"middle\\" font-size=\\"9\\">00000000000000000000.index (sparse)</text>\\n\\n  <rect x=\\"50\\" y=\\"218\\" width=\\"200\\" height=\\"18\\" rx=\\"3\\" fill=\\"#fff3cd\\" stroke=\\"#F5A623\\"/>\\n  <text x=\\"150\\" y=\\"231\\" text-anchor=\\"middle\\" font-size=\\"9\\">00000000000000000000.timeindex</text>\\n\\n  <!-- Segment 2 (active) -->\\n  <rect x=\\"310\\" y=\\"120\\" width=\\"260\\" height=\\"120\\" rx=\\"8\\" fill=\\"#fff\\" stroke=\\"#4A90D9\\" stroke-width=\\"2\\"/>\\n  <text x=\\"440\\" y=\\"142\\" text-anchor=\\"middle\\" font-size=\\"11\\" font-weight=\\"700\\" fill=\\"#4A90D9\\">Active Segment (open)</text>\\n  <text x=\\"440\\" y=\\"158\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#888\\">base offset = 1073741824</text>\\n\\n  <rect x=\\"330\\" y=\\"168\\" width=\\"220\\" height=\\"22\\" rx=\\"3\\" fill=\\"#d4f5d4\\" stroke=\\"#5DB85B\\" stroke-width=\\"1.5\\"/>\\n  <text x=\\"440\\" y=\\"183\\" text-anchor=\\"middle\\" font-size=\\"9\\">00000000001073741824.log  ← append here</text>\\n\\n  <rect x=\\"330\\" y=\\"195\\" width=\\"220\\" height=\\"22\\" rx=\\"3\\" fill=\\"#cce5ff\\" stroke=\\"#4A90D9\\" stroke-width=\\"1.5\\"/>\\n  <text x=\\"440\\" y=\\"210\\" text-anchor=\\"middle\\" font-size=\\"9\\">00000000001073741824.index</text>\\n\\n  <rect x=\\"330\\" y=\\"218\\" width=\\"220\\" height=\\"18\\" rx=\\"3\\" fill=\\"#fff3cd\\" stroke=\\"#F5A623\\"/>\\n  <text x=\\"440\\" y=\\"231\\" text-anchor=\\"middle\\" font-size=\\"9\\">00000000001073741824.timeindex</text>\\n\\n  <!-- Producer writes here -->\\n  <rect x=\\"620\\" y=\\"120\\" width=\\"210\\" height=\\"80\\" rx=\\"8\\" fill=\\"#d4f5d4\\" stroke=\\"#5DB85B\\" stroke-width=\\"2\\"/>\\n  <text x=\\"725\\" y=\\"148\\" text-anchor=\\"middle\\" font-size=\\"11\\" font-weight=\\"700\\" fill=\\"#1a5c1a\\">Producer</text>\\n  <text x=\\"725\\" y=\\"166\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#333\\">writes record bytes</text>\\n  <text x=\\"725\\" y=\\"182\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#333\\">broker assigns offset</text>\\n  <text x=\\"725\\" y=\\"198\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#333\\">appends to .log file</text>\\n  <line x1=\\"620\\" y1=\\"160\\" x2=\\"570\\" y2=\\"180\\" stroke=\\"#5DB85B\\" stroke-width=\\"2\\" marker-end=\\"url(#ah)\\"/>\\n\\n  <!-- Index explanation -->\\n  <rect x=\\"30\\" y=\\"270\\" width=\\"800\\" height=\\"80\\" rx=\\"8\\" fill=\\"#fff\\" stroke=\\"#ddd\\"/>\\n  <text x=\\"50\\" y=\\"292\\" font-size=\\"11\\" font-weight=\\"700\\" fill=\\"#333\\">How the sparse .index file works:</text>\\n  <text x=\\"50\\" y=\\"312\\" font-size=\\"10\\" fill=\\"#555\\">Every 4 KB of data written → one index entry  (offset → byte position in .log)</text>\\n  <text x=\\"50\\" y=\\"330\\" font-size=\\"10\\" fill=\\"#555\\">Consumer seeks offset 5,000 → binary search in .index → find nearest entry → scan .log from that byte position</text>\\n  <text x=\\"50\\" y=\\"348\\" font-size=\\"10\\" fill=\\"#888\\">Segment rolls when log.segment.bytes (1 GB default) or log.roll.hours (168h) is reached → new segment files created</text>\\n</svg>", "type": "rawsvg"}, {"md": "The default 1 GB segment size means retention cleanup is coarse. If your retention policy is 1 day and you write 10 MB/min, segments are ~100 GB and retention cleanup takes 24h to activate. Set `segment.bytes=268435456` (256 MB) in production so segments roll every few hours and cleanup is more granular.", "type": "callout", "label": "Segment Size Trap", "variant": "pitfall"}]}, {"type": "ss", "title": "2.3 Log Compaction vs Time-Based Retention", "blocks": [{"md": "Kafka supports two fundamentally different cleanup strategies, configurable per topic via `log.cleanup.policy`. **Delete** (the default) removes entire segments that have aged past `retention.ms` or grown past `retention.bytes`. This is the right policy for event streams: \\"keep all events from the last 7 days.\\"", "type": "p"}, {"md": "**Compact** retains only the **latest record per key** — older records with the same key are garbage collected. This makes a compacted topic behave like a changelog: you always have the current state of every key, but not the full history. Compacted topics are used as source topics for `KTable` in Kafka Streams and as changelogs for connector state. A null-value record (tombstone) signals deletion: the key's record is removed in the next compaction pass.", "type": "p"}, {"md": "The `compact,delete` policy combines both: first compact (deduplicate by key), then delete (remove records older than retention). This is the right choice for CDC topics where you want current state but also want to free disk space after some TTL.", "type": "p"}, {"rows": [["delete", "All records within retention window", "Entire segments past retention", "Event streams, analytics, audit logs", "Coarse cleanup — tune segment.bytes"], ["compact", "Latest record per key (all time)", "Older records per key (async)", "KTable source, user profiles, changelog", "Compaction is async — dirty records remain temporarily"], ["compact,delete", "Latest per key within window", "Old keys + old segments", "CDC with TTL, hybrid data", "Two GC threads; monitor log.cleaner.threads"]], "type": "table", "headers": ["Policy", "Keeps", "Deletes", "Use case", "Pitfall"]}, {"md": "Log compaction is **not instantaneous**. The log cleaner thread runs in the background and processes partitions with the highest \\"dirty ratio\\" first. During compaction, both old and new records coexist. Consumer lag metrics on compacted topics can be misleading because the earliest offset shifts as compaction runs. Monitor `log.cleaner.stats` JMX metrics to understand compaction throughput.", "type": "callout", "label": "Engineering Insight", "variant": "info"}]}, {"type": "ss", "title": "2.4 Zero-Copy I/O — How Kafka Achieves High Throughput", "blocks": [{"md": "The most important performance secret in Kafka is not its distributed design — it is **zero-copy transfer**. When a consumer fetches data, Kafka uses the `sendfile()` Linux syscall instead of the traditional read-write path. In the traditional path: data travels from disk → kernel page cache → user-space buffer (Java heap) → kernel socket buffer → NIC. Each copy costs CPU cycles and memory bandwidth.", "type": "p"}, {"md": "`sendfile()` eliminates the user-space copy entirely: data goes from the OS page cache directly to the NIC via a DMA transfer, never touching the JVM heap. This means Kafka can serve consumers at nearly **disk read bandwidth** (~600 MB/s on SATA SSD, ~3 GB/s on NVMe) with negligible CPU usage. A single broker can handle thousands of concurrent consumers without proportional CPU growth, because the broker is just a conduit from page cache to socket.", "type": "p"}, {"md": "This design explains another critical Kafka tuning rule: **keep the JVM heap small** (6 GB is optimal for a 32 GB broker). The remaining 26 GB is available to the OS page cache. Cached data is served at memory speed (~20 GB/s); uncached data requires a disk read. A broker with a large heap evicts page cache entries, causing more disk reads and 100× higher read latency.", "type": "p"}, {"md": "Engineers instinctively set `KAFKA_HEAP_OPTS=\\"-Xms32g -Xmx32g\\"` on a 32 GB host. This is wrong — it leaves 0 GB for page cache. Set heap to 6 GB maximum. The OS will use the remaining 26 GB for page cache, giving consumers near-memory-speed reads for hot partitions. Verify with `cat /proc/meminfo | grep Cached`.", "type": "callout", "label": "The Heap Size Trap", "variant": "pitfall"}]}, {"type": "ss", "title": "2.5 Partition Sizing — The Most Important Decision", "blocks": [{"md": "Partition count is the single most important configuration decision at topic creation. It controls: **consumer parallelism** (you cannot have more active consumers in a group than partitions), **write throughput** (each partition can sustain ~10 MB/s independently), and **cluster rebalance time** (more partitions = longer leader election recovery).", "type": "p"}, {"md": "The formula for minimum partitions: `max(target_throughput_MB/s ÷ 10, desired_consumer_parallelism)`. For a topic that needs 100 MB/s write throughput with 20 consumers, you need at least 20 partitions. Over-provisioning (e.g., 48 partitions for a 10 MB/s topic) wastes resources but does not cause correctness issues. Under-provisioning is the critical mistake — you cannot reduce partitions later.", "type": "p"}, {"rows": [["1–3", "10–30 MB/s", "3", "< 1 s", "Low-traffic internal / audit topics"], ["6–12", "60–120 MB/s", "12", "1–3 s", "Most production business topics"], ["24–48", "240–480 MB/s", "48", "5–15 s", "High-throughput analytics, CDC"], ["100+", "1+ GB/s", "100+", "30–60 s", "Only if you truly need it — rebalance pain is real"]], "type": "table", "headers": ["Partition count", "Max write throughput", "Max consumers", "Rebalance time (typ.)", "Recommendation"]}, {"type": "callout", "items": ["Segments are the unit of deletion — tune `log.segment.bytes=268435456` (256 MB) for more granular cleanup", "Zero-copy sendfile() is Kafka's performance secret — keep JVM heap at 6 GB, give the rest to OS page cache", "Log compaction is async and not instantaneous — never assume a compacted topic has a clean state in the moment", "Partition count determines consumer parallelism ceiling — cannot be decreased, so plan generously"], "label": "Key Takeaways — Section 2", "variant": "note"}]}]}, {"type": "divider"}, {"type": "section", "title": "3 — Brokers, Cluster Metadata & KRaft", "blocks": [{"type": "ss", "title": "3.1 Broker Architecture and Responsibilities", "blocks": [{"md": "Every Kafka broker is an equal peer in the data plane — there is no master broker for writes. Producers and consumers connect to **any** broker and receive metadata telling them which broker leads which partition. The requesting broker proxies nothing — clients then connect directly to the leader broker for each partition they need.", "type": "p"}, {"md": "A broker has four major subsystems: the **Network Layer** (NIO-based socket server accepting producer/consumer/admin connections on port 9092 by default), the **Log Manager** (manages all partition log directories, segment rolling, compaction), the **Replica Manager** (handles ISR tracking, leader elections, high-watermark advancement), and the **Group Coordinator** (manages consumer group membership, offset commits, stored in the internal `__consumer_offsets` topic).", "type": "p"}, {"md": "The **controller** is a special broker role that manages cluster-level metadata: which broker leads which partition, ISR changes, topic creation/deletion, broker join/leave events. In any healthy cluster, exactly one broker holds the controller role. Controller election in KRaft mode (via Raft protocol) takes under 1 second; in the legacy ZooKeeper-based mode it took 30–60 seconds. This is the primary reason to migrate to KRaft.", "type": "p"}, {"svg": "<svg viewBox=\\"0 0 860 480\\" xmlns=\\"http://www.w3.org/2000/svg\\" font-family=\\"Segoe UI,sans-serif\\">\\n  <defs>\\n    <marker id=\\"ah\\" markerWidth=\\"8\\" markerHeight=\\"6\\" refX=\\"8\\" refY=\\"3\\" orient=\\"auto\\"><polygon points=\\"0 0,8 3,0 6\\" fill=\\"#555\\"/></marker>\\n    <filter id=\\"sh\\"><feDropShadow dx=\\"1\\" dy=\\"2\\" stdDeviation=\\"2\\" flood-opacity=\\".1\\"/></filter>\\n  </defs>\\n  <rect width=\\"860\\" height=\\"480\\" rx=\\"12\\" fill=\\"#F8F9FA\\"/>\\n  <text x=\\"430\\" y=\\"28\\" text-anchor=\\"middle\\" font-size=\\"16\\" font-weight=\\"700\\" fill=\\"#0f0f23\\">Kafka Cluster Architecture — Full Component View</text>\\n\\n  <!-- Producers -->\\n  <rect x=\\"20\\" y=\\"60\\" width=\\"100\\" height=\\"40\\" rx=\\"6\\" fill=\\"#d4f5d4\\" stroke=\\"#5DB85B\\" filter=\\"url(#sh)\\"/>\\n  <text x=\\"70\\" y=\\"84\\" text-anchor=\\"middle\\" font-size=\\"10\\" font-weight=\\"700\\">Producer App</text>\\n  <rect x=\\"20\\" y=\\"115\\" width=\\"100\\" height=\\"40\\" rx=\\"6\\" fill=\\"#d4f5d4\\" stroke=\\"#5DB85B\\" filter=\\"url(#sh)\\"/>\\n  <text x=\\"70\\" y=\\"139\\" text-anchor=\\"middle\\" font-size=\\"10\\" font-weight=\\"700\\">Microservice</text>\\n  <rect x=\\"20\\" y=\\"170\\" width=\\"100\\" height=\\"40\\" rx=\\"6\\" fill=\\"#d4f5d4\\" stroke=\\"#5DB85B\\" filter=\\"url(#sh)\\"/>\\n  <text x=\\"70\\" y=\\"194\\" text-anchor=\\"middle\\" font-size=\\"10\\" font-weight=\\"700\\">CDC / Debezium</text>\\n\\n  <!-- Arrows to brokers -->\\n  <line x1=\\"120\\" y1=\\"80\\" x2=\\"200\\" y2=\\"120\\" stroke=\\"#555\\" stroke-width=\\"1.5\\" marker-end=\\"url(#ah)\\"/>\\n  <line x1=\\"120\\" y1=\\"135\\" x2=\\"200\\" y2=\\"180\\" stroke=\\"#555\\" stroke-width=\\"1.5\\" marker-end=\\"url(#ah)\\"/>\\n  <line x1=\\"120\\" y1=\\"190\\" x2=\\"200\\" y2=\\"240\\" stroke=\\"#555\\" stroke-width=\\"1.5\\" marker-end=\\"url(#ah)\\"/>\\n\\n  <!-- Brokers -->\\n  <rect x=\\"200\\" y=\\"60\\" width=\\"160\\" height=\\"90\\" rx=\\"8\\" fill=\\"#4A90D9\\" stroke=\\"#3570a8\\" stroke-width=\\"2\\" filter=\\"url(#sh)\\"/>\\n  <text x=\\"280\\" y=\\"88\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"12\\" font-weight=\\"700\\">Broker 1</text>\\n  <text x=\\"280\\" y=\\"106\\" text-anchor=\\"middle\\" fill=\\"#d0e4ff\\" font-size=\\"10\\">Leader: P0,P1,P3</text>\\n  <text x=\\"280\\" y=\\"122\\" text-anchor=\\"middle\\" fill=\\"#d0e4ff\\" font-size=\\"10\\">Follower: P2,P4</text>\\n  <text x=\\"280\\" y=\\"140\\" text-anchor=\\"middle\\" fill=\\"#d0e4ff\\" font-size=\\"9\\">port 9092  ID=1</text>\\n\\n  <rect x=\\"200\\" y=\\"175\\" width=\\"160\\" height=\\"90\\" rx=\\"8\\" fill=\\"#4A90D9\\" stroke=\\"#3570a8\\" stroke-width=\\"2\\" filter=\\"url(#sh)\\"/>\\n  <text x=\\"280\\" y=\\"203\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"12\\" font-weight=\\"700\\">Broker 2</text>\\n  <text x=\\"280\\" y=\\"221\\" text-anchor=\\"middle\\" fill=\\"#d0e4ff\\" font-size=\\"10\\">Leader: P2,P4</text>\\n  <text x=\\"280\\" y=\\"237\\" text-anchor=\\"middle\\" fill=\\"#d0e4ff\\" font-size=\\"10\\">Follower: P0,P1</text>\\n  <text x=\\"280\\" y=\\"255\\" text-anchor=\\"middle\\" fill=\\"#d0e4ff\\" font-size=\\"9\\">port 9092  ID=2</text>\\n\\n  <rect x=\\"200\\" y=\\"290\\" width=\\"160\\" height=\\"90\\" rx=\\"8\\" fill=\\"#4A90D9\\" stroke=\\"#3570a8\\" stroke-width=\\"2\\" filter=\\"url(#sh)\\"/>\\n  <text x=\\"280\\" y=\\"318\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"12\\" font-weight=\\"700\\">Broker 3</text>\\n  <text x=\\"280\\" y=\\"336\\" text-anchor=\\"middle\\" fill=\\"#d0e4ff\\" font-size=\\"10\\">Leader: —</text>\\n  <text x=\\"280\\" y=\\"352\\" text-anchor=\\"middle\\" fill=\\"#d0e4ff\\" font-size=\\"10\\">Follower: P3,P4</text>\\n  <text x=\\"280\\" y=\\"368\\" text-anchor=\\"middle\\" fill=\\"#d0e4ff\\" font-size=\\"9\\">port 9092  ID=3</text>\\n\\n  <!-- KRaft controller box -->\\n  <rect x=\\"200\\" y=\\"410\\" width=\\"160\\" height=\\"55\\" rx=\\"8\\" fill=\\"#9B59B6\\" stroke=\\"#7d3f9b\\" stroke-width=\\"2\\" filter=\\"url(#sh)\\"/>\\n  <text x=\\"280\\" y=\\"434\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"11\\" font-weight=\\"700\\">KRaft Controller</text>\\n  <text x=\\"280\\" y=\\"452\\" text-anchor=\\"middle\\" fill=\\"#e8d0f5\\" font-size=\\"9\\">Raft quorum (3 nodes)  port 9093</text>\\n  <line x1=\\"280\\" y1=\\"380\\" x2=\\"280\\" y2=\\"410\\" stroke=\\"#9B59B6\\" stroke-width=\\"1.5\\" stroke-dasharray=\\"4,2\\" marker-end=\\"url(#ah)\\"/>\\n\\n  <!-- Replication arrows between brokers -->\\n  <line x1=\\"360\\" y1=\\"120\\" x2=\\"400\\" y2=\\"190\\" stroke=\\"#F5A623\\" stroke-width=\\"1.5\\" stroke-dasharray=\\"5,3\\" marker-end=\\"url(#ah)\\"/>\\n  <line x1=\\"360\\" y1=\\"230\\" x2=\\"400\\" y2=\\"320\\" stroke=\\"#F5A623\\" stroke-width=\\"1.5\\" stroke-dasharray=\\"5,3\\" marker-end=\\"url(#ah)\\"/>\\n  <text x=\\"390\\" y=\\"170\\" font-size=\\"9\\" fill=\\"#F5A623\\" font-weight=\\"600\\">ISR replication</text>\\n\\n  <!-- Consumers -->\\n  <rect x=\\"580\\" y=\\"60\\" width=\\"110\\" height=\\"40\\" rx=\\"6\\" fill=\\"#fde0d0\\" stroke=\\"#E25A1C\\" filter=\\"url(#sh)\\"/>\\n  <text x=\\"635\\" y=\\"79\\" text-anchor=\\"middle\\" font-size=\\"9\\" font-weight=\\"700\\">Consumer Group A</text>\\n  <text x=\\"635\\" y=\\"93\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#888\\">analytics service</text>\\n\\n  <rect x=\\"580\\" y=\\"120\\" width=\\"110\\" height=\\"40\\" rx=\\"6\\" fill=\\"#fde0d0\\" stroke=\\"#E25A1C\\" filter=\\"url(#sh)\\"/>\\n  <text x=\\"635\\" y=\\"139\\" text-anchor=\\"middle\\" font-size=\\"9\\" font-weight=\\"700\\">Consumer Group B</text>\\n  <text x=\\"635\\" y=\\"153\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#888\\">notification svc</text>\\n\\n  <rect x=\\"580\\" y=\\"180\\" width=\\"110\\" height=\\"40\\" rx=\\"6\\" fill=\\"#fde0d0\\" stroke=\\"#E25A1C\\" filter=\\"url(#sh)\\"/>\\n  <text x=\\"635\\" y=\\"199\\" text-anchor=\\"middle\\" font-size=\\"9\\" font-weight=\\"700\\">Kafka Streams</text>\\n  <text x=\\"635\\" y=\\"213\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#888\\">real-time processing</text>\\n\\n  <rect x=\\"580\\" y=\\"240\\" width=\\"110\\" height=\\"40\\" rx=\\"6\\" fill=\\"#fde0d0\\" stroke=\\"#E25A1C\\" filter=\\"url(#sh)\\"/>\\n  <text x=\\"635\\" y=\\"259\\" text-anchor=\\"middle\\" font-size=\\"9\\" font-weight=\\"700\\">Kafka Connect</text>\\n  <text x=\\"635\\" y=\\"273\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#888\\">sink: S3 / ES / DB</text>\\n\\n  <!-- Arrows brokers to consumers -->\\n  <line x1=\\"360\\" y1=\\"105\\" x2=\\"580\\" y2=\\"80\\" stroke=\\"#555\\" stroke-width=\\"1.5\\" marker-end=\\"url(#ah)\\"/>\\n  <line x1=\\"360\\" y1=\\"115\\" x2=\\"580\\" y2=\\"140\\" stroke=\\"#555\\" stroke-width=\\"1.5\\" marker-end=\\"url(#ah)\\"/>\\n  <line x1=\\"360\\" y1=\\"220\\" x2=\\"580\\" y2=\\"200\\" stroke=\\"#555\\" stroke-width=\\"1.5\\" marker-end=\\"url(#ah)\\"/>\\n  <line x1=\\"360\\" y1=\\"240\\" x2=\\"580\\" y2=\\"260\\" stroke=\\"#555\\" stroke-width=\\"1.5\\" marker-end=\\"url(#ah)\\"/>\\n\\n  <!-- Schema Registry -->\\n  <rect x=\\"720\\" y=\\"60\\" width=\\"120\\" height=\\"50\\" rx=\\"6\\" fill=\\"#fff3cd\\" stroke=\\"#F5A623\\" filter=\\"url(#sh)\\"/>\\n  <text x=\\"780\\" y=\\"82\\" text-anchor=\\"middle\\" font-size=\\"10\\" font-weight=\\"700\\">Schema Registry</text>\\n  <text x=\\"780\\" y=\\"98\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#856404\\">Avro / Protobuf</text>\\n\\n  <rect x=\\"720\\" y=\\"130\\" width=\\"120\\" height=\\"50\\" rx=\\"6\\" fill=\\"#e8d0f5\\" stroke=\\"#9B59B6\\" filter=\\"url(#sh)\\"/>\\n  <text x=\\"780\\" y=\\"152\\" text-anchor=\\"middle\\" font-size=\\"10\\" font-weight=\\"700\\">REST Proxy</text>\\n  <text x=\\"780\\" y=\\"168\\" text-anchor=\\"middle\\" font-size=\\"8\\" fill=\\"#7d3f9b\\">HTTP → Kafka</text>\\n\\n  <!-- Legend -->\\n  <rect x=\\"430\\" y=\\"390\\" width=\\"400\\" height=\\"70\\" rx=\\"8\\" fill=\\"#fff\\" stroke=\\"#ddd\\"/>\\n  <text x=\\"445\\" y=\\"408\\" font-size=\\"10\\" font-weight=\\"700\\" fill=\\"#333\\">Legend:</text>\\n  <rect x=\\"445\\" y=\\"416\\" width=\\"12\\" height=\\"12\\" rx=\\"2\\" fill=\\"#5DB85B\\"/><text x=\\"462\\" y=\\"426\\" font-size=\\"9\\" fill=\\"#333\\">Producers</text>\\n  <rect x=\\"525\\" y=\\"416\\" width=\\"12\\" height=\\"12\\" rx=\\"2\\" fill=\\"#4A90D9\\"/><text x=\\"542\\" y=\\"426\\" font-size=\\"9\\" fill=\\"#333\\">Brokers</text>\\n  <rect x=\\"600\\" y=\\"416\\" width=\\"12\\" height=\\"12\\" rx=\\"2\\" fill=\\"#E25A1C\\"/><text x=\\"617\\" y=\\"426\\" font-size=\\"9\\" fill=\\"#333\\">Consumers</text>\\n  <rect x=\\"685\\" y=\\"416\\" width=\\"12\\" height=\\"12\\" rx=\\"2\\" fill=\\"#9B59B6\\"/><text x=\\"702\\" y=\\"426\\" font-size=\\"9\\" fill=\\"#333\\">KRaft / Control</text>\\n  <rect x=\\"445\\" y=\\"440\\" width=\\"12\\" height=\\"12\\" rx=\\"2\\" fill=\\"#F5A623\\"/><text x=\\"462\\" y=\\"450\\" font-size=\\"9\\" fill=\\"#333\\">ISR Replication</text>\\n  <text x=\\"540\\" y=\\"450\\" font-size=\\"9\\" fill=\\"#888\\" font-style=\\"italic\\">All components except brokers are optional in minimal setup</text>\\n</svg>", "type": "rawsvg"}]}, {"type": "ss", "title": "3.2 KRaft — Removing ZooKeeper", "blocks": [{"md": "Before Kafka 3.3, all cluster metadata (broker membership, partition assignments, topic configurations) was stored in **ZooKeeper** — a separate distributed coordination service. ZooKeeper was the biggest operational pain point in Kafka: you needed to deploy, monitor, backup, and version-match a separate system. ZooKeeper's write throughput was a hard ceiling on metadata operations, limiting clusters to ~200,000 partitions before degradation.", "type": "p"}, {"md": "**KRaft** (Kafka Raft) replaces ZooKeeper with an internal Raft consensus group of controller nodes. The metadata log (topics, partition assignments, ISR state) is stored in a special internal Kafka topic replicated across the controller quorum. This gives Kafka: **1M+ partition support** (tested at LinkedIn and Confluent), **sub-1-second controller failover**, **no ZooKeeper dependency**, and **simplified deployment** (one system to configure, monitor, and secure).", "type": "p"}, {"md": "KRaft has two deployment modes: **combined mode** (each node is both a broker and a controller — used for development and small clusters) and **isolated mode** (dedicated controller nodes separate from broker nodes — recommended for production). For production, run 3 dedicated controller nodes on separate racks to tolerate one failure. Controllers do not handle data traffic, so they can use smaller instances.", "type": "p"}, {"code": "# 1. Generate a cluster UUID (once per cluster lifecycle)\\nCLUSTER_ID=$(kafka-storage.sh random-uuid)\\necho \\"Cluster ID: $CLUSTER_ID\\"\\n\\n# 2. Format storage on EACH controller node\\n# controller.properties: process.roles=controller\\nkafka-storage.sh format \\\\\\n  -t \\"$CLUSTER_ID\\" \\\\\\n  -c /etc/kafka/controller.properties\\n\\n# 3. Format storage on EACH broker node\\n# broker.properties: process.roles=broker\\nkafka-storage.sh format \\\\\\n  -t \\"$CLUSTER_ID\\" \\\\\\n  -c /etc/kafka/broker.properties\\n\\n# 4. Start controllers first, then brokers\\nsystemctl start kafka-controller\\nsystemctl start kafka-broker\\n\\n# Essential KRaft properties (controller.properties):\\n# process.roles=controller\\n# node.id=1                              # unique per node (1, 2, 3 for controllers)\\n# controller.quorum.voters=1@ctrl1:9093,2@ctrl2:9093,3@ctrl3:9093\\n# listeners=CONTROLLER://:9093\\n# log.dirs=/var/kafka/controller-data", "desc": "Initialize a KRaft cluster (production — isolated mode)", "lang": "Bash", "type": "code"}]}, {"type": "ss", "title": "3.3 Controller Election and Metadata Quorum", "blocks": [{"md": "KRaft uses the Raft consensus algorithm to elect a leader among the controller nodes. Raft requires a quorum (majority) to make progress: with 3 controllers, 2 must agree for any metadata change to be committed. This tolerates 1 controller failure. With 5 controllers, 3 must agree, tolerating 2 failures. Three controllers is the standard production configuration — 5 is only needed for very high metadata-change workloads.", "type": "p"}, {"md": "The Raft leader (the **active controller**) processes all metadata writes: topic creation, partition assignment, ISR changes. Followers replicate the metadata log. On leader failure, remaining controllers elect a new leader in under 1 second via Raft vote. The new leader has a complete up-to-date copy of all metadata from the replicated log — no catchup required.", "type": "p"}, {"md": "Brokers maintain a persistent connection to the active controller and receive incremental metadata updates. Unlike ZooKeeper-based Kafka where brokers polled ZooKeeper for changes, KRaft controllers **push** metadata changes to brokers in real-time, making metadata propagation faster and reducing ZooKeeper-induced latency spikes.", "type": "p"}, {"md": "Kafka 3.5 removed ZooKeeper support entirely for new clusters. Existing ZooKeeper clusters can migrate using the `kafka-storage.sh` migration tool. The migration is live (no downtime) and takes ~10 minutes for a 100-broker cluster. After migration, ZooKeeper can be decommissioned. Do this migration — it eliminates the #1 operational headache of Kafka.", "type": "callout", "label": "KRaft vs ZooKeeper — Migration", "variant": "info"}]}, {"type": "ss", "title": "3.4 Replication — Leader, Followers, and ISR", "blocks": [{"md": "Every partition has one **leader replica** and zero or more **follower replicas** distributed across brokers. Producers always write to the leader. Followers **pull** from the leader — they initiate fetch requests on a configurable interval (`replica.fetch.max.bytes`, `replica.fetch.wait.max.ms`). Followers never accept writes directly.", "type": "p"}, {"md": "The **In-Sync Replica set (ISR)** is the set of replicas currently caught up to the leader — within `replica.lag.time.max.ms` (default 10 s) of the leader's log end offset. When a follower falls behind (network issue, disk slowness, GC pause), it is removed from the ISR. When it catches up again, it is re-added. The ISR list is maintained by the controller and tracked in the metadata log.", "type": "p"}, {"md": "The **High Watermark (HW)** is the highest offset replicated to all ISR members. Consumers can only read records below the HW — records above HW are \\"uncommitted\\" and may be lost if the leader crashes before they are replicated. The **Log End Offset (LEO)** is the next offset to be written. For a healthy partition, LEO = HW. Lag = LEO - HW indicates data that the leader has written but followers have not yet replicated.", "type": "p"}, {"svg": "<svg viewBox=\\"0 0 860 420\\" xmlns=\\"http://www.w3.org/2000/svg\\" font-family=\\"Segoe UI,sans-serif\\">\\n  <defs><marker id=\\"ah\\" markerWidth=\\"8\\" markerHeight=\\"6\\" refX=\\"8\\" refY=\\"3\\" orient=\\"auto\\"><polygon points=\\"0 0,8 3,0 6\\" fill=\\"#555\\"/></marker></defs>\\n  <rect width=\\"860\\" height=\\"420\\" rx=\\"12\\" fill=\\"#F8F9FA\\"/>\\n  <text x=\\"430\\" y=\\"28\\" text-anchor=\\"middle\\" font-size=\\"16\\" font-weight=\\"700\\" fill=\\"#0f0f23\\">Kafka Replication — Leader, ISR, High Watermark, and Log End Offset</text>\\n\\n  <!-- Leader -->\\n  <rect x=\\"60\\" y=\\"55\\" width=\\"200\\" height=\\"250\\" rx=\\"8\\" fill=\\"#4A90D9\\" stroke=\\"#3570a8\\" stroke-width=\\"2\\"/>\\n  <text x=\\"160\\" y=\\"80\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"13\\" font-weight=\\"700\\">Leader — Broker 1</text>\\n  <text x=\\"160\\" y=\\"98\\" text-anchor=\\"middle\\" fill=\\"#d0e4ff\\" font-size=\\"10\\">Partition 0, all writes land here</text>\\n\\n  <rect x=\\"80\\" y=\\"115\\" width=\\"160\\" height=\\"16\\" rx=\\"3\\" fill=\\"rgba(255,255,255,0.2)\\"/>\\n    <text x=\\"160\\" y=\\"126\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"9\\">offset 0  (LEO=7)</text><rect x=\\"80\\" y=\\"135\\" width=\\"160\\" height=\\"16\\" rx=\\"3\\" fill=\\"rgba(255,255,255,0.2)\\"/>\\n    <text x=\\"160\\" y=\\"146\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"9\\">offset 1  (LEO=7)</text><rect x=\\"80\\" y=\\"155\\" width=\\"160\\" height=\\"16\\" rx=\\"3\\" fill=\\"rgba(255,255,255,0.2)\\"/>\\n    <text x=\\"160\\" y=\\"166\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"9\\">offset 2  (LEO=7)</text><rect x=\\"80\\" y=\\"175\\" width=\\"160\\" height=\\"16\\" rx=\\"3\\" fill=\\"rgba(255,255,255,0.2)\\"/>\\n    <text x=\\"160\\" y=\\"186\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"9\\">offset 3  (LEO=7)</text><rect x=\\"80\\" y=\\"195\\" width=\\"160\\" height=\\"16\\" rx=\\"3\\" fill=\\"rgba(255,255,255,0.2)\\"/>\\n    <text x=\\"160\\" y=\\"206\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"9\\">offset 4  (LEO=7)</text><rect x=\\"80\\" y=\\"215\\" width=\\"160\\" height=\\"16\\" rx=\\"3\\" fill=\\"rgba(255,255,255,0.2)\\"/>\\n    <text x=\\"160\\" y=\\"226\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"9\\">offset 5  (LEO=7)</text><rect x=\\"80\\" y=\\"235\\" width=\\"160\\" height=\\"16\\" rx=\\"3\\" fill=\\"rgba(255,255,255,0.2)\\"/>\\n    <text x=\\"160\\" y=\\"246\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"9\\">offset 6  (LEO=7)</text><rect x=\\"80\\" y=\\"255\\" width=\\"160\\" height=\\"16\\" rx=\\"3\\" fill=\\"rgba(255,255,255,0.2)\\"/>\\n    <text x=\\"160\\" y=\\"266\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"9\\">offset 7  (LEO=7)</text>\\n\\n  <text x=\\"160\\" y=\\"290\\" text-anchor=\\"middle\\" fill=\\"#fff3cd\\" font-size=\\"10\\" font-weight=\\"700\\">LEO = 7  (Log End Offset)</text>\\n\\n  <!-- ISR Follower in sync -->\\n  <rect x=\\"330\\" y=\\"55\\" width=\\"200\\" height=\\"250\\" rx=\\"8\\" fill=\\"#5DB85B\\" stroke=\\"#4a9a49\\" stroke-width=\\"2\\"/>\\n  <text x=\\"430\\" y=\\"80\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"12\\" font-weight=\\"700\\">Broker 2 — ISR ✓</text>\\n  <text x=\\"430\\" y=\\"97\\" text-anchor=\\"middle\\" fill=\\"#d4f5d4\\" font-size=\\"10\\">replica lag = 0 offsets</text>\\n\\n  <rect x=\\"350\\" y=\\"115\\" width=\\"160\\" height=\\"16\\" rx=\\"3\\" fill=\\"rgba(255,255,255,0.2)\\"/>\\n    <text x=\\"430\\" y=\\"126\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"9\\">offset 0</text><rect x=\\"350\\" y=\\"135\\" width=\\"160\\" height=\\"16\\" rx=\\"3\\" fill=\\"rgba(255,255,255,0.2)\\"/>\\n    <text x=\\"430\\" y=\\"146\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"9\\">offset 1</text><rect x=\\"350\\" y=\\"155\\" width=\\"160\\" height=\\"16\\" rx=\\"3\\" fill=\\"rgba(255,255,255,0.2)\\"/>\\n    <text x=\\"430\\" y=\\"166\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"9\\">offset 2</text><rect x=\\"350\\" y=\\"175\\" width=\\"160\\" height=\\"16\\" rx=\\"3\\" fill=\\"rgba(255,255,255,0.2)\\"/>\\n    <text x=\\"430\\" y=\\"186\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"9\\">offset 3</text><rect x=\\"350\\" y=\\"195\\" width=\\"160\\" height=\\"16\\" rx=\\"3\\" fill=\\"rgba(255,255,255,0.2)\\"/>\\n    <text x=\\"430\\" y=\\"206\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"9\\">offset 4</text><rect x=\\"350\\" y=\\"215\\" width=\\"160\\" height=\\"16\\" rx=\\"3\\" fill=\\"rgba(255,255,255,0.2)\\"/>\\n    <text x=\\"430\\" y=\\"226\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"9\\">offset 5</text><rect x=\\"350\\" y=\\"235\\" width=\\"160\\" height=\\"16\\" rx=\\"3\\" fill=\\"rgba(255,255,255,0.2)\\"/>\\n    <text x=\\"430\\" y=\\"246\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"9\\">offset 6</text>\\n  <text x=\\"430\\" y=\\"290\\" text-anchor=\\"middle\\" fill=\\"#fff3cd\\" font-size=\\"10\\" font-weight=\\"700\\">LEO = 6</text>\\n\\n  <!-- Lagging Follower NOT in ISR -->\\n  <rect x=\\"600\\" y=\\"55\\" width=\\"200\\" height=\\"250\\" rx=\\"8\\" fill=\\"#E74C3C\\" stroke=\\"#c0392b\\" stroke-width=\\"2\\"/>\\n  <text x=\\"700\\" y=\\"80\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"12\\" font-weight=\\"700\\">Broker 3 — NOT ISR ✗</text>\\n  <text x=\\"700\\" y=\\"97\\" text-anchor=\\"middle\\" fill=\\"#fde0d0\\" font-size=\\"10\\">replica.lag.time.max.ms exceeded</text>\\n\\n  <rect x=\\"620\\" y=\\"115\\" width=\\"160\\" height=\\"16\\" rx=\\"3\\" fill=\\"rgba(255,255,255,0.2)\\"/>\\n    <text x=\\"700\\" y=\\"126\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"9\\">offset 0</text><rect x=\\"620\\" y=\\"135\\" width=\\"160\\" height=\\"16\\" rx=\\"3\\" fill=\\"rgba(255,255,255,0.2)\\"/>\\n    <text x=\\"700\\" y=\\"146\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"9\\">offset 1</text><rect x=\\"620\\" y=\\"155\\" width=\\"160\\" height=\\"16\\" rx=\\"3\\" fill=\\"rgba(255,255,255,0.2)\\"/>\\n    <text x=\\"700\\" y=\\"166\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"9\\">offset 2</text><rect x=\\"620\\" y=\\"175\\" width=\\"160\\" height=\\"16\\" rx=\\"3\\" fill=\\"rgba(255,255,255,0.2)\\"/>\\n    <text x=\\"700\\" y=\\"186\\" text-anchor=\\"middle\\" fill=\\"#fff\\" font-size=\\"9\\">offset 3</text>\\n  <text x=\\"700\\" y=\\"290\\" text-anchor=\\"middle\\" fill=\\"#fff3cd\\" font-size=\\"10\\" font-weight=\\"700\\">LEO = 3  (lagging by 4)</text>\\n\\n  <!-- Arrows: leader → followers -->\\n  <line x1=\\"260\\" y1=\\"165\\" x2=\\"330\\" y2=\\"165\\" stroke=\\"#F5A623\\" stroke-width=\\"2\\" marker-end=\\"url(#ah)\\"/>\\n  <text x=\\"295\\" y=\\"158\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#F5A623\\" font-weight=\\"600\\">fetch</text>\\n  <line x1=\\"260\\" y1=\\"200\\" x2=\\"600\\" y2=\\"200\\" stroke=\\"#E74C3C\\" stroke-width=\\"1.5\\" stroke-dasharray=\\"5,3\\" marker-end=\\"url(#ah)\\"/>\\n  <text x=\\"430\\" y=\\"215\\" text-anchor=\\"middle\\" font-size=\\"9\\" fill=\\"#E74C3C\\">slow / lagging</text>\\n\\n  <!-- HW line across leader and ISR follower -->\\n  <line x1=\\"60\\" y1=\\"310\\" x2=\\"530\\" y2=\\"310\\" stroke=\\"#9B59B6\\" stroke-width=\\"2\\" stroke-dasharray=\\"6,3\\"/>\\n  <text x=\\"295\\" y=\\"327\\" text-anchor=\\"middle\\" font-size=\\"10\\" fill=\\"#9B59B6\\" font-weight=\\"700\\">High Watermark (HW) = 6  — consumers can only read up to here</text>\\n\\n  <!-- Key box -->\\n  <rect x=\\"60\\" y=\\"345\\" width=\\"740\\" height=\\"55\\" rx=\\"8\\" fill=\\"#fff\\" stroke=\\"#ddd\\"/>\\n  <text x=\\"80\\" y=\\"365\\" font-size=\\"10\\" font-weight=\\"700\\" fill=\\"#333\\">Key rules:</text>\\n  <text x=\\"80\\" y=\\"383\\" font-size=\\"9\\" fill=\\"#555\\">  HW = min(LEO of all ISR members)  •  Consumers only see records below HW  •  acks=all waits for all ISR to confirm  •  Out-of-ISR brokers excluded from quorum</text>\\n</svg>", "type": "rawsvg"}]}, {"type": "ss", "title": "3.5 Cluster Health Monitoring — Critical Metrics", "blocks": [{"md": "A healthy Kafka cluster has three invariants: (1) exactly one active controller, (2) zero under-replicated partitions, (3) zero offline partitions. Any violation of these invariants requires immediate investigation. Monitoring these three metrics should be the foundation of your Kafka alerting.", "type": "p"}, {"rows": [["ActiveControllerCount", "kafka.controller:type=KafkaController,name=ActiveControllerCount", "1", "≠ 1", "CRITICAL"], ["UnderReplicatedPartitions", "kafka.controller:type=KafkaController,name=UnderReplicatedPartitions", "0", "> 0", "CRITICAL"], ["OfflinePartitionsCount", "kafka.controller:type=KafkaController,name=OfflinePartitionsCount", "0", "> 0", "CRITICAL"], ["UnderMinIsrPartitionCount", "kafka.server:type=ReplicaManager,name=UnderMinIsrPartitionCount", "0", "> 0", "CRITICAL"], ["RequestHandlerAvgIdlePercent", "kafka.server:type=KafkaRequestHandlerPool,name=RequestHandlerAvgIdlePercent", "> 30%", "< 10%", "WARNING"], ["BytesInPerSec", "kafka.server:type=BrokerTopicMetrics,name=BytesInPerSec", "varies", "> 80% NIC", "WARNING"], ["ProduceRequestsPerSec", "kafka.server:type=BrokerTopicMetrics,name=ProduceRequestsPerSec", "varies", "monitor trend", "INFO"]], "type": "table", "headers": ["JMX Metric", "MBean path", "Healthy value", "Alert threshold", "Severity"]}, {"type": "callout", "items": ["Every broker is equal for data; the controller role manages metadata only — do not confuse partition leader with cluster controller", "KRaft replaces ZooKeeper: sub-1s failover, 1M+ partition support, single system to operate — migrate all existing clusters", "ISR tracks which replicas are within `replica.lag.time.max.ms` (10 s) of the leader LEO", "Consumers only read up to the High Watermark — records above HW may be lost on leader crash", "`UnderReplicatedPartitions > 0` is your most critical production alert — act immediately"], "label": "Key Takeaways — Section 3", "variant": "note"}]}]}]	2026-04-29 13:55:14.92418+00	2026-04-29 13:55:14.92418+00
edc84820-c17c-4ae6-95d7-31d961955830	kafka	1	Producers & Consumer Groups	[{"type": "ph", "label": "Part 2", "title": "Producers & Consumer Groups", "subtitle": "RecordAccumulator, batching, idempotence, transactions, consumer group protocol, offset management, and rebalancing"}, {"type": "section", "title": "4 — Producer Internals", "blocks": [{"type": "ss", "title": "4.1 Producer Architecture", "blocks": [{"md": "The Kafka producer client is a sophisticated piece of software with five internal stages: **Serializer** (converts key/value objects to bytes), **Partitioner** (selects the target partition), **RecordAccumulator** (batches records by target partition), **NetworkClient** (manages TCP connections and in-flight requests), and **Sender thread** (drains the accumulator and writes batches to brokers).", "type": "p"}, {"md": "The critical insight is that the **Sender thread runs independently** from the thread calling `producer.send()`. Calling `send()` does not immediately write to the network — it places the record in the RecordAccumulator buffer and returns immediately. The Sender thread picks up batches from the accumulator and flushes them to brokers based on `batch.size` and `linger.ms`. This design allows the application thread to continue producing records while I/O happens asynchronously.", "type": "p"}, {"md": "The **RecordAccumulator** is a `ConcurrentHashMap<TopicPartition, Deque<ProducerBatch>>`. For each target partition, it maintains a deque of batches. The current (active) batch accumulates records until it is full (`batch.size` bytes) or the linger timer fires (`linger.ms`). At that point the batch is \\"drained\\" to the Sender thread for transmission.", "type": "p"}]}, {"type": "ss", "title": "4.2 Batching — The Primary Throughput Lever", "blocks": [{"md": "Batching is the single most impactful performance optimization in the Kafka producer. Without batching (`linger.ms=0`, `batch.size=1`), every record is its own TCP packet — at 100K msg/s this is 100K syscalls per second, which overwhelms the OS socket layer. With batching (`linger.ms=10`, `batch.size=131072`), 100K records in 10ms are compressed into a single 128 KB TCP payload — one syscall, one network round-trip, dramatically higher throughput.", "type": "p"}, {"md": "The trade-off: `linger.ms=0` gives minimum latency (record is sent immediately). `linger.ms=20` adds at most 20ms of latency but increases throughput 5–10×. For analytics pipelines, 20ms of producer-side latency is imperceptible. For payment processing where end-to-end latency is measured in milliseconds, `linger.ms=0` may be required.", "type": "p"}, {"rows": [["batch.size", "16384 (16 KB)", "131072 (128 KB)", "4096", "Max bytes per batch per partition"], ["linger.ms", "0", "10–20", "0", "Wait time before flushing batch"], ["buffer.memory", "33554432 (32 MB)", "134217728 (128 MB)", "33554432", "Total accumulator memory"], ["compression.type", "none", "lz4", "none", "2–3× size reduction with lz4"], ["acks", "1", "all", "1", "Durability guarantee"]], "type": "table", "headers": ["Config", "Default", "High Throughput", "Low Latency", "Notes"]}]}, {"type": "ss", "title": "4.3 Idempotent Producers and Exactly-Once", "blocks": [{"md": "Without idempotence: producer sends batch → broker writes it → broker crashes before ACK → producer retries → **duplicate record**. The broker has no way to know whether this is a new record or a retry of a previously written one.", "type": "p"}, {"md": "With `enable.idempotence=true`, the broker assigns each producer a **Producer ID (PID)** and tracks a **sequence number** per (PID, partition) pair. Each batch is stamped with its sequence number. If the broker receives a batch with a sequence number it has already seen for this (PID, partition), it silently discards it. Idempotence adds ~5% latency overhead and is free from a correctness standpoint.", "type": "p"}, {"code": "Properties p = new Properties();\\np.put(\\"bootstrap.servers\\", \\"kafka-1:9092,kafka-2:9092,kafka-3:9092\\");\\np.put(\\"key.serializer\\",   \\"org.apache.kafka.common.serialization.StringSerializer\\");\\np.put(\\"value.serializer\\", \\"org.apache.kafka.common.serialization.StringSerializer\\");\\n\\n// Required for exactly-once semantics\\np.put(\\"enable.idempotence\\", \\"true\\");      // broker deduplicates retries\\np.put(\\"acks\\",               \\"all\\");       // wait for full ISR\\np.put(\\"retries\\",            Integer.MAX_VALUE); // retry forever\\np.put(\\"max.in.flight.requests.per.connection\\", \\"5\\"); // must be ≤ 5\\n\\n// For transactions (atomic multi-partition writes)\\np.put(\\"transactional.id\\", \\"payment-svc-\\" + instanceId); // unique per process\\n\\nKafkaProducer<String, String> producer = new KafkaProducer<>(p);\\nproducer.initTransactions(); // register with broker\\n\\ntry {\\n  producer.beginTransaction();\\n  producer.send(new ProducerRecord<>(\\"payments\\", orderId, paymentJson));\\n  producer.send(new ProducerRecord<>(\\"audit-log\\", orderId, auditJson));\\n  producer.commitTransaction(); // both or neither\\n} catch (KafkaException e) {\\n  producer.abortTransaction();  // roll back\\n}", "desc": "Minimal exactly-once producer configuration", "lang": "Java", "type": "code"}, {"type": "callout", "items": ["Producer batching (`batch.size=131072` + `linger.ms=5`) gives 5–10× throughput improvement with ≤5ms latency cost", "Always use `enable.idempotence=true` in production — it has no meaningful performance cost and prevents duplicate records on retry", "Transactions group writes across multiple partitions/topics atomically — use for consume-transform-produce pipelines", "Set `compression.type=lz4` on both producer and topic to avoid the broker re-compression penalty"], "label": "Key Takeaways — Section 4", "variant": "note"}]}]}, {"type": "divider"}, {"type": "section", "title": "5 — Consumer Groups & Offsets", "blocks": [{"type": "ss", "title": "5.1 Consumer Group Protocol", "blocks": [{"md": "A **consumer group** is a set of consumer instances that collectively read all partitions of a subscribed topic set. Kafka guarantees each partition is consumed by exactly one instance within a group. This is the fundamental parallelism primitive: to process a 24-partition topic with maximum parallelism, run 24 consumer instances in the same group.", "type": "p"}, {"md": "The **Group Coordinator** is a broker that manages group membership for a specific group (determined by `hash(groupId) % __consumer_offsets_partitions`). It tracks which consumers are alive via heartbeats, orchestrates rebalances, and persists committed offsets. Consumer instances send heartbeats on `heartbeat.interval.ms` (default 3s). If no heartbeat arrives within `session.timeout.ms` (default 45s), the coordinator removes the member and triggers a rebalance.", "type": "p"}]}, {"type": "ss", "title": "5.2 Rebalancing — Eager vs Cooperative Sticky", "blocks": [{"md": "A **rebalance** is triggered when: a consumer joins the group, a consumer leaves (graceful shutdown or heartbeat timeout), a consumer's `max.poll.interval.ms` is exceeded (processing took too long), or partitions are added to a subscribed topic. During a rebalance, partition assignments are redistributed across group members.", "type": "p"}, {"md": "The **eager rebalance** protocol (default before Kafka 2.4) stops all consumers, revokes all partition assignments, waits for all members to rejoin, then assigns fresh partitions. During this window (2–30 seconds typically), zero records are consumed. This is a full stop-the-world pause that scales poorly with consumer count.", "type": "p"}, {"md": "The **CooperativeStickyAssignor** (default from Kafka 3.1) implements incremental rebalance: only partitions that need to move are revoked. Consumers that keep their partitions continue processing during the rebalance. The incremental protocol completes in two rounds and typically causes under 200ms of additional latency on moving partitions, with zero interruption to stable ones.", "type": "p"}, {"code": "props.put(\\"partition.assignment.strategy\\",\\n  \\"org.apache.kafka.clients.consumer.CooperativeStickyAssignor\\");\\n\\n// Heartbeat must be < session.timeout / 3\\nprops.put(\\"session.timeout.ms\\",    \\"45000\\"); // kick consumer if silent for 45s\\nprops.put(\\"heartbeat.interval.ms\\", \\"3000\\");  // heartbeat every 3s\\nprops.put(\\"max.poll.interval.ms\\",  \\"300000\\"); // 5 min to process one batch\\nprops.put(\\"max.poll.records\\",      \\"500\\");    // records per poll()", "desc": "Configure CooperativeStickyAssignor (recommended for all production consumers)", "lang": "Java", "type": "code"}]}, {"type": "ss", "title": "5.3 Offset Management — Auto vs Manual", "blocks": [{"md": "**Auto-commit** (`enable.auto.commit=true`, `auto.commit.interval.ms=5000`) commits the latest polled offset every 5 seconds. Risk: consumer polls records, auto-commit fires, consumer crashes before processing completes → records are silently lost (at-most-once). This is acceptable for non-critical workloads but wrong for any financial or order-processing system.", "type": "p"}, {"md": "**Manual commit** gives precise control. `commitSync()` blocks until the broker ACKs the offset commit — guaranteed at-least-once delivery. `commitAsync()` fires and forgets — lower latency but no guarantee of commit. For at-least-once delivery with manual commit, process all records in a batch then call `commitSync()`. If the process crashes between processing and committing, records are re-delivered (idempotent consumers required to handle this safely).", "type": "p"}, {"type": "callout", "items": ["Use `CooperativeStickyAssignor` always — it eliminates stop-the-world rebalances", "Use `enable.auto.commit=false` + `commitSync()` after processing for reliable at-least-once delivery", "Consumer count cannot exceed partition count — extra consumers in the group sit idle as hot standbys", "Monitor consumer lag per-partition, not total lag — one hot partition can hide behind low average"], "label": "Key Takeaways — Section 5", "variant": "note"}]}]}]	2026-04-29 13:55:14.92418+00	2026-04-29 13:55:14.92418+00
fc430f00-fd78-4267-ac1f-9e15165727ab	kafka	2	Brokers, Topics & Replication	[{"type": "ph", "label": "Part 3", "title": "Brokers, Topics & Replication", "subtitle": "ISR deep dive, acks semantics, unclean election, exactly-once transactions"}, {"type": "section", "title": "6 — Replication Deep Dive", "blocks": [{"type": "ss", "title": "6.1 acks Configuration — Durability vs Latency", "blocks": [{"md": "`acks=0`: producer fires and forgets. No wait for any broker ACK. Lowest latency, guaranteed data loss on any broker issue. Only acceptable for metrics/telemetry where loss is tolerable.", "type": "p"}, {"md": "`acks=1`: wait for the leader to write to its local log. Default since Kafka 0.8. **Dangerous** — if the leader crashes between writing and replication, the record is lost even though the producer received an ACK.", "type": "p"}, {"md": "`acks=all` (or `-1`): wait for all ISR replicas to write the record. The leader ACKs only after `min.insync.replicas` ISR members confirm. With `replication.factor=3` and `min.insync.replicas=2`: the cluster tolerates one broker failure while still accepting writes. The `NotEnoughReplicasException` is thrown if ISR drops below min.insync.replicas — this is the right behavior: reject writes rather than risk data loss.", "type": "p"}, {"rows": [["0", "None (fire and forget)", "~0 ms", "IoT telemetry, metrics where loss is acceptable"], ["1", "Leader only", "~1 ms", "Never use in production — silent data loss on leader crash"], ["all", "All ISR replicas", "3–10 ms", "All production workloads: financial, orders, CDC, analytics"]], "type": "table", "headers": ["acks", "Durability", "Latency overhead", "Use case"]}]}, {"type": "ss", "title": "6.2 Unclean Leader Election", "blocks": [{"md": "When a leader crashes and **all ISR replicas are unavailable** (a rare but real scenario during cascading failures), Kafka must choose: elect an out-of-ISR replica as leader (possible data loss), or wait for an ISR replica to come back (downtime).", "type": "p"}, {"md": "`unclean.leader.election.enable=true` (default `false` since 0.11): elect the most up-to-date out-of-ISR follower. Partition stays available but committed records may be lost. Appropriate for: click events, app logs, any topic where data loss is acceptable.", "type": "p"}, {"md": "`unclean.leader.election.enable=false`: wait indefinitely for an ISR replica. Partition is offline (reads and writes blocked) until an ISR member recovers. Appropriate for: payment events, order records, any business-critical data.", "type": "p"}, {"md": "A payments team set `unclean.leader.election.enable=true` on their payments topic to minimize downtime. During a datacenter rack failure, an out-of-ISR replica was elected leader — it was 2 minutes behind the crashed leader. Those 2 minutes of payment records were replayed from the stale leader, causing double charges for thousands of users. **Set `unclean.leader.election.enable=false` on all business-critical topics. Always.**", "type": "callout", "label": "Production Incident: Double Charges", "variant": "pitfall"}]}, {"type": "callout", "items": ["Use `acks=all` + `min.insync.replicas=2` + `replication.factor=3` as your production baseline — this is non-negotiable", "`NotEnoughReplicasException` is the right behavior — it means the cluster chose safety over availability", "Never enable unclean leader election for financial, order, or inventory data", "ISR recovery after a failure: the rejoining follower fetches from the leader until it catches up, then is added back to ISR"], "label": "Key Takeaways — Section 6", "variant": "note"}]}, {"type": "divider"}, {"type": "section", "title": "7 — Delivery Semantics & Transactions", "blocks": [{"type": "ss", "title": "7.1 Exactly-Once End-to-End", "blocks": [{"md": "Full exactly-once semantics requires coordination across three components: (1) **idempotent producer** — broker deduplicates retries by (PID, partition, sequence); (2) **transactional writes** — atomic commit/abort across multiple partitions; (3) **`read_committed` consumer** — only reads records from committed transactions.", "type": "p"}, {"code": "// Consumer: read_committed isolation prevents reading aborted transactions\\nconsumerProps.put(\\"isolation.level\\", \\"read_committed\\");\\nKafkaConsumer<String, String> consumer = new KafkaConsumer<>(consumerProps);\\n\\n// Producer: idempotent + transactional\\nproducerProps.put(\\"enable.idempotence\\", \\"true\\");\\nproducerProps.put(\\"transactional.id\\",   \\"etl-\\" + partitionId);\\nKafkaProducer<String, String> producer = new KafkaProducer<>(producerProps);\\nproducer.initTransactions();\\n\\nwhile (true) {\\n  ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));\\n  producer.beginTransaction();\\n  try {\\n    for (var r : records) {\\n      String transformed = transform(r.value());\\n      producer.send(new ProducerRecord<>(\\"output\\", r.key(), transformed));\\n    }\\n    // This atomically commits the output records AND the input offsets\\n    // Either both are committed, or neither — true exactly-once\\n    producer.sendOffsetsToTransaction(getOffsets(records), consumer.groupMetadata());\\n    producer.commitTransaction();\\n  } catch (KafkaException e) {\\n    producer.abortTransaction();\\n  }\\n}", "desc": "Exactly-once consume-transform-produce pipeline", "lang": "Java", "type": "code"}]}, {"type": "callout", "items": ["Exactly-once requires all three: idempotent producer + transactions + `read_committed` consumer", "`sendOffsetsToTransaction` is the key call — it atomically ties the input offset commit to the output write", "Exactly-once adds ~3× latency overhead — use at-least-once with idempotent consumers for most workloads", "Kafka Streams implements exactly-once internally: set `processing.guarantee=exactly_once_v2`"], "label": "Key Takeaways — Section 7", "variant": "note"}]}]	2026-04-29 13:55:14.92418+00	2026-04-29 13:55:14.92418+00
c08f5dcf-9acf-4729-83ff-9491bf420805	kafka	3	Kafka Streams	[{"type": "ph", "label": "Part 4", "title": "Kafka Streams", "subtitle": "Stream processing as a library — topologies, state stores, windows, joins, and interactive queries"}, {"type": "section", "title": "8 — Streams Architecture", "blocks": [{"type": "ss", "title": "8.1 Topology, Processors, State Stores", "blocks": [{"md": "A Kafka Streams application is a **processor topology** — a DAG of source nodes (read from Kafka topics), processor nodes (transform/aggregate/join), and sink nodes (write to Kafka topics). Unlike Flink or Spark Streaming, Kafka Streams is a **library**, not a cluster. There is no separate runtime to deploy. Scale by running more JVM instances of your application — each instance gets a subset of input partitions.", "type": "p"}, {"md": "**Stateful** processors maintain local state in **RocksDB** instances embedded in the application. State stores are backed by Kafka **changelog topics** — on restart or failure, the state store is rebuilt by replaying the changelog. Interactive queries allow you to expose state store data via REST without a separate database.", "type": "p"}, {"code": "StreamsBuilder builder = new StreamsBuilder();\\nKStream<String, Order> orders = builder.stream(\\"orders\\");\\n\\n// Aggregate: running revenue per category, stored in RocksDB\\nKTable<String, Double> revenue = orders\\n  .selectKey((k, v) -> v.getCategory())\\n  .groupByKey()\\n  .aggregate(\\n    () -> 0.0,\\n    (category, order, total) -> total + order.getTotal(),\\n    Materialized.<String, Double, KeyValueStore<Bytes, byte[]>>\\n      as(\\"revenue-store\\").withValueSerde(Serdes.Double())\\n  );\\n\\n// Interactive query — REST endpoint reads from RocksDB directly (sub-ms)\\nReadOnlyKeyValueStore<String, Double> store = streams.store(\\n  StoreQueryParameters.fromNameAndType(\\"revenue-store\\",\\n    QueryableStoreTypes.keyValueStore()));\\ndouble electronicsSales = store.get(\\"electronics\\"); // no Kafka round-trip", "desc": "Kafka Streams — revenue aggregation per product category", "lang": "Java", "type": "code"}, {"type": "callout", "items": ["Kafka Streams is a library — no separate cluster, scale by running more instances", "State lives in local RocksDB backed by changelog topics — fully fault-tolerant", "Interactive queries expose state store data via REST — eliminates a separate caching tier"], "label": "Key Takeaways — Section 8", "variant": "note"}]}]}, {"type": "divider"}, {"type": "section", "title": "9 — Windows & Joins", "blocks": [{"type": "ss", "title": "9.1 Window Types", "blocks": [{"rows": [["Tumbling", "No", "Window size", "1-min non-overlapping", "Per-minute billing, hourly metrics"], ["Hopping", "Yes", "Advance < size", "Size=5min, advance=1min", "Rolling 5-min averages"], ["Session", "No", "Inactivity gap", "Close after 30min idle", "User sessions, click-stream"], ["Sliding", "Yes", "Every record", "Last 5 min always", "Fraud detection, real-time anomaly"]], "type": "table", "headers": ["Window", "Overlap?", "Advances by", "Example", "Use case"]}]}, {"type": "ss", "title": "9.2 Stream-Stream and Stream-Table Joins", "blocks": [{"md": "**Stream-Stream join** (`KStream.join(KStream, ...)`) requires a time window: records from both streams within the window are joined. Records outside the window are dropped. Use for matching events from two topics that belong together within a time boundary (e.g., match a payment event to its originating order within 5 minutes).", "type": "p"}, {"md": "**Stream-Table join** (`KStream.join(KTable, ...)`) looks up the current value in the KTable for each stream record's key. No window needed — uses the latest KTable value at join time. Use for enrichment: for each click event, look up the current user profile. The KTable is updated by a separate Kafka topic (e.g., user-profiles).", "type": "p"}, {"type": "callout", "items": ["Tumbling windows for billing/metrics; Hopping for rolling averages; Session for user journeys", "Stream-stream joins need a time window; stream-table joins use current state (no window)", "Use `.withGrace(Duration)` to accept late records; after grace period they are silently dropped"], "label": "Key Takeaways — Section 9", "variant": "note"}]}]}]	2026-04-29 13:55:14.92418+00	2026-04-29 13:55:14.92418+00
67bc6e38-b15d-4868-a603-f139568a7a1f	kafka	4	Schema Registry & Kafka Connect	[{"type": "ph", "label": "Part 5", "title": "Schema Registry & Kafka Connect", "subtitle": "Schema evolution with Avro/Protobuf, compatibility modes, Connect architecture, Debezium CDC, and DLQs"}, {"type": "section", "title": "10 — Schema Registry", "blocks": [{"type": "ss", "title": "10.1 Why Schema Management Matters", "blocks": [{"md": "Without schema enforcement, a producer can add a new required field and break every consumer that deserializes the message. At 100 services, schema-less Kafka becomes a \\"schema by convention\\" system — and conventions break when teams don't communicate. Schema Registry enforces compatibility at write time: a producer attempting to register a schema that breaks backward compatibility receives a `409 Conflict` error before the first message is ever written.", "type": "p"}]}, {"type": "ss", "title": "10.2 Avro, Protobuf, JSON Schema — When to Use Each", "blocks": [{"rows": [["Avro", "Binary", ".avsc (JSON)", "Excellent (default values)", "Kafka native — smallest overhead per message"], ["Protobuf", "Binary", ".proto", "Excellent (field numbers)", "gRPC services, multi-language teams"], ["JSON Schema", "Text/JSON", ".json", "Good (additive changes)", "REST APIs bridged to Kafka, easy debugging"]], "type": "table", "headers": ["Format", "Encoding", "Schema language", "Evolution", "Best for"]}, {"type": "callout", "items": ["Always use BACKWARD compatibility (default) — deploy consumers before producers on schema changes", "Avro with Schema Registry adds only 5 bytes overhead per message (magic byte + schema ID)", "Schema Registry HA: run 3 instances pointing to the same Kafka cluster; schemas stored in `_schemas` topic"], "label": "Key Takeaways — Section 10", "variant": "note"}]}]}, {"type": "divider"}, {"type": "section", "title": "11 — Kafka Connect", "blocks": [{"type": "ss", "title": "11.1 Debezium CDC — Change Data Capture", "blocks": [{"md": "Debezium tails the database transaction log (PostgreSQL WAL, MySQL binlog, MongoDB oplog) and emits one Kafka event per INSERT, UPDATE, and DELETE — in order, with full before and after state. Zero application code changes required. This is the cleanest approach to CDC: the database is unchanged, the data pipeline is driven by the immutable transaction log, and Kafka consumers get every change event in real-time.", "type": "p"}, {"code": "POST /connectors\\n{\\n  \\"name\\": \\"pg-orders-cdc\\",\\n  \\"config\\": {\\n    \\"connector.class\\":      \\"io.debezium.connector.postgresql.PostgresConnector\\",\\n    \\"database.hostname\\":    \\"postgres.internal\\",\\n    \\"database.dbname\\":      \\"orderdb\\",\\n    \\"database.user\\":        \\"debezium\\",\\n    \\"database.password\\":    \\"secret\\",\\n    \\"table.include.list\\":   \\"public.orders,public.line_items\\",\\n    \\"plugin.name\\":          \\"pgoutput\\",\\n    \\"topic.prefix\\":         \\"cdc\\",\\n    \\"slot.name\\":            \\"debezium_slot\\",\\n    \\"transforms\\":           \\"unwrap\\",\\n    \\"transforms.unwrap.type\\": \\"io.debezium.transforms.ExtractNewRecordState\\",\\n    \\"errors.tolerance\\":     \\"all\\",\\n    \\"errors.deadletterqueue.topic.name\\": \\"dlq.cdc-orders\\"\\n  }\\n}", "desc": "Deploy Debezium PostgreSQL CDC connector via REST API", "lang": "JSON", "type": "code"}, {"type": "callout", "items": ["Always configure a DLQ (`errors.deadletterqueue.topic.name`) — silent drops are unacceptable in production", "Scale Connect workers horizontally — tasks auto-distribute across the worker cluster", "Debezium slot accumulates WAL until the connector catches up — monitor `pg_replication_slots` disk usage"], "label": "Key Takeaways — Section 11", "variant": "note"}]}]}]	2026-04-29 13:55:14.92418+00	2026-04-29 13:55:14.92418+00
563e6865-ddfb-4711-89f6-31e897d8af72	kafka	5	Production Operations & Tuning	[{"type": "ph", "label": "Part 6", "title": "Production Operations & Tuning", "subtitle": "JVM and OS tuning, throughput optimization, Prometheus monitoring, rolling restarts, and the operations runbook"}, {"type": "section", "title": "12 — Performance Tuning", "blocks": [{"type": "ss", "title": "12.1 Producer Throughput Tuning", "blocks": [{"rows": [["batch.size", "16384", "131072", "Larger batches per network flush"], ["linger.ms", "0", "10–20", "Wait to fill the batch"], ["compression.type", "none", "lz4", "2–3× less data on the wire"], ["buffer.memory", "33554432", "134217728", "More buffer = less back-pressure"], ["acks", "1", "all", "Durability (never skip in production)"]], "type": "table", "headers": ["Config", "Default", "High Throughput", "Why"]}]}, {"type": "ss", "title": "12.2 Broker OS and JVM Tuning", "blocks": [{"code": "# Allow OS to use more dirty pages before flushing to disk\\nsysctl -w vm.dirty_background_ratio=5\\nsysctl -w vm.dirty_ratio=60\\n\\n# NEVER let Kafka swap — 30s+ GC pauses result from swapping\\nsysctl -w vm.swappiness=1\\n\\n# Increase file descriptor limits (3 FDs per partition)\\necho \\"kafka soft nofile 100000\\" >> /etc/security/limits.conf\\necho \\"kafka hard nofile 100000\\" >> /etc/security/limits.conf", "desc": "Critical OS kernel settings for Kafka brokers (sysctl)", "lang": "Bash", "type": "code"}, {"code": "# Fixed heap — 6 GB on a 32 GB host; remaining 26 GB → OS page cache\\nexport KAFKA_HEAP_OPTS=\\"-Xms6g -Xmx6g\\"\\n\\nexport KAFKA_JVM_PERFORMANCE_OPTS=\\"\\n  -server\\n  -XX:+UseG1GC\\n  -XX:MaxGCPauseMillis=20\\n  -XX:InitiatingHeapOccupancyPercent=35\\n  -XX:+ExplicitGCInvokesConcurrent\\"", "desc": "JVM flags for Kafka broker (kafka-server-start.sh)", "lang": "Bash", "type": "code"}, {"type": "callout", "items": ["Keep broker heap at 6 GB max — OS page cache is Kafka's primary performance mechanism", "Producer tuning impact order: compression > batch.size/linger.ms > buffer.memory > acks", "Set `vm.swappiness=1` — Kafka pause during swap can exceed session.timeout.ms and trigger consumer rebalances"], "label": "Key Takeaways — Section 12", "variant": "note"}]}]}, {"type": "divider"}, {"type": "section", "title": "13 — Monitoring & Observability", "blocks": [{"type": "ss", "title": "13.1 Key JMX Metrics and Alerting", "blocks": [{"rows": [["ActiveControllerCount", "1", "≠ 1", "CRITICAL"], ["UnderReplicatedPartitions", "0", "> 0", "CRITICAL"], ["UnderMinIsrPartitionCount", "0", "> 0", "CRITICAL"], ["OfflinePartitionsCount", "0", "> 0", "CRITICAL"], ["RequestHandlerAvgIdlePercent", "> 30%", "< 10%", "WARNING"], ["consumer_group_lag (external)", "< threshold", "growing for 5 min", "WARNING/CRITICAL"]], "type": "table", "headers": ["Metric", "Healthy", "Alert if", "Severity"]}, {"code": "groups:\\n  - name: kafka\\n    rules:\\n      - alert: KafkaUnderReplicatedPartitions\\n        expr: kafka_controller_kafkacontroller_underreplicatedpartitions > 0\\n        for: 1m\\n        labels: { severity: critical }\\n        annotations:\\n          summary: \\"{{ $labels.instance }} has under-replicated partitions\\"\\n\\n      - alert: KafkaConsumerLagGrowing\\n        expr: rate(kafka_consumer_group_lag[10m]) > 1000\\n        for: 10m\\n        labels: { severity: warning }\\n        annotations:\\n          summary: \\"Consumer {{ $labels.group }} lag growing at {{ $value }}/min\\"", "desc": "Prometheus alerting rules — consumer lag and under-replicated partitions", "lang": "YAML", "type": "code"}, {"type": "callout", "items": ["The two critical alerts: `UnderReplicatedPartitions > 0` and `ActiveControllerCount ≠ 1`", "Use burrow or kafka-consumer-groups.sh --describe to get per-partition lag, not just total lag"], "label": "Key Takeaways — Section 13", "variant": "note"}]}]}, {"type": "divider"}, {"type": "section", "title": "14 — Operations Runbook", "blocks": [{"type": "ss", "title": "14.1 Rolling Restart with Zero Downtime", "blocks": [{"code": "# Step 1: Check cluster health — zero under-replicated partitions\\nkafka-topics.sh --bootstrap-server kafka:9092 --describe \\\\\\n  | grep -c \\"under-replicated\\"\\n# Must return 0\\n\\n# Step 2: Graceful shutdown (triggers preferred leader election)\\nsystemctl stop kafka\\n\\n# Step 3: Make change (upgrade JAR, config update, disk expansion)\\n\\n# Step 4: Restart broker\\nsystemctl start kafka\\n\\n# Step 5: Wait for FULL ISR recovery before touching the next broker\\nwatch -n 5 'kafka-topics.sh --bootstrap-server kafka:9092 \\\\\\n  --describe | grep -c \\"under-replicated\\"'\\n# Proceed only when this returns 0", "desc": "Safe rolling restart — one broker at a time", "lang": "Bash", "type": "code"}]}, {"type": "ss", "title": "14.2 Common Production Failures", "blocks": [{"rows": [["Consumer rebalance loop", "Consumers join/leave every 30 s", "Processing exceeds max.poll.interval.ms", "Reduce max.poll.records or profile slow processing"], ["Disk full on broker", "Producer writes rejected", "Retention not configured; compaction stalled", "Reduce retention; check log.cleaner threads"], ["NotEnoughReplicasException", "Producer write errors", "ISR < min.insync.replicas", "Restore failed brokers; temporarily lower min.insync.replicas"], ["Network partition", "UnderReplicatedPartitions > 0", "Network issue between broker racks", "Fix network; never enable unclean leader election"]], "type": "table", "headers": ["Failure", "Symptom", "Root cause", "Fix"]}, {"type": "callout", "items": ["Rolling restarts: wait for full ISR recovery between each broker — never rush this", "Always use `--throttle 52428800` (50 MB/s) during partition reassignment — unthrottled has crashed production clusters", "Consumer rebalance loops are almost always slow processing — profile before tuning timeouts", "Disk full is always avoidable with proper retention configuration and monitoring"], "label": "Key Takeaways — Sections 12–14", "variant": "note"}]}]}]	2026-04-29 13:55:14.92418+00	2026-04-29 13:55:14.92418+00
\.


--
-- Data for Name: notes_metadata; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notes_metadata (id, slug, category, title, is_premium, created_at) FROM stdin;
795993c8-c5ef-48cf-8299-f6c54bdcc1d6	kafka	data-engineer	Apache Kafka	f	2026-04-29 13:55:14.92418+00
bf0f9605-f122-47f0-893b-16ffa3d0dcbb	spark	data-engineer	Apache Spark	f	2026-04-29 13:55:14.92418+00
e276af07-6b3e-4e66-b53c-35ad350589d1	flink	data-engineer	Apache Flink	f	2026-04-29 13:55:14.92418+00
0105dd00-f1a6-4586-8438-f8ce5afcef54	druid	data-engineer	Apache Druid	f	2026-04-29 13:55:14.92418+00
067c8ae6-16aa-4321-a8fa-7c5fe182d385	gcp	data-engineer	GCP Data & AI	f	2026-04-29 13:55:14.92418+00
ea4696a0-fae6-4fa3-83d4-372c6c5e3f92	data-modeling	data-engineer	Data Modeling	f	2026-04-29 13:55:14.92418+00
c165be41-b0a1-4a32-888e-8281c05b61c0	sql	data-engineer	SQL Deep Dive	f	2026-04-29 13:55:14.92418+00
f123ab1c-abeb-4fa9-851a-94ee1b102afd	machine-learning	data-science	Machine Learning	f	2026-04-29 13:55:14.92418+00
1e3393ea-8953-4573-8f14-7738c0b48335	langchain	ai	LangChain	f	2026-04-29 13:55:14.92418+00
13093123-be02-4165-8f35-a366434b305e	kubernetes	devops	Kubernetes	f	2026-04-29 13:55:14.92418+00
b30d1b0f-1015-4f71-a8c6-b98261e6b032	react	frontend	React.js	f	2026-04-29 13:55:14.92418+00
ced9e668-56b6-4812-85da-56e2a1638ac5	javascript	frontend	JavaScript	f	2026-04-29 13:55:14.92418+00
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, user_id, course_id, razorpay_order_id, razorpay_payment_id, amount, currency, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: premium_subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.premium_subscriptions (id, user_id, plan, started_at, expires_at, payment_id, is_active, created_at) FROM stdin;
3c717c0b-0a5c-4edf-9aa0-3468541ef46e	cbfac715-ecb0-4170-97eb-efd9d2c45b42	yearly	2026-04-29 09:10:48.208512+00	2027-04-29 09:10:48.208512+00	\N	t	2026-04-29 09:10:48.208512+00
605e10f8-e20e-42a7-883d-4ef1419e9408	cbfac715-ecb0-4170-97eb-efd9d2c45b42	yearly	2026-04-29 13:55:14.92418+00	2027-04-29 13:55:14.92418+00	\N	t	2026-04-29 13:55:14.92418+00
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (id, user_id, token_hash, expires_at, created_at) FROM stdin;
31b6735b-fe07-4acf-a686-545e3bf35914	adaff441-ba67-42ed-a012-5a37380e37ee	$2a$10$9BIayEpQAoOyrIgwobl2t.E0LwCGgZ19J8iiRdEPS5cHA3ZevZkBy	2026-05-06 12:23:07.18+00	2026-04-29 12:23:07.182492+00
\.


--
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sections (id, course_id, title, order_index, created_at) FROM stdin;
e45c8c19-8ae2-4c61-9b9e-5c5197ca526e	291272e2-9ac0-4f12-bb46-34d3cc8f9103	Section 1 — Apache Kafka Mastery	0	2026-04-29 09:10:48.208512+00
e95561e0-84d9-49e7-bbdb-3b09d720b37c	291272e2-9ac0-4f12-bb46-34d3cc8f9103	Section 2 — Apache Kafka Mastery	1	2026-04-29 09:10:48.208512+00
b35039e7-82c8-46b3-a38c-2e3cbe812262	1ade7c1d-eb2c-4792-be21-cb596769b092	Section 1 — System Design Fundamentals	0	2026-04-29 09:10:48.208512+00
79e0bb3f-72d6-434c-ab39-a815825ccade	1ade7c1d-eb2c-4792-be21-cb596769b092	Section 2 — System Design Fundamentals	1	2026-04-29 09:10:48.208512+00
91724cd5-2a40-441f-ac4c-e636558e9dda	291272e2-9ac0-4f12-bb46-34d3cc8f9103	Section 1 — Apache Kafka Mastery	0	2026-04-29 13:55:14.92418+00
133fb69e-9ef1-4671-8c8f-32ca62d86f0c	291272e2-9ac0-4f12-bb46-34d3cc8f9103	Section 2 — Apache Kafka Mastery	1	2026-04-29 13:55:14.92418+00
88b50b98-1038-4272-8d01-34b5bc17929f	1ade7c1d-eb2c-4792-be21-cb596769b092	Section 1 — System Design Fundamentals	0	2026-04-29 13:55:14.92418+00
107e49b2-48ca-4289-ae00-02d425792809	1ade7c1d-eb2c-4792-be21-cb596769b092	Section 2 — System Design Fundamentals	1	2026-04-29 13:55:14.92418+00
\.


--
-- Data for Name: user_note_bookmarks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_note_bookmarks (id, user_id, note_slug, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password_hash, google_id, avatar_url, role, is_active, created_at, updated_at) FROM stdin;
adaff441-ba67-42ed-a012-5a37380e37ee	Admin User	admin@test.local	$2a$10$DeJwn3M2pinsNNPSbCzIee4tAAmn4tis058gZpF.CNj4dBwwgUSD.	dev_google_admin	\N	admin	t	2026-04-29 09:10:48.208512+00	2026-04-29 13:55:14.92418+00
cbfac715-ecb0-4170-97eb-efd9d2c45b42	Premium User	premium@test.local	$2a$10$oV5njuh7vqJR1iDa07OzQONU1u3R8UqLJSujjUsmqYAxwsm8T.yoW	dev_google_premium	\N	premium	t	2026-04-29 09:10:48.208512+00	2026-04-29 13:55:14.92418+00
bf02d9ab-cac0-412f-a61c-296f2b7e308e	Free User	user@test.local	$2a$10$WKmqVcvgid1LHz52L69vxerZaBOzSs66Dcji//pQaOuhtxHq9oiAC	dev_google_user	\N	user	t	2026-04-29 09:10:48.208512+00	2026-04-29 13:55:14.92418+00
afe2726e-07bf-4e53-9000-f98c6d7ead81	Dev Admin	dev.admin@test.local	\N	dev_google_admin_alias	\N	admin	t	2026-04-29 09:10:48.208512+00	2026-04-29 13:55:14.92418+00
b68bb1dc-c57b-4f87-919c-6fb163c9d8d0	Dev Premium	dev.premium@test.local	\N	dev_google_premium_alias	\N	premium	t	2026-04-29 09:10:48.208512+00	2026-04-29 13:55:14.92418+00
0b81cc21-7956-431e-b073-7bbb2444431e	Dev User	dev.user@test.local	\N	dev_google_user_alias	\N	user	t	2026-04-29 09:10:48.208512+00	2026-04-29 13:55:14.92418+00
\.


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: courses courses_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_slug_key UNIQUE (slug);


--
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- Name: enrollments enrollments_user_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_user_id_course_id_key UNIQUE (user_id, course_id);


--
-- Name: interview_questions interview_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interview_questions
    ADD CONSTRAINT interview_questions_pkey PRIMARY KEY (id);


--
-- Name: interview_questions interview_questions_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interview_questions
    ADD CONSTRAINT interview_questions_slug_key UNIQUE (slug);


--
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- Name: note_parts note_parts_note_slug_part_index_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.note_parts
    ADD CONSTRAINT note_parts_note_slug_part_index_key UNIQUE (note_slug, part_index);


--
-- Name: note_parts note_parts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.note_parts
    ADD CONSTRAINT note_parts_pkey PRIMARY KEY (id);


--
-- Name: notes_metadata notes_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes_metadata
    ADD CONSTRAINT notes_metadata_pkey PRIMARY KEY (id);


--
-- Name: notes_metadata notes_metadata_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes_metadata
    ADD CONSTRAINT notes_metadata_slug_key UNIQUE (slug);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: payments payments_razorpay_order_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_razorpay_order_id_key UNIQUE (razorpay_order_id);


--
-- Name: premium_subscriptions premium_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.premium_subscriptions
    ADD CONSTRAINT premium_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_hash_key UNIQUE (token_hash);


--
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- Name: user_note_bookmarks user_note_bookmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_note_bookmarks
    ADD CONSTRAINT user_note_bookmarks_pkey PRIMARY KEY (id);


--
-- Name: user_note_bookmarks user_note_bookmarks_user_id_note_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_note_bookmarks
    ADD CONSTRAINT user_note_bookmarks_user_id_note_slug_key UNIQUE (user_id, note_slug);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_google_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_google_id_key UNIQUE (google_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_audit_admin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_admin ON public.audit_logs USING btree (admin_id);


--
-- Name: idx_audit_target; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_target ON public.audit_logs USING btree (target_user_id);


--
-- Name: idx_bookmark_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookmark_user ON public.user_note_bookmarks USING btree (user_id);


--
-- Name: idx_enroll_course; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_enroll_course ON public.enrollments USING btree (course_id);


--
-- Name: idx_enroll_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_enroll_user ON public.enrollments USING btree (user_id);


--
-- Name: idx_iq_topic; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_iq_topic ON public.interview_questions USING btree (topic_id);


--
-- Name: idx_lessons_section; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lessons_section ON public.lessons USING btree (section_id);


--
-- Name: idx_note_parts_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_note_parts_slug ON public.note_parts USING btree (note_slug);


--
-- Name: idx_payments_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_user ON public.payments USING btree (user_id);


--
-- Name: idx_rt_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rt_user ON public.refresh_tokens USING btree (user_id);


--
-- Name: idx_sections_course; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sections_course ON public.sections USING btree (course_id);


--
-- Name: idx_sub_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sub_user ON public.premium_subscriptions USING btree (user_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_google; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_google ON public.users USING btree (google_id);


--
-- Name: courses courses_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: interview_questions iq_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER iq_updated_at BEFORE UPDATE ON public.interview_questions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: note_parts note_parts_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER note_parts_updated_at BEFORE UPDATE ON public.note_parts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: payments payments_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: users users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: audit_logs audit_logs_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.users(id);


--
-- Name: audit_logs audit_logs_target_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES public.users(id);


--
-- Name: enrollments enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: enrollments enrollments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: lessons lessons_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.sections(id) ON DELETE CASCADE;


--
-- Name: payments payments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: payments payments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: premium_subscriptions premium_subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.premium_subscriptions
    ADD CONSTRAINT premium_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: sections sections_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: user_note_bookmarks user_note_bookmarks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_note_bookmarks
    ADD CONSTRAINT user_note_bookmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict QNVDOGKet2aohUUkagNCyivjcLvnesTQlW9ibFdKz4WZKhETTvVCIPzplq5pi8n

